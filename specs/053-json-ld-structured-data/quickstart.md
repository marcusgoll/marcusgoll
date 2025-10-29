# Quickstart: 053-json-ld-structured-data

## Scenario 1: Initial Setup

**Prerequisites**: Node.js 18+, npm installed

```bash
# Install dependencies (if not already installed)
npm install

# Verify constitution.md exists (required for Person/Organization schemas)
ls -la .spec-flow/memory/constitution.md

# Build site to generate schemas
npm run build

# Start development server
npm run dev
```

## Scenario 2: Development Workflow

**Extend lib/schema.ts with new generators**:

```bash
# 1. Open schema file
code lib/schema.ts

# 2. Add new generator functions (see plan.md for specs)
# - generatePersonSchema()
# - generateWebsiteSchema()
# - generateOrganizationSchema()
# - mapTagsToCategory()

# 3. Run type checking
npx tsc --noEmit

# 4. Test locally
npm run dev
open http://localhost:3000
```

## Scenario 3: Validation

**Manual validation workflow**:

```bash
# 1. Build site
npm run build

# 2. Start server
npm start

# 3. Open pages and view source
# Homepage: http://localhost:3000 (should have Website schema)
# Blog post: http://localhost:3000/blog/[any-slug] (should have BlogPosting + Organization)
# About: http://localhost:3000/about (should have Person schema)

# 4. Extract JSON-LD from page source
# Look for: <script type="application/ld+json">...</script>

# 5. Validate with Google Rich Results Test
# Go to: https://search.google.com/test/rich-results
# Paste full page URL or JSON-LD code
# Verify: 0 errors, rich results preview shows

# 6. Validate with Schema.org validator
# Go to: https://validator.schema.org/
# Paste JSON-LD code
# Verify: 0 warnings, schema valid
```

## Scenario 4: Testing

**Run unit tests for schema generators**:

```bash
# Run all tests
npm test

# Run schema tests only
npm test -- lib/__tests__/schema.test.ts

# Run with coverage
npm run test:coverage

# Watch mode for TDD
npm run test:watch
```

## Scenario 5: Category Mapping Testing

**Test dual-track category mapping**:

```bash
# 1. Create test post with aviation tags
cat > content/posts/test-aviation.mdx <<EOF
---
slug: test-aviation
title: Test Aviation Post
date: 2025-10-29
author: Marcus Gollahon
excerpt: Test excerpt
tags: [aviation, cfi, flight-training]
---

Test content
EOF

# 2. Create test post with dev tags
cat > content/posts/test-dev.mdx <<EOF
---
slug: test-dev
title: Test Dev Post
date: 2025-10-29
author: Marcus Gollahon
excerpt: Test excerpt
tags: [development, typescript, coding]
---

Test content
EOF

# 3. Build and verify
npm run build
npm start

# 4. Check schemas
# Visit: http://localhost:3000/blog/test-aviation
# View source → Find BlogPosting schema → Verify articleSection: "Aviation"
# Visit: http://localhost:3000/blog/test-dev
# View source → Find BlogPosting schema → Verify articleSection: "Development"

# 5. Clean up test posts
rm content/posts/test-*.mdx
```

## Scenario 6: Constitution Data Extraction

**Verify Person/Organization data extraction**:

```bash
# 1. Inspect constitution.md
code .spec-flow/memory/constitution.md

# 2. Verify required data exists:
# - Brand Mission (line 19): For jobTitle and description
# - Brand Essence (line 21): For description
# - Social links: Should be documented in Personal Brand Principles

# 3. Test extraction (in Node.js REPL)
node
> const fs = require('fs/promises');
> const path = require('path');
> (async () => {
    const constitutionPath = path.join(process.cwd(), '.spec-flow/memory/constitution.md');
    const content = await fs.readFile(constitutionPath, 'utf-8');
    console.log('Constitution loaded, length:', content.length);
    // Parse for brand data
  })();

# 4. Build and verify
npm run build
npm start

# 5. Check Person schema
# Visit: http://localhost:3000/about
# View source → Find Person schema → Verify all fields populated from constitution
```

## Scenario 7: Production Deployment

**Deploy with schema validation**:

```bash
# 1. Run pre-deployment checks
npm run build  # Verify build succeeds
npm test       # Verify all tests pass

# 2. Manual validation
npm start
# Test all page types, verify schemas present

# 3. Deploy to Hetzner VPS
ssh hetzner
cd /path/to/marcusgoll
git pull origin main
npm install
npm run build
pm2 restart marcusgoll

# 4. Post-deployment validation
# Visit production URLs:
# - https://marcusgoll.com (Website schema)
# - https://marcusgoll.com/blog/[slug] (BlogPosting + Organization)
# - https://marcusgoll.com/about (Person schema)

# 5. Run Google Rich Results Test on production URLs
# https://search.google.com/test/rich-results
# Paste: https://marcusgoll.com/blog/[any-post]
# Verify: 0 errors, rich results available
```

## Scenario 8: Troubleshooting

**Common issues and fixes**:

```bash
# Issue: Schema not appearing in page source
# Fix 1: Verify server component (not client component)
grep "use client" app/page.tsx  # Should return nothing

# Fix 2: Check JSON-LD embedding
grep -A 5 "application/ld+json" app/page.tsx

# Issue: Google Rich Results Test shows errors
# Fix 1: Validate JSON syntax
node -e "console.log(JSON.stringify({ ... }))"  # Paste schema here

# Fix 2: Check required fields
# BlogPosting: headline, datePublished, author, image
# Person: name, url
# Website: name, url
# Organization: name, url, logo

# Issue: Category mapping not working
# Fix: Check tag normalization (lowercase, trim whitespace)
node
> const mapTagsToCategory = (tags) => {
    const normalized = tags.map(t => t.toLowerCase().trim());
    if (normalized.some(t => ['aviation', 'flight-training'].includes(t))) return 'Aviation';
    if (normalized.some(t => ['development', 'startup', 'coding'].includes(t))) return 'Development';
    if (normalized.some(t => ['leadership', 'teaching'].includes(t))) return 'Leadership';
    return 'Blog';
  };
> mapTagsToCategory(['Aviation', 'CFI']);  // Should return "Aviation"

# Issue: Build fails with TypeScript errors
# Fix: Run type checking, fix errors
npx tsc --noEmit
```

## Scenario 9: Performance Monitoring

**Measure schema generation performance**:

```bash
# 1. Add timing logs to schema generators (temporary)
# In lib/schema.ts:
# console.time('generatePersonSchema');
# const result = { ... };
# console.timeEnd('generatePersonSchema');

# 2. Build and check logs
npm run build 2>&1 | grep generatePersonSchema

# 3. Verify <10ms per schema (NFR-001)

# 4. Measure JSON-LD size
node
> const schema = require('./lib/schema');
> const blogPostingSchema = schema.generateBlogPostingSchema({ ... });
> JSON.stringify(blogPostingSchema).length;  // Should be <2KB
```

---

## Quick Reference

**Key Files**:
- Schema generators: `lib/schema.ts`
- Homepage (Website schema): `app/page.tsx`
- Blog post (BlogPosting + Organization): `app/blog/[slug]/page.tsx`
- About page (Person schema): `app/about/page.tsx`
- Brand data: `.spec-flow/memory/constitution.md`
- Unit tests: `lib/__tests__/schema.test.ts`

**Validation URLs**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- JSON Formatter: https://jsonformatter.org/

**npm Scripts**:
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:coverage` - Test coverage report
