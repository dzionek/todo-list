from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import BaseSerializer

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet:
        user = self.request.user
        return Task.objects.filter(user=user).all()

    def perform_create(self, serializer: BaseSerializer) -> None:
        # https://github.com/typeddjango/djangorestframework-stubs/issues/29
        user = self.request.user
        serializer.save(user=user)
