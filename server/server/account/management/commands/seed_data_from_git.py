from django.contrib.auth.models import User
from server.oracle.models import (
    Provider,
    Service,
    Asset,
    Passive,
    PassiveType,
    PassiveChange,
    PassiveChangeType,
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
from decimal import *
from .helpers import find_matches

getcontext().prec = 2

SYMBOL_MAP = {"eth2": "eth"}

PROVIDER_MAP = {
    "coinbasepro": "Coinbase Pro",
    "celo": "Valora",
    "binance.us": "Binance US",
    "avawallet": "AVA Wallet",
    "icp/nns": "ICP Nervous Network System",
    "myalgo": "My Algo",
    "oasis_wallet": "Oasis Wallet",
    "pool-x": "Pool X",
    "myicon": "MyICON Wallet",
}


def normalize_symbol(input):
    if input in SYMBOL_MAP:
        return SYMBOL_MAP[input]
    else:
        return input


def normalize_provider(input):
    if input.lower() in PROVIDER_MAP:
        return PROVIDER_MAP[input.lower()]
    else:
        return input


def opt2val(opt):
    return Decimal(0 if opt is None else opt)


def val2opt(val):
    return None if val == 0 else Decimal(val)


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


def get_service(name, url=None, dry=False):
    name = normalize_provider(name)
    provider = Provider.objects.filter(name__iexact=name).first()
    if not provider:
        print(f"Adding Provider: {name}")
        if not dry:
            provider = Provider(name=name, url=url)
            provider.save()
    service = Service.objects.filter(provider=provider, name__iexact="Wallet").first()
    if not service:
        print(f"Adding Service: {name} Wallet")
        if not dry:
            service = Service(provider=provider, name="Wallet")
            service.save()
    return service


def populate_service_apy(service, data, dt, dry=False):
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

        passives = Passive.objects.filter(
            service=service,
            asset=asset,
        )

        if len(passives) == 0:
            print(f"Adding new passive for service {service} - {asset.symbol}")
            if not dry:
                passive = Passive(
                    service=service,
                    asset=asset,
                    type=type,
                    apy_min=apy_min,
                    apy_max=apy_max,
                )
                passive.save()
                change = PassiveChange(
                    passive=passive, date=dt.date(), type=PassiveChangeType.ADDED
                )
                change.save()
        elif len(passives) == 1:
            passive = passives.first()
            if passive.apy_min != apy_min or passive.apy_max != apy_max:
                apy_min_change = opt2val(apy_min) - opt2val(passive.apy_min)
                apy_max_change = opt2val(apy_max) - opt2val(passive.apy_max)
                passive.apy_min = apy_min
                passive.apy_max = apy_max
                print(
                    f"Changing passive for service {service} - {asset.symbol} by {apy_min_change}-{apy_max_change}"
                )
                if not dry:
                    passive.save()
                change = PassiveChange(
                    passive=passive,
                    date=dt.date(),
                    type=PassiveChangeType.CHANGED,
                    apy_min_change=val2opt(apy_min_change),
                    apy_max_change=val2opt(apy_max_change),
                )
                if not dry:
                    change.save()
        else:
            pass


def upload_wallet_data(data, dt, dry=False):
    parsed_toml = toml.loads(data)
    wallets = parsed_toml["wallet"]
    for wallet in wallets:
        # if wallet["name"] != "Yoroi":
        #     continue
        service = get_service(wallet["name"], wallet["url"], dry)
        assert service
        populate_service_assets(service, wallet, dry)
        populate_service_apy(service, wallet, dt, dry)


def match_holding(holdings, input):
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


def upload_portfolio_data(data, dt, dry=False):
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
        service = get_service(provider, None, dry)
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
                    transaction = Transaction(
                        wallet=wallet,
                        asset=asset,
                        quantity=quantity,
                        type=TransactionType.DEPOSIT,
                        timestamp=dt,
                    )
                    if not dry:
                        transaction.save()
            if "change" in diff_wallets[provider][symbol]:
                changes = diff_wallets[provider][symbol]["change"]
                for change in changes:
                    holding = Holding.objects.get(
                        asset=asset, wallet=wallet, quantity=change[0]
                    )
                    delta = Decimal(change[1]) - Decimal(change[0])
                    holding.quantity = change[1]
                    if not dry:
                        holding.save()

                    assert delta != 0
                    transaction = Transaction(
                        wallet=wallet,
                        asset=asset,
                        quantity=abs(delta),
                        type=TransactionType.DEPOSIT
                        if delta > 0
                        else TransactionType.WITHDRAW,
                        timestamp=dt,
                    )
                    if not dry:
                        transaction.save()

            if "delete" in diff_wallets[provider][symbol]:
                for quantity in diff_wallets[provider][symbol]["delete"]:
                    holding = Holding.objects.get(
                        asset=asset, wallet=wallet, quantity=quantity
                    )
                    if not dry:
                        holding.delete()

                    transaction = Transaction(
                        wallet=wallet,
                        asset=asset,
                        quantity=quantity,
                        type=TransactionType.WITHDRAW,
                        timestamp=dt,
                    )
                    if not dry:
                        transaction.save()


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
            # if i < 5:
            #     continue
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            dt = datetime.datetime.fromtimestamp(commit.committed_date)
            print(f"{i}: {id} - {msg} - {dt}")

            # file_path = "oracle/wallets.toml"
            # file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            # upload_wallet_data(file_contents, dt, dry)

            file_path = "account/portfolio.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_portfolio_data(file_contents, dt, dry)
            # if i >= 5:
            #     break
