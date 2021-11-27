from django.shortcuts import render

from .models import Portfolio, Holding, Watchlist, Account
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import (
    PortfolioSerializer,
    HoldingSerializer,
    WatchlistSerializer,
    AccountSerializer,
)


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


class WatchlistViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows watchlists to be viewed or edited.
    """

    queryset = Watchlist.objects.filter(owner__isnull=False).order_by("id")
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accounts to be viewed or edited.
    """

    queryset = Account.objects.filter(owner__isnull=False).order_by("id")
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
