from rest_framework import serializers
from .models import Unite

class UniteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unite
        fields = '__all__'
