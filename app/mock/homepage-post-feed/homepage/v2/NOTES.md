# Variant 2: Button Pills + Card Grid

## Layout
- **Structure**: 2-3 column responsive grid
- **Container**: Card-based with images
- **Spacing**: 24px gaps between cards

## Interaction Pattern
- **Flow**: In-page filtering
- **Filter**: Pill-style buttons with icons (emoji)
- **Primary action**: Entire card clickable
- **Feedback**: Active pill highlighted, result count shown

## Components Used
- Container (page width)
- Button (pill-style filters, CTAs)
- Card grid (2-3 columns)
- Badge (track labels)

## States Implemented
- `?state=default` - Grid of post cards
- `?state=loading` - Skeleton grid (6 cards)

## Design Rationale

This variant prioritizes **visual engagement and content density**. The hypothesis is that card grids with images increase click-through rates and allow users to scan more content at once.

### Why pills?
- Visual hierarchy through shape/color
- Group related options clearly
- Friendly, modern aesthetic
- Emoji provide instant visual categorization

### Why grid?
- **High density**: Shows 6-9 posts above fold (vs 3-4 for list)
- **Visual**: Images draw attention
- **Modern**: Matches current design trends (Medium, Substack)

## Tradeoffs

### Pros
- ✅ **High content density**: 2-3x more posts visible than list
- ✅ **Visual engagement**: Images and cards feel modern
- ✅ **Scannability**: Emoji help users quickly identify tracks
- ✅ **Result feedback**: Shows count of filtered posts

### Cons
- ❌ **Less detail**: Shorter excerpts due to card constraints
- ❌ **Image dependency**: Requires good cover images for every post
- ❌ **Grid challenges**: Less optimal on mobile (cards can feel cramped)

## HEART Alignment

**Hypothesis**: Faster content discovery increases engagement

**This variant**:
- ✅ **Task Success**: Excellent - see many posts at once, filter without leaving view
- ✅ **Engagement**: Good - visual cards are clickable and appealing
- ⚠️ **Adoption**: Moderate - grid requires more visual scanning

**Best for**: Users who prefer visual browsing and want to see many options quickly.

## Mobile Considerations

- Grid collapses to 1 column on mobile (loses density advantage)
- Pills wrap to multiple rows if needed
- Card images maintain aspect ratio (16:9)

## Accessibility

- Pills use semantic `<button>` elements
- Active state indicated by background color (WCAG AA compliant)
- Cards have hover states for mouse users
- Images have alt text (placeholder in mockup)
