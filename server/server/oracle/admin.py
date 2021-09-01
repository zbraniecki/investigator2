from django.contrib import admin

from .models import Category, Asset, Price, Provider, Service, Passive

admin.site.register(Category)
admin.site.register(Asset)
admin.site.register(Price)
admin.site.register(Provider)
admin.site.register(Service)
admin.site.register(Passive)
