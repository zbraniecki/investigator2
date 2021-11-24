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


class InflationChange(models.Model):
    asset = models.ForeignKey(
        Asset, related_name="inflation_changes", on_delete=models.CASCADE
    )
    change = models.FloatField()
    timestamp = models.DateField()

    def __str__(self):
        return f"{self.asset} - {self.change} - {self.timestamp}"


class AssetInfo(models.Model):
    asset = models.ForeignKey(Asset, related_name="info", on_delete=models.CASCADE)
    base = models.ForeignKey(Asset, related_name="+", on_delete=models.CASCADE)
    value = models.FloatField()
    high_24h = models.FloatField(blank=True, null=True)
    low_24h = models.FloatField(blank=True, null=True)
    market_cap_rank = models.IntegerField(blank=True, null=True)
    market_cap = models.FloatField(blank=True, null=True)
    market_cap_change_percentage_24h = models.FloatField(blank=True, null=True)
    price_change_percentage_1h = models.FloatField(blank=True, null=True)
    price_change_percentage_24h = models.FloatField(blank=True, null=True)
    price_change_percentage_7d = models.FloatField(blank=True, null=True)
    price_change_percentage_30d = models.FloatField(blank=True, null=True)
    circulating_supply = models.FloatField(blank=True, null=True)
    total_supply = models.FloatField(blank=True, null=True)
    max_supply = models.FloatField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    image = models.CharField(max_length=200, blank=True, null=True)
    inflation = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.asset.symbol}/{self.base.symbol} - {self.value}"


class Provider(models.Model):
    id = AutoSlugField(primary_key=True, populate_from="name", unique=True)
    name = models.CharField(max_length=100)
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


class ServiceType(models.TextChoices):
    WALLET = "WALT", "Wallet"
    CHECKING_ACCOUNT = "CHAC", "Checking Account"
    SAVINGS_ACCOUNT = "SAAC", "Savings Account"
    INVESTMENT_ACCOUNT = "INAC", "Investment Account"
    RETIREMENT_ACCOUNT = "REAC", "Retirement Account"
    CREDIT_ACCOUNT = "CRAC", "Credit Account"
    LOAN = "LOAN", "Loan Account"


class Service(models.Model):
    id = AutoSlugField(primary_key=True, populate_from="get_provider_name", unique=True)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    assets = models.ManyToManyField(Asset, blank=True)
    type = models.CharField(
        max_length=4,
        choices=ServiceType.choices,
    )

    def __str__(self):
        name = self.name if self.name else self.get_type_display()
        return f"{self.provider.name} {name}"

    def get_provider_name(self):
        name = self.name if self.name else self.get_type_display()
        return f"{self.provider.id}-{name}"


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
