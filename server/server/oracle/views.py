from django.shortcuts import render

from .models import Category, Asset, Price, Service
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import (
    CategorySerializer,
    AssetSerializer,
    PriceSerializer,
    ServiceSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """

    queryset = Category.objects.all().order_by("-name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class AssetViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows assets to be viewed or edited.
    """

    queryset = Asset.objects.all().order_by("-symbol")
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]


class PriceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows prices to be viewed or edited.
    """

    queryset = Price.objects.all().order_by("-asset__symbol")
    serializer_class = PriceSerializer
    # permission_classes = [permissions.IsAuthenticated]


class ServiceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows services to be viewed or edited.
    """

    queryset = Service.objects.all().order_by("-name")
    serializer_class = ServiceSerializer
    # permission_classes = [permissions.IsAuthenticated]
