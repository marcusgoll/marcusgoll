# Ghost CMS Migration - Deployment Checklist

This checklist ensures all prerequisites are met before deploying the Ghost CMS migration to production.

## Pre-Deployment Checklist

### Environment Configuration

- [ ] **Ghost CMS Setup**
  - [ ] Ghost CMS instance running and accessible
  - [ ] Ghost Admin panel accessible
  - [ ] Content API key generated in Ghost Admin (Settings > Integrations)
  - [ ] Ghost API URL configured (e.g., `https://your-site.ghost.io`)

- [ ] **Environment Variables**
  - [ ] `.env.local` file created (copy from `.env.example`)
  - [ ] `GHOST_API_URL` set to Ghost CMS URL
  - [ ] `GHOST_CONTENT_API_KEY` set to Content API key
  - [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
  - [ ] `NEXT_PUBLIC_GA_ID` set to Google Analytics 4 ID (optional)

### Content Configuration

- [ ] **Ghost Tag Structure**
  - [ ] Primary tags created (aviation, dev-startup, cross-pollination)
  - [ ] Secondary tags created (flight-training, cfi-resources, career-path, software-development, systematic-thinking, startup-insights)
  - [ ] Tag colors configured per brand guidelines
  - [ ] Tag descriptions added

- [ ] **Content Migration**
  - [ ] 35 aviation posts tagged with primary `aviation` tag
  - [ ] Aviation posts categorized with secondary tags
  - [ ] Dev/Startup posts tagged with primary `dev-startup` tag
  - [ ] Cross-pollination posts tagged appropriately
  - [ ] All posts have at least one primary tag

- [ ] **Ghost Site Settings**
  - [ ] Site title: "Marcus Gollahon"
  - [ ] Site description: "Teaching systematic thinking from 30,000 feet"
  - [ ] Navigation configured (Home, Aviation, Dev/Startup)
  - [ ] Social media links configured

### Build & Quality Verification

- [ ] **Local Build**
  - [ ] Run `npm install` to install dependencies
  - [ ] Run `npm run build` - build succeeds without errors
  - [ ] No TypeScript errors
  - [ ] No ESLint warnings (critical issues only)

- [ ] **Functional Testing**
  - [ ] Homepage loads and displays dual-track content
  - [ ] Aviation hub page loads (http://localhost:3000/aviation)
  - [ ] Dev/Startup hub page loads (http://localhost:3000/dev-startup)
  - [ ] Blog post template displays correctly (http://localhost:3000/blog/[slug])
  - [ ] Tag archive pages work (http://localhost:3000/tag/[slug])
  - [ ] Header navigation works (desktop + mobile)
  - [ ] Footer displays correctly with all links

- [ ] **Content Verification**
  - [ ] Ghost API returns posts successfully
  - [ ] Posts display with correct track badges
  - [ ] Featured images load correctly
  - [ ] Post content renders properly
  - [ ] ISR revalidation working (60-second cache)

### Performance & SEO

- [ ] **Lighthouse Audit** (run on production build)
  - [ ] Performance score ≥ 90
  - [ ] Accessibility score ≥ 90
  - [ ] Best Practices score ≥ 90
  - [ ] SEO score ≥ 90

- [ ] **Page Load Times** (Lighthouse metrics)
  - [ ] First Contentful Paint (FCP) < 2s
  - [ ] Largest Contentful Paint (LCP) < 3s
  - [ ] Time to Interactive (TTI) < 3.5s
  - [ ] Cumulative Layout Shift (CLS) < 0.1

- [ ] **SEO Verification**
  - [ ] All pages have unique titles
  - [ ] All pages have meta descriptions
  - [ ] OpenGraph tags present (for social sharing)
  - [ ] Twitter Card tags present
  - [ ] Sitemap accessible (if configured)
  - [ ] robots.txt configured (if needed)

### Analytics & Tracking

- [ ] **Google Analytics 4**
  - [ ] GA4 property created
  - [ ] GA4 script tag loads in production
  - [ ] Page view tracking working
  - [ ] Custom events firing:
    - [ ] `content_track_click` (CTA clicks)
    - [ ] `page_view` (with track metadata)
  - [ ] Real-time tracking visible in GA4 dashboard

### Security & Configuration

- [ ] **API Security**
  - [ ] Ghost Content API key is read-only
  - [ ] Environment variables not committed to git
  - [ ] `.env.local` in `.gitignore`
  - [ ] No sensitive data in client-side code

- [ ] **CORS Configuration**
  - [ ] Ghost API allows requests from production domain
  - [ ] CORS headers configured if using custom domain

### Deployment

- [ ] **Vercel Deployment** (or other platform)
  - [ ] Environment variables added to Vercel dashboard
  - [ ] Domain configured and DNS updated
  - [ ] SSL certificate active
  - [ ] Deployment previews enabled for feature branches

- [ ] **Post-Deployment Verification**
  - [ ] Production site loads successfully
  - [ ] All pages accessible
  - [ ] Ghost CMS content fetched correctly
  - [ ] ISR revalidation working (test by updating a post in Ghost)
  - [ ] Analytics tracking active
  - [ ] No console errors in production
  - [ ] Mobile responsiveness verified

## Rollback Plan

If deployment fails or critical issues discovered:

1. **Immediate Rollback**
   - Vercel: Revert to previous deployment via dashboard
   - Or: `vercel rollback [deployment-url]`

2. **Investigate Issues**
   - Check Vercel logs for errors
   - Verify environment variables
   - Test Ghost API connectivity
   - Check browser console for client errors

3. **Fix & Redeploy**
   - Fix issues in feature branch
   - Test thoroughly in preview deployment
   - Deploy to production when verified

## Success Criteria

Deployment is considered successful when:

- ✅ All pages load without errors
- ✅ Ghost CMS content displays correctly
- ✅ Lighthouse performance score ≥ 90
- ✅ Analytics tracking active
- ✅ Mobile and desktop layouts work correctly
- ✅ ISR revalidation working (posts update within 60 seconds)
- ✅ No critical console errors
- ✅ SEO metadata present on all pages

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Production URL**: _____________
**Deployment ID**: _____________

**Post-Deployment Notes**:
