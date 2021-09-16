from django.db import models
from autoslug import AutoSlugField


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

    def __str__(self):
        return f"{self.name}"


class Service(models.Model):
    id = AutoSlugField(primary_key=True, populate_from="get_provider_name", unique=True)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.provider.name} {self.name}"

    def get_provider_name(self):
        return f"{self.provider.id}-{self.name}"


class Passive(models.Model):
    class PassiveType(models.TextChoices):
        BUY = "ST", "Staking"
        SELL = "LP", "Liquidity Providing"
        WITHDRAW = "INT", "Interest"

    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    min = models.FloatField(blank=True, null=True)
    max = models.FloatField(blank=True, null=True)
    date_start = models.DateField(blank=True, null=True)
    date_end = models.DateField(blank=True, null=True)
    apy = models.FloatField()
    type = models.CharField(
        max_length=3,
        choices=PassiveType.choices,
    )

    def __str__(self):
        return f"{self.service} {self.asset} {self.type} ({self.date_start} - {self.date_end} | {self.min} - {self.max}) - {self.apy}"
