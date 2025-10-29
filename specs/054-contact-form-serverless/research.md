# Research & Discovery: 054-contact-form-serverless

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal blog showcasing dual-track expertise (aviation + dev/startup)
- **Target Users**: Aviation professionals, developers, career transitioners
- **Success Metrics**: 1,000 monthly visitors (6 months), 3min+ engagement, 100 newsletter subscribers
- **Scope**: Content platform with Next.js 15, self-hosted VPS, MDX content

### System Architecture (from system-architecture.md)
- **Architecture Style**: Monolith (Next.js full-stack application)
- **Components**: Next.js App (SSR + API routes), PostgreSQL (minimal usage), MDX content (filesystem)
- **Integration Points**: Resend/Mailgun (newsletter), Google Analytics 4, GitHub (CI/CD), Supabase (self-hosted)
- **Communication Pattern**: HTTP/JSON for API routes, direct filesystem reads for content

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0, TypeScript 5.9.3, Tailwind CSS 4.1.15
- **Backend**: Next.js API Routes (serverless functions on VPS), Prisma 6.17.1 (ORM)
- **Database**: PostgreSQL 15+ (via self-hosted Supabase on Hetzner VPS)
- **Deployment**: Docker + Caddy (reverse proxy with auto-SSL) on Hetzner VPS
- **Newsletter**: Resend or Mailgun (already integrated for newsletter feature)
- **Validation**: Zod 4.1.12 (runtime type validation)

### API Strategy (from api-strategy.md)
- **API Style**: REST over HTTPS (Next.js API Routes)
- **Authentication**: None (public endpoints - contact form is public)
- **Rate Limiting**: Per IP address (5 req/min for newsletter, similar pattern for contact form)
- **Request Format**: JSON with Zod validation
- **Response Format**: `{success: boolean, message: string, data?: {...}}`
- **Error Handling**: Standard HTTP status codes (400, 429, 500)
- **Logging**: Mask PII (emails displayed as `r***@example.com`)

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (push to main → production VPS)
- **CI/CD**: GitHub Actions (verify → build Docker → deploy to VPS)
- **Environment**: Production VPS (Hetzner), Docker Compose orchestration
- **Rollback**: Git revert + redeploy OR Docker image rollback (< 5 minutes)
- **Secrets**: Environment variables (VPS `.env` file, GitHub Secrets for CI)

### Data Architecture (from data-architecture.md)
- **Storage Strategy**: Hybrid (filesystem for content, PostgreSQL for structured data)
- **Database**: Self-hosted Supabase (shared instance on VPS, schema-level isolation)
- **Connection**: Prisma ORM with connection pooling (Supabase Supavisor)
- **Migrations**: Prisma Migrate (auto-apply on deployment)
- **Privacy**: PII encryption at rest (AES-256), TLS 1.3 in transit, emails masked in logs
- **Retention**: No permanent storage of IP addresses (rate limiting only)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: micro tier (< 1,000 visitors/month)
- **Performance Targets**: API < 500ms p95, FCP < 1.5s, TTI < 3s
- **Resource Limits**: Single VPS (2-4 vCPUs, 4-8GB RAM), in-memory rate limiting
- **Scale Path**: 10K visitors → Cloudflare CDN, 100K → Vercel Edge or multi-region

---

## Research Decisions

### Decision 1: Reuse Resend Email Service (lib/newsletter/email-service.ts)

- **Decision**: Use existing Resend integration for contact form email delivery
- **Rationale**:
  - Already configured and tested for newsletter feature
  - Supports HTML email templates with customization
  - Includes `maskEmail()` utility for PII protection (required by spec NFR-009)
  - Fire-and-forget pattern for async email sending (NFR-002: non-blocking)
  - Error handling with user-friendly messages
- **Alternatives**:
  - Create new email service: Rejected (code duplication, unnecessary complexity)
  - Use different provider: Rejected (Resend already working, no need to change)
- **Source**: `lib/newsletter/email-service.ts` (338 lines, 3 functions)

### Decision 2: Reuse In-Memory Rate Limiter (lib/newsletter/rate-limiter.ts)

- **Decision**: Use existing in-memory rate limiter for contact form submissions
- **Rationale**:
  - Matches pattern from newsletter API (5 req/min per IP)
  - Contact form needs 3 submissions per 15 minutes (FR-006)
  - Supports custom limits and windows via parameters
  - Includes `getClientIp()` helper for proxy headers (Caddy x-forwarded-for)
  - Automatic cleanup of expired entries (memory efficient)
  - Single-VPS architecture makes in-memory approach suitable (no Redis needed)
- **Alternatives**:
  - Redis-based rate limiting: Rejected (overkill for single VPS, adds infrastructure complexity)
  - Database-based rate limiting: Rejected (slower, unnecessary disk I/O)
- **Source**: `lib/newsletter/rate-limiter.ts` (107 lines, 2 functions)

### Decision 3: Reuse Zod Validation Patterns (lib/newsletter/validation-schemas.ts)

- **Decision**: Follow existing Zod schema pattern for contact form validation
- **Rationale**:
  - Project standard for API validation (tech-stack.md confirms Zod 4.1.12)
  - Clear, type-safe validation with custom error messages
  - Newsletter schemas demonstrate best practices (email format, min/max lengths)
  - Supports complex validations (FR-018, FR-019: min 500 chars for message)
- **Alternatives**:
  - Manual validation: Rejected (no type safety, error-prone)
  - Class-validator: Rejected (Zod is project standard)
- **Source**: `lib/newsletter/validation-schemas.ts` (102 lines)

### Decision 4: Cloudflare Turnstile for Spam Protection (New Dependency)

- **Decision**: Implement Cloudflare Turnstile invisible challenge for bot protection
- **Rationale**:
  - Better UX than reCAPTCHA (invisible mode, no puzzles for humans)
  - GDPR compliant (important for EU visitors per overview.md)
  - Free tier supports expected traffic (< 1,000 submissions/month)
  - Simple integration (client widget + server verification API)
  - Spec requirement FR-004: "System MUST implement Cloudflare Turnstile invisible challenge"
- **Alternatives**:
  - Google reCAPTCHA: Rejected (worse UX, privacy concerns)
  - hCaptcha: Rejected (spec explicitly requires Turnstile)
  - Honeypot only: Rejected (insufficient, Turnstile provides additional layer per FR-005)
- **Source**: Spec requirement, new dependency `@cloudflare/turnstile` (< 5KB gzipped)

### Decision 5: Next.js API Route Pattern (app/api/contact/route.ts)

- **Decision**: Follow existing API route structure from newsletter endpoints
- **Rationale**:
  - Consistent with project architecture (API routes in Next.js monolith)
  - Existing pattern: Rate limit → Validate → Process → Respond
  - Async email sending with fire-and-forget (NFR-002: < 3s response time)
  - Error handling with standard HTTP codes (400, 429, 500)
  - Logging with PII masking (NFR-009)
- **Alternatives**:
  - Separate backend service: Rejected (monolith architecture, overkill for simple endpoint)
  - Edge function: Rejected (contact form doesn't need edge deployment)
- **Source**: `app/api/newsletter/subscribe/route.ts` (167 lines)

### Decision 6: Email-Only Storage (No Database for MVP)

- **Decision**: Send contact messages via email only, no database storage for MVP
- **Rationale**:
  - Spec explicitly states "Email-only storage for MVP" (Deployment Considerations line 152)
  - Faster implementation (no schema changes, no migrations)
  - Database storage deferred to US6 (Priority 3)
  - Email provides reliable message delivery to admin
  - Reduces scope for MVP launch
- **Alternatives**:
  - Store in database: Rejected (out of scope for MVP, adds complexity)
  - Store in filesystem: Rejected (email is more reliable and actionable)
- **Source**: Spec.md line 152, User Story US6 (P3 - nice-to-have)

### Decision 7: Progressive Enhancement (Works Without JavaScript)

- **Decision**: Implement standard HTML form submission with progressive enhancement
- **Rationale**:
  - Spec requirement (Edge Cases line 28-29): "form still works but without client-side validation and Turnstile (honeypot still protects)"
  - Accessibility benefit (WCAG 2.1 AA compliance - NFR-003)
  - SEO benefit (search engines can crawl form)
  - Honeypot provides baseline spam protection without JS
  - JavaScript enhances with client-side validation + Turnstile
- **Alternatives**:
  - JavaScript-required form: Rejected (violates spec edge case, worse accessibility)
- **Source**: Spec.md edge cases, NFR-003 (WCAG 2.1 AA standards)

### Decision 8: Tailwind + Radix UI for Form Components

- **Decision**: Use existing Tailwind + Radix UI pattern for form components
- **Rationale**:
  - Project standard (tech-stack.md: Tailwind 4.1.15, Radix UI primitives)
  - Accessible by default (ARIA labels, keyboard nav - NFR-003)
  - Custom components already exist: Button, Card (system-architecture.md line 105)
  - Responsive design built-in (NFR-004: mobile ≥ 375px width)
- **Alternatives**:
  - MUI/Chakra: Rejected (not project standard, heavier bundle)
  - Plain HTML: Rejected (accessibility concerns, inconsistent with site design)
- **Source**: `tech-stack.md` lines 78-90, `system-architecture.md` lines 100-117

---

## Components to Reuse (8 components found)

**Email Service**:
- `lib/newsletter/email-service.ts` - Resend client initialization, maskEmail(), HTML email templates
  - Functions: `getResendClient()`, `getFromEmail()`, `getBaseUrl()`, `maskEmail()`
  - Pattern: Async email sending with error handling, PII masking in logs

**Rate Limiting**:
- `lib/newsletter/rate-limiter.ts` - In-memory rate limiter with configurable limits/windows
  - Functions: `checkRateLimit(identifier, limit, windowMs)`, `getClientIp(request)`
  - Pattern: Map-based storage, automatic cleanup, proxy header support

**Validation**:
- `lib/newsletter/validation-schemas.ts` - Zod schema patterns
  - Pattern: Email validation, min/max lengths, custom error messages, type inference

**API Route Pattern**:
- `app/api/newsletter/subscribe/route.ts` - Request handling workflow
  - Pattern: Rate limit → Validate → Process → Async side effects → Response
  - Error handling: try/catch with user-friendly messages, proper HTTP status codes

**UI Components** (from system-architecture.md):
- `components/ui/button.tsx` - Primary CTA button
- `components/ui/card.tsx` - Container layout
- `components/ui/badge.tsx` - Tag badges (if needed for subject dropdown)
- `app/globals.css` - Tailwind base styles

**Environment Variables** (existing, reusable):
- `RESEND_API_KEY` - Already configured for newsletter
- `NEWSLETTER_FROM_EMAIL` - Reuse for contact form FROM address
- `PUBLIC_URL` - Base URL for email links

---

## New Components Needed (7 components required)

**Backend**:
1. `app/api/contact/route.ts` - Contact form submission endpoint (POST)
   - Features: Rate limiting, Zod validation, Turnstile verification, honeypot check, dual email sending
   - Dependencies: Existing rate limiter, email service, new Turnstile verification function

2. `lib/contact/validation-schema.ts` - Zod schema for contact form
   - Fields: name (max 100), email (RFC 5322), subject (enum), message (min 500, max 10000), turnstileToken, honeypot

3. `lib/contact/turnstile-verifier.ts` - Cloudflare Turnstile server-side verification
   - Function: `verifyTurnstileToken(token, ip)` - calls Cloudflare API, returns {success, error}

4. `lib/contact/email-templates.ts` - Contact form email templates
   - Functions: `sendAdminNotification()`, `sendAutoReply()`
   - Admin email: sender info + message + timestamp + IP (masked in logs only)
   - Auto-reply: confirmation + expected response time + message copy

**Frontend**:
5. `app/contact/page.tsx` - Contact form page component
   - Features: Form with 4 fields, Turnstile widget (invisible), honeypot field, client-side validation, success/error states

6. `components/contact/ContactForm.tsx` - Contact form component
   - State: default, validating, submitting, success, error, rate-limited
   - Validation: Zod on client + server, inline error messages (FR-017)

7. `.env.example` - Updated with Turnstile variables
   - New: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_ADMIN_EMAIL`

---

## Unknowns & Questions

None - all technical questions resolved via project docs, spec, and existing code patterns.

**Resolved Questions** (from research):
1. ✅ **Email service**: Use existing Resend integration (lib/newsletter/email-service.ts)
2. ✅ **Rate limiting strategy**: In-memory (3 req/15min per IP), matches newsletter pattern
3. ✅ **Spam protection**: Cloudflare Turnstile (invisible) + honeypot field (spec requirement)
4. ✅ **Database storage**: Email-only for MVP (no DB changes), defer to US6
5. ✅ **Form accessibility**: Progressive enhancement, WCAG 2.1 AA via Tailwind + Radix UI
6. ✅ **Environment variables**: Reuse RESEND_API_KEY, NEWSLETTER_FROM_EMAIL, add Turnstile keys
7. ✅ **Deployment impact**: Additive feature (no breaking changes), update .env.example only
