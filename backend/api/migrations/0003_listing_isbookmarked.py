# Generated by Django 4.2.5 on 2023-11-13 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_bookmark'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='isBookmarked',
            field=models.BooleanField(default=False),
        ),
    ]
