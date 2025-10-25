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
