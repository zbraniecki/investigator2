# Generated by Django 4.1.4 on 2023-01-10 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("history", "0001_initial"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="tickdata",
            index=models.Index(
                fields=["timestamp"], name="history_tic_timesta_581040_idx"
            ),
        ),
    ]
