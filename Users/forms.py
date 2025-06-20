from django import forms
from .models import Profile

class UserForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            'matricule',
            'nom',
            'prenom',
            'cin',
            'fonction',
            'dateNaissance',
            'region',
            'email',
            'telephone',
            'unite'
        ]
        widgets = {
            'matricule': forms.TextInput(attrs={'class': 'form-control'}),
            'nom': forms.TextInput(attrs={'class': 'form-control'}),
            'prenom': forms.TextInput(attrs={'class': 'form-control'}),
            'cin': forms.NumberInput(attrs={'class': 'form-control'}),
            'fonction': forms.TextInput(attrs={'class': 'form-control'}),
            'dateNaissance': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'region': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'telephone': forms.TextInput(attrs={'class': 'form-control'}),
            'unite': forms.Select(attrs={'class': 'form-control'}),
        }