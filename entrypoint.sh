#!/bin/sh
set -e

DB_FILE="/app/data/database.db"

if [ ! -f "$DB_FILE" ]; then
    if [ -n "$TABLE_LIST" ]; then
        echo "Database not found. Seeding..."
        node ./seed.js
    else
        echo "Database not found but TABLE_LIST not provided. Skipping seed."
    fi
else
    echo "Database already exists; skipping seed"
fi

exec node build