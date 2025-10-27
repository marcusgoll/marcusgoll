# Preview Testing Checklist: Individual Post Pages

**Generated**: 2025-10-22
**Tester**: [Your name]
**Feature**: 003-individual-post-page

---

## Routes to Test

- [ ] http://localhost:3000/blog/interactive-mdx-demo
- [ ] http://localhost:3000/blog/welcome-to-mdx

---

## User Scenarios (MVP - P1)

### Scenario 1: Related Posts Discovery

- [ ] **Test**: Finish reading a blog post and scroll to bottom - should see 3 related posts based on shared tags
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Check that posts share tags, verify 3 posts shown, check fallback to "Latest Posts" if <3 related]

### Scenario 2: Table of Contents Navigation

- [ ] **Test**: Load a post with 6+ headings - table of contents should appear with clickable section links
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Verify desktop sidebar, mobile collapsible, smooth scroll with offset, active section highlighting]

### Scenario 3: Social Sharing

- [ ] **Test**: Click share buttons - should be able to share to Twitter, LinkedIn, or copy URL
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Test each platform, verify URL copied, check "Copied!" confirmation]

### Scenario 4: Previous/Next Navigation

- [ ] **Test**: Scroll to bottom - should see "Previous" and "Next" post navigation
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Verify chronological order, check first/last post only shows one button]

### Scenario 5: Schema.org Structured Data

- [ ] **Test**: View page source - BlogPosting schema should be present
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Run Google Rich Results Test, verify headline, datePublished, author, image]

### Scenario 6: Breadcrumb Navigation

- [ ] **Test**: Check breadcrumb trail - should show Home > Blog > [Tag/Post]
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**: [Verify all links clickable, check BreadcrumbList schema in source]

---

## Acceptance Criteria (All User Stories)

### US1: Related Posts (P1)
- [ ] Related posts section displays 3 posts with shared tags
- [ ] Falls back to "Latest Posts" if <3 related posts available
- [ ] Each related post shows title, excerpt (120 chars), date, thumbnail
- [ ] Tag overlap algorithm working correctly

### US2: Previous/Next Navigation (P1)
- [ ] "← Previous" and "Next →" buttons appear at bottom
- [ ] Buttons link to chronologically adjacent posts (by publish date)
- [ ] First/last post shows only one button (non-existent direction disabled)

### US3: Schema.org Structured Data (P1)
- [ ] BlogPosting schema includes headline, datePublished, author, image, articleBody
- [ ] Validates with Google's Rich Results Test
- [ ] Author schema includes name and URL (https://marcusgoll.com)

### US4: Social Sharing (P2)
- [ ] Share buttons for Twitter, LinkedIn, Copy Link appear below post title
- [ ] Twitter share includes post title and URL
- [ ] LinkedIn share opens LinkedIn dialog with URL
- [ ] Copy Link button copies URL and shows "✓ Copied" confirmation

### US5: Table of Contents (P2)
- [ ] TOC auto-generates from H2 and H3 headings (excludes H1)
- [ ] TOC shows as fixed sidebar on desktop (>1024px)
- [ ] TOC shows as collapsible accordion on mobile (<1024px), collapsed by default
- [ ] Clicking TOC link smoothly scrolls with 80px offset
- [ ] Active section highlighted in TOC as user scrolls
- [ ] TOC only appears if post has 3+ headings

### US6: Breadcrumbs (P2)
- [ ] Breadcrumbs show: Home > Blog > [Tag] > [Post Title]
- [ ] Each breadcrumb segment is clickable link
- [ ] If accessed via tag page, breadcrumbs include tag
- [ ] Uses BreadcrumbList schema structured data

---

## Edge Cases

- [ ] Post with no related posts (shows "Latest Posts" instead)
- [ ] Post with only 1-2 headings (TOC not displayed)
- [ ] Post without featured image (uses default OG image)
- [ ] TOC behavior on mobile (collapsible, proper touch targets)
- [ ] Social share on first/last post in chronology
- [ ] Copy Link on browsers without Clipboard API

---

## Visual Validation

- [ ] Layout is clean and professional
- [ ] Colors match brand guidelines
- [ ] Typography is readable (font families, sizes, weights)
- [ ] Spacing is consistent (Tailwind spacing tokens)
- [ ] Interactive elements have clear affordances (buttons, links, inputs)
- [ ] Responsive design works (mobile 375px, tablet 768px, desktop 1024px+)
- [ ] Related posts cards are visually balanced
- [ ] TOC sidebar doesn't overlap content
- [ ] Breadcrumbs are subtle but visible
- [ ] Social share buttons have appropriate hover states

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

- [ ] Keyboard navigation (Tab through all interactive elements)
- [ ] Screen reader announces related posts properly
- [ ] Screen reader announces TOC sections
- [ ] Screen reader announces breadcrumb trail
- [ ] Focus indicators visible on all buttons/links
- [ ] Color contrast sufficient (4.5:1 normal, 3:1 large text)
- [ ] Touch targets ≥44px (social buttons, TOC links, prev/next)
- [ ] ARIA labels present (social share buttons, navigation)
- [ ] Semantic HTML (nav, article, aside elements)
- [ ] Skip links work properly

**Screen reader tested**: [NVDA/VoiceOver/JAWS/None]

---

## Performance

- [ ] No console errors
- [ ] No console warnings (check /ship recommendation: 4 console.error to fix)
- [ ] Initial load feels fast (<3s perceived)
- [ ] TOC scroll spy doesn't cause jank
- [ ] Smooth scrolling works properly
- [ ] Images load properly (related posts thumbnails)
- [ ] IntersectionObserver for TOC performs well
- [ ] No layout shift when TOC renders

---

## Component-Specific Tests

### Related Posts Component
- [ ] Displays 3 posts maximum
- [ ] Tag overlap algorithm prioritizes correctly
- [ ] Fallback to latest posts works
- [ ] Responsive grid (1 col mobile, 3 col desktop)
- [ ] Click on post navigates correctly

### Table of Contents Component
- [ ] Extracts headings correctly (H2/H3 only)
- [ ] Active section tracking works
- [ ] Smooth scroll has proper offset
- [ ] Collapses on mobile properly
- [ ] Touch targets adequate on mobile

### Social Share Component
- [ ] Web Share API detected correctly
- [ ] Clipboard API fallback works
- [ ] Confirmation message appears
- [ ] Opens correct URLs for each platform
- [ ] No console errors on unsupported browsers

### Previous/Next Navigation
- [ ] Correct posts linked
- [ ] Disabled state for first/last post
- [ ] Descriptive link text (post titles)
- [ ] Hover states work

### Breadcrumbs Component
- [ ] All links work correctly
- [ ] aria-current="page" on current item
- [ ] Schema.org markup present
- [ ] Responsive (truncates on mobile if needed)

---

## Schema.org Validation

- [ ] Run Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] BlogPosting schema validates
- [ ] BreadcrumbList schema validates
- [ ] Author Person schema validates
- [ ] Image URLs are absolute
- [ ] datePublished and dateModified present

**Rich Results Test URL**: [Paste result URL]
**Validation Status**: [Pass/Fail/Warnings]

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
- **Screenshot**: [If captured]

---

## Known Issues from Optimization

From optimization report (non-blocking):
1. **H-1**: 4 console.error statements in social-share.tsx (replace with error tracking)
2. **H-2**: 7 hardcoded URLs in page.tsx and schema.ts (extract to config)

- [ ] Verify console.error appears during testing
- [ ] Verify hardcoded URLs work in dev environment
- [ ] Document if these cause actual issues in preview

---

## Test Results Summary

**Total scenarios tested**: ___ / 6
**Total criteria validated**: ___ / 27
**Browsers tested**: ___ / 6
**Edge cases validated**: ___ / 6
**Issues found**: ___

**Overall status**:
- [ ] ✅ Ready to ship (all tests pass, no critical issues)
- [ ] ⚠️ Minor issues (document and ship anyway)
- [ ] ❌ Blocking issues (fix before shipping)

**Tester signature**: _______________
**Date**: _______________

---

## Notes for Tester

**Testing priorities:**
1. Related posts algorithm (verify tag overlap logic)
2. TOC scroll spy (check performance, no jank)
3. Social share (test all platforms + clipboard)
4. Schema.org validation (Google Rich Results Test)
5. Accessibility (keyboard nav, screen reader)
6. Mobile responsiveness (all components)

**Dev server notes:**
- Run: `npm run dev` (should already be configured from pre-flight)
- Port: 3000 (Next.js app)
- Kill existing: `npx kill-port 3000` if needed

**Quick test route:**
http://localhost:3000/blog/interactive-mdx-demo (has interactive components, good for testing)
