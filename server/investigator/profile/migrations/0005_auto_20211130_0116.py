# Generated by Django 3.2.9 on 2021-11-30 01:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("oracle", "0006_auto_20211130_0116"),
        ("profile", "0004_auto_20211129_2357"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="holding",
            name="info",
        ),
        migrations.AddField(
            model_name="holding",
            name="base",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="+",
                to="oracle.asset",
            ),
        ),
        migrations.AddField(
            model_name="holding",
            name="circulating_supply",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="high_24h",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="image",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="inflation",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="last_updated",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="low_24h",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="market_cap",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="market_cap_change_percentage_24h",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="market_cap_rank",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="max_supply",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="price_change_percentage_1h",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="price_change_percentage_24h",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="price_change_percentage_30d",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="price_change_percentage_7d",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="total_supply",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="holding",
            name="value",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
