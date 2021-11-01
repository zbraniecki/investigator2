# Generated by Django 3.2.6 on 2021-11-01 02:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("oracle", "0004_alter_service_type"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="asset",
            name="inflation",
        ),
        migrations.AddField(
            model_name="assetinfo",
            name="inflation",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
