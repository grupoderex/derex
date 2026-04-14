# ─── Stage 1: Full build (native modules + admin panel) ──────────────────────
FROM node:20-alpine AS builder
WORKDIR /opt/app

# Build tools required by better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++ sqlite-dev

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi

COPY . .

ENV NODE_ENV=production

# Build Strapi admin panel; also ensures dist/ is generated for TypeScript src
RUN npm run build && mkdir -p dist

# Prune devDependencies before copying to next stage
RUN npm prune --omit=dev

# ─── Stage 2: Minimal production runtime ─────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /opt/app

# libsqlite3 runtime library needed by better-sqlite3 (even though we use MySQL)
RUN apk add --no-cache sqlite-libs

ENV NODE_ENV=production

# Copy pruned node_modules (includes compiled .node binary for better-sqlite3)
COPY --from=builder /opt/app/node_modules ./node_modules

# Copy build artifacts and source required at runtime
COPY --from=builder /opt/app/dist       ./dist
COPY --from=builder /opt/app/public     ./public
COPY --from=builder /opt/app/dist/config ./config
COPY --from=builder /opt/app/dist/src    ./src
COPY --from=builder /opt/app/types      ./types
COPY --from=builder /opt/app/scripts    ./scripts
COPY --from=builder /opt/app/package.json ./

# Ensure uploads directory exists for the named volume mount
RUN mkdir -p public/uploads
RUN chmod +x ./scripts/start-with-bootstrap.sh

EXPOSE 1337

ENV APP_CMD=start
CMD ["sh", "./scripts/start-with-bootstrap.sh"]
