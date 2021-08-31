from django.contrib import admin

from .models import Category, Asset, Price

admin.site.register(Category)
admin.site.register(Asset)
admin.site.register(Price)
