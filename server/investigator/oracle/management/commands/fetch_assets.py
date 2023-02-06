from investigator.user.models import User, Account, Holding
from investigator.oracle.models import Asset, Category, Tag, Provider, Service
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
import requests
import json
import os
from pprint import pprint
from alpaca.trading.client import TradingClient


def map_as_percent(value):
    if value is None:
        return None
    return value / 100


CHUNK_SIZE = 100
BASE_CURRENCY = "usd"
CURRENT_API = "coingecko"

APIS = {
    "tiingo": {
        "id": "symbol",
        "resp_id": "",
        "entry_map": {},
    },
    "alpaca": {
        "id": "symbol",
        "resp_id": "",
        "entry_map": {},
    },
    "coingecko": {
        "id": "api_id",
        "resp_id": "id",
        "entry_map": {
            "value": "current_price",
            "last_updated": ["last_updated", parse_datetime],
            "high_24h": "high_24h",
            "low_24h": "low_24h",
            "symbol": "symbol",
            "name": "name",
            "market_cap_rank": "market_cap_rank",
            "market_cap": "market_cap",
            "market_cap_change_percentage_24h": "market_cap_change_percentage_24h",
            "price_change_percentage_1h": [
                "price_change_percentage_1h_in_currency",
                map_as_percent,
            ],
            "price_change_percentage_24h": [
                "price_change_percentage_24h_in_currency",
                map_as_percent,
            ],
            "price_change_percentage_7d": [
                "price_change_percentage_7d_in_currency",
                map_as_percent,
            ],
            "price_change_percentage_30d": [
                "price_change_percentage_30d_in_currency",
                map_as_percent,
            ],
            "circulating_supply": "circulating_supply",
            "total_supply": "total_supply",
            "max_supply": "max_supply",
        },
    },
}


def ensure_usd():
    asset_class = Category.objects.get(name="asset_class")
    fiat = Tag.objects.get(name="fiat", category__in=[asset_class])
    usd, created = Asset.all_objects.update_or_create(
        symbol="usd",
        asset_class=fiat,
        defaults={
            "id": "usd",
            "symbol": "usd",
            "name": "US Dollar",
            "value": 1,
            "active": True,
        },
    )


def chunk_list(list, step):
    chunks = []

    start = 0
    end = len(list)
    for i in range(start, end, step):
        x = i
        chunks.append(list[x : x + step])

    return chunks


def fetch_chunk_alpaca(chunk, idx):
    ALPACA_URL = (
        "https://data.alpaca.markets/v1beta2/crypto/latest/trades?symbols=%TICKERS%"
    )
    headers = {
        "Apca-Api-Key-Id": "PKLQ431QZN3W6CHQD1ZP",
        "Apca-Api-Secret-Key": "PyfXfdeAiVbmczwJnOQBk4zpDImeHPBV4NljOtTB",
    }

    tickers = ",".join([f"{id}/{BASE_CURRENCY}".upper() for id in chunk])
    url = ALPACA_URL.replace("%TICKERS%", tickers)
    resp = requests.get(url, headers=headers)

    result = resp.text
    print(result)
    #
    # received_ids = [item["baseCurrency"] for item in result]
    # missing_ids = [id for id in chunk if id not in received_ids]
    # print(missing_ids)
    # print(len(missing_ids))
    # print(result)


def fetch_chunk_tiingo(chunk, idx):
    API_TOKEN = "e808c884f7d9ac5467156b86515de1f32ff535df"
    TIINGO_URL = "https://api.tiingo.com/tiingo/crypto/prices?tickers=%TICKERS%&startDate=2023-01-04&resampleFreq=1day"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Token {API_TOKEN}",
    }

    tickers = ",".join([f"{id}{BASE_CURRENCY}" for id in chunk])
    url = TIINGO_URL.replace("%TICKERS%", tickers)
    resp = requests.get(url, headers=headers)

    result = resp.json()

    received_ids = [item["baseCurrency"] for item in result]
    missing_ids = [id for id in chunk if id not in received_ids]
    print(missing_ids)
    print(len(missing_ids))
    # print(result)


def check_missing(chunk, result, id):
    received_ids = [item[id] for item in result]
    missing_ids = [id for id in chunk if id not in received_ids]
    assert len(missing_ids) == 0
    if len(missing_ids) > 0:
        print(f"Warning: Missing {len(missing_ids)} IDS: {missing_ids}.")


def fetch_chunk_coingecko(chunk, idx):
    COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=%TICKERS%&order=market_cap_desc&per_page=100&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d"
    headers = {
        "Content-Type": "application/json",
    }

    tickers = ",".join([id for id in chunk])
    url = COINGECKO_URL.replace("%TICKERS%", tickers)
    try:
        resp = requests.get(url, headers=headers)
        result_list = resp.json()
    except Exception as e:
        print(f"Failed to receive results: {e}")
        return {}

    current_api = APIS[CURRENT_API]
    check_missing(chunk, result_list, current_api["resp_id"])

    result = {entry[current_api["resp_id"]]: entry for entry in result_list}
    assert len(result_list) == len(result.keys())
    # pprint(result)
    return result


def fetch_crypto_assets(active=False, dry=False):
    current_api = APIS[CURRENT_API]

    asset_class = Category.objects.get(name="asset_class")
    crypto = Tag.objects.get(name="crypto", category__in=[asset_class])

    asset_list = Asset.objects.filter(asset_class=crypto).order_by("symbol")

    assets = {getattr(asset, current_api["id"]): asset for asset in asset_list}
    assert len(asset_list) == len(assets.keys())

    asset_ids = list(assets.keys())

    chunks = chunk_list(asset_ids, CHUNK_SIZE)

    for idx in range(0, len(chunks)):
        print(f"Fetching chunk {idx}: {chunks[idx]}")
        result = fetch_chunk_coingecko(chunks[idx], idx)
        for id, entry in result.items():
            for key, value in current_api["entry_map"].items():
                if isinstance(value, list):
                    setattr(assets[id], key, value[1](entry[value[0]]))
                else:
                    setattr(assets[id], key, entry[value])

    if not dry:
        Asset.objects.bulk_update(asset_list, current_api["entry_map"].keys())


class Command(BaseCommand):
    help = "Fetch assets by asset class"
    classes = ["crypto", "stock"]

    def add_arguments(self, parser):
        parser.add_argument("-d", "--dry", action="store_true", help="Dry run")
        parser.add_argument(
            "-a",
            "--active",
            action="store_true",
            help="Only refresh info about active assets",
        )
        parser.add_argument("class", type=str, help="Asset class to fetch assets of")

    def handle(self, *args, **kwargs):
        dry = kwargs["dry"]
        active = kwargs["active"]
        asset_class = kwargs["class"]

        if asset_class == "crypto":
            fetch_crypto_assets(active, dry)
        # elif asset_class == "stock":
        #     file_path = os.path.join(
        #         os.path.dirname(os.path.abspath(__file__)),
        #         "../../../../../res/stock.json",
        #     )
        #     with open(file_path, "r") as fp:
        #         data = json.load(fp)
        #     fetch_stock_assets(data, active, dry)
        else:
            raise Exception("Unknown asset class")
