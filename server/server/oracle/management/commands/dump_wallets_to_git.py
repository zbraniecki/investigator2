from django.contrib.auth.models import User
from server.oracle.models import (
    Provider,
    Service,
    Passive,
    PassiveType,
)
from django.core.management.base import BaseCommand
from decimal import *
import datetime
import json

getcontext().prec = 2


class Command(BaseCommand):
    help = "Dump wallet data to git"

    def add_arguments(self, parser):
        parser.add_argument("path", type=str, help="Path to clone of a git repo")

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        services = Service.objects.all().order_by("provider__id")

        result = []
        for service in services:
            currency = []
            for asset in service.assets.all().order_by("symbol"):
                passive = Passive.objects.filter(
                    service=service,
                    asset=asset,
                )
                assert len(passive) == 1
                passive = passive.first()
                if passive.apy_max:
                    apy = [passive.apy_min, passive.apy_max]
                else:
                    apy = passive.apy_min
                currency.append(
                    {
                        "symbol": asset.symbol,
                        "apy": apy,
                        "yield_type": PassiveType(passive.type).label,
                    }
                )
            entry = {
                "id": service.provider.id,
                "name": service.__str__(),
                "url": service.provider.url,
                "currency": currency,
            }
            result.append(entry)
        print(json.dumps(result, indent=2))
