from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Portfolio, Wallet, Holding, Transaction

admin.site.register(User, UserAdmin)
admin.site.register(Portfolio)
admin.site.register(Wallet)
admin.site.register(Holding)
admin.site.register(Transaction)
