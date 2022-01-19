from .models import Strategy
from rest_framework import serializers


class StrategySerializer(serializers.ModelSerializer):
    targets = serializers.SerializerMethodField("get_targets")

    class Meta:
        model = Strategy
        fields = ["pk", "name", "portfolio", "targets"]

    def get_targets(self, obj):
        result = []
        for target in obj.targets.all():
            contains = []
            for asset in target.contains.all():
                contains.append(asset.pk)
            result.append(
                {
                    "asset": target.asset.pk,
                    "contains": contains,
                    "percent": target.percent,
                }
            )
        return result
