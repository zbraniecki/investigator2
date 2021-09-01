from django.db import models
from django.contrib.auth.models import AbstractUser
from server.oracle.models import Asset


class User(AbstractUser):
    pass


class Wallet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.owner}'s {self.name}"


class Holding(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.FloatField()
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} {self.asset.symbol} ({self.wallet})"


class Portfolio(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    holdings = models.ManyToManyField(Holding, blank=True)
    portfolios = models.ManyToManyField("Portfolio", blank=True)

    def __str__(self):
        return f"{self.name} ({self.owner})"


class Strategy(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.portfolio} {self.name} Strategy"


class StrategyTarget(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    percent = models.FloatField()
    strategy = models.ForeignKey(Strategy, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.asset} - {self.percent}"
