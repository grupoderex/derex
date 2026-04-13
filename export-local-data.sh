#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./export-local-data.sh
#   ./export-local-data.sh ./backups

OUTPUT_DIR_BASE="${1:-./backups}"
TS="$(date +%Y%m%d-%H%M%S)"
OUTPUT_DIR="${OUTPUT_DIR_BASE%/}/$TS"

mkdir -p "$OUTPUT_DIR"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local"
  exit 1
fi

MYSQL_CONTAINER="$(docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml ps -q mysql)"
if [[ -z "$MYSQL_CONTAINER" ]]; then
  echo "MySQL container for local stack not found."
  echo "Run: docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml up -d"
  exit 1
fi

MYSQL_ROOT_PASSWORD="$(grep '^MYSQL_ROOT_PASSWORD=' .env.local | cut -d '=' -f2-)"
MYSQL_DATABASE="$(grep '^MYSQL_DATABASE=' .env.local | cut -d '=' -f2-)"
MYSQL_STRAPI_DATABASE="$(grep '^MYSQL_STRAPI_DATABASE=' .env.local | cut -d '=' -f2-)"

if [[ -z "$MYSQL_ROOT_PASSWORD" || -z "$MYSQL_DATABASE" || -z "$MYSQL_STRAPI_DATABASE" ]]; then
  echo "Missing MYSQL_ROOT_PASSWORD / MYSQL_DATABASE / MYSQL_STRAPI_DATABASE in .env.local"
  exit 1
fi

BASE_DUMP="$OUTPUT_DIR/derex.sql"
STRAPI_DUMP="$OUTPUT_DIR/derex_strapi.sql"

echo "Exporting ${MYSQL_DATABASE} -> $BASE_DUMP"
docker exec "$MYSQL_CONTAINER" sh -c "mysqldump -uroot -p\"$MYSQL_ROOT_PASSWORD\" --single-transaction --set-gtid-purged=OFF \"$MYSQL_DATABASE\"" > "$BASE_DUMP"

echo "Exporting ${MYSQL_STRAPI_DATABASE} -> $STRAPI_DUMP"
docker exec "$MYSQL_CONTAINER" sh -c "mysqldump -uroot -p\"$MYSQL_ROOT_PASSWORD\" --single-transaction --set-gtid-purged=OFF \"$MYSQL_STRAPI_DATABASE\"" > "$STRAPI_DUMP"

echo "Local export completed."
echo "Base:   $BASE_DUMP"
echo "Strapi: $STRAPI_DUMP"
