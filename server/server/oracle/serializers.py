from .models import Category, Asset, AssetInfo, Service, Passive
from server.account.models import Watchlist, WatchlistType
from rest_framework import serializers
from django.db.models import Q
from datetime import datetime
from .dynamic_lists import get_dynamic_assets


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class AssetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Asset
        fields = ["symbol", "name"]


class AssetInfoSerializer(serializers.HyperlinkedModelSerializer):
    pair = serializers.SerializerMethodField("get_pair")
    name = serializers.SerializerMethodField("get_name")
    symbol = serializers.SerializerMethodField("get_symbol")

    class Meta:
        model = AssetInfo
        fields = [
            "value",
            "pair",
            "name",
            "symbol",
            "market_cap",
            "price_change_percentage_24h",
            "market_cap_change_percentage_24h",
            "last_updated",
        ]

    def get_pair(self, obj):
        return [
            obj.asset.symbol,
            obj.base.symbol.upper(),
        ]

    def get_name(self, obj):
        return obj.asset.name

    def get_symbol(self, obj):
        return obj.asset.symbol


class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.SerializerMethodField("get_id")
    name = serializers.SerializerMethodField("get_name")
    currency = serializers.SerializerMethodField("get_currency")

    class Meta:
        model = Service
        fields = ["id", "name", "currency", "type"]

    def get_id(self, obj):
        return f"{obj.provider.name}"

    def get_name(self, obj):
        return f"{obj.provider.name} {obj.name}"

    def get_currency(self, obj):
        today = datetime.today()
        passives = Passive.objects.filter(service=obj)

        result = []

        for passive in passives:
            result.append(
                {
                    "symbol": passive.asset.symbol,
                    "apy": passive.apy_min,
                    "yield_type": "interest",
                }
            )

        return result


class PublicWatchlistSerializer(serializers.HyperlinkedModelSerializer):
    assets = serializers.SerializerMethodField("get_assets")
    type = serializers.SerializerMethodField("get_type")

    class Meta:
        model = Watchlist
        fields = ["id", "name", "type", "assets"]

    def get_type(self, obj):
        return "dynamic"

    def get_assets(self, obj):
        if obj.type == WatchlistType.DYNAMIC:
            return get_dynamic_assets(obj.dynamic)
        else:
            return []
