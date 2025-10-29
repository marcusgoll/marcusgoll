# Data Model: 052-llm-seo-optimization

## Entities

### MDX Post (File-based, not database)
**Purpose**: Blog post content with LLM optimization metadata

**Frontmatter Fields** (extends existing):
- `slug`: string (PK) - URL-safe post identifier
- `title`: string - Post headline
- `excerpt`: string - Summary for meta description AND TL;DR
- `date`: string (ISO 8601) - Publication date
- `author`: string - Content creator name
- `tags`: string[] - Topic categorization
- `featuredImage`: string? - Hero image path
- `readingTime`: number? - Auto-calculated minutes
- **NEW: `contentType`**: 'standard' | 'faq' | 'tutorial' - Schema selection
- **NEW: `faq`**: Array<{question: string, answer: string}>? - FAQ structured data

**Relationships**:
- Has many: Tags (via tags array)
- Belongs to: Author (single, currently hardcoded "Marcus Gollahon")
- Generates: Schema.org JSON-LD (BlogPosting, FAQPage, or HowTo based on contentType)

**Validation Rules**:
- `slug`: Required, matches filename (from FR-002)
- `title`: Required, max 100 chars (SEO best practice)
- `excerpt`: Required, 2-4 sentences (from US5)
- `contentType`: Optional, defaults to 'standard'
- `faq`: Required if contentType === 'faq', min 2 questions
- Heading hierarchy: H1 → H2 → H3 logical progression (build-time validation)

**State Transitions**:
- Draft → Published (via frontmatter `draft: true/false` field, existing)
- No state machine (static content)

---

## Schema.org Entities (Generated, not stored)

### BlogPosting Schema
**Purpose**: SEO metadata for standard blog posts

**Fields** (JSON-LD):
- `@context`: 'https://schema.org'
- `@type`: 'BlogPosting'
- `headline`: From frontmatter.title
- `datePublished`: From frontmatter.date
- `dateModified`: From frontmatter.publishedAt || date
- `author`: Person schema (name, url)
- `image`: Featured image URL (absolute)
- `articleBody`: Full MDX content
- `wordCount`: Auto-calculated
- `description`: From frontmatter.excerpt
- `publisher`: Organization schema (Marcus Gollahon)

**Generated for**: All posts (contentType === 'standard' or undefined)

### FAQPage Schema
**Purpose**: Structured Question/Answer data for AI extraction

**Fields** (JSON-LD):
- `@context`: 'https://schema.org'
- `@type`: 'FAQPage'
- `mainEntity`: Array of Question schemas
  - `@type`: 'Question'
  - `name`: Question text
  - `acceptedAnswer`: Answer schema
    - `@type`: 'Answer'
    - `text`: Answer text

**Generated for**: Posts where contentType === 'faq' AND frontmatter.faq exists

### HowTo Schema
**Purpose**: Step-by-step tutorial structure for AI systems

**Fields** (JSON-LD):
- `@context`: 'https://schema.org'
- `@type`: 'HowTo'
- `name`: Tutorial title
- `description`: Tutorial summary
- `step`: Array of HowToStep schemas
  - `@type`: 'HowToStep'
  - `name`: Step heading
  - `text`: Step content
  - `itemListElement`: Optional substeps

**Generated for**: Posts where contentType === 'tutorial'

---

## Database Schema

**NOT APPLICABLE**: No database changes

This feature uses MDX files (file system) for content storage. No PostgreSQL tables created or modified.

---

## API Schemas

**Request/Response Schemas**: N/A (no API endpoints)

**State Shape** (frontend):
```typescript
// TLDRSection component props
interface TLDRSectionProps {
  excerpt: string; // From frontmatter
}

// Enhanced PostFrontmatter type
interface PostFrontmatter {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  featuredImage?: string;
  readingTime?: number;
  contentType?: 'standard' | 'faq' | 'tutorial'; // NEW
  faq?: Array<{ question: string; answer: string }>; // NEW
}

// Schema generator function signatures
function generateBlogPostingSchema(post: PostData): BlogPostingSchema;
function generateFAQPageSchema(post: PostData): FAQPageSchema | null;
function generateHowToSchema(post: PostData): HowToSchema | null;
```

---

## Validation

**Build-Time**:
- Frontmatter: Zod schema validation (lib/mdx-types.ts)
- Heading hierarchy: Remark plugin (lib/remark-validate-headings.ts)
- TypeScript: Type checking (tsc --noEmit)

**Runtime**:
- None (static site, pre-rendered at build time)

**Constraints**:
- contentType must be one of: 'standard' | 'faq' | 'tutorial'
- If contentType === 'faq', faq array required (min 2 items)
- Heading levels must progress logically (H1 → H2 → H3, no skipping)
- excerpt must be 2-4 sentences (manual enforcement during content creation)
