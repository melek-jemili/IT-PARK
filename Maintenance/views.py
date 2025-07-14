from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from .models import Maintenance
from .serializers import MaintenanceSerializer
from django.shortcuts import get_object_or_404
from Ticket.models import Ticket
from Users.models import Profile
#from django.contrib.auth.models import User

# Create your views here.

class CreationMaintenance(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = MaintenanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Maintenance créé avec succès.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class ListeMaintenance(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        maintenances = Maintenance.objects.all()
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DetailMaintenance(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        maintenance = get_object_or_404(Maintenance, pk=pk)
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data)
    
class ListeMaintenanceUtilisateur(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile  # ou Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profil introuvable'}, status=status.HTTP_404_NOT_FOUND)

        tickets_utilisateur = Ticket.objects.filter(personnel=profile)
        maintenances = Maintenance.objects.filter(ticket__in=tickets_utilisateur)

        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MaintenanceUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        maintenance = get_object_or_404(Maintenance, pk=pk)
        serializer = MaintenanceSerializer(maintenance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Maintenance mise à jour avec succès.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

#Statistiques pour Dashboard 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistique_MaintenanceTotal(request):
    total = Maintenance.objects.count()
    return Response({'Maintenances_Totales': total})


from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAdminUser])
def maintenance_par_equipement(request):
    data = (
        Maintenance.objects
        .values("codeEquipement__nom","codeEquipement__codeABarre")
        .annotate(total=Count("idMaintenance"))
        .order_by("-total")
    )
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def maintenance_par_unite(request):
    data = (
        Maintenance.objects
        .values("unite__codePostal","unite__nom")
        .annotate(total=Count("idMaintenance"))
        .order_by("-total")
    )
    return Response(data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nombre_maintenances_utilisateur(request):
    data = (
        Maintenance.objects
        .filter(ticket__personnel=request.user.profile)
        .values("ticket__personnel__matricule")
        .annotate(total=Count("idMaintenance"))
        .order_by("-total")
    )
    return Response(data)