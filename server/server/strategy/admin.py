from django.contrib import admin
from .models import Strategy, StrategyKeyframe, StrategyTarget


class StrategyTargetTabularInline(admin.TabularInline):
    model = StrategyTarget


class StrategyKeyframeAdmin(admin.ModelAdmin):
    inlines = [StrategyTargetTabularInline]
    model = StrategyKeyframe
    list_display = ["strategy", "timestamp"]


admin.site.register(Strategy)
admin.site.register(StrategyKeyframe, StrategyKeyframeAdmin)
