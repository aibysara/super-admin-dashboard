from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import secrets
import string
from django.contrib.auth.hashers import make_password
from .models import CustomUser,UserPagePermission,PasswordResetOTP
from .serializers import UsersSerializer,UsersPagePermissionSerializer
from django.core.mail import send_mail
from random import randint
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UsersSerializer(request.user)
    return Response(serializer.data)
# Get all users (Super Admin only)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if request.user.role != 'superadmin':
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    users = CustomUser.objects.all()
    serializer = UsersSerializer(users, many=True)
    return Response(serializer.data)


# Create a new user (Super Admin only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    if request.user.role != 'superadmin':
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()

    # Extract email and create username (e.g., part before '@')
    email = data.get('email', '')
    if not email:
        return Response({"email": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

    username = email.split('@')[0]

    # Ensure username is unique - you can add logic here to make unique if needed
    data['username'] = username

    # Generate strong random password
    import secrets
    import string
    from django.contrib.auth.hashers import make_password

    alphabet = string.ascii_letters + string.digits + string.punctuation
    generated_password = ''.join(secrets.choice(alphabet) for i in range(12))
    data['password'] = make_password(generated_password)

    serializer = UsersSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        response_data = serializer.data
        response_data['generated_password'] = generated_password
        return Response(response_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get single user details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, pk):
    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UsersSerializer(user)
    return Response(serializer.data)


# Update user details (Super Admin only)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    if request.user.role != 'superadmin':
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Update basic user info
    serializer = UsersSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update permissions
    permissions = request.data.get('permissions', {})

    for page_key, perms in permissions.items():
        perm_obj, created = UserPagePermission.objects.get_or_create(user=user, page_name=page_key)
        perm_obj.can_view = perms.get('can_view', False)
        perm_obj.can_edit = perms.get('can_edit', False)
        perm_obj.can_create = perms.get('can_create', False)
        perm_obj.can_delete = perms.get('can_delete', False)
        perm_obj.save()

    # Optionally, delete permissions that are not in the incoming permissions (if needed)
    # UserPagePermission.objects.filter(user=user).exclude(page_name__in=permissions.keys()).delete()

    updated_user = UsersSerializer(user)
    return Response(updated_user.data)


# Delete user (Super Admin only)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    if request.user.role != 'superadmin':
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response({"detail": "User deleted successfully"})
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_permissions(request, user_id):
    # Check if user exists
    try:
        target_user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # GET: List permissions
    if request.method == 'GET':
        # Allow user to view their own permissions or superadmin
        if request.user.id != target_user.id and request.user.role != 'superadmin':
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        permissions = UserPagePermission.objects.filter(user=target_user)
        serializer = UsersPagePermissionSerializer(permissions, many=True)
        return Response(serializer.data)

    # PUT: Update permissions (superadmin only)
    elif request.method == 'PUT':
        if request.user.role != 'superadmin':
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        # Expecting list of permission dicts in request.data
        perms_data = request.data

        if not isinstance(perms_data, list):
            return Response({"detail": "Expected a list of permission objects."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate & update permissions
        updated_permissions = []
        for perm_data in perms_data:
            page_name = perm_data.get('page_name')
            if page_name not in dict(UserPagePermission.PAGE_CHOICES):
                return Response({"detail": f"Invalid page_name: {page_name}"}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create permission object
            perm_obj, created = UserPagePermission.objects.get_or_create(user=target_user, page_name=page_name)

            serializer = UsersPagePermissionSerializer(perm_obj, data=perm_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                updated_permissions.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(updated_permissions)
    
@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

    otp = f"{randint(100000, 999999)}"
    expires_at = timezone.now() + timedelta(minutes=10)

    PasswordResetOTP.objects.create(user=user, otp=otp, expires_at=expires_at)

    # Configure email backend in settings.py before using this!
    send_mail(
        subject="Password Reset OTP",
        message=f"Your OTP for password reset is: {otp}",
        from_email="no-reply@example.com",
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({"detail": "OTP sent to your email."})

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('new_password')

    if not all([email, otp, new_password]):
        return Response({"detail": "Email, OTP, and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
        otp_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).last()
    except CustomUser.DoesNotExist:
        return Response({"detail": "Invalid email or OTP."}, status=status.HTTP_400_BAD_REQUEST)

    if not otp_obj or otp_obj.is_expired():
        return Response({"detail": "OTP is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    otp_obj.is_used = True
    otp_obj.save()

    return Response({"detail": "Password reset successfully."})