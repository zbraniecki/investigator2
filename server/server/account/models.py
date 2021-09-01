from django.db import models
from django.contrib.auth.models import AbstractUser
from server.oracle.models import Asset, Service


class User(AbstractUser):
    pass


class Wallet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    def __str__(self):
        if self.name:
            return f"{self.name}"
        else:
            return f"{self.owner}'s {self.service}"


class Holding(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.FloatField()
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} {self.asset.symbol} ({self.wallet})"


class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        BUY = "BY", "Buy"
        SELL = "SL", "Sell"
        WITHDRAW = "WD", "Withdraw"
        DEPOSIT = "DP", "Deposit"

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, related_name="+", on_delete=models.CASCADE)
    quantity = models.FloatField(blank=True, null=True)
    fee = models.FloatField(blank=True, null=True)
    fee_currency = models.ForeignKey(
        Asset, related_name="+", blank=True, null=True, on_delete=models.CASCADE
    )
    type = models.CharField(
        max_length=2,
        choices=TransactionType.choices,
    )
    related = models.ForeignKey(
        "Transaction", blank=True, null=True, on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.timestamp} - {self.get_type_display()} {self.asset} {self.quantity} ({self.wallet})"


class Portfolio(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    holdings = models.ManyToManyField(Holding, blank=True)
    portfolios = models.ManyToManyField("Portfolio", blank=True)

    def __str__(self):
        return f"{self.name} ({self.owner})"
