# Environment Variable Setup Guide

Complete guide for setting up environment variables for local development, Docker, and production deployment.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Files](#environment-files)
- [Local Development Setup](#local-development-setup)
- [Docker Compose Setup](#docker-compose-setup)
- [Production Deployment](#production-deployment)
- [Environment Variables Reference](#environment-variables-reference)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Quick Start

```bash
# 1. Copy template
cp .env.example .env.local

# 2. Edit with your values
code .env.local  # or nano, vim, etc.

# 3. Start development server
npm run dev

# Expected output:
# ✅ Environment variables validated (XX.XXms)
# ⏳ Starting development server...
# ✓ Ready on http://localhost:3000
```

---

## Environment Files

Next.js loads environment variables in this precedence order:

| File | Purpose | Committed to Git? | When Used |
|------|---------|-------------------|-----------|
| `.env.example` | Template with all variables | ✅ Yes | Documentation only (NOT loaded) |
| `.env.local` | Local development values | ❌ No | Development (`npm run dev`) |
| `.env.production` | Production values | ❌ No | Production (`npm run build` + `npm run start`) |
| `.env` | Fallback for Docker Compose | ❌ No | Docker Compose (dev and prod) |

**Important**: Only `.env.example` should be committed to git. All other `.env*` files are in `.gitignore`.

---

## Local Development Setup

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or Supabase cloud)
- Supabase instance (self-hosted or cloud)
- Newsletter service account (Resend or Mailgun)

### Step 1: Create .env.local

```bash
cp .env.example .env.local
```

### Step 2: Fill in Required Values

Open `.env.local` and update these **8 required variables**:

```bash
# Next.js Configuration
PUBLIC_URL="http://localhost:3000"
NODE_ENV="development"

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marcusgoll_dev"

# Supabase (get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"  # or cloud URL
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Newsletter Service (choose ONE)
RESEND_API_KEY="re_xxxxxxxx"  # OR MAILGUN_API_KEY
NEWSLETTER_FROM_EMAIL="test@marcusgoll.com"
```

### Step 3: Get Service Credentials

#### Supabase Keys

**Option A: Local Supabase**
```bash
# Start local Supabase
npx supabase start

# Output will include:
# API URL: http://localhost:54321
# anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Option B: Supabase Cloud**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to: **Project Settings** > **API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

#### Newsletter Service Keys

**Option A: Resend**
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create API key
3. Copy key → `RESEND_API_KEY`
4. Verify domain at [Resend Domains](https://resend.com/domains)

**Option B: Mailgun**
1. Go to [Mailgun Dashboard](https://app.mailgun.com/app/account/security/api_keys)
2. Copy private API key → `MAILGUN_API_KEY`
3. Verify domain at **Sending** > **Domains**

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Environment variables validated (12.34ms)
⏳ Starting development server...
✓ Ready on http://localhost:3000
```

**If you see errors:**
```
❌ Missing required environment variable: RESEND_API_KEY or MAILGUN_API_KEY
   Description: API key for newsletter/email service (at least one required)
   Example: re_xxxx (Resend) or key-xxxx (Mailgun)

📋 Please check .env.example for required configuration.
```

→ Fix the missing variable in `.env.local` and restart server.

---

## Docker Compose Setup

Docker Compose uses `.env` file (NOT `.env.local`).

### Step 1: Create .env for Docker

```bash
cp .env.example .env
```

### Step 2: Edit .env with Docker-Friendly Values

```bash
# Edit .env
code .env

# Use external services (Supabase, Resend/Mailgun)
DATABASE_URL="postgresql://user:password@supabase-host:5432/database"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
RESEND_API_KEY="re_xxxxxxxx"
NEWSLETTER_FROM_EMAIL="test@marcusgoll.com"
```

**Note**: Database must be accessible from Docker container (use cloud Supabase or host networking).

### Step 3: Build and Start

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d
```

### Step 4: Verify Services

```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f nextjs

# Test health endpoint
curl http://localhost:3000/api/health
```

---

## Production Deployment

### Overview

Production deployment requires secure transfer of `.env.production` to your VPS.

**NEVER commit `.env.production` to git!**

### Step 1: Create .env.production Locally

```bash
cp .env.example .env.production
```

### Step 2: Fill Production Values

```bash
# Edit .env.production
code .env.production

# Use production values
PUBLIC_URL="https://marcusgoll.com"
NODE_ENV="production"
DATABASE_URL="postgresql://user:STRONG_PASSWORD@prod-host:5432/marcusgoll_prod"
NEXT_PUBLIC_SUPABASE_URL="https://api.marcusgoll.com"
NEXT_PUBLIC_SUPABASE_ANON_KEY="production-anon-key"
SUPABASE_SERVICE_ROLE_KEY="production-service-role-key"
RESEND_API_KEY="production-resend-key"
NEWSLETTER_FROM_EMAIL="newsletter@marcusgoll.com"
GA4_MEASUREMENT_ID="G-XXXXXXXXXX"  # Optional but recommended for production
```

### Step 3: Secure Transfer to VPS

**Option A: SCP (Secure Copy)**
```bash
scp .env.production user@your-vps-ip:/var/www/marcusgoll/.env.production
```

**Option B: rsync (More Robust)**
```bash
rsync -avz --progress .env.production user@your-vps-ip:/var/www/marcusgoll/.env.production
```

**Option C: Manual Copy-Paste (Most Secure, No File Transfer)**
```bash
# 1. SSH into VPS
ssh user@your-vps-ip

# 2. Navigate to app directory
cd /var/www/marcusgoll

# 3. Open editor
nano .env.production

# 4. Paste contents from local .env.production
# 5. Save and exit (Ctrl+X, Y, Enter in nano)
```

### Step 4: Set Correct Permissions on VPS

```bash
# SSH into VPS
ssh user@your-vps-ip

# Navigate to app directory
cd /var/www/marcusgoll

# Set restrictive permissions (owner read/write only)
chmod 600 .env.production

# Set correct ownership (web server user)
chown www-data:www-data .env.production

# Verify permissions
ls -la .env.production
# Expected: -rw------- 1 www-data www-data XXXX .env.production
```

### Step 5: Deploy Application

**Using Docker Compose:**
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f nextjs
```

**Using npm (without Docker):**
```bash
# Install dependencies
npm ci --only=production

# Build Next.js application
npm run build

# Start production server
NODE_ENV=production npm run start
```

### Step 6: Verify Deployment

```bash
# Test health endpoint
curl https://marcusgoll.com/api/health

# Expected response:
# {"status":"ok","env":"production"}
```

---

## Environment Variables Reference

### Required Variables (8)

| Variable | Description | Example |
|----------|-------------|---------|
| `PUBLIC_URL` | Base URL for application | `https://marcusgoll.com` |
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://api.marcusgoll.com` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIs...` |
| `RESEND_API_KEY` or `MAILGUN_API_KEY` | Newsletter service API key | `re_xxxx` or `key-xxxx` |
| `NEWSLETTER_FROM_EMAIL` | Verified sender email | `newsletter@marcusgoll.com` |

### Optional Variables (2)

| Variable | Description | Example |
|----------|-------------|---------|
| `DIRECT_DATABASE_URL` | Direct database connection (bypasses pooling) | `postgresql://user:pass@host:5432/db` |
| `GA4_MEASUREMENT_ID` | Google Analytics 4 measurement ID | `G-XXXXXXXXXX` |

### Client-Accessible Variables (2)

Variables prefixed with `NEXT_PUBLIC_*` are exposed to the browser:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important**: Never use `NEXT_PUBLIC_*` prefix for secrets!

---

## Troubleshooting

### Error: "Missing required environment variable"

**Symptom:**
```
❌ Missing required environment variable: DATABASE_URL
   Description: PostgreSQL connection string
   Example: postgresql://user:password@localhost:5432/marcusgoll
```

**Solution:**
1. Check `.env.local` (dev) or `.env.production` (prod) exists
2. Ensure variable is present and not empty
3. Restart dev server (`npm run dev`) or rebuild (`npm run build`)

### Error: "Variable not loading"

**Symptom:** Variable is set but app doesn't see it.

**Solution:**
1. Restart dev server (environment changes require restart)
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
2. Check file precedence:
   - Development: `.env.local` > `.env` > `.env.example`
   - Production: `.env.production` > `.env` > `.env.example`

### Docker Compose not loading variables

**Symptom:** Variables work locally but not in Docker.

**Solution:**
1. Ensure `.env` file exists (Docker uses `.env`, not `.env.local`)
2. Check Docker Compose resolves variables:
   ```bash
   docker-compose config
   ```
3. Restart containers:
   ```bash
   docker-compose restart nextjs
   ```

### Client-side variable undefined

**Symptom:** `process.env.MY_VAR` is `undefined` in browser.

**Solution:**
1. Ensure variable is prefixed with `NEXT_PUBLIC_`:
   ```bash
   # ❌ Wrong (not accessible in browser)
   SUPABASE_URL="http://localhost:54321"

   # ✅ Correct (accessible in browser)
   NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
   ```
2. Rebuild application (NEXT_PUBLIC_* vars baked into build):
   ```bash
   npm run build
   ```

---

## Security Best Practices

### ✅ DO

- **Keep .env files in .gitignore**
  ```bash
  # Verify:
  git status  # Should NOT show .env.local or .env.production
  ```

- **Use different values for development vs production**
  ```bash
  # Development: test@marcusgoll.com
  # Production: newsletter@marcusgoll.com
  ```

- **Rotate secrets regularly** (especially after team changes)
  ```bash
  # 1. Update .env.production
  # 2. Transfer to VPS
  # 3. Restart application
  ```

- **Use strong, unique passwords**
  ```bash
  # ❌ Weak
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db"

  # ✅ Strong
  DATABASE_URL="postgresql://user:X7k$mQ9#pL2@wN5!@host:5432/db"
  ```

- **Set restrictive file permissions on VPS**
  ```bash
  chmod 600 .env.production  # Owner read/write only
  chown www-data:www-data .env.production
  ```

### ❌ DON'T

- **Commit .env files to git** (only `.env.example` is safe)
  ```bash
  # Check git history for leaks:
  git log --all --full-history --source -- "*env*" "*secret*" "*key*"
  ```

- **Share .env.production via email or chat**
  - Use secure transfer methods (scp, rsync, or manual copy-paste via SSH)

- **Use production secrets in development**
  - Always use separate test credentials for local development

- **Expose `SUPABASE_SERVICE_ROLE_KEY` to browser**
  - Never use `NEXT_PUBLIC_` prefix for server-only secrets
  - Service role key bypasses Row Level Security

---

## Next Steps

- **Add new variables**: See `.env.example` and update validation in `lib/validate-env.ts`
- **Rollback procedure**: See `docs/ROLLBACK.md` (if issues occur)
- **Health monitoring**: Use `/api/health` endpoint for uptime checks
- **Change process**: Document all environment variable changes in git commits

---

## Support

- **Environment validation**: `lib/validate-env.ts`
- **TypeScript schema**: `lib/env-schema.ts`
- **Next.js docs**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- **Supabase docs**: https://supabase.com/docs/guides/api
- **Resend docs**: https://resend.com/docs
- **Mailgun docs**: https://documentation.mailgun.com
