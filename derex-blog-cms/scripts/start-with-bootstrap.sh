#!/bin/sh
set -eu

APP_CMD="${APP_CMD:-start}"
BOOTSTRAP_ONETIME="${STRAPI_BOOTSTRAP_ADMIN_ONETIME:-false}"
BOOTSTRAP_MARKER_FILE="${STRAPI_BOOTSTRAP_ADMIN_MARKER_FILE:-/opt/app/public/uploads/.strapi-admin-bootstrap-done}"

prepare_runtime_config() {
  if [ -d "/opt/app/dist/config" ]; then
    mkdir -p /opt/app/config
    rm -f /opt/app/config/*.ts
    cp -f /opt/app/dist/config/*.js /opt/app/config/
    echo "[strapi-bootstrap] Runtime config prepared from dist/config"
  fi
}

bootstrap_admin() {
  if [ -z "${STRAPI_BOOTSTRAP_ADMIN_EMAIL:-}" ] || [ -z "${STRAPI_BOOTSTRAP_ADMIN_PASSWORD:-}" ] || [ -z "${STRAPI_BOOTSTRAP_ADMIN_FIRSTNAME:-}" ] || [ -z "${STRAPI_BOOTSTRAP_ADMIN_LASTNAME:-}" ]; then
    echo "[strapi-bootstrap] Admin bootstrap vars missing; skipping admin bootstrap"
    return 0
  fi

  if [ "$BOOTSTRAP_ONETIME" = "true" ] && [ -f "$BOOTSTRAP_MARKER_FILE" ]; then
    echo "[strapi-bootstrap] One-time bootstrap already completed; skipping"
    return 0
  fi

  echo "[strapi-bootstrap] Ensuring admin user exists (${STRAPI_BOOTSTRAP_ADMIN_EMAIL})..."
  set +e
  BOOTSTRAP_OUTPUT=$(npm run strapi -- admin:create-user \
    --firstname "${STRAPI_BOOTSTRAP_ADMIN_FIRSTNAME}" \
    --lastname "${STRAPI_BOOTSTRAP_ADMIN_LASTNAME}" \
    --email "${STRAPI_BOOTSTRAP_ADMIN_EMAIL}" \
    --password "${STRAPI_BOOTSTRAP_ADMIN_PASSWORD}" 2>&1)
  BOOTSTRAP_STATUS=$?
  set -e

  echo "$BOOTSTRAP_OUTPUT"

  if [ $BOOTSTRAP_STATUS -eq 0 ]; then
    echo "[strapi-bootstrap] Admin user created"
    if [ "$BOOTSTRAP_ONETIME" = "true" ]; then
      mkdir -p "$(dirname "$BOOTSTRAP_MARKER_FILE")"
      touch "$BOOTSTRAP_MARKER_FILE"
      echo "[strapi-bootstrap] One-time marker created"
    fi
    return 0
  fi

  if printf "%s" "$BOOTSTRAP_OUTPUT" | grep -Eiq "already exists|already taken|duplicate"; then
    echo "[strapi-bootstrap] Admin already exists"
    if [ "$BOOTSTRAP_ONETIME" = "true" ]; then
      mkdir -p "$(dirname "$BOOTSTRAP_MARKER_FILE")"
      touch "$BOOTSTRAP_MARKER_FILE"
      echo "[strapi-bootstrap] One-time marker created"
    fi
    return 0
  fi

  echo "[strapi-bootstrap] Admin likely already exists (or creation failed). Continuing startup."
  return 0
}

prepare_runtime_config

bootstrap_admin

echo "[strapi-bootstrap] Starting Strapi with npm run ${APP_CMD}"
exec npm run "${APP_CMD}"
