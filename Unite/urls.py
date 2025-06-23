from .views import *
from django.urls import path

urlpatterns = [
    path('list/', AdminUniteListView.as_view(), name='unite_list'),
    path('detail/<int:pk>/', UniteDetailView.as_view(), name='unite_detail'),
    path('edit/<int:pk>/', UniteDetailView.as_view(), name='unite_edit'),    
    path('delete/<int:pk>/', UniteDeleteView.as_view(), name='unite_delete'),
    path('add/', UniteListCreateView.as_view(), name='unit_add'),
    path('search/', UniteSearchView.as_view(), name='unite_search'),

]