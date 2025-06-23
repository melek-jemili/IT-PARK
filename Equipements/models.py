from django.db import models
from Unite.models import Unite
# Create your models here.
class Equipement(models.Model):
    codeABarre = models.IntegerField(primary_key=True, unique=True)
    nom = models.CharField(max_length=100, unique=True)
    numeroSerie = models.IntegerField(unique=True)
    modele = models.CharField(max_length=50)
    marque = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    etat = models.CharField(max_length=50)
    dateMiseEnService = models.DateField()
    adresseIP = models.CharField(max_length=15, unique=True)
    adresseMAC = models.CharField(max_length=17, unique=True)
    unite = models.ForeignKey(Unite, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.codeABarre)