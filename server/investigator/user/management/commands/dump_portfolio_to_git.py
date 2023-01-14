from django.contrib.auth.models import User
from investigator.strategy.models import Portfolio
from investigator.user.models import (
    User,
    Holding,
)
from investigator.oracle.models import Category, Tag
from django.core.management.base import BaseCommand
from decimal import *
import datetime
import json
import toml

getcontext().prec = 2

PROVIDER_MAP = {
    "algorand": "myalgo",
    "avalanche": "avawallet",
    "binance-us": "binance.us",
    "coinbase-pro": "coinbasepro",
    "icp-nns": "icp/nns",
    "oasis": "oasis_wallet",
}

SYMBOL_MAP = {}


def normalize_symbol(input):
    if input.lower() in SYMBOL_MAP:
        return SYMBOL_MAP[input.lower()]
    else:
        return input


def normalize_provider(input):
    if input.lower() in PROVIDER_MAP:
        return PROVIDER_MAP[input.lower()]
    else:
        return input


def sort(obj):
    obj["holding"].sort(
        key=lambda item: (item["account"], item["quantity"], item["symbol"])
    )


def compare_to_reference(path, result):
    reference = toml.load(f"{path}/account/portfolio.toml")
    sort(reference)
    sort(result)
    assert len(reference["holding"]) == len(result["holding"])
    # print(toml.dumps(reference))
    # print("====")
    print(toml.dumps(result))
    # for (i1, i2) in zip(reference["holding"], result["holding"]):
    #     if i1 == i2:
    #         continue
    #     print("Diff between items:")
    #     print(i1)
    #     print(i2)


class Command(BaseCommand):
    help = "Dump portfolio data to git"

    def add_arguments(self, parser):
        # parser.add_argument("path", type=str, help="Path to dump portfolio to file")
        pass

    def handle(self, *args, **kwargs):
        # path = kwargs["path"]

        asset_class = Category.objects.get(name="asset_class")
        crypto = Tag.objects.get(name="crypto", category__in=[asset_class])
        fiat = Tag.objects.get(name="fiat", category__in=[asset_class])

        user = User.objects.get(username="zbraniecki")
        holdings = Holding.objects.filter(
            account__owner=user,
            asset__asset_class__in=[crypto],
        ).order_by(
            "account__service__provider__id",
            "asset__symbol",
            "-quantity",
            "asset__symbol",
        )

        result = []
        for holding in holdings:
            account = normalize_provider(holding.account.service.provider.id)
            entry = {
                "quantity": float(holding.quantity),
                "symbol": normalize_symbol(holding.asset.symbol),
                "wallet": account,
            }
            result.append(entry)
        result = {"holding": result}
        # compare_to_reference(path, result)
        result = toml.dumps(result)
        print(result)
