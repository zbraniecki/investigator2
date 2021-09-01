from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Portfolio, Wallet, Holding, Strategy, StrategyTarget


class StrategyTargetTabularInline(admin.TabularInline):
    model = StrategyTarget


class StrategyAdmin(admin.ModelAdmin):
    inlines = [StrategyTargetTabularInline]
    model = Strategy
    list_display = ["owner", "name"]


admin.site.register(User, UserAdmin)
admin.site.register(Portfolio)
admin.site.register(Wallet)
admin.site.register(Holding)
admin.site.register(Strategy, StrategyAdmin)
