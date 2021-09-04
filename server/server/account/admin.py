from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Portfolio, Wallet, Holding, Transaction


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    autocomplete_fields = ["asset"]


admin.site.register(User, UserAdmin)
admin.site.register(Portfolio)
admin.site.register(Wallet)
admin.site.register(Transaction)
