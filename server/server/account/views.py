from django.shortcuts import render

from .models import Portfolio, Holding
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import PortfolioSerializer, HoldingSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows portfolios to be viewed or edited.
    """

    queryset = Portfolio.objects.all().order_by("-name")
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]


class HoldingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows holdings to be viewed or edited.
    """

    queryset = Holding.objects.all().order_by("-quantity")
    serializer_class = HoldingSerializer
    permission_classes = [permissions.IsAuthenticated]
