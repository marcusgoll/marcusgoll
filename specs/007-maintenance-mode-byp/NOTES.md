# Feature: Maintenance Mode Bypass

## Overview

Implement Next.js middleware-based maintenance mode with secret bypass mechanism. This allows DNS to point to the new site before production-ready status, showing external visitors a professional maintenance page while the developer continues working via a secret bypass token.

## Research Findings

### Feature Classification
- UI screens: true (maintenance page)
- Improvement: false (new feature)
- Measurable: false (infrastructure feature)
- Deployment impact: true (middleware, environment variables)

### Tech Stack Analysis (from package.json)
- **Framework**: Next.js 15.5.6 (App Router)
- **Runtime**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.15
- **Type Safety**: TypeScript 5.9.3
- **Database**: Prisma 6.17.1 with PostgreSQL

### System Architecture Findings
- **Project Structure**: Next.js App Router (`app/` directory)
- **Existing Routes**:
  - `/` - Homepage (app/page.tsx)
  - `/api/health` - Health check endpoint (app/api/health/)
- **No existing middleware**: Clean slate for middleware.ts implementation

### Constitution Compliance
- **Deployment Model**: staging-prod (from constitution.md)
- **Security**: Aligns with security principles (secure tokens, HttpOnly cookies)
- **Performance**: <10ms middleware overhead aligns with performance requirements
- **Accessibility**: WCAG 2.1 AA required for maintenance page

### GitHub Issue Integration
- **Issue**: #48 - Maintenance Page and Mode with Secret Bypass
- **ICE Score**: 1.9 (Impact: 4, Effort: 2, Confidence: 0.95)
- **Area**: infra
- **Role**: all
- **Priority**: high

## Key Decisions

1. **Middleware Location**: Root-level `middleware.ts` (Next.js convention)
   - Rationale: Runs on Edge Runtime for global request interception

2. **Toggle Mechanism**: Environment variable (`MAINTENANCE_MODE=true/false`)
   - Rationale: No-code deployment required, aligns with NFR-005

3. **Bypass Method**: Query parameter + persistent cookie
   - Query param: `?bypass=SECRET_TOKEN` (initial access)
   - Cookie: `maintenance_bypass` (24-hour expiration)
   - Rationale: Developer convenience, maintains bypass across navigation

4. **Token Security**: Cryptographically random 32+ character hex string
   - Storage: Environment variable `MAINTENANCE_BYPASS_TOKEN`
   - Generation: `openssl rand -hex 32`
   - Rationale: Prevents brute force attempts

5. **Maintenance Page**: Server-rendered React component
   - Location: `app/maintenance/page.tsx`
   - Rationale: Leverages Next.js App Router, allows easy styling with Tailwind

6. **Brand Styling**: Navy 900 primary, Emerald 600 accent (from constitution.md)
   - Typography: Work Sans headings
   - Accessibility: WCAG 2.1 AA compliance

## Implementation Notes

### Middleware Exclusions
Static assets and health checks must bypass middleware logic:
- `/_next/*` - Next.js internal assets
- `/images/*` - Public images
- `/fonts/*` - Web fonts
- `/api/health` - Health check endpoint

### Cookie Security
- Flags: `HttpOnly`, `Secure`, `SameSite=Strict`
- Rationale: Prevents XSS, MITM attacks

### Logging Strategy
Console logging for bypass attempts:
- Successful: Log token validation success (mask token)
- Failed: Log failed attempts with IP (security monitoring)
- Rationale: Debugging and security audit trail

## Deployment Considerations

**Platform Dependencies**: None (pure Next.js middleware)

**Environment Variables**:
- New: `MAINTENANCE_MODE` (true/false)
- New: `MAINTENANCE_BYPASS_TOKEN` (64-char hex string)

**Breaking Changes**: No (additive feature)

**Migration Required**: No

**Rollback Considerations**: Standard 3-command rollback (feature can be disabled via env var)

## Checkpoints
- Phase 0 (Spec): 2025-10-27

## Last Updated
2025-10-27T05:22:00Z
