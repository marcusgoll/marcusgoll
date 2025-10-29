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

## Last Updated
2025-10-29T01:14:00-04:00
