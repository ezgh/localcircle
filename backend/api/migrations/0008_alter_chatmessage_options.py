# Generated by Django 4.2.5 on 2023-11-15 10:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_chatmessage'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chatmessage',
            options={'ordering': ['date'], 'verbose_name_plural': 'Message'},
        ),
    ]