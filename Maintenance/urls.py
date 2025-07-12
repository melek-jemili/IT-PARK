from .views import *
from django.urls import path

urlpatterns = [
    path('list/', ListeMaintenance.as_view(), name='maintenance_list'),   
    path('detail/<int:pk>/', DetailMaintenance.as_view(), name='maintenance_detail'),
    path('add/', CreationMaintenance.as_view(), name='maintenance_add'),
    path('list-for-user/', ListeMaintenanceUtilisateur.as_view(), name='maintenance_list_user'),
    path('edit/<int:pk>/', MaintenanceUpdateView.as_view(), name='maintenance_edit'),
    path('stats/', statistique_MaintenanceTotal, name='maintenance_stats'),
    path('statsParUnite/', maintenance_par_unite, name='maintenance_stats'),
    path('statsParEquipement/',maintenance_par_equipement, name='maintenance_stats_equipement'),
    path('statsParPersonne/', nombre_maintenances_utilisateur, name='maintenance_stats_personne'),
         

]