from django import forms
from .models import Ticket

class TicketForm(forms.ModelForm):
    class Meta:
        model = Ticket
        fields = [
            'idTicket',
            'dateCreation',
            'dateResolution',
            'description',
            'etat',
            'priorite',
            'unite',
            'personnel',
            'equipement'
        ]
        widgets = {
            'idTicket': forms.NumberInput(attrs={'class': 'form-control'}),
            'dateCreation': forms.DateTimeInput(attrs={'class': 'form-control'}),
            'dateResolution': forms.DateTimeInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'etat': forms.TextInput(attrs={'class': 'form-control'}),
            'priorite': forms.TextInput(attrs={'class': 'form-control'}),
            'unite': forms.Select(attrs={'class': 'form-control'}),
            'personnel': forms.Select(attrs={'class': 'form-control'}),
            'equipement': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'idTicket': 'Ticket ID',
            'dateCreation': 'Creation Date',
            'dateResolution': 'Resolution Date',
            'description': 'Description',
            'etat': 'State',
            'priorite': 'Priority',
            'unite': 'Unit',
            'personnel': 'Personnel',
            'equipement': 'Equipment'
        }