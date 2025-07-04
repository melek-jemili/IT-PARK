from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', MyTokenObtainPairView.as_view() , name="token_obtain_pair"),
    path('logout/', LogoutView.as_view()),
    path('profile/', profile_view , name='profile'),
    path('edit/', edit_user, name='edit_user'),
    path('delete/', delete_user, name='delete_user'),
    path('list/', list_users, name='list_users'),
    path(('change_password/'), change_password, name='change_password'),
]
