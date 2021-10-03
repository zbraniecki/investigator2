from django.db import models
from autoslug import AutoSlugField


def percent(input):
    return "{:.0%}".format(input)


class Category(models.Model):
    # owner
    id = AutoSlugField(primary_key=True, populate_from="name", unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class ActiveAssetManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(active=True)


class InactiveAssetManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(active=False)


class AllAssetManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()


class Asset(models.Model):
    objects = ActiveAssetManager()
    inactive_objects = InactiveAssetManager()
    all_objects = AllAssetManager()

    id = AutoSlugField(
        primary_key=True, populate_from="symbol", unique=True, manager=all_objects
    )

    symbol = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    categories = models.ManyToManyField(Category)
    api_id = models.CharField(max_length=100, blank=True, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.symbol})"


class Price(models.Model):
    asset = models.ForeignKey(Asset, related_name="price", on_delete=models.CASCADE)
    base = models.ForeignKey(Asset, related_name="+", on_delete=models.CASCADE)
    value = models.FloatField()
    market_cap = models.FloatField(blank=True, null=True)
    price_change_percentage_24h = models.FloatField(blank=True, null=True)
    market_cap_change_percentage_24h = models.FloatField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.asset.symbol}/{self.base.symbol} - {self.value}"


class Provider(models.Model):
    id = AutoSlugField(primary_key=True, populate_from="name", unique=True)
    name = models.CharField(max_length=100)
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


class Service(models.Model):
    id = AutoSlugField(primary_key=True, populate_from="get_provider_name", unique=True)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    url = models.URLField(blank=True, null=True)
    assets = models.ManyToManyField(Asset, blank=True)

    def __str__(self):
        return f"{self.provider.name} {self.name}"

    def get_provider_name(self):
        return f"{self.provider.id}-{self.name}"


class PassiveType(models.TextChoices):
    STAKING = "ST", "Staking"
    LP = "LP", "Liquidity Providing"
    INTEREST = "INT", "Interest"


class Passive(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    type = models.CharField(
        max_length=3,
        choices=PassiveType.choices,
    )
    name = models.CharField(max_length=100, blank=True, null=True)
    min = models.FloatField(blank=True, null=True)
    max = models.FloatField(blank=True, null=True)
    apy_min = models.FloatField()
    apy_max = models.FloatField(blank=True, null=True)

    def __str__(self):
        if self.min and self.max:
            rng = f" ({self.min}-{self.max})"
        elif self.min and not self.max:
            rng = f" ({self.min}-)"
        elif self.max and not self.min:
            rng = f" (-{self.max})"
        else:
            rng = ""

        if self.apy_min and self.apy_max:
            apy = f"{percent(self.apy_min)}-{percent(self.apy_max)}"
        elif self.apy_min and not self.apy_max:
            apy = f"{percent(self.apy_min)}"
        elif self.apy_max and not self.apy_min:
            apy = f"-{percent(self.apy_max)}"
        else:
            apy = ""
        return f"{self.service} {self.asset.symbol.upper()} {PassiveType(self.type).label} {rng} - {apy}"


class PassiveChangeType(models.TextChoices):
    ADDED = "ADD", "Added"
    REMOVED = "REM", "Removed"
    CHANGED = "CHG", "Changed"


class PassiveChange(models.Model):
    passive = models.ForeignKey(
        Passive, related_name="history", on_delete=models.CASCADE
    )
    date = models.DateField()
    type = models.CharField(
        max_length=3,
        choices=PassiveChangeType.choices,
    )
    apy_min_change = models.FloatField(blank=True, null=True)
    apy_max_change = models.FloatField(blank=True, null=True)
    min_change = models.FloatField(blank=True, null=True)
    max_change = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.passive} {self.date} {self.type}"
