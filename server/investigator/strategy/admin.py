from django.contrib import admin
from .models import Strategy, Target, TargetChange


def percent(input):
    return "{:.2%}".format(input)


class TargetChangeTabularInline(admin.TabularInline):
    model = TargetChange
    fields = ("timestamp", "change")
    ordering = ("-timestamp",)


class TargetTabularInline(admin.TabularInline):
    model = Target
    fields = ("asset", "portfolio", "percent")
    ordering = ("-percent",)


@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    inlines = [TargetTabularInline, TargetChangeTabularInline]
    # list_display = ["strategy", "timestamp"]


@admin.register(Target)
class TargetAdmin(admin.ModelAdmin):
    list_display = ["asset", "portfolio", "perc", "strategy"]
    ordering = ("asset",)

    def perc(self, obj):
        return percent(obj.percent)


@admin.register(TargetChange)
class TargetChangeAdmin(admin.ModelAdmin):
    list_display = ["timestamp", "asset", "perc", "strategy"]
    list_filter = (
        "timestamp",
        "asset",
    )
    ordering = ("-timestamp", "asset")

    def perc(self, obj):
        return percent(obj.change)
