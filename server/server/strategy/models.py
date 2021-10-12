from django.db import models
from server.account.models import User, Portfolio
from server.oracle.models import Asset
import uuid


class Strategy(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.portfolio} {self.name} Strategy"


class StrategyTarget(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    strategy = models.ForeignKey(
        Strategy, related_name="targets", on_delete=models.CASCADE
    )
    percent = models.FloatField()
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, blank=True, null=True)
    contains = models.ManyToManyField(Asset, related_name="+", blank=True)
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        if self.asset:
            return f"{self.strategy} - {self.asset}"
        else:
            return f"{self.strategy} - {self.portfolio}"


class StrategyChange(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    target = models.ForeignKey(
        StrategyTarget, related_name="changes", on_delete=models.CASCADE
    )
    change = models.FloatField()
    timestamp = models.DateField()

    def __str__(self):
        return f"{self.target.asset} - {self.change} - {self.timestamp}"
