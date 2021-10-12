from django.contrib.auth.models import User
from server.strategy.models import (
    Strategy,
    StrategyChange,
    StrategyTarget,
)
from server.account.models import (
    User,
)
from django.core.management.base import BaseCommand
from decimal import *
import datetime
import json

getcontext().prec = 2


class Command(BaseCommand):
    help = "Dump strategy data to git"

    def add_arguments(self, parser):
        parser.add_argument("path", type=str, help="Path to clone of a git repo")

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        user = User.objects.get(username="zbraniecki")
        strat = Strategy.objects.get(owner=user)

        result = []
        for target in strat.targets.all().order_by("asset__symbol"):
            contains = []
            for asset in target.contains.all().order_by("symbol"):
                contains.append(asset.symbol)
            entry = {
                "asset": target.asset.symbol,
                "percent": float(target.percent),
            }
            if len(contains) != 0:
                entry["contains"] = contains
            result.append(entry)
        print(json.dumps(result, indent=2))
