"""
URL configuration for gestion_parc_informatique project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    #ath('', include('parc_info.urls')),
    path('Users/' , include('Users.urls')),
    path('api/Users/', include('Users.urls')),
   #path('maintenance/', include('Maintenance.urls')),
   #path('unite/', include('Unite.urls')),
   #path('equipements/', include('Equipements.urls')),
   #path('ticket/', include('Ticket.urls')),
]
