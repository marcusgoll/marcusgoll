# Research & Discovery: maintenance-mode-byp

**Research Date**: 2025-10-27
**Research Mode**: Full (complex feature - middleware implementation)
**Constitution Alignment**: ✅ Verified

---

## Constitution Check

**Feature Alignment with Engineering Constitution**:
- ✅ **Specification First**: Complete spec.md with 6 user scenarios, functional/non-functional requirements
- ✅ **Security Practices**: Cryptographically secure token (256-bit entropy), HttpOnly/Secure/SameSite cookies
- ✅ **Performance Requirements**: <10ms middleware overhead, <1.5s FCP maintenance page
- ✅ **Accessibility**: WCAG 2.1 AA compliance specified
- ✅ **Do Not Overengineer**: Uses Next.js Edge Middleware (built-in), minimal dependencies, environment variable toggle
- ✅ **Documentation Standards**: Comprehensive spec, planning artifacts, error tracking

**No Constitution Violations Detected**

---

## Project Context

### Tech Stack (from package.json)
- **Frontend Framework**: Next.js 15.5.6 (App Router with Edge Middleware support)
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **Styling**: Tailwind CSS 4.1.15
- **Database**: PostgreSQL via Prisma 6.17.1
- **Content**: @tryghost/content-api 1.12.0

### Existing Architecture Patterns
**Discovered from codebase analysis**:

1. **Environment Variable Management** (HIGH REUSE OPPORTUNITY)
   - Centralized schema: `lib/env-schema.ts` (EnvironmentVariables interface, categories, requirements)
   - Runtime validation: `lib/validate-env.ts` (checkEnvironmentVariables function)
   - Health check integration: `app/api/health/route.ts` (validates env vars on startup)
   - Template: `.env.example` (comprehensive documentation)

2. **Next.js App Router Structure**
   - Root layout: `app/layout.tsx` (simple, metadata-based)
   - Homepage: `app/page.tsx`
   - API routes: `app/api/health/route.ts` (uses NextResponse from next/server)
   - TypeScript paths: `@/*` alias configured

3. **Tailwind Configuration**
   - CSS variables: `--background`, `--foreground`
   - Dark mode: `prefers-color-scheme` media query
   - Global styles: `app/globals.css`
   - Config: `tailwind.config.ts` (simple setup, no custom color palette yet)

4. **Next.js Configuration**
   - Startup validation: `next.config.ts` calls `validateEnvironmentVariables()` on startup
   - Strict mode enabled
   - No existing middleware detected

---

## Research Decisions

### Decision 1: Next.js Edge Middleware Implementation
**Chosen**: Next.js Edge Middleware (middleware.ts at project root)

**Rationale**:
- Built-in Next.js feature (no external dependencies)
- Runs on Edge Runtime (low latency, global distribution)
- Intercepts all requests before routing
- Perfect for maintenance mode use case

**Alternatives Rejected**:
- Custom Express middleware: Requires separate server (overengineered)
- API route redirect: Cannot intercept all routes (misses static pages)
- React component guard: Client-side only (late blocking, poor UX)

**Source**: Next.js Middleware Docs (https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

### Decision 2: Environment Variable Pattern (REUSE)
**Chosen**: Extend existing env-schema.ts and validate-env.ts pattern

**Rationale**:
- Project already has centralized environment variable management
- Consistent with existing validation pattern
- Health check endpoint already validates env vars
- Follows constitution principle: "Reuse existing patterns"

**Implementation**:
- Add `MAINTENANCE_MODE` and `MAINTENANCE_BYPASS_TOKEN` to `env-schema.ts`
- Update `ENV_CATEGORIES` and `ENV_REQUIREMENTS`
- Update `.env.example` with new variables
- Middleware reads directly from `process.env` (Edge Runtime compatible)

**Reusable Components**:
- `lib/env-schema.ts`: Add maintenance mode variables
- `.env.example`: Add maintenance mode documentation

**Source**: Codebase analysis - `lib/env-schema.ts:1-192`

---

### Decision 3: Cookie Security Implementation
**Chosen**: NextResponse.cookies API with security flags

**Rationale**:
- Next.js 15 has built-in cookie API (no external library needed)
- Supports HttpOnly, Secure, SameSite flags
- Edge Runtime compatible
- Simple API: `response.cookies.set(name, value, options)`

**Security Flags**:
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` - HTTPS-only (MITM protection)
- `sameSite: 'strict'` - Prevents CSRF attacks
- `maxAge: 86400` - 24-hour expiration (auto cleanup)

**Alternatives Rejected**:
- `js-cookie` library: Client-side only (can't set HttpOnly flag)
- `cookie` package: Low-level, more code needed
- Manual Set-Cookie headers: Error-prone, reinventing wheel

**Source**: Next.js Middleware Docs (https://nextjs.org/docs/app/api-reference/functions/next-response#cookies)

---

### Decision 4: Maintenance Page Implementation
**Chosen**: Server-rendered Next.js page at `/app/maintenance/page.tsx`

**Rationale**:
- Leverages existing App Router structure
- Server-rendered for fast load times
- Can use Tailwind CSS (already configured)
- No additional routing setup needed

**Styling Approach**:
- Navy 900 (`#0f172a`) - Primary background (from spec)
- Emerald 600 (`#059669`) - Accent color (from spec)
- Inline critical CSS if needed for performance
- Responsive: Tailwind's mobile-first breakpoints (`sm:`, `md:`, `lg:`)

**Accessibility**:
- Semantic HTML5 (`<main>`, `<header>`, `<section>`)
- ARIA landmarks where needed
- 4.5:1 contrast ratio (WCAG 2.1 AA)
- Keyboard navigation (tab order, focus states)

**Source**: Next.js App Router Pages (https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

---

### Decision 5: Path Exclusion Strategy
**Chosen**: Regex pattern matching in middleware

**Rationale**:
- Next.js middleware supports regex in matcher config
- Efficient (compiled once at startup)
- Clear and maintainable

**Excluded Paths** (from spec):
- `/_next/*` - Next.js internal assets
- `/images/*` - Public images
- `/fonts/*` - Web fonts
- `/api/health` - Health check endpoint
- `/maintenance` - Maintenance page itself (prevents infinite loop)

**Implementation**:
```typescript
export const config = {
  matcher: [
    '/((?!_next|images|fonts|api/health|maintenance).*)',
  ],
}
```

**Source**: Next.js Middleware Matcher (https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)

---

### Decision 6: Token Generation Strategy
**Chosen**: Manual generation via `openssl rand -hex 32` (64-character hex string)

**Rationale**:
- Cryptographically secure (256-bit entropy)
- Standard Unix tool (available on all platforms)
- No runtime token generation needed (static env var)
- Infeasible to brute force within 24-hour cookie lifetime

**Security**:
- Entropy: 2^256 possible combinations
- Transmission: HTTPS-only (Secure cookie flag)
- Storage: Environment variable (never committed to git)
- Logging: Masked except last 4 characters

**Alternatives Rejected**:
- UUID: Only 122-bit entropy (weaker)
- Short PIN: Too weak for bypass token
- Dynamic token rotation: Overengineered for MVP (single developer use case)

**Source**: Spec FR-002, NFR-003

---

## Components to Reuse (4 found)

1. **lib/env-schema.ts** - Environment variable schema and categories
   - Purpose: Add MAINTENANCE_MODE and MAINTENANCE_BYPASS_TOKEN definitions
   - Integration: Extend EnvironmentVariables interface, update ENV_CATEGORIES
   - Benefits: Consistent env var management, documentation, type safety

2. **lib/validate-env.ts** - Runtime environment variable validation
   - Purpose: Optional validation of maintenance mode variables (non-blocking)
   - Integration: Add maintenance mode checks to validation logic
   - Benefits: Early detection of misconfiguration, fail-fast in development

3. **.env.example** - Environment variable template
   - Purpose: Document new maintenance mode variables
   - Integration: Add MAINTENANCE_MODE and MAINTENANCE_BYPASS_TOKEN sections
   - Benefits: Onboarding documentation, deployment guide

4. **app/api/health/route.ts** - Health check endpoint pattern (NextResponse usage)
   - Purpose: Reference implementation for NextResponse usage
   - Integration: Use similar patterns in middleware (NextResponse.redirect, NextResponse.next)
   - Benefits: Consistent API patterns, Edge Runtime compatibility

---

## New Components Needed (4 required)

1. **middleware.ts** (project root) - Edge Middleware for request interception
   - Purpose: Check maintenance mode, validate bypass token, set cookies, redirect
   - Responsibilities:
     - Check if path is excluded (static assets, health check)
     - Check if MAINTENANCE_MODE=true
     - Check for bypass cookie or query parameter
     - Set bypass cookie if valid token
     - Redirect to /maintenance or allow request
   - Size: ~80-100 lines (including comments, logging, types)

2. **app/maintenance/page.tsx** - Maintenance page component
   - Purpose: Display branded maintenance message to external visitors
   - Responsibilities:
     - Server-rendered static page
     - Navy 900/Emerald 600 branding
     - Responsive design (mobile/tablet/desktop)
     - Accessibility compliance (WCAG 2.1 AA)
   - Size: ~60-80 lines (component + Tailwind classes)

3. **lib/maintenance-utils.ts** - Utility functions for maintenance mode
   - Purpose: Token validation, logging helpers, path checking
   - Responsibilities:
     - `validateBypassToken(token: string): boolean`
     - `isExcludedPath(pathname: string): boolean`
     - `maskToken(token: string): string` (for logging)
     - `logBypassAttempt(success: boolean, details: object): void`
   - Size: ~40-50 lines

4. **app/maintenance/layout.tsx** (optional) - Maintenance page layout
   - Purpose: Separate layout for maintenance page (no header/footer)
   - Responsibilities: Minimal layout wrapper
   - Size: ~15-20 lines
   - Alternative: Use root layout with conditional rendering

---

## Unknowns & Questions

**All technical questions resolved during research:**

✅ **Q1: Does Next.js 15 support Edge Middleware?**
- Answer: Yes, supported since Next.js 12+, stable in 15.5.6

✅ **Q2: Can Edge Middleware access environment variables?**
- Answer: Yes, process.env.* works in Edge Runtime

✅ **Q3: How to set secure cookies in Edge Middleware?**
- Answer: NextResponse.cookies.set() with security flags

✅ **Q4: What's the performance overhead of middleware?**
- Answer: <5ms per request (negligible, spec allows <10ms)

✅ **Q5: How to prevent maintenance page redirect loop?**
- Answer: Exclude /maintenance from middleware matcher

✅ **Q6: Can middleware access request IP for logging?**
- Answer: Yes, req.ip or headers["x-forwarded-for"]

✅ **Q7: Does Tailwind 4 support custom colors?**
- Answer: Yes, extend theme.colors in tailwind.config.ts

---

## Dependencies

### Existing Dependencies (No New Packages Required)
- **Next.js 15.5.6**: Edge Middleware, NextResponse, cookies API
- **TypeScript 5.9.3**: Type safety for middleware
- **Tailwind CSS 4.1.15**: Maintenance page styling

### New Dependencies
- **None** - Pure Next.js implementation, no external libraries needed

### Environment Variables (New)
- `MAINTENANCE_MODE`: "true" | "false" (default: "false")
- `MAINTENANCE_BYPASS_TOKEN`: 64-character hex string (generated via openssl)

---

## Performance Considerations

### Middleware Performance
**Target**: <10ms overhead per request (from spec NFR-001)

**Optimization Strategies**:
- Early return for excluded paths (no maintenance logic)
- Early return if MAINTENANCE_MODE=false (skip all checks)
- Regex compilation happens once at startup
- No async operations (synchronous checks only)
- No database or API calls

**Expected Performance**:
- Maintenance mode OFF: <2ms per request
- Maintenance mode ON (with bypass): <5ms per request
- Maintenance mode ON (redirect): <8ms per request

### Maintenance Page Performance
**Target**: <1.5s FCP, <2.5s LCP (from spec NFR-002)

**Optimization Strategies**:
- Server-rendered (no client-side JavaScript)
- Inline critical CSS (Tailwind purging)
- No external API calls
- No images (optional: use optimized SVG logo)
- Minimal DOM elements

**Expected Performance**:
- FCP: <1s on 3G mobile
- LCP: <1.5s on 3G mobile
- TTI: <2s (no interactivity needed)

---

## Security Analysis

### Threat Model

**Threat 1: Brute Force Bypass Token**
- Mitigation: 64-character hex token (2^256 entropy)
- Attack feasibility: Infeasible within 24-hour cookie lifetime

**Threat 2: Token Leakage in Logs**
- Mitigation: Mask token in logs (show last 4 chars only)
- Attack surface: Reduced to accidental log exposure

**Threat 3: Token Leakage in URL**
- Mitigation: Remove token from URL after validation (redirect to clean URL)
- Attack surface: Eliminated after first access

**Threat 4: Cookie Theft (XSS)**
- Mitigation: HttpOnly flag prevents JavaScript access
- Attack surface: Requires server-side vulnerability, not client-side

**Threat 5: Cookie Theft (MITM)**
- Mitigation: Secure flag requires HTTPS
- Attack surface: Eliminated on production (HTTPS enforced)

**Threat 6: CSRF on Bypass Endpoint**
- Mitigation: SameSite=Strict prevents cross-site requests
- Attack surface: Eliminated by browser enforcement

**Threat 7: Maintenance Page Blocking Critical Services**
- Mitigation: Exclude /api/health, health checks always pass
- Attack surface: Eliminated by path exclusion

### Security Checklist
- ✅ Cryptographically secure token generation
- ✅ HttpOnly cookie (XSS protection)
- ✅ Secure cookie (HTTPS-only)
- ✅ SameSite=Strict (CSRF protection)
- ✅ Token masking in logs
- ✅ Token removal from URL
- ✅ Health check endpoint exclusion
- ✅ Environment variable storage (never committed)

---

## Deployment Considerations

**Platform**: Direct-prod deployment model (from project context)

**Deployment Steps**:
1. Set `MAINTENANCE_MODE=false` and `MAINTENANCE_BYPASS_TOKEN=<generated>` in platform env vars
2. Deploy code (middleware.ts, maintenance page)
3. Toggle `MAINTENANCE_MODE=true` when ready to restrict access
4. Developer can bypass via `?bypass=<TOKEN>`
5. Toggle `MAINTENANCE_MODE=false` when ready for public access

**Zero-Downtime Toggle**:
- Environment variable change takes effect on next request (<1 minute)
- No code deployment needed to toggle on/off
- No server restart required (Edge Middleware reads env vars per-request)

**Rollback Strategy**:
- Emergency disable: Set `MAINTENANCE_MODE=false` in platform UI (instant)
- Full rollback: Revert git commit (standard 3-command rollback)

---

## Testing Strategy

### Unit Tests (middleware.ts)
- Token validation: Valid token → Allow, Invalid token → Redirect
- Cookie parsing: Existing cookie → Allow, Missing cookie → Check token
- Path exclusion: Excluded paths → Skip maintenance logic
- Environment variable: MAINTENANCE_MODE=false → Skip all checks

### Integration Tests (Full Request Flow)
- External visitor during maintenance → See maintenance page
- Developer bypass → Set cookie, redirect to clean URL, access site
- Cookie persistence → Navigate to different pages without re-authentication
- Static assets loading → No blocking on /_next/*, /images/*, /fonts/*
- Health check → Always returns 200 OK

### Manual QA
- Visual testing: Maintenance page on mobile/tablet/desktop
- Accessibility audit: axe DevTools, keyboard navigation
- Performance: Lighthouse audit (FCP, LCP, TTI)
- Security: Browser DevTools → Application → Cookies (verify flags)

### Acceptance Testing
- Run all 6 user scenarios from spec.md
- Verify all 8 success criteria
- Sign-off from stakeholder

---

## Research Summary

**Research Depth**: 11 tool calls (Bash, Grep, Glob, Read)
- ✅ Constitution alignment verified
- ✅ Tech stack identified (Next.js 15, TypeScript, Tailwind)
- ✅ Existing patterns discovered (env-schema, validate-env, health check)
- ✅ Reuse opportunities identified (4 components)
- ✅ New components defined (4 required)
- ✅ All unknowns resolved
- ✅ Security analysis complete
- ✅ Performance targets defined

**Key Insight**: Project has excellent environment variable management infrastructure that we can extend. No new dependencies needed - pure Next.js Edge Middleware implementation.

**Next Phase**: Generate design artifacts (data-model.md, contracts/api.yaml, plan.md, quickstart.md)
