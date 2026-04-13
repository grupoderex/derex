#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./import-local-db.sh path/to/derex.sql path/to/derex_strapi.sql
#
# Imports SQL dumps into the running Dockerized MySQL service created by compose.

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <derex_dump.sql> <derex_strapi_dump.sql>"
  exit 1
fi

DEREX_DUMP="$1"
STRAPI_DUMP="$2"

if [[ ! -f "$DEREX_DUMP" ]]; then
  echo "File not found: $DEREX_DUMP"
  exit 1
fi

if [[ ! -f "$STRAPI_DUMP" ]]; then
  echo "File not found: $STRAPI_DUMP"
  exit 1
fi

MYSQL_CONTAINER="$(docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml ps -q mysql)"

if [[ -z "$MYSQL_CONTAINER" ]]; then
  echo "MySQL container not found. Start stack first:"
  echo "docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml up -d"
  exit 1
fi

# Read root password from .env.local
MYSQL_ROOT_PASSWORD="$(grep '^MYSQL_ROOT_PASSWORD=' .env.local | cut -d '=' -f2-)"

if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
  echo "MYSQL_ROOT_PASSWORD is empty in .env.local"
  exit 1
fi

echo "Importing into database: derex"
cat "$DEREX_DUMP" | docker exec -i "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" derex

echo "Importing into database: derex_strapi"
cat "$STRAPI_DUMP" | docker exec -i "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" derex_strapi

echo "Done. Data imported successfully."
