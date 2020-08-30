from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'created_at', 'last_modified',
            'name', 'description', 'is_finished', 'color'
        ]
