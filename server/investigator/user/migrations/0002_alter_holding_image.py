# Generated by Django 4.1.4 on 2023-01-02 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="holding",
            name="image",
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]
