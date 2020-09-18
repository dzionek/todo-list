#!/bin/sh

echo "Database is being created."

python manage.py makemigrations
python manage.py migrate

exec "$@"