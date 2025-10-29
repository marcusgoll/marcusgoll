# Feature Specification: Newsletter Signup Integration

**Branch**: `feature/051-newsletter-signup`
**Created**: 2025-10-28
**Status**: Draft
**GitHub Issue**: #19 (ICE Score: 1.80 - High Priority)

## User Scenarios

### Primary User Story
A visitor lands on marcusgoll.com, reads aviation or dev content, and wants to stay updated on future posts. They should be able to subscribe to the newsletter from multiple touchpoints (footer, after reading a post, dedicated signup page) with minimal friction, choosing which content tracks to receive (aviation, dev-startup, education, or all).

### Acceptance Scenarios

1. **Given** a visitor is reading the homepage, **When** they scroll to the footer, **Then** they see a newsletter signup form with email input and can subscribe with one click
2. **Given** a visitor finishes reading a blog post, **When** they scroll to the end of the content, **Then** they see an inline newsletter CTA encouraging subscription with context-specific messaging
3. **Given** a visitor navigates to `/newsletter`, **When** the page loads, **Then** they see a comprehensive newsletter signup page with benefits, FAQs, and multi-track selection
4. **Given** a visitor submits their email with invalid format, **When** validation runs, **Then** they see a clear error message and can correct it
5. **Given** a visitor successfully subscribes, **When** the subscription completes, **Then** they see a success message and receive a welcome email with preference management link
6. **Given** a visitor is already subscribed, **When** they click the preference link from their email, **Then** they can update which newsletters they receive (aviation, dev, education, all)
7. **Given** a visitor wants to unsubscribe, **When** they click the unsubscribe link in any email, **Then** they are instantly unsubscribed and see a confirmation message

### Edge Cases

- What happens when a visitor subscribes with an email already in the system? → Update preferences, send new welcome email
- How does the system handle rate limiting (5 requests/minute)? → Display friendly "Too many requests" message with countdown
- What if the email service (Resend) fails to send welcome email? → Subscription still succeeds (fire-and-forget pattern), log error for debugging
- How does the form behave on mobile devices? → Responsive design, single-column layout, large touch targets
- What if a visitor tries to submit without selecting any newsletters? → Client-side validation prevents submission, shows error message
- How does the system prevent spam signups? → Rate limiting per IP (5/min), email format validation, optional Cloudflare Turnstile

## User Stories (Prioritized)

> **Purpose**: Break down feature into independently deliverable stories for MVP-first delivery.
> **Format**: [P1] = MVP (ship first), [P2] = Enhancement, [P3] = Nice-to-have

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a visitor, I want to see a newsletter signup form in the footer on every page so that I can subscribe without leaving my current page
  - **Acceptance**: Footer contains compact email input + subscribe button, visible on all pages, mobile-responsive
  - **Independent test**: Navigate to any page, scroll to footer, verify form present and functional
  - **Effort**: S (2-4 hours)

- **US2** [P1]: As a visitor, I want to see a newsletter CTA after reading a blog post so that I'm encouraged to subscribe when I'm most engaged
  - **Acceptance**: Inline CTA appears after post content, context-aware copy (e.g., "Enjoyed this aviation post? Get more..."), one-click subscription option
  - **Independent test**: Read any blog post, scroll to end, verify CTA appears with relevant messaging
  - **Effort**: S (2-4 hours)

- **US3** [P1]: As a visitor, I want to choose which newsletter tracks to receive (aviation, dev-startup, education, all) so that I only get content I care about
  - **Acceptance**: All signup forms show newsletter type checkboxes, at least 1 must be selected, preferences saved to database
  - **Independent test**: Subscribe with different combinations, verify preferences saved and reflected in welcome email
  - **Effort**: XS (<2 hours - already implemented in NewsletterSignupForm)

- **US4** [P1]: As a subscriber, I want to receive a welcome email with a link to manage my preferences so that I can update my subscription anytime
  - **Acceptance**: Welcome email sent immediately after subscription, includes preference management link with secure token
  - **Independent test**: Subscribe, check email inbox, click preference link, verify page loads with current preferences
  - **Effort**: XS (<2 hours - already implemented in email-service.ts)

**Priority 2 (Enhancement)**

- **US5** [P2]: As a visitor, I want to visit a dedicated `/newsletter` page to learn about newsletter benefits and subscribe so that I can make an informed decision
  - **Acceptance**: `/newsletter` route exists, page explains content types, shows sample past emails, displays comprehensive signup form
  - **Independent test**: Navigate to marcusgoll.com/newsletter, verify page loads with benefits section and signup form
  - **Depends on**: US1, US3
  - **Effort**: M (4-8 hours - requires page design, copy writing, testimonials)

- **US6** [P2]: As a marketer, I want to track newsletter signup conversion rates by placement (footer, inline, page) so that I can optimize placement strategy
  - **Acceptance**: Analytics events fired for each signup with `source` parameter (footer, post-inline, dedicated-page), viewable in Google Analytics 4
  - **Independent test**: Subscribe from each placement, verify GA4 events with correct source parameters
  - **Depends on**: US1, US2, US5
  - **Effort**: S (2-4 hours)

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a visitor, I want visual feedback when submitting the form (loading spinner, success animation) so that I know my subscription is processing
  - **Acceptance**: Button shows loading state during submission, success message animates in, form clears after success
  - **Independent test**: Subscribe, verify loading spinner appears, success message fades in smoothly
  - **Depends on**: US1, US2, US5
  - **Effort**: S (2-4 hours - micro-interactions, framer-motion animations)

- **US8** [P3]: As a visitor on mobile, I want Cloudflare Turnstile spam protection so that my email address is protected from bot signups
  - **Acceptance**: Turnstile widget appears before submit, validates user is human, blocks bots
  - **Independent test**: Attempt rapid submissions, verify Turnstile challenge appears
  - **Depends on**: US1
  - **Effort**: M (4-8 hours - Cloudflare Turnstile integration, testing)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US4 first (footer + inline + multi-track + email), validate signup conversion rates, then add US5 (dedicated page) and US6 (analytics) based on feedback.

## Success Metrics (HEART Framework)

> **Purpose**: Define quantified success criteria using Google's HEART framework.
> **Constraint**: All metrics MUST be Claude Code-measurable (SQL, logs, Lighthouse).

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Visitors find signup frictionless | Form validation errors | Error rate <5% | <5 errors per 100 submissions | Validation prevents >90% invalid emails |
| **Engagement** | Newsletter signup forms are visible and used | Form interactions (click, focus) | Interaction rate >15% | >15 interactions per 100 pageviews | <2s form render time |
| **Adoption** | New subscribers join across placements | Newsletter signups | +100 subscribers in 3 months | +100 total, ~8/week | Footer >40%, Inline >30%, Page >30% split |
| **Retention** | Subscribers stay subscribed | Unsubscribe events | <10% monthly churn | <10 unsubscribes per 100 subscribers/month | Preference updates >5/month (engagement signal) |
| **Task Success** | Visitors complete subscription flow | Subscription completions | >85% completion rate | >85 completions per 100 form submissions | <2s API response time (p95) |

**Performance Targets** (from `design/systems/budgets.md`):
- FCP <1.5s, TTI <3.5s, CLS <0.15, LCP <3.0s
- Lighthouse Performance ≥85, Accessibility ≥95
- Newsletter form lazy-loaded (not blocking initial page load)

## Screens Inventory (UI Features Only)

> **Purpose**: Define screens for design workflow.

Screens to design:
1. **footer-newsletter**: Compact signup in site footer - Primary action: "Subscribe"
2. **inline-cta-post**: Persuasive CTA after blog post content - Primary action: "Get Updates"
3. **newsletter-page**: Dedicated `/newsletter` landing page - Primary action: "Subscribe"
4. **preference-management**: `/newsletter/preferences/:token` page - Primary action: "Update Preferences"

States per screen: `default`, `loading`, `success`, `error`, `rate-limited`

Component variants needed:
- **Compact** (footer): Email-only input, minimal copy, "Subscribe" button
- **Inline** (post): Context-aware headline, benefit bullets, newsletter type selector
- **Comprehensive** (dedicated page): Hero section, benefit grid, FAQs, testimonials, full form

## Context Strategy & Signal Design

- **System prompt altitude**: High-level component guidance (placement, variant props, analytics integration)
- **Tool surface**: Read existing NewsletterSignupForm, Grep for footer/layout patterns, Glob component directories
- **Examples in scope**: ≤3 variants (Compact, Inline, Comprehensive) with shared core logic
- **Context budget**: 75k tokens (planning phase) - reuse existing components aggressively
- **Retrieval strategy**: JIT - read existing components on-demand, reference validation schemas
- **Memory artifacts**: NOTES.md updated with placement decisions, component prop schemas
- **Compaction cadence**: Summarize research findings after initial codebase scan
- **Sub-agents**: None (single-agent implementation)

## Requirements

### Functional (testable only)

**Frontend Components**:
- **FR-001**: System MUST render newsletter signup form in site footer on all pages
- **FR-002**: System MUST render inline newsletter CTA after each blog post content
- **FR-003**: System MUST provide dedicated `/newsletter` page with comprehensive signup form
- **FR-004**: System MUST allow users to select 1-4 newsletter types (aviation, dev-startup, education, all) via checkboxes
- **FR-005**: System MUST validate email format client-side before submission
- **FR-006**: System MUST validate at least 1 newsletter type is selected before allowing submission
- **FR-007**: System MUST display loading state during form submission (disabled inputs, loading button text)
- **FR-008**: System MUST display success message after successful subscription
- **FR-009**: System MUST display error messages for validation failures and API errors
- **FR-010**: System MUST clear form inputs after successful subscription

**Backend Integration** (Already Implemented):
- **FR-011**: System MUST call POST `/api/newsletter/subscribe` with {email, newsletterTypes[], source}
- **FR-012**: System MUST handle API error responses (400, 429, 500) gracefully with user-friendly messages
- **FR-013**: System MUST send welcome email asynchronously (fire-and-forget, non-blocking)
- **FR-014**: System MUST generate 64-char hex unsubscribe token for each subscriber
- **FR-015**: System MUST support preference management via `/api/newsletter/preferences/:token` (GET/PATCH)
- **FR-016**: System MUST support one-click unsubscribe via `/api/newsletter/unsubscribe?token=...` (DELETE)

**Analytics**:
- **FR-017**: System MUST track newsletter signup events with `source` parameter (footer, post-inline, dedicated-page)
- **FR-018**: System MUST fire Google Analytics 4 events on signup success
- **FR-019**: System MUST log signup conversion rates by placement to backend logs

### Non-Functional

- **NFR-001**: Performance: Newsletter forms MUST NOT block initial page load (lazy-load below the fold)
- **NFR-002**: Performance: Newsletter API response time MUST be <2s (p95) as per existing implementation
- **NFR-003**: Accessibility: All forms MUST meet WCAG 2.1 AA standards (keyboard navigation, ARIA labels, focus states, 4.5:1 contrast)
- **NFR-004**: Mobile: Forms MUST be fully responsive (single-column on mobile, touch-friendly buttons ≥44px)
- **NFR-005**: Brand: Forms MUST use Navy 900 (#0F172A) + Emerald 600 (#059669) brand colors
- **NFR-006**: Error Handling: All error states MUST display user-friendly messages (no technical jargon, actionable guidance)
- **NFR-007**: Security: Client-side form MUST never expose API keys or secrets
- **NFR-008**: Security: Rate limiting (5 requests/minute per IP) MUST prevent spam submissions
- **NFR-009**: GDPR: Privacy policy link MUST be displayed near all signup forms
- **NFR-010**: GDPR: Unsubscribe link MUST be included in all newsletter emails
- **NFR-011**: GDPR: Preference management page MUST allow users to update or remove subscriptions
- **NFR-012**: SEO: Dedicated `/newsletter` page MUST have proper meta tags (title, description, og:image)

### Key Entities (already implemented)

- **NewsletterSubscriber**: Stores email, active status, subscribedAt, unsubscribedAt, unsubscribeToken (64-char hex), source
- **NewsletterPreference**: Stores subscriberId (FK), newsletterType (enum: aviation, dev-startup, education, all), subscribed (boolean)

Database schema already exists - no migrations needed.

## Deployment Considerations

> **Skip**: No infrastructure changes (cosmetic UI, no env vars, no migrations)

### Platform Dependencies

**Vercel** (marketing/app): None (Next.js app, standard deployment)

**Railway** (API): N/A (API routes within Next.js app)

**Dependencies**: None (all packages already installed: zod, @prisma/client, resend)

### Environment Variables

**New Required Variables**: None (RESEND_API_KEY already configured per tech-stack.md)

**Changed Variables**: None

**Schema Update Required**: No (env-schema.ts already validates RESEND_API_KEY)

### Breaking Changes

**API Contract Changes**: No (no changes to /api/newsletter/* endpoints)

**Database Schema Changes**: No (NewsletterSubscriber + NewsletterPreference tables exist)

**Auth Flow Modifications**: No (no authentication, public signup)

**Client Compatibility**: Backward compatible (new frontend components, existing API unchanged)

### Migration Requirements

**Database Migrations**: No (schema exists)

**Data Backfill**: Not required

**RLS Policy Changes**: No (Supabase RLS not used for newsletter tables)

**Reversibility**: Fully reversible (remove footer/inline components, delete /newsletter page)

### Rollback Considerations

**Standard Rollback**: Yes (3-command rollback via Git revert, no database changes)

**Special Rollback Needs**: None

**Deployment Metadata**: Deploy IDs tracked in specs/051-newsletter-signup/NOTES.md (standard process)

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: SQL queries, structured logs, Google Analytics 4.

### Data Collection

**Analytics Events** (dual instrumentation):
- Google Analytics 4: `gtag('event', 'newsletter_signup', {source: 'footer'|'post-inline'|'dedicated-page'})`
- Structured logs (Claude measurement): `logger.info({ event: 'newsletter.signup', source, email_hash })`
- Database: `NewsletterSubscriber.source` field stores signup origin

**Key Events to Track**:
1. `newsletter.form_view` - User views signup form (Engagement)
2. `newsletter.form_interact` - User interacts with form (click, focus) (Engagement)
3. `newsletter.signup_attempt` - User submits form (Task Success)
4. `newsletter.signup_success` - Subscription completes (Task Success - primary metric)
5. `newsletter.signup_error` - Validation or API error (Happiness - inverse)
6. `newsletter.preference_update` - User updates preferences (Retention signal)
7. `newsletter.unsubscribe` - User unsubscribes (Retention - inverse)

### Measurement Queries

**SQL** (PostgreSQL via Prisma):
```sql
-- Total subscribers by source (Adoption)
SELECT source, COUNT(*) as subscribers
FROM "NewsletterSubscriber"
WHERE active = true
GROUP BY source;

-- Signup conversion rate by source (Task Success)
SELECT
  source,
  COUNT(*) FILTER (WHERE active = true) * 100.0 / NULLIF(COUNT(*), 0) as conversion_rate
FROM "NewsletterSubscriber"
GROUP BY source;

-- Monthly churn rate (Retention)
SELECT
  COUNT(*) FILTER (WHERE "unsubscribedAt" >= NOW() - INTERVAL '30 days') * 100.0 /
  NULLIF(COUNT(*) FILTER (WHERE active = true), 0) as monthly_churn
FROM "NewsletterSubscriber";

-- Preference update activity (Engagement signal)
SELECT COUNT(*) as preference_updates_last_30d
FROM "NewsletterPreference"
WHERE "updatedAt" >= NOW() - INTERVAL '30 days';
```

**Logs** (`logs/metrics/*.jsonl`):
```bash
# Signup success rate by source
grep '"event":"newsletter.signup"' logs/metrics/*.jsonl | \
  jq -r '.source' | sort | uniq -c

# Error rate (Happiness)
grep '"event":"newsletter.signup_error"' logs/metrics/*.jsonl | \
  wc -l

# Conversion rate (signup_success / signup_attempt)
grep '"event":"newsletter.signup_attempt"' logs/metrics/*.jsonl | wc -l
grep '"event":"newsletter.signup_success"' logs/metrics/*.jsonl | wc -l
```

**Google Analytics 4** (via GA4 dashboard):
- Newsletter signup events by source dimension
- Conversion rate: `newsletter_signup` / `newsletter_form_view`
- User journey: Which pages drive most signups

### Experiment Design (A/B Test)

**Not Applicable**: This is a placement rollout, not an A/B test. All three placements (footer, inline, page) will be shipped simultaneously. Success is measured by absolute signup volume and conversion rate by placement, not relative performance.

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers remaining
- [x] Constitution aligned (performance, UX, data, access, brand colors)
- [x] No implementation details (tech stack, APIs, code) - spec is technology-agnostic where possible
- [x] Success criteria measurable and technology-agnostic (user-focused outcomes)

### Conditional: Success Metrics (Required - user tracking needed)
- [x] HEART metrics defined with Claude Code-measurable sources (SQL, logs, GA4)
- [x] Measurement plan documented with specific queries and commands

### Conditional: UI Features (Required - frontend integration)
- [x] All screens identified with states (default, loading, error, success)
- [x] System components from existing code planned (NewsletterSignupForm reuse)

### Conditional: Deployment Impact (Not Required - no infrastructure changes)
- [ ] N/A - No breaking changes, environment variables, or migrations

---

## Assumptions

1. **Resend API key already configured**: RESEND_API_KEY exists in environment (per tech-stack.md)
2. **Newsletter database tables exist**: NewsletterSubscriber + NewsletterPreference tables deployed (per existing API routes)
3. **Multi-track newsletter logic works**: Existing API supports aviation, dev-startup, education, all types (verified in validation-schemas.ts)
4. **Footer component editable**: Site footer can be modified to include compact signup form
5. **Blog post layout supports inline CTAs**: Post content components allow insertion of newsletter CTA after content
6. **Google Analytics 4 already integrated**: GA4 tracking script present, custom events can be fired

All assumptions verified by reading existing codebase.

---

## Out of Scope

**Explicitly NOT included in this feature**:
- ❌ Ghost Members API integration (GitHub issue mentioned as alternative, but Resend is chosen)
- ❌ Mailchimp integration (Resend preferred per tech-stack.md)
- ❌ Comment system (per overview.md: "Defer to social media engagement")
- ❌ User authentication for newsletter (public signup, no login required)
- ❌ Email template design changes (reuse existing welcome email templates)
- ❌ Backend API changes (all endpoints already implemented and functional)
- ❌ Database migrations (schema exists)
- ❌ A/B testing of form variants (measure all placements equally, optimize later)
- ❌ Server-side spam filtering beyond rate limiting (Cloudflare Turnstile is P3/nice-to-have)

---

## Dependencies

**Blocking** (must exist before implementation):
- ✅ NewsletterSignupForm component (components/newsletter/NewsletterSignupForm.tsx) - EXISTS
- ✅ Newsletter API endpoints (/subscribe, /preferences, /unsubscribe) - EXISTS
- ✅ Resend email service integration (lib/newsletter/email-service.ts) - EXISTS
- ✅ Database schema (NewsletterSubscriber, NewsletterPreference) - EXISTS

**Non-blocking** (nice-to-have, can be added later):
- Cloudflare Turnstile API key (P3 - spam protection enhancement)
- Sample newsletter email screenshots (for dedicated /newsletter page)
- Testimonials from early subscribers (for social proof on /newsletter page)

---

## Open Questions

**None** - All critical decisions have reasonable defaults documented in this spec. The implementation team can proceed with:
- Resend for email delivery (already chosen in tech-stack.md)
- Navy 900 + Emerald 600 for brand colors (per constitution.md)
- WCAG 2.1 AA for accessibility (per constitution.md)
- Three placement strategy: footer (compact), inline (persuasive), page (comprehensive)
- Multi-track newsletter types: aviation, dev-startup, education, all (already implemented)
