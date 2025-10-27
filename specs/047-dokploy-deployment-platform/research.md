# Research & Discovery: dokploy-deployment-platform

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal website showcasing Marcus Gollahon's multi-passionate expertise in aviation, education, and development
- **Target Users**: Pilots seeking career advancement, developers learning systematic thinking, startup founders
- **Success Metrics**: SEO rankings, newsletter growth, engagement metrics via GA4
- **Scope Boundaries**: Content-focused blog with newsletter, self-hosted infrastructure, no e-commerce

### System Architecture (from system-architecture.md)
- **Components**: Next.js App Router, PostgreSQL (Supabase), Nginx reverse proxy, Docker containers
- **Integration Points**: Dokploy will orchestrate all existing containers plus add monitoring layer
- **Data Flows**: User requests → Nginx → Docker containers → PostgreSQL
- **Constraints**: Single VPS architecture, must maintain <$50/mo total cost

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0, TypeScript 5.9.3
- **Backend**: Node.js 20, Next.js API routes
- **Database**: PostgreSQL 15+ via Supabase (self-hosted)
- **Deployment**: Hetzner VPS + Docker + Docker Compose, manual deployment via `deploy.sh`

### Data Architecture (from data-architecture.md)
- **Existing Entities**: Posts (blog content), Subscribers (newsletter), Analytics (GA4 integration)
- **Relationships**: No complex joins, mostly read-heavy workload
- **Naming Conventions**: snake_case for database, camelCase for TypeScript
- **Migration Strategy**: Prisma migrations, auto-apply on deployment

### API Strategy (from api-strategy.md)
- **API Style**: REST via Next.js App Router route handlers
- **Auth**: Public site (no auth yet), future: Clerk or NextAuth
- **Versioning**: No versioning (internal APIs only)
- **Error Format**: JSON responses with error messages
- **Rate Limiting**: None (future consideration)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: micro tier (<1K visitors/mo, <100 posts, <500 subscribers)
- **Performance Targets**: Lighthouse ≥85, FCP <1.5s, API <500ms p95
- **Resource Limits**: 4-8GB RAM VPS, 2-4 vCPUs, 80-160GB SSD
- **Cost Constraints**: €20-30/mo VPS budget

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (current), staging-prod when traffic >10K/mo
- **Platform**: Hetzner VPS (€178.156.129.179), Docker + Docker Compose
- **CI/CD Pipeline**: GitHub Actions verify + manual `deploy.sh` on VPS
- **Environments**: Development (local), Production (VPS), no staging yet

### Development Workflow (from development-workflow.md)
- **Git Workflow**: Feature branches → main (GitHub Flow)
- **Testing Strategy**: Manual testing (no automated tests yet)
- **Code Style**: ESLint + Prettier, TypeScript strict mode
- **Definition of Done**: Builds pass, Lighthouse ≥85, manual QA complete

---

## Research Decisions

### Decision 1: Dokploy as deployment platform

- **Decision**: Integrate Dokploy to replace manual Docker deployment workflow
- **Rationale**: Provides Vercel-like developer experience while maintaining self-hosted control
- **Alternatives**:
  - **Coolify**: Similar to Dokploy but less active community
  - **CapRover**: More mature but less modern UI
  - **Vercel/Netlify**: Excellent UX but expensive ($20+/mo), vendor lock-in
  - **Railway**: Growing platform but vendor lock-in, no self-hosted option
- **Source**: Dokploy GitHub (2K+ stars), spec.md Appendix A comparison

### Decision 2: Zero-downtime migration strategy

- **Decision**: Install Dokploy in parallel, validate, then cutover Nginx
- **Rationale**: Minimizes risk by keeping current deployment running during setup
- **Alternatives**:
  - **Direct migration**: Higher risk, requires downtime window
  - **Blue-green deployment**: Overkill for single-server setup
- **Source**: spec.md Migration Strategy (lines 88-112), NOTES.md

### Decision 3: Reuse existing Docker configurations

- **Decision**: Import docker-compose.prod.yml into Dokploy rather than rebuild from scratch
- **Rationale**: Proven configuration (already working in production), faster migration
- **Alternatives**:
  - **Rebuild with Dokploy's Nixpacks**: Requires testing new build process
  - **Use Dokploy's Docker Compose import**: Reuse existing, proven configuration
- **Source**: docker-compose.prod.yml (lines 1-78), Dokploy Docker Compose support

### Decision 4: Keep environment variables in Dokploy UI

- **Decision**: Migrate .env.production from VPS to Dokploy's environment variable management
- **Rationale**: Centralized management, no SSH needed, audit trail
- **Alternatives**:
  - **Keep in .env files**: Manual SSH required, no UI, error-prone
  - **Use Docker secrets**: More complex, overkill for single-server
- **Source**: spec.md FR-008, deployment-strategy.md Secrets Management

### Decision 5: Use Dokploy's built-in PostgreSQL management

- **Decision**: Import existing Supabase PostgreSQL into Dokploy database management
- **Rationale**: Centralized backup management, monitoring, connection string UI
- **Alternatives**:
  - **Keep external Supabase**: More complex, manual backup management
  - **Self-hosted PostgreSQL outside Dokploy**: No monitoring, manual backups
- **Source**: spec.md US4, Dokploy database management features

### Decision 6: Enable GitHub webhook for push-to-deploy

- **Decision**: Configure GitHub webhook to trigger Dokploy deployments on push to main
- **Rationale**: Matches Vercel-like experience, eliminates manual SSH deployment
- **Alternatives**:
  - **Keep manual deploy.sh**: No automation, manual errors
  - **GitHub Actions → SSH**: Current pattern, but more complex than webhook
- **Source**: spec.md FR-015, GitHub Actions deploy-production.yml

### Decision 7: Subdomain for Dokploy UI (deploy.marcusgoll.com)

- **Decision**: Use subdomain with Let's Encrypt SSL for Dokploy admin interface
- **Rationale**: Secure access, no IP addresses in URLs, professional setup
- **Alternatives**:
  - **Port-based access**: http://VPS_IP:3000 less secure, unprofessional
  - **VPN-only access**: Too complex for solo developer
- **Source**: spec.md FR-002, Nginx subdomain configuration pattern

### Decision 8: 7-day rollback window with docker-compose backup

- **Decision**: Keep old docker-compose.prod.yml for 7 days, VPS snapshot before migration
- **Rationale**: Fast rollback if Dokploy issues arise, minimal storage cost
- **Alternatives**:
  - **No backup**: High risk if Dokploy fails
  - **Permanent backup**: Unnecessary storage overhead
- **Source**: spec.md Migration Requirements (lines 403-420), Appendix C Rollback Runbook

---

## Components to Reuse (8 found)

- **Dockerfile** (lines 1-89): Multi-stage build (base → builder → production), Node 20 Alpine, already optimized
- **docker-compose.prod.yml** (lines 1-78): Production Docker Compose config, health checks, resource limits, logging
- **deploy.sh** (lines 1-68): Deployment script pattern (git pull, npm install, build, PM2 restart) - logic will move to Dokploy
- **.github/workflows/deploy-production.yml** (lines 1-55): CI/CD pipeline structure - adapt for Dokploy webhook
- **Nginx reverse proxy**: Existing Nginx setup (inferred from deployment-strategy.md) - add Dokploy subdomain rule
- **Let's Encrypt SSL**: Existing SSL setup (from deployment-strategy.md) - reuse for deploy.marcusgoll.com
- **Health check endpoint**: `/api/health` (from docker-compose.prod.yml line 38) - reuse for Dokploy monitoring
- **Environment variable schema**: DATABASE_URL, NEXT_PUBLIC_*, RESEND_API_KEY (from deploy-production.yml lines 32-37) - migrate to Dokploy UI

---

## New Components Needed (6 required)

- **Dokploy installation script**: Official Dokploy installer, run on VPS to bootstrap platform
- **Dokploy application configuration**: Import Next.js app, connect GitHub repo, configure build settings
- **Dokploy database import**: Import existing PostgreSQL connection string, configure backup schedule
- **Nginx subdomain configuration**: Add deploy.marcusgoll.com proxy rule to existing Nginx config
- **GitHub webhook**: Configure repository webhook to send push events to Dokploy
- **Dokploy CLI configuration export**: Export Dokploy config as version-controlled YAML for disaster recovery

---

## Unknowns & Questions

None - all technical questions resolved during specification phase. Migration strategy is well-defined with clear rollback procedures.

