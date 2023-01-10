from django.core.management.base import BaseCommand
from investigator.oracle.models import Asset
from investigator.history.models import TickData
from pprint import pprint
import random
from decimal import *
import datetime


def generate_rand(low, high):
    return random.randrange(low, high)
    # return Decimal(random.randrange(low, high))/100


def shift_value(value, divergence, down=True, up=True):
    min = value * 100
    if down:
        min = (value * 100) - (value * divergence * 100)
    max = value * 100
    if up:
        max = (value * 100) + (value * divergence * 100)
    d = generate_rand(min, max)
    return d / 100


def fetch_history(dry=False):
    dt = datetime.datetime.now()
    assets = Asset.objects.all().order_by("symbol")
    for asset in assets:
        close = generate_rand(1, 1000)
        open = shift_value(close, 0.1)
        high = shift_value(close, 0.1, down=False)
        low = shift_value(close, 0.1, up=False)
        tick = {
            "timestamp": dt,
            "open": open,
            "close": close,
            "high": high,
            "low": low,
        }
        pprint(asset)
        pprint(tick)
        break


class Command(BaseCommand):
    help = "Fetch asset history data"

    def add_arguments(self, parser):
        parser.add_argument("-d", "--dry", action="store_true", help="Dry run")

    def handle(self, *args, **kwargs):
        dry = kwargs["dry"]
        fetch_history(dry)
