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
        return [
            {
                "symbol": target.asset.symbol,
                "contains": [],
                "percent": target.percent,
            }
            for target in obj.targets.all()
        ]
