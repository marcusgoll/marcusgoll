# Error Log

**Feature**: Projects Showcase Page
**Created**: 2025-10-29
**Purpose**: Track errors, blockers, and resolutions during implementation

## Instructions

Use this log to document all errors encountered during implementation, optimization, and deployment phases. Each entry should include context, root cause, resolution, and prevention strategy.

---

## Error Entry Template

```markdown
### [ERROR-NNN] Brief error description

**Date**: YYYY-MM-DD
**Phase**: Implementation | Optimization | Deployment
**Severity**: Critical | High | Medium | Low
**Component**: Component or file affected
**Status**: Open | Investigating | Resolved

**Context**:
What were you trying to do when the error occurred?

**Error Message**:
```
[Paste full error message or stack trace]
```

**Root Cause**:
What caused the error? (data issue, type error, missing dependency, etc.)

**Resolution**:
How was the error fixed?

**Prevention**:
How can this error be prevented in the future?

**Related**:
- Link to GitHub issue (if applicable)
- Link to related errors (if applicable)
```

---

## Error Tracking

No errors logged yet. Errors will be tracked here during implementation phase.

---

## Common Error Patterns (Anticipated)

### Pattern 1: MDX Frontmatter Validation Errors

**Symptom**: Build fails with "Missing required field" error

**Common Causes**:
- Missing required frontmatter field (title, description, category, etc.)
- Invalid category value (not one of 'aviation', 'dev-startup', 'cross-pollination')
- Tech stack array empty or has >10 items
- Invalid date format (not ISO 8601)

**Prevention**:
- Use MDX frontmatter template for all projects
- Add build-time validation with descriptive errors
- Use TypeScript strict mode for type checking

---

### Pattern 2: Image Path Errors

**Symptom**: Broken images on project cards

**Common Causes**:
- `coverImage` path missing leading `/`
- Image file missing from `public/images/projects/`
- Filename case mismatch (Linux is case-sensitive)

**Prevention**:
- Always use absolute paths (`/images/projects/...`)
- Add build-time check for image file existence
- Use lowercase filenames consistently

---

### Pattern 3: Type Mismatch Errors

**Symptom**: TypeScript compilation error

**Common Causes**:
- Passing wrong type to component prop
- Missing required prop
- Incorrect return type from function

**Prevention**:
- Use TypeScript strict mode
- Define interfaces for all component props
- Use type guards for runtime validation

---

### Pattern 4: Client/Server Component Boundary Errors

**Symptom**: "You're importing a component that needs useState..."

**Common Causes**:
- Using client-only hook (useState, useEffect) in server component
- Importing server-only code in client component
- Missing 'use client' directive

**Prevention**:
- Add 'use client' to components using hooks
- Keep server components minimal (data fetching only)
- Separate client and server logic clearly

---

### Pattern 5: Build Performance Issues

**Symptom**: Build takes >5 minutes or times out

**Common Causes**:
- Loading too many large images at build time
- Parsing large MDX files with complex content
- Inefficient data fetching (reading same files multiple times)

**Prevention**:
- Optimize images before committing (<500KB each)
- Cache parsed MDX files during build
- Use memoization for repeated data fetching

---

## Error Statistics (Updated Post-Implementation)

| Phase | Total Errors | Critical | High | Medium | Low | Resolved |
|-------|--------------|----------|------|--------|-----|----------|
| Specification | 0 | 0 | 0 | 0 | 0 | 0 |
| Planning | 0 | 0 | 0 | 0 | 0 | 0 |
| Implementation | - | - | - | - | - | - |
| Optimization | - | - | - | - | - | - |
| Deployment | - | - | - | - | - | - |

**Total**: 0 errors logged

---

## Blocker Tracking

No blockers logged yet. Blockers will be tracked here during implementation phase.

### Blocker Entry Template

```markdown
### [BLOCKER-NNN] Brief blocker description

**Date**: YYYY-MM-DD
**Phase**: Implementation | Optimization | Deployment
**Impact**: High | Medium | Low
**Status**: Blocked | Investigating | Resolved

**Description**:
What is blocking progress?

**Blocker Type**:
- [ ] Missing dependency
- [ ] External service issue
- [ ] Design decision needed
- [ ] Technical limitation
- [ ] Resource unavailable
- [ ] Other: [describe]

**Workaround**:
Temporary solution to unblock (if available)

**Resolution**:
How was the blocker removed?

**Resolution Date**: YYYY-MM-DD
```

---

## Lessons Learned

This section will be populated after implementation with key insights and best practices discovered during development.

### Post-Implementation Notes

**What Went Well**:
- (To be filled during finalization phase)

**What Could Be Improved**:
- (To be filled during finalization phase)

**Key Takeaways**:
- (To be filled during finalization phase)

---

**Last Updated**: 2025-10-29
