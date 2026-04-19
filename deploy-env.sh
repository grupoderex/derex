#!/usr/bin/env bash
set -euo pipefail

# Usage examples:
#   ./deploy-env.sh --env .env.qa
#   ./deploy-env.sh --env .env.prod
#   ./deploy-env.sh --env .env.qa --import ./backups/derex.sql ./backups/derex_strapi.sql

ENV_FILE=""
DO_IMPORT="false"
DEREX_DUMP=""
STRAPI_DUMP=""
DO_SYNC_UPLOADS="false"
UPLOADS_DIR=""
FORCE_UPLOADS="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_FILE="${2:-}"
      shift 2
      ;;
    --import)
      DO_IMPORT="true"
      DEREX_DUMP="${2:-}"
      STRAPI_DUMP="${3:-}"
      shift 3
      ;;
    --sync-uploads)
      DO_SYNC_UPLOADS="true"
      UPLOADS_DIR="${2:-}"
      shift 2
      ;;
    --force-uploads)
      FORCE_UPLOADS="true"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: $0 --env <.env.qa|.env.prod> [--import <derex.sql> <derex_strapi.sql>] [--sync-uploads <dir>] [--force-uploads]"
      exit 1
      ;;
  esac
done

if [[ -z "$ENV_FILE" ]]; then
  echo "Missing required --env argument"
  echo "Usage: $0 --env <.env.qa|.env.prod> [--import <derex.sql> <derex_strapi.sql>] [--sync-uploads <dir>] [--force-uploads]"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

if [[ "$DO_IMPORT" == "true" ]]; then
  if [[ -z "$DEREX_DUMP" || -z "$STRAPI_DUMP" ]]; then
    echo "Usage: $0 --env <.env.qa|.env.prod> --import <derex.sql> <derex_strapi.sql>"
    exit 1
  fi

  if [[ ! -f "$DEREX_DUMP" ]]; then
    echo "File not found: $DEREX_DUMP"
    exit 1
  fi

  if [[ ! -f "$STRAPI_DUMP" ]]; then
    echo "File not found: $STRAPI_DUMP"
    exit 1
  fi
fi

if [[ "$DO_SYNC_UPLOADS" == "true" ]]; then
  if [[ -z "$UPLOADS_DIR" ]]; then
    echo "Usage: $0 --env <.env.qa|.env.prod> --sync-uploads <dir>"
    exit 1
  fi

  if [[ ! -d "$UPLOADS_DIR" ]]; then
    echo "Uploads directory not found: $UPLOADS_DIR"
    exit 1
  fi

  SRC_FILES_COUNT="$(find "$UPLOADS_DIR" -type f | wc -l | tr -d ' ')"
  if [[ "$SRC_FILES_COUNT" == "0" ]]; then
    echo "Uploads directory is empty: $UPLOADS_DIR"
    exit 1
  fi
fi

echo "Starting stack with $ENV_FILE ..."
docker compose --env-file "$ENV_FILE" up -d --build

if [[ "$DO_SYNC_UPLOADS" == "true" ]]; then
  BACKEND_UPLOADS_VOLUME="$(docker compose --env-file "$ENV_FILE" config --volumes | grep 'backend-uploads' | head -n 1 || true)"
  if [[ -z "$BACKEND_UPLOADS_VOLUME" ]]; then
    echo "Could not detect backend uploads volume from compose config."
    exit 1
  fi

  DST_FILES_COUNT="$(docker run --rm -v "${BACKEND_UPLOADS_VOLUME}:/app/uploads" alpine sh -lc 'find /app/uploads -type f 2>/dev/null | wc -l' | tr -d ' ')"

  if [[ "$FORCE_UPLOADS" != "true" && "$DST_FILES_COUNT" != "0" ]]; then
    echo "Skipping uploads sync: volume ${BACKEND_UPLOADS_VOLUME} already has ${DST_FILES_COUNT} files. Use --force-uploads to overwrite/merge."
  else
    echo "Syncing uploads from ${UPLOADS_DIR} to volume ${BACKEND_UPLOADS_VOLUME} ..."
    docker run --rm \
      -v "${BACKEND_UPLOADS_VOLUME}:/app/uploads" \
      -v "${UPLOADS_DIR}:/src:ro" \
      alpine sh -lc 'cp -r /src/. /app/uploads/'
      # Normalize ownership/permissions for backend container user (uid 1001, gid 65533).
      docker run --rm \
        -v "${BACKEND_UPLOADS_VOLUME}:/app/uploads" \
        alpine sh -lc 'chown -R 1001:65533 /app/uploads && chmod -R ug+rwX /app/uploads && find /app/uploads -type d -exec chmod 2775 {} \;'
    NEW_DST_FILES_COUNT="$(docker run --rm -v "${BACKEND_UPLOADS_VOLUME}:/app/uploads" alpine sh -lc 'find /app/uploads -type f 2>/dev/null | wc -l' | tr -d ' ')"
    echo "Uploads sync completed. Files in volume: ${NEW_DST_FILES_COUNT}"
  fi
fi

if [[ "$DO_IMPORT" != "true" ]]; then
  echo "Deploy completed without import."
  exit 0
fi

MYSQL_CONTAINER="$(docker compose --env-file "$ENV_FILE" ps -q mysql)"
if [[ -z "$MYSQL_CONTAINER" ]]; then
  echo "MySQL container not found."
  exit 1
fi

MYSQL_ROOT_PASSWORD="$(grep '^MYSQL_ROOT_PASSWORD=' "$ENV_FILE" | cut -d '=' -f2-)"
MYSQL_DATABASE="$(grep '^MYSQL_DATABASE=' "$ENV_FILE" | cut -d '=' -f2-)"
MYSQL_STRAPI_DATABASE="$(grep '^MYSQL_STRAPI_DATABASE=' "$ENV_FILE" | cut -d '=' -f2-)"

if [[ -z "$MYSQL_ROOT_PASSWORD" || -z "$MYSQL_DATABASE" || -z "$MYSQL_STRAPI_DATABASE" ]]; then
  echo "Missing MYSQL_ROOT_PASSWORD / MYSQL_DATABASE / MYSQL_STRAPI_DATABASE in $ENV_FILE"
  exit 1
fi

echo "Importing base DB into ${MYSQL_DATABASE} ..."
cat "$DEREX_DUMP" | docker exec -i "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"

echo "Importing Strapi DB into ${MYSQL_STRAPI_DATABASE} ..."
cat "$STRAPI_DUMP" | docker exec -i "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_STRAPI_DATABASE"

echo "Deploy + import completed for $ENV_FILE"
