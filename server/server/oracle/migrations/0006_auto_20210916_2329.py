# Generated by Django 3.2.6 on 2021-09-16 23:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("oracle", "0005_service_assets"),
    ]

    operations = [
        migrations.RenameField(
            model_name="passive",
            old_name="apy",
            new_name="apy_min",
        ),
        migrations.RemoveField(
            model_name="passive",
            name="date_end",
        ),
        migrations.RemoveField(
            model_name="passive",
            name="date_start",
        ),
        migrations.AddField(
            model_name="passive",
            name="apy_max",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name="PassiveChange",
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
                ("date", models.DateField()),
                ("min", models.FloatField(blank=True, null=True)),
                ("max", models.FloatField(blank=True, null=True)),
                ("apy_min", models.FloatField()),
                ("apy_max", models.FloatField(blank=True, null=True)),
                (
                    "passive",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="history",
                        to="oracle.passive",
                    ),
                ),
            ],
        ),
    ]