from typing import Any
import pytest

from django.contrib.auth import get_user
from django.contrib.auth.models import User
from django.http import HttpResponse

from django.urls import reverse
from django.test import Client


def is_based_on_template(response: HttpResponse, template: str) -> bool:
    return template in (t.name for t in response.templates)


@pytest.mark.django_db
class TestViews:
    def test_log_in_get(self, client: Client, default_user: User) -> None:
        response = client.get(reverse('account_index'))
        assert response.status_code == 200
        assert 'Log In' in response.content.decode()

        client.force_login(default_user)
        response = client.get(reverse('account_index'), follow=True)
        assert response.status_code == 200
        assert 'Log In' not in response.content.decode()
        assert is_based_on_template(response, 'frontend/index.html')

    def test_login_post_valid(self, client: Client,
                              default_user: User) -> None:
        response = client.post(
            reverse('account_index'),
            dict(
                username=default_user.username,
                password='testPassword'
            ),
            follow=True
        )
        assert response.status_code == 200
        assert is_based_on_template(response, 'frontend/index.html')
        assert 'Log In' not in response.content.decode()

    def test_login_post_invalid_password(self, client: Client,
                                         default_user: User) -> None:
        response = client.post(
            reverse('account_index'),
            dict(username=default_user.username, password='invalid_password'),
            follow=True
        )
        assert response.status_code == 200
        assert not is_based_on_template(response, 'frontend/index.html')
        assert 'Log In' in response.content.decode()

    def test_login_post_invalid_login(self, client: Client,
                                      default_user: User) -> None:
        response = client.post(
            reverse('account_index'),
            dict(username='invalid_login', password='testPassword'),
            follow=True
        )
        assert response.status_code == 200
        assert not is_based_on_template(response, 'frontend/index.html')
        assert 'Log In' in response.content.decode()

    def test_log_out(self, client: Any, default_user: User) -> None:
        user = get_user(client)
        assert not user.is_authenticated

        client.force_login(default_user)

        user = get_user(client)
        assert user.is_authenticated

        response = client.get(reverse('account_log_out'))
        assert response.status_code == 302
        user = get_user(client)
        assert not user.is_authenticated

    def test_register_get(self, client: Client, default_user: User) -> None:
        response = client.get(reverse('account_register'))
        assert response.status_code == 200
        assert 'Join Now' in response.content.decode()

        client.force_login(default_user)
        response = client.get(reverse('account_register'), follow=True)
        assert response.status_code == 200
        assert 'Log In' not in response.content.decode()
        assert is_based_on_template(response, 'frontend/index.html')

    def test_register_post_valid(self, client: Client) -> None:
        assert User.objects.count() == 0

        response = client.post(
            reverse('account_register'),
            dict(username='testUsername', email='test@gmail.com',
                 password1='test!Password617', password2='test!Password617'),
            follow=True
        )
        assert response.status_code == 200
        assert 'Log In' in response.content.decode()

        assert User.objects.count() == 1
