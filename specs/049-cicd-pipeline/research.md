# Research & Discovery: cicd-pipeline

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal website/blog for aviation, education, dev projects, and startups
- **Target Users**: Marcus (solo developer), future visitors/readers
- **Success Metrics**: Site uptime, deployment velocity, developer productivity
- **Scope Boundaries**: CI/CD automation, no staging environment initially (direct-prod model)

### System Architecture (from system-architecture.md)
- **Components**: Next.js application, PostgreSQL (Supabase), Caddy reverse proxy
- **Integration Points**: GitHub Actions, GitHub Container Registry (GHCR), Hetzner VPS via SSH
- **Data Flows**: Code push → GitHub → Build → GHCR → VPS deployment
- **Constraints**: Single VPS deployment, Docker-based containerization

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), TypeScript 5.9.3
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 15+ via Supabase
- **Deployment**: Hetzner VPS + Docker + Caddy
- **CI/CD**: GitHub Actions (already partially implemented)

### Data Architecture (from data-architecture.md)
- **Existing Entities**: Minimal (User model placeholder)
- **Relationships**: No CI/CD-specific database entities
- **Naming Conventions**: snake_case for PostgreSQL, camelCase for TypeScript
- **Migration Strategy**: Prisma Migrate (automated via `npx prisma migrate deploy`)

### API Strategy (from api-strategy.md)
- **API Style**: REST (Next.js API Routes)
- **Auth**: Not applicable (CI/CD infrastructure feature)
- **Versioning**: /api/ routes (no versioning needed for health checks)
- **Error Format**: JSON responses
- **Rate Limiting**: Not applicable for internal health checks

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: Micro tier (<1K visitors/mo)
- **Performance Targets**: Build time <10 minutes, deployment time <5 minutes
- **Resource Limits**: VPS 4-8GB RAM, 2-4 vCPUs, 80-160GB storage
- **Cost Constraints**: VPS €20-30/mo, GitHub Actions free tier

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (main → production VPS)
- **Platform**: Hetzner VPS with Docker Compose
- **CI/CD Pipeline**: GitHub Actions (partially implemented)
- **Environments**: Development (local), Production (VPS)
- **Current State**: Manual Dokploy deployment (to be replaced)

### Development Workflow (from development-workflow.md)
- **Git Workflow**: GitHub Flow (feature branches → PR → main)
- **Testing Strategy**: Lint, type-check, build validation (no unit tests yet)
- **Code Style**: ESLint with Next.js config, TypeScript strict mode
- **Definition of Done**: Build passes, manual testing, PR review

---

## Research Decisions

### Decision 1: Extend Existing Workflow vs Create New
- **Decision**: Extend `.github/workflows/deploy-production.yml` (currently `build-and-test.yml`)
- **Rationale**: Basic PR validation exists (lint, build), just needs deployment automation added
- **Alternatives**: Creating separate `deploy-production.yml` would duplicate build logic
- **Source**: Existing `.github/workflows/deploy-production.yml` (rename from build-and-test.yml)
- **Impact**: Faster implementation, maintains existing PR checks

### Decision 2: Docker Registry Choice
- **Decision**: GitHub Container Registry (GHCR) at `ghcr.io/marcusgoll/marcusgoll`
- **Rationale**: Free for public repos, native GitHub integration, automatic `GITHUB_TOKEN` auth
- **Alternatives**: Docker Hub (requires separate account, manual PAT), AWS ECR (overkill, costly)
- **Source**: Tech stack document specifies GitHub-first tooling
- **Impact**: Simpler auth, tighter GitHub integration, no additional accounts needed

### Decision 3: SSH Deployment Strategy
- **Decision**: Use `appleboy/ssh-action@v1.0.0` for VPS deployment
- **Rationale**: Direct control, works with existing Docker Compose setup, proven action
- **Alternatives**: Dokploy webhooks (current, lacks GitHub Actions integration), rsync (more complex)
- **Source**: VPS accessible via `ssh hetzner` (per CLAUDE.md), Docker Compose already configured
- **Impact**: Full CI/CD control, easier debugging, eliminates Dokploy dependency

### Decision 4: Rollback Strategy
- **Decision**: Docker image tag-based rollback (redeploy previous commit SHA tag)
- **Rationale**: Fast (<2 min), reliable, leverages existing Docker Compose setup
- **Alternatives**: Git revert + full rebuild (slower, 10+ minutes), blue-green deployment (overkill for single VPS)
- **Source**: Deployment strategy document specifies <5 minute rollback target
- **Impact**: Sub-2-minute rollback, no rebuild needed, maintains deployment history via image tags

### Decision 5: Notification Strategy
- **Decision**: Slack OR Discord webhook (user configurable via GitHub Secrets)
- **Rationale**: Real-time notifications, mobile-friendly, simple webhook integration
- **Alternatives**: Email (slower, less actionable), GitHub status checks only (no push notifications)
- **Source**: Constitution emphasizes systematic clarity and observability
- **Impact**: Immediate deployment awareness, optional (graceful degradation if not configured)

### Decision 6: Build Caching Strategy
- **Decision**: Two-tier caching (npm via `actions/cache`, Docker layers via buildx cache)
- **Rationale**: Reduces build time by 50%+ (per spec requirements), industry best practice
- **Alternatives**: No caching (slower, wasteful), Docker-only caching (misses npm install speedup)
- **Source**: NFR-001 specifies <10 minute total pipeline duration
- **Impact**: First build ~8-10 min (cold cache), subsequent builds ~4-5 min (warm cache)

### Decision 7: Health Check Strategy
- **Decision**: HTTP health check via `curl https://test.marcusgoll.com` with 3 retries
- **Rationale**: Simple, reliable, validates full stack (Caddy → Next.js)
- **Alternatives**: Docker healthcheck only (doesn't validate external access), no health check (unsafe)
- **Source**: Existing docker-compose.prod.yml has healthcheck at `/api/health`
- **Impact**: Catches deployment failures before marking success, enables automatic rollback

---

## Components to Reuse (8 found)

- `.github/workflows/deploy-production.yml` (currently build-and-test.yml): Lint, type-check, build validation
- `Dockerfile`: Multi-stage Docker build (base → builder → production)
- `docker-compose.prod.yml`: Production orchestration (Next.js + Caddy)
- `infrastructure/Caddyfile`: Reverse proxy with automatic SSL
- VPS SSH access: `ssh hetzner` (configured, per CLAUDE.md)
- GitHub Secrets infrastructure: Repository secrets management
- Docker healthcheck: `/api/health` endpoint (already exists)
- Prisma Migrate: Database migration automation (`npx prisma migrate deploy`)

---

## New Components Needed (7 required)

### GitHub Actions Workflow
- **Component**: Docker build and push job in `deploy-production.yml`
- **Purpose**: Build Docker image, tag with commit SHA + latest, push to GHCR
- **Technology**: `docker/setup-buildx-action@v3`, `docker/build-push-action@v5`

### SSH Deployment Job
- **Component**: VPS deployment step in `deploy-production.yml`
- **Purpose**: SSH to VPS, pull Docker image, restart containers, verify health
- **Technology**: `appleboy/ssh-action@v1.0.0`

### GitHub Secrets Configuration
- **Component**: VPS SSH credentials in GitHub repository secrets
- **Purpose**: Secure SSH authentication from GitHub Actions to VPS
- **Required Secrets**: `VPS_SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_DEPLOY_PATH`

### Rollback Logic
- **Component**: Conditional rollback step in workflow
- **Purpose**: Capture previous image tag, rollback if health check fails
- **Technology**: Bash script in workflow, Docker image tag parsing

### Notification Integration
- **Component**: Slack/Discord webhook steps (success and failure)
- **Purpose**: Real-time deployment notifications
- **Technology**: `curl` with webhook payloads, optional (non-blocking)

### Deployment Tracking
- **Component**: `specs/049-cicd-pipeline/deployment-log.md`
- **Purpose**: Historical record of deployments (commit SHA, timestamp, status)
- **Technology**: Append-only markdown log, updated by workflow

### Cache Configuration
- **Component**: Cache keys and restore logic in workflow
- **Purpose**: Speed up builds via npm and Docker layer caching
- **Technology**: `actions/cache@v3`, Docker buildx cache (`type=gha`)

---

## Unknowns & Questions

None - all technical questions resolved via existing project documentation.

**Validation**:
- VPS SSH access verified via `ssh hetzner` (CLAUDE.md)
- Docker Compose setup validated via `docker-compose.prod.yml` review
- GHCR authentication via automatic `GITHUB_TOKEN` (no manual PAT needed)
- Health check endpoint `/api/health` exists (docker-compose.prod.yml line 40)
- Deployment model confirmed as direct-prod (deployment-strategy.md line 4)
