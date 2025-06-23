from .views import *
from django.urls import path

urlpatterns = [
    path('list-for-admin/', AdminTicketListView.as_view(), name='ticket_list_admin'),
    path('list/', UserTicketListView.as_view(), name='ticket_list'),
    path('detail/<int:pk>/', TicketDetailView.as_view(), name='ticket_detail'),    
    path('add/', TicketCreation.as_view(), name='ticket_add'),
    path('search/', TicketSearchView.as_view(), name='ticket_search'),
]
