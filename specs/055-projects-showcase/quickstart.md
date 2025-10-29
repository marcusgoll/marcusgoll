# Integration Quickstart

**Feature**: Projects Showcase Page
**Created**: 2025-10-29
**Audience**: Developers implementing this feature

## Overview

This guide provides integration scenarios for adding the Projects Showcase feature to the marcusgoll.com website. Follow these steps to create `/projects` page with filtering, featured section, and MDX-based project data.

---

## Prerequisites

### Required Dependencies (Already Installed)

- `next` (≥14.0.0) - Framework
- `react` (≥18.0.0) - UI library
- `typescript` (≥5.0.0) - Type safety
- `tailwindcss` (≥3.0.0) - Styling
- `gray-matter` (≥4.0.0) - Frontmatter parsing
- `@radix-ui/react-slot` - Button component (already installed for shadcn/ui)
- `class-variance-authority` - Button variants (already installed)

### No New Dependencies Required

All functionality can be implemented with existing packages.

---

## Integration Steps

### Step 1: Create Project Type Definition

**File**: `lib/projects.ts`

**Action**: Create new file with Project interface and data fetching functions

**Pattern**: Adapt from existing `lib/posts.ts`

**Key Functions**:
```typescript
export interface Project { /* ... */ }
export function getProjectSlugs(): string[]
export function getProjectBySlug(slug: string): Project
export async function getAllProjects(): Promise<Project[]>
export async function getFeaturedProjects(): Promise<Project[]>
export async function getProjectsByCategory(category: string): Promise<Project[]>
```

**Integration**: Copy pattern from `lib/posts.ts`, replace `postsDirectory` with `projectsDirectory`

---

### Step 2: Create Project Components

**File**: `components/projects/ProjectCard.tsx`

**Action**: Create card component for grid display

**Pattern**: Adapt from `components/blog/PostCard.tsx`

**Key Changes**:
- Replace `Post` type with `Project` type
- Replace metadata (author, date) with tech stack badges
- Add conditional CTAs (Live Demo, GitHub)
- Reuse TrackBadge for category badges

**Integration**:
```typescript
import { Project } from '@/lib/projects';
import TrackBadge from '@/components/blog/TrackBadge';
import { Button } from '@/components/ui/button';

export default function ProjectCard({ project }: { project: Project }) {
  // Map project.category to TrackBadge track prop
  const track = project.category === 'aviation' ? 'aviation'
    : project.category === 'dev-startup' ? 'dev-startup'
    : 'cross-pollination';

  return (
    <Link href={`/projects/${project.slug}`} className="group...">
      {/* Copy PostCard structure, adapt fields */}
    </Link>
  );
}
```

**File**: `components/projects/FeaturedProjectCard.tsx`

**Action**: Create larger variant with metrics display

**Pattern**: Extend ProjectCard with additional sections

**File**: `components/projects/TechStackBadge.tsx`

**Action**: Create technology badge component

**Pattern**: Similar to TrackBadge, different color scheme

**File**: `components/projects/ProjectFilters.tsx`

**Action**: Create filter button group with active state

**Pattern**: New component (no existing pattern)

**File**: `components/projects/ProjectGrid.tsx`

**Action**: Create responsive grid layout

**Pattern**: Copy from `components/blog/PostGrid.tsx`, replace PostCard with ProjectCard

---

### Step 3: Create Projects Page

**File**: `app/projects/page.tsx`

**Action**: Create main projects page with filtering

**Pattern**: Adapt from `app/blog/page.tsx` or `app/page.tsx` (homepage)

**Integration**:
```typescript
import { getAllProjects, getFeaturedProjects } from '@/lib/projects';
import ProjectGrid from '@/components/projects/ProjectGrid';
import Container from '@/components/ui/Container';

export const dynamic = 'force-static';  // SSG

export default async function ProjectsPage() {
  const allProjects = await getAllProjects();
  const featuredProjects = await getFeaturedProjects();

  return (
    <Container>
      <h1>Projects</h1>

      {/* Featured Section */}
      {featuredProjects.length > 0 && (
        <section>
          <h2>Featured Projects</h2>
          {/* Render FeaturedProjectCard components */}
        </section>
      )}

      {/* Filters (client component) */}
      <ProjectFilters />

      {/* Grid */}
      <ProjectGrid projects={allProjects} />
    </Container>
  );
}
```

**Note**: Filtering requires client-side state management (see Step 5)

---

### Step 4: Create Project Content Directory

**Directory**: `content/projects/`

**Action**: Create directory and add sample MDX files

**Sample File**: `content/projects/cfipros.mdx`

```yaml
---
title: "CFIPros.com"
description: "All-in-one platform for flight instructors managing students, lessons, and training records"
category: "aviation"
techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Vercel"]
coverImage: "/images/projects/cfipros.png"
liveUrl: "https://cfipros.com"
githubUrl: "https://github.com/marcusgoll/cfipros"
featured: true
dateCreated: "2024-03-15"
metrics:
  users: "200+ CFIs"
  impact: "Saves 5 hours/week"
  outcome: "40% reduction in errors"
---

## Problem

Flight instructors juggle spreadsheets, paper logbooks, and disparate tools...

## Solution

A modern web platform that automates administrative tasks...

[... rest of content ...]
```

**Required Images**: Add project screenshots to `public/images/projects/`
- Aspect ratio: 16:9 (1200x675px recommended)
- Format: PNG or JPG (<500KB each)

---

### Step 5: Implement Client-Side Filtering

**File**: `app/projects/page.tsx`

**Action**: Add client-side filtering with URL sync

**Pattern**: Use `useSearchParams` and `useRouter` from Next.js

**Implementation**:
```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProjectsPage({ allProjects, featuredProjects }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('category') || 'all';

  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(
        allProjects.filter(p => p.category === activeFilter)
      );
    }
  }, [activeFilter, allProjects]);

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === 'all') {
      params.delete('category');
    } else {
      params.set('category', filter);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <>
      <ProjectFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <ProjectGrid projects={filteredProjects} />
    </>
  );
}
```

**Alternative**: Use Server Components with `searchParams` prop (recommended for SSG)

---

### Step 6: Add JSON-LD Schema (Optional, P2)

**File**: `lib/schema.ts`

**Action**: Add `generateCollectionPageSchema()` function

**Pattern**: Follow existing `generatePersonSchema()` pattern

**Integration**:
```typescript
// lib/schema.ts
export function generateCollectionPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects',
    description: 'Portfolio of aviation, development, and cross-pollination work',
    url: 'https://marcusgoll.com/projects',
    // ...
  };
}

// app/projects/page.tsx
const schema = generateCollectionPageSchema();

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    {/* ... page content */}
  </>
);
```

---

### Step 7: Update Navigation (Optional)

**File**: `components/layout/Header.tsx` or `app/layout.tsx`

**Action**: Add "Projects" link to main navigation

**Integration**:
```typescript
<nav>
  <Link href="/">Home</Link>
  <Link href="/blog">Blog</Link>
  <Link href="/projects">Projects</Link>  {/* New */}
  <Link href="/about">About</Link>
  <Link href="/contact">Contact</Link>
</nav>
```

---

## Developer Workflows

### Adding a New Project

**Steps**:
1. Create screenshot (1200x675px, 16:9 aspect ratio)
2. Save to `public/images/projects/[slug].png`
3. Create MDX file `content/projects/[slug].mdx`
4. Fill in frontmatter (see data-model.md for schema)
5. Write project content (Problem, Solution, Tech Stack, etc.)
6. Commit and push (project appears on next build)

**Example**:
```bash
# 1. Add screenshot
cp ~/Downloads/my-project.png public/images/projects/my-project.png

# 2. Create MDX file
touch content/projects/my-project.mdx

# 3. Edit frontmatter and content
code content/projects/my-project.mdx

# 4. Commit
git add public/images/projects/my-project.png content/projects/my-project.mdx
git commit -m "feat: add My Project to portfolio"
git push
```

### Updating a Project

**Steps**:
1. Edit MDX file in `content/projects/[slug].mdx`
2. Update frontmatter or content
3. Commit and push (changes appear on next build)

**Example**:
```bash
# 1. Edit project
code content/projects/cfipros.mdx

# 2. Update metrics
# metrics:
#   users: "250+ CFIs"  # Updated from 200+

# 3. Commit
git add content/projects/cfipros.mdx
git commit -m "docs: update CFIPros user metrics"
git push
```

### Marking a Project as Featured

**Steps**:
1. Open MDX file
2. Set `featured: true` in frontmatter
3. Add `metrics` object with users/impact/outcome
4. Ensure only 3 projects are featured (unfeature others if needed)
5. Commit and push

**Example**:
```yaml
---
featured: true
metrics:
  users: "100+ users"
  impact: "$5k MRR"
  outcome: "50% time savings"
---
```

---

## Testing Scenarios

### Scenario 1: Load All Projects

**Goal**: Verify all projects load correctly on `/projects` page

**Steps**:
1. Navigate to `http://localhost:3000/projects`
2. Verify all projects display in grid
3. Check that featured projects appear in featured section
4. Verify all images load without errors

**Expected**: All projects visible, no broken images, featured section populated

---

### Scenario 2: Filter by Category

**Goal**: Verify filtering works correctly

**Steps**:
1. Navigate to `/projects`
2. Click "Aviation" filter button
3. Verify only aviation projects display
4. Check URL updates to `/projects?category=aviation`
5. Refresh page, verify filter persists
6. Click "All Projects" to reset

**Expected**: Filtered view shows only matching projects, URL syncs, filter persists on refresh

---

### Scenario 3: Empty Filter State

**Goal**: Verify empty state displays when no projects match filter

**Steps**:
1. Remove all projects from a specific category (e.g., delete all aviation MDX files)
2. Navigate to `/projects?category=aviation`
3. Verify empty state message displays
4. Check "View All Projects" button resets filter

**Expected**: "No projects found in this category" message, recovery action works

---

### Scenario 4: Click Project Card

**Goal**: Verify navigation to project detail page (P2 story)

**Steps**:
1. Navigate to `/projects`
2. Click on a project card
3. Verify navigation to `/projects/[slug]`
4. Check that project detail page loads correctly

**Expected**: Navigation works, detail page displays project content

**Note**: Detail page implementation is Priority 2 (P2) story

---

### Scenario 5: Keyboard Navigation

**Goal**: Verify accessibility for keyboard users

**Steps**:
1. Navigate to `/projects`
2. Press Tab to focus on first interactive element (filter button)
3. Use Tab to navigate through filters, project cards, CTAs
4. Press Enter on filter button to activate
5. Verify focus indicator visible on all elements

**Expected**: All interactive elements keyboard accessible, focus indicators visible

---

### Scenario 6: Screen Reader Announcements

**Goal**: Verify screen reader support

**Steps**:
1. Enable screen reader (NVDA on Windows, VoiceOver on macOS)
2. Navigate to `/projects`
3. Activate "Aviation" filter
4. Verify screen reader announces: "Aviation filter active, showing 4 projects"
5. Navigate to project card, verify link label announced

**Expected**: Filter changes announced, card links have descriptive labels

---

## Performance Checklist

### Build-Time Optimization

- [ ] All images optimized (<500KB each)
- [ ] Images in `public/images/projects/` directory
- [ ] MDX files validated (no missing required fields)
- [ ] Tech stack arrays have 2-10 items
- [ ] Featured projects have metrics populated

### Runtime Optimization

- [ ] Featured images use `loading="eager"` and `priority={true}`
- [ ] Grid images use `loading="lazy"` (below fold)
- [ ] All images have `width` and `height` attributes (prevent CLS)
- [ ] Client components minimal (only ProjectFilters needs client-side state)
- [ ] Server components used for static content (ProjectCard, ProjectGrid)

### Lighthouse Targets

- [ ] Performance ≥85
- [ ] Accessibility ≥95
- [ ] Best Practices ≥90
- [ ] SEO ≥95

**Run Lighthouse**:
```bash
npm run build
npm start
# Open Chrome DevTools > Lighthouse > Run audit
```

---

## Troubleshooting

### Issue 1: Projects Not Loading

**Symptom**: `/projects` page shows "No projects found"

**Causes**:
- `content/projects/` directory empty or missing
- MDX files have parsing errors
- Frontmatter missing required fields

**Solution**:
1. Check `content/projects/` directory exists
2. Verify at least one `.mdx` file present
3. Run build to see frontmatter validation errors
4. Fix missing fields in MDX files

---

### Issue 2: Images Not Displaying

**Symptom**: Broken image placeholders on project cards

**Causes**:
- `coverImage` path incorrect in frontmatter
- Image file missing from `public/images/projects/`
- Image path doesn't start with `/`

**Solution**:
1. Verify image exists in `public/images/projects/[slug].png`
2. Check `coverImage` path starts with `/` (e.g., `/images/projects/cfipros.png`)
3. Ensure filename matches (case-sensitive on Linux)

---

### Issue 3: Filtering Not Working

**Symptom**: Clicking filter buttons does nothing

**Causes**:
- `ProjectFilters` component not passing `onFilterChange` callback
- URL routing not updating
- `searchParams` not syncing with component state

**Solution**:
1. Verify `useRouter` and `useSearchParams` imported from `next/navigation`
2. Check `handleFilterChange` function updates URL correctly
3. Ensure `useEffect` hook listens to `searchParams` changes

---

### Issue 4: CLS (Layout Shift) on Image Load

**Symptom**: Lighthouse reports high CLS (>0.15)

**Causes**:
- Images missing `width` and `height` attributes
- Images loading without blur placeholder
- Grid layout shifts during image load

**Solution**:
1. Add `width={1200}` and `height={675}` to all Image components
2. Add `placeholder="blur"` and `blurDataURL={shimmerDataURL(1200, 675)}`
3. Use `aspect-video` class on image container

---

### Issue 5: Featured Section Empty

**Symptom**: Featured section doesn't appear on page

**Causes**:
- No projects have `featured: true` in frontmatter
- Featured projects missing `metrics` field
- `getFeaturedProjects()` filtering incorrectly

**Solution**:
1. Set at least one project to `featured: true`
2. Add `metrics` object to featured projects
3. Verify `getFeaturedProjects()` filters by `featured && metrics`

---

## API Reference

### `lib/projects.ts`

#### `getAllProjects()`

**Description**: Load all projects from `content/projects/`, sorted by date descending

**Returns**: `Promise<Project[]>`

**Usage**:
```typescript
const projects = await getAllProjects();
```

---

#### `getProjectBySlug(slug: string)`

**Description**: Load single project by slug

**Parameters**:
- `slug` (string) - Project slug (filename without `.mdx`)

**Returns**: `Project`

**Usage**:
```typescript
const project = getProjectBySlug('cfipros');
```

---

#### `getFeaturedProjects()`

**Description**: Load featured projects (max 3)

**Returns**: `Promise<Project[]>`

**Usage**:
```typescript
const featured = await getFeaturedProjects();
```

---

#### `getProjectsByCategory(category: string)`

**Description**: Load projects by category

**Parameters**:
- `category` (string) - One of `'aviation'`, `'dev-startup'`, `'cross-pollination'`

**Returns**: `Promise<Project[]>`

**Usage**:
```typescript
const aviationProjects = await getProjectsByCategory('aviation');
```

---

#### `getProjectSlugs()`

**Description**: Get all project slugs for static path generation

**Returns**: `string[]`

**Usage**:
```typescript
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map(slug => ({ slug }));
}
```

---

## Next Steps

1. **Phase 2 (Tasks)**: Generate task breakdown with acceptance criteria
2. **Phase 3 (Validation)**: Cross-artifact consistency check
3. **Phase 4 (Implementation)**: Execute tasks with TDD workflow
4. **Phase 5 (Optimization)**: Code review, performance audit, accessibility check
5. **Phase 6 (Deployment)**: Ship to staging, validate, promote to production

---

**Last Updated**: 2025-10-29
