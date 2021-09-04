from django.contrib import admin

from .models import Category, Asset, Price, Provider, Service, Passive


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


admin.site.register(Category)
admin.site.register(Price)
admin.site.register(Provider)
admin.site.register(Passive)
