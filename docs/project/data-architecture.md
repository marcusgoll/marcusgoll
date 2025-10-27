# Data Architecture

**Last Updated**: 2025-10-26
**Related Docs**: See `system-architecture.md` for data flows, `tech-stack.md` for database choices

## High-Level Domain Model

**Purpose**: Define major entities and their relationships (technology-agnostic)

```mermaid
erDiagram
    USER ||--o{ POST : creates
    POST ||--o{ TAG : has
    TAG ||--o{ POST : categorizes
    USER ||--o{ NEWSLETTER_SUBSCRIBER : manages
    POST ||--o{ ANALYTICS_EVENT : tracks
    NEWSLETTER_SUBSCRIBER ||--o{ NEWSLETTER_PREFERENCE : has

    USER {
        uuid id PK
        string email UK
        string name
        string role
        timestamp created_at
    }

    POST {
        string slug PK
        string title
        string excerpt
        text content_mdx
        string track
        timestamp published_at
        int reading_time_minutes
    }

    TAG {
        string slug PK
        string name
        string description
    }

    NEWSLETTER_SUBSCRIBER {
        uuid id PK
        string email UK
        boolean active
        timestamp subscribed_at
        timestamp unsubscribed_at
        string unsubscribe_token UK
    }

    NEWSLETTER_PREFERENCE {
        uuid id PK
        uuid subscriber_id FK
        string newsletter_type
        boolean subscribed
        timestamp updated_at
    }

    ANALYTICS_EVENT {
        uuid id PK
        string post_slug FK
        string event_type
        jsonb metadata
        timestamp created_at
    }
```

**Note**: Currently, most entities are stored as MDX files (filesystem), not database. Database schema is prepared for future growth.

---

## Entities & Schemas

### Entity: User

**Purpose**: Represents site administrator (Marcus) or future collaborators

**Fields**:

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String (CUID) | PK | Unique identifier |
| `email` | String (255) | UNIQUE, NOT NULL | User email |
| `name` | String (200) | NULLABLE | Display name |
| `created_at` | Timestamp | NOT NULL, DEFAULT NOW() | Account creation |
| `updated_at` | Timestamp | NOT NULL, AUTO-UPDATE | Last modified |

**Relationships**:
- Has many: Post (future, when posts move to DB)
- Has many: Newsletter subscribers (manages)

**Validation Rules**:
- Email must be valid format (Zod validation)
- Email must be unique

**Indexes**:
- `users_email_idx` ON (email) - Unique constraint, fast lookup

**Current Status**: Placeholder model in Prisma schema, not actively used

---

### Entity: Post (Future)

**Purpose**: Blog post content (currently MDX files, future DB storage)

**Current Storage**: Filesystem (`content/posts/*.mdx`)

**Future Schema** (when migrated to DB):

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `slug` | String (100) | PK | URL-friendly identifier (e.g., "systematic-thinking") |
| `title` | String (200) | NOT NULL | Post title |
| `excerpt` | String (500) | NOT NULL | Short summary |
| `content_mdx` | Text | NOT NULL | Full MDX content |
| `track` | ENUM('aviation', 'dev-startup') | NOT NULL | Content category |
| `published_at` | Timestamp | NOT NULL | Publication date |
| `reading_time_minutes` | Integer | NOT NULL, >= 1 | Calculated reading time |
| `featured_image_url` | String | NULLABLE | Cover image |
| `author_id` | String (CUID) | FK → users(id) | Post author |
| `created_at` | Timestamp | NOT NULL, DEFAULT NOW() | Creation time |
| `updated_at` | Timestamp | NOT NULL, AUTO-UPDATE | Last edit |

**Relationships**:
- Belongs to: User (author)
- Many-to-many: Tag (via PostTag junction table)

**Validation Rules**:
- Slug must be URL-safe (lowercase, hyphens only)
- Reading time must be positive integer
- Track must be 'aviation' or 'dev-startup'
- Published_at cannot be in future

**Indexes**:
- `posts_slug_idx` ON (slug) - Primary key, fast lookup
- `posts_track_published_idx` ON (track, published_at DESC) - List posts by category
- `posts_published_at_idx` ON (published_at DESC) - Recent posts query

---

### Entity: Tag (Future)

**Purpose**: Content categorization (e.g., "flight-training", "nextjs", "startups")

**Current Storage**: Extracted from MDX frontmatter

**Future Schema**:

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `slug` | String (50) | PK | URL-friendly identifier |
| `name` | String (50) | NOT NULL | Display name |
| `description` | String (200) | NULLABLE | Tag description |
| `post_count` | Integer | DEFAULT 0 | Cached count (updated on post publish/unpublish) |

**Relationships**:
- Many-to-many: Post (via PostTag junction table)

**Indexes**:
- `tags_slug_idx` ON (slug) - Primary key
- `tags_post_count_idx` ON (post_count DESC) - Popular tags

---

### Entity: Newsletter Subscriber (Future)

**Purpose**: Email subscribers for multi-track newsletter system

**Future Schema**:

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String (CUID) | PK | Unique identifier |
| `email` | String (255) | UNIQUE, NOT NULL | Subscriber email |
| `active` | Boolean | NOT NULL, DEFAULT true | Global subscription status |
| `subscribed_at` | Timestamp | NOT NULL, DEFAULT NOW() | Initial signup date |
| `unsubscribed_at` | Timestamp | NULLABLE | Full unsubscribe date (all newsletters) |
| `unsubscribe_token` | String (64) | UNIQUE, NOT NULL | Secure token for one-click unsubscribe |
| `source` | String (50) | NULLABLE | Signup source (footer, popup, post CTA) |

**Relationships**:
- Has many: Newsletter Preferences (tracks which newsletters they want)

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Email must be unique
- Unsubscribe token must be cryptographically random (32 bytes, hex-encoded)
- If `active = false`, must have `unsubscribed_at` timestamp

**Indexes**:
- `newsletter_email_idx` ON (email) - Unique constraint, fast lookup
- `newsletter_active_idx` ON (active) - Active subscribers query
- `newsletter_token_idx` ON (unsubscribe_token) - One-click unsubscribe lookup

**Business Rules**:
- When subscriber unsubscribes from all newsletters → `active = false`, set `unsubscribed_at`
- When subscriber re-subscribes to any newsletter → `active = true`, clear `unsubscribed_at`
- Unsubscribe token generated on first subscription, never changes (permanent link)

---

### Entity: Newsletter Preference (Future)

**Purpose**: Track which newsletters each subscriber wants (aviation, dev, education, all)

**Future Schema**:

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String (CUID) | PK | Unique identifier |
| `subscriber_id` | String (CUID) | FK → newsletter_subscribers(id), NOT NULL | Subscriber reference |
| `newsletter_type` | ENUM | NOT NULL | Type: 'aviation', 'dev-startup', 'education', 'all' |
| `subscribed` | Boolean | NOT NULL, DEFAULT true | Opted in/out for this newsletter |
| `updated_at` | Timestamp | NOT NULL, AUTO-UPDATE | Last preference change |

**Relationships**:
- Belongs to: Newsletter Subscriber

**Validation Rules**:
- `newsletter_type` must be one of: 'aviation', 'dev-startup', 'education', 'all'
- UNIQUE constraint on `(subscriber_id, newsletter_type)` - one preference per type per subscriber

**Indexes**:
- `newsletter_pref_subscriber_idx` ON (subscriber_id) - Get all preferences for a subscriber
- `newsletter_pref_type_idx` ON (newsletter_type, subscribed) - Get all subscribers for a newsletter type

**Business Rules**:
- **Default on signup**: Create preferences for all 4 types with `subscribed = true` (user can opt-out later)
- **Alternative default**: Only create preference for user's selected newsletter(s) on signup
- **"All" behavior**: If subscribed to 'all', receives every post regardless of other preferences
- **Unsubscribe from all**: Set all 4 preferences to `subscribed = false` + mark parent subscriber `active = false`

**Newsletter Types Explained**:
- `aviation` - Posts tagged with aviation content (flight training, CFI, pilot career)
- `dev-startup` - Posts about development, coding, startup building
- `education` - Posts about teaching, learning, education systems
- `all` - Comprehensive newsletter, includes all posts regardless of category

---

## Storage Strategy

### Primary Data Storage

**Type**: Hybrid (Filesystem + Relational Database)

**Current State**:
- **Content (Posts, Tags)**: Filesystem (MDX files in `content/posts/`)
- **User Data**: PostgreSQL (minimal usage, prepared for growth)

**Rationale**:
- **Filesystem MDX**: Simple, version-controlled, fast static generation
- **PostgreSQL**: Structured data (future: subscribers, analytics, comments)

**Migration Path**:
- MVP (current): MDX files sufficient for <50 posts
- Growth (50-200 posts): Migrate to headless CMS (Contentful) or DB
- Scale (200+ posts): Database-first with API-based authoring

### Blob Storage

**Type**: Filesystem (currently) or CDN (future)
**Technology**: Local filesystem → Cloudflare R2 or S3 (if images grow)

**What to Store**:
- Featured images for blog posts
- Author profile photos
- Embedded media (diagrams, screenshots)

**Organization**: `/public/images/posts/[slug]/[filename].[ext]`
**Size Limits**: Max 5MB per image (resize/compress before commit)

**Future**: If images > 100MB total, migrate to Cloudflare R2 or S3

---

## Data Access Patterns

### Read Patterns

**Pattern: Homepage Post Feed**
- **Query**: Get recent posts from both tracks, sorted by date
- **Current**: Filesystem scan (`content/posts/*.mdx`), parse frontmatter
- **Frequency**: Every page load (build-time for SSG)
- **Optimization**: Static generation at build time, no runtime queries

**Pattern: Single Post Page**
- **Query**: Get post by slug
- **Current**: Read `content/posts/[slug].mdx`
- **Frequency**: Every post page load (build-time for SSG)
- **Optimization**: Static generation, all posts pre-rendered

**Pattern: Posts by Tag**
- **Query**: Get posts with specific tag
- **Current**: Filesystem scan, filter by frontmatter tag
- **Frequency**: Tag page loads (build-time for SSG)
- **Optimization**: Static generation, pre-build tag index

### Write Patterns

**Pattern: Create New Post**
- **Operation**: Create new `.mdx` file
- **Frequency**: 2-4 times per month
- **Process**:
  1. Create `content/posts/[slug].mdx`
  2. Add frontmatter (title, date, tags, excerpt)
  3. Write MDX content
  4. Git commit + push
  5. CI/CD triggers rebuild + deploy

**Pattern: Newsletter Signup (Future)**
- **Operation**: INSERT into newsletter_subscribers + newsletter_preferences
- **Frequency**: ~5-10 per week (estimated)
- **Consistency**: Strong (ACID transaction - both tables updated atomically)
- **Example**:
  ```sql
  -- Transaction: Create subscriber + preferences
  BEGIN;

  INSERT INTO newsletter_subscribers (email, source, unsubscribe_token, subscribed_at)
  VALUES ($1, $2, gen_random_bytes(32)::text, NOW())
  ON CONFLICT (email)
  DO UPDATE SET active = true, unsubscribed_at = NULL
  RETURNING id;

  -- Create preferences for selected newsletter types
  -- If user selected "aviation" and "dev-startup":
  INSERT INTO newsletter_preferences (subscriber_id, newsletter_type, subscribed)
  VALUES
    ($subscriber_id, 'aviation', true),
    ($subscriber_id, 'dev-startup', true)
  ON CONFLICT (subscriber_id, newsletter_type)
  DO UPDATE SET subscribed = true, updated_at = NOW();

  COMMIT;
  ```

**Pattern: Update Newsletter Preferences (Future)**
- **Operation**: UPDATE newsletter_preferences
- **Frequency**: Occasional (user changes preferences via email link)
- **Consistency**: Strong (ACID transaction)
- **Example**:
  ```sql
  -- User unchecks "aviation", keeps "dev-startup"
  UPDATE newsletter_preferences
  SET subscribed = false, updated_at = NOW()
  WHERE subscriber_id = $1 AND newsletter_type = 'aviation';
  ```

**Pattern: Unsubscribe from All (Future)**
- **Operation**: UPDATE newsletter_subscribers + newsletter_preferences
- **Frequency**: ~1-2 per month (low churn expected)
- **Consistency**: Strong (ACID transaction)
- **Example**:
  ```sql
  -- Transaction: Unsubscribe from everything
  BEGIN;

  -- Mark subscriber inactive
  UPDATE newsletter_subscribers
  SET active = false, unsubscribed_at = NOW()
  WHERE unsubscribe_token = $1;

  -- Unsubscribe from all newsletter types
  UPDATE newsletter_preferences
  SET subscribed = false, updated_at = NOW()
  WHERE subscriber_id = (
    SELECT id FROM newsletter_subscribers WHERE unsubscribe_token = $1
  );

  COMMIT;
  ```

---

## Data Lifecycle

### Retention Policy

| Data Type | Retention Period | Archive Strategy | Delete Strategy |
|-----------|------------------|------------------|----------------|
| Blog posts | Indefinite | Git history | Never (content is permanent) |
| Newsletter subscribers | Indefinite (while active) | N/A | Hard delete on unsubscribe request (GDPR - CASCADE to preferences) |
| Newsletter preferences | Tied to subscriber | N/A | CASCADE delete when subscriber deleted |
| Analytics events | 13 months | Export to CSV after 13 months | Delete older than 13 months |
| User sessions | N/A (no auth) | N/A | N/A |

### Backup Strategy

**Database**:
- **Frequency**: Daily automated backups (Supabase managed)
- **Retention**: 7 daily, 4 weekly
- **Recovery Point Objective (RPO)**: 24 hours (acceptable data loss)
- **Recovery Time Objective (RTO)**: 2 hours (restore from backup)
- **Testing**: Quarterly restore tests

**Content (MDX files)**:
- **Backup**: Git history (GitHub)
- **Retention**: Permanent (Git never forgets)
- **Recovery**: Git checkout previous commit
- **Redundancy**: GitHub servers + local clones

---

## Privacy & Compliance

### Personal Identifiable Information (PII)

**What PII Stored**:
- Newsletter subscriber emails (future)
- User email (Marcus only, admin)

**How Protected**:
- Encryption at rest (PostgreSQL via Supabase)
- Encryption in transit (TLS 1.3)
- No PII in analytics (GA4 configured without userId tracking)
- No PII in logs (emails masked in application logs)

### Regulatory Compliance

**Requirements**: GDPR (EU visitors), CCPA (California visitors)

**How Compliant**:
- **Right to deletion**: Unsubscribe endpoint hard deletes subscriber record
- **Data portability**: Newsletter API endpoint exports subscriber data as JSON
- **Consent management**: Explicit opt-in for newsletter (no pre-checked boxes)
- **Privacy policy**: Clearly states data collection practices (GA4, newsletter)
- **Cookie consent**: [NEEDS CLARIFICATION: Cookie banner for GDPR?]

---

## Multi-Tenancy Strategy

**Model**: Single-tenant (personal blog)
**Isolation**: Not applicable (no multi-tenancy)

**Future Consideration**: If platform opens to guest authors, implement:
- Row-Level Security (RLS) on posts table (author_id filter)
- RBAC roles (admin, author, reader)

---

## Data Integrity

### Constraints

**Entity: User**
**Constraints**:
- `UNIQUE(email)` - No duplicate emails
- `CHECK(email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')` - Valid email format

**Entity: Post (Future)**
**Constraints**:
- `CHECK(reading_time_minutes > 0)` - Positive reading time
- `CHECK(track IN ('aviation', 'dev-startup'))` - Valid track
- `CHECK(published_at <= NOW())` - Cannot publish in future

**Entity: Newsletter Subscriber (Future)**
**Constraints**:
- `UNIQUE(email)` - No duplicate subscribers
- `UNIQUE(unsubscribe_token)` - Unique unsubscribe links
- `CHECK(active IN (true, false))` - Boolean constraint
- `CHECK(unsubscribe_token ~ '^[a-f0-9]{64}$')` - Valid hex token format
- `CHECK(active = false OR unsubscribed_at IS NULL)` - If active, no unsubscribe date

**Entity: Newsletter Preference (Future)**
**Constraints**:
- `UNIQUE(subscriber_id, newsletter_type)` - One preference per type per subscriber
- `CHECK(newsletter_type IN ('aviation', 'dev-startup', 'education', 'all'))` - Valid types
- `CHECK(subscribed IN (true, false))` - Boolean constraint
- `FOREIGN KEY(subscriber_id) REFERENCES newsletter_subscribers(id) ON DELETE CASCADE` - Delete preferences when subscriber deleted

### Referential Integrity

**Future Cascade Rules**:
- Delete user → CASCADE delete authored posts (rare, admin only)
- Delete post → CASCADE delete post-tag associations
- Delete tag → SET NULL on posts (tags soft-delete, posts keep slug reference)
- Delete newsletter_subscriber → CASCADE delete newsletter_preferences (GDPR compliance)
- Update subscriber email → CASCADE update preference references (via FK)

---

## Migrations Strategy

**Tool**: Prisma Migrate
**Process**:
1. Update `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name add_newsletter_table`
3. Review generated SQL (manual check)
4. Test locally (apply migration, verify data)
5. Commit migration files to Git
6. Deploy: CI runs `npx prisma migrate deploy` on VPS

**Rollback**:
- Prisma migrations are one-way by default
- For rollback: Create new migration to reverse changes
- Database backups are safety net (restore if migration breaks data)

**Zero-Downtime Migrations** (if needed later):
- Expand-contract pattern for breaking changes
- Example: Renaming column
  1. Add new column (nullable)
  2. Deploy code (dual-write to both columns)
  3. Backfill data
  4. Deploy code (read from new column)
  5. Drop old column

---

## Scalability Considerations

### Current Capacity

**Database**: PostgreSQL on Hetzner VPS
- Storage: 80GB (plenty for text-heavy blog)
- Connections: 100 (overkill for current usage)
- Estimated capacity: 10,000+ posts, 100,000+ newsletter subscribers

**Limitations**:
- Single instance (no read replicas)
- Vertical scaling only (upgrade VPS RAM/CPU)

### Scale Path

**1,000 → 10,000 posts**:
- Migrate content from MDX to database (for better search, filtering)
- Add full-text search index (PostgreSQL tsvector)
- Cost: No change (fits on same VPS)

**10,000 → 100,000 posts** (unlikely for personal blog):
- Separate content database from application database
- Read replicas for heavy queries
- Cost: +$20-30/mo

---

## Disaster Recovery

### Backup & Restore

**Backup Location**: Supabase automated backups (VPS local storage)
**Restore Process**:
1. Stop Next.js container
2. Restore PostgreSQL from latest backup (Supabase CLI or pg_restore)
3. Verify data integrity (spot-check posts, subscribers)
4. Restart Next.js container
5. Test critical flows (homepage, post pages)

**Last Tested**: [NEEDS CLARIFICATION: Backup restore tested?]

### Corruption Recovery

**Scenario**: MDX files accidentally deleted or corrupted
**Detection**: Build fails (missing posts), manual discovery
**Recovery**:
1. Git checkout previous commit
2. Restore missing/corrupted files
3. Rebuild and redeploy

**Scenario**: Database corruption (subscriber data lost)
**Detection**: Supabase alerts, manual check
**Recovery**:
1. Restore from latest backup (RPO 24 hours)
2. Notify subscribers of gap (if critical)
3. Post-mortem doc

---

## Query Patterns & Optimization

### Slow Query Log

**Threshold**: > 1 second (if database queries added)
**Action**: Log to application logs, review monthly for optimization

### Index Strategy

**Entity: Post (Future)**
**Indexes**:
- `(slug)` - PRIMARY KEY, single-post lookups
- `(track, published_at DESC)` - List posts by category
- `(published_at DESC)` - Recent posts homepage feed

**Entity: Newsletter Subscriber (Future)**
**Indexes**:
- `(email)` - UNIQUE, signup/unsubscribe lookups
- `(unsubscribe_token)` - UNIQUE, one-click unsubscribe links
- `(active)` - Filter active subscribers for email sends

**Entity: Newsletter Preference (Future)**
**Indexes**:
- `(subscriber_id)` - Get all preferences for a subscriber (preference management page)
- `(newsletter_type, subscribed)` - Get all subscribers for a specific newsletter (e.g., all "aviation" subscribers)
- `(subscriber_id, newsletter_type)` - UNIQUE composite, fast preference lookups

---

## Data Quality

### Validation

**Level 1: Database** (hard constraints)
- `email` format validation (CHECK constraint)
- `UNIQUE` constraints (no duplicate emails, slugs)
- `NOT NULL` constraints (required fields)

**Level 2: Application** (business rules)
- Zod schemas validate API inputs (newsletter signup)
- Frontmatter validation for MDX posts (required fields)
- Slug generation (title → URL-safe slug)

**Level 3: User Input** (form validation)
- Email format validation (client-side, HTML5)
- Required field indicators
- Character limits (displayed, enforced)

---

## Change Log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2025-10-26 | Initial data architecture documented | Project initialization | Baseline for future migrations |
| 2025-10-26 | Hybrid storage strategy (MDX + DB) | Simple MVP, scalable future | Fast development, easy migration path |
| 2025-10-26 | Multi-newsletter subscription system | User request: granular newsletter preferences | Added NEWSLETTER_PREFERENCE entity, unsubscribe tokens, 4 newsletter types |
