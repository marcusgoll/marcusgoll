# Feature Specification: Syntax Highlighting Enhancements

**Branch**: `feature/006-syntax-highlighting`
**Created**: 2025-10-24
**Status**: Draft
**Feature Type**: Enhancement to existing feature (002-tech-stack-cms-integ)
**GitHub Issue**: #24 (Priority: high, ICE Score: 2.50)

## Executive Summary

Syntax highlighting for code blocks already exists in blog posts (implemented in Feature 002 using `rehype-highlight`). This specification defines **enhancements** to upgrade the syntax highlighting system with advanced features, better theme integration, and improved developer experience.

**Current Implementation** (Feature 002):
- ✅ Basic syntax highlighting via rehype-highlight/highlight.js
- ✅ Copy button with clipboard functionality
- ✅ Optional line numbers
- ✅ File name/language labels
- ✅ Responsive code blocks

**Proposed Enhancements** (this feature):
- 🎯 Upgrade to Shiki (or Prism.js) for better themes and accuracy
- 🎯 Dark/light mode theme integration
- 🎯 Line highlighting for code emphasis
- 🎯 Expanded language support (Python, Go, Rust, aviation use cases)
- 🎯 Build-time syntax highlighting for performance
- 🎯 Enhanced accessibility (ARIA labels, keyboard shortcuts)
- 🎯 Distinct inline code styling

## User Scenarios

### Primary User Story

As a blog reader with technical interests (aviation + dev), I want beautifully highlighted code examples that match the site's theme so that I can easily read and understand technical content across both domains.

### Acceptance Scenarios

1. **Given** I'm reading a blog post in dark mode, **When** I view a code block, **Then** syntax highlighting uses a dark theme that matches the site's dark mode palette

2. **Given** I'm reading a tutorial with code examples, **When** the author emphasizes specific lines, **Then** those lines are visually highlighted with a subtle background color

3. **Given** I'm viewing a Python code example for aviation data analysis, **When** the page loads, **Then** Python syntax is accurately highlighted with proper keyword/function colors

4. **Given** I'm reading on mobile, **When** I view a code block, **Then** syntax highlighting is fully visible with horizontal scroll and copy button remains accessible

5. **Given** I switch from light to dark mode, **When** I view the same code block, **Then** the syntax highlighting theme automatically updates to match

6. **Given** I'm using a screen reader, **When** I navigate to a highlighted line, **Then** I hear "Line 5, highlighted: function calculateFuelBurn" with context

7. **Given** I see inline code like \`const fuel = 100\`, **When** I read it in a paragraph, **Then** it's styled distinctly from code blocks (subtle background, no full highlighting)

### Edge Cases

- What happens when an unsupported language is specified?
  → Fall back to plain text with monospace font, show warning in dev mode

- How does line highlighting work with line numbers enabled?
  → Highlighted background spans both line number and code content

- What if dark/light mode toggle (Feature 005) isn't implemented yet?
  → Provide both themes, detect via prefers-color-scheme media query as fallback

- How are very long code blocks handled (>100 lines)?
  → Maintain performance via build-time highlighting, add "Expand" button for >50 lines

- What if a code block has no language specified?
  → Use auto-detection (Shiki's built-in) or default to plain text

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer reader, I want accurate syntax highlighting using Shiki so that code examples are easier to read and understand
  - **Acceptance**: Replace rehype-highlight with Shiki for all code blocks
  - **Acceptance**: Support JavaScript, TypeScript, Python, Bash, YAML, JSON, Go, Rust
  - **Acceptance**: Build-time highlighting via Shiki's transformers API
  - **Acceptance**: Maintains existing copy button and file name features
  - **Independent test**: Create MDX post with all 8 languages, verify each renders correctly
  - **Effort**: M (6-8 hours)

- **US2** [P1]: As a reader, I want syntax themes that match dark/light mode so that code is readable in my preferred theme
  - **Acceptance**: Dark theme (GitHub Dark or similar) for dark mode
  - **Acceptance**: Light theme (GitHub Light or similar) for light mode
  - **Acceptance**: Auto-switches theme when site theme changes
  - **Acceptance**: Falls back to prefers-color-scheme if Feature 005 not complete
  - **Independent test**: Toggle dark/light mode, verify code block theme updates
  - **Effort**: M (4-6 hours)

- **US3** [P1]: As a content creator, I want to highlight specific code lines for emphasis so that I can draw attention to important parts
  - **Acceptance**: Support line highlighting via fenced code metadata: \`\`\`js {1-3,5}
  - **Acceptance**: Highlighted lines have subtle background color (different from selection)
  - **Acceptance**: Ranges (1-3) and individual lines (5,7,10) both supported
  - **Acceptance**: Highlighting visible in both light and dark themes
  - **Independent test**: Create code block with {1-3,5}, verify lines 1,2,3,5 highlighted
  - **Effort**: S (3-4 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As a keyboard user, I want keyboard shortcuts for code interaction so that I can copy code without using a mouse
  - **Acceptance**: Tab focuses copy button, Enter/Space activates
  - **Acceptance**: Alt+C copies code when code block is focused
  - **Acceptance**: ARIA live region announces "Code copied" on success
  - **Depends on**: US1 (Shiki integration)
  - **Effort**: S (2-3 hours)

- **US5** [P2]: As a reader, I want inline code to look distinct from code blocks so that I can differentiate quick references from full examples
  - **Acceptance**: Inline code has subtle background (gray-100 light, gray-800 dark)
  - **Acceptance**: No syntax highlighting for inline code (too short to be useful)
  - **Acceptance**: Slightly smaller font size than code blocks
  - **Acceptance**: No copy button for inline code
  - **Depends on**: US2 (theme integration)
  - **Effort**: XS (1-2 hours)

- **US6** [P2]: As a content creator, I want aviation-specific code examples to highlight correctly so that Python/JS aviation code is readable
  - **Acceptance**: Python aviation libraries highlighted (pandas, numpy, matplotlib)
  - **Acceptance**: JavaScript flight planning functions highlighted
  - **Acceptance**: Test with real aviation code examples (fuel calculations, route planning)
  - **Depends on**: US1 (Shiki language support)
  - **Effort**: S (2-3 hours) - mostly testing

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a reader, I want copy button placement that doesn't obscure code so that I can read and copy without interference
  - **Acceptance**: Copy button appears on hover (desktop) or always visible (mobile)
  - **Acceptance**: Button positioned in top-right with fade-in animation
  - **Acceptance**: Button has semi-transparent background (doesn't fully block code)
  - **Depends on**: US1 (Shiki integration)
  - **Effort**: S (2-3 hours)

- **US8** [P3]: As a reader, I want large code blocks to be collapsible so that long examples don't dominate the page
  - **Acceptance**: Code blocks >50 lines show "Expand" button by default
  - **Acceptance**: Collapsed view shows first 20 lines with fade-out effect
  - **Acceptance**: Expanded view shows all lines with "Collapse" button
  - **Depends on**: US1 (Shiki integration)
  - **Effort**: M (4-5 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (Shiki upgrade, theme integration, line highlighting), validate performance and readability, then add US4-US6 based on usage metrics.

**Dependency Note**: Feature 005 (Dark/Light Mode Toggle) is listed as a blocker in the GitHub issue. However, US2 includes a fallback strategy using CSS media queries if Feature 005 is incomplete.

## Visual References

See `./visuals/README.md` for syntax theme comparisons and line highlighting examples (if applicable)

## Hypothesis

> This is an **improvement feature** - enhancing existing syntax highlighting.

**Problem**: Current syntax highlighting (rehype-highlight/highlight.js) has limited theme customization and doesn't integrate with site-wide dark/light mode
- Evidence: `package.json:28` uses `rehype-highlight@7.0.2`, component has hardcoded dark theme
- Impact: Readers in light mode see dark code blocks (poor contrast), no theme consistency

**Solution**: Upgrade to Shiki with dynamic theme switching based on site mode
- Change: Replace rehype-highlight with Shiki, add theme detection/switching
- Mechanism: Shiki uses VS Code themes (better accuracy), build-time rendering reduces client load

**Prediction**: Theme-matched syntax highlighting will improve code readability by 40% (measured via time-on-page for code-heavy posts)
- Primary metric: Average time on code-heavy posts increases from ~3min to ~4.2min
- Secondary metric: Code copy button usage increases by 25% (better readability = more copying)
- Expected improvement: +40% reading engagement for technical content
- Confidence: Medium (based on Shiki's proven theme quality, but site-wide dark mode not yet implemented)

## Context Strategy & Signal Design

- **System prompt altitude**: Component-level (MDX code block enhancement)
- **Tool surface**: Read (existing code), Edit (upgrade components), Bash (install Shiki), Test (verify languages)
- **Examples in scope**:
  1. Shiki integration with MDX (build-time highlighting)
  2. Line highlighting syntax (\`\`\`js {1-3,5})
  3. Theme switching based on dark/light mode
- **Context budget**: 40k tokens (enhancement with library migration)
- **Retrieval strategy**: JIT - load `components/mdx/code-block.tsx` and `lib/mdx.ts` on demand
- **Memory artifacts**: Update `NOTES.md` with Shiki config decisions, theme choices
- **Compaction cadence**: After US1 completion (Shiki migration)
- **Sub-agents**: None (single-component enhancement)

## Requirements

### Functional (testable only)

- **FR-001**: System MUST use Shiki for syntax highlighting in all MDX code blocks
- **FR-002**: System MUST support JavaScript, TypeScript, Python, Bash, YAML, JSON, Go, Rust languages
- **FR-003**: System MUST apply dark theme when site is in dark mode, light theme in light mode
- **FR-004**: System MUST highlight specific lines when specified in code block metadata (e.g., \`\`\`js {1-3,5})
- **FR-005**: System MUST preserve existing copy button functionality from current implementation
- **FR-006**: System MUST preserve existing line number functionality (optional via prop)
- **FR-007**: System MUST preserve existing file name display functionality
- **FR-008**: System MUST perform syntax highlighting at build time (not client-side)
- **FR-009**: System MUST fall back to prefers-color-scheme media query if site dark mode unavailable
- **FR-010**: Inline code (\`code\`) MUST have distinct styling (subtle background, no syntax highlighting)
- **FR-011**: Copy button MUST be keyboard accessible (Tab, Enter/Space)
- **FR-012**: Highlighted lines MUST have ARIA labels for screen reader context

### Non-Functional

- **NFR-001**: Performance: Build-time highlighting <5s per 100 code blocks, no client-side parsing
- **NFR-002**: Accessibility: WCAG 2.1 AA compliant (keyboard nav, ARIA labels, 4.5:1 contrast for highlighted lines)
- **NFR-003**: Mobile: Code blocks responsive <768px, horizontal scroll for long lines, copy button always accessible
- **NFR-004**: Bundle Size: Shiki import <100KB gzipped (use tree-shaking, build-time rendering)
- **NFR-005**: Theme Switching: <100ms transition when dark/light mode changes (CSS-only, no re-render)
- **NFR-006**: Error Handling: Unsupported languages fall back to plain text with dev mode warning

### Key Entities (if data involved)

- **CodeBlockConfig**: Configuration for enhanced code blocks
  - Attributes: `theme` (dark|light), `highlightLines` (number[]), `language`, `showLineNumbers`, `filename`
  - Source: Fenced code block metadata + theme context

- **SyntaxTheme**: Shiki theme configuration
  - Attributes: `darkTheme` (string, e.g., "github-dark"), `lightTheme` (string, e.g., "github-light")
  - Source: Shiki theme registry

## Deployment Considerations

**Platform Dependencies**: None (frontend-only enhancement)

**Environment Variables**: None required

**Breaking Changes**: None (backward compatible with existing code blocks)
- Existing code blocks continue to work
- `CodeBlock` component API unchanged (same props)
- MDX files require no modifications

**Migration Requirements**: None
- Automatic upgrade via build process
- No data migration needed

**Rollback Considerations**: Standard 3-command rollback (Vercel alias change)
- Rollback restores rehype-highlight functionality
- No data loss or user-facing breaking changes

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance <5s build time, a11y WCAG 2.1 AA, mobile responsive)
- [x] No implementation details (Shiki mentioned as solution, not constraint)

### Conditional: Success Metrics
- [x] Hypothesis defined (Problem → Solution → Prediction with +40% engagement)
- [ ] HEART metrics (will define in plan phase based on tracking availability)

### Conditional: UI Features
- [x] UI components identified (CodeBlock enhancement, inline code styling)
- [x] System components analyzed (reuses existing CodeBlock structure)

### Conditional: Deployment Impact
- [x] No breaking changes
- [x] No environment variables
- [x] Standard rollback process

---

## Assumptions

1. **Shiki vs Prism.js**: Shiki is preferred based on GitHub issue recommendation ("better themes")
2. **Theme Names**: GitHub Dark/Light themes are acceptable defaults (can be customized later)
3. **Line Highlighting Syntax**: Fenced code metadata format (\`\`\`js {1-3,5}) is standard and intuitive
4. **Build-Time Feasibility**: Next.js build process can handle Shiki's build-time highlighting without timeout
5. **Dark Mode Detection**: Feature 005 (Dark/Light Mode Toggle) will provide theme context via React Context or similar
6. **Aviation Code Examples**: Python (pandas/numpy) and JavaScript are sufficient for aviation use cases
7. **Inline Code**: No syntax highlighting needed for inline code (too short, context unclear)
8. **Bundle Size**: Shiki's tree-shaking and build-time rendering keep bundle size acceptable (<100KB)

## Out of Scope

- Code execution/playground (requires sandboxed runtime)
- Diff highlighting (requires specialized plugin, future enhancement)
- Code folding (collapsing sections, requires AST parsing)
- Multi-file code examples (tabbed interface, future enhancement)
- Custom syntax themes beyond GitHub Dark/Light (future customization)
- Syntax highlighting for non-code languages (math, diagrams)
- Live code editing in code blocks (requires Monaco or similar)

## Success Criteria (Technology-Agnostic, Measurable, Verifiable)

1. **Syntax Accuracy**: All 8 specified languages (JS, TS, Python, Bash, YAML, JSON, Go, Rust) render with correct keyword, function, and comment highlighting

2. **Theme Consistency**: Code block themes match site-wide dark/light mode in 100% of page views

3. **Line Highlighting**: Authors can emphasize specific lines, highlighted lines visible in both light and dark themes with 4.5:1 contrast ratio

4. **Performance**: Build time increase <10% when adding 50 code blocks to a post (baseline: ~2s, target: <2.2s)

5. **Accessibility**: Lighthouse accessibility score remains ≥95, all code blocks keyboard navigable, ARIA labels present on interactive elements

6. **Copy Functionality**: Copy button works in 95%+ of modern browsers, clipboard API fails gracefully with fallback message

7. **Mobile Usability**: Code blocks readable on 320px viewport, horizontal scroll functional, copy button remains accessible

8. **Engagement**: Time-on-page for code-heavy posts increases by 20%+ (baseline: establish after US1 ships)

9. **Code Copy Rate**: Copy button usage increases by 15%+ for technical posts (baseline: establish after US1 ships)

10. **Theme Switching**: When user toggles dark/light mode, code blocks update theme within 100ms with smooth transition

## Dependencies

**Blocking** (from GitHub Issue):
- Feature 003: Individual Post Pages (provides blog post context) - ✅ **Shipped**
- Feature 005: Dark/Light Mode Toggle (provides theme detection) - ⚠️ **Not Started**

**Mitigation for Feature 005 Blocker**:
- US2 includes fallback: Use CSS `prefers-color-scheme` media query
- Theme switching can be enhanced later when Feature 005 ships
- No implementation blocker, but theme integration may be incomplete

**Related**:
- Feature 002: Tech Stack CMS Integration (current syntax highlighting implementation)
