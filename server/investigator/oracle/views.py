from django.shortcuts import render

from .models import Category, Asset, AssetInfo, Service
from investigator.profile.models import Watchlist
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import (
    CategorySerializer,
    AssetSerializer,
    AssetInfoSerializer,
    ServiceSerializer,
    PublicWatchlistSerializer,
)
from investigator.oracle.management.commands.fetch_info import fetch_crypto_info


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """

    queryset = Category.objects.all().order_by("-name")
    serializer_class = CategorySerializer


class AssetViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows assets to be viewed or edited.
    """

    queryset = Asset.objects.all().order_by("-symbol")
    serializer_class = AssetSerializer


class AssetInfoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows prices to be viewed or edited.
    """

    serializer_class = AssetInfoSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        refresh = self.request.query_params.get('refresh')
        if refresh:
            user = self.request.user
            if user:
                fetch_crypto_info()
        queryset = AssetInfo.objects.all().order_by("-asset__symbol")
        return queryset

class ServiceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows services to be viewed or edited.
    """

    queryset = Service.objects.all().order_by("-name")
    serializer_class = ServiceSerializer


class PublicWatchlistsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows public watchlists to be viewed.
    """

    queryset = Watchlist.objects.filter(owner__isnull=True).order_by("-name")
    serializer_class = PublicWatchlistSerializer
