#!/bin/bash

source venv/bin/activate
while true; do
    flask db upgrade
    if [[ "$?" == "0" ]]; then
        echo Database tables created
        break
    fi
    echo Upgrade command failed, retrying in 5 secs...
    sleep 5
done
export MIGRATION_DONE=True
exec gunicorn -b :5000 --timeout 300 --access-logfile - --error-logfile - scraper:app