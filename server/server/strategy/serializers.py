from .models import Strategy
from rest_framework import serializers


class StrategySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.SerializerMethodField("get_id")
    targets = serializers.SerializerMethodField("get_targets")

    class Meta:
        model = Strategy
        fields = ["id", "name", "targets"]

    def get_id(self, obj):
        return f"{obj.portfolio.id}"

    def get_targets(self, obj):
        result = []
        for target in obj.targets.all():
            contains = []
            for asset in target.contains.all():
                contains.append(asset.symbol)
            result.append(
                {
                    "symbol": target.asset.symbol,
                    "contains": contains,
                    "percent": target.percent,
                }
            )
        return result
