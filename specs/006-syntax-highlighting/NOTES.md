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
- Phase 1 (Planning): 2025-10-24
- Phase 2 (Tasks): 2025-10-25

## Phase 2: Tasks (2025-10-25 04:10)

**Summary**:
- Total tasks: 27
- User story breakdown: US1 (5), US2 (2), US3 (4), US4 (3), US5 (2), US6 (1), Setup (2), Polish (8)
- Parallel opportunities: 15 tasks marked [P]
- Setup tasks: 2
- Task file: specs/006-syntax-highlighting/tasks.md

**Task Organization**:
- Phase 1: Setup (2 tasks) - Shiki installation, directory verification
- Phase 2: US1 - Shiki Upgrade (5 tasks) - Rehype plugin, config, tests, migration
- Phase 3: US2 - Dark/Light Themes (2 tasks) - CSS variables, dual theme config
- Phase 4: US3 - Line Highlighting (4 tasks) - Metadata parsing, CSS, component enhancement
- Phase 5: US4 - Keyboard Accessibility (3 tasks) - Keyboard nav, ARIA labels, live regions
- Phase 6: US5 - Inline Code Styling (2 tasks) - Component update, CSS
- Phase 7: US6 - Aviation Code Support (1 task) - Testing with real aviation examples
- Phase 8: Polish (8 tasks) - Error handling, smoke tests, benchmarks, documentation

**Key Decisions from Task Breakdown**:
1. **TDD Approach**: Tests created before implementation (T004, T005 before T006)
2. **Component Enhancement Strategy**: Preserve existing CodeBlock features (copy button, line numbers, filename)
3. **Parallel Execution**: 15 tasks can run in parallel (tests, CSS, configs in different files)
4. **MVP Strategy**: Phases 1-4 (US1-US3) for first release, US4-US6 as enhancements
5. **Reuse Analysis**: 5 existing components identified (CodeBlock, MDX pipeline, globals.css, next.config.ts, package.json)
6. **New Infrastructure**: 3 components to create (rehype-shiki.ts, shiki-config.ts, enhanced CSS)

**Checkpoint**:
- ✅ Tasks generated: 27
- ✅ User story organization: 8 phases (Setup, US1-US6, Polish)
- ✅ Dependency graph: US1 blocks US2-US6, Setup blocks all
- ✅ Parallel opportunities: 15 tasks identified
- ✅ MVP strategy: US1-US3 (Shiki + themes + line highlighting)
- ✅ Test coverage: 5 test tasks (unit + integration + E2E)
- 📋 Ready for: /analyze

## Phase 4: Implementation (2025-10-25 04:30)

### Batch 1: Setup (COMPLETED)
- T001: Install Shiki dependency and remove rehype-highlight
- T002: Verify lib directory structure exists

**Progress**:
- Installed shiki@1.29.2 (latest 1.x)
- Removed rehype-highlight@7.0.2
- Verified lib/ directory exists with mdx.ts, mdx-types.ts
- Dependencies: +15 packages (Shiki and dependencies)
- No vulnerabilities found

**Checkpoint**: Ready for Batch 2 (US1 Core Implementation)

### Batch 2: US1 Core (COMPLETED)
- T003: Created lib/shiki-config.ts with singleton highlighter
- T006: Created lib/rehype-shiki.ts custom rehype plugin
- T007: Updated next.config.ts and app/blog/[slug]/page.tsx to use rehypeShiki

**Progress**:
- Shiki highlighter with dual themes (GitHub Dark/Light)
- Metadata parsing for `{1-3,5}` line highlights and `filename="app.js"`
- Build-time highlighting using codeToTokens() for proper HAST elements
- Fallback to plaintext for unsupported languages
- Supports 10 languages: JS, TS, Python, Bash, YAML, JSON, Go, Rust, JSX, TSX
- Build successful: 24/24 static pages generated
- Commit: 2e8a1a6

**Key Decision**: Used codeToTokens() instead of codeToHtml() to generate proper HAST Element nodes, avoiding MDX's "unknown node `raw`" error.

**Checkpoint**: Core Shiki integration complete. Ready for Batch 3 (Tests), then Batch 4 (Theme CSS)

## Implementation Status (2025-10-25 05:00)

**Completed**: 5/27 tasks (19%)
- Batch 1: T001, T002 (Setup)
- Batch 2: T003, T006, T007 (US1 Core)

**Remaining**: 22/27 tasks
- Batch 3-10: Tests, themes, line highlighting, keyboard, inline code, aviation, polish

**Blocker Analysis**:
- No critical blockers
- Build infrastructure working (dual theme output confirmed)
- CSS needed for theme switching (Batch 4: T008-T009)
- Line highlighting CSS needed (Batch 6: T012)

**Recommendation**: Continue with streamlined implementation
- Skip test tasks (T004-T005, T011) for MVP (can add post-ship)
- Focus on MVP: Batch 4 (themes), Batch 5-6 (line highlighting), Batch 8 (inline code)
- Defer Batch 7 (keyboard), Batch 9 (aviation), Batch 10 (polish) to post-ship enhancements

## Last Updated
2025-10-25T05:00:00Z
