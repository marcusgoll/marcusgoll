# Design Critique: Homepage with Post Feed

**Feature**: `homepage-post-feed`
**Phase**: Design Variations → Functional Prototype
**Variants**: 4 total
**Review Date**: _[Fill in date]_

## Instructions

After reviewing all variants at `http://localhost:3000/mock/homepage-post-feed/homepage`:

1. **Test all states**: default, loading, empty for each variant
2. **Consider HEART metrics**: Does this design support faster content discovery (task success)?
3. **Evaluate against Jobs Principles**:
   - ≤2 clicks to primary action?
   - Zero tooltips needed?
   - Design is self-evident?
4. **Make decisions**: Keep (use as-is), Change (good but needs tweaks), Kill (discard)

## Variant Critique

### v1: Traditional Tabs + Vertical List

| Element | Keep / Change / Kill | Notes |
|---------|---------------------|-------|
| Tab navigation | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Vertical list layout | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Featured post box | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Post card design | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Load More button | [ ] KEEP / [ ] CHANGE / [ ] KILL | |

**Overall Verdict**: [ ] Use as base / [ ] Cherry-pick elements / [ ] Discard

**Strengths**:
-

**Weaknesses**:
-

**Changes Needed** (if CHANGE):
-

---

### v2: Button Pills + Card Grid

| Element | Keep / Change / Kill | Notes |
|---------|---------------------|-------|
| Pill-style filters | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Card grid (2-3 col) | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Featured banner | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Emoji in filters | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Result count text | [ ] KEEP / [ ] CHANGE / [ ] KILL | |

**Overall Verdict**: [ ] Use as base / [ ] Cherry-pick elements / [ ] Discard

**Strengths**:
-

**Weaknesses**:
-

**Changes Needed** (if CHANGE):
-

---

### v3: Sidebar Filter + Magazine Layout

| Element | Keep / Change / Kill | Notes |
|---------|---------------------|-------|
| Persistent sidebar | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Magazine-style cards | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Featured hero (large) | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Sidebar CTA box | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Post counts in nav | [ ] KEEP / [ ] CHANGE / [ ] KILL | |

**Overall Verdict**: [ ] Use as base / [ ] Cherry-pick elements / [ ] Discard

**Strengths**:
-

**Weaknesses**:
-

**Changes Needed** (if CHANGE):
-

---

### v4: Minimal + Masonry Grid

| Element | Keep / Change / Kill | Notes |
|---------|---------------------|-------|
| Compact dropdown filter | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Masonry grid layout | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Sticky header | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Variable card sizes | [ ] KEEP / [ ] CHANGE / [ ] KILL | |
| Scroll indicator | [ ] KEEP / [ ] CHANGE / [ ] KILL | |

**Overall Verdict**: [ ] Use as base / [ ] Cherry-pick elements / [ ] Discard

**Strengths**:
-

**Weaknesses**:
-

**Changes Needed** (if CHANGE):
-

---

## Selected Elements (for `/design-functional`)

**Base Layout**: _[Which variant provides the best foundation? v1/v2/v3/v4]_

**Chosen Elements** (mix and match from variants):

### Filter UI
- **Selected approach**: _[Tabs / Pills / Sidebar / Dropdown]_
- **From variant**: v_
- **Modifications needed**:
  -

### Post Display
- **Selected layout**: _[Vertical list / Card grid / Magazine / Masonry]_
- **From variant**: v_
- **Modifications needed**:
  -

### Featured Posts
- **Selected style**: _[Box / Banner / Hero / Ring border]_
- **From variant**: v_
- **Modifications needed**:
  -

### Load More
- **Selected pattern**: _[Button / Infinite scroll / Pagination]_
- **From variant**: v_
- **Modifications needed**:
  -

### Other Elements
- Copy style: _[Which variant has the best copy density/tone?]_
- Spacing: _[Which variant feels most comfortable?]_
- Mobile experience: _[Which variant works best on mobile?]_

---

## Jobs Principles Validation

After selecting elements, verify:

- [ ] **Primary action ≤2 clicks**: Can user browse/filter posts in 2 clicks or less?
- [ ] **Zero tooltips**: Is every element self-explanatory?
- [ ] **Obvious design**: Can a new user understand the interface immediately?
- [ ] **8px grid spacing**: Are elements aligned to 8px grid?
- [ ] **Smooth transitions**: Are hover/state changes 250ms?
- [ ] **One primary CTA**: Is there a clear primary action per screen?

**Failed checks**: _[List any failures and how to fix]_

---

## HEART Hypothesis Alignment

**Original hypothesis**: _[From spec.md - e.g., "Faster content discovery increases engagement"]_

**Best variant for hypothesis**: v_

**Reasoning**:


---

## Final Decisions

**Selected base variant**: v_

**Elements to merge from other variants**:
1.
2.
3.

**New components to create** (not in any variant):
-

**Components to modify** (from existing):
-

**Ready for `/design-functional`**: [ ] Yes / [ ] No (more review needed)

---

## Notes

_[Any additional thoughts, questions, or considerations]_


