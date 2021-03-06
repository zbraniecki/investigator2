from django.shortcuts import render
from django.contrib.auth import get_user_model
from .models import Portfolio, Holding, Watchlist, Account
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import (
    PortfolioSerializer,
    HoldingSerializer,
    WatchlistSerializer,
    AccountSerializer,
    UserSerializer,
)


class PortfolioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows portfolios to be viewed or edited.
    """

    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(owner=user).order_by("-name")


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

    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Watchlist.objects.filter(owner=user).order_by("-id")


class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accounts to be viewed or edited.
    """

    queryset = Account.objects.filter(owner__isnull=False).order_by("id")
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        model = get_user_model()
        user = self.request.user
        return model.objects.filter(id=user.id).order_by("-id")
