from django.contrib import admin
from .models import Strategy, StrategyTarget, StrategyChange


def percent(input):
    return "{:.2%}".format(input)


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
    list_display = ["asset", "portfolio", "perc", "strategy"]
    ordering = ("asset",)

    def perc(self, obj):
        return percent(obj.percent)


@admin.register(StrategyChange)
class StrategyChangeAdmin(admin.ModelAdmin):
    list_display = ["timestamp", "asset", "perc", "strategy"]
    list_filter = (
        "timestamp",
        "target__asset",
    )
    ordering = ("-timestamp", "target__asset")

    def strategy(self, obj):
        return obj.target.strategy

    def asset(self, obj):
        return obj.target.asset

    def perc(self, obj):
        return percent(obj.change)
