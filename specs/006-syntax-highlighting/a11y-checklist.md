# Accessibility Checklist (Manual Validation Needed)

## Feature: Syntax Highlighting Enhancements (006)
**Target**: WCAG 2.1 AA compliance (NFR-002)
**Date**: 2025-10-24

---

## Keyboard Navigation

- [ ] Tab to copy button works (focus ring visible)
- [ ] Enter/Space activates copy button
- [ ] Code blocks are in proper tab order
- [ ] Focus indicators are clearly visible (meets 3:1 contrast)
- [ ] Tab navigation does not skip interactive elements
- [ ] Escape key exits focused elements appropriately

**Current Status**:
- Copy button has `aria-label="Copy code"` (CONFIRMED)
- No keyboard event handlers detected (NEEDS IMPLEMENTATION)
- Copy button relies on mouse click only (ACCESSIBILITY GAP)

---

## Screen Reader

- [ ] Code language announced to screen reader users
- [ ] Highlighted lines have appropriate ARIA labels
- [ ] Copy button has descriptive label (not just "button")
- [ ] Code content is readable by screen readers
- [ ] ARIA live region announces "Code copied" feedback
- [ ] Code block metadata (filename, language) is accessible

**Current Status**:
- Copy button has `aria-label="Copy code"` (CONFIRMED)
- No ARIA live region for copy feedback (NEEDS IMPLEMENTATION)
- No ARIA labels for highlighted lines (NEEDS IMPLEMENTATION)
- No `role="code"` or semantic markup beyond HTML5 (ACCEPTABLE)

---

## Color Contrast (WCAG AA)

### Text Contrast (4.5:1 minimum)

- [ ] Light theme code text contrast ≥4.5:1
- [ ] Dark theme code text contrast ≥4.5:1
- [ ] Comments, keywords, strings all meet contrast requirements
- [ ] Inline code contrast ≥4.5:1

**Current Status**:
- GitHub Light theme: Built-in WCAG AA compliance (CONFIRMED)
- GitHub Dark theme: Built-in WCAG AA compliance (CONFIRMED)
- Source: Shiki themes from VS Code (accessibility-tested)

### UI Element Contrast (3:1 minimum)

- [ ] Highlighted line background contrast ≥3:1 against base
- [ ] Copy button contrast ≥3:1 (text and background)
- [ ] Filename header contrast ≥3:1
- [ ] Border/separator contrast ≥3:1

**Current Status**:
- Highlighted lines: `rgba(255, 212, 0, 0.1)` light, `rgba(255, 212, 0, 0.15)` dark
- **NEEDS MANUAL CHECK**: Contrast ratio needs verification with actual rendered output
- Copy button: Gray on dark background (NEEDS CONTRAST CHECK)

---

## Responsive Design

- [ ] Horizontal scroll works on mobile (<768px)
- [ ] Copy button is accessible on touch devices
- [ ] Font size is readable on small screens (minimum 14px)
- [ ] No content is cut off at narrow widths
- [ ] Touch targets are at least 44x44px (iOS/Android guidelines)
- [ ] Pinch-to-zoom is not disabled

**Current Status**:
- Code blocks have `overflow-x: auto` (CONFIRMED)
- Copy button size: `text-xs` (NEEDS SIZE CHECK for 44x44px)
- Mobile-specific styles: Not explicitly defined (NEEDS REVIEW)

---

## Semantic HTML

- [ ] Proper use of `<pre>` and `<code>` elements
- [ ] Language attribute on code blocks (`lang` or `className`)
- [ ] Heading hierarchy is correct (if filenames use headings)
- [ ] No layout tables (use CSS Grid/Flexbox)
- [ ] HTML validates (no nested `<button>` or invalid nesting)

**Current Status**:
- Semantic HTML confirmed: `<pre><code>` structure (CONFIRMED)
- Language class: `language-{lang}` applied (CONFIRMED)
- No invalid nesting detected in code review (CONFIRMED)

---

## Focus Management

- [ ] Focus is not trapped in code blocks
- [ ] Focus order is logical (top to bottom, left to right)
- [ ] Skip links available (if needed for long code blocks)
- [ ] Focus is visible at all times (not hidden by CSS)
- [ ] Custom focus indicators meet 3:1 contrast

**Current Status**:
- Default browser focus indicators used (ACCEPTABLE)
- No custom focus management (NEEDS REVIEW)
- No skip links for code blocks (ACCEPTABLE for current scope)

---

## Motion and Animation

- [ ] Respect `prefers-reduced-motion` for theme transitions
- [ ] Copy button feedback animation is subtle (<500ms)
- [ ] No auto-playing animations
- [ ] Theme switching does not cause layout shift (CLS <0.1)

**Current Status**:
- Theme switching is CSS-only: `display: none/block` (NO ANIMATION)
- Copy button feedback: Text change only, no animation (ACCEPTABLE)
- No `prefers-reduced-motion` implementation needed (NO ANIMATIONS)

---

## Error Handling

- [ ] Graceful fallback for unsupported languages
- [ ] Error messages are accessible (not color-only)
- [ ] Failed copy operations show user-friendly message
- [ ] Clipboard API failure has fallback (manual copy instructions)

**Current Status**:
- Unsupported language fallback: `plaintext` with dev warning (CONFIRMED)
- Clipboard API error handling: Not implemented (NEEDS IMPLEMENTATION)
- No fallback for clipboard failure (ACCESSIBILITY GAP)

---

## Testing Tools Checklist

**Automated Tools** (run during `/preview` phase):
- [ ] Lighthouse accessibility audit (target: ≥95)
- [ ] axe DevTools (Chrome extension) - 0 violations
- [ ] WAVE browser extension - 0 errors
- [ ] HTML validator (W3C) - 0 errors

**Manual Testing**:
- [ ] Keyboard-only navigation (unplug mouse, test all features)
- [ ] Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- [ ] Color contrast checker (Chrome DevTools Accessibility panel)
- [ ] Zoom to 200% (no horizontal scroll on base page, only code blocks)

**Browser Compatibility**:
- [ ] Chrome (latest) - all features work
- [ ] Firefox (latest) - all features work
- [ ] Safari (latest) - all features work
- [ ] Edge (latest) - all features work
- [ ] Mobile Safari (iOS) - touch targets accessible
- [ ] Mobile Chrome (Android) - touch targets accessible

---

## Acceptance Criteria (from plan.md)

**Must Pass Before Production**:
1. Lighthouse accessibility score ≥95
2. Zero critical accessibility violations in axe DevTools
3. Keyboard navigation works for all interactive elements
4. Screen reader announces all important information
5. Color contrast meets WCAG AA (4.5:1 text, 3:1 UI elements)
6. Mobile responsive at 320px viewport width
7. No layout shift when theme switches (CLS <0.1)

---

## Manual Validation Steps

### Step 1: Keyboard Navigation Test
```bash
# Start dev server
npm run dev

# Visit test page: http://localhost:3000/posts/[test-post-with-code]
# Unplug mouse or disable trackpad
# Test:
# 1. Tab through page - copy button should be focusable
# 2. Press Enter or Space on copy button - code should copy
# 3. Check focus indicators are visible
# 4. Verify tab order is logical
```

### Step 2: Screen Reader Test
```bash
# Windows (NVDA):
# 1. Download NVDA (free, open-source)
# 2. Start NVDA, open test page
# 3. Navigate to code block
# 4. Listen for: "Code block, language JavaScript, Copy code button"
# 5. Activate copy button, listen for "Code copied" announcement

# macOS (VoiceOver):
# 1. Press Cmd+F5 to enable VoiceOver
# 2. Navigate to code block with VO+Right Arrow
# 3. Listen for code language announcement
# 4. Listen for copy button label
# 5. Activate button, verify feedback announcement
```

### Step 3: Color Contrast Check
```bash
# Chrome DevTools method:
# 1. Right-click code block → Inspect
# 2. Open Accessibility tab in DevTools
# 3. Check contrast ratio for:
#    - Code text (should show ≥4.5:1)
#    - Highlighted line background (should show ≥3:1)
#    - Copy button text (should show ≥4.5:1)
# 4. Test both light and dark themes
```

### Step 4: Mobile Responsive Check
```bash
# Chrome DevTools responsive mode:
# 1. Press F12, toggle device toolbar (Ctrl+Shift+M)
# 2. Select "iPhone SE" (320px width)
# 3. Verify:
#    - Code blocks scroll horizontally
#    - Copy button is visible and tappable (44x44px minimum)
#    - Text is readable (14px+)
#    - No content overflow
# 4. Test copy button on touch device (if available)
```

---

## Notes

- This checklist should be completed during the `/preview` phase
- Results should be documented in `optimization-accessibility.md`
- Any failing items must be fixed before production deployment
- Re-test after fixes to confirm resolution
