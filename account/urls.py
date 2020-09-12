from django.urls import path

from . import views

urlpatterns = [
    path('', views.log_in, name='account_index'),
    path('logout', views.log_out, name='account_log_out'),
    path('register', views.register, name='account_register'),
]
