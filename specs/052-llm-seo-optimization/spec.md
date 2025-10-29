# Feature Specification: LLM SEO Optimization

**Branch**: `feature/052-llm-seo-optimization`
**Created**: 2025-10-29
**Status**: Draft
**GitHub Issue**: #15
**ICE Score**: 1.50 (Impact: 5, Confidence: 0.9, Effort: 3)

## User Scenarios

### Primary User Story

Content creators and readers benefit from AI-powered search discovery. When someone asks ChatGPT, Perplexity, or Claude about aviation training techniques or modern web development practices, marcusgoll.com content appears as a cited, authoritative source in AI-generated answers. This drives organic traffic from AI search interfaces while improving traditional SEO.

### Acceptance Scenarios

1. **Given** a user asks ChatGPT "How do flight instructors structure lesson plans?", **When** the AI searches for authoritative sources, **Then** marcusgoll.com aviation posts appear in citations with proper context extraction

2. **Given** a developer asks Perplexity "How to deploy Next.js with Docker on VPS", **When** the AI compiles an answer, **Then** relevant marcusgoll.com tutorials are included with code snippets properly formatted

3. **Given** a user asks Claude about systematic thinking in software development, **When** the AI retrieves relevant content, **Then** cross-pollination posts (aviation + dev) appear as unique, high-value sources

4. **Given** an AI crawler visits marcusgoll.com, **When** it reads robots.txt, **Then** it is explicitly allowed to crawl all content

5. **Given** an AI processes a blog post page, **When** it parses the HTML, **Then** semantic structure (article, section, aside) is clear and heading hierarchy is logical

6. **Given** an LLM extracts structured data, **When** it reads schema.org markup, **Then** Article, Author, FAQ, and HowTo schemas provide comprehensive metadata

### Edge Cases

- What happens when AI crawlers hit rate limits on the VPS? (CDN caching strategy, robots.txt crawl-delay if needed)
- How does system handle posts without TL;DR sections? (Auto-generate from first paragraph or require in MDX frontmatter)
- What if heading hierarchy is violated in legacy posts? (Build-time validation with warnings, automated fixing where possible)
- How to maintain citation-friendly format while keeping content engaging for human readers? (Balance: semantic HTML doesn't compromise visual design)

## User Stories (Prioritized)

> **Purpose**: Break down feature into independently deliverable stories for MVP-first delivery.
> **Format**: [P1] = MVP (ship first), [P2] = Enhancement, [P3] = Nice-to-have

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a content creator, I want AI crawlers to access my content so that my posts can appear in AI-generated answers
  - **Acceptance**: robots.txt explicitly allows GPTBot, ChatGPT-User, Claude-Web, ClaudeBot, PerplexityBot, Google-Extended
  - **Acceptance**: robots.txt is accessible at /robots.txt with proper syntax
  - **Acceptance**: Manual test: curl https://marcusgoll.com/robots.txt shows AI crawler rules
  - **Independent test**: Deploy robots.txt changes independently, verify with curl
  - **Effort**: XS (<2 hours)

- **US2** [P1]: As an AI system, I want semantic HTML5 structure so that I can accurately parse content hierarchy and relationships
  - **Acceptance**: All blog posts wrapped in `<article>` element
  - **Acceptance**: Post metadata in `<header>` with `<h1>`, `<time datetime="">`, author info
  - **Acceptance**: Main content uses `<section>` for logical groupings
  - **Acceptance**: Related content in `<aside>` element
  - **Acceptance**: W3C HTML validator shows zero semantic errors on 3 sample posts
  - **Independent test**: Validate HTML of any single post with W3C validator
  - **Effort**: S (2-4 hours)

- **US3** [P1]: As an AI system, I want structured Article schema so that I can extract metadata (title, author, publish date, description)
  - **Acceptance**: JSON-LD script in `<head>` for BlogPosting schema on all posts
  - **Acceptance**: Schema includes: headline, author (Person), datePublished, dateModified, description, articleBody, inLanguage, mainEntityOfPage
  - **Acceptance**: Google Rich Results Test shows valid Article schema
  - **Acceptance**: Schema auto-generated from MDX frontmatter (title, date, excerpt, author)
  - **Independent test**: Test schema generation on single post without other changes
  - **Effort**: M (4-8 hours)

- **US4** [P1]: As a reader (human or AI), I want clear heading hierarchy so that I can understand content structure and navigate efficiently
  - **Acceptance**: Single H1 per page (post title)
  - **Acceptance**: Logical H2 → H3 → H4 progression (no skipped levels)
  - **Acceptance**: Build fails if heading hierarchy violated (remark plugin validation)
  - **Acceptance**: Lighthouse SEO audit shows no heading hierarchy warnings
  - **Independent test**: Add heading validation to build without changing existing content
  - **Effort**: S (2-4 hours)

- **US5** [P1]: As a reader or AI system, I want TL;DR summaries so that I can quickly understand key points without reading full post
  - **Acceptance**: TL;DR section appears immediately after H1 on all posts
  - **Acceptance**: TL;DR uses semantic `<section class="tldr">` element
  - **Acceptance**: TL;DR content is 2-4 sentences summarizing main points
  - **Acceptance**: If MDX frontmatter includes `excerpt`, TL;DR auto-generates from it
  - **Independent test**: Add TL;DR component to single post, verify rendering
  - **Effort**: S (2-4 hours)

**Priority 2 (Enhancement)**

- **US6** [P2]: As an AI system, I want FAQ schema on FAQ-style posts so that I can provide direct answers to questions
  - **Acceptance**: FAQ posts include FAQPage schema with Question/Answer pairs
  - **Acceptance**: Schema includes: name (question), acceptedAnswer (text)
  - **Acceptance**: Google Rich Results Test shows valid FAQPage schema
  - **Acceptance**: Manual test: Ask ChatGPT a question from FAQ post, verify citation appears
  - **Depends on**: US3 (schema infrastructure)
  - **Effort**: M (4-8 hours)

- **US7** [P2]: As an AI system, I want HowTo schema on tutorial posts so that I can present step-by-step instructions accurately
  - **Acceptance**: Tutorial posts include HowTo schema with step array
  - **Acceptance**: Schema includes: name (title), step[] (name, text, itemListElement for substeps)
  - **Acceptance**: Google Rich Results Test shows valid HowTo schema
  - **Acceptance**: Steps auto-generated from H2 headings or explicit MDX component
  - **Depends on**: US3 (schema infrastructure)
  - **Effort**: M (4-8 hours)

- **US8** [P2]: As a content creator, I want citation-friendly formatting so that AI systems can extract and attribute content accurately
  - **Acceptance**: Blockquotes use `<blockquote cite="">` with source URL when applicable
  - **Acceptance**: Code blocks use `<pre><code class="language-X">` with proper language tags
  - **Acceptance**: Data tables use semantic `<table>` with `<thead>`, `<tbody>`, `<caption>`
  - **Acceptance**: Definition lists use `<dl>`, `<dt>`, `<dd>` for terminology
  - **Depends on**: US2 (semantic HTML foundation)
  - **Effort**: S (2-4 hours)

**Priority 3 (Nice-to-have)**

- **US9** [P3]: As a content creator, I want canonical URL enforcement so that duplicate content doesn't dilute LLM citations
  - **Acceptance**: All post pages include `<link rel="canonical" href="">` in `<head>`
  - **Acceptance**: Canonical URL matches mainEntityOfPage in schema
  - **Acceptance**: Canonical URLs use production domain (no localhost, staging domains)
  - **Depends on**: US3 (schema infrastructure)
  - **Effort**: XS (<2 hours)

- **US10** [P3]: As a site operator, I want automated validation of LLM optimization so that I can catch regressions
  - **Acceptance**: Build-time checks for: robots.txt exists, schema.org markup valid, heading hierarchy correct, semantic HTML present
  - **Acceptance**: CI pipeline fails if validation errors detected
  - **Acceptance**: Validation report generated showing pass/fail for each check
  - **Depends on**: US1, US2, US3, US4
  - **Effort**: M (4-8 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US5 first (core LLM optimization), validate with manual AI testing, then incrementally add US6-US7 (schema enhancements) and US8-US10 (polish) based on initial results.

## Visual References

See `./visuals/README.md` for LLM crawler documentation and schema.org research (if applicable)

## Success Metrics (HEART Framework)

> **Purpose**: Define quantified success criteria using Google's HEART framework.
> **Constraint**: All metrics MUST be Claude Code-measurable (SQL, logs, Lighthouse).

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Improve discoverability | AI citations of content | Manual testing: Ask 5 questions across ChatGPT/Perplexity/Claude, count citations | ≥3 citations within 30 days | <2% 404 errors from AI crawlers |
| **Engagement** | Increase organic traffic from AI search | Referrals from AI interfaces | GA4: New users from "AI referral" sources | +15% organic traffic in 60 days | <5% bounce rate increase |
| **Adoption** | Enable AI crawler access | AI crawler user agents in logs | Server logs: Count unique AI bot hits per day | ≥10 AI bot visits/day | <1% server errors for AI requests |
| **Retention** | Maintain content quality for citations | Repeat AI citations | Manual quarterly audit: Re-test same 5 questions | ≥3 citations maintained | <10% citation drop-off |
| **Task Success** | Structured data validation | Schema markup passing | Google Rich Results Test + Lighthouse structured data audit | 100% posts pass validation | Zero schema errors in Search Console |

**Performance Targets** (from `design/systems/budgets.md` and constitution.md):
- FCP <1.5s, TTI <3.5s, CLS <0.15, LCP <3.0s (no regression from schema markup)
- Lighthouse Performance ≥85, Accessibility ≥95, SEO ≥90
- W3C HTML validation: Zero errors on sample posts

**Measurement Plan**:
- **GA4 tracking**: Organic traffic sources (filter for AI referrals if identifiable)
- **Server logs**: Parse for AI bot user agents (GPTBot, ClaudeBot, PerplexityBot, etc.)
- **Google Search Console**: Structured data errors, indexing status
- **Lighthouse CI**: Automated SEO, accessibility, performance audits
- **Manual testing**: Quarterly AI query tests with documented results

## Hypothesis

> **Purpose**: State the problem, solution, and predicted improvement.
> **Format**: Problem → Solution → Prediction (with magnitude)

**Problem**: marcusgoll.com content is difficult for AI systems to discover and cite accurately
- Evidence: No structured schema.org markup, generic semantic HTML, no AI crawler optimization
- Impact: Missing opportunity for organic traffic from AI-powered search (ChatGPT, Perplexity, Claude growing as search alternatives)
- Current state: Blog relies solely on traditional SEO (Google, Bing) without AI discoverability

**Solution**: Implement comprehensive LLM SEO optimization (robots.txt allowlist, semantic HTML5, schema.org markup, clear hierarchy, TL;DR summaries)
- Change: Add AI crawler rules, JSON-LD schemas, semantic structure enforcement, citation-friendly formatting
- Mechanism: LLMs prioritize content with clear structure, metadata, and summaries; explicit crawler access increases indexing

**Prediction**: AI-powered search citations will drive +15% organic traffic growth within 60 days
- Primary metric: AI citations in ChatGPT/Perplexity/Claude responses (≥3 citations from 5 test queries)
- Secondary metric: +15% organic traffic from new AI referral sources (GA4 tracking)
- Expected improvement: Baseline 0 AI citations → 3+ citations within 30 days post-deployment
- Confidence: Medium-High (proven schema.org benefits, growing AI search adoption, but measurement challenges)

## Context Strategy & Signal Design

- **System prompt altitude**: Feature-level cues (LLM SEO optimization context maintained throughout implementation)
- **Tool surface**: File operations (robots.txt, schema generators), MDX processing (remark plugins), build validation (TypeScript types)
- **Examples in scope**: ≤3 canonical examples (BlogPosting schema, FAQPage schema, HowTo schema templates)
- **Context budget**: Target 75k tokens (planning phase), compact at 60k tokens (80% threshold)
- **Retrieval strategy**: JIT (Just-In-Time) - load schema templates and validation rules when needed during implementation
- **Memory artifacts**: NOTES.md updated with schema decisions, validation results, AI testing outcomes
- **Compaction cadence**: Summarize research findings after spec phase, keep implementation decisions
- **Sub-agents**: None required (single-domain feature - SEO/content optimization)

## Requirements

### Functional (testable only)

- **FR-001**: System MUST serve robots.txt file at `/robots.txt` allowing AI crawlers (GPTBot, ChatGPT-User, Claude-Web, ClaudeBot, PerplexityBot, Google-Extended)
- **FR-002**: System MUST wrap all blog post content in semantic HTML5 structure (`<article>`, `<header>`, `<section>`, `<aside>`)
- **FR-003**: System MUST generate JSON-LD schema.org markup (BlogPosting) for all blog posts in page `<head>`
- **FR-004**: System MUST include Person schema for author (Marcus Gollahon) with name, url, image
- **FR-005**: System MUST enforce single H1 per page with logical H2 → H3 → H4 hierarchy (no skipped levels)
- **FR-006**: System MUST include TL;DR section immediately after H1 for all posts (auto-generated from excerpt or manual)
- **FR-007**: System MUST validate heading hierarchy at build time and fail build if violations detected
- **FR-008**: System MUST include canonical URL in `<link rel="canonical">` and schema mainEntityOfPage
- **FR-009**: System MUST generate FAQPage schema for posts tagged with "faq" content type
- **FR-010**: System MUST generate HowTo schema for posts tagged with "tutorial" content type
- **FR-011**: System MUST use semantic HTML for citation-friendly content (blockquote with cite, code with language, semantic tables, definition lists)
- **FR-012**: System MUST auto-generate schema.org markup from MDX frontmatter (title, date, excerpt, tags, author)

### Non-Functional

- **NFR-001**: Performance: Schema.org JSON-LD MUST NOT increase page load time by >100ms (measured with Lighthouse)
- **NFR-002**: Accessibility: All semantic HTML changes MUST maintain WCAG 2.1 Level AA compliance (no regressions)
- **NFR-003**: SEO: Lighthouse SEO score MUST remain ≥90 after implementation
- **NFR-004**: Validation: W3C HTML Validator MUST show zero errors on sample blog posts
- **NFR-005**: Schema Validation: Google Rich Results Test MUST show valid schema markup for all schema types
- **NFR-006**: Build Performance: Heading hierarchy validation MUST complete in <5 seconds for 50 posts
- **NFR-007**: Mobile: Semantic HTML structure MUST render correctly on mobile devices (viewport width <768px)
- **NFR-008**: Error Handling: If schema generation fails, system MUST log error and continue build (non-blocking)

### Key Entities (if data involved)

- **BlogPost** (MDX):
  - Frontmatter: title, date, excerpt, tags, author, contentType (standard, faq, tutorial)
  - Body: Markdown/MDX content with semantic HTML components
  - Generated: readingTime, slug, schema JSON-LD

- **Schema Templates** (TypeScript):
  - BlogPostingSchema: Article metadata (headline, author, datePublished, description, articleBody)
  - PersonSchema: Author information (name, url, image, jobTitle)
  - FAQPageSchema: Question/answer pairs extracted from content
  - HowToSchema: Step-by-step instructions with optional images

- **Validation Rules** (TypeScript):
  - HeadingHierarchy: Single H1, logical H2-H4 progression
  - SemanticHTML: Required elements (article, header, section)
  - SchemaValidation: JSON-LD schema correctness

## Deployment Considerations

> **Purpose**: Document deployment constraints and dependencies for planning phase.

### Platform Dependencies

**Hetzner VPS** (self-hosted with Docker):
- No infrastructure changes required (robots.txt is static file, schema is generated at build)
- Next.js build process handles schema generation (no runtime dependencies)

**Next.js App Router**:
- MDX processing pipeline needs remark plugin for heading validation
- Metadata API can generate schema JSON-LD in page `<head>` (built-in feature)

**Dependencies**:
- None new (existing packages sufficient: gray-matter, remark-gfm, @next/mdx)
- Potential: Add `remark-lint` for heading hierarchy validation (optional, can use custom plugin)

### Environment Variables

**No new environment variables required**

**Existing variables used**:
- `NEXT_PUBLIC_SITE_URL`: Used for canonical URLs and schema.org mainEntityOfPage
- Verify this exists in `.env.local` and production environment

**Schema Update Required**: No

### Breaking Changes

**API Contract Changes**: No

**Database Schema Changes**: No (content is MDX files, no database)

**Content Structure Changes**: Non-breaking enhancements
- TL;DR sections added to posts (new content, doesn't break existing)
- Semantic HTML wrappers added (doesn't change content, only structure)
- Schema.org markup added to `<head>` (invisible to users, only affects metadata)

**Client Compatibility**: Backward compatible (progressive enhancement)

### Migration Requirements

**Content Migration**: Update existing blog posts to include TL;DR sections and correct heading hierarchy
- Estimated: 10-20 existing posts need manual review
- Process: Add `excerpt` to frontmatter or create dedicated TL;DR section
- Priority: MVP posts first (top 5 aviation + top 5 dev posts), remaining posts over time

**robots.txt Migration**: Create new `/public/robots.txt` file (doesn't exist yet)

**Schema Generation**: Auto-applied to all posts at build time (no manual migration)

**RLS Policy Changes**: No (no database changes)

**Reversibility**: Fully reversible
- robots.txt can be updated to disallow AI crawlers
- Schema.org markup can be removed from metadata generation
- Semantic HTML wrappers can be removed (though this would break HTML structure)

### Rollback Considerations

**Standard Rollback**: Yes - 3-command rollback via git revert
- Rollback removes: robots.txt AI crawler rules, schema generation, semantic HTML wrappers
- No data loss (content files unchanged, only template/generation logic reverted)

**Special Rollback Needs**: None
- No database migrations to revert
- No external service dependencies
- Static file changes only (robots.txt)

**Deployment Metadata**: Deployment IDs tracked in `specs/052-llm-seo-optimization/NOTES.md` (Deployment Metadata section)

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: Server logs, Google Search Console, Lighthouse CI, manual AI testing.

### Data Collection

**Server Logs** (AI bot detection):
- Parse Caddy/Docker logs for AI crawler user agents
- Pattern: `GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|PerplexityBot|Google-Extended`
- Metric: Daily unique AI bot visits

**Google Search Console**:
- Structured data errors (monitor for schema validation issues)
- Indexing status (ensure posts indexed correctly)
- Search appearance (Rich Results if FAQ/HowTo schemas active)

**Google Analytics 4**:
- Organic traffic trends (filter for new sources if AI referrals identifiable)
- Bounce rate by source (ensure AI-referred traffic engages)
- User flow from organic search

**Lighthouse CI** (automated):
- SEO score (target ≥90)
- Accessibility score (maintain ≥95)
- Performance score (maintain ≥85)
- Structured data validation

**Manual AI Testing** (quarterly):
- ChatGPT: Ask 3 questions related to blog topics, record citations
- Perplexity: Ask 3 questions related to blog topics, record citations
- Claude: Ask 3 questions related to blog topics, record citations
- Document: question, response, whether marcusgoll.com cited, context quality

### Measurement Queries

**Server Logs** (parse with grep/awk):
```bash
# Count AI bot visits per day
grep -E "(GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|PerplexityBot|Google-Extended)" /var/log/caddy/access.log \
  | awk '{print $4}' | cut -d: -f1 | uniq -c

# AI bot 404 errors (monitor crawler health)
grep -E "(GPTBot|ChatGPT-User|ClaudeBot)" /var/log/caddy/access.log \
  | grep " 404 " | wc -l
```

**Google Search Console** (manual export):
- Navigate to Performance → Coverage → Valid pages
- Check Enhancements → Structured Data → Article, FAQ, HowTo counts

**Lighthouse** (`.lighthouseci/results/*.json`):
```bash
# SEO score
jq '.categories.seo.score' .lighthouseci/results/*.json

# Structured data items found
jq '.audits["structured-data"].details.items | length' .lighthouseci/results/*.json
```

**GA4** (manual dashboard):
- Acquisition → Traffic acquisition → Filter by "Organic Search"
- Engagement → Pages and screens → Sort by Avg engagement time

### Validation Testing

**Build-Time Validation**:
- Heading hierarchy check (remark plugin during build)
- Schema JSON-LD validation (TypeScript type checking)
- W3C HTML validation (local validator or CI integration)

**Post-Deployment Validation**:
1. Google Rich Results Test: Test 3 sample post URLs
2. W3C HTML Validator: Validate 3 sample post URLs
3. Manual AI testing: Ask 5 prepared questions across ChatGPT, Perplexity, Claude
4. Lighthouse CI: Run full audit on 5 sample posts
5. robots.txt check: `curl https://marcusgoll.com/robots.txt`

---

## Success Criteria

**Must be measurable, technology-agnostic, user-focused, verifiable**

1. AI crawlers can access all blog content (verified by robots.txt rules and server log evidence of bot visits)
2. Blog posts have clear, parseable structure for AI systems (verified by W3C validation and semantic HTML presence)
3. Structured metadata enables accurate content extraction (verified by Google Rich Results Test showing valid schemas)
4. Content hierarchy is logical and machine-readable (verified by Lighthouse SEO audit showing no heading hierarchy warnings)
5. Quick summaries enable fast content understanding (verified by TL;DR sections present on all posts)
6. FAQ content is machine-extractable (verified by FAQPage schema validation on FAQ-tagged posts)
7. Tutorial content has clear step structure (verified by HowTo schema validation on tutorial-tagged posts)
8. Citations and references are properly attributed (verified by blockquotes with cite attribute, code blocks with language tags)
9. All posts have canonical URLs to prevent duplicate content (verified by rel="canonical" presence in page head)
10. Site performance remains fast with added metadata (verified by Lighthouse Performance score ≥85, no >100ms regression)
11. Site remains accessible with semantic changes (verified by WCAG 2.1 AA compliance, Lighthouse Accessibility ≥95)
12. AI-powered search drives measurable traffic growth (verified by +15% organic traffic increase within 60 days post-deployment)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, accessibility, documentation standards)
- [x] No implementation details (tech stack, APIs, code - specification remains technology-agnostic)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] HEART metrics defined with Claude Code-measurable sources
- [x] Hypothesis stated (Problem → Solution → Prediction)

### Conditional: UI Features (Skip if backend-only)
- [ ] N/A - No new UI screens (content/SEO optimization only)

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified (none - backward compatible enhancements)
- [x] Environment variables documented (none required, existing NEXT_PUBLIC_SITE_URL used)
- [x] Rollback plan specified (standard git revert, fully reversible)
