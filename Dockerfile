# Stage 1: Dependencies
FROM node:lts-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:lts-alpine AS builder
WORKDIR /app

# Build arguments for NEXT_PUBLIC_* variables (embedded at build time)
ARG NEXT_PUBLIC_API_URL

# Set as environment variables for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application (NEXT_PUBLIC_* variables are now embedded from build args)
RUN npm run build

# Stage 3: Runner
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install wget for health checks
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

# Runtime environment variables (set by ECS)
# NEXT_PUBLIC_API_URL is set at build time
# Other runtime variables can be set in ECS task definition

CMD ["node", "server.js"]
