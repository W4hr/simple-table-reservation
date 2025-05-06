#!/bin/sh
set -e

DB_FILE="/app/data/database.db"
EXTERNAL_DB_FILE="/external/databse.db"

if [ ! -f "$DB_FILE" ]; then
    echo "Database file not found at $DB_FILE"
    if [ -f "$EXTERNAL_DB_FILE"] then
        echo "External database file found at $EXTERNAL_DB_FILE"
        cp "$EXTERNAL_DB_FILE" "$DB_FILE"
    elif [ -n "$TABLE_LIST" ]; then
        echo "Database not found. Seeding new database..."
        node ./seed.js
    else
        echo "Database not found but TABLE_LIST not provided. Skipping seed."
    fi
else
    echo "Database already exists at $DB_FILE; skipping seed and copy."
fi

exec node build