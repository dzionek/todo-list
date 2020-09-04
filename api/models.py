from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=30)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_finished = models.BooleanField(default=False)

    class Color(models.TextChoices):
        BLUE = 'blue'
        GREEN = 'green'
        YELLOW = 'yellow'
        RED = 'red'

    color = models.CharField(
        max_length=6,
        choices=Color.choices,
        default=Color.BLUE,
    )

    def __str__(self) -> str:
        finished_message = 'finished' if self.is_finished else 'unfinished'
        return f'Task {self.id} created by {self.user.username}' \
               f'({finished_message})'
