from django.db import models
from django.contrib.auth.models import User
from Unite.models import Unite
# Create your models here.
class Profile(models.Model):
    matricule = models.CharField(primary_key=True, max_length=10, unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    cin= models.IntegerField(unique=True)
    fonction = models.CharField(max_length=50)
    dateNaissance = models.DateField()
    region = models.CharField(max_length=200)
    email = models.EmailField(max_length=254, unique=True)
    telephone = models.CharField(max_length=15, unique=True)
    unite = models.ForeignKey(Unite, on_delete=models.CASCADE)
    id=models.ForeignKey(User, on_delete=models.CASCADE, related_name='Profile')

    def __str__(self):
        return self.matricule