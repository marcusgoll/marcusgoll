# Data Model: Syntax Highlighting Enhancements

## Entities

### CodeBlockConfig (Frontend Configuration)
**Purpose**: Configuration extracted from MDX fenced code blocks for rendering

**Fields**:
- `language`: string - Programming language identifier (e.g., "javascript", "python", "bash")
- `meta`: string (optional) - Raw metadata from fenced code block (e.g., "{1-3,5} title=\"example.ts\"")
- `highlightLines`: number[] - Parsed line numbers to highlight (e.g., [1, 2, 3, 5])
- `filename`: string (optional) - File name to display in code block header
- `showLineNumbers`: boolean - Whether to display line numbers (default: false)
- `theme`: 'light' | 'dark' - Active theme (derived from prefers-color-scheme)

**Source**: Parsed from MDX fenced code block syntax:
```
​```typescript {1-3,5} title="example.ts" showLineNumbers
code here
​```
```

**Validation Rules**:
- `language`: Must be supported by Shiki (JS, TS, Python, Bash, YAML, JSON, Go, Rust) (FR-002)
- `highlightLines`: Must be positive integers within code block line count (FR-004)
- `filename`: Optional string, displayed in header if provided (FR-007)
- `showLineNumbers`: Boolean, defaults to false (FR-006)

---

### SyntaxTheme (Shiki Theme Configuration)
**Purpose**: Shiki theme configuration for light and dark modes

**Fields**:
- `darkTheme`: string - Shiki theme identifier for dark mode (default: "github-dark")
- `lightTheme`: string - Shiki theme identifier for light mode (default: "github-light")
- `supportedLanguages`: string[] - List of grammar identifiers loaded by Shiki

**Source**: Configured in `lib/shiki-config.ts`

**Validation Rules**:
- `darkTheme`: Must exist in Shiki's built-in themes registry
- `lightTheme`: Must exist in Shiki's built-in themes registry
- `supportedLanguages`: Must match FR-002 requirements (8 languages minimum)

---

### HighlightedLine (UI State)
**Purpose**: Represents a highlighted line in a code block for ARIA and styling

**Fields**:
- `lineNumber`: number - 1-based line number in code block
- `content`: string - Text content of the line
- `highlighted`: boolean - Whether this line should be emphasized
- `ariaLabel`: string (optional) - Accessible label for screen readers

**Source**: Generated during code block rendering

**Validation Rules**:
- `lineNumber`: Must be positive integer ≤ total lines (FR-004)
- `highlighted`: Derived from `highlightLines` array in CodeBlockConfig
- `ariaLabel`: Required if `highlighted === true` (FR-012)

---

## Configuration Schema

**Shiki Configuration** (`lib/shiki-config.ts`):
```typescript
interface ShikiConfig {
  themes: {
    dark: string; // "github-dark"
    light: string; // "github-light"
  };
  langs: string[]; // ["javascript", "typescript", "python", ...]
  defaultLang: string; // "plaintext"
}
```

**Code Block Metadata** (MDX fenced code syntax):
```
{lineRange1-lineRange2, singleLine3, ...} attribute1="value1" attribute2
```

Example:
```
{1-3,5} title="example.ts" showLineNumbers
```

Parsed as:
- `highlightLines`: [1, 2, 3, 5]
- `filename`: "example.ts"
- `showLineNumbers`: true

---

## State Shape (Frontend)

**No global state required** - Highlighting happens at build time

**Component State** (code-block.tsx):
```typescript
interface CodeBlockState {
  copied: boolean; // Copy button state
}
```

**Theme Detection** (CSS-based, no JavaScript state):
```css
@media (prefers-color-scheme: dark) {
  .code-block-dark { display: block; }
  .code-block-light { display: none; }
}

@media (prefers-color-scheme: light) {
  .code-block-dark { display: none; }
  .code-block-light { display: block; }
}
```

---

## No Database Changes

This is a frontend-only enhancement. No database entities, migrations, or schemas required.

**Rationale**:
- Syntax highlighting is a presentation concern (MDX → HTML transformation)
- All configuration is file-based (MDX metadata, Shiki config)
- No user preferences stored (theme detection via CSS media query)
- No API layer involved

---

## Performance Considerations

**Build-Time Processing** (NFR-001: <5s per 100 blocks):
- Each code block processed once during `next build`
- Shiki `codeToHtml` benchmarks: ~50-100ms per block (depends on language complexity)
- Expected build time for 100 blocks: ~5-10 seconds (within NFR-001 target)

**Client-Side Footprint**:
- No Shiki library shipped to client (build-time only)
- CSS theme switching: 0ms (browser-native)
- Copy button: Minimal JavaScript (clipboard API)

**Bundle Size Impact** (NFR-004: <100KB gzipped):
- Shiki: Build-time dependency only (0KB client impact)
- Generated HTML: ~2-3KB per code block (highlighted HTML)
- CSS for themes: ~5KB total (both themes)
- Total client impact: <10KB (well under 100KB limit)
