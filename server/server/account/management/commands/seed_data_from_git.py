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
import pprint
from .helpers import find_matches

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
    # We also want to cross all assets across wallets, and all assets within a wallet
    # for transfer vs sell/buy.
    current_holding = None
    current_delta = None
    for holding in holdings:
        new_delta = abs((holding.quantity - input["quantity"]) / holding.quantity)
        if current_delta is None or new_delta < current_delta:
            current_delta = new_delta
            current_holding = holding
    return current_holding


def add_asset_diff(diff, wallet, symbol, type, quantity):
    if wallet not in diff:
        diff[wallet] = {}
    if symbol not in diff[wallet]:
        diff[wallet][symbol] = {}
    if type not in diff[wallet][symbol]:
        diff[wallet][symbol][type] = []
    diff[wallet][symbol][type].append(quantity)


def upload_portfolio_data(data, date, dry=False):
    parsed_toml = toml.loads(data)
    inputs = parsed_toml["holding"]

    input_wallets = {}
    current_wallets = {}

    diff_wallets = {}

    for input in inputs:
        name = normalize_provider(input["wallet"]).lower()
        symbol = normalize_symbol(input["symbol"]).lower()
        quantity = input["quantity"]
        if name not in input_wallets:
            input_wallets[name] = {}
        if symbol not in input_wallets[name]:
            input_wallets[name][symbol] = []
        input_wallets[name][symbol].append(quantity)

    # pprint.pprint(input_wallets)

    user = User.objects.get(username="zbraniecki")
    assert user

    wallets = Wallet.objects.filter(owner=user)

    for wallet in wallets:
        name = wallet.service.provider.name.lower()
        current_wallets[name] = {}

        holdings = wallet.holdings.all()
        for holding in holdings:
            symbol = holding.asset.symbol.lower()
            if symbol not in current_wallets[name]:
                current_wallets[name][symbol] = []
            current_wallets[name][symbol].append(holding.quantity)

    # pprint.pprint(current_wallets)

    for provider in input_wallets:
        if provider not in current_wallets:
            wallet = input_wallets[provider]
            for symbol in wallet:
                for quantity in wallet[symbol]:
                    add_asset_diff(diff_wallets, provider, symbol, "add", quantity)
        else:
            for symbol in input_wallets[provider]:
                input_values = input_wallets[provider][symbol]
                current_values = (
                    current_wallets[provider][symbol]
                    if symbol in current_wallets[provider]
                    else []
                )
                matches = find_matches(current_values, input_values)
                for match in matches:
                    if match[0] is not None and match[1] is not None:
                        if current_values[match[0]] == input_values[match[1]]:
                            continue
                        add_asset_diff(
                            diff_wallets,
                            provider,
                            symbol,
                            "change",
                            [current_values[match[0]], input_values[match[1]]],
                        )
                    elif match[1] is not None:
                        add_asset_diff(
                            diff_wallets,
                            provider,
                            symbol,
                            "add",
                            input_values[match[1]],
                        )
                    elif match[0] is not None:
                        add_asset_diff(
                            diff_wallets,
                            provider,
                            symbol,
                            "delete",
                            current_values[match[0]],
                        )

    for provider in current_wallets:
        if provider not in input_wallets:
            wallet = current_wallets[provider]
            for symbol in wallet:
                for quantity in wallet[symbol]:
                    add_asset_diff(diff_wallets, provider, symbol, "delete", quantity)
        else:
            for symbol in current_wallets[provider]:
                if symbol not in input_wallets[provider]:
                    for quantity in current_wallets[provider][symbol]:
                        add_asset_diff(
                            diff_wallets, provider, symbol, "delete", quantity
                        )

    pprint.pprint(diff_wallets)

    for provider in diff_wallets:
        service = Service.objects.filter(
            name="Wallet", provider__name__iexact=provider
        ).first()
        assert service

        wallet = Wallet.objects.filter(owner=user, service=service).first()
        if not wallet:
            wallet = Wallet(
                owner=user,
                service=service,
            )
            if not dry:
                wallet.save()

        for symbol in diff_wallets[provider]:
            asset = Asset.objects.filter(symbol__iexact=symbol).first()
            assert asset

            if "add" in diff_wallets[provider][symbol]:
                for quantity in diff_wallets[provider][symbol]["add"]:
                    holding = Holding(asset=asset, wallet=wallet, quantity=quantity)
                    if not dry:
                        holding.save()
            if "change" in diff_wallets[provider][symbol]:
                changes = diff_wallets[provider][symbol]["change"]
                for change in changes:
                    holding = Holding.objects.get(
                        asset=asset, wallet=wallet, quantity=change[0]
                    )
                    holding.quantity = change[1]
                    if not dry:
                        holding.save()

            if "delete" in diff_wallets[provider][symbol]:
                for quantity in diff_wallets[provider][symbol]["delete"]:
                    holding = Holding.objects.get(
                        asset=asset, wallet=wallet, quantity=quantity
                    )
                    if not dry:
                        holding.delete()


class Command(BaseCommand):
    help = "Seed data from git"

    def add_arguments(self, parser):
        parser.add_argument("-d", "--dry", action="store_true", help="Dry run")
        parser.add_argument("path", type=str, help="Path to clone of a git repo")

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        dry = kwargs["dry"]
        repo = Repo(path)
        commits = list(repo.iter_commits("master"))
        commits.reverse()
        i = 0
        for commit in commits:
            i += 1
            if i < 61:
                continue
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            date = datetime.date.fromtimestamp(commit.committed_date)
            print(f"{i}: {id} - {msg} - {date}")

            # file_path = "oracle/wallets.toml"
            # file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            # upload_wallet_data(file_contents, date, dry)

            file_path = "account/portfolio.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_portfolio_data(file_contents, date, dry)
            if i >= 61:
                break
