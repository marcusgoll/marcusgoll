# Specification: Maintenance Mode with Secret Bypass

**Feature Slug**: `007-maintenance-mode-byp`
**Created**: 2025-10-27
**Status**: Specification Complete
**GitHub Issue**: #48
**ICE Score**: 1.9 (Impact: 4, Effort: 2, Confidence: 0.95)

---

## Purpose

Enable DNS to point to the new Next.js site before full production readiness by implementing a maintenance mode that:
1. Shows external visitors a professional, branded maintenance page
2. Allows developers to bypass maintenance mode via a secret token
3. Requires zero code deployment to toggle maintenance mode on/off

This feature unblocks DNS migration while protecting incomplete features from public access.

---

## Problem Statement

**Current State**: The new Next.js site is under active development but DNS needs to point to it before full production readiness.

**Problem**: External visitors accessing an incomplete site will see broken features, missing content, or work-in-progress UI, damaging brand perception and user trust.

**Impact**:
- Developer cannot migrate DNS until 100% feature complete (delays launch)
- No way to continue development on live domain without exposing incomplete work
- Risk of accidental public access to unfinished features

**User Pain Points**:
- **External Visitors**: See incomplete, unprofessional site if they access it early
- **Developer**: Cannot work on live domain without exposing work-in-progress
- **Stakeholders**: No visibility into site status (is it down or under maintenance?)

---

## Proposed Solution

Implement Next.js Edge Middleware that intercepts all incoming HTTP requests and:

1. **Checks maintenance mode status** via environment variable (`MAINTENANCE_MODE=true/false`)
2. **Checks for bypass token** in query parameter (`?bypass=SECRET`) or cookie
3. **Routes traffic accordingly**:
   - Maintenance mode ON + no valid bypass → Redirect to maintenance page
   - Maintenance mode ON + valid bypass → Set cookie, allow normal access
   - Maintenance mode OFF → Allow normal access for all visitors
4. **Excludes critical paths** from interception (static assets, health checks)

**Key Capabilities**:
- Environment variable toggle (no code deployment needed)
- Secret token bypass with persistent cookie (24-hour expiration)
- Professional branded maintenance page (Navy 900, Emerald 600)
- Cryptographically secure token (prevents brute force)
- Console logging for bypass attempts (security audit trail)

---

## User Scenarios

### Scenario 1: External Visitor During Maintenance

**Given** maintenance mode is enabled (`MAINTENANCE_MODE=true`)
**When** an external user visits `https://marcusgoll.com/`
**Then** they are redirected to `/maintenance` and see a professional maintenance page with:
- Brand-compliant styling (Navy 900 primary, Emerald 600 accent)
- Clear message: "Site under maintenance, launching soon"
- Expected launch timeframe (if available)
- Contact information or alternative resources
- Mobile-responsive design (<768px breakpoints)

**Acceptance Criteria**:
- Maintenance page loads in <1.5s (FCP)
- No error messages or broken assets visible
- Page meets WCAG 2.1 AA accessibility standards
- Works on mobile, tablet, desktop

---

### Scenario 2: Developer Bypassing Maintenance Mode

**Given** maintenance mode is enabled (`MAINTENANCE_MODE=true`)
**When** developer visits `https://marcusgoll.com/?bypass=<VALID_TOKEN>`
**Then** the system:
1. Validates the token against `MAINTENANCE_BYPASS_TOKEN` environment variable
2. Sets a persistent cookie (`maintenance_bypass`) with 24-hour expiration
3. Redirects to the original URL (without query parameter)
4. Allows normal access to the site
5. Logs successful bypass attempt (masked token) to console

**Acceptance Criteria**:
- Cookie uses `HttpOnly`, `Secure`, and `SameSite=Strict` flags
- Token is removed from URL after validation (prevents sharing bypass links)
- Bypass persists across all site navigation for 24 hours
- Console log includes timestamp and masked token (last 4 chars only)

---

### Scenario 3: Developer Navigating with Active Bypass

**Given** maintenance mode is enabled and developer has valid bypass cookie
**When** developer navigates to any page (e.g., `/blog`, `/about`)
**Then** the site loads normally without maintenance page redirection

**Acceptance Criteria**:
- Middleware performance overhead <10ms per request
- Bypass check occurs before any database or API calls
- Works for all routes (pages, API routes, dynamic routes)

---

### Scenario 4: Invalid Bypass Token

**Given** maintenance mode is enabled
**When** a user visits with invalid token `?bypass=WRONG_TOKEN`
**Then** the system:
1. Validates token and finds mismatch
2. Does NOT set bypass cookie
3. Redirects to maintenance page
4. Logs failed bypass attempt to console (includes IP address for security monitoring)

**Acceptance Criteria**:
- No error message exposed to user (silent failure)
- Failed attempt logged with timestamp and IP
- User sees same maintenance page as scenario 1

---

### Scenario 5: Maintenance Mode Disabled

**Given** maintenance mode is disabled (`MAINTENANCE_MODE=false` or unset)
**When** any user visits the site
**Then** the site loads normally with no maintenance page redirection

**Acceptance Criteria**:
- Middleware runs but skips all maintenance logic (<5ms overhead)
- No bypass check performed
- No maintenance page access

---

### Scenario 6: Static Assets and Health Checks

**Given** maintenance mode is enabled
**When** browser requests static assets or health check endpoint:
- `/_next/static/chunks/123.js`
- `/images/logo.png`
- `/fonts/WorkSans-Regular.woff2`
- `/api/health`

**Then** middleware does NOT intercept request (assets load normally)

**Acceptance Criteria**:
- Static assets excluded via path matching (`/_next/*`, `/images/*`, `/fonts/*`)
- Health check endpoint accessible (`/api/health`)
- Maintenance page itself can load assets (no infinite loop)

---

## Functional Requirements

### FR-001: Maintenance Mode Toggle
**Description**: System MUST support toggling maintenance mode via environment variable without code deployment.

**Specification**:
- Environment variable: `MAINTENANCE_MODE`
- Valid values: `"true"` (enabled), `"false"` or unset (disabled)
- Case-insensitive comparison
- Change takes effect on next request (no server restart required)

**Validation**: Deploy with `MAINTENANCE_MODE=true`, verify all traffic redirected. Change to `false`, verify traffic flows normally.

---

### FR-002: Secret Bypass Token
**Description**: System MUST allow developers to bypass maintenance mode using a secret token.

**Specification**:
- Token passed via query parameter: `?bypass=<TOKEN>`
- Token stored in environment variable: `MAINTENANCE_BYPASS_TOKEN`
- Token validation: Exact string match (case-sensitive)
- Minimum token length: 32 characters (64 characters recommended)
- Token format: Hexadecimal string (generated via `openssl rand -hex 32`)

**Validation**: Generate token, set env var, access site with `?bypass=<TOKEN>`, verify normal site access.

---

### FR-003: Persistent Bypass Cookie
**Description**: System MUST set a persistent cookie after successful bypass to avoid repeated token entry.

**Specification**:
- Cookie name: `maintenance_bypass`
- Cookie value: `"true"` (or hashed token for extra security)
- Expiration: 24 hours from creation
- Flags: `HttpOnly`, `Secure`, `SameSite=Strict`
- Path: `/` (site-wide)

**Security Rationale**:
- `HttpOnly`: Prevents JavaScript access (XSS protection)
- `Secure`: HTTPS-only transmission (MITM protection)
- `SameSite=Strict`: Prevents CSRF attacks

**Validation**: After bypass, verify cookie in browser DevTools. Navigate to different pages, confirm no re-authentication needed for 24 hours.

---

### FR-004: Maintenance Page
**Description**: System MUST display a professional, branded maintenance page when maintenance mode is active.

**Specification**:
- Route: `/maintenance` (or dedicated component)
- Server-rendered: Next.js page component
- Content:
  - Heading: "We'll be back soon"
  - Message: "Site is currently under maintenance. We're working hard to bring you an improved experience."
  - Launch timeframe: "Expected to launch in [timeframe]" (optional, configurable)
  - Contact: Email or social media links
- Styling:
  - Brand colors: Navy 900 (`#0f172a`), Emerald 600 (`#059669`)
  - Typography: Work Sans headings, system font stack for body
  - Responsive: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Accessibility: WCAG 2.1 AA (4.5:1 contrast ratio, keyboard navigation, semantic HTML)

**Validation**: Visual QA on mobile/tablet/desktop, accessibility audit (axe DevTools), Lighthouse performance check.

---

### FR-005: Request Interception Middleware
**Description**: System MUST implement Next.js Edge Middleware to intercept all HTTP requests.

**Specification**:
- File location: `middleware.ts` (project root)
- Runtime: Edge Runtime (global distribution, low latency)
- Execution order:
  1. Check if request path is excluded (static assets, health checks)
  2. If excluded, skip maintenance logic (return early)
  3. Check if `MAINTENANCE_MODE=true`
  4. If false, skip maintenance logic (return early)
  5. Check for bypass cookie or query parameter
  6. If valid bypass, set cookie (if not already set) and allow request
  7. If no valid bypass, redirect to `/maintenance`

**Excluded Paths**:
- `/_next/*` - Next.js internal assets
- `/images/*` - Public images
- `/fonts/*` - Web fonts
- `/api/health` - Health check endpoint
- `/maintenance` - Maintenance page itself (prevents infinite loop)

**Validation**: Unit tests for middleware logic, integration tests with Next.js dev server.

---

### FR-006: Bypass Attempt Logging
**Description**: System MUST log bypass attempts for security monitoring and debugging.

**Specification**:
- Successful bypass:
  - Log level: INFO
  - Message: `[Maintenance Bypass] Successful bypass - Token: ***<last 4 chars>`
  - Timestamp: ISO 8601 format
- Failed bypass:
  - Log level: WARN
  - Message: `[Maintenance Bypass] Failed attempt - IP: <request IP> - Token: ***<last 4 chars>`
  - Timestamp: ISO 8601 format
- Output: `console.log` (captured by hosting platform logs)

**Privacy**: Token is masked except last 4 characters to prevent accidental exposure.

**Validation**: Trigger successful and failed bypass, verify logs in console/platform logs.

---

## Non-Functional Requirements

### NFR-001: Middleware Performance
**Description**: Middleware MUST add <10ms overhead per request to maintain site responsiveness.

**Target**:
- Maintenance mode OFF: <5ms per request
- Maintenance mode ON (with bypass): <10ms per request

**Measurement**: Measure response time with/without middleware using browser DevTools Network tab or Lighthouse.

**Rationale**: Edge Middleware is designed for low latency, but excessive logic can degrade performance.

---

### NFR-002: Maintenance Page Performance
**Description**: Maintenance page MUST load quickly to provide good user experience during downtime.

**Target**:
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3s

**Measurement**: Lighthouse performance audit (mobile and desktop).

**Optimization**:
- Minimal JavaScript (no client-side frameworks for maintenance page)
- Inline critical CSS (no external stylesheet blocking)
- Optimized images (WebP format, lazy loading)

---

### NFR-003: Token Security
**Description**: Bypass token MUST be cryptographically secure to prevent brute force attacks.

**Specification**:
- Token generation: `openssl rand -hex 32` (64-character hex string)
- Entropy: 256 bits (2^256 possible combinations)
- Storage: Environment variable (never committed to code)
- Transmission: HTTPS-only (prevents interception)

**Threat Model**:
- Brute force: 2^256 combinations = infeasible within 24-hour cookie lifetime
- Token leakage: Mitigated by HTTPS, HttpOnly cookie, masked logging

**Validation**: Generate token via `openssl`, verify 64-character length, store in env var, test bypass.

---

### NFR-004: Cookie Security
**Description**: Bypass cookie MUST use security flags to prevent XSS and MITM attacks.

**Specification**:
- `HttpOnly`: Prevents JavaScript access (XSS protection)
- `Secure`: HTTPS-only (MITM protection)
- `SameSite=Strict`: Prevents CSRF attacks
- Expiration: 24 hours (automatic cleanup)

**Validation**: Inspect cookie in browser DevTools → Application → Cookies, verify all flags present.

---

### NFR-005: No-Deployment Toggle
**Description**: Maintenance mode toggle MUST NOT require code deployment or server restart.

**Specification**:
- Environment variable change takes effect on next request
- No server restart required (Edge Middleware reads env vars per-request)
- Platform support: Vercel, Netlify, Railway, Dokploy (all support runtime env var access)

**Validation**: Change `MAINTENANCE_MODE` in platform UI, refresh browser, verify immediate effect.

---

## Success Criteria

The feature is successful when:

1. **External visitors see maintenance page** during maintenance mode (100% of non-bypassed requests)
2. **Developers can bypass via secret token** and maintain access for 24 hours
3. **Maintenance mode toggles instantly** via environment variable change (<1 minute to take effect)
4. **Middleware performance is negligible** (<10ms overhead per request)
5. **Maintenance page loads fast** (<1.5s FCP on 3G mobile connection)
6. **Security standards met**:
   - Token is cryptographically random (64-char hex)
   - Cookie uses HttpOnly, Secure, SameSite flags
   - Failed bypass attempts are logged
7. **Accessibility standards met** (WCAG 2.1 AA compliance, verified by axe DevTools)
8. **Zero production incidents** related to maintenance mode logic (no infinite redirects, no accidental lockouts)

---

## Assumptions

1. **HTTPS is configured** - Cookie `Secure` flag requires HTTPS (local dev uses `localhost` exception)
2. **Single developer** - No multi-user bypass management needed (single shared token)
3. **24-hour bypass duration is sufficient** - Developer completes work within daily session
4. **Static maintenance message** - No dynamic launch date updates (manual env var update if needed)
5. **Console logging is sufficient** - No structured logging or alerting service integration required for MVP
6. **Token rotation is manual** - Developer regenerates token manually if compromised (no auto-rotation)

---

## Out of Scope

The following are explicitly excluded from this feature:

1. **Admin UI for maintenance mode toggle** - Environment variable editing is sufficient for MVP (future enhancement)
2. **Custom maintenance messages** - Static message hardcoded in component (future: dynamic via env var)
3. **Multiple bypass tokens** - Single shared token for all developers (future: role-based tokens)
4. **Rate limiting for bypass attempts** - Low risk with 64-char random token (future security enhancement)
5. **Maintenance mode scheduling** - Manual toggle only (no cron-based automatic enable/disable)
6. **Analytics on maintenance page** - No visitor tracking during maintenance (future: count unique IPs)
7. **A/B testing different maintenance messages** - Single static message (future: user feedback survey)

---

## Dependencies

### Existing Dependencies (from package.json)
- **Next.js 15.5.6**: Edge Middleware support (introduced in Next.js 12+)
- **TypeScript 5.9.3**: Type safety for middleware logic
- **Tailwind CSS 4.1.15**: Maintenance page styling

### New Dependencies
- None (pure Next.js feature)

### Environment Variables (new)
- `MAINTENANCE_MODE`: `"true"` or `"false"` (default: `"false"`)
- `MAINTENANCE_BYPASS_TOKEN`: 64-character hex string (generated via `openssl rand -hex 32`)

### Platform Requirements
- HTTPS support (for `Secure` cookie flag)
- Edge Runtime support (Vercel, Netlify, Railway, Dokploy all supported)

---

## Deployment Considerations

**Platform Dependencies**: None (pure Next.js middleware)

**Environment Variables**:
- **New**: `MAINTENANCE_MODE` (default: `false`)
- **New**: `MAINTENANCE_BYPASS_TOKEN` (required when `MAINTENANCE_MODE=true`)

**Breaking Changes**: None (additive feature)

**Migration Required**: None (no database or API changes)

**Rollback Considerations**:
- Standard 3-command rollback (revert Git commit)
- Emergency disable: Set `MAINTENANCE_MODE=false` in platform UI (instant effect)

**Testing Before Deployment**:
1. Local dev server: Test with `.env.local` variables
2. Staging: Test with staging environment variables
3. Production: Enable via env var toggle (no code change needed)

---

## Risks & Mitigations

### Risk 1: Infinite Redirect Loop
**Scenario**: Middleware redirects `/maintenance` to `/maintenance` repeatedly.

**Mitigation**: Exclude `/maintenance` from middleware interception logic (path check before redirect).

**Test**: Access `/maintenance` directly, verify single page load (no redirect loop).

---

### Risk 2: Token Leakage
**Scenario**: Bypass token exposed in logs, URLs, or client-side code.

**Mitigation**:
- Remove token from URL after validation (redirect to clean URL)
- Mask token in logs (show last 4 chars only)
- Store in environment variable (never commit to Git)
- Use HttpOnly cookie (JavaScript cannot access)

**Test**: Inspect browser DevTools → Network, verify no token in response headers or client code.

---

### Risk 3: Cookie Expiration During Active Development
**Scenario**: Developer's bypass cookie expires mid-session (after 24 hours).

**Mitigation**:
- Log clear expiration message when cookie expires
- Developer can re-bypass with same token (bookmarked URL)

**Acceptable**: 24-hour sessions are standard for most development workflows.

---

### Risk 4: Static Assets Blocked
**Scenario**: Maintenance page cannot load CSS/JS because middleware blocks `/_next/*`.

**Mitigation**: Exclude `/_next/*` from middleware interception (Next.js internal assets always allowed).

**Test**: Enable maintenance mode, verify maintenance page renders with full styling.

---

### Risk 5: Health Check Endpoint Blocked
**Scenario**: Hosting platform's health check fails because `/api/health` redirects to maintenance page.

**Mitigation**: Exclude `/api/health` from middleware interception (always returns 200 OK).

**Test**: Enable maintenance mode, curl `/api/health`, verify 200 OK response.

---

## Testing Strategy

### Unit Tests
- Middleware logic: Token validation, cookie parsing, path exclusion
- Test cases:
  - Valid token → Set cookie, allow access
  - Invalid token → Redirect to maintenance
  - Missing token → Redirect to maintenance
  - Excluded paths → Skip middleware logic
  - Maintenance mode OFF → Skip middleware logic

### Integration Tests
- Full request flow: Browser → Middleware → Page render
- Test scenarios:
  - External visitor during maintenance → See maintenance page
  - Developer bypass → Access site normally
  - Bypass cookie persistence → Navigate without re-authentication
  - Static assets loading → No blocking

### Manual QA
- Visual testing: Maintenance page on mobile/tablet/desktop
- Accessibility audit: axe DevTools, keyboard navigation
- Performance: Lighthouse audit (FCP, LCP, TTI)
- Security: Verify cookie flags in browser DevTools

### Acceptance Testing
- Run all user scenarios (1-6) end-to-end
- Verify success criteria (8 points)
- Sign-off from stakeholder

---

## Related Features

### Depends On
- None (standalone feature)

### Blocks
- None

### Enables (Future)
- Custom maintenance messages (dynamic via CMS)
- Maintenance mode scheduling (cron-based enable/disable)
- Multi-user bypass tokens (role-based access)
- Maintenance analytics (visitor count, geo-location)

---

## References

- **GitHub Issue**: #48 - Maintenance Page and Mode with Secret Bypass
- **Next.js Middleware Docs**: https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Next.js Edge Runtime**: https://nextjs.org/docs/app/api-reference/edge
- **Constitution**: `.spec-flow/memory/constitution.md` (security principles, performance standards)
- **Package.json**: `package.json` (tech stack verification)

---

## Changelog

| Date       | Change                                      | Author        |
|------------|---------------------------------------------|---------------|
| 2025-10-27 | Initial specification created from issue #48 | Claude Code   |

---

**Specification Status**: ✅ Complete and ready for planning phase

**Next Steps**:
- Run `/plan` to generate design artifacts (middleware architecture, component structure)
- No clarifications needed - all requirements are explicit and testable
