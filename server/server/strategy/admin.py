from django.contrib import admin
from .models import Strategy, StrategyTarget, StrategyChange


class StrategyChangeTabularInline(admin.TabularInline):
    model = StrategyChange
    fields = ("timestamp", "change")
    ordering = ("-timestamp",)


class StrategyTargetTabularInline(admin.TabularInline):
    model = StrategyTarget
    fields = ("asset", "portfolio", "percent")
    ordering = ("-percent",)


@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    inlines = [StrategyTargetTabularInline]
    # list_display = ["strategy", "timestamp"]


@admin.register(StrategyTarget)
class StrategyTargetAdmin(admin.ModelAdmin):
    inlines = [StrategyChangeTabularInline]
    # list_display = ["strategy", "timestamp"]


admin.site.register(StrategyChange)
