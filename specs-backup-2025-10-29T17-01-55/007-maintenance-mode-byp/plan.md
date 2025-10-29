# Implementation Plan: Maintenance Mode with Secret Bypass

**Feature Slug**: 007-maintenance-mode-byp
**Planning Date**: 2025-10-27
**Estimated Complexity**: Medium (middleware implementation, security-critical)
**Implementation Time**: 6-8 hours (including testing)

---

## Executive Summary

Implement Next.js Edge Middleware to enable maintenance mode with secret bypass functionality. Allows DNS migration before production readiness by showing external visitors a branded maintenance page while developers can bypass via cryptographically secure token. Zero code deployment required to toggle on/off.

**Key Innovation**: Environment variable toggle + persistent bypass cookie = zero-downtime maintenance mode.

---

## Research Summary

**Research Depth**: Full codebase analysis (11 tool calls)
**Research File**: See `research.md` for complete findings

**Key Discoveries**:
- ✅ Excellent existing environment variable infrastructure (env-schema.ts, validate-env.ts)
- ✅ No existing middleware (clean slate implementation)
- ✅ Health check endpoint pattern available for reference (NextResponse usage)
- ✅ Tailwind CSS configured (ready for maintenance page styling)
- ✅ No new dependencies needed (pure Next.js 15 implementation)

**Components to Reuse**: 4 identified
**New Components Needed**: 4 required
**Unknowns Resolved**: 7/7 (all technical questions answered)

---

## Architecture Decisions

### Decision Matrix

| Decision | Choice | Rationale | Alternative Rejected |
|----------|--------|-----------|---------------------|
| **Request Interception** | Next.js Edge Middleware | Built-in, low latency, global execution | Express middleware (requires separate server) |
| **State Management** | Environment variables + HTTP cookies | Stateless, Edge Runtime compatible | Database flags (adds latency, complexity) |
| **Token Security** | 256-bit hex token (openssl) | Cryptographically secure, infeasible brute force | UUID (122-bit, weaker), PIN (too weak) |
| **Cookie Handling** | NextResponse.cookies API | Built-in, security flags supported | js-cookie (client-side only, no HttpOnly) |
| **Maintenance Page** | Server-rendered App Router page | Fast, SEO-friendly, leverages existing setup | Client-side React component (late blocking, poor UX) |
| **Path Exclusion** | Regex matcher in middleware config | Efficient, compiled once at startup | Runtime path checking (slower, repeated work) |

---

## Tech Stack

### Existing Stack (Reused)
- **Framework**: Next.js 15.5.6 (App Router, Edge Middleware)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.15
- **Runtime**: Node.js (Edge Runtime for middleware)
- **Platform**: Vercel (direct-prod deployment model)

### New Dependencies
**None** - Pure Next.js implementation, no external packages required

### Environment Variables (New)
```bash
MAINTENANCE_MODE="true" | "false"          # Toggle maintenance mode
MAINTENANCE_BYPASS_TOKEN="<64_char_hex>"   # Secret bypass token
```

---

## System Architecture

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Incoming Request                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Edge Middleware (middleware.ts)                │
│                                                                   │
│  1. Check if path excluded? (/_next/*, /images/*, /api/health)  │
│     ├─ YES → NextResponse.next() [Exit, <1ms]                   │
│     └─ NO → Continue                                              │
│                                                                   │
│  2. Check MAINTENANCE_MODE === "true"?                           │
│     ├─ NO → NextResponse.next() [Exit, <2ms]                    │
│     └─ YES → Continue                                             │
│                                                                   │
│  3. Check bypass cookie present?                                 │
│     ├─ YES → NextResponse.next() [Exit, <3ms]                   │
│     └─ NO → Continue                                              │
│                                                                   │
│  4. Check ?bypass=<TOKEN> in query?                              │
│     ├─ NO → Redirect to /maintenance [<8ms]                     │
│     └─ YES → Validate token                                      │
│                                                                   │
│  5. Token valid?                                                 │
│     ├─ NO → Log failure, redirect to /maintenance               │
│     └─ YES → Set cookie, log success, redirect (clean URL)      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
┌──────────────────────────────┐   ┌─────────────────────────────┐
│      /maintenance Page       │   │     Normal Route Handler    │
│                              │   │                             │
│  - Navy 900/Emerald 600     │   │  - Homepage, blog, about    │
│  - Responsive design         │   │  - API routes               │
│  - WCAG 2.1 AA compliant    │   │  - Dynamic pages            │
│  - <1.5s FCP target         │   │                             │
└──────────────────────────────┘   └─────────────────────────────┘
```

### Component Architecture

```
project-root/
├── middleware.ts ⭐ NEW
│   ├── Request interception
│   ├── Token validation
│   ├── Cookie management
│   └── Logging
│
├── app/
│   ├── maintenance/ ⭐ NEW
│   │   ├── page.tsx          (Maintenance UI)
│   │   └── layout.tsx        (Optional: minimal layout)
│   │
│   ├── layout.tsx            (Root layout - existing)
│   └── page.tsx              (Homepage - existing)
│
├── lib/
│   ├── env-schema.ts         ♻️  EXTEND (add MAINTENANCE_* vars)
│   ├── validate-env.ts       ♻️  EXTEND (optional validation)
│   └── maintenance-utils.ts  ⭐ NEW (helper functions)
│
└── .env.local                ♻️  UPDATE (add MAINTENANCE_* vars)
```

**Legend**:
- ⭐ NEW: Create from scratch
- ♻️  EXTEND: Modify existing file
- Existing: No changes needed

---

## Implementation Structure

### File Tree (New/Modified Files)

```
/
├── middleware.ts                                    [NEW, ~100 LOC]
├── app/maintenance/
│   ├── page.tsx                                     [NEW, ~80 LOC]
│   └── layout.tsx                                   [NEW, ~20 LOC]
├── lib/
│   ├── env-schema.ts                                [MODIFY, +30 LOC]
│   ├── validate-env.ts                              [MODIFY, +20 LOC]
│   └── maintenance-utils.ts                         [NEW, ~50 LOC]
├── .env.local                                       [MODIFY, +10 LOC]
└── .env.example                                     [MODIFY, +30 LOC]

Total New Code: ~300 LOC
Total Modified Code: ~60 LOC
```

---

## Module Breakdown

### Module 1: Edge Middleware (middleware.ts)

**Purpose**: Intercept all HTTP requests, enforce maintenance mode, validate bypass tokens

**Responsibilities**:
- Check if request path is excluded (static assets, health checks)
- Read MAINTENANCE_MODE environment variable
- Parse bypass cookie from request
- Extract bypass token from query parameter
- Validate token against environment variable
- Set bypass cookie on successful validation
- Redirect to maintenance page or allow normal access
- Log bypass attempts (success/failure)

**Key Functions**:
```typescript
export default function middleware(request: NextRequest): NextResponse
export const config = { matcher: [...] }
```

**Dependencies**:
- `next/server` (NextRequest, NextResponse)
- `lib/maintenance-utils` (validation helpers)

**Performance Target**: <10ms per request
**Security**: Token masking in logs, HttpOnly cookies, HTTPS enforcement

---

### Module 2: Maintenance Page (app/maintenance/page.tsx)

**Purpose**: Display branded maintenance message to external visitors

**Responsibilities**:
- Render server-side static page
- Display Navy 900/Emerald 600 branding
- Show "We'll be back soon" message
- Provide contact information
- Responsive design (mobile/tablet/desktop)
- WCAG 2.1 AA accessibility

**Key Components**:
```typescript
export default function MaintenancePage(): JSX.Element
export const metadata: Metadata
```

**Dependencies**:
- Tailwind CSS (styling)
- Next.js App Router (page rendering)

**Performance Target**: <1.5s FCP, <2.5s LCP
**Accessibility**: WCAG 2.1 AA (4.5:1 contrast, semantic HTML, keyboard nav)

---

### Module 3: Utility Functions (lib/maintenance-utils.ts)

**Purpose**: Reusable helper functions for maintenance mode logic

**Responsibilities**:
- Token validation (format check, equality check)
- Path exclusion checking (regex matching)
- Token masking for logging (show last 4 chars)
- Bypass attempt logging (structured logs)

**Key Functions**:
```typescript
export function validateBypassToken(token: string, envToken: string): boolean
export function isExcludedPath(pathname: string): boolean
export function maskToken(token: string): string
export function logBypassAttempt(success: boolean, details: LogDetails): void
```

**Dependencies**:
- None (pure TypeScript, no external deps)

**Unit Tests**: 10+ test cases

---

### Module 4: Environment Variable Extensions

**File**: `lib/env-schema.ts`

**Changes**:
- Add `MAINTENANCE_MODE` and `MAINTENANCE_BYPASS_TOKEN` to `EnvironmentVariables` interface
- Update `ENV_CATEGORIES` with `maintenance` category
- Update `ENV_REQUIREMENTS` (both optional)
- Update `ENV_METRICS` (total count)

**File**: `lib/validate-env.ts`

**Changes** (Optional):
- Add maintenance mode variable validation (non-blocking)
- Check token format if MAINTENANCE_MODE=true
- Warn if token missing when maintenance enabled

---

## Data Model

**File**: See `data-model.md` for complete schema

**Summary**:
- **Persistent Data**: None (stateless feature)
- **Runtime State**: 2 environment variables
- **Session State**: 1 HTTP cookie (24-hour expiration)
- **Processing State**: In-memory per-request (ephemeral)

**Key Entities**:
1. `MAINTENANCE_MODE` environment variable (toggle)
2. `MAINTENANCE_BYPASS_TOKEN` environment variable (secret)
3. `maintenance_bypass` HTTP cookie (session persistence)

---

## API Contracts

**File**: See `contracts/middleware-config.yaml` for complete specification

**Summary**:
- **Middleware Matcher**: Regex exclusion pattern for static assets
- **Request Processing**: 5-step flow (path check → mode check → cookie check → token check → validation)
- **Response Types**: NextResponse.redirect(), NextResponse.next()
- **Cookie Configuration**: HttpOnly, Secure, SameSite=Strict, 24-hour maxAge
- **Logging Format**: Structured JSON logs with masked tokens

---

## Performance Targets

### Middleware Performance (from spec NFR-001)

| Scenario | Target | Measurement |
|----------|--------|-------------|
| Maintenance OFF | <2ms per request | Server-Timing header |
| Maintenance ON (with bypass cookie) | <5ms per request | Server-Timing header |
| Maintenance ON (redirect) | <10ms per request | Server-Timing header |

**Optimization Strategies**:
- Early returns (skip unnecessary checks)
- Synchronous operations only (no async/await)
- Regex compilation at startup (not per-request)
- No database or API calls

---

### Maintenance Page Performance (from spec NFR-002)

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | <1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | <2.5s | Lighthouse |
| Time to Interactive (TTI) | <3s | Lighthouse |
| Lighthouse Score | ≥85 | Lighthouse |

**Optimization Strategies**:
- Server-rendered (no client JS needed)
- Inline critical CSS (Tailwind purging)
- No external API calls
- Minimal DOM elements
- Optimized fonts (system font stack fallback)

---

## Security Architecture

### Threat Model & Mitigations

| Threat | Risk Level | Mitigation | Residual Risk |
|--------|-----------|------------|---------------|
| **Brute Force Token** | High | 256-bit entropy (2^256 combinations) | Negligible (infeasible within 24hr) |
| **Token Leakage (URL)** | Medium | Remove token from URL after validation | Low (token visible in logs/history) |
| **Token Leakage (Logs)** | Medium | Mask token except last 4 chars | Low (last 4 chars exposed) |
| **Cookie Theft (XSS)** | High | HttpOnly flag (no JS access) | Low (requires server-side vuln) |
| **Cookie Theft (MITM)** | High | Secure flag (HTTPS-only) | Negligible (HTTPS enforced) |
| **CSRF on Bypass** | Medium | SameSite=Strict (no cross-site cookies) | Negligible (browser enforced) |
| **Health Check Block** | High | Exclude /api/health from middleware | Negligible (path excluded) |

### Security Checklist

- ✅ Cryptographically secure token (openssl rand -hex 32)
- ✅ HttpOnly cookie (XSS protection)
- ✅ Secure cookie (HTTPS-only)
- ✅ SameSite=Strict (CSRF protection)
- ✅ Token masking in logs
- ✅ Token removal from URL after validation
- ✅ Health check endpoint exclusion
- ✅ Environment variable storage (never committed)
- ✅ 24-hour cookie expiration (automatic cleanup)

---

## Existing Infrastructure - Reuse (4 components)

### 1. lib/env-schema.ts
**Purpose**: Add MAINTENANCE_MODE and MAINTENANCE_BYPASS_TOKEN definitions
**Integration Point**: Extend `EnvironmentVariables` interface, update categories
**Lines to Add**: ~30 LOC
**Benefits**: Consistent env var management, TypeScript autocomplete, documentation

### 2. lib/validate-env.ts
**Purpose**: Optional runtime validation of maintenance variables
**Integration Point**: Add maintenance mode checks to `checkEnvironmentVariables()`
**Lines to Add**: ~20 LOC
**Benefits**: Early detection of misconfiguration, fail-fast in development

### 3. .env.example
**Purpose**: Document new maintenance mode variables
**Integration Point**: Add MAINTENANCE_MODE and MAINTENANCE_BYPASS_TOKEN sections
**Lines to Add**: ~30 LOC
**Benefits**: Onboarding documentation, deployment guide, security reminders

### 4. app/api/health/route.ts (Reference Only)
**Purpose**: Reference implementation for NextResponse usage patterns
**Integration Point**: Study existing code for Edge Runtime compatibility
**Lines to Read**: ~60 LOC
**Benefits**: Consistent API patterns, proven Edge Runtime usage

---

## New Infrastructure - Create (4 components)

### 1. middleware.ts (Critical Path)
**Lines**: ~100 LOC
**Complexity**: Medium (security-critical, edge runtime)
**Dependencies**: next/server, lib/maintenance-utils
**Key Challenges**:
- Token validation logic (exact match, case-sensitive)
- Cookie security flags (HttpOnly, Secure, SameSite)
- Path exclusion regex (prevent maintenance page loop)
- Logging without exposing full token

**Implementation Order**: Phase 1 (foundational)

### 2. app/maintenance/page.tsx
**Lines**: ~80 LOC
**Complexity**: Low (static page, Tailwind styling)
**Dependencies**: Tailwind CSS, Next.js metadata
**Key Challenges**:
- Navy 900/Emerald 600 branding (custom colors)
- Responsive design (mobile/tablet/desktop breakpoints)
- WCAG 2.1 AA accessibility (contrast, semantic HTML)

**Implementation Order**: Phase 2 (after middleware)

### 3. lib/maintenance-utils.ts
**Lines**: ~50 LOC
**Complexity**: Low (pure functions, no external deps)
**Dependencies**: None
**Key Challenges**:
- Token masking (show last 4 chars safely)
- Path regex matching (efficient, correct)

**Implementation Order**: Phase 1 (before middleware)

### 4. app/maintenance/layout.tsx (Optional)
**Lines**: ~20 LOC
**Complexity**: Trivial (minimal wrapper)
**Dependencies**: React
**Alternative**: Use root layout with conditional rendering

**Implementation Order**: Phase 2 (optional, nice-to-have)

---

## Implementation Phases

### Phase 1: Foundation (2-3 hours)

**Tasks**:
1. Generate bypass token: `openssl rand -hex 32`
2. Update `lib/env-schema.ts` (add maintenance vars)
3. Update `.env.local` (add MAINTENANCE_MODE, MAINTENANCE_BYPASS_TOKEN)
4. Update `.env.example` (document new vars)
5. Create `lib/maintenance-utils.ts` (helper functions)
6. Write unit tests for utility functions

**Deliverables**:
- Environment variable infrastructure ready
- Utility functions tested and ready
- Local development configured

**Validation**:
- `npm run type-check` passes
- Unit tests pass (10+ cases)
- Environment variables accessible in Next.js

---

### Phase 2: Middleware Implementation (2-3 hours)

**Tasks**:
1. Create `middleware.ts` at project root
2. Implement path exclusion logic (regex matcher)
3. Implement maintenance mode check (env var read)
4. Implement cookie parsing (bypass cookie detection)
5. Implement token validation (query parameter extraction)
6. Implement cookie setting (NextResponse.cookies.set)
7. Implement logging (masked tokens, IP addresses)
8. Write integration tests for middleware

**Deliverables**:
- Middleware intercepts all requests correctly
- Bypass token validation works
- Cookie persistence works (24-hour expiration)
- Logging captures attempts

**Validation**:
- Integration tests pass (6 scenarios)
- Middleware overhead <10ms
- Logs show masked tokens only

---

### Phase 3: Maintenance Page (1-2 hours)

**Tasks**:
1. Create `app/maintenance/page.tsx`
2. Implement Navy 900/Emerald 600 branding
3. Add responsive breakpoints (mobile/tablet/desktop)
4. Ensure WCAG 2.1 AA compliance (contrast, semantic HTML)
5. Add metadata (title, description)
6. Create `app/maintenance/layout.tsx` (optional)
7. Test on mobile/tablet/desktop viewports

**Deliverables**:
- Maintenance page renders correctly
- Responsive design works
- Accessibility standards met

**Validation**:
- Lighthouse Performance ≥85
- Lighthouse Accessibility ≥95
- Axe DevTools: 0 critical issues
- FCP <1.5s, LCP <2.5s

---

### Phase 4: Integration & Testing (1-2 hours)

**Tasks**:
1. Test all 6 user scenarios from spec.md
2. Test static asset loading (/_next/*, /images/*, /fonts/*)
3. Test health check endpoint (/api/health always responds)
4. Test bypass token generation and validation
5. Test cookie expiration (24-hour window)
6. Test invalid token handling
7. Run Lighthouse audit (performance, accessibility)
8. Run security audit (check cookie flags, token masking)

**Deliverables**:
- All user scenarios pass
- All acceptance criteria met
- Performance targets achieved
- Security checklist complete

**Validation**:
- 6/6 user scenarios pass
- 8/8 success criteria met
- No critical accessibility issues
- No security vulnerabilities

---

## CI/CD Impact

### Deployment Considerations (from spec.md)

**Platform**: Vercel (direct-prod deployment model)

**Breaking Changes**: None (additive feature)

**Migration Required**: None (no database or API schema changes)

**Environment Variables** (New):
```bash
# Development (.env.local)
MAINTENANCE_MODE="false"
MAINTENANCE_BYPASS_TOKEN="<dev_token_64_chars>"

# Production (Vercel Dashboard)
MAINTENANCE_MODE="false"  # Toggle to "true" during DNS migration
MAINTENANCE_BYPASS_TOKEN="<prod_token_64_chars>"
```

**Build Commands**: No changes (standard `next build`)

**Deployment Steps**:
1. Set environment variables in Vercel dashboard (before deployment)
2. Deploy code via Git push (Vercel auto-deploys)
3. Toggle MAINTENANCE_MODE=true when ready to restrict access
4. Developer uses bypass token to access site
5. Toggle MAINTENANCE_MODE=false when ready for public access

**Zero-Downtime Toggle**:
- Environment variable change takes effect on next request (<1 minute)
- No code deployment needed to toggle on/off
- No server restart required (Edge Middleware reads env vars per-request)

---

### Rollback Strategy

**Emergency Disable**:
```bash
# Vercel Dashboard: Settings → Environment Variables
# MAINTENANCE_MODE="true" → "false"
# Takes effect: Next request (<1 minute)
```

**Full Rollback** (if bugs found):
```bash
# Revert Git commit
git revert <commit-sha>
git push origin main

# Vercel auto-deploys rollback
# Cookies expire automatically after 24 hours (no cleanup needed)
```

**Rollback Testing** (during /validate-staging):
- Extract deployment ID from Vercel logs
- Test rollback to previous deployment
- Verify previous version is live
- Roll forward to current deployment

---

## Testing Strategy

### Unit Tests (lib/maintenance-utils.ts)

**Test Cases** (10+):
```typescript
describe('validateBypassToken', () => {
  test('valid token returns true')
  test('invalid token returns false')
  test('empty token returns false')
  test('case-sensitive comparison')
  test('whitespace not trimmed')
})

describe('isExcludedPath', () => {
  test('/_next/* excluded')
  test('/images/* excluded')
  test('/api/health excluded')
  test('/maintenance excluded')
  test('/blog not excluded')
})

describe('maskToken', () => {
  test('64-char token masked to ***<last 4>')
  test('short token fully masked')
  test('empty string handled')
})

describe('logBypassAttempt', () => {
  test('successful bypass logs INFO')
  test('failed bypass logs WARN')
  test('token masked in logs')
  test('IP address included')
})
```

---

### Integration Tests (middleware.ts)

**Test Cases** (6 scenarios from spec):
```typescript
describe('Maintenance Mode Middleware', () => {
  test('Scenario 1: External visitor during maintenance → See maintenance page')
  test('Scenario 2: Developer bypass (first time) → Set cookie, redirect clean URL')
  test('Scenario 3: Developer navigation (bypass active) → Allow normal access')
  test('Scenario 4: Invalid bypass token → Redirect to maintenance, log failure')
  test('Scenario 5: Maintenance mode disabled → Allow all traffic')
  test('Scenario 6: Static assets and health checks → Never blocked')
})
```

---

### Manual QA Checklist

**Visual Testing**:
- [ ] Maintenance page renders correctly on mobile (375x667)
- [ ] Maintenance page renders correctly on tablet (768x1024)
- [ ] Maintenance page renders correctly on desktop (1920x1080)
- [ ] Navy 900 background color correct (#0f172a)
- [ ] Emerald 600 accent color correct (#059669)

**Accessibility Testing**:
- [ ] Axe DevTools: 0 critical issues
- [ ] Contrast ratio ≥4.5:1 (WCAG AA)
- [ ] Keyboard navigation works (Tab key)
- [ ] Screen reader announces content correctly
- [ ] Focus indicators visible

**Performance Testing**:
- [ ] Lighthouse Performance ≥85
- [ ] FCP <1.5s (mobile 3G)
- [ ] LCP <2.5s (mobile 3G)
- [ ] Middleware overhead <10ms (Server-Timing header)

**Security Testing**:
- [ ] Cookie has HttpOnly flag (Browser DevTools → Cookies)
- [ ] Cookie has Secure flag (HTTPS only)
- [ ] Cookie has SameSite=Strict
- [ ] Token masked in logs (last 4 chars only)
- [ ] Token removed from URL after validation
- [ ] Health check always responds (even during maintenance)

---

### Acceptance Testing (8 Success Criteria from Spec)

1. [ ] External visitors see maintenance page (100% of non-bypassed requests)
2. [ ] Developers can bypass via secret token (cookie persists 24 hours)
3. [ ] Maintenance mode toggles instantly (<1 minute to take effect)
4. [ ] Middleware performance negligible (<10ms overhead)
5. [ ] Maintenance page loads fast (<1.5s FCP on 3G)
6. [ ] Security standards met (token, cookie flags, logging)
7. [ ] Accessibility standards met (WCAG 2.1 AA, axe verified)
8. [ ] Zero production incidents (no infinite redirects, no lockouts)

---

## Integration Scenarios

**File**: See `quickstart.md` for complete scenarios

**Summary**:
1. **Initial Setup**: Generate token, configure env vars, update schema
2. **Local Testing**: Enable maintenance mode, test bypass, verify cookie
3. **Environment Management**: Rotate tokens, validate env vars
4. **Manual Testing**: Test mobile/tablet/desktop, accessibility, performance
5. **Validation**: Run unit tests, integration tests, Lighthouse audits
6. **Production Deployment**: Deploy to Vercel, toggle maintenance mode
7. **Troubleshooting**: Debug common issues (infinite loop, cookie issues, etc.)

---

## Risks & Mitigations

### Risk 1: Infinite Redirect Loop
**Probability**: Low | **Impact**: Critical

**Scenario**: Middleware redirects /maintenance to /maintenance repeatedly

**Mitigation**:
- Exclude /maintenance from middleware matcher
- Regex pattern: `/((?!_next|...|maintenance).*)`
- Unit test: Verify /maintenance path excluded

**Detection**: Browser shows "Too many redirects" error

**Resolution**: Fix middleware matcher, redeploy

---

### Risk 2: Token Leakage in Logs
**Probability**: Medium | **Impact**: High

**Scenario**: Full bypass token logged, exposed in platform logs

**Mitigation**:
- Mask token in all logs (show last 4 chars only)
- Use structured logging (no accidental full token logs)
- Audit logs before deployment

**Detection**: Search logs for full token (64-char hex string)

**Resolution**: Rotate token immediately, fix logging code

---

### Risk 3: Cookie Expiration Mid-Session
**Probability**: High | **Impact**: Low

**Scenario**: Developer's bypass cookie expires after 24 hours

**Mitigation**:
- Log clear expiration message when cookie expires
- Developer can re-bypass with same token (bookmarked URL)
- 24-hour window is standard for development sessions

**Detection**: Developer sees maintenance page unexpectedly

**Resolution**: Re-authenticate with bypass token

---

### Risk 4: Static Assets Blocked
**Probability**: Low | **Impact**: Medium

**Scenario**: Maintenance page cannot load CSS/JS due to middleware blocking

**Mitigation**:
- Exclude /_next/* from middleware matcher
- Test maintenance page during local development
- Verify all assets load (Network tab)

**Detection**: Maintenance page renders with no styling

**Resolution**: Fix middleware matcher, add missing exclusions

---

### Risk 5: Health Check Endpoint Blocked
**Probability**: Low | **Impact**: Critical

**Scenario**: /api/health redirects to maintenance, platform marks as unhealthy

**Mitigation**:
- Exclude /api/health from middleware matcher
- Test health check during maintenance mode
- Monitor platform health check status

**Detection**: Platform logs show health check failures

**Resolution**: Fix middleware matcher immediately, redeploy

---

## Deployment Acceptance

### Production Invariants (Must Hold True)

1. **No Breaking Changes**: Feature is additive, existing functionality unaffected
2. **Environment Variables Optional**: App works with MAINTENANCE_MODE unset (defaults to "false")
3. **Health Check Always Responds**: /api/health returns 200 OK during maintenance
4. **Static Assets Always Load**: /_next/*, /images/*, /fonts/* never blocked
5. **Zero Deployment Overhead**: Toggle maintenance mode without code deployment
6. **Backward Compatible**: Removing feature requires only env var deletion + file removal

### Staging Smoke Tests (Given/When/Then)

```gherkin
Feature: Maintenance Mode with Bypass

Scenario: External visitor during maintenance
  Given MAINTENANCE_MODE="true"
  When user visits https://app-staging.vercel.app/
  Then user is redirected to /maintenance
  And maintenance page displays with Navy 900/Emerald 600 branding
  And response time <2s
  And no console errors

Scenario: Developer bypass
  Given MAINTENANCE_MODE="true"
  When developer visits https://app-staging.vercel.app/?bypass=<VALID_TOKEN>
  Then system sets maintenance_bypass cookie with HttpOnly, Secure, SameSite=Strict
  And redirects to https://app-staging.vercel.app/ (clean URL)
  And site loads normally
  And bypass persists across navigation for 24 hours

Scenario: Invalid bypass token
  Given MAINTENANCE_MODE="true"
  When user visits https://app-staging.vercel.app/?bypass=WRONG_TOKEN
  Then user is redirected to /maintenance
  And no cookie is set
  And console log shows [WARN] Maintenance Bypass: Failed

Scenario: Maintenance mode disabled
  Given MAINTENANCE_MODE="false"
  When user visits https://app-staging.vercel.app/
  Then site loads normally (no maintenance page)
  And middleware overhead <5ms

Scenario: Static assets during maintenance
  Given MAINTENANCE_MODE="true"
  When browser requests /_next/static/chunks/main.js
  Then asset loads normally (HTTP 200)
  And maintenance page renders with full styling

Scenario: Health check during maintenance
  Given MAINTENANCE_MODE="true"
  When monitoring system requests /api/health
  Then endpoint returns 200 OK with JSON response
  And no redirect to maintenance page
```

---

## Definition of Done

### Code Complete
- [ ] middleware.ts implemented and tested
- [ ] app/maintenance/page.tsx implemented and styled
- [ ] lib/maintenance-utils.ts implemented with unit tests
- [ ] lib/env-schema.ts updated with new variables
- [ ] .env.local and .env.example updated
- [ ] TypeScript types correct (no `any` types)
- [ ] ESLint passes with zero errors
- [ ] Prettier formatted

### Testing Complete
- [ ] 10+ unit tests written and passing
- [ ] 6 integration tests written and passing
- [ ] All 6 user scenarios manually tested
- [ ] All 8 success criteria met
- [ ] Lighthouse audit ≥85 (performance)
- [ ] Axe DevTools: 0 critical issues
- [ ] Security audit passed (cookie flags, token masking)

### Documentation Complete
- [ ] quickstart.md provides clear integration scenarios
- [ ] plan.md documents architecture and decisions
- [ ] contracts/middleware-config.yaml specifies contracts
- [ ] data-model.md documents state management
- [ ] Code comments explain "why", not "what"

### Deployment Ready
- [ ] Environment variables documented in .env.example
- [ ] Production token generated (64-char hex)
- [ ] Vercel environment variables configured
- [ ] Smoke tests pass on staging
- [ ] Rollback tested and verified
- [ ] Stakeholder sign-off received

---

## Monitoring & Observability

### Metrics to Track (Post-Deployment)

**Bypass Attempts**:
- Metric: Count of successful and failed bypass attempts
- Alert: >10 failures per hour (potential brute force)
- Dashboard: Vercel Logs → Search "[Maintenance Bypass]"

**Maintenance Mode Duration**:
- Metric: Time between MAINTENANCE_MODE=true and false
- Target: <24 hours (for DNS migration use case)
- Tracking: Manual (log env var changes)

**Middleware Performance**:
- Metric: p50, p95, p99 execution time
- Target: p95 <10ms
- Measurement: Server-Timing header in Vercel logs

**Maintenance Page Performance**:
- Metric: FCP, LCP, TTI from real user monitoring
- Target: FCP <1.5s, LCP <2.5s
- Tool: Vercel Analytics or Google Analytics

---

## Future Enhancements (Out of Scope for MVP)

1. **Admin UI for Maintenance Mode Toggle**
   - Replace environment variable editing with UI button
   - Target users: Non-technical stakeholders
   - Complexity: Medium (requires auth, admin dashboard)

2. **Custom Maintenance Messages**
   - Dynamic message via environment variable or CMS
   - Support: Launch date countdown, custom branding
   - Complexity: Low (replace static text with env var)

3. **Multiple Bypass Tokens**
   - Role-based tokens (developer, QA, stakeholder)
   - Individual token expiration/rotation
   - Complexity: Medium (token management system)

4. **Rate Limiting for Bypass Attempts**
   - Limit failed attempts per IP (e.g., 5 per hour)
   - Mitigate brute force attacks
   - Complexity: Medium (requires state storage)

5. **Maintenance Mode Scheduling**
   - Cron-based automatic enable/disable
   - Schedule maintenance windows in advance
   - Complexity: High (requires scheduler, timezone handling)

6. **Analytics on Maintenance Page**
   - Track visitor count, geography, referrers
   - User feedback survey
   - Complexity: Low (add Google Analytics script)

---

## References

- **Specification**: `specs/007-maintenance-mode-byp/spec.md`
- **Research**: `specs/007-maintenance-mode-byp/research.md`
- **Data Model**: `specs/007-maintenance-mode-byp/data-model.md`
- **Contracts**: `specs/007-maintenance-mode-byp/contracts/middleware-config.yaml`
- **Quickstart**: `specs/007-maintenance-mode-byp/quickstart.md`
- **Constitution**: `.spec-flow/memory/constitution.md`
- **GitHub Issue**: #48 - Maintenance Page and Mode with Secret Bypass
- **Next.js Middleware Docs**: https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Next.js Edge Runtime**: https://nextjs.org/docs/app/api-reference/edge

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2025-10-27 | Initial plan created from spec + research | Planning Phase Agent |

---

**Plan Status**: ✅ Complete and ready for task breakdown
**Next Command**: `/tasks` to generate concrete TDD tasks from this plan
**Estimated Implementation**: 6-8 hours (including testing)
**Risk Level**: Medium (security-critical, edge runtime)
**Reuse Opportunities**: 4 components identified
**New Components**: 4 required
