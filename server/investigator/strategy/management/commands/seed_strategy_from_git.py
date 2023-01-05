from django.contrib.auth.models import User
from investigator.oracle.models import (
    Provider,
    Service,
    Asset,
)

from investigator.user.models import (
    User,
    Account,
    Holding,
    Portfolio,
)
from investigator.strategy.models import (
    Strategy,
    TargetChange,
    Target,
)
from django.core.management.base import BaseCommand
from django.db.models import Q
from git import Repo
from django.utils import timezone
from decimal import *
import datetime
import toml
import pprint

getcontext().prec = 2

SYMBOL_MAP = {
    "eth2": "eth",
    "AVAX": "avax",
    "nano": "xno",
}


def normalize_symbol(input):
    if input in SYMBOL_MAP:
        return SYMBOL_MAP[input]
    else:
        return input


def upload_strategy_data(data, dt, dry=False):
    parsed_toml = toml.loads(data)
    coins = parsed_toml["coin"]

    user = User.objects.get(username="zbraniecki")
    strat = Strategy.objects.filter(owner=user).first()
    if not strat:
        portfolio = Portfolio.objects.get(name__iexact="crypto")
        strat = Strategy(
            name="crypto",
            owner=user,
            portfolio=portfolio,
        )
        strat.save()
    assert strat

    symbols = []
    for coin in coins:
        symbols.append(normalize_symbol(coin["symbol"]))

    assets = Asset.objects.filter(symbol__in=symbols)
    targets = (
        Target.objects.filter(
            strategy=strat,
            asset__in=assets,
        )
        .order_by("asset_id", "-id")
        .distinct("asset")
    )
    for target in targets:
        if target:
            delta = Decimal(coin["percent"]) - Decimal(target.percent)
            if delta == 0.0:
                continue
            change = TargetChange(
                strategy=target.strategy,
                asset=target.asset,
                change=delta,
                timestamp=dt,
            )
            if not dry:
                change.save()
            target.percent = coin["percent"]
            if not dry:
                target.save()
        else:
            target = Target(strategy=strat, asset=asset, percent=coin["percent"])
            if not dry:
                target.save()
            change = TargetChange(
                strategy=strat,
                asset=target.asset,
                change=coin["percent"],
                timestamp=dt,
            )
            if not dry:
                change.save()

    for target in strat.targets.all():
        found = False
        for coin in coins:
            if normalize_symbol(coin["symbol"].lower()) == normalize_symbol(
                target.asset.symbol.lower()
            ):
                found = True
                break
        if not found:
            change = TargetChange(
                strategy=strat,
                asset=target.asset,
                change=target.percent * -1,
                timestamp=dt,
            )
            if not dry:
                change.save()
            target.percent = 0.0
            if not dry:
                target.save()


class Command(BaseCommand):
    help = "Seed strategy data from git"

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
            # if i < 93:
            #     continue
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            tz = timezone.get_current_timezone()
            dt = datetime.datetime.fromtimestamp(commit.committed_date).replace(
                tzinfo=tz
            )
            print(f"{i}: {id} - {msg} - {dt}")

            file_path = "account/strategy.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_strategy_data(file_contents, dt, dry)

            # if i >= 1:
            #     break
        repo.head.reference = repo.heads.master
