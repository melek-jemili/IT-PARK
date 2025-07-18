from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from .models import Unite
from .serializers import UniteSerializer
from django.shortcuts import get_object_or_404

class UniteListCreateView(APIView):
    def post(self, request):
        serializer = UniteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Unité créée avec succès.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UniteDetailView(APIView):
    def get(self, request, pk):
        unite = get_object_or_404(Unite, pk=pk)
        serializer = UniteSerializer(unite)
        return Response(serializer.data)

class UniteUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def put(self, request, pk):
        unite = get_object_or_404(Unite, pk=pk)
        serializer = UniteSerializer(unite, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Unité mise à jour avec succès.", 'data': serializer.data})
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UniteDeleteView(APIView):
    def delete(self, request, pk):
        unite = get_object_or_404(Unite, pk=pk)
        unite.delete()
        return Response({"message": "Unité supprimée avec succès."}, status=status.HTTP_204_NO_CONTENT)




class UniteSearchView(APIView):
    def get(self, request):
        code_postal = request.GET.get('q', '').strip()
        if not code_postal.isdigit():
            return Response([])  # Si ce n'est pas un nombre, on retourne vide

        unites = Unite.objects.filter(codePostal=int(code_postal))
        serializer = UniteSerializer(unites, many=True)
        return Response(serializer.data)


class AdminUniteListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        unites = Unite.objects.all()
        serializer = UniteSerializer(unites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



#Statistiques pour Dashboard 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistique_unitTotal(request):
    total = Unite.objects.count()
    return Response({'Unités_Totales': total})


from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistiques_unites_par_gouvernorat(request):
    data = (
        Unite.objects
        .values('gouvernorat')
        .annotate(total=Count('codePostal'))
        .order_by('gouvernorat')
    )

    # format: [{gouvernorat: "Tunis", total: 5}, ...]
    return Response(data)