# Generated by Django 5.1.3 on 2025-06-23 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Equipements', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equipement',
            name='codeABarre',
            field=models.IntegerField(primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='equipement',
            name='numeroSerie',
            field=models.IntegerField(unique=True),
        ),
    ]
