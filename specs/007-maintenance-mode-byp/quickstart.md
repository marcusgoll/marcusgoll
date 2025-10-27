# Quickstart: Maintenance Mode with Secret Bypass

**Feature**: maintenance-mode-byp
**Prerequisites**: Node.js 18+, Next.js 15.5+, OpenSSL (for token generation)

This guide walks through common development and testing scenarios for the maintenance mode feature.

---

## Table of Contents

1. [Initial Setup](#scenario-1-initial-setup)
2. [Local Development Testing](#scenario-2-local-development-testing)
3. [Environment Variable Management](#scenario-3-environment-variable-management)
4. [Manual Testing](#scenario-4-manual-testing)
5. [Validation & Quality Checks](#scenario-5-validation--quality-checks)
6. [Production Deployment](#scenario-6-production-deployment)
7. [Troubleshooting](#scenario-7-troubleshooting)

---

## Scenario 1: Initial Setup

### 1.1 Generate Bypass Token

```bash
# Generate cryptographically secure 64-character hex token
openssl rand -hex 32

# Output example (save this):
# a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890
```

**Note**: Save this token securely. You'll need it for local development and deployment.

---

### 1.2 Configure Environment Variables

**Local Development** (`.env.local`):

```bash
# Copy from example
cp .env.example .env.local

# Add maintenance mode variables to .env.local
cat >> .env.local <<EOF

# ==============================================================================
# Maintenance Mode Configuration
# ==============================================================================

# MAINTENANCE_MODE - Toggle maintenance mode on/off
# Values: "true" (enabled) | "false" (disabled)
# Default: "false"
MAINTENANCE_MODE="false"

# MAINTENANCE_BYPASS_TOKEN - Secret token for developer bypass
# Format: 64-character hexadecimal string
# Generation: openssl rand -hex 32
# KEEP SECRET - allows bypassing maintenance mode
MAINTENANCE_BYPASS_TOKEN="<paste_your_generated_token_here>"
EOF

# Edit .env.local and replace placeholder with actual token
nano .env.local
```

---

### 1.3 Update Environment Variable Schema

**File**: `lib/env-schema.ts`

```typescript
// Add to EnvironmentVariables interface
export interface EnvironmentVariables {
  // ... existing variables ...

  /**
   * Maintenance mode toggle
   * @required No (default: "false")
   * @format "true" | "false" (case-insensitive)
   * @purpose Enable/disable maintenance mode without code deployment
   */
  MAINTENANCE_MODE?: string;

  /**
   * Bypass token for developer access
   * @required Only when MAINTENANCE_MODE="true"
   * @format 64-character hexadecimal string
   * @security KEEP SECRET - allows bypassing maintenance mode
   * @generation openssl rand -hex 32
   */
  MAINTENANCE_BYPASS_TOKEN?: string;
}

// Add to ENV_CATEGORIES
export const ENV_CATEGORIES = {
  // ... existing categories ...
  maintenance: ['MAINTENANCE_MODE', 'MAINTENANCE_BYPASS_TOKEN'],
} as const;

// Add to ENV_REQUIREMENTS
export const ENV_REQUIREMENTS = {
  required: [
    // ... existing required vars ...
  ],
  optional: [
    // ... existing optional vars ...
    'MAINTENANCE_MODE',
    'MAINTENANCE_BYPASS_TOKEN',
  ],
} as const;
```

---

### 1.4 Update .env.example Template

Add documentation to `.env.example`:

```bash
# ==============================================================================
# Maintenance Mode Configuration
# ==============================================================================

# MAINTENANCE_MODE - Toggle maintenance mode on/off
# Required: No (default: "false")
# Format: "true" (enabled) | "false" (disabled)
# Purpose: Show maintenance page to external visitors while allowing developer bypass
# Change takes effect: Next request (<1 minute)
MAINTENANCE_MODE="false"

# MAINTENANCE_BYPASS_TOKEN - Secret token for developer bypass
# Required: Yes (when MAINTENANCE_MODE="true")
# Format: 64-character hexadecimal string
# Generation: openssl rand -hex 32
# Purpose: Allows developers to access site during maintenance mode
# Usage: Visit https://yoursite.com/?bypass=<TOKEN>
# Security: KEEP SECRET - Store in environment variable only, never commit to git
MAINTENANCE_BYPASS_TOKEN="generate_with_openssl_rand_hex_32"
```

---

## Scenario 2: Local Development Testing

### 2.1 Start Development Server

```bash
# Ensure environment variables are set
cat .env.local | grep MAINTENANCE

# Start Next.js dev server
npm run dev
# or
pnpm dev
# or
yarn dev

# Server runs at: http://localhost:3000
```

---

### 2.2 Test Maintenance Mode OFF (Default)

```bash
# Verify MAINTENANCE_MODE is "false" in .env.local
grep MAINTENANCE_MODE .env.local

# Visit site (should load normally)
open http://localhost:3000

# Expected: Homepage loads normally, no maintenance page
```

---

### 2.3 Enable Maintenance Mode Locally

**Option A: Edit .env.local**

```bash
# Edit .env.local
nano .env.local

# Change:
MAINTENANCE_MODE="false"

# To:
MAINTENANCE_MODE="true"

# Save and restart dev server
# (Next.js 15 hot-reloads env vars, but restart ensures consistency)
npm run dev
```

**Option B: Temporary Override (Shell)**

```bash
# Set for current terminal session only
export MAINTENANCE_MODE="true"

# Run dev server with override
npm run dev
```

---

### 2.4 Test Maintenance Mode ON (No Bypass)

```bash
# Visit site without bypass token
open http://localhost:3000

# Expected:
# - Redirects to http://localhost:3000/maintenance
# - Maintenance page displays with Navy 900/Emerald 600 branding
# - Message: "We'll be back soon"
```

---

### 2.5 Test Bypass with Token

```bash
# Get your bypass token from .env.local
TOKEN=$(grep MAINTENANCE_BYPASS_TOKEN .env.local | cut -d'"' -f2)

# Visit with bypass token
open "http://localhost:3000/?bypass=$TOKEN"

# Expected:
# - Redirects to http://localhost:3000 (clean URL, token removed)
# - Cookie set: maintenance_bypass=true (24-hour expiration)
# - Homepage loads normally (bypassed maintenance mode)

# Verify cookie in browser:
# 1. Open DevTools (F12)
# 2. Application tab → Cookies → http://localhost:3000
# 3. Look for: maintenance_bypass=true
# 4. Verify flags: HttpOnly ✓, Secure ✗ (HTTP in dev), SameSite=Strict ✓
```

---

### 2.6 Test Bypass Persistence

```bash
# After successful bypass (cookie set), navigate to other pages
open http://localhost:3000/blog
open http://localhost:3000/about

# Expected:
# - All pages load normally (no maintenance page)
# - Cookie persists across navigation
# - No re-authentication needed for 24 hours
```

---

### 2.7 Test Invalid Bypass Token

```bash
# Visit with wrong token
open "http://localhost:3000/?bypass=wrong_token_12345"

# Expected:
# - Redirects to /maintenance (bypass rejected)
# - No cookie set
# - Console log: [WARN] Maintenance Bypass: Failed - Token: ***45 - IP: ::1
```

---

## Scenario 3: Environment Variable Management

### 3.1 Verify Environment Variables

```bash
# Check if variables are set
node -e "console.log('MAINTENANCE_MODE:', process.env.MAINTENANCE_MODE)"
node -e "console.log('MAINTENANCE_BYPASS_TOKEN:', process.env.MAINTENANCE_BYPASS_TOKEN ? '***' + process.env.MAINTENANCE_BYPASS_TOKEN.slice(-4) : 'NOT SET')"

# Expected output:
# MAINTENANCE_MODE: false
# MAINTENANCE_BYPASS_TOKEN: ***cdef (last 4 chars of your token)
```

---

### 3.2 Test Environment Variable Validation

```bash
# Run Next.js health check
curl http://localhost:3000/api/health | jq

# Expected output includes:
# {
#   "status": "ok",
#   "environment": {
#     "valid": true,
#     ...
#   }
# }
```

---

### 3.3 Rotate Bypass Token

```bash
# Generate new token
NEW_TOKEN=$(openssl rand -hex 32)

# Update .env.local
sed -i.bak "s/MAINTENANCE_BYPASS_TOKEN=.*/MAINTENANCE_BYPASS_TOKEN=\"$NEW_TOKEN\"/" .env.local

# Restart dev server (picks up new token)
npm run dev

# Old tokens no longer work
# Developer must use new token for bypass
```

---

## Scenario 4: Manual Testing

### 4.1 Test Static Assets (Should Not Block)

```bash
# Enable maintenance mode
export MAINTENANCE_MODE="true"
npm run dev

# Test static assets load during maintenance
open http://localhost:3000/_next/static/chunks/main.js
# Expected: Loads normally (HTTP 200)

open http://localhost:3000/images/logo.png
# Expected: Loads normally (HTTP 200)

open http://localhost:3000/fonts/WorkSans-Regular.woff2
# Expected: Loads normally (HTTP 200)

# Verify maintenance page assets also load
open http://localhost:3000/maintenance
# Expected: Page renders with full styling (CSS/fonts loaded)
```

---

### 4.2 Test Health Check Endpoint

```bash
# Enable maintenance mode
export MAINTENANCE_MODE="true"
npm run dev

# Health check should always respond
curl http://localhost:3000/api/health

# Expected: HTTP 200, JSON response
# {
#   "status": "ok",
#   "timestamp": "2025-10-27T12:34:56.789Z",
#   ...
# }

# Health check MUST NOT redirect to /maintenance
```

---

### 4.3 Test Mobile Responsiveness

```bash
# Open maintenance page in responsive mode
open http://localhost:3000/maintenance

# Browser DevTools (F12):
# 1. Toggle device toolbar (Ctrl+Shift+M)
# 2. Test breakpoints:
#    - Mobile: 375x667 (iPhone SE)
#    - Tablet: 768x1024 (iPad)
#    - Desktop: 1920x1080

# Verify:
# - Text readable at all sizes
# - Layout adapts to screen width
# - No horizontal scrolling
# - Touch targets ≥44x44px
```

---

### 4.4 Test Accessibility

```bash
# Install axe DevTools extension (Chrome/Firefox)
# Visit maintenance page
open http://localhost:3000/maintenance

# Browser DevTools → axe DevTools tab:
# 1. Click "Scan for Issues"
# 2. Review results

# Expected: 0 critical issues
# - Color contrast: ≥4.5:1 (WCAG AA)
# - Semantic HTML: Proper headings, landmarks
# - Keyboard navigation: Tab order logical
# - Screen reader: Meaningful text, no missing alt text
```

---

### 4.5 Test Keyboard Navigation

```bash
# Visit maintenance page
open http://localhost:3000/maintenance

# Test keyboard navigation:
# 1. Tab key: Navigate through interactive elements
# 2. Shift+Tab: Navigate backward
# 3. Enter: Activate links/buttons
# 4. Esc: Close modals (if any)

# Verify:
# - Focus visible (outline or highlight)
# - Tab order logical (top to bottom, left to right)
# - All interactive elements reachable
# - No focus traps
```

---

## Scenario 5: Validation & Quality Checks

### 5.1 Run TypeScript Type Checking

```bash
# Check for type errors
npm run type-check
# or
npx tsc --noEmit

# Expected: No type errors in middleware.ts or maintenance page
```

---

### 5.2 Run Linting

```bash
# Check code style
npm run lint

# Expected: No errors in middleware.ts or maintenance page
# Warnings acceptable if justified
```

---

### 5.3 Run Build (Production Bundle)

```bash
# Build Next.js production bundle
npm run build

# Expected output:
# - Middleware compiled to Edge Runtime
# - Maintenance page pre-rendered (SSG)
# - No build errors

# Check build output:
# Route (app)                                Size
# ○ /maintenance                             1.2 kB         42 B
#
# Legend:
# ○  (Static)  automatically rendered as static HTML
```

---

### 5.4 Test Production Build Locally

```bash
# Build and start production server
npm run build
npm run start

# Server runs at: http://localhost:3000

# Test scenarios from Scenario 2 (same behavior as dev)
```

---

### 5.5 Run Lighthouse Audit

```bash
# Open maintenance page in Chrome
open http://localhost:3000/maintenance

# Browser DevTools → Lighthouse tab:
# 1. Select: Performance, Accessibility, Best Practices, SEO
# 2. Device: Mobile (throttled 3G)
# 3. Click "Analyze page load"

# Expected scores:
# - Performance: ≥85 (target: FCP <1.5s, LCP <2.5s)
# - Accessibility: ≥95 (WCAG AA)
# - Best Practices: ≥90
# - SEO: ≥90
```

---

### 5.6 Measure Middleware Performance

```bash
# Enable Server-Timing header in middleware
# Add to middleware.ts:
# response.headers.set('Server-Timing', `middleware;dur=${duration}`)

# Visit page and check Server-Timing header
curl -I http://localhost:3000

# Or in Browser DevTools → Network → Timing tab

# Expected: Server-Timing: middleware;dur=<5ms
```

---

## Scenario 6: Production Deployment

### 6.1 Deploy to Vercel (Staging/Production)

**Prerequisites**:
- Vercel project connected to Git repo
- Vercel CLI installed (`npm install -g vercel`)

```bash
# Login to Vercel
vercel login

# Set environment variables in Vercel dashboard
# or via CLI:

# Generate production token
PROD_TOKEN=$(openssl rand -hex 32)

# Set staging environment variables
vercel env add MAINTENANCE_MODE --environment preview
# Value: false

vercel env add MAINTENANCE_BYPASS_TOKEN --environment preview
# Value: <paste_token>

# Set production environment variables
vercel env add MAINTENANCE_MODE --environment production
# Value: false

vercel env add MAINTENANCE_BYPASS_TOKEN --environment production
# Value: <paste_prod_token>

# Deploy to staging (preview)
git push origin feature/maintenance-mode

# Expected: Vercel auto-deploys preview
# URL: https://marcusgoll-<hash>.vercel.app

# Test staging deployment (same scenarios as local)
```

---

### 6.2 Enable Maintenance Mode in Production

**Via Vercel Dashboard**:

1. Go to: https://vercel.com/dashboard
2. Select project: marcusgoll
3. Settings → Environment Variables
4. Find: MAINTENANCE_MODE
5. Edit → Change to "true"
6. Save

**Takes effect**: Next request (<1 minute, no redeployment needed)

**Via Vercel CLI**:

```bash
# Update production environment variable
vercel env rm MAINTENANCE_MODE --environment production
vercel env add MAINTENANCE_MODE --environment production
# Value: true

# Takes effect: Next request (<1 minute)
```

---

### 6.3 Verify Maintenance Mode in Production

```bash
# Visit production site (without bypass)
open https://marcusgoll.com

# Expected: Redirects to /maintenance

# Test bypass (use production token)
PROD_TOKEN="<your_production_token>"
open "https://marcusgoll.com/?bypass=$PROD_TOKEN"

# Expected: Cookie set, site loads normally
```

---

### 6.4 Disable Maintenance Mode in Production

```bash
# Update environment variable (Vercel dashboard or CLI)
# MAINTENANCE_MODE="true" → "false"

# Takes effect: Next request (<1 minute)

# Verify site loads normally for all visitors
open https://marcusgoll.com
# Expected: Homepage loads (no maintenance page)
```

---

## Scenario 7: Troubleshooting

### 7.1 Maintenance Page Not Showing

**Symptoms**: Site loads normally even though MAINTENANCE_MODE="true"

**Checks**:

```bash
# 1. Verify environment variable is set
node -e "console.log(process.env.MAINTENANCE_MODE)"

# 2. Check if middleware.ts exists at project root
ls -la middleware.ts

# 3. Check if bypass cookie is set (clear cookies)
# Browser DevTools → Application → Cookies → Clear

# 4. Check middleware matcher (ensure path not excluded)
cat middleware.ts | grep -A 10 "export const config"

# 5. Restart dev server (ensure env vars loaded)
npm run dev
```

---

### 7.2 Infinite Redirect Loop

**Symptoms**: Browser shows "Too many redirects" error

**Likely Cause**: /maintenance path not excluded from middleware

**Fix**:

```typescript
// middleware.ts - ensure /maintenance is excluded
export const config = {
  matcher: [
    '/((?!_next|images|fonts|api/health|maintenance).*)',
    //                                  ^^^^^^^^^^^ Must be here
  ],
};
```

---

### 7.3 Bypass Token Not Working

**Symptoms**: Valid token doesn't set cookie or allow access

**Checks**:

```bash
# 1. Verify token matches environment variable (character-perfect)
TOKEN_ENV=$(grep MAINTENANCE_BYPASS_TOKEN .env.local | cut -d'"' -f2)
echo "Env token: $TOKEN_ENV"
echo "Your token: <paste_your_token>"

# 2. Check for whitespace/newlines in token
echo -n "$TOKEN_ENV" | hexdump -C

# 3. Verify token is 64 characters
echo -n "$TOKEN_ENV" | wc -c
# Expected: 64

# 4. Check console logs for errors
# Browser DevTools → Console
# Look for: [WARN] Maintenance Bypass: Failed

# 5. Test with fresh browser session (clear cookies/cache)
```

---

### 7.4 Cookie Not Persisting

**Symptoms**: Bypass works once, then maintenance page shows again

**Checks**:

```bash
# 1. Verify cookie flags in browser
# DevTools → Application → Cookies → maintenance_bypass
# Check: HttpOnly ✓, SameSite=Strict ✓, Expires (24hr)

# 2. Check if cookie expired (24-hour lifetime)
# Cookie timestamp vs current time

# 3. Verify HTTPS in production (Secure flag requires HTTPS)
# For local dev, HTTP is acceptable (Secure flag ignored)

# 4. Check if browser blocking third-party cookies
# Settings → Privacy → Cookies → Allow all cookies (for testing)
```

---

### 7.5 Static Assets Blocked

**Symptoms**: Maintenance page has no styling, images missing

**Checks**:

```bash
# 1. Verify excluded paths in middleware matcher
cat middleware.ts | grep "matcher"

# Expected pattern: /((?!_next|images|fonts|...

# 2. Check browser Network tab
# Look for 302 redirects on /_next/* requests

# 3. Test static asset directly
curl -I http://localhost:3000/_next/static/chunks/main.js
# Expected: HTTP 200 (not 302 redirect)
```

---

### 7.6 Health Check Blocked

**Symptoms**: Health check returns 302 redirect or maintenance page

**Checks**:

```bash
# 1. Verify /api/health is excluded in middleware
cat middleware.ts | grep "api/health"

# 2. Test health check directly
curl -I http://localhost:3000/api/health
# Expected: HTTP 200, JSON response (not 302)

# 3. Check middleware matcher pattern
# Ensure: /((?!_next|...|api/health|...).*) includes api/health
```

---

### 7.7 Performance Issues

**Symptoms**: Middleware adds >10ms overhead

**Diagnostics**:

```bash
# 1. Add timing logs to middleware
console.time('middleware')
// ... middleware logic ...
console.timeEnd('middleware')

# 2. Check Server-Timing header
curl -I http://localhost:3000 | grep Server-Timing

# 3. Profile with Lighthouse (Performance audit)
# Expected: Middleware overhead <10ms

# 4. Check for slow operations (async calls, database queries)
# Middleware should be synchronous only
```

---

## Quick Reference

### Common Commands

```bash
# Generate bypass token
openssl rand -hex 32

# Enable maintenance mode locally
export MAINTENANCE_MODE="true" && npm run dev

# Disable maintenance mode locally
export MAINTENANCE_MODE="false" && npm run dev

# Check environment variables
cat .env.local | grep MAINTENANCE

# Clear bypass cookie
# Browser: DevTools → Application → Cookies → Delete maintenance_bypass

# Test bypass
open "http://localhost:3000/?bypass=$(grep MAINTENANCE_BYPASS_TOKEN .env.local | cut -d'"' -f2)"

# Run full build and test
npm run build && npm run start
```

---

### File Checklist

After implementation, verify these files exist:

```bash
✓ middleware.ts (project root)
✓ app/maintenance/page.tsx
✓ app/maintenance/layout.tsx (optional)
✓ lib/maintenance-utils.ts (optional)
✓ lib/env-schema.ts (updated)
✓ .env.local (with MAINTENANCE_MODE, MAINTENANCE_BYPASS_TOKEN)
✓ .env.example (updated documentation)
```

---

### Environment Variables Summary

```bash
# Local Development (.env.local)
MAINTENANCE_MODE="false"
MAINTENANCE_BYPASS_TOKEN="<64_char_hex_token>"

# Staging (Vercel)
MAINTENANCE_MODE="false"  # or "true" during testing
MAINTENANCE_BYPASS_TOKEN="<staging_token>"

# Production (Vercel)
MAINTENANCE_MODE="false"  # toggle to "true" during DNS migration
MAINTENANCE_BYPASS_TOKEN="<production_token>"
```

---

## Next Steps

After completing quickstart:

1. **Run Unit Tests**: `npm test` (test middleware logic)
2. **Run Integration Tests**: Test full user scenarios
3. **Perform QA**: Manual testing on mobile/tablet/desktop
4. **Deploy to Staging**: Verify in production-like environment
5. **Deploy to Production**: Toggle maintenance mode as needed

---

## Support

**Spec**: `specs/007-maintenance-mode-byp/spec.md`
**Plan**: `specs/007-maintenance-mode-byp/plan.md`
**Contracts**: `specs/007-maintenance-mode-byp/contracts/middleware-config.yaml`
**Issues**: GitHub Issues with tag `maintenance-mode`

---

**Last Updated**: 2025-10-27
**Feature Status**: Planning Complete, Implementation Pending
