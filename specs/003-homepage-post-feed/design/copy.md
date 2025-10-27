# Copy: Homepage with Enhanced Post Feed

## Screen: Homepage (Default Dual-Track)

### Hero Section
**Heading**: Marcus Gollahon | Aviation & Software Development
**Subheading**: Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.

### Featured Posts Section
**Section Heading**: Featured
**Card Label Badge**: Featured Post
**Empty State**: (section hidden if no featured posts)

### View Toggle
**Button Labels**:
- Dual Track View
- Unified Feed

**Tooltip**: Switch between separate track sections and chronological feed

### Post Feed Filter
**Label**: Filter by track
**Filter Options**:
- All Posts
- Aviation
- Dev/Startup
- Cross-pollination

**Active Filter Indication**: Highlighted button state + "Showing {track} posts"

### Dual-Track Sections

#### Aviation Section
**Heading**: Aviation
**Subheading**: Flight training, CFI resources, and aviation career guidance
**CTA Button**: View All Aviation Posts
**Empty State**: No aviation posts available yet. Check back soon!

#### Dev/Startup Section
**Heading**: Dev/Startup
**Subheading**: Software development, systematic thinking, and startup insights
**CTA Button**: View All Dev/Startup Posts
**Empty State**: No dev/startup posts available yet. Check back soon!

### Load More Button
**Default State**: Load More Posts
**Loading State**: Loading...
**End State**: (button hidden, optional message: "You've reached the end")

---

## Screen: Homepage (Unified Feed)

### Section Heading
**All Posts**: All Posts
**Filtered**: {Track} Posts (e.g., "Aviation Posts", "Dev/Startup Posts", "Cross-pollination Posts")

### Results Count
**Format**: Showing {count} posts
**Example**: Showing 12 posts

### Post Feed Filter
**Label**: Filter by track
**Active Filter**: Highlighted with emerald accent

### Empty State
**Heading**: No posts found
**Message**: No posts found in this category yet.
**CTA Button**: Browse All Posts
**CTA Action**: Clears filter and shows all posts

---

## Screen: Featured Post Card

### Card Elements
**Badge**: Featured Post
**Title**: {Post Title from frontmatter}
**Excerpt**: {Post Excerpt from frontmatter}
**Author**: Marcus Gollahon
**Date**: {Formatted published date} (e.g., "October 21, 2025")
**Reading Time**: {calculated minutes} min read
**Track Badge**: Aviation | Dev/Startup | Cross-pollination
**CTA Hover**: Read More (implicit - entire card is clickable)

---

## Post Card (Standard)

### Card Elements
**Title**: {Post Title}
**Excerpt**: {Post Excerpt or first 160 characters}
**Author**: Marcus Gollahon
**Date**: {Formatted date} (e.g., "October 21, 2025")
**Reading Time**: {minutes} min read
**Track Badge**: Aviation | Dev/Startup | Cross-pollination

---

## Error Messages

### No Posts in Filter
**Message**: "No {track} posts available yet. Check back soon!"
**CTA**: "Browse All Posts" or "Switch to {other track}"

### Load More Failed
**Message**: "Unable to load more posts. Please try again."
**CTA**: "Retry"

### Network Error
**Message**: "Connection issue. Please check your internet and refresh the page."
**CTA**: "Refresh Page"

---

## Accessibility Copy

### Screen Reader Announcements
**Filter Changed**: "Showing {track} posts. {count} posts found."
**Loading More**: "Loading more posts..."
**Posts Loaded**: "{count} new posts loaded."
**End Reached**: "All posts have been displayed."
**View Changed**: "Switched to {dual-track/unified} view."

### Button Aria Labels
**View Toggle**: "Toggle between dual-track and unified feed view"
**Load More**: "Load more posts"
**Filter Button**: "Filter posts by {track}"
**Featured Post**: "Featured post: {title}"

### Loading State
**Load More Aria-Busy**: "true" (while fetching)
**Load More Aria-Live**: "polite" (announces completion)

---

## Tooltips

### View Toggle
**Dual-Track Icon**: "Show separate sections for each track"
**Unified Icon**: "Show all posts chronologically"

### Track Badge
**Aviation**: "Aviation content track"
**Dev/Startup**: "Development and startup content track"
**Cross-pollination**: "Cross-domain insights combining aviation and dev"

---

## Meta Tags (for SEO)

### Default Homepage
**Title**: Marcus Gollahon | Aviation & Software Development
**Description**: Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.

### Filtered Views
**Title (Aviation)**: Aviation Posts | Marcus Gollahon
**Description (Aviation)**: Flight training, CFI resources, and aviation career guidance from a professional pilot and instructor.

**Title (Dev/Startup)**: Dev/Startup Posts | Marcus Gollahon
**Description (Dev/Startup)**: Software development insights, systematic thinking, and startup lessons from a developer and entrepreneur.

---

## Notes

- All copy maintains Marcus Gollahon's brand voice: Systematic, clear, teaching-focused
- Aviation and Dev/Startup tracks get equal prominence (40/40 split per brand guidelines)
- Cross-pollination track bridges both domains
- Error messages are helpful and actionable, not technical
- Accessibility copy ensures screen reader users get full context
- Metadata optimized for SEO while remaining accurate and helpful
