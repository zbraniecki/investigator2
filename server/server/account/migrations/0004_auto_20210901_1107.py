# Generated by Django 3.2.6 on 2021-09-01 11:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("oracle", "0001_initial"),
        ("account", "0003_auto_20210901_1056"),
    ]

    operations = [
        migrations.CreateModel(
            name="Strategy",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="holdings",
            field=models.ManyToManyField(blank=True, to="account.Holding"),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="portfolios",
            field=models.ManyToManyField(blank=True, to="account.Portfolio"),
        ),
        migrations.CreateModel(
            name="StrategyTarget",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("percent", models.FloatField()),
                (
                    "asset",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="oracle.asset"
                    ),
                ),
                (
                    "strategy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="account.strategy",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="strategy",
            name="portfolio",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="account.portfolio"
            ),
        ),
    ]
