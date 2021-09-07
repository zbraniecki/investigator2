from django.shortcuts import render

from .models import Portfolio, Holding, Watchlist
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import PortfolioSerializer, HoldingSerializer, WatchlistSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows portfolios to be viewed or edited.
    """

    queryset = Portfolio.objects.all().order_by("-name")
    serializer_class = PortfolioSerializer
    # permission_classes = [permissions.IsAuthenticated]


class HoldingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows holdings to be viewed or edited.
    """

    queryset = Holding.objects.all().order_by("-quantity")
    serializer_class = HoldingSerializer
    permission_classes = [permissions.IsAuthenticated]


class WatchlistViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows watchlists to be viewed or edited.
    """

    queryset = Watchlist.objects.all().order_by("id")
    serializer_class = WatchlistSerializer
    # permission_classes = [permissions.IsAuthenticated]
