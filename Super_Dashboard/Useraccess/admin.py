from django.contrib import admin
from Useraccess.models import CustomUser,UserPagePermission,PasswordResetOTP
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(UserPagePermission)
admin.site.register(PasswordResetOTP)
