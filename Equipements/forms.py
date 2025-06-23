from django import forms
from .models import Equipement

class EquipementForm(forms.ModelForm):
    class Meta:
        model = Equipement
        fields = [
            'codeEquipement',
            'nom',
            'marque',
            'typeEquipement',
            'dateAchat',
            'dateMiseEnService',
            'etat',
            'unite',
            'personnel'
        ]
        widgets = {
            'codeEquipement': forms.TextInput(attrs={'class': 'form-control'}),
            'nom': forms.TextInput(attrs={'class': 'form-control'}),
            'marque': forms.TextInput(attrs={'class': 'form-control'}),
            'typeEquipement': forms.TextInput(attrs={'class': 'form-control'}),
            'dateAchat': forms.DateTimeInput(attrs={'class': 'form-control'}),
            'dateMiseEnService': forms.DateTimeInput(attrs={'class': 'form-control'}),
            'etat': forms.TextInput(attrs={'class': 'form-control'}),
            'unite': forms.Select(attrs={'class': 'form-control'}),
            'personnel': forms.Select(attrs={'class': 'form-control'})
        }
        labels = {
            'codeEquipement': 'Equipment Code',
            'nom': 'Name',
            'marque': 'Brand',
            'typeEquipement': 'Equipment Type',
            'dateAchat': 'Purchase Date',
            'dateMiseEnService': 'Commissioning Date',
            'etat': 'State',
            'unite': 'Unit',
            'personnel': 'Personnel'
        }
