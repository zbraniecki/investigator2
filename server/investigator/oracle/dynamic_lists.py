from .models import Asset, Category, Tag


def get_top30_assets():
    count = 30

    asset_class = Category.objects.get(name="asset_class")
    crypto = Tag.objects.get(name="crypto", category__in=[asset_class])

    assets = Asset.objects.filter(tags__in=[crypto]).order_by("-market_cap", "symbol")
    return [asset.id for asset in assets][:count]


def get_movers_assets():
    count = 30
    half = int(count / 2)
    assets = Asset.objects.all().order_by(
        "-info__price_change_percentage_24h", "symbol"
    )
    asset_len = len(assets)
    selected = assets[:half] + assets[(asset_len - half) :]
    return [asset.id for asset in selected]


def get_dynamic_assets(name):
    if name == "top30":
        return get_top30_assets()
    elif name == "movers":
        return get_movers_assets()
    else:
        return []
