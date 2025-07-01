from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from .models import Ticket
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
