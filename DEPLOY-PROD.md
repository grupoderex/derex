# Deploy a Producción — Guía Rápida

## 1. Requisitos previos en el VPS de producción

- Docker Engine + Docker Compose plugin instalados
- Puertos **80** y **443** abiertos
- DNS apuntando al IP del VPS (registros A para `derex.com.mx`, `www.`, `api.`, `admin.`, `blog.`)

## 2. Preparar el archivo de entorno

Edita `.env.prod` y reemplaza todos los valores marcados con `# CAMBIAR`:

| Variable | Qué poner |
|---|---|
| `DOMAIN` | Dominio real (ej. `derex.com.mx`) |
| `ACME_EMAIL` | Email para certificados Let's Encrypt |
| `LOCAL_MEDIA_BASE_URL` | `https://api.TU_DOMINIO` |
| `RECAPTCHA_SECRET_KEY` | Secret key de reCAPTCHA producción |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Site key de reCAPTCHA producción |
| `CONTACT_EMAIL_TO` | Email que recibirá los formularios |
| `STRAPI_BOOTSTRAP_ADMIN_EMAIL` | Email del admin del blog |
| `STRAPI_BOOTSTRAP_ADMIN_PASSWORD` | Contraseña segura del admin del blog |

## 3. Primer despliegue (con importación de datos)

```bash
cd /var/www/derex
./deploy-prod.sh --import derex_db.sql derex_strapi.sql
```

Esto hace automáticamente: build de imágenes → levantar todos los servicios → importar ambas bases de datos.

## 4. Despliegue sin importar datos (actualizaciones de código)

```bash
cd /var/www/derex
./deploy-prod.sh
```

## 5. Verificación post-deploy

```bash
docker compose --env-file .env.prod ps
```

Todos los servicios deben estar en estado `Up` / `healthy`.

Probar las URLs:
- `https://TU_DOMINIO` → frontend
- `https://api.TU_DOMINIO/health` → backend
- `https://admin.TU_DOMINIO` → panel admin
- `https://blog.TU_DOMINIO/admin` → Strapi

## 6. Forzar recarga del caché frontend (tras cambios en BD)

```bash
docker exec derex-frontend-1 sh -c "find /app/.next/cache/fetch-cache -type f -delete 2>/dev/null; echo 'Cache cleared'" \
  && docker compose --env-file .env.prod restart frontend
```

## 7. Exportar BD actual (para backup o nueva importación)

```bash
cd /var/www/derex
PASS="$(grep '^MYSQL_ROOT_PASSWORD=' .env.prod | cut -d'=' -f2-)"
docker exec derex-mysql-1 mysqldump -uroot -p"$PASS" --single-transaction derex > derex_db.sql
docker exec derex-mysql-1 mysqldump -uroot -p"$PASS" --single-transaction derex_strapi > derex_strapi.sql
```
