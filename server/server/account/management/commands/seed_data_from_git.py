from django.contrib.auth.models import User
from server.oracle.models import Provider, Service
from django.core.management.base import BaseCommand
from git import Repo
import datetime
import toml


def upload_wallet_data(data):
    parsed_toml = toml.loads(data)
    wallets = parsed_toml["wallet"]
    for wallet in wallets:
        provider = Provider.objects.filter(name__iexact=wallet["name"]).first()
        if not provider:
            print(f"Adding Provider: {wallet['name']}")
            provider = Provider(name=wallet["name"])
            provider.save()
            print(f"Adding Service: {wallet['name']} Wallet")
            service = Service(provider=provider, name="Wallet")
            service.save()
        else:
            service = Service.objects.filter(
                provider=provider, name__icontains="Wallet"
            ).first()
            if not service:
                print(f"Adding Service: {wallet['name']} Wallet")
                service = Service(provider=provider, name="Wallet")
                service.save()
        print(wallet)
        # print(provider)


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
            date = datetime.datetime.fromtimestamp(commit.committed_date)
            print(f"{id} - {msg} - {date}")

            file_path = "oracle/wallets.toml"
            file_contents = repo.git.show("{}:{}".format(commit.hexsha, file_path))
            upload_wallet_data(file_contents)
            break
