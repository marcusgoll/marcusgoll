# Research & Design Decisions

**Feature**: Projects Showcase Page
**Created**: 2025-10-29
**Phase**: Planning

## Component Reuse Analysis

### Existing Components (Reusable)

**1. Container (`components/ui/Container.tsx`)**
- **Purpose**: Max-width page wrapper with consistent horizontal padding
- **Current Usage**: About page, blog pages
- **Reuse Strategy**: Direct reuse for `/projects` page wrapper
- **Props**: `children: ReactNode`, `className?: string`
- **Styles**: `max-w-[1280px]`, responsive padding (`px-4 md:px-6`)

**2. Button (`components/ui/button.tsx`)**
- **Purpose**: Shadcn button with variant system
- **Current Usage**: CTA buttons across site
- **Reuse Strategy**: Use for project card CTAs ("View Live Demo", "View on GitHub")
- **Variants**: `default`, `outline`, `secondary`, `ghost`, `link`
- **Sizes**: `default` (h-9), `sm` (h-8), `lg` (h-10)
- **Accessibility**: Focus-visible outline, disabled states

**3. TrackBadge (`components/blog/TrackBadge.tsx`)**
- **Purpose**: Content track badges with brand colors
- **Current Usage**: Blog post cards (aviation, dev-startup, cross-pollination)
- **Reuse Strategy**: Direct reuse for project category badges
- **Mapping**:
  - `aviation` → Navy/Sky Blue (#0EA5E9)
  - `dev-startup` → Emerald (#059669)
  - `cross-pollination` → Gradient (Sky Blue → Emerald)
- **Props**: `track: 'aviation' | 'dev-startup' | 'cross-pollination' | null`

**4. PostCard (`components/blog/PostCard.tsx`) → Adapt to ProjectCard**
- **Purpose**: Card pattern with image, title, excerpt, metadata, CTAs
- **Current Usage**: Blog grid
- **Reuse Strategy**: Copy pattern structure, adapt for project data
- **Key Features**:
  - 16:9 aspect ratio image with hover zoom (`group-hover:scale-105`)
  - Link wrapper with card hover lift (`hover:shadow-lg`)
  - Track badge integration
  - Title with 2-line clamp
  - Excerpt with line clamp
  - Metadata footer (date, reading time)
- **Adaptations Needed**:
  - Replace `Post` type with `Project` type
  - Replace metadata (author, date, reading time) with tech stack badges
  - Add conditional CTAs (Live Demo, GitHub)
  - Remove excerpt line clamp (1-sentence description always fits)

**5. PostGrid (`components/blog/PostGrid.tsx`) → Adapt to ProjectGrid**
- **Purpose**: Responsive 1-2-3 column grid layout
- **Current Usage**: Blog listing pages
- **Reuse Strategy**: Copy grid pattern, replace `PostCard` with `ProjectCard`
- **Grid Breakpoints**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Gap**: `gap-6` (1.5rem)
- **Empty State**: "No posts found" message (adapt to "No projects found")

**6. MDX Pattern (`lib/posts.ts`) → Adapt to `lib/projects.ts`**
- **Purpose**: Load MDX files from content directory with frontmatter
- **Current Usage**: Blog posts from `content/posts/`
- **Reuse Strategy**: Copy pattern, adapt for `content/projects/`
- **Key Functions**:
  - `getProjectSlugs()` - List all project MDX files
  - `getProjectBySlug(slug)` - Load single project with frontmatter
  - `getAllProjects()` - Load all projects, sort by date
  - `getProjectsByCategory(category)` - Filter by Aviation/Dev/Hybrid
  - `getFeaturedProjects()` - Filter by `featured: true`

### New Components (To Build)

**1. ProjectCard (`components/projects/ProjectCard.tsx`)**
- **Purpose**: Display project preview in grid
- **Extends**: PostCard pattern
- **Props**:
  - `project: Project` (type from `lib/projects.ts`)
  - `className?: string`
- **Features**:
  - Cover image (16:9, lazy-loaded below fold)
  - Category badge (TrackBadge component)
  - Title (text-xl, font-bold, 2-line clamp)
  - Description (1-sentence, text-gray-300)
  - Tech stack badges (max 4 visible, +N indicator)
  - CTA buttons (Live Demo + GitHub, conditional on URLs)
  - Hover effects (lift card + zoom image)
- **Accessibility**:
  - Card is clickable link wrapper
  - Buttons have aria-label for external links
  - Image has descriptive alt from `project.title`

**2. FeaturedProjectCard (`components/projects/FeaturedProjectCard.tsx`)**
- **Purpose**: Display flagship project with metrics
- **Extends**: ProjectCard pattern (larger variant)
- **Props**:
  - `project: Project` (with `metrics` field required)
  - `className?: string`
- **Features**:
  - Larger layout (full-width or 2-column)
  - Expanded description (2-3 sentences, no clamp)
  - Metrics display (users, impact, outcome) with icons/badges
  - Prominent CTAs (larger buttons, lg size)
  - Visual distinction (border accent or shadow)
- **Accessibility**:
  - Metrics labeled for screen readers
  - Maintains card keyboard navigation

**3. TechStackBadge (`components/projects/TechStackBadge.tsx`)**
- **Purpose**: Display technology/framework name as badge
- **Props**:
  - `tech: string` (e.g., "Next.js", "TypeScript")
  - `colorScheme?: 'frontend' | 'backend' | 'database' | 'deployment'`
- **Features**:
  - Rounded badge (`px-3 py-1`, `rounded-full`)
  - Color-coded by type:
    - Frontend: Blue (`bg-blue-900/30`, `text-blue-300`)
    - Backend: Green (`bg-green-900/30`, `text-green-300`)
    - Database: Purple (`bg-purple-900/30`, `text-purple-300`)
    - Deployment: Orange (`bg-orange-900/30`, `text-orange-300`)
  - Small text (`text-sm`)
  - Subtle background (30% opacity)
- **Accessibility**:
  - Semantic color names in aria-label if needed

**4. ProjectFilters (`components/projects/ProjectFilters.tsx`)**
- **Purpose**: Filter button group with active state
- **Props**:
  - `activeFilter: 'all' | 'aviation' | 'dev-startup' | 'cross-pollination'`
  - `onFilterChange: (filter: string) => void`
- **Features**:
  - Horizontal button group (`flex`, `gap-2`)
  - Active state colors:
    - Aviation → Sky Blue background
    - Dev/Startup → Emerald 600 background
    - Cross-pollination → Purple background
    - All → Gray outline (neutral)
  - Inactive state: Gray outline (`border-gray-500`)
  - Responsive: Stack on mobile or horizontal scroll
- **Accessibility**:
  - Active filter has `aria-pressed="true"`
  - Filter change announced to screen readers
  - Keyboard navigation (Tab through buttons, Enter to activate)

### JSON-LD Schema Pattern

**Current Usage** (from about page analysis):
- `generatePersonSchema()` from `lib/schema.ts`
- `generateOrganizationSchema()` from `lib/schema.ts`
- Embedded in page via `<script type="application/ld+json">`

**Reuse Strategy for Projects**:
- Create `generateCollectionPageSchema()` for `/projects` page
- Create `generateCreativeWorkSchema(project)` for individual project pages (P2)
- Schema types:
  - `CollectionPage` for main projects grid
  - `WebSite` or `WebPage` for project detail pages
  - `CreativeWork` for each project entity

---

## Data Model Design

### Project Interface (TypeScript)

```typescript
export interface Project {
  // Core metadata
  slug: string;                // URL-safe identifier (e.g., "cfipros")
  title: string;               // Display name (e.g., "CFIPros.com")
  description: string;         // 1-sentence excerpt for cards

  // Categorization
  category: 'aviation' | 'dev-startup' | 'cross-pollination';

  // Technology
  techStack: string[];         // Array of technologies (e.g., ["Next.js", "TypeScript", "Prisma"])

  // Media
  coverImage: string;          // Path to screenshot (1200x675px recommended)

  // Links
  liveUrl?: string;            // Optional live demo URL
  githubUrl?: string;          // Optional GitHub repository URL

  // Flags
  featured: boolean;           // Show in featured section

  // Dates
  dateCreated: string;         // ISO 8601 date (for sorting)

  // Metrics (featured projects only)
  metrics?: {
    users?: string;            // e.g., "200+ CFIs"
    impact?: string;           // e.g., "$10k revenue"
    outcome?: string;          // e.g., "Reduced training time 40%"
  };

  // Full content (MDX body)
  content: string;             // Rendered HTML or MDX content
}
```

### MDX Frontmatter Schema

**File Location**: `content/projects/[slug].mdx`

**Example**: `content/projects/cfipros.mdx`

```yaml
---
title: "CFIPros.com"
description: "All-in-one platform for flight instructors managing students, lessons, and training records"
category: "aviation"
techStack:
  - "Next.js"
  - "TypeScript"
  - "Prisma"
  - "PostgreSQL"
  - "Vercel"
coverImage: "/images/projects/cfipros.png"
liveUrl: "https://cfipros.com"
githubUrl: "https://github.com/marcusgoll/cfipros"
featured: true
dateCreated: "2024-03-15"
metrics:
  users: "200+ CFIs"
  impact: "Saves 5 hours/week"
  outcome: "40% reduction in training record errors"
---

## Problem

Flight instructors juggle spreadsheets, paper logbooks, and disparate tools to track students...

## Solution

A modern web platform that automates administrative tasks...

[... rest of MDX content ...]
```

---

## File Structure

### New Files to Create

```
lib/
  projects.ts                      # Data fetching functions (adapt from lib/posts.ts)
  schema.ts                        # Add generateCollectionPageSchema()

components/
  projects/
    ProjectCard.tsx                # Card component (adapt from PostCard)
    FeaturedProjectCard.tsx        # Larger variant with metrics
    TechStackBadge.tsx             # Technology badge component
    ProjectFilters.tsx             # Filter button group
    ProjectGrid.tsx                # Grid layout (adapt from PostGrid)

app/
  projects/
    page.tsx                       # Main projects page (/projects)
    [slug]/
      page.tsx                     # Individual project page (P2)

content/
  projects/
    cfipros.mdx                    # Sample project 1 (Aviation, Featured)
    personal-website.mdx           # Sample project 2 (Dev/Startup, Featured)
    spec-flow.mdx                  # Sample project 3 (Cross-pollination, Featured)
    [... 5-9 more projects ...]    # Total 8-12 projects
```

---

## Technical Decisions

### 1. Data Source: MDX Files

**Decision**: Store projects as MDX files in `content/projects/`

**Rationale**:
- **Version Control**: Projects live in Git, trackable changes
- **Component-Rich Content**: MDX allows React components in project descriptions
- **Familiar Pattern**: Team already uses MDX for blog posts
- **No External Dependency**: No Ghost CMS, no API calls, no runtime overhead

**Trade-offs**:
- ✅ Pro: Simple, fast, version-controlled
- ✅ Pro: Build-time static generation (optimal performance)
- ❌ Con: Manual updates (no CMS UI)
- ❌ Con: Content lives in repo (not ideal for non-technical editors)

**Alternative Considered**: Ghost CMS custom post type (rejected for simplicity)

### 2. Static Site Generation (SSG)

**Decision**: Build projects at compile time, no runtime fetching

**Rationale**:
- **Performance**: Projects don't change frequently (maybe once/month)
- **SEO**: Fully rendered HTML at build time
- **Cost**: No database queries, no API calls, no serverless functions

**Implementation**:
```typescript
// app/projects/page.tsx
export const dynamic = 'force-static';  // Force SSG

export default async function ProjectsPage() {
  const projects = await getAllProjects();  // Build-time only
  // ...
}
```

**ISR for Homepage** (optional enhancement):
```typescript
// app/page.tsx (homepage)
export const revalidate = 60;  // Revalidate every 60 seconds

const featuredProjects = await getFeaturedProjects();  // Fresh data
```

### 3. Filtering: URL Query Parameters

**Decision**: `/projects?category=aviation` (not client-only state)

**Rationale**:
- **Shareable**: Users can share filtered views
- **Back-Button Friendly**: Browser history works correctly
- **SEO**: Google indexes filtered pages (if desired)
- **Accessibility**: Screen readers announce URL changes

**Implementation**:
```typescript
// Client-side filtering with URL sync
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const activeFilter = searchParams.get('category') || 'all';

const handleFilterChange = (filter: string) => {
  const params = new URLSearchParams(searchParams);
  if (filter === 'all') {
    params.delete('category');
  } else {
    params.set('category', filter);
  }
  router.push(`/projects?${params.toString()}`);
};
```

**Alternative Considered**: Client-only state (rejected for shareability)

### 4. Image Optimization

**Decision**: Next.js Image component with lazy loading

**Rationale**:
- **Automatic Optimization**: WebP with JPEG fallback
- **Responsive Sizes**: Serve appropriate size for viewport
- **CLS Prevention**: Width/height attributes prevent layout shift
- **Performance Budget**: Lazy loading below fold reduces initial load

**Implementation**:
```typescript
<Image
  src={project.coverImage}
  alt={`${project.title} screenshot`}
  width={1200}
  height={675}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading={isFeatured ? 'eager' : 'lazy'}
  priority={isFeatured}
  className="object-cover"
/>
```

**Image Specs**:
- Aspect ratio: 16:9 (1200x675px recommended)
- Format: WebP with JPEG fallback
- Quality: 85% compression
- Responsive sizes: 400w, 800w, 1200w (srcset)

### 5. Tech Stack Badge Color Scheme

**Decision**: Color-code by technology type (frontend, backend, database, deployment)

**Rationale**:
- **Visual Scanning**: Users quickly identify technology categories
- **Consistency**: Same color for same type across all projects
- **Accessibility**: Subtle backgrounds (30% opacity) maintain contrast

**Color Mapping**:
| Type       | Color   | Background       | Text          | Example Technologies |
|------------|---------|------------------|---------------|----------------------|
| Frontend   | Blue    | `bg-blue-900/30` | `text-blue-300` | Next.js, React, Tailwind |
| Backend    | Green   | `bg-green-900/30`| `text-green-300`| Prisma, Node.js, API  |
| Database   | Purple  | `bg-purple-900/30`|`text-purple-300`| PostgreSQL, MongoDB   |
| Deployment | Orange  | `bg-orange-900/30`|`text-orange-300`| Vercel, Docker, AWS   |

**Auto-Detection** (optional enhancement):
```typescript
const detectTechType = (tech: string): TechType => {
  const frontendKeywords = ['next', 'react', 'vue', 'tailwind', 'css'];
  const backendKeywords = ['prisma', 'node', 'express', 'api'];
  // ...
  return 'frontend'; // default
};
```

---

## Performance Strategy

### Performance Budget (from budgets.md)

| Metric | Target | Strategy |
|--------|--------|----------|
| **FCP** (First Contentful Paint) | <1.5s | Eager load featured images, lazy load grid |
| **TTI** (Time to Interactive) | <3.5s | Minimal JavaScript (static page) |
| **LCP** (Largest Contentful Paint) | <3.0s | Optimize hero image, priority prop |
| **CLS** (Cumulative Layout Shift) | <0.15 | Width/height on all images |
| **Lighthouse Performance** | ≥85 | SSG + image optimization |
| **Lighthouse Accessibility** | ≥95 | WCAG 2.1 AA compliance |

### Optimization Techniques

1. **Image Optimization**:
   - Featured images: `loading="eager"`, `priority={true}`
   - Grid images: `loading="lazy"` (below fold)
   - Blur placeholder: Low-res inline base64

2. **Code Splitting**:
   - Dynamic import for ProjectFilters (client component)
   - Server components for ProjectCard (no JS to client)

3. **Bundle Size**:
   - No heavy libraries (no chart.js, no animation libraries)
   - Tailwind purge in production
   - Target: <80kb JS bundle for `/projects` page

4. **Fonts**:
   - Preload critical fonts
   - Font-display: swap

---

## Accessibility Strategy

### WCAG 2.1 AA Requirements

**1. Color Contrast**:
- Navy 900 on Navy 950: 3.2:1 (decorative only, not text)
- White on Navy 900: 10.5:1 ✅
- Gray 300 on Navy 900: 6.2:1 ✅
- Emerald 600 on Navy 950: 4.8:1 ✅

**2. Focus Indicators**:
- All interactive elements: 2px emerald-600 outline
- Offset: 4px (clear separation)
- Visible on all elements (buttons, links, filters)

**3. Screen Reader Support**:
- Filter state announced: "Aviation filter active, showing 4 projects"
- Card links: "View details for CFIPros.com"
- External links: "Opens in new tab" announcement
- Image alt text: Descriptive, not generic

**4. Keyboard Navigation**:
- Tab order: Filters → Featured cards → Grid cards
- Enter/Space: Activate buttons and links
- Focus visible on all interactive elements

**5. Semantic HTML**:
- `<h1>` for page title
- `<h2>` for section headings (Featured Projects)
- `<h3>` for project titles
- `<nav>` for filters (if using nav pattern)
- `<article>` or `<section>` for project cards

---

## Edge Cases & Error Handling

### 1. Empty States

**Scenario**: No projects match filter

**Solution**:
```tsx
{filteredProjects.length === 0 && (
  <div className="py-12 text-center">
    <p className="text-gray-400">
      No projects found in this category.
    </p>
    <button
      onClick={() => setFilter('all')}
      className="mt-4 text-emerald-600 hover:underline"
    >
      View all projects
    </button>
  </div>
)}
```

### 2. Missing Project Data

**Scenario**: MDX file missing required fields

**Solution**:
- Validate frontmatter at build time
- TypeScript strict mode catches missing fields
- Default values for optional fields

```typescript
const project: Project = {
  slug,
  title: data.title || slug,  // Fallback to slug
  description: data.description || '',
  category: data.category || 'dev-startup',  // Default category
  // ...
};
```

### 3. Broken Images

**Scenario**: `coverImage` path is invalid

**Solution**:
- Next.js Image component shows placeholder
- Add error boundary for image load failures
- Validate image paths at build time (optional)

```typescript
<Image
  src={project.coverImage}
  alt={project.title}
  onError={(e) => {
    e.currentTarget.src = '/images/projects/placeholder.png';
  }}
  // ...
/>
```

### 4. No Featured Projects

**Scenario**: Zero projects have `featured: true`

**Solution**:
- Hide featured section if empty
- Or show most recent 3 projects as fallback

```typescript
const featuredProjects = projects.filter(p => p.featured);

{featuredProjects.length > 0 && (
  <section>
    <h2>Featured Projects</h2>
    {/* Featured cards */}
  </section>
)}
```

---

## Testing Strategy

### Unit Tests

**Components**:
- `ProjectCard` - Renders correctly with mock data
- `TechStackBadge` - Color mapping correct
- `ProjectFilters` - Active state toggles

**Lib Functions**:
- `getAllProjects()` - Returns sorted projects
- `getProjectsByCategory()` - Filters correctly
- `getFeaturedProjects()` - Returns only featured

### Integration Tests

**Page Rendering**:
- `/projects` page loads with all projects
- Filter buttons change displayed projects
- Click card navigates to project detail (P2)

### Accessibility Tests

**axe-core** (automated):
- No color contrast violations
- All interactive elements have focus indicators
- All images have alt text

**Manual Tests**:
- Keyboard navigation (Tab through all elements)
- Screen reader announcements (NVDA/JAWS)
- Focus visible on all elements

### Performance Tests

**Lighthouse** (CI/CD):
- Performance ≥85
- Accessibility ≥95
- Best Practices ≥90
- SEO ≥95

**Manual Tests**:
- First load <3s on 4G connection
- Images lazy load below fold
- No layout shift (CLS <0.15)

---

## Dependencies

### New Dependencies (None Required)

All dependencies already installed:
- `next` - Framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `gray-matter` - Frontmatter parsing (already used for blog)
- `reading-time` - Calculate reading time (not needed, but available)

### Peer Dependencies

No peer dependencies required.

---

## Migration Path (Future)

If project data grows beyond ~50 projects or requires CMS:

**Option 1: Keep MDX, Add CMS UI**
- Use Tina CMS or Decap CMS for MDX editing
- Keep file-based storage, add editor UI
- No code changes needed

**Option 2: Migrate to Database**
- Use Prisma + PostgreSQL for project data
- Keep MDX for rich content (project descriptions)
- API routes for filtering/search

**Option 3: Migrate to Headless CMS**
- Use Contentful or Sanity for project management
- Fetch at build time (ISR)
- More complex setup, better editor experience

**Recommendation**: Start with MDX (simple), migrate only if needed (YAGNI principle)

---

## Open Questions

None. All decisions documented with rationale.

---

**Next Steps**:
1. Generate `data-model.md` with detailed schema
2. Generate `quickstart.md` with integration scenarios
3. Generate `plan.md` consolidating all planning artifacts
4. Create `contracts/api.yaml` (minimal, no external API)
5. Create `error-log.md` template for implementation phase

**Last Updated**: 2025-10-29
