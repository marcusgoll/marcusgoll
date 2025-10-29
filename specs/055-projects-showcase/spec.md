# Feature Specification: Projects Showcase Page

**Branch**: `feature/055-projects-showcase`
**Created**: 2025-10-29
**Status**: Draft
**GitHub Issue**: #8

## User Scenarios

### Primary User Story
As a potential client, employer, or collaborator visiting marcusgoll.com, I want to see concrete examples of Marcus's work across aviation and software development so that I can evaluate his expertise and decide whether to engage with him professionally.

### Acceptance Scenarios
1. **Given** I am on the homepage, **When** I click "Projects" in the navigation, **Then** I see a filterable grid of project cards with screenshots, titles, descriptions, and tech stack badges
2. **Given** I am viewing the projects page, **When** I click the "Aviation" filter, **Then** I see only aviation-related projects (e.g., CFIPros.com)
3. **Given** I am viewing a project card, **When** I click "View Live Site" or "View on GitHub", **Then** I am taken to the project's live demo or source code in a new tab
4. **Given** I am viewing the projects page, **When** I scroll to featured projects, **Then** I see 2-3 flagship projects with detailed metrics (users, impact, outcomes)

### Edge Cases
- What happens when no projects match the selected filter? → Show "No projects found" message with option to clear filters
- How does the system handle projects without screenshots? → Show placeholder image with project icon or tech stack logo
- What happens on mobile devices with small screens? → Stack project cards in single column, maintain filter usability
- How are projects without live URLs displayed? → Show "Coming Soon" badge or omit the live demo button

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**
- **US1** [P1]: As a visitor, I want to view a grid of all projects with basic information so that I can quickly scan Marcus's portfolio
  - **Acceptance**: Projects page displays all projects in responsive grid (1/2/3 columns), each card shows: title, 1-sentence description, category badge (Aviation/Dev/Hybrid), tech stack badges
  - **Independent test**: Navigate to /projects, verify all project cards render with required information
  - **Effort**: M (4-8 hours)

- **US2** [P1]: As a visitor, I want to filter projects by category (Aviation/Dev/Hybrid) so that I can focus on relevant work
  - **Acceptance**: Filter buttons above grid, clicking filter shows only matching projects, "All" button resets filter, active filter visually indicated
  - **Independent test**: Click each filter, verify correct projects shown, verify "All" resets
  - **Effort**: S (2-4 hours)

- **US3** [P1]: As a visitor, I want to see featured flagship projects with detailed metrics so that I can understand the impact of Marcus's best work
  - **Acceptance**: Top of page shows 2-3 featured projects with: larger cards, detailed description (2-3 paragraphs), key metrics (users, revenue, outcomes), prominent CTAs
  - **Independent test**: Verify featured section renders above main grid, verify metrics display correctly
  - **Effort**: M (4-8 hours)

**Priority 2 (Enhancement)**
- **US4** [P2]: As a visitor, I want to click project cards to see more details so that I can learn about implementation approach and challenges
  - **Acceptance**: Clicking project card opens detail view with: full description, problem statement, solution approach, tech stack breakdown, challenges/lessons learned, results/metrics
  - **Depends on**: US1
  - **Effort**: L (8-16 hours)

- **US5** [P2]: As a visitor, I want to search projects by keyword so that I can quickly find specific technologies or problem domains
  - **Acceptance**: Search input above filters, real-time search as user types, matches against: title, description, tech stack tags, problem domain
  - **Depends on**: US1
  - **Effort**: M (4-8 hours)

**Priority 3 (Nice-to-have)**
- **US6** [P3]: As a visitor, I want to see project screenshots in a gallery/lightbox so that I can preview the UI without leaving the page
  - **Acceptance**: Clicking project screenshot opens fullscreen gallery with navigation, supports keyboard (arrow keys, ESC), accessible
  - **Depends on**: US1
  - **Effort**: M (4-8 hours)

- **US7** [P3]: As a visitor, I want to sort projects by date, popularity, or relevance so that I can find the most recent or impactful work
  - **Acceptance**: Sort dropdown shows options: "Most Recent", "Most Popular", "Featured First", sorting applies to filtered results
  - **Depends on**: US1
  - **Effort**: S (2-4 hours)

**MVP Strategy**: Ship US1-US3 first (projects grid + filtering + featured section), validate with users, then incrementally add US4-US7 based on feedback and analytics.

## Visual References

See `./visuals/README.md` for UI research and design patterns

## Success Metrics (HEART Framework)

> **Note**: Not tracking user behavior metrics for MVP. Success measured qualitatively through:
> - Portfolio completeness (all projects documented)
> - Professional inquiries (email, LinkedIn messages referencing projects page)
> - Page engagement (time on page, navigation patterns via Google Analytics)

**Performance Targets** (from `design/systems/budgets.md`):
- **FCP** <1.5s: Critical for first impression
- **TTI** <3.5s: Must be interactive quickly
- **CLS** <0.15: Stable layout (images must have dimensions)
- **LCP** <3.0s: Hero/featured section must load fast
- **Lighthouse Performance** ≥85
- **Lighthouse Accessibility** ≥95

## Screens Inventory (UI Features Only)

Screens to design:
1. **projects-grid**: Full projects listing with filters - Primary action: "View Project Details" / "Visit Live Site"
2. **project-detail** (P2): Individual project detail page - Primary action: "View Live Site" / "View Code"

States per screen: `default`, `loading`, `empty`, `filtered-empty`, `error`

See `./design/screens.yaml` for full screen definitions

## Requirements

### Functional Requirements

**FR-001: Projects Data Source**
- Use MDX files in `content/projects/` directory for project data
- TypeScript interface defines project schema: `Project` with fields for title, slug, description, category, techStack, coverImage, liveUrl, githubUrl, featured, metrics
- MDX frontmatter contains structured metadata, body contains full description/narrative

**FR-002: Projects Grid Display**
- Responsive grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Each project card displays: cover image, title, 1-sentence excerpt, category badge (Aviation/Dev/Hybrid), tech stack badges (max 4 visible), CTA buttons (Live Demo + GitHub)
- Grid uses existing `PostGrid` component pattern for consistency

**FR-003: Category Filtering**
- Filter buttons: "All", "Aviation", "Dev/Startup", "Cross-pollination" (Hybrid)
- Clicking filter updates URL query parameter: `/projects?category=aviation`
- Active filter visually indicated (Navy 900 for Aviation, Emerald 600 for Dev/Startup, Purple for Cross-pollination)
- Filter state persists across page reloads (read from URL query)

**FR-004: Featured Projects Section**
- Top 2-3 projects marked `featured: true` in MDX frontmatter display in prominent hero section
- Featured cards larger with: full description, key metrics (formatted nicely), prominent CTAs
- Featured section appears above main grid, visually distinct

**FR-005: Project Card Interactions**
- "View Live Site" button opens project URL in new tab (`target="_blank" rel="noopener noreferrer"`)
- "View on GitHub" button opens GitHub repo in new tab
- Hover states: card lifts slightly, image zooms subtly (transform: scale(1.05))
- Clicking card (anywhere except buttons) navigates to project detail page (P2 story)

**FR-006: Tech Stack Badges**
- Display technology/framework names as visual badges below project title
- Use Tailwind color coding: Blue (frontend), Green (backend), Purple (database), Orange (deployment)
- Max 4 badges visible on card, "+N more" indicator if project uses more technologies
- Badges match design system (existing `TrackBadge` component pattern)

**FR-007: Empty States**
- "No projects found" message when filter returns zero results
- Includes suggestion to clear filters or browse all projects
- Maintains page layout (doesn't break grid)

### Non-Functional Requirements

**NFR-001: Performance**
- Projects page loads in <2s (LCP target: <3s)
- Images lazy-loaded below fold, eager-loaded above fold
- Project cards use optimized Next.js Image component with appropriate sizes
- MDX content parsed at build time (SSG), not runtime

**NFR-002: Accessibility**
- WCAG 2.1 AA compliance: All interactive elements keyboard accessible (Tab, Enter), focus indicators visible, color contrast ≥4.5:1, ARIA labels on icon buttons
- Screen reader announces filter changes: "Showing 5 Aviation projects"
- Images have descriptive alt text from MDX frontmatter

**NFR-003: SEO**
- Projects page has descriptive meta tags: title, description, Open Graph image
- Individual projects (P2) have JSON-LD schema: `CreativeWork` type with author, datePublished, keywords
- Semantic HTML: `<article>` for project cards, `<section>` for featured projects, proper heading hierarchy

**NFR-004: Mobile Responsiveness**
- Single-column layout on mobile (<640px), maintain usability
- Filter buttons stack vertically or scroll horizontally
- Touch targets ≥44x44px for buttons
- Images scale proportionally, no horizontal scroll

**NFR-005: Maintainability**
- Project data in MDX files for easy updates (no code changes needed to add projects)
- TypeScript types ensure data consistency across projects
- Component reuse: leverage existing `PostCard`, `Button`, `Container`, `TrackBadge` from UI inventory
- Clear documentation in project MDX template

## Technical Context

### Existing Components (from `design/systems/ui-inventory.md`)

**Reusable**:
- `Container` - Page width constraint wrapper
- `Button` - Primary/secondary CTAs with analytics tracking
- `PostCard` - Adaptable pattern for ProjectCard (same structure: image, title, excerpt, metadata, CTAs)
- `TrackBadge` - Category badges (Aviation/Dev/Hybrid) with color coding
- `PostGrid` - Responsive grid layout (1/2/3 columns)

**New Components Needed**:
- `ProjectCard` - Specialized project card extending PostCard pattern
- `FeaturedProjectCard` - Larger card variant for featured section with metrics display
- `TechStackBadge` - Technology badge component (similar to TrackBadge but different color scheme)
- `ProjectFilters` - Filter button group with active state management

**Rationale**: System-first approach reduces implementation time and ensures visual consistency with existing blog components.

### Data Schema (TypeScript)

```typescript
// lib/projects.ts
export interface Project {
  slug: string;
  title: string;
  description: string; // 1-sentence excerpt
  category: 'Aviation' | 'Dev/Startup' | 'Cross-pollination';
  techStack: string[]; // e.g., ['Next.js', 'TypeScript', 'Tailwind', 'Vercel']
  coverImage: string; // Path to screenshot
  liveUrl?: string; // Optional live demo URL
  githubUrl?: string; // Optional GitHub repo URL
  featured: boolean; // Show in featured section
  dateCreated: string; // ISO date
  metrics?: {
    users?: string; // e.g., "500+ users"
    impact?: string; // e.g., "$10k revenue"
    outcome?: string; // e.g., "Reduced training time 40%"
  };
  content: string; // Full MDX content for detail page (P2)
}
```

### MDX File Structure

```markdown
---
title: "CFIPros.com"
description: "All-in-one platform for flight instructors managing students, lessons, and training records"
category: "Aviation"
techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Vercel"]
coverImage: "/images/projects/cfipros-screenshot.png"
liveUrl: "https://cfipros.com"
githubUrl: "https://github.com/marcusgoll/cfipros"
featured: true
dateCreated: "2024-08-15"
metrics:
  users: "200+ CFIs"
  impact: "Managing 1,500+ students"
  outcome: "Saves instructors 5 hours/week on paperwork"
---

# CFIPros.com

[Full project narrative, challenges, lessons learned, technical approach]
```

### Brand Alignment

**Colors** (from `constitution.md`):
- **Aviation**: Navy 900 background, white text
- **Dev/Startup**: Emerald 600 accents
- **Cross-pollination**: Purple accents
- **Backgrounds**: Navy 950 page background, Navy 900 card backgrounds

**Typography**:
- Headings: Bold, Navy 900 (or white on dark backgrounds)
- Body: Regular, Gray 300 (on dark backgrounds)
- Project titles: 2xl, bold

**Brand Mission**: "I help pilots advance their aviation careers and teach developers to build with systematic thinking—bringing discipline, clarity, and proven teaching methods to everything I create."

Projects page reinforces this dual-track positioning by clearly categorizing work and highlighting cross-pollination projects.

## Assumptions

1. **Project Quantity**: 8-12 projects initially (3-4 Aviation, 3-4 Dev/Startup, 2-4 Cross-pollination)
2. **Content Ownership**: Marcus will provide project screenshots, descriptions, and metrics
3. **MDX Preference**: Using MDX (not Ghost CMS) for simplicity and version control
4. **No Search (MVP)**: Basic filtering sufficient for <20 projects, search can be added later (US5)
5. **Static Generation**: Projects built at compile time (SSG), no real-time updates needed
6. **Screenshot Format**: All project screenshots will be 16:9 aspect ratio, optimized for web

## Out of Scope (MVP)

- Individual project detail pages (P2 story, US4)
- Full-text search functionality (P2 story, US5)
- Screenshot galleries/lightboxes (P3 story, US6)
- Project sorting options (P3 story, US7)
- Project tags/keywords beyond tech stack
- GitHub auto-sync (manual MDX updates only)
- Project analytics tracking (pageviews, clicks)
- Related projects recommendations
- Project comments/feedback

## Success Criteria

✅ **User Value**:
- Visitors can quickly scan Marcus's portfolio in <30 seconds
- Filtering by category works smoothly with visual feedback
- Featured projects prominently display impact metrics
- CTAs (Live Demo, GitHub) are obvious and functional

✅ **Performance**:
- Projects page LCP <3.0s on 4G connection
- No Cumulative Layout Shift (images have proper dimensions)
- Lighthouse Performance score ≥85, Accessibility ≥95

✅ **Maintainability**:
- Adding new project requires only creating MDX file (no code changes)
- TypeScript types prevent invalid project data
- Component reuse from UI inventory successful (no new primitives needed)

✅ **SEO**:
- Projects page indexed by Google with proper meta tags
- Open Graph image displays correctly when shared on social media
- Semantic HTML structure passes accessibility audits

## Next Steps

1. **Phase 1**: `/plan` - Technical design, component architecture, data flow
2. **Phase 2**: `/tasks` - Break down implementation into 20-30 concrete tasks
3. **Phase 3**: `/validate` - Cross-check spec against plan and tasks
4. **Phase 4**: `/implement` - Build MVP (US1-US3)
5. **Phase 5**: `/optimize` - Performance, accessibility, code review
6. **Phase 6**: `/ship` - Deploy to production

## Appendix

### Sample Projects (for initial content)

**Aviation**:
1. CFIPros.com - Flight instructor management platform
2. Aviation Weather Brief - Simplified weather briefing tool
3. Checkride Prep - Interactive checkride preparation system

**Dev/Startup**:
1. Personal Website/Blog (this project!) - Next.js blog with dual-track content
2. Spec-Flow Workflow - Developer workflow automation tool
3. Open-source contributions

**Cross-pollination**:
1. Flight Training SaaS Business Model - Combining aviation expertise + dev skills
2. Systematic Thinking Workshop - Teaching aviation discipline to developers

---

**Last Updated**: 2025-10-29
