# Tasks: Tech Stack CMS Integration (MDX)

**Feature**: 002-tech-stack-cms-integ
**Generated**: 2025-10-21
**Total Tasks**: 29 tasks
**MVP Tasks**: 18 tasks (US1-US3)
**Enhancement Tasks**: 7 tasks (US4-US5)
**Polish Tasks**: 4 tasks (Cross-cutting concerns)

---

## [CODEBASE REUSE ANALYSIS]

**Scanned**: D:\coding\tech-stack-foundation-core (app/, lib/, configs)

### [EXISTING - REUSE]

- ✅ **app/layout.tsx** - Root layout with metadata (no changes needed)
- ✅ **app/page.tsx** - Homepage structure (update to fetch from MDX)
- ✅ **next.config.ts** - Next.js configuration (add MDX plugin)
- ✅ **tailwind.config.ts** - Tailwind CSS (reuse for blog styling)
- ✅ **lib/prisma.ts** - Database ORM pattern (available for future features)

### [NEW - CREATE]

- 🆕 **content/posts/** - MDX blog post files directory
- 🆕 **lib/mdx.ts** - MDX parsing and metadata extraction
- 🆕 **lib/mdx-types.ts** - TypeScript types and Zod schemas
- 🆕 **scripts/migrate-ghost-to-mdx.ts** - Ghost to MDX migration script
- 🆕 **app/blog/page.tsx** - Blog index page
- 🆕 **app/blog/[slug]/page.tsx** - Individual blog post page
- 🆕 **app/blog/tag/[tag]/page.tsx** - Tag archive pages
- 🆕 **components/mdx/** - Custom MDX components (Callout, CodeBlock, etc.)
- 🆕 **lib/generate-rss.ts** - RSS feed generator
- 🆕 **lib/generate-sitemap.ts** - Sitemap generator
- 🆕 **lib/search-posts.ts** - Client-side search functionality
- 🆕 **middleware.ts** - Feature flag routing (temporary during transition)

---

## [DEPENDENCY GRAPH]

**Story completion order**:
1. Phase 1: Setup (install dependencies, config)
2. Phase 2: Foundational (core MDX infrastructure - blocks all stories)
3. Phase 3: US1 [P1] - MDX file rendering (independent)
4. Phase 4: US2 [P1] - Markdown syntax support (depends on US1)
5. Phase 5: US3 [P1] - URL preservation (depends on US1, US2)
6. Phase 6: US4 [P2] - React components in MDX (depends on US1, US2)
7. Phase 7: US5 [P2] - Tag filtering (depends on US1)
8. Phase 8: Polish & Cross-Cutting Concerns (after MVP validated)

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 1**: T001, T002, T003 (all independent - different files)
- **Phase 2**: T005, T006, T007 (all independent - different files)
- **US1**: T010, T011, T012 (test files - independent)
- **US2**: T020, T021, T022 (different components - independent)
- **US4**: T030, T031, T032 (different MDX components - independent)
- **US5**: T040, T041, T042 (different pages/features - independent)
- **Polish**: T050, T051, T052, T053 (all independent utilities)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phases 1-5 (US1-US3) - Approx 19-24 hours
- Core MDX rendering with backward-compatible URLs
- Ghost CMS parallel operation during transition
- Feature flag for safe rollback

**Incremental Delivery**:
1. MVP (US1-US3) → staging validation → production (7-14 day monitoring)
2. Enhancement (US4-US5) → staging validation → production
3. Nice-to-have (US6-US7) → staged rollout

**Testing Approach**:
- Build-time validation: Zod schema (NFR-009)
- Manual testing: Local dev server + staging environment
- E2E tests: Optional (not specified in spec.md)

---

## Phase 1: Setup

- [ ] T001 [P] Install MDX dependencies from research.md
  - Files: package.json
  - Dependencies: @next/mdx@^15.0.0, @mdx-js/loader@^3.0.0, @mdx-js/react@^3.0.0, gray-matter@^4.0.3, rehype-highlight@^7.0.0, remark-gfm@^4.0.0, zod@^3.22.0, feed@^4.2.2
  - Command: `npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter rehype-highlight remark-gfm zod feed`
  - From: research.md [Dependencies Analysis] lines 398-411

- [ ] T002 [P] Install migration script dependencies
  - Files: package.json (devDependencies)
  - Dependencies: turndown@^7.1.2, @tryghost/admin-api@^1.13.0
  - Command: `npm install --save-dev turndown @tryghost/admin-api`
  - From: research.md [Dependencies Analysis] lines 414-419

- [ ] T003 [P] Configure MDX support in Next.js config
  - File: next.config.ts
  - Add: `@next/mdx` plugin with options for rehype-highlight, remark-gfm
  - REUSE: Existing next.config.ts structure (lines 1-15)
  - Pattern: https://nextjs.org/docs/app/building-your-application/configuring/mdx
  - From: research.md [Decision 1] lines 18-36

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Core MDX infrastructure that blocks all user stories

- [ ] T005 [P] Create content directory structure
  - Files: content/posts/, public/images/posts/
  - Commands: `mkdir -p content/posts public/images/posts`
  - From: research.md [Decision 2] lines 40-59, data-model.md [File System Structure] lines 192-211

- [ ] T006 [P] Create TypeScript types and Zod schemas for MDX frontmatter
  - File: lib/mdx-types.ts
  - Exports: `PostFrontmatterSchema`, `PostFrontmatter`, `PostData`, `TagData`
  - Validation: Required fields (title, slug, date, excerpt, author, tags), optional fields (featuredImage, publishedAt, draft)
  - From: data-model.md [PostMetadata] lines 94-127, spec.md FR-002 line 133

- [ ] T007 [P] Create core MDX parsing library
  - File: lib/mdx.ts
  - Functions: `getAllPosts()`, `getPostBySlug()`, `getPostsByTag()`, `getAllTags()`
  - Dependencies: gray-matter for frontmatter, fs/promises for file reading, Zod for validation
  - Error handling: Build failure if invalid frontmatter or MDX syntax
  - REUSE: None (new utility, but follow lib/prisma.ts export pattern)
  - From: research.md [Decision 1] lines 18-36, data-model.md [API Schemas] lines 260-292

---

## Phase 3: User Story 1 [P1] - Developer can create blog posts using MDX files

**Story Goal**: MDX files in `content/posts/` render as blog posts at `/blog/[slug]`

**Independent Test Criteria**:
- [ ] Create `content/posts/test-post.mdx` with valid frontmatter → Build succeeds
- [ ] Navigate to `/blog/test-post` → Post renders with title, date, content
- [ ] Create MDX file with missing frontmatter field → Build fails with clear error message
- [ ] Create MDX file with invalid frontmatter (bad date format) → Build fails with Zod validation error

### Implementation

- [ ] T010 [US1] Create blog post page component
  - File: app/blog/[slug]/page.tsx
  - Features: Fetch post via `getPostBySlug()`, render MDX content, display metadata
  - generateStaticParams: Pre-render all posts at build time
  - generateMetadata: SEO meta tags from frontmatter (title, description, OG image)
  - Error handling: 404 page if post not found
  - REUSE: app/layout.tsx metadata pattern
  - From: spec.md FR-003 line 134, research.md [New Components Needed] lines 323-327

- [ ] T011 [US1] Create MDX components provider
  - File: components/mdx/mdx-components.tsx
  - Purpose: Wrap MDX content with custom component mappings
  - Components: h1-h6 (styled headings), a (links), img (Next.js Image), code (syntax highlighting)
  - Pattern: Next.js MDX documentation structure
  - From: spec.md FR-008 line 143

- [ ] T012 [US1] Add frontmatter validation error handling in lib/mdx.ts
  - File: lib/mdx.ts (enhance from T007)
  - Error messages: "[filename]: title is required", "[filename]: invalid date format"
  - Build failure: Throw error that stops Next.js build
  - From: spec.md NFR-009 line 168, data-model.md [Validation & Error Handling] lines 442-456

---

## Phase 4: User Story 2 [P1] - Content creator can use standard Markdown syntax

**Story Goal**: Standard Markdown renders correctly with syntax highlighting

**Independent Test Criteria**:
- [ ] Create post with headings (H1-H6) → All headings render with correct styling
- [ ] Create post with code block (\`\`\`typescript\`) → Syntax highlighting applied
- [ ] Create post with image (![alt](/images/posts/slug/image.jpg)) → Next.js Image component used
- [ ] Create post with lists, links, blockquotes → All Markdown features render correctly

### Implementation

- [ ] T020 [P] [US2] Configure rehype-highlight for syntax highlighting
  - File: next.config.ts (enhance from T003)
  - Plugin: rehype-highlight with language detection
  - Theme: Choose highlight.js theme (e.g., github-dark) or custom CSS
  - From: spec.md FR-006 line 141, research.md [Decision 5] lines 120-139

- [ ] T021 [P] [US2] Configure remark-gfm for GitHub Flavored Markdown
  - File: next.config.ts (enhance from T003)
  - Plugin: remark-gfm for tables, task lists, strikethrough
  - From: research.md [Dependencies Analysis] line 408

- [ ] T022 [P] [US2] Create image optimization handler for MDX
  - File: components/mdx/mdx-image.tsx
  - Purpose: Transform Markdown image syntax to Next.js Image component
  - Props: src (resolve relative paths), alt, width/height (auto-detect or default)
  - REUSE: Next.js Image component
  - From: spec.md FR-007 line 142, research.md [Decision 6] lines 142-170

---

## Phase 5: User Story 3 [P1] - Existing URLs preserved for SEO

**Story Goal**: `/blog/[slug]` URLs identical to Ghost CMS structure

**Independent Test Criteria**:
- [ ] Create MDX post with slug "intro-to-mdx" → URL is `/blog/intro-to-mdx`
- [ ] Compare 5 existing Ghost URLs with MDX equivalents → Identical URL structure
- [ ] Check meta tags (title, description, OG image) → Match Ghost CMS format
- [ ] Verify RSS feed format → Compatible with Ghost RSS structure

### Implementation

- [ ] T025 [US3] Create blog index page
  - File: app/blog/page.tsx
  - Features: List all posts sorted by date descending, display excerpt and metadata
  - Data fetching: `getAllPosts()` at build time (static generation)
  - Styling: Reuse Tailwind CSS utilities
  - REUSE: app/page.tsx layout structure
  - From: spec.md FR-013 line 153, research.md [New Components Needed] lines 317-322

- [ ] T026 [US3] Generate RSS feed from MDX metadata
  - File: lib/generate-rss.ts
  - Output: public/rss.xml (static file at build time)
  - Format: RSS 2.0 with title, link, description, pubDate, author, category (tags)
  - Mapping: Ghost RSS structure → MDX frontmatter (identical fields)
  - Dependencies: feed@^4.2.2
  - From: spec.md FR-011 line 149, research.md [Decision 8] lines 218-242, data-model.md [RSS Feed Schema] lines 294-330

- [ ] T027 [US3] Generate sitemap including all blog posts
  - File: lib/generate-sitemap.ts
  - Output: public/sitemap.xml (static file at build time)
  - Include: All published posts with lastmod date from frontmatter
  - Pattern: Next.js sitemap generation
  - From: spec.md FR-012 line 150, research.md [New Components Needed] lines 345-349

- [ ] T028 [US3] Add metadata generation for SEO
  - File: app/blog/[slug]/page.tsx (enhance from T010)
  - generateMetadata: title, description, openGraph (image, type), twitter card
  - Source: frontmatter fields (title, excerpt, featuredImage)
  - REUSE: app/layout.tsx metadata structure
  - From: spec.md FR-009 line 147, spec.md Deployment Considerations line 233

---

## Phase 6: User Story 4 [P2] - Embed React components in MDX

**Story Goal**: Import and use custom React components within MDX content

**Depends on**: US1 (MDX rendering), US2 (Markdown support)

**Independent Test Criteria**:
- [ ] Create `<Callout type="info">Text</Callout>` in MDX → Component renders with styling
- [ ] Pass props to component → Props work as expected (type="warning" changes color)
- [ ] Test component interactivity (button click) → State updates correctly

### Implementation

- [ ] T030 [P] [US4] Create Callout MDX component
  - File: components/mdx/callout.tsx
  - Props: type ("info" | "warning" | "error" | "success"), children
  - Styling: Tailwind CSS with color variants
  - From: spec.md FR-008 line 143, research.md [New Components Needed] lines 333-337

- [ ] T031 [P] [US4] Create CodeBlock MDX component
  - File: components/mdx/code-block.tsx
  - Props: language, children (code string), filename (optional)
  - Features: Copy button, line numbers, syntax highlighting
  - From: spec.md FR-008 line 143

- [ ] T032 [P] [US4] Create interactive demo MDX component (example)
  - File: components/mdx/demo.tsx
  - Props: initialValue, description
  - Features: Editable code playground (optional, depends on complexity)
  - Purpose: Demonstrate component interactivity requirement
  - From: spec.md US4 line 69

---

## Phase 7: User Story 5 [P2] - Filter blog posts by tags

**Story Goal**: Readers can filter posts by clicking tags

**Depends on**: US1 (MDX rendering)

**Independent Test Criteria**:
- [ ] Navigate to `/blog` → See all available tags displayed
- [ ] Click "aviation" tag → URL changes to `/blog/tag/aviation`
- [ ] Tag archive page → Shows only posts with "aviation" tag
- [ ] Tag with no posts → Shows "No posts found" message

### Implementation

- [ ] T040 [P] [US5] Create tag archive page
  - File: app/blog/tag/[tag]/page.tsx
  - Features: Fetch posts via `getPostsByTag()`, display tag name and post count
  - generateStaticParams: Pre-render all tag pages at build time
  - Error handling: 404 if tag has no posts
  - From: spec.md FR-014 line 154, research.md [New Components Needed] lines 328-332

- [ ] T041 [P] [US5] Add tag list to blog index page
  - File: app/blog/page.tsx (enhance from T025)
  - Feature: Display all tags with post counts, clickable links to tag archives
  - Data: `getAllTags()` function from lib/mdx.ts
  - Styling: Tag cloud or list with hover states
  - From: spec.md US5 line 76

- [ ] T042 [P] [US5] Create search functionality for blog index
  - File: lib/search-posts.ts
  - Function: `searchPosts(query: string, posts: PostData[]): PostData[]`
  - Search fields: title, excerpt, tags (case-insensitive)
  - Client-side: Simple string matching (no external service)
  - From: spec.md FR-015 line 155, research.md [New Components Needed] lines 351-355

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Production readiness, deployment preparation, migration tooling

### Migration & Deployment

- [ ] T050 [P] Create Ghost to MDX migration script
  - File: scripts/migrate-ghost-to-mdx.ts
  - Process: Fetch Ghost posts via Admin API → Convert HTML to Markdown (turndown.js) → Generate YAML frontmatter → Save to content/posts/[slug].mdx
  - Image handling: Download featured images to public/images/posts/[slug]/
  - Validation: Run Zod schema on all generated files
  - Dry-run mode: Preview migration without writing files
  - Dependencies: @tryghost/admin-api, turndown, gray-matter
  - From: spec.md Migration Requirements lines 237-252, research.md [Decision 7] lines 175-215

- [ ] T051 [P] Add feature flag routing middleware
  - File: middleware.ts
  - Flag: NEXT_PUBLIC_USE_MDX_BLOG=true|false
  - Logic: Route to MDX pages if true, Ghost pages if false (or vice versa)
  - Temporary: Remove after 7-14 day transition period
  - From: spec.md Deployment Rollback line 268, research.md [Decision 7] lines 184-186

- [ ] T052 [P] Create sample MDX posts for testing
  - Files: content/posts/sample-post-1.mdx, content/posts/sample-post-2.mdx
  - Purpose: Test posts with different features (images, code blocks, React components, tags)
  - Validation: Ensure all Markdown features work correctly
  - From: Foundational phase setup

- [ ] T053 [P] Update homepage to fetch latest posts from MDX
  - File: app/page.tsx
  - Change: Replace Ghost API calls with `getAllPosts()` from lib/mdx.ts
  - Display: Latest 3-5 posts with title, excerpt, date
  - REUSE: Existing homepage layout
  - From: research.md [Components to Reuse] lines 265-269

---

## [OPTIONAL: Future Enhancements - Not in MVP]

**User Story 6 [P3]: Table of Contents** (M - 4-6 hours)
- Extract H2/H3 headings from MDX
- Generate ToC with smooth scroll
- Highlight active section on scroll

**User Story 7 [P3]: Scheduled Posts** (S - 3-4 hours)
- Filter posts by `publishedAt` date
- Hide future posts from blog index
- ISR revalidation for automatic publishing

---

## Git Workflow

After completing MVP tasks (T001-T028):

```bash
git add .
git commit -m "feat: migrate blog from Ghost CMS to MDX-based content management

Implemented 3 MVP user stories:
- US1: MDX file rendering with frontmatter validation
- US2: Standard Markdown syntax with syntax highlighting
- US3: URL preservation for SEO continuity

New infrastructure:
- lib/mdx.ts: Core MDX parsing with Zod validation
- app/blog/: Blog routes (index, post, tag archive)
- content/posts/: File-based content directory
- RSS/sitemap generation utilities

Breaking changes: None (Ghost CMS kept operational during transition)
Migration: scripts/migrate-ghost-to-mdx.ts for automated content export

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Summary

- **Total tasks**: 29 tasks
- **MVP tasks**: 18 (Phases 1-5, covering US1-US3)
- **Enhancement tasks**: 7 (Phases 6-7, covering US4-US5)
- **Polish tasks**: 4 (Phase 8, migration and deployment)
- **Parallel opportunities**: 15 tasks marked [P]
- **REUSE opportunities**: 5 existing components identified
- **Estimated MVP effort**: 19-24 hours (per spec.md user story estimates)

**Dependency chain**:
1. Setup (T001-T003) - No dependencies
2. Foundational (T005-T007) - Depends on Setup
3. US1 (T010-T012) - Depends on Foundational
4. US2 (T020-T022) - Depends on US1
5. US3 (T025-T028) - Depends on US1, US2
6. US4 (T030-T032) - Depends on US1, US2
7. US5 (T040-T042) - Depends on US1
8. Polish (T050-T053) - Depends on MVP completion

**Next phase**: `/analyze` - Cross-artifact validation, anti-duplication checks, risk assessment
