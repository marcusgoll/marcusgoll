# Error Log: Multi-Track Newsletter Subscription System

## Planning Phase (Phase 0-2)
None yet.

## Implementation Phase (Phase 3-4)
[Populated during /tasks and /implement]

## Testing Phase (Phase 5)
[Populated during /debug and /preview]

## Deployment Phase (Phase 6-7)
[Populated during staging validation and production deployment]

---

## Error Template

**Error ID**: ERR-[NNN]
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [api/frontend/database/deployment]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened]

**Root Cause**:
[Why it happened]

**Resolution**:
[How it was fixed]

**Prevention**:
[How to prevent in future]

**Related**:
- Spec: [link to requirement]
- Code: [file:line]
- Commit: [sha]

---

## Example Error (for reference)

**Error ID**: ERR-001
**Phase**: Implementation
**Date**: 2025-10-28 14:30
**Component**: api/newsletter/subscribe
**Severity**: High

**Description**:
Subscriber creation failed with Prisma error: "Unique constraint failed on the fields: (email)"
despite upsert logic being implemented. Multiple subscribers created with same email.

**Root Cause**:
Upsert query was not correctly handling existing subscribers. Used `create` instead of `upsert`
in Prisma client call, causing duplicate email constraint violation.

**Resolution**:
Changed Prisma query from:
```typescript
prisma.newsletterSubscriber.create({ data: { email, ... } })
```
To:
```typescript
prisma.newsletterSubscriber.upsert({
  where: { email },
  update: { active: true, unsubscribedAt: null },
  create: { email, unsubscribeToken, ... }
})
```

**Prevention**:
- Add integration test for re-subscription flow (signup → unsubscribe → signup again)
- Code review checklist: Verify upsert logic for all email-based operations

**Related**:
- Spec: FR-006 (Handle duplicate email signups by upserting)
- Code: app/api/newsletter/subscribe/route.ts:45
- Commit: abc1234