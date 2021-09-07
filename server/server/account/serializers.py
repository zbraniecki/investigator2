from .models import Portfolio, Holding, Wallet, Watchlist, WatchlistType
from rest_framework import serializers


class HoldingSerializer(serializers.HyperlinkedModelSerializer):
    symbol = serializers.SerializerMethodField("get_symbol")
    wallet = serializers.SerializerMethodField("get_wallet")

    class Meta:
        model = Holding
        fields = ["symbol", "quantity", "wallet"]

    def get_symbol(self, obj):
        return obj.asset.symbol.lower()

    def get_wallet(self, obj):
        return obj.wallet.service.provider.name


class PortfolioSerializer(serializers.HyperlinkedModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ["id", "name", "holdings"]


class WatchlistSerializer(serializers.HyperlinkedModelSerializer):
    portfolio = serializers.SerializerMethodField("get_portfolio")
    assets = serializers.SerializerMethodField("get_assets")

    class Meta:
        model = Watchlist
        fields = ["id", "name", "assets", "portfolio", "smart"]

    def get_portfolio(self, obj):
        if obj.type == WatchlistType.PORTFOLIO:
            return obj.portfolio.id
        else:
            return None

    def get_assets(self, obj):
        if obj.type == WatchlistType.SMART:
            return ["eth"]
        else:
            return [asset.symbol for asset in obj.assets.all()]
