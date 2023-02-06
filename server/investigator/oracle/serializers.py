from .models import Category, Asset, AssetInfo, Service, Passive, Category, Tag
from investigator.user.models import Watchlist, WatchlistType, WatchlistUI
from rest_framework import serializers
from django.db.models import Q
from datetime import datetime
from .dynamic_lists import get_dynamic_assets


class AssetInfoSerializer(serializers.ModelSerializer):
    base = serializers.SerializerMethodField("get_base")
    last_updated = serializers.DateTimeField(format="iso-8601")

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
            "api_id",
        ]

    def get_base(self, obj):
        return obj.base.symbol if obj.base else None


class AssetSerializer(serializers.ModelSerializer):
    info = AssetInfoSerializer(source="*")

    class Meta:
        model = Asset
        fields = ["pk", "asset_class", "symbol", "name", "tags", "info"]


class ServiceSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField("get_name")
    assets = serializers.SerializerMethodField("get_assets")
    provider_name = serializers.SerializerMethodField("get_provider_name")

    class Meta:
        model = Service
        fields = ["pk", "name", "assets", "type", "provider_name"]

    def get_name(self, obj):
        return obj.__str__()

    def get_assets(self, obj):
        today = datetime.today()
        passives = Passive.objects.filter(service=obj)

        result = []

        for passive in passives:
            quantity = (
                (passive.min, passive.max)
                if passive.max
                else passive.min
                if passive.min
                else None
            )
            apy = (
                (passive.apy_min, passive.apy_max)
                if passive.apy_max
                else passive.apy_min
            )
            result.append(
                {
                    "asset_pk": passive.asset.pk,
                    "apy": apy,
                    "quantity": quantity,
                    "yield_type": passive.type,
                }
            )

        return result

    def get_provider_name(self, obj):
        return obj.provider.name


class PublicWatchlistSerializer(serializers.ModelSerializer):
    portfolio = serializers.SerializerMethodField("get_portfolio")
    assets = serializers.SerializerMethodField("get_assets")
    type = serializers.SerializerMethodField("get_type")

    class Meta:
        model = Watchlist
        fields = [
            "pk",
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
        return obj.type

    def get_assets(self, obj):
        if obj.type == WatchlistType.DYNAMIC:
            return get_dynamic_assets(obj.dynamic)
        elif obj.type == WatchlistType.ASSETS:
            return [asset.pk for asset in obj.assets.all()]
        else:
            return []


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["pk", "name", "slug", "category"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["pk", "name", "slug", "parent"]
