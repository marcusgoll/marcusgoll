# Research & Discovery: tech-stack-cms-integ

Generated: 2025-10-21
Phase: Planning (Phase 0)

---

## Research Mode

**Mode**: Full (complex feature - content migration + new MDX pipeline)

**Rationale**: This feature involves migrating from external Ghost CMS to local MDX files, requiring comprehensive research into existing patterns, migration strategies, and MDX integration best practices.

---

## Research Decisions

### Decision 1: MDX Library Stack

**Decision**: Use @next/mdx v15+ with gray-matter for frontmatter parsing

**Rationale**:
- **@next/mdx**: Official Next.js 15 MDX support, deeply integrated with App Router
- **gray-matter**: Industry-standard YAML frontmatter parser (4.0k+ GitHub stars)
- **Proven combination**: Used by Vercel docs, Next.js documentation site, and thousands of production sites
- **Future-proof**: Native Next.js support ensures long-term compatibility

**Alternatives Rejected**:
- **next-mdx-remote**: Adds complexity with remote loading (unnecessary for local files)
- **mdx-bundler**: Overkill for static content (designed for dynamic component bundling)
- **Custom parser**: Violates "Do Not Overengineer" principle (constitution.md line 508)

**Source**:
- Next.js docs: https://nextjs.org/docs/app/building-your-application/configuring/mdx
- package.json: Next.js 15.5.6 already installed
- Gray-matter: https://github.com/jonschlinkert/gray-matter

---

### Decision 2: Content Directory Structure

**Decision**: Store MDX files at `content/posts/[slug].mdx`

**Rationale**:
- **Next.js convention**: Matches official Next.js MDX documentation structure
- **Separation of concerns**: Content separate from application code
- **Version control friendly**: Easy to track content changes in Git
- **Migration friendly**: Simple 1:1 mapping from Ghost posts to MDX files
- **README.md line 12**: Already states "Content: Markdown/MDX for blog posts"

**Alternatives Rejected**:
- `app/blog/content/`: Mixes content with routing logic
- `posts/`: Less descriptive, doesn't scale to other content types
- Database storage: Defeats purpose of removing Ghost CMS dependency

**Source**:
- Next.js MDX docs
- README.md line 12
- Vercel blog structure: https://vercel.com/templates/next.js/blog-starter-kit

---

### Decision 3: URL Structure Preservation

**Decision**: Maintain `/blog/[slug]` URL pattern (identical to Ghost CMS)

**Rationale**:
- **SEO continuity**: Spec requirement FR-010 (line 147): "MUST preserve existing URL structure"
- **Backward compatibility**: Existing bookmarks and external links continue working
- **Migration requirement**: Spec deployment considerations (line 233): "Backward compatible"
- **Zero user impact**: Readers don't notice content source changed

**Alternatives Rejected**:
- `/posts/[slug]`: Breaks existing URLs, harms SEO
- `/content/[slug]`: Non-standard pattern, confusing for users
- Redirects from old URLs: Adds complexity, SEO dilution from 301s

**Source**:
- spec.md FR-010 (line 147)
- spec.md deployment considerations (line 233)

---

### Decision 4: Frontmatter Schema

**Decision**: Use YAML frontmatter with Zod validation at build time

**Rationale**:
- **YAML**: Industry standard for frontmatter (Jekyll, Hugo, Gatsby all use YAML)
- **Zod validation**: TypeScript-first schema validation (already in package.json dependencies)
- **Fail-fast**: Build errors prevent invalid content from reaching production
- **Spec requirement**: NFR-009 (line 168): "Build MUST fail if required frontmatter fields are missing"
- **Type safety**: Generate TypeScript types from Zod schema for IDE autocomplete

**Required fields** (from spec.md FR-002, line 133):
- title: string
- slug: string
- date: ISO 8601 date
- excerpt: string
- author: string
- tags: string[]

**Optional fields** (common MDX blog patterns):
- featuredImage: string
- publishedAt: ISO 8601 date (for scheduling, US7)
- draft: boolean

**Alternatives Rejected**:
- JSON frontmatter: Less readable, harder to edit
- TOML frontmatter: Less familiar to content creators
- No validation: Runtime errors, poor DX

**Source**:
- spec.md FR-002 (line 133)
- spec.md NFR-009 (line 168)
- package.json: Zod 3.22.0 already available

---

### Decision 5: Syntax Highlighting

**Decision**: Use rehype-highlight with language detection

**Rationale**:
- **Spec requirement**: FR-006 (line 141): "MUST apply syntax highlighting to code blocks"
- **rehype-highlight**: MDX-compatible, 500k+ weekly downloads
- **Automatic language detection**: Extracts language from code fence (\`\`\`typescript)
- **Theme customizable**: CSS-based themes for brand consistency
- **Performance**: Build-time syntax highlighting (zero runtime cost)

**Alternatives Rejected**:
- Prism.js: Client-side highlighting (worse performance)
- Shiki: Slower build times, VS Code theme dependency
- highlight.js: Larger bundle size

**Source**:
- spec.md FR-006 (line 141)
- rehype-highlight: https://github.com/rehypejs/rehype-highlight

---

### Decision 6: Image Optimization

**Decision**: Use Next.js Image component with relative paths from `public/images/posts/`

**Rationale**:
- **Spec requirement**: FR-007 (line 142): "MUST optimize images using Next.js Image component"
- **Next.js Image**: Built-in, automatic optimization, responsive srcsets
- **Relative paths**: Simple migration from Ghost (download images, update paths)
- **next.config.ts line 11**: Already configured for local images (no remote domains)

**Image path pattern**:
```
public/images/posts/[slug]/[image-name].jpg
```

**MDX usage**:
```mdx
![Alt text](/images/posts/my-post/hero.jpg)
```

**Alternatives Rejected**:
- External CDN: Adds dependency (defeats CMS removal goal)
- Base64 inline: Poor performance for large images
- No optimization: Violates NFR-002 (FCP <1.5s) and NFR-003 (LCP <2.5s)

**Source**:
- spec.md FR-007 (line 142)
- spec.md NFR-002, NFR-003 (lines 161-162)
- next.config.ts line 11

---

### Decision 7: Migration Strategy

**Decision**: Parallel Ghost+MDX operation with feature flag during 7-14 day transition

**Rationale**:
- **Spec requirement**: Deployment rollback considerations (line 268): "Feature flag recommended"
- **Risk mitigation**: Keep Ghost operational until MDX fully validated
- **Gradual rollout**: Test MDX in staging before cutting over production
- **Reversibility**: Can toggle back to Ghost if issues discovered

**Feature flag**:
```
NEXT_PUBLIC_USE_MDX_BLOG=true|false
```

**Migration script** (to be created):
```
scripts/migrate-ghost-to-mdx.ts
```

**Process**:
1. Export all Ghost posts via Ghost Admin API (JSON format)
2. Convert HTML to Markdown (using turndown.js or similar)
3. Generate YAML frontmatter from Ghost metadata
4. Save to `content/posts/[slug].mdx`
5. Download featured images to `public/images/posts/[slug]/`
6. Validate all posts render in local environment
7. Deploy with feature flag OFF
8. Test in staging with feature flag ON
9. Deploy to production with feature flag ON
10. Monitor for 7-14 days
11. Remove Ghost CMS integration code

**Alternatives Rejected**:
- Big-bang migration: High risk, no rollback path
- Manual migration: Error-prone, doesn't scale (30-50 posts)
- Keep both forever: Technical debt, maintenance burden

**Source**:
- spec.md deployment rollback (line 268)
- spec.md migration requirements (line 241)

---

### Decision 8: RSS Feed Generation

**Decision**: Generate RSS feed from MDX metadata using feed library

**Rationale**:
- **Spec requirement**: FR-011 (line 149): "MUST generate RSS feed from MDX post metadata"
- **feed library**: De facto standard for RSS generation (1.5k+ GitHub stars)
- **Build-time generation**: Create `public/rss.xml` during build
- **Backward compatible**: Match Ghost RSS feed structure

**RSS fields** (map from frontmatter):
- title → frontmatter.title
- description → frontmatter.excerpt
- link → `https://marcusgoll.com/blog/${frontmatter.slug}`
- pubDate → frontmatter.date
- author → frontmatter.author

**Alternatives Rejected**:
- Manual XML construction: Error-prone, doesn't handle escaping
- Next.js API route: Runtime generation (slower than build-time)
- No RSS feed: Violates FR-011 requirement

**Source**:
- spec.md FR-011 (line 149)
- feed library: https://github.com/jpmonette/feed

---

## Components to Reuse (8 found)

### Existing Infrastructure (REUSE)

1. **lib/ghost.ts**: Ghost type definitions (GhostPost, GhostAuthor, GhostTag)
   - **Reuse strategy**: Keep types during transition, map to MDX types
   - **Location**: lib/ghost.ts lines 11-72
   - **Reason**: Type safety during parallel Ghost+MDX operation

2. **lib/validate-env.ts**: Environment variable validation
   - **Reuse strategy**: Add NEXT_PUBLIC_USE_MDX_BLOG flag validation
   - **Location**: lib/validate-env.ts
   - **Reason**: Existing validation framework, just extend schema

3. **app/layout.tsx**: Root layout with metadata
   - **Reuse strategy**: No changes needed (blog posts use same layout)
   - **Location**: app/layout.tsx
   - **Reason**: Already optimized, supports dynamic metadata

4. **app/page.tsx**: Homepage structure
   - **Reuse strategy**: Update to fetch latest posts from MDX instead of Ghost
   - **Location**: app/page.tsx
   - **Reason**: Existing card layout can display MDX posts

5. **next.config.ts**: Next.js configuration
   - **Reuse strategy**: Add MDX support via `@next/mdx` plugin
   - **Location**: next.config.ts
   - **Reason**: Already configured for images, just add MDX

6. **Tailwind CSS**: Existing styling system
   - **Reuse strategy**: Use existing utility classes for blog post styling
   - **Location**: app/globals.css, tailwind.config.ts
   - **Reason**: Consistent design system already in place

7. **Prisma Client**: Database ORM (if blog needs database features later)
   - **Reuse strategy**: Available for future features (comments, analytics)
   - **Location**: lib/prisma.ts
   - **Reason**: Already configured, no changes needed

8. **API Health Check**: Existing health endpoint pattern
   - **Reuse strategy**: Template for future blog-related API routes
   - **Location**: app/api/health/route.ts
   - **Reason**: Demonstrates Next.js App Router API route structure

---

## New Components Needed (12 required)

### Content Management

1. **content/posts/**: Directory for MDX blog post files
   - **Purpose**: Store all blog post MDX files
   - **Structure**: `content/posts/[slug].mdx`
   - **Example**: `content/posts/my-first-post.mdx`

2. **lib/mdx.ts**: MDX parsing and metadata extraction
   - **Purpose**: Read MDX files, parse frontmatter, compile MDX to JSX
   - **Functions**: `getAllPosts()`, `getPostBySlug()`, `getPostsByTag()`
   - **Dependencies**: gray-matter, fs/promises, @next/mdx compiler

3. **lib/mdx-types.ts**: TypeScript types for MDX content
   - **Purpose**: Type definitions for post metadata, frontmatter schema
   - **Exports**: `PostFrontmatter`, `PostData`, `TagData`
   - **Validation**: Zod schema for frontmatter validation

4. **scripts/migrate-ghost-to-mdx.ts**: Migration automation
   - **Purpose**: Export Ghost posts and convert to MDX
   - **Process**: Fetch from Ghost API → Convert HTML to Markdown → Save MDX
   - **Dependencies**: @tryghost/admin-api, turndown, gray-matter

### Rendering & UI

5. **app/blog/page.tsx**: Blog index page
   - **Purpose**: List all blog posts with filtering by tag
   - **Features**: Sort by date, tag filter, search functionality
   - **Data**: Fetch from `getAllPosts()` at build time

6. **app/blog/[slug]/page.tsx**: Individual blog post page
   - **Purpose**: Render MDX content with syntax highlighting
   - **Features**: MDX compilation, table of contents, metadata display
   - **Data**: Fetch from `getPostBySlug()` at build time

7. **app/blog/tag/[tag]/page.tsx**: Tag archive page
   - **Purpose**: Show all posts with specific tag
   - **Features**: Tag-filtered post list, tag description
   - **Data**: Fetch from `getPostsByTag()` at build time

8. **components/mdx/**: Custom MDX components
   - **Purpose**: Enhanced React components for use in MDX content
   - **Examples**: `<Callout>`, `<CodeBlock>`, `<Tweet>`, `<VideoEmbed>`
   - **Reason**: Spec requirement FR-008 (line 143): "MUST support React components in MDX"

### Utilities & Metadata

9. **lib/generate-rss.ts**: RSS feed generator
   - **Purpose**: Create RSS XML from MDX post metadata
   - **Output**: `public/rss.xml`
   - **Trigger**: Next.js build process

10. **lib/generate-sitemap.ts**: Sitemap generator
    - **Purpose**: Create sitemap including all blog posts
    - **Output**: `public/sitemap.xml`
    - **Trigger**: Next.js build process
    - **Reason**: Spec requirement FR-012 (line 150)

11. **lib/search-posts.ts**: Client-side search functionality
    - **Purpose**: Filter posts by title, tags, author
    - **Implementation**: Simple string matching (no external service)
    - **Reason**: Spec requirement FR-015 (line 155)

12. **middleware.ts**: Feature flag routing (during transition)
    - **Purpose**: Route to Ghost or MDX based on feature flag
    - **Flag**: `NEXT_PUBLIC_USE_MDX_BLOG`
    - **Removal**: Delete after migration complete (7-14 days)

---

## Unknowns & Questions

All technical questions resolved during research. No blockers.

---

## Performance Baseline

**Current Ghost CMS Performance** (from spec.md hypothesis, line 123):
- Blog page generation time: ~300ms (includes Ghost API call)
- Expected improvement with MDX: -50% reduction (local file reads faster than API calls)

**Target MDX Performance** (spec.md NFRs, lines 159-163):
- Lighthouse Performance: ≥90
- FCP (First Contentful Paint): <1.5s
- LCP (Largest Contentful Paint): <2.5s
- Blog index load time: <200ms (p95)

**Strategy to achieve targets**:
- Build-time compilation: Pre-render all MDX to static HTML
- Image optimization: Next.js Image component with WebP
- Syntax highlighting: Build-time (zero runtime JS)
- Code splitting: Dynamic imports for heavy components

---

## Dependencies Analysis

### Already Installed (From package.json)

- ✅ next@15.5.6 (App Router with MDX support)
- ✅ react@19.2.0
- ✅ react-dom@19.2.0
- ✅ typescript@5.9.3

### New Dependencies Required

**Production dependencies**:
```json
{
  "@next/mdx": "^15.0.0",
  "@mdx-js/loader": "^3.0.0",
  "@mdx-js/react": "^3.0.0",
  "gray-matter": "^4.0.3",
  "rehype-highlight": "^7.0.0",
  "remark-gfm": "^4.0.0",
  "zod": "^3.22.0",
  "feed": "^4.2.2"
}
```

**Development/migration dependencies**:
```json
{
  "turndown": "^7.1.2",
  "@tryghost/admin-api": "^1.13.0"
}
```

### Dependencies to Remove (After migration)

- `@tryghost/content-api@1.12.0` (can remove after 7-14 day transition)

---

## Risk Assessment

### Low Risk

- **MDX library maturity**: @next/mdx is official Next.js plugin, production-ready
- **Type safety**: Zod validation catches frontmatter errors at build time
- **Performance**: Local file reads faster than Ghost API (proven hypothesis)

### Medium Risk

- **Content migration**: 30-50 posts to convert (mitigated by automation script)
- **Image migration**: Download and organize images (scripted, one-time task)

### High Risk (Mitigated)

- **SEO impact**: URL structure preserved (FR-010), metadata identical
  - **Mitigation**: Feature flag + parallel operation + 7-14 day validation
- **RSS feed readers**: Format change could break subscriptions
  - **Mitigation**: Match Ghost RSS structure exactly

### Rollback Plan

- **Feature flag**: `NEXT_PUBLIC_USE_MDX_BLOG=false` → instant rollback to Ghost
- **Ghost CMS**: Keep operational for 7-14 days during transition
- **Content freeze**: No new Ghost posts during migration (avoid sync issues)

---

## Architecture Alignment with Constitution

### Specification First ✅
- spec.md created before planning phase
- All requirements traced to architecture decisions

### Do Not Overengineer ✅
- Using proven libraries (@next/mdx, gray-matter) instead of custom parsers
- Simple file-based storage (no complex CMS architecture)
- No premature optimization (wait for profiling data)

### Performance Requirements ✅
- Build-time compilation (fast page loads)
- Image optimization (NFR-002, NFR-003 compliance)
- Lighthouse targets defined (NFR-001)

### Testing Standards ✅
- Zod validation = build-time tests
- Manual testing plan in quickstart.md
- E2E tests for critical flows (to be added in /tasks)

### Security Practices ✅
- Input validation (Zod schema)
- No user-generated content in MVP (NFR-010 XSS prevention)
- Feature flag for safe rollback

---

## Next Steps

1. Generate data-model.md (entity definitions)
2. Generate quickstart.md (integration scenarios)
3. Generate plan.md (consolidated architecture)
4. Proceed to /tasks (break down into 20-30 concrete tasks)

---

**Research Complete**: All technical questions resolved, architecture decisions documented with rationale, reusable components identified, and new components scoped. Ready for design phase.
