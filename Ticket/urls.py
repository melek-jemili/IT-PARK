from .views import *
from django.urls import path

urlpatterns = [
    path('list-for-admin/', AdminTicketListView.as_view(), name='ticket_list_admin'),
    path('list/', UserTicketListView.as_view(), name='ticket_list'),
    path('detail/<int:pk>/', TicketDetailView.as_view(), name='ticket_detail'),    
    path('add/', TicketCreation.as_view(), name='ticket_add'),
    path('search/', TicketSearchView.as_view(), name='ticket_search'),
    path('edit/<int:pk>/', TicketUpdateView.as_view(), name='ticket_edit'),
    path('stats/', statistique_ticketsTotal, name='ticket_stats'),
    path('statParStatus/', statistiques_tickets_par_statut, name='ticket_stats_status'),
    path('statParUnite/', tickets_par_unite, name='ticket_stats_unite'),
    path('statParEquipement/', tickets_par_equipement, name='ticket_stats_equipement'),
    path('statParPriorite/', tickets_par_priorite, name='ticket_stats_priorite'),
    path('statParPersonne/', stats_tickets_utilisateur, name='ticket_stats_personne'),
    path('statParUtilisateur/', nombre_tickets_par_utilisateur, name='ticket_stats_utilisateur'),

]
