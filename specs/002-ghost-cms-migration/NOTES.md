# Feature: Ghost CMS Migration to Next.js

## Overview

This feature involves migrating the personal website/blog (marcusgoll.com) from a standalone setup to a headless Ghost CMS + Next.js architecture. The migration will enable systematic content management for dual-track brand content (Aviation + Dev/Startup) while maintaining full control over frontend design and user experience.

## Research Findings

### Finding 1: Existing Implementation Documentation
**Source**: `docs/GHOST_NEXTJS_IMPLEMENTATION.md`
**Details**: Comprehensive implementation guide already exists covering:
- Ghost tag structure for dual-track content (aviation, dev-startup, cross-pollination)
- Component architecture with Next.js
- Ghost Content API integration patterns
- Analytics tracking for content tracks
- Week-by-week implementation timeline

**Decision**: Use existing implementation guide as reference architecture

### Finding 2: Current Tech Stack
**Source**: `package.json:14-19`
**Tech Stack**:
- Next.js 15.5.6 (frontend framework)
- React 19.2.0
- @tryghost/content-api 1.12.0 (already installed!)
- Tailwind CSS 4.1.15 for styling

**Decision**: Ghost Content API package already installed - integration layer exists

### Finding 3: Brand Standards
**Source**: `.spec-flow/memory/constitution.md:375-498`
**Brand Identity**:
- **Mission**: "I help pilots advance their aviation careers and teach developers to build with systematic thinking"
- **Colors**: Navy 900 `#0F172A` (primary), Emerald 600 `#059669` (secondary)
- **Typography**: Work Sans (headings/body), JetBrains Mono (code)
- **Content Strategy**: 40% aviation, 40% dev/startup, 20% cross-pollination
- **Accessibility**: WCAG 2.1 AA minimum (4.5:1 contrast, keyboard nav)

**Decision**: All UI components must adhere to defined brand standards

### Finding 4: Ghost API Client Already Exists
**Source**: `lib/ghost.ts:1-904`
**Existing Functions**:
- `getPostsByTag(tagSlug, limit)` - Filter posts by tag
- `getAviationPosts(limit)` - Aviation content
- `getDevStartupPosts(limit)` - Dev/Startup content
- `getAllPosts(limit)` - All content
- `getPostBySlug(slug)` - Single post retrieval
- `getPrimaryTrack(tags)` - Helper to determine content track

**Decision**: Ghost API integration layer already built - migration focuses on Ghost CMS setup and content organization

### Finding 5: Performance Budgets
**Source**: `.spec-flow/memory/constitution.md:543-558`
**Requirements**:
- Page loads: <2s First Contentful Paint, <3s Largest Contentful Paint
- API responses: <200ms p50, <500ms p95
- Database queries: <50ms reads, <100ms writes

**Decision**: Use ISR (Incremental Static Regeneration) to minimize API calls and meet performance targets

### Finding 6: Deployment Model
**Source**: `specs/002-ghost-cms-migration/workflow-state.yaml:13`
**Model**: remote-direct
**Implication**: Direct production deployment without staging environment

**Decision**: Pre-deployment testing critical - use preview gate rigorously

## System Components Analysis

**Reusable (from existing codebase)**:
- Ghost API client (`lib/ghost.ts`)
- Next.js page routing structure
- Tailwind CSS configuration
- Package dependencies (@tryghost/content-api)

**New Components Needed**:
- Ghost Admin configuration (tags, navigation)
- TrackBadge component (for aviation/dev/cross-pollination badges)
- DualTrackShowcase component (homepage feature sections)
- Aviation hub page (`pages/aviation.tsx`)
- Dev/Startup hub page (`pages/dev-startup.tsx`)
- Hero component with dual-track CTA
- PostCard component with track badges
- Analytics tracking functions (`lib/analytics.ts`)

**Rationale**: System-first approach - leverage existing Ghost API client, build UI components following brand guidelines

## Feature Classification

- UI screens: true (homepage, hub pages, post templates)
- Improvement: false (new architecture, not improving existing)
- Measurable: true (content track engagement, newsletter signups)
- Deployment impact: true (environment variables, content migration)

## Checkpoints

- Phase 0 (Specification): 2025-10-21

## Last Updated

2025-10-21T00:00:00Z
