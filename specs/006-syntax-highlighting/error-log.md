# Error Log: Syntax Highlighting Enhancements

## Planning Phase (Phase 0-2)
None yet.

## Implementation Phase (Phase 3-4)
[Populated during /tasks and /implement]

## Testing Phase (Phase 5)
[Populated during /debug and /preview]

## Deployment Phase (Phase 6-7)
[Populated during staging validation and production deployment]

---

## Error Template

**Error ID**: ERR-[NNN]
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [rehype-shiki/shiki-config/code-block/build-pipeline]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened]

**Root Cause**:
[Why it happened]

**Resolution**:
[How it was fixed]

**Prevention**:
[How to prevent in future]

**Related**:
- Spec: [link to requirement, e.g., FR-001, US1]
- Code: [file:line]
- Commit: [sha]

---

## Common Errors (Anticipated)

### Build Errors

**ERR-001**: "Cannot find module 'shiki'"
- **Cause**: Shiki not installed or node_modules corrupted
- **Resolution**: Run `npm install shiki@^1.0.0`
- **Prevention**: Lock file committed to git

**ERR-002**: "Shiki theme 'github-dark' not found"
- **Cause**: Incorrect theme name or Shiki version mismatch
- **Resolution**: Verify theme name in Shiki docs, update to latest Shiki
- **Prevention**: Use built-in themes only (github-dark, github-light)

**ERR-003**: "Build timeout exceeded (>10 minutes)"
- **Cause**: Too many code blocks, Shiki initialization slow
- **Resolution**: Optimize with highlighter caching, parallel processing
- **Prevention**: Benchmark with 100 blocks during testing (quickstart.md Scenario 5)

### Runtime Errors

**ERR-004**: "Clipboard API not supported"
- **Cause**: Browser doesn't support navigator.clipboard (very old browsers)
- **Resolution**: Add fallback with `document.execCommand('copy')`
- **Prevention**: Feature detection before using clipboard API

**ERR-005**: "Code block theme doesn't switch on dark mode toggle"
- **Cause**: CSS media query not working, Shiki output missing theme classes
- **Resolution**: Verify `.code-light` and `.code-dark` classes in HTML, check CSS
- **Prevention**: Test with DevTools prefers-color-scheme emulation

### Accessibility Errors

**ERR-006**: "Highlighted lines not announced by screen reader"
- **Cause**: Missing ARIA labels on highlighted line elements
- **Resolution**: Add `aria-label="Line X, highlighted"` in rehype plugin
- **Prevention**: Test with VoiceOver/NVDA during development

**ERR-007**: "Copy button not keyboard accessible"
- **Cause**: Missing `onKeyDown` handler for Enter/Space keys
- **Resolution**: Add keyboard event handler to copy button
- **Prevention**: Lighthouse accessibility audit catches missing keyboard support

### Performance Errors

**ERR-008**: "Build time exceeds 5s per 100 blocks (NFR-001 violation)"
- **Cause**: Shiki initialization overhead, synchronous processing
- **Resolution**: Implement highlighter singleton, process blocks in parallel
- **Prevention**: Benchmark during testing, optimize if >4s

**ERR-009**: "Bundle size increased by >100KB (NFR-004 violation)"
- **Cause**: Shiki library accidentally bundled to client
- **Resolution**: Verify Shiki is dev dependency, not imported in client components
- **Prevention**: Use `npm run build -- --analyze` to check bundle composition

### Content Errors

**ERR-010**: "Line highlighting metadata not parsed"
- **Cause**: Regex doesn't match `{1-3,5}` syntax, special characters in metadata
- **Resolution**: Update metadata parsing regex, handle edge cases
- **Prevention**: Test with various metadata formats (ranges, single lines, mixed)

**ERR-011**: "Unsupported language shows error instead of fallback"
- **Cause**: Missing fallback logic in rehype plugin
- **Resolution**: Catch Shiki errors, render as plaintext with warning
- **Prevention**: Test unsupported language (quickstart.md Scenario 6)

---

## Optimization Phase - Critical Accessibility Fixes

### Entry 1: 2025-10-24 - Highlighted Line Contrast WCAG AA Failure

**Failure**: Highlighted line background contrast too low  
**Symptom**: Light mode 1.04:1 contrast, dark mode 1.35:1 contrast - both fail WCAG AA 3:1 minimum for UI elements  
**Learning**: Initial opacity values (0.1 light, 0.15 dark) were aesthetic choices without accessibility validation. WCAG AA requires 3:1 contrast for UI components.  
**Ghost Context Cleanup**: Removed insufficiently contrasted background colors, replaced with WCAG AA compliant values

**Resolution**:
- Light mode: Increased opacity from 0.1 to 0.25 (3.2:1 contrast ratio)
- Dark mode: Increased opacity from 0.15 to 0.35 (3.5:1 contrast ratio)
- Added explicit WCAG AA comments in CSS

**Prevention**: Run Lighthouse accessibility audit during /optimize phase to catch contrast issues early

**Related**:
- Spec: NFR-002 (WCAG 2.1 AA compliance)
- Code: app/globals.css:93, 98
- From /optimize audit

---

### Entry 2: 2025-10-24 - Copy Button Touch Target Size Failure

**Failure**: Copy button touch targets too small for mobile accessibility  
**Symptom**: Buttons sized ~28x20px, failing iOS/Android 44x44px minimum guideline  
**Learning**: Default CSS sizing without explicit min-width/min-height doesn't guarantee accessible touch targets. Mobile accessibility requires explicit sizing constraints.  
**Ghost Context Cleanup**: Removed insufficiently sized buttons, added minimum dimensions

**Resolution**:
- Header copy button: Added `min-w-[44px] min-h-[44px] px-2` classes
- Floating copy button: Added `min-w-[44px] min-h-[44px]` classes, increased padding to px-3 py-2
- Both buttons now meet iOS/Android 44x44px minimum

**Prevention**: Test all interactive elements with mobile device emulation during development

**Related**:
- Spec: NFR-002 (WCAG 2.1 AA compliance)
- Code: components/mdx/code-block.tsx:70, 103
- From /optimize audit

---

### Entry 3: 2025-10-24 - Missing Clipboard API Error Handling

**Failure**: Clipboard operations had no error handling  
**Symptom**: No try/catch around navigator.clipboard.writeText(), failing silently on errors  
**Learning**: Clipboard API can fail due to permissions, HTTPS requirement, or browser support. Graceful degradation with fallback required for accessibility (WCAG 3.3.1 Error Identification).  
**Ghost Context Cleanup**: Removed unsafe synchronous clipboard calls, replaced with async/await + fallback

**Resolution**:
- Changed handleCopy to async function with try/catch
- Primary: await navigator.clipboard.writeText() with error logging
- Fallback: document.execCommand('copy') for older browsers
- Nested try/catch ensures fallback also handles errors gracefully
- Console logging for debugging (not user-facing, but helps development)

**Prevention**: Always wrap browser APIs with error handling, test in older browsers

**Related**:
- Spec: NFR-002 (WCAG 2.1 AA), FR-005 (copy button functionality)
- Code: components/mdx/code-block.tsx:31-55
- From /optimize audit

---

### Entry 4: 2025-10-24 - Build Failure False Positive

**Failure**: Code review reported "Build failure - pages-manifest.json error"  
**Symptom**: Production build actually succeeded, code review agent misinterpreted logs  
**Learning**: Build warnings (e.g., metadata deprecation warnings) don't indicate failure. Exit code 0 + .next/BUILD_ID existence confirms success.  
**Ghost Context Cleanup**: Removed "build failure" from blocker list

**Resolution**:
- Manual verification: `npm run build` exits with code 0
- Build artifacts present: `.next/BUILD_ID`, `.next/static/`
- 24/24 static pages generated successfully
- Warnings about metadata API changes are non-blocking (Next.js 15 deprecations)

**Prevention**: Always verify build failures manually before blocking deployment

**Related**:
- From /optimize code review (false positive)
- Verified manually in /debug phase

