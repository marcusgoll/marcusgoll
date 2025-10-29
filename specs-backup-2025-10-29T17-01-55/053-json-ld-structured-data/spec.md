# Feature Specification: JSON-LD Structured Data

**Branch**: `feature/053-json-ld-structured-data`
**Created**: 2025-10-29
**Status**: Draft
**GitHub Issue**: #14 (Impact: 4/5, Effort: 2/5, Confidence: 0.9)

## User Scenarios

### Primary User Story
As a **content creator** (Marcus Gollahon), I want to implement comprehensive Schema.org structured data across all page types so that search engines can display rich snippets, improve SERP appearance, and increase organic click-through rates from search results.

### Acceptance Scenarios

1. **Given** a blog post page is rendered, **When** a search engine crawler visits, **Then** it finds BlogPosting JSON-LD with headline, datePublished, dateModified, author, image, and dual-track category tags

2. **Given** the homepage is rendered, **When** a search engine crawler visits, **Then** it finds Website JSON-LD with site name, URL, description, and search action for site search integration

3. **Given** the About page is rendered, **When** a search engine crawler visits, **Then** it finds Person JSON-LD with name, jobTitle, description, sameAs links to social profiles, and brand identity

4. **Given** any page with breadcrumbs is rendered, **When** a search engine crawler visits, **Then** it finds BreadcrumbList JSON-LD matching the visual breadcrumb navigation

5. **Given** all schemas are generated, **When** validated with Google Rich Results Test, **Then** all schemas pass validation with zero errors

6. **Given** all schemas are generated, **When** validated with Schema.org validator, **Then** all schemas conform to Schema.org specifications

### Edge Cases
- What happens when a blog post has no featuredImage? (Use default og-image)
- What happens when tags don't fit aviation/dev categories? (Default to 'Blog' category)
- How does system handle missing author in frontmatter? (Fall back to constitution default)
- What happens if sameAs links are incomplete? (Generate from available social profiles only)

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a blog post, I want BlogPosting schema with dual-track categories so that search engines display my aviation/dev content correctly in rich results
  - **Acceptance**: BlogPosting JSON-LD includes articleSection field mapping tags to "Aviation", "Development", or "Leadership" categories
  - **Independent test**: Visit /blog/[any-post], view page source, verify articleSection field present and accurate
  - **Effort**: S (2-3 hours)

- **US2** [P1]: As the homepage, I want Website schema with search action so that Google displays a search box in SERP for my site
  - **Acceptance**: Website JSON-LD includes potentialAction with SearchAction type and target URL template
  - **Independent test**: Visit homepage, view page source, verify Website schema with search action present
  - **Effort**: S (2-3 hours)

- **US3** [P1]: As the About page, I want Person schema so that search engines display my professional identity correctly
  - **Acceptance**: Person JSON-LD includes name, jobTitle, description, url, image, and sameAs array with social profiles
  - **Independent test**: Visit /about, view page source, verify Person schema present with all required fields
  - **Effort**: S (3-4 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As all pages, I want Organization schema so that search engines understand my personal brand as a unified entity
  - **Acceptance**: Organization JSON-LD includes name, url, logo, description, founder (Person reference), and sameAs social links
  - **Depends on**: US3 (Person schema for founder reference)
  - **Effort**: S (2 hours)

- **US5** [P2]: As all schemas, I want automated validation during build so that invalid structured data never reaches production
  - **Acceptance**: Build-time validation runs for all generated schemas, fails build if validation errors found
  - **Depends on**: US1, US2, US3, US4
  - **Effort**: M (4-6 hours)

**Priority 3 (Nice-to-have)**

- **US6** [P3]: As blog posts, I want automatic FAQ or HowTo schema detection so that tutorial posts get enhanced rich snippets
  - **Acceptance**: Posts with "how-to" or "tutorial" tags generate HowTo schema; posts with Q&A sections generate FAQ schema
  - **Depends on**: US1 (BlogPosting foundation)
  - **Effort**: M (5-8 hours)

**MVP Strategy**: Ship US1-US3 first (core schemas for all page types), validate with Google Rich Results Test, then incrementally add US4-US6 based on SERP performance data.

## Success Metrics (HEART Framework)

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Improved SERP trust signals | Rich snippet appearance rate | % of search results showing rich snippets | >60% of blog posts show rich snippets within 30 days | Schema validation errors <1% |
| **Engagement** | Increased organic traffic | Click-through rate from SERP | CTR increase from organic search | +15% CTR from Google Search Console baseline | Bounce rate remains <40% |
| **Adoption** | Rich result indexing | Google Search Console rich result count | Number of blog posts indexed with rich results | 80% of published posts within 60 days | Re-crawl frequency >1/week |
| **Retention** | SEO visibility maintenance | Organic search impressions | Monthly impressions from GSC | +25% impressions vs. baseline | Position ranking stable ±3 |
| **Task Success** | Schema validation | Validation pass rate | % schemas passing Google Rich Results Test | 100% pass rate (zero errors) | <5min validation time per schema |

**Performance Targets** (from constitution):
- Schema generation <10ms per page (negligible build time impact)
- JSON-LD size <5KB per page (minimal page weight increase)
- No client-side JavaScript required (static JSON-LD in HTML)

## Context Strategy & Signal Design

- **System prompt altitude**: Medium - structured data generation from configuration
- **Tool surface**: lib/schema.ts utilities, lib/mdx.ts frontmatter extraction, constitution.md brand data
- **Examples in scope**: 3 schemas (BlogPosting existing, Person new, Website new) as canonical patterns
- **Context budget**: 10k tokens (lightweight feature, minimal research needed)
- **Retrieval strategy**: JIT - read frontmatter and constitution at render time
- **Memory artifacts**: NOTES.md updated with schema validation results, no TODO needed (simple feature)
- **Compaction cadence**: Not needed (small feature)
- **Sub-agents**: None (single-phase implementation)

## Requirements

### Functional (testable only)

- **FR-001**: System MUST generate ArticlePosting JSON-LD for all blog posts including headline, datePublished, dateModified, author (Person), image, articleBody, wordCount, description, publisher (Organization), mainEntityOfPage, and articleSection (dual-track category)

- **FR-002**: System MUST generate Person JSON-LD for About page including name, jobTitle, description, url, image, sameAs array (Twitter, LinkedIn, GitHub), and knowsAbout array (aviation, software development, education)

- **FR-003**: System MUST generate Website JSON-LD for homepage including name, url, description, and potentialAction with SearchAction type and target URL template for site search

- **FR-004**: System MUST generate Organization JSON-LD for all pages including name, url, logo, description, founder (Person reference), and sameAs social links

- **FR-005**: System MUST generate BreadcrumbList JSON-LD for all pages with breadcrumb navigation matching visual breadcrumb hierarchy

- **FR-006**: System MUST map blog post tags to articleSection categories using mapping: "aviation"/"flight-training" → "Aviation", "development"/"startup"/"coding" → "Development", "leadership"/"teaching" → "Leadership", default → "Blog"

- **FR-007**: System MUST extract author data from constitution.md brand profile (name, jobTitle, social links) to populate Person schema

- **FR-008**: System MUST use featuredImage from MDX frontmatter for BlogPosting image field, falling back to default og-image if missing

- **FR-009**: System MUST embed JSON-LD in `<script type="application/ld+json">` tags in HTML `<head>` section for all page types

- **FR-010**: System MUST pass Google Rich Results Test validation with zero errors for all generated schemas

- **FR-011**: System MUST pass Schema.org validator with zero warnings for all generated schemas

### Non-Functional

- **NFR-001**: Performance: Schema generation MUST complete in <10ms per page during build (negligible impact on build time)

- **NFR-002**: Size: Generated JSON-LD MUST be <5KB per page (minimal page weight increase, optimized for Core Web Vitals)

- **NFR-003**: Standards Compliance: All schemas MUST conform to Schema.org vocabulary 13.0+ specifications

- **NFR-004**: SEO Best Practices: JSON-LD placement MUST follow Google Search Central structured data guidelines (in `<head>`, valid JSON, required properties present)

- **NFR-005**: Maintainability: Schema generation logic MUST be centralized in lib/schema.ts module for easy updates and testing

- **NFR-006**: Documentation: Each schema generator function MUST include JSDoc comments with Schema.org reference links and required/optional property lists

### Key Entities (if data involved)

- **BlogPosting**: Article content with metadata (existing, extended with articleSection)
- **Person**: Individual person (Marcus Gollahon) with professional identity and social profiles
- **Website**: The website entity itself with search capability
- **Organization**: Personal brand entity (Marcus Gollahon brand) with founder and social presence
- **BreadcrumbList**: Hierarchical navigation path (existing)

## Measurement Plan

### Data Collection

**Analytics Events** (dual instrumentation):
- Google Search Console: SERP impressions, clicks, CTR, rich result appearances
- Structured logs: Schema validation results, generation timing
- Lighthouse CI: Page weight impact, Core Web Vitals

**Key Metrics to Track**:
1. `rich_results.blog_posting` - BlogPosting rich results in GSC
2. `rich_results.organization` - Organization rich results in GSC
3. `schema.validation_errors` - Validation error count during build
4. `schema.generation_time` - P95 generation time per page
5. `serp.ctr` - Click-through rate from organic search (GSC API)

### Measurement Queries

**Google Search Console API** (Python scripts in specs/053-json-ld-structured-data/measurement/):
```python
# Rich result appearances
gsc_client.searchanalytics().query(
  siteUrl='https://marcusgoll.com',
  body={
    'startDate': '2025-11-01',
    'endDate': '2025-11-30',
    'dimensions': ['page'],
    'searchType': 'web',
    'dataState': 'final'
  }
).execute()
```

**Logs** (`logs/build/*.log`):
- Schema generation timing: `grep 'schema_generation' logs/build/*.log | jq -r '.duration'`
- Validation errors: `grep 'schema_validation' logs/build/*.log | jq 'select(.status=="error")'`

**Lighthouse CI** (`.lighthouseci/results/*.json`):
- Page weight: `jq '.audits["total-byte-weight"].numericValue'`
- Structured data valid: `jq '.audits["structured-data"].score'`

### Experiment Design

**No A/B Test Required**: Schema.org structured data is additive (does not change visible UX). All pages will receive schemas simultaneously.

**Validation Approach**:
1. **Pre-deployment**: Validate all schemas with Google Rich Results Test
2. **Post-deployment** (Days 1-7): Monitor GSC for indexing errors
3. **Post-deployment** (Days 8-30): Track rich result appearances in GSC
4. **Post-deployment** (Days 31-60): Measure CTR improvement vs. baseline

**Kill Switch**: If schema validation errors >1% of pages, rollback deployment and fix generation logic

**Success Threshold**:
- 100% schemas pass validation (hard requirement)
- 60%+ blog posts show rich snippets within 30 days (target)
- +15% CTR from organic search within 60 days (target)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (brand identity, SEO principles, systematic thinking)
- [x] No implementation details (Next.js, React, specific libraries not mentioned in requirements)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] HEART metrics defined with Claude Code-measurable sources (GSC API, logs, Lighthouse)
- [ ] Hypothesis stated (Problem → Solution → Prediction) - N/A: New feature, not improvement

### Conditional: UI Features (Skip if backend-only)
- [ ] All screens identified with states - N/A: No UI components, backend/data only
- [ ] System components from ui-inventory.md planned - N/A: No UI components

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [ ] Breaking changes identified - N/A: No API, schema, or migration changes
- [ ] Environment variables documented - N/A: No new env vars required
- [ ] Rollback plan specified - N/A: Standard rollback (3-command via git revert)
