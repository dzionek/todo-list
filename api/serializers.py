from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'created_at', 'last_modified',
            'name', 'description', 'is_finished', 'color'
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
