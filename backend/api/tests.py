from django.test import TestCase
from django.contrib.auth.models import User
from .models import Task

class TaskSphereBackendTests(TestCase):
    def setUp(self):
        """Set up standard testing assets before each test case executes"""
        self.test_user = User.objects.create_user(
            username='citestuser', 
            password='Password123!', 
            email='test@example.com'
        )

    def test_database_task_creation(self):
        """Validate that tasks can be successfully written to the database schema"""
        task = Task.objects.create(
            title="CI Pipeline Task", 
            description="Verifying automated unit testing execution flows.", 
            status="To Do"
        )
        self.assertEqual(task.title, "CI Pipeline Task")
        self.assertEqual(task.status, "To Do")

    def test_user_authentication_sanity(self):
        """Ensure the built-in authentication system correctly handles credentials"""
        self.assertTrue(self.test_user.check_password('Password123!'))