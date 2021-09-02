# Generated by Django 3.2.6 on 2021-09-01 19:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("oracle", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="passive",
            name="asset",
            field=models.ForeignKey(
                default=0,
                on_delete=django.db.models.deletion.CASCADE,
                to="oracle.asset",
            ),
            preserve_default=False,
        ),
    ]