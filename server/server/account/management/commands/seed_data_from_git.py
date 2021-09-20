from django.contrib.auth.models import User
from server.oracle.models import (
    Provider,
    Service,
    Asset,
    Passive,
    PassiveType,
    PassiveChange,
    PassiveValue,
)

from server.account.models import (
    User,
    Wallet,
    Holding,
    Transaction,
    TransactionType,
)
from django.core.management.base import BaseCommand
from django.db.models import Q
from git import Repo
import datetime
import toml

SYMBOL_MAP = {"eth2": "eth"}

PROVIDER_MAP = {"coinbasepro": "Coinbase Pro", "celo": "Valora"}


def normalize_symbol(input):
    if input in SYMBOL_MAP:
        return SYMBOL_MAP[input]
    else:
        return input


def normalize_provider(input):
    if input in PROVIDER_MAP:
        return PROVIDER_MAP[input]
    else:
        return input


def populate_service_assets(service, data, dry=False):
    registered_assets = Asset.objects.filter(service__in=[service])
    registered_symbols = [asset.symbol for asset in registered_assets]

    symbols = [normalize_symbol(asset["symbol"]) for asset in data["currency"]]
    for symbol in symbols:
        if symbol not in registered_symbols:
            asset = Asset.objects.filter(symbol__iexact=symbol).first()
            assert asset
            print(f"Adding asset {asset.symbol} to {service.name}")
            if not dry:
                service.assets.add(asset)


def populate_service_apy(service, data, date, dry=False):
    registered_assets = Asset.objects.filter(service__in=[service])
    registered_symbols = [asset.symbol for asset in registered_assets]

    inputs = [asset for asset in data["currency"]]
    for input in inputs:
        symbol = normalize_symbol(input["symbol"])
        asset = Asset.objects.filter(symbol__iexact=symbol).first()
        assert asset

        if isinstance(input["apy"], list):
            apy_min = input["apy"][0]
            apy_max = input["apy"][1]
        else:
            apy_min = input["apy"]
            apy_max = None

        if "yield_type" in input and input["yield_type"] == "staking":
            type = PassiveType.STAKING
        elif "yield_type" in input and input["yield_type"] == "lp":
            type = PassiveType.LP
        else:
            type = PassiveType.INTEREST

        passive = Passive.objects.filter(
            service=service,
            asset=asset,
        ).first()

        if passive:
            if passive.type != type:
                if not dry:
                    passive.type = type
                    passive.save()
        else:
            print(f"Adding new passive for service {service} - {asset.symbol}")
            if not dry:
                passive = Passive(service=service, asset=asset, type=type)
                passive.save()

        previous_passive = (
            PassiveChange.objects.filter(passive=passive, date__lte=date)
            .order_by("-date")
            .first()
        )
        if previous_passive:
            if previous_passive.date == date or (
                previous_passive.value.apy_min == apy_min
                and previous_passive.value.apy_max == apy_max
            ):
                continue
        print(
            f"Adding new passive change for {passive} at {date} for {apy_min}-{apy_max}"
        )

        if not dry:
            passive.values.clear()

            passive_value = PassiveValue(
                passive=passive,
                apy_min=apy_min,
                apy_max=apy_max,
            )
            passive_value.save()

            passive_change = PassiveChange(
                passive=passive, date=date, value=passive_value
            )
            passive_change.save()


def upload_wallet_data(data, date, dry=False):
    parsed_toml = toml.loads(data)
    wallets = parsed_toml["wallet"]
    for wallet in wallets:
        # if wallet["name"] != "Yoroi":
        #     continue
        provider = Provider.objects.filter(name__iexact=wallet["name"]).first()
        if not provider:
            print(f"Adding Provider: {wallet['name']}")
            if not dry:
                provider = Provider(name=wallet["name"], url=wallet["url"])
                provider.save()
            print(f"Adding Service: {wallet['name']} Wallet")
            if not dry:
                service = Service(provider=provider, name="Wallet")
                service.save()
        else:
            if wallet["url"] and not provider.url:
                if not dry:
                    provider.url = wallet["url"]
                    provider.save()
            service = Service.objects.filter(
                provider=provider, name__icontains="Wallet"
            ).first()
            if not service:
                print(f"Adding Service: {wallet['name']} Wallet")
                if not dry:
                    service = Service(
                        provider=provider, name="Wallet", url=wallet["url"]
                    )
                    service.save()
            else:
                if wallet["url"] and not service.url:
                    if not dry:
                        service.url = wallet["url"]
                        service.save()
            populate_service_assets(service, wallet, dry)
            populate_service_apy(service, wallet, date, dry)


def match_holding(holdings, input):
    # XXX: We should get all holdings in a given wallet of a given asset
    # and all inputs and match them and then only take the leftovers
    # as remove / add
    current_holding = None
    current_delta = None
    for holding in holdings:
        new_delta = abs((holding.quantity - input["quantity"]) / holding.quantity)
        if current_delta is None or new_delta < current_delta:
            current_delta = new_delta
            current_holding = holding
    return current_holding


def upload_portfolio_data(data, date, dry=False):
    parsed_toml = toml.loads(data)
    inputs = parsed_toml["holding"]

    potential_moves = {}

    for input in inputs:
        symbol = normalize_symbol(input["symbol"])
        # if symbol != "eth":
        #     continue
        provider = normalize_provider(input["wallet"])
        quantity = input["quantity"]
        asset = Asset.objects.filter(symbol__iexact=symbol).first()
        assert asset
        service = Service.objects.filter(
            name="Wallet", provider__name__iexact=provider
        ).first()
        assert service
        user = User.objects.get(username="zbraniecki")
        assert user
        wallet = Wallet.objects.filter(
            owner=user,
            service=service,
        ).first()
        if not wallet:
            print(f"Adding a wallet for user {user} in {service}")
            if not dry:
                wallet = Wallet(
                    owner=user,
                    service=service,
                )
                wallet.save()
        holdings = Holding.objects.filter(asset=asset, wallet=wallet)
        holding = match_holding(holdings, input)
        if not holding:
            print(f"Adding holding of {asset} to {wallet}")
            if not dry:
                holding = Holding(
                    asset=asset,
                    quantity=quantity,
                    wallet=wallet,
                )
                holding.save()
                transaction = Transaction(
                    wallet=wallet,
                    asset=asset,
                    quantity=quantity,
                    type=TransactionType.DEPOSIT,
                    timestamp=date,
                )
                transaction.save()
        else:
            if holding.quantity == quantity:
                continue
            print(
                f"Quantity of {asset} in {wallet} changed from {holding.quantity} to {quantity}"
            )
            if asset.symbol not in potential_moves:
                potential_moves[asset.symbol] = []
            potential_moves[asset.symbol].append(
                {
                    "provider": service.provider.name,
                    "delta": quantity - holding.quantity,
                    "holding": holding,
                    "wallet": wallet,
                    "asset": asset,
                }
            )
    for symbol in potential_moves:
        moves = potential_moves[symbol]
        for move in moves:
            # print(move)
            if not dry:
                # print(move)
                move["holding"].quantity += move["delta"]
                move["holding"].save()

                if move["delta"] < 0:
                    type = TransactionType.SELL
                else:
                    type = TransactionType.BUY
                transaction = Transaction(
                    wallet=move["wallet"],
                    asset=move["asset"],
                    quantity=abs(move["delta"]),
                    type=type,
                    timestamp=date,
                )
                transaction.save()


class Command(BaseCommand):
    help = "Seed data from git"

    def add_arguments(self, parser):
        parser.add_argument("path", type=str, help="Path to clone of a git repo")

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        repo = Repo(path)
        commits = list(repo.iter_commits("master"))
        commits.reverse()
        i = 0
        for commit in commits:
            i += 1
            if i < 2:
                continue
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            date = datetime.date.fromtimestamp(commit.committed_date)
            print(f"{i}: {id} - {msg} - {date}")

            # file_path = "oracle/wallets.toml"
            # file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            # upload_wallet_data(file_contents, date, True)

            file_path = "account/portfolio.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_portfolio_data(file_contents, date, True)
            if i >= 5:
                break
