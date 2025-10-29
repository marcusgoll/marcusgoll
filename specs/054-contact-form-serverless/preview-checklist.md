# Preview Testing Checklist: contact-form-serverless

**Generated**: 2025-10-29 14:30:00 UTC
**Tester**: [Your name]
**Feature**: Serverless Contact Form with Spam Protection

---

## Routes to Test

- [ ] http://localhost:3000/contact

---

## User Scenarios (MVP - US1-US3)

### Scenario 1: Successful Contact Form Submission (US1)

- [ ] **Test**: Navigate to /contact and submit valid form with all 4 required fields (name, email, subject, message 500+ chars)
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Form shows success message and confirmation
- [ ] **Actual**: [What happened]
- [ ] **Notes**: [Any issues or observations]

### Scenario 2: Spam Bot Protection (US2)

- [ ] **Test**: Attempt bot submission by filling honeypot field or failing Turnstile
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Submission rejected with 400 status, no email sent
- [ ] **Actual**: [What happened]
- [ ] **Notes**: [Check browser console for honeypot/Turnstile errors]

### Scenario 3: Validation Errors (US3)

- [ ] **Test**: Submit form with invalid email format (e.g., "notanemail")
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Inline error message "Invalid email format"
- [ ] **Actual**: [What happened]

- [ ] **Test**: Submit form with message < 500 characters
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Inline error "Message must be at least 500 characters"
- [ ] **Actual**: [What happened]

- [ ] **Test**: Submit form with empty required fields
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Each empty field shows "Required" error
- [ ] **Actual**: [What happened]

- [ ] **Notes**: [Any validation issues or UX concerns]

---

## Acceptance Criteria (from spec.md)

### Form Fields (FR-001 to FR-003)
- [ ] Form displays 4 required fields: name (text), email (email), subject (dropdown), message (textarea)
- [ ] Name field max 100 characters
- [ ] Message field min 500 characters, max 10,000 characters
- [ ] Subject dropdown includes: General Inquiry, Aviation Consulting, Dev/Startup Collaboration, CFI Training Resources, Speaking/Workshop Request, Other
- [ ] Email validation uses RFC 5322 format

### Spam Protection (FR-004 to FR-006)
- [ ] Cloudflare Turnstile widget loads (invisible mode)
- [ ] Honeypot field exists (name="website") and is CSS hidden
- [ ] Honeypot submission is rejected
- [ ] Rate limiting: 3 submissions per 15 minutes per IP (test by submitting 4x rapidly)

### Email Handling (FR-007 to FR-011)
- [ ] Admin email sent to CONTACT_ADMIN_EMAIL
- [ ] Admin email includes: sender name, email, subject, message, timestamp, IP
- [ ] Auto-reply sent to sender
- [ ] Auto-reply includes: confirmation, response time (2-3 business days), message copy, contact link
- [ ] Emails use Resend service (FROM: NEWSLETTER_FROM_EMAIL)
- [ ] Sender email masked in server logs (check browser console / server logs)

### Success/Error States (FR-012 to FR-015)
- [ ] Success state shows confirmation message with next steps
- [ ] Error state shows user-friendly message (not stack trace)
- [ ] Loading state shows during submission (button disabled, loading text)
- [ ] Form clears after successful submission

### Non-Functional Requirements
- [ ] NFR-003: WCAG 2.1 AA accessibility (keyboard nav, ARIA labels, screen reader)
- [ ] NFR-004: Rate limiting (3 req/15min per IP, 429 response with Retry-After header)
- [ ] NFR-005: Turnstile + honeypot spam protection (>95% spam rejection)
- [ ] NFR-006: XSS prevention (email content escaped in templates)
- [ ] NFR-007: API response time <3 seconds (p95, test with DevTools Network tab)
- [ ] NFR-008: Progressive enhancement (form works without JavaScript using HTML5 validation)
- [ ] NFR-009: Privacy (email masked in logs, IP hashed for analytics)

---

## Visual Validation

- [ ] Layout is clean and professional
- [ ] Colors match brand guidelines (Navy 900 + Emerald 600 accents)
- [ ] Typography is readable (font families, sizes, weights)
- [ ] Spacing is consistent
- [ ] Interactive elements have clear affordances (buttons, links, inputs)
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Form fields have proper labels and placeholder text
- [ ] Error messages appear inline below fields (red text)
- [ ] Success message is prominent (green background or icon)
- [ ] Character counter for message field shows real-time count
- [ ] Submit button shows loading state (disabled, "Sending..." text)

---

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Testing device**: [Device name/OS]

---

## Accessibility

### Keyboard Navigation
- [ ] Tab key navigates through all form fields in logical order
- [ ] Shift+Tab navigates backwards
- [ ] Enter key submits form when focused on submit button
- [ ] Escape key clears error messages (if applicable)
- [ ] Focus indicators visible on all interactive elements (2px emerald ring)

### Screen Reader
- [ ] Form has accessible name/label
- [ ] All inputs have associated labels (htmlFor/id)
- [ ] Error messages announced when validation fails
- [ ] Success message announced when form submits
- [ ] Character counter changes announced
- [ ] Honeypot field excluded from screen reader (aria-hidden="true")

### Visual
- [ ] Color contrast sufficient (4.5:1 text, 3:1 UI)
- [ ] Touch targets ≥44px
- [ ] ARIA labels present and correct
- [ ] No color-only information (errors use text + color)

**Screen reader tested**: [NVDA/VoiceOver/JAWS/None]

---

## Performance

- [ ] No console errors
- [ ] No console warnings (besides expected third-party warnings)
- [ ] Initial page load feels fast (<3s perceived)
- [ ] Form submission completes within 3 seconds (NFR-007)
- [ ] Interactions feel smooth (no janks)
- [ ] Turnstile widget loads without blocking page
- [ ] Character counter updates without lag
- [ ] API response time <3s (check DevTools Network tab)

---

## Security Testing

- [ ] Honeypot field properly hidden (position: absolute; left: -9999px)
- [ ] Honeypot submission rejected with 400 status
- [ ] Turnstile verification happens server-side (check /api/contact response)
- [ ] XSS attempt in message field is escaped (try `<script>alert('XSS')</script>`)
- [ ] SQL injection attempt has no effect (try `'; DROP TABLE users;--`)
- [ ] Rate limiting works (submit 4 times rapidly, expect 429 on 4th)
- [ ] No secrets exposed in client-side code (check source, no TURNSTILE_SECRET_KEY)

---

## Progressive Enhancement Test

- [ ] Disable JavaScript in browser
- [ ] Navigate to /contact
- [ ] Submit valid form
- [ ] **Expected**: Form submits using HTML5 validation (browser native)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Turnstile and client-side validation won't work, but server validation should]

---

## Issues Found

*Document any issues below with format:*

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL or component]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]
- **Browser**: [Affected browsers]
- **Screenshot**: [Path if captured]

---

## Test Results Summary

**Total scenarios tested**: ___ / 3 (MVP scenarios)
**Total criteria validated**: ___ / 30 (functional + non-functional requirements)
**Browsers tested**: ___ / 6
**Issues found**: ___

**Overall status**:
- [ ] ✅ Ready to ship (all tests pass, 0 critical issues)
- [ ] ⚠️ Minor issues (non-blocking, can ship with documentation)
- [ ] ❌ Blocking issues (must fix before deployment)

**Tester signature**: _______________
**Date**: _______________

---

## Email Delivery Verification (Manual)

**Important**: To fully test email delivery, you'll need valid environment variables:

1. Set TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY (get from Cloudflare dashboard)
2. Set RESEND_API_KEY (existing, should already be configured)
3. Set CONTACT_ADMIN_EMAIL (your test email address)
4. Restart dev server after setting env vars

**Test steps**:
- [ ] Submit form with valid data
- [ ] Check inbox for admin notification email (CONTACT_ADMIN_EMAIL)
- [ ] Check sender inbox for auto-reply email
- [ ] Verify email content matches spec (FR-008, FR-009)
- [ ] Verify emails are HTML formatted and professional

**Email test results**: [Pass/Fail/Skipped]
**Reason if skipped**: [e.g., "No Turnstile keys configured, tested with mocked verification"]
