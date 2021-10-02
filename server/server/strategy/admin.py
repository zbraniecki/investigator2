from django.contrib import admin
from .models import Strategy, StrategyTarget, StrategyAdjustment


class StrategyTargetTabularInline(admin.TabularInline):
    model = StrategyTarget
    ordering = ("-percent",)


@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    inlines = [StrategyTargetTabularInline]
    # list_display = ["strategy", "timestamp"]


admin.site.register(StrategyTarget)
admin.site.register(StrategyAdjustment)
