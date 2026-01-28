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
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
