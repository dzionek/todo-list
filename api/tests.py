import pytest
import json

from django.test.client import Client
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from .models import Task


def add_tasks(user: User) -> None:
    Task.objects.create(
        name='Name 1', description='Description 1',
        user=user, color='blue'
    )
    Task.objects.create(
        name='Name 2', description='Description 2',
        user=user, color='green'
    )
    Task.objects.create(
        name='Name 3', description='Description 3',
        user=user, color='red'
    )
    Task.objects.create(
        name='Name 4', description='Description 4',
        user=user, color='yellow'
    )
    Task.objects.create(
        name='Name 5', description='Description 5',
        user=user, color='green'
    )

    # Some tasks for another user
    another_user: User = User.objects.create_user(
        username='anotherUser', email='another@gmail.com',
        password='anotherPassword'
    )
    Task.objects.create(
        name='Another name 1', description='Another description 1',
        user=another_user, color='yellow'
    )
    Task.objects.create(
        name='Another name 2', description='Another description 2',
        user=another_user, color='green'
    )


@pytest.mark.django_db
class TestViews:
    def test_task_not_logged_in(self, client: Client) -> None:
        response_list = client.get('/api/tasks/')
        assert response_list.status_code == 403

        response_retrieve = client.get('/api/tasks/1/')
        assert response_retrieve.status_code == 403

        response_create = client.post('/api/tasks/', {})
        assert response_create.status_code == 403

        response_update = client.patch('/api/tasks/1/', {})
        assert response_update.status_code == 403

        response_destroy = client.delete('/api/tasks/1/')
        assert response_destroy.status_code == 403

    def test_task_list(self, client: Client, default_user: User) -> None:
        add_tasks(default_user)
        client.force_login(default_user)

        response = client.get('/api/tasks/')
        assert response.status_code == 200
        response_json = json.loads(response.content)
        assert len(response_json) == 5

        for i, task in enumerate(response_json):
            assert task['name'] == f'Name {i + 1}'
            assert task['description'] == f'Description {i + 1}'

    def test_task_retrieve(self, client: Client, default_user: User) -> None:
        add_tasks(default_user)
        client.force_login(default_user)

        response = client.get('/api/tasks/2/')
        assert response.status_code == 200
        response_json = json.loads(response.content)

        assert response_json['name'] == 'Name 2'
        assert response_json['description'] == 'Description 2'
        assert response_json['color'] == 'green'
        assert not response_json['is_finished']

        for i in range(1, 6):
            assert client.get(f'/api/tasks/{i}/').status_code == 200

        assert client.get('/api/tasks/6/').status_code == 404

    def test_task_create(self, client: Client, default_user: User) -> None:
        add_tasks(default_user)
        client.force_login(default_user)

        assert Task.objects.filter(user=default_user).count() == 5

        response = client.post('/api/tasks/', {
            'name': 'Name 6', 'description': 'Description 6'
        })

        assert response.status_code == 201
        assert Task.objects.filter(user=default_user).count() == 6
        assert client.get('/api/tasks/8/').content == response.content

    def test_task_update(self, client: Client, default_user: User) -> None:
        add_tasks(default_user)
        client.force_login(default_user)

        response = client.patch('/api/tasks/1/', {
            'name': 'Name EDITED'
        }, content_type='application/json')

        assert response.status_code == 200
        task = Task.objects.filter(user=default_user).get(pk=1)
        assert task.name == 'Name EDITED'
        assert task.description == 'Description 1'

    def test_task_destroy(self, client: Client, default_user: User) -> None:
        add_tasks(default_user)
        client.force_login(default_user)

        response = client.delete('/api/tasks/1/')

        assert response.status_code == 204
        user_tasks = Task.objects.filter(user=default_user)

        assert 'Name 1' not in map(lambda task: task.name, user_tasks)

    def test_user_retrieve(self, client: Client, default_user: User) -> None:
        response = client.get('/api/user/')
        assert response.status_code == 403

        add_tasks(default_user)
        client.force_login(default_user)

        response = client.get('/api/user/')
        assert response.status_code == 200

        response_json = json.loads(response.content)
        assert response_json['username'] == 'testUser'


@pytest.mark.django_db
class TestModels:
    def test_task_str(self, default_user: User) -> None:
        task: Task = Task.objects.create(
            name='Test name', description='Test description',
            user=default_user
        )
        assert str(task) == 'Task 1 created by testUser (unfinished)'

    def test_task_color(self, default_user: User) -> None:
        task_valid = Task(
            name='Test name', description='Test description',
            user=default_user, color='red'
        )

        task_invalid = Task(
            name='Test name', description='Test description',
            user=default_user, color='grey'
        )

        task_valid.full_clean()

        with pytest.raises(ValidationError):
            task_invalid.full_clean()
