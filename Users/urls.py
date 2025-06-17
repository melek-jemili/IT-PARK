# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    # Authentication endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    
    # User CRUD endpoints
    path('', views.UserListCreateView.as_view(), name='user-list-create'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Current user endpoints
    path('me/', views.current_user, name='current-user'),
    path('me/update/', views.update_current_user, name='update-current-user'),
   # path('me/profile/', views.current_user_profile, name='current-user-profile'),
    path('me/change-password/', views.change_password, name='change-password'),
    
    # Profile endpoints
    #path('profiles/', views.ProfileListView.as_view(), name='profile-list'),
    #path('profiles/<int:pk>/', views.ProfileDetailView.as_view(), name='profile-detail'),
    
    # Utility endpoints
    path('search/', views.search_users, name='search-users'),
    path('stats/', views.user_stats, name='user-stats'),
    path('<int:user_id>/toggle-status/', views.toggle_user_status, name='toggle-user-status'),
]