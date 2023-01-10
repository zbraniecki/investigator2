from django.db import models
from investigator.oracle.models import Asset


class TickData(models.Model):
    class Meta:
        indexes = [models.Index(fields=["timestamp"])]

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    open = models.DecimalField(decimal_places=5, max_digits=10)
    close = models.DecimalField(decimal_places=5, max_digits=10)
    low = models.DecimalField(decimal_places=5, max_digits=10)
    high = models.DecimalField(decimal_places=5, max_digits=10)
