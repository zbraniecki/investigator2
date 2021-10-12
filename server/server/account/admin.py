from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Portfolio, Wallet, Holding, Transaction, Watchlist, Holding


class HoldingInline(admin.TabularInline):
    model = Holding


class TransactionInline(admin.TabularInline):
    model = Transaction


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    inlines = [
        HoldingInline,
        TransactionInline,
    ]
    list_display = ("service", "owner")
    list_filter = ("service", "owner")
    search_fields = ["service", "owner"]
    ordering = ("service",)


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ("wallet", "asset", "quantity")
    autocomplete_fields = ["asset"]
    ordering = (
        "wallet",
        "asset",
        "-quantity",
    )


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "wallet", "type", "symbol", "quantity")
    search_fields = ["wallet", "asset", "type"]
    list_filter = ["timestamp", "wallet", "asset", "type"]
    ordering = ("-timestamp",)

    def symbol(self, obj):
        return obj.asset.symbol.upper()


admin.site.register(User, UserAdmin)
admin.site.register(Portfolio)
admin.site.register(Watchlist)
