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
from investigator.oracle.models import Asset, Tag
from investigator.strategy.models import StrategyUI
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class HoldingSerializer(serializers.HyperlinkedModelSerializer):
    symbol = serializers.SerializerMethodField("get_symbol")
    account = serializers.SerializerMethodField("get_account")

    class Meta:
        model = Holding
        fields = ["pk", "symbol", "quantity", "account"]

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
                    "id": holding.id,
                    "asset_id": holding.asset.id,
                    "quantity": holding.quantity,
                    "account": holding.account.service.id,
                }
            )
        for account in obj.accounts.all():
            for holding in account.holdings.all():
                result.append(
                    {
                        "id": holding.id,
                        "asset_id": holding.asset.id,
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
                        "id": holding.id,
                        "asset_id": holding.asset.id,
                        "quantity": holding.quantity,
                        "account": holding.account.service.id
                        if holding.account
                        else None,
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
        user = self.context["request"].user

        if obj.type == WatchlistType.DYNAMIC:
            return get_dynamic_assets(obj.dynamic)
        if obj.type == WatchlistType.TAG:
            tag = obj.tag
            assets = Asset.objects.filter(tags__in=[tag], holding__account__owner=user)
            return [asset.id for asset in assets]
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
    visible_lists = serializers.SerializerMethodField("get_visible_lists")

    class Meta:
        model = get_user_model()
        fields = ("pk", "username", "email", "base_asset", "visible_lists")
        read_only_fields = ["pk", "username", "email"]

    def get_visible_lists(self, obj):
        portfolios = PortfolioUI.objects.filter(
            user__id=obj.id, visible_order__isnull=False
        ).order_by("visible_order")
        watchlists = WatchlistUI.objects.filter(
            user__id=obj.id, visible_order__isnull=False
        ).order_by("visible_order")
        strategies = StrategyUI.objects.filter(
            user__id=obj.id, visible_order__isnull=False
        ).order_by("visible_order")
        return {
            "portfolios": [p.portfolio.id for p in portfolios],
            "watchlists": [w.watchlist.id for w in watchlists],
            "strategies": [s.strategy.id for s in strategies],
        }


class MyCustomTokenSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Token
        fields = ("key", "user")
