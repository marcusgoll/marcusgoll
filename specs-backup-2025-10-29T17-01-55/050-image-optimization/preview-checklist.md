# Preview Testing Checklist: Image Optimization (Next.js Image)

**Generated**: 2025-10-28
**Tester**: [Your name]
**Feature Type**: Infrastructure optimization (applies globally across all pages)

---

## Test Environment Setup

Before testing, ensure:
- [ ] Dev server running on http://localhost:3000
- [ ] Chrome DevTools open (F12)
- [ ] Network tab with "Disable cache" enabled
- [ ] Slow 3G throttling profile available

**Primary Test Routes**:
- [ ] Homepage: http://localhost:3000
- [ ] Blog post (any): http://localhost:3000/blog/[any-post-slug]
- [ ] Blog index: http://localhost:3000/blog

---

## US1: Image Optimization Configuration

**Goal**: Verify Next.js image optimization is properly configured

### Configuration Checks
- [ ] Images are served in WebP or AVIF format (check Network tab → Type column)
- [ ] Responsive image URLs contain `?w=` width parameter
- [ ] Image URLs route through `/_next/image/` optimization endpoint
- [ ] No "Unoptimized Image" warnings in console

### Test Steps:
1. Open http://localhost:3000
2. Open DevTools → Network tab
3. Filter by "Img"
4. Reload page
5. Inspect image requests

**Expected**:
- Content-Type: `image/webp` or `image/avif` for modern browsers
- URLs like: `/_next/image?url=...&w=640&q=75`

**Actual**: _____________________________________________

---

## US2: Blur Placeholder Behavior

**Goal**: Verify smooth loading transitions with blur placeholders

### Visual Placeholder Tests
- [ ] Homepage featured images show shimmer/blur before loading
- [ ] Blog post hero image shows placeholder
- [ ] Inline MDX images show placeholders
- [ ] No jarring "pop-in" when images load
- [ ] Placeholders maintain correct aspect ratio (no layout shift)

### Test Steps:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Reload http://localhost:3000
4. Observe image loading behavior
5. Watch for layout shifts using Performance tab

**CLS Score** (from DevTools Performance): _____________

**Target**: <0.1 (Good)

**Placeholder Quality**:
- [ ] Smooth fade-in transition
- [ ] Shimmer effect visible during load
- [ ] No content jumping

**Actual behavior**: _____________________________________________

---

## US3: Priority Loading (Above-the-Fold)

**Goal**: Verify hero/featured images load immediately with priority={true}

### Priority Image Tests
- [ ] Homepage hero image loads first (before below-fold images)
- [ ] Featured post cards load with priority
- [ ] Priority images have preload hints in HTML (`<link rel="preload">`)
- [ ] Below-fold images lazy load (not fetched until scrolling)

### Test Steps:
1. Open http://localhost:3000
2. DevTools → Network tab → Img filter
3. **DO NOT SCROLL** after page load
4. Check which images loaded
5. Now scroll down
6. Check if additional images load

**Expected**:
- Only above-the-fold images load initially
- Below-fold images load on scroll

**Images loaded before scroll**: _____________
**Images loaded after scroll**: _____________

### LCP Measurement
1. DevTools → Lighthouse tab
2. Desktop mode
3. Run audit
4. Check "Largest Contentful Paint" metric

**LCP Score**: _____________ seconds

**Target**: <2.5s (Good)

---

## US4: Consistent Sizing Patterns

**Goal**: Verify images use proper sizing patterns (fill vs width/height)

### Component Pattern Checks
- [ ] PostCard: Uses fill layout with aspect ratio
- [ ] MagazineMasonry hero: Proper aspect ratio maintained
- [ ] MagazineMasonry grid: Consistent sizing
- [ ] FeaturedPostsSection: Responsive sizing works
- [ ] MDXImage (blog content): Images scale correctly

### Responsive Behavior
Test at these viewport sizes:
- [ ] Mobile (375px): Images fill width properly
- [ ] Tablet (768px): Images adapt to grid
- [ ] Desktop (1200px+): Images maintain proper proportions

**Resize browser and verify no image distortion**

**Issues found**: _____________________________________________

---

## US5: Accessibility (Alt Text)

**Goal**: Verify all images have descriptive alt text

### Alt Text Audit
- [ ] Homepage featured images have descriptive alt text
- [ ] Blog post hero has meaningful alt
- [ ] Inline MDX images have alt attributes
- [ ] Profile/author images identified correctly
- [ ] No generic "image" or empty alt text (except decorative)

### Screen Reader Test (Optional but Recommended)
- [ ] Enable VoiceOver (Mac: Cmd+F5) or Narrator (Windows: Win+Ctrl+Enter)
- [ ] Navigate through images with VO/Tab
- [ ] Verify alt text is announced properly

**Screen reader used**: _____________
**Alt text quality**: Good / Needs Improvement / Poor

**Issues found**: _____________________________________________

---

## Visual Validation

**Goal**: Ensure optimization doesn't break visual design

### Layout Checks
- [ ] Images display at correct sizes (not pixelated or oversized)
- [ ] Aspect ratios preserved (no squishing/stretching)
- [ ] Images aligned properly in grid layouts
- [ ] No broken images (404 errors)
- [ ] Rounded corners/styling preserved

### Color & Quality
- [ ] WebP/AVIF images maintain good visual quality
- [ ] No visible compression artifacts
- [ ] Colors accurate (not washed out)

**Visual quality**: Excellent / Good / Acceptable / Poor

---

## Browser Testing

Test on multiple browsers to verify format fallbacks work:

- [ ] Chrome (latest) - Should receive AVIF
- [ ] Firefox (latest) - Should receive AVIF
- [ ] Safari (latest) - Should receive WebP
- [ ] Edge (latest) - Should receive AVIF

**Testing device/OS**: _____________________________________________

**Format received** (check Network tab Content-Type):
- Chrome: _____________
- Firefox: _____________
- Safari: _____________
- Edge: _____________

---

## Performance Validation

### Lighthouse Audit
1. DevTools → Lighthouse
2. Desktop mode
3. Clear storage: ✓
4. Run audit

**Scores**:
- Performance: _____ / 100 (Target: ≥90)
- Accessibility: _____ / 100 (Target: ≥95)
- Best Practices: _____ / 100 (Target: ≥90)

### Core Web Vitals
- LCP: _____ s (Target: <2.5s)
- CLS: _____ (Target: <0.1)
- FID/INP: _____ ms (Target: <100ms)

### Image Transfer Size
1. DevTools → Network → Img filter
2. Reload page
3. Check "Size" column total

**Before optimization** (from baseline): _____________
**After optimization**: _____________
**Reduction**: _____________% (Target: -30%)

---

## Mobile Testing

### Device Emulation
- [ ] Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)
- [ ] Test iPhone SE (375px width)
- [ ] Test iPhone 14 Pro (390px width)
- [ ] Test iPad (768px width)

### Mobile-Specific Checks
- [ ] Images sized appropriately for mobile (not oversized)
- [ ] Smaller image variants served (check `?w=` parameter)
- [ ] Touch targets for image overlays ≥44px
- [ ] Images load quickly on "Fast 3G" throttling

**Mobile performance**: Good / Acceptable / Poor

---

## Error & Edge Case Testing

### Error Scenarios
- [ ] What happens if external image URL fails? (Test by breaking URL in code)
- [ ] What happens with missing alt text? (Check console warnings)
- [ ] What happens with very large images (>5MB)? (Performance impact)

### Console Checks
- [ ] No React errors
- [ ] No Next.js Image warnings
- [ ] No missing source warnings
- [ ] No CORS errors for external images

**Console clean**: Yes / No

**Errors found**: _____________________________________________

---

## Acceptance Scenarios Validation

### Scenario 1: Homepage Image Loading
**Given** I visit the homepage
**When** I scroll through the post feed
**Then** Images load progressively with smooth placeholder transitions

- [ ] PASS
- [ ] FAIL

**Notes**: _____________________________________________

### Scenario 2: Blog Post Hero Loading
**Given** I open a blog post with featured image
**When** The page loads
**Then** Hero image appears immediately above fold without layout shift

- [ ] PASS
- [ ] FAIL

**Notes**: _____________________________________________

### Scenario 3: Slow Connection Behavior
**Given** I'm on a slow 3G connection
**When** I load any page with images
**Then** Appropriately sized images served, WebP/AVIF format delivered

- [ ] PASS
- [ ] FAIL

**Network throttling used**: Slow 3G
**Formats received**: _____________

### Scenario 4: MDX Inline Images
**Given** I view a blog post with inline MDX images
**When** Images load
**Then** Proper aspect ratios, alt text, optimized formats, no blocking

- [ ] PASS
- [ ] FAIL

**Notes**: _____________________________________________

---

## Issues Found

*Document any issues below with this format:*

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL or component name]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]
- **Browser/Device**: [Affected platforms]
- **Screenshot**: [If available]

---

*(Add more issues as needed)*

---

## Test Results Summary

**Total acceptance scenarios tested**: _____ / 4
**Browser coverage**: _____ / 4
**Mobile devices tested**: _____ / 3
**Lighthouse Performance**: _____ / 100
**Critical issues found**: _____
**Minor issues found**: _____

**Overall status**:
- [ ] ✅ Ready to ship (all tests pass, no critical issues)
- [ ] ⚠️ Ready with minor issues (document and ship)
- [ ] ❌ Blocked (critical issues must be fixed)

**Recommendation**: _____________________________________________

**Tester signature**: _______________
**Date**: _______________
**Time spent testing**: _______________

---

## Next Steps

If tests pass:
- Run `/ship continue` to proceed to staging deployment

If issues found:
- Fix critical blockers
- Re-run `/preview` to verify fixes
- Document remaining minor issues for post-deployment tracking
