from django.db import models
from server.account.models import User, Portfolio
from server.oracle.models import Asset


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
