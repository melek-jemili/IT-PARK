from django.db import models
from Unite.models import Unite
from Equipements.models import Equipement
# Create your models here.
class Maintenance(models.Model):
    idMaintenance = models.AutoField(primary_key=True)
    datecréation = models.DateTimeField()
    bureauSource = models.CharField(max_length=100)
    diagnostique = models.TextField()
    marque = models.CharField(max_length=50)
    typeMaintenance = models.CharField(max_length=50)
    unite = models.ForeignKey(Unite, on_delete=models.CASCADE)
    codeEquipement = models.ForeignKey(Equipement, on_delete=models.CASCADE)

    def __str__(self):
        return f'Maintenance {self.idMaintenance} - {self.typeMaintenance}'