# Error Log

**Purpose**: Track failures, root causes, and learnings during implementation.

---


### Entry 1: 2025-10-28 - Production Build Failure (Server Component onClick)

**Failure**: Production build failed with "Event handlers cannot be passed to Client Component props" error in newsletter page

**Symptom**: 
```
Error: Event handlers cannot be passed to Client Component props.
Location: app/newsletter/page.tsx:161-166
Error: onClick handler on <a> tag in Server Component
```

**Learning**: Next.js 15 enforces strict Server/Client Component boundaries. Event handlers (onClick, onChange, etc.) cannot be used in Server Components - they must either be in Client Components or removed in favor of native browser behavior. In this case, the onClick handler was attempting to provide smooth scroll behavior to an anchor link.

**Ghost Context Cleanup**: 
- Removed onClick handler with preventDefault and querySelector DOM manipulation (lines 161-166)
- Replaced with native anchor link behavior (href="#get-started")
- Added id="get-started" to target section (line 127)
- Browser's native smooth scroll handling via CSS scroll-behavior: smooth (already in global styles)

**Resolution**: 
- Simplified code following KISS principle (removed 6 lines of JavaScript)
- Uses browser-native behavior instead of custom JavaScript
- Maintains accessibility (keyboard navigation works)
- Build now succeeds: ✓ Compiled successfully in 2.4s
- Newsletter route generated: /newsletter (163B, 114kB First Load JS)

**From /optimize phase** - Critical build blocker identified during production readiness validation
