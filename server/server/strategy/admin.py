from django.contrib import admin
from .models import Strategy, StrategyTarget


class StrategyTargetTabularInline(admin.TabularInline):
    model = StrategyTarget


class StrategyAdmin(admin.ModelAdmin):
    inlines = [StrategyTargetTabularInline]
    model = Strategy
    list_display = ["owner", "name"]


admin.site.register(Strategy, StrategyAdmin)
