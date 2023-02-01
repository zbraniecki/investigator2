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
    Transaction,
)
from investigator.oracle.models import Asset, Tag
from investigator.strategy.models import StrategyUI
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class TransactionSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="iso-8601")

    class Meta:
        model = Transaction
        fields = [
            "pk",
            "account",
            "holding",
            "asset",
            "type",
            "quantity",
            "timestamp",
        ]


class HoldingSerializer(serializers.ModelSerializer):
    symbol = serializers.SerializerMethodField("get_symbol")

    class Meta:
        model = Holding
        fields = [
            "pk",
            "owner",
            "asset",
            "symbol",
            "quantity",
            "account",
        ]

    def get_symbol(self, obj):
        return obj.asset.symbol.lower()


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ["pk", "name", "value", "holdings", "portfolios", "accounts", "tags"]


class WatchlistSerializer(serializers.ModelSerializer):
    assets = serializers.SerializerMethodField("get_assets")

    class Meta:
        model = Watchlist
        fields = ["pk", "name", "type", "assets", "portfolio", "dynamic"]

    def create(self, validated_data):
        user = self.context["request"].user

        watchlist = Watchlist.objects.create(owner=user, **validated_data)

        wuis = WatchlistUI.objects.filter(user=user)

        wui = WatchlistUI(
            watchlist=watchlist,
            user=user,
            visible_order=len(wuis)
        )
        wui.save()
        return watchlist

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


class AccountSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField("get_name")
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Account
        fields = ["pk", "owner", "name", "service", "holdings", "transactions"]

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


class WatchlistUISerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistUI
        fields = ["pk", "watchlist", "user", "visible_order"]
