# Multi-stage Dockerfile for Next.js Application
# Supports both development and production builds

# ============================================================================
# Base Stage - Dependencies
# ============================================================================
FROM node:20-alpine AS base

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# ============================================================================
# Development Stage
# ============================================================================
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# ============================================================================
# Builder Stage - Production Build
# ============================================================================
FROM base AS builder

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
# Environment variables prefixed with NEXT_PUBLIC_ are baked into build
RUN npm run build

# ============================================================================
# Production Stage
# ============================================================================
FROM node:20-alpine AS production

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/lib ./lib

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start production server
CMD ["npm", "run", "start"]
