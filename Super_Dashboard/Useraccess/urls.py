from django.urls import path
from Useraccess import views

urlpatterns=[
    path('users/', views.get_users, name='get_users'),
    path('api/accounts/me/', views.current_user, name='current_user'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:pk>/', views.get_user, name='get_user'),
    path('users/<int:pk>/update/', views.update_user, name='update_user'),
    path('users/<int:pk>/delete/', views.delete_user, name='delete_user'),
    path('users/<int:user_id>/permissions/', views.user_permissions, name='user-permissions'),
    path('password-reset/request/', views.request_password_reset, name='request-password-reset'),
    path('password-reset/confirm/', views.reset_password, name='reset-password'),
]

# {
#     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTUzNDg3OSwiaWF0IjoxNzU0OTMwMDc5LCJqdGkiOiJkYmFlZDlkZjk2YzA0MDk3ODIyZjQ3OWUzNzBiZDQ2ZiIsInVzZXJfaWQiOiIxIn0.jNi70SCNhGojy79I9ZDafCXxQLLvd0AflI1xTllOcJU",
#     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0OTMzNjc5LCJpYXQiOjE3NTQ5MzAwNzksImp0aSI6Ijk4MDY3ODViOTM3NTQ4ZTFiMWJiNDFlOWNlNGRlYzBiIiwidXNlcl9pZCI6IjEifQ.Cm-N2Cou9TDHd4kaQjPMtiJBB-DLcRK_N0-NJEbiMSQ"
# }