# Quickstart: 055-homepage-redesign

## Scenario 1: Initial Setup

**Purpose**: Set up local development environment and run homepage

**Prerequisites**:
- Node.js 20+ installed
- npm (comes with Node.js)
- Git

**Steps**:

```bash
# Clone repository (if not already)
git clone https://github.com/marcusgoll/marcusgoll.git
cd marcusgoll

# Checkout feature branch
git checkout quick/brand-color-tokens-core-hex

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with required values (DATABASE_URL, RESEND_API_KEY, etc.)

# Generate Prisma client (if using database)
npx prisma generate

# Run development server
npm run dev
```

**Expected Output**:
```
> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Verification**:
1. Open browser: `http://localhost:3000`
2. Verify homepage loads with hero section
3. Check console: No errors
4. Test hot reload: Edit `app/page.tsx`, save, verify changes reflect instantly

---

## Scenario 2: Validation Workflow

**Purpose**: Validate build, performance, and accessibility before deployment

**Prerequisites**: Local dev environment running (Scenario 1)

### Step 2.1: Type Check

```bash
# Run TypeScript compiler (no emit, check only)
npx tsc --noEmit
```

**Expected**: No type errors

### Step 2.2: Lint

```bash
# Run ESLint
npm run lint
```

**Expected**: No linting errors or warnings

### Step 2.3: Build for Production

```bash
# Build Next.js for production
npm run build
```

**Expected Output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    X kB           Y kB
├ ○ /blog                                X kB           Y kB
└ ○ /blog/[slug]                         X kB           Y kB

○  (Static)  prerendered as static content

Build completed successfully
```

**Validation**:
- Total First Load JS < 500KB (NFR-006)
- No build errors or warnings

### Step 2.4: Run Production Build Locally

```bash
# Start production server
npm start
```

**Expected**: Server starts on `http://localhost:3000`

**Verification**:
1. Navigate to `http://localhost:3000`
2. Verify homepage loads
3. Check browser DevTools → Network tab:
   - Page weight < 2MB
   - JS bundle < 500KB
   - CSS < 100KB
4. Check browser console: No errors

### Step 2.5: Lighthouse Audit

**Option A: Chrome DevTools**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select: Mobile, Performance + Accessibility + SEO
4. Click "Analyze page load"
5. Verify scores:
   - Performance ≥ 85
   - Accessibility ≥ 95
   - SEO ≥ 90

**Option B: Lighthouse CLI**
```bash
# Install Lighthouse globally (if not installed)
npm install -g lighthouse

# Run Lighthouse on local server
lighthouse http://localhost:3000 --view --preset=desktop

# Mobile audit
lighthouse http://localhost:3000 --view --preset=mobile --throttling.cpuSlowdownMultiplier=4
```

**Expected**: HTML report opens with scores ≥ targets

---

## Scenario 3: Manual Testing Checklist

**Purpose**: Comprehensive manual UI/UX testing before deployment

### Test 3.1: Hero Section

**Given**: User loads homepage
**When**: Page renders
**Then**:
- [ ] Hero section displays above fold (<600px viewport height)
- [ ] Headline visible: "Systematic thinking from 30,000 feet"
- [ ] Tagline visible with dual-track value prop
- [ ] "Read Latest Posts" CTA clickable
- [ ] "Subscribe to Newsletter" CTA clickable
- [ ] Navy background (Navy 900 #0F172A) applied
- [ ] Emerald accent (Emerald 600 #059669) on CTAs
- [ ] No layout shift (CLS < 0.15)
- [ ] FCP < 1.5s (check DevTools → Performance)

### Test 3.2: Newsletter Signup (Hero Dialog)

**Given**: User clicks "Subscribe to Newsletter" in hero
**When**: Dialog opens
**Then**:
- [ ] Dialog appears (modal overlay)
- [ ] Email input field visible
- [ ] Newsletter type checkboxes visible (4 options)
- [ ] Form validation works (empty email shows error)
- [ ] Submit button disabled when loading
- [ ] Success message displays after submission
- [ ] Dialog closes after 3s on success
- [ ] Error message displays on API failure
- [ ] Keyboard accessible (Tab navigation, Esc closes dialog)

**API Test** (check Network tab):
- [ ] POST `/api/newsletter/subscribe` returns 200 OK
- [ ] Response contains `{success: true, data: {unsubscribeToken}}`

### Test 3.3: Content Track Filtering

**Given**: User is on homepage
**When**: User clicks "Aviation" filter button
**Then**:
- [ ] URL updates to `/?track=aviation`
- [ ] Only posts tagged "aviation" display
- [ ] Filter button shows active state (emerald background)
- [ ] No page reload (instant filter)
- [ ] Browser back button works (returns to `/?track=all`)
- [ ] GA4 event fires (check console: `gtag('event', 'filter_changed')`)

**Repeat for**:
- [ ] Dev/Startup filter (`/?track=dev-startup`)
- [ ] Cross-pollination filter (`/?track=cross-pollination`)
- [ ] All filter (`/` or `/?track=all`)

### Test 3.4: Recent Posts Grid

**Given**: User scrolls to recent posts section
**When**: Posts load
**Then**:
- [ ] 6-9 posts display (or all if fewer exist)
- [ ] Each post card shows:
  - [ ] Featured image (lazy-loaded with blur placeholder)
  - [ ] Title
  - [ ] Excerpt (2 lines, truncated with `...`)
  - [ ] Track badge (Aviation ✈️, Dev/Startup 💻, or Cross-pollination 🔄)
  - [ ] Published date
  - [ ] Reading time (e.g., "5 min read")
- [ ] Hover effect: Shadow increases, border color changes
- [ ] Click post card → navigates to `/blog/[slug]`
- [ ] Images load progressively (blur → sharp)
- [ ] No cumulative layout shift (images reserve space)

### Test 3.5: Featured Posts Showcase (if implemented)

**Given**: Featured posts exist (MDX with `featured: true`)
**When**: User views homepage
**Then**:
- [ ] Featured section displays before recent posts grid
- [ ] 1-3 featured posts visible
- [ ] Larger card treatment (bigger images than recent posts)
- [ ] Different visual treatment (e.g., horizontal layout or 2-col)
- [ ] Click featured post → navigates to `/blog/[slug]`
- [ ] If no featured posts, section hidden (no empty state)

### Test 3.6: Project Card (if implemented)

**Given**: Active project exists (`status: 'active'`)
**When**: User views homepage
**Then**:
- [ ] Project card displays (CFIPros.com)
- [ ] Project name visible
- [ ] Tagline visible (<100 chars)
- [ ] Status indicator: Green dot + "Active" label
- [ ] CTA button: "Visit Project" or "Read Build Log"
- [ ] Click CTA → navigates to project URL (external link or /blog/tag)
- [ ] If no active project (`status: 'paused'`), card hidden

### Test 3.7: Mobile Responsive (320px - 768px)

**Given**: User views homepage on mobile device or narrow viewport
**When**: Viewport width < 768px
**Then**:
- [ ] Hero section: Text readable, no horizontal scroll
- [ ] CTAs: Stack vertically or remain horizontal (both accessible)
- [ ] Filter buttons: Stack vertically in sidebar or move to menu
- [ ] Recent posts grid: 1 column layout
- [ ] Post cards: Full-width, images scale correctly
- [ ] Tap targets: ≥44x44px (test with finger on real device)
- [ ] Newsletter form: Stacks inputs vertically
- [ ] No content cut off or hidden

**Test on**:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 414px (iPhone 12 Pro Max)
- [ ] 768px (iPad portrait)

### Test 3.8: Tablet Responsive (768px - 1024px)

**Given**: User views homepage on tablet or medium viewport
**When**: Viewport width 768px - 1024px
**Then**:
- [ ] Hero section: Centered, good use of space
- [ ] Recent posts grid: 2 columns
- [ ] Filter buttons: Sidebar visible (not hamburger menu)
- [ ] Featured posts: 2-column or horizontal layout
- [ ] All interactive elements accessible with touch

### Test 3.9: Desktop (1024px+)

**Given**: User views homepage on desktop
**When**: Viewport width ≥ 1024px
**Then**:
- [ ] Hero section: Max-width container, centered
- [ ] Recent posts grid: 3 columns
- [ ] Filter buttons: Sidebar with vertical stack
- [ ] Featured posts: Full-width showcase or 3-column
- [ ] Hover states work (post cards, buttons)

### Test 3.10: Dark Mode (if implemented)

**Given**: User toggles dark mode
**When**: Theme changes
**Then**:
- [ ] Navy background darkens appropriately
- [ ] Text contrast maintains ≥4.5:1 ratio
- [ ] Emerald accent remains visible
- [ ] Post cards: Dark background, light text
- [ ] Images: No color inversion issues
- [ ] No flash of unstyled content (FOUC)

### Test 3.11: Keyboard Navigation (Accessibility)

**Given**: User navigates with keyboard only (no mouse)
**When**: Pressing Tab key
**Then**:
- [ ] Focus moves through interactive elements in logical order:
  1. Hero "Read Latest" CTA
  2. Hero "Subscribe" CTA
  3. Filter buttons (All → Aviation → Dev/Startup → Cross-pollination)
  4. Post cards (grid order)
  5. Newsletter form inputs
  6. Footer links
- [ ] Focus indicators visible (outline or ring)
- [ ] Enter key activates buttons and links
- [ ] Esc key closes newsletter Dialog
- [ ] No keyboard traps (focus can escape all elements)

### Test 3.12: Screen Reader (Accessibility)

**Given**: User with screen reader (NVDA/JAWS/VoiceOver)
**When**: Navigating homepage
**Then**:
- [ ] Page title announced: "Homepage - Marcus Gollahon"
- [ ] Hero headline announced
- [ ] Filter buttons: Announced with current state (e.g., "Aviation filter, pressed")
- [ ] Post cards: Title, excerpt, metadata announced
- [ ] Newsletter form: Labels associated with inputs
- [ ] Images: Alt text announced (or decorative if `alt=""`)
- [ ] Semantic HTML: Headings structure (H1 → H2 → H3)

### Test 3.13: Performance (Real Device)

**Given**: User on slow 3G connection (throttle in DevTools)
**When**: Homepage loads
**Then**:
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s (hero image or headline)
- [ ] TTI < 3.5s (interactive)
- [ ] CLS < 0.15 (no layout shift)
- [ ] No blocking resources (check DevTools → Performance)
- [ ] Images lazy-load (only above-fold images eager-load)

**Test with Chrome DevTools**:
1. Open DevTools (F12)
2. Go to "Performance" tab
3. Click "Throttling" → Select "Slow 3G"
4. Reload page (Ctrl+Shift+R)
5. Verify Web Vitals in green zone

---

## Scenario 4: End-to-End User Flow

**Purpose**: Simulate realistic user journey

**Flow**:
1. User lands on homepage (organic search or direct)
2. Reads hero headline → understands value prop (dual-track expertise)
3. Scrolls to recent posts → sees posts from both tracks
4. Clicks "Aviation" filter → sees only aviation posts
5. Clicks post card → reads full article
6. Returns to homepage (browser back button)
7. Clicks "Subscribe to Newsletter" → opens Dialog
8. Enters email → selects "Aviation" + "Dev/Startup" newsletters
9. Submits form → sees success message
10. Closes Dialog → continues browsing

**Expected**:
- No broken links
- No console errors
- Smooth transitions (no page reloads except full article)
- GA4 events tracked:
  - `homepage.page_view`
  - `homepage.filter_click` (Aviation)
  - `homepage.post_click`
  - `homepage.newsletter_signup`

---

## Scenario 5: Deployment Dry-Run

**Purpose**: Simulate production deployment locally (Docker)

### Step 5.1: Build Docker Image

```bash
# Build multi-stage Docker image
docker build -t marcusgoll:test .
```

**Expected**: Image builds successfully (~5-10 min)

### Step 5.2: Run Docker Container

```bash
# Run container with env vars
docker run -p 3000:3000 \
  --env-file .env.local \
  marcusgoll:test
```

**Expected**: Container starts, server listening on port 3000

### Step 5.3: Verify Dockerized App

1. Navigate to `http://localhost:3000`
2. Verify homepage loads identically to dev server
3. Test all scenarios above (filtering, newsletter, etc.)

### Step 5.4: Check Container Health

```bash
# Check container logs
docker logs <container-id>

# Check resource usage
docker stats <container-id>
```

**Expected**:
- No error logs
- Memory usage < 500MB
- CPU usage < 50% (idle)

---

## Troubleshooting

### Issue: Homepage not loading

**Symptom**: Blank page or 404 error at `http://localhost:3000`

**Solution**:
1. Check server is running: `npm run dev` output shows "ready"
2. Verify port 3000 not in use: `npx kill-port 3000` (per CLAUDE.md)
3. Clear cache: `rm -rf .next && npm run dev`

### Issue: Environment variables not loaded

**Symptom**: "Missing environment variable" error

**Solution**:
1. Verify `.env.local` exists with required vars
2. Check `lib/env-schema.ts` for required env vars
3. Restart dev server after adding env vars

### Issue: Newsletter API fails (500 error)

**Symptom**: POST `/api/newsletter/subscribe` returns 500

**Solution**:
1. Check `RESEND_API_KEY` or `MAILGUN_API_KEY` set in `.env.local`
2. Check `DATABASE_URL` correct (PostgreSQL connection)
3. Run Prisma migrations: `npx prisma migrate dev`
4. Check API logs: `docker logs <container-id>` (production)

### Issue: Lighthouse score < 85

**Symptom**: Performance score below target

**Solution**:
1. Check image sizes: Optimize with WebP, <500KB each
2. Check bundle size: `npm run build` → verify JS < 500KB
3. Remove unnecessary imports: Check for unused components
4. Enable lazy loading: Use `dynamic()` for below-fold components
5. Reduce main thread work: Move heavy computation to Web Workers

### Issue: Layout shift (CLS > 0.15)

**Symptom**: Content jumps during page load

**Solution**:
1. Add explicit image dimensions: `width` and `height` props on `<Image>`
2. Use blur placeholders: `placeholder="blur"` on `<Image>`
3. Reserve space for dynamic content: Use skeleton loaders
4. Avoid inserting content above existing: Load above-fold first

---

## Quick Reference

### Key Files

- Homepage route: `app/page.tsx`
- Hero component: `components/home/Hero.tsx`
- Filter component: `components/home/PostFeedFilter.tsx`
- Post card: `components/blog/PostCard.tsx`
- Newsletter form: `components/newsletter/NewsletterSignupForm.tsx`
- Newsletter API: `app/api/newsletter/subscribe/route.ts`

### Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
lighthouse http://localhost:3000 --view  # Run Lighthouse
```

### Key URLs (Local)

- Homepage: `http://localhost:3000/`
- With filter: `http://localhost:3000/?track=aviation`
- Blog post: `http://localhost:3000/blog/[slug]`
- Newsletter API: `http://localhost:3000/api/newsletter/subscribe`

### Performance Targets

- FCP: <1.5s
- LCP: <2.5s
- TTI: <3.5s
- CLS: <0.15
- Lighthouse Performance: ≥85
- Lighthouse Accessibility: ≥95
