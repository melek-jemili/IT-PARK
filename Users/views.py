from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer
from .forms import UserForm
from .models import Profile  # Assurez-vous que le nom correspond à votre modèle

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        profile = Profile.objects.get(id=request.user)
        serializer = UserSerializer(profile)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({"error": "Profil non trouvé"}, status=404)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def edit_user(request):
    user = request.user

    try:
        profile = Profile.objects.get(id=user.id)
        created = False
    except Profile.DoesNotExist:
        profile = Profile(id=user)  # crée un nouveau profil lié à l'utilisateur
        created = True

    form = UserForm(request.data, instance=profile)

    if form.is_valid():
        form.save()
        return Response(
            {"message": "Profil créé avec succès." if created else "Profil mis à jour avec succès."},
            status=status.HTTP_200_OK
        )
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user
    user.delete()
    return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

class UserListSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    profiles = Profile.objects.all()
    serializer = UserSerializer(profiles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_change_user_password(request):
    matricule = request.data.get('matricule')
    new_password = request.data.get('new_password')

    if not matricule or not new_password:
        return Response(
            {"error": "Le matricule et le nouveau mot de passe sont requis."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        profile = Profile.objects.get(matricule=matricule)
    except Profile.DoesNotExist:
        return Response(
            {"error": "Profil utilisateur non trouvé avec cette matricule."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user = profile.id
    
    if not user:
        return Response(
            {"error": "Utilisateur lié au profil non trouvé."},
            status=status.HTTP_404_NOT_FOUND
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": f"Mot de passe modifié avec succès pour l'utilisateur  avec la matricule :{matricule}."},
        status=status.HTTP_200_OK)

from .serializers import ProfileSerializer 

@api_view(['GET'])
@permission_classes([IsAdminUser])
def search(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response({"error": "Aucun terme de recherche fourni."}, status=status.HTTP_400_BAD_REQUEST)

    profiles = Profile.objects.filter(matricule__icontains=query)
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return Response({"error": "Both old and new passwords are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect."},
                        status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#Statistiques pour Dashboard 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAdminUser])
def statistique_utilisateursTotal(request):
    total = User.objects.count()
    return Response({'total_utilisateurs': total})


@api_view(['GET'])
@permission_classes([IsAdminUser])  # accessible uniquement aux admins
def statistique_utilisateursCatégorie(request):
    total = User.objects.count()
    actifs = User.objects.filter(is_active=True).count()
    admins = User.objects.filter(is_staff=True).count()

    return Response({
        'total_utilisateurs': total,
        'utilisateurs_actifs': actifs,
        'utilisateurs_admins': admins,
    })
