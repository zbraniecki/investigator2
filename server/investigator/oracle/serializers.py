from .models import Category, Asset, AssetInfo, Service, Passive
from investigator.profile.models import Watchlist, WatchlistType, WatchlistUI
from rest_framework import serializers
from django.db.models import Q
from datetime import datetime
from .dynamic_lists import get_dynamic_assets


class AssetInfoSerializer(serializers.ModelSerializer):
    base = serializers.SerializerMethodField("get_base")
    last_updated = serializers.SerializerMethodField("get_last_updated")

    class Meta:
        model = Asset
        fields = [
            "base",
            "value",
            "high_24h",
            "low_24h",
            "market_cap_rank",
            "market_cap",
            "market_cap_change_percentage_24h",
            "price_change_percentage_1h",
            "price_change_percentage_24h",
            "price_change_percentage_7d",
            "price_change_percentage_30d",
            "circulating_supply",
            "total_supply",
            "max_supply",
            "image",
            "last_updated",
        ]

    def get_base(self, obj):
        return obj.base.symbol if obj.base else None

    def get_last_updated(self, obj):
        return obj.last_updated.isoformat() if obj.last_updated else None


class AssetSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField("get_tags")
    info = AssetInfoSerializer(source="*")

    class Meta:
        model = Asset
        fields = ["id", "symbol", "name", "tags", "info"]

    def get_tags(self, obj):
        return [tag.__str__() for tag in obj.tags.all()]


class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.SerializerMethodField("get_name")
    assets = serializers.SerializerMethodField("get_assets")

    class Meta:
        model = Service
        fields = ["id", "name", "assets", "type"]

    def get_name(self, obj):
        return obj.provider.__str__()

    def get_assets(self, obj):
        today = datetime.today()
        passives = Passive.objects.filter(service=obj)

        result = []

        for passive in passives:
            result.append(
                {
                    "id": passive.asset.id,
                    "apy": passive.apy_min,
                    "yield_type": passive.type,
                }
            )

        return result


class PublicWatchlistSerializer(serializers.HyperlinkedModelSerializer):
    portfolio = serializers.SerializerMethodField("get_portfolio")
    assets = serializers.SerializerMethodField("get_assets")
    type = serializers.SerializerMethodField("get_type")

    class Meta:
        model = Watchlist
        fields = [
            "id",
            "name",
            "type",
            "assets",
            "portfolio",
            "dynamic",
        ]

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
