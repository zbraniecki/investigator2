from django.shortcuts import render

from .models import Strategy, Target, TargetChange
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import StrategySerializer, TargetSerializer, TargetChangeSerializer


class StrategyViewSet(viewsets.ModelViewSet):
    serializer_class = StrategySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Strategy.objects.filter(owner=user.id).order_by("-name")

class TargetViewSet(viewsets.ModelViewSet):
    serializer_class = TargetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Target.objects.filter(strategy__owner=user.id).order_by("-percent")


class TargetChangeViewSet(viewsets.ModelViewSet):
    serializer_class = TargetChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TargetChange.objects.filter(strategy__owner=user.id).order_by("-timestamp")
