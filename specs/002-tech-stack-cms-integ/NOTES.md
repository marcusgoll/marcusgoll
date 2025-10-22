# Feature: Tech Stack CMS Integration (MDX)

## Overview

Migrate from Ghost CMS (current headless CMS) to local MDX-based content management for blog posts. This transition provides version-controlled content, eliminates external CMS dependencies, and enables richer content experiences with React components.

## Research Findings

### Current State Analysis

**Existing Ghost CMS Integration**:
- Source: `lib/ghost.ts` (analysis performed 2025-10-21)
- Current setup: Ghost Content API client configured for `ghost.marcusgoll.com`
- Dependencies: `@tryghost/content-api@1.12.0` (package.json:21)
- Functions: getPosts, getPostBySlug, getPostsByTag, getTags, getPages
- Type definitions: GhostPost, GhostAuthor, GhostTag, GhostPage interfaces

**Project Context**:
- Framework: Next.js 15 with App Router (package.json:24, README.md:9)
- Database: Self-hosted Supabase (PostgreSQL) with Prisma ORM
- Content Strategy: README.md states "Content: Markdown/MDX for blog posts" (line 13)
- Finding: README indicates MDX is planned, but Ghost CMS is currently implemented
- Conclusion: This feature represents a planned migration from Ghost → MDX

**Tech Stack** (package.json):
- Next.js: ^15.5.6 (App Router architecture)
- React: ^19.2.0
- TypeScript: ^5.9.3
- Prisma: ^6.17.1
- Tailwind CSS: ^4.1.15

### System Components Analysis

**No UI Inventory Check Performed**: Backend/content infrastructure feature (no UI components)

### Feature Classification

- UI screens: false (content infrastructure, not user-facing UI)
- Improvement: true (migrating from Ghost CMS to MDX)
- Measurable: false (infrastructure change, no direct user behavior tracking)
- Deployment impact: true (removing Ghost dependency, adding MDX processing)

### Industry Research

**MDX Integration Patterns** (inferred from Next.js best practices):
- Common approach: `@next/mdx` package for MDX support in Next.js App Router
- Content location: `content/` or `app/(content)/` directories
- Frontmatter: YAML frontmatter for metadata (title, date, tags, author)
- Processing: Remark/Rehype plugins for markdown enhancement
- Performance: Static generation for blog posts (ISR for dynamic content)

**Architectural Decision**: Local file-based CMS vs. Headless CMS
- Ghost CMS (current): External dependency, rich admin UI, API overhead
- MDX (proposed): Version-controlled, zero external deps, React components in content
- Tradeoff: MDX requires Git for content management vs. Ghost's user-friendly admin panel

### Key Decisions

1. **Migration Strategy**: Maintain backward compatibility by keeping existing Ghost integration until MDX is fully validated
2. **Content Location**: Store MDX files in `content/posts/` directory at project root
3. **Metadata Format**: Use YAML frontmatter for post metadata (consistent with Jekyll/Hugo conventions)
4. **Processing Pipeline**: Use `@next/mdx` with gray-matter for frontmatter parsing
5. **Route Structure**: Preserve existing `/blog/[slug]` URL structure for SEO continuity

## Checkpoints

- Phase 0 (Specification): 2025-10-21
- Phase 2 (Tasks): 2025-10-21

### Phase 2: Tasks (2025-10-21 22:48)

**Summary**:
- Total tasks: 29
- User story tasks: 25 (organized by priority P1, P2)
- Parallel opportunities: 15 tasks marked [P]
- Setup tasks: 3 (Phase 1)
- Foundational tasks: 3 (Phase 2)
- MVP tasks: 18 (US1-US3, Phases 3-5)
- Enhancement tasks: 7 (US4-US5, Phases 6-7)
- Polish tasks: 4 (Phase 8)
- Task file: specs/002-tech-stack-cms-integ/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 29
- ✅ User story organization: Complete (US1-US5)
- ✅ Dependency graph: Created (8-phase workflow)
- ✅ MVP strategy: Defined (US1-US3 = 18 tasks, 19-24 hours)
- ✅ REUSE analysis: 5 existing components identified
- 📋 Ready for: /analyze

## Implementation Progress

### Phase 4: Implementation (2025-10-21)

**Batch 1: Setup - COMPLETE**
- ✅ T001: Install MDX dependencies (@next/mdx, @mdx-js/loader, @mdx-js/react, gray-matter, rehype-highlight, remark-gfm, zod, feed)
- ✅ T002: Install migration dependencies (turndown, @tryghost/admin-api)
- ✅ T003: Configure MDX support in next.config.ts (remarkGfm, rehypeHighlight plugins)

**Batch 2: Foundational - COMPLETE**
- ✅ T005: Create content directory structure (content/posts/, public/images/posts/)
- ✅ T006: Create TypeScript types and Zod schemas (lib/mdx-types.ts)
- ✅ T007: Create core MDX parsing library (lib/mdx.ts with getAllPosts, getPostBySlug, getPostsByTag, getAllTags, searchPosts)

## Last Updated

2025-10-21T22:48:00Z
