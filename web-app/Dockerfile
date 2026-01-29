FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY web-app/package.json web-app/package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY web-app/ ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy public assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# CRITICAL FIX: Copy shared-libs for Proto definitions
# The Server Actions look for ../shared-libs from /app/web-app or similar, resolving to /shared-libs usually
# Code uses: path.join(process.cwd(), "../shared-libs/proto/src/user.proto")
# If cwd is /app, result is /shared-libs/proto/src/user.proto
COPY shared-libs /shared-libs

CMD ["node", "server.js"]
