# Preview Testing Checklist: Homepage Redesign

**Generated**: 2025-10-30
**Tester**: Marcus Gollahon
**Branch**: quick/brand-color-tokens-core-hex

---

## Routes to Test

- [ ] http://localhost:3000/ (Homepage)

---

## User Scenarios

### Scenario 1: First-time visitor experience
- [ ] **Test**: User lands on homepage and immediately understands Marcus's dual identity (Pilot + Developer)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Any issues or observations]

### Scenario 2: Explore recent content
- [ ] **Test**: User browses latest articles with clear track indicators (Aviation vs Dev/Startup)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Any issues or observations]

### Scenario 3: Discover CFIPros project
- [ ] **Test**: User sees "What I'm Building" section and understands the CFIPros project
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Any issues or observations]

### Scenario 4: Newsletter signup
- [ ] **Test**: User signs up for dual-track newsletter (Aviation + Dev/Startup)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Any issues or observations]

### Scenario 5: Navigate to other sections
- [ ] **Test**: User uses header navigation to reach Articles, Projects, About, Contact pages
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Any issues or observations]

---

## Acceptance Criteria

### Hero Section
- [ ] Hero displays bold typography: "Pilot. Educator. Developer."
- [ ] Aircraft SVG animation displays smoothly on desktop (hidden on mobile)
- [ ] "What I fly" annotation appears near aircraft
- [ ] CTA buttons work: "Read Articles" → /blog, "Visit CFIPros" → cfipros.com
- [ ] Gradient background and grid pattern display correctly
- [ ] Dark mode switches cleanly (aircraft SVG, text colors, gradients)

### WhatImBuilding Section
- [ ] CFIPros project card displays with image
- [ ] Project description is clear and concise
- [ ] "Visit CFIPros" link works
- [ ] Section has proper spacing and visual hierarchy

### RecentPosts Section
- [ ] Displays latest 3 blog posts
- [ ] Each post shows: title, excerpt, published date, reading time
- [ ] Track indicators display correctly (Aviation/Dev-Startup/General)
- [ ] Track badges use emerald color scheme
- [ ] "View all articles" link → /blog works
- [ ] Post cards are clickable → /blog/[slug]

### Newsletter Section
- [ ] Form displays with email input
- [ ] Submit button works (simulated API currently)
- [ ] Success message appears after submission
- [ ] Dual-track value proposition is clear (Aviation + Dev/Startup icons)
- [ ] Form validation works (requires valid email)
- [ ] Disabled state during submission

### ContactSection
- [ ] Large CTA button with underline effect
- [ ] Button links to /contact
- [ ] Hover states work correctly

### Footer
- [ ] Navigation links work (Home, Blog, About, Contact)
- [ ] Social links work (X, GitHub, LinkedIn) - open in new tabs
- [ ] Copyright notice displays
- [ ] Dark mode styling correct

### Header
- [ ] Simplified navigation: Articles, Projects, About, Contact
- [ ] Logo/name links to homepage
- [ ] Mobile menu works (if implemented)
- [ ] Active page indicator (if applicable)

---

## Visual Validation

- [ ] Layout is clean and professional
- [ ] Colors match brand guidelines (emerald-600 primary, gray scale)
- [ ] Typography is readable (font families, sizes, weights)
- [ ] Spacing is consistent (8px grid system)
- [ ] Interactive elements have clear affordances (buttons, links, inputs)
- [ ] Responsive design works:
  - [ ] Mobile (320px - 767px)
  - [ ] Tablet (768px - 1023px)
  - [ ] Desktop (1024px+)
  - [ ] Aircraft hidden on mobile, visible on desktop
  - [ ] Hero text scales appropriately
  - [ ] Post grid: 1 column mobile → 3 columns desktop

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

- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Esc)
- [ ] Screen reader (NVDA/VoiceOver/JAWS)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast sufficient:
  - [ ] Emerald-600 on white: 4.5:1+
  - [ ] White on emerald-600: 4.5:1+
  - [ ] Gray-600 on white: 4.5:1+
  - [ ] Dark mode contrasts: 4.5:1+
- [ ] Touch targets ≥44px (buttons, links)
- [ ] ARIA labels present:
  - [ ] Newsletter email input
  - [ ] Social media links
  - [ ] Decorative SVGs marked aria-hidden="true"

**Screen reader tested**: [Name/None]

---

## Performance

- [ ] No console errors
- [ ] No console warnings
- [ ] Initial load feels fast (<3s perceived)
- [ ] Framer Motion animations smooth (60fps)
- [ ] Images load properly:
  - [ ] CFIPros.png
  - [ ] Dark.svg (dark mode aircraft)
  - [ ] Light.svg (light mode aircraft)
  - [ ] WhatIfly.svg
- [ ] ISR revalidation works (60s)
- [ ] Page transitions smooth

---

## Dark Mode Testing

- [ ] Toggle dark mode (system preference or manual)
- [ ] All components adapt correctly:
  - [ ] Hero gradient switches
  - [ ] Aircraft SVG switches (Light.svg → Dark.svg)
  - [ ] Text colors invert properly
  - [ ] Background colors invert
  - [ ] Newsletter section background
  - [ ] Footer styling
- [ ] No FOUC (flash of unstyled content)
- [ ] Smooth transition between modes

---

## Animation Testing

- [ ] Hero line animations:
  - [ ] Text fades in sequentially (Pilot, Educator, Developer)
  - [ ] Staggered delay (~150ms between lines)
  - [ ] Blur filter animates correctly
- [ ] Aircraft animation:
  - [ ] Flies in from bottom-right with rotation
  - [ ] Drop shadow effect present
- [ ] "What I fly" annotation fades in after aircraft
- [ ] CTA button arrow animates on loop
- [ ] Animations respect prefers-reduced-motion

---

## Newsletter API (Simulated)

- [ ] Form submits successfully
- [ ] Loading state displays ("Subscribing...")
- [ ] Success message appears ("Thanks for subscribing!")
- [ ] Form clears after success
- [ ] Error handling graceful (if simulated error)

**Note**: Real API integration needed post-preview

---

## Issues Found

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL or component]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]
- **Browser**: [Affected browsers]

---

## Test Results Summary

**Total scenarios tested**: ___ / 5
**Total criteria validated**: ___ / 60+
**Browsers tested**: ___ / 6
**Issues found**: ___

**Overall status**: ✅ Ready to ship | ⚠️ Minor issues | ❌ Blocking issues

**Tester signature**: _______________
**Date**: _______________

---

## Notes

- Homepage is a single-page application (no multi-page routes for this feature)
- This is the main landing page at the root URL (/)
- All homepage components are in `/components/home/`
- Hero uses HeroSplitHorizon variant (other variants renamed to .bak)
- Optimization report shows READY FOR DEPLOYMENT status

## Design Updates (2025-10-30)

### Changes Made
1. **Removed all gradients from hero section**:
   - Removed emerald gradient blur overlay
   - Removed aircraft glow gradient
   - Removed bottom fade transition
   - Result: Cleaner, simpler visual presentation

2. **Added Safari browser frame to CFIPros screenshot**:
   - Created Safari component (`components/ui/Safari.tsx`)
   - Realistic macOS browser window with:
     - Traffic light buttons (red, yellow, green)
     - Address bar showing "cfipros.com"
     - Rounded corners and proper shadows
   - Enhanced visual presentation of project showcase

### Visual Impact
- Hero section now has cleaner aesthetic without gradient overlays
- CFIPros project screenshot now appears as if viewed in Safari browser
- Maintains professional look while reducing visual noise
