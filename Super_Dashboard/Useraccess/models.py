from django.db import models
from django.contrib.auth.models import AbstractUser
from django. conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('superadmin', 'Super Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.username} - {self.role}"
    

class UserPagePermission(models.Model):
    PAGE_CHOICES = (
    ('products_list', 'Products List'),
    ('marketing_list', 'Marketing List'),
    ('order_list', 'Order List'),
    ('media_plans', 'Media Plans'),
    ('offer_pricing_skus', 'Offer Pricing SKUs'),
    ('clients', 'Clients'),
    ('suppliers', 'Suppliers'),
    ('customer_support', 'Customer Support'),
    ('sales_reports', 'Sales Reports'),
    ('finance_accounting', 'Finance & Accounting'),
)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    page_name = models.CharField(max_length=50, choices=PAGE_CHOICES)
    can_view = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'page_name')

    def __str__(self):
        return f"{self.user.username} - {self.get_page_name_display()}"


User = get_user_model()
class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.user.email} - Used: {self.is_used}"