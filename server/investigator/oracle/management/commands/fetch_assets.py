from django.contrib.auth.models import User
from investigator.oracle.models import Asset, Category, Tag
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
import requests
import json
import yfinance as yf

PAGES = 8
MAX_BATCH = 250
MAX_IDS = 50
TOP = 100

COINS = [
    ["btc", "bitcoin"],
    ["eth", "ethereum"],
    ["dot", "polkadot"],
    ["atom", "cosmos"],
    ["xlm", "stellar"],
    ["ada", "cardano"],
    ["ltc", "litecoin"],
    ["algo", "algorand"],
    "celo",
    ["xmr", "monero"],
    ["miota", "iota"],
    ["eos", "eos"],
    ["ksm", "kusama"],
    ["comp", "compound-governance-token"],
    ["link", "chainlink"],
    ["zec", "zcash"],
    "aave",
    ["ocean", "ocean-protocol"],
    ["bat", "basic-attention-token"],
    ["xrp", "ripple"],
    ["grt", "the-graph"],
    "sushi",
    ["avax", "avalanche-2"],
    ["one", "harmony"],
    ["icx", "icon"],
    ["sol", "solana"],
    ["uni", "uniswap"],
    "dai",
    "sylo",
    ["pols", "polkastarter"],
    "xsushi",
    ["dag", "constellation-labs"],
    ["trac", "origintrail"],
    "uma",
    ["usdc", "usd-coin"],
    ["usdt", "tether"],
    ["reef", "reef-finance"],
    ["gs", "genesis-shards"],
    ["powr", "power-ledger"],
    ["nu", "nucypher"],
    ["nmr", "numeraire"],
    ["ewt", "energy-web-token"],
    ["vet", "vechain"],
    ["theta", "theta-token"],
    "neo",
    ["icp", "internet-computer"],
    ["vtho", "vethor-token"],
    ["rose", "oasis-network"],
    "dock",
    ["matic", "matic-network"],
    "qtum",
    ["ogn", "origin-protocol"],
    ["stmx", "storm"],
    "near",
    ["hbar", "hedera-hashgraph"],
    ["osmo", "osmosis"],
    ["akt", "akash-network"],
    ["iris", "iris-network"],
    "regen",
    ["xprt", "persistence"],
    ["dvpn", "sentinel"],
    "ixo",
    ["iov", "starname"],
    ["xno", "nano"],
    ["kar", "karura"],
    ["lit", "litentry"],
    ["rndr", "render-token"],
]

COIN_LIST_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=%PAGE%&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d"
COIN_SELECTED_LIST_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=%IDS%&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d"

ASSET_KEYS = {
    "exact": [
        "low_24h",
        "high_24h",
        "market_cap_rank",
        "market_cap",
        "market_cap_change_percentage_24h",
        "price_change_percentage_24h",
        "circulating_supply",
        "total_supply",
        "max_supply",
        "image",
    ],
    "mapped": {
        "value": "current_price",
        "price_change_percentage_1h": "price_change_percentage_1h_in_currency",
        "price_change_percentage_7d": "price_change_percentage_7d_in_currency",
        "price_change_percentage_30d": "price_change_percentage_30d_in_currency",
    },
    "percent": [
        "price_change_percentage_1h",
        "price_change_percentage_24h",
        "price_change_percentage_7d",
        "price_change_percentage_30d",
        "market_cap_change_percentage_24h",
    ],
}

STOCK_ASSETS = [
    "AMZN",
    "TSLA",
    "ETN",
]

def fetch_batch(source, batch_idx, crypto, usd, enable, only_update):
    # with open(f"coins_{pidx}.json", "w") as f:
    #     json.dump(source, f)

    for idx, entry in enumerate(source):
        api_id = entry["id"]
        symbol = entry["symbol"]
        market_cap_rank = entry.get("market_cap_rank")
        active = enable or (market_cap_rank <= TOP if market_cap_rank else False)

        defaults = {
            "api_id": api_id,
            "symbol": symbol,
            "name": entry["name"],
            "active": active,
            "base": usd,
            "last_updated": parse_datetime(entry["last_updated"]),
        }
        for key in ASSET_KEYS["exact"]:
            defaults[key] = entry[key]
        for key, value in ASSET_KEYS["mapped"].items():
            defaults[key] = entry[value]

        for key in ASSET_KEYS["percent"]:
            if defaults[key] is not None:
                defaults[key] /= 100

        if only_update:
            asset = Asset.objects.get(api_id=api_id)
            print(f"Updating info on asset: {api_id} {symbol}")
            for key, value in defaults.items():
                setattr(asset, key, value)
            asset.save()
        else:
            asset, created = Asset.all_objects.update_or_create(
                api_id=api_id,
                tags__in=[crypto],
                defaults=defaults,
            )
            if created:
                print(f"{MAX_BATCH*batch_idx + idx}: {api_id} {symbol} (added)")
                asset.tags.add(crypto)
            else:
                print(f"{MAX_BATCH*batch_idx + idx}: {api_id} {symbol} (updated)")


def fetch_crypto_assets(active=False, dry=False):
    asset_class = Category.objects.get(name="asset_class")
    crypto = Tag.objects.get(name="crypto", category__in=[asset_class])
    fiat = Tag.objects.get(name="fiat", category__in=[asset_class])
    usd, created = Asset.all_objects.update_or_create(
        symbol="usd",
        tags__in=[fiat],
        defaults={
            "id": "usd",
            "symbol": "usd",
            "name": "US Dollar",
            "value": 1,
            "active": True,
        },
    )
    if created:
        usd.tags.add(fiat)

    if active:
        active_asset_ids = list(
            Asset.objects.filter(tags__in=[crypto], api_id__isnull=False)
            .order_by("market_cap_rank")
            .values_list("api_id", flat=True)
        )
        while True:
            slice = active_asset_ids[0:40]
            source = requests.get(
                COIN_SELECTED_LIST_URL.replace("%IDS%", ",".join(slice))
            ).json()
            fetch_batch(source, 0, crypto, usd, True, True)
            for entry in source:
                id = entry["id"]
                active_asset_ids.remove(id)

            if len(active_asset_ids) == 0:
                break
    else:
        for pidx in range(PAGES):
            source = requests.get(COIN_LIST_URL.replace("%PAGE%", str(pidx + 1))).json()
            fetch_batch(source, pidx, crypto, usd, False, False)

        ids = []
        for entry in COINS:
            if isinstance(entry, str):
                ids.append(entry)
            else:
                ids.append(entry[1])

        while True:
            slice = ids[0:40]
            repl = ",".join(slice)
            print(ids)
            source = requests.get(
                COIN_SELECTED_LIST_URL.replace("%IDS%", repl)
            ).json()
            fetch_batch(source, 0, crypto, usd, True, False)
            for entry in source:
                id = entry["id"]
                ids.remove(id)

            if len(ids) == 0:
                break

def fetch_stock_assets(active, dry):
    asset_class = Category.objects.get(name="asset_class")
    stock = Tag.objects.get(name="stock", category__in=[asset_class])
    fiat = Tag.objects.get(name="fiat", category__in=[asset_class])
    usd, created = Asset.all_objects.update_or_create(
        symbol="usd",
        tags__in=[fiat],
        defaults={
            "id": "usd",
            "symbol": "usd",
            "name": "US Dollar",
            "value": 1,
            "active": True,
        },
    )
    if created:
        usd.tags.add(fiat)

    # data = yf.download(tickers='AMZN', period='1d', interval='1d')
    # amzn = yf.Ticker("AMZN")
    # print(amzn.info)
    tickers = yf.Tickers(STOCK_ASSETS)

    data = yf.download(  # or pdr.get_data_yahoo(...
            # tickers list or string as well
            tickers = STOCK_ASSETS,

            # use "period" instead of start/end
            # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
            # (optional, default is '1mo')
            period = "5d",

            # fetch data by interval (including intraday if period < 60 days)
            # valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
            # (optional, default is '1d')
            interval = "1d",

            # group by ticker (to access via data['SPY'])
            # (optional, default is 'column')
            group_by = 'ticker',

            # adjust all OHLC automatically
            # (optional, default is False)
            auto_adjust = False,

            # download pre/post regular market hours data
            # (optional, default is False)
            prepost = False,

            # use threads for mass downloading? (True/False/Integer)
            # (optional, default is True)
            threads = True,

            # proxy URL scheme use use when downloading?
            # (optional, default is None)
            proxy = None
        )
    for label, content in data.items():
        symbol = label[0].lower()
        ticker = tickers.tickers[symbol.upper()].info
        price_change_percentage_24h = None
        col = label[1]

        if col != "Close":
            continue
        print(f"=== { symbol } ===")
        items = list(content.items())
        last = items[-1]
        prev = items[-2]

        date = last[0]
        value = last[1]
        price_change_percentage_24h = (prev[1] - last[1]) / value

        asset, created = Asset.all_objects.update_or_create(
            api_id=symbol,
            tags__in=[stock],
            defaults={
                "base": usd,
                "symbol": symbol,
                "name": ticker["shortName"],
                "value": value,
                "active": True,
                # "url": ticker["website"],
                "image": ticker["logo_url"],
                "last_updated": date,
                "market_cap": ticker["marketCap"],
                "price_change_percentage_24h": price_change_percentage_24h,
            },
        )

        # if created:
        #     print(f"{symbol} (added)")
        #     asset.tags.add(stock)
        # else:
        #     print(f"{symbol} (updated)")

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
        elif asset_class == "stock":
            fetch_stock_assets(active, dry)
        else:
            raise Exception("Unknown asset class")
