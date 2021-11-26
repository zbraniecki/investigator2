from .models import Portfolio, Holding, Account, Watchlist, WatchlistType
from rest_framework import serializers


class HoldingSerializer(serializers.HyperlinkedModelSerializer):
    symbol = serializers.SerializerMethodField("get_symbol")
    account = serializers.SerializerMethodField("get_account")

    class Meta:
        model = Holding
        fields = ["symbol", "quantity", "account"]

    def get_symbol(self, obj):
        return obj.asset.symbol.lower()

    def get_account(self, obj):
        return obj.account.service.id


class PortfolioSerializer(serializers.HyperlinkedModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)
    portfolios = serializers.SerializerMethodField("get_portfolios")
    accounts = serializers.SerializerMethodField("get_accounts")

    class Meta:
        model = Portfolio
        fields = ["id", "name", "holdings", "portfolios", "accounts"]

    def get_portfolios(self, obj):
        return [p.id for p in obj.portfolios.all()]

    def get_accounts(self, obj):
        return [p.id for p in obj.accounts.all()]


class WatchlistSerializer(serializers.HyperlinkedModelSerializer):
    portfolio = serializers.SerializerMethodField("get_portfolio")
    assets = serializers.SerializerMethodField("get_assets")

    class Meta:
        model = Watchlist
        fields = ["id", "name", "assets", "portfolio", "dynamic"]

    def get_portfolio(self, obj):
        if obj.type == WatchlistType.PORTFOLIO:
            return obj.portfolio.id
        else:
            return None

    def get_assets(self, obj):
        if obj.type == WatchlistType.DYNAMIC:
            return ["eth"]
        else:
            return [asset.symbol for asset in obj.assets.all()]


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.SerializerMethodField("get_name")
    holdings = HoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Account
        fields = ["id", "name", "service", "holdings"]

    def get_name(self, obj):
        if obj.name:
            return obj.name
        else:
            return obj.service.__str__()
