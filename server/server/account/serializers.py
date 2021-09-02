from .models import Portfolio, Holding, Wallet
from rest_framework import serializers


class HoldingSerializer(serializers.HyperlinkedModelSerializer):
    symbol = serializers.SerializerMethodField("get_symbol")
    wallet = serializers.SerializerMethodField("get_wallet")

    class Meta:
        model = Holding
        fields = ["symbol", "quantity", "wallet"]

    def get_symbol(self, obj):
        return obj.asset.symbol.lower()

    def get_wallet(self, obj):
        return obj.wallet.service.provider.name


class PortfolioSerializer(serializers.HyperlinkedModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ["id", "name", "holdings"]
