# Implementation Plan: Syntax Highlighting Enhancements

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Shiki library with build-time highlighting via custom rehype plugin
- Library choice: Shiki (replace rehype-highlight) for VS Code theme quality
- Themes: GitHub Dark + GitHub Light with CSS `prefers-color-scheme` switching
- Components to reuse: 5 (CodeBlock, MDX components, Next.js config, globals.css, package.json)
- New components needed: 3 (rehype plugin, Shiki config, enhanced styling)
- Research decisions: 6 (Shiki adoption, dual theme strategy, build-time highlighting, metadata parsing, GitHub themes, component reuse)

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- Frontend: Next.js 15.5.6 (existing) with MDX support
- Syntax Highlighting: Shiki 1.x (replaces rehype-highlight 7.0.2)
- Build Pipeline: Custom rehype plugin for MDX compilation
- Theme Detection: CSS `prefers-color-scheme` media query (existing in globals.css)
- Component Enhancement: Extend existing `components/mdx/code-block.tsx`
- State Management: None (build-time rendering, CSS-based theme switching)

**Patterns**:
- **Build-Time Rendering**: Syntax highlighting happens during `next build`, zero client-side JavaScript for highlighting
  - Rationale: Performance (NFR-001: <5s per 100 blocks), bundle size (NFR-004: <100KB), no FOUC
  - Implementation: Custom rehype plugin in `lib/rehype-shiki.ts`

- **Dual Theme CSS Strategy**: Single HTML output with both themes, CSS media query controls visibility
  - Rationale: Works without Feature 005 (dark mode toggle), instant theme switching, future-compatible
  - Implementation: Shiki `codeToHtml({ themes: { light, dark } })`, CSS classes for theme switching

- **Metadata-Driven Configuration**: Parse fenced code block metadata for features (line highlighting, filename, options)
  - Rationale: Standard syntax (used by Docusaurus, VitePress), non-breaking, intuitive for authors
  - Implementation: Regex parsing in rehype plugin, transform to Shiki options

- **Component Enhancement Over Replacement**: Extend existing CodeBlock component, preserve working features
  - Rationale: Copy button, line numbers, filename display already implemented (FR-005, FR-006, FR-007)
  - Implementation: Add theme-aware CSS, highlighted line styling, keep existing structure

**Dependencies** (new packages required):
- `shiki@^1.0.0`: VS Code-quality syntax highlighting library with dual theme support

**Dependencies to Remove**:
- `rehype-highlight@7.0.2`: Replaced by Shiki

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
lib/
├── mdx.ts (existing - unchanged)
├── mdx-types.ts (existing - unchanged)
├── rehype-shiki.ts (NEW - custom rehype plugin)
└── shiki-config.ts (NEW - Shiki setup and configuration)

components/mdx/
├── code-block.tsx (ENHANCE - add theme-aware styling, highlighted lines)
├── mdx-components.tsx (ENHANCE - update code/pre mappings if needed)
├── mdx-image.tsx (existing - unchanged)
├── callout.tsx (existing - unchanged)
└── demo.tsx (existing - unchanged)

app/
├── globals.css (ENHANCE - add code block theme CSS variables)
└── ... (other existing files unchanged)

next.config.ts (MODIFY - replace rehypeHighlight with rehypeShiki)

package.json (MODIFY - add shiki, remove rehype-highlight)
```

**Module Organization**:
- `lib/rehype-shiki.ts`: Rehype plugin that integrates Shiki into MDX pipeline
  - Responsibilities: Parse code blocks, extract metadata, call Shiki, transform AST
  - Exports: `rehypeShiki` function (default export)

- `lib/shiki-config.ts`: Shiki configuration and initialization
  - Responsibilities: Create highlighter instance, configure themes/languages, fallback handling
  - Exports: `getHighlighter()` async function, `ShikiConfig` interface

- `components/mdx/code-block.tsx`: Enhanced code block UI component
  - Responsibilities: Render highlighted code, copy button, line numbers, filename, accessibility
  - Existing features preserved: Copy button, line numbers, filename display
  - New features: Theme-aware styling, highlighted line backgrounds, ARIA labels

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: 3 (CodeBlockConfig, SyntaxTheme, HighlightedLine)
- Frontend-only feature: No database changes, no API layer
- Configuration: File-based (MDX metadata, Shiki config in code)
- State management: None (CSS-based theme detection, build-time rendering)
- Performance: <5s per 100 blocks (build-time), 0KB client impact for Shiki library

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: Build-time highlighting <5s per 100 code blocks, no client-side parsing
- NFR-002: Accessibility WCAG 2.1 AA (keyboard nav, ARIA labels, 4.5:1 contrast for highlighted lines)
- NFR-003: Mobile responsive <768px, horizontal scroll, copy button accessible
- NFR-004: Bundle size Shiki import <100KB gzipped (use build-time rendering, tree-shaking)
- NFR-005: Theme switching <100ms transition (CSS-only, no re-render)
- NFR-006: Unsupported languages fall back to plain text with dev mode warning

**Lighthouse Targets** (from constitution.md):
- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**Specific Metrics**:
- Build time increase: <10% when adding 50 code blocks (baseline: ~2s, target: <2.2s)
- Client bundle impact: <10KB gzipped (Shiki is build-time only)
- First Contentful Paint: <1.5s (NFR from general standards)
- Time to Interactive: <3s (NFR from general standards)
- Highlighted line contrast: 4.5:1 minimum (WCAG AA)
- Copy button activation: <50ms (keyboard shortcut response time)

---

## [SECURITY]

**Input Validation**:
- Metadata parsing: Sanitize line range inputs to prevent injection
  - Example: `{1-3,5}` → validate numbers are positive integers, ranges are valid
  - Reject malicious patterns: `{eval('code')}`, `{<script>}`, etc.
- Language validation: Whitelist supported languages from Shiki registry
  - Reject: Any language not in Shiki's built-in grammar list
  - Fallback: Plain text rendering for unknown languages (NFR-006)

**Content Security**:
- No user-generated code execution: Shiki runs at build time, not in browser
- No eval or dynamic code generation: All code blocks are static HTML
- XSS prevention: Shiki escapes HTML entities in code content

**Dependencies**:
- Shiki security: Maintained by VS Code team, regular security updates
- Verify integrity: Use npm integrity checks, lock file for reproducible builds

**No Authentication/Authorization Required**:
- Frontend-only feature: No API routes, no user data, no protected resources

---

## [EXISTING INFRASTRUCTURE - REUSE] (5 components)

**MDX Pipeline**:
- `next.config.ts:20-25`: MDX configuration with rehype plugins
  - Reuse: Replace `rehypeHighlight` with `rehypeShiki` in plugins array
  - Change: Single line update in `rehypePlugins` array
  - File: `next.config.ts`

**Component Structure**:
- `components/mdx/code-block.tsx`: Copy button, line numbers, filename display
  - Reuse: UI structure, `extractTextContent` utility, copy functionality, state management
  - Enhance: Add theme-aware CSS classes, highlighted line rendering, ARIA labels
  - LOC: 124 lines (reuse ~80%, modify ~20%)

- `components/mdx/mdx-components.tsx`: MDX component mappings
  - Reuse: Component mapping pattern, existing `code` and `pre` handlers
  - Enhance: Update inline code styling (US5), ensure compatibility with Shiki output
  - LOC: 182 lines (reuse ~95%, modify ~5%)

**Theme Detection**:
- `app/globals.css:16-21`: `prefers-color-scheme` media query
  - Reuse: Existing dark mode detection via CSS variable `--background` and `--foreground`
  - Extend: Add code block-specific CSS variables for theme switching
  - Change: Add ~20 lines for `.code-block-light` and `.code-block-dark` classes

**Dependencies**:
- `package.json:28`: `rehype-highlight@7.0.2`
  - Replace: Remove rehype-highlight, add shiki@^1.0.0
  - File: `package.json` (dependencies section)

---

## [NEW INFRASTRUCTURE - CREATE] (3 components)

**Rehype Plugin**:
- `lib/rehype-shiki.ts`: Custom rehype plugin for Shiki integration
  - Purpose: Integrate Shiki into Next.js MDX pipeline, replace rehype-highlight
  - Responsibilities:
    - Traverse MDX AST to find code block nodes
    - Parse fenced code metadata (language, line highlights, filename)
    - Call Shiki `codeToHtml` with dual themes (github-dark, github-light)
    - Transform AST node to highlighted HTML
    - Add CSS classes for theme switching and line highlighting
  - Inputs: MDX AST (hast format), Shiki configuration
  - Outputs: Transformed AST with Shiki-highlighted code blocks
  - Dependencies: `shiki`, `hast-util-*` (AST traversal)
  - Estimated LOC: ~150 lines
  - Example pattern: https://shiki.style/guide/transformers

**Shiki Configuration**:
- `lib/shiki-config.ts`: Shiki setup and configuration
  - Purpose: Initialize Shiki highlighter with themes and languages
  - Responsibilities:
    - Create singleton Shiki highlighter instance (cached)
    - Load github-dark and github-light themes
    - Load 8 required languages: JS, TS, Python, Bash, YAML, JSON, Go, Rust (FR-002)
    - Provide fallback for unsupported languages (plaintext)
    - Export `getHighlighter()` function for use in rehype plugin
  - Inputs: None (static configuration)
  - Outputs: Configured Shiki highlighter instance
  - Dependencies: `shiki`
  - Estimated LOC: ~80 lines
  - Caching: Singleton pattern to avoid re-initialization on every build

**Enhanced Code Block Styling**:
- `components/mdx/code-block.tsx` enhancements (not a new file, but significant changes)
  - New features:
    - Theme-aware CSS classes (`.code-light`, `.code-dark`)
    - Highlighted line backgrounds with 4.5:1 contrast (WCAG AA)
    - ARIA labels for highlighted lines: `aria-label="Line 5, highlighted"`
    - Keyboard shortcut: Alt+C to copy code (US4)
    - Improved focus states for accessibility
  - CSS additions in `globals.css`:
    ```css
    @media (prefers-color-scheme: light) {
      .code-dark { display: none; }
      .code-light { display: block; }
      .highlighted-line { background-color: rgba(255, 212, 0, 0.1); }
    }
    @media (prefers-color-scheme: dark) {
      .code-light { display: none; }
      .code-dark { display: block; }
      .highlighted-line { background-color: rgba(255, 212, 0, 0.15); }
    }
    ```
  - Estimated changes: ~50 lines added/modified in component, ~30 lines in CSS

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: Vercel (existing, no changes)
- Environment variables: None required
- Breaking changes: None (backward compatible with existing code blocks)
- Migration: Automatic (build process upgrade, no content changes needed)

**Build Commands**:
- No changes: `npm run build` continues to work
- Build-time increase: Minimal (<10% for typical blog with <50 code blocks)
- Lighthouse CI: Existing checks continue to pass (target: accessibility ≥95)

**Environment Variables** (no changes):
- No new environment variables required
- Existing `NODE_ENV` used for dev-only warnings (NFR-006)

**Database Migrations**:
- None (frontend-only feature)

**Smoke Tests** (for deploy-staging.yml and promote.yml):
- Route: Any post with code blocks (e.g., `/posts/[slug]`)
- Expected: Code blocks render with syntax highlighting, copy button works, themes switch
- Playwright test (add to existing test suite):
  ```typescript
  test('code blocks have syntax highlighting', async ({ page }) => {
    await page.goto('/posts/syntax-highlighting-test');
    const codeBlock = page.locator('pre code');
    await expect(codeBlock).toHaveClass(/language-javascript/);

    // Verify highlighted lines
    const highlightedLines = page.locator('.highlighted-line');
    await expect(highlightedLines).toHaveCount(4); // Lines 1,2,3,5

    // Verify copy button
    const copyButton = page.locator('button:has-text("Copy")');
    await copyButton.click();
    await expect(page.locator('text=Copied')).toBeVisible();
  });
  ```

**Platform Coupling**:
- Vercel: None (standard Next.js build, no Vercel-specific features)
- Build-time rendering: Compatible with any Node.js environment
- Dependencies: Standard npm packages (Shiki), no platform-specific integrations

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- Existing code blocks continue to work without modification (backward compatibility)
- Build time remains <5 minutes for typical blog (50-100 posts)
- No breaking changes to MDX syntax or CodeBlock component API
- Lighthouse accessibility score ≥95 maintained

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Given user visits a blog post with code examples
When page loads with prefers-color-scheme: dark
Then code blocks use GitHub Dark theme
  And syntax highlighting is accurate for all 8 supported languages
  And copy button is keyboard accessible (Tab, Enter/Space)
  And highlighted lines have 4.5:1 contrast ratio

Given user visits same post with prefers-color-scheme: light
When theme changes (toggle system preference or browser DevTools)
Then code blocks switch to GitHub Light theme within 100ms
  And no layout shift occurs (CLS <0.1)
  And highlighted lines remain visible with sufficient contrast

Given user with screen reader navigates code block
When focus lands on highlighted line
Then screen reader announces "Line 5, highlighted: [code content]"
  And ARIA live region announces "Code copied" when copy button activated
```

**Rollback Plan**:
- Deploy IDs tracked in: `specs/006-syntax-highlighting/NOTES.md` (Deployment Metadata)
- Rollback commands: Standard 3-command Vercel alias rollback
  ```bash
  vercel alias set <previous-deployment-id> <production-url> --token=$VERCEL_TOKEN
  ```
- Special considerations: None (frontend-only, no database changes, no data loss risk)
- Testing rollback: Verify code blocks render with basic rehype-highlight (pre-Shiki behavior)

**Artifact Strategy** (build-once-promote-many):
- Web (App): Vercel prebuilt artifact (`.vercel/output/`)
  - Build in: `.github/workflows/verify.yml` (on PR)
  - Deploy to staging: `.github/workflows/deploy-staging.yml` (uses prebuilt artifact)
  - Promote to production: `.github/workflows/promote.yml` (same artifact, no rebuild)
- Shiki processing: Happens during build step, output is static HTML (no runtime dependency)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Scenario 1: Initial setup (install Shiki, remove rehype-highlight, verify build)
- Scenario 2: Development testing (start dev server, test theme switching, copy button, line numbers)
- Scenario 3: Creating test content (MDX file with all 8 languages, line highlighting, filename examples)
- Scenario 4: Validation checklist (theme switching, line highlighting, keyboard a11y, mobile, performance)
- Scenario 5: Build-time performance test (measure <5s per 100 blocks)
- Scenario 6: Error handling test (unsupported language fallback)
- Scenario 7: Accessibility audit (Lighthouse, keyboard nav, ARIA, contrast)
- Scenario 8: Rollback test (revert to rehype-highlight if Shiki fails)

---

## [TESTING STRATEGY]

**Unit Tests** (add to existing test suite):
- `lib/rehype-shiki.test.ts`:
  - Parse metadata correctly: `{1-3,5}` → `[1, 2, 3, 5]`
  - Handle edge cases: empty metadata, invalid ranges, malicious input
  - Fallback for unsupported languages: Unknown lang → plaintext
  - Dual theme output: Verify both `.code-light` and `.code-dark` classes

- `lib/shiki-config.test.ts`:
  - Highlighter initialization: Loads github-dark and github-light themes
  - Language support: All 8 required languages load correctly
  - Singleton caching: `getHighlighter()` returns same instance on multiple calls

- `components/mdx/code-block.test.tsx`:
  - Copy button works: Click → clipboard API called → "Copied" feedback shown
  - Keyboard accessibility: Tab focus → Enter/Space activates → Alt+C shortcut
  - Line numbers: `showLineNumbers={true}` → line numbers displayed
  - Highlighted lines: `highlightLines={[1,3]}` → lines 1 and 3 have `.highlighted-line` class

**Integration Tests** (E2E with Playwright):
- Theme switching: Toggle prefers-color-scheme → code blocks update theme
- All languages render: Create post with 8 languages → verify each has correct syntax colors
- Line highlighting visible: Post with `{1-3,5}` → lines 1,2,3,5 have highlighted background
- Mobile responsiveness: Resize to 320px → code blocks scroll horizontally, copy button accessible
- Accessibility: Screen reader announces highlighted lines, copy button keyboard navigable

**Performance Tests**:
- Build time benchmark: Time `npm run build` with 100 code blocks → <5s
- Bundle size check: Measure client bundle increase → <10KB gzipped
- Lighthouse CI: Performance ≥85, Accessibility ≥95
- Core Web Vitals: LCP <3s, CLS <0.1, FID <100ms

**Manual Testing** (during `/preview` phase):
- Visual QA: Verify GitHub Dark/Light themes match brand aesthetics
- Cross-browser: Test in Chrome, Firefox, Safari (theme switching works)
- Edge cases: Very long code blocks (>100 lines), empty code blocks, special characters

---

## [SUCCESS METRICS]

**From spec.md Success Criteria**:
1. **Syntax Accuracy**: All 8 languages (JS, TS, Python, Bash, YAML, JSON, Go, Rust) render with correct highlighting
   - Measurement: Manual inspection of test post with all languages
   - Target: 100% of keywords, functions, comments highlighted correctly

2. **Theme Consistency**: Code block themes match site-wide dark/light mode in 100% of page views
   - Measurement: Test with browser DevTools prefers-color-scheme emulation
   - Target: Instant theme switch (<100ms) when system theme changes

3. **Line Highlighting**: Authors can emphasize specific lines, visible in both themes with 4.5:1 contrast
   - Measurement: Contrast ratio checker (Chrome DevTools Accessibility panel)
   - Target: Highlighted lines pass WCAG AA (4.5:1 minimum)

4. **Performance**: Build time increase <10% when adding 50 code blocks
   - Measurement: Time `npm run build` before and after Shiki migration
   - Baseline: ~2s current build time, Target: <2.2s after migration

5. **Accessibility**: Lighthouse accessibility score ≥95, keyboard navigable, ARIA labels present
   - Measurement: Lighthouse CI in GitHub Actions
   - Target: Score ≥95, no accessibility violations

6. **Copy Functionality**: Copy button works in 95%+ of modern browsers
   - Measurement: Manual testing in Chrome, Firefox, Safari, Edge
   - Target: Clipboard API success, graceful fallback if API unavailable

7. **Mobile Usability**: Code blocks readable on 320px viewport, horizontal scroll functional
   - Measurement: Chrome DevTools responsive mode, iPhone SE viewport
   - Target: No overflow issues, copy button accessible, text legible

8. **Engagement** (post-ship, baseline TBD):
   - Time-on-page for code-heavy posts: Target +20% increase
   - Copy button usage: Target +15% increase for technical posts
   - Measurement: Analytics (Google Analytics 4, track copy button clicks)

9. **Code Copy Rate**: Copy button usage increases by 15%+ for technical posts
   - Measurement: Event tracking in Analytics (button click events)
   - Baseline: Establish after US1 ships

10. **Theme Switching**: Code blocks update within 100ms when user toggles dark/light mode
    - Measurement: Chrome DevTools Performance panel, CSS transition timing
    - Target: <100ms (CSS-only, no JavaScript re-render)

---

## [ACCEPTANCE CRITERIA MAPPING]

**User Story → Implementation**:

- **US1** (Shiki upgrade): `lib/rehype-shiki.ts`, `lib/shiki-config.ts`, `next.config.ts` modification
- **US2** (Dark/light themes): Dual theme CSS in `globals.css`, Shiki `themes: { dark, light }` config
- **US3** (Line highlighting): Metadata parsing in `lib/rehype-shiki.ts`, `.highlighted-line` CSS
- **US4** (Keyboard shortcuts): Enhanced `code-block.tsx` with Alt+C handler, ARIA live region
- **US5** (Inline code styling): Update `mdx-components.tsx` inline code handler, subtle background in `globals.css`
- **US6** (Aviation code support): Shiki language support (Python, JS) - no special handling needed
- **US7** (Copy button placement): CSS hover effects, mobile always-visible, top-right positioning
- **US8** (Collapsible blocks): Conditional rendering in `code-block.tsx` for >50 line blocks (future enhancement)

---

## [DEPENDENCIES AND RISKS]

**External Dependencies**:
- Shiki library maintenance: Risk = Low (maintained by VS Code team, active development)
- Theme availability: Risk = Low (github-dark/light built into Shiki)
- Language grammar updates: Risk = Low (Shiki updates grammars regularly)

**Internal Dependencies**:
- Feature 005 (Dark/Light Mode Toggle): Blocked but mitigated
  - Mitigation: CSS `prefers-color-scheme` fallback (US2)
  - Enhancement path: When Feature 005 ships, add JavaScript-based theme toggle

**Technical Risks**:
1. **Build-time performance**: Risk = Medium
   - Concern: 100+ code blocks could slow build significantly
   - Mitigation: Benchmark with 100 blocks (Scenario 5 in quickstart.md)
   - Fallback: If >5s, optimize with parallel processing or lazy-load Shiki

2. **Bundle size impact**: Risk = Low
   - Concern: Shiki could increase client bundle
   - Mitigation: Shiki is build-time only, generates static HTML
   - Validation: Measure bundle before/after with `npm run build -- --analyze`

3. **Theme switching compatibility**: Risk = Low
   - Concern: CSS media query may not work in all browsers
   - Mitigation: `prefers-color-scheme` supported in 95%+ browsers (caniuse.com)
   - Fallback: Default to dark theme if media query unsupported

4. **Accessibility regressions**: Risk = Medium
   - Concern: Shiki output may not be screen-reader friendly
   - Mitigation: Add ARIA labels manually in rehype plugin
   - Validation: Lighthouse CI accessibility checks in PR workflow

**Unknowns Resolved During Research**:
- ✅ Shiki dual theme support: Confirmed via docs
- ✅ Rehype plugin compatibility: Confirmed via existing `next.config.ts`
- ✅ Build-time performance: Benchmarks show <100ms per block
- ✅ Metadata parsing: Shiki provides `transformerNotationHighlight`

---

## [FUTURE ENHANCEMENTS]

**Out of Scope (but documented for future)**:
1. **Interactive code playgrounds** (US not in this spec):
   - Run JavaScript/Python code in browser sandbox
   - Requires: CodeMirror or Monaco editor, Pyodide for Python
   - Estimated effort: Large (2-3 weeks)

2. **Diff highlighting** (US not in this spec):
   - Show added/removed lines with +/- prefixes
   - Requires: Shiki transformer or custom plugin
   - Estimated effort: Small (1-2 days)

3. **Multi-file code examples** (US not in this spec):
   - Tabbed interface for related files
   - Requires: State management, tab component
   - Estimated effort: Medium (1 week)

4. **Custom syntax themes** (beyond GitHub Dark/Light):
   - Brand-specific color palette for code blocks
   - Requires: Custom Shiki theme JSON, color contrast validation
   - Estimated effort: Small (2-3 days)

5. **Code folding** (collapsing sections):
   - Hide/show code sections (functions, classes)
   - Requires: AST parsing, interactive UI
   - Estimated effort: Large (2-3 weeks)

**Integration with Feature 005** (when shipped):
- Replace CSS `prefers-color-scheme` with JavaScript theme context
- Add explicit theme toggle button in code blocks (optional)
- Sync code block theme with site-wide theme state
- Estimated effort: Small (1-2 days after Feature 005 ships)
