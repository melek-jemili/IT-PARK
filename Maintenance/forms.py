from django import forms
from .models import Maintenance

class MaintenanceForm(forms.ModelForm):
    class Meta:
        model = Maintenance
        fields = [
            'datecréation',
            'bureauSource',
            'diagnostique',
            'marque',
            'typeMaintenance',
            'unite',
            'codeEquipement'
        ]
        widgets = {
            'datecréation': forms.DateTimeInput(attrs={'class': 'form-control'}),
            'bureauSource': forms.TextInput(attrs={'class': 'form-control'}),
            'diagnostique': forms.Textarea(attrs={'class': 'form-control'}),
            'marque': forms.TextInput(attrs={'class': 'form-control'}),
            'typeMaintenance': forms.TextInput(attrs={'class': 'form-control'}),
            'unite': forms.Select(attrs={'class': 'form-control'}),
            'codeEquipement': forms.Select(attrs={'class': 'form-control'})
        }