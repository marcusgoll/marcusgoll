# Preview Testing Checklist: 048-multi-track-newsletter

**Generated**: 2025-10-28
**Feature**: Multi-Track Newsletter Subscription System
**Tester**: [Your name]

---

## Overview

This newsletter feature allows visitors to subscribe to content tracks based on their interests (Aviation, Dev/Startup, Education, or All). The system includes:
- Multi-checkbox signup form
- Token-based preference management
- One-click unsubscribe
- GDPR-compliant hard delete option

---

## Routes to Test

### Component Integration
- [ ] **Signup Form Component**: Can be embedded anywhere (homepage, blog, footer)
  - Test Location: Add to a test page or check existing integration

### Standalone Pages
- [ ] **Preference Management**: `/newsletter/preferences/[token]`
  - Requires valid token from email (can test with database-generated token)

- [ ] **Unsubscribe Confirmation**: `/newsletter/unsubscribe/confirmation?token=[token]`
  - Requires valid token parameter

### API Endpoints
- [ ] `POST /api/newsletter/subscribe` - Newsletter signup
- [ ] `GET /api/newsletter/preferences/:token` - Get preferences
- [ ] `PATCH /api/newsletter/preferences` - Update preferences
- [ ] `DELETE /api/newsletter/unsubscribe` - Unsubscribe

---

## User Scenarios (from spec.md)

### Scenario 1: Subscribe to Multiple Newsletters

**Steps**:
1. Navigate to page with newsletter signup form
2. Enter valid email address
3. Select "Aviation" and "Dev/Startup" checkboxes
4. Submit form

**Expected**:
- [ ] Success message appears
- [ ] Form resets after submission
- [ ] Database check: Subscriber created with 2 preference rows
- [ ] Email sent (if RESEND_API_KEY configured)

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 2: Manage Preferences

**Steps**:
1. Get valid token from database or signup email
2. Navigate to `/newsletter/preferences/[token]`
3. View current selections
4. Update newsletter preferences (change checkboxes)
5. Submit form

**Expected**:
- [ ] Page loads with current email (read-only)
- [ ] Current preferences pre-selected
- [ ] Can update selections
- [ ] Success message after submission
- [ ] Database check: Preferences updated

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 3: One-Click Unsubscribe

**Steps**:
1. Navigate to `/newsletter/unsubscribe/confirmation?token=[token]`
2. Page auto-unsubscribes on load
3. View confirmation message

**Expected**:
- [ ] Auto-unsubscribe happens on page load
- [ ] Goodbye message displays
- [ ] "Delete my data" button visible (GDPR)
- [ ] Re-subscribe link visible
- [ ] Database check: Subscriber marked inactive

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 4: GDPR Hard Delete

**Steps**:
1. On unsubscribe confirmation page
2. Click "Delete my data permanently" button
3. Confirm deletion

**Expected**:
- [ ] Confirmation dialog appears
- [ ] After confirmation, data deleted
- [ ] Success message displays
- [ ] Database check: Subscriber row deleted (CASCADE)
- [ ] Can re-subscribe with same email

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 5: Validation - No Newsletter Selected

**Steps**:
1. Enter valid email in signup form
2. **Do not select any newsletter checkboxes**
3. Submit form

**Expected**:
- [ ] Client-side validation prevents submission OR
- [ ] API returns 400 error with message
- [ ] Error message: "Please select at least one newsletter"

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 6: Validation - Invalid Email

**Steps**:
1. Enter invalid email (e.g., "notanemail")
2. Select at least one newsletter
3. Submit form

**Expected**:
- [ ] Client-side validation shows error OR
- [ ] API returns 400 error with message
- [ ] Error message about invalid email format

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 7: Duplicate Subscription (Upsert)

**Steps**:
1. Subscribe with email "test@example.com", select "Aviation"
2. Subscribe again with same email, select "Dev/Startup"
3. Check database

**Expected**:
- [ ] Second submission succeeds
- [ ] Database check: Only 1 subscriber row
- [ ] Database check: Both preferences enabled
- [ ] Success message mentions "preferences updated"

**Result**: [Pass/Fail]
**Notes**: _______________________

---

### Scenario 8: Rate Limiting

**Steps**:
1. Submit signup form 5 times rapidly (same IP)
2. Try 6th submission

**Expected**:
- [ ] First 5 requests succeed
- [ ] 6th request returns 429 status
- [ ] Error message: "Too many requests"
- [ ] Rate limit headers present (X-RateLimit-*)

**Result**: [Pass/Fail]
**Notes**: _______________________

---

## Acceptance Criteria

### Functional Requirements

- [ ] **FR-001**: Signup form accepts email and at least 1 newsletter selection
- [ ] **FR-002**: System generates secure 64-char hex token for each subscriber
- [ ] **FR-003**: Preference management page accessible via token URL
- [ ] **FR-004**: Users can update preferences without re-entering email
- [ ] **FR-005**: One-click unsubscribe marks subscriber inactive
- [ ] **FR-006**: Hard delete option available on unsubscribe page
- [ ] **FR-007**: Duplicate email upserts (updates) existing subscriber
- [ ] **FR-008**: Invalid email format rejected by validation

### Non-Functional Requirements

- [ ] **NFR-001**: API response time <500ms P95 (measure with browser DevTools)
- [ ] **NFR-002**: Signup form submission <2s total (includes success message)
- [ ] **NFR-003**: Form validation provides clear error messages
- [ ] **NFR-011**: Rate limiting enforced (5 req/min per IP)

---

## Visual Validation

### Layout & Spacing
- [ ] Newsletter signup form is visually appealing
- [ ] Checkboxes aligned and clearly labeled
- [ ] Checkbox descriptions are readable
- [ ] Spacing between form elements is consistent
- [ ] Submit button is prominent and accessible
- [ ] Success/error messages are noticeable

### Typography
- [ ] Font families match site design
- [ ] Font sizes are readable (body text ≥16px)
- [ ] Font weights appropriate for hierarchy
- [ ] Line height provides good readability

### Colors
- [ ] Colors match brand guidelines
- [ ] Sufficient contrast for readability
- [ ] Interactive elements have clear hover states
- [ ] Focus indicators are visible
- [ ] Error states use appropriate colors (red tones)
- [ ] Success states use appropriate colors (green tones)

### Responsive Design
- [ ] Form works on mobile (320px+)
- [ ] Form works on tablet (768px+)
- [ ] Form works on desktop (1024px+)
- [ ] Touch targets ≥44px on mobile
- [ ] No horizontal scrolling required

---

## Browser Testing

Test on multiple browsers to ensure compatibility:

- [ ] **Chrome** (latest) - Version: ___
- [ ] **Firefox** (latest) - Version: ___
- [ ] **Safari** (latest) - Version: ___
- [ ] **Edge** (latest) - Version: ___
- [ ] **Mobile Safari** (iOS) - Device: ___
- [ ] **Chrome Mobile** (Android) - Device: ___

**Primary testing device**: _______________________
**OS**: _______________________

---

## Accessibility

### Keyboard Navigation
- [ ] Tab navigates through all interactive elements
- [ ] Shift+Tab navigates backward
- [ ] Enter submits form
- [ ] Space toggles checkboxes
- [ ] Focus indicators visible for all elements
- [ ] Logical tab order

### Screen Reader
- [ ] Form labels announced correctly
- [ ] Checkbox states announced ("checked"/"unchecked")
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Button purposes clear

**Screen reader tested**: [NVDA / VoiceOver / JAWS / None]

### ARIA & Semantics
- [ ] Form uses semantic HTML (`<form>`, `<label>`, `<input>`)
- [ ] Labels associated with inputs (`htmlFor` attribute)
- [ ] Required fields marked
- [ ] Error messages associated with fields
- [ ] Success/error alerts have appropriate roles

### Color Contrast
- [ ] Text on background: ≥4.5:1 ratio
- [ ] Large text: ≥3:1 ratio
- [ ] Interactive elements: ≥3:1 ratio
- [ ] Focus indicators: ≥3:1 ratio

**Contrast checked with**: [Browser DevTools / Contrast checker tool / Manual]

---

## Performance

### Initial Load
- [ ] No console errors
- [ ] No console warnings (or only non-blocking)
- [ ] Page loads quickly (<3s perceived)
- [ ] No layout shifts (CLS)
- [ ] Images load properly

### Interactions
- [ ] Form submission feels responsive
- [ ] Button click provides immediate feedback
- [ ] Success message appears quickly
- [ ] No UI freezes or janks
- [ ] API calls complete in reasonable time (<5s)

### Network Tab (DevTools)
- [ ] API requests return expected status codes
- [ ] Rate limit headers present in responses
- [ ] No 404 errors
- [ ] No failed requests (unless expected)

**Performance measured**: [Yes / No]
**Tools used**: [Browser DevTools / Lighthouse / None]

---

## Email Testing

**Note**: Requires `RESEND_API_KEY` configured. If not available, skip email verification.

- [ ] **Email configured**: Yes / No / Skipped

If configured:
- [ ] Welcome email received after signup
- [ ] Email contains subscriber's selections
- [ ] "Manage preferences" link works
- [ ] "Unsubscribe" link works
- [ ] Email template is well-formatted
- [ ] Email renders correctly (Gmail, Outlook, etc.)

---

## Security Testing

### Input Validation
- [ ] SQL injection attempt blocked (if testing with DB)
- [ ] XSS attempt blocked (script tags in email field)
- [ ] Invalid token returns 401/404 (not 500)
- [ ] Extremely long inputs handled gracefully

### Rate Limiting
- [ ] Rate limiting enforced (5 req/min)
- [ ] 429 status returned when limit exceeded
- [ ] Rate limit headers present
- [ ] Different IPs tracked separately

### Token Security
- [ ] Tokens are 64 characters
- [ ] Tokens are random (not predictable)
- [ ] Invalid tokens rejected
- [ ] Expired tokens handled (if expiration implemented)

---

## Database Validation

**Note**: Requires database access. Check via Prisma Studio or SQL queries.

### After Signup
- [ ] `NewsletterSubscriber` row created
- [ ] `unsubscribeToken` is 64-char hex
- [ ] `active` field is `true`
- [ ] `NewsletterPreference` rows created for selected tracks
- [ ] `subscriberId` foreign key correct

### After Preference Update
- [ ] `NewsletterPreference` rows updated
- [ ] `updatedAt` timestamp changed
- [ ] Only selected preferences have `subscribed: true`

### After Unsubscribe
- [ ] `active` field set to `false`
- [ ] `unsubscribedAt` timestamp set
- [ ] Preference rows remain (soft delete)

### After Hard Delete
- [ ] `NewsletterSubscriber` row deleted
- [ ] `NewsletterPreference` rows deleted (CASCADE)
- [ ] Can re-subscribe with same email

---

## Issues Found

*Document any issues using this format:*

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL or component]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]
- **Browser**: [Affected browsers]
- **Reproducible**: [Yes/No, steps if yes]

---

## Test Results Summary

**Scenarios tested**: ___ / 8
**Acceptance criteria validated**: ___ / 11
**Browsers tested**: ___ / 6
**Accessibility checks**: ___ / 15
**Performance checks**: ___ / 5
**Issues found**: ___

**Overall status**:
- [ ] ✅ Ready to ship (no blocking issues)
- [ ] ⚠️ Minor issues found (document and proceed)
- [ ] ❌ Blocking issues found (fix before shipping)

---

## Environment Details

**Database**: PostgreSQL / Local / Staging
**Email Service**: Resend / Mocked / Not configured
**RESEND_API_KEY**: Configured / Not configured
**Dev Server**: http://localhost:3000 (or other port)
**Testing Date**: _______________
**Testing Duration**: _______________

---

## Tester Sign-Off

**Tester Name**: _______________
**Date**: _______________
**Signature**: _______________

**Notes**:
- _______________
- _______________
- _______________

---

## Next Steps

After completing this checklist:

1. **If all tests pass**: Proceed to `/ship-staging` for staging deployment
2. **If minor issues found**: Document in "Issues Found" section, decide whether to fix or ship
3. **If blocking issues found**: Use `/debug` to fix issues, then re-run `/preview`

---

🤖 Generated with Claude Code
Checklist generated: 2025-10-28
