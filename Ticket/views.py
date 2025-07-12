from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from .models import Ticket
from Users.models import Profile
from .serializers import TicketSerializer
from django.shortcuts import get_object_or_404



# Create your views here.

class TicketCreation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Ticket créé avec succès.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class UserTicketListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Récupérer le profil lié à l'utilisateur connecté
        try:
            profile = request.user.profile  # ou Profile.objects.get(id=request.user)
        except Profile.DoesNotExist:
            return Response({"error": "Profil non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        # Filtrer les tickets par le profil
        tickets = Ticket.objects.filter(personnel=profile)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TicketDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)

    

class TicketSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        description = request.GET.get('q', '').strip()
        if not description:
            return Response([])  # Si la description est vide, on retourne vide

        unite_id = request.GET.get('unite', '').strip()
        if unite_id:
            tickets = Ticket.objects.filter(description__icontains=description, unite_id=unite_id)
        else:
            tickets = Ticket.objects.filter(description__icontains=description)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
    
class AdminTicketListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        tickets = Ticket.objects.all()
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TicketUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)
        serializer = TicketSerializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Ticket mis à jour avec succès.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    



#Statistiques pour Dashboard 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistique_ticketsTotal(request):
    total = Ticket.objects.count()
    return Response({'Tickets_Totales': total})


from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistiques_tickets_par_statut(request):
    data = (
        Ticket.objects
        .values('etat')
        .annotate(total=Count('idTicket'))
    )

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def tickets_par_equipement(request):
    data = (
        Ticket.objects
        .values("equipement__codeABarre")
        .annotate(total=Count("idTicket"))
        .order_by("-total")
    )
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def tickets_par_unite(request):
    data = (
        Ticket.objects
        .values("unite__codePostal")
        .annotate(total=Count("idTicket"))
        .order_by("-total")
    )
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def tickets_par_priorite(request):
    data = (
        Ticket.objects
        .values("priorite")
        .annotate(total=Count("idTicket"))
        .order_by("-total")
    )
    return Response(data)

from rest_framework.permissions import IsAuthenticated
@api_view(['GET'])
@permission_classes([IsAdminUser])
def stats_tickets_utilisateur(request):
    data = (
        Ticket.objects
        .values("personnel__matricule")
        .annotate(total=Count("idTicket"))
        .order_by("-total")
    )
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nombre_tickets_par_utilisateur(request):
    data = (
        Ticket.objects
        .filter(personnel=request.user.profile)
        .values("personnel__matricule")
        .annotate(total=Count("idTicket"))
        .order_by("-total")
    )
    return Response(data)