from django.contrib.auth.models import User
from server.oracle.models import Asset, Category, Price
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
import requests

PRICE_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={IDS}&order=market_cap_desc&per_page=100&page=1&sparkline=false"

# Limit is 50 so we have to loop it
def fetch_crypto_prices():
    asset_class = Category.objects.get(name="crypto")
    assets = Asset.objects.filter(categories__in=[asset_class])

    ids = []
    results = []

    for asset in assets:
        ids.append(asset.api_id)

    base_asset = Asset.objects.get(symbol="usd")

    while len(ids) > 0:
        url = PRICE_URL.replace("{IDS}", ",".join(ids))
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

        price = Price.objects.filter(asset=asset, base=base_asset).first()

        if price:
            price.value = result["current_price"]
            price.market_cap = result["market_cap"]
            price.price_change_percentage_24h = result["price_change_percentage_24h"]
            price.market_change_cap_percentage_24h = result[
                "market_cap_change_percentage_24h"
            ]
            price.last_updated = parse_datetime(result["last_updated"])
            price.save()
        else:
            price = Price(
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
            price.save()


class Command(BaseCommand):
    help = "Fetch prices by asset class"
    classes = ["crypto", "stock"]

    def add_arguments(self, parser):
        parser.add_argument("class", type=str, help="Asset class to fetch prices of")

    def handle(self, *args, **kwargs):
        asset_class = kwargs["class"]

        if asset_class == "crypto":
            fetch_crypto_prices()
        else:
            raise Exception("Unknown asset class")
