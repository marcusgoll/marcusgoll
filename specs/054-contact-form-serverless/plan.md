# Implementation Plan: Contact Form (Serverless)

## [RESEARCH DECISIONS]

See: `research.md` for full research findings

**Summary**:
- **Stack**: Next.js 15 API Routes, Resend (email), Cloudflare Turnstile (spam), Zod (validation)
- **Components to reuse**: 8 (email service, rate limiter, validation patterns, API route patterns, UI components)
- **New components needed**: 7 (contact API endpoint, Turnstile verifier, email templates, contact page, form component, validation schema, env updates)
- **Architecture alignment**: Fully aligned with project docs (monolith, direct-prod deployment, self-hosted VPS, REST API style)

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- **Frontend**: Next.js 15.5.6 App Router, React 19.2.0, TypeScript 5.9.3, Tailwind CSS 4.1.15
- **Backend**: Next.js API Routes (POST /api/contact), Zod 4.1.12 validation
- **Email**: Resend (existing integration, reuse lib/newsletter/email-service.ts pattern)
- **Spam Protection**: Cloudflare Turnstile (invisible mode) + honeypot field
- **Rate Limiting**: In-memory (3 submissions per 15 minutes per IP, reuse lib/newsletter/rate-limiter.ts)
- **State Management**: React hooks (useState) for form state (no global state needed)
- **Deployment**: Hetzner VPS (Docker + Caddy), GitHub Actions CI/CD (existing pipeline)

**Patterns**:
- **API Route Pattern**: Rate limit → Validate → Verify Turnstile → Check honeypot → Send emails → Respond
  - Reuse from `app/api/newsletter/subscribe/route.ts` (same structure, proven pattern)
- **Email Pattern**: Dual send (admin notification + auto-reply), fire-and-forget async
  - Reuse from `lib/newsletter/email-service.ts` (maskEmail, Resend client, HTML templates)
- **Validation Pattern**: Zod schema with custom error messages, type inference
  - Reuse from `lib/newsletter/validation-schemas.ts` (email format, min/max lengths)
- **Form Pattern**: Progressive enhancement (works without JS), client + server validation
  - Spec requirement (Edge Cases line 28-29), WCAG 2.1 AA compliance

**Dependencies** (new packages required):
- `@cloudflare/turnstile@0.x`: Client-side Turnstile widget (< 5KB gzipped, spec requirement)
- **No other new dependencies** (Resend, Zod, Next.js already installed)

**Deployment Considerations**:
- **Environment Variables**: 3 new required (TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, CONTACT_ADMIN_EMAIL)
- **Breaking Changes**: None (additive feature, new endpoint /api/contact)
- **Database**: No schema changes (email-only storage per spec)
- **Rollback**: Fully reversible (delete /app/api/contact/route.ts, /app/contact/page.tsx, revert .env.example)

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
app/
├── api/
│   └── contact/
│       └── route.ts                    # POST /api/contact (new)
├── contact/
│   └── page.tsx                        # Contact form page (new)
└── globals.css                         # (existing, no changes)

components/
├── contact/
│   └── ContactForm.tsx                 # Contact form component (new)
└── ui/                                 # (existing, reuse Button, Card, Alert)

lib/
├── contact/
│   ├── validation-schema.ts            # Zod schema for contact (new)
│   ├── turnstile-verifier.ts           # Turnstile server verification (new)
│   └── email-templates.ts              # Admin + auto-reply emails (new)
├── newsletter/                         # (existing, reuse email-service.ts, rate-limiter.ts)
└── prisma.ts                           # (existing, no changes - no DB for MVP)

.env.example                             # Update with Turnstile + admin email vars (modify)
```

**Module Organization**:
- **API Module** (`app/api/contact/route.ts`): Request handling, validation, email orchestration
- **Validation Module** (`lib/contact/validation-schema.ts`): Type-safe input validation
- **Security Module** (`lib/contact/turnstile-verifier.ts`): Bot detection via Cloudflare API
- **Email Module** (`lib/contact/email-templates.ts`): Dual email templates (admin + auto-reply)
- **UI Module** (`app/contact/page.tsx`, `components/contact/ContactForm.tsx`): Form UI with states

---

## [DATA MODEL]

See: `data-model.md` (if created) or inline below

**No Database Storage for MVP** (spec line 152: "Email-only storage for MVP")

**Entity: ContactMessage** (optional, for future database storage - US6, Priority 3):
- **Purpose**: Store contact form submissions for analytics and history
- **Attributes**:
  - `id`: UUID (PK)
  - `sender_name`: String (max 100 chars)
  - `sender_email`: String (encrypted)
  - `subject`: ENUM ('General Inquiry', 'Aviation Consulting', 'Dev/Startup Collaboration', 'CFI Training Resources', 'Speaking/Workshop Request', 'Other')
  - `message`: Text (min 500, max 10,000 chars)
  - `ip_address`: String (hashed for privacy)
  - `turnstile_score`: Float (0-1, from Turnstile API if provided)
  - `created_at`: Timestamp
- **Relationships**: None (standalone entity)
- **Migration**: Deferred to US6 (MVP uses email-only, no database)

**API Request Schema** (Zod validation):
```typescript
ContactFormSchema = {
  name: string (min 1, max 100),
  email: string (RFC 5322 format),
  subject: enum [6 options from FR-002],
  message: string (min 500, max 10,000),
  turnstileToken: string (from Turnstile widget),
  honeypot: string (hidden field, must be empty)
}
```

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs** (or defaults from project docs):
- **NFR-001**: API response time < 3 seconds (p95)
- **NFR-002**: Email delivery non-blocking (async fire-and-forget, don't wait for Resend response)
- **NFR-004**: Mobile responsive (≥ 375px width - iPhone SE minimum)

**Lighthouse Targets** (from capacity-planning.md):
- **Performance**: ≥ 85
- **Accessibility**: ≥ 95 (WCAG 2.1 AA - NFR-003)
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

**API Performance Breakdown**:
- Rate limit check: < 10ms (in-memory lookup)
- Zod validation: < 50ms (JSON parsing + validation)
- Turnstile verification: < 500ms (external API call to Cloudflare)
- Honeypot check: < 1ms (string comparison)
- Email sending (async): 0ms blocking (fire-and-forget)
- Response generation: < 10ms (JSON serialization)
- **Total**: < 600ms (well under 3s requirement)

---

## [SECURITY]

**Authentication Strategy**:
- **None** (public contact form, no authentication required)
- **Future**: If admin panel added, use Supabase Auth (already available on VPS)

**Authorization Model**:
- **None** (public endpoint)
- **Admin email access**: Only Marcus receives contact emails (CONTACT_ADMIN_EMAIL env var)

**Input Validation**:
- **Request schemas**: Zod validation (FR-018) - name, email, subject, message, turnstileToken
- **Email format**: RFC 5322 regex (FR-003)
- **Message length**: Min 500 chars (FR-019, prevents low-effort spam), max 10,000 chars (edge case line 26-27)
- **Subject**: Enum validation (6 predefined options from FR-002)
- **XSS Prevention**: Sanitize HTML/script tags (FR-020) - use DOMPurify or strip tags before email sending

**Rate Limiting**:
- **Pattern**: 3 submissions per 15 minutes per IP (FR-006)
- **Implementation**: In-memory rate limiter (reuse lib/newsletter/rate-limiter.ts)
- **IP Extraction**: `getClientIp(request)` handles x-forwarded-for (Caddy proxy - NFR-007)
- **429 Response**: Include Retry-After header (FR-014)

**Spam Protection**:
- **Layer 1**: Honeypot field (FR-005) - CSS hidden, name="website", reject if filled
- **Layer 2**: Cloudflare Turnstile (FR-004) - invisible challenge, server-side verification
- **Layer 3**: Rate limiting (FR-006) - prevents flooding
- **Layer 4**: Message length requirement (FR-019) - 500 char minimum discourages bots

**Data Protection**:
- **PII Handling**: Email masked in logs (NFR-009) - `maskEmail()` from lib/newsletter/email-service.ts
- **IP Privacy**: IP only used for rate limiting, not stored permanently (NFR-008)
- **Encryption**: TLS 1.3 in transit (Caddy auto-managed), no at-rest encryption needed (no DB storage)
- **Secrets**: Turnstile secret key server-side only (NFR-006), never exposed to client

---

## [EXISTING INFRASTRUCTURE - REUSE] (8 components)

**Services/Modules**:
- **lib/newsletter/email-service.ts**: Resend client, maskEmail() utility, HTML email pattern
  - Functions to reuse: `getResendClient()`, `getFromEmail()`, `getBaseUrl()`, `maskEmail()`
  - Pattern: Async email sending with error handling, PII masking in console logs

- **lib/newsletter/rate-limiter.ts**: In-memory rate limiting with configurable limits/windows
  - Functions to reuse: `checkRateLimit(identifier, limit, windowMs)`, `getClientIp(request)`
  - Adaptation: Change params to (ip, 3, 900000) for 3 req per 15 min

- **lib/newsletter/validation-schemas.ts**: Zod schema patterns
  - Pattern to follow: Email validation, min/max lengths, custom error messages, type inference
  - Reuse: Email validation regex, error message style

- **app/api/newsletter/subscribe/route.ts**: API route structure
  - Pattern to reuse: Rate limit → Validate → Process → Async side effects → Response
  - Error handling: try/catch with user-friendly messages, proper HTTP status codes

**UI Components** (from system-architecture.md):
- **components/ui/button.tsx**: Primary CTA button for "Send Message"
- **components/ui/card.tsx**: Container layout for form
- **components/ui/alert.tsx**: Success/error messages (if exists, otherwise create inline)

**Environment Variables** (existing, reusable):
- **RESEND_API_KEY**: Already configured for newsletter (no changes needed)
- **NEWSLETTER_FROM_EMAIL**: Reuse for contact form FROM address (no changes needed)
- **PUBLIC_URL**: Base URL for email links (no changes needed)

**Utilities**:
- **app/globals.css**: Tailwind base styles (no changes needed)
- **Next.js App Router**: Routing, server components, API routes (existing infrastructure)

---

## [NEW INFRASTRUCTURE - CREATE] (7 components)

**Backend**:

1. **app/api/contact/route.ts** - Contact form submission endpoint
   - **Purpose**: Handle POST /api/contact requests
   - **Features**:
     - Rate limiting (3 req/15min per IP using checkRateLimit)
     - Zod validation (ContactFormSchema)
     - Turnstile verification (call Cloudflare API)
     - Honeypot check (reject if filled)
     - Dual email sending (admin notification + auto-reply)
     - Error handling with user-friendly messages
   - **Dependencies**: rate-limiter, validation-schema, turnstile-verifier, email-templates
   - **Response Codes**: 200 (success), 400 (validation), 429 (rate limit), 500 (server error)

2. **lib/contact/validation-schema.ts** - Zod schema for contact form
   - **Purpose**: Type-safe validation of contact form inputs
   - **Schema**:
     - `name`: z.string().min(1).max(100) (FR-001)
     - `email`: z.string().email() with RFC 5322 regex (FR-003)
     - `subject`: z.enum([...6 options]) (FR-002)
     - `message`: z.string().min(500).max(10000) (FR-019, edge case line 26-27)
     - `turnstileToken`: z.string().min(1) (required for Turnstile verification)
     - `honeypot`: z.string().max(0) (must be empty - FR-005)
   - **Error Messages**: Custom, user-friendly (NFR-005)

3. **lib/contact/turnstile-verifier.ts** - Cloudflare Turnstile server-side verification
   - **Purpose**: Verify Turnstile token with Cloudflare API
   - **Function**: `verifyTurnstileToken(token: string, ip: string): Promise<{success: boolean, error?: string}>`
   - **API Call**: POST https://challenges.cloudflare.com/turnstile/v0/siteverify
   - **Request Body**: `{secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip}`
   - **Error Handling**: Network errors, invalid tokens, timeout (5s max)

4. **lib/contact/email-templates.ts** - Contact form email templates
   - **Purpose**: Generate HTML emails for admin notification and auto-reply
   - **Functions**:
     - `sendAdminNotification(form: ContactFormData, ip: string): Promise<EmailResult>`
       - To: CONTACT_ADMIN_EMAIL
       - Subject: `New Contact: ${subject} from ${name}`
       - Body: Sender info, subject, message, timestamp (ISO 8601), IP (for abuse tracking - FR-008)
       - Uses maskEmail() for logging only (email shown in full in email body)
     - `sendAutoReply(email: string, name: string, subject: string, message: string): Promise<EmailResult>`
       - To: sender email
       - Subject: "Message Received - Marcus Gollahon"
       - Body: Confirmation, expected response time ("Marcus typically responds within 2-3 business days" - FR-009), message copy, contact page link
   - **Pattern**: Reuse Resend client from lib/newsletter/email-service.ts

**Frontend**:

5. **app/contact/page.tsx** - Contact form page component
   - **Purpose**: Server component wrapping ContactForm
   - **Metadata**: Title "Contact | Marcus Gollahon", description, OpenGraph tags
   - **Layout**: Centered container (max-width 600px), heading, subheading, ContactForm component
   - **States**: Handled by ContactForm component (this is just the page wrapper)

6. **components/contact/ContactForm.tsx** - Contact form component (client component)
   - **Purpose**: Interactive contact form with validation and states
   - **States**: default, validating, submitting, success, error, rate-limited (from spec screens inventory)
   - **Fields**:
     - Name: text input (max 100 chars)
     - Email: email input (RFC 5322 validation)
     - Subject: dropdown select (6 options from FR-002)
     - Message: textarea (min 500, max 10,000 chars)
     - Honeypot: CSS hidden text input (name="website")
     - Turnstile: Invisible widget (loads on mount)
   - **Validation**:
     - Client-side: Zod schema (same as server) for immediate feedback
     - Server-side: API endpoint validates (defense in depth)
     - Inline errors: Display below each field (FR-017)
   - **Submission**:
     - Disable button while submitting
     - Call POST /api/contact with form data + Turnstile token
     - Handle success (show message, clear form - FR-016)
     - Handle errors (display inline - FR-017)
     - Handle rate limit (show retry-after - FR-014)
   - **Accessibility**: ARIA labels, keyboard nav, screen reader announcements (NFR-003)
   - **Progressive Enhancement**: Standard form action="/api/contact" method="POST" as fallback

7. **.env.example** - Update with Turnstile and admin email variables
   - **Add**:
     ```
     # Cloudflare Turnstile (Contact Form Spam Protection)
     NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
     TURNSTILE_SECRET_KEY=your_secret_key_here

     # Contact Form
     CONTACT_ADMIN_EMAIL=marcus@marcusgoll.com
     ```
   - **Document**: Add comments explaining staging vs production values (test keys vs real keys)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- **Platform**: Hetzner VPS + Docker (existing deployment, no changes)
- **Env vars**: 3 new required (see above), document in `.env.example` and update VPS `.env` file
- **Breaking changes**: None (new feature, additive only)
- **Migration**: Not required (no database changes for MVP)

**Build Commands**:
- **No changes** (standard `npm run build`, existing Next.js build process)

**Environment Variables** (update secrets in GitHub + VPS):

**New Required**:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key (client-side, public)
  - Staging: Cloudflare test key (always passes)
  - Production: Real Turnstile site key from Cloudflare dashboard
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key (server-side, secret)
  - Staging: Cloudflare test secret
  - Production: Real Turnstile secret key from Cloudflare dashboard
- `CONTACT_ADMIN_EMAIL`: Admin email to receive contact submissions
  - Staging: `test@marcusgoll.com` (for testing)
  - Production: `marcus@marcusgoll.com` (actual admin email)

**Existing (No Changes)**:
- `RESEND_API_KEY`: Already configured
- `NEWSLETTER_FROM_EMAIL`: Reuse for contact form
- `PUBLIC_URL`: Already configured

**Deployment Steps**:
1. Create Cloudflare Turnstile app (get site key + secret)
2. Update `.env.example` with placeholder values
3. Add env vars to GitHub Secrets (for CI/CD)
4. Add env vars to VPS `.env` file (SSH to VPS, nano .env)
5. Merge PR (GitHub Actions builds + deploys)
6. Restart Docker container (picks up new env vars)
7. Verify Turnstile widget loads on /contact page
8. Test form submission end-to-end

**Database Migrations**:
- **No** (email-only MVP, no DB schema changes)

**Smoke Tests** (for GitHub Actions):
- Route: GET /contact (page loads)
- Expected: 200 status, HTML contains "Contact"
- Route: POST /api/contact (with invalid data)
- Expected: 400 status, JSON error response
- Route: POST /api/contact (with valid data, test Turnstile token)
- Expected: 200 status if Turnstile passes OR 400 if token invalid (depends on env)

**Platform Coupling**:
- **Vercel**: None (self-hosted on VPS, no Vercel-specific features)
- **Railway**: None (not using Railway)
- **Dependencies**: New - `@cloudflare/turnstile` (client library for widget)

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- ✅ No breaking NEXT_PUBLIC_* env var changes without migration (adding new vars OK)
- ✅ Backward-compatible API changes only (new endpoint /api/contact, no changes to existing)
- ✅ Database migrations are reversible (N/A - no database changes)
- ✅ Feature flags default to 0% in production (N/A - no feature flags needed)

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Given user visits /contact
When user fills out form with valid data
Then form submits successfully
  And admin receives email notification
  And user receives auto-reply email
  And response time < 3s
  And no console errors
  And Lighthouse accessibility score ≥ 95

Given bot fills honeypot field
When bot submits form
Then submission is rejected with 400 status
  And no emails are sent

Given user submits 3 times in 15 minutes
When user tries 4th submission
Then submission is rejected with 429 status
  And Retry-After header is present
```

**Rollback Plan**:
- **Deploy IDs tracked in**: `specs/054-contact-form-serverless/NOTES.md` (Deployment Metadata)
- **Rollback commands**:
  - Quick: Git revert last commit + redeploy (GitHub Actions auto-deploys)
  - Full: SSH to VPS → docker-compose down → git checkout previous commit → docker-compose up
- **Special considerations**: None (feature is additive, no database changes, no breaking changes)
- **Duration**: < 5 minutes (git revert + CI/CD redeploy)

**Artifact Strategy** (build-once-promote-many):
- **Web (App)**: Docker image `ghcr.io/marcusgoll/marcusgoll:<commit-sha>` (NOT :latest)
- **Build in**: `.github/workflows/verify.yml` (on PR + main push)
- **Deploy to production**: `.github/workflows/deploy-production.yml` (on main push, uses Docker image)
- **Promotion**: N/A (direct-prod model, no staging environment currently)

---

## [INTEGRATION SCENARIOS]

See: `quickstart.md` (if created) or inline below

**Scenario 1: Local Development Setup**
```bash
# 1. Install dependencies
npm install

# 2. Add environment variables to .env.local
cp .env.example .env.local
# Edit .env.local with Cloudflare Turnstile test keys:
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA (always passes)
# TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA (test secret)
# CONTACT_ADMIN_EMAIL=test@localhost

# 3. Start dev server
npm run dev

# 4. Visit http://localhost:3000/contact
# 5. Test form submission (test keys always pass)
```

**Scenario 2: Manual Testing Checklist**
```
# Form Validation (Client-Side)
- [ ] Name required (inline error if empty)
- [ ] Email format validation (RFC 5322 regex)
- [ ] Subject dropdown shows 6 options
- [ ] Message min 500 chars (inline error if too short)
- [ ] Message max 10,000 chars (inline error if too long)

# Form Submission (Happy Path)
- [ ] Fill form with valid data
- [ ] Turnstile widget loads (invisible)
- [ ] Submit button disabled while submitting
- [ ] Success message displays within 3s
- [ ] Form clears after success
- [ ] Admin receives email with sender info + message
- [ ] Sender receives auto-reply with confirmation

# Spam Protection
- [ ] Fill honeypot field (manually via DevTools)
- [ ] Submission rejected with 400 status
- [ ] No emails sent

# Rate Limiting
- [ ] Submit 3 times within 15 minutes
- [ ] 4th submission rejected with 429 status
- [ ] Retry-After header present
- [ ] Error message shows retry time

# Progressive Enhancement
- [ ] Disable JavaScript in browser
- [ ] Form still submits (standard HTML form action)
- [ ] Server-side validation catches errors
- [ ] Success/error displayed via page reload

# Accessibility (WCAG 2.1 AA)
- [ ] Keyboard navigation works (tab through fields)
- [ ] Screen reader announces labels and errors
- [ ] Focus states visible
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Form works with keyboard only (no mouse)

# Mobile Responsive
- [ ] Test on 375px width (iPhone SE)
- [ ] All fields readable and tappable
- [ ] No horizontal scroll
- [ ] Submit button accessible
```

**Scenario 3: Production Deployment**
```bash
# 1. Get Cloudflare Turnstile keys
# - Visit https://dash.cloudflare.com/turnstile
# - Create new site widget (marcusgoll.com)
# - Copy Site Key + Secret Key

# 2. Add env vars to GitHub Secrets (for CI/CD)
gh secret set NEXT_PUBLIC_TURNSTILE_SITE_KEY --body "your_site_key"
gh secret set TURNSTILE_SECRET_KEY --body "your_secret_key"
gh secret set CONTACT_ADMIN_EMAIL --body "marcus@marcusgoll.com"

# 3. SSH to VPS and update .env file
ssh hetzner
cd /path/to/marcusgoll
nano .env
# Add:
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
# TURNSTILE_SECRET_KEY=your_secret_key
# CONTACT_ADMIN_EMAIL=marcus@marcusgoll.com

# 4. Merge PR to main (GitHub Actions auto-deploys)
gh pr merge 123 --squash

# 5. Monitor deployment
gh run list --workflow=deploy-production.yml

# 6. Verify deployment
curl https://marcusgoll.com/contact  # Page loads
curl -X POST https://marcusgoll.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"General Inquiry","message":"'$(python3 -c "print('a'*500)")'"}'  # Should fail (no Turnstile token)

# 7. Manual smoke test
# - Visit https://marcusgoll.com/contact
# - Fill out form with real data
# - Verify admin email received
# - Verify auto-reply received
```

---

## [ANTI-HALLUCINATION CHECKLIST]

**Verified Facts** (cited sources):
- ✅ Email service exists at `lib/newsletter/email-service.ts` (338 lines, read and confirmed)
- ✅ Rate limiter exists at `lib/newsletter/rate-limiter.ts` (107 lines, checkRateLimit function confirmed)
- ✅ Zod validation pattern exists at `lib/newsletter/validation-schemas.ts` (102 lines, confirmed)
- ✅ API route pattern exists at `app/api/newsletter/subscribe/route.ts` (167 lines, confirmed)
- ✅ Tech stack confirmed from `docs/project/tech-stack.md` (Next.js 15.5.6, React 19, TypeScript 5.9.3, Tailwind 4.1.15, Zod 4.1.12)
- ✅ Deployment model confirmed from `docs/project/deployment-strategy.md` (direct-prod, Hetzner VPS, Docker, GitHub Actions)
- ✅ API strategy confirmed from `docs/project/api-strategy.md` (REST over HTTPS, rate limiting, Zod validation, no auth for public endpoints)
- ✅ Cloudflare Turnstile requirement from spec.md line 104-105 (FR-004: "System MUST implement Cloudflare Turnstile invisible challenge")
- ✅ Email-only storage from spec.md line 152 ("Email-only implementation" in Deployment Considerations)
- ✅ Rate limit 3 req/15min from spec.md line 110 (FR-006: "3 requests per 15 minutes per IP")

**No Hallucinations** (all recommendations grounded in existing code or explicit spec requirements)
