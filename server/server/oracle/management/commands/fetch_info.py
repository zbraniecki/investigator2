from django.contrib.auth.models import User
from server.oracle.models import Asset, Category, AssetInfo
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
import requests

INFO_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={IDS}&order=market_cap_desc&per_page=100&page=1&sparkline=false"

# Limit is 50 so we have to loop it
def fetch_crypto_info():
    asset_class = Category.objects.get(name="crypto")
    assets = Asset.objects.filter(categories__in=[asset_class])

    ids = []
    results = []

    for asset in assets:
        ids.append(asset.api_id)

    base_asset = Asset.objects.get(symbol="usd")

    while len(ids) > 0:
        url = INFO_URL.replace("{IDS}", ",".join(ids))
        sub_results = requests.get(url).json()

        results.extend(sub_results)

        missing_ids = []
        for id in ids:
            if not any(result["id"] == id for result in sub_results):
                missing_ids.append(id)
        ids = missing_ids

    assert len(assets) == len(results)

    for result in results:
        asset = Asset.objects.get(api_id=result["id"])

        info = AssetInfo.objects.filter(asset=asset, base=base_asset).first()

        if info:
            info.value = result["current_price"]
            info.market_cap = result["market_cap"]
            info.price_change_percentage_24h = result["price_change_percentage_24h"]
            info.market_change_cap_percentage_24h = result[
                "market_cap_change_percentage_24h"
            ]
            info.last_updated = parse_datetime(result["last_updated"])
            info.save()
        else:
            info = AssetInfo(
                asset=asset,
                base=base_asset,
                value=result["current_price"],
                market_cap=result["market_cap"],
                price_change_percentage_24h=result["price_change_percentage_24h"],
                market_cap_change_percentage_24h=result[
                    "market_cap_change_percentage_24h"
                ],
                last_updated=parse_datetime(result["last_updated"]),
            )
            info.save()


class Command(BaseCommand):
    help = "Fetch asset info by asset class"
    classes = ["crypto", "stock"]

    def add_arguments(self, parser):
        parser.add_argument("class", type=str, help="Asset class to fetch info of")

    def handle(self, *args, **kwargs):
        asset_class = kwargs["class"]

        if asset_class == "crypto":
            fetch_crypto_info()
        else:
            raise Exception("Unknown asset class")
