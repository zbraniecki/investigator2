from django.contrib import admin

from .models import (
    Category,
    Asset,
    InflationChange,
    AssetInfo,
    Provider,
    Service,
    Passive,
    PassiveChange,
)


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_filter = ("categories", "active")
    search_fields = ["symbol", "name"]
    ordering = ("symbol",)


class PassiveInline(admin.TabularInline):
    model = Passive


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("provider", "type", "name")
    list_filter = ("type", "provider")
    search_fields = ["provider__name", "name", "type"]
    inlines = [PassiveInline]


class PassiveChangeInline(admin.TabularInline):
    model = PassiveChange
    ordering = ("-date",)


@admin.register(PassiveChange)
class PassiveChangeAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "symbol",
        "date",
        "type",
        "apy_min_change",
        "apy_max_change",
        "min_change",
        "max_change",
    )
    ordering = (
        "-date",
        "passive__service",
        "passive__asset__symbol",
        "apy_min_change",
    )

    def service(self, obj):
        return f"{obj.passive.service}"

    def symbol(self, obj):
        return f"{obj.passive.asset.symbol.upper()}"


@admin.register(Passive)
class PassiveAdmin(admin.ModelAdmin):
    inlines = [PassiveChangeInline]
    list_display = (
        "service",
        "symbol",
        "type",
        "name",
        "min",
        "max",
        "apy_min",
        "apy_max",
    )
    list_filter = ("service", "asset")
    search_fields = ["service", "asset"]
    ordering = (
        "service",
        "asset",
        "name",
        "min",
        "max",
    )

    def symbol(self, obj):
        return f"{obj.asset.symbol.upper()}"


@admin.register(InflationChange)
class AssetAdmin(admin.ModelAdmin):
    pass


admin.site.register(Category)
admin.site.register(AssetInfo)
admin.site.register(Provider)
