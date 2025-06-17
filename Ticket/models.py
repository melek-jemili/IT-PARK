from django.db import models
from Unite.models import Unite
from Equipements.models import Equipement
from Users.models import Profile
# Create your models here.
class Ticket(models.Model):
    idTicket = models.AutoField(primary_key=True)
    dateCreation = models.DateTimeField(auto_now_add=True)
    dateResolution = models.DateTimeField(null=True, blank=True)
    description = models.TextField()
    etat = models.CharField(max_length=50)
    priorite = models.CharField(max_length=50)
    unite = models.ForeignKey(Unite, on_delete=models.CASCADE)
    personnel = models.ForeignKey(Profile, on_delete=models.CASCADE)
    equipement = models.ForeignKey(Equipement, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'Ticket {self.idTicket} - {self.etat}'