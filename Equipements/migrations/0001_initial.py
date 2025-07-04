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
            name='Equipement',
            fields=[
                ('codeABarre', models.IntegerField(max_length=15, primary_key=True, serialize=False, unique=True)),
                ('nom', models.CharField(max_length=100, unique=True)),
                ('numeroSerie', models.IntegerField(max_length=50, unique=True)),
                ('modele', models.CharField(max_length=50)),
                ('marque', models.CharField(max_length=50)),
                ('type', models.CharField(max_length=50)),
                ('etat', models.CharField(max_length=50)),
                ('dateMiseEnService', models.DateField()),
                ('adresseIP', models.CharField(max_length=15, unique=True)),
                ('adresseMAC', models.CharField(max_length=17, unique=True)),
                ('unite', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Unite.unite')),
            ],
        ),
    ]
