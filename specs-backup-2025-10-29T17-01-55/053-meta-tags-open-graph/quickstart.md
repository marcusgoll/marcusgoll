# Quickstart: 053-meta-tags-open-graph

## Scenario 1: Initial Setup

```bash
# No installation required - uses built-in Next.js Metadata API
# Verify environment variable is set
echo $NEXT_PUBLIC_SITE_URL
# Expected: https://marcusgoll.com (or http://localhost:3000 in dev)

# Start dev server
npm run dev

# Verify homepage in browser
open http://localhost:3000
```

---

## Scenario 2: Validation

### Local Validation

```bash
# Build to verify no TypeScript errors
npm run build

# Check for metadata in HTML source
curl -s http://localhost:3000 | grep -E 'og:|twitter:'

# Expected output includes:
# <meta property="og:title" content="Marcus Gollahon | Aviation & Software Development" />
# <meta property="og:description" content="..." />
# <meta property="og:image" content="https://marcusgoll.com/images/og-default.jpg" />
# <meta name="twitter:card" content="summary_large_image" />
```

### Social Platform Validation

**LinkedIn Post Inspector**:
```
1. Visit: https://www.linkedin.com/post-inspector/
2. Enter URL: https://marcusgoll.com
3. Click "Inspect"
4. Expected: Rich preview with title, description, default OG image
```

**Twitter Card Validator**:
```
1. Visit: https://cards-dev.twitter.com/validator
2. Enter URL: https://marcusgoll.com/aviation
3. Click "Preview card"
4. Expected: Large image card (summary_large_image) with aviation OG image
```

**Facebook Sharing Debugger**:
```
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter URL: https://marcusgoll.com/dev-startup
3. Click "Debug"
4. Expected: All og: tags present, dev OG image displays at 1200x630
```

---

## Scenario 3: Manual Testing

### Test Checklist

**Page Types to Test** (all 7 pages):

1. **Homepage** (`/`)
   - Open: http://localhost:3000
   - Verify: Title is "Marcus Gollahon | Aviation & Software Development"
   - Verify: Default OG image loads at /images/og-default.jpg
   - View source: Check `<meta property="og:url" content="https://marcusgoll.com/" />`

2. **Aviation Section** (`/aviation`)
   - Open: http://localhost:3000/aviation
   - Verify: Title is "Aviation | Marcus Gollahon"
   - Verify: Aviation OG image loads at /images/og-aviation.jpg
   - View source: Check `<meta property="og:description"` matches aviation focus

3. **Dev/Startup Section** (`/dev-startup`)
   - Open: http://localhost:3000/dev-startup
   - Verify: Title is "Dev & Startup | Marcus Gollahon"
   - Verify: Dev OG image loads at /images/og-dev.jpg

4. **Blog Index** (`/blog`)
   - Open: http://localhost:3000/blog
   - Verify: Title is "Blog | Marcus Gollahon"
   - Verify: Default OG image loads

5. **Tag Page** (`/blog/tag/[tag]`)
   - Open: http://localhost:3000/blog/tag/cfi
   - Verify: Title is "Posts tagged: CFI | Marcus Gollahon" (dynamic)
   - Verify: Description is "Explore all posts about CFI"

6. **Newsletter Page** (`/newsletter`)
   - Open: http://localhost:3000/newsletter
   - Verify: Title is "Newsletter | Marcus Gollahon"
   - Verify: Description includes newsletter value proposition

7. **Blog Post** (`/blog/[slug]`)
   - Open: http://localhost:3000/blog/any-post-slug
   - Verify: Already has metadata (no changes needed)
   - Spot check: Metadata still works after layout changes

### Browser DevTools Validation

```javascript
// Open DevTools Console on any page
// Check all meta tags
document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(el => {
  console.log(el.getAttribute('property') || el.getAttribute('name'), '=', el.getAttribute('content'));
});

// Expected output:
// og:title = Page Title
// og:description = Page Description
// og:url = https://marcusgoll.com/...
// og:type = website
// og:site_name = Marcus Gollahon
// og:locale = en_US
// og:image = https://marcusgoll.com/images/og-....jpg
// twitter:card = summary_large_image
// twitter:site = @marcusgoll
// twitter:creator = @marcusgoll
// twitter:title = Page Title
// twitter:description = Page Description
// twitter:image = https://marcusgoll.com/images/og-....jpg
```

---

## Scenario 4: Post-Deployment Validation

```bash
# After deploying to production

# 1. Clear social platform caches
# LinkedIn: https://www.linkedin.com/post-inspector/ (enter URL, click "Inspect")
# Twitter: https://cards-dev.twitter.com/validator (enter URL, click "Preview")
# Facebook: https://developers.facebook.com/tools/debug/ (click "Scrape Again")

# 2. Test actual social sharing
# - Share homepage link on LinkedIn (personal account)
# - Verify: Rich preview appears with correct image, title, description
# - Share aviation page on Twitter
# - Verify: Large image card displays correctly

# 3. Monitor Google Search Console
# Wait 7-14 days, then check:
# - Search Console → Performance → Compare date ranges (before/after)
# - Check impressions increase for homepage, aviation, dev-startup pages
```

---

## Troubleshooting

### Issue: OG image not displaying

**Symptoms**: Social platforms show broken image or no image
**Checks**:
1. Verify file exists: `ls -la public/images/og-default.jpg`
2. Check file size: `du -h public/images/og-default.jpg` (should be <200KB)
3. Verify absolute URL: `curl -I https://marcusgoll.com/images/og-default.jpg`
4. Clear platform cache: Use debug tools to "Scrape Again"

### Issue: Metadata not updating

**Symptoms**: Changes to metadata.ts not reflected in meta tags
**Checks**:
1. Restart dev server: `npm run dev`
2. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Check build output: `npm run build` (look for TypeScript errors)
4. Verify NEXT_PUBLIC_SITE_URL: `echo $NEXT_PUBLIC_SITE_URL`

### Issue: Dynamic tag pages show generic title

**Symptoms**: Tag pages all have same title instead of unique "Posts tagged: [Tag]"
**Checks**:
1. Verify `generateMetadata()` function exists in `app/blog/tag/[tag]/page.tsx`
2. Check async/await syntax: `export async function generateMetadata({ params }: Props)`
3. Verify params are awaited: `const { tag } = await params;`
4. Check type definition: `params: Promise<{ tag: string }>`
