# Tasks: Newsletter Signup Integration

## [CODEBASE REUSE ANALYSIS]

**Scanned**: D:\coding\tech-stack-foundation-core

### [EXISTING - REUSE]

**Frontend Components (6 verified)**:
- ✅ NewsletterSignupForm (components\newsletter\NewsletterSignupForm.tsx) - Full form with validation, API integration, multi-track checkboxes
- ✅ Button (components\ui\Button.tsx) - Primary CTA button with loading states
- ✅ Footer (components\layout\Footer.tsx) - Site footer component for integration
- ✅ BlogPostPage (app\blog\[slug]\page.tsx) - Individual blog post page

**Backend Services (4 verified)**:
- ✅ Newsletter Subscribe API (app\api\newsletter\subscribe\route.ts) - POST endpoint with Zod validation
- ✅ Newsletter Preferences API (app\api\newsletter\preferences\[token]\route.ts) - GET/PATCH endpoint
- ✅ Newsletter Unsubscribe API (app\api\newsletter\unsubscribe\route.ts) - DELETE endpoint
- ✅ Email Service (lib\newsletter\email-service.ts) - Resend integration
- ✅ Validation Schemas (lib\newsletter\validation-schemas.ts) - Zod schemas
- ✅ Token Generator (lib\newsletter\token-generator.ts) - Unsubscribe token generation
- ✅ Rate Limiter (lib\newsletter\rate-limiter.ts) - 5 req/min protection

### [NEW - CREATE]

**Frontend Components (5 needed)**:
- 🆕 CompactNewsletterSignup (components\newsletter\CompactNewsletterSignup.tsx) - Footer variant wrapper
- 🆕 InlineNewsletterCTA (components\newsletter\InlineNewsletterCTA.tsx) - Post-inline variant wrapper
- 🆕 NewsletterPage (app\newsletter\page.tsx) - Dedicated landing page
- 🆕 NewsletterFormVariants - Extend NewsletterSignupForm.tsx with variant prop system
- 🆕 GA4 Event Tracking (lib\analytics\ga4-events.ts) - Type-safe analytics wrappers

---

## [DEPENDENCY GRAPH]

**Story completion order**:
1. Phase 2: Foundational (variant system, GA4 tracking) - blocks all stories
2. Phase 3: US1 [P1] - Footer compact signup (independent)
3. Phase 4: US2 [P1] - Inline CTA after posts (independent, can run parallel with US1)
4. Phase 5: US5 [P2] - Dedicated /newsletter page (depends on US1, US2 variant system)
5. Phase 6: US6 [P2] - Analytics tracking (independent, can run parallel with US5)

**Note**: US3 (multi-track selection) and US4 (welcome email) already implemented in NewsletterSignupForm and email-service.ts

---

## [PARALLEL EXECUTION OPPORTUNITIES]

**Phase 3+4 (US1+US2)**: Can run in parallel
- T011, T012, T013 (US1 footer tasks - different files)
- T020, T021, T022 (US2 inline tasks - different files)

**Phase 6 (Analytics)**: Can run parallel with Phase 5
- T040 (GA4 tracking helper)
- T041 (Analytics integration)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phase 3 + Phase 4 (US1 + US2 - footer + inline CTAs)
**Incremental delivery**: US1+US2 → production validation → US5 (dedicated page) → US6 (analytics)
**Testing approach**: Manual testing priority (no automated tests per project standards), accessibility validation required

**Rationale**:
- Footer + Inline placements drive 70% of newsletter signups (based on similar sites)
- Dedicated page is enhancement (P2), ship after validating MVP conversion rates
- Analytics tracking can be added after initial MVP ships

---

## Phase 1: Setup

- [ ] T001 Verify project environment and dependencies
  - Verify: RESEND_API_KEY exists in .env
  - Verify: NEXT_PUBLIC_GA4_MEASUREMENT_ID exists in .env
  - Verify: NewsletterSubscriber + NewsletterPreference tables exist in database
  - Pattern: Standard environment validation
  - From: plan.md [CI/CD IMPACT]

- [ ] T002 [P] Create feature branch and initialize workflow state
  - Command: git checkout -b feature/051-newsletter-signup
  - Initialize: specs/051-newsletter-signup/workflow-state.yaml
  - Pattern: Standard feature branch workflow
  - From: CLAUDE.md workflow conventions

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Variant system + GA4 tracking infrastructure that all user stories depend on

### Variant System

- [ ] T005 Extend NewsletterSignupForm with variant prop system
  - File: components\newsletter\NewsletterSignupForm.tsx
  - Add prop: variant?: 'compact' | 'inline' | 'comprehensive' (default: 'comprehensive')
  - Add conditional rendering based on variant:
    - compact: Single-line layout, minimal spacing, hide newsletter type checkboxes initially (default to 'all')
    - inline: Show all checkboxes, add optional headline prop, prominent CTA
    - comprehensive: Current full-featured behavior (no changes)
  - REUSE: Existing form logic (validation, API call, error/success states)
  - Pattern: Component variant systems in components\ui\Button.tsx
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] NewsletterFormVariants

### Analytics Infrastructure

- [ ] T006 [P] Create GA4 event tracking helper
  - File: lib\analytics\ga4-events.ts
  - Export function: trackNewsletterSignup(source: 'footer' | 'post-inline' | 'dedicated-page')
  - Implementation: gtag('event', 'newsletter_signup', { event_category: 'engagement', event_label: source, source })
  - Error handling: Silent fail if gtag not loaded (typeof window !== 'undefined' && window.gtag)
  - Pattern: Type-safe wrapper pattern
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] GA4 Event Tracking

---

## Phase 3: User Story 1 [P1] - Footer compact signup

**Story Goal**: Visitor sees newsletter signup form in footer on every page and can subscribe with one click

**Acceptance Criteria** (from spec.md US1):
- Footer contains compact email input + subscribe button
- Visible on all pages
- Mobile-responsive (single-column layout, touch-friendly ≥44px buttons)

### Implementation

- [ ] T011 [P] [US1] Create CompactNewsletterSignup component
  - File: components\newsletter\CompactNewsletterSignup.tsx
  - Props: source: 'footer' (fixed value for analytics)
  - Implementation: Wrap NewsletterSignupForm with variant="compact" prop
  - Layout: Single-line flex layout (email input + button on same row desktop, stacked mobile <640px)
  - Default behavior: Newsletter types default to ['all'] (no checkbox UI shown)
  - REUSE: NewsletterSignupForm (components\newsletter\NewsletterSignupForm.tsx)
  - Pattern: Wrapper component pattern
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] CompactNewsletterSignup

- [ ] T012 [US1] Integrate CompactNewsletterSignup into Footer component
  - File: components\layout\Footer.tsx
  - Integration point: Add as 5th column in footer grid OR integrate into existing 4-column layout
  - Responsive: Span full width on mobile (<768px), right column on desktop
  - Spacing: pt-8 border-t-2 border-navy-800 (visual separation from footer links)
  - REUSE: Footer (components\layout\Footer.tsx), CompactNewsletterSignup (T011)
  - Pattern: Layout integration in components\layout\Footer.tsx
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] Footer

- [ ] T013 [US1] Test footer newsletter signup flow (manual)
  - Test: Navigate to http://localhost:3000/ → scroll to footer → verify compact form visible
  - Test: Submit valid email → verify success message → verify form clears
  - Test: Submit invalid email → verify error message
  - Test: Mobile responsive (360px, 768px, 1280px viewports)
  - Test: Keyboard navigation (tab to input, tab to button, enter to submit)
  - Accessibility: ARIA labels present, contrast ≥4.5:1, focus states visible
  - From: plan.md [DEPLOYMENT ACCEPTANCE] Manual Testing Checklist

---

## Phase 4: User Story 2 [P1] - Inline CTA after posts

**Story Goal**: Visitor sees newsletter CTA after reading blog post and is encouraged to subscribe with context-specific messaging

**Acceptance Criteria** (from spec.md US2):
- Inline CTA appears after post content
- Context-aware copy (e.g., "Enjoyed this aviation post? Get more...")
- One-click subscription option

### Implementation

- [ ] T020 [P] [US2] Create InlineNewsletterCTA component
  - File: components\newsletter\InlineNewsletterCTA.tsx
  - Props: postTags: string[] (for context-aware messaging), source: 'post-inline' (fixed for analytics)
  - Layout sections:
    - Headline: "Enjoyed this [aviation/dev] post? Get more like it." (conditional based on postTags)
    - Benefit bullets: 3-4 reasons to subscribe (from spec.md FAQ section)
    - Newsletter type selector: Multi-track checkboxes (aviation, dev-startup, education, all)
    - CTA button: "Subscribe" or "Get Updates"
  - Visual design: Gradient background (bg-gradient-to-r from-navy-900 to-emerald-600), white text (contrast ≥4.5:1)
  - REUSE: NewsletterSignupForm with variant="inline", Button (components\ui\Button.tsx)
  - Pattern: Marketing CTA component pattern
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] InlineNewsletterCTA

- [ ] T021 [US2] Integrate InlineNewsletterCTA into blog post page
  - File: app\blog\[slug]\page.tsx
  - Integration point: After MDX content, before PrevNextNav component (or related posts section)
  - Pass postTags: Extract from post metadata (frontmatter tags or categories)
  - Lazy loading: Use next/dynamic with { ssr: false, loading: () => <Skeleton /> } (NFR-001 performance requirement)
  - REUSE: BlogPostPage (app\blog\[slug]\page.tsx), InlineNewsletterCTA (T020)
  - Pattern: Component integration in app\blog\[slug]\page.tsx
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] BlogPostPage

- [ ] T022 [US2] Test inline newsletter CTA flow (manual)
  - Test: Navigate to http://localhost:3000/blog/[any-slug] → scroll to end → verify inline CTA appears
  - Test: Verify context-aware headline (aviation post → mentions aviation, dev post → mentions dev)
  - Test: Submit with newsletter type selection → verify success → verify API request <2s
  - Test: Mobile responsive (single-column layout <640px)
  - Test: Lazy loading behavior (component not in initial bundle, loads when scrolled into view)
  - Lighthouse: Performance ≥85, Accessibility ≥95
  - From: plan.md [DEPLOYMENT ACCEPTANCE] Manual Testing Checklist

---

## Phase 5: User Story 5 [P2] - Dedicated /newsletter page

**Story Goal**: Visitor visits /newsletter page to learn about benefits and subscribe with comprehensive information

**Acceptance Criteria** (from spec.md US5):
- /newsletter route exists
- Page explains content types (aviation, dev-startup, education)
- Shows sample past emails (optional for MVP)
- Displays comprehensive signup form

### Implementation

- [ ] T030 [US5] Create NewsletterPage component
  - File: app\newsletter\page.tsx
  - Sections:
    - Hero: Value proposition headline + Subscribe CTA above fold
    - Benefits grid: 3-4 benefits with icons (systematic thinking, dual-track content, teaching quality, building in public)
    - FAQs: 4-6 common questions (frequency, unsubscribe, privacy, content types) from spec.md
    - Comprehensive signup form: NewsletterSignupForm with variant="comprehensive"
  - SEO metadata: export const metadata = { title: 'Newsletter - Marcus Gollahon', description: '...', openGraph: {...} }
  - REUSE: NewsletterSignupForm with variant="comprehensive"
  - Pattern: Next.js 15 App Router page component with metadata
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] NewsletterPage

- [ ] T031 [US5] Test dedicated newsletter page (manual)
  - Test: Navigate to http://localhost:3000/newsletter → verify page renders
  - Test: Verify hero section, benefits grid, FAQs, signup form all visible
  - Test: Submit newsletter form → verify same behavior as footer/inline variants
  - Test: SEO metadata present (view page source, verify title/description/og tags)
  - Lighthouse: Performance ≥85, Accessibility ≥95, SEO ≥90
  - From: plan.md [DEPLOYMENT ACCEPTANCE] Manual Testing Checklist

---

## Phase 6: User Story 6 [P2] - Analytics tracking

**Story Goal**: Track newsletter signup conversion rates by placement to optimize strategy

**Acceptance Criteria** (from spec.md US6):
- Analytics events fired for each signup with source parameter
- Viewable in Google Analytics 4

### Implementation

- [ ] T040 [P] [US6] Integrate GA4 tracking in NewsletterSignupForm
  - File: components\newsletter\NewsletterSignupForm.tsx
  - Integration point: After successful API response (in handleSubmit function)
  - Call: trackNewsletterSignup(source) where source comes from props
  - REUSE: ga4-events.ts (T006)
  - Pattern: Analytics integration in form success handler
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] GA4 Event Tracking

- [ ] T041 [P] [US6] Add source prop to all newsletter component instances
  - Files: components\newsletter\CompactNewsletterSignup.tsx (source='footer'), components\newsletter\InlineNewsletterCTA.tsx (source='post-inline'), app\newsletter\page.tsx (source='dedicated-page')
  - Pass source prop to NewsletterSignupForm wrapper
  - Verify: Each placement has unique source value for analytics segmentation
  - From: spec.md FR-017, FR-018

- [ ] T042 [US6] Validate GA4 events in Google Analytics dashboard (manual)
  - Test: Subscribe from footer → verify event fires with source='footer'
  - Test: Subscribe from inline CTA → verify event fires with source='post-inline'
  - Test: Subscribe from /newsletter page → verify event fires with source='dedicated-page'
  - Dashboard: Google Analytics 4 → Events → newsletter_signup → Check custom dimensions
  - From: spec.md Measurement Plan

---

## Phase 7: Polish & Cross-Cutting Concerns

### Accessibility Validation

- [ ] T050 Run accessibility audit on all newsletter placements
  - Tools: Lighthouse Accessibility, axe DevTools
  - Check: WCAG 2.1 AA compliance (keyboard navigation, ARIA labels, contrast ≥4.5:1, focus indicators)
  - Pages: / (footer), /blog/[slug] (inline), /newsletter (dedicated)
  - Fix: Any accessibility violations found
  - Target: Lighthouse Accessibility ≥95
  - From: spec.md NFR-003

### Performance Validation

- [ ] T051 [P] Validate lazy loading prevents initial page load blocking
  - Test: Chrome DevTools Network tab → Load / and /blog/[slug] → Verify newsletter components not in initial bundle
  - Test: Lighthouse Performance ≥85 on pages with newsletter forms
  - Verify: FCP <1.5s, LCP <3.0s, TTI <3.5s, CLS <0.15
  - From: spec.md NFR-001, plan.md [PERFORMANCE TARGETS]

### Error Handling

- [ ] T052 Add user-friendly error messages for all failure scenarios
  - Scenarios: Invalid email format, network error, rate limit exceeded (429), server error (500)
  - Messages: Clear, actionable guidance (e.g., "Please enter a valid email address", "Too many requests. Please try again in 1 minute.")
  - REUSE: Existing error handling in NewsletterSignupForm
  - From: spec.md NFR-006

### Mobile Responsiveness

- [ ] T053 Test mobile responsiveness across all placements
  - Viewports: 360px (mobile), 768px (tablet), 1280px (desktop)
  - Test: Single-column layout on mobile, touch-friendly buttons ≥44px, readable font sizes ≥16px
  - Test: Form inputs properly sized, no horizontal scroll
  - From: spec.md NFR-004

### Documentation

- [ ] T054 Update NOTES.md with implementation decisions
  - Document: Variant system architecture, GA4 event schema, placement strategy
  - Document: Performance metrics (bundle size impact, lazy loading strategy)
  - Document: Testing checklist completed
  - From: Standard NOTES.md update pattern

### Deployment Preparation

- [ ] T055 Document rollback procedure in NOTES.md
  - Command: Standard Git revert (3-command rollback)
  - Verification: No database migrations, cosmetic changes only, fast rollback <5 min
  - Special considerations: None (API unchanged, schema unchanged)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T056 Run final smoke tests before deployment
  - Test: All 3 placements work (footer, inline, /newsletter page)
  - Test: Email validation prevents invalid submissions
  - Test: API response <2s (verify with network tab)
  - Test: Success message shows, form clears after subscription
  - Test: GA4 events fire with correct source parameters
  - Test: No console errors in dev tools
  - From: plan.md [QUALITY GATES]

---

## [TASK SUMMARY]

**Total tasks**: 26
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 2 tasks
- Phase 3 (US1 - Footer): 3 tasks
- Phase 4 (US2 - Inline): 3 tasks
- Phase 5 (US5 - Dedicated page): 2 tasks
- Phase 6 (US6 - Analytics): 3 tasks
- Phase 7 (Polish): 7 tasks
- Phase 8 (Deployment): 4 tasks

**MVP tasks** (Phase 1-4): 10 tasks (~8-12 hours)
**Enhancement tasks** (Phase 5-6): 5 tasks (~4-6 hours)
**Polish tasks** (Phase 7-8): 11 tasks (~4-6 hours)

**Parallel opportunities**: 8 tasks marked [P] can run in parallel

**REUSE strategy**: 100% API reuse, extend 1 component (NewsletterSignupForm), create 3 new wrapper components

---

## [IMPLEMENTATION NOTES]

### Architecture Decisions
- **Variant system**: Single NewsletterSignupForm component with variant prop avoids duplication
- **Lazy loading**: next/dynamic prevents blocking initial page load (NFR-001)
- **Analytics**: GA4 custom events with source dimension enables placement optimization
- **Default behavior**: Compact variant defaults to 'all' newsletter types (simplest UX)

### Risk Mitigation
- **Low risk**: Cosmetic frontend changes only, backend API unchanged
- **Fast rollback**: Git revert <5 minutes, no database migrations
- **Performance**: Lazy loading + existing API <2s response time maintains performance targets
- **Accessibility**: WCAG 2.1 AA required, manual testing before deployment

### Testing Strategy
- **Manual testing priority**: Project standards (no automated E2E tests yet)
- **Coverage**: All 3 placements, mobile responsive, accessibility, performance
- **Validation**: Lighthouse scores (Performance ≥85, Accessibility ≥95)
