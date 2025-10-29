# Tasks: Projects Showcase Page

**Feature**: Projects Showcase Page
**Branch**: `feature/055-projects-showcase`
**Created**: 2025-10-29
**Status**: Ready for Implementation

## [CODEBASE REUSE ANALYSIS]

Scanned: `lib/**/*.ts`, `components/**/*.tsx`, `app/**/page.tsx`

### [EXISTING - REUSE]
- ✅ **Container** (`components/ui/Container.tsx`) - Page wrapper with max-width
- ✅ **Button** (`components/ui/Button.tsx`) - Shadcn button with variants
- ✅ **TrackBadge** (`components/blog/TrackBadge.tsx`) - Category badges with brand colors
- ✅ **PostCard** (`components/blog/PostCard.tsx`) - Card pattern to adapt
- ✅ **PostGrid** (`components/blog/PostGrid.tsx`) - Responsive grid layout
- ✅ **lib/posts.ts** - MDX pattern to adapt for projects
- ✅ **lib/schema.ts** - JSON-LD schema functions (add CollectionPage)
- ✅ **shimmerDataURL** (`lib/utils/shimmer.ts`) - Blur placeholder for images

### [NEW - CREATE]
- 🆕 **lib/projects.ts** - Project data fetching (170 LOC, adapt from lib/posts.ts)
- 🆕 **ProjectCard** - Card component (80 LOC, adapt from PostCard)
- 🆕 **FeaturedProjectCard** - Larger variant with metrics (100 LOC)
- 🆕 **TechStackBadge** - Technology badges (40 LOC, similar to TrackBadge)
- 🆕 **ProjectFilters** - Filter button group (60 LOC, client component)
- 🆕 **ProjectGrid** - Grid layout (50 LOC, adapt from PostGrid)
- 🆕 **app/projects/page.tsx** - Main projects page (120 LOC)
- 🆕 **content/projects/*.mdx** - Project MDX files (8-12 files)

## [DEPENDENCY GRAPH]

Story completion order:
1. **Phase 1**: Setup (T001-T003) - Create directory structure, no blockers
2. **Phase 2**: Foundation (T004-T008) - Create reusable lib/components (blocks all stories)
3. **Phase 3**: US1 [P1] (T010-T016) - Projects grid with basic info (independent)
4. **Phase 4**: US2 [P1] (T020-T023) - Category filtering (depends on US1 ProjectCard)
5. **Phase 5**: US3 [P1] (T030-T033) - Featured section (depends on US1 foundation)
6. **Phase 6**: Polish (T040-T048) - Cross-cutting concerns (depends on all MVP stories)

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 2**: T004 [P], T005 [P], T006 [P] (different files, no dependencies)
- **Phase 3**: T012 [P], T013 [P], T014 [P] (independent MDX files)
- **Phase 4**: T020 [P], T021 [P] (filter component + page integration, minimal overlap)
- **Phase 5**: T030 [P], T031 [P] (FeaturedProjectCard + sample data, independent)
- **Phase 6**: T041 [P], T042 [P], T043 [P], T045 [P], T046 [P] (different files/concerns)

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phase 3, 4, 5 (US1, US2, US3) - Projects grid + filtering + featured section

**Incremental delivery**:
- Sprint 1: US1 → staging validation (basic grid)
- Sprint 2: US2 + US3 → staging validation (filters + featured)
- Sprint 3: US4-US7 (if validated via analytics)

**Testing approach**: Integration tests for data fetching, accessibility tests for keyboard nav, Lighthouse audits for performance

---

## Phase 1: Setup

**Goal**: Create project structure and content directory

- [ ] T001 Create content/projects/ directory for MDX files
  - Directory: `content/projects/`
  - Purpose: Store project MDX files with frontmatter
  - Pattern: `content/posts/` structure
  - From: plan.md [File Structure]

- [ ] T002 [P] Create public/images/projects/ directory for screenshots
  - Directory: `public/images/projects/`
  - Purpose: Store project screenshots (1200x675px, 16:9 aspect ratio)
  - Validation: Images <500KB each
  - From: plan.md [Image Optimization]

- [ ] T003 [P] Create components/projects/ directory for new components
  - Directory: `components/projects/`
  - Purpose: House project-specific components
  - Pattern: `components/blog/` structure
  - From: plan.md [Component Architecture]

---

## Phase 2: Foundation (Blocks All User Stories)

**Goal**: Create reusable infrastructure for all project features

- [ ] T004 [P] Create Project TypeScript interface in lib/projects.ts
  - File: `lib/projects.ts`
  - Interface: `Project` with fields (slug, title, description, category, techStack, coverImage, liveUrl?, githubUrl?, featured, dateCreated, metrics?, content)
  - REUSE: Pattern from `lib/posts.ts` (Post interface)
  - Validation: All required fields, category enum, techStack array 2-10 items
  - From: data-model.md [Project Interface]

- [ ] T005 [P] Implement data fetching functions in lib/projects.ts
  - File: `lib/projects.ts`
  - Functions: `getProjectSlugs()`, `getProjectBySlug(slug)`, `getAllProjects()`, `getFeaturedProjects()`, `getProjectsByCategory(category)`
  - REUSE: Pattern from `lib/posts.ts` (MDX parsing with gray-matter)
  - Sort: By `dateCreated` descending
  - From: data-model.md [Data Access Patterns]

- [ ] T006 [P] Create TechStackBadge component in components/projects/TechStackBadge.tsx
  - File: `components/projects/TechStackBadge.tsx`
  - Props: `tech: string`, `colorScheme?: 'frontend' | 'backend' | 'database' | 'deployment'`
  - Colors: Blue (frontend), Green (backend), Purple (database), Orange (deployment)
  - Pattern: `components/blog/TrackBadge.tsx` (similar badge structure)
  - Accessibility: Pill shape (`rounded-full`), subtle backgrounds (30% opacity)
  - From: research.md [TechStackBadge Specification]

- [ ] T007 [P] Create ProjectCard component in components/projects/ProjectCard.tsx
  - File: `components/projects/ProjectCard.tsx`
  - Props: `project: Project`, `className?: string`
  - REUSE: Structure from `components/blog/PostCard.tsx` (image, title, excerpt, metadata)
  - Adaptations: Replace metadata with tech stack badges, add conditional CTAs
  - Features: 16:9 image with hover zoom, TrackBadge for category, title with 2-line clamp, description (1 sentence), tech badges (max 4 visible, +N indicator), CTA buttons (Live Demo, GitHub)
  - Pattern: `components/blog/PostCard.tsx:24-79`
  - From: research.md [ProjectCard Specification]

- [ ] T008 [P] Create ProjectGrid component in components/projects/ProjectGrid.tsx
  - File: `components/projects/ProjectGrid.tsx`
  - Props: `projects: Project[]`
  - REUSE: Grid layout from `components/blog/PostGrid.tsx` (1-2-3 columns)
  - Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `gap-6`
  - Empty state: "No projects found." message
  - Pattern: `components/blog/PostGrid.tsx:13-32`
  - From: research.md [ProjectGrid Specification]

---

## Phase 3: User Story 1 [P1] - Projects grid with basic information

**Story Goal**: Visitors can view all projects in responsive grid with basic info

**Independent Test Criteria**:
- [ ] Navigate to /projects, verify all project cards render
- [ ] Each card shows: title, description, category badge, tech stack badges (max 4)
- [ ] Grid is responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- [ ] Images lazy-load below fold, eager-load featured section

### Implementation

- [ ] T010 [US1] Create app/projects/page.tsx with SSG
  - File: `app/projects/page.tsx`
  - Data: `await getAllProjects()` (build-time only)
  - SSG: `export const dynamic = 'force-static'`
  - Layout: Container wrapper, page heading, ProjectGrid
  - REUSE: Container (`components/ui/Container.tsx`), pattern from `app/blog/page.tsx` or `app/about/page.tsx`
  - From: quickstart.md [Step 3: Create Projects Page]

- [ ] T011 [US1] Add JSON-LD CollectionPage schema to page
  - File: `lib/schema.ts`
  - Function: `generateCollectionPageSchema()` returning CollectionPage schema
  - REUSE: Pattern from `generatePersonSchema()` in `lib/schema.ts:file`
  - Embed: `<script type="application/ld+json">` in `app/projects/page.tsx`
  - From: research.md [JSON-LD Schema Pattern]

- [ ] T012 [P] [US1] Create sample project MDX: cfipros.mdx (Aviation, Featured)
  - File: `content/projects/cfipros.mdx`
  - Frontmatter: title, description, category: "aviation", techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Vercel"], coverImage: "/images/projects/cfipros.png", liveUrl, githubUrl, featured: true, dateCreated: "2024-03-15", metrics: {users, impact, outcome}
  - Content: Problem, Solution, Tech Stack, Challenges & Lessons, Results & Impact sections
  - Screenshot: Add `public/images/projects/cfipros.png` (1200x675px, <500KB)
  - From: design/copy.md [Sample Project Copy - CFIPros.com]

- [ ] T013 [P] [US1] Create sample project MDX: personal-website.mdx (Dev/Startup, Featured)
  - File: `content/projects/personal-website.mdx`
  - Frontmatter: title, description, category: "dev-startup", techStack: ["Next.js", "TypeScript", "Tailwind", "MDX", "Vercel"], featured: true, metrics
  - Screenshot: Add `public/images/projects/personal-website.png`
  - From: design/copy.md [Sample Project Copy - Personal Website]

- [ ] T014 [P] [US1] Create sample project MDX: spec-flow.mdx (Cross-pollination, Featured)
  - File: `content/projects/spec-flow.mdx`
  - Frontmatter: title, description, category: "cross-pollination", techStack: ["Bash", "YAML", "Markdown", "Git"], featured: true, metrics
  - Screenshot: Add `public/images/projects/spec-flow.png`
  - From: design/copy.md [Sample Project Copy - Spec-Flow Workflow]

- [ ] T015 [P] [US1] Create 5 additional non-featured project MDX files
  - Files: `content/projects/*.mdx` (e.g., flight-school-dashboard.mdx, aviation-blog.mdx, api-wrapper.mdx, cfipros-mobile.mdx, training-tracker.mdx)
  - Distribution: 2 aviation, 2 dev-startup, 1 cross-pollination
  - Frontmatter: All required fields, featured: false (no metrics needed)
  - Screenshots: Add corresponding images to `public/images/projects/`
  - From: data-model.md [Sample Data]

- [ ] T016 [US1] Add "Projects" link to site navigation
  - File: `components/layout/Header.tsx` (or wherever nav is defined)
  - Link: `<Link href="/projects">Projects</Link>`
  - Position: Between "Blog" and "About"
  - From: quickstart.md [Step 7: Update Navigation]

---

## Phase 4: User Story 2 [P1] - Category filtering

**Story Goal**: Visitors can filter projects by Aviation/Dev/Hybrid categories

**Independent Test Criteria**:
- [ ] Click "Aviation" filter, only aviation projects shown
- [ ] Click "All Projects" button, filter resets
- [ ] Active filter visually indicated with brand color
- [ ] URL updates to /projects?category=aviation (shareable)

### Implementation

- [ ] T020 [P] [US2] Create ProjectFilters component in components/projects/ProjectFilters.tsx
  - File: `components/projects/ProjectFilters.tsx`
  - Props: `activeFilter: string`, `onFilterChange: (filter: string) => void`
  - Directive: `'use client'` (uses useSearchParams, useRouter)
  - Filters: "All Projects", "Aviation", "Dev/Startup", "Cross-pollination"
  - Active state: Brand color backgrounds (Sky Blue, Emerald 600, Purple)
  - Inactive state: Gray outline (`border-gray-500`)
  - REUSE: Button (`components/ui/Button.tsx`) with `variant` prop
  - Accessibility: `aria-pressed="true"` on active filter, keyboard navigation
  - From: research.md [ProjectFilters Specification]

- [ ] T021 [P] [US2] Integrate ProjectFilters into app/projects/page.tsx
  - File: `app/projects/page.tsx`
  - Hooks: `useSearchParams()`, `useRouter()` from `next/navigation`
  - State: `activeFilter` from URL query (`searchParams.get('category') || 'all'`)
  - Handler: `handleFilterChange()` updates URL with `router.push()`
  - Filtering: `filteredProjects = projects.filter(p => p.category === activeFilter)`
  - Empty state: Show "No projects found in this category" if `filteredProjects.length === 0`
  - From: quickstart.md [Step 5: Implement Client-Side Filtering]

- [ ] T022 [US2] Add screen reader announcement for filter changes
  - File: `app/projects/page.tsx`
  - Element: `<div aria-live="polite" className="sr-only">`
  - Content: `{activeFilter} filter active, showing {filteredProjects.length} projects`
  - Purpose: Announce filter changes to screen readers
  - From: visuals/README.md [Screen Reader Considerations]

- [ ] T023 [US2] Add keyboard navigation support for filters
  - File: `components/projects/ProjectFilters.tsx`
  - Support: Tab (navigate), Enter/Space (activate), optional Left/Right arrows
  - Focus: Visible 2px emerald-600 outline on all buttons
  - From: visuals/README.md [Keyboard Navigation]

---

## Phase 5: User Story 3 [P1] - Featured projects section

**Story Goal**: Visitors see 2-3 flagship projects with detailed metrics at top of page

**Independent Test Criteria**:
- [ ] Featured section appears above main grid
- [ ] 2-3 featured projects displayed in larger cards
- [ ] Each featured card shows: metrics (users, impact, outcome), expanded description, prominent CTAs
- [ ] Featured cards visually distinct (larger, border accent)

### Implementation

- [ ] T030 [P] [US3] Create FeaturedProjectCard component in components/projects/FeaturedProjectCard.tsx
  - File: `components/projects/FeaturedProjectCard.tsx`
  - Props: `project: Project` (with metrics required)
  - Extends: ProjectCard structure (larger layout)
  - Features: 2-column or full-width layout, expanded description (2-3 sentences, no clamp), metrics display (users, impact, outcome) with icons/badges, prominent CTAs (lg size buttons), visual distinction (border or shadow)
  - Pattern: `components/projects/ProjectCard.tsx` (extend with metrics section)
  - From: research.md [FeaturedProjectCard Specification]

- [ ] T031 [P] [US3] Add metrics display section to FeaturedProjectCard
  - File: `components/projects/FeaturedProjectCard.tsx`
  - Layout: 3-column metrics (users, impact, outcome)
  - Style: Large number (text-2xl, font-bold, emerald-600), label (text-sm, gray-500)
  - Accessibility: Metrics labeled for screen readers (e.g., "Active users")
  - From: design/copy.md [Metrics Display Format]

- [ ] T032 [US3] Integrate featured section into app/projects/page.tsx
  - File: `app/projects/page.tsx`
  - Data: `const featuredProjects = await getFeaturedProjects()` (max 3)
  - Layout: Featured section above ProjectFilters, use FeaturedProjectCard
  - Heading: "Featured Projects", subheading: "Flagship work demonstrating systematic thinking and dual-track expertise"
  - Conditional: Only show if `featuredProjects.length > 0`
  - From: design/copy.md [Featured Section]

- [ ] T033 [US3] Set featured images to eager loading with priority
  - File: `components/projects/FeaturedProjectCard.tsx`
  - Image props: `loading="eager"`, `priority={true}`
  - Purpose: Optimize LCP for featured section (above fold)
  - From: research.md [Image Optimization]

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Production readiness - performance, accessibility, deployment prep

### Performance Optimization

- [ ] T040 Optimize all project screenshots to <500KB
  - Files: `public/images/projects/*.png`
  - Tools: ImageOptim, Squoosh, or similar
  - Target: <500KB per image, 1200x675px (16:9)
  - Validation: Check file sizes with `ls -lh public/images/projects/`
  - From: research.md [Image Optimization]

- [ ] T041 [P] Add blur placeholder to all project images
  - Files: `components/projects/ProjectCard.tsx`, `components/projects/FeaturedProjectCard.tsx`
  - REUSE: `shimmerDataURL(1200, 675)` from `lib/utils/shimmer.ts`
  - Props: `placeholder="blur"`, `blurDataURL={shimmerDataURL(1200, 675)}`
  - Purpose: Prevent CLS during image load
  - From: research.md [Image Optimization]

- [ ] T042 [P] Add width/height attributes to all images
  - Files: `components/projects/ProjectCard.tsx`, `components/projects/FeaturedProjectCard.tsx`
  - Attributes: `width={1200}`, `height={675}`
  - Purpose: Prevent CLS (Cumulative Layout Shift)
  - Target: CLS <0.15
  - From: plan.md [Performance Strategy]

- [ ] T043 [P] Implement lazy loading for grid images
  - File: `components/projects/ProjectCard.tsx`
  - Prop: `loading="lazy"` (default, below fold)
  - Conditional: Only featured images use `loading="eager"`
  - Purpose: Improve FCP and TTI
  - From: research.md [Image Optimization]

### Accessibility

- [ ] T044 Validate color contrast ratios
  - Tool: Browser DevTools color picker or axe-core
  - Checks: White on Navy 900 (10.5:1 ✅), Gray 300 on Navy 900 (6.2:1 ✅), Emerald 600 on Navy 950 (4.8:1 ✅)
  - Target: WCAG 2.1 AA (4.5:1 minimum)
  - From: research.md [Color Contrast Checks]

- [ ] T045 [P] Add focus indicators to all interactive elements
  - Files: `components/projects/ProjectFilters.tsx`, `components/projects/ProjectCard.tsx`
  - Style: `focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2`
  - Elements: Filter buttons, project card links, CTA buttons
  - From: research.md [Focus Indicators]

- [ ] T046 [P] Add descriptive alt text to all project images
  - Files: `content/projects/*.mdx`
  - Pattern: `{project.title} screenshot showing [key feature visible]`
  - Example: "CFIPros.com screenshot showing student progress dashboard"
  - Validation: No generic alt text like "project screenshot"
  - From: visuals/README.md [Image Specifications]

- [ ] T047 Test keyboard navigation across entire page
  - Manual test: Tab through filters, project cards, CTAs
  - Verify: All interactive elements reachable, focus visible, Enter/Space activates
  - Tools: Keyboard only (no mouse), screen reader (NVDA or VoiceOver)
  - From: visuals/README.md [Keyboard Navigation]

### Deployment Preparation

- [ ] T048 Run Lighthouse audit and meet performance targets
  - Command: Chrome DevTools > Lighthouse > Run audit on `/projects`
  - Targets: Performance ≥85, Accessibility ≥95, Best Practices ≥90, SEO ≥95
  - Metrics: FCP <1.5s, TTI <3.5s, LCP <3.0s, CLS <0.15
  - Fix: Address any issues flagged by Lighthouse
  - From: plan.md [Performance Strategy]

---

## [TASK STATISTICS]

- **Total tasks**: 48
- **User story tasks**: 32 (US1: 7, US2: 4, US3: 4, Polish: 9)
- **Parallel opportunities**: 18 tasks marked [P]
- **Setup tasks**: 3 (Phase 1)
- **Foundation tasks**: 5 (Phase 2, blocks all stories)
- **MVP scope**: 28 tasks (Phase 1-5)
- **Polish scope**: 9 tasks (Phase 6)

## [ESTIMATED EFFORT]

- **Phase 1 (Setup)**: 30 minutes (create directories)
- **Phase 2 (Foundation)**: 4-6 hours (lib/projects.ts, base components)
- **Phase 3 (US1)**: 4-6 hours (page, MDX files, navigation)
- **Phase 4 (US2)**: 2-3 hours (filters + URL sync)
- **Phase 5 (US3)**: 3-4 hours (featured cards + metrics)
- **Phase 6 (Polish)**: 3-4 hours (performance, accessibility, Lighthouse)

**Total MVP**: 16-23 hours

## [IMPLEMENTATION NOTES]

**Component Reuse Success**:
- Container, Button, TrackBadge: Direct reuse (0 modifications)
- PostCard → ProjectCard: Adapt pattern (replace metadata with tech badges)
- PostGrid → ProjectGrid: Adapt layout (replace PostCard with ProjectCard)
- lib/posts.ts → lib/projects.ts: Copy MDX pattern (170 LOC)

**Zero New Dependencies**: All functionality uses existing packages (Next.js, gray-matter, Tailwind)

**Performance Budget**: FCP <1.5s, TTI <3.5s, LCP <3.0s, CLS <0.15, Lighthouse ≥85

**Accessibility Target**: WCAG 2.1 AA, Lighthouse Accessibility ≥95

---

**Generated**: 2025-10-29
**Ready for**: `/analyze` (cross-artifact validation)
