# Feature: Projects Showcase Page

## Overview
Create a dedicated /projects page displaying portfolio of aviation, development, and hybrid projects with filtering, detailed project cards, featured section, and MDX-based data source. Reinforces dual-track brand positioning (aviation instructor + software developer) through systematic project categorization and professional presentation.

## Research Findings

### UI Components (from design/systems/ui-inventory.md)
**Reusable components** (no new primitives needed):
- `Container` - Page width constraint wrapper
- `Button` - Primary/secondary CTAs with analytics tracking
- `PostCard` - Adaptable pattern for ProjectCard (same structure)
- `TrackBadge` - Category badges (Aviation/Dev/Hybrid) with brand colors
- `PostGrid` - Responsive grid layout (1/2/3 columns)

**New components needed**:
- `ProjectCard` (extends PostCard pattern)
- `FeaturedProjectCard` (larger variant with metrics)
- `TechStackBadge` (technology badges, different color scheme)
- `ProjectFilters` (filter button group with active states)

**Decision**: System-first approach successful - reusing 5 existing components, creating only 4 specialized variants. Reduces implementation time and ensures consistency with existing blog components.

### Brand Alignment (from constitution.md)
**Brand Mission**: "I help pilots advance their aviation careers and teach developers to build with systematic thinking—bringing discipline, clarity, and proven teaching methods to everything I create."

**Brand Colors**:
- **Navy 900** (`#1e3a5f`) - Aviation category, card backgrounds
- **Emerald 600** (`#059669`) - Dev/Startup category, CTAs
- **Purple** (`#9333ea`) - Cross-pollination category
- **Navy 950** (`#0f1729`) - Page background

**Brand Essence**: "Systematic Mastery" - Disciplined approach of aviation applied to development and teaching

**Tone**: Concise, clear, confident, professional. Avoid marketing fluff and unsupported superlatives.

### Similar Features (from codebase)
**Existing patterns to follow**:
- **About page** (app/about/page.tsx) - Simple page structure with sections, JSON-LD schema
- **Homepage post feed** (app/page.tsx) - Grid layout with filtering (track-based)
- **Post cards** (components/blog/PostCard.tsx) - Card pattern with image, title, excerpt, metadata, CTAs
- **Track badges** (components/blog/TrackBadge.tsx) - Category badges with color coding

**Key insight**: Projects page should feel like natural extension of existing blog infrastructure, using same component patterns and visual language.

### UX Patterns (from visual research)
**Reference sites analyzed**:
1. **Linear.app** - Clean card design, subtle hover states, generous whitespace
2. **Stripe.com/customers** - Metrics display, featured stories, clear CTAs
3. **GitHub.com/topics** - Tech stack badges, filtering, grid layout

**Adopted patterns**:
- Category filtering with visual feedback (active state matches brand colors)
- Two-tier card system (featured vs. regular)
- Progressive disclosure for tech stack (show 4, "+N more" for rest)
- Responsive grid behavior (1-2-3 columns)
- Empty states with clear recovery actions

**Performance targets** (from design/systems/budgets.md):
- FCP <1.5s, TTI <3.5s, CLS <0.15, LCP <3.0s
- Lighthouse Performance ≥85, Accessibility ≥95

## System Components Analysis

**Reusable (from ui-inventory.md)**:
- Container (page wrapper)
- Button (filter buttons, CTAs)
- PostCard pattern (adapt for ProjectCard)
- TrackBadge (category badges)
- PostGrid (responsive grid)

**New Components Needed**:
- ProjectCard (extends PostCard with tech stack badges)
- FeaturedProjectCard (larger with metrics display)
- TechStackBadge (technology badges with color coding)
- ProjectFilters (filter button group with active states)

**Rationale**: System-first approach reduces implementation time and ensures visual consistency. All new components follow established patterns from UI inventory.

## Feature Classification
- UI screens: true
- Improvement: false
- Measurable: false
- Deployment impact: false

## Technical Decisions

**Data Source**: MDX files in `content/projects/` directory
- Pros: Version control, easy updates, component-rich content, familiar to developer
- Cons: Manual updates (no CMS), content lives in repo
- Alternative considered: Ghost CMS custom post type (rejected for simplicity)

**Static Generation**: SSG (build-time) vs SSR (request-time)
- Decision: SSG - projects don't change frequently, want optimal performance
- Projects built at compile time, no runtime overhead
- ISR (revalidate: 60) on homepage to update project count

**TypeScript Schema**: `Project` interface in `lib/projects.ts`
- Enforces data consistency across all project MDX files
- Frontmatter validation at build time
- Type-safe component props

**Filtering Implementation**: URL query parameters
- `/projects?category=aviation` - shareable, back-button friendly
- Active filter persists across page reloads
- Client-side filtering (all projects loaded at build time)

**Image Optimization**:
- Next.js Image component for automatic optimization
- 16:9 aspect ratio (1200x675px recommended)
- WebP with JPEG fallback
- Lazy loading below fold, eager above fold
- Width/height attributes to prevent CLS

## MVP Scope

**Priority 1 (Ship first)**:
- US1: Projects grid with basic information (title, description, category, tech stack)
- US2: Category filtering (Aviation/Dev/Hybrid)
- US3: Featured projects section with metrics

**Priority 2 (Enhancement)**:
- US4: Individual project detail pages
- US5: Search functionality

**Priority 3 (Nice-to-have)**:
- US6: Screenshot galleries/lightbox
- US7: Sorting options

**Strategy**: Ship US1-US3 first, validate with users, then incrementally add US4-US7 based on feedback and analytics.

## Assumptions

1. **Project Quantity**: 8-12 projects initially (3-4 Aviation, 3-4 Dev/Startup, 2-4 Cross-pollination)
2. **Content Ownership**: Marcus will provide project screenshots, descriptions, and metrics
3. **MDX Preference**: Using MDX (not Ghost CMS) for simplicity and version control
4. **No Search (MVP)**: Basic filtering sufficient for <20 projects, search can be added later
5. **Static Generation**: Projects built at compile time (SSG), no real-time updates needed
6. **Screenshot Format**: All project screenshots 16:9 aspect ratio, optimized for web

## Checkpoints
- Phase 0 (Spec): 2025-10-29
- Phase 1 (Plan): 2025-10-29
- Phase 2 (Tasks): 2025-10-29
- Phase 3 (Validation): 2025-10-29

## Last Updated
2025-10-29

## Phase 2: Tasks (2025-10-29)

**Summary**:
- Total tasks: 48
- User story tasks: 32 (organized by priority P1)
- Parallel opportunities: 18 tasks marked [P]
- MVP scope: 28 tasks (Phase 1-5)
- Estimated effort: 16-23 hours

**Task Breakdown**:
- Phase 1 (Setup): 3 tasks - Create directories
- Phase 2 (Foundation): 5 tasks - lib/projects.ts, base components (blocks all)
- Phase 3 (US1): 7 tasks - Projects grid with basic info
- Phase 4 (US2): 4 tasks - Category filtering
- Phase 5 (US3): 4 tasks - Featured section with metrics
- Phase 6 (Polish): 9 tasks - Performance, accessibility

**Component Reuse Strategy**:
- Direct reuse: Container, Button, TrackBadge (0 modifications)
- Adapt pattern: PostCard → ProjectCard, PostGrid → ProjectGrid
- Copy pattern: lib/posts.ts → lib/projects.ts

**Parallel Execution**:
- Phase 2: T004, T005, T006 (lib + components, independent)
- Phase 3: T012, T013, T014 (MDX files, independent)
- Phase 6: T041, T042, T043, T045, T046 (polish tasks, independent)

**Checkpoint**:
- ✅ Tasks generated: 48 tasks
- ✅ User story organization: Complete (P1, P2, P3)
- ✅ Dependency graph: Created
- ✅ MVP strategy: Defined (US1-US3, 28 tasks)
- ✅ Parallel opportunities: Identified (18 tasks)
- ✅ Component reuse: Documented
- 📋 Ready for: /analyze

**Performance Targets**:
- FCP <1.5s, TTI <3.5s, LCP <3.0s, CLS <0.15
- Lighthouse: Performance ≥85, Accessibility ≥95

**Zero New Dependencies**: All functionality uses existing packages

## Phase 3: Validation (2025-10-29)

**Summary**:
- Cross-artifact validation completed
- Total issues found: 3 (0 Critical, 0 High, 1 Medium, 2 Low)
- Requirement coverage: 100% (12/12 requirements mapped to tasks)
- MVP user story coverage: 100% (US1-US3 fully covered)
- Dependency graph: Valid (no circular dependencies)

**Validation Results**:
- ✅ Constitution alignment: Brand mission, colors, tone verified
- ✅ Spec ↔ Plan consistency: Architecture, components, schema aligned
- ✅ Plan ↔ Tasks consistency: All planned files have creation tasks
- ✅ Functional requirements: 7/7 covered (FR-001 to FR-007)
- ✅ Non-functional requirements: 5/5 covered (NFR-001 to NFR-005)
- ✅ User stories (MVP): 3/3 covered (US1, US2, US3)
- ✅ User stories (P2-P3): 4/4 correctly excluded from MVP scope

**Issues Summary**:
1. **T1** (MEDIUM): Category terminology variance ("Dev/Startup" vs "dev-startup")
   - Mitigation: Code uses kebab-case enum, UI layer maps to display names
2. **C1** (LOW): ARIA labels covered by T041-T042 accessibility audits
3. **C2** (LOW): Meta tags covered by T010 page creation pattern

**Quality Gates Verified**:
- Performance: FCP <1.5s, TTI <3.5s, CLS <0.15, LCP <3.0s (T045, T046)
- Accessibility: WCAG 2.1 AA, keyboard nav, screen readers (T041, T042, T043)
- SEO: Meta tags, JSON-LD schema, semantic HTML (T010, T011)
- Maintainability: TypeScript types, component reuse, zero new deps (T004-T008)

**Checkpoint**:
- ✅ Analysis report: Created (analysis.md, 340 lines)
- ✅ Critical blockers: 0 (ready for implementation)
- ✅ High-priority issues: 0 (no review needed)
- ✅ Medium issues: 1 (cosmetic, mitigated)
- ✅ Low issues: 2 (already addressed by existing tasks)
- ✅ Validation confidence: High (95%+)
- 📋 Ready for: /implement

**Next Phase**: Implementation (32 tasks, 16-23 hours estimated)
