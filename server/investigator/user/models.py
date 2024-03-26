from django.db import models
from django.contrib.auth.models import AbstractUser
from investigator.oracle.models import Asset, AssetInfo, Service, Tag, PassiveABC
from autoslug import AutoSlugField
import uuid


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    base_asset = models.ForeignKey(
        Asset, on_delete=models.SET_NULL, blank=True, null=True
    )


class Account(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    def __str__(self):
        if self.name:
            return f"{self.name}"
        else:
            return f"{self.owner}'s {self.service}"


class Holding(AssetInfo, PassiveABC):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.FloatField()
    account = models.ForeignKey(
        Account,
        related_name="holdings",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.quantity} {self.asset.symbol} ({self.account})"


class TransactionType(models.TextChoices):
    BUY = "BY", "Buy"
    SELL = "SL", "Sell"
    WITHDRAW = "WD", "Withdraw"
    DEPOSIT = "DP", "Deposit"
    INTEREST = "IN", "Interest"


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account = models.ForeignKey(
        Account, related_name="transactions", on_delete=models.CASCADE
    )
    holding = models.ForeignKey(
        Holding, related_name="transactions", null=True, on_delete=models.SET_NULL
    )
    asset = models.ForeignKey(Asset, related_name="+", on_delete=models.CASCADE)
    quantity = models.FloatField(blank=True, null=True)
    fee = models.FloatField(blank=True, null=True)
    fee_currency = models.ForeignKey(
        Asset, related_name="+", blank=True, null=True, on_delete=models.CASCADE
    )
    type = models.CharField(
        max_length=2,
        choices=TransactionType.choices,
        blank=True,
        null=True,
    )
    related = models.ForeignKey(
        "Transaction", blank=True, null=True, on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.timestamp} - {self.get_type_display()} {self.asset} {self.quantity} ({self.account})"


class Portfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    holdings = models.ManyToManyField(Holding, blank=True)
    portfolios = models.ManyToManyField("Portfolio", blank=True)
    accounts = models.ManyToManyField(Account, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    value = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.owner})"


class WatchlistType(models.TextChoices):
    ASSETS = "AS", "Assets"
    PORTFOLIO = "PL", "Portfolio"
    TAG = "TG", "Tag"
    DYNAMIC = "DN", "Dynamic"


class Watchlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=2,
        choices=WatchlistType.choices,
    )
    assets = models.ManyToManyField(Asset, blank=True)
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, blank=True, null=True
    )
    dynamic = models.CharField(max_length=100, blank=True, null=True)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.owner})"


class PortfolioUI(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    visible_order = models.IntegerField(blank=True, null=True)


class WatchlistUI(models.Model):
    watchlist = models.ForeignKey(Watchlist, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    visible_order = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.watchlist} ({self.user}, {self.visible_order})"
