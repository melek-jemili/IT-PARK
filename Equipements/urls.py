from .views import *
from django.urls import path

urlpatterns = [
    path('list/', AdminEquipementListView.as_view(), name='equipement_list'),   
    path('detail/<int:pk>/', EquipementDetailView.as_view(), name='equipement_detail'),
    path('edit/<int:pk>/', EquipementUpdateView.as_view(), name='equipement_edit'),    
    path('delete/<int:pk>/', EquipementDeleteView.as_view(), name='equipement_delete'),
    path('add/', EquipementCreation.as_view(), name='equipement_add'),    
    path('search/', EquipementSearchView.as_view(), name='equipement_search'),
    path('list-for-user/', UserEquipementListView.as_view(), name='equipement_list_user'),
    path('stats/', statistique_equipementsTotal, name='equipement_stats'),
    path('statsParUnite/', equipement_par_unite, name='equipement_stats_unite'),
    path('statsParStatut/', statistiques_equipement_par_statut, name='equipement_stats_statut'),
    path('statsParUtilisateur/', equipement_par_utilisateur, name='equipement_stats_utilisateur'),
    
]