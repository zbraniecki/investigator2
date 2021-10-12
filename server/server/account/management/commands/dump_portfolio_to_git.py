from django.contrib.auth.models import User
from server.strategy.models import Portfolio
from server.account.models import (
    User,
    Wallet,
    Holding,
)
from django.core.management.base import BaseCommand
from decimal import *
import datetime
import json

getcontext().prec = 2


class Command(BaseCommand):
    help = "Dump portfolio data to git"

    def add_arguments(self, parser):
        parser.add_argument("path", type=str, help="Path to clone of a git repo")

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        user = User.objects.get(username="zbraniecki")
        holdings = Holding.objects.filter(wallet__owner=user).order_by(
            "wallet__service__provider__id", "-quantity", "asset__symbol"
        )

        result = []
        for holding in holdings:
            wallet = holding.wallet.service.provider.id
            entry = {
                "symbol": holding.asset.symbol,
                "quantity": float(holding.quantity),
                "wallet": wallet,
            }
            result.append(entry)
        print(json.dumps(result, indent=2))
