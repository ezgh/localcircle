# Generated by Django 4.2.5 on 2023-11-25 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='is_live',
            field=models.BooleanField(default=False),
        ),
    ]
