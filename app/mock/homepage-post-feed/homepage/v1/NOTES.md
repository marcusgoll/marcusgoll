# Variant 1: Traditional Tabs + Vertical List

## Layout
- **Structure**: Single-column vertical list
- **Container**: Full-width posts with border separators
- **Spacing**: Comfortable 24px between posts

## Interaction Pattern
- **Flow**: In-page navigation (no redirects)
- **Filter**: Tab-based navigation at top
- **Primary action**: "Read more" button per post
- **Feedback**: URL updates on tab click

## Components Used
- Container (page width constraint)
- Button (CTA)
- Card (featured post container)
- Links (tab navigation)

## States Implemented
- `?state=default` - Normal feed with posts
- `?state=loading` - Skeleton placeholders while loading
- `?state=empty` - Empty state with CTA to view all posts

## Design Rationale

This variant uses the most conventional blog listing pattern - tabbed navigation with a vertical list. The hypothesis is that **familiarity reduces cognitive load** and allows users to focus on content rather than figuring out the interface.

### Why tabs?
Tabs are a universally recognized pattern for category switching. Users don't need to learn a new interaction model.

### Why vertical list?
- **Mobile-optimal**: Stacks naturally on narrow viewports
- **Scannable**: Easy to read top-to-bottom
- **Detailed**: Room for full excerpts and metadata

## Tradeoffs

### Pros
- ✅ **Familiar**: Users instantly understand tabs
- ✅ **Mobile-friendly**: Vertical list works on all viewports
- ✅ **Scannable**: Linear reading pattern, no jumping around
- ✅ **Accessible**: Standard tab navigation is screen-reader friendly

### Cons
- ❌ **Low content density**: Only shows 3-4 posts before scroll
- ❌ **More clicks**: Must click tab to see other tracks
- ❌ **Separated tracks**: Can't see cross-pollination posts alongside aviation

## HEART Alignment

**Hypothesis**: Faster content discovery increases engagement

**This variant**:
- ⚠️ **Task Success**: Moderate - tabs require clicks to explore all tracks
- ✅ **Engagement**: Good - detailed excerpts encourage reading
- ✅ **Adoption**: Excellent - familiar pattern, low learning curve

**Best for**: Users who prefer linear, detailed reading and don't mind clicking to filter.

## Mobile Considerations

- Tabs stack horizontally (may need scrolling on very narrow screens)
- Vertical list is naturally mobile-optimal
- Featured post box scales down nicely

## Accessibility

- Tab navigation uses standard `<nav>` with semantic HTML
- Active tab indicated by border and color (passes WCAG AA contrast)
- Keyboard navigation: Tab → Arrow keys for tab selection
- Screen readers announce tab count and current selection
