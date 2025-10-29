# Feature: LLM SEO Optimization

## Overview

Optimize marcusgoll.com content for AI-powered search engines and LLM crawlers (ChatGPT, Perplexity, Claude) to maximize visibility in AI-generated answers. This feature focuses on making content easily parseable and citable by AI systems while maintaining excellent user experience and accessibility.

## Research Findings

### Project Context
**Tech Stack** (from tech-stack.md):
- Frontend: Next.js 16.0.1 (App Router) with React 19
- Language: TypeScript 5.9.3
- UI Framework: Tailwind CSS 4.1.15
- Content: MDX 3.1.1 with gray-matter frontmatter parsing
- Deployment: Hetzner VPS with Docker
- Performance targets: Lighthouse ≥85, FCP <1.5s, LCP <3s

**System Architecture** (from overview.md):
- Personal blog with dual-track content (40% aviation, 40% dev/startup, 20% cross-pollination)
- MDX-based content system with frontmatter metadata
- Static site generation with Next.js App Router
- SEO-first architecture already in place

### LLM Crawler Identification

**Major AI Crawler User Agents** (as of 2025):
- **ChatGPT/OpenAI**: `GPTBot`, `ChatGPT-User`
- **Claude/Anthropic**: `Claude-Web`, `ClaudeBot`
- **Perplexity**: `PerplexityBot`
- **Google Bard/Gemini**: `Google-Extended`
- **Bing AI**: `Bingbot` (standard bot)

**robots.txt Best Practices for LLMs**:
- Allow specific AI crawlers explicitly
- Separate from standard search engine rules
- Document purpose with comments

### Semantic HTML5 Research

**Current State** (needs verification during implementation):
- Next.js App Router generates semantic HTML by default
- Need to audit existing MDX components for semantic correctness
- Article structure: `<article>` wrapper, `<header>`, `<main>`, `<aside>` for related content

**Semantic Element Hierarchy**:
```
<article> (blog post)
  <header> (post metadata)
    <h1> (post title)
    <time datetime=""> (publish date)
    <address> (author info)
  <section> (introduction/TL;DR)
  <section> (main content sections)
  <aside> (related posts, tags)
  <footer> (post footer, share buttons)
```

### Schema.org Markup Research

**Essential Schema Types for Blog**:
1. **Article/BlogPosting**: Standard for all blog posts
2. **Person**: Author markup (Marcus Gollahon)
3. **BreadcrumbList**: Navigation hierarchy
4. **Organization**: Website/brand identity
5. **FAQPage**: For FAQ-style content (aviation guides, dev tutorials)
6. **HowTo**: For step-by-step tutorials (flight training, code walkthroughs)

**Schema.org Properties for LLM Optimization**:
- `headline`: Clear, descriptive title
- `abstract` or `description`: TL;DR summary
- `articleBody`: Full content text
- `author`: Structured author data
- `datePublished`, `dateModified`: Temporal context
- `keywords`: Relevant tags
- `inLanguage`: "en-US"
- `mainEntityOfPage`: Canonical URL
- `image`: Featured image for visual context

### Content Structure for LLMs

**Best Practices from Research**:
1. **Clear Hierarchy**: H1 → H2 → H3 logical progression (LLMs parse heading structure)
2. **TL;DR Sections**: Dedicated summary section at top (easy for LLMs to extract key points)
3. **Definition Lists**: Use `<dl>`, `<dt>`, `<dd>` for terminology (aviation terms, dev concepts)
4. **Blockquotes**: Properly marked with `<blockquote cite="">` for citations
5. **Code Blocks**: Use `<pre><code>` with language attribute for syntax context
6. **Data Tables**: Semantic `<table>` with `<thead>`, `<tbody>`, `<caption>` for structured data
7. **Lists**: Use `<ol>` for sequential steps, `<ul>` for unordered items

### Accessibility and LLM Understanding Correlation

**WCAG 2.1 AA Compliance Benefits for LLMs**:
- **Alt text**: Helps LLMs understand image context
- **ARIA labels**: Provides semantic meaning for interactive elements
- **Heading hierarchy**: Enables content structure parsing
- **Link text**: Descriptive links (not "click here") help context understanding
- **Color contrast**: Ensures text is machine-readable (OCR-style processing)
- **Keyboard navigation**: Indicates logical content flow

**Existing Accessibility Baseline** (from constitution.md):
- Target: WCAG 2.1 Level AA
- Semantic HTML requirement already in principles
- Focus states required
- Color contrast ratios: 4.5:1 text, 3:1 UI components

## Feature Classification
- UI screens: false (Content/SEO optimization, no new UI components)
- Improvement: true (Enhancing existing SEO and discoverability)
- Measurable: true (Search visibility, AI citation rates, organic traffic)
- Deployment impact: true (robots.txt changes, schema.org implementation, sitemap updates)

## Key Decisions

### 1. robots.txt Strategy
**Decision**: Allow all major AI crawlers by default, provide opt-out mechanism for specific bots
**Rationale**: Maximize content visibility in AI-generated answers aligns with brand goal (thought leadership)
**Trade-off**: Potential for AI training data usage (acceptable for public blog content)

### 2. Schema.org Implementation Approach
**Decision**: Use JSON-LD format embedded in page `<head>`, not Microdata or RDFa
**Rationale**:
- JSON-LD recommended by Google, easier to maintain
- Separated from HTML structure (doesn't clutter JSX)
- Can be dynamically generated from MDX frontmatter
**Implementation**: Create reusable schema generators in `lib/schema/`

### 3. TL;DR Section Placement
**Decision**: Place TL;DR immediately after H1 title, before main content
**Rationale**:
- LLMs parse content top-to-bottom (early summaries get priority)
- Improves user experience (readers get quick overview)
- Matches reader scanning behavior (F-pattern)
**Format**: Use `<section class="tldr">` with semantic markup

### 4. Heading Hierarchy Enforcement
**Decision**: Implement automated heading structure validation in MDX processing
**Rationale**:
- Prevent heading hierarchy violations (H1 → H3 skipping H2)
- LLMs rely on logical structure for content parsing
- Accessibility requirement overlaps with LLM optimization
**Implementation**: Add remark plugin to validate heading order during build

### 5. Canonical URL Strategy
**Decision**: Always specify canonical URLs with `rel="canonical"` in `<head>` and `mainEntityOfPage` in schema
**Rationale**:
- Prevents duplicate content issues if posts syndicated elsewhere
- Signals to LLMs which version is authoritative
- SEO best practice alignment

### 6. Validation Strategy
**Decision**: Manual testing with ChatGPT, Perplexity, Claude by asking specific questions about content
**Rationale**:
- Direct validation of LLM discoverability
- Tests end-to-end user experience (search → AI answer with citation)
- Provides qualitative feedback on content structure effectiveness
**Testing Plan**: After deployment, query each AI with topic-specific questions from published posts

## Checkpoints
- Phase 0 (Specification): 2025-10-29

## Last Updated
2025-10-29T05:15:00Z

## Phase 2: Tasks (2025-10-29 00:30)

**Summary**:
- Total tasks: 30
- User story tasks: 24 (US1-US10)
- Parallel opportunities: 19 tasks marked [P]
- Setup tasks: 1
- Foundational tasks: 4
- Task file: specs/052-llm-seo-optimization/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 30
- ✅ User story organization: Complete (10 user stories across 3 priority levels)
- ✅ Dependency graph: Created (12-phase workflow)
- ✅ MVP strategy: Defined (US1-US5 only - 13 tasks)
- 📋 Ready for: /analyze

**Task Breakdown**:
- Phase 1 (Setup): 1 task - Project structure verification
- Phase 2 (Foundational): 4 tasks - Schema interfaces, type extensions, TLDRSection component
- Phase 3-7 (MVP - US1-US5): 13 tasks - robots.txt, semantic HTML, Article schema, heading validation, TL;DR integration
- Phase 8-11 (Enhancements - US6-US9): 11 tasks - FAQ schema, HowTo schema, citation formatting, canonical URLs
- Phase 12 (Validation - US10): 4 tasks - Automated validation checks
- Phase 13 (Polish): 1 task - Documentation

**REUSE Analysis**:
- 7 existing components identified for reuse (lib/schema.ts, lib/mdx.ts, lib/mdx-types.ts, blog layout, MDX components, robots.txt, sitemap)
- 5 new components to create (remark plugin, TLDRSection, FAQ schema, HowTo schema, type extensions)

**Parallelization**:
- Foundational phase: 4 parallel tasks (T002-T005)
- US6: 2 parallel tasks (T015-T016)
- US7: 2 parallel tasks (T018-T019)
- US8: 4 parallel tasks (T021-T024)
- US10: 3 parallel tasks (T026-T028)

**Next Actions**:
1. Run /analyze to validate task breakdown and identify implementation risks
2. Review dependency graph for any blocking issues
3. Confirm MVP scope (US1-US5) aligns with project goals

---

## Phase 3: Analysis (2025-10-29)

**Analysis Report**: specs/052-llm-seo-optimization/analysis-report.md

**Validation Results**:
- ✅ Cross-artifact consistency: PASSED (spec ↔ plan ↔ tasks aligned)
- ✅ Requirement coverage: 100% (20/20 requirements mapped to tasks)
- ✅ Constitution alignment: 100% (12/12 principles compliant)
- ✅ Security validation: PASSED (no auth/PII concerns)
- ✅ Performance budget: WITHIN LIMITS (NFR-001 to NFR-008 defined)
- ✅ Dependency analysis: No circular dependencies
- ✅ Quality score: 9.2/10 (Excellent)

**Issue Summary**:
- Critical issues: 0
- High issues: 0
- Medium issues: 2 (non-blocking)
- Low issues: 1 (cosmetic)

**Medium Issues**:
1. MEDIUM-001: robots.txt strategy reversal risk (Feature 051 blocked AI crawlers, Feature 052 reverses)
   - Mitigation: Validation tests (T026), inline comments explaining decision
2. MEDIUM-002: HowTo schema step extraction strategy unclear (two approaches proposed)
   - Recommendation: Use frontmatter-driven approach (Approach B) for MVP

**Low Issues**:
1. LOW-003: Content migration estimate vague (spec says 10-20 posts, plan found 5)
   - Impact: Minimal, migration is non-blocking

**Constitution Compliance**:
- Engineering principles: 8/8 aligned (specification first, testing, performance, a11y, security, code quality, docs, no overengineering)
- Brand principles: 4/4 aligned (systematic clarity, visual consistency, multi-passionate integration, teaching-first)

**Risk Assessment**: LOW (all risks mitigated)

**Status**: ✅ **READY FOR IMPLEMENTATION**

**Next Command**: /implement

**Estimated Duration**: 18-26 hours (2-3 days solo developer)

**Checkpoint**:
- ✅ Analysis complete: 2025-10-29
- ✅ Quality gates passed: All (0 critical blockers)
- ✅ Artifacts validated: spec.md, plan.md, tasks.md
- 🚀 Ready for: /implement

---

## Phase 4: Implementation (2025-10-29)

**Implementation Strategy**: Parallel batching for MVP (US1-US5)
- Batch 1: Foundational infrastructure (T002-T005) - 4 parallel tasks
- Batch 2: MVP core (T006-T007) - 2 parallel tasks
- Batch 3: Schema extension (T008-T010) - 3 sequential tasks
- Batch 4: Heading validation (T011-T012) - 2 sequential tasks
- Batch 5: TL;DR integration (T013-T014) - 2 sequential tasks

**Execution Log**:

### Batch 1: Foundational Infrastructure (COMPLETED)
**Tasks**: T002, T003, T004, T005 (4 parallel tasks)
**Status**: ✅ Complete
**Duration**: ~10 minutes
**Files Changed**:
- lib/schema.ts: Added FAQPageSchema, QuestionSchema, AnswerSchema, HowToSchema, HowToStepSchema interfaces
- lib/mdx-types.ts: Extended PostFrontmatterSchema with contentType and faq fields
- components/blog/tldr-section.tsx: NEW - TL;DR component with semantic HTML and callout styling

**Key Decisions**:
- FAQ schema: Simple Question/Answer structure, mainEntity array approach
- HowTo schema: Step array with position field for ordering flexibility
- contentType: Enum validation (standard, faq, tutorial) with default 'standard'
- TLDRSection: Reused callout styling pattern, semantic <section class="tldr"> with ARIA labels

**Completed Tasks**:
- ✅ T002: FAQ schema interfaces (lib/schema.ts)
- ✅ T003: HowTo schema interfaces (lib/schema.ts)
- ✅ T004: PostFrontmatter extension with contentType and faq fields (lib/mdx-types.ts)
- ✅ T005: TLDRSection component (components/blog/tldr-section.tsx)
