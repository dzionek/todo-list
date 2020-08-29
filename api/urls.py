from rest_framework import routers

from .views import TaskViewSet


router = routers.SimpleRouter()

router.register(
    r'api/tasks', TaskViewSet, basename='TaskView'
)

urlpatterns = router.urls
