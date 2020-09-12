from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import BaseSerializer

from .models import Task
from .serializers import TaskSerializer, UserSerializer


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


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
