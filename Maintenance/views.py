from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from .models import Maintenance
from .serializers import MaintenanceSerializer
from django.shortcuts import get_object_or_404

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
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        maintenance = get_object_or_404(Maintenance, pk=pk)
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data)
    
class ListeMaintenanceUtilisateur(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        ticket_ids = request.query_params.getlist('ticket_ids')
        if not ticket_ids:
            return Response({'error': 'Veuillez fournir les IDs des tickets.'}, status=status.HTTP_400_BAD_REQUEST)
        maintenances = Maintenance.objects.filter(ticket__id__in=ticket_ids, ticket__utilisateur=request.user)
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)