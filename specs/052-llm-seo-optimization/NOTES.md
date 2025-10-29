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
