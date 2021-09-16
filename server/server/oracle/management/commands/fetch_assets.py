from django.contrib.auth.models import User
from server.oracle.models import Asset, Category
from django.core.management.base import BaseCommand
import requests


COIN_LIST_URL = "https://api.coingecko.com/api/v3/coins/list?include_platform=false"


def fetch_crypto_assets():
    source = requests.get(COIN_LIST_URL).json()

    asset_class = Category.objects.get(name="crypto")
    id = 0
    for entry in source:
        id = id + 1
        asset = Asset.objects.filter(
            api_id=entry["id"], categories__in=[asset_class]
        ).first()
        if asset:
            asset.symbol = entry["symbol"]
            asset.name = entry["name"]
        else:
            print(f"{id}: {entry['id']}-{entry['symbol']} (new)")
            asset = Asset(
                symbol=entry["symbol"], name=entry["name"], api_id=entry["id"]
            )
            asset.save()
            asset.categories.add(asset_class)


class Command(BaseCommand):
    help = "Fetch assets by asset class"
    classes = ["crypto", "stock"]

    def add_arguments(self, parser):
        parser.add_argument("class", type=str, help="Asset class to fetch assets of")

    def handle(self, *args, **kwargs):
        asset_class = kwargs["class"]

        if asset_class == "crypto":
            fetch_crypto_assets()
        else:
            raise Exception("Unknown asset class")
