# Feature Specification: Multi-Track Newsletter Subscription System

**Branch**: `feature/048-multi-track-newsletter`
**Created**: 2025-10-28
**Status**: Draft

## User Scenarios

### Primary User Story

Visitors to marcusgoll.com want to stay updated on content that matches their interests. Some are pilots interested in aviation content, others are developers following startup/coding topics, and some educators care about teaching methodology. Currently, there's no way to subscribe to content updates, and when a newsletter system is added, users don't want to receive irrelevant content (e.g., aviation enthusiasts getting dev content they don't care about).

The multi-track newsletter system allows visitors to subscribe to one or more content tracks based on their interests, manage their preferences via email links, and unsubscribe easily with one click. The system respects user privacy (GDPR-compliant) and provides granular control over which newsletters they receive.

### Acceptance Scenarios

1. **Given** a visitor lands on the homepage footer, **When** they enter their email and select "Aviation" and "Dev/Startup" newsletters, **Then** they receive a welcome email with links to manage preferences and are added to both newsletter lists.

2. **Given** a subscribed user clicks "Manage preferences" in any newsletter email, **When** they land on the preference page, **Then** they see checkboxes for all 4 newsletter types with their current selections, can update them, and receive confirmation.

3. **Given** a subscribed user clicks "Unsubscribe" in any newsletter email, **When** they confirm unsubscription, **Then** they are removed from all newsletters, see a goodbye message, and receive a final confirmation email with an option to delete their data permanently (GDPR).

4. **Given** a user is subscribed to "All" newsletters, **When** a new post is published in any category, **Then** they receive an email notification regardless of the post's track.

5. **Given** a user is subscribed to "Aviation" only, **When** a new post is published in the "Dev/Startup" category, **Then** they do NOT receive an email notification.

6. **Given** a subscribed user tries to re-subscribe with the same email, **When** they submit the form, **Then** their preferences are updated (upserted) and they receive a confirmation email.

7. **Given** a previously unsubscribed user tries to re-subscribe, **When** they submit the signup form, **Then** their account is reactivated, preferences are updated, and they receive a welcome back email.

8. **Given** a user submits the signup form without selecting any newsletter types, **When** validation runs, **Then** they see an error message "Please select at least one newsletter."

### Edge Cases

- What happens when a user enters an invalid email format?
  - Frontend validation shows error before submission
  - Backend Zod schema validates and returns 400 Bad Request with error details

- How does the system handle duplicate emails?
  - Upsert logic updates existing subscriber's preferences instead of creating duplicate
  - Returns success with message "Preferences updated"

- What happens if Resend/Mailgun API is down during signup?
  - Subscriber is saved to database (ensures no data loss)
  - Background retry queue attempts to send welcome email later
  - User sees success message but may receive welcome email delayed

- How does the system prevent unsubscribe token guessing?
  - Token is 64-character hex string (32 random bytes) = 2^256 possible values
  - Cryptographically secure random generation
  - Single-use is not enforced (token remains valid for preference management)

- What happens if a user clicks unsubscribe multiple times?
  - Idempotent operation: returns success even if already unsubscribed
  - Does not send duplicate goodbye emails

- How does the system handle rate limiting abuse?
  - 5 requests per minute per IP address
  - Returns 429 Too Many Requests with retry-after header
  - Legitimate users unlikely to hit limit (normal signup is 1 request)

## User Stories (Prioritized)

> **Purpose**: Break down feature into independently deliverable stories for MVP-first delivery.
> **Format**: [P1] = MVP (ship first), [P2] = Enhancement, [P3] = Nice-to-have

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a visitor, I want to subscribe to specific newsletter tracks (aviation, dev, education, or all) so that I receive only content I care about
  - **Acceptance**:
    - Signup form displays 4 newsletter track options with descriptions
    - At least 1 track must be selected (validation error if none)
    - Email validation (RFC 5322 format)
    - Success message displays after signup
    - Subscriber row created in database with unique unsubscribe token
    - Preference rows created for selected tracks
  - **Independent test**: Submit signup form → verify database entries → verify welcome email sent
  - **Effort**: M (6 hours)

- **US2** [P1]: As a subscriber, I want to receive a welcome email with my newsletter selections and a link to manage preferences so that I know my signup was successful
  - **Acceptance**:
    - Welcome email sent within 30 seconds of signup
    - Email includes list of subscribed newsletters
    - Email includes "Manage preferences" link (token-based URL)
    - Email includes unsubscribe link
    - Email uses brand colors and tone (systematic clarity)
  - **Independent test**: Signup → check email → verify links work
  - **Effort**: M (4 hours)

- **US3** [P1]: As a subscriber, I want to update my newsletter preferences via a secure link in my email so that I can change which newsletters I receive without logging in
  - **Acceptance**:
    - Preference management page accessible via token URL
    - Page displays current email (read-only) and 4 checkboxes (current state)
    - User can check/uncheck any combination (at least 1 required)
    - Submit button updates preferences in database
    - Confirmation message displays after update
    - Confirmation email sent
  - **Independent test**: Click "Manage preferences" link → update selections → verify database update
  - **Effort**: M (5 hours)

- **US4** [P1]: As a subscriber, I want to unsubscribe from all newsletters with one click so that I can stop receiving emails immediately
  - **Acceptance**:
    - One-click unsubscribe link in all newsletter emails
    - Clicking link marks subscriber inactive and all preferences false
    - Unsubscribe confirmation page displays
    - Goodbye email sent (optional feedback survey link)
    - User can request hard delete (GDPR compliance)
  - **Independent test**: Click unsubscribe → verify database update → verify no more emails sent
  - **Effort**: S (3 hours)

- **US5** [P1]: As a subscriber, I want my data deleted permanently (GDPR right to deletion) so that no trace of my email remains in the system
  - **Acceptance**:
    - "Delete my data" link on unsubscribe confirmation page
    - Clicking triggers hard delete (CASCADE to preferences)
    - Confirmation page displays "Your data has been permanently deleted"
    - Email address can be used to re-subscribe later (no record exists)
  - **Independent test**: Unsubscribe → delete data → verify database row deleted → re-signup works
  - **Effort**: S (2 hours)

**Priority 2 (Enhancement)**

- **US6** [P2]: As a subscriber, I want to know how many people are on each newsletter so that I can see which topics are most popular
  - **Acceptance**:
    - Preference management page shows subscriber counts per newsletter
    - Counts update daily (cached)
    - Format: "Aviation (234 subscribers)"
  - **Depends on**: US1, US3
  - **Effort**: XS (1 hour)

- **US7** [P2]: As a content creator, I want to see newsletter signup analytics (sources, conversion rates) so that I can optimize signup placement
  - **Acceptance**:
    - Admin dashboard shows signups by source (footer, popup, post CTA)
    - Conversion rate calculated (signups / page views)
    - Time-series chart (last 30 days)
  - **Depends on**: US1
  - **Effort**: M (6 hours)

**Priority 3 (Nice-to-have)**

- **US8** [P3]: As a subscriber, I want to choose email frequency (immediate, daily digest, weekly) so that I control how often I receive emails
  - **Acceptance**:
    - Preference page includes frequency dropdown per newsletter
    - Backend queues emails based on frequency preference
    - Daily digest emails combine multiple posts
  - **Depends on**: US1, US3
  - **Effort**: L (12 hours)

- **US9** [P3]: As a subscriber, I want to receive a sample email before subscribing so that I know what to expect
  - **Acceptance**:
    - "Preview newsletter" link on signup form
    - Opens modal with sample email HTML
    - Sample includes real recent post
  - **Depends on**: US2
  - **Effort**: S (3 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US5 first (core subscription flow), validate with users for 2 weeks, then add US6-US7 (analytics), defer US8-US9 (frequency/preview) based on user feedback.

## Visual References

See `./visuals/README.md` for UI research and design patterns (if applicable)

## Success Metrics (HEART Framework)

> **Purpose**: Define quantified success criteria using Google's HEART framework.
> **Constraint**: All metrics MUST be Claude Code-measurable (SQL, logs, Lighthouse).

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Users find signup easy and clear | Error rate on signup | `SELECT COUNT(*) FILTER (WHERE outcome='error') / COUNT(*) FROM newsletter_events WHERE event='signup'` | <2% error rate | P95 response <500ms |
| **Engagement** | Users actively manage preferences | Preference updates per subscriber | `SELECT AVG(update_count) FROM (SELECT subscriber_id, COUNT(*) as update_count FROM newsletter_preferences GROUP BY subscriber_id)` | 0.3+ updates/subscriber (30% adjust preferences) | <10% unsubscribe rate |
| **Adoption** | Convert homepage visitors to subscribers | Signup conversion rate | `SELECT COUNT(DISTINCT subscriber_id) FROM newsletter_subscribers WHERE created_at >= NOW() - INTERVAL '30 days'` | 100 subscribers in 6 months (currently 0) | <$5 cost per subscriber (if paid ads used) |
| **Retention** | Subscribers stay active over time | 30-day retention rate | `SELECT COUNT(*) FILTER (WHERE active=true) / COUNT(*) FROM newsletter_subscribers WHERE created_at < NOW() - INTERVAL '30 days'` | 85% remain active after 30 days | <15% churn/month |
| **Task Success** | Users complete signup without abandonment | Signup completion rate | `SELECT COUNT(*) FILTER (WHERE outcome='completed') / COUNT(*) FROM newsletter_events WHERE event='signup_started'` | 80% complete signup | <30s P95 completion time |

**Performance Targets** (from `design/systems/budgets.md`):
- FCP <1.5s, TTI <3.5s, CLS <0.15, LCP <3.0s
- Lighthouse Performance ≥85, Accessibility ≥95

See `.spec-flow/templates/heart-metrics-template.md` for full measurement plan.

## Screens Inventory (UI Features Only)

> **Purpose**: Define screens for `/design-variations` workflow (Phase 1).

Screens to design:
1. **newsletter-signup-form**: Newsletter subscription form - Primary action: "Subscribe"
2. **preference-management**: Edit newsletter preferences - Primary action: "Update Preferences"
3. **unsubscribe-confirmation**: Unsubscribe confirmation and feedback - Primary action: "Delete My Data"

States per screen: `default`, `loading`, `empty`, `error`, `success`

See `.spec-flow/templates/screens-yaml-template.yaml` for full screen definitions.

## Context Strategy & Signal Design

- **System prompt altitude**: Mid-level (API implementation + form validation + email templates)
- **Tool surface**: Prisma (database), Zod (validation), Resend/Mailgun SDK (email)
- **Examples in scope**:
  1. Multi-checkbox form validation (at least 1 required)
  2. Token-based authentication for preference management
  3. Idempotent unsubscribe (handle duplicate clicks)
- **Context budget**: 50k tokens (specification phase)
- **Retrieval strategy**: JIT - fetch project docs (data-architecture.md, api-strategy.md) during planning
- **Memory artifacts**: NOTES.md updated after each phase, newsletter-metrics.md for analytics
- **Compaction cadence**: Summarize research after specification, compact implementation logs after deploy
- **Sub-agents**: None (integrated implementation)

## Requirements

### Functional (testable only)

**Newsletter Signup**
- **FR-001**: System MUST allow users to subscribe to one or more newsletter tracks ('aviation', 'dev-startup', 'education', 'all')
- **FR-002**: System MUST validate email addresses using RFC 5322 format
- **FR-003**: System MUST require at least one newsletter track selection during signup
- **FR-004**: System MUST generate a unique 64-character hex unsubscribe token for each subscriber
- **FR-005**: System MUST send a welcome email within 30 seconds of successful signup
- **FR-006**: System MUST handle duplicate email signups by updating (upserting) existing subscriber preferences

**Preference Management**
- **FR-007**: System MUST provide a secure preference management page accessible via unsubscribe token (no login required)
- **FR-008**: System MUST display current subscriber email (read-only) and current newsletter selections (checkboxes)
- **FR-009**: System MUST allow users to update preferences and save changes
- **FR-010**: System MUST send a confirmation email after preference updates
- **FR-011**: System MUST require at least one newsletter track to remain selected (cannot unsubscribe from all via preferences page)

**Unsubscribe**
- **FR-012**: System MUST provide one-click unsubscribe functionality via token link
- **FR-013**: System MUST mark subscriber as inactive and set all preferences to false when unsubscribing
- **FR-014**: System MUST display unsubscribe confirmation page
- **FR-015**: System MUST send goodbye email after unsubscription
- **FR-016**: System MUST support hard delete (GDPR right to deletion) via confirmation page
- **FR-017**: System MUST CASCADE delete newsletter preferences when subscriber record is deleted

**Email Delivery**
- **FR-018**: System MUST integrate with Resend or Mailgun for email delivery
- **FR-019**: System MUST include unsubscribe link in all newsletter emails
- **FR-020**: System MUST include preference management link in all newsletter emails
- **FR-021**: System MUST track email delivery status (sent, failed, bounced)

### Non-Functional

**Performance**
- **NFR-001**: Performance: API endpoints MUST respond within <200ms P50, <500ms P95
- **NFR-002**: Performance: Signup form submission MUST complete within <2s total (including email send)
- **NFR-003**: Performance: Database queries MUST execute within <100ms for reads, <200ms for writes

**Accessibility**
- **NFR-004**: Accessibility: All forms MUST meet WCAG 2.1 AA standards (keyboard navigation, screen reader support, 4.5:1 contrast)
- **NFR-005**: Accessibility: Form validation errors MUST be announced to screen readers
- **NFR-006**: Accessibility: Focus states MUST be clearly visible on all interactive elements

**Security & Privacy**
- **NFR-007**: Security: Unsubscribe tokens MUST be generated using cryptographically secure random bytes
- **NFR-008**: Security: All API inputs MUST be validated using Zod schemas
- **NFR-009**: Privacy: Email addresses MUST NOT appear in application logs (mask as `r***@example.com`)
- **NFR-010**: Privacy: System MUST comply with GDPR (right to deletion, data portability)
- **NFR-011**: Security: Rate limiting MUST prevent spam (5 requests per minute per IP)

**Reliability**
- **NFR-012**: Reliability: System MUST handle email service outages gracefully (queue retries, user sees success message)
- **NFR-013**: Reliability: Unsubscribe operations MUST be idempotent (clicking multiple times does not cause errors)
- **NFR-014**: Reliability: Database operations MUST use transactions (subscriber + preferences updated atomically)

**Mobile & Responsive**
- **NFR-015**: Mobile: Signup form MUST be fully functional on mobile devices (touch-friendly checkboxes, large tap targets)
- **NFR-016**: Mobile: Preference management page MUST render correctly on screens ≥320px wide

**Error Handling**
- **NFR-017**: Error Handling: User-facing error messages MUST be clear and actionable (no database error codes exposed)
- **NFR-018**: Error Handling: System MUST log all errors with sufficient context for debugging

### Key Entities (if data involved)

**Entity: NEWSLETTER_SUBSCRIBER**
- **Purpose**: Store subscriber email and global subscription status
- **Key Attributes**:
  - `id` (String/CUID) - Primary key
  - `email` (String, UNIQUE) - Subscriber email address
  - `active` (Boolean) - Global subscription status
  - `subscribed_at` (Timestamp) - Initial signup timestamp
  - `unsubscribed_at` (Timestamp, nullable) - Unsubscribe timestamp
  - `unsubscribe_token` (String, UNIQUE, 64-char hex) - Secure token for links
  - `source` (String, nullable) - Signup source (footer, popup, post-cta)
- **Relationships**: Has many NEWSLETTER_PREFERENCE

**Entity: NEWSLETTER_PREFERENCE**
- **Purpose**: Track which newsletters each subscriber wants
- **Key Attributes**:
  - `id` (String/CUID) - Primary key
  - `subscriber_id` (String, FK) - Reference to NEWSLETTER_SUBSCRIBER
  - `newsletter_type` (ENUM: aviation, dev-startup, education, all) - Newsletter category
  - `subscribed` (Boolean) - Opted in/out for this newsletter
  - `updated_at` (Timestamp) - Last preference change
- **Relationships**: Belongs to NEWSLETTER_SUBSCRIBER
- **Constraints**: UNIQUE(subscriber_id, newsletter_type)

## Deployment Considerations

> **Purpose**: Document deployment constraints and dependencies for planning phase.

### Platform Dependencies

**Next.js (Hetzner VPS + Docker)**:
- New API routes: `/api/newsletter/subscribe`, `/api/newsletter/preferences/:token`, `/api/newsletter/preferences`, `/api/newsletter/unsubscribe`
- Dockerfile unchanged (no new system dependencies)
- Docker Compose: No changes

**Dependencies**:
- New: `resend` or `@sendgrid/mail` (email delivery library)
- New: `crypto` (built-in Node.js, for token generation)

### Environment Variables

**New Required Variables**:
- `RESEND_API_KEY`: Resend API key for email delivery (staging: test key, production: live key)
- `NEWSLETTER_FROM_EMAIL`: Sender email address (e.g., "Marcus <hello@marcusgoll.com>")
- `NEWSLETTER_FROM_NAME`: Sender name (e.g., "Marcus Gollahon")
- `NEXT_PUBLIC_BASE_URL`: Base URL for preference/unsubscribe links (e.g., "https://marcusgoll.com")

**Schema Update Required**: Yes - Update `lib/env-schema.ts` to validate new variables

### Breaking Changes

**API Contract Changes**: No (new endpoints, no existing API to break)

**Database Schema Changes**:
- Yes: New tables `newsletter_subscribers` and `newsletter_preferences`
- Migration required: Create tables with constraints and indexes
- No breaking changes to existing schema

**Auth Flow Modifications**: No (public endpoints, no authentication)

**Client Compatibility**: Backward compatible (new feature, no existing functionality modified)

### Migration Requirements

**Database Migrations**:
- Yes: Create `newsletter_subscribers` table with columns (id, email, active, subscribed_at, unsubscribed_at, unsubscribe_token, source)
- Yes: Create `newsletter_preferences` table with columns (id, subscriber_id, newsletter_type, subscribed, updated_at)
- Yes: Add indexes (email, unsubscribe_token, active, subscriber_id, newsletter_type)
- Yes: Add constraints (UNIQUE email, UNIQUE token, UNIQUE(subscriber_id, newsletter_type), CHECK newsletter_type ENUM)

**Data Backfill**: Not required (new feature, no existing data)

**RLS Policy Changes**: No (not using Row-Level Security)

**Reversibility**: Fully reversible (drop tables, remove API routes)

### Rollback Considerations

**Standard Rollback**: Yes - 3-command rollback via runbook

**Special Rollback Needs**: None (tables can be dropped, no data dependencies)

**Deployment Metadata**: Deploy IDs tracked in specs/048-multi-track-newsletter/NOTES.md (Deployment Metadata section)

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: SQL queries, structured logs, Lighthouse CI, database aggregates.

### Data Collection

**Analytics Events** (dual instrumentation):
- Database (primary): `newsletter_subscribers`, `newsletter_preferences` tables
- Structured logs (secondary): `logger.info({ event: 'newsletter_signup', email_masked, newsletterTypes, source })`

**Key Events to Track**:
1. `newsletter.signup_started` - User lands on signup form
2. `newsletter.signup_completed` - Subscriber created successfully
3. `newsletter.signup_error` - Validation or API error
4. `newsletter.preference_updated` - User changes preferences
5. `newsletter.unsubscribed` - User unsubscribes from all
6. `newsletter.hard_deleted` - User requests GDPR deletion

### Measurement Queries

**SQL** (`specs/048-multi-track-newsletter/queries/*.sql`):

**Total Subscribers**:
```sql
SELECT COUNT(*) FROM newsletter_subscribers WHERE active = true;
```

**Subscribers by Newsletter Type**:
```sql
SELECT
  np.newsletter_type,
  COUNT(DISTINCT np.subscriber_id) as subscriber_count
FROM newsletter_preferences np
JOIN newsletter_subscribers ns ON ns.id = np.subscriber_id
WHERE np.subscribed = true AND ns.active = true
GROUP BY np.newsletter_type
ORDER BY subscriber_count DESC;
```

**Signup Conversion Rate** (if tracking page views):
```sql
SELECT
  COUNT(DISTINCT ns.id) * 1.0 / (SELECT COUNT(*) FROM page_views WHERE page = '/') as conversion_rate
FROM newsletter_subscribers ns
WHERE ns.created_at >= NOW() - INTERVAL '30 days';
```

**30-Day Retention**:
```sql
SELECT
  COUNT(*) FILTER (WHERE active = true) * 100.0 / COUNT(*) as retention_pct
FROM newsletter_subscribers
WHERE subscribed_at < NOW() - INTERVAL '30 days';
```

**Average Newsletters per Subscriber**:
```sql
SELECT
  AVG(newsletter_count) as avg_newsletters_per_subscriber
FROM (
  SELECT
    subscriber_id,
    COUNT(*) as newsletter_count
  FROM newsletter_preferences
  WHERE subscribed = true
  GROUP BY subscriber_id
) subquery;
```

**Logs** (`logs/newsletter/*.jsonl`):
- Signup errors: `grep '"event":"newsletter.signup_error"' logs/newsletter/*.jsonl | jq -r '.error_type' | sort | uniq -c`
- Signup sources: `grep '"event":"newsletter.signup_completed"' logs/newsletter/*.jsonl | jq -r '.source' | sort | uniq -c`

**Lighthouse** (`.lighthouseci/results/*.json`):
- Accessibility score for preference page: `jq '.categories.accessibility.score' < results.json`

### Experiment Design (A/B Test)

**Not applicable for MVP** - Single implementation path

**Future Testing**:
- Variant A: Multi-select checkboxes (current design)
- Variant B: Dropdown menu with multi-select
- Metric: Signup completion rate
- Ramp: 50/50 split for 2 weeks

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, UX, data, access, GDPR)
- [x] No implementation details (tech stack, APIs, code patterns specified only where necessary for clarity)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] HEART metrics defined with Claude Code-measurable sources (SQL queries)
- [N/A] Hypothesis stated (Problem → Solution → Prediction) - New feature, not improvement

### Conditional: UI Features (Skip if backend-only)
- [x] All screens identified with states (default, loading, error, success)
- [x] System components from ui-inventory.md planned (Button component reused)

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified (None - new tables and endpoints only)
- [x] Environment variables documented (RESEND_API_KEY, NEWSLETTER_FROM_EMAIL, etc.)
- [x] Rollback plan specified (Standard rollback, fully reversible)
