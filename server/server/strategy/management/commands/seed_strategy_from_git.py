from django.contrib.auth.models import User
from server.oracle.models import (
    Provider,
    Service,
    Asset,
)

from server.account.models import (
    User,
    Account,
    Holding,
    Portfolio,
)
from server.strategy.models import (
    Strategy,
    StrategyChange,
    StrategyTarget,
)
from django.core.management.base import BaseCommand
from django.db.models import Q
from git import Repo
from decimal import *
import datetime
import toml
import pprint

getcontext().prec = 2


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

    for coin in coins:
        asset = Asset.objects.get(symbol__iexact=coin["symbol"])
        target = StrategyTarget.objects.filter(
            strategy=strat,
            asset=asset,
        ).first()

        if target:
            delta = Decimal(coin["percent"]) - Decimal(target.percent)
            if delta == 0.0:
                continue
            change = StrategyChange(
                target=target,
                change=delta,
                timestamp=dt,
            )
            if not dry:
                change.save()
            target.percent = coin["percent"]
            if not dry:
                target.save()
        else:
            target = StrategyTarget(
                strategy=strat, asset=asset, percent=coin["percent"]
            )
            if not dry:
                target.save()
            change = StrategyChange(
                target=target,
                change=coin["percent"],
                timestamp=dt,
            )
            if not dry:
                change.save()

    for target in strat.targets.all():
        found = False
        for coin in coins:
            if coin["symbol"].lower() == target.asset.symbol.lower():
                found = True
                break
        if not found:
            change = StrategyChange(
                target=target,
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
            # if i < 2:
            #     continue
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            dt = datetime.datetime.fromtimestamp(commit.committed_date)
            print(f"{i}: {id} - {msg} - {dt}")

            file_path = "account/strategy.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_strategy_data(file_contents, dt, dry)

            # if i >= 1:
            #     break
