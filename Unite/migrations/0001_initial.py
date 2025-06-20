# Generated by Django 5.1.3 on 2025-06-17 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Unite',
            fields=[
                ('codePostal', models.IntegerField(max_length=4, primary_key=True, serialize=False, unique=True)),
                ('nom', models.CharField(max_length=100, unique=True)),
                ('classe', models.CharField(max_length=50)),
                ('gouvernorat', models.CharField(max_length=100)),
                ('adresse', models.CharField(max_length=200)),
                ('nombreEmployes', models.IntegerField()),
                ('nombreGuichets', models.IntegerField()),
                ('chefUnité', models.CharField(max_length=100)),
                ('plageIP', models.CharField(max_length=100, unique=True)),
                ('typeLiason1', models.CharField(max_length=50)),
                ('typeLiason2', models.CharField(max_length=50)),
            ],
        ),
    ]
