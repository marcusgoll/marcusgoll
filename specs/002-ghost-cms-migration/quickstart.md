# Quickstart: Ghost CMS Migration to Next.js

## Scenario 1: Initial Setup

### Prerequisites

- Node.js 18+ installed
- Ghost CMS instance accessible (https://ghost.marcusgoll.com)
- Ghost Content API key available
- Git repository cloned locally

### Environment Configuration

```bash
# Navigate to project root
cd D:\Coding\marcusgoll

# Create .env.local file (if not exists)
cat > .env.local <<EOF
# Ghost CMS Configuration
GHOST_API_URL=https://ghost.marcusgoll.com
GHOST_CONTENT_API_KEY=<your-content-api-key-here>

# Analytics
NEXT_PUBLIC_GA_ID=G-SE02S59BZW

# Site URL
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
EOF

# Install dependencies (already installed, but verify)
npm install

# Verify Ghost API connection
node -e "require('./lib/ghost').getPosts({limit: 1}).then(posts => console.log('Ghost API connected:', posts.length, 'posts')).catch(err => console.error('Ghost API error:', err))"
```

**Expected Output**:
```
Ghost API connected: 1 posts
```

### Ghost Admin Configuration

**Manual steps in Ghost Admin** (https://ghost.marcusgoll.com/ghost):

1. **Create Primary Tags**:
   - `aviation` - Name: "Aviation", Color: #0EA5E9, Description: "Flight training, CFI resources, pilot career content"
   - `dev-startup` - Name: "Dev/Startup", Color: #059669, Description: "Building in public, systematic development, tutorials"
   - `cross-pollination` - Name: "Cross-Pollination", Color: #0F172A, Description: "Aviation principles applied to development"

2. **Create Secondary Tags**:
   - Aviation: `flight-training`, `cfi-resources`, `career-path`
   - Dev/Startup: `building-in-public`, `systematic-development`, `tutorials`

3. **Tag Existing Posts**:
   - Select all 35 aviation posts
   - Bulk Actions → Add Tags → `aviation`
   - Add category tags individually based on post content

4. **Configure Navigation** (Settings → Navigation):
   - Primary: Home (`/`), Aviation (`/aviation`), Dev/Startup (`/dev-startup`), Blog (`/blog`), About (`/about`), Contact (`/contact`)
   - Secondary (Footer): Flight Training, CFI Resources, Career Path, Building in Public, Systematic Dev, Tutorials

5. **Update Site Settings** (Settings → General):
   - Site title: "Marcus Gollahon"
   - Site description: "Airline pilot who teaches developers systematic thinking and helps pilots advance their careers."

---

## Scenario 2: Local Development

### Start Development Server

```bash
# Clean any previous builds
rm -rf .next

# Start Next.js dev server
npm run dev
```

**Expected Output**:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 2.5s
```

### Test Ghost Integration

```bash
# Open browser to homepage
open http://localhost:3000

# Test Aviation hub page (once created)
open http://localhost:3000/aviation

# Test single post (once blog template created)
open http://localhost:3000/blog/your-post-slug
```

### Hot Reload Testing

1. Edit a component (e.g., `components/blog/TrackBadge.tsx`)
2. Save file
3. Browser auto-refreshes with changes (Fast Refresh)
4. Verify component updates without full page reload

---

## Scenario 3: Build and Deployment Validation

### Local Production Build

```bash
# Build for production
npm run build
```

**Expected Output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                   1.5 kB         90 kB
├ ○ /aviation                           2.1 kB         92 kB
├ ● /blog/[slug]                        1.8 kB         91 kB
├   ├ /blog/post-1
├   └ /blog/post-2
└ ○ /dev-startup                        2.1 kB         92 kB

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses getStaticProps)
```

**Validation Checks**:
- [ ] Build completes without errors
- [ ] All routes show ○ (Static) or ● (SSG)
- [ ] First Load JS <100 kB for all pages
- [ ] No unhandled promise rejections

### Start Production Server Locally

```bash
# Start production server
npm run start
```

**Test Production Build**:
```bash
# Homepage loads
curl -I http://localhost:3000
# Expected: HTTP/1.1 200 OK

# Aviation hub page loads
curl -I http://localhost:3000/aviation
# Expected: HTTP/1.1 200 OK

# Check ISR cache headers
curl -I http://localhost:3000/aviation | grep -i cache
# Expected: cache-control: s-maxage=60, stale-while-revalidate
```

---

## Scenario 4: Component Development Workflow

### Create New Component

```bash
# Create component file
mkdir -p components/blog
touch components/blog/TrackBadge.tsx

# Edit component (example)
cat > components/blog/TrackBadge.tsx <<'EOF'
interface TrackBadgeProps {
  track: 'aviation' | 'dev-startup' | 'cross-pollination';
}

export default function TrackBadge({ track }: TrackBadgeProps) {
  const styles = {
    aviation: 'bg-sky-500 text-white',
    'dev-startup': 'bg-emerald-600 text-white',
    'cross-pollination': 'bg-gradient-to-r from-sky-500 to-emerald-600 text-white'
  };

  const labels = {
    aviation: 'Aviation',
    'dev-startup': 'Dev/Startup',
    'cross-pollination': 'Cross-Pollination'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded text-xs font-medium uppercase ${styles[track]}`}>
      {labels[track]}
    </span>
  );
}
EOF
```

### Test Component in Isolation

```bash
# Create test page for component preview
mkdir -p app/test
cat > app/test/page.tsx <<'EOF'
import TrackBadge from '@/components/blog/TrackBadge';

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Component Test: TrackBadge</h1>
      <div className="space-y-2">
        <TrackBadge track="aviation" />
        <TrackBadge track="dev-startup" />
        <TrackBadge track="cross-pollination" />
      </div>
    </div>
  );
}
EOF

# Open test page
open http://localhost:3000/test
```

### Verify Component

- [ ] Aviation badge displays with Sky Blue background (#0EA5E9)
- [ ] Dev/Startup badge displays with Emerald 600 background (#059669)
- [ ] Cross-Pollination badge displays with gradient
- [ ] Text is white and readable (4.5:1 contrast)
- [ ] Badge is uppercase
- [ ] Padding and border-radius applied

---

## Scenario 5: Analytics Testing

### Setup GA4 Debugger

```bash
# Install GA Debugger Chrome Extension
# https://chrome.google.com/webstore/detail/google-analytics-debugger/

# OR use GA4 Realtime view
open https://analytics.google.com/analytics/web/#/p<property-id>/realtime/overview
```

### Test Custom Events

1. **Test Content Track Click**:
   - Open http://localhost:3000
   - Click "Explore Aviation" button
   - Check GA4 Realtime → Events
   - Verify `content_track_click` event with parameters: `{track: 'aviation', location: 'homepage'}`

2. **Test Page View with Track**:
   - Open http://localhost:3000/aviation
   - Check GA4 Realtime → Events
   - Verify `page_view` event with parameters: `{page_path: '/aviation', track: 'aviation'}`

3. **Test External Link Click**:
   - Open blog post with CFIPros.com link
   - Click external link
   - Check GA4 Realtime → Events
   - Verify `external_link_click` event with parameters: `{destination: 'cfipros.com', location: 'blog-post'}`

### Debug Analytics Issues

```bash
# Check if gtag is loaded
# Open browser console on any page
window.gtag
# Expected: function gtag() { ... }

# Check if GA ID is configured
window.gtag('get', 'G-SE02S59BZW', 'client_id', (clientId) => console.log('Client ID:', clientId))
# Expected: Client ID: <some-uuid>

# Manual event trigger test
window.gtag('event', 'test_event', { test_param: 'test_value' })
# Expected: Event appears in GA4 Realtime
```

---

## Scenario 6: ISR Revalidation Testing

### Test ISR Cache Behavior

```bash
# 1. Build and start production server
npm run build && npm run start

# 2. Request page first time (cold cache)
time curl http://localhost:3000/aviation > /dev/null
# Expected: ~200-500ms (Ghost API call)

# 3. Request page second time (warm cache)
time curl http://localhost:3000/aviation > /dev/null
# Expected: <50ms (served from cache)

# 4. Wait 61 seconds, request again (trigger revalidation)
sleep 61
time curl http://localhost:3000/aviation > /dev/null
# Expected: <50ms (serves stale), then regenerates in background

# 5. Request again immediately
time curl http://localhost:3000/aviation > /dev/null
# Expected: <50ms (serves fresh regenerated page)
```

### Update Content and Verify ISR

1. **Update Post in Ghost Admin**:
   - Edit existing post title in Ghost
   - Save changes

2. **Verify Update Appears** (within 60 seconds):
   ```bash
   # Check current page (should show old title)
   curl http://localhost:3000/blog/post-slug | grep '<h1'

   # Wait 61 seconds
   sleep 61

   # Check page again (should show new title)
   curl http://localhost:3000/blog/post-slug | grep '<h1'
   ```

---

## Scenario 7: Accessibility Testing

### Keyboard Navigation Test

**Manual Steps**:
1. Open http://localhost:3000
2. Press Tab key repeatedly
3. Verify focus indicator visible on all interactive elements:
   - [ ] Navigation links
   - [ ] "Explore Aviation" button
   - [ ] "Explore Dev/Startup" button
   - [ ] Post cards
4. Press Enter on focused button → navigates to correct page

### Screen Reader Test

**Using NVDA (Windows) or VoiceOver (Mac)**:

```bash
# macOS: Enable VoiceOver
# CMD + F5

# Windows: Start NVDA
# CTRL + ALT + N
```

**Test Checklist**:
- [ ] Page title announced: "Marcus Gollahon - Home"
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Link purpose clear: "Explore Aviation" (not "Click here")
- [ ] Images have alt text: "Marcus Gollahon professional headshot"
- [ ] TrackBadge text announced: "Aviation badge"

### Color Contrast Check

```bash
# Use browser DevTools Lighthouse
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Accessibility" category
# 4. Click "Analyze page load"

# Expected Results:
# - Accessibility score ≥95
# - No color contrast issues
# - All WCAG AA checks pass
```

---

## Scenario 8: Deployment to Vercel

### Deploy to Production

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Deployment Steps**:
1. Vercel detects Next.js project
2. Prompts for project name: `marcusgoll`
3. Builds project (npm run build)
4. Uploads static assets to CDN
5. Deploys to production URL: `https://marcusgoll.com`

**Output**:
```
🔍  Inspect: https://vercel.com/<user>/marcusgoll/<deployment-id>
✅  Production: https://marcusgoll.com [3s]
```

### Verify Production Deployment

```bash
# Check homepage loads
curl -I https://marcusgoll.com
# Expected: HTTP/2 200

# Check ISR cache headers
curl -I https://marcusgoll.com/aviation | grep -i cache
# Expected: cache-control: public, max-age=0, must-revalidate
# Expected: x-vercel-cache: HIT (on second request)

# Check Ghost content appears
curl https://marcusgoll.com/aviation | grep -o '<article' | wc -l
# Expected: 5 (5 aviation posts displayed)
```

### Configure Environment Variables in Vercel

```bash
# Via Vercel CLI
vercel env add GHOST_API_URL
# Prompt: Enter value: https://ghost.marcusgoll.com
# Prompt: Add to which environments? Production, Preview, Development

vercel env add GHOST_CONTENT_API_KEY
# Prompt: Enter value: <paste-your-api-key>
# Prompt: Add to which environments? Production, Preview, Development

# OR via Vercel Dashboard
# https://vercel.com/<user>/marcusgoll/settings/environment-variables
```

---

## Scenario 9: Rollback Procedure

### Identify Issue in Production

```bash
# Check recent deployments
vercel ls

# Output:
# Age  Deployment                      Status
# 2m   marcusgoll-abc123.vercel.app   READY (current production)
# 1h   marcusgoll-def456.vercel.app   READY
# 2h   marcusgoll-ghi789.vercel.app   READY
```

### Rollback to Previous Deployment

```bash
# Get previous deployment ID
PREVIOUS_DEPLOYMENT_ID="marcusgoll-def456.vercel.app"

# Alias previous deployment to production domain
vercel alias set $PREVIOUS_DEPLOYMENT_ID marcusgoll.com

# Verify rollback
curl -I https://marcusgoll.com
# Check x-vercel-id header matches $PREVIOUS_DEPLOYMENT_ID
```

### Verify Rollback Successful

```bash
# Check deployment metadata
vercel inspect $PREVIOUS_DEPLOYMENT_ID

# Test key pages
curl -I https://marcusgoll.com
curl -I https://marcusgoll.com/aviation
curl -I https://marcusgoll.com/blog

# All should return 200 OK
```

---

## Troubleshooting

### Issue: Ghost API Connection Failed

**Error**:
```
Error: Ghost API key invalid or Ghost instance not reachable
```

**Solution**:
```bash
# 1. Verify GHOST_API_URL is correct
echo $GHOST_API_URL
# Expected: https://ghost.marcusgoll.com

# 2. Verify GHOST_CONTENT_API_KEY is set
echo $GHOST_CONTENT_API_KEY | wc -c
# Expected: >20 characters

# 3. Test Ghost API directly
curl "$GHOST_API_URL/ghost/api/v5.0/content/posts/?key=$GHOST_CONTENT_API_KEY&limit=1"
# Expected: JSON response with posts array

# 4. Check .env.local exists and is loaded
ls -la .env.local
# If missing: create from .env.example
```

### Issue: ISR Not Updating Content

**Symptom**: Changed post title in Ghost, but old title still appears after 60 seconds

**Solution**:
```bash
# 1. Verify revalidate export in page
grep 'revalidate' app/aviation/page.tsx
# Expected: export const revalidate = 60

# 2. Check if running production build (ISR doesn't work in dev mode)
npm run build && npm run start

# 3. Clear Next.js cache
rm -rf .next

# 4. Force revalidation via API (future enhancement)
# POST /api/revalidate?path=/aviation
```

### Issue: Analytics Events Not Firing

**Symptom**: No events appear in GA4 Realtime

**Solution**:
```bash
# 1. Verify NEXT_PUBLIC_GA_ID is set
echo $NEXT_PUBLIC_GA_ID
# Expected: G-SE02S59BZW

# 2. Check gtag loaded in browser console
# Open browser console, type:
window.gtag
# Expected: function gtag() { ... }

# 3. Check analytics.ts functions called
# Add console.log in trackContentTrackClick function
console.log('Tracking event:', track, location)

# 4. Verify GA4 measurement ID is correct
# https://analytics.google.com/analytics/web/
# Admin → Data Streams → Web → Measurement ID
```

---

## Next Steps

After completing quickstart scenarios:

1. **Run Full Test Suite** (during `/preview` phase):
   - Manual UI/UX testing
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - Mobile responsive testing (375px, 768px, 1280px)
   - Accessibility audit (Lighthouse, axe DevTools)

2. **Performance Optimization** (during `/optimize` phase):
   - Lighthouse audit
   - Core Web Vitals monitoring
   - Image optimization
   - Bundle size analysis

3. **Deploy to Production** (via `/ship` command):
   - Environment variables configured in Vercel
   - Smoke tests pass
   - Rollback capability verified
   - Analytics tracking confirmed

---

**Last Updated**: 2025-10-21
