from django.shortcuts import render

from .models import Strategy, Target, TargetChange
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import StrategySerializer, TargetSerializer, TargetChangeSerializer


class StrategyViewSet(viewsets.ModelViewSet):
    queryset = Strategy.objects.all().order_by("-name")
    serializer_class = StrategySerializer
    permission_classes = [permissions.IsAuthenticated]


class TargetViewSet(viewsets.ModelViewSet):
    queryset = Target.objects.all().order_by("-percent")
    serializer_class = TargetSerializer
    permission_classes = [permissions.IsAuthenticated]


class TargetChangeViewSet(viewsets.ModelViewSet):
    queryset = TargetChange.objects.all().order_by("-timestamp")
    serializer_class = TargetChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
