# ─── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time variables (baked into the static JS bundle by Next.js)
ARG NEXT_PUBLIC_REACT_APP_BACKEND_URL
ARG NEXT_PUBLIC_REACT_APP_BLOG_URL
ARG NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_ENABLE_GOOGLE_MAPS_DEV=false
ARG SITE_URL

ENV NEXT_PUBLIC_REACT_APP_BACKEND_URL=$NEXT_PUBLIC_REACT_APP_BACKEND_URL
ENV NEXT_PUBLIC_REACT_APP_BLOG_URL=$NEXT_PUBLIC_REACT_APP_BLOG_URL
ENV NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_KEY
ENV NEXT_PUBLIC_ENABLE_GOOGLE_MAPS_DEV=$NEXT_PUBLIC_ENABLE_GOOGLE_MAPS_DEV
ENV SITE_URL=$SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ─── Stage 3: Production runner ──────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone output contains its own node_modules subset
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
