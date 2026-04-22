# ── Stage 1: Install & build ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

# 1. Install system dependencies required by Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# 2. Set PATH to include node_modules binaries
ENV PATH /app/node_modules/.bin:$PATH

# Copy source
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# 3. Alpine needs openssl in the runner stage too to execute Prisma queries
RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY --from=builder /app/package*.json          ./
COPY --from=builder /app/node_modules           ./node_modules
COPY --from=builder /app/.next                  ./.next
COPY --from=builder /app/public                 ./public
COPY --from=builder /app/prisma                 ./prisma
COPY --from=builder /app/docker-entrypoint.sh   ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]