from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['matricule', 'nom', 'prenom', 'cin', 'fonction', 'dateNaissance', 'region', 'email', 'telephone', 'unite']


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['isAdminUser'] = user.is_staff 
        return token

def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["unite"] = instance.unite.codePostal if instance.unite else None
        return rep