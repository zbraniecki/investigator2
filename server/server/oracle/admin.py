from django.contrib import admin

from .models import (
    Category,
    Asset,
    Price,
    Provider,
    Service,
    Passive,
    PassiveChange,
    PassiveValue,
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
    inlines = [PassiveInline]


class PassiveChangeInline(admin.TabularInline):
    model = PassiveChange
    ordering = ("-date",)


class PassiveValueInline(admin.TabularInline):
    model = PassiveValue


@admin.register(PassiveValue)
class PassiveValueAdmin(admin.ModelAdmin):
    list_display = ("passive", "min", "max", "apy_min", "apy_max")
    ordering = ("passive",)


@admin.register(PassiveChange)
class PassiveChangeAdmin(admin.ModelAdmin):
    list_display = ("passive", "date", "value")
    ordering = (
        "passive",
        "-date",
    )


@admin.register(Passive)
class PassiveAdmin(admin.ModelAdmin):
    inlines = [PassiveValueInline, PassiveChangeInline]
    list_display = ("service", "asset", "type")
    list_filter = ("service", "asset")
    search_fields = ["service", "asset"]


admin.site.register(Category)
admin.site.register(Price)
admin.site.register(Provider)
