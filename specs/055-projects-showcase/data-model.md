# Data Model

**Feature**: Projects Showcase Page
**Created**: 2025-10-29
**Phase**: Planning

## Overview

Projects are stored as MDX files in `content/projects/` with frontmatter metadata. Each project has a TypeScript interface enforcing data consistency, and MDX content provides rich project descriptions with embedded React components.

---

## Entities

### 1. Project

**Description**: A portfolio project with metadata, links, metrics, and full content.

**Storage**: MDX file in `content/projects/[slug].mdx`

**TypeScript Interface**:

```typescript
// lib/projects.ts

export interface Project {
  // Core metadata
  slug: string;                // URL-safe identifier (e.g., "cfipros")
  title: string;               // Display name (e.g., "CFIPros.com")
  description: string;         // 1-sentence excerpt for cards

  // Categorization
  category: 'aviation' | 'dev-startup' | 'cross-pollination';

  // Technology
  techStack: string[];         // Array of technologies (e.g., ["Next.js", "TypeScript"])

  // Media
  coverImage: string;          // Path to screenshot (e.g., "/images/projects/cfipros.png")

  // Links
  liveUrl?: string;            // Optional live demo URL
  githubUrl?: string;          // Optional GitHub repository URL

  // Flags
  featured: boolean;           // Show in featured section

  // Dates
  dateCreated: string;         // ISO 8601 date (e.g., "2024-03-15")

  // Metrics (featured projects only)
  metrics?: {
    users?: string;            // e.g., "200+ CFIs"
    impact?: string;           // e.g., "$10k revenue"
    outcome?: string;          // e.g., "Reduced training time 40%"
  };

  // Full content
  content: string;             // Rendered HTML or MDX content
}
```

**Validation Rules**:
- `slug`: Required, unique, lowercase, kebab-case (e.g., `cfipros`, `personal-website`)
- `title`: Required, max 80 characters
- `description`: Required, max 200 characters (1-2 sentences)
- `category`: Required, one of `'aviation'`, `'dev-startup'`, `'cross-pollination'`
- `techStack`: Required, array of 2-10 technologies
- `coverImage`: Required, path to 16:9 image (1200x675px recommended)
- `liveUrl`: Optional, valid URL
- `githubUrl`: Optional, valid URL
- `featured`: Required, boolean
- `dateCreated`: Required, ISO 8601 format (YYYY-MM-DD)
- `metrics`: Optional, object with 3 optional string fields
- `content`: Auto-generated from MDX body

**Relationships**:
- Project → Category (1:1, via `category` field)
- Project → Technologies (1:N, via `techStack` array)

---

## MDX Frontmatter Schema

### Example: `content/projects/cfipros.mdx`

```yaml
---
# Core Metadata
title: "CFIPros.com"
description: "All-in-one platform for flight instructors managing students, lessons, and training records"

# Categorization
category: "aviation"

# Technology Stack
techStack:
  - "Next.js"
  - "TypeScript"
  - "Prisma"
  - "PostgreSQL"
  - "Vercel"

# Media
coverImage: "/images/projects/cfipros.png"

# Links
liveUrl: "https://cfipros.com"
githubUrl: "https://github.com/marcusgoll/cfipros"

# Flags
featured: true

# Dates
dateCreated: "2024-03-15"

# Metrics (featured only)
metrics:
  users: "200+ CFIs"
  impact: "Saves 5 hours/week"
  outcome: "40% reduction in training record errors"
---

## Problem

Flight instructors juggle spreadsheets, paper logbooks, and disparate tools to track students, plan lessons, and maintain training records. This creates inefficiency, increases errors, and detracts from actual instruction time.

## Solution

A modern web platform that automates administrative tasks: student progress tracking with visual dashboards, lesson planning with templates, digital endorsements, and integrated record-keeping. Mobile-friendly for instructors who work across multiple airports.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript for type-safe development
- **Backend**: Prisma ORM with PostgreSQL for data integrity
- **Auth**: Clerk for secure authentication and user management
- **Deployment**: Vercel with edge functions for global low-latency
- **Testing**: Jest + React Testing Library for component tests

## Challenges & Lessons

- Balancing rich features with simple UX (pilots value simplicity over complexity)
- Ensuring mobile usability for instructors working at flight lines
- Handling regulatory compliance (FAA Part 61 training requirements)
- Optimizing for rural airports with limited bandwidth

## Results & Impact

- **200+ CFIs** using the platform across 15 states
- **1,500+ students** managed through the system
- **Saves instructors 5 hours/week** on paperwork and record-keeping
- **40% reduction** in training record errors
```

---

## Field Definitions

### Core Metadata

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `title` | string | Yes | Project display name | `"CFIPros.com"` |
| `description` | string | Yes | 1-sentence excerpt (max 200 chars) | `"All-in-one platform for flight instructors..."` |

### Categorization

| Field | Type | Required | Description | Valid Values |
|-------|------|----------|-------------|--------------|
| `category` | enum | Yes | Project category matching brand tracks | `'aviation'`, `'dev-startup'`, `'cross-pollination'` |

### Technology Stack

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `techStack` | string[] | Yes | Array of technologies (2-10 items) | `["Next.js", "TypeScript", "Prisma"]` |

**Technology Naming Conventions**:
- Use official capitalization (e.g., `"Next.js"`, not `"nextjs"`)
- Include version if relevant (e.g., `"Next.js 14"`)
- Use full names, not abbreviations (e.g., `"TypeScript"`, not `"TS"`)

### Media

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `coverImage` | string | Yes | Path to project screenshot (16:9 aspect ratio) | `"/images/projects/cfipros.png"` |

**Image Requirements**:
- Aspect ratio: 16:9 (1200x675px recommended)
- Format: PNG or JPG (WebP auto-generated by Next.js)
- Size: <500KB (compress before committing)
- Alt text: Auto-generated from `title` (e.g., "CFIPros.com screenshot")

### Links

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `liveUrl` | string | No | Live demo URL (if publicly accessible) | `"https://cfipros.com"` |
| `githubUrl` | string | No | GitHub repository URL (if public) | `"https://github.com/marcusgoll/cfipros"` |

**Link Validation**:
- Must be valid URLs (https:// or http://)
- If both missing, CTA shows "Coming Soon" (disabled)

### Flags

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `featured` | boolean | Yes | Show in featured section (top of page) | `true` |

**Featured Project Rules**:
- Max 3 featured projects at a time
- Must have `metrics` field populated
- Displayed in larger cards with metrics

### Dates

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `dateCreated` | string | Yes | Project creation date (ISO 8601 format) | `"2024-03-15"` |

**Date Format**: `YYYY-MM-DD` (ISO 8601)

### Metrics (Featured Only)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `metrics.users` | string | No | User count or audience size | `"200+ CFIs"` |
| `metrics.impact` | string | No | Business or time impact | `"Saves 5 hours/week"` |
| `metrics.outcome` | string | No | Key measurable outcome | `"40% reduction in errors"` |

**Metrics Rules**:
- Only required for `featured: true` projects
- At least 2 of 3 metrics should be populated
- Keep metrics concise (max 30 characters each)
- Use specific numbers, not vague claims

---

## Data Access Patterns

### 1. Get All Projects (Sorted by Date)

**Function**: `getAllProjects()`

**Query**: Read all `.mdx` files in `content/projects/`, parse frontmatter, sort by `dateCreated` descending

**Returns**: `Project[]`

**Example**:
```typescript
const projects = await getAllProjects();
// [{ slug: "cfipros", title: "CFIPros.com", ... }, ...]
```

### 2. Get Project by Slug

**Function**: `getProjectBySlug(slug: string)`

**Query**: Read `content/projects/[slug].mdx`, parse frontmatter and content

**Returns**: `Project`

**Example**:
```typescript
const project = getProjectBySlug('cfipros');
// { slug: "cfipros", title: "CFIPros.com", content: "...", ... }
```

### 3. Get Featured Projects

**Function**: `getFeaturedProjects()`

**Query**: Filter `getAllProjects()` by `featured: true`, limit to 3

**Returns**: `Project[]` (max 3)

**Example**:
```typescript
const featured = await getFeaturedProjects();
// [{ slug: "cfipros", featured: true, metrics: {...}, ... }]
```

### 4. Get Projects by Category

**Function**: `getProjectsByCategory(category: string)`

**Query**: Filter `getAllProjects()` by `category` field

**Returns**: `Project[]`

**Example**:
```typescript
const aviationProjects = await getProjectsByCategory('aviation');
// [{ slug: "cfipros", category: "aviation", ... }]
```

### 5. Get Project Slugs (for Static Paths)

**Function**: `getProjectSlugs()`

**Query**: Read filenames from `content/projects/`, strip `.mdx` extension

**Returns**: `string[]`

**Example**:
```typescript
const slugs = getProjectSlugs();
// ["cfipros", "personal-website", "spec-flow"]
```

---

## Type Guards & Validation

### Category Type Guard

```typescript
export const isValidCategory = (
  category: string
): category is Project['category'] => {
  return ['aviation', 'dev-startup', 'cross-pollination'].includes(category);
};
```

### Featured Project Type Guard

```typescript
export const isFeaturedProject = (project: Project): boolean => {
  return project.featured && !!project.metrics;
};
```

### Tech Stack Validator

```typescript
export const validateTechStack = (techStack: string[]): boolean => {
  return techStack.length >= 2 && techStack.length <= 10;
};
```

---

## Default Values

### Missing Optional Fields

If frontmatter omits optional fields, apply these defaults:

| Field | Default Value | Rationale |
|-------|---------------|-----------|
| `liveUrl` | `undefined` | Hide "View Live Demo" button |
| `githubUrl` | `undefined` | Hide "View on GitHub" button |
| `metrics` | `undefined` | Don't show metrics section |
| `metrics.users` | `undefined` | Hide users metric |
| `metrics.impact` | `undefined` | Hide impact metric |
| `metrics.outcome` | `undefined` | Hide outcome metric |

### Missing Required Fields

If frontmatter omits required fields, use these fallbacks:

| Field | Fallback | Error Handling |
|-------|----------|----------------|
| `title` | `slug` (capitalized) | Warn in dev mode |
| `description` | `""` (empty string) | Error in dev mode |
| `category` | `'dev-startup'` | Error in dev mode |
| `techStack` | `[]` (empty array) | Error in dev mode |
| `coverImage` | `'/images/projects/placeholder.png'` | Warn in dev mode |
| `featured` | `false` | Use default |
| `dateCreated` | Current date | Use default |

---

## Sample Data

### Sample Project 1: Aviation (Featured)

**File**: `content/projects/cfipros.mdx`

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
```

### Sample Project 2: Dev/Startup (Featured)

**File**: `content/projects/personal-website.mdx`

```yaml
---
title: "Personal Website & Blog"
description: "Next.js blog with dual-track content (Aviation + Dev/Startup) and systematic thinking themes"
category: "dev-startup"
techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Vercel"]
coverImage: "/images/projects/personal-website.png"
liveUrl: "https://marcusgoll.com"
githubUrl: "https://github.com/marcusgoll/marcusgoll-site"
featured: true
dateCreated: "2024-01-10"
metrics:
  users: "Active blog"
  impact: "Sub-2s load times"
  outcome: "Lighthouse 95+ scores"
---
```

### Sample Project 3: Cross-pollination (Featured)

**File**: `content/projects/spec-flow.mdx`

```yaml
---
title: "Spec-Flow Developer Workflow"
description: "Automated workflow system bringing aviation checklists to software development"
category: "cross-pollination"
techStack: ["Bash", "YAML", "Markdown", "Git"]
coverImage: "/images/projects/spec-flow.png"
liveUrl: null
githubUrl: "https://github.com/marcusgoll/spec-flow"
featured: true
dateCreated: "2024-06-20"
metrics:
  users: "Open-source"
  impact: "67% token reduction"
  outcome: "2-3x faster delivery"
---
```

### Sample Project 4: Aviation (Non-Featured)

**File**: `content/projects/flight-school-dashboard.mdx`

```yaml
---
title: "Flight School Dashboard"
description: "Real-time student progress tracking for flight schools with 50+ students"
category: "aviation"
techStack: ["React", "Node.js", "MongoDB"]
coverImage: "/images/projects/flight-school-dashboard.png"
liveUrl: null
githubUrl: null
featured: false
dateCreated: "2023-11-05"
---
```

---

## Data Integrity

### Build-Time Validation

**Strategy**: Validate all project MDX files at build time, fail build if invalid

**Checks**:
1. All required fields present
2. `category` is valid enum value
3. `techStack` has 2-10 items
4. `dateCreated` is valid ISO 8601 date
5. `coverImage` file exists
6. `liveUrl` and `githubUrl` are valid URLs (if present)
7. `featured: true` projects have `metrics` field

**Implementation**:
```typescript
// lib/projects.ts

const validateProject = (project: Project, slug: string): void => {
  if (!project.title) {
    throw new Error(`Project ${slug}: Missing required field 'title'`);
  }
  if (!isValidCategory(project.category)) {
    throw new Error(`Project ${slug}: Invalid category '${project.category}'`);
  }
  if (!validateTechStack(project.techStack)) {
    throw new Error(`Project ${slug}: techStack must have 2-10 items`);
  }
  // ... more validations
};
```

### Runtime Validation (Optional)

For client-side filtering and search (future enhancement):
- Use Zod schema for runtime validation
- Validate user input (filter selections, search queries)
- Sanitize URLs before rendering

---

## Indexing Strategy

### Primary Index

**Field**: `slug` (unique)

**Purpose**: Direct access to project by slug

**Implementation**: In-memory Map during build

```typescript
const projectsMap = new Map<string, Project>();
projects.forEach(p => projectsMap.set(p.slug, p));
```

### Secondary Indexes

**1. Category Index**:
```typescript
const projectsByCategory = new Map<string, Project[]>();
projects.forEach(p => {
  if (!projectsByCategory.has(p.category)) {
    projectsByCategory.set(p.category, []);
  }
  projectsByCategory.get(p.category)!.push(p);
});
```

**2. Featured Index**:
```typescript
const featuredProjects = projects.filter(p => p.featured && p.metrics);
```

**3. Date Index (for sorting)**:
```typescript
const projectsByDate = [...projects].sort((a, b) =>
  new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
);
```

---

## Migration Path

### Adding New Fields (Non-Breaking)

To add a new optional field (e.g., `tags: string[]`):

1. Update `Project` interface in `lib/projects.ts`
2. Add field to MDX frontmatter (optional)
3. Update sample projects with new field
4. Update data-model.md documentation

### Removing Fields (Breaking)

To remove a field (e.g., deprecate `metrics`):

1. Mark field as deprecated in TypeScript (`@deprecated`)
2. Stop using field in components
3. Remove field from MDX frontmatter after 1 release cycle
4. Update `Project` interface and remove field

### Changing Field Types (Breaking)

To change a field type (e.g., `techStack: string[]` → `techStack: Tech[]`):

1. Create migration script to transform MDX frontmatter
2. Update `Project` interface
3. Update all components using the field
4. Run migration script on all MDX files
5. Update data-model.md documentation

---

**Next Step**: Generate `quickstart.md` with integration scenarios for developers.

**Last Updated**: 2025-10-29
