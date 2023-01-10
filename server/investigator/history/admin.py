from django.contrib import admin

from .models import TickData


@admin.register(TickData)
class TickDataAdmin(admin.ModelAdmin):
    pass
    # list_display = ("provider", "type", "name")
    # list_filter = ("type", "provider")
    search_fields = ["asset"]
    autocomplete_fields = ["asset"]
    # inlines = [PassiveInline]
