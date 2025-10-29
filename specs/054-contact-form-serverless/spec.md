# Feature Specification: Contact Form (Serverless)

**Branch**: `feature/054-contact-form-serverless`
**Created**: 2025-10-29
**Status**: Draft
**GitHub Issue**: #12 (ICE Score: 1.80)

## User Scenarios

### Primary User Story

Site visitors need a way to contact Marcus directly without exposing his personal email address publicly. The form should be easy to use, protected against spam, and reliably deliver messages.

### Acceptance Scenarios

1. **Given** a visitor wants to contact Marcus, **When** they navigate to /contact, **Then** they see a contact form with fields for name, email, subject dropdown, and message textarea
2. **Given** a visitor fills out the form completely and correctly, **When** they submit the form with valid Turnstile challenge, **Then** the message is sent to Marcus's admin email AND the sender receives an auto-reply confirmation
3. **Given** a visitor submits the form, **When** the submission succeeds, **Then** they see a success message with expected response time and the form clears
4. **Given** a bot attempts to submit the form, **When** the honeypot field is filled OR Turnstile validation fails, **Then** the submission is silently rejected without revealing anti-spam mechanisms
5. **Given** a user tries to spam the form, **When** they exceed 3 submissions in 15 minutes from the same IP, **Then** they receive a "Too many requests" error with retry-after information

### Edge Cases

- What happens when the email service (Resend) is down?
  → Display user-friendly error message, log error server-side for monitoring
- How does the system handle extremely long messages (>10,000 characters)?
  → Frontend validation prevents submission, backend validation truncates and warns
- What if a user submits the form without JavaScript enabled?
  → Progressive enhancement: form still works but without client-side validation and Turnstile (honeypot still protects)
- How is PII (sender email, IP address) handled?
  → Email masked in logs, IP only used for rate limiting (not stored permanently)

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a site visitor, I want to submit a message to Marcus with my name, email, subject, and detailed message so that I can reach him without exposing his email address
  - **Acceptance**: Form with 4 required fields (name, email, subject dropdown, message textarea 500+ chars) submits successfully and shows confirmation
  - **Independent test**: Form submission sends email to admin and auto-reply to sender
  - **Effort**: M (6 hours)

- **US2** [P1]: As Marcus, I want contact submissions to be protected from spam bots so that I only receive legitimate messages
  - **Acceptance**: Cloudflare Turnstile challenge + honeypot field blocks bot submissions (>95% spam rejection rate)
  - **Independent test**: Bot submissions with filled honeypot or failed Turnstile are rejected with 400 status
  - **Effort**: M (5 hours)

- **US3** [P1]: As a site visitor, I want clear validation errors if I submit invalid data so that I can correct my message
  - **Acceptance**: Client-side validation (Zod) shows inline errors for email format, message length (500 char min), required fields
  - **Independent test**: Invalid submissions show specific error messages without sending email
  - **Effort**: S (3 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As Marcus, I want to prevent form spam via rate limiting so that the same IP cannot flood my inbox
  - **Acceptance**: 3 submissions per 15 minutes per IP, 429 response with Retry-After header
  - **Depends on**: US1
  - **Effort**: S (3 hours)

- **US5** [P2]: As a sender, I want to receive an auto-reply confirmation so that I know my message was delivered successfully
  - **Acceptance**: Auto-reply email sent to sender with timestamp, expected response time, and message copy
  - **Depends on**: US1
  - **Effort**: S (2 hours)

**Priority 3 (Nice-to-have)**

- **US6** [P3]: As Marcus, I want contact messages stored in a database so that I can view submission history and analytics
  - **Acceptance**: Messages saved to PostgreSQL with metadata (IP, timestamp, Turnstile score)
  - **Depends on**: US1
  - **Effort**: M (4 hours)

- **US7** [P3]: As a site visitor, I want accessible keyboard navigation and screen reader support so that I can submit the form without a mouse
  - **Acceptance**: WCAG 2.1 AA compliance, full keyboard nav, ARIA labels, axe audit passes
  - **Depends on**: US1
  - **Effort**: S (3 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (core form with spam protection), validate delivery works reliably, then add US4-US5 (rate limiting + auto-reply), defer US6-US7 to later iterations based on feedback.

## Context Strategy & Signal Design

- **System prompt altitude**: Mid-level - API route handler with validation, email service integration, spam protection
- **Tool surface**: NextRequest/NextResponse (Next.js), Zod validation, Resend SDK, Turnstile verification API
- **Examples in scope**: Newsletter subscribe route (app/api/newsletter/subscribe/route.ts), email service (lib/newsletter/email-service.ts), rate limiter (lib/newsletter/rate-limiter.ts)
- **Context budget**: 15,000 tokens (specification + implementation examples)
- **Retrieval strategy**: JIT - Load email service and rate limiter patterns during implementation
- **Memory artifacts**: NOTES.md tracks environment variables, API patterns, spam protection decisions
- **Compaction cadence**: After spec validation, preserve core requirements and API contracts
- **Sub-agents**: None (single-file implementation for API route + form component)

## Requirements

### Functional (testable only)

**Form Fields**:
- **FR-001**: System MUST display a contact form with 4 required fields: name (text, max 100 chars), email (email format), subject (dropdown with predefined topics), message (textarea, min 500 chars, max 10,000 chars)
- **FR-002**: Subject dropdown MUST include options: "General Inquiry", "Aviation Consulting", "Dev/Startup Collaboration", "CFI Training Resources", "Speaking/Workshop Request", "Other"
- **FR-003**: System MUST validate email format using standard RFC 5322 regex pattern

**Spam Protection**:
- **FR-004**: System MUST implement Cloudflare Turnstile invisible challenge before form submission
- **FR-005**: System MUST include a honeypot field (CSS hidden, name="website") that rejects submissions if filled
- **FR-006**: System MUST rate limit submissions to 3 requests per 15 minutes per IP address using existing rate-limiter pattern (lib/newsletter/rate-limiter.ts)

**Email Handling**:
- **FR-007**: System MUST send contact message to admin email (configurable via CONTACT_ADMIN_EMAIL environment variable, defaults to marcus@marcusgoll.com)
- **FR-008**: Admin email MUST include: sender name, sender email, subject, message, submission timestamp (ISO 8601), sender IP address (for abuse tracking)
- **FR-009**: System MUST send auto-reply email to sender with: confirmation message, expected response time ("Marcus typically responds within 2-3 business days"), copy of original message, contact page link
- **FR-010**: All emails MUST use Resend service with FROM address from NEWSLETTER_FROM_EMAIL environment variable
- **FR-011**: System MUST mask sender email in server logs using existing maskEmail utility (lib/newsletter/email-service.ts pattern)

**Success/Error Handling**:
- **FR-012**: System MUST return 200 OK with {success: true, message: "Message sent successfully"} on successful submission
- **FR-013**: System MUST return 400 Bad Request with {success: false, message: string} for validation failures (with specific field errors from Zod)
- **FR-014**: System MUST return 429 Too Many Requests with Retry-After header for rate limit violations
- **FR-015**: System MUST return 500 Internal Server Error with generic message "Unable to send message" if email service fails (detailed error logged server-side only)
- **FR-016**: Frontend MUST display success message for 5 seconds, clear form fields, and show "Send another message" option
- **FR-017**: Frontend MUST display inline validation errors below each field with clear instructions to fix

**Data Validation**:
- **FR-018**: System MUST use Zod schema for type-safe validation of all request fields (name, email, subject, message, turnstileToken)
- **FR-019**: Message field MUST enforce minimum 500 characters to prevent low-effort spam
- **FR-020**: System MUST sanitize HTML/script tags from all text inputs to prevent XSS attacks

### Non-Functional

- **NFR-001**: Performance: API route MUST respond within 3 seconds for successful submissions (p95)
- **NFR-002**: Performance: Email delivery MUST be non-blocking (async fire-and-forget pattern, don't wait for Resend response)
- **NFR-003**: Accessibility: Form MUST meet WCAG 2.1 Level AA standards (4.5:1 contrast, keyboard nav, ARIA labels, screen reader tested)
- **NFR-004**: Mobile: Form MUST be fully responsive on screens 375px width and up (iPhone SE minimum)
- **NFR-005**: Error Handling: User-facing errors MUST be clear and actionable ("Email format invalid" not "Zod validation error")
- **NFR-006**: Security: Turnstile secret key MUST be server-side only, never exposed to client
- **NFR-007**: Security: Rate limiter MUST use IP address from x-forwarded-for header (Caddy proxy)
- **NFR-008**: Privacy: Sender IP address MUST NOT be stored permanently (only used for rate limiting, cleared after 15 minutes)
- **NFR-009**: Logging: All successful submissions MUST log to console with masked email: `[Contact] Message sent from m***@example.com (subject: Aviation Consulting)`
- **NFR-010**: Reliability: System MUST handle Resend API failures gracefully without crashing (catch errors, log, return 500)

### Key Entities (if data involved)

**ContactMessage** (optional, for future database storage - US6):
- **Purpose**: Store contact form submissions for analytics and history
- **Attributes**: id (UUID), sender_name (string), sender_email (string, encrypted), subject (string), message (text), ip_address (string, hashed), turnstile_score (float, 0-1), created_at (timestamp)
- **Relationships**: None (standalone entity)
- **Migration**: Deferred to US6 (MVP uses email-only, no database)

## Deployment Considerations

### Platform Dependencies

**Vercel** (marketing/app):
- None - Standard Next.js API route pattern, no edge runtime changes

**Railway** (API):
- N/A (self-hosted VPS, not using Railway)

**Dependencies**:
- Cloudflare Turnstile client library: @cloudflare/turnstile (new dependency, <5KB gzipped)
- All other dependencies already in package.json (Next.js, Zod, Resend)

### Environment Variables

**New Required Variables**:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key for client-side widget (staging: test key, production: production key)
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key for server-side verification (staging: test key, production: production key)
- `CONTACT_ADMIN_EMAIL`: Admin email address to receive contact form submissions (staging: test@marcusgoll.com, production: marcus@marcusgoll.com)

**Existing Variables** (already configured):
- `RESEND_API_KEY`: Already in use for newsletter (no changes needed)
- `NEWSLETTER_FROM_EMAIL`: Reuse for contact form FROM address (no changes needed)
- `PUBLIC_URL`: Already in use for email links (no changes needed)

**Schema Update Required**: Yes - Update .env.example with new Turnstile and admin email variables

### Breaking Changes

**API Contract Changes**:
- No breaking changes (new endpoint: POST /api/contact)

**Database Schema Changes**:
- No schema changes for MVP (database storage deferred to US6)

**Auth Flow Modifications**:
- No auth changes (contact form is public, no authentication required)

**Client Compatibility**:
- Backward compatible (new feature, no existing functionality affected)

### Migration Requirements

**Database Migrations**:
- Not required for MVP (email-only implementation)

**Data Backfill**:
- Not required

**RLS Policy Changes**:
- Not applicable (no database storage in MVP)

**Reversibility**:
- Fully reversible (delete /app/api/contact/route.ts, remove /app/contact page, revert .env.example)

### Rollback Considerations

**Standard Rollback**:
- Yes: 3-command rollback via git revert (feature is additive, no breaking changes)

**Special Rollback Needs**:
- None (new feature, doesn't modify existing functionality)

**Deployment Metadata**:
- Deploy IDs tracked in specs/054-contact-form-serverless/NOTES.md (Deployment Metadata section)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, UX, data, access)
- [x] No implementation details (tech stack, APIs, code)

### Conditional: Success Metrics (Skip if no user tracking)
- [ ] N/A - Internal tool, no complex user behavior tracking

### Conditional: UI Features (Skip if backend-only)
- [x] All screens identified with states (default, loading, success, error)
- [x] System components from ui-inventory.md planned (reuse existing form components)

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified (None - new feature only)
- [x] Environment variables documented (TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, CONTACT_ADMIN_EMAIL)
- [x] Rollback plan specified (standard git revert, additive feature)

---

## Screens Inventory (UI Features Only)

Screens to design:
1. **contact-form**: Contact form page - Primary action: "Send Message"
   - States: `default` (empty form), `validating` (client-side validation), `submitting` (API call in progress), `success` (message sent confirmation), `error` (validation or server error), `rate-limited` (429 response)
   - Components: FormField (input + label + error), Textarea, Select dropdown, Button (primary CTA), Turnstile widget (invisible), Alert (success/error messages)

2. **contact-success**: Success confirmation screen - Primary action: "Send Another Message"
   - States: `default` (success message displayed)
   - Components: Alert (success), Button (secondary CTA to reset form)

See `.spec-flow/templates/screens-yaml-template.yaml` for full screen definitions.

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: Structured logs, Resend webhook logs (future), Lighthouse CI.

### Data Collection

**Structured Logs** (server-side):
- `logger.info({ event: "contact.submitted", subject, ip_hash, timestamp })`
- `logger.error({ event: "contact.failed", error, email_masked })`
- `logger.warn({ event: "contact.rate_limited", ip_hash, retry_after })`

**Key Events to Track**:
1. `contact.page_view` - Visitors viewing contact page
2. `contact.form_started` - User focuses first field (engagement)
3. `contact.form_submitted` - Form submission attempt
4. `contact.success` - Successful message delivery
5. `contact.validation_error` - Client-side validation failure
6. `contact.spam_blocked` - Honeypot or Turnstile rejection
7. `contact.rate_limited` - Rate limit exceeded

### Measurement Queries

**Logs** (`logs/contact/*.jsonl`):
- Success rate: `grep '"event":"contact.success"' | wc -l / grep '"event":"contact.submitted"' | wc -l * 100`
- Spam block rate: `grep '"event":"contact.spam_blocked"' | wc -l / grep '"event":"contact.submitted"' | wc -l * 100`
- Average response time: `jq -r 'select(.event=="contact.success") | .duration' | awk '{sum+=$1; n++} END {print sum/n}'`

**Resend Dashboard** (manual check):
- Email delivery rate (admin + auto-reply emails)
- Bounce rate (invalid sender emails)

**Lighthouse** (`.lighthouseci/results/*.json`):
- Accessibility score for /contact page (target: ≥95)
- Performance: FCP <1.5s, TTI <3.5s

---

## Success Criteria

> All metrics must be measurable, technology-agnostic, user-focused, and verifiable.

**Core Functionality**:
1. Visitors can submit contact messages with name, email, subject, and message (min 500 chars)
2. Marcus receives all legitimate messages via email within 60 seconds of submission
3. Senders receive auto-reply confirmation within 60 seconds

**Spam Protection**:
4. Bot submissions with filled honeypot field are rejected (100% block rate)
5. Submissions without valid Turnstile token are rejected (100% block rate)
6. Users exceeding 3 submissions per 15 minutes receive rate limit error

**User Experience**:
7. Form validation errors display clear, actionable messages within 500ms
8. Success confirmation displays within 3 seconds of submission
9. Form is fully keyboard-navigable (all fields, submit button, Turnstile widget)
10. Screen readers announce all errors and success messages

**Performance & Reliability**:
11. API route responds within 3 seconds for 95% of submissions
12. Email service failures display user-friendly error (not stack traces)
13. Form works without JavaScript (progressive enhancement - basic HTML form submission)

**Security & Privacy**:
14. Sender email addresses are masked in server logs
15. IP addresses are used only for rate limiting (not stored permanently)
16. HTML/script tags in message body are sanitized before email delivery

