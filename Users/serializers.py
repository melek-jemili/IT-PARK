# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile  # Assuming you have a Profile model

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'is_active', 'is_staff', 'date_joined', 'last_login', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
            'last_login': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        """Update user instance"""
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name']
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_username(self, value):
        """Validate username uniqueness"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def create(self, validated_data):
        """Create new user"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile if Profile model exists
        try:
            Profile.objects.create(user=user)
        except:
            pass  # Profile model might not exist yet
        
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for Profile model (customize based on your Profile model)"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = '__all__'  # Adjust based on your Profile model fields
    
    def update(self, instance, validated_data):
        """Update profile instance"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user serializer for minimal data"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']