# Feature: Contact Form (Serverless)

## Overview

Serverless contact form using Next.js API routes to handle message submissions from site visitors. Integrates with Resend email service (already configured) for delivery. Includes spam protection via Cloudflare Turnstile and comprehensive form validation using Zod.

## Research Findings

### Existing Infrastructure
- **Email Service**: Resend already integrated (lib/newsletter/email-service.ts)
- **API Pattern**: Established pattern in app/api/newsletter/subscribe/route.ts
- **Validation**: Zod already in package.json v4.1.12
- **Tech Stack**: Next.js 16.0.1 with App Router, React 19, TypeScript

### System Components

From system-architecture.md:
- **Platform**: Next.js full-stack monolith on self-hosted Hetzner VPS
- **Database**: PostgreSQL via self-hosted Supabase (optional for contact form, can store messages)
- **Email**: Resend API (RESEND_API_KEY environment variable)
- **Deployment**: Docker containers with Caddy reverse proxy

### Email Service Analysis

Existing email-service.ts provides:
- Resend client initialization with error handling
- Email masking for PII protection
- Environment variable management (RESEND_API_KEY, NEWSLETTER_FROM_EMAIL, PUBLIC_URL)
- Structured HTML email templates
- Success/failure result interfaces

**Pattern to follow**: Create similar service for contact form emails.

### API Route Pattern

From newsletter/subscribe/route.ts:
- POST handler with NextRequest/NextResponse
- Zod schema validation
- Rate limiting considerations
- Structured JSON responses: `{success: boolean, message: string, data?: {}}`
- Error handling with appropriate HTTP status codes

### Spam Protection Options

1. **Cloudflare Turnstile** (Recommended):
   - Free tier available
   - Privacy-friendly (GDPR compliant)
   - Invisible challenge mode
   - Better UX than reCAPTCHA
   - Requires NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY

2. **Honeypot Field**:
   - Simple, no external service
   - Hidden field that bots fill but humans don't
   - Low-friction for users
   - Should be used in addition to Turnstile

### Rate Limiting Strategy

Options:
1. **In-memory store** (simple, single-server):
   - Map of IP → timestamp array
   - Limit: 3 submissions per 15 minutes per IP
   - Resets on server restart (acceptable for contact form)

2. **Redis** (future, if needed):
   - Persistent rate limiting
   - Shared across multiple servers
   - Overkill for current single-VPS setup

**Decision**: Use in-memory rate limiting (simple, fits current architecture).

## Feature Classification

- **UI screens**: true (contact form page, success/error states)
- **Improvement**: false (new feature, not improving existing flow)
- **Measurable**: false (internal tool, no complex user tracking needed)
- **Deployment impact**: true (new environment variables, API route)

## Key Decisions

1. **Email Service**: Reuse existing Resend integration (lib/newsletter/email-service.ts) - no new service needed, just add contact-specific email templates
2. **Spam Protection**: Cloudflare Turnstile (invisible mode) + honeypot field - better UX than reCAPTCHA, GDPR compliant, free tier sufficient
3. **Rate Limiting**: In-memory rate limiter (3 submissions per 15 minutes) - matches newsletter pattern, suitable for single-VPS architecture
4. **Message Storage**: MVP uses email-only (no database) - faster to implement, can add database storage in US6 if needed later
5. **Subject Dropdown**: Predefined options help Marcus triage - "Aviation Consulting", "Dev/Startup Collaboration", "CFI Training", "Speaking Request", "General", "Other"
6. **Minimum Message Length**: 500 characters - prevents low-effort spam while allowing meaningful messages
7. **Auto-Reply**: Yes - confirms delivery and sets expectations ("2-3 business days response time")
8. **Progressive Enhancement**: Form works without JavaScript (basic HTML submission) - accessibility and SEO benefit

## Artifacts Created

- specs/054-contact-form-serverless/spec.md - Full specification with 20 requirements, 7 user stories, success criteria
- specs/054-contact-form-serverless/NOTES.md - Research findings and key decisions

## Checkpoints

- Phase 0 (Specification): 2025-10-29

## Last Updated

2025-10-29T08:45:00Z
- specs/054-contact-form-serverless/research.md - Research decisions + component reuse analysis (8 reusable, 7 new)
- specs/054-contact-form-serverless/plan.md - Consolidated architecture + design + integration scenarios
- specs/054-contact-form-serverless/error-log.md - Initialized for error tracking during implementation

## Phase 1 Summary (Planning)

- **Research Depth**: 305 lines of research documentation
- **Key Decisions**: 8 (email service reuse, rate limiter reuse, Zod validation, Turnstile spam protection, email-only MVP, progressive enhancement, Tailwind + Radix UI, Next.js API route pattern)
- **Components to Reuse**: 8 (email service, rate limiter, validation schemas, API route pattern, UI components, env vars, globals.css, Next.js infrastructure)
- **New Components**: 7 (contact API endpoint, validation schema, Turnstile verifier, email templates, contact page, form component, .env.example updates)
- **Migration Needed**: No (email-only MVP, no database changes)
- **Deployment Impact**: Additive only (new endpoint /api/contact, new page /contact, 3 new env vars)
- **Architecture Alignment**: 100% aligned with project docs (monolith, direct-prod, VPS, REST API, Zod validation, Resend email)

- Phase 1 (Planning): 2025-10-29
  - Artifacts: research.md (305 lines), plan.md (comprehensive architecture), error-log.md (initialized)
  - Research decisions: 8 (all grounded in existing code or spec requirements)
  - Reuse opportunities: 8 components identified and documented
  - New infrastructure: 7 components specified with detailed implementation notes
  - Migration required: No (email-only storage for MVP)

## Phase 2: Tasks (2025-10-29)

**Summary**:
- Total tasks: 29
- User story tasks: 12 (organized by priority P1, P2)
- Parallel opportunities: 15 tasks marked [P]
- Setup tasks: 4
- Foundational tasks: 3
- Task file: specs/054-contact-form-serverless/tasks.md

**Task Breakdown by Phase**:
- Phase 1 (Setup): 4 tasks - Project structure, dependencies, environment variables
- Phase 2 (Foundational): 3 tasks - Validation schema, Turnstile verifier, email templates
- Phase 3 (US1 - Core Form): 3 tasks - API endpoint, contact page, form component
- Phase 4 (US2 - Spam Protection): 3 tasks - Turnstile widget, honeypot field, verification
- Phase 5 (US3 - Validation UX): 3 tasks - Client validation, char counter, success/error states
- Phase 6 (US4 - Rate Limiting): 2 tasks - Rate limiter integration, subject dropdown
- Phase 7 (US5 - Auto-Reply): 1 task - Auto-reply email integration
- Phase 8 (Polish): 10 tasks - Error handling, retry logic, analytics, health check, docs

**MVP Strategy**:
- MVP Scope: Phases 1-5 (US1, US2, US3) - 16 tasks, 12-14 hours estimated
- Enhancement Scope: Phases 6-8 (US4, US5, Polish) - 13 tasks, 6-8 hours estimated
- Total Effort: 18-22 hours

**Reuse Opportunities**:
- 8 existing components identified (email service, rate limiter, validation patterns, API route, UI components, env vars, analytics, env validation)
- 7 new components to create (contact API, Turnstile verifier, validation schema, email templates, contact page, form component, Turnstile widget)

**Checkpoint**:
- ✅ Tasks generated: 29
- ✅ User story organization: Complete (US1-US5)
- ✅ Dependency graph: Created (8-phase sequential with parallel opportunities)
- ✅ MVP strategy: Defined (Phases 1-5 only for first release)
- 📋 Ready for: /analyze

**Commit**: bcaafe3 - Tasks committed successfully

## Phase 4: Implementation (2025-10-29)

**Batch 1 (Setup) - COMPLETED**:
- T001: Created project structure (app/api/contact/, app/contact/, lib/contact/, components/contact/)
- T002: Skipped Turnstile npm package (loaded via CDN script tag instead)
- T003: Updated .env.example with NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, CONTACT_ADMIN_EMAIL (with detailed setup instructions)
- T004: Updated lib/env-schema.ts with Turnstile environment variable validation and types

**Key Decisions**:
- Turnstile integration: No npm package needed - using CDN script tag (https://challenges.cloudflare.com/turnstile/v0/api.js)
- Environment variables: Added comprehensive documentation in .env.example with setup steps for Cloudflare dashboard
- Type safety: Updated EnvironmentVariables interface, ENV_CATEGORIES, ENV_REQUIREMENTS, ENV_ACCESS, and ENV_METRICS

**Batch 2 (Foundational) - COMPLETED**:
- T005: Created lib/contact/validation-schema.ts (Zod schema with 6 subject options, 500-10K char message requirement, honeypot field)
- T006: Created lib/contact/turnstile-verifier.ts (async verification with 5s timeout, error handling, configuration check)
- T007: Created lib/contact/email-templates.ts (admin notification + auto-reply templates with HTML/text, XSS escaping)

**Key Decisions**:
- Validation: 500 char minimum for messages (prevents low-effort spam), 10K max (prevents abuse)
- Turnstile: 5 second timeout for verification API, graceful error handling for network issues
- Email templates: Professional design with gradient headers, XSS protection via escapeHtml(), reply-to instructions
- Pattern reuse: Followed newsletter validation schema patterns (Zod error messages, type inference)

