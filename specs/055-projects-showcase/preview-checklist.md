# Preview Testing Checklist - Projects Showcase

**Feature**: 055-projects-showcase
**Date**: 2025-10-29
**Test URL**: http://localhost:3000/projects
**Status**: Ready for Manual Testing

---

## Overview

This checklist guides manual UI/UX testing of the Projects Showcase feature before staging deployment. All accessibility fixes have been applied (WCAG 2.1 AA compliant), and the feature is production-ready pending manual validation.

---

## Test Environment Setup

- [x] Dev server started on http://localhost:3000
- [ ] Browser DevTools opened (Console + Network tabs)
- [ ] Lighthouse extension ready for audits
- [ ] Screen reader enabled (optional but recommended)
- [ ] Test on Chrome/Edge (primary browser)
- [ ] Test on Firefox (secondary browser)
- [ ] Test on Safari (if on macOS)

---

## Functional Testing

### 1. Projects Grid Display (US1)

**Route**: http://localhost:3000/projects

- [ ] **Grid Layout**
  - [ ] Desktop (≥1024px): 3 columns
  - [ ] Tablet (640-1023px): 2 columns
  - [ ] Mobile (<640px): 1 column
  - [ ] Consistent card heights in each row
  - [ ] Proper spacing between cards (gap-6)

- [ ] **Project Cards**
  - [ ] Cover image displays (16:9 aspect ratio)
  - [ ] Title displays (max 2 lines with truncation)
  - [ ] Description displays (max 2 lines with truncation)
  - [ ] Category badge shows correct track (Aviation/Dev/Cross-pollination)
  - [ ] Tech stack badges display (max 4 visible)
  - [ ] "+N more" indicator shows if >4 tech stack items
  - [ ] Live Demo button appears (if project has liveUrl)
  - [ ] GitHub button appears (if project has githubUrl)

- [ ] **Visual Quality**
  - [ ] Images load without layout shift (CLS check)
  - [ ] Text is readable (color contrast ✅ FIXED)
  - [ ] No horizontal scrolling on any viewport
  - [ ] Cards align to grid properly

### 2. Category Filtering (US2)

- [ ] **Filter Buttons**
  - [ ] "All Projects" button displays
  - [ ] "Aviation" button displays
  - [ ] "Dev/Startup" button displays
  - [ ] "Cross-pollination" button displays

- [ ] **Filter Functionality**
  - [ ] Click "Aviation" → only Aviation projects show
  - [ ] Click "Dev/Startup" → only Dev/Startup projects show
  - [ ] Click "Cross-pollination" → only Cross-pollination projects show
  - [ ] Click "All Projects" → all projects show
  - [ ] Active filter has visual indicator (colored background + navy text ✅ FIXED)
  - [ ] Inactive filters have gray outline style
  - [ ] Filter count updates correctly in screen reader announcement

- [ ] **URL Query Params** (if implemented)
  - [ ] Clicking filter updates URL: `/projects?category=aviation`
  - [ ] Refreshing page preserves filter state
  - [ ] Direct URL navigation works: `/projects?category=dev-startup`

- [ ] **Empty State**
  - [ ] If filter returns 0 results, "No projects found" message shows
  - [ ] Message includes suggestion to clear filters

### 3. Featured Projects Section (US3)

- [ ] **Featured Section**
  - [ ] Featured projects appear ABOVE main grid
  - [ ] 2-3 featured projects display
  - [ ] Featured cards are visually distinct (larger, different layout)
  - [ ] Each featured card shows:
    - [ ] Cover image
    - [ ] Full title
    - [ ] Detailed description (2-3 paragraphs)
    - [ ] Key metrics (users, impact, outcome)
    - [ ] Tech stack badges
    - [ ] Prominent CTAs (Live Demo + GitHub)

- [ ] **Metrics Display**
  - [ ] Metrics formatted nicely (icons or labels)
  - [ ] Metrics text is readable
  - [ ] Metrics align properly on all viewports

### 4. Project Card Interactions (FR-005)

- [ ] **Hover States**
  - [ ] Card lifts slightly on hover (shadow increases)
  - [ ] Image zooms subtly (transform: scale(1.05))
  - [ ] Title color changes to emerald-600
  - [ ] Transition is smooth (duration-200)

- [ ] **Button Interactions**
  - [ ] Live Demo button opens URL in new tab
  - [ ] GitHub button opens repo in new tab
  - [ ] Links have `rel="noopener noreferrer"` (check DevTools)
  - [ ] Clicking button does NOT navigate to detail page

- [ ] **Focus States**
  - [ ] Tab through page reaches all interactive elements
  - [ ] Focus indicators are visible (2px emerald-600 ring ✅ WCAG compliant)
  - [ ] Focus order is logical (filters → featured cards → grid cards)

---

## Accessibility Testing (WCAG 2.1 AA)

### 5. Color Contrast (Fixed Issues)

- [ ] **Project Card Descriptions** (Fixed: text-gray-800)
  - [ ] Description text is readable on white background
  - [ ] Contrast ratio ≥4.5:1 (target: 7.0:1)

- [ ] **Filter Button Text** (Fixed: text-navy-900)
  - [ ] Active "Aviation" button (sky-500 bg) text is readable
  - [ ] Active "Dev/Startup" button (emerald-600 bg) text is readable
  - [ ] Active "Cross-pollination" button (purple-600 bg) text is readable
  - [ ] All contrast ratios ≥4.5:1 (targets: 7.5-9.0:1)

### 6. Keyboard Navigation

- [ ] **Tab Navigation**
  - [ ] Tab key moves through all interactive elements
  - [ ] Filter buttons are keyboard accessible
  - [ ] Project card buttons are keyboard accessible
  - [ ] No keyboard traps (can Tab out of all sections)

- [ ] **Arrow Key Navigation**
  - [ ] Arrow Left/Right moves between filter buttons (if implemented)
  - [ ] Enter key activates filters
  - [ ] Space key activates filters

### 7. Screen Reader Support

- [ ] **ARIA Attributes**
  - [ ] Filter buttons have `aria-pressed` state
  - [ ] Filter group has `role="group"` and `aria-label`
  - [ ] Filter changes announce to screen reader
  - [ ] Images have descriptive alt text

- [ ] **Announcements**
  - [ ] Changing filter announces: "Showing N [category] projects"
  - [ ] Empty state announces properly
  - [ ] Live regions work (`aria-live="polite"`)

### 8. Touch Targets (Mobile)

- [ ] **Button Sizes**
  - [ ] All buttons ≥44x44px on mobile
  - [ ] Filter buttons have adequate spacing (gap-3)
  - [ ] Card CTAs have adequate touch target size

---

## Performance Testing

### 9. Core Web Vitals

- [ ] **First Contentful Paint (FCP)**
  - [ ] FCP <1.5s (measure in DevTools Performance tab)
  - [ ] Page renders quickly on first load

- [ ] **Largest Contentful Paint (LCP)**
  - [ ] LCP <3.0s (target: <2.5s)
  - [ ] Featured images load with `loading="eager"` + `priority`
  - [ ] Grid images load with `loading="lazy"`

- [ ] **Cumulative Layout Shift (CLS)**
  - [ ] CLS <0.15 (target: <0.05)
  - [ ] No layout shifts when images load
  - [ ] Blur placeholders prevent CLS

- [ ] **Time to Interactive (TTI)**
  - [ ] TTI <3.5s (measure in Lighthouse)
  - [ ] Page interactive quickly after load

### 10. Image Optimization

- [ ] **Next.js Image Component**
  - [ ] All images use Next.js Image component (check DevTools)
  - [ ] Images have proper `sizes` attribute
  - [ ] Images have blur placeholders
  - [ ] Images optimize for viewport size

- [ ] **Loading Strategy**
  - [ ] Featured images: `loading="eager"` + `priority={true}`
  - [ ] Grid images: `loading="lazy"`
  - [ ] No image format errors in console

### 11. Lighthouse Audit

- [ ] **Run Lighthouse** (Chrome DevTools → Lighthouse tab)
  - [ ] **Performance**: Score ≥85 (target: ≥90)
  - [ ] **Accessibility**: Score ≥95 (target: 100)
  - [ ] **Best Practices**: Score ≥90
  - [ ] **SEO**: Score ≥90

- [ ] **Review Lighthouse Issues**
  - [ ] No critical accessibility violations
  - [ ] No performance red flags
  - [ ] Address any warnings

---

## Mobile Responsiveness

### 12. Viewport Testing

**Test on multiple viewport sizes:**

- [ ] **Mobile (375px)**
  - [ ] Single column layout
  - [ ] Filter buttons stack or scroll horizontally
  - [ ] Images scale properly
  - [ ] Text remains readable
  - [ ] No horizontal scroll

- [ ] **Tablet (768px)**
  - [ ] 2-column grid
  - [ ] Filter buttons fit on one line
  - [ ] Cards maintain proper aspect ratio

- [ ] **Desktop (1440px)**
  - [ ] 3-column grid
  - [ ] Content centered with max-width
  - [ ] Featured section uses full width

### 13. Touch Interactions

- [ ] **Mobile Gestures**
  - [ ] Tap on filter buttons works
  - [ ] Tap on card buttons works
  - [ ] No accidental double-taps
  - [ ] Scroll performance is smooth

---

## SEO & Meta Tags

### 14. Page Metadata

- [ ] **View Page Source**
  - [ ] `<title>` tag is descriptive
  - [ ] Meta description present
  - [ ] Open Graph tags present (`og:title`, `og:description`, `og:image`)
  - [ ] Twitter Card tags present (if applicable)

- [ ] **Semantic HTML**
  - [ ] `<article>` for project cards
  - [ ] `<section>` for featured projects
  - [ ] Proper heading hierarchy (h1 → h2 → h3)
  - [ ] No heading level skips

---

## Browser Compatibility

### 15. Cross-Browser Testing

- [ ] **Chrome/Edge** (Primary)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Styles render correctly

- [ ] **Firefox** (Secondary)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Styles render correctly

- [ ] **Safari** (macOS/iOS)
  - [ ] All features work
  - [ ] No console errors
  - [ ] Styles render correctly
  - [ ] Image lazy loading works

---

## Error States

### 16. Edge Cases

- [ ] **Empty Filter Results**
  - [ ] Message displays when no projects match filter
  - [ ] Layout doesn't break
  - [ ] User can clear filter easily

- [ ] **Missing Images**
  - [ ] Placeholder shows if image fails to load
  - [ ] No broken image icons

- [ ] **Long Text**
  - [ ] Titles truncate properly (line-clamp-2)
  - [ ] Descriptions truncate properly (line-clamp-2)
  - [ ] Tech stack badges don't overflow

- [ ] **No Live URL**
  - [ ] Live Demo button hidden if no liveUrl
  - [ ] GitHub button still shows (if githubUrl present)

---

## Final Checks

### 17. Console & Network

- [ ] **Browser Console**
  - [ ] No JavaScript errors
  - [ ] No React warnings
  - [ ] No accessibility warnings

- [ ] **Network Tab**
  - [ ] No 404 errors (missing images, fonts, etc.)
  - [ ] No CORS errors
  - [ ] Images load efficiently

### 18. Content Review

- [ ] **Project Content**
  - [ ] All 8 projects display correctly
  - [ ] Category distribution: 3 Aviation, 3 Dev/Startup, 2 Cross-pollination
  - [ ] Featured projects have metrics
  - [ ] Tech stack badges accurate

---

## Sign-Off

**Tester**: ___________________
**Date**: ___________________
**Status**: [ ] PASS [ ] FAIL [ ] NEEDS REVISION

**Issues Found** (if any):
1.
2.
3.

**Screenshots Captured**: [ ] Yes [ ] No
**Lighthouse Scores**:
- Performance: ____
- Accessibility: ____
- Best Practices: ____
- SEO: ____

**Deployment Approval**: [ ] APPROVED [ ] BLOCKED (reason: _______________)

---

## Next Steps

After completing this checklist:

1. **If PASS**: Run `/ship-staging` to deploy to staging environment
2. **If ISSUES FOUND**: Document in GitHub issue, fix, re-test
3. **Capture Screenshots**: Save screenshots for release notes
4. **Update Release Notes**: Add manual testing results to `release-notes.md`

---

**Generated**: 2025-10-29 by `/preview` command
**Accessibility Status**: ✅ WCAG 2.1 AA COMPLIANT (all 4 fixes applied)
**Build Status**: ✅ PASSING
**Code Quality**: ✅ APPROVED FOR PRODUCTION
