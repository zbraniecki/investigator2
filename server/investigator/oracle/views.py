from django.shortcuts import render

from .models import Category, Tag, Asset, AssetInfo, Service
from investigator.user.models import Watchlist
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import permissions
from .serializers import (
    AssetSerializer,
    AssetInfoSerializer,
    ServiceSerializer,
    PublicWatchlistSerializer,
    CategorySerializer,
    TagSerializer,
)
from investigator.oracle.management.commands.fetch_assets import fetch_crypto_assets


class AssetViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows assets to be viewed or edited.
    """

    serializer_class = AssetSerializer

    def get_queryset(self):
        refresh = self.request.query_params.get("refresh")
        if refresh:
            user = self.request.user
            if user:
                fetch_crypto_assets(active=True, dry=False)
        queryset = Asset.objects.all().order_by("-symbol")
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

    serializer_class = PublicWatchlistSerializer

    def get_queryset(self):
        queryset = Watchlist.objects.filter(owner__isnull=True).order_by("-name")
        return queryset


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.filter(owner__isnull=True).order_by("-name")
        return queryset


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer

    def get_queryset(self):
        #  We need to move per-user tags to user
        # .filter(owner__isnull=True)
        queryset = Tag.objects.order_by("-name")
        return queryset
