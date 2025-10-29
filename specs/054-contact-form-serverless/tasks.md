# Tasks: Contact Form (Serverless)

## [CODEBASE REUSE ANALYSIS]

Scanned: `/d/Coding/marcusgoll`

**[EXISTING - REUSE]**
- ✅ Email service (lib/newsletter/email-service.ts) - Resend client, maskEmail(), async pattern
- ✅ Rate limiter (lib/newsletter/rate-limiter.ts) - In-memory limiting, getClientIp()
- ✅ Validation patterns (lib/newsletter/validation-schemas.ts) - Zod schemas, email regex
- ✅ API route pattern (app/api/newsletter/subscribe/route.ts) - Rate limit → Validate → Process
- ✅ UI components (components/ui/button.tsx, card.tsx) - Button, Card for form layout
- ✅ Environment vars (RESEND_API_KEY, NEWSLETTER_FROM_EMAIL) - Already configured
- ✅ Analytics tracking (lib/analytics.ts) - PostHog event tracking pattern
- ✅ Env validation (lib/env-schema.ts) - Zod-based environment validation

**[NEW - CREATE]**
- 🆕 Contact API endpoint (app/api/contact/route.ts) - No existing contact endpoint
- 🆕 Turnstile verifier (lib/contact/turnstile-verifier.ts) - No existing spam protection
- 🆕 Contact validation schema (lib/contact/validation-schema.ts) - Contact-specific fields
- 🆕 Contact email templates (lib/contact/email-templates.ts) - Admin + auto-reply templates
- 🆕 Contact page (app/contact/page.tsx) - New page route
- 🆕 Contact form component (components/contact/ContactForm.tsx) - New form UI
- 🆕 Turnstile widget integration - Client-side Cloudflare Turnstile

---

## [DEPENDENCY GRAPH]

Story completion order:
1. **Phase 1**: Setup (environment, dependencies, structure)
2. **Phase 2**: Foundational (shared utilities blocking all stories)
3. **Phase 3**: US1 [P1] - Core form submission (independent)
4. **Phase 4**: US2 [P1] - Spam protection (depends on US1 API endpoint)
5. **Phase 5**: US3 [P1] - Validation & UX (depends on US1 form component)
6. **Phase 6**: US4 [P2] - Rate limiting & subject dropdowns (independent)
7. **Phase 7**: US5 [P2] - Auto-reply email (depends on US1 email flow)
8. **Phase 8**: Polish & deployment prep (depends on all stories)

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 2**: T005, T006, T007 (different modules, no dependencies)
- **Phase 3**: T010, T011 (email templates + validation schema)
- **Phase 4**: T020, T021 (Turnstile verifier + widget integration)
- **Phase 5**: T030, T031 (client validation + error states)
- **Phase 6**: T040, T041 (rate limiter integration + subject dropdown)
- **Phase 7**: T050 (independent - auto-reply template)
- **Phase 8**: T060, T061, T062 (analytics, health check, docs - all independent)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phases 1-5 (US1, US2, US3 - Core form with spam protection and validation)

**Incremental Delivery**:
1. Phase 1-3 → US1 (basic form submission) → local testing
2. Phase 4 → US2 (spam protection) → local testing
3. Phase 5 → US3 (validation UX) → local testing
4. Phase 6-7 → US4-US5 (rate limiting, auto-reply) → staging validation
5. Phase 8 → Polish → production deployment

**Testing Approach**: Integration testing preferred (spec does not require TDD)
- Unit tests for validation schemas and utilities
- Integration tests for API endpoint (E2E flow)
- Manual testing for UI/UX and spam protection

---

## Phase 1: Setup

- [ ] T001 Create project structure per plan.md
  - Directories: app/api/contact/, app/contact/, lib/contact/, components/contact/
  - Pattern: Existing app/api/newsletter/ structure
  - From: plan.md [STRUCTURE]

- [ ] T002 [P] Install Cloudflare Turnstile dependency
  - Command: `npm install @cloudflare/turnstile`
  - Verify version: @cloudflare/turnstile@0.x (< 5KB gzipped)
  - From: plan.md [ARCHITECTURE DECISIONS]

- [ ] T003 [P] Update environment variables in .env.example
  - Add: TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, CONTACT_ADMIN_EMAIL
  - Documentation: Add comments explaining each variable's purpose
  - Pattern: Existing .env.example structure with comments
  - From: plan.md [ARCHITECTURE DECISIONS]

- [ ] T004 [P] Update lib/env-schema.ts with new environment variables
  - Add Zod validation: TURNSTILE_SITE_KEY (string, min 1), TURNSTILE_SECRET_KEY (string, min 1), CONTACT_ADMIN_EMAIL (email format)
  - Export types: Update Env type to include new fields
  - REUSE: Existing Zod schema patterns (lib/env-schema.ts)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Shared utilities and validation schemas that block all user stories

- [ ] T005 [P] Create contact validation schema in lib/contact/validation-schema.ts
  - Schema fields:
    - `name`: z.string().min(1, "Name required").max(100, "Name too long")
    - `email`: z.string().email("Invalid email format")
    - `subject`: z.enum(["General Inquiry", "Aviation Consulting", "Dev/Startup Collaboration", "CFI Training Resources", "Speaking/Workshop Request", "Other"])
    - `message`: z.string().min(500, "Message must be at least 500 characters").max(10000, "Message too long")
    - `turnstileToken`: z.string().min(1, "Security verification required")
    - `honeypot`: z.string().max(0) (reject if filled - anti-spam)
  - Export: ContactFormSchema, ContactFormData type (inferred from schema)
  - REUSE: Zod patterns from lib/newsletter/validation-schemas.ts (email regex, error messages)
  - Pattern: lib/newsletter/validation-schemas.ts
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #2

- [ ] T006 [P] Create Turnstile verifier in lib/contact/turnstile-verifier.ts
  - Function: `async verifyTurnstileToken(token: string, ip: string): Promise<{success: boolean, error?: string}>`
  - API call: POST https://challenges.cloudflare.com/turnstile/v0/siteverify
  - Body: { secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }
  - Error handling: Network errors, invalid tokens, timeout (5s max)
  - REUSE: Fetch pattern from lib/newsletter/email-service.ts
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #3

- [ ] T007 [P] Create contact email templates in lib/contact/email-templates.ts
  - Template 1: `getAdminNotificationEmail(data: ContactFormData): {subject, html, text}`
    - Subject: "[Contact Form] {subject} - {name}"
    - HTML: Professional email with sender details, message content, reply-to header
    - Text: Plain text fallback
  - Template 2: `getAutoReplyEmail(senderName: string): {subject, html, text}`
    - Subject: "Message received - Marcus Gollahon"
    - HTML: Thank you message, expected response time (24-48 hours), professional signature
    - Text: Plain text fallback
  - REUSE: HTML email patterns from lib/newsletter/email-service.ts
  - Pattern: lib/newsletter/email-service.ts (maskEmail, HTML structure)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

---

## Phase 3: User Story 1 [P1] - Core Form Submission

**Story Goal**: Site visitor can submit a message to Marcus with name, email, subject, and message

**Independent Test Criteria**:
- [ ] Valid form submission → 200 response with success message
- [ ] Admin receives email notification with sender details + message
- [ ] Sender receives auto-reply confirmation email
- [ ] Form clears after successful submission

### Implementation

- [ ] T010 [P] [US1] Create POST /api/contact endpoint in app/api/contact/route.ts
  - Request handling:
    1. Extract client IP (getClientIp from rate-limiter)
    2. Parse request body (JSON.parse)
    3. Validate with ContactFormSchema (Zod)
    4. Verify Turnstile token (verifyTurnstileToken)
    5. Check honeypot field (reject if not empty)
    6. Send admin notification email (Resend)
    7. Send auto-reply email (Resend async)
    8. Return 200 with success message
  - Error handling:
    - 400: Validation errors, failed Turnstile, honeypot filled
    - 429: Rate limit exceeded (added in Phase 6)
    - 500: Email service errors, server errors
  - REUSE:
    - Rate limiter: lib/newsletter/rate-limiter.ts (checkRateLimit, getClientIp)
    - Email service: lib/newsletter/email-service.ts (getResendClient, maskEmail)
  - Pattern: app/api/newsletter/subscribe/route.ts (Rate limit → Validate → Process → Respond)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #1

- [ ] T011 [P] [US1] Create contact page in app/contact/page.tsx
  - Metadata: title "Contact | Marcus Gollahon", description "Get in touch with Marcus"
  - Layout: Container with Card (components/ui/card.tsx)
  - Content:
    - Heading: "Get in Touch"
    - Subheading: Expected response time (24-48 hours)
    - ContactForm component (created in T012)
  - SEO: Add JSON-LD structured data (ContactPage schema)
  - REUSE: Container (components/ui/Container.tsx), Card (components/ui/card.tsx)
  - Pattern: Existing app pages (app/about/page.tsx or similar)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #5

- [ ] T012 [US1] Create ContactForm component in components/contact/ContactForm.tsx
  - State management:
    - Form data (name, email, subject, message, honeypot)
    - Submission state (idle, submitting, success, error)
    - Turnstile token (from widget callback)
  - Form fields:
    1. Name input (text, max 100 chars)
    2. Email input (email type, validation)
    3. Subject dropdown (6 options from validation schema)
    4. Message textarea (min 500, max 10000 chars, char counter)
    5. Honeypot field (hidden with CSS, aria-hidden)
    6. Turnstile widget (invisible mode)
  - Submit handler:
    - Client-side validation (Zod schema)
    - POST /api/contact with form data + turnstileToken
    - Show loading state during submission
    - Handle success (show message, clear form, reset Turnstile)
    - Handle errors (show error message, keep form data)
  - Progressive enhancement: Form works without JS (server validation only)
  - REUSE:
    - Button: components/ui/button.tsx
    - Validation: lib/contact/validation-schema.ts (client-side check)
  - Pattern: components/newsletter/NewsletterSignupForm.tsx (form handling, loading states)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #6

---

## Phase 4: User Story 2 [P1] - Spam Protection

**Story Goal**: Contact submissions are protected from spam bots (Turnstile + honeypot)

**Independent Test Criteria**:
- [ ] Submission with filled honeypot field → 400 error (silently rejected)
- [ ] Submission with invalid Turnstile token → 400 error
- [ ] Submission with valid Turnstile token → Success (200)
- [ ] Bot traffic blocked at >95% rate (manual verification in production)

### Implementation

- [ ] T020 [P] [US2] Add Turnstile widget to ContactForm component
  - Integration:
    - Load Turnstile script: `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer>`
    - Add widget div: `<div class="cf-turnstile" data-sitekey={NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-callback="onTurnstileSuccess">`
    - Store token in state on callback
  - Mode: Invisible (no user interaction unless suspicious)
  - Callback: Update turnstileToken state when challenge completes
  - Reset: Clear token after submission (success or error)
  - File: components/contact/ContactForm.tsx (modify T012)
  - From: plan.md [ARCHITECTURE DECISIONS] - Cloudflare Turnstile

- [ ] T021 [P] [US2] Add honeypot field to ContactForm component
  - Field: Hidden text input with name "website" or "url" (bot-attracting name)
  - Styling: position: absolute; left: -9999px; (invisible to users, visible to bots)
  - Accessibility: aria-hidden="true" (screen readers ignore)
  - Validation: Must be empty (reject if filled in validation schema)
  - File: components/contact/ContactForm.tsx (modify T012)
  - Pattern: Common honeypot technique (research.md references)
  - From: plan.md [ARCHITECTURE DECISIONS] - Honeypot field

- [ ] T022 [US2] Update API endpoint to verify spam protection
  - Add Turnstile verification before email sending:
    1. Extract turnstileToken from request body
    2. Call verifyTurnstileToken(token, clientIp)
    3. If verification fails → return 400 with "Security verification failed"
  - Add honeypot check before email sending:
    1. Check if honeypot field is filled
    2. If filled → return 400 with generic error (don't reveal anti-spam mechanism)
  - File: app/api/contact/route.ts (modify T010)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #1 (Features section)

---

## Phase 5: User Story 3 [P1] - Validation & UX

**Story Goal**: Clear validation errors if invalid data submitted

**Independent Test Criteria**:
- [ ] Submit empty name → "Name required" error shown inline
- [ ] Submit invalid email → "Invalid email format" error shown inline
- [ ] Submit message < 500 chars → "Message must be at least 500 characters" error shown
- [ ] All validation errors clear when fixed (real-time feedback)

### Implementation

- [ ] T030 [P] [US3] Add client-side validation to ContactForm component
  - Validation triggers:
    - onChange: Real-time validation for email format, message length
    - onBlur: Validate field completeness (name, email, subject)
    - onSubmit: Full validation before API call
  - Display:
    - Inline error messages below each field (red text, small font)
    - Field highlighting (red border) for invalid fields
    - Success state (green checkmark) for valid fields
  - Implementation:
    - Use ContactFormSchema.safeParse() for validation
    - Extract field-specific errors from Zod result
    - Show/hide errors based on validation state
  - File: components/contact/ContactForm.tsx (modify T012)
  - REUSE: Validation schema from lib/contact/validation-schema.ts
  - Pattern: components/newsletter/NewsletterSignupForm.tsx (error display)
  - From: spec.md US3 Acceptance Criteria

- [ ] T031 [P] [US3] Add character counter to message textarea
  - Display: "XXX / 10,000 characters (min 500)" below textarea
  - States:
    - < 500 chars: Red text + "Minimum 500 characters required"
    - 500-10,000 chars: Gray text (neutral)
    - > 10,000 chars: Red text + "Maximum 10,000 characters"
  - Update on every keystroke (onChange)
  - File: components/contact/ContactForm.tsx (modify T012)
  - Pattern: Common textarea counter pattern
  - From: spec.md US3 Acceptance (message length validation)

- [ ] T032 [US3] Add success/error state UI to ContactForm component
  - Success state (after 200 response):
    - Show success message: "Message sent! I'll respond within 24-48 hours."
    - Green alert box with checkmark icon
    - Clear form data after 3 seconds
    - Reset Turnstile widget
  - Error state (after 400/500 response):
    - Show error message from API response
    - Red alert box with error icon
    - Keep form data (don't clear)
    - Allow retry without re-filling form
  - Loading state (during submission):
    - Disable submit button ("Sending...")
    - Show spinner icon on button
    - Disable all form fields (prevent changes)
  - File: components/contact/ContactForm.tsx (modify T012)
  - REUSE: Alert patterns (components/ui/alert.tsx if exists, or inline)
  - Pattern: components/newsletter/NewsletterSignupForm.tsx (success/error states)
  - From: spec.md US3 Acceptance + spec.md Acceptance Scenario #3

---

## Phase 6: User Story 4 [P2] - Rate Limiting & Subject Dropdown

**Story Goal**: Rate limiting prevents spam (3 submissions per 15 min per IP) + subject categorization

**Independent Test Criteria**:
- [ ] 4th submission within 15 min → 429 error with "Too many requests" message
- [ ] Subject dropdown shows 6 options (spec.md FR-002)
- [ ] Rate limit resets after 15 minutes (manual timing test)

### Implementation

- [ ] T040 [P] [US4] Add rate limiting to API endpoint
  - Integration:
    1. Extract client IP (getClientIp from rate-limiter)
    2. Check rate limit: checkRateLimit(ip, 3, 900000) before validation
    3. If limit exceeded → return 429 with "Too many requests. Please try again in X minutes."
    4. Include Retry-After header (seconds until window reset)
  - Config: 3 requests per 15 minutes (900,000 ms) per IP
  - File: app/api/contact/route.ts (modify T010 - add as first check)
  - REUSE: lib/newsletter/rate-limiter.ts (checkRateLimit, getClientIp)
  - Pattern: app/api/newsletter/subscribe/route.ts (rate limiting implementation)
  - From: spec.md US4 Acceptance + spec.md Acceptance Scenario #5

- [ ] T041 [P] [US4] Update subject dropdown with all 6 options
  - Options (from spec.md FR-002):
    1. "General Inquiry"
    2. "Aviation Consulting"
    3. "Dev/Startup Collaboration"
    4. "CFI Training Resources"
    5. "Speaking/Workshop Request"
    6. "Other"
  - Default: No selection (force user to choose)
  - Validation: Required field (Zod enum in validation schema)
  - File: components/contact/ContactForm.tsx (modify T012 - subject field)
  - From: spec.md FR-002 + plan.md validation schema

---

## Phase 7: User Story 5 [P2] - Auto-Reply Email

**Story Goal**: Sender receives confirmation email after successful submission

**Independent Test Criteria**:
- [ ] Successful submission → Sender receives auto-reply within 5 seconds
- [ ] Auto-reply contains: Thank you message, expected response time (24-48 hours), professional signature
- [ ] Auto-reply has proper From header (Marcus's name + NEWSLETTER_FROM_EMAIL)

### Implementation

- [ ] T050 [US5] Add auto-reply email to API endpoint
  - Integration (in app/api/contact/route.ts after admin email):
    1. Get auto-reply template: getAutoReplyEmail(data.name)
    2. Send email: resend.emails.send({
         from: `Marcus Gollahon <${NEWSLETTER_FROM_EMAIL}>`,
         to: data.email,
         subject: template.subject,
         html: template.html,
         text: template.text
       })
    3. Fire-and-forget (async, don't block response)
    4. Log errors but don't fail request if auto-reply fails
  - File: app/api/contact/route.ts (modify T010 - add after admin email)
  - REUSE:
    - Resend client: lib/newsletter/email-service.ts (getResendClient)
    - Auto-reply template: lib/contact/email-templates.ts (getAutoReplyEmail from T007)
  - Pattern: app/api/newsletter/subscribe/route.ts (async email sending)
  - From: spec.md US5 Acceptance + plan.md [NEW INFRASTRUCTURE - CREATE] #1

---

## Phase 8: Polish & Cross-Cutting Concerns

### Error Handling & Resilience

- [ ] T060 [P] Add comprehensive error handling to API endpoint
  - Error categories:
    1. Validation errors (400): Return field-specific errors from Zod
    2. Rate limit errors (429): Return retry-after time
    3. Turnstile errors (400): Return "Security verification failed"
    4. Email service errors (500): Return "Failed to send message. Please try again."
    5. Server errors (500): Return generic error + log to console
  - Error logging:
    - Log all errors with: timestamp, error type, request IP, user agent
    - Mask PII (email, name) in logs using maskEmail pattern
    - Add to specs/054-contact-form-serverless/error-log.md if recurring
  - File: app/api/contact/route.ts (modify T010 - enhance error handling)
  - REUSE: maskEmail from lib/newsletter/email-service.ts
  - Pattern: app/api/newsletter/subscribe/route.ts (error handling structure)
  - From: plan.md [DEPLOYMENT ACCEPTANCE] - Error handling requirements

- [ ] T061 [P] Add retry logic for email sending
  - Implementation:
    - Wrap Resend API calls in try-catch with 2 retries
    - Exponential backoff: 1s, 2s between retries
    - Log retry attempts with context
    - If all retries fail → log error, return 500 to user
  - Scope: Admin notification only (critical), auto-reply fails silently
  - File: app/api/contact/route.ts (modify T010 - enhance email sending)
  - Pattern: Standard retry pattern with exponential backoff
  - From: plan.md [DEPLOYMENT ACCEPTANCE] - Resilience requirements

### Deployment Preparation

- [ ] T062 [P] Add analytics instrumentation for contact form
  - Events to track (PostHog):
    1. `contact_form_viewed` - Page load (app/contact/page.tsx)
    2. `contact_form_started` - User focuses first field
    3. `contact_form_submitted` - Form submission attempt
    4. `contact_form_success` - Successful submission (200 response)
    5. `contact_form_error` - Failed submission (error type, status code)
  - Properties: subject, message_length, has_turnstile_token, client_ip (hashed)
  - Triple instrumentation:
    - PostHog: posthog.capture(event, properties)
    - Console logs: console.log({ event, ...properties, timestamp })
    - Database: (optional for US6 - future) POST /api/metrics
  - File: components/contact/ContactForm.tsx (modify T012 - add tracking)
  - REUSE: lib/analytics.ts (PostHog client patterns)
  - Pattern: components/newsletter/NewsletterSignupForm.tsx (analytics tracking)
  - From: plan.md [DEPLOYMENT ACCEPTANCE] - Analytics requirements

- [ ] T063 [P] Document rollback procedure in NOTES.md
  - Rollback steps:
    1. **Feature flag kill switch**: Set NEXT_PUBLIC_CONTACT_FORM_ENABLED=false in .env (add to T004)
    2. **Code rollback**: `git revert <commit-hash>` (delete /app/api/contact, /app/contact, /lib/contact, /components/contact)
    3. **Environment cleanup**: Remove TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, CONTACT_ADMIN_EMAIL from .env
  - Validation: After rollback → /contact returns 404, /api/contact returns 404
  - File: specs/054-contact-form-serverless/NOTES.md
  - From: plan.md [DEPLOYMENT ACCEPTANCE] - Rollback capability

- [ ] T064 [P] Add health check for contact form
  - Endpoint: Add GET /api/contact to route.ts (alongside POST)
  - Response: { status: "ok", service: "contact-form", checks: { resend: boolean, turnstile_config: boolean } }
  - Checks:
    1. Resend API key configured (RESEND_API_KEY exists)
    2. Turnstile keys configured (TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY exist)
    3. Admin email configured (CONTACT_ADMIN_EMAIL exists)
  - Status: 200 if all checks pass, 503 if any fail
  - File: app/api/contact/route.ts (add GET handler)
  - Pattern: app/api/health/route.ts (health check structure)
  - From: plan.md [CI/CD IMPACT] - Health check requirements

- [ ] T065 Add feature to navigation menu
  - Update: components/layout/Header.tsx (add "Contact" link to nav menu)
  - Link: href="/contact", text "Contact"
  - Position: After "About" link (if exists), before "Newsletter"
  - Mobile: Include in mobile menu dropdown
  - File: components/layout/Header.tsx
  - Pattern: Existing nav links in Header component
  - From: Standard navigation pattern for new pages

- [ ] T066 Update .env.example with Turnstile setup instructions
  - Add comments above TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY:
    ```
    # Cloudflare Turnstile (spam protection for contact form)
    # Get keys from: https://dash.cloudflare.com/?to=/:account/turnstile
    # 1. Create new site widget
    # 2. Choose "Invisible" mode
    # 3. Add your domain (or "localhost" for dev)
    # 4. Copy Site Key and Secret Key below
    TURNSTILE_SITE_KEY=your_site_key_here
    TURNSTILE_SECRET_KEY=your_secret_key_here

    # Admin email to receive contact form submissions
    CONTACT_ADMIN_EMAIL=your_email@example.com
    ```
  - File: .env.example (modify T003 - add detailed instructions)
  - From: Developer experience best practices

---

## [TASK SUMMARY]

**Total Tasks**: 29
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US1 - Core Form): 3 tasks
- Phase 4 (US2 - Spam Protection): 3 tasks
- Phase 5 (US3 - Validation UX): 3 tasks
- Phase 6 (US4 - Rate Limiting): 2 tasks
- Phase 7 (US5 - Auto-Reply): 1 task
- Phase 8 (Polish): 10 tasks

**MVP Tasks**: 16 (Phases 1-5: Setup + US1 + US2 + US3)
**Enhancement Tasks**: 13 (Phases 6-8: US4 + US5 + Polish)

**Parallel Opportunities**: 15 tasks marked [P]

**User Story Breakdown**:
- US1 [P1]: 3 tasks (T010, T011, T012) - Core form submission
- US2 [P1]: 3 tasks (T020, T021, T022) - Spam protection
- US3 [P1]: 3 tasks (T030, T031, T032) - Validation & UX
- US4 [P2]: 2 tasks (T040, T041) - Rate limiting & subject dropdown
- US5 [P2]: 1 task (T050) - Auto-reply email

**Estimated Effort**: 18-22 hours total
- MVP (Phases 1-5): 12-14 hours
- Enhancements (Phases 6-8): 6-8 hours
