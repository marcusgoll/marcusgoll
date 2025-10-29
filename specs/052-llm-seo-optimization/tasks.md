# Tasks: LLM SEO Optimization

## [CODEBASE REUSE ANALYSIS]
Scanned: D:\Coding\marcusgoll

[EXISTING - REUSE]
- ✅ lib/schema.ts: BlogPosting and BreadcrumbList schema generation
- ✅ lib/mdx.ts: MDX processing pipeline with gray-matter and reading time
- ✅ lib/mdx-types.ts: TypeScript types and Zod schemas for frontmatter validation
- ✅ app/blog/[slug]/page.tsx: Blog post layout with semantic HTML
- ✅ components/mdx/mdx-components.tsx: Custom MDX components
- ✅ public/robots.txt: AI crawler rules (needs strategy reversal)
- ✅ app/sitemap.ts: Framework-native sitemap generation (no changes needed)

[NEW - CREATE]
- 🆕 lib/remark-validate-headings.ts: Build-time heading hierarchy validator
- 🆕 components/blog/tldr-section.tsx: TL;DR summary component
- 🆕 lib/schema.ts extensions: generateFAQPageSchema() and generateHowToSchema()
- 🆕 PostFrontmatter type extension: contentType field
- 🆕 FAQ and HowTo schema TypeScript interfaces

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 2: Foundational (infrastructure setup)
2. Phase 3: US1 [P1] - AI crawler access (independent)
3. Phase 4: US2 [P1] - Semantic HTML (independent)
4. Phase 5: US3 [P1] - Article schema (depends on Phase 2 type updates)
5. Phase 6: US4 [P1] - Heading hierarchy (depends on Phase 2 remark plugin)
6. Phase 7: US5 [P1] - TL;DR summaries (depends on Phase 2 component)
7. Phase 8: US6 [P2] - FAQ schema (depends on US3 schema infrastructure)
8. Phase 9: US7 [P2] - HowTo schema (depends on US3 schema infrastructure)
9. Phase 10: US8 [P2] - Citation-friendly formatting (depends on US2 semantic HTML)
10. Phase 11: US9 [P3] - Canonical URLs (depends on US3 schema infrastructure)
11. Phase 12: US10 [P3] - Automated validation (depends on all MVP features)

## [PARALLEL EXECUTION OPPORTUNITIES]
- Foundational: T001, T002, T003, T004, T005 (different files, no dependencies)
- US1: T006 (single task, robots.txt update)
- US2: T007 (single task, verify existing HTML)
- US3: T008, T009, T010 (schema verification and extension can be parallel)
- US4: T011, T012 (plugin creation and integration can be parallel after types done)
- US5: T013, T014 (component creation and integration can be parallel)
- US6: T015, T016, T017 (FAQ schema type, generator, integration)
- US7: T018, T019, T020 (HowTo schema type, generator, integration)
- US8: T021, T022, T023, T024 (different MDX components, can be parallel)
- US9: T025 (single task, canonical URL)
- US10: T026, T027, T028, T029 (different validation tools, can be parallel)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phase 3-7 (US1-US5 only) - Core LLM optimization
**Incremental delivery**: US1-US5 → staging validation → US6-US7 → US8-US10
**Testing approach**: Build-time validation + manual AI testing (quarterly)

---

## Phase 1: Setup

- [ ] T001 Verify existing project structure matches plan.md tech stack
  - Files: lib/, app/, components/, public/, content/posts/
  - Verify: Next.js 15.5.6, TypeScript 5.9.3, Tailwind CSS 4.1.15, MDX 3.1.1
  - Pattern: Existing project structure
  - From: plan.md [ARCHITECTURE DECISIONS]

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Infrastructure that blocks all user stories

- [ ] T002 [P] Create TypeScript interfaces for FAQ schema in lib/schema.ts
  - Interface: FAQPageSchema with @context, @type, mainEntity array
  - Interface: QuestionSchema with @type, name, acceptedAnswer
  - Interface: AnswerSchema with @type, text
  - REUSE: BlogPostingSchema pattern (lib/schema.ts:12-35)
  - Pattern: lib/schema.ts existing schema interfaces
  - From: data-model.md FAQPage Schema section

- [ ] T003 [P] Create TypeScript interfaces for HowTo schema in lib/schema.ts
  - Interface: HowToSchema with @context, @type, name, description, step array
  - Interface: HowToStepSchema with @type, name, text, itemListElement
  - REUSE: BlogPostingSchema pattern (lib/schema.ts:12-35)
  - Pattern: lib/schema.ts existing schema interfaces
  - From: data-model.md HowTo Schema section

- [ ] T004 [P] Extend PostFrontmatter type with contentType field in lib/mdx-types.ts
  - Add field: contentType?: 'standard' | 'faq' | 'tutorial'
  - Add field: faq?: Array<{question: string, answer: string}>
  - Update: PostFrontmatterSchema Zod schema with optional contentType and faq fields
  - REUSE: PostFrontmatterSchema pattern (lib/mdx-types.ts:15-28)
  - Pattern: lib/mdx-types.ts existing frontmatter schema
  - From: data-model.md MDX Frontmatter Extension

- [ ] T005 [P] Create TLDRSection component in components/blog/tldr-section.tsx
  - Component: TLDRSection with excerpt prop
  - Semantic HTML: <section className="tldr" role="note" aria-label="TL;DR Summary">
  - Styling: Tailwind classes for callout-style box (border, background, padding)
  - Accessibility: ARIA label, clear visual distinction from main content
  - REUSE: Callout component pattern (components/mdx/callout.tsx)
  - Pattern: components/mdx/callout.tsx styling approach
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] TLDRSection component

---

## Phase 3: User Story 1 [P1] - AI crawler access

**Story Goal**: Allow AI crawlers to access blog content for citations

**Independent Test Criteria**:
- [ ] curl https://marcusgoll.com/robots.txt shows AI crawler Allow rules
- [ ] ChatGPT-User, PerplexityBot allowed (Allow: /)
- [ ] Sitemap reference present (Sitemap: https://marcusgoll.com/sitemap.xml)

### Implementation

- [ ] T006 [US1] Update robots.txt to allow search-focused AI bots in public/robots.txt
  - Update: ChatGPT-User remains Allow: / (already correct)
  - Update: PerplexityBot from Disallow: / → Allow: /
  - Add: Claude-Web User-agent with Allow: / (if desired for search)
  - Keep: GPTBot Disallow: / (training bot, not search)
  - Keep: Google-Extended Disallow: / (training bot)
  - Keep: ClaudeBot Disallow: / (training bot)
  - REUSE: Existing robots.txt structure (public/robots.txt)
  - Pattern: public/robots.txt existing User-agent blocks
  - From: spec.md US1 acceptance criteria

---

## Phase 4: User Story 2 [P1] - Semantic HTML

**Story Goal**: Ensure blog posts use semantic HTML5 structure

**Independent Test Criteria**:
- [ ] W3C HTML Validator shows zero semantic errors on 3 sample posts
- [ ] All posts wrapped in <article> element
- [ ] Post metadata in <header> with <h1>, <time datetime="">

### Implementation

- [ ] T007 [US2] Verify existing semantic HTML structure in app/blog/[slug]/page.tsx
  - Verify: <article> wrapper present
  - Verify: <header> with <h1> and <time datetime=""> present
  - Verify: Main content uses <section> for logical groupings
  - Verify: Related content in <aside> element (if exists)
  - Test: W3C HTML Validator on 3 sample posts (systematic-thinking-for-developers, from-cockpit-to-code, flight-training-fundamentals)
  - REUSE: Existing semantic HTML structure (app/blog/[slug]/page.tsx)
  - Pattern: app/blog/[slug]/page.tsx existing layout
  - From: spec.md US2 acceptance criteria

---

## Phase 5: User Story 3 [P1] - Article schema

**Story Goal**: Generate BlogPosting schema for all blog posts

**Independent Test Criteria**:
- [ ] Google Rich Results Test shows valid Article schema on sample post
- [ ] Schema includes: headline, author, datePublished, description
- [ ] Schema auto-generated from MDX frontmatter

### Implementation

- [ ] T008 [P] [US3] Verify existing BlogPosting schema generation in lib/schema.ts
  - Verify: generateBlogPostingSchema() function exists
  - Verify: Schema includes headline, author (Person), datePublished, dateModified, description, articleBody, wordCount
  - Verify: Function signature matches: (post: PostData) => BlogPostingSchema
  - Test: Google Rich Results Test on sample post URL
  - REUSE: lib/schema.ts existing BlogPosting generation
  - Pattern: lib/schema.ts:52-89 (estimated, existing function)
  - From: spec.md US3 acceptance criteria

- [ ] T009 [P] [US3] Add mainEntityOfPage field to BlogPosting schema in lib/schema.ts
  - Add field: mainEntityOfPage with @type WebPage and @id (canonical URL)
  - Value: ${NEXT_PUBLIC_SITE_URL}/blog/${post.frontmatter.slug}
  - REUSE: Existing BlogPosting schema structure
  - Pattern: lib/schema.ts existing schema generation
  - From: spec.md FR-008 (canonical URL requirement)

- [ ] T010 [US3] Verify schema injection in blog post page in app/blog/[slug]/page.tsx
  - Verify: JSON-LD script tag in page <head> (via Next.js metadata API or script tag)
  - Verify: generateBlogPostingSchema() called with post data
  - Verify: Schema rendered as JSON string with type="application/ld+json"
  - Test: View page source, confirm <script type="application/ld+json"> present
  - REUSE: Existing schema injection pattern
  - Pattern: app/blog/[slug]/page.tsx existing metadata generation
  - From: spec.md US3 acceptance criteria

---

## Phase 6: User Story 4 [P1] - Heading hierarchy

**Story Goal**: Validate heading hierarchy at build time

**Independent Test Criteria**:
- [ ] Build fails if heading hierarchy violated (e.g., H1 → H3 skip)
- [ ] Lighthouse SEO audit shows no heading hierarchy warnings
- [ ] Single H1 per page enforced

### Implementation

- [ ] T011 [US4] Create remark heading validation plugin in lib/remark-validate-headings.ts
  - Plugin: remarkValidateHeadings (remark plugin interface)
  - Validation: Single H1 per document
  - Validation: Logical H2 → H3 → H4 progression (no skipped levels)
  - Error: Throw build error with clear message (file path, heading levels)
  - Algorithm: Track previous heading level, check for skips
  - REUSE: Remark plugin patterns (visit AST nodes of type 'heading')
  - Pattern: Next.js remark plugin examples (remark-gfm integration)
  - From: spec.md US4 acceptance criteria, plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T012 [US4] Add heading validation plugin to MDX pipeline in lib/mdx.ts
  - Import: remarkValidateHeadings from './remark-validate-headings'
  - Add: To remarkPlugins array in MDX processing options
  - Order: After remark-gfm, before rehype plugins
  - Test: Create test MDX with invalid hierarchy (H1 → H3), verify build fails
  - REUSE: Existing remarkPlugins array pattern
  - Pattern: lib/mdx.ts existing remark plugin integration
  - From: spec.md US4 acceptance criteria

---

## Phase 7: User Story 5 [P1] - TL;DR summaries

**Story Goal**: Add TL;DR summaries to all blog posts

**Independent Test Criteria**:
- [ ] TL;DR section appears immediately after H1 on all posts
- [ ] TL;DR content is 2-4 sentences (from excerpt)
- [ ] TL;DR uses semantic <section class="tldr"> element

### Implementation

- [ ] T013 [US5] Add TLDRSection component to blog layout in app/blog/[slug]/page.tsx
  - Import: TLDRSection from '@/components/blog/tldr-section'
  - Placement: After <header> element, before main content
  - Props: excerpt={post.frontmatter.excerpt}
  - Conditional: Only render if excerpt exists (all posts have this per Zod schema)
  - REUSE: TLDRSection component (T005)
  - Pattern: app/blog/[slug]/page.tsx existing component composition
  - From: spec.md US5 acceptance criteria

- [ ] T014 [US5] Test TL;DR rendering on 3 sample posts
  - Test posts: systematic-thinking-for-developers, from-cockpit-to-code, flight-training-fundamentals
  - Verify: TL;DR section visible after H1
  - Verify: Content matches frontmatter excerpt
  - Verify: Semantic HTML <section class="tldr"> present
  - Verify: Visual styling matches callout pattern (border, background)
  - Pattern: Manual browser testing
  - From: spec.md US5 acceptance criteria

---

## Phase 8: User Story 6 [P2] - FAQ schema

**Story Goal**: Add FAQPage schema for FAQ-style posts

**Independent Test Criteria**:
- [ ] Google Rich Results Test shows valid FAQPage schema on FAQ posts
- [ ] Schema includes Question/Answer pairs from frontmatter
- [ ] FAQ schema only renders when contentType === 'faq'

### Implementation

- [ ] T015 [P] [US6] Create generateFAQPageSchema function in lib/schema.ts
  - Function: generateFAQPageSchema(post: PostData): FAQPageSchema | null
  - Logic: Return null if post.frontmatter.contentType !== 'faq'
  - Logic: Return null if !post.frontmatter.faq or faq.length < 2
  - Schema: FAQPage with mainEntity array from frontmatter.faq
  - Schema: Each Question with name (question) and acceptedAnswer (Answer with text)
  - REUSE: BlogPosting schema generation pattern (lib/schema.ts)
  - Pattern: lib/schema.ts existing schema generator functions
  - From: spec.md US6 acceptance criteria, data-model.md FAQPage Schema

- [ ] T016 [P] [US6] Export generateFAQPageSchema from lib/schema.ts
  - Export: Add to module exports
  - TypeScript: Ensure FAQPageSchema interface exported
  - REUSE: Existing export pattern
  - Pattern: lib/schema.ts existing exports
  - From: spec.md US6 implementation requirements

- [ ] T017 [US6] Add conditional FAQ schema injection in app/blog/[slug]/page.tsx
  - Import: generateFAQPageSchema from '@/lib/schema'
  - Logic: Call generateFAQPageSchema(post) if contentType === 'faq'
  - Render: Additional <script type="application/ld+json"> with FAQ schema if non-null
  - Test: Create test post with contentType: 'faq' and faq array, verify schema renders
  - REUSE: Existing BlogPosting schema injection pattern
  - Pattern: app/blog/[slug]/page.tsx existing schema rendering
  - From: spec.md US6 acceptance criteria

---

## Phase 9: User Story 7 [P2] - HowTo schema

**Story Goal**: Add HowTo schema for tutorial posts

**Independent Test Criteria**:
- [ ] Google Rich Results Test shows valid HowTo schema on tutorial posts
- [ ] Schema includes step array with name and text
- [ ] HowTo schema only renders when contentType === 'tutorial'

### Implementation

- [ ] T018 [P] [US7] Create generateHowToSchema function in lib/schema.ts
  - Function: generateHowToSchema(post: PostData): HowToSchema | null
  - Logic: Return null if post.frontmatter.contentType !== 'tutorial'
  - Schema: HowTo with name (title), description (excerpt), step array
  - Step extraction: Parse H2 headings from content as steps (name from heading text, text from section content)
  - Alternative: Require explicit `steps` field in frontmatter (simpler, more reliable)
  - REUSE: BlogPosting schema generation pattern (lib/schema.ts)
  - Pattern: lib/schema.ts existing schema generator functions
  - From: spec.md US7 acceptance criteria, data-model.md HowTo Schema

- [ ] T019 [P] [US7] Export generateHowToSchema from lib/schema.ts
  - Export: Add to module exports
  - TypeScript: Ensure HowToSchema interface exported
  - REUSE: Existing export pattern
  - Pattern: lib/schema.ts existing exports
  - From: spec.md US7 implementation requirements

- [ ] T020 [US7] Add conditional HowTo schema injection in app/blog/[slug]/page.tsx
  - Import: generateHowToSchema from '@/lib/schema'
  - Logic: Call generateHowToSchema(post) if contentType === 'tutorial'
  - Render: Additional <script type="application/ld+json"> with HowTo schema if non-null
  - Test: Create test post with contentType: 'tutorial', verify schema renders
  - REUSE: Existing BlogPosting schema injection pattern
  - Pattern: app/blog/[slug]/page.tsx existing schema rendering
  - From: spec.md US7 acceptance criteria

---

## Phase 10: User Story 8 [P2] - Citation-friendly formatting

**Story Goal**: Enhance semantic HTML for better AI content extraction

**Independent Test Criteria**:
- [ ] Blockquotes use <blockquote cite=""> when source URL available
- [ ] Code blocks use <pre><code class="language-X"> with language tags
- [ ] Data tables use semantic <table> with <thead>, <tbody>, <caption>

### Implementation

- [ ] T021 [P] [US8] Add cite attribute support to blockquote in components/mdx/mdx-components.tsx
  - Component: Custom blockquote component
  - Props: Add optional cite prop (URL string)
  - Render: <blockquote cite={cite}> if cite provided
  - Fallback: Standard <blockquote> if no cite
  - REUSE: Existing MDX component customization pattern
  - Pattern: components/mdx/mdx-components.tsx existing component overrides
  - From: spec.md US8 acceptance criteria

- [ ] T022 [P] [US8] Verify code block language support in components/mdx/code-block.tsx
  - Verify: <code className={`language-${language}`}> pattern present
  - Verify: Language prop extracted from MDX code fence (```typescript, ```python, etc.)
  - Verify: Syntax highlighting library (if used) preserves language class
  - REUSE: Existing code-block component
  - Pattern: components/mdx/code-block.tsx existing implementation
  - From: spec.md US8 acceptance criteria

- [ ] T023 [P] [US8] Add semantic table component in components/mdx/mdx-components.tsx
  - Component: Custom table component
  - Structure: <table> with <thead>, <tbody> wrappers
  - Props: Add optional caption prop
  - Render: <caption> if provided, improves accessibility and AI parsing
  - Styling: Tailwind classes for responsive table design
  - REUSE: Existing MDX component customization pattern
  - Pattern: components/mdx/mdx-components.tsx existing component overrides
  - From: spec.md US8 acceptance criteria

- [ ] T024 [P] [US8] Add definition list support in components/mdx/mdx-components.tsx
  - Component: Custom dl, dt, dd components
  - Semantic: <dl> for term definitions, <dt> for term, <dd> for definition
  - Use case: Terminology sections in aviation/dev posts
  - Styling: Tailwind classes for clear visual hierarchy
  - REUSE: Existing MDX component customization pattern
  - Pattern: components/mdx/mdx-components.tsx existing component overrides
  - From: spec.md US8 acceptance criteria

---

## Phase 11: User Story 9 [P3] - Canonical URLs

**Story Goal**: Enforce canonical URLs to prevent duplicate content

**Independent Test Criteria**:
- [ ] All post pages include <link rel="canonical" href=""> in <head>
- [ ] Canonical URL matches mainEntityOfPage in BlogPosting schema
- [ ] Canonical URLs use production domain (no localhost, staging)

### Implementation

- [ ] T025 [US9] Add canonical URL to blog post metadata in app/blog/[slug]/page.tsx
  - Metadata: Add alternates.canonical to Next.js metadata object
  - Value: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`
  - Verification: Ensure NEXT_PUBLIC_SITE_URL is set (production domain)
  - Schema sync: Verify matches mainEntityOfPage in BlogPosting schema (T009)
  - REUSE: Next.js metadata API pattern
  - Pattern: app/blog/[slug]/page.tsx existing metadata generation
  - From: spec.md US9 acceptance criteria

---

## Phase 12: User Story 10 [P3] - Automated validation

**Story Goal**: Add build-time validation for LLM optimization

**Independent Test Criteria**:
- [ ] Build fails if robots.txt missing or invalid
- [ ] Build fails if schema.org markup invalid (TypeScript type check)
- [ ] Build fails if heading hierarchy incorrect (remark plugin)
- [ ] CI pipeline fails if validation errors detected

### Implementation

- [ ] T026 [P] [US10] Create robots.txt validation script in scripts/validate-robots.ts
  - Validation: File exists at public/robots.txt
  - Validation: Contains Sitemap: line with correct URL
  - Validation: Contains User-agent rules for AI crawlers
  - Output: Pass/fail status, error messages if validation fails
  - Integration: Run in npm run build (add to package.json scripts)
  - Pattern: Next.js build script hooks
  - From: spec.md US10 acceptance criteria

- [ ] T027 [P] [US10] Create schema validation test in lib/__tests__/schema.test.ts
  - Test: generateBlogPostingSchema() returns valid BlogPosting schema
  - Test: generateFAQPageSchema() returns valid FAQPage schema when contentType === 'faq'
  - Test: generateHowToSchema() returns valid HowTo schema when contentType === 'tutorial'
  - Test: generateFAQPageSchema() returns null when contentType !== 'faq'
  - Test: Schema TypeScript types compile without errors
  - Framework: Jest or Vitest (existing test setup)
  - Pattern: Existing test patterns in codebase
  - From: spec.md US10 acceptance criteria

- [ ] T028 [P] [US10] Create W3C HTML validation check in scripts/validate-html.ts
  - Tool: Use w3c-html-validator package or curl to W3C API
  - Input: Array of sample post URLs (3 posts from content/posts/)
  - Validation: Zero HTML errors on all sample posts
  - Output: Pass/fail status, list of errors if any
  - Integration: Run in CI pipeline (optional, can be manual)
  - Pattern: Lighthouse CI integration approach
  - From: spec.md US10 acceptance criteria

- [ ] T029 [US10] Add validation checks to CI pipeline in .github/workflows/verify.yml
  - Step: Run npm run validate:robots (T026)
  - Step: Run npm test (includes schema validation T027)
  - Step: Run npm run build (includes heading validation T011, T012)
  - Step: Optional - Run npm run validate:html (T028)
  - Failure: Build fails if any validation step fails
  - REUSE: Existing verify.yml workflow structure
  - Pattern: .github/workflows/verify.yml existing steps
  - From: spec.md US10 acceptance criteria

---

## Phase 13: Polish & Cross-Cutting Concerns

### Documentation

- [ ] T030 Document LLM SEO optimization features in specs/052-llm-seo-optimization/NOTES.md
  - Section: Implementation decisions (robots.txt strategy, schema approach, heading validation)
  - Section: Post-deployment testing instructions (Google Rich Results Test, W3C Validator, AI citation testing)
  - Section: Content migration guide (adding contentType to existing posts)
  - Section: Troubleshooting (common validation errors, schema debugging)
  - From: plan.md [TESTING STRATEGY] and quickstart.md

---

## [TEST GUARDRAILS]

**Coverage Requirements**:
- New code: 100% coverage (all new functions must have tests)
- Schema generators: ≥90% coverage (edge cases tested)
- Remark plugin: ≥80% coverage (heading validation logic)

**Test Types**:
- Unit tests: Schema generation functions (T027)
- Integration tests: Remark plugin validation (part of build process)
- E2E tests: Manual AI citation testing (quarterly)
- Validation tests: Google Rich Results Test, W3C HTML Validator (post-deployment)

**Speed Requirements**:
- Unit tests: <2s total
- Build-time validation: <5s for 50 posts
- Full build with validation: <30s additional overhead

**Quality Gates**:
- All tests must pass before merge
- Heading validation must pass in build
- Google Rich Results Test must show valid schemas
- W3C HTML Validator must show zero errors on sample posts
