from django.contrib.auth.models import User
from investigator.strategy.models import (
    Strategy,
    TargetChange,
    Target,
)
from investigator.user.models import (
    User,
)
from django.core.management.base import BaseCommand
from decimal import *
import datetime
import json
import toml

getcontext().prec = 2

SYMBOL_MAP = {}


def normalize_symbol(input):
    if input.lower() in SYMBOL_MAP:
        return SYMBOL_MAP[input.lower()]
    else:
        return input


def sort(obj):
    obj["coin"].sort(
        key=lambda item: item["symbol"],
    )
    obj["coin"].sort(key=lambda item: item["percent"], reverse=True)


def compare_to_reference(path, result):
    reference = toml.load(f"{path}/account/strategy.toml")
    sort(reference)
    sort(result)
    assert len(reference["coin"]) == len(result["coin"])
    print(toml.dumps(reference))
    # print("====")
    # print(toml.dumps(result))
    # for (i1, i2) in zip(reference["holding"], result["holding"]):
    #     if i1 == i2:
    #         continue
    #     print("Diff between items:")
    #     print(i1)
    #     print(i2)


class Command(BaseCommand):
    help = "Dump strategy data to git"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **kwargs):
        user = User.objects.get(username="zbraniecki")
        strat = Strategy.objects.get(owner=user)

        result = []
        for target in strat.targets.all().order_by("asset__symbol"):
            if target.percent == 0.0:
                continue
            contains = []
            for asset in target.contains.all().order_by("symbol"):
                contains.append(asset.symbol)
            entry = {
                "percent": float(target.percent),
                "symbol": normalize_symbol(target.asset.symbol),
            }
            if len(contains) != 0:
                entry["contains"] = contains
            result.append(entry)
        result = {"coin": result}
        # compare_to_reference(path, result)
        result = toml.dumps(result)
        print(result)
