# Preview Testing Checklist: 007-maintenance-mode-byp

**Feature**: Maintenance Mode with Secret Bypass
**Generated**: 2025-10-27 08:30 UTC
**Tester**: [Manual testing]

---

## Routes to Test

- [ ] `http://localhost:3001/maintenance` - Maintenance page

---

## User Scenarios

### Scenario 1: External Visitor During Maintenance

- [ ] **Test**: User visits site when MAINTENANCE_MODE=true
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Redirected to /maintenance page showing professional maintenance message
- [ ] **Notes**: [Any issues or observations]

### Scenario 2: Developer Bypassing Maintenance Mode

- [ ] **Test**: Developer visits `http://localhost:3001/maintenance?bypass=<token>`
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Token validated, cookie set, redirected to homepage, maintenance page bypassed
- [ ] **Notes**: [Any issues or observations]

### Scenario 3: Maintenance Mode Disabled

- [ ] **Test**: Visit site with MAINTENANCE_MODE=false
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Normal site access, no maintenance page, no redirect
- [ ] **Notes**: [Any issues or observations]

### Scenario 4: Developer Navigation with Active Bypass

- [ ] **Test**: After successful bypass, navigate to other pages
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Bypass cookie persists, all pages accessible, no redirect
- [ ] **Notes**: [Any issues or observations]

### Scenario 5: Invalid Bypass Token

- [ ] **Test**: Visit with invalid/expired token `?bypass=invalid123`
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Token rejected, redirected to maintenance page, failed attempt logged
- [ ] **Notes**: [Any issues or observations]

### Scenario 6: Static Assets and Health Checks

- [ ] **Test**: Static assets (/_next/*, /images/*, /fonts/*) load normally
- [ ] **Result**: [Pass/Fail]
- [ ] **Expected**: Assets load without redirect even during maintenance
- [ ] **Notes**: [Any issues or observations]

---

## Acceptance Criteria

- [ ] Maintenance page loads in <1.5s (FCP target)
- [ ] Middleware overhead <10ms p95 (Edge Runtime)
- [ ] WCAG 2.1 AA accessibility compliant
- [ ] Cookie flags: HttpOnly, Secure, SameSite=Strict
- [ ] Token removed from URL after validation
- [ ] Bypass persists for 24 hours via cookie
- [ ] Logging includes timestamp and masked token
- [ ] No error messages exposed to users
- [ ] Mobile responsive (<768px breakpoints)
- [ ] Static assets excluded from middleware check

---

## Visual Validation

- [ ] Layout is clean and professional
- [ ] Brand colors correct (Navy 900 primary, Emerald 600 accent)
- [ ] Typography readable (Work Sans or system font)
- [ ] Spacing consistent
- [ ] Settings icon visible and properly styled
- [ ] Contact email link has underline
- [ ] Focus indicators visible on links
- [ ] Responsive design works (mobile, tablet, desktop)

---

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Testing device/browser**: [Device name/OS - to be filled during testing]

---

## Accessibility

- [ ] Keyboard navigation (Tab to links, Enter to follow)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast sufficient (Navy on white: 15.8:1 ✅)
- [ ] Touch targets ≥44px (email link touch area)
- [ ] Semantic HTML (h1, p, a tags)
- [ ] No ARIA errors (decorative SVG marked aria-hidden)
- [ ] Alt text on images (if any)
- [ ] Page language declared (lang="en")

**Screen reader tested**: [None initially - may test with VoiceOver/NVDA]

---

## Performance

- [ ] No console errors
- [ ] No console warnings
- [ ] Maintenance page load feels fast (<3s perceived)
- [ ] Interactions feel smooth (no janks/lags)
- [ ] SVG icon renders cleanly
- [ ] System fonts load (no web font loading delay)
- [ ] No 404 errors in Network tab
- [ ] No API calls that fail

---

## Middleware Behavior

### Maintenance Mode OFF (MAINTENANCE_MODE=false)

- [ ] Homepage accessible without redirect
- [ ] All routes accessible
- [ ] No maintenance page shown
- [ ] No cookies set
- [ ] Middleware overhead minimal

### Maintenance Mode ON (MAINTENANCE_MODE=true)

- [ ] Homepage redirects to /maintenance
- [ ] /maintenance page shows
- [ ] Static assets (/_next/*, /images/*, /fonts/*) load without redirect
- [ ] Health endpoint (/api/health) responds normally
- [ ] Bypass query parameter works with valid token
- [ ] Invalid token redirected to maintenance
- [ ] Cookie persists for 24 hours

### Token Validation

- [ ] Valid token accepted and cookie set
- [ ] Invalid token rejected, no access granted
- [ ] Token removed from URL after validation
- [ ] Failed attempts logged to console
- [ ] Successful attempts logged to console (masked token)

---

## Security Validation

- [ ] No token exposed in source code
- [ ] No token in network requests (removed after initial validation)
- [ ] Cookie has HttpOnly flag (XSS prevention)
- [ ] Cookie has Secure flag (HTTPS-only in production)
- [ ] Cookie has SameSite=Strict (CSRF prevention)
- [ ] Token is masked in logs (last 4 chars only, e.g., `***abc123`)
- [ ] Constant-time comparison prevents timing attacks
- [ ] No hardcoded secrets in code

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
- **Screenshot**: [File path if applicable]

---

## Test Results Summary

**Total scenarios tested**: ___ / 6
**Total criteria validated**: ___ / 10
**Total accessibility checks**: ___ / 8
**Total performance checks**: ___ / 8
**Browsers tested**: ___ / 6
**Issues found**: ___

**Overall status**:
- [ ] ✅ Ready to ship (all pass)
- [ ] ⚠️ Minor issues (documented, non-blocking)
- [ ] ❌ Blocking issues (must fix before ship)

---

## Tester Notes

**Device/Environment**: [Device, OS, Browser versions tested]

**Testing Time**: [Start time] - [End time] = [Duration]

**Summary**: [Overall impression of feature, any surprises, quality assessment]

**Recommendation**:

---

## Sign-Off

**Tester Name**: _______________
**Date Tested**: _______________
**Status**: ✅ Pass | ⚠️ Pass with issues | ❌ Fail

**If issues found, reference Error-Log**: `specs/007-maintenance-mode-byp/error-log.md`

---

**Maintenance Page Implementation**:
- Location: `app/maintenance/page.tsx`
- Middleware: `middleware.ts`
- Utilities: `lib/maintenance-utils.ts`
- Environment Variables: `.env.example` (document MAINTENANCE_MODE and MAINTENANCE_BYPASS_TOKEN)

**Scenarios Tested**: All 6 user scenarios from spec.md
**Acceptance Criteria**: All 10 criteria from spec.md

---

*Next step after preview*:
- If all pass → `/deploy-prod` (direct production deployment)
- If issues → `/debug` (fix issues) → re-run `/preview`
