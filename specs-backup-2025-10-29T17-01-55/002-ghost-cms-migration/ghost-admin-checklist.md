# Ghost Admin Tag Configuration Checklist

This checklist guides the manual setup of Ghost CMS tags and content organization for the dual-track content strategy.

## Prerequisites

- [ ] Ghost Admin access configured
- [ ] Ghost Content API key generated and added to `.env.local`
- [ ] Ghost API URL confirmed in `.env.local`

## Primary Tags (Content Tracks)

Create these primary tags in Ghost Admin (`Settings > Tags`):

- [ ] **aviation**
  - Name: `Aviation`
  - Slug: `aviation`
  - Description: `Aviation career guidance, flight training, and CFI resources`
  - Color: `#0EA5E9` (Sky Blue)
  - Visibility: Public

- [ ] **dev-startup**
  - Name: `Dev/Startup`
  - Slug: `dev-startup`
  - Description: `Software development, systematic thinking, and startup insights`
  - Color: `#059669` (Emerald 600)
  - Visibility: Public

- [ ] **cross-pollination**
  - Name: `Cross-Pollination`
  - Slug: `cross-pollination`
  - Description: `Content bridging aviation and software development`
  - Color: `#8B5CF6` (Purple - gradient between tracks)
  - Visibility: Public

## Aviation Secondary Tags

Create these category tags for aviation content:

- [ ] **flight-training**
  - Name: `Flight Training`
  - Slug: `flight-training`
  - Description: `Flight training techniques, lessons, and student resources`
  - Parent: None (use with `aviation` primary tag)

- [ ] **cfi-resources**
  - Name: `CFI Resources`
  - Slug: `cfi-resources`
  - Description: `Resources for Certified Flight Instructors`
  - Parent: None (use with `aviation` primary tag)

- [ ] **career-path**
  - Name: `Career Path`
  - Slug: `career-path`
  - Description: `Aviation career guidance and progression`
  - Parent: None (use with `aviation` primary tag)

## Dev/Startup Secondary Tags

Create these category tags for dev/startup content:

- [ ] **software-development**
  - Name: `Software Development`
  - Slug: `software-development`
  - Description: `Web development, coding practices, and technical tutorials`
  - Parent: None (use with `dev-startup` primary tag)

- [ ] **systematic-thinking**
  - Name: `Systematic Thinking`
  - Slug: `systematic-thinking`
  - Description: `Problem-solving frameworks and mental models`
  - Parent: None (use with `dev-startup` primary tag)

- [ ] **startup-insights**
  - Name: `Startup Insights`
  - Slug: `startup-insights`
  - Description: `Entrepreneurship, product development, and startup lessons`
  - Parent: None (use with `dev-startup` primary tag)

## Tag Application Rules

**Every post must have:**
1. Exactly **one primary tag** (`aviation`, `dev-startup`, or `cross-pollination`)
2. Zero or more **secondary tags** for categorization

**Examples:**

- Aviation post about flight training:
  - Primary: `aviation`
  - Secondary: `flight-training`

- Dev post about systematic problem-solving:
  - Primary: `dev-startup`
  - Secondary: `systematic-thinking`, `software-development`

- Cross-pollination post about checklists in aviation and code:
  - Primary: `cross-pollination`
  - Secondary: `systematic-thinking`, `flight-training`

## Content Migration

Migrate existing posts to use the new tag structure:

- [ ] Audit all existing posts (estimated 35 aviation posts)
- [ ] Apply primary tag to each post
- [ ] Apply relevant secondary tags
- [ ] Verify tag colors display correctly on frontend
- [ ] Test tag archive pages (`/tag/[slug]`)

## Ghost Site Settings

Configure Ghost site settings for optimal integration:

- [ ] **General Settings**
  - Site title: `Marcus Gollahon`
  - Site description: `Teaching systematic thinking from 30,000 feet`

- [ ] **Navigation**
  - Primary Navigation:
    - Home: `/`
    - Aviation: `/aviation`
    - Dev/Startup: `/dev-startup`
    - About: `/about` (future)

- [ ] **Code Injection** (if using Ghost-hosted images)
  - Add CORS headers for Next.js Image optimization (if needed)

## Testing Checklist

After tag configuration, verify:

- [ ] Aviation hub page displays correctly (`/aviation`)
- [ ] Dev/Startup hub page displays correctly (`/dev-startup`)
- [ ] Tag archive pages work (`/tag/flight-training`, etc.)
- [ ] Homepage dual-track showcase displays posts from both tracks
- [ ] TrackBadge colors match tag colors
- [ ] ISR revalidation working (60-second cache)
- [ ] `getPrimaryTrack` helper correctly identifies primary tags

## Performance Verification

- [ ] Ghost Content API response time < 500ms
- [ ] Homepage load time < 3s LCP
- [ ] Hub pages load time < 3s LCP
- [ ] Tag archive pages load time < 3s LCP

## Post-Migration Tasks

- [ ] Document tag strategy in `docs/CONTENT_STRATEGY.md`
- [ ] Create content calendar for dual-track publishing
- [ ] Set up analytics tracking for track engagement
- [ ] Configure newsletter integration (future)

---

**Last Updated**: 2025-10-21
**Status**: Ready for Ghost Admin configuration
**Owner**: Marcus Gollahon
