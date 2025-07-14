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

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Récupérer l'unité liée à l'utilisateur (en supposant que c'est dans request.user.profile.unite)
        # Adapté selon ta structure User/Profile/Unité
        user_profile = getattr(request.user, 'profile', None)
        if not user_profile:
            return Response({"detail": "Profil utilisateur introuvable."}, status=status.HTTP_400_BAD_REQUEST)

        unit = getattr(user_profile, 'unite', None)
        if not unit:
            return Response({"detail": "Unité utilisateur introuvable."}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrer équipements par unité de l'utilisateur
        equipements = Equipement.objects.filter(unite=unit)
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



#Statistiques pour Dashboard 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistique_equipementsTotal(request):
    total = Equipement.objects.count()
    return Response({'Equipements_Totales': total})


from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistiques_equipement_par_statut(request):
    data = (
        Equipement.objects
        .values('etat')
        .annotate(total=Count('codeABarre'))
    )

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def equipement_par_unite(request):
    data = (
        Equipement.objects
        .values("unite__nom","unite__codePostal")
        .annotate(total=Count("codeABarre"))
        .order_by("-total")
    )
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def equipement_par_utilisateur(request):
    data = (
        Equipement.objects
        .filter(unite__personnel=request.user.profile)
        .values("unite__personnel__matricule")
        .annotate(total=Count("codeABarre"))
        .order_by("-total")
    )
    return Response(data)