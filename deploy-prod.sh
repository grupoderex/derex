#!/usr/bin/env bash
set -euo pipefail

# Wrapper for backward compatibility.
# Usage:
#   ./deploy-prod.sh
#   ./deploy-prod.sh --import /path/derex.sql /path/derex_strapi.sql

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$SCRIPT_DIR/deploy-env.sh" --env .env.prod "$@"
