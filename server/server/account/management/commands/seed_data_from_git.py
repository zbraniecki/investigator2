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
from django.core.management.base import BaseCommand
from django.db.models import Q
from git import Repo
import datetime
import toml

SYMBOL_MAP = {"eth2": "eth"}


def normalize_symbol(input):
    if input in SYMBOL_MAP:
        return SYMBOL_MAP[input]
    else:
        return input


def populate_service_assets(service, data):
    registered_assets = Asset.objects.filter(service__in=[service])
    registered_symbols = [asset.symbol for asset in registered_assets]

    symbols = [normalize_symbol(asset["symbol"]) for asset in data["currency"]]
    for symbol in symbols:
        if symbol not in registered_symbols:
            asset = Asset.objects.filter(symbol__iexact=symbol).first()
            assert asset
            service.assets.add(asset)


def populate_service_apy(service, data, date):
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
                passive.type = type
                passive.save()
        else:
            passive = Passive(service=service, asset=asset, type=type)
            passive.save()

        previous_passive = (
            PassiveChange.objects.filter(passive=passive, date__lte=date)
            .order_by("-date")
            .first()
        )
        if previous_passive:
            if (
                previous_passive.value.apy_min == apy_min
                and previous_passive.value.apy_max == apy_max
            ):
                continue
        print(
            f"Adding new passive change for {passive} at {date} for {apy_min}-{apy_max}"
        )

        passive.values.clear()

        passive_value = PassiveValue(
            passive=passive,
            apy_min=apy_min,
            apy_max=apy_max,
        )
        passive_value.save()

        passive_change = PassiveChange(passive=passive, date=date, value=passive_value)
        passive_change.save()


def upload_wallet_data(data, date):
    parsed_toml = toml.loads(data)
    wallets = parsed_toml["wallet"]
    for wallet in wallets:
        provider = Provider.objects.filter(name__iexact=wallet["name"]).first()
        if not provider:
            print(f"Adding Provider: {wallet['name']}")
            provider = Provider(name=wallet["name"], url=wallet["url"])
            provider.save()
            print(f"Adding Service: {wallet['name']} Wallet")
            service = Service(provider=provider, name="Wallet")
            service.save()
        else:
            if wallet["url"] and not provider.url:
                provider.url = wallet["url"]
                provider.save()
            service = Service.objects.filter(
                provider=provider, name__icontains="Wallet"
            ).first()
            if not service:
                print(f"Adding Service: {wallet['name']} Wallet")
                service = Service(provider=provider, name="Wallet", url=wallet["url"])
                service.save()
            else:
                if wallet["url"] and not service.url:
                    service.url = wallet["url"]
                    service.save()
            populate_service_assets(service, wallet)
            populate_service_apy(service, wallet, date)


class Command(BaseCommand):
    help = "Seed data from git"

    def add_arguments(self, parser):
        parser.add_argument("path", type=str, help="Path to clone of a git repo")

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        repo = Repo(path)
        commits = list(repo.iter_commits("master"))
        commits.reverse()
        for commit in commits:
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            date = datetime.date.fromtimestamp(commit.committed_date)
            print(f"{id} - {msg} - {date}")

            file_path = "oracle/wallets.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_wallet_data(file_contents, date)
