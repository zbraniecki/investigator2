from django.db import models
from investigator.user.models import User, Portfolio
from investigator.oracle.models import Asset
import uuid


class Strategy(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.portfolio} {self.name} Strategy"


class Target(models.Model):
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

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["strategy", "asset"],
                name="unique_asset_strategy",
            )
        ]

    def __str__(self):
        if self.asset:
            return f"{self.strategy} - {self.asset}"
        else:
            return f"{self.strategy} - {self.portfolio}"


class TargetChange(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    strategy = models.ForeignKey(
        Strategy, related_name="changes", on_delete=models.CASCADE
    )
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    change = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.asset} - {self.change} - {self.timestamp}"


class StrategyUI(models.Model):
    strategy = models.ForeignKey(Strategy, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    visible_order = models.IntegerField(blank=True, null=True)
