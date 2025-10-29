# Feature: JSON-LD Structured Data

## Overview
Implement comprehensive Schema.org structured data (JSON-LD) for all page types to improve SERP appearance and search visibility. Generate dynamically from MDX frontmatter and constitution. Support dual-track content tagging (aviation/dev/hybrid categories).

## Research Findings

### Existing Schema.org Implementation
- **Current State**: BlogPosting and BreadcrumbList schemas already implemented (lib/schema.ts)
- **Blog posts**: generateBlogPostingSchema() generates BlogPosting with headline, datePublished, dateModified, author, image, articleBody, wordCount, mainEntityOfPage
- **Breadcrumbs**: generateBreadcrumbListSchema() for navigation hierarchy
- **Extended schemas**: FAQPage and HowTo interfaces defined but not yet used
- **Integration**: BlogPosting schema embedded in app/blog/[slug]/page.tsx

### MDX Frontmatter Structure
Source: content/posts/*.mdx
```yaml
slug: string
title: string
excerpt: string
date: ISO 8601
author: string
featuredImage: path or URL
tags: array of strings
featured: boolean (optional)
draft: boolean (optional)
```

### Constitution Data
Source: .spec-flow/memory/constitution.md
- **Brand Mission**: Help pilots advance aviation careers + teach developers systematic thinking
- **Brand Essence**: Systematic Mastery
- **Author**: Marcus Gollahon
- **Website**: https://marcusgoll.com
- **Social**: @marcusgoll (Twitter)
- **Visual Identity**: Navy 900 (#0F172A), Emerald 600 (#059669), Work Sans/JetBrains Mono
- **Content Mix**: 40% aviation, 40% dev/startup, 20% cross-pollination

### Tech Stack
Source: package.json, lib/mdx.ts
- **Framework**: Next.js 16.0.1 (App Router, React 19.2.0)
- **MDX**: @mdx-js/react 3.1.1, next-mdx-remote 5.0.0
- **Content**: MDX files in content/posts/, parsed with gray-matter
- **Deployment**: Hetzner VPS with PM2 (SSH accessible via 'ssh hetzner')

### Similar Features
- Feature 002: Blog post enhancements (existing BlogPosting schema)
- Feature 050: LLM SEO optimization (TL;DR sections, FAQ/HowTo schemas planned)

### Key Insights
1. **Existing foundation**: BlogPosting and BreadcrumbList already work - need to add Person, Website, Organization
2. **Dynamic generation**: Must extract from frontmatter (tags for categories, author from constitution)
3. **Dual-track tagging**: Use tags array to categorize aviation/dev/hybrid (e.g., "aviation", "development", "leadership")
4. **Validation**: Google Rich Results Test and Schema.org validator required
5. **No new database**: All data sourced from MDX frontmatter + constitution

## System Components Analysis
**Reusable (from existing codebase)**:
- lib/schema.ts (existing schema generation utilities)
- lib/mdx.ts (MDX parsing and frontmatter extraction)
- app/blog/[slug]/page.tsx (schema embedding pattern)

**New Components Needed**:
- generatePersonSchema() for About page
- generateWebsiteSchema() for homepage with search action
- generateOrganizationSchema() for personal brand
- Category inference logic from tags (aviation/dev/hybrid)

**Rationale**: Extend existing schema.ts module rather than create new files. Follow established pattern from BlogPosting implementation.

## Feature Classification
- UI screens: false (no UI components, backend/data only)
- Improvement: false (new feature, not improving existing)
- Measurable: true (SERP CTR, rich result appearances trackable)
- Deployment impact: false (no infrastructure changes, env vars, or migrations)

## Checkpoints
- Phase 0 (Specification): 2025-10-29
- Phase 2 (Tasks): 2025-10-29

## Phase 2: Tasks (2025-10-29 01:30)

**Summary**:
- Total tasks: 30
- User story tasks: 18 (US1: 4, US2: 4, US3: 5, US4: 5)
- Parallel opportunities: 17 tasks marked [P]
- Setup tasks: 2
- Foundational tasks: 2
- Polish tasks: 8
- Task file: specs/053-json-ld-structured-data/tasks.md

**Task Breakdown**:
- Phase 1 (Setup): 2 tasks - Project structure and dependency verification
- Phase 2 (Foundational): 2 tasks - mapTagsToCategory() utility, constitution data extraction
- Phase 3 (US1 - BlogPosting): 4 tasks - Extend BlogPosting with articleSection, unit tests
- Phase 4 (US2 - Website): 4 tasks - Website schema on homepage with SearchAction, unit tests
- Phase 5 (US3 - Person): 5 tasks - Person schema on About page, unit tests, page creation
- Phase 6 (US4 - Organization): 5 tasks - Organization schema on all pages, unit tests
- Phase 7 (Polish): 8 tasks - Manual validation (Google/Schema.org), documentation, deployment prep

**Checkpoint**:
- ✅ Tasks generated: 30
- ✅ User story organization: Complete (US1-US4 with independent test criteria)
- ✅ Dependency graph: Created (Phase 2 blocks all stories, US3 blocks US4)
- ✅ MVP strategy: Defined (US1-US3 for first release, US4 as enhancement)
- ✅ Parallel opportunities: 17 tasks can run in parallel (different files, no deps)
- 📋 Ready for: /analyze

## Phase 4: Implementation (2025-10-29)

### Batch 1: Setup + Foundational (4 tasks - COMPLETED)

- ✅ T001: Verify project structure - lib/schema.ts, lib/mdx.ts, package.json all present
- ✅ T002: Verify dependencies - gray-matter and zod confirmed in package.json
- ✅ T005: Create mapTagsToCategory() utility - Implemented in lib/schema.ts with priority-based mapping (Aviation > Development > Leadership > Blog)
- ✅ T006: Create constitution data extraction utility - Implemented getConstitutionData() with caching, extracts brand mission from constitution.md

**Key Decisions**:
- Used synchronous fs.readFileSync() for build-time data extraction (acceptable for SSG)
- Implemented caching to avoid repeated file reads
- Added fallback data for constitution.md accessibility issues
- Extended keyword lists for robust tag matching (aviation: 7 keywords, dev: 10 keywords, leadership: 5 keywords)

**Files Changed**: lib/schema.ts (+126 lines)

**Checkpoint**: Ready for Batch 2 (US1 implementation)

### Batch 2: US1 BlogPosting Schema (4 tasks - COMPLETED)

- ✅ T010: Unit tests for mapTagsToCategory() - 11 tests, all passing (priority order, case-insensitive, edge cases)
- ✅ T011: Unit tests for BlogPosting articleSection - 4 tests, all passing (aviation, dev, unknown tags, missing tags)
- ✅ T015: Extend BlogPostingSchema interface with articleSection field
- ✅ T016: Extend generateBlogPostingSchema() to use mapTagsToCategory()

**Test Results**: 15/15 tests passing (100% pass rate)

**Key Decisions**:
- Added 4 comprehensive tests for articleSection field covering all tag categories
- Used mock PostData objects following existing mdx-types interface
- Verified edge case: missing tags array defaults to Blog category

**Files Changed**:
- lib/schema.ts (+5 lines - interface extension, +3 lines - implementation)
- lib/__tests__/schema.test.ts (+91 lines - new file)

**Checkpoint**: Ready for Batch 3 (US2 Website schema)

### Batch 3-5: All Schema Implementations (COMPLETED)

Batches 3, 4, and 5 were completed together as the interfaces and generators were all added to lib/schema.ts in one pass for efficiency.

**Batch 3 (US2 - Website Schema):**
- ✅ T020: Unit tests for generateWebsiteSchema() - 3 tests (required fields, SearchAction, placeholder)
- ✅ T025: Create WebsiteSchema interface in lib/schema.ts
- ✅ T026: Create generateWebsiteSchema() function with SearchAction
- ✅ T027: Embed Website schema in app/page.tsx (homepage)

**Batch 4 (US3 - Person Schema):**
- ✅ T030: Unit tests for generatePersonSchema() - 3 tests (required fields, sameAs, knowsAbout)
- ✅ T035: Create PersonSchema interface in lib/schema.ts
- ✅ T036: Create generatePersonSchema() function using getConstitutionData()
- ✅ T037: Create app/about/page.tsx with content
- ✅ T038: Embed Person schema in app/about/page.tsx

**Batch 5 (US4 - Organization Schema):**
- ✅ T040: Unit tests for generateOrganizationSchema() - 5 tests (required fields, sameAs, founder options, consistency)
- ✅ T045: Create OrganizationSchema interface in lib/schema.ts
- ✅ T046: Create generateOrganizationSchema() function with optional founder
- ✅ T047: Embed Organization schema in app/blog/[slug]/page.tsx
- ✅ T048: Embed Organization schema in app/page.tsx (homepage)

**Test Results**: 26/26 tests passing (100% pass rate)
- mapTagsToCategory: 11 tests
- BlogPosting articleSection: 4 tests
- Website schema: 3 tests
- Person schema: 3 tests
- Organization schema: 5 tests

**Key Decisions**:
- Added all 3 schema interfaces (Website, Person, Organization) to lib/schema.ts in single pass
- WebsiteSchema uses SearchAction with EntryPoint for SERP search box eligibility
- PersonSchema includes knowsAbout field for expertise areas (Aviation, Software Development, etc.)
- OrganizationSchema has optional founder parameter - true on About page, false elsewhere
- About page created as simple prose-styled content page with dual-track bio
- Organization schema embedded on homepage and all blog posts for unified brand presence

**Files Changed**:
- lib/schema.ts (+119 lines - 3 interfaces, 3 generator functions)
- lib/__tests__/schema.test.ts (+119 lines - 14 new tests for Website/Person/Organization)
- app/page.tsx (+11 lines - Website + Organization schemas)
- app/about/page.tsx (+143 lines - new file with Person + Organization schemas)
- app/blog/[slug]/page.tsx (+8 lines - Organization schema addition)

**Checkpoint**: Ready for Batch 6 (Manual validation and documentation)

## Last Updated
2025-10-29T01:30:00-04:00
