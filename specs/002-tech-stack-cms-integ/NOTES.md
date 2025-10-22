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

## Last Updated

2025-10-21T22:35:00Z
