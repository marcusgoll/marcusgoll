# Feature: Syntax Highlighting Enhancements

## Overview

This feature enhances the existing syntax highlighting implementation (from Feature 002: Tech Stack CMS Integration). The current implementation uses `rehype-highlight` with basic code blocks. This enhancement will upgrade to a modern syntax highlighting library (Shiki or Prism.js) with advanced features like theme integration, line highlighting, and improved language support.

## Research Findings

### Current Implementation (Feature 002)
- **Library**: `rehype-highlight` (v7.0.2) - uses highlight.js under the hood
- **Component**: `components/mdx/code-block.tsx` - provides copy button, line numbers, file names
- **Features Already Implemented**:
  - ✅ Copy button with clipboard API
  - ✅ Line numbers (optional via prop)
  - ✅ File name display
  - ✅ Language labels
  - ✅ Basic syntax highlighting via rehype-highlight

### Gaps vs GitHub Issue Requirements
- ❌ Theme integration with dark/light mode (currently hardcoded dark theme)
- ❌ Line highlighting for emphasis (not implemented)
- ❌ Advanced language support (limited by highlight.js)
- ❌ Aviation-specific code samples not tested
- ❌ No asynchronous/build-time optimization (client-side only)
- ❌ Accessibility improvements needed (keyboard nav for copy button exists, but highlighting state not announced)

### Library Comparison

**Shiki (Recommended by GitHub Issue)**:
- Pros: Better themes (uses VS Code themes), accurate syntax highlighting, build-time rendering
- Cons: Larger bundle size, requires build-time processing
- Theme Support: Full light/dark mode support via VS Code themes
- Languages: JavaScript, TypeScript, Python, Bash, YAML, JSON, Go, Rust (all required)

**Prism.js (Alternative)**:
- Pros: Lighter weight, client-side friendly, plugin ecosystem
- Cons: Less accurate than Shiki, manual theme management
- Theme Support: Multiple themes available, needs custom dark/light switching
- Languages: All required languages supported via plugins

**Current (rehype-highlight / highlight.js)**:
- Pros: Already integrated, simple
- Cons: Limited theme customization, client-side only, less accurate than Shiki

## System Components Analysis

**Reusable (from existing codebase)**:
- `CodeBlock` component structure (can be enhanced)
- MDX integration pipeline (mdx-components.tsx)
- Dark mode detection (if exists site-wide)

**New Components Needed**:
- `SyntaxHighlighter` wrapper component (if using Shiki or Prism.js)
- Theme provider integration for dark/light mode
- Line highlighter utility component

**Dependencies (Blocking)**:
- Feature 003: Individual Post Pages (provides blog post rendering context)
- Feature 005: Dark/Light Mode Toggle (provides theme detection - BLOCKED)

## Feature Classification
- UI screens: true (code blocks are UI elements)
- Improvement: true (enhancing existing syntax highlighting)
- Measurable: true (can track code block interactions, copy button usage)
- Deployment impact: false (no infrastructure changes, frontend-only)

## Key Decisions

1. **Library Choice**: Recommend Shiki over Prism.js
   - Rationale: GitHub issue explicitly recommends Shiki for "better themes"
   - Trade-off: Larger bundle vs. better accuracy and theme support
   - Decision: Use Shiki with build-time rendering to minimize client bundle

2. **Theme Integration Strategy**: Wait for Feature 005 (Dark/Light Mode Toggle) or implement standalone
   - Rationale: Syntax highlighting themes should match site-wide dark/light mode
   - Blocker: Feature 005 is listed as dependency in GitHub Issue
   - Decision: Spec will define theme integration interface, implementation may need to coordinate with Feature 005

3. **Line Highlighting Syntax**: Use fenced code block metadata
   - Rationale: Industry standard (GitHub, MDX)
   - Example: \`\`\`js {1-3,5}
   - Decision: Support ranges (1-3) and individual lines (5)

4. **Performance Strategy**: Build-time syntax highlighting
   - Rationale: Shiki can render at build time, reducing client-side work
   - Trade-off: Longer build times vs. faster page loads
   - Decision: Use Shiki's build-time API in MDX pipeline

5. **Accessibility Approach**: ARIA labels for highlighted lines, keyboard shortcuts for copy
   - Rationale: Screen readers need context about highlighted code
   - Decision: Add aria-label="Highlighted line" to emphasized lines

## Deployment Considerations

**Platform Dependencies**: None (frontend-only enhancement)

**Environment Variables**: None required

**Breaking Changes**: None (enhancement to existing component)

**Migration Requirements**: None (existing code blocks continue to work)

**Rollback Considerations**: Standard 3-command rollback (component is backward-compatible)

## Checkpoints
- Phase 0 (Specification): 2025-10-24

## Last Updated
2025-10-24T22:53:00-07:00
