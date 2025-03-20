#!/usr/bin/env bash

# Wait for Postgres to be ready
/wait-for-postgres.sh postgresdb

python manage.py collectstatic --noinput
python manage.py migrate --noinput
python -m gunicorn --bind 0.0.0.0:8000 core.wsgi:application