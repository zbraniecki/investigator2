from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Portfolio, Account, Holding, Transaction, Watchlist, Holding


class HoldingInline(admin.TabularInline):
    model = Holding


class TransactionInline(admin.TabularInline):
    model = Transaction


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    inlines = [
        HoldingInline,
        TransactionInline,
    ]
    list_display = ("service", "owner")
    list_filter = ("service__provider", "service__type", "owner")
    search_fields = ["service", "owner"]
    ordering = ("service",)

    def provider(self, obj):
        return obj.service.provider.name


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ("account", "asset", "quantity")
    list_filter = ("account__service", "asset")
    autocomplete_fields = ["asset"]
    ordering = (
        "account",
        "asset",
        "-quantity",
    )


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "account", "type", "symbol", "quantity")
    search_fields = ["account", "asset", "type"]
    list_filter = ["timestamp", "account", "asset", "type"]
    ordering = ("-timestamp",)

    def symbol(self, obj):
        return obj.asset.symbol.upper()


admin.site.register(User, UserAdmin)
admin.site.register(Portfolio)
admin.site.register(Watchlist)
