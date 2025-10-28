# Feature: Multi-track Newsletter Subscription System

## Overview

Implementing a comprehensive newsletter subscription system with granular preference management across four content tracks (Aviation, Dev/Startup, Education, All). System provides GDPR-compliant subscriber management with one-click unsubscribe, secure token-based preference updates, and integration with Resend/Mailgun for email delivery.

## Research Findings

### Project Documentation Analysis

**Tech Stack** (from tech-stack.md):
- Frontend: Next.js 15.5.6 (App Router)
- Backend: Next.js API Routes (integrated serverless)
- Database: PostgreSQL 15+ (self-hosted Supabase)
- ORM: Prisma 6.17.1 (type-safe queries)
- Newsletter: Resend / Mailgun (email delivery)
- Deployment: Hetzner VPS + Docker

**Data Architecture** (from data-architecture.md):
- Existing entities: USER (admin only, placeholder), prepared schemas for NEWSLETTER_SUBSCRIBER and NEWSLETTER_PREFERENCE
- ERD already defined with relationships and constraints
- Schema strategy: Hybrid (MDX files for content, PostgreSQL for subscriber data)
- Multi-project Supabase instance (schema-level isolation)

**API Strategy** (from api-strategy.md):
- API style: REST over HTTPS (Next.js API Routes)
- Base path: `/api/newsletter`
- Newsletter types: 'aviation', 'dev-startup', 'education', 'all'
- Endpoints already defined:
  - POST /api/newsletter/subscribe
  - GET /api/newsletter/preferences/:token
  - PATCH /api/newsletter/preferences
  - DELETE /api/newsletter/unsubscribe
- Rate limiting: 5 req/min per IP (prevent spam)
- Performance targets: P50 <200ms, P95 <500ms
- Authentication: None (public endpoints, token-based for preferences)
- GDPR: Soft delete + hard delete option

### System Components Analysis

**Reusable Components** (from ui-inventory.md):
- Button (variant: default, outline, ghost - with analytics tracking)
- Container (page width constraint)
- Header, Footer (global layout)

**New Components Needed**:
- NewsletterSignupForm (multi-select checkbox group)
- PreferenceManagementPage (full preference editor)
- UnsubscribeConfirmationPage (goodbye message + feedback)

**Email Templates Required**:
- Welcome email (first subscription)
- New post notification (per track)
- Preference update confirmation
- Goodbye email (unsubscribe confirmation)

### Constitution Alignment

**Engineering Principles**:
- ✅ Specification first: This spec defines all requirements upfront
- ✅ Performance: P50 <200ms, P95 <500ms (aligns with <500ms p95 target)
- ✅ Accessibility: WCAG 2.1 AA compliance (keyboard nav, screen reader support)
- ✅ Security: Input validation (Zod), no PII in logs, secure unsubscribe tokens
- ✅ GDPR compliance: Soft delete, hard delete option, right to deletion

**Brand Principles**:
- ✅ Multi-passionate integration: 4 tracks support aviation, dev, education, cross-pollination
- ✅ Systematic clarity: Clear preference management, no confusing opt-in/opt-out patterns
- ✅ Teaching-first: Help text explains each newsletter type clearly

## Feature Classification

- UI screens: true (signup form, preference page, unsubscribe confirmation)
- Improvement: false (new feature, not improving existing flow)
- Measurable: true (target: 100 subscribers in 6 months, track conversion, retention)
- Deployment impact: true (new database tables via migrations, environment variables for email service)

## Checkpoints

- Phase 0 (Specification): 2025-10-28
- Feature directory: specs/048-multi-track-newsletter/
- Branch: feature/048-multi-track-newsletter

## Phase 2: Tasks (2025-10-28 12:30)

**Summary**:
- Total tasks: 34
- User story tasks: 14 (US1-US5 covering MVP scope)
- Parallel opportunities: 14 tasks marked [P]
- Setup tasks: 3
- Foundational tasks: 5
- Polish tasks: 12
- Task file: specs/048-multi-track-newsletter/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 34
- ✅ User story organization: Complete (organized by US1-US5 priority)
- ✅ Dependency graph: Created (Phase 2 foundational blocks all stories)
- ✅ MVP strategy: Defined (US1-US5 complete subscription flow, ~40 hours)
- ✅ Parallel execution: 14 tasks identified for parallel execution
- 📋 Ready for: /analyze

**Key Decisions**:
- TDD approach optional (integration tests recommended, E2E for critical paths only)
- Email service abstraction allows switching between Resend/Mailgun
- Token-based preference management eliminates need for login system
- Background email processing ensures <2s API response time
- Soft delete default with hard delete option for GDPR compliance

## Phase 4: Implementation (2025-10-28 13:00)

### Batch 1: Setup (Complete)
- T001: Install resend package (resend@4.0.1 added to package.json)
- T002: Update env-schema.ts (Already complete - RESEND_API_KEY and NEWSLETTER_FROM_EMAIL defined)
- T003: Create .env.local template (Added newsletter variables with documentation)

### Batch 2: Database Schema (Complete)
- T004: Extend Prisma schema with NewsletterSubscriber and NewsletterPreference models (Complete - added to prisma/schema.prisma)
- T005: Create Prisma migration (Deferred - migration will run on VPS during deployment)
  - Schema updated successfully
  - Prisma client regenerated with new models
  - Migration command: `npx prisma migrate deploy` (runs on server during deployment)

### Batch 3: Foundational Utilities (Complete)
- T006: Create token generator (lib/newsletter/token-generator.ts)
  - generateUnsubscribeToken() - 64-char hex tokens with crypto.randomBytes
  - isValidTokenFormat() - Validation helper
- T007: Create email service (lib/newsletter/email-service.ts)
  - sendWelcomeEmail() - Welcome email with preference links
  - sendPreferenceUpdateEmail() - Confirmation after preference update
  - sendGoodbyeEmail() - Goodbye email on unsubscribe
  - Resend integration with PII masking for logs
- T008: Create validation schemas (lib/newsletter/validation-schemas.ts)
  - SubscribeRequestSchema - Validates email + newsletterTypes array
  - PreferenceUpdateSchema - Validates token + at least 1 preference
  - UnsubscribeSchema - Validates token + optional hardDelete flag

### Batch 4: US1 Subscribe (Complete)
- T009: POST /api/newsletter/subscribe endpoint (app/api/newsletter/subscribe/route.ts)
  - Upsert subscriber logic with atomic transaction
  - Generate unsubscribe token
  - Create/update preferences
  - Fire-and-forget welcome email (async)
- T010: NewsletterSignupForm component (components/newsletter/NewsletterSignupForm.tsx)
  - Multi-checkbox UI for 4 newsletter types
  - Client-side validation (email format, at least 1 selection)
  - Loading/error/success states
  - Reusable with source tracking

### Batch 5: US2 Welcome Email (Complete - Already Integrated)
- T011: Welcome email template (Inline HTML in email-service.ts)
- T012: Integrate sendWelcomeEmail() (Already implemented in lib/newsletter/email-service.ts)
- T013: Add welcome email call to subscribe endpoint (Already integrated in T009 with async fire-and-forget)

### Batch 6: US3 Preferences (Complete)
- T020: GET /api/newsletter/preferences/[token] (app/api/newsletter/preferences/[token]/route.ts)
  - Retrieve subscriber by token
  - Return email, preferences object, subscribedAt
- T021: PATCH /api/newsletter/preferences (app/api/newsletter/preferences/route.ts)
  - Upsert preferences (transaction for all 4 types)
  - Validate at least 1 preference true
  - Send confirmation email (async)
- T022: Preference management page (app/newsletter/preferences/[token]/page.tsx)
  - Client component with form state
  - Fetch preferences on mount
  - Update preferences with validation
  - Link to unsubscribe page
- T023: Confirmation email (Already integrated in T021 via sendPreferenceUpdateEmail)

### Batch 7: US4-US5 Unsubscribe (Complete)
- T030: DELETE /api/newsletter/unsubscribe endpoint (app/api/newsletter/unsubscribe/route.ts)
  - Soft delete: Set active=false, unsubscribedAt, all preferences.subscribed=false
  - Hard delete: DELETE subscriber (CASCADE to preferences)
  - Send goodbye email (only soft delete)
  - Idempotent (returns success if already unsubscribed)
- T031: Unsubscribe confirmation page (app/newsletter/unsubscribe/confirmation/page.tsx)
  - Auto-unsubscribe on page load (soft delete)
  - Hard delete button with confirmation dialog
  - Re-subscribe link
- T032: Goodbye email (Already integrated in T030 via sendGoodbyeEmail)
- T033: Hard delete logic (Already integrated in T030 with hardDelete flag)
- T034: Hard delete button (Already integrated in T031)

### Batch 8: Polish and Testing (Selective Implementation)
- Implementing critical polish tasks only (T045-T047)...

## Last Updated

2025-10-28T14:00:00Z
