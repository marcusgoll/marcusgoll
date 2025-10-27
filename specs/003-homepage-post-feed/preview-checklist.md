# Preview Testing Checklist: homepage-post-feed

**Generated**: 2025-10-24 18:45:00 UTC
**Feature**: Homepage with Enhanced Post Feed
**Tester**: [Your name]

---

## Routes to Test

### Production Routes
- [ ] http://localhost:3000/ (Homepage - Dual-track view)
- [ ] http://localhost:3000/?view=unified (Homepage - Unified view)
- [ ] http://localhost:3000/?track=aviation (Homepage - Aviation filter)
- [ ] http://localhost:3000/?track=dev-startup (Homepage - Dev/Startup filter)
- [ ] http://localhost:3000/?track=cross-pollination (Homepage - Cross-pollination filter)

### Mockup Comparison Routes
- [ ] http://localhost:3000/mock/homepage-post-feed/homepage/m2-functional-polished (Polished mockup)

---

## User Stories Testing

### Story 1: View All Posts in Unified Feed

**Given** I am a visitor on the homepage
**When** I select "All Posts" or unified view button
**Then** I see all posts from both tracks displayed chronologically

- [ ] **Test**: Click "All Posts" button on homepage
- [ ] **Verify**: URL updates to `?view=unified`
- [ ] **Verify**: All posts displayed in single chronological feed
- [ ] **Verify**: Each post shows track badge (Aviation / Dev/Startup)
- [ ] **Verify**: Back button returns to previous view
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: ___________________________

### Story 2: Filter Posts by Content Track

**Given** I am viewing the homepage post feed
**When** I select a specific track filter
**Then** I see only posts from the selected track

- [ ] **Test**: Click "Aviation" filter in sidebar
- [ ] **Verify**: URL updates to `?track=aviation`
- [ ] **Verify**: Only aviation posts displayed
- [ ] **Test**: Click "Dev/Startup" filter
- [ ] **Verify**: URL updates to `?track=dev-startup`
- [ ] **Verify**: Only dev/startup posts displayed
- [ ] **Test**: Refresh page with filter active
- [ ] **Verify**: Filter state persists after reload
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: ___________________________

### Story 3: Load More Posts

**Given** I am viewing the homepage with more than 6 posts available
**When** I click the "Load More" button
**Then** Additional posts are loaded and appended

- [ ] **Test**: Scroll to "Load More" button
- [ ] **Verify**: Button is visible and accessible
- [ ] **Test**: Click "Load More" button
- [ ] **Verify**: Button shows loading spinner/state
- [ ] **Verify**: Next 6 posts appear below existing posts
- [ ] **Verify**: Scroll position maintained (no jump)
- [ ] **Test**: Continue clicking until no more posts
- [ ] **Verify**: Button hidden when all posts loaded
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: ___________________________

### Story 4: Maintain Dual-Track View (Default)

**Given** I visit the homepage without parameters
**When** The page loads
**Then** I see the dual-track layout (Aviation + Dev/Startup sections)

- [ ] **Test**: Visit http://localhost:3000/ (no params)
- [ ] **Verify**: Two separate track sections visible
- [ ] **Verify**: "Aviation" section shows recent aviation posts
- [ ] **Verify**: "Dev/Startup" section shows recent dev posts
- [ ] **Verify**: Toggle button to switch to unified view present
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: ___________________________

---

## Functional Requirements Validation

### FR-001: Unified Feed View
- [ ] Unified view displays all posts chronologically (newest first)
- [ ] URL parameter `?view=unified` activates unified view
- [ ] Default view is dual-track (no URL param)
- [ ] View toggle UI is intuitive and accessible (keyboard + screen reader)

### FR-002: Track Filtering
- [ ] Filter options: Aviation, Dev/Startup, Cross-pollination, All
- [ ] URL parameter `?track={slug}` reflects active filter
- [ ] Filter state persists across page navigations (browser back/forward)
- [ ] Filter UI visible on mobile and desktop
- [ ] Filtered results update without full page reload

### FR-004: Load More Pagination
- [ ] Initial load shows 6 posts (or appropriate count for dual-track)
- [ ] "Load More" button fetches and appends next 6 posts
- [ ] Button shows loading state during fetch
- [ ] Button hidden when no more posts available
- [ ] Scroll position maintained after load

---

## Visual Validation

### Layout & Structure
- [ ] Sidebar navigation fixed on desktop, collapsible on mobile
- [ ] Post cards maintain consistent spacing and alignment
- [ ] Grid/magazine layout responsive (1 col mobile, 2-3 cols desktop)
- [ ] Hero section displays properly with newsletter CTA
- [ ] Filter buttons have clear active state indication

### Typography & Colors
- [ ] Font families match design system (Inter/system fonts)
- [ ] Heading sizes appropriate (h1, h2, h3 hierarchy)
- [ ] Body text readable (16px minimum, 1.5 line-height)
- [ ] Track badges use brand colors (aviation blue, dev/startup purple)
- [ ] Links have visible hover states

### Components
- [ ] Button styles consistent (primary, outline, ghost variants)
- [ ] Newsletter dialog opens and closes correctly
- [ ] Mobile menu hamburger works (open/close)
- [ ] Load more button has clear affordance
- [ ] Post cards show image, title, excerpt, date, tags

### Responsive Design
- [ ] Mobile (375px): Single column, sidebar collapses to hamburger
- [ ] Tablet (768px): 2-column grid, sidebar visible or toggleable
- [ ] Desktop (1440px): 3-column grid, sidebar fixed
- [ ] Touch targets ≥44px on mobile
- [ ] No horizontal scroll on any breakpoint

---

## Interaction Testing

### View Toggle
- [ ] Click "Dual-Track View" → Shows dual sections
- [ ] Click "All Posts" → Shows unified feed
- [ ] Active button has visual indication (bg color, border)
- [ ] Transition smooth (no flash of content)

### Track Filter
- [ ] Click filter in sidebar → Updates URL and content
- [ ] Active filter highlighted in sidebar
- [ ] Filter persists on page refresh
- [ ] "All Posts" filter shows unfiltered feed

### Load More
- [ ] Button disabled during loading
- [ ] Loading spinner visible
- [ ] New posts fade in smoothly
- [ ] No layout shift/jump
- [ ] Button disappears when exhausted

### Newsletter CTA
- [ ] Click "Subscribe" opens dialog
- [ ] Email input validates format
- [ ] Submit button enabled only with valid email
- [ ] Close button/ESC key closes dialog
- [ ] Clicking outside dialog closes it

---

## Browser Testing

**Test on the following browsers:**

- [ ] Chrome (latest) - **Version**: _____
- [ ] Firefox (latest) - **Version**: _____
- [ ] Safari (latest) - **Version**: _____
- [ ] Edge (latest) - **Version**: _____
- [ ] Mobile Safari (iOS) - **Device**: _____
- [ ] Chrome Mobile (Android) - **Device**: _____

**Testing device**: ___________________________

**Issues by browser**: ___________________________

---

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] Tab key navigates through interactive elements in logical order
- [ ] Shift+Tab navigates backwards
- [ ] Enter key activates buttons and links
- [ ] ESC key closes dialogs and mobile menu
- [ ] Focus indicators visible on all interactive elements (2px outline)
- [ ] No keyboard traps (can tab out of all components)

### Screen Reader Testing
- [ ] Page title announces correctly ("Marcus Gollahon - Homepage")
- [ ] Headings have proper hierarchy (h1 → h2 → h3)
- [ ] Buttons have descriptive labels ("Load More Posts", not just "Load More")
- [ ] Links have context ("Read full article", not just "Read more")
- [ ] Filter buttons announce state (aria-pressed="true/false")
- [ ] Load more button announces loading state
- [ ] Newsletter dialog announced when opened
- [ ] Track badges readable ("Content track: Aviation")

**Screen reader tested**: [NVDA / VoiceOver / JAWS / None]
**Critical issues**: ___________________________

### Color Contrast
- [ ] Body text: 4.5:1 minimum (test with contrast checker)
- [ ] Headings: 4.5:1 minimum for normal, 3:1 for large (18px+)
- [ ] Button text: 4.5:1 against button background
- [ ] Track badges: 4.5:1 text contrast
- [ ] Links: Distinguishable from body text (underline or strong color diff)

### Touch Targets (Mobile)
- [ ] All buttons ≥44px × 44px
- [ ] Filter buttons adequately sized for thumbs
- [ ] Newsletter CTA button large enough
- [ ] Mobile menu toggle ≥44px
- [ ] Adequate spacing between adjacent clickable elements (8px minimum)

---

## Performance

### Console Checks
- [ ] No JavaScript errors in console (F12 → Console)
- [ ] No React warnings in development mode
- [ ] No 404 errors for images, fonts, or assets
- [ ] No CORS errors for API calls
- [ ] No duplicate key warnings (React lists)

### Load Performance
- [ ] Initial page load feels fast (<3s perceived)
- [ ] Images load progressively (blur-up or skeleton)
- [ ] No layout shift during image load (CLS < 0.1)
- [ ] Font flash minimal (FOUT/FOIT acceptable)
- [ ] JavaScript bundle size reasonable (check Network tab)

### Interaction Performance
- [ ] View toggle feels instant (< 100ms)
- [ ] Filter change feels instant (< 100ms)
- [ ] Load more completes in < 2s (simulated delay acceptable)
- [ ] Scroll feels smooth (60fps, no janks)
- [ ] Hover states instant (no lag)
- [ ] Mobile menu animation smooth

### Network Analysis
- [ ] Check Network tab (F12): Total transfer size reasonable
- [ ] Images optimized (WebP/AVIF if supported)
- [ ] Fonts subset or preloaded
- [ ] No unnecessary requests
- [ ] API calls debounced/cached if applicable

---

## Design Comparison (Mockup vs Production)

**Polished Mockup**: http://localhost:3000/mock/homepage-post-feed/homepage/m2-functional-polished
**Production**: http://localhost:3000/

### Visual Parity Check
- [ ] Layout matches (spacing, alignment, grid columns)
- [ ] Colors match design tokens (no hardcoded hex values in production)
- [ ] Typography matches (family: Inter, sizes: 14-48px, weights: 400-700)
- [ ] Components match (buttons, cards, inputs, badges)
- [ ] Hover/focus states match mockup interactions
- [ ] Transitions/animations match (duration, easing)

**Intentional differences noted**:
___________________________________________

**Unintentional differences (bugs)**:
___________________________________________

---

## Edge Cases & Error Handling

### Data Edge Cases
- [ ] **Empty state**: Homepage with 0 posts (should show message)
- [ ] **Single post**: Homepage with only 1 post
- [ ] **Exactly 6 posts**: Load more button hidden correctly
- [ ] **Uneven tracks**: 10 aviation posts, 2 dev posts (dual-track balance)
- [ ] **No aviation posts**: Aviation section hidden or shows message
- [ ] **No dev posts**: Dev section hidden or shows message
- [ ] **Very long post title**: Title wraps correctly, no overflow
- [ ] **Missing post image**: Fallback image or graceful degradation

### Interaction Edge Cases
- [ ] **Rapid clicking**: Load more button disabled during load (no double-fetch)
- [ ] **Filter while loading**: Handles state change gracefully
- [ ] **View toggle while loading**: Cancels pending load or waits
- [ ] **Browser back during load**: Cancels load, restores previous state
- [ ] **Network offline**: Error message displayed (not crash)

---

## Issues Found

*Document any issues below with format:*

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL or component path]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]
- **Browser**: [Affected browsers]
- **Screenshots**: [Link to screenshot if captured]

---

## Test Results Summary

**Routes tested**: ___ / 5 production routes
**User stories validated**: ___ / 4 stories
**Functional requirements met**: ___ / 3 requirements
**Browsers tested**: ___ / 6
**Accessibility checks passed**: ___ / 4 categories
**Issues found**: ___

**Overall status**:
- [ ] ✅ Ready to ship (no critical issues, minor issues documented)
- [ ] ⚠️ Minor issues (can ship with known issues)
- [ ] ❌ Blocking issues (must fix before shipping)

**Tester signature**: _______________
**Date**: _______________

---

## Notes

- This checklist generated from `specs/003-homepage-post-feed/spec.md`
- Design mockup available at `/mock/homepage-post-feed/homepage/m2-functional-polished`
- All critical fixes from optimization phase already applied
- Build passes with warnings only (mock files, non-blocking)
