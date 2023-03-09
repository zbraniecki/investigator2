from django.contrib import admin

from .models import (
    Category,
    Tag,
    Asset,
    AssetInfo,
    AssetTags,
    InflationChange,
    Provider,
    Service,
    Passive,
    PassiveChange,
)

class AssetTagsInline(admin.TabularInline):
    model = AssetTags
    extra = 2

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    inlines = (AssetTagsInline,)
    list_display = ("name", "symbol", "market_cap_rank")
    list_filter = ("tags", "active")
    search_fields = ["symbol", "name"]
    ordering = (
        "market_cap_rank",
        "symbol",
    )

    def get_fields(self, request, obj=None, **kwargs):
        info_fields = AssetInfo._meta.get_fields()
        fields = super().get_fields(request, obj, **kwargs)

        for field in info_fields:
            fields.remove(field.name)

        for field in info_fields:
            fields.append(field.name)
        return fields


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
class InflationAdmin(admin.ModelAdmin):
    pass


class TagsInline(admin.TabularInline):
    model = Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    inlines = [TagsInline]
    list_display = ("name", "owner")
    list_filter = ("owner",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "owner")
    list_filter = (
        "category",
        "owner",
    )


admin.site.register(Provider)
