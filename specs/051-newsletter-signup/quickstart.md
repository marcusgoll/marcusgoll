# Quickstart: 051-newsletter-signup

## Scenario 1: Initial Setup & Development

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database running (via Docker or Supabase)
- RESEND_API_KEY configured in `.env` (already exists)

### Setup Steps

```bash
# Clone repository (if not already done)
git clone https://github.com/marcusgollahon/marcusgoll.git
cd marcusgoll

# Install dependencies (no new packages needed)
npm install

# Verify environment variables
cat .env.local
# Should contain:
# DATABASE_URL=postgresql://...
# RESEND_API_KEY=re_...
# NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-...

# Verify database schema (newsletter tables should exist from Feature 048)
npx prisma db pull  # Syncs schema from database
npx prisma generate # Generates Prisma Client types

# Start development server
npm run dev
```

**Expected Output**:
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
○ Network: http://192.168.1.X:3000
```

**Verify Existing Newsletter Infrastructure**:
1. Open http://localhost:3000
2. Check that site loads (verifies Next.js + Prisma working)
3. Test existing newsletter API:
   ```bash
   curl -X POST http://localhost:3000/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "newsletterTypes": ["aviation"],
       "source": "test"
     }'
   ```
4. Expected response:
   ```json
   {
     "success": true,
     "message": "Successfully subscribed!",
     "data": {
       "unsubscribeToken": "clxxxxx..."
     }
   }
   ```

---

## Scenario 2: Implementing Newsletter Signup Placements

### Step 1: Add Variant System to NewsletterSignupForm

**File**: `components/newsletter/NewsletterSignupForm.tsx`

**Changes**:
1. Add `variant` prop to interface:
   ```typescript
   interface NewsletterSignupFormProps {
     source?: string;
     variant?: 'compact' | 'inline' | 'comprehensive'; // NEW
     className?: string;
   }
   ```

2. Add conditional rendering based on variant:
   ```typescript
   const isCompact = variant === 'compact';
   const isInline = variant === 'inline';
   const isComprehensive = variant === 'comprehensive' || !variant; // Default

   // Example: Hide checkboxes in compact mode initially
   const showCheckboxes = !isCompact || state.showCheckboxes;
   ```

3. Test component with variants:
   ```tsx
   // Compact variant (footer)
   <NewsletterSignupForm source="footer" variant="compact" />

   // Inline variant (after blog post)
   <NewsletterSignupForm source="post-inline" variant="inline" />

   // Comprehensive variant (dedicated page)
   <NewsletterSignupForm source="dedicated-page" variant="comprehensive" />
   ```

---

### Step 2: Integrate into Footer

**File**: `components/layout/Footer.tsx`

**Changes**:
1. Import CompactNewsletterSignup (or use NewsletterSignupForm directly):
   ```typescript
   import { NewsletterSignupForm } from '@/components/newsletter/NewsletterSignupForm';
   ```

2. Add 5th column to footer grid or integrate into existing column:
   ```tsx
   <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
     {/* Existing columns: Brand, Aviation, Dev, Connect */}

     {/* NEW: Newsletter column */}
     <div>
       <h4 className="mb-4 font-semibold">Newsletter</h4>
       <p className="text-sm text-gray-300 mb-4">
         Get aviation and dev insights delivered monthly.
       </p>
       <NewsletterSignupForm
         source="footer"
         variant="compact"
         className="max-w-xs"
       />
     </div>
   </div>
   ```

3. Test footer:
   - Visit http://localhost:3000
   - Scroll to footer
   - Verify compact newsletter form appears
   - Test email validation and submit

---

### Step 3: Add Inline CTA to Blog Posts

**File**: `app/blog/[slug]/page.tsx`

**Changes**:
1. Import InlineNewsletterCTA (or use NewsletterSignupForm directly):
   ```typescript
   import { NewsletterSignupForm } from '@/components/newsletter/NewsletterSignupForm';
   ```

2. Insert after MDX content, before PrevNextNav:
   ```tsx
   <div className="prose prose-lg">
     <MDXRemote source={content} components={mdxComponents} />
   </div>

   {/* NEW: Inline Newsletter CTA */}
   <div className="my-12 p-8 bg-gradient-to-r from-navy-900 to-emerald-600 rounded-lg text-white">
     <h3 className="text-2xl font-bold mb-2">
       Enjoyed this {frontmatter.tags.includes('aviation') ? 'aviation' : 'dev'} post?
     </h3>
     <p className="text-lg mb-6">
       Get more systematic thinking insights delivered to your inbox.
     </p>
     <NewsletterSignupForm
       source="post-inline"
       variant="inline"
       className="max-w-2xl"
     />
   </div>

   <PrevNextNav currentSlug={slug} />
   ```

3. Test inline CTA:
   - Visit http://localhost:3000/blog/[any-post]
   - Scroll to end of content
   - Verify inline CTA appears with gradient background
   - Test form submission

---

### Step 4: Create Dedicated Newsletter Page

**File**: `app/newsletter/page.tsx` (NEW)

**Code**:
```tsx
import type { Metadata } from 'next';
import { NewsletterSignupForm } from '@/components/newsletter/NewsletterSignupForm';

export const metadata: Metadata = {
  title: 'Newsletter | Marcus Gollahon',
  description: 'Subscribe to get aviation, dev, and education insights delivered to your inbox.',
};

export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Systematic Thinking, Delivered
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Aviation adventures, dev insights, and teaching frameworks—right to your inbox.
        </p>
      </header>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Dual-Track Content</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose aviation, dev/startup, education, or get everything.
          </p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No Spam, Ever</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Monthly updates only. Unsubscribe anytime with one click.
          </p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Building in Public</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Transparent progress on CFIPros.com and other projects.
          </p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Teaching-First</h3>
          <p className="text-gray-600 dark:text-gray-400">
            10 years of teaching experience in every post.
          </p>
        </div>
      </div>

      {/* Signup Form */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Subscribe Now</h2>
        <NewsletterSignupForm
          source="dedicated-page"
          variant="comprehensive"
        />
      </div>

      {/* FAQs */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">How often will I receive emails?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monthly at most. I respect your inbox and only send when I have valuable content.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I choose which newsletters to receive?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! Select aviation, dev/startup, education, or all. You can update your preferences anytime.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">How do I unsubscribe?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Every email includes an unsubscribe link. One click, no questions asked.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">What about my privacy?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              I only collect your email address. No tracking pixels, no third-party sharing, GDPR compliant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

4. Test dedicated page:
   - Visit http://localhost:3000/newsletter
   - Verify page renders with hero, benefits grid, FAQs
   - Test comprehensive signup form

---

## Scenario 3: Validation & Testing

### Manual Testing Checklist

```bash
# Test 1: Footer Signup
# 1. Visit homepage
# 2. Scroll to footer
# 3. Enter invalid email → Verify error message
# 4. Enter valid email, select 'all' → Verify success
# 5. Check email inbox for welcome message

# Test 2: Inline CTA Signup
# 1. Visit any blog post
# 2. Scroll to end of content
# 3. Verify inline CTA appears
# 4. Select aviation + dev newsletters
# 5. Submit → Verify success message
# 6. Check database for new subscriber

# Test 3: Dedicated Page Signup
# 1. Visit /newsletter
# 2. Read benefits and FAQs
# 3. Select education newsletter only
# 4. Submit → Verify success
# 5. Check GA4 for 'newsletter_signup' event with source='dedicated-page'

# Test 4: Mobile Responsiveness
# 1. Open DevTools, toggle device toolbar
# 2. Test 360px (mobile), 768px (tablet), 1280px (desktop)
# 3. Verify all forms render correctly
# 4. Verify buttons are ≥44px touch targets

# Test 5: Accessibility
# 1. Tab through all forms with keyboard
# 2. Verify focus states visible
# 3. Submit with Enter key → Verify works
# 4. Run axe DevTools extension
# 5. Verify no critical a11y issues

# Test 6: Performance
# 1. Open Lighthouse in Chrome DevTools
# 2. Run audit on homepage, blog post, /newsletter
# 3. Verify Performance ≥85, Accessibility ≥95
# 4. Check Core Web Vitals in Network tab (FCP <1.5s)
```

### Automated API Testing (Optional)

```bash
# Test POST /api/newsletter/subscribe
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-footer@example.com",
    "newsletterTypes": ["all"],
    "source": "footer"
  }'

# Expected: 200 OK with {"success": true}

# Test validation error (no email)
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "",
    "newsletterTypes": ["aviation"],
    "source": "test"
  }'

# Expected: 400 Bad Request with {"success": false, "message": "Invalid email"}

# Test duplicate email (should update preferences)
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-footer@example.com",
    "newsletterTypes": ["aviation", "dev-startup"],
    "source": "post-inline"
  }'

# Expected: 200 OK, preferences updated to aviation + dev-startup
```

---

## Scenario 4: Deployment

### Pre-Deployment Checklist

```bash
# 1. Verify all 3 placements work locally
npm run dev
# Test: footer, inline, dedicated page

# 2. Build production bundle
npm run build

# Expected output:
# ✓ Compiled successfully
# Route (app)                              Size
# ├ ○ /newsletter                          XXX kB
# ├ ○ /blog/[slug]                         XXX kB
# └ ○ /                                    XXX kB

# 3. Run production server locally
npm start

# Test all placements in production mode

# 4. Verify environment variables
echo $RESEND_API_KEY     # Should be set
echo $DATABASE_URL       # Should be set
echo $NEXT_PUBLIC_GA4_MEASUREMENT_ID  # Should be set

# 5. Check Lighthouse scores
# Open http://localhost:3000 in Chrome
# Run Lighthouse audit
# Verify: Performance ≥85, Accessibility ≥95

# 6. Commit changes
git add .
git commit -m "feat: Newsletter signup integration (footer + inline + page)

- Add variant system to NewsletterSignupForm (compact, inline, comprehensive)
- Integrate compact form into site footer
- Add inline newsletter CTA after blog post content
- Create dedicated /newsletter landing page with benefits + FAQs
- Track signup source (footer, post-inline, dedicated-page) for analytics
- Lazy-load newsletter components for performance
- WCAG 2.1 AA compliant (keyboard nav, ARIA labels, 4.5:1 contrast)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Deployment to Production (Direct-Prod Model)

```bash
# Push to main branch (triggers GitHub Actions deploy)
git push origin main

# Monitor deployment
# 1. Check GitHub Actions workflow status
# 2. Wait for Docker build + deploy to complete (~5-10 minutes)
# 3. SSH to VPS to verify deployment

ssh hetzner
cd /path/to/marcusgoll
docker-compose ps  # Verify containers running
docker-compose logs -f --tail=50  # Check logs

# Test in production
curl https://marcusgoll.com/newsletter
# Expected: 200 OK with newsletter page HTML

# Verify GA4 events
# 1. Visit https://marcusgoll.com
# 2. Subscribe via footer form
# 3. Check GA4 Real-Time reports for 'newsletter_signup' event
# 4. Verify event has 'source' parameter = 'footer'
```

### Rollback Plan (If Issues Occur)

```bash
# 1. Get commit SHA from NOTES.md (Deployment Metadata section)
# Example: Deployed commit: abc123def

# 2. SSH to VPS
ssh hetzner
cd /path/to/marcusgoll

# 3. Revert commit
git revert abc123def  # Revert newsletter signup changes
git push origin main  # Trigger re-deploy

# Alternative: Fast rollback via Docker
docker-compose down
git checkout <previous-commit-sha>
docker-compose build
docker-compose up -d

# 4. Verify rollback
curl https://marcusgoll.com/newsletter
# Expected: 404 (page no longer exists)

# 5. Monitor logs
docker-compose logs -f --tail=100
```

---

## Scenario 5: Monitoring & Analytics

### Check Signup Metrics (SQL Queries)

```sql
-- Total subscribers by source (from NOTES.md or directly via Prisma Studio)
SELECT source, COUNT(*) as subscribers
FROM "NewsletterSubscriber"
WHERE active = true
GROUP BY source;

-- Expected output after feature launch:
-- | source          | subscribers |
-- |-----------------|-------------|
-- | footer          | 45          |
-- | post-inline     | 32          |
-- | dedicated-page  | 23          |

-- Signup conversion rate by source
SELECT
  source,
  COUNT(*) FILTER (WHERE active = true) * 100.0 / NULLIF(COUNT(*), 0) as conversion_rate
FROM "NewsletterSubscriber"
GROUP BY source;

-- Monthly churn rate (HEART Retention metric)
SELECT
  COUNT(*) FILTER (WHERE "unsubscribedAt" >= NOW() - INTERVAL '30 days') * 100.0 /
  NULLIF(COUNT(*) FILTER (WHERE active = true), 0) as monthly_churn
FROM "NewsletterSubscriber";

-- Target: <10% monthly churn (from spec.md HEART metrics)
```

### Check GA4 Events

1. Visit https://analytics.google.com
2. Navigate to Reports → Realtime
3. Subscribe via each placement (footer, inline, page)
4. Verify `newsletter_signup` events appear with correct `source` parameter

### Lighthouse CI (Optional)

```bash
# Run Lighthouse on all key pages
npx lighthouse https://marcusgoll.com --view
npx lighthouse https://marcusgoll.com/newsletter --view
npx lighthouse https://marcusgoll.com/blog/[any-post] --view

# Verify:
# - Performance ≥85
# - Accessibility ≥95
# - Best Practices ≥90
# - SEO ≥90 (for /newsletter page)
```

---

## Troubleshooting

### Issue: Newsletter form not appearing in footer
**Solution**:
1. Check Footer.tsx includes `<NewsletterSignupForm />`
2. Verify component import path correct
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### Issue: API returns 500 error on submit
**Solution**:
1. Check RESEND_API_KEY environment variable set
2. Check DATABASE_URL connection string valid
3. Verify Prisma schema synced: `npx prisma generate`
4. Check API route logs: `docker-compose logs -f`

### Issue: GA4 events not firing
**Solution**:
1. Verify NEXT_PUBLIC_GA4_MEASUREMENT_ID set
2. Check GA4 script loaded in browser DevTools → Network tab
3. Verify `window.gtag` exists in console
4. Check GA4 DebugView for real-time event debugging

### Issue: Email not sent after successful signup
**Solution**:
1. Email sending is fire-and-forget (non-blocking), check Resend dashboard for logs
2. Verify RESEND_API_KEY valid
3. Check Resend API limits (free tier <3K emails/mo)
4. Subscription still succeeds even if email fails (by design)

---

## Resources

- **API Docs**: See `data-model.md` for complete API schemas
- **Component Props**: See `plan.md` [NEW INFRASTRUCTURE] section
- **Deployment Guide**: See `deployment-strategy.md` in docs/project/
- **Brand Guidelines**: See `docs/VISUAL_BRAND_GUIDE.md` for colors, typography
- **HEART Metrics**: See `spec.md` Success Metrics section for targets
