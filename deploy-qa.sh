#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy-qa.sh
#   ./deploy-qa.sh --import /path/derex.sql /path/derex_strapi.sql

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$SCRIPT_DIR/deploy-env.sh" --env .env.qa "$@"
