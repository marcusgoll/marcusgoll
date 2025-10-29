# Error Log

**Purpose**: Track failures, root causes, and learnings during implementation.

## Format

Each entry follows this structure:

```markdown
### Entry N: YYYY-MM-DD - Brief Title

**Failure**: What broke (specific component or behavior)
**Symptom**: Observable behavior (error messages, stack traces, incorrect output)
**Learning**: Root cause and key insights (why it happened, how to prevent)
**Ghost Context Cleanup**: Retired artifacts or corrected assumptions

[Optional: During T0NN task-name if during implementation]
[Optional: From /optimize auto-fix (Issue ID: CR###) if structured mode]
```

## Guidelines

- **Be specific**: Include file paths, function names, error codes
- **Include context**: Task IDs, timestamps, related commits
- **Document learnings**: What we learned that prevents future similar issues
- **Ghost context**: What was removed, deprecated, or corrected

## Categories

- **Test Failures**: Unit tests, integration tests, E2E tests
- **Build Errors**: Compilation failures, dependency issues
- **Runtime Errors**: API failures, crashes, exceptions
- **UI Bugs**: Layout issues, interaction problems, visual regressions
- **Performance**: Slow queries, memory leaks, bundle size
- **Security**: Vulnerabilities, authorization issues
- **Integration**: API mismatches, data format issues

---

### Entry 1: 2025-10-21 - PostCSS/TailwindCSS v4 Configuration Error (CRITICAL)

**Failure**: Build failed with "TailwindCSS v4.x requires @tailwindcss/postcss plugin"
**Symptom**: `npm run build` fails immediately with error: "TailwindCSS v4.x requires @tailwindcss/postcss plugin"
**Learning**: TailwindCSS v4.1.15 moved PostCSS plugin to separate package `@tailwindcss/postcss`. The `postcss.config.mjs` was using legacy plugin name `tailwindcss: {}` instead of `'@tailwindcss/postcss': {}`.
**Ghost Context Cleanup**: Updated `postcss.config.mjs` from legacy config to v4 format. Installed `@tailwindcss/postcss` package.

**From /optimize auto-fix** (Issue ID: PostCSS-Critical)

---

### Entry 2: 2025-10-21 - Missing Type Definitions for Third-Party Libraries (H-1)

**Failure**: TypeScript compilation failed with "Could not find declaration file" for Ghost API packages
**Symptom**: Build error: `Could not find a declaration file for module '@tryghost/content-api'`
**Learning**: Ghost CMS packages and Turndown don't have official @types packages. Need to create custom type declarations with proper method signatures to match actual API usage. Also discovered Ghost API `browse()` accepts both `number` and `string` for limit parameter, not just string.
**Ghost Context Cleanup**: Created `types/ghost.d.ts` with comprehensive type declarations for `@tryghost/content-api` and `@tryghost/admin-api`. Installed `@types/turndown` package.

**From /optimize auto-fix** (Issue ID: H-1)

---

### Entry 3: 2025-10-21 - Unoptimized Featured Image Component (H-2)

**Failure**: Blog post featured images using standard `<img>` tag instead of Next.js Image optimization
**Symptom**: ESLint warning in `app/blog/[slug]/page.tsx:125` - "Using `<img>` could result in slower LCP"
**Learning**: Always use Next.js `<Image>` component for images to get automatic optimization, lazy loading, and better performance. Featured images should have `priority` prop since they're above the fold.
**Ghost Context Cleanup**: Replaced `<img>` with `<Image>` component with proper width/height (1200x630), priority loading, and responsive classes.

**From /optimize auto-fix** (Issue ID: H-2)

---

### Entry 4: 2025-10-21 - Path Traversal Security Risk in Migration Script (H-5)

**Failure**: Unsanitized slug used directly in file path construction
**Symptom**: Security audit found potential path traversal vulnerability at `scripts/migrate-ghost-to-mdx.ts:102-119`
**Learning**: Never trust external data (Ghost CMS slugs) for file system operations. Always sanitize slugs by removing special characters and validating against path traversal patterns (`..`, `/`, `\`). Malicious Ghost data could write files outside content directory.
**Ghost Context Cleanup**: Created `sanitizeSlug()` function with comprehensive validation. Applied to all file path constructions using `post.slug` (3 locations: MDX file creation, image directory creation, featured image paths).

**From /optimize auto-fix** (Issue ID: H-5)

---

### Entry 5: 2025-10-21 - DRY Violation in Post Card Rendering (H-3)

**Failure**: 45 lines of duplicate post card rendering logic across two pages
**Symptom**: Identical post card markup in `app/blog/page.tsx:55-98` and `app/blog/tag/[tag]/page.tsx:89-141`
**Learning**: Extract shared UI components immediately when creating second instance. Duplication creates maintenance burden - changes must be made in multiple places, increasing error risk. This violates DRY principles.
**Ghost Context Cleanup**: Created shared `components/blog/post-card.tsx` component. Updated both blog index and tag archive pages to use `<PostCard>` component. Removed 90 lines of duplicate code.

**From /optimize auto-fix** (Issue ID: H-3)

---

### Entry 6: 2025-10-21 - Build Failure Risk from RSS/Sitemap Generation (H-4)

**Failure**: RSS/sitemap file write errors crash entire build
**Symptom**: Build fails completely if disk space or permissions issue occurs during RSS/sitemap generation in `lib/generate-rss.ts` and `lib/generate-sitemap.ts`
**Learning**: Non-critical build-time operations (RSS feeds, sitemaps) should have graceful degradation. If they fail, warn but don't crash the build. These are nice-to-have features, not build requirements.
**Ghost Context Cleanup**: Removed `throw error` statements from both RSS and sitemap generators. Changed to console.warn with "(non-critical)" label. Build now continues even if these files can't be written.

**From /optimize auto-fix** (Issue ID: H-4)

---

### Entry 7: 2025-10-21 - Missing PostData Type Export

**Failure**: TypeScript compilation failed when importing PostData type in PostCard component
**Symptom**: Build error: `Module '"@/lib/mdx"' declares 'PostData' locally, but it is not exported` at `components/blog/post-card.tsx:7`
**Learning**: When creating shared components that reference types from library modules, ensure those types are exported. The PostData type was imported from mdx-types but not re-exported from mdx.ts.
**Ghost Context Cleanup**: Added type re-exports to `lib/mdx.ts`: `export type { PostData, PostFrontmatter, TagData }` for convenient imports.

**During**: PostCard component extraction (H-3 fix)

---

### Entry 8: 2025-10-21 - MDX Syntax Error in Sample Post

**Failure**: Build failed during static page generation for interactive-mdx-demo post
**Symptom**: Error: `[next-mdx-remote] error compiling MDX: Could not parse expression with acorn` for `/blog/interactive-mdx-demo`
**Learning**: MDX JSX props require proper JavaScript expression syntax. The CodeBlock component usage had props that couldn't be parsed by MDX. Standard markdown code fences (```) are more reliable for simple code examples. Reserve JSX components for truly interactive elements.
**Ghost Context Cleanup**: Replaced `<CodeBlock language="javascript" filename="example.js" showLineNumbers>` with standard markdown code fence in `content/posts/interactive-mdx-demo.mdx`.

**During**: Build verification

---

### Entry 9: 2025-10-21 - Missing Environment Variables for Build

**Failure**: Build blocked by environment variable validation
**Symptom**: Build error: "Missing required environment variable: PUBLIC_URL, NEWSLETTER_FROM_EMAIL, RESEND_API_KEY"
**Learning**: Next.js environment validation runs during build, not just runtime. Test/build environments need placeholder values for non-critical variables. These particular variables aren't needed for MDX functionality but are validated globally.
**Ghost Context Cleanup**: Added placeholder environment variables to `.env.local`: `PUBLIC_URL="http://localhost:3000"`, `NEWSLETTER_FROM_EMAIL="newsletter@marcusgoll.com"`, `RESEND_API_KEY="re_placeholder_for_build_testing"`.

**During**: Initial build test after PostCSS fix

---

## Summary

**Total Entries**: 9
**Categories**:
- Build Errors: 6 (PostCSS, Types, Env vars, PostData export, MDX syntax)
- Security: 1 (Path traversal)
- Performance: 1 (Image optimization)
- Code Quality: 2 (DRY violation, Error handling)

**Key Learnings**:
1. Always check for breaking changes in major dependency updates (TailwindCSS v4)
2. Create type declarations for untyped third-party packages
3. Sanitize external data before file system operations
4. Extract shared components on second use, not third
5. Non-critical build operations should fail gracefully
6. Re-export types from library modules for convenience
7. Prefer markdown syntax over JSX when possible in MDX
8. Test builds need placeholder environment variables

**Fixes Applied**: All 6 high-priority issues from optimization report resolved. Build now succeeds with only minor ESLint warnings in unrelated files.
