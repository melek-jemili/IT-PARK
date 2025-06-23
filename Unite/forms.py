from django import forms
from .models import Unite

class UniteForm(forms.ModelForm):
    class Meta:
        model = Unite
        fields = [
            'codePostal',
            'nom',
            'classe',
            'gouvernorat',
            'adresse',
            'nombreEmployes',
            'nombreGuichets',
            'chefUnité',
            'plageIP',
            'typeLiason1',
            'typeLiason2',
            'idLiaison1',
            'idLiaison2'
        ]
        widgets = {
            'codePostal': forms.NumberInput(attrs={'class': 'form-control'}),
            'nom': forms.TextInput(attrs={'class': 'form-control'}),
            'classe': forms.TextInput(attrs={'class': 'form-control'}),
            'gouvernorat': forms.TextInput(attrs={'class': 'form-control'}),
            'adresse': forms.TextInput(attrs={'class': 'form-control'}),
            'nombreEmployes': forms.NumberInput(attrs={'class': 'form-control'}),
            'nombreGuichets': forms.NumberInput(attrs={'class': 'form-control'}),
            'chefUnité': forms.TextInput(attrs={'class': 'form-control'}),
            'plageIP': forms.TextInput(attrs={'class': 'form-control'}),
            'typeLiason1': forms.TextInput(attrs={'class': 'form-control'}),
            'typeLiason2': forms.TextInput(attrs={'class': 'form-control'}),
            'idLiaison1': forms.NumberInput(attrs={'class': 'form-control'}),
            'idLiaison2': forms.NumberInput(attrs={'class': 'form-control'})
        }