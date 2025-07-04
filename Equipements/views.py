from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from .models import Equipement
from .serializers import EquipementSerializer
from django.shortcuts import get_object_or_404
# Create your views here.

class EquipementCreation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = EquipementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Equipement créé avec succès.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class UserEquipementListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        unit_id = request.GET.get('unit_id')
        if unit_id:
            equipements = Equipement.objects.filter(unite_id=unit_id)
        else:
            equipements = Equipement.objects.all()
        serializer = EquipementSerializer(equipements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class EquipementDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        equipement = get_object_or_404(Equipement, pk=pk)
        serializer = EquipementSerializer(equipement)
        return Response(serializer.data)    
    
class EquipementSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pk = request.GET.get('q', '').strip()
        if not pk:
            return Response({'error': 'q parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        equipement = Equipement.objects.filter(pk=pk).first()
        if not equipement:
            return Response({'error': 'Equipement not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EquipementSerializer(equipement)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminEquipementListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        equipements = Equipement.objects.all()
        serializer = EquipementSerializer(equipements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EquipementUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        equipement = get_object_or_404(Equipement, pk=pk)
        serializer = EquipementSerializer(equipement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Equipement mis à jour avec succès.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class EquipementDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        equipement = get_object_or_404(Equipement, pk=pk)
        equipement.delete()
        return Response({'message': 'Equipement supprimé avec succès.'}, status=status.HTTP_204_NO_CONTENT)