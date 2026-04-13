#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./import-strapi-blog.sh [env_file] [blog_dump] [--force]
#
# Examples:
#   ./import-strapi-blog.sh
#   ./import-strapi-blog.sh .env.qa ./derex-admin-new-main/database/blog.sql
#   ./import-strapi-blog.sh .env.local ./derex-admin-new-main/database/blog.sql --force

ENV_FILE="${1:-.env.local}"
BLOG_DUMP="${2:-./derex-admin-new-main/database/blog.sql}"
FORCE_IMPORT="false"

if [[ "${3:-}" == "--force" ]] || [[ "${1:-}" == "--force" ]] || [[ "${2:-}" == "--force" ]]; then
  FORCE_IMPORT="true"
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

if [[ ! -f "$BLOG_DUMP" ]]; then
  echo "Missing blog dump: $BLOG_DUMP"
  exit 1
fi

COMPOSE_ARGS=(--env-file "$ENV_FILE" -f docker-compose.yml)
if [[ "$ENV_FILE" == ".env.local" ]]; then
  COMPOSE_ARGS+=( -f docker-compose.local.yml )
fi

MYSQL_CONTAINER="$(docker compose "${COMPOSE_ARGS[@]}" ps -q mysql)"
if [[ -z "$MYSQL_CONTAINER" ]]; then
  echo "MySQL container not found. Start stack first."
  echo "docker compose ${COMPOSE_ARGS[*]} up -d"
  exit 1
fi

MYSQL_ROOT_PASSWORD="$(grep '^MYSQL_ROOT_PASSWORD=' "$ENV_FILE" | cut -d '=' -f2-)"
MYSQL_STRAPI_DATABASE="$(grep '^MYSQL_STRAPI_DATABASE=' "$ENV_FILE" | cut -d '=' -f2-)"

if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
  echo "MYSQL_ROOT_PASSWORD is empty in $ENV_FILE"
  exit 1
fi

if [[ -z "$MYSQL_STRAPI_DATABASE" ]]; then
  echo "MYSQL_STRAPI_DATABASE is empty in $ENV_FILE"
  exit 1
fi

HAS_ADMIN_USERS_TABLE="$(docker exec "$MYSQL_CONTAINER" mysql -N -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${MYSQL_STRAPI_DATABASE}' AND table_name='admin_users';")"

if [[ "$HAS_ADMIN_USERS_TABLE" == "1" && "$FORCE_IMPORT" != "true" ]]; then
  EXISTING_USERS="$(docker exec "$MYSQL_CONTAINER" mysql -N -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT COUNT(*) FROM ${MYSQL_STRAPI_DATABASE}.admin_users;")"
  if [[ "$EXISTING_USERS" != "0" ]]; then
    echo "Strapi DB already has data (admin_users=$EXISTING_USERS). Skipping import."
    echo "Run with --force if you want to re-import and overwrite data."
    exit 0
  fi
fi

echo "Importing Strapi dump into ${MYSQL_STRAPI_DATABASE} from ${BLOG_DUMP}..."
cat "$BLOG_DUMP" | docker exec -i "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_STRAPI_DATABASE"

echo "Strapi import completed."
