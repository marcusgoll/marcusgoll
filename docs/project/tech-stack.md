# Technology Stack

**Last Updated**: 2025-10-26
**Related Docs**: See `system-architecture.md` for how components fit together, `deployment-strategy.md` for infrastructure

## Stack Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | Next.js (App Router) | 15.5.6 | Server-rendered React, SEO, MDX processing |
| Language | TypeScript | 5.9.3 | Type-safe development |
| UI Framework | Tailwind CSS | 4.1.15 | Utility-first styling, responsive design |
| Runtime | React | 19.2.0 | Component-based UI |
| Database | PostgreSQL | 15+ | Relational data (via Supabase) |
| ORM | Prisma | 6.17.1 | Type-safe database client |
| Content | MDX | 3.1.1 | Markdown with React components |
| Deployment | Hetzner VPS + Docker | Latest | Self-hosted infrastructure |
| Newsletter | Resend / Mailgun | Latest | Email delivery |
| Analytics | Google Analytics 4 | Latest | Site tracking |

---

## Frontend Stack

### Core Framework

**Choice**: Next.js 15 (App Router)
**Version**: 15.5.6
**Rationale**:
- Server-side rendering critical for SEO (blog content needs to be crawlable)
- App Router enables React Server Components (better performance, less JavaScript shipped)
- Built-in MDX support via `@next/mdx`
- Excellent image optimization with `next/image`
- Vercel's backing ensures long-term support
- Large ecosystem and community resources

**Alternatives Rejected**:
- Astro: Less mature React integration, smaller ecosystem
- Remix: Similar features but smaller community, less corporate backing
- Gatsby: Slower builds, GraphQL overhead unnecessary for simple blog
- Create React App: Deprecated, no SSR

### Language

**Choice**: TypeScript
**Version**: 5.9.3
**Rationale**:
- Type safety prevents runtime errors (critical for solo developer)
- Excellent IDE support (autocomplete, refactoring in VS Code/Cursor)
- Industry standard for React projects (better hiring if team grows)
- Prisma generates types automatically (type-safe database queries)
- Easier long-term maintenance

**Alternatives Rejected**:
- JavaScript: No type safety, more bugs in production
- ReScript/Reason: Too niche, limited ecosystem

### UI Framework

**Choice**: Tailwind CSS
**Version**: 4.1.15
**Rationale**:
- Utility-first approach enables fast prototyping
- Small bundle size (only used classes included)
- Excellent responsive design utilities
- Dark mode support built-in
- No CSS-in-JS runtime overhead
- Industry-standard (easy for collaborators)

**Alternatives Rejected**:
- CSS Modules: More boilerplate, harder to maintain
- Styled Components: Runtime overhead, larger bundle
- MUI/Chakra: Too opinionated, heavier bundle size
- Bootstrap: Dated, hard to customize

### Component Library

**Choice**: Custom components + Radix UI primitives
**Version**: Radix UI ^1.x
**Rationale**:
- Radix provides accessible, unstyled primitives (Dialog, Slot)
- Full customization with Tailwind
- Smaller bundle vs full component libraries
- Accessibility built-in (WCAG 2.1 AA)

**Supporting Libraries**:
- `class-variance-authority`: Type-safe component variants
- `clsx` / `tailwind-merge`: Conditional class merging
- `lucide-react`: Icon library (tree-shakeable)

### State Management

**Choice**: React Server Components + minimal client state
**Version**: Built into React 19
**Rationale**:
- Most data fetching handled server-side (no state management needed)
- Client state minimal (theme preference, UI toggles)
- React Context sufficient for theme (next-themes)
- No complex application state (blog is content-focused)

**Alternatives Rejected**:
- Redux: Massive overkill for static blog
- Zustand: Not needed (no complex client state)
- Jotai/Recoil: Unnecessary complexity

### Build Tool

**Choice**: Turbo (built into Next.js)
**Version**: Built-in
**Rationale**:
- Zero configuration (comes with Next.js)
- Fast refresh during development
- Optimized production builds
- No need to configure Webpack/Vite

---

## Backend Stack

### Core Framework

**Choice**: Next.js API Routes
**Version**: 15.5.6
**Rationale**:
- Integrated with frontend (no separate backend repo)
- Serverless functions on VPS (Docker deployment)
- Simple for low-complexity API needs (newsletter signup)
- TypeScript across full stack
- Can scale to separate backend later if needed

**Current Usage**:
- `/api/newsletter` - Newsletter subscription endpoint

**Alternatives Rejected**:
- Express.js: Separate service unnecessary for simple API
- FastAPI/Python: TypeScript consistency preferred
- tRPC: Overkill for simple REST endpoints

### Database Library

**Choice**: Prisma ORM
**Version**: 6.17.1
**Rationale**:
- Type-safe database queries (auto-generated TypeScript types)
- Excellent migrations system (version-controlled schema changes)
- Great DX with Prisma Studio (GUI for database)
- Works seamlessly with PostgreSQL
- Active development, strong community

**Configuration**:
- Client output: `app/generated/prisma` (custom location)
- Connection pooling via Supabase Supavisor
- Direct URL for migrations (bypasses pooler)

**Alternatives Rejected**:
- TypeORM: Less modern, weaker types
- Drizzle: Less mature, smaller community
- Raw SQL: No type safety, error-prone
- Sequelize: Older, worse DX

### Validation

**Choice**: Zod
**Version**: 4.1.12
**Rationale**:
- Runtime type validation for API inputs
- Integrates with TypeScript
- Used for environment variable validation
- Schema-based validation (clear error messages)

**Usage**:
- API request validation
- Environment variable schema (`lib/env-schema.ts`)

---

## Database Stack

### Primary Database

**Choice**: PostgreSQL (via self-hosted Supabase)
**Version**: 15+
**Rationale**:
- Self-hosted Supabase provides PostgreSQL + auth + realtime (if needed later)
- Relational model fits structured content (posts, tags, users)
- Excellent full-text search (if needed for site search)
- ACID compliance for data integrity
- Industry standard, proven at scale
- Free (self-hosted on same VPS)

**Current Usage**:
- Minimal (User model as placeholder)
- Future: Newsletter subscribers, comments (if added), analytics

**Alternatives Rejected**:
- MySQL: Weaker JSON support, less feature-rich
- MongoDB: Document model doesn't fit relational content structure
- SQLite: Can't scale beyond single server (VPS may grow to multi-instance)
- Managed Supabase: More expensive ($25+/mo), prefer self-hosted for learning

### Migrations

**Choice**: Prisma Migrate
**Version**: Built into Prisma 6.17.1
**Rationale**:
- Auto-generates migrations from schema changes
- Version-controlled migration files
- Reversible migrations (up/down)
- Simple commands (`npx prisma migrate dev`)

**Workflow**:
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Commit migration files
4. Migrations auto-apply on deployment

---

## Infrastructure & Deployment

### Hosting

**Choice**: Hetzner VPS (self-hosted)
**Pricing**: ~€20-30/mo (~$22-33/mo)
**Rationale**:
- Cost-effective vs managed services (Vercel $20+/mo at scale)
- Full control over infrastructure (learning opportunity)
- Demonstrates DevOps skills (portfolio value)
- Can run multiple services on same VPS (Supabase, Next.js)
- Predictable pricing (no usage-based surprises)

**VPS Specs** (recommended):
- CPU: 2-4 vCPUs
- RAM: 4-8GB
- Storage: 80-160GB SSD
- Network: Unlimited traffic (Hetzner standard)

**Alternatives Rejected**:
- Vercel: More expensive at scale, less control, less learning
- AWS ECS/EC2: Too complex, higher cost
- DigitalOcean: Good alternative, but Hetzner slightly cheaper in EU
- Netlify: Similar to Vercel, same issues

### Containerization

**Choice**: Docker + Docker Compose
**Version**: Latest stable
**Rationale**:
- Consistent environments (dev/staging/production)
- Easy deployment (docker-compose up)
- Isolates Next.js app and Supabase
- Simple rollback (previous image tags)
- Industry standard (transferable skills)

**Multi-stage Dockerfile**:
- Base stage: Dependencies
- Development stage: Hot reload
- Builder stage: Production build
- Production stage: Minimal image (node:20-alpine, non-root user)

**Alternatives Rejected**:
- No Docker: Harder to manage dependencies, inconsistent environments
- Kubernetes: Massive overkill for single VPS
- Podman: Less widespread, Docker more standard

### Web Server

**Choice**: Nginx (reverse proxy)
**Version**: Latest stable
**Rationale**:
- Industry-standard reverse proxy
- Handles SSL/TLS termination (Let's Encrypt)
- Static file serving (if needed)
- Load balancing (if multi-container later)
- Excellent performance

**Alternatives Rejected**:
- Caddy: Easier SSL but less widespread, prefer industry standard
- Apache: Older, heavier, nginx more performant
- Traefik: Overkill for single VPS

### CI/CD

**Choice**: GitHub Actions
**Version**: Latest
**Rationale**:
- Integrated with GitHub repo
- Free for public repos, generous limits for private
- Simple YAML configuration
- Can build Docker images and deploy to VPS
- Supports manual approval gates

**Pipeline Stages**:
1. Lint + Type check (on PR)
2. Build Docker image (on push to main)
3. Deploy to VPS (SSH + docker-compose)

**Alternatives Rejected**:
- GitLab CI: No GitLab repo, GitHub Actions sufficient
- CircleCI: More complex, GitHub Actions simpler
- Manual deployment: Error-prone, no rollback history

---

## Developer Tools

### Package Manager

**Choice**: npm
**Version**: Built into Node.js 20
**Rationale**:
- Comes with Node.js (no extra installation)
- Lock file (`package-lock.json`) ensures consistent installs
- Sufficient performance for project size
- Industry standard (most developers know npm)

**Alternatives Considered**:
- pnpm: Faster, more efficient disk usage (good choice if project grows)
- yarn: Similar to npm, no strong reason to switch
- bun: Too new, ecosystem compatibility concerns

### Code Quality

**Linting**: ESLint with Next.js config
**Version**: 9.38.0
**Rationale**:
- Next.js config includes best practices
- Catches common bugs (unused vars, missing deps)
- Enforces consistent code style

**Type Checking**: TypeScript compiler (tsc)
**Version**: 5.9.3
**Rationale**:
- Built-in type checking
- Strict mode enabled (catch more bugs)
- Integrates with VS Code

**Formatting**: [NEEDS CLARIFICATION: Prettier configured?]

### Testing

**Status**: [NEEDS CLARIFICATION: Testing strategy?]

**Recommended Stack** (if tests added):
- Unit: Vitest (faster than Jest)
- Component: React Testing Library
- E2E: Playwright (if complex interactions added)

---

## Third-Party Services

### Newsletter

**Choice**: Resend or Mailgun
**Pricing**: Resend free <3K emails/mo, Mailgun similar
**Rationale**:
- Resend: Modern API, React Email templates, good DX
- Mailgun: Battle-tested, reliable deliverability
- Both cheaper than alternatives
- Simple API integration

**Alternatives Rejected**:
- SendGrid: More complex API, worse DX
- AWS SES: Complex setup, overkill
- Mailchimp: More marketing-focused, expensive

### Analytics

**Choice**: Google Analytics 4
**Pricing**: Free
**Rationale**:
- Industry standard, free
- Core Web Vitals tracking built-in
- Good enough for MVP (can add PostHog later for privacy-focused alternative)
- No setup complexity

**Alternatives Rejected**:
- PostHog: Great but costs $ after 1M events, defer until traffic grows
- Plausible: Privacy-focused but costs $9/mo minimum
- Self-hosted Matomo: Too much maintenance overhead

### Domain & DNS

**Choice**: [NEEDS CLARIFICATION: Domain registrar? Cloudflare DNS?]
**Pricing**: ~$10-15/year domain

---

## Content Stack

### Markdown Processing

**Choice**: MDX
**Version**: 3.1.1 (`@next/mdx`, `@mdx-js/react`, `next-mdx-remote`)
**Rationale**:
- Markdown with React components (interactive content)
- gray-matter for frontmatter parsing (title, date, tags)
- remark-gfm for GitHub-flavored markdown (tables, strikethrough)
- rehype-highlight for syntax highlighting

**Processing Pipeline**:
1. Read `.mdx` files from `content/posts/`
2. Parse frontmatter with gray-matter
3. Calculate reading time with `reading-time` library
4. Render MDX with custom components
5. Syntax highlight code blocks with rehype-highlight

### Syntax Highlighting

**Choice**: rehype-highlight
**Version**: 7.0.2
**Rationale**:
- Works with rehype (MDX processing pipeline)
- Automatic language detection
- Multiple theme options
- Server-side highlighting (no client JS needed)

**Alternatives Rejected**:
- Prism.js: Client-side, larger bundle
- Shiki: Heavier, more complex setup

### Theme Support

**Choice**: next-themes
**Version**: 0.4.6
**Rationale**:
- Seamless dark mode integration
- No flash of unstyled content (FOUC)
- Persists user preference
- System preference detection
- Works with Tailwind dark: variant

---

## Constraints & Trade-offs

### Performance

**Target**: Lighthouse score ≥ 85, FCP < 1.5s
**Trade-off**: Self-hosted VPS may have slightly higher latency than Vercel Edge (acceptable for blog use case)

### Cost

**Budget**: <$50/mo total infrastructure
**Trade-off**: Self-hosting requires more maintenance time vs managed services (acceptable for learning goals)

**Current Costs**:
- Hetzner VPS: €20-30/mo (~$22-33/mo)
- Domain: ~$10-15/year (~$1/mo)
- Newsletter: $0 (free tier)
- Analytics: $0 (GA4 free)
- **Total**: ~$25-35/mo

### Scalability

**Current Capacity**: 10,000-50,000 monthly visitors (estimated)
**Next Tier**: Add Cloudflare CDN (free) if traffic > 50K/month

---

## Dependency Management

### Frontend

**Lock File**: `package-lock.json` (committed to Git)
**Update Strategy**:
- Security updates: Immediately (Dependabot alerts)
- Minor updates: Monthly review
- Major updates: Quarterly (test thoroughly)

**Security**: `npm audit` in CI, Dependabot alerts enabled

---

## Technology Upgrade Path

**When to Upgrade**:
- Security vulnerabilities: Immediately
- Next.js major versions: Within 3-6 months of stable release
- React major versions: When Next.js supports it
- Node.js LTS: Upgrade when new LTS released

**How to Upgrade**:
1. Test in local development
2. Review breaking changes in changelog
3. Update dependencies incrementally (not all at once)
4. Run build and manual testing
5. Deploy to staging (when implemented)
6. Monitor for issues

---

## Decision Log

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2025-10-26 | Next.js 15 + App Router | Modern architecture, React Server Components, SEO-first | Latest Next.js features, better performance |
| 2025-10-26 | Tailwind CSS 4 | Fast styling, small bundle, industry standard | Rapid UI development |
| 2025-10-26 | Self-hosted on Hetzner VPS | Cost-effective, learning opportunity, portfolio value | More DevOps work, but demonstrates full-stack skills |
| 2025-10-26 | Prisma + PostgreSQL | Type-safe DB access, excellent DX, self-hosted control | Modern ORM, good foundation for growth |
| 2025-10-26 | MDX for content | Markdown with React components, version-controlled | Flexible content, no CMS complexity |
