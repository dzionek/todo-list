"""
Module containing Pytest fixtures used by the unit tests
"""

import pytest
from django.contrib.auth.models import User
from django.test import Client


@pytest.fixture
def default_user() -> User:
    return User.objects.create_user(
        username='testUser', email='test@gmail.com',
        password='testPassword'
    )


@pytest.fixture
def client() -> Client:
    return Client()
