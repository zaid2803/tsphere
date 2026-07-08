from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    
    title = models.CharField(max_length=200)  # 👈 Fixed
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')  # 👈 Fixed
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title