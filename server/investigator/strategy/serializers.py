from .models import Strategy, Target, TargetChange
from rest_framework import serializers


class StrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = ["pk", "name", "portfolio", "targets"]


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = [
            "pk",
            "strategy",
            "percent",
            "asset",
            "contains",
            "portfolio",
        ]


class TargetChangeSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="iso-8601")

    class Meta:
        model = TargetChange
        fields = [
            "pk",
            "strategy",
            "asset",
            "change",
            "timestamp",
        ]
