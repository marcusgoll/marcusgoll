# Environment Variables Setup Guide

Complete reference for all environment variables used in marcusgoll.com application.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [Environment-Specific Values](#environment-specific-values)
5. [How to Update Variables](#how-to-update-variables)
6. [Security Best Practices](#security-best-practices)
7. [Validation & Testing](#validation--testing)

---

## Quick Reference

### Currently Configured

```bash
# Production (test.marcusgoll.com)
PUBLIC_URL=https://test.marcusgoll.com
NEXT_PUBLIC_SITE_URL=https://test.marcusgoll.com
NODE_ENV=production
NEXT_PUBLIC_GA_ID=G-SE02S59BZW
RESEND_API_KEY=[REDACTED - See Dokploy Secrets for actual value]
DATABASE_URL=postgresql://postgres:[REDACTED_PASSWORD]@[REDACTED_VPS_IP]:5433/marcusgoll_db
NEXT_PUBLIC_APP_URL=https://deploy.marcusgoll.com (Dokploy only)
```

---

## Required Variables

### 1. PUBLIC_URL

**Purpose**: Base URL for the application (used in absolute URLs, emails, sitemaps)

**Type**: Public string (client-accessible)

**Values**:
```bash
# Local development
PUBLIC_URL=http://localhost:3000

# Staging
PUBLIC_URL=https://staging.marcusgoll.com

# Production (current)
PUBLIC_URL=https://test.marcusgoll.com

# Production (future after DNS cutover)
PUBLIC_URL=https://marcusgoll.com
```

**Used By**:
- Email links in newsletter
- Sitemap generation
- RSS feed absolute URLs
- Open Graph image URLs
- Canonical URL generation

**Update After**: DNS cutover to marcusgoll.com

---

### 2. NEXT_PUBLIC_SITE_URL

**Purpose**: Canonical site URL for SEO and social sharing

**Type**: Public (exposed to client-side code)

**Format**: `https://domain.com` (no trailing slash)

**Values**:
```bash
# Local development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Staging
NEXT_PUBLIC_SITE_URL=https://staging.marcusgoll.com

# Production (current)
NEXT_PUBLIC_SITE_URL=https://test.marcusgoll.com

# Production (future)
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
```

**Used By**:
- `<meta rel="canonical">` tags
- Open Graph (`og:url`)
- Twitter Card (`twitter:url`)
- Schema.org structured data
- Canonical redirects

**Update After**: DNS cutover to marcusgoll.com

---

### 3. NODE_ENV

**Purpose**: Execution environment mode

**Type**: Fixed enumeration

**Valid Values**:
```bash
NODE_ENV=development    # Local dev, extra logging, no optimization
NODE_ENV=production     # Production, optimized, minified
NODE_ENV=test          # Testing mode (if test runner needs it)
```

**Current Value**: `production`

**Used By**:
- Build optimization
- Error reporting level
- Logging verbosity
- Performance monitoring
- Cache strategies

**Never Change**: In production (Docker build sets this to `production`)

---

### 4. NEXT_PUBLIC_GA_ID

**Purpose**: Google Analytics 4 measurement ID for tracking

**Type**: Public string (client-side)

**Format**: `G-` followed by alphanumeric code

**Current Value**: `G-SE02S59BZW`

**Purpose**: Track:
- Page views by domain
- User interactions
- Content engagement
- Traffic sources
- Conversion events

**How to Find**:
1. Go to Google Analytics 4 dashboard
2. Admin → Data Streams
3. Select your property (marcusgoll.com)
4. Copy Measurement ID (starts with "G-")

**Update When**: Need to change tracking or create new GA property

---

### 5. DATABASE_URL

**Purpose**: PostgreSQL database connection string

**Type**: Secret (never expose to client or logs)

**Format**:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Current Value** (example structure):
```
postgresql://postgres:PASSWORD@5.161.75.135:5433/marcusgoll_db
```

**Components**:
| Component | Value | Purpose |
|-----------|-------|---------|
| Protocol | `postgresql://` | Database type |
| User | `postgres` | DB user account |
| Password | `***` | DB password (SECRET) |
| Host | `5.161.75.135` | VPS IP address |
| Port | `5433` | Database port |
| Database | `marcusgoll_db` | Database name |

**Used By**:
- Prisma ORM connections
- Direct database queries
- Database migrations
- Connection pooling

**Where Stored**: Dokploy secrets (not in code)

**How to Update**:
```bash
# Via Dokploy Web UI (Recommended):
# 1. Applications > marcusgoll-nextjs
# 2. Environment Variables (Secrets)
# 3. Update DATABASE_URL value
# 4. Deploy

# Via CLI (Advanced):
ssh [vps-host]
docker service update marcusgoll-nextjs \
  --secret-rm DATABASE_URL \
  --secret-add "DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]"
```

**Testing Connection**:
```bash
ssh [vps-host]
docker exec postgres psql -U postgres -d marcusgoll_db -c "SELECT 1;"
```

---

### 6. NEXT_PUBLIC_APP_URL

**Purpose**: Dokploy dashboard origin URL (for CORS/auth validation)

**Type**: Public string (Dokploy use only)

**Current Value**: `https://deploy.marcusgoll.com`

**Used By**: Dokploy application authentication

**Where to Set**: In Dokploy service environment variables

**Never Change**: Unless Dokploy domain changes

---

## Optional Variables

### 1. RESEND_API_KEY

**Purpose**: Email service API key for sending newsletters

**Type**: Secret (highly sensitive)

**Format**: `re_` followed by alphanumeric code

**Current Value**: [REDACTED - See Dokploy Secrets]

**Used By**:
- Newsletter email sending
- Transactional emails
- Contact form emails
- Admin notifications

**How to Get**:
1. Visit https://resend.com
2. Dashboard → API Keys
3. Generate new key or copy existing
4. Copy full key (starts with "re_")

**Alternative**: Use MAILGUN_API_KEY instead

**Update When**:
- Key rotated for security
- Switching email providers
- Rate limits reached

**Testing**:
```javascript
// In Node.js/Next.js
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
  body: JSON.stringify({ to: 'test@example.com', ... })
});
```

---

### 2. MAILGUN_API_KEY (Alternative to Resend)

**Purpose**: Email service via Mailgun

**Type**: Secret (sensitive)

**Format**: `key-` followed by alphanumeric code

**Used By**: Newsletter and transactional emails (if using Mailgun)

**Note**: Currently using Resend, can switch if needed

---

### 3. NEWSLETTER_FROM_EMAIL

**Purpose**: "From" email address for newsletters

**Type**: Email format

**Format**: `email@domain.com` or `"Name <email@domain.com>"`

**Current Value**: `newsletter@marcusgoll.com`

**Used By**: Resend/Mailgun email sender

**Must Be**: Verified in email service dashboard

**Update When**: Changing sender email address

---

### 4. SUPABASE_URL

**Purpose**: Supabase/PostgREST API endpoint

**Type**: Public URL

**Format**: `https://project-id.supabase.co`

**Status**: Optional (not currently used for this project)

**Used When**: Implementing auth or real-time features

---

### 5. SUPABASE_ANON_KEY

**Purpose**: Public anonymous key for Supabase

**Type**: Public (safe to expose, respects RLS)

**Status**: Optional

**Used When**: Client-side Supabase calls

---

### 6. SUPABASE_SERVICE_ROLE_KEY

**Purpose**: Admin key for server-side Supabase operations

**Type**: Secret (NEVER expose to client)

**Status**: Optional

**Security**: This key bypasses Row Level Security - keep secret!

---

### 7. MAINTENANCE_MODE

**Purpose**: Enable/disable maintenance page

**Type**: Boolean string

**Valid Values**:
```bash
MAINTENANCE_MODE=false      # Normal operation
MAINTENANCE_MODE=true       # Show maintenance page
```

**Default**: `false`

**Used By**: Middleware to show maintenance page

**Update When**: Deploying major database changes

---

### 8. MAINTENANCE_BYPASS_TOKEN

**Purpose**: Secret token to bypass maintenance mode

**Type**: Secret (64-character hex string)

**Format**: `openssl rand -hex 32` output

**Example**: `a3f7c2e91d4b8f6a5c2e9d3f1b8a4c7e6f2a9d5c1e3f6a8b2d4c7e9f1a3b5`

**Used By**: Developers to access site during maintenance via `?bypass=TOKEN`

**Generate New Token**:
```bash
openssl rand -hex 32
# Copy output and set as MAINTENANCE_BYPASS_TOKEN
```

**Usage**: `https://marcusgoll.com/?bypass=TOKEN` (sets 24-hour cookie)

---

## Environment-Specific Values

### Local Development

```bash
# .env.local (never commit)
PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Optional - use fake keys or skip
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # or skip
RESEND_API_KEY=test_key         # or skip
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marcusgoll_dev
```

**Start with**:
```bash
cp .env.example .env.local
# Edit values for local setup
npm run dev
```

---

### Staging

```bash
PUBLIC_URL=https://staging.marcusgoll.com
NEXT_PUBLIC_SITE_URL=https://staging.marcusgoll.com
NODE_ENV=production

NEXT_PUBLIC_GA_ID=G-SE02S59BZW  # Use staging GA property or same

DATABASE_URL=postgresql://postgres:[REDACTED_PASSWORD]@[REDACTED_VPS_IP]:5433/marcusgoll_db
# Should point to test/staging database, not production

RESEND_API_KEY=[REDACTED - See Dokploy Secrets]
# Staging/test API key (separate from production)
```

---

### Production (Current: test.marcusgoll.com)

```bash
PUBLIC_URL=https://test.marcusgoll.com
NEXT_PUBLIC_SITE_URL=https://test.marcusgoll.com
NODE_ENV=production

NEXT_PUBLIC_GA_ID=G-SE02S59BZW  # Production GA property

DATABASE_URL=postgresql://postgres:[REDACTED_PASSWORD]@[REDACTED_VPS_IP]:5433/marcusgoll_db
# Production database (stored securely in Dokploy)

RESEND_API_KEY=[REDACTED - See Dokploy Secrets]
# Production Resend key
```

---

### Production (Future: marcusgoll.com)

After DNS cutover, update:

```bash
PUBLIC_URL=https://marcusgoll.com
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
NODE_ENV=production

# Everything else stays the same
NEXT_PUBLIC_GA_ID=G-SE02S59BZW
DATABASE_URL=postgresql://postgres:[REDACTED_PASSWORD]@[REDACTED_VPS_IP]:5433/marcusgoll_db
RESEND_API_KEY=[REDACTED - See Dokploy Secrets]
```

---

## How to Update Variables

### Via Dokploy Web UI (Recommended)

```
1. Go to https://deploy.marcusgoll.com
2. Log in with Dokploy credentials
3. Select Applications > marcusgoll-nextjs
4. Click "Edit Environment Variables"
5. Update values (secrets marked with 🔒)
6. Click "Deploy" or "Update Configuration"
7. Wait for service to restart (~30 seconds)
8. Verify: curl -I https://test.marcusgoll.com
```

### Via Docker CLI (Advanced)

```bash
ssh hetzner

# Add or update variable
docker service update marcusgoll-nextjs \
  --env-add "PUBLIC_URL=https://marcusgoll.com"

# For secrets (sensitive data)
docker service update marcusgoll-nextjs \
  --secret-add "DATABASE_URL=postgresql://..."

# Monitor restart
docker service ps marcusgoll-nextjs

# Verify
docker service inspect marcusgoll-nextjs | grep "PUBLIC_URL"
```

### Via GitHub Actions (If Using CI/CD)

Set secrets in GitHub repository:

```
Settings > Secrets and variables > Actions
```

Add secrets:
- `RESEND_API_KEY`
- `DATABASE_URL`
- `PRODUCTION_URL` (for deployment)

---

## Security Best Practices

### 1. Never Commit Secrets

```bash
# ❌ WRONG - Will expose secrets
git add .env
git add .env.production

# ✅ CORRECT - Already in .gitignore
# Only commit .env.example
git add .env.example
```

**Verify .gitignore**:
```bash
cat .gitignore | grep -E "^\.env"
# Should show:
# .env
# .env.local
# .env.production
# .env.*.local
```

### 2. Separate Secrets by Environment

```bash
# Local development
.env.local              # Not committed, local secrets

# Production
Dokploy secrets tab     # Production secrets stored securely

# Never mix:
❌ Same API keys in dev and prod
✅ Separate keys for each environment
```

### 3. Rotate Keys Regularly

```bash
# Every 90 days or when team changes:
1. Generate new Resend API key
2. Update in Dokploy
3. Invalidate old key in Resend dashboard
4. Document rotation date
5. Repeat for DATABASE_URL if password changed
```

### 4. Protect DATABASE_URL

This is the most sensitive variable:

```bash
✅ DO:
  - Store only in Dokploy secrets
  - Include password hash/token
  - Use unique password per environment
  - Rotate when team changes

❌ DON'T:
  - Log it in application output
  - Share via email or chat
  - Commit to Git
  - Use same password across environments
```

### 5. API Key Naming

For keys starting with provider prefix:

```bash
# Resend API key format
re_[random_string]     # Identifies provider

# Mailgun API key format
key-[domain]_[random]  # Includes domain info

# Google Analytics ID format
G-[uppercase_numbers]  # Easy to identify
```

---

## Validation & Testing

### Verify Variables Are Set

```bash
ssh hetzner

# Check application sees variables
docker service inspect marcusgoll-nextjs | grep -E "PUBLIC_URL|DATABASE_URL"

# Check specific variable
docker exec -it $(docker ps -q -f "label=app=nextjs") \
  sh -c 'echo PUBLIC_URL=$PUBLIC_URL'
```

### Test Database Connection

```bash
ssh hetzner

# PostgreSQL
docker exec postgres \
  psql -U postgres -d marcusgoll_db -c "SELECT 1;"
# Expected: (1 row) with value "1"
```

### Test Email Service

```bash
# If Resend API key set, can test:
curl https://api.resend.com/emails -X POST \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -d '{"from": "test@marcusgoll.com", "to": "your@email.com", "subject": "Test", "html": "Test"}'
```

### Test Analytics Tracking

```bash
# Check GA measurement ID
curl https://test.marcusgoll.com | grep "G-SE02S59BZW"
# Should see Google Analytics script with ID
```

### Validate on Startup

The application validates environment on start:

```bash
docker service logs marcusgoll-nextjs | grep -i "error\|missing\|invalid"
# Should see no errors if all variables correct
```

---

## Common Issues

### Issue: 502 Bad Gateway After Variable Update

**Cause**: Service restarting

**Solution**:
```bash
ssh hetzner
docker service ps marcusgoll-nextjs
# Wait for task state to become "Running"
sleep 10
curl -I https://test.marcusgoll.com
```

### Issue: Database Connection Error

**Cause**: Wrong DATABASE_URL

**Verify**:
```bash
ssh hetzner
docker exec postgres psql -U postgres -d marcusgoll_db -c "SELECT 1;"
```

**Fix**:
```bash
# Update with correct connection string (via Dokploy or CLI)
docker service update marcusgoll-nextjs \
  --secret-rm DATABASE_URL \
  --secret-add "DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5433/marcusgoll_db"
# Replace [PASSWORD] and [HOST] with actual values
```

### Issue: Emails Not Sending

**Cause**: Invalid RESEND_API_KEY or not verified

**Check**:
```bash
# 1. Verify key format starts with "re_"
# 2. Log in to Resend dashboard
# 3. Check API keys are active
# 4. Test with curl command above
```

### Issue: Environment Variable Not Updated

**Cause**: Service not restarted after update

**Fix**:
```bash
ssh hetzner
# Force restart
docker service update --force marcusgoll-nextjs
# Wait for restart
sleep 30
# Verify
docker service inspect marcusgoll-nextjs | grep "PUBLIC_URL"
```

---

## Summary Table

| Variable | Required | Type | Provider | Purpose |
|----------|----------|------|----------|---------|
| PUBLIC_URL | ✅ Yes | Public | None | Base URL for absolute links |
| NEXT_PUBLIC_SITE_URL | ✅ Yes | Public | None | Canonical URL for SEO |
| NODE_ENV | ✅ Yes | Fixed | None | Execution mode |
| NEXT_PUBLIC_GA_ID | ✅ Yes | Public | Google Analytics | Analytics tracking |
| DATABASE_URL | ✅ Yes | Secret | PostgreSQL | Database connection |
| NEXT_PUBLIC_APP_URL | ✅ Yes | Public | Dokploy | Dokploy auth |
| RESEND_API_KEY | ⚠️ Optional | Secret | Resend | Email sending |
| MAILGUN_API_KEY | ⚠️ Optional | Secret | Mailgun | Email alternative |
| NEWSLETTER_FROM_EMAIL | ⚠️ Optional | Public | Resend | Email sender |
| MAINTENANCE_MODE | ⚠️ Optional | Public | None | Maintenance flag |
| MAINTENANCE_BYPASS_TOKEN | ⚠️ Optional | Secret | None | Maintenance bypass |
| SUPABASE_URL | ⚠️ Optional | Public | Supabase | API endpoint |
| SUPABASE_ANON_KEY | ⚠️ Optional | Public | Supabase | Anonymous access |
| SUPABASE_SERVICE_ROLE_KEY | ⚠️ Optional | Secret | Supabase | Admin access |

---

## Next Steps

1. **Review**: Check all variables are correctly set in Dokploy
2. **Test**: Run health checks to verify configuration
3. **Document**: Update this guide if adding new variables
4. **Secure**: Ensure secrets follow security best practices
5. **Monitor**: Check logs after any variable changes
