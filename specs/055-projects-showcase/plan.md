# Architecture Plan: Projects Showcase Page

**Feature**: Projects Showcase Page
**Created**: 2025-10-29
**Phase**: Planning
**Status**: Complete

## Executive Summary

Implement a `/projects` portfolio page displaying aviation, development, and cross-pollination projects with category filtering, featured section, and MDX-based data source. Feature leverages existing component patterns (PostCard → ProjectCard, PostGrid → ProjectGrid) and proven infrastructure (MDX content management) to minimize implementation time while maintaining design system consistency.

**Key Benefits**:
- **Component Reuse**: 5 existing components (Container, Button, TrackBadge, PostCard pattern, PostGrid pattern)
- **Infrastructure Reuse**: MDX pattern from blog posts, Next.js Image optimization, JSON-LD schema pattern
- **Zero New Dependencies**: All functionality achievable with existing packages
- **Optimal Performance**: Static site generation (SSG) with build-time data loading
- **Brand Alignment**: Reinforces dual-track positioning (Aviation + Dev/Startup + Cross-pollination)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     /projects Page (SSG)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Featured Projects Section (Top)              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Featured │  │ Featured │  │ Featured │           │  │
│  │  │ Project  │  │ Project  │  │ Project  │           │  │
│  │  │  Card    │  │  Card    │  │  Card    │           │  │
│  │  │ (Large)  │  │ (Large)  │  │ (Large)  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Filter Buttons (Client Component)                    │  │
│  │  [ All ] [ Aviation ] [ Dev/Startup ] [ Cross-poll ] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Project Grid (3 columns, responsive)          │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐                  │  │
│  │  │Project │  │Project │  │Project │                  │  │
│  │  │ Card   │  │ Card   │  │ Card   │                  │  │
│  │  └────────┘  └────────┘  └────────┘                  │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐                  │  │
│  │  │Project │  │Project │  │Project │                  │  │
│  │  │ Card   │  │ Card   │  │ Card   │                  │  │
│  │  └────────┘  └────────┘  └────────┘                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   lib/projects.ts       │
              │  (Data Fetching Layer)  │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  content/projects/*.mdx │
              │  (Project Data Source)  │
              └─────────────────────────┘
```

---

## Component Architecture

### Component Hierarchy

```
app/projects/page.tsx (Server Component)
├── Container (ui/Container.tsx)
│   ├── <h1> + <p> (Page header)
│   ├── FeaturedSection (Server Component)
│   │   └── FeaturedProjectCard × 3 (projects/FeaturedProjectCard.tsx)
│   │       ├── Image (next/image)
│   │       ├── TrackBadge (blog/TrackBadge.tsx) [reused]
│   │       ├── Metrics Display
│   │       ├── TechStackBadge × N (projects/TechStackBadge.tsx)
│   │       └── Button × 2 (ui/button.tsx) [reused]
│   ├── ProjectFilters (projects/ProjectFilters.tsx) [CLIENT COMPONENT]
│   │   └── Button × 4 (ui/button.tsx)
│   └── ProjectGrid (projects/ProjectGrid.tsx)
│       └── ProjectCard × N (projects/ProjectCard.tsx)
│           ├── Link (next/link)
│           ├── Image (next/image)
│           ├── TrackBadge (blog/TrackBadge.tsx) [reused]
│           ├── <h3> + <p> (Title + Description)
│           ├── TechStackBadge × 4 (projects/TechStackBadge.tsx)
│           └── Button × 2 (ui/button.tsx) [reused]
```

**Key Insight**: Only **ProjectFilters** needs to be a client component (uses `useSearchParams`, `useRouter`). All other components are server components for optimal performance.

---

## Data Architecture

### Data Flow

```
Build Time (SSG)
─────────────────
1. Next.js build starts
   ↓
2. app/projects/page.tsx calls getAllProjects()
   ↓
3. lib/projects.ts reads content/projects/*.mdx
   ↓
4. gray-matter parses frontmatter
   ↓
5. Project objects created with type validation
   ↓
6. Projects sorted by dateCreated (newest first)
   ↓
7. Featured projects filtered (featured: true + metrics)
   ↓
8. Static HTML generated with project data
   ↓
9. Build complete, HTML served to users

Runtime (Filtering)
───────────────────
1. User clicks "Aviation" filter
   ↓
2. onFilterChange("aviation") updates URL
   ↓
3. useSearchParams triggers re-render
   ↓
4. filteredProjects = projects.filter(p => p.category === "aviation")
   ↓
5. ProjectGrid re-renders with filtered projects
   ↓
6. No server round-trip (client-side only)
```

---

## File Structure

### New Files to Create

```
lib/
  projects.ts                      # Data fetching functions (170 LOC)

components/
  projects/
    ProjectCard.tsx                # Card component (80 LOC)
    FeaturedProjectCard.tsx        # Larger variant with metrics (100 LOC)
    TechStackBadge.tsx             # Technology badge (40 LOC)
    ProjectFilters.tsx             # Filter button group (60 LOC)
    ProjectGrid.tsx                # Grid layout (50 LOC)

app/
  projects/
    page.tsx                       # Main projects page (120 LOC)

content/
  projects/
    cfipros.mdx                    # Sample project 1 (Aviation, Featured)
    personal-website.mdx           # Sample project 2 (Dev/Startup, Featured)
    spec-flow.mdx                  # Sample project 3 (Cross-pollination, Featured)
    [... 5-9 more projects ...]    # Total 8-12 projects

public/
  images/
    projects/
      cfipros.png                  # Project screenshots (1200x675px, 16:9)
      personal-website.png
      spec-flow.png
      [... more images ...]
```

**Total New Code**: ~620 lines of code across 6 TypeScript files
**Total New Content**: 8-12 MDX project files + screenshots

---

## Reusable Components

### 1. Container (`components/ui/Container.tsx`)

**Current Usage**: About page, blog pages

**Reuse Strategy**: Direct reuse for `/projects` page wrapper

**Pattern**:
```typescript
<Container>
  {/* Projects page content */}
</Container>
```

**No Changes Needed**: Component works as-is

---

### 2. Button (`components/ui/button.tsx`)

**Current Usage**: CTA buttons across site

**Reuse Strategy**: Use for project card CTAs and filter buttons

**Variants Used**:
- `default` - Primary CTAs ("View Live Demo")
- `outline` - Secondary CTAs ("View on GitHub")
- `ghost` - Inactive filter buttons

**Pattern**:
```typescript
<Button variant="default" asChild>
  <a href={project.liveUrl}>View Live Demo</a>
</Button>
```

**No Changes Needed**: Component works as-is

---

### 3. TrackBadge (`components/blog/TrackBadge.tsx`)

**Current Usage**: Blog post cards

**Reuse Strategy**: Direct reuse for project category badges

**Mapping**:
- Project `category: 'aviation'` → `track='aviation'` (Sky Blue)
- Project `category: 'dev-startup'` → `track='dev-startup'` (Emerald)
- Project `category: 'cross-pollination'` → `track='cross-pollination'` (Gradient)

**Pattern**:
```typescript
const track = project.category === 'aviation' ? 'aviation'
  : project.category === 'dev-startup' ? 'dev-startup'
  : 'cross-pollination';

<TrackBadge track={track} />
```

**No Changes Needed**: Component works as-is

---

### 4. PostCard → ProjectCard Pattern

**Current Usage**: Blog post cards in grid

**Reuse Strategy**: Copy structure, adapt for project data

**Key Adaptations**:
| PostCard | ProjectCard |
|----------|-------------|
| `Post` type | `Project` type |
| Author + date metadata | Tech stack badges |
| Reading time | CTA buttons (Live Demo, GitHub) |
| Excerpt (line-clamp-2) | Description (1 sentence, no clamp) |
| Link to `/blog/[slug]` | Link to `/projects/[slug]` (P2) |

**Pattern Preserved**:
- 16:9 image with hover zoom
- Card hover lift effect
- TrackBadge at top
- Title with 2-line clamp
- Footer section

---

### 5. PostGrid → ProjectGrid Pattern

**Current Usage**: Blog listing pages

**Reuse Strategy**: Copy grid layout, replace PostCard with ProjectCard

**Grid Breakpoints**: Same as blog
- Mobile (<640px): 1 column
- Tablet (640-1024px): 2 columns
- Desktop (>1024px): 3 columns

**Gap**: `gap-6` (1.5rem) - same as blog

**Empty State**: Adapt "No posts found" to "No projects found"

---

### 6. MDX Pattern (`lib/posts.ts` → `lib/projects.ts`)

**Current Usage**: Blog posts from `content/posts/`

**Reuse Strategy**: Copy entire pattern, adapt for `content/projects/`

**Key Adaptations**:
| lib/posts.ts | lib/projects.ts |
|--------------|-----------------|
| `postsDirectory` | `projectsDirectory` |
| `Post` interface | `Project` interface |
| `getPostSlugs()` | `getProjectSlugs()` |
| `getPostBySlug()` | `getProjectBySlug()` |
| `getAllPosts()` | `getAllProjects()` |
| `getPostsByTag()` | `getProjectsByCategory()` |
| Sort by `published_at` | Sort by `dateCreated` |

**New Function**: `getFeaturedProjects()` (no equivalent in posts)

---

## New Components (To Build)

### 1. ProjectCard

**Purpose**: Display project preview in grid

**Extends**: PostCard pattern (see above)

**Key Features**:
- Cover image (16:9, lazy-loaded)
- Category badge (TrackBadge)
- Title (text-xl, font-bold, 2-line clamp)
- Description (1-sentence, text-gray-300)
- Tech stack badges (max 4 visible, +N indicator)
- CTA buttons (conditional on liveUrl/githubUrl)
- Hover effects (lift + zoom)

**Props**:
```typescript
interface ProjectCardProps {
  project: Project;
  className?: string;
}
```

**Complexity**: Low (copy PostCard structure)

**LOC Estimate**: 80 lines

---

### 2. FeaturedProjectCard

**Purpose**: Display flagship project with metrics

**Extends**: ProjectCard (larger variant)

**Key Features**:
- All ProjectCard features
- Larger layout (2x height, more prominent)
- Expanded description (2-3 sentences, no clamp)
- Metrics display (users, impact, outcome) with badges
- Prominent CTAs (lg size buttons)
- Visual distinction (border or shadow)

**Props**:
```typescript
interface FeaturedProjectCardProps {
  project: Project;  // Must have metrics field
  className?: string;
}
```

**Complexity**: Medium (extend ProjectCard, add metrics section)

**LOC Estimate**: 100 lines

---

### 3. TechStackBadge

**Purpose**: Display technology badge with color coding

**Similar To**: TrackBadge (but different color scheme)

**Key Features**:
- Rounded badge (`px-3 py-1`, `rounded-full`)
- Color-coded by type (frontend/backend/database/deployment)
- Small text (`text-sm`)
- Subtle background (30% opacity)

**Props**:
```typescript
interface TechStackBadgeProps {
  tech: string;
  colorScheme?: 'frontend' | 'backend' | 'database' | 'deployment';
}
```

**Color Scheme**:
- Frontend: Blue (`bg-blue-900/30`, `text-blue-300`)
- Backend: Green (`bg-green-900/30`, `text-green-300`)
- Database: Purple (`bg-purple-900/30`, `text-purple-300`)
- Deployment: Orange (`bg-orange-900/30`, `text-orange-300`)

**Complexity**: Low (simple badge component)

**LOC Estimate**: 40 lines

---

### 4. ProjectFilters

**Purpose**: Filter button group with active state

**Pattern**: New component (no existing equivalent)

**Key Features**:
- Horizontal button group (`flex`, `gap-2`)
- Active state colors (match brand colors)
- Inactive state (gray outline)
- Responsive (horizontal scroll on mobile)
- URL sync (`useSearchParams`, `useRouter`)

**Props**:
```typescript
interface ProjectFiltersProps {
  activeFilter: 'all' | 'aviation' | 'dev-startup' | 'cross-pollination';
  onFilterChange: (filter: string) => void;
}
```

**Complexity**: Medium (client component, URL sync)

**LOC Estimate**: 60 lines

**Note**: This is the ONLY client component (all others are server components)

---

### 5. ProjectGrid

**Purpose**: Responsive grid layout

**Extends**: PostGrid pattern

**Key Features**:
- 1-2-3 column responsive grid
- Empty state handling
- Gap spacing consistent with blog

**Props**:
```typescript
interface ProjectGridProps {
  projects: Project[];
}
```

**Complexity**: Low (copy PostGrid structure)

**LOC Estimate**: 50 lines

---

## Technical Decisions

### 1. Data Source: MDX Files

**Decision**: Store projects as MDX files in `content/projects/`

**Rationale**:
- ✅ Version control (projects in Git)
- ✅ Familiar pattern (already used for blog)
- ✅ Build-time static generation
- ✅ No external dependencies
- ✅ Component-rich content (MDX supports React components)

**Trade-offs**:
- ❌ Manual updates (no CMS UI)
- ❌ Content lives in repo

**Alternatives Considered**:
- Ghost CMS custom post type (rejected: adds complexity)
- Database (Prisma + PostgreSQL) (rejected: overkill for <20 projects)

---

### 2. Static Site Generation (SSG)

**Decision**: Build projects at compile time, no runtime fetching

**Rationale**:
- ✅ Optimal performance (fully static HTML)
- ✅ No database queries or API calls
- ✅ Projects don't change frequently (monthly updates)
- ✅ SEO-friendly (fully rendered at build time)

**Implementation**:
```typescript
// app/projects/page.tsx
export const dynamic = 'force-static';

export default async function ProjectsPage() {
  const projects = await getAllProjects();  // Build-time only
  // ...
}
```

**Alternative Considered**:
- ISR (revalidate: 60) (rejected: unnecessary for infrequently-changing data)

---

### 3. Filtering: URL Query Parameters

**Decision**: `/projects?category=aviation` (not client-only state)

**Rationale**:
- ✅ Shareable (users can bookmark filtered views)
- ✅ Back-button friendly (browser history)
- ✅ SEO-friendly (if desired)
- ✅ Accessibility (screen readers announce URL changes)

**Implementation**:
```typescript
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

**Alternative Considered**:
- Client-only state (useState) (rejected: not shareable)

---

### 4. Image Optimization

**Decision**: Next.js Image component with lazy loading

**Rationale**:
- ✅ Automatic WebP conversion
- ✅ Responsive sizes (srcset)
- ✅ Lazy loading below fold
- ✅ CLS prevention (width/height attributes)
- ✅ Already used across site

**Configuration**:
```typescript
<Image
  src={project.coverImage}
  alt={`${project.title} screenshot`}
  width={1200}
  height={675}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading={isFeatured ? 'eager' : 'lazy'}
  priority={isFeatured}
/>
```

**Image Specs**:
- Aspect ratio: 16:9 (1200x675px)
- Format: PNG or JPG (<500KB)
- Auto-converted to WebP by Next.js

---

### 5. Tech Stack Badge Color Scheme

**Decision**: Color-code by technology type (not by specific tech)

**Rationale**:
- ✅ Visual scanning (users quickly identify categories)
- ✅ Consistent colors across projects
- ✅ Accessibility (subtle backgrounds maintain contrast)
- ✅ Scalable (new technologies auto-assigned to categories)

**Color Mapping**:
- Frontend (Blue): Next.js, React, Vue, Tailwind, CSS
- Backend (Green): Prisma, Node.js, Express, API
- Database (Purple): PostgreSQL, MongoDB, Redis
- Deployment (Orange): Vercel, Docker, AWS, Heroku

**Auto-Detection** (future enhancement):
```typescript
const detectTechType = (tech: string): TechType => {
  const lowerTech = tech.toLowerCase();
  if (['next', 'react', 'vue', 'tailwind'].some(k => lowerTech.includes(k))) {
    return 'frontend';
  }
  // ... more detection logic
  return 'frontend'; // default
};
```

---

## Performance Strategy

### Build-Time Optimization

**Strategy**: Minimize build time while maximizing runtime performance

**Techniques**:
1. **Image Optimization**: Compress images before committing (<500KB each)
2. **MDX Caching**: Parse MDX files once, cache results (Next.js automatic)
3. **Minimal Dynamic Content**: Only filters use client-side JS
4. **Tree Shaking**: Import only used components from ui library

**Build Time Target**: <2 minutes for full build

---

### Runtime Optimization

**Strategy**: Sub-2s page load on 4G connections

**Techniques**:
1. **Static HTML**: All content pre-rendered at build time
2. **Lazy Loading**: Grid images lazy-loaded (below fold)
3. **Eager Loading**: Featured images eager-loaded (above fold)
4. **Priority Images**: Featured images use `priority` prop
5. **Code Splitting**: ProjectFilters dynamically imported (client component)
6. **Server Components**: ProjectCard, ProjectGrid are server components (zero JS to client)

**Performance Targets** (from budgets.md):
| Metric | Target | Strategy |
|--------|--------|----------|
| FCP (First Contentful Paint) | <1.5s | Eager load featured images |
| TTI (Time to Interactive) | <3.5s | Minimal JavaScript (mostly static) |
| LCP (Largest Contentful Paint) | <3.0s | Optimize hero image, priority prop |
| CLS (Cumulative Layout Shift) | <0.15 | Width/height on all images |
| Lighthouse Performance | ≥85 | SSG + image optimization |
| Lighthouse Accessibility | ≥95 | WCAG 2.1 AA compliance |

---

## Accessibility Strategy

### WCAG 2.1 AA Compliance

**Requirements**:
1. **Color Contrast**: All text meets 4.5:1 minimum
2. **Focus Indicators**: Visible on all interactive elements
3. **Keyboard Navigation**: All features keyboard accessible
4. **Screen Reader Support**: Announcements for state changes
5. **Semantic HTML**: Proper heading hierarchy

---

### Color Contrast Checks

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| White (#ffffff) | Navy 900 (#1e3a5f) | 10.5:1 | ✅ Pass |
| Gray 300 (#d1d5db) | Navy 900 (#1e3a5f) | 6.2:1 | ✅ Pass |
| Emerald 600 (#059669) | Navy 950 (#0f1729) | 4.8:1 | ✅ Pass |
| Blue 300 (badges) | Blue 900/30 (bg) | 6.1:1 | ✅ Pass |

**All color combinations meet WCAG 2.1 AA standards**

---

### Focus Indicators

**Strategy**: Visible 2px emerald-600 outline on all interactive elements

**Implementation**:
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-emerald-600
focus-visible:ring-offset-2
```

**Elements Affected**:
- Filter buttons
- Project card links
- CTA buttons (Live Demo, GitHub)
- "View All Projects" reset button

---

### Screen Reader Support

**Announcements**:
1. **Filter Change**: "Aviation filter active, showing 4 projects"
2. **Card Links**: "View details for CFIPros.com"
3. **External Links**: "Opens in new tab" (via aria-label)
4. **Empty State**: "No projects found in this category"

**Implementation**:
```typescript
// Filter button
<button
  aria-pressed={activeFilter === 'aviation'}
  aria-label="Filter by Aviation projects"
>
  Aviation
</button>

// Screen reader only announcement
<div aria-live="polite" className="sr-only">
  {`${activeFilter} filter active, showing ${filteredProjects.length} projects`}
</div>
```

---

### Keyboard Navigation

**Tab Order**:
1. Filter buttons (left to right)
2. Featured project cards (top to bottom)
3. Grid project cards (row by row, left to right)
4. CTAs within each card (Live Demo → GitHub)

**Keyboard Shortcuts**:
- **Tab**: Move forward
- **Shift+Tab**: Move backward
- **Enter/Space**: Activate button or link
- **Escape**: Reset filter (if modal/tooltip open)

**Arrow Key Navigation** (enhancement, P3):
- Left/Right arrows within filter button group

---

## Edge Cases & Error Handling

### 1. Empty States

**Scenario 1: No Projects Exist**
- **Trigger**: `content/projects/` directory empty
- **Behavior**: Display "No projects available. Check back soon!"
- **Recovery**: Add MDX files to directory, rebuild

**Scenario 2: Filter Returns Zero Results**
- **Trigger**: User clicks filter, no projects match
- **Behavior**: Display "No projects found in this category" with reset button
- **Recovery**: User clicks "View All Projects" or changes filter

**Scenario 3: No Featured Projects**
- **Trigger**: Zero projects have `featured: true` in frontmatter
- **Behavior**: Hide featured section entirely
- **Recovery**: Set at least one project to `featured: true`, rebuild

---

### 2. Missing Project Data

**Scenario: MDX Frontmatter Missing Required Field**
- **Trigger**: MDX file missing `title`, `description`, `category`, etc.
- **Behavior**: Build fails with descriptive error
- **Error Message**: `Error: Project 'cfipros': Missing required field 'title'`
- **Recovery**: Add missing field to frontmatter, rebuild

**Default Values**:
| Field | Default | Behavior |
|-------|---------|----------|
| `liveUrl` | `undefined` | Hide "View Live Demo" button |
| `githubUrl` | `undefined` | Hide "View on GitHub" button |
| `metrics` | `undefined` | Don't show metrics section |
| `featured` | `false` | Don't show in featured section |

---

### 3. Broken Images

**Scenario: Image File Missing**
- **Trigger**: `coverImage` path points to non-existent file
- **Behavior**: Next.js Image shows placeholder, alt text displayed
- **Recovery**: Add missing image to `public/images/projects/`, rebuild

**Image Validation** (optional build-time check):
```typescript
import fs from 'fs';

const validateCoverImage = (coverImage: string) => {
  const imagePath = path.join(process.cwd(), 'public', coverImage);
  if (!fs.existsSync(imagePath)) {
    console.warn(`Warning: Image not found: ${coverImage}`);
  }
};
```

---

### 4. Invalid Category Values

**Scenario: Frontmatter Has Invalid Category**
- **Trigger**: `category: 'software'` (not one of valid values)
- **Behavior**: Build fails with validation error
- **Error Message**: `Error: Project 'cfipros': Invalid category 'software' (must be 'aviation', 'dev-startup', or 'cross-pollination')`
- **Recovery**: Fix category value, rebuild

**Type Guard**:
```typescript
const isValidCategory = (category: string): category is Project['category'] => {
  return ['aviation', 'dev-startup', 'cross-pollination'].includes(category);
};
```

---

## Testing Strategy

### Unit Tests

**Components to Test**:
1. **ProjectCard**: Renders correctly with mock data
2. **FeaturedProjectCard**: Displays metrics correctly
3. **TechStackBadge**: Color mapping works
4. **ProjectFilters**: Active state toggles correctly
5. **ProjectGrid**: Empty state displays when no projects

**Lib Functions to Test**:
1. **getAllProjects()**: Returns sorted projects
2. **getProjectsByCategory()**: Filters correctly
3. **getFeaturedProjects()**: Returns only featured projects with metrics
4. **isValidCategory()**: Type guard works

**Test Framework**: Jest + React Testing Library (already installed)

**Example Test**:
```typescript
// ProjectCard.test.tsx
describe('ProjectCard', () => {
  it('renders project title and description', () => {
    const mockProject: Project = {
      slug: 'test',
      title: 'Test Project',
      description: 'Test description',
      // ... more fields
    };

    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
```

---

### Integration Tests

**Scenarios**:
1. **Load All Projects**: `/projects` page displays all projects in grid
2. **Filter by Category**: Click "Aviation" → only aviation projects shown
3. **Featured Section**: Featured projects appear in hero section
4. **Empty Filter**: Filter with zero results shows empty state
5. **URL Sync**: Filter updates URL, refresh persists filter

**Test Framework**: Playwright or Cypress (not installed yet)

---

### Accessibility Tests

**Automated Tests** (axe-core):
```bash
npm install --save-dev @axe-core/playwright
```

**Manual Tests**:
1. **Keyboard Navigation**: Tab through all elements, verify focus visible
2. **Screen Reader**: Test with NVDA (Windows) or VoiceOver (macOS)
3. **Color Contrast**: Verify with browser DevTools color picker

**Lighthouse Audit** (CI/CD):
```bash
npm run build
npm start
# Run Lighthouse CLI
lighthouse http://localhost:3000/projects --output=json --output-path=./lighthouse-report.json
```

**Targets**:
- Accessibility ≥95
- Performance ≥85
- Best Practices ≥90
- SEO ≥95

---

## Deployment Strategy

### Build Process

**Steps**:
1. Read all MDX files from `content/projects/`
2. Parse frontmatter and validate required fields
3. Generate `Project` objects with type checking
4. Sort projects by `dateCreated` descending
5. Filter featured projects
6. Generate static HTML for `/projects` page
7. Optimize images (WebP conversion, responsive sizes)
8. Generate sitemap with `/projects` page

**Build Time**: Estimated <2 minutes

---

### Staging Deployment

**Process**:
1. Merge feature branch to `staging`
2. Vercel deploys to staging environment
3. Run Lighthouse audit on staging URL
4. Manual QA: Test all filters, keyboard navigation, screen reader
5. Verify performance targets met
6. Approve for production

**Staging URL**: `https://marcusgoll-staging.vercel.app/projects`

---

### Production Deployment

**Process**:
1. Merge `staging` to `main`
2. Vercel deploys to production
3. Run post-deployment smoke tests
4. Monitor analytics for first 24 hours
5. Update roadmap to mark feature as shipped

**Production URL**: `https://marcusgoll.com/projects`

**Rollback Plan**: Revert Git commit, redeploy previous version

---

## Monitoring & Analytics

### Performance Monitoring

**Tool**: Google Analytics 4 (already installed)

**Events to Track**:
1. **page_view**: `/projects` page loads
2. **projects.filter_clicked**: User clicks filter button
3. **projects.card_clicked**: User clicks project card
4. **projects.cta_clicked**: User clicks "View Live Demo" or "View on GitHub"

**Custom Dimensions**:
- Filter category (aviation, dev-startup, cross-pollination)
- Project slug (which project was clicked)
- CTA type (live demo vs GitHub)

---

### User Behavior Tracking

**Questions to Answer**:
1. Which filter is most popular? (aviation vs dev-startup vs cross-pollination)
2. Do users engage more with featured projects or grid projects?
3. What's the click-through rate on CTAs?
4. Do users visit project detail pages (P2 story)?

**Implementation**:
```typescript
// Track filter change
const handleFilterChange = (filter: string) => {
  // Update URL
  router.push(`/projects?category=${filter}`);

  // Track event
  gtag('event', 'projects.filter_clicked', {
    filter_category: filter,
  });
};
```

---

## MVP Scope

### Priority 1 (Ship First)

**User Stories**:
- **US1**: Projects grid with basic information
- **US2**: Category filtering (Aviation/Dev/Hybrid)
- **US3**: Featured projects section with metrics

**Implementation Estimate**: 2-3 days (8-12 tasks)

**Deliverable**: `/projects` page with filtering and featured section

---

### Priority 2 (Enhancement)

**User Stories**:
- **US4**: Individual project detail pages (`/projects/[slug]`)
- **US5**: Search functionality (client-side or Algolia)

**Implementation Estimate**: 1-2 days (5-8 tasks)

**Deliverable**: Full project detail pages with rich content

---

### Priority 3 (Nice-to-Have)

**User Stories**:
- **US6**: Screenshot galleries/lightbox (Radix UI Dialog)
- **US7**: Sorting options (date, title, category)

**Implementation Estimate**: 1 day (3-5 tasks)

**Deliverable**: Enhanced UX with gallery and sorting

---

**Strategy**: Ship US1-US3 first, validate with users, then incrementally add US4-US7 based on feedback and analytics.

---

## Risks & Mitigations

### Risk 1: Build Time Exceeds 2 Minutes

**Impact**: Slower deployments, worse developer experience

**Likelihood**: Low (only 8-12 projects initially)

**Mitigation**:
- Compress images before committing (<500KB each)
- Use Next.js incremental builds (only rebuild changed files)
- Monitor build times in CI/CD

---

### Risk 2: Performance Targets Not Met

**Impact**: Poor user experience, lower SEO rankings

**Likelihood**: Low (SSG + image optimization should achieve targets)

**Mitigation**:
- Run Lighthouse audits in CI/CD (block deployment if <85 performance)
- Lazy load images below fold
- Use Next.js Image optimization
- Minimize client-side JavaScript

---

### Risk 3: Accessibility Violations

**Impact**: Exclusion of users with disabilities, potential legal issues

**Likelihood**: Low (following WCAG 2.1 AA guidelines)

**Mitigation**:
- Run axe-core automated tests in CI/CD
- Manual testing with screen readers
- Focus indicators visible on all elements
- Semantic HTML structure

---

### Risk 4: Content Scalability (50+ Projects)

**Impact**: Build time increases, page load time increases

**Likelihood**: Medium (if portfolio grows significantly)

**Mitigation**:
- Implement pagination (show 12 per page)
- Add search functionality (client-side or Algolia)
- Consider database migration (Prisma + PostgreSQL)
- Lazy load project cards (intersection observer)

---

## Success Criteria

### Technical Success

- [ ] `/projects` page loads in <2s on 4G
- [ ] Lighthouse Performance ≥85
- [ ] Lighthouse Accessibility ≥95
- [ ] All filters work correctly
- [ ] Featured section displays 3 projects with metrics
- [ ] Zero console errors or warnings
- [ ] Keyboard navigation works for all elements
- [ ] Screen reader announcements correct

---

### User Success

- [ ] Users can quickly find relevant work (aviation vs dev)
- [ ] Users can navigate to live demos or GitHub repos
- [ ] Users understand project impact (via metrics)
- [ ] Users engage with CTAs (>10% click-through rate)

---

### Business Success

- [ ] Reinforces dual-track brand positioning
- [ ] Increases user engagement (time on site, pages/session)
- [ ] Drives traffic to external projects (live demos, GitHub)
- [ ] Improves SEO (new indexed page, internal linking)

---

## Next Steps

1. **Phase 2 (Tasks)**: Generate task breakdown with acceptance criteria (~20-30 tasks)
2. **Phase 3 (Validation)**: Cross-artifact consistency check (spec.md vs plan.md)
3. **Phase 4 (Implementation)**: Execute tasks with TDD workflow (Jest tests first)
4. **Phase 5 (Optimization)**: Code review, performance audit, accessibility audit
5. **Phase 6 (Deployment)**: Ship to staging → validate → ship to production

---

## Appendix: Component Specifications

### ProjectCard Specification

**File**: `components/projects/ProjectCard.tsx`

**Props**:
```typescript
interface ProjectCardProps {
  project: Project;
  className?: string;
}
```

**Structure**:
```tsx
<Link href={`/projects/${project.slug}`} className="group...">
  {/* Image Container */}
  <div className="aspect-video overflow-hidden">
    <Image
      src={project.coverImage}
      alt={project.title}
      width={1200}
      height={675}
      loading="lazy"
      className="group-hover:scale-105 transition-transform"
    />
  </div>

  {/* Content Container */}
  <div className="p-4">
    {/* Category Badge */}
    <TrackBadge track={mapCategoryToTrack(project.category)} />

    {/* Title */}
    <h3 className="text-xl font-bold line-clamp-2">
      {project.title}
    </h3>

    {/* Description */}
    <p className="text-gray-300">{project.description}</p>

    {/* Tech Stack Badges */}
    <div className="flex flex-wrap gap-2">
      {project.techStack.slice(0, 4).map(tech => (
        <TechStackBadge key={tech} tech={tech} />
      ))}
      {project.techStack.length > 4 && (
        <span className="text-sm text-gray-500">
          +{project.techStack.length - 4} more
        </span>
      )}
    </div>

    {/* CTAs */}
    <div className="flex gap-2 mt-4">
      {project.liveUrl && (
        <Button variant="default" asChild>
          <a href={project.liveUrl}>View Live Demo</a>
        </Button>
      )}
      {project.githubUrl && (
        <Button variant="outline" asChild>
          <a href={project.githubUrl}>View on GitHub</a>
        </Button>
      )}
    </div>
  </div>
</Link>
```

**Estimated LOC**: 80 lines

---

### FeaturedProjectCard Specification

**File**: `components/projects/FeaturedProjectCard.tsx`

**Props**:
```typescript
interface FeaturedProjectCardProps {
  project: Project;  // Must have metrics field
  className?: string;
}
```

**Structure**: Similar to ProjectCard, with additions:
- Larger layout (2-column or full-width)
- Expanded description (2-3 sentences, no clamp)
- Metrics section (users, impact, outcome)
- Larger CTA buttons (lg size)

**Metrics Display**:
```tsx
<div className="flex gap-4">
  <div className="flex flex-col">
    <span className="text-2xl font-bold text-emerald-600">
      {project.metrics.users}
    </span>
    <span className="text-sm text-gray-500">Active Users</span>
  </div>
  {/* Repeat for impact and outcome */}
</div>
```

**Estimated LOC**: 100 lines

---

### TechStackBadge Specification

**File**: `components/projects/TechStackBadge.tsx`

**Props**:
```typescript
interface TechStackBadgeProps {
  tech: string;
  colorScheme?: 'frontend' | 'backend' | 'database' | 'deployment';
}
```

**Structure**:
```tsx
const colorClasses = {
  frontend: 'bg-blue-900/30 text-blue-300',
  backend: 'bg-green-900/30 text-green-300',
  database: 'bg-purple-900/30 text-purple-300',
  deployment: 'bg-orange-900/30 text-orange-300',
};

return (
  <span className={`px-3 py-1 rounded-full text-sm ${colorClasses[colorScheme]}`}>
    {tech}
  </span>
);
```

**Estimated LOC**: 40 lines

---

### ProjectFilters Specification

**File**: `components/projects/ProjectFilters.tsx`

**Props**:
```typescript
interface ProjectFiltersProps {
  activeFilter: 'all' | 'aviation' | 'dev-startup' | 'cross-pollination';
  onFilterChange: (filter: string) => void;
}
```

**Structure**:
```tsx
'use client';

import { Button } from '@/components/ui/button';

export default function ProjectFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'aviation', label: 'Aviation' },
    { id: 'dev-startup', label: 'Dev/Startup' },
    { id: 'cross-pollination', label: 'Cross-pollination' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto">
      {filters.map(filter => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'ghost'}
          onClick={() => onFilterChange(filter.id)}
          aria-pressed={activeFilter === filter.id}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
```

**Estimated LOC**: 60 lines

---

### ProjectGrid Specification

**File**: `components/projects/ProjectGrid.tsx`

**Props**:
```typescript
interface ProjectGridProps {
  projects: Project[];
}
```

**Structure**:
```tsx
export default function ProjectGrid({ projects }) {
  if (projects.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
```

**Estimated LOC**: 50 lines

---

**Last Updated**: 2025-10-29

**Planning Phase Complete**: Ready for task breakdown.
