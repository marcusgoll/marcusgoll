# Research & Discovery: Multi-Track Newsletter

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)

- **Vision**: Personal website/blog showcasing dual-track expertise (Aviation + Dev/Startup) with systematic teaching approach
- **Target Users**: Pilots advancing careers, developers learning systematic thinking, educators improving methods
- **Success Metrics**: 100 newsletter subscribers in 6 months (currently 0), <2s page loads, 85+ Lighthouse score
- **Scope Boundaries**: MVP focuses on subscription management; analytics (US6-US7) and frequency preferences (US8-US9) deferred

### System Architecture (from system-architecture.md)

- **Components**: Next.js App Router (frontend + API routes), PostgreSQL (Supabase), Resend/Mailgun (email), Hetzner VPS (Docker)
- **Integration Points**: Prisma ORM, Newsletter service API, ENV validation system
- **Data Flows**: User submits form → API Route → Prisma → Database + Email service → Confirmation
- **Constraints**: Self-hosted VPS (single server), cost budget <$50/mo, performance targets P50 <200ms

### Tech Stack (from tech-stack.md)

- **Frontend**: Next.js 15.5.6 (App Router), TypeScript 5.9.3, Tailwind CSS 4.1.15, React 19.2.0
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL 15+ (self-hosted Supabase), Prisma 6.17.1 ORM
- **Newsletter**: Resend or Mailgun (free tier <3K emails/mo)
- **Deployment**: Hetzner VPS + Docker + Caddy (reverse proxy with auto-SSL)

### Data Architecture (from data-architecture.md)

- **Existing Entities**: USER (placeholder, not actively used)
- **New Entities Required**: NEWSLETTER_SUBSCRIBER, NEWSLETTER_PREFERENCE (already defined in ERD)
- **Relationships**: Subscriber 1:N Preferences (one subscriber has many preference rows)
- **Naming Conventions**: snake_case for database columns, camelCase for Prisma models
- **Migration Strategy**: Prisma Migrate with version-controlled migration files

### API Strategy (from api-strategy.md)

- **API Style**: REST over HTTPS (Next.js API Routes)
- **Base Path**: `/api/newsletter`
- **Newsletter Types**: 'aviation', 'dev-startup', 'education', 'all' (ENUM constraint)
- **Endpoints Already Defined**:
  - POST /api/newsletter/subscribe (create/update subscription)
  - GET /api/newsletter/preferences/:token (get current preferences)
  - PATCH /api/newsletter/preferences (update preferences)
  - DELETE /api/newsletter/unsubscribe (soft delete, mark inactive)
- **Rate Limiting**: 5 req/min per IP (prevent spam)
- **Performance Targets**: P50 <200ms, P95 <500ms
- **Authentication**: None (public endpoints, token-based for preference management)

### Capacity Planning (from capacity-planning.md)

- **Current Scale**: Micro tier (0-1K monthly visitors, 0 subscribers currently)
- **Target Scale**: Small tier (1K-10K visitors, 100 subscribers in 6 months)
- **Performance Targets**: FCP <1.5s, LCP <3s, API response <500ms P95
- **Resource Limits**: Hetzner VPS (2-4 vCPUs, 4-8GB RAM, 80-160GB SSD)
- **Cost Constraints**: <$50/mo total infrastructure

### Deployment Strategy (from deployment-strategy.md)

- **Deployment Model**: staging-prod (full staging validation before production)
- **Platform**: Hetzner VPS + Docker + Caddy
- **CI/CD Pipeline**: GitHub Actions (lint → build → deploy)
- **Environments**: dev (local), staging (VPS), production (VPS)

### Development Workflow (from development-workflow.md)

- **Git Workflow**: Feature branches → PR → Review → Merge to main
- **Testing Strategy**: Unit tests (80%+ coverage required), integration tests for API, E2E for critical flows
- **Code Style**: ESLint + TypeScript strict mode
- **Definition of Done**: Tests pass, code reviewed, docs updated, deployed to staging

---

## Research Decisions

### Decision: Next.js API Routes for Backend

- **Decision**: Use Next.js API Routes (not separate Express/FastAPI service)
- **Rationale**:
  - Integrated with frontend (no separate backend repo)
  - Serverless functions on VPS (Docker deployment)
  - Simple for low-complexity API needs (newsletter signup)
  - TypeScript across full stack
  - Existing health check endpoint demonstrates pattern (`/api/health/route.ts`)
- **Alternatives**: Express.js (separate service unnecessary), FastAPI (TypeScript consistency preferred), tRPC (overkill for simple REST)
- **Source**: `docs/project/tech-stack.md`, `app/api/health/route.ts`

### Decision: Prisma ORM with PostgreSQL

- **Decision**: Use Prisma 6.17.1 as ORM layer
- **Rationale**:
  - Type-safe database queries (auto-generated TypeScript types)
  - Excellent migrations system (version-controlled schema changes)
  - Existing prisma client setup (`lib/prisma.ts`) ready for reuse
  - Existing schema.prisma with User model demonstrates pattern
- **Alternatives**: TypeORM (less modern, weaker types), Drizzle (less mature), Raw SQL (no type safety)
- **Source**: `prisma/schema.prisma`, `lib/prisma.ts`, `docs/project/tech-stack.md`

### Decision: Zod for Validation

- **Decision**: Use Zod for API request validation and environment variable schemas
- **Rationale**:
  - Runtime type validation for API inputs
  - Integrates with TypeScript
  - Already used in codebase (`lib/env-schema.ts`)
  - Schema-based validation (clear error messages)
- **Alternatives**: Joi (older), Yup (weaker types), Manual validation (error-prone)
- **Source**: `lib/env-schema.ts`

### Decision: Token-Based Preference Management

- **Decision**: Use 64-char hex tokens (32 random bytes) for unsubscribe/preference links, no login required
- **Rationale**:
  - 2^256 possible values (cryptographically secure)
  - No password management overhead
  - Single-use not enforced (token remains valid for preference management)
  - Simpler UX than requiring account creation
- **Alternatives**: Login-based (too complex for newsletter), shorter tokens (less secure), magic links (similar but temporary)
- **Source**: `specs/048-multi-track-newsletter/spec.md` (FR-004, Edge Cases)

### Decision: Resend for Email Delivery (Primary)

- **Decision**: Use Resend as primary email service, Mailgun as fallback option
- **Rationale**:
  - Resend: Modern API, React Email templates, good DX, free <3K emails/mo
  - Mailgun: Battle-tested, reliable deliverability (if Resend doesn't work)
  - Both cheaper than alternatives (SendGrid, AWS SES)
  - Simple API integration
- **Alternatives**: SendGrid (more complex API), AWS SES (complex setup), Mailchimp (more expensive)
- **Source**: `docs/project/tech-stack.md`, `lib/env-schema.ts` (RESEND_API_KEY, MAILGUN_API_KEY)

### Decision: Hybrid Database Strategy (Upsert + Soft Delete)

- **Decision**: Upsert logic for duplicate emails, soft delete for unsubscribe, hard delete option for GDPR
- **Rationale**:
  - Upsert allows re-subscription without error
  - Soft delete maintains history for analytics
  - Hard delete option ensures GDPR compliance (right to deletion)
  - Prisma supports upsert operations natively
- **Alternatives**: Duplicate email error (poor UX), Hard delete only (loses analytics), No delete (GDPR violation)
- **Source**: `specs/048-multi-track-newsletter/spec.md` (FR-006, FR-013, FR-016, US5)

### Decision: Multi-Checkbox UI Pattern

- **Decision**: Use multi-select checkboxes for newsletter selection (not dropdown or toggles)
- **Rationale**:
  - Better accessibility (keyboard navigation, screen reader support)
  - Clear visual state (checked/unchecked)
  - Familiar pattern for users
  - At least 1 required (validation error if none)
- **Alternatives**: Dropdown (less accessible), Toggle switches (unclear state), Radio buttons (can't select multiple)
- **Source**: `specs/048-multi-track-newsletter/spec.md` (US1, US3)

### Decision: Background Email Processing with Retry Queue

- **Decision**: Save subscriber to database first, send email in background with retry queue
- **Rationale**:
  - Ensures no data loss if email service is down
  - User sees success message immediately (<2s response time)
  - Background retry queue attempts to send email later
  - Maintains NFR-002 (signup <2s total)
- **Alternatives**: Blocking email send (slow, fails if service down), No retry (emails lost), Async without save (data loss risk)
- **Source**: `specs/048-multi-track-newsletter/spec.md` (Edge Cases, NFR-002)

---

## Components to Reuse (4 found)

**UI Components**:
- `components/ui/Button.tsx`: Button component with variants (default, outline, ghost) and sizes - Use for form submit button
- `components/ui/Container.tsx`: Page width constraint wrapper - Use for preference management page layout
- `components/ui/dialog.tsx`: Radix UI Dialog primitive - Use for confirmation modals if needed

**Backend Infrastructure**:
- `lib/prisma.ts`: Prisma client initialization with connection pooling - Reuse for database queries
- `app/api/health/route.ts`: Example API route with error handling - Follow pattern for newsletter API routes
- `lib/env-schema.ts`: Environment variable schema and validation - Extend with newsletter-specific vars

---

## New Components Needed (8 required)

**Database Models** (Prisma):
- `models/NewsletterSubscriber`: Subscriber entity (id, email, active, subscribed_at, unsubscribed_at, unsubscribe_token, source)
- `models/NewsletterPreference`: Preference entity (id, subscriber_id, newsletter_type, subscribed, updated_at)

**API Routes** (Next.js):
- `app/api/newsletter/subscribe/route.ts`: POST endpoint for new subscriptions (create/update subscriber + preferences)
- `app/api/newsletter/preferences/[token]/route.ts`: GET endpoint for preference page (retrieve current selections)
- `app/api/newsletter/preferences/route.ts`: PATCH endpoint for updating preferences
- `app/api/newsletter/unsubscribe/route.ts`: DELETE endpoint for unsubscribe (soft delete)

**UI Components**:
- `components/newsletter/NewsletterSignupForm.tsx`: Multi-checkbox form with email input and newsletter type selection
- `app/newsletter/preferences/[token]/page.tsx`: Preference management page (full page route, not component)
- `app/newsletter/unsubscribe/confirmation/page.tsx`: Unsubscribe confirmation page with GDPR delete option

**Email Templates** (if using React Email with Resend):
- `emails/WelcomeEmail.tsx`: Welcome email template with preferences and unsubscribe links
- `emails/PreferenceUpdateConfirmation.tsx`: Confirmation email after preference change
- `emails/GoodbyeEmail.tsx`: Goodbye email after unsubscribe

**Utilities**:
- `lib/newsletter/token-generator.ts`: Generate secure 64-char hex tokens using Node.js crypto
- `lib/newsletter/email-service.ts`: Abstraction layer for Resend/Mailgun (switch between providers)
- `lib/newsletter/validation-schemas.ts`: Zod schemas for newsletter API requests

---

## Unknowns & Questions

None - all technical questions resolved during specification phase