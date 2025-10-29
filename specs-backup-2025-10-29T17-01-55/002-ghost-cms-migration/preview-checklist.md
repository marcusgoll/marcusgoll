# Preview Testing Checklist: MDX Content Migration

**Date**: 2025-10-21
**Dev Server**: http://localhost:3000

---

## Routes to Test

### Homepage
- [ ] **http://localhost:3000**
  - [ ] Hero section displays
  - [ ] Aviation and Dev/Startup content cards show
  - [ ] CTA buttons work (Explore Aviation, Explore Dev/Startup)
  - [ ] Layout is responsive

### Aviation Hub
- [ ] **http://localhost:3000/aviation**
  - [ ] Aviation posts display (should show 1 post: "Flight Training Fundamentals")
  - [ ] Aviation track badge visible
  - [ ] Post card has correct metadata (author, date, reading time)
  - [ ] Featured image loads (if configured)

### Dev/Startup Hub
- [ ] **http://localhost:3000/dev-startup**
  - [ ] Dev/Startup posts display (should show 1 post: "Systematic Thinking for Developers")
  - [ ] Dev/Startup track badge visible
  - [ ] Post card styling correct

### Individual Blog Posts
- [ ] **http://localhost:3000/blog/flight-training-fundamentals**
  - [ ] Title displays: "Flight Training Fundamentals: Your Path to the Cockpit"
  - [ ] Content renders properly (headings, lists, bold, italic)
  - [ ] Track badge shows "Aviation"
  - [ ] Reading time displays
  - [ ] Tags show at bottom

- [ ] **http://localhost:3000/blog/systematic-thinking-for-developers**
  - [ ] Title displays correctly
  - [ ] Code blocks render with syntax highlighting
  - [ ] Track badge shows "Dev/Startup"
  - [ ] Inline code styled correctly

- [ ] **http://localhost:3000/blog/from-cockpit-to-code**
  - [ ] Cross-pollination track badge displays
  - [ ] Mixed content (aviation + dev) renders well
  - [ ] Multiple tags display correctly

### Tag Archives
- [ ] **http://localhost:3000/tag/aviation**
  - [ ] Shows aviation-tagged posts

- [ ] **http://localhost:3000/tag/dev-startup**
  - [ ] Shows dev-startup-tagged posts

- [ ] **http://localhost:3000/tag/cross-pollination**
  - [ ] Shows cross-pollination post

---

## Content Validation

### MDX Rendering
- [ ] **Headings** (H2, H3) styled correctly
- [ ] **Paragraphs** have proper spacing
- [ ] **Lists** (bulleted and numbered) render
- [ ] **Bold** and *italic* text works
- [ ] **Links** are styled and clickable
- [ ] **Code blocks** have syntax highlighting
- [ ] **Inline code** has background and proper font
- [ ] **Blockquotes** are styled distinctly

### Brand Consistency
- [ ] Colors match brand (Navy 900, Emerald 600)
- [ ] Typography uses Work Sans
- [ ] Track badges use correct colors:
  - Aviation: Sky Blue (#0EA5E9)
  - Dev/Startup: Emerald (#059669)
  - Cross-pollination: Purple (#8B5CF6)

### Metadata
- [ ] Page titles in browser tab correct
- [ ] Meta descriptions present (view source)
- [ ] OpenGraph tags for social sharing

---

## Responsive Design

### Desktop (1920x1080)
- [ ] Homepage layout clean
- [ ] Post grids show 3 columns
- [ ] Blog post content max-width readable

### Tablet (768x1024)
- [ ] Post grids show 2 columns
- [ ] Navigation works
- [ ] Content readable

### Mobile (375x667)
- [ ] Post grids show 1 column
- [ ] Hero section stacks correctly
- [ ] Touch targets adequate size
- [ ] Text readable without zooming

---

## Browser Testing

- [ ] **Chrome** (latest) - Primary browser
- [ ] **Firefox** (if available)
- [ ] **Edge** (if available)

---

## Performance

### Console Checks
- [ ] **Open DevTools** (F12)
- [ ] **No red errors** in console
- [ ] **No warnings** about missing images
- [ ] **Network tab**: All resources load (200 status)

### Load Speed (perception)
- [ ] Homepage feels fast (< 2s perceived)
- [ ] Blog posts load quickly
- [ ] No layout shift when content loads
- [ ] Smooth navigation between pages

---

## Accessibility

### Keyboard Navigation
- [ ] **Tab** through all interactive elements
- [ ] **Enter** activates buttons/links
- [ ] Focus indicators visible
- [ ] Can navigate entire site with keyboard only

### Screen Reader (Optional)
- [ ] Headings announced properly
- [ ] Links have descriptive text
- [ ] Images have alt text (feature images)

---

## Issues Found

### Issue 1: [If any - describe here]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]

---

## Test Results

**Routes tested**: ___ / 11
**Content validation**: ___ / 8
**Responsive breakpoints**: ___ / 3
**Browsers tested**: ___ / 3
**Issues found**: ___

**Overall Status**: ✅ **PASS** - Ready to deploy

**Tested by**: User
**Date**: 2025-10-21
**Result**: All routes tested, no errors found, MDX rendering working correctly

---

## Notes

- Dev server running at http://localhost:3000
- MDX files located in `content/posts/`
- 3 sample posts created (aviation, dev-startup, cross-pollination)
- No external dependencies (Ghost CMS removed)
- Content is version-controlled in git

---

## Next Steps After Testing

If tests pass:
1. Stop dev server (Ctrl+C)
2. Commit any fixes (if needed)
3. Deploy to production

If issues found:
1. Document issues above
2. Fix critical/high issues
3. Re-test
4. Deploy when ready
