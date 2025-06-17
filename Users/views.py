# users/views.py
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .serializers import UserSerializer, UserRegistrationSerializer
from .forms import UserRegistrationForm
# from .serializers import ProfileSerializer  # Uncomment when Profile model is created

# Traditional Django Views (HTML Pages)
def home_view(request):
    """Home page view"""
    return render(request, 'Users/home.html')

def register_view(request):
    """Register page view"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password1'])
            user.save()
            messages.success(request, "Registration successful! Please login.")
            return redirect('login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return render(request, 'Users/register.html', {'form': form})
       
    
    return render(request, 'Users/register.html')

def login_view(request):
    """Login page view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f"Welcome back, {user.first_name or user.username}!")
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password")
    
    return render(request, 'Users/login.html')

def logout_view(request):
    """Logout view"""
    logout(request)
    messages.success(request, "You have been logged out successfully")
    return redirect('home')

@login_required
def profile_view(request):
    """Profile page view"""
    return render(request, 'Users/profile.html')

# Authentication Views
class CustomAuthToken(ObtainAuthToken):
    """Custom authentication to return user data along with token"""
    def post(self, request):
        serializer = self.serializer_class(data=request.data,
                                          context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email
        })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'message': 'User created successfully',
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """Logout user by deleting token"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

# User CRUD Operations
class UserListCreateView(generics.ListCreateAPIView):
    """List all users or create a new user"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Allow anyone to create (register), but require auth to list"""
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific user"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Users can only access their own data unless admin"""
        if self.request.user.is_staff:
            return get_object_or_404(User, pk=self.kwargs.get('pk'))
        return self.request.user

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Get current authenticated user's information"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_current_user(request):
    """Update current user's information"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Profile Views - Removed until Profile model is created

# Additional utility views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics (admin only)"""
    if not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    staff_users = User.objects.filter(is_staff=True).count()
    
    return Response({
        'total_users': total_users,
        'active_users': active_users,
        'staff_users': staff_users,
        'inactive_users': total_users - active_users
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password"""
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response({'error': 'Both old and new passwords are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    if not user.check_password(old_password):
        return Response({'error': 'Invalid old password'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_users(request):
    """Search users by username or email"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'error': 'Search query is required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    users = User.objects.filter(
        username__icontains=query
    ) | User.objects.filter(
        email__icontains=query
    )
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# Deactivate/Activate user (admin only)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_user_status(request, user_id):
    """Activate or deactivate a user (admin only)"""
    if not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(pk=user_id)
        user.is_active = not user.is_active
        user.save()
        
        status_text = 'activated' if user.is_active else 'deactivated'
        return Response({'message': f'User {status_text} successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)