# Tasks: Syntax Highlighting Enhancements

## [CODEBASE REUSE ANALYSIS]
Scanned: D:\coding\tech-stack-foundation-core

[EXISTING - REUSE]
- ✅ CodeBlock component (components/mdx/code-block.tsx): Copy button, line numbers, filename display
- ✅ MDX pipeline (next.config.ts): Rehype plugins configuration
- ✅ MDX components (components/mdx/mdx-components.tsx): Component mappings
- ✅ Theme detection (app/globals.css): prefers-color-scheme media query
- ✅ Package management (package.json): Dependencies list

[NEW - CREATE]
- 🆕 Shiki rehype plugin (lib/rehype-shiki.ts): No existing pattern, new integration
- 🆕 Shiki configuration (lib/shiki-config.ts): No existing Shiki setup
- 🆕 Theme-aware CSS (app/globals.css additions): Code block dual theme styling

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (blocks all stories - Shiki installation)
2. Phase 2: US1 [P1] - Shiki upgrade (blocks all other stories)
3. Phase 3: US2 [P1] - Dark/light themes (depends on US1)
4. Phase 4: US3 [P1] - Line highlighting (depends on US1)
5. Phase 5: US4 [P2] - Keyboard shortcuts (depends on US1, US3)
6. Phase 6: US5 [P2] - Inline code styling (depends on US2)
7. Phase 7: US6 [P2] - Aviation code support (depends on US1 - testing only)
8. Phase 8: Polish - Error handling, deployment prep, UI promotion

## [PARALLEL EXECUTION OPPORTUNITIES]
- Phase 2 (US1): T004, T005 (tests can run after T003 plugin scaffolding)
- Phase 3 (US2): T008, T009 (CSS and config are independent)
- Phase 4 (US3): T011, T012 (tests after T010 metadata parsing)
- Phase 5 (US4): T015, T016 (keyboard and ARIA in different sections of code-block.tsx)
- Phase 8 (Polish): T020, T021, T022 (error handling, smoke tests, docs)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phases 1-4 (US1-US3: Shiki upgrade, themes, line highlighting)
**Incremental delivery**: US1 → staging validation → US2+US3 → US4-US6 → Polish
**Testing approach**: Unit tests for parsing, integration tests for theme switching, E2E for accessibility

---

## Phase 1: Setup

- [ ] T001 Install Shiki dependency and remove rehype-highlight
  - Files: package.json
  - Action: npm install shiki@^1.0.0 && npm uninstall rehype-highlight
  - From: plan.md [ARCHITECTURE DECISIONS]

- [ ] T002 Create lib directory structure if not exists
  - Files: lib/ (verify exists, created in Feature 002)
  - Action: Verify lib/mdx.ts exists (reuse existing)
  - From: plan.md [STRUCTURE]

---

## Phase 2: US1 [P1] - Shiki Upgrade (build-time syntax highlighting)

**Story Goal**: Replace rehype-highlight with Shiki for better syntax quality and theme support

**Independent Test Criteria**:
- [ ] Create test MDX file with JS, TS, Python, Bash, YAML, JSON, Go, Rust
- [ ] Run npm run build, verify all 8 languages render with syntax highlighting
- [ ] Verify copy button and filename features still work
- [ ] Verify build time <5s for test file (NFR-001)

### Setup

- [ ] T003 Create lib/shiki-config.ts with highlighter initialization
  - Files: lib/shiki-config.ts (NEW)
  - Content: getHighlighter() function, load github-dark/github-light themes
  - Languages: JS, TS, Python, Bash, YAML, JSON, Go, Rust (FR-002)
  - Singleton pattern: Cache highlighter instance to avoid re-initialization
  - Pattern: None (new integration, follow Shiki docs)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

### Tests

- [ ] T004 [P] Write test: lib/shiki-config.test.ts - highlighter initialization
  - File: lib/shiki-config.test.ts (NEW)
  - Tests: Highlighter loads github-dark and github-light themes
  - Tests: All 8 languages load correctly
  - Tests: Singleton returns same instance on multiple calls
  - Pattern: Standard Jest/Vitest unit test
  - Coverage: ≥80% (new code must be 100%)

- [ ] T005 [P] Write test: lib/rehype-shiki.test.ts - metadata parsing
  - File: lib/rehype-shiki.test.ts (NEW)
  - Tests: Parse {1-3,5} → [1, 2, 3, 5]
  - Tests: Handle edge cases (empty metadata, invalid ranges, malformed input)
  - Tests: Fallback for unsupported languages → plaintext
  - Tests: Dual theme output has .code-light and .code-dark classes
  - Pattern: Standard Jest/Vitest unit test
  - Coverage: ≥80% (new code must be 100%)

### Implementation

- [ ] T006 Create lib/rehype-shiki.ts with custom rehype plugin
  - Files: lib/rehype-shiki.ts (NEW)
  - Responsibilities:
    - Traverse MDX AST to find code block nodes
    - Parse fenced code metadata (language, line highlights {1-3,5}, filename)
    - Call Shiki codeToHtml with dual themes (github-dark, github-light)
    - Transform AST node to highlighted HTML
    - Add CSS classes for theme switching (.code-light, .code-dark)
    - Sanitize metadata inputs (prevent injection via line range validation)
  - Dependencies: shiki, hast-util-* (AST traversal)
  - Pattern: https://shiki.style/guide/transformers (Shiki transformer docs)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]
  - Estimated LOC: ~150 lines

- [ ] T007 Update next.config.ts to use rehypeShiki instead of rehypeHighlight
  - Files: next.config.ts (MODIFY)
  - Change: Replace rehypeHighlight with rehypeShiki in rehypePlugins array
  - Location: Line 20-25 (MDX configuration section)
  - Pattern: Existing rehypePlugins array structure
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

---

## Phase 3: US2 [P1] - Dark/Light Theme Integration

**Story Goal**: Code blocks automatically match site-wide dark/light mode

**Independent Test Criteria**:
- [ ] Toggle browser DevTools prefers-color-scheme between dark/light
- [ ] Verify code blocks switch from GitHub Dark to GitHub Light theme
- [ ] Measure transition time <100ms (NFR-005)
- [ ] Verify no layout shift (CLS <0.1)

### Implementation

- [ ] T008 [P] Add theme-aware CSS variables and classes to globals.css
  - Files: app/globals.css (ENHANCE)
  - Content:
    ```css
    @media (prefers-color-scheme: light) {
      .code-dark { display: none; }
      .code-light { display: block; }
    }
    @media (prefers-color-scheme: dark) {
      .code-light { display: none; }
      .code-dark { display: block; }
    }
    ```
  - Location: After existing prefers-color-scheme section (line 16-21)
  - Pattern: Existing media query structure in globals.css
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]
  - Estimated changes: ~20 lines

- [ ] T009 [P] Update lib/shiki-config.ts to configure dual themes
  - Files: lib/shiki-config.ts (MODIFY - enhance T003)
  - Change: Configure Shiki with themes: { light: 'github-light', dark: 'github-dark' }
  - Method: Update getHighlighter() to use dual theme mode
  - From: plan.md [ARCHITECTURE DECISIONS] (Dual Theme CSS Strategy)

---

## Phase 4: US3 [P1] - Line Highlighting

**Story Goal**: Authors can emphasize specific code lines via metadata syntax

**Independent Test Criteria**:
- [ ] Create MDX code block with ```js {1-3,5}
- [ ] Verify lines 1, 2, 3, 5 have highlighted background
- [ ] Test contrast ratio ≥4.5:1 with Chrome DevTools Accessibility panel (WCAG AA)
- [ ] Verify highlighting visible in both light and dark themes

### Implementation

- [ ] T010 Implement metadata parsing in lib/rehype-shiki.ts for line highlighting
  - Files: lib/rehype-shiki.ts (ENHANCE - modify T006)
  - Feature: Parse {1-3,5} from fenced code metadata
  - Logic: Regex to extract ranges and individual lines
  - Validation: Sanitize inputs (positive integers only, reject malicious patterns)
  - Output: Array of line numbers [1, 2, 3, 5]
  - From: plan.md [ARCHITECTURE DECISIONS] (Metadata-Driven Configuration)

### Tests

- [ ] T011 [P] Write test: components/mdx/code-block.test.tsx - highlighted lines render
  - File: components/mdx/code-block.test.tsx (NEW)
  - Tests: highlightLines={[1,3]} → lines 1 and 3 have .highlighted-line class
  - Tests: Highlighted lines have ARIA labels: "Line 5, highlighted"
  - Pattern: React Testing Library component test
  - Coverage: ≥80% (new code must be 100%)

### Integration

- [ ] T012 [P] Add highlighted line CSS to globals.css with WCAG AA contrast
  - Files: app/globals.css (ENHANCE)
  - Content:
    ```css
    @media (prefers-color-scheme: light) {
      .highlighted-line { background-color: rgba(255, 212, 0, 0.1); }
    }
    @media (prefers-color-scheme: dark) {
      .highlighted-line { background-color: rgba(255, 212, 0, 0.15); }
    }
    ```
  - Validation: 4.5:1 contrast ratio minimum (NFR-002)
  - Pattern: Existing media query sections in globals.css
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T013 Update components/mdx/code-block.tsx to apply .highlighted-line class
  - Files: components/mdx/code-block.tsx (ENHANCE)
  - Change: Add highlightLines prop (number[])
  - Logic: Apply .highlighted-line class to specified line numbers
  - ARIA: Add aria-label="Line N, highlighted: [code content]" for screen readers
  - Pattern: Existing addLineNumbers() function structure
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

---

## Phase 5: US4 [P2] - Keyboard Accessibility Enhancements

**Story Goal**: Keyboard users can copy code without mouse interaction

**Independent Test Criteria**:
- [ ] Tab to code block, verify copy button receives focus
- [ ] Press Enter or Space, verify code copies to clipboard
- [ ] Press Alt+C when focused, verify code copies
- [ ] Screen reader announces "Code copied" via ARIA live region

### Implementation

- [ ] T014 Enhance components/mdx/code-block.tsx with keyboard navigation
  - Files: components/mdx/code-block.tsx (ENHANCE)
  - Changes:
    - Ensure copy button is keyboard accessible (onKeyDown for Enter/Space)
    - Add tabIndex={0} to make code block focusable
    - Add onKeyDown handler for Alt+C shortcut
  - Pattern: Existing handleCopy() function structure
  - From: spec.md US4 acceptance criteria

- [ ] T015 [P] Add ARIA live region for copy feedback
  - Files: components/mdx/code-block.tsx (ENHANCE)
  - Change: Add <div role="status" aria-live="polite" className="sr-only">
  - Content: Announces "Code copied" when copy button clicked
  - Pattern: Standard ARIA live region pattern
  - From: spec.md US4 acceptance criteria (FR-012)

- [ ] T016 [P] Add ARIA labels for highlighted lines
  - Files: components/mdx/code-block.tsx (ENHANCE - part of T013)
  - Change: Update addLineNumbers() to include aria-label for highlighted lines
  - Format: "Line 5, highlighted: [code content]"
  - Pattern: Existing line number rendering in addLineNumbers()
  - From: spec.md US4 acceptance criteria (FR-012)

---

## Phase 6: US5 [P2] - Inline Code Styling

**Story Goal**: Inline code looks distinct from code blocks for quick references

**Independent Test Criteria**:
- [ ] Add inline code to MDX paragraph: This is `inline code` in text
- [ ] Verify subtle background (gray-100 light, gray-800 dark)
- [ ] Verify no syntax highlighting
- [ ] Verify no copy button

### Implementation

- [ ] T017 Update components/mdx/mdx-components.tsx for inline code styling
  - Files: components/mdx/mdx-components.tsx (ENHANCE)
  - Change: Update inline code handler in component mappings
  - Style: Add className for subtle background, no highlighting
  - Pattern: Existing component mapping structure
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

- [ ] T018 [P] Add inline code CSS to globals.css
  - Files: app/globals.css (ENHANCE)
  - Content:
    ```css
    @media (prefers-color-scheme: light) {
      code:not(pre code) { background-color: rgba(0, 0, 0, 0.05); }
    }
    @media (prefers-color-scheme: dark) {
      code:not(pre code) { background-color: rgba(255, 255, 255, 0.1); }
    }
    ```
  - Pattern: Existing code block CSS sections
  - From: spec.md US5 acceptance criteria

---

## Phase 7: US6 [P2] - Aviation Code Support Validation

**Story Goal**: Python and JavaScript aviation code examples highlight correctly

**Independent Test Criteria**:
- [ ] Create test MDX with Python aviation code (pandas, numpy, matplotlib imports)
- [ ] Create test MDX with JavaScript flight planning functions
- [ ] Verify syntax highlighting for aviation-specific libraries
- [ ] Manual inspection for keyword, function, comment accuracy

### Testing

- [ ] T019 Create test content with aviation code examples and verify highlighting
  - Files: content/posts/test-syntax-aviation.mdx (NEW - test content)
  - Content: Python fuel calculations, JS route planning functions
  - Libraries: pandas, numpy, matplotlib (Python), standard JS libraries
  - Action: npm run build, manual inspection of highlighted code
  - Pattern: Existing test post structure
  - From: spec.md US6 acceptance criteria

---

## Phase 8: Polish & Cross-Cutting Concerns

### Error Handling & Resilience

- [ ] T020 [P] Add fallback for unsupported languages in lib/rehype-shiki.ts
  - Files: lib/rehype-shiki.ts (ENHANCE - modify T006)
  - Logic: Try Shiki highlighting, catch errors, fallback to plaintext rendering
  - Dev Warning: console.warn in NODE_ENV=development for unsupported languages
  - From: plan.md [SECURITY] (Language validation)

- [ ] T021 [P] Add input validation for metadata parsing
  - Files: lib/rehype-shiki.ts (ENHANCE - modify T010)
  - Validation: Reject malicious patterns in line range metadata
  - Sanitize: Ensure line numbers are positive integers, ranges are valid
  - Reject: {eval('code')}, {<script>}, etc.
  - From: plan.md [SECURITY] (Input Validation)

### Deployment Preparation

- [ ] T022 [P] Add smoke test for syntax highlighting to test suite
  - Files: tests/e2e/syntax-highlighting.spec.ts (NEW)
  - Tests:
    - Code blocks have syntax highlighting (class="language-javascript")
    - Highlighted lines visible (count .highlighted-line elements)
    - Copy button works (click → clipboard API called → "Copied" feedback)
    - Theme switching (toggle prefers-color-scheme → verify theme updates)
  - Pattern: Existing Playwright E2E tests
  - From: plan.md [CI/CD IMPACT]

- [ ] T023 [P] Document Shiki configuration decisions in NOTES.md
  - Files: specs/006-syntax-highlighting/NOTES.md (UPDATE)
  - Content: Theme choices (GitHub Dark/Light), language selections, fallback strategy
  - Rationale: Build-time rendering for performance, dual theme for compatibility
  - From: plan.md [ARCHITECTURE DECISIONS]

- [ ] T024 Update feature README with usage examples
  - Files: specs/006-syntax-highlighting/visuals/README.md (UPDATE)
  - Content: Fenced code metadata examples (```js {1-3,5}), theme screenshots
  - Examples: Line highlighting, filename display, copy button usage
  - From: plan.md [INTEGRATION SCENARIOS]

### Performance & Validation

- [ ] T025 Benchmark build time with 100 code blocks
  - Action: Create test MDX with 100 code blocks (mix of all 8 languages)
  - Measurement: Time npm run build before/after Shiki migration
  - Target: <5s for 100 blocks (NFR-001), <10% increase from baseline
  - Document: Record results in NOTES.md
  - From: plan.md [PERFORMANCE TARGETS]

- [ ] T026 [P] Measure bundle size impact
  - Action: Run npm run build, analyze client bundle size
  - Measurement: Compare bundle before/after Shiki (should be ~0KB since build-time)
  - Target: <10KB gzipped increase (NFR-004)
  - Tool: next build --analyze or webpack-bundle-analyzer
  - From: plan.md [PERFORMANCE TARGETS]

- [ ] T027 [P] Run Lighthouse CI accessibility audit
  - Action: Deploy to preview, run Lighthouse CI
  - Targets: Accessibility ≥95, Performance ≥85
  - Validation: No new accessibility violations
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

---

## [TEST GUARDRAILS]

**Speed Requirements:**
- Unit tests: <2s each
- Integration tests: <10s each
- E2E tests: <30s each
- Full suite: <6 min total

**Coverage Requirements:**
- New code: 100% coverage (lib/rehype-shiki.ts, lib/shiki-config.ts)
- Unit tests: ≥80% line coverage
- Integration tests: ≥60% line coverage
- E2E tests: ≥90% critical path coverage

**Measurement:**
- TypeScript: `npm test -- --coverage`
- E2E: Playwright trace for failed scenarios

**Quality Gates:**
- All tests must pass before merge
- Coverage thresholds enforced in CI
- No skipped tests without GitHub issue

**Clarity Requirements:**
- One behavior per test
- Descriptive names: `test_shiki_parses_line_range_metadata_correctly()`
- Given-When-Then structure in test body

**Anti-Patterns:**
- ❌ NO UI snapshots (brittle, break on CSS changes)
- ❌ NO "prop-mirror" tests (test behavior, not implementation)
- ✅ USE role/text queries (accessible, resilient)
- ✅ USE data-testid for dynamic content only

**Examples:**
```typescript
// ❌ Bad: Prop-mirror test (tests implementation)
expect(component.props.theme).toBe('dark')

// ✅ Good: Behavior test (tests user outcome)
expect(screen.getByRole('code')).toHaveClass('code-dark')

// ❌ Bad: Snapshot (fragile)
expect(wrapper).toMatchSnapshot()

// ✅ Good: Semantic assertion (resilient)
expect(screen.getByText('Copied')).toBeVisible()
```
