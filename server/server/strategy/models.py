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


class StrategyKeyframe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    strategy = models.ForeignKey(
        Strategy, related_name="keyframes", on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.strategy} - {self.timestamp}"


class StrategyTarget(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    keyframe = models.ForeignKey(
        StrategyKeyframe, related_name="targets", on_delete=models.CASCADE
    )
    percent = models.FloatField()
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, blank=True, null=True)
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        if self.asset:
            return f"{self.keyframe} - {self.asset}"
        else:
            return f"{self.keyframe} - {self.portfolio}"
