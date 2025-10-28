# Tasks: Multi-Track Newsletter Subscription System

## [CODEBASE REUSE ANALYSIS]

Scanned: D:\Coding\marcusgoll (Next.js 15.5.6 + Prisma 6.17.1 + PostgreSQL)

**[EXISTING - REUSE]**
- ✅ lib/prisma.ts - Prisma client with connection pooling
- ✅ lib/env-schema.ts - Environment variable schema (EnvironmentVariables interface)
- ✅ app/api/health/route.ts - API route pattern with error handling and env validation
- ✅ components/ui/Button.tsx - Button component with variants (default, outline, ghost)
- ✅ components/ui/Container.tsx - Page width constraint wrapper
- ✅ prisma/schema.prisma - Existing schema (User model) to extend

**[NEW - CREATE]**
- 🆕 lib/newsletter/token-generator.ts - Secure 64-char hex token generation (Node.js crypto)
- 🆕 lib/newsletter/email-service.ts - Resend/Mailgun abstraction layer
- 🆕 lib/newsletter/validation-schemas.ts - Zod schemas for newsletter API requests
- 🆕 components/newsletter/NewsletterSignupForm.tsx - Multi-checkbox signup form
- 🆕 app/api/newsletter/subscribe/route.ts - POST endpoint (create/update subscriber)
- 🆕 app/api/newsletter/preferences/[token]/route.ts - GET endpoint (retrieve preferences)
- 🆕 app/api/newsletter/preferences/route.ts - PATCH endpoint (update preferences)
- 🆕 app/api/newsletter/unsubscribe/route.ts - DELETE endpoint (soft/hard delete)
- 🆕 app/newsletter/preferences/[token]/page.tsx - Preference management page
- 🆕 app/newsletter/unsubscribe/confirmation/page.tsx - Unsubscribe confirmation page

---

## [DEPENDENCY GRAPH]

Story completion order:
1. Phase 1: Setup (install deps, env config)
2. Phase 2: Foundational (database schema, utilities, email service) - BLOCKS all user stories
3. Phase 3: US1 [P1] - Subscribe to newsletters (MVP core) - Independent
4. Phase 4: US2 [P1] - Welcome email - Depends on US1 (needs subscriber + email service)
5. Phase 5: US3 [P1] - Manage preferences - Depends on US1 (needs token authentication)
6. Phase 6: US4 [P1] - Unsubscribe - Depends on US1, US3 (needs soft delete logic)
7. Phase 7: US5 [P1] - Hard delete (GDPR) - Depends on US4 (extends unsubscribe)
8. Phase 8: Polish & Cross-Cutting Concerns

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 2 Foundational**: T005, T006, T007 (different files, no dependencies)
- **Phase 3 US1**: T010, T011, T012, T013 (API route + form component can be developed in parallel after T008-T009 complete)
- **Phase 5 US3**: T020, T021 (GET and PATCH endpoints, different files)
- **Phase 8 Polish**: T040, T041, T042 (error handling, health checks, analytics - independent)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phases 1-7 (US1-US5 complete subscription flow)

**Incremental Delivery**:
- Phase 1-2 → Local validation (setup complete)
- Phase 3-4 → Staging validation (signup + welcome email working)
- Phase 5 → Staging validation (preference management working)
- Phase 6-7 → Staging validation (unsubscribe + GDPR delete working)
- Phase 8 → Production (polish + monitoring)

**Testing Approach**: Integration testing recommended (E2E for critical paths only, no comprehensive unit tests unless explicitly requested)

---

## Phase 1: Setup

- [ ] T001 Install newsletter dependencies in package.json
  - Packages: resend@^4.0.0 (email service)
  - Verify: Check package.json after install
  - Pattern: Existing dependencies in package.json
  - From: plan.md [ARCHITECTURE DECISIONS]

- [ ] T002 [P] Update environment variable schema in lib/env-schema.ts
  - Add: RESEND_API_KEY (string, required), NEWSLETTER_FROM_EMAIL (string, email format, required)
  - Validation: Zod schema for email format
  - REUSE: Existing EnvironmentVariables interface pattern
  - From: plan.md [CI/CD IMPACT], spec.md Deployment Considerations

- [ ] T003 [P] Create .env.local template with newsletter variables
  - Variables: RESEND_API_KEY, NEWSLETTER_FROM_EMAIL (with example values)
  - Document: Add comments explaining staging vs production keys
  - Pattern: Existing .env.local structure
  - From: plan.md [CI/CD IMPACT]

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Infrastructure that blocks all user stories

### Database Schema

- [ ] T004 Extend Prisma schema with NewsletterSubscriber and NewsletterPreference models
  - File: prisma/schema.prisma
  - Models: NewsletterSubscriber (8 fields), NewsletterPreference (6 fields)
  - Relationships: Subscriber 1:N Preferences (onDelete: Cascade)
  - Indexes: 5 total (email, active, token, subscriber_id, newsletter_type+subscribed)
  - REUSE: Existing schema.prisma structure (User model pattern)
  - Pattern: data-model.md Prisma Schema Definition
  - From: data-model.md entities

- [ ] T005 Create Prisma migration for newsletter tables
  - Command: npx prisma migrate dev --name add_newsletter_tables
  - Migration: Creates newsletter_subscribers and newsletter_preferences tables
  - Verify: Check migration.sql for correct constraints (UNIQUE email, UNIQUE token, UNIQUE(subscriber_id, newsletter_type))
  - Pattern: Existing Prisma migrations in prisma/migrations/
  - From: plan.md [DATA MODEL], spec.md Migration Requirements

### Utilities & Services

- [ ] T006 [P] Create secure token generator in lib/newsletter/token-generator.ts
  - Function: generateUnsubscribeToken() → string (64-char hex)
  - Logic: crypto.randomBytes(32).toString('hex')
  - Test: Verify output length = 64, hex format
  - Pattern: Node.js crypto built-in module
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md FR-004

- [ ] T007 [P] Create email service abstraction in lib/newsletter/email-service.ts
  - Functions: sendWelcomeEmail(), sendPreferenceUpdateEmail(), sendGoodbyeEmail()
  - Service: Resend client initialization with API key
  - Error handling: Graceful fallback, log failures, return success/failure
  - Pattern: Service pattern with client initialization
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], plan.md [ARCHITECTURE DECISIONS]

- [ ] T008 [P] Create Zod validation schemas in lib/newsletter/validation-schemas.ts
  - Schemas: SubscribeRequestSchema, PreferenceUpdateSchema, UnsubscribeSchema
  - Validation: Email format (RFC 5322), newsletterTypes array (min 1, max 4), token (64-char hex)
  - Export: Named exports for each schema
  - REUSE: Zod pattern from lib/env-schema.ts
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], contracts/api.yaml

---

## Phase 3: User Story 1 [P1] - Subscribe to newsletters

**Story Goal**: Visitors can subscribe to specific newsletter tracks (aviation, dev-startup, education, or all)

**Independent Test Criteria** (from spec.md US1):
- [ ] User submits valid signup form → subscriber created in database with unique token
- [ ] User submits form with duplicate email → preferences updated (upsert)
- [ ] User submits form without selecting newsletters → 400 error with validation message
- [ ] User submits invalid email format → 400 error with validation message

### Implementation

- [ ] T009 Create POST /api/newsletter/subscribe endpoint in app/api/newsletter/subscribe/route.ts
  - Request: { email, newsletterTypes[], source? }
  - Response: { success, message, unsubscribeToken }
  - Logic: Validate request → upsert subscriber → create/update preferences → queue welcome email → return token
  - Database: Transaction for subscriber + preferences (atomic)
  - Validation: Use SubscribeRequestSchema from lib/newsletter/validation-schemas.ts
  - Error Handling: Return 400 for validation errors, 500 for database/email errors
  - REUSE: Prisma client (lib/prisma.ts), Env schema validation pattern
  - Pattern: app/api/health/route.ts (API route structure, error handling)
  - From: contracts/api.yaml /newsletter/subscribe, spec.md FR-001 to FR-006

- [ ] T010 [P] Create NewsletterSignupForm component in components/newsletter/NewsletterSignupForm.tsx
  - UI: Email input + 4 checkboxes (aviation, dev-startup, education, all) + submit button
  - Validation: Client-side validation (email format, at least 1 checkbox selected)
  - State: email, newsletterTypes[], loading, error, success
  - API Call: POST /api/newsletter/subscribe on form submit
  - Error States: Display validation errors, API errors, success message
  - REUSE: Button component (components/ui/Button.tsx)
  - Pattern: React form with useState, async fetch
  - From: spec.md US1 acceptance criteria, plan.md [NEW INFRASTRUCTURE - CREATE]

---

## Phase 4: User Story 2 [P1] - Welcome email

**Story Goal**: Subscribers receive welcome email within 30 seconds with preference management link

**Independent Test Criteria** (from spec.md US2):
- [ ] Signup completed → welcome email sent within 30 seconds
- [ ] Email includes list of subscribed newsletters
- [ ] Email includes "Manage preferences" link with token
- [ ] Email includes "Unsubscribe" link with token

### Implementation

- [ ] T011 Create welcome email template in emails/WelcomeEmail.tsx (or inline HTML in email-service.ts)
  - Content: Greeting, selected newsletters list, preference link, unsubscribe link
  - Links: https://marcusgoll.com/newsletter/preferences/{token}, https://marcusgoll.com/newsletter/unsubscribe?token={token}
  - Styling: Inline CSS, brand colors (systematic clarity tone)
  - Pattern: Resend React Email template (if using React Email) OR plain HTML string
  - From: spec.md US2 acceptance criteria, plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T012 Integrate welcome email into sendWelcomeEmail() function in lib/newsletter/email-service.ts
  - Parameters: email, subscribedNewsletters[], unsubscribeToken
  - Send: Use Resend client to send email
  - Error Handling: Log email failures, don't throw (background processing)
  - Response: Return { success: boolean, error?: string }
  - From: spec.md FR-005, plan.md [ARCHITECTURE DECISIONS]

- [ ] T013 Add welcome email call to POST /api/newsletter/subscribe endpoint
  - Logic: After subscriber created → call sendWelcomeEmail() asynchronously (don't block response)
  - Background: Use Promise.resolve() or background queue (simple: fire-and-forget)
  - Response Time: Ensure <2s API response (NFR-002)
  - From: spec.md NFR-002, plan.md [PERFORMANCE TARGETS]

---

## Phase 5: User Story 3 [P1] - Manage preferences

**Story Goal**: Subscribers can update newsletter preferences via secure token link (no login required)

**Independent Test Criteria** (from spec.md US3):
- [ ] Token URL loads preference page → displays email (read-only) and 4 checkboxes with current state
- [ ] User updates checkboxes and submits → database updated with new preferences
- [ ] User tries to uncheck all newsletters → validation error (at least 1 required)
- [ ] Preferences updated → confirmation email sent

### Implementation

- [ ] T020 [P] Create GET /api/newsletter/preferences/[token] endpoint in app/api/newsletter/preferences/[token]/route.ts
  - Parameters: token (path param, 64-char hex)
  - Query: Find subscriber by unsubscribe_token, include preferences
  - Response: { success, email, preferences: { aviation, dev-startup, education, all }, subscribedAt }
  - Error Handling: 404 if token not found, 400 if invalid token format
  - REUSE: Prisma client (lib/prisma.ts)
  - Pattern: app/api/health/route.ts (API route structure)
  - From: contracts/api.yaml /newsletter/preferences/{token}, spec.md FR-007 to FR-008

- [ ] T021 [P] Create PATCH /api/newsletter/preferences endpoint in app/api/newsletter/preferences/route.ts
  - Request: { token, preferences: { aviation, dev-startup, education, all } }
  - Validation: At least 1 preference must be true (FR-011)
  - Logic: Find subscriber → update preference rows → send confirmation email
  - Response: { success, message }
  - Error Handling: 400 if all preferences false, 404 if token not found
  - REUSE: Prisma client, PreferenceUpdateSchema
  - Pattern: app/api/health/route.ts
  - From: contracts/api.yaml /newsletter/preferences, spec.md FR-009 to FR-011

- [ ] T022 Create preference management page in app/newsletter/preferences/[token]/page.tsx
  - UI: Display email (read-only), 4 checkboxes (aviation, dev-startup, education, all), update button
  - Data Fetching: Server Component - call GET /api/newsletter/preferences/[token] on page load
  - Form: Client Component for form state and PATCH submission
  - States: loading, error (token invalid), success (preferences updated)
  - REUSE: Button component (components/ui/Button.tsx), Container component (components/ui/Container.tsx)
  - Pattern: Next.js 15 App Router Server Component + Client Component composition
  - From: spec.md US3 acceptance criteria, plan.md [STRUCTURE]

- [ ] T023 Create preference update confirmation email in lib/newsletter/email-service.ts
  - Function: sendPreferenceUpdateEmail(email, updatedNewsletters[], token)
  - Content: Confirmation message, new preferences list, preference link
  - Integration: Call from PATCH /api/newsletter/preferences endpoint after update
  - From: spec.md FR-010, plan.md [NEW INFRASTRUCTURE - CREATE]

---

## Phase 6: User Story 4 [P1] - Unsubscribe

**Story Goal**: Subscribers can unsubscribe from all newsletters with one click (soft delete)

**Independent Test Criteria** (from spec.md US4):
- [ ] User clicks unsubscribe link → subscriber.active set to false, all preferences set to false
- [ ] Unsubscribe confirmation page displays success message
- [ ] Goodbye email sent after unsubscribe
- [ ] User can request hard delete from confirmation page

### Implementation

- [ ] T030 Create DELETE /api/newsletter/unsubscribe endpoint in app/api/newsletter/unsubscribe/route.ts
  - Request: { token, hardDelete?: boolean }
  - Logic (soft delete): Set subscriber.active = false, unsubscribed_at = NOW(), all preferences.subscribed = false
  - Logic (hard delete): DELETE subscriber record (CASCADE to preferences)
  - Email: Send goodbye email (only if soft delete)
  - Response: { success, message }
  - Idempotent: If already unsubscribed, return success (no error)
  - REUSE: Prisma client, UnsubscribeSchema
  - Pattern: app/api/health/route.ts
  - From: contracts/api.yaml /newsletter/unsubscribe, spec.md FR-012 to FR-014

- [ ] T031 Create unsubscribe confirmation page in app/newsletter/unsubscribe/confirmation/page.tsx
  - UI: Success message, "Delete my data" link (GDPR)
  - Query Params: token (from unsubscribe link)
  - Action: Call DELETE /api/newsletter/unsubscribe with hardDelete=false on load
  - GDPR Link: Button to call DELETE /api/newsletter/unsubscribe with hardDelete=true
  - REUSE: Button, Container components
  - Pattern: Next.js App Router page with useSearchParams
  - From: spec.md US4 acceptance criteria, plan.md [STRUCTURE]

- [ ] T032 Create goodbye email in lib/newsletter/email-service.ts
  - Function: sendGoodbyeEmail(email, token)
  - Content: Goodbye message, optional feedback survey link, re-subscribe link
  - Integration: Call from DELETE /api/newsletter/unsubscribe endpoint (soft delete only)
  - From: spec.md FR-015, plan.md [NEW INFRASTRUCTURE - CREATE]

---

## Phase 7: User Story 5 [P1] - Hard delete (GDPR)

**Story Goal**: Users can permanently delete their data (GDPR right to deletion)

**Independent Test Criteria** (from spec.md US5):
- [ ] User clicks "Delete my data" → subscriber record deleted from database (CASCADE to preferences)
- [ ] Confirmation page displays "Your data has been permanently deleted"
- [ ] Email address can be used to re-subscribe (no existing record found)

### Implementation

- [ ] T033 Add hard delete logic to DELETE /api/newsletter/unsubscribe endpoint
  - Check: If hardDelete=true in request body
  - Logic: Prisma delete (CASCADE removes preferences automatically via onDelete: Cascade)
  - Response: { success, message: "Your data has been permanently deleted" }
  - No Email: Hard delete does not send goodbye email (user requested deletion)
  - From: spec.md FR-016 to FR-017, spec.md US5 acceptance criteria

- [ ] T034 Add hard delete button to unsubscribe confirmation page
  - UI: "Delete my data permanently" button
  - Action: Call DELETE /api/newsletter/unsubscribe with hardDelete=true
  - Confirmation: Show success message after deletion
  - From: spec.md US5 acceptance criteria

---

## Phase 8: Polish & Cross-Cutting Concerns

### Error Handling & Resilience

- [ ] T040 Add rate limiting middleware to newsletter API routes
  - Rate Limit: 5 requests per minute per IP address (NFR-011)
  - Implementation: Simple in-memory rate limiter or use next-rate-limit package
  - Response: 429 Too Many Requests with retry-after header
  - Apply To: All /api/newsletter/* endpoints
  - From: spec.md NFR-011, spec.md Edge Cases

- [ ] T041 [P] Add email masking to logs in lib/newsletter/email-service.ts
  - Logic: Mask email in logs as r***@example.com (show first char + domain)
  - Apply: All logger.info/error calls with email parameter
  - From: spec.md NFR-009, plan.md [SECURITY]

- [ ] T042 [P] Add PII masking utility in lib/newsletter/pii-utils.ts
  - Function: maskEmail(email: string) → string (r***@example.com format)
  - Use: Import in email-service.ts and API routes for logging
  - From: spec.md NFR-009

### Deployment Preparation

- [ ] T045 Update /api/health endpoint to check newsletter environment variables
  - Check: RESEND_API_KEY or MAILGUN_API_KEY configured
  - Check: NEWSLETTER_FROM_EMAIL configured
  - Response: Include newsletter config status in health check
  - REUSE: Existing app/api/health/route.ts
  - From: plan.md [CI/CD IMPACT], spec.md Deployment Considerations

- [ ] T046 [P] Create smoke test script for newsletter signup flow
  - Script: .github/workflows/smoke-test-newsletter.sh
  - Test: POST /api/newsletter/subscribe with test email → expect 200 response
  - Verify: Check database for subscriber record (optional)
  - Pattern: plan.md [CI/CD IMPACT] smoke test example
  - From: plan.md [CI/CD IMPACT]

- [ ] T047 [P] Document rollback procedure in NOTES.md
  - Rollback: Standard 3-command rollback (SSH → git revert → rebuild)
  - Migration Rollback: DROP TABLE newsletter_preferences, newsletter_subscribers;
  - Feature Flag: NEXT_PUBLIC_NEWSLETTER_ENABLED=false (future enhancement)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

### UI Integration

- [ ] T050 Integrate NewsletterSignupForm into homepage footer
  - Location: app/(home)/page.tsx or app/layout.tsx footer
  - Placement: Above existing footer links, inside Container
  - Styling: Match existing footer design (Tailwind CSS)
  - From: spec.md User Scenarios (signup form in footer)

- [ ] T051 [P] Add newsletter signup CTA to blog post pages (optional)
  - Location: End of blog post content
  - Component: Reuse NewsletterSignupForm with source="post-cta"
  - Analytics: Track signup source in database
  - From: spec.md User Story US7 (analytics by source)

### Testing & Validation

- [ ] T055 Manual integration test: Full signup flow
  - Test: Homepage → signup form → submit → verify database → check email inbox
  - Verify: Subscriber record created, preferences created, welcome email received
  - Verify: Preference link works, unsubscribe link works
  - From: plan.md [DEPLOYMENT ACCEPTANCE] staging smoke tests

- [ ] T056 Manual integration test: Preference management flow
  - Test: Click "Manage preferences" → update selections → submit → verify database
  - Verify: Preferences updated, confirmation email received
  - From: plan.md [DEPLOYMENT ACCEPTANCE] staging smoke tests

- [ ] T057 Manual integration test: Unsubscribe and hard delete flow
  - Test: Click "Unsubscribe" → verify soft delete → click "Delete my data" → verify hard delete
  - Verify: Subscriber.active=false (soft), subscriber deleted (hard), can re-subscribe
  - From: plan.md [DEPLOYMENT ACCEPTANCE] staging smoke tests

---

## Task Summary

**Total Tasks**: 34

**Breakdown by Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 5 tasks
- Phase 3 (US1 - Subscribe): 2 tasks
- Phase 4 (US2 - Welcome email): 3 tasks
- Phase 5 (US3 - Manage preferences): 4 tasks
- Phase 6 (US4 - Unsubscribe): 3 tasks
- Phase 7 (US5 - Hard delete): 2 tasks
- Phase 8 (Polish): 12 tasks

**Breakdown by Type**:
- Database: 2 tasks (schema, migration)
- Backend API: 8 tasks (4 endpoints + 4 email integrations)
- Frontend: 4 tasks (2 components, 2 pages)
- Utilities: 4 tasks (token generator, email service, validation schemas, PII utils)
- Infrastructure: 7 tasks (env setup, health checks, smoke tests, rate limiting)
- Testing: 3 tasks (manual integration tests)
- Deployment: 3 tasks (rollback docs, monitoring, UI integration)
- Documentation: 3 tasks (NOTES.md updates, rollback procedure)

**Estimated Hours**: ~48-60 hours (MVP scope: Phase 1-7 = ~40 hours, Polish: Phase 8 = ~12 hours)

**Parallel Opportunities**: 11 tasks marked [P] (can run in parallel within their phase)
