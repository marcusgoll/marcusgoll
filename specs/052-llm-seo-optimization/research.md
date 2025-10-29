# Research & Discovery: 052-llm-seo-optimization

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal blog showcasing dual-track expertise (aviation + dev/startup)
- **Target Users**: Pilots seeking career advancement, developers learning systematic thinking, students/CFIs
- **Success Metrics**: Engagement (avg session > 2min), Adoption (newsletter subscribers), Task Success (blog post completion rate)
- **Scope Boundaries**: Content-focused site with MDX-based blog, no e-commerce or user accounts (yet)

### System Architecture (from system-architecture.md)
- **Components**: Next.js monolith (App Router), MDX content system, PostgreSQL (minimal usage)
- **Integration Points**: Resend/Mailgun (newsletter), GA4 (analytics), GitHub Actions (CI/CD)
- **Data Flows**: MDX files → gray-matter parsing → static generation at build time
- **Constraints**: Solo developer, self-hosted VPS, < 10K visitors/month

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), React 19, TypeScript 5.9.3
- **UI**: Tailwind CSS 4.1.15, Radix UI primitives
- **Content**: MDX 3.1.1, gray-matter, rehype-shiki, remark-gfm
- **Deployment**: Hetzner VPS, Docker, Caddy (reverse proxy with auto-SSL)

### Data Architecture (from data-architecture.md)
- **Existing Entities**: MDX files with frontmatter (title, date, excerpt, tags, author, contentType)
- **Relationships**: Posts → Tags (many-to-many via array), Posts → Author (single, currently hardcoded)
- **Naming Conventions**: camelCase for TypeScript/React, kebab-case for MDX slugs and routes
- **Migration Strategy**: Prisma migrations (manual for VPS), frontmatter updates via Git

### API Strategy (from api-strategy.md)
- **API Style**: Next.js API Routes (REST-like, serverless functions on VPS)
- **Auth**: None for public content, Supabase Auth planned for future admin features
- **Versioning**: No versioning yet (MVP phase, breaking changes rare)
- **Error Format**: Standard HTTP status codes, JSON responses `{success, message, data}`
- **Rate Limiting**: Not implemented (low traffic, VPS handles load)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: Micro tier (< 10K visitors/month)
- **Performance Targets**: Lighthouse ≥85, FCP <1.5s, LCP <3s, TTI <3.5s
- **Resource Limits**: VPS 4GB RAM, 2 vCPUs, 80GB SSD
- **Cost Constraints**: < $50/mo total infrastructure

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (no staging yet, solo developer)
- **Platform**: Hetzner VPS with Docker + Caddy
- **CI/CD Pipeline**: GitHub Actions (verify → build Docker image → deploy via SSH)
- **Environments**: Local dev (localhost:3000), Production (marcusgoll.com)

### Development Workflow (from development-workflow.md)
- **Git Workflow**: GitHub Flow (feature branches → PR → main)
- **Testing Strategy**: Manual testing (no automated tests yet)
- **Code Style**: ESLint (Next.js config), TypeScript strict mode
- **Definition of Done**: Builds successfully, Lighthouse ≥85, manual testing passed, no console errors

---

## LLM Crawler & SEO Research

### Current State Analysis

**robots.txt** (D:/Coding/marcusgoll/public/robots.txt):
- ✅ EXISTS: File already created in Feature 051 (Sitemap Generation)
- ❌ BLOCKS AI CRAWLERS: Currently disallows GPTBot, ClaudeBot, Google-Extended, PerplexityBot
- 📝 REASON: Previous feature (US7) intentionally blocked AI training crawlers
- ⚠️ CONFLICT: This feature (052) wants to ALLOW AI crawlers for search citation

**Decision**: REVERSE robots.txt strategy
- Change from "Disallow: /" to "Allow: /" for search-focused AI bots
- Keep blocking training-only bots (CCBot, Bytespider, FacebookBot)
- Differentiate between:
  - **Search bots** (ChatGPT-User, Claude-Web, PerplexityBot): ALLOW (good for citations)
  - **Training bots** (GPTBot, ClaudeBot, Google-Extended): Needs user decision

**Sitemap** (D:/Coding/marcusgoll/app/sitemap.ts):
- ✅ EXISTS: Framework-native sitemap route implemented in Feature 051
- ✅ WORKING: Generates XML sitemap at /sitemap.xml with homepage + blog posts
- ✅ PRIORITIES: Homepage 1.0, Blog 0.9, Posts 0.8 (SEO best practices)
- ✅ REFERENCED: robots.txt includes "Sitemap: https://marcusgoll.com/sitemap.xml"
- 📝 NO CHANGES NEEDED: Sitemap already optimal for LLM discovery

**MDX Content Structure** (content/posts/*.mdx):
- ✅ FRONTMATTER: Structured metadata (title, date, excerpt, tags, author)
- ✅ READING TIME: Auto-calculated from word count (lib/mdx.ts)
- ❌ NO TL;DR: Current posts lack dedicated summary sections
- ❌ HEADING ISSUES: No automated validation of H1 → H2 → H3 hierarchy
- ✅ SEMANTIC HTML: Blog post page uses <article>, <header>, <time>, <aside> (app/blog/[slug]/page.tsx)

**Schema.org Implementation** (lib/schema.ts):
- ✅ BLOGPOSTING: Already implemented for all blog posts
- ✅ BREADCRUMBLIST: Already implemented for navigation
- ✅ PERSON: Author schema included in BlogPosting
- ❌ NO FAQ: FAQPage schema not implemented
- ❌ NO HOWTO: HowTo schema not implemented
- ✅ JSON-LD: Uses correct format (recommended by Google)

**Existing Blog Layout** (app/blog/[slug]/page.tsx):
- ✅ SEMANTIC: Uses <article> wrapper, <header> for metadata, <time datetime="">
- ✅ STRUCTURED: Header → Featured Image → MDX Content → Navigation → Related Posts
- ❌ NO TL;DR COMPONENT: No summary section after H1
- ✅ METADATA: OpenGraph, Twitter Cards, canonical URLs already implemented
- ✅ BREADCRUMBS: Hierarchical navigation (Home → Blog → Post) with schema

---

## Research Decisions

### Decision 1: Reverse robots.txt AI crawler strategy
**Decision**: Allow search-focused AI crawlers (ChatGPT-User, PerplexityBot) while blocking training-only bots
**Rationale**:
- Feature 051 blocked AI crawlers to prevent content usage in LLM training
- Feature 052 wants AI citations in search results (conflicting goal)
- Search bots (ChatGPT search, Perplexity) cite sources → drives traffic
- Training bots (GPTBot, ClaudeBot) scrape for model training → no attribution
**Alternatives**:
- Block all AI bots: Loses search visibility opportunity (rejected)
- Allow all AI bots: Permits unrestricted training use (rejected, user may not want)
- Selective allow (chosen): Best of both worlds (citations without training consent)
**Source**: robots.txt research, spec.md acceptance criteria

### Decision 2: Use JSON-LD for schema.org (already implemented)
**Decision**: Continue using JSON-LD format in <head>, not Microdata or RDFa
**Rationale**:
- JSON-LD already implemented in lib/schema.ts (reuse existing pattern)
- Google's recommended format (easier to parse, doesn't clutter HTML)
- Separates structured data from presentation (better maintainability)
- Can generate dynamically from MDX frontmatter without touching content
**Alternatives**:
- Microdata: Inline attributes (rejected, clutters JSX, harder to maintain)
- RDFa: More complex, rarely used (rejected, overkill)
**Source**: lib/schema.ts (lines 1-119), Google structured data guidelines

### Decision 3: TL;DR as frontmatter-driven component
**Decision**: Auto-generate TL;DR from `excerpt` frontmatter, render as semantic <section class="tldr">
**Rationale**:
- All posts already have `excerpt` in frontmatter (used for meta descriptions)
- Reusing existing data minimizes content migration (10-20 existing posts)
- Placement after H1 matches LLM parsing behavior (top-down)
- Semantic section element helps LLMs identify summary content
**Alternatives**:
- Manual TL;DR in MDX: Requires editing all posts, content duplication (rejected)
- Generate from first paragraph: Inconsistent quality, may not be summary (rejected)
**Source**: MDX frontmatter structure (content/posts/systematic-thinking-for-developers.mdx)

### Decision 4: Build-time heading validation with remark plugin
**Decision**: Add remark-validate-headings plugin to MDX processing pipeline, fail build on violations
**Rationale**:
- Prevents heading hierarchy bugs (H1 → H3 skipping H2)
- LLMs rely on logical structure for content parsing
- Build-time validation catches errors before deployment (shift-left testing)
- Aligns with existing remark-gfm plugin architecture
**Alternatives**:
- Runtime validation: Too late, users see broken structure (rejected)
- Manual review: Error-prone, doesn't scale (rejected)
- Linting only: Non-blocking, doesn't enforce (rejected)
**Source**: lib/mdx.ts (rehype/remark plugin usage), constitution.md testing principles

### Decision 5: Manual AI testing for validation
**Decision**: Quarterly manual testing with ChatGPT, Perplexity, Claude (ask 5 topic questions, record citations)
**Rationale**:
- No automated API for checking AI search citations (ChatGPT, Perplexity proprietary)
- Direct validation of end goal (content appears in AI answers)
- Provides qualitative feedback (how content is presented, what's extracted)
- Low frequency (quarterly) acceptable given manual effort
**Alternatives**:
- Automated testing: No APIs available (rejected, not possible)
- No validation: Can't verify feature success (rejected, violates measurement requirements)
**Source**: spec.md measurement plan, HEART metrics (Happiness: AI citations)

### Decision 6: Extend existing schema.ts with FAQ and HowTo generators
**Decision**: Add `generateFAQPageSchema()` and `generateHowToSchema()` to lib/schema.ts
**Rationale**:
- Follow existing pattern (generateBlogPostingSchema, generateBreadcrumbListSchema)
- Conditional rendering based on frontmatter `contentType` field (faq, tutorial, standard)
- Minimal disruption to existing code (single file update)
- TypeScript types ensure correctness
**Alternatives**:
- Separate schema files: Unnecessary fragmentation (rejected)
- Inline in page component: Violates separation of concerns (rejected)
**Source**: lib/schema.ts architecture, app/blog/[slug]/page.tsx usage

---

## Components to Reuse (7 found)

### 1. lib/schema.ts - Schema.org generation
**Location**: `lib/schema.ts` (lines 1-119)
**Purpose**: BlogPosting and BreadcrumbList JSON-LD generation
**Reuse**: Extend with `generateFAQPageSchema()` and `generateHowToSchema()` functions
**Why**: Existing pattern proven, TypeScript types, already integrated in blog post page

### 2. lib/mdx.ts - MDX processing pipeline
**Location**: `lib/mdx.ts` (lines 1-261)
**Purpose**: Parse MDX files, extract frontmatter, calculate reading time
**Reuse**: Hook in remark-validate-headings plugin to existing remarkPlugins array
**Why**: Central MDX processing, already uses remark-gfm, natural extension point

### 3. app/blog/[slug]/page.tsx - Blog post layout
**Location**: `app/blog/[slug]/page.tsx` (lines 1-293)
**Purpose**: Render blog posts with semantic HTML, schema, metadata
**Reuse**: Add <TLDRSection> component after <header>, conditional FAQ/HowTo schema injection
**Why**: Already uses <article>, <header>, <time>, semantic structure, schema injection in place

### 4. public/robots.txt - Crawler directives
**Location**: `public/robots.txt` (lines 1-45)
**Purpose**: Control search engine and AI bot access
**Reuse**: Update User-agent rules to allow search-focused AI bots
**Why**: File exists, well-documented, straightforward text updates

### 5. MDX frontmatter structure - Metadata system
**Location**: All `content/posts/*.mdx` files
**Purpose**: Structured metadata for posts (title, date, excerpt, tags, author)
**Reuse**: Add optional `contentType` field (standard | faq | tutorial) for schema selection
**Why**: Existing convention, parsed by gray-matter, validated by Zod (lib/mdx-types.ts likely)

### 6. app/sitemap.ts - Sitemap generation
**Location**: `app/sitemap.ts` (lines 1-86)
**Purpose**: Framework-native XML sitemap for SEO
**Reuse**: No changes needed (already optimal for LLM discovery)
**Why**: Already references all posts, correct priorities, referenced in robots.txt

### 7. components/mdx/mdx-components.tsx - Custom MDX components
**Location**: Referenced in app/blog/[slug]/page.tsx (line 24)
**Purpose**: Custom React components for MDX rendering
**Reuse**: Likely add <Callout>, <CodeBlock> for citation-friendly formatting (blockquote, pre/code)
**Why**: Existing pattern for MDX customization, semantic HTML enforcement

---

## New Components Needed (5 required)

### 1. components/blog/tldr-section.tsx - TL;DR summary component
**Purpose**: Render TL;DR summary from frontmatter excerpt
**Why**: Dedicated component for semantic structure (<section class="tldr">), styling consistency
**Integration**: Insert after <header> in app/blog/[slug]/page.tsx
**Props**: `excerpt: string`

### 2. lib/remark-validate-headings.ts - Heading hierarchy validator
**Purpose**: Remark plugin to enforce H1 → H2 → H3 logical progression
**Why**: Build-time validation prevents heading hierarchy bugs
**Integration**: Add to remarkPlugins array in lib/mdx.ts or page-level MDXRemote options
**Behavior**: Fail build if heading levels skipped (H1 → H3 without H2)

### 3. lib/schema-faq.ts - FAQ schema generator (or extend schema.ts)
**Purpose**: Generate FAQPage JSON-LD from MDX content or frontmatter
**Why**: Structured FAQ data for AI systems (Question/Answer pairs)
**Integration**: Conditional rendering in app/blog/[slug]/page.tsx when `contentType === 'faq'`
**Algorithm**: Extract headings + content blocks OR use frontmatter `faq` array

### 4. lib/schema-howto.ts - HowTo schema generator (or extend schema.ts)
**Purpose**: Generate HowTo JSON-LD from tutorial posts
**Why**: Step-by-step structure for AI systems
**Integration**: Conditional rendering in app/blog/[slug]/page.tsx when `contentType === 'tutorial'`
**Algorithm**: Extract H2 headings as steps, content as step text, optional images

### 5. lib/mdx-types.ts - Type updates (likely exists)
**Purpose**: Add `contentType` field to PostFrontmatter type
**Why**: TypeScript safety for new frontmatter field
**Integration**: Update Zod schema `PostFrontmatterSchema` with optional `contentType` enum

---

## Unknowns & Questions

✅ All technical questions resolved

**Resolved during research**:
1. ✅ Does robots.txt exist? YES (Feature 051 created it)
2. ✅ Current AI crawler strategy? BLOCKS all AI bots (conflicts with Feature 052 goal)
3. ✅ Semantic HTML structure? YES (app/blog/[slug]/page.tsx uses <article>, <header>, <time>)
4. ✅ Schema.org implementation? YES (lib/schema.ts has BlogPosting, BreadcrumbList)
5. ✅ MDX processing pipeline? YES (lib/mdx.ts with gray-matter, remark-gfm, rehype-shiki)
6. ✅ Heading validation exists? NO (needs new remark plugin)
7. ✅ TL;DR in existing posts? NO (will auto-generate from excerpt)
8. ✅ Performance budget? FCP <1.5s, LCP <3s, Lighthouse ≥85 (from capacity-planning.md)
