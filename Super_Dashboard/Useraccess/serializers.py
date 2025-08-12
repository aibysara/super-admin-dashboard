from rest_framework import serializers
from Useraccess.models import CustomUser,UserPagePermission

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email','role','first_name','last_name']

class UsersPagePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model =UserPagePermission
        fields = ['id', 'page_name', 'can_view', 'can_edit', 'can_create', 'can_delete']