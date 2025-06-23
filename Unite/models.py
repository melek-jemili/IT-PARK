from django.db import models

class Unite(models.Model):
    codePostal = models.IntegerField(primary_key=True, unique=True)
    nom = models.CharField(max_length=100, unique=True)
    classe = models.CharField(max_length=50)
    gouvernorat = models.CharField(max_length=100)
    adresse = models.CharField(max_length=200)
    nombreEmployes = models.IntegerField()
    nombreGuichets = models.IntegerField()
    chefUnité = models.CharField(max_length=100)
    plageIP = models.CharField(max_length=100, unique=True)
    typeLiason1 = models.CharField(max_length=50)
    typeLiason2 = models.CharField(max_length=50)
    idLiaison1 = models.IntegerField(default=0)  # Ajoutez un default adapté à votre logique métier
    idLiaison2 = models.IntegerField(default=0)  # Ajoutez un default adapté à votre logique métier

    def __str__(self):
        return str(self.codePostal)