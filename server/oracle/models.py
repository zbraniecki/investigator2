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
    asset = models.ForeignKey(
        Asset, related_name="price", on_delete=models.CASCADE)
    base = models.ForeignKey(Asset, related_name="+", on_delete=models.CASCADE)
    value = models.FloatField()

    def __str__(self):
        return f"{self.asset.symbol}/{self.base.symbol} - {self.value}"
