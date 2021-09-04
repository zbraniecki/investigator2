from .models import Category, Asset, Price
from rest_framework import serializers


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class AssetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Asset
        fields = ["symbol", "name"]


class PriceSerializer(serializers.HyperlinkedModelSerializer):
    pair = serializers.SerializerMethodField("get_pair")

    class Meta:
        model = Price
        fields = [
            "value",
            "pair",
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
