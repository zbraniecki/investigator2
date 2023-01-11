from django.db import models
from investigator.oracle.models import Asset


class TickData(models.Model):
    class Meta:
        indexes = [models.Index(fields=["asset"]), models.Index(fields=["timestamp"])]

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    open = models.DecimalField(decimal_places=5, max_digits=10)
    close = models.DecimalField(decimal_places=5, max_digits=10)
    low = models.DecimalField(decimal_places=5, max_digits=10)
    high = models.DecimalField(decimal_places=5, max_digits=10)

    def __str__(self):
        return f"{self.asset.symbol} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} (o: {self.open}, h: {self.high}, l: {self.low}, c: {self.close})"
