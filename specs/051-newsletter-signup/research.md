# Research & Discovery: 051-newsletter-signup

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal website/blog for aviation, education, dev projects, and startups
- **Target Users**: Aviation professionals, pilots, developers, startup founders
- **Success Metrics**: Newsletter signups, engagement rates, conversion by placement
- **Scope Boundaries**: Frontend integration only - backend API fully functional

### System Architecture (from system-architecture.md)
- **Components**: Next.js monolith with App Router, newsletter API routes
- **Integration Points**: Resend/Mailgun for email delivery, PostgreSQL via Prisma, GA4 for analytics
- **Data Flows**: Newsletter signup → API validation → DB upsert → email send (fire-and-forget)
- **Constraints**: Simple architecture (solo developer), static generation preferred, client components for forms

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0, TypeScript 5.9.3
- **Backend**: Next.js API Routes, Prisma 6.17.1, PostgreSQL 15+
- **UI**: Tailwind CSS 4.1.15, Custom components + Radix UI primitives
- **Deployment**: Hetzner VPS + Docker, Caddy reverse proxy, direct-prod model

### Data Architecture (from data-architecture.md)
- **Existing Entities**: NewsletterSubscriber (email, source, unsubscribeToken), NewsletterPreference (subscriberId, newsletterType, subscribed)
- **Relationships**: 1 subscriber → N preferences (1-to-many)
- **Naming Conventions**: camelCase for TypeScript, snake_case for database
- **Migration Strategy**: Prisma Migrate (no migrations needed - schema exists)

### API Strategy (from api-strategy.md)
- **API Style**: REST with Next.js API Routes
- **Auth**: None (public newsletter signup)
- **Versioning**: None (simple API, backward compatibility maintained)
- **Error Format**: `{success: boolean, message: string, data?: {}}`
- **Rate Limiting**: 5 requests/minute per IP (implemented)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: micro tier (1,000-10,000 monthly visitors)
- **Performance Targets**: API <500ms p95, FCP <1.5s, TTI <3s
- **Resource Limits**: Single VPS with 4-8GB RAM, PostgreSQL on same server
- **Cost Constraints**: <$50/mo total, newsletter email free tier <3K emails/mo

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (no staging environment)
- **Platform**: Hetzner VPS via Docker + GitHub Actions
- **CI/CD Pipeline**: GitHub Actions → Docker build → SSH deploy
- **Environments**: Production only (local dev + prod)

### Development Workflow (from development-workflow.md)
- **Git Workflow**: Feature branch workflow (feature/NNN-slug)
- **Testing Strategy**: Manual testing priority (no E2E tests yet)
- **Code Style**: ESLint + TypeScript strict mode
- **Definition of Done**: Feature works, no console errors, Lighthouse ≥85

---

## Research Decisions

### Decision: Reuse NewsletterSignupForm component with variant props
- **Decision**: Extend existing NewsletterSignupForm.tsx with variant system
- **Rationale**: Component already has all core logic (validation, API call, error handling, multi-track selection). Adding variants avoids duplication and maintains consistency.
- **Alternatives**:
  - Create separate components (FooterNewsletterForm, InlineNewsletterCTA) - rejected due to code duplication
  - Build from scratch - rejected due to wasted effort (API integration already works)
- **Source**: components/newsletter/NewsletterSignupForm.tsx (lines 15-227)

### Decision: Use Tailwind variants for responsive layout
- **Decision**: Implement compact/inline/comprehensive variants using Tailwind CSS classes
- **Rationale**: Tailwind provides utility classes for responsive design, aligns with existing tech stack (Tailwind 4.1.15), no additional dependencies
- **Alternatives**: CSS Modules (rejected - less maintainable), styled-components (rejected - runtime overhead)
- **Source**: tech-stack.md (Tailwind CSS chosen for utility-first styling)

### Decision: Lazy-load newsletter forms below the fold
- **Decision**: Use Next.js dynamic imports with `{ ssr: false }` for below-fold newsletter components
- **Rationale**: Prevents blocking initial page load (NFR-001), improves FCP/LCP metrics, only loads when scrolled into view
- **Alternatives**: Eager load everywhere (rejected - hurts performance), intersection observer (considered but Next.js dynamic import simpler)
- **Source**: spec.md NFR-001, capacity-planning.md performance targets

### Decision: Track signup source via analytics parameter
- **Decision**: Pass `source` parameter (footer, post-inline, dedicated-page) to API and GA4
- **Rationale**: Enables A/B testing of placements, measures conversion by context, aligns with HEART metrics (Adoption)
- **Alternatives**: No tracking (rejected - can't optimize placements), separate GA4 events (considered but single event with dimension cleaner)
- **Source**: spec.md FR-017, FR-018, HEART metrics Adoption dimension

### Decision: Direct-prod deployment model
- **Decision**: Skip staging environment, deploy directly to production
- **Rationale**: Project uses direct-prod model (from deployment-strategy.md), cosmetic frontend changes low-risk, rollback via Git revert is fast
- **Alternatives**: Add staging environment (rejected - not worth setup overhead for this feature)
- **Source**: deployment-strategy.md, constitution.md deployment model

---

## Components to Reuse (6 found)

### Frontend Components
- **NewsletterSignupForm** (components/newsletter/NewsletterSignupForm.tsx): Full form with validation, API integration, multi-track checkboxes, error/success states. Will add variant prop (compact, inline, comprehensive).
- **Button** (components/ui/Button.tsx): Primary CTA button, loading states. Reuse for "Subscribe" buttons.
- **Footer** (components/layout/Footer.tsx): Site footer component. Will integrate compact newsletter form into 4-column grid layout.
- **BlogPostPage** (app/blog/[slug]/page.tsx): Individual post page. Will add inline newsletter CTA after MDX content, before prev/next navigation.

### Backend Services
- **Newsletter API** (app/api/newsletter/subscribe/route.ts): POST endpoint with Zod validation, Prisma DB upsert, Resend email send. No changes needed.
- **Validation Schemas** (lib/newsletter/validation-schemas.ts): Zod schemas for email and newsletter types. Reuse client-side validation.

---

## New Components Needed (5 required)

### Frontend Components
1. **CompactNewsletterSignup** (components/newsletter/CompactNewsletterSignup.tsx):
   - Purpose: Footer-specific variant with minimal UI (email-only input initially, expand for multi-track on click)
   - Rationale: Footer space limited, need single-line compact form that expands on interaction
   - Dependencies: NewsletterSignupForm (wraps with variant="compact")

2. **InlineNewsletterCTA** (components/newsletter/InlineNewsletterCTA.tsx):
   - Purpose: Context-aware CTA after blog posts with persuasive copy and one-click signup
   - Rationale: Highest engagement placement (reader just finished content), needs compelling copy
   - Dependencies: NewsletterSignupForm (wraps with variant="inline"), post metadata for context-aware messaging

3. **NewsletterPage** (app/newsletter/page.tsx):
   - Purpose: Dedicated `/newsletter` landing page with benefits, FAQs, testimonials, comprehensive form
   - Rationale: P2 enhancement, provides detailed info for users who want to learn more before subscribing
   - Dependencies: NewsletterSignupForm (variant="comprehensive"), Next.js metadata for SEO

4. **NewsletterFormVariants** (components/newsletter/NewsletterFormVariants.tsx or extend NewsletterSignupForm):
   - Purpose: Add variant prop to NewsletterSignupForm with conditional rendering logic
   - Rationale: DRY principle, single source of truth for form logic, variants share state management
   - Dependencies: class-variance-authority (for type-safe variants)

### Analytics
5. **GA4 Event Tracking** (lib/analytics/ga4-events.ts):
   - Purpose: Wrapper for GA4 event tracking with TypeScript types
   - Rationale: Type-safe analytics events, reusable across components
   - Dependencies: Google Analytics 4 script (already integrated per spec.md)

---

## Unknowns & Questions

None - all technical questions resolved:
- ✅ Backend API functional (POST /api/newsletter/subscribe with multi-track support)
- ✅ Email service configured (Resend, RESEND_API_KEY in environment)
- ✅ Database schema exists (NewsletterSubscriber + NewsletterPreference tables)
- ✅ Frontend component pattern established (NewsletterSignupForm.tsx)
- ✅ Layout integration points identified (Footer.tsx, BlogPostPage [slug]/page.tsx)
- ✅ Analytics strategy defined (GA4 custom events with source dimension)
- ✅ Deployment model confirmed (direct-prod, no staging needed)
- ✅ Performance targets established (FCP <1.5s, lazy-load below fold)
