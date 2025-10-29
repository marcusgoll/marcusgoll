# Data Model: 053-json-ld-structured-data

## Overview

This feature extends the existing schema generation system with additional Schema.org types. All schemas are generated at build time from existing data sources (MDX frontmatter, constitution.md).

**No database changes required** - all data is derived from existing files.

---

## Entities

### BlogPosting (Extended)

**Purpose**: Article structured data for blog posts with dual-track category classification

**Source**: Existing in lib/schema.ts (lines 108-150), extended with articleSection field

**Fields**:
- `@context`: "https://schema.org" (constant)
- `@type`: "BlogPosting" (constant)
- `headline`: string - Post title from frontmatter.title
- `datePublished`: ISO 8601 string - From frontmatter.date
- `dateModified`: ISO 8601 string - From frontmatter.publishedAt || frontmatter.date
- `author`: Person object - From frontmatter.author
- `image`: string | string[] - From frontmatter.featuredImage or default og-image
- `articleBody`: string - Full content from MDX
- `wordCount`: number - Calculated from content
- `description`: string - From frontmatter.excerpt
- `publisher`: Organization object - Marcus Gollahon brand
- `mainEntityOfPage`: WebPage object - Canonical URL
- `articleSection`: string - **NEW** - Mapped category from tags (FR-006)

**Validation Rules**:
- articleSection: MUST be one of ["Aviation", "Development", "Leadership", "Blog"] (from requirement FR-006)
- All URLs: MUST be absolute with https protocol
- datePublished/dateModified: MUST be valid ISO 8601 format

**Category Mapping Logic** (FR-006):
```
if tags include "aviation" OR "flight-training" → "Aviation"
else if tags include "development" OR "startup" OR "coding" → "Development"
else if tags include "leadership" OR "teaching" → "Leadership"
else → "Blog" (default)
```

---

### Person (New)

**Purpose**: Individual person schema for About page and author references

**Source**: New in lib/schema.ts, data from constitution.md

**Fields**:
- `@context`: "https://schema.org" (constant)
- `@type`: "Person" (constant)
- `name`: string - "Marcus Gollahon" (from constitution)
- `jobTitle`: string - Extracted from constitution brand mission (line 19)
- `description`: string - From constitution brand essence (line 21)
- `url`: string - "https://marcusgoll.com"
- `image`: string - Profile photo URL
- `sameAs`: string[] - Social profile URLs (Twitter, LinkedIn, GitHub)
- `knowsAbout`: string[] - ["Aviation", "Software Development", "Education", "Flight Instruction"]

**Extraction Strategy**:
- Read constitution.md at build time
- Parse brand mission for jobTitle (e.g., "Aviation CFI and Startup Builder")
- Parse brand essence for description
- Social links: Extract from constitution Personal Brand Principles section

**Validation Rules**:
- sameAs: All URLs MUST be absolute, HTTPS, valid social media domains
- knowsAbout: Minimum 2 items, align with dual-track brand strategy

---

### Website (New)

**Purpose**: Website-level schema for homepage with search capability

**Source**: New in lib/schema.ts, static configuration

**Fields**:
- `@context`: "https://schema.org" (constant)
- `@type`: "Website" (constant)
- `name`: string - "Marcus Gollahon"
- `url`: string - "https://marcusgoll.com"
- `description`: string - Site tagline from constitution
- `potentialAction`: SearchAction object - **Key feature for SERP search box**
  - `@type`: "SearchAction"
  - `target`: string - "https://marcusgoll.com/search?q={search_term_string}"
  - `query-input`: string - "required name=search_term_string"

**Validation Rules**:
- potentialAction.target: MUST include {search_term_string} placeholder
- All URLs: MUST be absolute with https protocol

**Note**: Search functionality implementation is out of scope (US2 acceptance criteria). Schema preparation only.

---

### Organization (New)

**Purpose**: Brand entity schema with founder reference

**Source**: New in lib/schema.ts, data from constitution.md

**Fields**:
- `@context`: "https://schema.org" (constant)
- `@type`: "Organization" (constant)
- `name`: string - "Marcus Gollahon" (personal brand)
- `url`: string - "https://marcusgoll.com"
- `logo`: ImageObject - Site logo
  - `@type`: "ImageObject"
  - `url`: string - Logo URL
- `description`: string - From constitution brand mission
- `founder`: Person reference - Links to Person schema
- `sameAs`: string[] - Social profile URLs (Twitter, LinkedIn, GitHub)

**Relationships**:
- References Person schema for founder field

**Validation Rules**:
- founder: MUST reference valid Person schema (same data source)
- logo: MUST be square image, minimum 112x112px (Google requirement)
- sameAs: Shared with Person schema, MUST be consistent

---

## Database Schema

**N/A** - No database changes. All data derived from:
1. MDX frontmatter (blog posts)
2. constitution.md (brand/author data)
3. Static configuration (URLs, constants)

---

## API Schemas

**N/A** - No API endpoints. Schemas generated during Next.js build process (SSG).

**Build-time Pipeline**:
```
1. Read MDX files → Extract frontmatter
2. Read constitution.md → Extract brand data
3. Generate schemas → Embed in HTML <head>
4. Static export → Deploy to production
```

---

## State Shape

**Frontend State**: None required - schemas are static HTML embedded at build time

**TypeScript Interfaces** (lib/schema.ts):

```typescript
// Extended BlogPosting interface
export interface BlogPostingSchema {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  datePublished: string;
  dateModified: string;
  author: PersonSchema;
  image?: string | string[];
  articleBody: string;
  wordCount: number;
  description: string;
  publisher: OrganizationSchema;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection: string; // NEW FIELD
}

// New Person interface
export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
  knowsAbout: string[];
}

// New Website interface
export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'Website';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

// New Organization interface
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: {
    '@type': 'ImageObject';
    url: string;
  };
  description: string;
  founder: PersonSchema;
  sameAs: string[];
}
```

---

## Validation Strategy

**Build-time Validation** (US5, FR-010, FR-011):
1. **Type Safety**: TypeScript interfaces enforce schema structure
2. **Unit Tests**: Jest tests for each generator function
3. **Schema Validation**: Google Rich Results Test API integration
4. **Visual Inspection**: Manual validation during /preview phase

**Validation Targets**:
- ✅ All required Schema.org properties present
- ✅ All URLs absolute and valid
- ✅ All dates in ISO 8601 format
- ✅ Category mapping logic correct (Aviation/Dev/Leadership/Blog)
- ✅ Zero errors in Google Rich Results Test
- ✅ Zero warnings in Schema.org validator

---

## Performance Considerations

**Generation Time** (NFR-001): <10ms per page
- Object creation: <1ms per schema
- Constitution read: Once per build (cached)
- Category mapping: O(n) where n = tag count (typically 3-5 tags)

**JSON-LD Size** (NFR-002): <5KB per page
- BlogPosting: ~2KB
- Person: ~1KB
- Website: ~0.5KB
- Organization: ~1KB
- Total: ~4.5KB (within budget)

**No Runtime Cost**: All schemas generated at build time, embedded in static HTML
