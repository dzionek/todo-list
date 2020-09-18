#!/bin/sh

echo "Databases are being created."

python manage.py makemigrations
python manage.py migrate

exec "$@"