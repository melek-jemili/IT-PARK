from .views import *
from django.urls import path

urlpatterns = [
    path('list/', ListeMaintenance.as_view(), name='maintenance_list'),   
    path('detail/<int:pk>/', DetailMaintenance.as_view(), name='maintenance_detail'),
    path('add/', CreationMaintenance.as_view(), name='maintenance_add'),
    path('list-for-user/', ListeMaintenanceUtilisateur.as_view(), name='maintenance_list_user'),
]