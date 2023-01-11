from django.core.management.base import BaseCommand
from investigator.oracle.models import Asset
from investigator.history.models import TickData
from pprint import pprint
import random
from decimal import *
from datetime import datetime, timedelta
from django.utils import timezone


CHUNKS = [
    # {
    #     "scale": 60,
    #     "duration": 60,
    # },
    {
        "scale": 60 * 10,
        "duration": 60 * 5,
    }
]


def generate_rand(low, high):
    return random.randrange(int(low * 100), int(high * 100)) / 100
    # return Decimal(random.randrange(low, high))/100


def shift_value(value, divergence, down=True, up=True):
    min = value * 100
    if down:
        min = (value * 100) - (value * 100 * divergence)
    max = value * 100
    if up:
        max = (value * 100) + (value * 100 * divergence)
    d = generate_rand(min, max)
    return d / 100


def retrieve_asset_history(asset, start, end, freq):
    result = []

    ts = start

    close = None

    while ts < end:
        ts += timedelta(seconds=freq)

        close = generate_rand(1, 1000) if close is None else shift_value(close, 0.1)
        open = shift_value(close, 0.1)
        high = shift_value(close, 0.1, down=False)
        low = shift_value(close, 0.1, up=False)
        result.append(
            {
                "timestamp": ts,
                "open": open,
                "close": close,
                "high": high,
                "low": low,
            }
        )

    return result


def validate_chunk_ticks(ticks, chunk, dt):
    ts = dt
    limit = dt - timedelta(seconds=chunk["scale"])
    while ts > limit:
        end = ts
        ts -= timedelta(seconds=chunk["duration"])
        start = ts
        subticks = ticks.filter(timestamp__gte=start, timestamp__lte=end)
        if subticks.count() != 1:
            return False
    return True


def fetch_asset_chunk(asset, dt, chunk, ticks, dry):
    left = chunk["scale"]

    start = dt - timedelta(seconds=chunk["scale"])
    end = dt
    subticks = ticks.filter(timestamp__lte=end, timestamp__gte=start)
    print(subticks)
    if validate_chunk_ticks(subticks, chunk, dt):
        return

    print(start)
    print(end)
    history = retrieve_asset_history(asset, start, end, chunk["duration"])
    pprint(history)

    for entry in history:
        tick = TickData(
            asset=asset,
            timestamp=entry["timestamp"],
            open=entry["open"],
            close=entry["close"],
            high=entry["high"],
            low=entry["low"],
        )
        if not dry:
            tick.save()

    # while left > 0:
    #     cut_off = dt - timedelta(seconds = chunk["duration"])
    # tick = next(ticks, None)
    # print(cut_off)
    # print(tick)
    # if tick is None:
    #     start = cut_off
    #     end = dt
    #     freq = chunk["duration"]
    #     history = retrieve_asset_history(asset, start, end, freq)
    #     pprint(history)
    # left -= chunk["duration"]


def fetch_asset_history(asset, dt, dry):
    ticks = TickData.objects.filter(asset=asset).order_by("-timestamp")

    print(f"now: {dt}")

    for chunk in CHUNKS:
        fetch_asset_chunk(asset, dt, chunk, ticks, dry)

    # pprint(asset)
    # pprint(tick)


def fetch_history(dry=False):
    tz = timezone.get_current_timezone()
    dt = datetime.now().replace(tzinfo=tz)
    assets = Asset.objects.all().order_by("symbol")
    for asset in assets:
        fetch_asset_history(asset, dt, dry)
        break


class Command(BaseCommand):
    help = "Fetch asset history data"

    def add_arguments(self, parser):
        parser.add_argument("-d", "--dry", action="store_true", help="Dry run")

    def handle(self, *args, **kwargs):
        dry = kwargs["dry"]
        fetch_history(dry)
