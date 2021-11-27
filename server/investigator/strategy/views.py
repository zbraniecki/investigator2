from django.shortcuts import render

from .models import Strategy
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import StrategySerializer


class StrategyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows strategies to be viewed or edited.
    """

    queryset = Strategy.objects.all().order_by("-name")
    serializer_class = StrategySerializer
    permission_classes = [permissions.IsAuthenticated]
