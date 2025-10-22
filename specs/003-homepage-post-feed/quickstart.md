# Quickstart: 003-homepage-post-feed

## Scenario 1: Initial Setup and Development

```bash
# Navigate to project root
cd D:/Coding/marcusgoll

# Kill any running dev servers
npx kill-port 3000 3001 3002

# Clean npm cache
npm cache clean --force

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Verify Setup**:
- Open: http://localhost:3000
- Confirm: Homepage loads with dual-track sections (Aviation, Dev/Startup)
- Confirm: 3 posts per track displayed
- Confirm: ISR revalidation working (60-second cache)

---

## Scenario 2: Feature Testing (After Implementation)

### Test 1: Featured Posts Section (FR-003)

**Setup**:
```bash
# Mark posts as featured in frontmatter
# Edit content/posts/[post-slug].mdx
# Add: featured: true
```

**Test Steps**:
1. Navigate to: http://localhost:3000
2. Verify: Up to 2 featured posts displayed prominently at top
3. Verify: Featured posts use larger hero-style cards
4. Verify: Featured posts excluded from regular feed (no duplicates)
5. Verify: Section hidden gracefully if no featured posts

---

### Test 2: Unified Feed View (FR-001)

**Test Steps**:
1. Navigate to: http://localhost:3000/?view=unified
2. Verify: All posts displayed chronologically (newest first)
3. Verify: Each post shows track badge (Aviation/Dev-Startup/Cross-pollination)
4. Verify: URL reflects unified view state
5. Verify: Toggle back to dual-track view works correctly

---

### Test 3: Track Filtering (FR-002)

**Test Steps**:
1. Navigate to: http://localhost:3000
2. Click: Aviation filter button
3. Verify: Only aviation posts displayed
4. Verify: URL updates to `/?track=aviation`
5. Verify: Filter state persists on page refresh
6. Repeat: For Dev/Startup and Cross-pollination filters

**Edge Cases**:
- Filter with no matching posts → Verify empty state message
- Filter + Unified view → Verify URL: `/?view=unified&track=aviation`
- "All" filter → Verify shows all posts

---

### Test 4: Load More Pagination (FR-004)

**Test Steps**:
1. Navigate to: http://localhost:3000
2. Scroll: To bottom of initial posts (6 posts)
3. Click: "Load More" button
4. Verify: Next 6 posts appended below
5. Verify: Scroll position maintained
6. Verify: Button shows loading spinner during fetch
7. Verify: Button hidden when all posts loaded

**Edge Cases**:
- Load more with filter active → Verify only filtered posts loaded
- Load more in unified view → Verify chronological order maintained
- Less than 6 posts remaining → Verify all remaining loaded, button hidden

---

### Test 5: Mobile Responsiveness (FR-006)

**Test Steps**:
1. Open: Chrome DevTools (F12)
2. Select: Mobile device (iPhone 12, Pixel 5)
3. Navigate to: http://localhost:3000
4. Verify: Filter UI accessible and usable on mobile
5. Verify: Post grid switches to single column
6. Verify: "Load More" button easily tappable
7. Verify: Featured posts render appropriately
8. Verify: No horizontal scroll or layout overflow

---

## Scenario 3: Validation and Quality Checks

### Performance Testing (NFR-001)

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check Core Web Vitals
# Expected:
# - FCP (First Contentful Paint): <2s
# - LCP (Largest Contentful Paint): <3s
# - Performance Score: ≥85
```

**Manual Performance Checks**:
1. Network throttling: Slow 3G (DevTools)
2. Verify: "Load More" completes in <1 second
3. Verify: Images use Next.js Image optimization
4. Verify: No layout shift when loading more posts

---

### Accessibility Testing (NFR-002)

```bash
# Run axe DevTools or Lighthouse accessibility audit
# Expected: WCAG 2.1 AA compliance (100% score)
```

**Manual Accessibility Checks**:
1. Keyboard navigation:
   - Tab through filter buttons → Verify focus states visible
   - Tab to "Load More" button → Verify keyboard accessible
   - Press Enter on filter → Verify filter applies
2. Screen reader testing (NVDA/JAWS):
   - Navigate to filter controls → Verify announced correctly
   - Apply filter → Verify change announced
   - Click "Load More" → Verify loading state announced
3. Color contrast:
   - Verify: Text contrast ≥4.5:1 (WCAG AA)
   - Verify: Interactive elements contrast ≥3:1

---

### Browser Compatibility

**Test Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test Cases**:
- Filter buttons work across all browsers
- URL state syncs correctly
- "Load More" pagination functions
- Featured posts render correctly

---

## Scenario 4: SEO Validation (NFR-003)

### Canonical URL Check

```bash
# View page source: http://localhost:3000/?track=aviation
# Verify: <link rel="canonical" href="https://marcusgoll.com/" />
```

**Expected**:
- Canonical URL points to default homepage (no params)
- Meta tags remain accurate for homepage
- No duplicate content issues from URL parameters

---

### Structured Data Validation

```bash
# Test with Google Rich Results Test
# https://search.google.com/test/rich-results

# Expected:
# - Blog posts have structured data (if implemented)
# - Featured posts enhance search snippet preview
```

---

## Scenario 5: Manual Integration Testing

### End-to-End User Flow

**Flow 1: Discover Featured Content**
1. Visit homepage
2. See featured posts prominently at top
3. Click featured post → Navigate to post detail
4. Verify: Post detail page loads correctly

**Flow 2: Filter by Interest**
1. Visit homepage
2. See dual-track sections by default
3. Click "Aviation" filter
4. See only aviation posts
5. Click "Load More"
6. See additional aviation posts
7. Click post → Navigate to post detail

**Flow 3: Explore Unified Feed**
1. Visit homepage
2. Toggle to unified view
3. See all posts chronologically
4. Verify: Track badges visible on each post
5. Filter by "Dev/Startup"
6. See only dev/startup posts in unified view
7. Share URL with friend → Verify filter state preserved

---

## Scenario 6: Rollback Testing (If Deployment Fails)

### Test Rollback to Previous Version

```bash
# Identify previous deployment ID
# From: specs/003-homepage-post-feed/deployment-metadata.json

# Rollback command (Vercel example)
vercel alias set <previous-deployment-id> marcusgoll.com --token=$VERCEL_TOKEN

# Wait 15 seconds for DNS propagation

# Verify: Previous homepage version live
curl -I https://marcusgoll.com | grep -i x-vercel-id
```

**Expected**:
- Previous version loads correctly
- No featured posts section (if not in previous version)
- Dual-track layout works as before
- No broken links or errors

---

## Common Issues and Debugging

### Issue: "Load More" button not appearing

**Debug Steps**:
1. Check: Are there more than 6 posts in `content/posts/`?
2. Check: Console errors related to pagination state
3. Verify: `hasMore` flag correctly calculated in component state

---

### Issue: Featured posts duplicated in regular feed

**Debug Steps**:
1. Check: Featured posts properly filtered from regular feed
2. Verify: `featuredPosts` array excluded in `allPosts` logic
3. Inspect: Post IDs to identify duplicates

---

### Issue: Filter state not persisting on refresh

**Debug Steps**:
1. Check: URL params correctly updated on filter selection
2. Verify: Component reads URL params on mount
3. Inspect: Browser console for URL state sync errors

---

## Success Criteria Checklist

Before marking feature complete, verify:

- [ ] Featured posts display prominently (up to 2)
- [ ] Dual-track view remains default
- [ ] Unified view accessible via `/?view=unified`
- [ ] Track filtering works (Aviation, Dev/Startup, Cross-pollination, All)
- [ ] URL state syncs correctly
- [ ] Filter state persists on refresh
- [ ] "Load More" button loads next 6 posts
- [ ] Button shows loading state
- [ ] Button hidden when no more posts
- [ ] Mobile responsive (single column, accessible filters)
- [ ] Keyboard navigable (Tab, Enter)
- [ ] Screen reader friendly (ARIA labels, announcements)
- [ ] Performance: FCP <2s, LCP <3s
- [ ] Accessibility: WCAG 2.1 AA compliance
- [ ] SEO: Canonical URL set, no duplicate content
- [ ] Analytics: Track filter clicks, "Load More" clicks, featured post impressions
- [ ] Backward compatibility: Existing `/aviation` and `/dev-startup` links work
- [ ] No breaking changes to Post type or API
