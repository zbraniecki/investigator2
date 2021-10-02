from .models import Category, Asset, Price, Service, Passive
from rest_framework import serializers
from django.db.models import Q
from datetime import datetime


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


class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.SerializerMethodField("get_id")
    name = serializers.SerializerMethodField("get_name")
    currency = serializers.SerializerMethodField("get_currency")

    class Meta:
        model = Service
        fields = ["id", "name", "currency"]

    def get_id(self, obj):
        return f"{obj.provider.name}"

    def get_name(self, obj):
        return f"{obj.provider.name} {obj.name}"

    def get_currency(self, obj):
        today = datetime.today()
        passives = Passive.objects.filter(
            Q(service=obj)
            # & (Q(date_start__lte=today) | Q(date_start__isnull=True))
            # & (Q(date_end__gte=today) | Q(date_end__isnull=True))
        )
        print(passives)

        result = []

        for passive in passives:
            value = passive.values.first()
            result.append(
                {
                    "symbol": passive.asset.symbol,
                    "apy": value.apy_min,
                    "yield_type": "interest",
                }
            )

        return result

        # return [
        #     {
        #         "symbol": passive.asset.symbol,
        #         "apy": passive.apy,
        #         "yield_type": "interest",
        #     }
        #     for passive in passives
        # ]
