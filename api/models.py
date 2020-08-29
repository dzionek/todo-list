from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    created_at = models.DateField(auto_now_add=True)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_finished = models.BooleanField()

    def __str__(self):
        finished_message = 'finished' if self.is_finished else 'unfinished'
        return f'Task {self.id} created by {self.user.username} ({finished_message})'
