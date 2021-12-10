from django.contrib.auth import get_user_model
from .models import (
    Portfolio,
    Holding,
    Account,
    Watchlist,
    WatchlistType,
    PortfolioUI,
    WatchlistUI,
    User,
)
from investigator.oracle.models import Tag
from investigator.strategy.models import StrategyUI
from rest_framework import serializers
from rest_framework.authtoken.models import Token


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
    holdings = serializers.SerializerMethodField("get_holdings")
    portfolios = serializers.SerializerMethodField("get_portfolios")

    class Meta:
        model = Portfolio
        fields = ["id", "name", "holdings", "portfolios", "value"]

    def get_portfolios(self, obj):
        return [p.id for p in obj.portfolios.all()]

    def get_holdings(self, obj):
        user = self.context["request"].user

        result = []
        for holding in obj.holdings.all():
            result.append(
                {
                    "id": holding.asset.id,
                    "quantity": holding.quantity,
                    "account": holding.account.service.id,
                }
            )
        for account in obj.accounts.all():
            for holding in account.holdings.all():
                result.append(
                    {
                        "id": holding.asset.id,
                        "quantity": holding.quantity,
                        "account": holding.account.service.id,
                    }
                )
        for tag in obj.tags.all():
            holdings = Holding.objects.filter(
                asset__tags__in=[tag],
                account__owner_id=user.id,
            )
            for holding in holdings:
                result.append(
                    {
                        "id": holding.asset.id,
                        "quantity": holding.quantity,
                        "account": holding.account.service.id if holding.account else None,
                    }
                )
        return result


class WatchlistSerializer(serializers.HyperlinkedModelSerializer):
    portfolio = serializers.SerializerMethodField("get_portfolio")
    assets = serializers.SerializerMethodField("get_assets")
    type = serializers.SerializerMethodField("get_type")

    class Meta:
        model = Watchlist
        fields = ["id", "name", "type", "assets", "portfolio", "dynamic"]

    def get_portfolio(self, obj):
        if obj.type == WatchlistType.PORTFOLIO:
            return obj.portfolio.id
        else:
            return None

    def get_type(self, obj):
        return "dynamic"

    def get_assets(self, obj):
        if obj.type == WatchlistType.DYNAMIC:
            return get_dynamic_assets(obj.dynamic)
        else:
            return []


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


class UserSerializer(serializers.ModelSerializer):
    ui = serializers.SerializerMethodField("get_ui")
    current = serializers.SerializerMethodField("get_current")

    class Meta:
        model = get_user_model()
        fields = ("id", "username", "email", "ui", "current")

    def get_ui(self, obj):
        portfolios = PortfolioUI.objects.filter(
            user__id=obj.id, visibility=True, order__isnull=False
        ).order_by("order")
        watchlists = WatchlistUI.objects.filter(
            user__id=obj.id, visibility=True, order__isnull=False
        ).order_by("order")
        strategies = StrategyUI.objects.filter(
            user__id=obj.id, visibility=True, order__isnull=False
        ).order_by("order")
        return {
            "portfolios": [p.portfolio.id for p in portfolios],
            "watchlists": [w.watchlist.id for w in watchlists],
            "strategies": [s.strategy.id for s in strategies],
        }

    def get_current(self, obj):
        user = self.context["request"].user
        return obj.id == user.id


class MyCustomTokenSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Token
        fields = ("key", "user")
