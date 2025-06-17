from django import forms
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = [ 'first_name', 'last_name','matricule','cin','email','telephone','fonction','dateNaissance','region','unite']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'matricule': forms.TextInput(attrs={'class': 'form-control'}),
            'cin': forms.NumberInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'telephone': forms.TextInput(attrs={'class': 'form-control'}),
            'fonction': forms.TextInput(attrs={'class': 'form-control'}),
            'dateNaissance': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'region': forms.TextInput(attrs={'class': 'form-control'}),
            'unite': forms.Select(attrs={'class': 'form-control'})
        }