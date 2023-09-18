from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User,
    Portfolio,
    Account,
    Holding,
    Transaction,
    Watchlist,
    Holding,
    PortfolioUI,
    WatchlistUI,
)
from investigator.strategy.models import StrategyUI
from investigator.oracle.models import AssetInfo, PassiveABC


class HoldingInline(admin.TabularInline):
    model = Holding
    fields = ["asset", "quantity", "account"]


class TransactionInline(admin.TabularInline):
    model = Transaction
    max_num = 3
    extra = 0
    fields = ["asset", "quantity", "type", "timestamp"]
    readonly_fields = ["asset", "quantity", "type", "timestamp"]
    ordering = ("-timestamp",)


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    inlines = [
        HoldingInline,
        TransactionInline,
    ]
    list_display = ("label", "service", "owner")
    list_filter = ("service__provider", "service__type", "owner")
    search_fields = ["service", "owner"]
    ordering = ("service",)

    def label(self, obj):
        return obj.__str__()


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ("account", "asset", "quantity")
    list_filter = ("account__service", "asset")
    search_fields = ["asset__symbol"]
    autocomplete_fields = ["asset"]
    ordering = (
        "account",
        "asset",
        "-quantity",
    )

    def get_fields(self, request, obj=None, **kwargs):
        info_fields = AssetInfo._meta.get_fields()
        passive_fields = PassiveABC._meta.get_fields()
        fields = super().get_fields(request, obj, **kwargs)

        for field in info_fields:
            fields.remove(field.name)
        for field in passive_fields:
            fields.remove(field.name)

        for field in info_fields:
            fields.append(field.name)
        for field in passive_fields:
            fields.append(field.name)
        return fields


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("name", "owner")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "account", "type", "symbol", "quantity")
    search_fields = ["account", "asset", "type"]
    list_filter = ["timestamp", "account", "asset", "type"]
    ordering = ("-timestamp",)

    def symbol(self, obj):
        return obj.asset.symbol.upper()


class PortfolioUIInline(admin.TabularInline):
    model = PortfolioUI


class WatchlistUIInline(admin.TabularInline):
    model = WatchlistUI


class StrategyUIInline(admin.TabularInline):
    model = StrategyUI


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    inlines = [
        PortfolioUIInline,
        WatchlistUIInline,
        StrategyUIInline,
    ]

@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    pass
    list_display = ("name", "owner")

admin.site.register(PortfolioUI)
admin.site.register(WatchlistUI)
admin.site.register(StrategyUI)
