# Variant 3: Sidebar Filter + Magazine Layout

## Layout
- **Structure**: Sidebar (240px) + main content area
- **Container**: Magazine-style horizontal cards
- **Spacing**: Sidebar sticky, main content flows

## Interaction Pattern
- **Flow**: Persistent navigation sidebar
- **Filter**: Sidebar links with post counts
- **Primary action**: Card click to read post
- **Feedback**: Active filter highlighted in sidebar

## Components Used
- Container (page width)
- Button (CTAs)
- Sidebar navigation
- Magazine-style cards (horizontal)
- Featured hero card

## States Implemented
- `?state=default` - Sidebar + magazine layout with featured hero
- `?state=loading` - Skeleton sidebar + content placeholders

## Design Rationale

This variant emphasizes **professional presentation and content hierarchy**. The hypothesis is that a persistent sidebar improves navigation efficiency and the magazine layout provides better visual hierarchy for featured content.

### Why sidebar?
- **Always visible**: No clicking to access filters
- **Professional**: Matches app-style layouts
- **Contextual info**: Can show counts, categories, even ads

### Why magazine layout?
- **Hierarchy**: Featured post gets premium placement (large hero card)
- **Comfortable**: Horizontal cards easier to scan than vertical stack
- **Desktop-optimized**: Uses wider screens effectively

## Tradeoffs

### Pros
- ✅ **Professional look**: Feels like a polished publication
- ✅ **Persistent navigation**: Sidebar always accessible
- ✅ **Content hierarchy**: Featured post is truly prominent
- ✅ **Desktop experience**: Uses wide screens well

### Cons
- ❌ **Desktop-biased**: Sidebar must collapse on mobile (loses main benefit)
- ❌ **Space cost**: Sidebar reduces content area by ~20%
- ❌ **Complexity**: More moving parts, more CSS to maintain

## HEART Alignment

**Hypothesis**: Faster content discovery increases engagement

**This variant**:
- ✅ **Task Success**: Excellent - sidebar enables zero-click filtering (always visible)
- ✅ **Engagement**: Good - featured hero draws attention to best content
- ⚠️ **Adoption**: Desktop users love it, mobile users get less benefit

**Best for**: Desktop-first audiences who value professional presentation.

## Mobile Considerations

- Sidebar collapses to top nav on mobile
- Magazine cards stack vertically
- Featured hero becomes full-width stacked card
- Loses primary advantage (persistent nav)

## Accessibility

- Sidebar uses semantic `<nav>` with ARIA labels
- Keyboard navigation: Tab through sidebar links
- Sticky positioning maintains focus context
- Post counts provide helpful context for screen readers
