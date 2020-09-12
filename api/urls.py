from django.urls import path
from rest_framework import routers

from .views import TaskViewSet, CurrentUserView


router = routers.SimpleRouter()

router.register(
    r'tasks', TaskViewSet, basename='TaskView',
)


urlpatterns = router.urls + [
    path('user/', CurrentUserView.as_view(), name='api_user')
]
