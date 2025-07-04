# Generated by Django 5.1.3 on 2025-06-17 09:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Unite', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Personnel',
            fields=[
                ('matricule', models.CharField(max_length=10, primary_key=True, serialize=False, unique=True)),
                ('nom', models.CharField(max_length=100)),
                ('prenom', models.CharField(max_length=100)),
                ('cin', models.IntegerField(max_length=8, unique=True)),
                ('fonction', models.CharField(max_length=50)),
                ('dateNaissance', models.DateField()),
                ('region', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('telephone', models.CharField(max_length=15, unique=True)),
                ('unite', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Unite.unite')),
            ],
        ),
    ]
