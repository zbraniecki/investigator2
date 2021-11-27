from django.contrib.auth.models import User
from investigator.oracle.models import Asset, Category
from django.core.management.base import BaseCommand


COINS = [
    ["btc", "bitcoin"],
    ["eth", "ethereum"],
    ["dot", "polkadot"],
    "atom",
    "xlm",
    ["ada", "cardano"],
    ["ltc", "litecoin"],
    "algo",
    "celo",
    "xmr",
    "miota",
    ["eos", "eos"],
    "ksm",
    ["comp", "compound-governance-token"],
    "link",
    "zec",
    "aave",
    "ocean",
    "bat",
    ["xrp", "ripple"],
    ["grt", "the-graph"],
    "sushi",
    ["avax", "avalanche-2"],
    ["one", "harmony"],
    "icx",
    "sol",
    ["uni", "uniswap"],
    "dai",
    "sylo",
    "pols",
    "xsushi",
    "dag",
    "trac",
    "uma",
    "usdc",
    "usdt",
    "reef",
    ["gs", "genesis-shards"],
    "powr",
    "nu",
    "nmr",
    "ewt",
    "vet",
    "theta",
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
    "osmo",
    "akt",
    "iris",
    "regen",
    "xprt",
    "dvpn",
    "ixo",
    ["iov", "starname"],
    "xno",
    "kar",
    "lit",
    "rndr",
]


def activate_crypto_assets():
    crypto = Category.objects.get(name="crypto")
    Asset.objects.filter(categories__in=[crypto]).update(active=False)

    top30_assets = Asset.inactive_objects.filter(info__market_cap__gte=30).update(
        active=True
    )

    for key in COINS:
        if type(key) is str:
            asset = Asset.all_objects.filter(symbol=key).first()
        else:
            asset = Asset.all_objects.filter(api_id=key[1]).first()

        if asset:
            print(f"Activating {asset}")
            asset.active = True
            asset.save()
        else:
            print(f"Can't activate asset {key}")


class Command(BaseCommand):
    help = "Select assets by asset class"
    classes = ["crypto", "stock"]

    def add_arguments(self, parser):
        parser.add_argument("class", type=str, help="Asset class to activate assets of")

    def handle(self, *args, **kwargs):
        asset_class = kwargs["class"]

        if asset_class == "crypto":
            activate_crypto_assets()
        else:
            raise Exception("Unknown asset class")
