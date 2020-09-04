from django.test import client


def test_not_logged_in():
    c = client.Client()
    response = c.get('/api/tasks/')
    assert response.status_code == 403