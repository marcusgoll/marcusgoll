# Migration Validation: Multi-Track Newsletter

**Feature**: Multi-Track Newsletter Subscription System
**Validation Date**: 2025-10-28
**Validator**: Claude Code (Migration Safety Analysis)

---

## Schema Changes Detected

### New Models

**NewsletterSubscriber** (`newsletter_subscribers` table):
- `id` (String/CUID) - Primary key
- `email` (String) - Subscriber email address
- `active` (Boolean) - Global subscription status (default: true)
- `subscribedAt` (DateTime) - Initial signup timestamp
- `unsubscribedAt` (DateTime?) - Unsubscribe timestamp (nullable)
- `unsubscribeToken` (String, VARCHAR(64)) - Secure token for preference management
- `source` (String?, VARCHAR(50)) - Signup source tracking (nullable)
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**NewsletterPreference** (`newsletter_preferences` table):
- `id` (String/CUID) - Primary key
- `subscriberId` (String) - Foreign key to NewsletterSubscriber
- `newsletterType` (String, VARCHAR(50)) - Newsletter category ('aviation', 'dev-startup', 'education', 'all')
- `subscribed` (Boolean) - Per-newsletter opt-in status (default: true)
- `updatedAt` (DateTime) - Last preference change timestamp
- `createdAt` (DateTime) - Record creation timestamp

### New Indexes

**Performance Indexes** (5 total):
1. `newsletter_subscribers.email` - Fast lookup for upsert operations during signup
2. `newsletter_subscribers.active` - Query active subscribers efficiently
3. `newsletter_subscribers.unsubscribeToken` - One-click unsubscribe link lookup
4. `newsletter_preferences.subscriberId` - Query all preferences for a subscriber
5. `newsletter_preferences.(newsletterType, subscribed)` - Count subscribers per newsletter type

### Relationships

**1:N Relationship** (NewsletterSubscriber → NewsletterPreference):
- One subscriber has many preference rows (one per newsletter type)
- Foreign key: `NewsletterPreference.subscriberId` → `NewsletterSubscriber.id`
- **CASCADE delete configured**: When subscriber deleted, all preferences auto-delete (GDPR compliance)

### Constraints

**Unique Constraints** (3 total):
1. `NewsletterSubscriber.email` - Prevents duplicate email addresses
2. `NewsletterSubscriber.unsubscribeToken` - Ensures token uniqueness for security
3. `NewsletterPreference.(subscriberId, newsletterType)` - One preference row per subscriber per newsletter type

**Business Rule Constraints** (enforced at API level, not DB):
- At least one newsletter must be selected during signup
- Email must be RFC 5322 format (validated via Zod)
- Token must be 64-character hex string (generated via crypto.randomBytes)

---

## Migration Files

**Location**: Prisma migrations not yet generated
**Status**: Schema defined in `prisma/schema.prisma`, migration will be created during deployment

**Expected Migration Command**:
```bash
npx prisma migrate dev --name add_newsletter_tables
```

**Expected Migration Contents** (preview):
```sql
-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "unsubscribeToken" VARCHAR(64) NOT NULL,
    "source" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "newsletter_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriberId" TEXT NOT NULL,
    "newsletterType" VARCHAR(50) NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "newsletter_preferences_subscriberId_fkey"
        FOREIGN KEY ("subscriberId") REFERENCES "newsletter_subscribers" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");
CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribeToken_key" ON "newsletter_subscribers"("unsubscribeToken");
CREATE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers"("email");
CREATE INDEX "newsletter_subscribers_active_idx" ON "newsletter_subscribers"("active");
CREATE INDEX "newsletter_subscribers_unsubscribeToken_idx" ON "newsletter_subscribers"("unsubscribeToken");

CREATE UNIQUE INDEX "newsletter_preferences_subscriberId_newsletterType_key"
    ON "newsletter_preferences"("subscriberId", "newsletterType");
CREATE INDEX "newsletter_preferences_subscriberId_idx" ON "newsletter_preferences"("subscriberId");
CREATE INDEX "newsletter_preferences_newsletterType_subscribed_idx"
    ON "newsletter_preferences"("newsletterType", "subscribed");
```

**Reversibility**: ✅ FULLY REVERSIBLE
- Migration can be rolled back by dropping both tables
- No data loss risk (new tables, no existing data)
- No dependencies on existing User model

---

## Safety Checks

### No Data Loss: ✅ PASS
- **Reason**: New tables only, no modifications to existing schema
- **Existing tables**: Unchanged (`users` table unaffected)
- **New data**: No backfill required (new feature, no existing subscribers)
- **Soft delete default**: Unsubscribe marks `active=false` (preserves data for analytics)
- **GDPR hard delete**: Optional CASCADE delete available on demand

### Backward Compatible: ✅ PASS
- **API compatibility**: New endpoints only, no existing APIs modified
- **Schema compatibility**: New tables do not affect existing User model
- **Application compatibility**: Feature is opt-in (newsletter signup form), existing functionality unaffected
- **Deployment compatibility**: Can deploy without breaking current production

### Indexes for Performance: ✅ PASS
- **Email lookup**: Index on `email` (unique constraint + index) for fast upsert operations
- **Token lookup**: Index on `unsubscribeToken` (unique constraint + index) for one-click unsubscribe
- **Active subscribers**: Index on `active` for querying subscribed users
- **Preference queries**: Composite index on `(newsletterType, subscribed)` for counting subscribers per newsletter
- **Relationship traversal**: Index on `subscriberId` for fetching all preferences for a subscriber

**Query Performance Targets** (from spec.md NFR-003):
- Read queries: <100ms target (indexes support this)
- Write queries: <200ms target (no complex constraints blocking writes)

### GDPR Compliance: ✅ PASS
- **Right to deletion**: CASCADE delete configured (`onDelete: Cascade`)
- **When subscriber deleted**: All related preference rows auto-delete (no orphaned data)
- **Hard delete flow**: Unsubscribe confirmation page → "Delete my data" → Prisma delete cascade
- **Soft delete option**: Default unsubscribe marks `active=false` (preserves analytics)
- **Data minimization**: Only essential fields stored (email, preferences, timestamps)
- **Re-subscription support**: Hard delete removes all records, allowing clean re-signup

---

## Status

**✅ PASSED** - Schema design is migration-ready

**Validation Summary**:
- Schema changes are well-defined and isolated
- No breaking changes to existing functionality
- Indexes are strategically placed for performance
- GDPR compliance via CASCADE delete
- Migration is fully reversible
- No data loss risk

---

## Notes

### Migration Not Yet Generated
- **Reason**: Prisma migrations are typically generated and run during deployment
- **Current state**: Schema defined in `prisma/schema.prisma` (lines 28-62)
- **Next step**: Run `npx prisma migrate dev --name add_newsletter_tables` during task T005 (Phase 2)
- **Deployment**: Migration will run automatically via `npx prisma migrate deploy` in Docker container startup

### Schema Design Quality

**Strengths**:
1. **Clear separation of concerns**: Subscriber entity vs. preference entity (normalized design)
2. **Flexible newsletter selection**: Users can opt-in to any combination of newsletter types
3. **Token-based authentication**: No password storage, reduced attack surface
4. **Soft delete default**: Preserves analytics while respecting unsubscribe
5. **GDPR-ready**: CASCADE delete for hard delete option

**Potential Considerations**:
1. **Newsletter type as enum**: Currently stored as VARCHAR(50), could be migrated to PostgreSQL ENUM in future for stricter validation (acceptable as-is, validated at API layer via Zod)
2. **Token rotation**: Current design uses permanent tokens, consider adding `tokenExpiry` field in future if security requirements increase (acceptable for MVP, tokens are 64-char cryptographically secure)
3. **Email delivery tracking**: Consider adding `EmailLog` table in future for tracking sent/failed/bounced emails (out of scope for MVP)

---

## Recommendations

### Pre-Deployment Checklist

Before running migration in production:

1. **Environment Variables**:
   - [ ] `RESEND_API_KEY` configured in production
   - [ ] `NEWSLETTER_FROM_EMAIL` configured with verified sender address
   - [ ] `DATABASE_URL` points to production PostgreSQL database

2. **Database Backup**:
   - [ ] Create database backup before migration (standard practice, though no existing data affected)
   - [ ] Document rollback procedure (drop tables if needed)

3. **Migration Dry Run**:
   - [ ] Test migration in staging environment first
   - [ ] Verify tables created with correct schema
   - [ ] Verify indexes created successfully
   - [ ] Test CASCADE delete behavior (create subscriber → preferences → delete subscriber → verify preferences deleted)

4. **Post-Migration Verification**:
   - [ ] Query `newsletter_subscribers` table exists: `SELECT COUNT(*) FROM newsletter_subscribers;`
   - [ ] Query `newsletter_preferences` table exists: `SELECT COUNT(*) FROM newsletter_preferences;`
   - [ ] Verify indexes: `\d newsletter_subscribers` and `\d newsletter_preferences` (PostgreSQL CLI)
   - [ ] Test foreign key constraint: Try inserting preference with non-existent subscriber_id (should fail)

### Migration Safety Improvements

**Current Design**: Already safe, no critical issues

**Optional Enhancements** (future):
1. Add `CHECK` constraint for `newsletterType` at database level (currently validated via Zod)
2. Add `CHECK` constraint: `unsubscribedAt IS NULL OR active = false` (enforce consistency)
3. Add `CHECK` constraint: `LENGTH(unsubscribeToken) = 64` (enforce token format)

**Risk Assessment**: LOW
- New tables only, no schema modifications
- No breaking changes
- Fully reversible
- Comprehensive indexes
- GDPR-compliant delete behavior

---

## Migration Execution Plan

**Phase**: Task T005 (Phase 2: Foundational)

**Command**:
```bash
npx prisma migrate dev --name add_newsletter_tables
```

**Expected Output**:
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "marcusgoll", schema "public" at "localhost:5432"

Applying migration `20251028_add_newsletter_tables`
The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20251028_add_newsletter_tables/
    └─ migration.sql

Your database is now in sync with your schema.
```

**Rollback Command** (if needed):
```bash
npx prisma migrate resolve --rolled-back 20251028_add_newsletter_tables
# Then manually drop tables:
# DROP TABLE newsletter_preferences;
# DROP TABLE newsletter_subscribers;
```

**Verification Queries**:
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('newsletter_subscribers', 'newsletter_preferences');

-- Check indexes exist
SELECT indexname FROM pg_indexes
WHERE tablename IN ('newsletter_subscribers', 'newsletter_preferences');

-- Check CASCADE delete constraint
SELECT conname, confdeltype
FROM pg_constraint
WHERE conrelid = 'newsletter_preferences'::regclass
  AND confdeltype = 'c';  -- 'c' = CASCADE
```

---

**Validation Complete** - Schema is ready for migration during implementation phase.
