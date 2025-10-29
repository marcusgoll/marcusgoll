# Implementation Plan: LLM SEO Optimization

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15.5.6 App Router, TypeScript 5.9.3, Tailwind CSS 4.1.15, MDX 3.1.1
- Components to reuse: 7 (robots.txt, sitemap, schema.ts, mdx.ts, blog layout, frontmatter, mdx-components)
- New components needed: 5 (TLDRSection, heading validator, FAQ schema, HowTo schema, type updates)
- Key finding: robots.txt exists but BLOCKS AI crawlers (Feature 051), need to REVERSE strategy

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- Frontend: Next.js 15.5.6 (App Router), React 19, TypeScript 5.9.3
- UI: Tailwind CSS 4.1.15 (utility-first styling)
- Content: MDX 3.1.1 + gray-matter (frontmatter parsing)
- Schema: JSON-LD (already implemented in lib/schema.ts)
- Validation: Remark plugins (remark-gfm, NEW: remark-validate-headings)
- Deployment: Hetzner VPS, Docker, Caddy (auto-SSL)

**Patterns**:
- **Frontmatter-driven features**: TL;DR auto-generated from excerpt, contentType field for schema selection
- **Build-time validation**: Heading hierarchy check fails build on violations (shift-left testing)
- **Conditional schema rendering**: FAQ/HowTo schemas only when `contentType` matches
- **Semantic HTML**: Existing <article>, <header>, <time> structure (no changes needed)
- **Separation of concerns**: Schema generation in lib/schema.ts, rendering in page components

**Dependencies** (new packages required):
- NONE - All functionality achievable with existing packages (remark, rehype, gray-matter, Next.js built-ins)

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
lib/
├── schema.ts                        # EXTEND: Add generateFAQPageSchema, generateHowToSchema
├── mdx.ts                          # EXTEND: Add heading validation hook
├── mdx-types.ts                    # EXTEND: Add contentType field to PostFrontmatter
└── remark-validate-headings.ts     # NEW: Heading hierarchy validator plugin

app/blog/[slug]/
└── page.tsx                        # MODIFY: Add <TLDRSection>, conditional FAQ/HowTo schema

components/blog/
└── tldr-section.tsx                # NEW: TL;DR component

public/
└── robots.txt                      # MODIFY: Reverse AI crawler strategy (disallow → allow)

content/posts/
└── *.mdx                           # MIGRATE: Add contentType field to frontmatter (optional)
```

**Module Organization**:
- **lib/schema.ts**: Centralized schema.org JSON-LD generation (BlogPosting, BreadcrumbList, FAQ, HowTo)
- **lib/remark-validate-headings.ts**: Remark plugin for build-time heading validation
- **components/blog/tldr-section.tsx**: Reusable TL;DR component (semantic <section class="tldr">)
- **app/blog/[slug]/page.tsx**: Main blog post page (adds TL;DR, conditional schemas)
- **public/robots.txt**: Static file (update AI crawler rules)

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: MDX files (no database changes)
- New frontmatter field: `contentType?: 'standard' | 'faq' | 'tutorial'`
- Relationships: Posts → Schema (one-to-one, conditional based on contentType)
- Migrations required: NO (frontmatter updates are non-breaking, optional field)

**MDX Frontmatter Extension**:
```typescript
interface PostFrontmatter {
  // Existing fields (unchanged)
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  featuredImage?: string;
  readingTime?: number;

  // NEW: Optional field for schema selection
  contentType?: 'standard' | 'faq' | 'tutorial';

  // NEW: Optional FAQ data (if contentType === 'faq')
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}
```

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs** (or defaults from design/systems/budgets.md):
- NFR-001: Schema.org JSON-LD MUST NOT increase page load time by >100ms (measured with Lighthouse)
- NFR-002: All semantic HTML changes MUST maintain WCAG 2.1 Level AA compliance (no regressions)
- NFR-003: Lighthouse SEO score MUST remain ≥90 after implementation
- NFR-004: W3C HTML Validator MUST show zero errors on sample blog posts
- NFR-005: Google Rich Results Test MUST show valid schema markup for all schema types
- NFR-006: Heading hierarchy validation MUST complete in <5 seconds for 50 posts (build performance)

**Lighthouse Targets** (from capacity-planning.md):
- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**Core Web Vitals**:
- FCP (First Contentful Paint): <1.5s
- LCP (Largest Contentful Paint): <3.0s
- CLS (Cumulative Layout Shift): <0.15
- TTI (Time to Interactive): <3.5s

---

## [SECURITY]

**Authentication Strategy**:
- No changes (public content site, no auth required)

**Authorization Model**:
- No changes (all content publicly accessible)

**Input Validation**:
- Frontmatter validation: Existing Zod schemas in lib/mdx-types.ts (extend with contentType field)
- Heading validation: Remark plugin validates heading structure at build time (non-user input)
- robots.txt: Static file (no user input, manual updates only)

**Data Protection**:
- PII handling: No PII collected (content only)
- Encryption: Not applicable (public blog content)

**SEO Security**:
- robots.txt allows search bots: Intentional (feature requirement)
- AI crawler access: Selective allow (search bots yes, training bots user decision)
- No noindex/nofollow: Content intended for indexing

---

## [EXISTING INFRASTRUCTURE - REUSE] (7 components)

**Services/Modules**:
- lib/schema.ts: Schema.org JSON-LD generation (BlogPosting, BreadcrumbList)
  - **Reuse**: Extend with generateFAQPageSchema, generateHowToSchema functions
  - **Why**: Proven pattern, TypeScript types, already integrated in blog post page
- lib/mdx.ts: MDX processing pipeline (gray-matter, reading time, getAllPosts)
  - **Reuse**: Add heading validation hook to existing remark plugins
  - **Why**: Central MDX processing, already uses remark-gfm
- lib/mdx-types.ts: TypeScript types and Zod schemas for frontmatter
  - **Reuse**: Extend PostFrontmatter type with contentType field
  - **Why**: Type safety, validation at build time

**UI Components**:
- app/blog/[slug]/page.tsx: Blog post layout with semantic HTML
  - **Reuse**: Add <TLDRSection> after <header>, conditional schema injection
  - **Why**: Already uses <article>, <header>, <time>, schema injection in place
- components/mdx/mdx-components.tsx: Custom MDX components
  - **Reuse**: May add citation-friendly components (blockquote with cite, semantic tables)
  - **Why**: Existing pattern for MDX customization

**Static Files**:
- public/robots.txt: Crawler access control
  - **Reuse**: Update AI crawler rules (disallow → allow for search bots)
  - **Why**: File exists, well-documented
- app/sitemap.ts: Framework-native sitemap generation
  - **Reuse**: No changes needed (already optimal)
  - **Why**: Already references all posts, correct priorities

---

## [NEW INFRASTRUCTURE - CREATE] (5 components)

**Backend** (lib/):
- lib/remark-validate-headings.ts: Remark plugin for heading hierarchy validation
  - **Purpose**: Enforce H1 → H2 → H3 logical progression, fail build on violations
  - **Integration**: Add to remarkPlugins in MDXRemote options (app/blog/[slug]/page.tsx)
  - **Algorithm**: Track previous heading level, throw error if level skipped
- lib/schema-faq.ts (or extend schema.ts): FAQPage schema generator
  - **Purpose**: Generate FAQPage JSON-LD from frontmatter `faq` array
  - **Integration**: Conditional rendering when `contentType === 'faq'`
  - **Schema**: Question/Answer pairs with @type FAQPage
- lib/schema-howto.ts (or extend schema.ts): HowTo schema generator
  - **Purpose**: Generate HowTo JSON-LD from tutorial posts
  - **Integration**: Conditional rendering when `contentType === 'tutorial'`
  - **Schema**: HowTo with step array (name, text, itemListElement)

**Frontend** (components/):
- components/blog/tldr-section.tsx: TL;DR summary component
  - **Purpose**: Render semantic <section class="tldr"> with excerpt
  - **Props**: `excerpt: string`
  - **Styling**: Tailwind classes for callout-style box, distinct visual treatment
  - **Placement**: After <header> in blog post layout

**Database**:
- NONE: No database changes (content is MDX files)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: Hetzner VPS with Docker + Caddy (no changes)
- Env vars: NEXT_PUBLIC_SITE_URL (existing, already used for canonical URLs)
- Breaking changes: NO (backward compatible enhancements)
- Migration: NO (frontmatter updates optional, build-time validation non-blocking for existing posts initially)

**Build Commands**:
- No changes: `npm run build` (Next.js build)
- Build-time validation: Heading validator runs during MDX processing (part of build)
- Failure mode: Build fails if heading hierarchy violated (intentional quality gate)

**Environment Variables** (update secrets.schema.json):
- No new variables required
- Existing NEXT_PUBLIC_SITE_URL used for schema.org mainEntityOfPage
- Verify: NEXT_PUBLIC_SITE_URL set in production environment

**Database Migrations**:
- NO: Content is MDX files, no database schema changes

**Smoke Tests** (for deploy-production.yml):
- Route: /blog/systematic-thinking-for-developers (sample post)
- Expected: 200, valid HTML, schema.org JSON-LD present, TL;DR section visible
- Validation: Google Rich Results Test shows valid BlogPosting schema
- Lighthouse: SEO score ≥90, no heading hierarchy warnings

**Platform Coupling**:
- Next.js: Framework-native (app/sitemap.ts, MDXRemote, metadata API)
- Docker: No changes (existing Dockerfile sufficient)
- Caddy: No changes (serves static files + Next.js app)

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- No breaking frontmatter schema changes (contentType is optional field)
- robots.txt AI crawler changes reversible (simple text file edit)
- TL;DR auto-generation fallback (uses excerpt, which all posts have)
- Build fails gracefully if heading validation errors (error message shows which post/heading)

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Given user visits https://marcusgoll.com/blog/systematic-thinking-for-developers
When page loads
Then TL;DR section appears after H1
  And BlogPosting schema.org JSON-LD present in <head>
  And Google Rich Results Test shows valid schema
  And W3C HTML Validator shows zero errors
  And Lighthouse SEO score ≥90
  And Lighthouse Accessibility score ≥95
  And no console errors

Given user visits https://marcusgoll.com/robots.txt
When file loads
Then ChatGPT-User is allowed (Allow: /)
  And PerplexityBot is allowed
  And Claude-Web is allowed (or user decision)
  And GPTBot strategy matches user preference
  And Sitemap: https://marcusgoll.com/sitemap.xml referenced
```

**Rollback Plan**:
- Deploy IDs tracked in: specs/052-llm-seo-optimization/NOTES.md (Deployment Metadata)
- Rollback commands: Standard git revert (Hetzner VPS deployment)
  ```bash
  ssh hetzner
  cd /path/to/marcusgoll
  git revert <commit-sha>
  docker-compose up -d --force-recreate
  ```
- Special considerations: robots.txt changes reversible (git tracks file history)

**Artifact Strategy** (build-once-promote-many):
- Web: Next.js static generation + Docker image
- Build in: GitHub Actions verify.yml workflow
- Deploy to production: GitHub Actions deploy-production.yml (docker-compose)
- No separate staging (direct-prod deployment model from deployment-strategy.md)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Initial setup documented: Update robots.txt, add TLDRSection component
- Validation workflow defined: Google Rich Results Test, W3C HTML Validator, Lighthouse
- Manual testing steps provided: Test AI search citations (ChatGPT, Perplexity, Claude)

**Quick Integration Steps**:
1. Update robots.txt AI crawler rules
2. Add TLDRSection component to blog layout
3. Extend schema.ts with FAQ/HowTo generators
4. Add heading validation remark plugin
5. Update MDX types with contentType field
6. Build and validate (npm run build)
7. Test with Google Rich Results Test
8. Manual AI citation testing (quarterly)

---

## [PERFORMANCE BUDGET]

**JSON-LD Overhead**:
- BlogPosting schema: ~1-2KB (gzipped, inline in <head>)
- FAQ schema: ~3-5KB (depends on question count)
- HowTo schema: ~4-6KB (depends on step count)
- Total max: ~10KB additional HTML (minimal impact)
- Target: <100ms page load increase (NFR-001)

**Build-Time Validation**:
- Heading check: <5 seconds for 50 posts (NFR-006)
- Memory: O(n) where n = heading count per post (low)
- Failure mode: Fast-fail with clear error message

**Rendering**:
- TLDRSection: Server-side rendered (no client JS)
- Schema scripts: Static JSON-LD (no client JS)
- Zero CLS impact: TL;DR in document flow (not injected)

---

## [CONTENT MIGRATION PLAN]

**Existing Posts** (5 MDX files found):
1. interactive-mdx-demo.mdx
2. from-cockpit-to-code.mdx
3. systematic-thinking-for-developers.mdx
4. flight-training-fundamentals.mdx
5. welcome-to-mdx.mdx

**Migration Strategy**:
- **TL;DR**: Auto-generated from `excerpt` (all posts have this field) - NO MANUAL WORK
- **Heading hierarchy**: Validate during build (may need manual fixes if violations found)
- **contentType field**: Optional (defaults to 'standard' if omitted) - NO IMMEDIATE WORK
- **FAQ/HowTo**: Add contentType + structured data only to relevant posts (future enhancement)

**Migration Steps**:
1. Add heading validator to build
2. Run build (npm run build)
3. If heading validation errors:
   - Review error messages (shows post file + heading level issue)
   - Manually fix heading hierarchy in affected posts
   - Re-run build
4. Deploy (all posts get TL;DR automatically)
5. Over time: Add `contentType: 'faq'` or `contentType: 'tutorial'` to relevant posts

**No Breaking Changes**: All enhancements are backward compatible (optional frontmatter fields, auto-generated TL;DR)

---

## [TESTING STRATEGY]

**Build-Time Validation**:
- Heading hierarchy check (remark plugin)
- Frontmatter validation (Zod schemas)
- TypeScript type checking (tsc --noEmit)

**Post-Deployment Validation**:
1. **Google Rich Results Test**: Test 3 sample post URLs
   - BlogPosting schema valid
   - FAQ schema valid (if post has contentType: 'faq')
   - HowTo schema valid (if post has contentType: 'tutorial')
2. **W3C HTML Validator**: Validate 3 sample post URLs
   - Zero HTML errors
   - Semantic structure correct (<article>, <header>, <time>)
3. **Lighthouse CI**: Run full audit on 5 sample posts
   - SEO score ≥90
   - Accessibility score ≥95
   - Performance score ≥85
   - No heading hierarchy warnings
4. **robots.txt check**: `curl https://marcusgoll.com/robots.txt`
   - AI crawler rules match spec
   - Sitemap referenced
5. **Manual AI testing** (quarterly):
   - ChatGPT: Ask 3 questions related to blog topics
   - Perplexity: Ask 3 questions related to blog topics
   - Claude: Ask 3 questions related to blog topics
   - Record: Citations, context quality, accuracy

**Success Criteria**:
- All validation tools pass (Google, W3C, Lighthouse)
- ≥3 AI citations within 30 days post-deployment
- Zero SEO regressions (Lighthouse SEO score maintained)
- Zero accessibility regressions (WCAG 2.1 AA maintained)

---

## [RISKS & MITIGATION]

**Risk 1: Heading validation breaks existing posts**
- **Probability**: Medium (unknown if existing posts have hierarchy violations)
- **Impact**: High (build fails, blocks deployment)
- **Mitigation**: Make heading validation warning-only initially, then enforce after manual fixes
- **Rollback**: Disable plugin if critical deployment needed

**Risk 2: AI crawlers ignore robots.txt changes**
- **Probability**: Low (standard protocol)
- **Impact**: Medium (feature doesn't achieve goal, but no harm)
- **Mitigation**: Monitor server logs for AI bot traffic, adjust strategy if needed
- **Measurement**: Parse Caddy logs for AI bot user agents

**Risk 3: Schema.org markup fails Google validation**
- **Probability**: Low (using existing proven lib/schema.ts pattern)
- **Impact**: Medium (rich snippets don't appear, SEO impact minimal)
- **Mitigation**: Test with Google Rich Results Test before deployment
- **Rollback**: Remove FAQ/HowTo schemas if invalid, keep BlogPosting (already working)

**Risk 4: TL;DR content quality inconsistent**
- **Probability**: Medium (excerpt may not always be good summary)
- **Impact**: Low (user can still read full post, LLMs still parse content)
- **Mitigation**: Review excerpts during content migration, update if needed
- **Future**: Allow manual TL;DR override via frontmatter field

**Risk 5: Performance regression from schema overhead**
- **Probability**: Low (JSON-LD is small, ~1-10KB)
- **Impact**: Low (<100ms page load increase acceptable per NFR-001)
- **Mitigation**: Monitor Lighthouse performance scores, optimize if needed
- **Threshold**: Alert if page load time increases >100ms

---

## [TIMELINE ESTIMATE]

**Phase 1: Core Implementation (MVP - US1-US5)** - 8-12 hours
- robots.txt update: 1 hour
- TLDRSection component: 2 hours
- Heading validation plugin: 3 hours
- Blog layout integration: 2 hours
- Testing & validation: 2-4 hours

**Phase 2: Enhanced Schemas (US6-US7)** - 6-8 hours
- FAQ schema generator: 3 hours
- HowTo schema generator: 3 hours
- Testing & validation: 2 hours

**Phase 3: Content Migration & Polish (US8-US10)** - 4-6 hours
- Review existing posts for heading violations: 2 hours
- Citation-friendly formatting enhancements: 2 hours
- Canonical URL enforcement: 1 hour
- Automated validation setup: 1 hour

**Total**: 18-26 hours (2-3 days for solo developer)

**Phases can be deployed independently** (MVP first, enhancements incrementally)
