# Preview Testing Checklist: homepage-redesign

**Generated**: 2025-10-29 18:30 UTC
**Tester**: [Your name]
**Feature**: Homepage Redesign - Modernize visual design and improve content discovery

---

## Testing Context

This is a homepage redesign feature focused on:
1. **Visual Design**: Apply navy brand palette (Navy 900 #0F172A, Emerald 600 #059669)
2. **Content Discovery**: Dual-track filtering (Aviation + Dev/Startup)
3. **Engagement**: Featured content, newsletter CTAs, project showcase

**Implementation Status**: Verification-based (90.9% component reuse)
- lib/constants.ts created (brand colors, content tracks, project config)
- UI integration may be in progress - verify visual changes are visible

---

## Routes to Test

- [ ] http://localhost:3000 (Homepage)

---

## User Scenarios

### Scenario 1: Visual Design
- [ ] Navy background palette (#0F172A) applied
- [ ] Emerald accents (#059669) on CTAs and links
- [ ] Visual hierarchy is clear
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

### Scenario 2: Hero Section
- [ ] Updated value proposition displayed
- [ ] Primary CTA prominent (newsletter or Read Latest)
- [ ] Navy background with emerald CTAs
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

### Scenario 3: Content Filtering
- [ ] Filter buttons visible (Aviation, Dev/Startup)
- [ ] Clicking updates URL (?track=)
- [ ] Post list filters correctly
- [ ] Post counts display
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

### Scenario 4: Featured Content
- [ ] 1-3 featured posts with larger cards
- [ ] Appears before recent posts
- [ ] Visual distinction clear
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

### Scenario 5: Recent Posts Grid
- [ ] Responsive: 1 col mobile, 2 tablet, 3 desktop
- [ ] Cards show: image, title, excerpt, track badge
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

### Scenario 6: Project Card
- [ ] "What I'm building" card displays
- [ ] Shows project info and status
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

### Scenario 7: Newsletter CTAs
- [ ] CTA in hero opens dialog
- [ ] Multi-track selection works
- [ ] Form validates email
- [ ] **Result**: Pass/Fail
- [ ] **Notes**:

---

## Acceptance Criteria

### Visual Design (5)
- [ ] AC1: Navy 900 (#0F172A) primary background
- [ ] AC2: Emerald 600 (#059669) interactive elements
- [ ] AC3: Color contrast WCAG AA (4.5:1 text, 3:1 UI)
- [ ] AC4: Work Sans font family
- [ ] AC5: Clear visual hierarchy

### Hero Section (3)
- [ ] AC6: Clear value proposition
- [ ] AC7: Prominent primary CTA
- [ ] AC8: Newsletter dialog functional

### Content Filtering (5)
- [ ] AC9: Filter buttons for both tracks
- [ ] AC10: URL updates with ?track=
- [ ] AC11: Client-side filtering (no reload)
- [ ] AC12: Post counts on buttons
- [ ] AC13: Analytics event fires

### Featured Content (3)
- [ ] AC14: Before recent posts
- [ ] AC15: 1-3 featured posts
- [ ] AC16: Larger card treatment

### Recent Posts Grid (4)
- [ ] AC17: Responsive 1/2/3 columns
- [ ] AC18: Complete card content
- [ ] AC19: Lazy loading below fold
- [ ] AC20: Aspect ratio containers

### Project Showcase (2)
- [ ] AC21: Displays when active
- [ ] AC22: Complete project info

### Newsletter (4)
- [ ] AC23: CTA in hero
- [ ] AC24: Multi-track selection
- [ ] AC25: Email validation
- [ ] AC26: Success/error feedback

---

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Device**: [Device name/OS]

---

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Touch targets ≥44px
- [ ] ARIA labels correct
- [ ] Semantic HTML

**Screen reader**: [Name/None]

---

## Performance

- [ ] No console errors
- [ ] No console warnings
- [ ] Fast initial load (<3s)
- [ ] Smooth interactions
- [ ] Images load properly
- [ ] Client-side filtering instant

---

## Issues Found

### Issue 1: [Title]
- **Severity**: Critical / High / Medium / Low
- **Location**: Homepage
- **Description**: [What's wrong]
- **Expected**: [From spec]
- **Actual**: [What happens]
- **Browser**: [Affected browsers]

---

## Summary

**Scenarios tested**: ___ / 7
**Criteria validated**: ___ / 26
**Browsers tested**: ___ / 6
**Issues found**: ___

**Status**:
- ✅ Ready to ship
- ⚠️ Minor issues (non-blocking)
- ❌ Blocking issues (must fix)

**Tester**: _______________
**Date**: _______________

---

## Implementation Notes

**Key Check**: Verify visual changes are actually visible
- lib/constants.ts exists ✅
- Components using new constants? [Check]
- Navy palette applied? [Check]
- Emerald accents applied? [Check]

If NOT visible, integration may still be needed.
