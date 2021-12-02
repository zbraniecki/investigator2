# Generated by Django 3.2.9 on 2021-11-29 22:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("oracle", "0004_category_parent"),
        ("profile", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="watchlist",
            name="type",
        ),
        migrations.AddField(
            model_name="portfolio",
            name="tags",
            field=models.ManyToManyField(blank=True, to="oracle.Tag"),
        ),
        migrations.AddField(
            model_name="watchlist",
            name="tag",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="oracle.tag",
            ),
        ),
    ]