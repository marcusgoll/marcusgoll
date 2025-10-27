# Feature: Dokploy Deployment Platform Integration

## Overview

Integrate Dokploy (self-hosted deployment platform) on Hetzner VPS to provide Vercel-like developer experience while maintaining self-hosted control and cost efficiency.

**Feature Type**: Infrastructure Enhancement
**Deployment Model**: direct-prod (current), enables future staging-prod
**Scope**: DevOps improvement, no end-user visible changes

## Research Findings

### Constitution Alignment
- ✅ **Aligned with Project Values**: Self-hosted infrastructure, full control, no vendor lock-in
- ✅ **Supports Growth**: Enables staging environment when traffic > 10K/mo
- ✅ **DevOps Learning**: Demonstrates full-stack skills, portfolio value
- ✅ **Cost-Effective**: No SaaS costs beyond existing VPS ($0 additional cost)

**Source**: `.spec-flow/memory/constitution.md` - Deployment Model (staging-prod), Version Management

### Current Deployment Stack
**From**: `docs/project/deployment-strategy.md`, `docs/project/tech-stack.md`

**Current State**:
- Hetzner VPS (Docker-based)
- Manual deployment via `docker-compose.prod.yml`
- GitHub Actions CI/CD (verify, build, deploy)
- Self-hosted Supabase PostgreSQL
- Nginx reverse proxy
- No staging environment
- Direct-to-production deploys

**Pain Points Confirmed**:
1. Manual Docker commands required for non-CI deploys
2. No visual dashboard for monitoring resources
3. Environment variables managed manually on VPS
4. Rollback requires manual Docker image tracking
5. Adding staging environment would require significant manual setup

### Tech Stack Context
**From**: `docs/project/tech-stack.md`

**Current Infrastructure**:
- **Platform**: Hetzner VPS (€20-30/mo, 2-4 vCPUs, 4-8GB RAM, 80-160GB SSD)
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (reverse proxy, SSL via Let's Encrypt)
- **CI/CD**: GitHub Actions
- **Application**: Next.js 15.5.6, Node 20, TypeScript 5.9.3
- **Database**: PostgreSQL 15+ (via Supabase self-hosted)
- **ORM**: Prisma 6.17.1

**Constraints**:
- Must maintain self-hosted architecture (no migration to managed services)
- Budget: <$50/mo total infrastructure (current ~$25-35/mo)
- Performance: Lighthouse ≥85, FCP <1.5s
- Solo developer: Simplicity valued over enterprise features

### Dokploy Platform Research
**From**: GitHub Issue #47, Dokploy website

**What is Dokploy**:
- Open-source, self-hosted deployment platform (alternative to Vercel/Netlify/Heroku)
- Docker-based (fits existing infrastructure)
- Web UI for application, database, and monitoring management
- Supports Docker, Nixpacks, Heroku Buildpacks, Docker Compose
- Multi-server support (enables staging when needed)
- API and CLI for automation
- Built-in monitoring (CPU, memory, network, logs)
- Database management (PostgreSQL, MySQL, MongoDB, Redis, MariaDB)
- GitHub webhook integration (push-to-deploy)

**Compatibility with Current Stack**:
- ✅ Uses Docker underneath (no rewrite needed)
- ✅ Supports Next.js (via Nixpacks or Docker)
- ✅ Manages PostgreSQL databases
- ✅ Supports environment variable management
- ✅ Provides monitoring dashboard
- ✅ GitHub integration for CI/CD
- ✅ Subdomain SSL via Let's Encrypt

**Resource Requirements**:
- Dokploy UI: ~500MB RAM, minimal CPU
- Current VPS capacity: 4-8GB RAM (sufficient headroom)
- No additional server needed (runs on existing VPS)

### Migration Strategy
**Zero-Downtime Approach** (from GitHub Issue #47):

1. **Phase 1**: Install Dokploy on VPS without disrupting current deployment
   - Dokploy runs on different port (default: 3000 for UI)
   - Current Next.js app continues on port 80/443

2. **Phase 2**: Configure Dokploy in parallel
   - Set up application in Dokploy with test subdomain
   - Import PostgreSQL database to Dokploy management
   - Test deployment pipeline

3. **Phase 3**: Validation
   - Verify Dokploy deployment matches production functionality
   - Performance testing (ensure no regression)
   - Rollback testing (verify quick recovery)

4. **Phase 4**: Cutover
   - Update Nginx config to point marcusgoll.com to Dokploy-managed app
   - Monitor for 24-48 hours
   - Decommission old Docker Compose setup

**Rollback Plan**:
- Keep old docker-compose.prod.yml for 7 days
- If Dokploy issues arise, revert Nginx config
- Dokploy is abstraction layer (can always extract Docker configs)

### Benefits Analysis

**Developer Experience**:
- ✅ Push to GitHub → auto-deploy (like Vercel)
- ✅ Visual dashboard for deployment status
- ✅ Environment variables via UI (no SSH needed)
- ✅ One-click rollback via UI
- ✅ Real-time logs and monitoring

**Operational Efficiency**:
- ✅ Time savings: ~2-3 hours/month (manual deployment tasks eliminated)
- ✅ Reduced error rate: GUI reduces manual command errors
- ✅ Faster staging setup: When needed, add via UI (vs. manual server provisioning)

**Portfolio Value**:
- ✅ Demonstrates modern DevOps practices
- ✅ Shows platform engineering skills
- ✅ Self-hosted alternative to cloud platforms

### Risks & Mitigations

**Risk 1**: Dokploy adds complexity layer
- **Mitigation**: Can fallback to manual Docker if needed; Dokploy is just abstraction
- **Evidence**: Docker configs remain accessible, not locked in

**Risk 2**: Learning curve for new tool
- **Mitigation**: Well-documented, similar to Vercel/Netlify UX
- **Evidence**: Active community, good documentation on dokploy.com

**Risk 3**: Dokploy becomes unmaintained (open-source risk)
- **Mitigation**: Can extract Docker configs and run manually; not locked in
- **Evidence**: Active development, 2K+ stars on GitHub

**Risk 4**: VPS resource overhead
- **Mitigation**: Dokploy lightweight (~500MB RAM); VPS has capacity
- **Evidence**: 4-8GB RAM VPS, currently underutilized

**Risk 5**: Configuration drift (Dokploy config vs. Dockerfile)
- **Mitigation**: Version-control Dokploy configs via API/CLI
- **Evidence**: Dokploy has CLI for exporting configuration

## Feature Classification
- UI screens: false (infrastructure, no end-user UI)
- Improvement: true (improves existing deployment workflow)
- Measurable: true (time savings, deployment frequency, error rate)
- Deployment impact: true (changes deployment platform, environment management)

## Project Documentation Findings

**Deployment Strategy** (from `docs/project/deployment-strategy.md`):
- Current model: direct-prod (solo developer, low traffic)
- Planned evolution: staging-prod when traffic > 10K/mo or team grows
- **Dokploy Enables**: Easy staging setup (multi-server support in UI)
- **Alignment**: Supports planned evolution path

**System Architecture** (inferred from tech-stack.md):
- Components: Next.js app, Supabase PostgreSQL, Nginx
- Integration points: Dokploy will manage all three components
- **Dokploy Role**: Orchestration layer above Docker, below Nginx

**Tech Stack Validation** (from `docs/project/tech-stack.md`):
- ✅ Next.js 15 supported (via Nixpacks or Dockerfile)
- ✅ PostgreSQL 15+ supported (built-in database management)
- ✅ Docker Compose supported (can import existing compose files)
- ✅ Node 20 supported (standard in Dokploy)

## Checkpoints
- Phase 0 (Specification): 2025-10-26

## Last Updated
2025-10-26T22:45:00Z
