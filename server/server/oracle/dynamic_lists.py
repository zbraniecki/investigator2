from .models import Asset


def get_top30_assets():
    count = 30
    assets = Asset.objects.all().order_by("-price__market_cap", "symbol")
    return [asset.symbol for asset in assets][:count]


def get_movers_assets():
    count = 30
    half = int(count / 2)
    assets = Asset.objects.all().order_by(
        "-price__price_change_percentage_24h", "symbol"
    )
    asset_len = len(assets)
    selected = assets[:half] + assets[(asset_len - half) :]
    return [asset.symbol for asset in selected]


def get_dynamic_assets(name):
    if name == "top30":
        return get_top30_assets()
    elif name == "movers":
        return get_movers_assets()
    else:
        return []
