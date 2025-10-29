# Implementation Plan: Multi-Track Newsletter Subscription System

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15.5.6 API Routes + Prisma 6.17.1 + PostgreSQL 15+ + Resend/Mailgun
- Components to reuse: 4 (Button, Container, Prisma client, ENV schema)
- New components needed: 8 (2 models, 4 API routes, 3 pages, utilities)
- Architecture aligned with 8 project documentation files (overview, tech-stack, data-architecture, api-strategy, capacity-planning, deployment-strategy, development-workflow, system-architecture)

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- Frontend: Next.js 15.5.6 App Router, TypeScript 5.9.3, Tailwind CSS 4.1.15, React 19.2.0
- Backend: Next.js API Routes (integrated serverless functions)
- Database: PostgreSQL 15+ (self-hosted Supabase), Prisma 6.17.1 ORM
- State Management: React Server Components + minimal client state (form state only, no global store)
- Validation: Zod 4.1.12 (API requests + environment variables)
- Email Service: Resend (primary) or Mailgun (fallback) - abstraction layer for easy switching
- Deployment: Hetzner VPS + Docker + Caddy (reverse proxy with auto-SSL)

**Patterns**:
- **Repository Pattern**: Prisma acts as data access layer, business logic in API route handlers
- **Token-Based Auth**: 64-char hex tokens (32 random bytes) for preference management, no login required
- **Upsert Strategy**: Handle duplicate email signups by updating existing subscriber preferences
- **Soft Delete**: Mark subscriber as inactive (active=false) on unsubscribe, hard delete option for GDPR
- **Background Email Processing**: Save to DB first, send email async with retry queue (maintains <2s response time)
- **Multi-Checkbox Pattern**: UI uses checkboxes for newsletter selection (accessible, clear state)

**Dependencies** (new packages required):
- `resend@^4.0.0` OR `mailgun.js@^10.0.0`: Email delivery service client
- `crypto` (built-in Node.js): Secure token generation (no new package needed)

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
app/
├── api/
│   └── newsletter/
│       ├── subscribe/
│       │   └── route.ts                 # POST /api/newsletter/subscribe
│       ├── preferences/
│       │   ├── [token]/
│       │   │   └── route.ts             # GET /api/newsletter/preferences/:token
│       │   └── route.ts                 # PATCH /api/newsletter/preferences
│       └── unsubscribe/
│           └── route.ts                 # DELETE /api/newsletter/unsubscribe
├── newsletter/
│   ├── preferences/
│   │   └── [token]/
│   │       └── page.tsx                 # Preference management page
│   └── unsubscribe/
│       └── confirmation/
│           └── page.tsx                 # Unsubscribe confirmation page
└── generated/
    └── prisma/                          # Prisma client (auto-generated)

components/
└── newsletter/
    └── NewsletterSignupForm.tsx         # Signup form component (multi-checkbox)

lib/
├── prisma.ts                            # Existing Prisma client (REUSE)
├── env-schema.ts                        # Existing ENV schema (EXTEND)
└── newsletter/
    ├── token-generator.ts               # Secure token generation
    ├── email-service.ts                 # Resend/Mailgun abstraction layer
    └── validation-schemas.ts            # Zod schemas for newsletter API

prisma/
├── schema.prisma                        # Existing schema (EXTEND with newsletter models)
└── migrations/
    └── YYYYMMDDHHMMSS_add_newsletter/   # Migration for newsletter tables
        └── migration.sql

emails/ (if using React Email with Resend)
├── WelcomeEmail.tsx                     # Welcome email template
├── PreferenceUpdateConfirmation.tsx     # Preference update email
└── GoodbyeEmail.tsx                     # Goodbye email
```

**Module Organization**:
- **API Routes**: Each endpoint in separate route.ts file (Next.js App Router convention)
- **Newsletter Library**: Utilities grouped under `lib/newsletter/` (token generation, email service, validation)
- **Components**: Newsletter-specific components in `components/newsletter/`
- **Prisma Models**: Added to existing `prisma/schema.prisma` (NewsletterSubscriber, NewsletterPreference)

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: 2 (NewsletterSubscriber, NewsletterPreference)
- Relationships: Subscriber 1:N Preferences (one subscriber has many preference rows)
- Migrations required: Yes (create newsletter_subscribers and newsletter_preferences tables)
- Indexes: 5 total (email, active, token, subscriber_id, newsletter_type+subscribed)

**Key Fields**:
- `NewsletterSubscriber.unsubscribe_token`: 64-char hex (cryptographically secure, permanent)
- `NewsletterSubscriber.active`: Boolean (global subscription status, soft delete marker)
- `NewsletterPreference.newsletter_type`: ENUM('aviation', 'dev-startup', 'education', 'all')
- `NewsletterPreference.subscribed`: Boolean (per-newsletter opt-in/out)

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: API response time <200ms P50, <500ms P95
- NFR-002: Signup form submission <2s total (including email send)
- NFR-003: Database queries <100ms for reads, <200ms for writes

**Lighthouse Targets**:
- Performance: ≥85
- Accessibility: ≥95 (WCAG 2.1 AA compliance)
- Best Practices: ≥90
- SEO: ≥90

**Implementation Strategy**:
- Background email processing to meet <2s signup target (save to DB first, send email async)
- Prisma connection pooling (existing setup in `lib/prisma.ts`)
- Database indexes on high-query fields (email, active, token)
- Server-side rendering for preference management page (no client-side data fetching)

---

## [SECURITY]

**Authentication Strategy**:
- No authentication required for signup (public endpoint)
- Token-based authentication for preference management (64-char hex tokens)
- No login/password system (reduces attack surface)

**Authorization Model**:
- Public endpoints: /api/newsletter/subscribe (rate-limited to 5 req/min per IP)
- Token-protected endpoints: /api/newsletter/preferences/:token, /api/newsletter/preferences, /api/newsletter/unsubscribe (require valid token)
- No role-based access control (RBAC) - all subscribers have same permissions on their own data

**Input Validation**:
- Request schemas: Zod validation for all API inputs (email format, newsletter types, token format)
- Rate limiting: 5 req/min per IP (prevent spam signups)
- CORS: Not applicable (same-origin API routes)

**Data Protection**:
- PII handling: Email addresses masked in logs (r***@example.com format) - NFR-009
- Encryption: Database at-rest encryption via PostgreSQL (Supabase default)
- HTTPS enforced: Caddy reverse proxy with automatic Let's Encrypt SSL
- Secure tokens: Cryptographically secure random generation (Node.js crypto.randomBytes)

**GDPR Compliance**:
- Right to deletion: Hard delete option on unsubscribe confirmation page (NFR-010, FR-016)
- Data portability: User can export their preferences via preference management page (future enhancement)
- Soft delete default: Maintains analytics while respecting unsubscribe

---

## [EXISTING INFRASTRUCTURE - REUSE] (4 components)

**Services/Modules**:
- `lib/prisma.ts`: Prisma client initialization with connection pooling - REUSE for all database queries
- `lib/env-schema.ts`: Environment variable schema (EnvironmentVariables interface) - EXTEND with newsletter vars
- `app/api/health/route.ts`: Example API route with error handling and env validation - FOLLOW PATTERN for newsletter routes

**UI Components**:
- `components/ui/Button.tsx`: Button component with variants (default, outline, ghost) and sizes - USE for form submit button
- `components/ui/Container.tsx`: Page width constraint wrapper - USE for preference management page layout

**Utilities**:
- Existing Zod schemas pattern in `lib/env-schema.ts` - FOLLOW PATTERN for newsletter validation schemas
- Existing Prisma schema with User model - EXTEND with newsletter models

---

## [NEW INFRASTRUCTURE - CREATE] (8 components)

**Backend - Database Models**:
- `prisma/schema.prisma`: Add NewsletterSubscriber and NewsletterPreference models
- `prisma/migrations/YYYYMMDDHHMMSS_add_newsletter/`: Create migration for newsletter tables

**Backend - API Routes**:
- `app/api/newsletter/subscribe/route.ts`: POST endpoint (create/update subscriber + preferences)
- `app/api/newsletter/preferences/[token]/route.ts`: GET endpoint (retrieve current preferences)
- `app/api/newsletter/preferences/route.ts`: PATCH endpoint (update preferences)
- `app/api/newsletter/unsubscribe/route.ts`: DELETE endpoint (soft delete, mark inactive)

**Backend - Utilities**:
- `lib/newsletter/token-generator.ts`: Generate secure 64-char hex tokens using Node.js crypto.randomBytes
- `lib/newsletter/email-service.ts`: Abstraction layer for Resend/Mailgun (switch between providers)
- `lib/newsletter/validation-schemas.ts`: Zod schemas for newsletter API requests

**Frontend - UI Components**:
- `components/newsletter/NewsletterSignupForm.tsx`: Multi-checkbox form with email input and newsletter type selection

**Frontend - Pages**:
- `app/newsletter/preferences/[token]/page.tsx`: Preference management page (Server Component)
- `app/newsletter/unsubscribe/confirmation/page.tsx`: Unsubscribe confirmation page with GDPR delete option

**Email Templates** (if using React Email with Resend):
- `emails/WelcomeEmail.tsx`: Welcome email template with preferences and unsubscribe links
- `emails/PreferenceUpdateConfirmation.tsx`: Confirmation email after preference change
- `emails/GoodbyeEmail.tsx`: Goodbye email after unsubscribe

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: Hetzner VPS + Docker + Caddy (no changes to deployment platform)
- Env vars: 3 new required (RESEND_API_KEY OR MAILGUN_API_KEY, NEWSLETTER_FROM_EMAIL, already defined in lib/env-schema.ts)
- Breaking changes: No (new tables and endpoints, no existing functionality modified)
- Migration: Yes - Prisma migration to create newsletter tables

**Build Commands**:
- No changes to build process (Next.js build remains the same)
- Prisma migration must run before first deployment: `npx prisma migrate deploy`

**Environment Variables** (update .env and GitHub Secrets):
- **New required**:
  - `RESEND_API_KEY` (or `MAILGUN_API_KEY`): Email service API key
  - `NEWSLETTER_FROM_EMAIL`: Verified sender email address (e.g., "newsletter@marcusgoll.com")
- **Already defined in lib/env-schema.ts**: Yes (EnvironmentVariables interface already includes these)
- **Staging values**: Use Resend test key or Mailgun sandbox domain
- **Production values**: Use Resend production key or Mailgun verified domain

**Database Migrations**:
- **Required**: Yes
- **Migration file**: `prisma/migrations/YYYYMMDDHHMMSS_add_newsletter/migration.sql`
- **Dry-run required**: Yes - Run `npx prisma migrate dev` in local/staging first
- **Reversible**: Yes - Can drop tables with `DROP TABLE newsletter_preferences, newsletter_subscribers;`
- **Deployment steps**:
  1. Commit migration files to Git
  2. Deploy to staging
  3. Migration auto-runs via Dockerfile: `RUN npx prisma migrate deploy`
  4. Verify staging works
  5. Deploy to production (same Docker image, migration runs automatically)

**Smoke Tests** (for GitHub Actions):
- **Route**: POST /api/newsletter/subscribe
- **Expected**: 200, `{"success": true, "message": "Successfully subscribed..."}`
- **Test script** (add to `.github/workflows/`):
  ```bash
  curl -X POST https://staging.marcusgoll.com/api/newsletter/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","newsletterTypes":["aviation"]}' \
    | jq '.success' | grep -q true
  ```

**Platform Coupling**:
- **Hetzner VPS**: No changes (same Docker deployment)
- **Caddy**: No changes (reverse proxy config unchanged)
- **Docker**: No changes (existing Dockerfile works, just add migration step)
- **Dependencies**: New packages (resend or mailgun.js) added to package.json

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- No breaking changes to existing API endpoints or database schema
- Environment variables (RESEND_API_KEY, NEWSLETTER_FROM_EMAIL) configured in production before deployment
- Database migration is reversible (can drop tables without affecting existing User model)
- Prisma schema changes do not break existing queries

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Given staging environment is deployed with newsletter feature
When user visits https://staging.marcusgoll.com (homepage)
  And user enters email in newsletter signup form in footer
  And user selects "Aviation" and "Dev/Startup" newsletters
  And user clicks "Subscribe" button
Then user sees success message within 2 seconds
  And database contains subscriber record with correct email and active=true
  And database contains 2 preference records (aviation and dev-startup with subscribed=true)
  And user receives welcome email within 30 seconds
  And welcome email contains "Manage preferences" link
  And welcome email contains "Unsubscribe" link

Given subscriber token from database
When user visits https://staging.marcusgoll.com/newsletter/preferences/:token
Then user sees preference management page
  And page displays email (read-only)
  And page displays 4 checkboxes (aviation, dev-startup, education, all)
  And aviation and dev-startup are checked
  And education and all are unchecked

Given user is on preference management page
When user unchecks "Aviation"
  And user clicks "Update Preferences"
Then user sees confirmation message
  And database shows aviation preference as subscribed=false
  And user receives preference update confirmation email

Given user clicks "Unsubscribe" link in email
When user lands on unsubscribe page
  And user clicks "Delete My Data" link
Then database record is deleted (hard delete, CASCADE to preferences)
  And user sees "Your data has been permanently deleted" message
  And user can re-subscribe with same email (no existing record)
```

**Rollback Plan**:
- **Deploy IDs tracked in**: specs/048-multi-track-newsletter/deployment-metadata.json (Deployment Metadata)
- **Rollback commands**: Standard 3-command rollback via `docs/ROLLBACK_RUNBOOK.md`
  1. SSH to VPS: `ssh hetzner`
  2. Revert git commit: `cd /path/to/marcusgoll && git revert <commit-sha>`
  3. Rebuild and restart: `./deploy.sh` (or `docker-compose up -d --build`)
- **Special considerations**:
  - If migration has already run, reverting code will not reverse migration
  - To reverse migration: `npx prisma migrate resolve --rolled-back YYYYMMDDHHMMSS_add_newsletter` (marks as rolled back)
  - Manual database rollback: `DROP TABLE newsletter_preferences, newsletter_subscribers;` (safe, doesn't affect existing tables)
  - If subscribers already exist, rollback will lose data (acceptable for new feature, no user impact)

**Artifact Strategy** (build-once-promote-many):
- **Web App**: Docker image `marcusgoll-web:<commit-sha>` (NOT :latest)
- **Build in**: GitHub Actions workflow (`.github/workflows/build.yml`)
- **Deploy to staging**: Use same Docker image with staging environment variables
- **Promote to production**: Use same Docker image with production environment variables
- **No rebuild**: Prebuilt artifact ensures staging and production are identical

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Initial setup: Prisma migration, environment variables, seed test data
- Validation workflow: Tests, type-checking, linting
- Manual testing: Signup form, preference management, unsubscribe flow

---

## [TECHNICAL CONSTRAINTS]

**Scale Constraints**:
- Current: 0 subscribers (MVP)
- Target: 100 subscribers in 6 months
- Capacity: VPS can handle 1,000+ subscribers with current architecture
- No scale limitations for MVP (can refactor later if growth exceeds expectations)

**Cost Constraints**:
- Resend free tier: <3,000 emails/month (sufficient for MVP)
- Mailgun free tier: Similar (<3,000 emails/month)
- No additional infrastructure cost (self-hosted VPS)
- Total cost impact: $0 (within free tiers)

**Browser Support**:
- Modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers: iOS Safari, Chrome Mobile
- No IE11 support (Next.js 15 requires ES6+)

---

## [RISK ASSESSMENT]

**Technical Risks**:
- **Email deliverability**: Mitigation - Use verified sender domain, follow email best practices, test with real email addresses
- **Token security**: Mitigation - Use cryptographically secure random generation (32 bytes), 64-char hex format
- **Database migration failure**: Mitigation - Test migration in staging first, reversible migration design
- **Rate limiting bypass**: Mitigation - Implement IP-based rate limiting (5 req/min), monitor for abuse

**Business Risks**:
- **Low signup conversion**: Mitigation - A/B test form placement (footer vs popup), track analytics (US7)
- **High unsubscribe rate**: Mitigation - Monitor unsubscribe reasons, improve content quality, allow granular preferences
- **Spam complaints**: Mitigation - Double opt-in (future enhancement), clear unsubscribe link, follow CAN-SPAM guidelines

**Operational Risks**:
- **Email service outage**: Mitigation - Background retry queue, save subscriber to DB first (no data loss)
- **VPS downtime**: Mitigation - Monitor uptime, backup database daily, document recovery process
- **GDPR compliance failure**: Mitigation - Hard delete option implemented (US5), data export capability (future)

---

## [SUCCESS CRITERIA]

**MVP Success** (Ship US1-US5):
- ✅ Users can subscribe to one or more newsletter tracks
- ✅ Users receive welcome email within 30 seconds
- ✅ Users can manage preferences via token link (no login)
- ✅ Users can unsubscribe with one click
- ✅ Users can request hard delete (GDPR compliance)
- ✅ All NFRs met (performance <500ms P95, accessibility WCAG 2.1 AA, security best practices)
- ✅ 100 subscribers within 6 months (target metric)

**Post-MVP Enhancements** (US6-US9):
- Analytics (subscriber counts, conversion rates) - US6, US7
- Email frequency preferences (immediate, daily, weekly) - US8
- Newsletter preview before signup - US9

---

## [NEXT STEPS]

After `/plan` approval:
1. Run `/tasks` to generate concrete implementation tasks with acceptance criteria
2. Run `/validate` to check cross-artifact consistency (spec + plan + data-model)
3. Run `/implement` to execute tasks with TDD workflow
4. Run `/optimize` for performance, accessibility, security review
5. Run `/preview` for manual UI/UX testing
6. Run `/ship` for automated deployment workflow