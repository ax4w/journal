# Use Node.js 20 Alpine as the base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock* ./
RUN \
  if [ -f bun.lock ]; then \
    npm install -g bun && bun install --frozen-lockfile; \
  else \
    npm ci; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables that will be used during build
ARG ACCESS_KEY_ID
ARG BUCKET
ARG DSN
ARG ENDPOINT
ARG PASSWORD
ARG SECRET_ACCESS_KEY

ENV ACCESS_KEY_ID=$ACCESS_KEY_ID
ENV BUCKET=$BUCKET
ENV DSN=$DSN
ENV ENDPOINT=$ENDPOINT
ENV PASSWORD=$PASSWORD
ENV SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY

# Build the application
RUN \
  if [ -f bun.lock ]; then \
    npm install -g bun && bun run build; \
  else \
    npm run build; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 sveltekit
RUN adduser --system --uid 1001 sveltekit

# Copy the built application
COPY --from=builder --chown=sveltekit:sveltekit /app/build ./build
COPY --from=builder --chown=sveltekit:sveltekit /app/package.json ./package.json

# Install production dependencies
COPY --from=deps /app/node_modules ./node_modules

USER sveltekit

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the application
CMD ["node", "build"]
