# Variant 4: Minimal + Masonry Grid

## Layout
- **Structure**: Pinterest-style masonry (asymmetric heights)
- **Container**: Variable-height cards in columns
- **Spacing**: Sticky header, 24px gaps

## Interaction Pattern
- **Flow**: Minimal chrome, content-first
- **Filter**: Compact dropdown in sticky header
- **Primary action**: Card click
- **Feedback**: Scroll indicator for infinite scroll feel

## Components Used
- Sticky header
- Dropdown select (filter)
- Masonry grid (CSS columns)
- Variable-height cards

## States Implemented
- `?state=default` - Masonry layout with varied card heights
- `?state=loading` - Skeleton masonry grid

## Design Rationale

This variant **breaks from convention** to test whether visual interest outweighs familiarity. The hypothesis is that a unique, Pinterest-inspired layout increases engagement through novelty and maximum content density.

### Why masonry?
- **Maximum density**: Shows 9-12 posts above fold
- **Visual interest**: Asymmetric layout catches attention
- **Breaks pattern**: Tests whether unconventional = better engagement

### Why minimal chrome?
- **Content-first**: Header is tiny, content dominates
- **Sticky filter**: Keeps filter accessible without taking space
- **Infinite scroll feel**: Scroll indicator suggests endless content

## Tradeoffs

### Pros
- ✅ **Unique visual**: Stands out from typical blog lists
- ✅ **Maximum density**: Shows most content of any variant
- ✅ **Minimal chrome**: Tiny header maximizes content space
- ✅ **Sticky filter**: Always accessible without visual weight

### Cons
- ❌ **Unconventional**: May confuse users expecting standard layout
- ❌ **Harder to scan**: Masonry is non-linear (no clear order)
- ❌ **Variable heights**: Requires careful card content to avoid awkward gaps
- ❌ **First card bias**: Ring-bordered first card might be ignored as ad

## HEART Alignment

**Hypothesis**: Faster content discovery increases engagement

**This variant**:
- ⚠️ **Task Success**: Questionable - masonry harder to scan linearly
- ✅ **Engagement**: Potentially excellent - novelty may increase clicks
- ❌ **Adoption**: Risk - unconventional pattern may drive users away

**Best for**: Visually-oriented users who value aesthetics over familiarity. High risk/reward.

## Mobile Considerations

- Masonry collapses to 1 column (loses visual effect)
- Sticky header works well on mobile
- Variable heights less problematic in single column

## Accessibility

- Dropdown uses native `<select>` (excellent keyboard support)
- Masonry reading order: top-to-bottom per column (can be confusing with screen readers)
- First card ring border may not convey "featured" to screen reader users
- Should add ARIA label to first card: aria-label="Featured post"

## Jobs Principles Violation?

This variant intentionally breaks the "obvious design" principle to test whether unconventional layouts can outperform conventional ones. The risk is confusion; the reward is higher engagement through visual novelty.

**Verdict**: Good for A/B testing, but risky as default.
