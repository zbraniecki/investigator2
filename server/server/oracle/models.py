from django.db import models


class Category(models.Model):
    # owner
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Asset(models.Model):
    symbol = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return f"{self.name} ({self.symbol})"


class Price(models.Model):
    asset = models.ForeignKey(Asset, related_name="price", on_delete=models.CASCADE)
    base = models.ForeignKey(Asset, related_name="+", on_delete=models.CASCADE)
    value = models.FloatField()

    def __str__(self):
        return f"{self.asset.symbol}/{self.base.symbol} - {self.value}"


class Provider(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"


class Service(models.Model):
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.provider.name} {self.name}"


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
