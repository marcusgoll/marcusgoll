# Preview Testing Checklist

**Feature**: Newsletter Signup Integration
**Branch**: feature/051-newsletter-signup
**Date**: 2025-10-29

---

## Testing Environment

**Dev Server**: http://localhost:3000
**Test Browsers**: Chrome, Firefox, Safari, Edge
**Mobile Testing**: Chrome DevTools (iPhone 13, iPad, Pixel 5)

---

## Routes to Test

### Primary Routes
- [x] http://localhost:3000 (Homepage - footer signup)
- [ ] http://localhost:3000/blog (Blog listing - footer signup)
- [ ] http://localhost:3000/blog/[any-post] (Blog post - inline CTA + footer)
- [ ] http://localhost:3000/newsletter (Dedicated newsletter page)

### Secondary Routes (Footer Visible)
- [ ] http://localhost:3000/aviation (Aviation landing)
- [ ] http://localhost:3000/dev-startup (Dev/Startup landing)
- [ ] http://localhost:3000/tag/[any-tag] (Tag pages)

---

## Test Scenarios (From spec.md)

### Scenario 1: Footer Signup (Compact Variant)
**User Story**: US1 - Subscribe from footer on any page

- [ ] **Visual Check**: Footer newsletter form visible on all pages
- [ ] **Layout**: Single-line email input + subscribe button
- [ ] **Copy**: Clear, concise messaging ("Subscribe to our newsletter")
- [ ] **Styling**: Matches navy-900 footer background
- [ ] **Mobile**: Form stacks vertically on small screens
- [ ] **Touch Targets**: Button is 44px minimum height

**Functional Testing**:
- [ ] **Valid Email**: Submit valid email → Success message appears
- [ ] **Invalid Email**: Submit "test@" → Error message shows
- [ ] **Empty Email**: Click subscribe without input → Validation error
- [ ] **Loading State**: Button shows loading indicator during submit
- [ ] **Success State**: Form clears after successful submission
- [ ] **Error State**: Error message visible and accessible

**Cross-Browser**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

### Scenario 2: Inline Newsletter CTA (Post-Inline Variant)
**User Story**: US2 - Subscribe after reading blog post

**Test Posts**:
- [ ] Any aviation blog post
- [ ] Any dev/startup blog post
- [ ] Any cross-pollination post

**Visual Check**:
- [ ] CTA appears after post content (before comments/footer)
- [ ] Decorative airplane SVG visible (aria-hidden)
- [ ] Context-aware copy ("Enjoyed this aviation post? Get more...")
- [ ] Multi-track checkboxes visible (Aviation, Dev/Startup, Education)
- [ ] Email input + subscribe button
- [ ] Gradient background (navy-900 to emerald-600)

**Functional Testing**:
- [ ] **Track Selection**: Select 1 track → Can submit
- [ ] **Track Selection**: Select multiple tracks → Can submit
- [ ] **Track Selection**: Select 0 tracks → Validation error
- [ ] **Valid Email + Tracks**: Submit → Success message
- [ ] **Invalid Email**: Submit "test@" → Error message
- [ ] **Touch Targets**: All checkboxes 48px minimum (exceeds 44px)

**Accessibility**:
- [ ] Keyboard navigation: Tab through all form elements
- [ ] Checkboxes properly labeled (not just visual)
- [ ] SVG decorative elements hidden (aria-hidden="true")
- [ ] Focus indicators visible on all interactive elements

---

### Scenario 3: Dedicated Newsletter Page (Comprehensive Variant)
**User Story**: US5 - Learn about newsletter and subscribe

**URL**: http://localhost:3000/newsletter

**Visual Check**:
- [ ] Hero section with title "Subscribe to the Newsletter"
- [ ] Benefits grid (4 benefits: Systematic Thinking, Dual-Track, Teaching Quality, Building in Public)
- [ ] Signup form section with id="get-started"
- [ ] FAQ section (6 questions)
- [ ] Final CTA section with gradient background
- [ ] "Subscribe Now" button scrolls to signup form

**Comprehensive Signup Form**:
- [ ] Email input visible
- [ ] Multi-track checkboxes (Aviation, Dev/Startup, Education)
- [ ] Optional name input
- [ ] Subscribe button

**Functional Testing**:
- [ ] **Anchor Link**: Click "Subscribe Now" CTA → Smooth scroll to form
- [ ] **Keyboard**: Tab from "Subscribe Now" → Focus moves to form
- [ ] **Valid Submission**: Email + 1 track → Success message
- [ ] **Multiple Tracks**: Select all tracks → Success message
- [ ] **No Tracks**: Submit without selecting → Validation error
- [ ] **Invalid Email**: Submit "test@" → Error message

**SEO/Metadata**:
- [ ] Page title: "Newsletter - Marcus Gollahon"
- [ ] Meta description present
- [ ] Open Graph tags present
- [ ] Twitter card tags present

**Accessibility**:
- [ ] Heading hierarchy: h1 → h2 → h3 (no skips)
- [ ] All form inputs have labels (visible or aria-label)
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG 2.1 AA
- [ ] Keyboard navigation works (no mouse required)

---

### Scenario 4: Form Validation
**User Story**: US4 - Clear error messages for invalid input

**Test Cases**:
- [ ] Empty email → "Email is required" or similar
- [ ] Invalid email "test" → "Invalid email format"
- [ ] Invalid email "test@" → "Invalid email format"
- [ ] Invalid email "@example.com" → "Invalid email format"
- [ ] Valid email "test@example.com" → No error
- [ ] No tracks selected → "Select at least one newsletter"
- [ ] 1 track selected → No error

**Error Display**:
- [ ] Errors appear inline near input
- [ ] Errors use red color (#DC2626 or similar)
- [ ] Errors announced to screen readers (aria-live or role="alert")
- [ ] Errors clear when input corrected

---

### Scenario 5: Mobile Responsiveness

**Viewports to Test**:
- [ ] Mobile (375px - iPhone SE)
- [ ] Mobile (390px - iPhone 13)
- [ ] Tablet (768px - iPad)
- [ ] Desktop (1024px)
- [ ] Desktop (1280px)

**Footer Compact Form**:
- [ ] 375px: Single column, full width input + button
- [ ] 768px: Horizontal layout possible
- [ ] Touch targets: 44px minimum height

**Inline CTA**:
- [ ] 375px: Single column, checkboxes stack vertically
- [ ] 768px: Checkboxes in grid (2 columns)
- [ ] Touch targets: 48px minimum

**Newsletter Page**:
- [ ] 375px: Benefits grid 1 column
- [ ] 768px: Benefits grid 2 columns
- [ ] 1024px: Benefits grid 2 columns
- [ ] FAQ cards single column on all sizes

---

## Performance Testing

### Lighthouse Scores (Target: Performance ≥85, A11y ≥95)

**Newsletter Page** (/newsletter):
- [ ] Performance: ___ (target ≥85)
- [ ] Accessibility: ___ (target ≥95)
- [ ] Best Practices: ___ (target ≥90)
- [ ] SEO: ___ (target ≥90)

**Blog Post with Inline CTA**:
- [ ] Performance: ___ (target ≥85)
- [ ] Accessibility: ___ (target ≥95)

**Homepage with Footer**:
- [ ] Performance: ___ (target ≥85)
- [ ] Accessibility: ___ (target ≥95)

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): <2.5s
- [ ] FID (First Input Delay): <100ms
- [ ] CLS (Cumulative Layout Shift): <0.1

---

## Accessibility Audit

### Automated Tools
- [ ] Run Lighthouse accessibility audit (target ≥95)
- [ ] Run axe DevTools extension (0 violations)
- [ ] Run WAVE browser extension (0 errors)

### Manual Testing
- [ ] **Keyboard Only**: Navigate entire newsletter page without mouse
- [ ] **Tab Order**: Logical tab order (hero → benefits → form → FAQ → CTA)
- [ ] **Focus Indicators**: Visible on all interactive elements
- [ ] **Screen Reader**: Test with NVDA/JAWS (Windows) or VoiceOver (Mac)
- [ ] **Color Contrast**: All text meets WCAG 2.1 AA (4.5:1 for normal, 3:1 for large)
- [ ] **Touch Targets**: All buttons/links ≥44px (mobile), ≥48px preferred

### WCAG 2.1 AA Compliance Checks
- [ ] 1.3.1 Info and Relationships: Semantic HTML structure
- [ ] 1.4.3 Contrast: All text passes contrast ratio
- [ ] 2.1.1 Keyboard: All functionality available via keyboard
- [ ] 2.4.7 Focus Visible: Focus indicators present
- [ ] 3.2.2 On Input: No unexpected context changes
- [ ] 4.1.2 Name, Role, Value: All inputs properly labeled

---

## Security & Privacy

- [ ] **HTTPS Only**: All API calls use HTTPS (staging/prod)
- [ ] **XSS Prevention**: No dangerouslySetInnerHTML used
- [ ] **Rate Limiting**: Test rapid submissions (5 req/min limit)
- [ ] **Email Validation**: Client + server validation
- [ ] **No Hardcoded Secrets**: No API keys in client code
- [ ] **CORS**: API endpoints have correct CORS headers

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome 120+ (Windows/Mac)
- [ ] Firefox 120+ (Windows/Mac)
- [ ] Safari 17+ (Mac)
- [ ] Edge 120+ (Windows)

### Mobile Browsers
- [ ] Safari iOS 16+ (iPhone/iPad)
- [ ] Chrome Android (Pixel/Samsung)

### Known Issues
- Document any browser-specific bugs here:

---

## Edge Cases

### Already Subscribed
- [ ] Submit email already in database → Update preferences, show success
- [ ] Verify existing subscriber preferences updated

### Rate Limiting
- [ ] Submit 6+ requests in 1 minute → "Too many requests" error
- [ ] Wait 60 seconds → Can submit again

### Network Errors
- [ ] Disconnect internet → Submit form → Show network error
- [ ] Reconnect → Retry → Success

### Form State
- [ ] Start filling form → Navigate away → Return → Form cleared (no saved state)
- [ ] Submit form → Success → Form cleared
- [ ] Submit form → Error → Form retains input (user can fix)

---

## Screenshots to Capture

### Desktop (1280px)
- [ ] Homepage footer (compact signup)
- [ ] Blog post with inline CTA
- [ ] /newsletter page (full page)
- [ ] /newsletter page (form section zoomed)

### Mobile (375px)
- [ ] Footer compact form
- [ ] Inline CTA on blog post
- [ ] /newsletter page (hero section)
- [ ] /newsletter page (signup form section)

### States
- [ ] Form loading state (button spinner)
- [ ] Form success state (green checkmark + message)
- [ ] Form error state (red error message)

**Save screenshots to**: `specs/051-newsletter-signup/visuals/preview/`

---

## Test Results Summary

### Overall Status
- [ ] ✅ All critical paths working
- [ ] ⚠️ Minor issues found (document below)
- [ ] ❌ Blocking issues found (document below)

### Critical Issues (Blocking)
_Document any issues that prevent shipping:_

---

### Minor Issues (Non-Blocking)
_Document any polish items for future improvement:_

---

### Performance Summary
- Bundle size impact: ~21KB (acceptable with code splitting)
- Lighthouse scores: ___/100 (Performance), ___/100 (A11y)
- Core Web Vitals: LCP ___, FID ___, CLS ___

### Accessibility Summary
- WCAG 2.1 AA: ✅ Compliant / ❌ Issues found
- Automated tools: ___ violations
- Manual testing: ✅ Pass / ❌ Issues found

---

## Sign-off

**Tester**: _______________
**Date**: _______________
**Recommendation**:
- [ ] ✅ Ready for `/ship-staging`
- [ ] ⚠️ Ready with minor issues documented
- [ ] ❌ Not ready - blocking issues must be fixed

**Notes**:
_Any additional context or observations:_

---

## Next Steps

After completing this checklist:
1. Update `specs/051-newsletter-signup/workflow-state.yaml` with preview results
2. Generate `specs/051-newsletter-signup/release-notes.md`
3. If all tests pass → Proceed to `/ship-staging`
4. If issues found → Document in error-log.md and fix before shipping
