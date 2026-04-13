# Derex Deployment Guide

## Overview
This repository is deployed with Docker Compose and Traefik using a single compose file and environment-specific env files.

Services:
- Traefik
- Frontend (Next.js SSR)
- Backend (Node.js Express)
- Admin (React SPA + NGINX)
- Blog (Strapi + MySQL)
- MySQL

## Environment Files
- `.env.qa`
- `.env.prod`
- `.env.local` (local development with compose override)
- `.env.example` (template)

## Domains and Routing
- `https://${DOMAIN}` -> frontend
- `https://www.${DOMAIN}` -> frontend alias, redirected to root domain
- `https://api.${DOMAIN}` -> backend
- `https://admin.${DOMAIN}` -> admin
- `https://blog.${DOMAIN}` -> blog

## Deploy Commands
QA:

```bash
./deploy-qa.sh
```

Production:

```bash
./deploy-prod.sh
```

Local:

```bash
docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

## Data Promotion (Local -> QA/PROD)

Export local data (base + Strapi):

```bash
./export-local-data.sh
```

Import into QA:

```bash
./deploy-qa.sh --import /path/to/derex.sql /path/to/derex_strapi.sql
```

Import into PROD:

```bash
./deploy-prod.sh --import /path/to/derex.sql /path/to/derex_strapi.sql
```

## Manual Steps

### A) DNS (Cloudflare)
Create A records pointing to your VPS public IP:
- `${DOMAIN}`
- `api.${DOMAIN}`
- `admin.${DOMAIN}`
- `blog.${DOMAIN}`
- optional: `www.${DOMAIN}`

### B) VPS Setup
- Install Docker Engine and Docker Compose plugin.
- Open inbound ports: 80 and 443.

### C) Database
- Import your SQL dump into MySQL (`derex` and `derex_strapi` as needed).
- Ensure required backend migration tables exist (including schedule tables used by cron).

### D) Strapi Migration
- Export content from old SQLite-backed instance.
- Import content to MySQL-backed Strapi.
- Validate media/upload paths and permissions.

### F) Strapi Admin Bootstrap (Automatic)
- Strapi admin user is bootstrapped automatically on container start if it does not exist.
- Configure in env file:
	- `STRAPI_BOOTSTRAP_ADMIN_FIRSTNAME`
	- `STRAPI_BOOTSTRAP_ADMIN_LASTNAME`
	- `STRAPI_BOOTSTRAP_ADMIN_EMAIL`
	- `STRAPI_BOOTSTRAP_ADMIN_PASSWORD`
- This avoids `register-admin` flow on fresh environments.

### E) Post-Deploy Validation
- `docker compose ps`
- `docker logs --tail 200 <service>`
- Test URLs for frontend, api, admin, and blog over HTTPS.

## Notes
- No domain is hardcoded in compose routing; domains come from `${DOMAIN}`.
- Next.js and Vite public URLs are injected at build time via compose build args.
- Current stack uses Node 20 because Strapi 5 and project dependencies require it.
