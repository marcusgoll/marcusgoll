# Copy: Projects Showcase

Real content for all screens and components (no Lorem Ipsum).

## Screen: Projects Grid (`/projects`)

### Page Header
**Heading**: Projects
**Subheading**: Portfolio of aviation, development, and cross-pollination work—systematic thinking applied across domains

### Featured Section
**Heading**: Featured Projects
**Subheading**: Flagship work demonstrating dual-track expertise and measurable impact

### Filter Labels
- **All Projects** (default, shows all)
- **Aviation** (flight training, aviation tools)
- **Dev/Startup** (web apps, open-source)
- **Cross-pollination** (aviation + dev combined)

### Project Card Elements

**CTA Buttons**:
- **Primary**: "View Live Demo" (if liveUrl exists)
- **Secondary**: "View on GitHub" (if githubUrl exists)
- **Fallback**: "Coming Soon" (if no URLs, disabled state)

**Tech Stack Badge Overflow**:
- If >4 technologies: "+2 more" (interactive, shows tooltip or expands)

### State Messages

**Loading**:
"Loading projects..."

**Empty (filtered)**:
"No projects found in this category. Try browsing [All Projects](#) or select a different category."

**Error**:
"Unable to load projects. Please refresh the page or try again later."

---

## Screen: Project Detail (`/projects/[slug]`)

### Navigation
**Breadcrumb**: [Home](#) → [Projects](#) → [Project Title]
**Back Link**: "← Back to Projects"

### Section Headings
- **Problem**
- **Solution**
- **Tech Stack**
- **Challenges & Lessons Learned**
- **Results & Impact**

### CTA Buttons
- **Primary**: "Visit Live Site" (opens in new tab)
- **Secondary**: "View on GitHub" (opens in new tab)

### State Messages

**Loading**:
"Loading project details..."

**Not Found**:
"Project not found. [Return to the projects page](#) to browse all work."

**Error**:
"Unable to load project details. Please refresh the page or try again later."

---

## Component: ProjectCard

### Accessibility Labels
- **Card link**: "View details for [Project Title]"
- **Live demo button**: "Visit live demo of [Project Title] (opens in new tab)"
- **GitHub button**: "View source code for [Project Title] on GitHub (opens in new tab)"

### Category Badges (via TrackBadge component)
- **Aviation**: "Aviation" (Navy 900 background)
- **Dev/Startup**: "Dev/Startup" (Emerald 600 background)
- **Cross-pollination**: "Cross-pollination" (Purple background)

---

## Component: FeaturedProjectCard

### Metrics Display Format
- **Users**: "200+ CFIs" or "500+ students"
- **Impact**: "$10k revenue" or "Saves 5 hours/week"
- **Outcome**: "Reduced training time 40%" or "Eliminated manual paperwork"

### Metrics Labels (for accessibility)
- **Users**: "Active users"
- **Impact**: "Business impact"
- **Outcome**: "Key outcome"

---

## Error Messages

**Network Error**:
"Connection issue. Please check your internet and try again."

**Not Found (404)**:
"This project doesn't exist. Return to [projects page](#) to browse all work."

**Server Error (500)**:
"Something went wrong on our end. Please try again in a few moments."

---

## Sample Project Copy (for initial content)

### CFIPros.com (Aviation, Featured)

**Title**: CFIPros.com
**Description**: All-in-one platform for flight instructors managing students, lessons, and training records
**Category**: Aviation
**Tech Stack**: Next.js, TypeScript, Prisma, PostgreSQL, Vercel

**Full Description**:
CFIPros.com streamlines flight instructor workflows by centralizing student management, lesson planning, and record-keeping in one intuitive platform. Built for Certified Flight Instructors (CFIs) who spend hours on administrative tasks instead of teaching.

**Problem**:
Flight instructors juggle spreadsheets, paper logbooks, and disparate tools to track students, plan lessons, and maintain training records. This creates inefficiency, increases errors, and detracts from actual instruction time.

**Solution**:
A modern web platform that automates administrative tasks: student progress tracking with visual dashboards, lesson planning with templates, digital endorsements, and integrated record-keeping. Mobile-friendly for instructors who work across multiple airports.

**Tech Stack**:
- **Frontend**: Next.js 14 with TypeScript for type-safe development
- **Backend**: Prisma ORM with PostgreSQL for data integrity
- **Auth**: Clerk for secure authentication and user management
- **Deployment**: Vercel with edge functions for global low-latency
- **Testing**: Jest + React Testing Library for component tests

**Challenges & Lessons**:
- Balancing rich features with simple UX (pilots value simplicity over complexity)
- Ensuring mobile usability for instructors working at flight lines
- Handling regulatory compliance (FAA Part 61 training requirements)
- Optimizing for rural airports with limited bandwidth

**Results & Impact**:
- **200+ CFIs** using the platform across 15 states
- **1,500+ students** managed through the system
- **Saves instructors 5 hours/week** on paperwork and record-keeping
- **40% reduction** in training record errors

---

### Personal Website (Dev/Startup, Featured)

**Title**: Personal Website & Blog
**Description**: Next.js blog with dual-track content (Aviation + Dev/Startup) and systematic thinking themes
**Category**: Dev/Startup
**Tech Stack**: Next.js, TypeScript, Tailwind, MDX, Vercel

**Full Description**:
This website showcases dual-track expertise through content that bridges aviation and software development. Built with performance and accessibility as first principles, demonstrating technical proficiency through the platform itself.

**Problem**:
Traditional single-focus blogs don't reflect multi-disciplinary professionals. Need a platform that highlights cross-pollination between aviation and development without diluting either focus.

**Solution**:
A Next.js blog with track-based content filtering, allowing visitors to focus on Aviation, Dev/Startup, or Cross-pollination topics. Clean design with Navy 900 (Aviation) and Emerald 600 (Dev) color coding. Performance-optimized with sub-2s load times.

**Tech Stack**:
- **Framework**: Next.js 16 with App Router for modern routing
- **Content**: MDX for flexible, component-rich articles
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Analytics**: Google Analytics 4 with custom event tracking
- **SEO**: JSON-LD schemas for rich search results

**Challenges & Lessons**:
- Maintaining visual identity across two distinct content tracks
- Balancing technical depth with accessibility for non-technical readers
- Optimizing image-heavy aviation content for performance
- Building reusable component system without over-engineering

**Results & Impact**:
- **Lighthouse 95+** Performance, Accessibility, SEO scores
- **Sub-2s** page load times on 4G connections
- **WCAG 2.1 AA** compliant accessibility
- **Active blog** with 20+ articles across both tracks

---

### Spec-Flow Workflow (Cross-pollination, Featured)

**Title**: Spec-Flow Developer Workflow
**Description**: Automated workflow system bringing aviation checklists and systematic thinking to software development
**Category**: Cross-pollination
**Tech Stack**: Bash, YAML, Markdown, Git

**Full Description**:
Applies aviation checklist methodology to software development, creating a structured workflow that reduces errors and improves consistency. Inspired by flight deck procedures, adapted for feature delivery.

**Problem**:
Software teams lack systematic workflows, leading to inconsistent feature quality, forgotten steps, and context loss between phases. Aviation industry solved this decades ago with checklists and procedures.

**Solution**:
A Git-based workflow system with slash commands (`/spec`, `/plan`, `/implement`, `/ship`) that guide developers through structured phases. Each phase produces auditable artifacts, follows quality gates, and hands context to the next specialist—just like flight crew procedures.

**Tech Stack**:
- **Core**: Bash scripts + YAML state management
- **Documentation**: Markdown templates with structured formats
- **Integration**: Git workflow + GitHub Issues for roadmap
- **AI**: Claude Code integration for execution

**Challenges & Lessons**:
- Adapting aviation checklist thinking to flexible software workflows
- Balancing structure with developer autonomy
- Managing context across phase transitions (solved with YAML state files)
- Making systematic process feel lightweight, not bureaucratic

**Results & Impact**:
- **67% token reduction** vs. monolithic workflows (240k → 80k)
- **2-3x faster** feature delivery through phase isolation
- **Quality gate compliance** enforced systematically
- **Open-source** for developer community

---

## Help Text & Tooltips

**Tech Stack Badge (+N more)**:
"This project uses [N] additional technologies. Click to view full stack."

**Featured Badge**:
"Flagship project with detailed metrics and outcomes"

**External Link Icon**:
"Opens in new tab"

**Filter Active State**:
"Showing [N] [category] projects. Click 'All Projects' to reset."

---

## Microcopy

**Project Count Display** (above grid):
- All: "Showing 12 projects"
- Filtered: "Showing 4 Aviation projects"
- Empty: "No projects match this filter"

**Loading Skeleton**:
- "Loading project cards..." (screen reader only)

**Image Alt Text Pattern**:
- "[Project Title] screenshot showing [key feature]"
- Example: "CFIPros.com screenshot showing student progress dashboard"

---

## Tone & Voice (from constitution.md)

**Brand Essence**: "Systematic Mastery"

**Guidelines**:
- **Concise**: Get to the point (pilots value brevity)
- **Clear**: No jargon without explanation
- **Confident**: State capabilities directly, no hedging
- **Professional**: Respectful tone, industry-appropriate language
- **Cross-domain**: Connect aviation + dev naturally

**Avoid**:
- Marketing fluff ("revolutionize", "game-changing")
- Technical jargon without context
- Passive voice ("was built", "has been used")
- Superlatives without evidence ("best", "fastest")

**Examples**:
- ❌ "Revolutionizing flight training with cutting-edge technology"
- ✅ "Streamlines flight instructor workflows, saving 5 hours/week"

---

**Last Updated**: 2025-10-29
