# forms.py
from django import forms
from .models import Profile

class UserForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            'matricule', 'nom', 'prenom', 'cin', 'fonction', 'dateNaissance',
            'region', 'email', 'telephone', 'unite'
        ]
    