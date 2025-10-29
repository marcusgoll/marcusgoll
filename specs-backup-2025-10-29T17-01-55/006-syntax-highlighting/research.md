# Research & Discovery: Syntax Highlighting Enhancements

## Research Decisions

### Decision: Shiki for Syntax Highlighting

- **Decision**: Use Shiki library for syntax highlighting (replace rehype-highlight)
- **Rationale**:
  - Shiki uses VS Code's TextMate grammars (more accurate than highlight.js)
  - Better theme support with built-in VS Code themes
  - Build-time highlighting reduces client bundle size
  - Recommended in GitHub issue #24
  - Battle-tested in VS Code, VitePress, Docusaurus
- **Alternatives**:
  - `rehype-highlight` (current): Limited themes, less accurate
  - `Prism.js`: Good but requires more client-side JavaScript
  - `highlight.js` (underlying rehype-highlight): Older, less accurate
- **Source**:
  - GitHub issue #24: "Shiki has better themes"
  - Shiki docs: https://shiki.style/
  - Package: `shiki@^1.0.0`

### Decision: Dual Theme Strategy with CSS Fallback

- **Decision**: Implement Shiki with both dark and light themes, use CSS `prefers-color-scheme` for switching
- **Rationale**:
  - Feature 005 (Dark/Light Mode Toggle) not yet implemented
  - CSS fallback allows immediate theme support without blocking on Feature 005
  - Shiki's `getHighlighter` supports multiple themes in single instance
  - Can enhance with JavaScript theme toggle when Feature 005 ships
- **Alternatives**:
  - Wait for Feature 005: Blocks this feature unnecessarily
  - Single theme only: Poor UX for users with different preferences
  - JavaScript-based theme detection: Adds client-side complexity
- **Source**:
  - Spec US2: "Falls back to prefers-color-scheme if Feature 005 not complete"
  - Existing `globals.css:16`: Already uses `@media (prefers-color-scheme: dark)`

### Decision: Build-Time Highlighting via rehype Plugin

- **Decision**: Create custom rehype plugin for Shiki integration
- **Rationale**:
  - Maintains existing rehype pipeline in `next.config.ts`
  - Highlighting happens at build time (no client-side parsing)
  - Consistent with Next.js MDX architecture
  - Performance: <5s per 100 blocks (NFR-001)
- **Alternatives**:
  - Client-side highlighting: Violates NFR-001, increases bundle size
  - MDX remark plugin: Wrong layer (remark = markdown, rehype = HTML)
  - Custom MDX component: Requires manual wrapping in all posts
- **Source**:
  - Shiki docs: "Rehype plugin" example
  - Current config: `next.config.ts:23` uses `rehypePlugins: [rehypeHighlight]`

### Decision: Line Highlighting via Metadata Parsing

- **Decision**: Parse fenced code metadata (```js {1-3,5}) to extract line highlights
- **Rationale**:
  - Standard syntax used by Docusaurus, VitePress, Shiki examples
  - Non-breaking: Existing code blocks without metadata work unchanged
  - Intuitive for content authors
- **Alternatives**:
  - MDX component props: `<CodeBlock highlight={[1,2,3]}>` - Too verbose
  - Comment-based: `// highlight-next-line` - Clutters code examples
  - HTML attributes: Requires raw HTML in MDX
- **Source**:
  - Spec US3: "Support line highlighting via fenced code metadata: ```js {1-3,5}"
  - Shiki transformers: `transformerNotationHighlight`

### Decision: GitHub Dark/Light Themes as Defaults

- **Decision**: Use `github-dark` and `github-light` Shiki themes
- **Rationale**:
  - Familiar to developers (matches GitHub UI)
  - High contrast, WCAG 2.1 AA compliant
  - Built into Shiki (no custom theme JSON)
  - Neutral aesthetic fits technical content
- **Alternatives**:
  - Dracula/Nord/OneDark: More opinionated, may clash with brand
  - Custom themes: Requires theme JSON creation, maintenance overhead
  - VS Code Dark+/Light+: Similar to GitHub, but GitHub is more recognizable
- **Source**:
  - Spec US2: "Dark theme (GitHub Dark or similar)"
  - Shiki built-in themes: https://shiki.style/themes

### Decision: Preserve Existing CodeBlock Component Structure

- **Decision**: Enhance existing `components/mdx/code-block.tsx`, don't replace
- **Rationale**:
  - Copy button already implemented (FR-005)
  - Line numbers already implemented (FR-006)
  - Filename display already implemented (FR-007)
  - Reuse existing UI/UX patterns
- **Alternatives**:
  - Complete rewrite: Wastes working code, increases risk
  - Separate component: Duplicates functionality
- **Source**:
  - Existing file: `components/mdx/code-block.tsx` (124 lines)
  - Spec: "Maintains existing copy button and file name features"

---

## Components to Reuse (5 found)

- `components/mdx/code-block.tsx`: Copy button, line numbers, filename display, extractTextContent utility (reuse UI structure, add theme-aware styling)
- `components/mdx/mdx-components.tsx`: MDX component mappings for `code` and `pre` elements (enhance to use Shiki output)
- `next.config.ts:20-25`: MDX pipeline with rehype plugins (replace `rehypeHighlight` with custom Shiki rehype plugin)
- `app/globals.css:16-21`: `prefers-color-scheme` dark mode detection (extend for code block theme switching)
- `package.json:28`: `rehype-highlight@7.0.2` dependency (replace with `shiki@^1.0.0`)

---

## New Components Needed (3 required)

- `lib/rehype-shiki.ts`: Custom rehype plugin to integrate Shiki with MDX pipeline (replaces rehype-highlight)
  - Parse fenced code metadata for language and line highlights
  - Call Shiki's `codeToHtml` with dual themes
  - Apply theme-aware CSS classes
  - Transform AST nodes to highlighted HTML

- `components/mdx/code-block-enhanced.tsx` (or enhance existing): Add theme-aware CSS and highlighted line styling
  - CSS variables for theme switching via `prefers-color-scheme`
  - Highlighted line background with 4.5:1 contrast (NFR-002)
  - ARIA labels for highlighted lines (FR-012)

- `lib/shiki-config.ts`: Shiki configuration and theme setup
  - Initialize highlighter with `github-dark` and `github-light` themes
  - Support for 8 languages: JS, TS, Python, Bash, YAML, JSON, Go, Rust (FR-002)
  - Fallback for unsupported languages (NFR-006)

---

## Unknowns & Questions

None - all technical questions resolved during research phase

**Research Validations**:
- ✅ Shiki supports build-time highlighting: Confirmed via docs
- ✅ Shiki supports dual themes in single pass: Confirmed via `codeToHtml({ themes: { light, dark } })`
- ✅ Rehype plugin pattern compatible with Next.js: Confirmed via existing `next.config.ts`
- ✅ Metadata parsing feasible: Shiki provides `transformerNotationHighlight` for `{1-3,5}` syntax
- ✅ Performance acceptable: Shiki benchmarks show <100ms per block (well under 5s/100 blocks target)
- ✅ Accessibility: Shiki outputs semantic HTML, adding ARIA labels is straightforward
