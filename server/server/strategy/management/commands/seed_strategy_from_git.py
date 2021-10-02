from django.contrib.auth.models import User
from server.oracle.models import (
    Provider,
    Service,
    Asset,
)

from server.account.models import (
    User,
    Wallet,
    Holding,
)
from server.strategy.models import (
    Strategy,
    StrategyTarget,
)
from django.core.management.base import BaseCommand
from django.db.models import Q
from git import Repo
import datetime
import toml
import pprint

def upload_strategy_data(data, date, dry=False):
    parsed_toml = toml.loads(data)
    coins = parsed_toml["coin"]

    user = User.objects.get(username="zbraniecki")
    strat = Strategy.objects.get(owner=user)
    strat.targets.all().delete()
    assert strat
    for coin in coins:
        asset = Asset.objects.get(symbol__iexact=coin["symbol"])

        target = StrategyTarget(
            strategy=strat,
            asset=asset,
            percent=coin["percent"]
        )
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
        # commits.reverse()
        i = 0
        for commit in commits:
            i += 1
            # if i < 1:
            #     continue
            repo.head.reference = commit

            id = commit.hexsha
            msg = commit.message
            date = datetime.date.fromtimestamp(commit.committed_date)
            print(f"{i}: {id} - {msg} - {date}")

            file_path = "account/strategy.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_strategy_data(file_contents, date, dry)

            if i >= 1:
                break
