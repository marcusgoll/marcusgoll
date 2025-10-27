# Tasks: Maintenance Mode with Secret Bypass

**Feature**: 007-maintenance-mode-byp
**Total Tasks**: 28
**Organization**: By user story priority (US1-US6) from spec.md
**Estimated Effort**: 6-8 hours

---

## [CODEBASE REUSE ANALYSIS]

**Scanned**: D:\coding\tech-stack-foundation-core

### [EXISTING - REUSE]

- ✅ **lib/env-schema.ts** - Environment variable schema with categories
  - Pattern: Interface definitions, ENV_CATEGORIES, ENV_REQUIREMENTS
  - Extend with: MAINTENANCE_MODE, MAINTENANCE_BYPASS_TOKEN

- ✅ **lib/validate-env.ts** - Runtime validation with error formatting
  - Pattern: ValidationError interface, validateEnvironmentVariables()
  - Reference for: Token validation patterns

- ✅ **.env.example** - Environment variable documentation
  - Pattern: Section comments, detailed descriptions, security reminders
  - Extend with: Maintenance mode section

- ✅ **app/api/health/route.ts** - NextResponse usage pattern
  - Pattern: NextResponse.json(), try-catch blocks, env var checking
  - Reference for: Edge Runtime compatibility

### [NEW - CREATE]

- 🆕 **middleware.ts** - No existing middleware (~100 LOC)
- 🆕 **app/maintenance/page.tsx** - New route (~80 LOC)
- 🆕 **lib/maintenance-utils.ts** - New utility module (~50 LOC)
- 🆕 **app/maintenance/layout.tsx** - Optional layout (~20 LOC)

---

## [DEPENDENCY GRAPH]

**User Story Completion Order**:
1. Phase 1: Setup (foundational infrastructure)
2. Phase 2: US6 [P1] - Static assets and health checks (blocking prerequisite)
3. Phase 3: US5 [P2] - Maintenance mode disabled (baseline behavior)
4. Phase 4: US1 [P3] - External visitor sees maintenance page (core value)
5. Phase 5: US2 [P4] - Developer bypass with token (core value)
6. Phase 6: US3 [P5] - Developer navigation with active bypass (depends on US2)
7. Phase 7: US4 [P6] - Invalid token handling (edge case)
8. Phase 8: Polish & Cross-Cutting Concerns

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 1**: T002, T003, T004 (different files, no dependencies)
- **Phase 2**: T007, T008 (after T006 util functions created)
- **Phase 4**: T013, T014 (after T012 middleware created)
- **Phase 5**: T017, T018 (after T016 token validation)
- **Phase 8**: T025, T026, T027 (independent polish tasks)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phases 1-7 (all user stories US1-US6)
**Incremental Delivery**: Foundation → Core → Edge Cases → Polish
**Testing Approach**: Unit tests for utilities, manual QA for middleware/UI
**TDD Required**: Yes for lib/maintenance-utils.ts (pure functions)

---

## Phase 1: Setup

**Goal**: Environment variable infrastructure and utility functions

- [ ] T001 Generate cryptographically secure bypass token
  - Command: `openssl rand -hex 32` (generates 64-char hex string)
  - Output: 256-bit entropy token for MAINTENANCE_BYPASS_TOKEN
  - From: plan.md [Tech Stack] + spec.md NFR-003

- [ ] T002 [P] Update lib/env-schema.ts with maintenance variables
  - Add to EnvironmentVariables interface:
    - MAINTENANCE_MODE?: "true" | "false" (optional, defaults to "false")
    - MAINTENANCE_BYPASS_TOKEN?: string (optional, required when MAINTENANCE_MODE="true")
  - Update ENV_CATEGORIES: Add `maintenance: ['MAINTENANCE_MODE', 'MAINTENANCE_BYPASS_TOKEN']`
  - Update ENV_REQUIREMENTS.optional: Add both variables
  - Update ENV_METRICS: total: 12 (was 10), optional: 4 (was 2)
  - Pattern: lib/env-schema.ts lines 17-216
  - From: plan.md [Module 4: Environment Variable Extensions]

- [ ] T003 [P] Update .env.example with maintenance mode section
  - Add section: "# Maintenance Mode (Optional)"
  - MAINTENANCE_MODE: Description, format, toggle instructions, default behavior
  - MAINTENANCE_BYPASS_TOKEN: Description, generation command, security notes, 64-char requirement
  - Follow pattern: .env.example lines 14-124 (section headers, detailed comments)
  - From: plan.md [Module 4] + spec.md FR-001, FR-002

- [ ] T004 [P] Create .env.local with maintenance variables
  - Copy from .env.example template
  - Set MAINTENANCE_MODE="false" (disabled for local dev by default)
  - Set MAINTENANCE_BYPASS_TOKEN="<token from T001>"
  - File location: D:\coding\tech-stack-foundation-core\.env.local
  - From: plan.md [Phase 1: Foundation]

- [ ] T005 Create lib/maintenance-utils.ts with helper functions
  - Function: validateBypassToken(token: string, envToken: string): boolean
  - Function: isExcludedPath(pathname: string): boolean
  - Function: maskToken(token: string): string
  - Function: logBypassAttempt(success: boolean, details: { ip?: string; token: string }): void
  - TypeScript strict mode, no external dependencies
  - From: plan.md [Module 3: Utility Functions]

- [ ] T006 Write unit tests for lib/maintenance-utils.ts
  - Test: validateBypassToken - valid/invalid/empty/case-sensitive/whitespace
  - Test: isExcludedPath - /_next/*, /images/*, /api/health, /maintenance, /blog (not excluded)
  - Test: maskToken - 64-char token, short token, empty string
  - Test: logBypassAttempt - successful bypass INFO, failed bypass WARN, token masked
  - Coverage target: 100% (new code must be fully tested)
  - From: plan.md [Phase 1: Foundation] + spec.md FR-006

---

## Phase 2: US6 [P1] - Static Assets and Health Checks

**Story Goal**: Ensure static assets, health checks, and maintenance page itself are never blocked

**Acceptance Criteria** (from spec.md lines 147-159):
- ✅ Static assets excluded via path matching (/_next/*, /images/*, /fonts/*)
- ✅ Health check endpoint accessible (/api/health)
- ✅ Maintenance page itself can load assets (no infinite loop)

- [ ] T007 [P] Implement isExcludedPath regex in lib/maintenance-utils.ts
  - Regex: `/(^\/_next|^\/images|^\/fonts|^\/api\/health|^\/maintenance)/`
  - Return true if pathname matches, false otherwise
  - Edge cases: Query parameters, trailing slashes, case sensitivity
  - Pattern: Simple regex test (no external regex lib needed)
  - From: plan.md [Module 3] + spec.md FR-005

- [ ] T008 [P] Write unit tests for path exclusion logic
  - Test cases:
    - /_next/static/chunks/main.js → true
    - /images/logo.png → true
    - /fonts/WorkSans-Regular.woff2 → true
    - /api/health → true
    - /maintenance → true
    - / → false
    - /blog → false
    - /about?query=test → false
  - Coverage: 100% of isExcludedPath function
  - From: plan.md [Testing Strategy] + spec.md Scenario 6

---

## Phase 3: US5 [P2] - Maintenance Mode Disabled

**Story Goal**: When MAINTENANCE_MODE is false or unset, allow all traffic with minimal overhead

**Acceptance Criteria** (from spec.md lines 132-141):
- ✅ Middleware runs but skips all maintenance logic (<5ms overhead)
- ✅ No bypass check performed
- ✅ No maintenance page access

- [ ] T009 Create middleware.ts at project root
  - Import: NextRequest, NextResponse from 'next/server'
  - Import: isExcludedPath from '@/lib/maintenance-utils'
  - Export: middleware(request: NextRequest): NextResponse
  - Export: config object with matcher pattern
  - Skeleton: Early return if excluded path or MAINTENANCE_MODE !== "true"
  - Pattern: app/api/health/route.ts NextResponse usage
  - From: plan.md [Module 1: Edge Middleware]

- [ ] T010 Implement maintenance mode disabled logic in middleware.ts
  - Read: process.env.MAINTENANCE_MODE
  - If undefined or "false" (case-insensitive): return NextResponse.next()
  - Performance: <5ms overhead (synchronous, no async operations)
  - From: plan.md [Phase 2: Middleware Implementation] + spec.md FR-001

- [ ] T011 Test middleware with MAINTENANCE_MODE=false
  - Manual test: Set MAINTENANCE_MODE="false" in .env.local
  - Verify: Homepage loads normally (http://localhost:3000)
  - Verify: No redirect to /maintenance
  - Verify: Network tab shows no extra latency (<5ms)
  - From: plan.md [Phase 4: Integration & Testing] + spec.md Scenario 5

---

## Phase 4: US1 [P3] - External Visitor Sees Maintenance Page

**Story Goal**: When maintenance mode is enabled, external visitors see branded maintenance page

**Acceptance Criteria** (from spec.md lines 63-79):
- ✅ Maintenance page loads in <1.5s (FCP)
- ✅ No error messages or broken assets visible
- ✅ Page meets WCAG 2.1 AA accessibility standards
- ✅ Works on mobile, tablet, desktop

- [ ] T012 Implement maintenance mode enabled redirect in middleware.ts
  - Check: MAINTENANCE_MODE === "true" (case-insensitive)
  - Check: No bypass cookie present (request.cookies.get('maintenance_bypass'))
  - Check: No bypass query parameter (?bypass=<TOKEN>)
  - Action: NextResponse.redirect(new URL('/maintenance', request.url))
  - From: plan.md [Module 1] + spec.md FR-005

- [ ] T013 [P] Create app/maintenance/page.tsx with branded UI
  - Component: export default function MaintenancePage(): JSX.Element
  - Metadata: export const metadata: Metadata (title, description)
  - Content:
    - Heading: "We'll be back soon" (text-4xl, font-bold)
    - Message: "Site is currently under maintenance..." (text-lg)
    - Contact: Email link or social media
  - Styling: Navy 900 background (#0f172a), Emerald 600 accent (#059669)
  - Responsive: Tailwind breakpoints (sm:, md:, lg:)
  - From: plan.md [Module 2: Maintenance Page] + spec.md FR-004

- [ ] T014 [P] Create app/maintenance/layout.tsx (minimal wrapper)
  - Purpose: Optional custom layout (can use root layout if preferred)
  - Props: children: React.ReactNode
  - Structure: Minimal HTML wrapper, no extra navigation
  - From: plan.md [Module 2] (optional)

- [ ] T015 Test maintenance page UI on mobile/tablet/desktop
  - Viewport: 375x667 (mobile), 768x1024 (tablet), 1920x1080 (desktop)
  - Verify: Text readable, colors correct, no overflow
  - Verify: No console errors, no broken assets
  - Tool: Browser DevTools responsive mode
  - From: plan.md [Phase 3: Maintenance Page] + spec.md Scenario 1

---

## Phase 5: US2 [P4] - Developer Bypass with Token

**Story Goal**: Developer can bypass maintenance mode using secret token in query parameter

**Acceptance Criteria** (from spec.md lines 84-98):
- ✅ Cookie uses HttpOnly, Secure, and SameSite=Strict flags
- ✅ Token is removed from URL after validation (prevents sharing bypass links)
- ✅ Bypass persists across all site navigation for 24 hours
- ✅ Console log includes timestamp and masked token (last 4 chars only)

- [ ] T016 Implement token validation in middleware.ts
  - Extract: const bypassToken = request.nextUrl.searchParams.get('bypass')
  - Read: const envToken = process.env.MAINTENANCE_BYPASS_TOKEN
  - Validate: validateBypassToken(bypassToken, envToken) from lib/maintenance-utils
  - Action: If valid, set cookie and redirect to clean URL
  - REUSE: validateBypassToken from lib/maintenance-utils.ts
  - From: plan.md [Module 1] + spec.md FR-002, FR-003

- [ ] T017 [P] Implement cookie setting in middleware.ts
  - Cookie name: 'maintenance_bypass'
  - Cookie value: 'true'
  - Flags: httpOnly: true, secure: true, sameSite: 'strict'
  - Path: '/' (site-wide)
  - maxAge: 86400 (24 hours in seconds)
  - API: response.cookies.set('maintenance_bypass', 'true', { ... })
  - From: plan.md [Module 1] + spec.md FR-003

- [ ] T018 [P] Implement URL cleaning after successful bypass
  - Create new URL: const cleanUrl = new URL(request.url)
  - Remove bypass parameter: cleanUrl.searchParams.delete('bypass')
  - Redirect: NextResponse.redirect(cleanUrl)
  - Purpose: Prevent sharing bypass links, clean browser history
  - From: plan.md [Security Architecture] + spec.md US2

- [ ] T019 Implement bypass success logging in middleware.ts
  - Call: logBypassAttempt(true, { token: bypassToken })
  - Log format: [INFO] [Maintenance Bypass] Successful - Token: ***<last 4>
  - REUSE: logBypassAttempt from lib/maintenance-utils.ts
  - From: plan.md [Module 1] + spec.md FR-006

- [ ] T020 Test developer bypass flow end-to-end
  - Manual test: Set MAINTENANCE_MODE="true"
  - Access: http://localhost:3000/?bypass=<TOKEN from T001>
  - Verify: Redirected to http://localhost:3000/ (clean URL)
  - Verify: Cookie set in DevTools → Application → Cookies
  - Verify: Homepage loads normally (no maintenance page)
  - Verify: Console log shows successful bypass (masked token)
  - From: plan.md [Phase 4: Integration & Testing] + spec.md Scenario 2

---

## Phase 6: US3 [P5] - Developer Navigation with Active Bypass

**Story Goal**: Developer with valid bypass cookie can navigate site normally

**Acceptance Criteria** (from spec.md lines 103-111):
- ✅ Middleware performance overhead <10ms per request
- ✅ Bypass check occurs before any database or API calls
- ✅ Works for all routes (pages, API routes, dynamic routes)

- [ ] T021 Implement bypass cookie check in middleware.ts
  - Read: const bypassCookie = request.cookies.get('maintenance_bypass')
  - Check: if (bypassCookie?.value === 'true') return NextResponse.next()
  - Position: After MAINTENANCE_MODE check, before redirect
  - Performance: <10ms overhead (cookie read is fast)
  - From: plan.md [Module 1] + spec.md FR-003

- [ ] T022 Test navigation with active bypass cookie
  - Manual test: After successful bypass (from T020)
  - Navigate: / → /blog → /about → /
  - Verify: No maintenance page shown on any navigation
  - Verify: Bypass persists across all pages
  - Tool: Browser DevTools → Network tab (check timing)
  - From: plan.md [Phase 4] + spec.md Scenario 3

---

## Phase 7: US4 [P6] - Invalid Token Handling

**Story Goal**: Invalid bypass attempts are logged and redirected to maintenance page

**Acceptance Criteria** (from spec.md lines 116-128):
- ✅ No error message exposed to user (silent failure)
- ✅ Failed attempt logged with timestamp and IP
- ✅ User sees same maintenance page as scenario 1

- [ ] T023 Implement invalid token logging in middleware.ts
  - Condition: If bypassToken provided but validation fails
  - Call: logBypassAttempt(false, { token: bypassToken, ip: request.ip })
  - Log format: [WARN] [Maintenance Bypass] Failed - IP: <ip> - Token: ***<last 4>
  - Redirect: NextResponse.redirect(new URL('/maintenance', request.url))
  - REUSE: logBypassAttempt, maskToken from lib/maintenance-utils.ts
  - From: plan.md [Module 1] + spec.md FR-006

- [ ] T024 Test invalid bypass token handling
  - Manual test: Set MAINTENANCE_MODE="true"
  - Access: http://localhost:3000/?bypass=WRONG_TOKEN
  - Verify: Redirected to /maintenance (same page as external visitor)
  - Verify: No error message displayed to user
  - Verify: Console log shows failed bypass attempt (WARN level)
  - Verify: Token masked in log (last 4 chars only)
  - From: plan.md [Testing Strategy] + spec.md Scenario 4

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Accessibility, performance, deployment readiness

### Accessibility & Performance

- [ ] T025 [P] Run Lighthouse audit on maintenance page
  - Metrics: FCP <1.5s, LCP <2.5s, TTI <3s
  - Score: Performance ≥85, Accessibility ≥95
  - Tool: Chrome DevTools → Lighthouse
  - Fix: Optimize if below targets (inline CSS, reduce JS)
  - From: plan.md [Phase 3] + spec.md NFR-002

- [ ] T026 [P] Run Axe DevTools accessibility scan
  - Target: 0 critical issues, WCAG 2.1 AA compliance
  - Checks: Contrast ratio ≥4.5:1, semantic HTML, keyboard nav
  - Tool: Axe DevTools browser extension
  - Fix: Address any critical issues found
  - From: plan.md [Phase 3] + spec.md NFR-005

- [ ] T027 [P] Test middleware performance overhead
  - Scenario 1: MAINTENANCE_MODE="false" → Target <5ms
  - Scenario 2: MAINTENANCE_MODE="true" + bypass cookie → Target <10ms
  - Scenario 3: MAINTENANCE_MODE="true" + redirect → Target <10ms
  - Measurement: Browser DevTools Network tab (Timing column)
  - From: plan.md [Performance Targets] + spec.md NFR-001

### Deployment Preparation

- [ ] T028 Update lib/validate-env.ts with optional maintenance checks
  - Add to requiredVars (optional section):
    - MAINTENANCE_MODE: Description, format, toggle behavior
    - MAINTENANCE_BYPASS_TOKEN: Description, security warning
  - Add validation: If MAINTENANCE_MODE="true", warn if MAINTENANCE_BYPASS_TOKEN missing
  - Non-blocking: Warn only, don't throw error (optional variables)
  - Pattern: lib/validate-env.ts lines 28-78
  - From: plan.md [Module 4] + spec.md Deployment Considerations

---

## [TEST GUARDRAILS]

**Not Applicable**: Spec.md does not explicitly request TDD approach for middleware/UI components. Unit tests included for lib/maintenance-utils.ts only (pure functions).

**Manual Testing Required**:
- Middleware behavior (6 scenarios from spec.md)
- Maintenance page UI (mobile/tablet/desktop)
- Accessibility (Axe DevTools, keyboard nav)
- Performance (Lighthouse, Network timing)

**Quality Gates**:
- All 6 user scenarios pass (Scenarios 1-6 from spec.md)
- All 8 success criteria met (spec.md lines 354-366)
- Lighthouse Performance ≥85, Accessibility ≥95
- Axe DevTools: 0 critical issues

---

## Task Statistics

**Total**: 28 tasks
**Parallel Opportunities**: 10 tasks marked [P]
**Test Tasks**: 3 (T006, T008, unit tests for utilities)
**Implementation Tasks**: 18 (T002-T005, T007, T009-T024, T028)
**Integration/QA Tasks**: 7 (T001, T011, T015, T020, T022, T024, T025-T027)

**By Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (US6): 2 tasks
- Phase 3 (US5): 3 tasks
- Phase 4 (US1): 4 tasks
- Phase 5 (US2): 5 tasks
- Phase 6 (US3): 2 tasks
- Phase 7 (US4): 2 tasks
- Phase 8 (Polish): 4 tasks

**MVP Scope**: All 28 tasks (complete feature implementation)

**REUSE Leverage**: 4 existing components (env-schema.ts, validate-env.ts, .env.example, health/route.ts patterns)

**New Components**: 4 files (~250 LOC total)

---

**Next Command**: `/analyze` to validate architecture and identify implementation risks
