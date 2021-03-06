# Generated by Django 3.2.9 on 2021-11-29 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profile", "0002_auto_20211129_2253"),
    ]

    operations = [
        migrations.AddField(
            model_name="watchlist",
            name="type",
            field=models.CharField(
                choices=[
                    ("AS", "Assets"),
                    ("PL", "Portfolio"),
                    ("TG", "Tag"),
                    ("DN", "Dynamic"),
                ],
                default="DN",
                max_length=2,
            ),
            preserve_default=False,
        ),
    ]
