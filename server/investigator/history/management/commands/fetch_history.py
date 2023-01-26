from django.core.management.base import BaseCommand
from investigator.oracle.models import Asset
from investigator.history.models import TickData
from pprint import pprint
import random
from decimal import *
from datetime import datetime, timedelta
from django.utils import timezone


CHUNKS = [
    {
        "scale": 60,
        "duration": 60,
    },
    {
        "scale": 60 * 10,
        "duration": 60 * 5,
    },
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


def retrieve_asset_history(asset, start, end, freq, latest_tick):
    result = []

    ts = start

    close = None if latest_tick is None else float(latest_tick.close)

    while ts > end:
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
        ts -= timedelta(seconds=freq)

    return result


def fetch_asset_chunk(asset, dt, chunk, latest_tick, dry):
    print(f"fetching chunk {chunk['duration']} for {asset.symbol}")

    start = dt
    end = dt - timedelta(seconds=chunk["scale"])
    print(start)
    print(end)
    history = retrieve_asset_history(asset, start, end, chunk["duration"], latest_tick)
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


def has_gaps(ticks, chunk, dt):
    start = dt - timedelta(seconds=chunk["duration"])
    end = dt

    ticks = ticks.filter(timestamp__gte=start, timestamp__lte=end)
    print(ticks)

    return False


def fetch_asset_history(asset, ticks, dt, dry):
    print(f"now: {dt}")

    # time_diff = dt - latest_tick.timestamp
    for chunk in CHUNKS:
        if has_gaps(ticks, chunk, dt):
            pass
        # if time_diff > timedelta(seconds = chunk["duration"]):
        #     fetch_asset_chunk(asset, dt, chunk, latest_tick, dry)

    # pprint(asset)
    # pprint(tick)


def fetch_history(dry=False):
    tz = timezone.get_current_timezone()
    dt = datetime.now().replace(tzinfo=tz)
    assets = Asset.objects.all().order_by("symbol")

    ticks = TickData.objects.all().order_by("-timestamp")

    for asset in assets:
        fetch_asset_history(asset, ticks.filter(asset=asset), dt, dry)
        break


class Command(BaseCommand):
    help = "Fetch asset history data"

    def add_arguments(self, parser):
        parser.add_argument("-d", "--dry", action="store_true", help="Dry run")

    def handle(self, *args, **kwargs):
        dry = kwargs["dry"]
        fetch_history(dry)
