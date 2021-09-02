from .models import Portfolio, Holding, Wallet
from rest_framework import serializers


class SymbolField(serializers.RelatedField):
    def to_representation(self, value):
        return value.symbol


class WalletField(serializers.RelatedField):
    def to_representation(self, value):
        return value.service.provider.name


class HoldingSerializer(serializers.HyperlinkedModelSerializer):
    asset = SymbolField(read_only=True)
    wallet = WalletField(read_only=True)

    class Meta:
        model = Holding
        fields = ["asset", "quantity", "wallet"]


class PortfolioSerializer(serializers.HyperlinkedModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ["id", "name", "holdings"]
