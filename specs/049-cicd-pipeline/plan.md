# Implementation Plan: CI/CD Pipeline (GitHub Actions)

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: GitHub Actions + Docker + GHCR + SSH deployment
- Components to reuse: 8 (existing workflow, Dockerfile, docker-compose.prod.yml, Caddyfile, SSH access, secrets infra, healthcheck, Prisma Migrate)
- New components needed: 7 (Docker build job, SSH deployment, secrets config, rollback logic, notifications, deployment log, caching)

**Key Decisions**:
- Extend existing `.github/workflows/deploy-production.yml` rather than create new workflow
- Use GitHub Container Registry (GHCR) for free, integrated Docker image hosting
- SSH-based deployment via `appleboy/ssh-action` for direct VPS control
- Docker image tag-based rollback strategy (sub-2-minute rollback)
- Two-tier caching (npm + Docker buildx) for 50%+ build speedup

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- **CI Platform**: GitHub Actions (free for public repos, integrated with GitHub)
- **Container Registry**: GitHub Container Registry (ghcr.io) - free, automatic auth
- **Deployment Method**: SSH to Hetzner VPS via `appleboy/ssh-action@v1.0.0`
- **Docker Build**: Multi-stage Dockerfile (existing), buildx with layer caching
- **Orchestration**: Docker Compose (docker-compose.prod.yml) - existing setup
- **Reverse Proxy**: Caddy (existing, automatic SSL via Let's Encrypt)
- **Notifications**: Slack or Discord webhooks (optional, user-configurable)

**Patterns**:
- **Build Once, Deploy Anywhere**: Docker image tagged with commit SHA and `latest`, same artifact tested and deployed
- **Health-Check-First Deployment**: Verify site responds before marking deployment successful
- **Automatic Rollback**: If health check fails, redeploy previous Docker image tag
- **Fail-Fast Pipeline**: Each step must succeed before proceeding (lint → typecheck → build → push → deploy → health-check)
- **Idempotent Deployments**: Rerunning pipeline with same commit produces identical result
- **Secrets Management**: All credentials in GitHub Secrets, never committed to code

**Dependencies** (new packages required):
- None - uses existing Docker setup and GitHub Actions built-in actions
- SSH action: `appleboy/ssh-action@v1.0.0` (GitHub Action, not npm package)
- Docker actions: `docker/setup-buildx-action@v3`, `docker/login-action@v3`, `docker/build-push-action@v5`

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
.github/workflows/
├── deploy-production.yml  # Renamed from build-and-test.yml, extended with deployment
└── verify.yml             # Optional: Separate PR validation workflow (future)

specs/049-cicd-pipeline/
├── spec.md                # Feature specification (existing)
├── research.md            # Research findings (created)
├── plan.md                # This file
├── data-model.md          # N/A (infrastructure feature, no data model)
├── quickstart.md          # Integration scenarios (to be created)
├── contracts/             # N/A (no API contracts for CI/CD)
├── deployment-log.md      # Historical deployment tracking (to be created)
└── NOTES.md               # Development decisions (existing)

infrastructure/
└── Caddyfile              # Existing reverse proxy config (no changes needed)

docker-compose.prod.yml    # Existing production orchestration (no changes needed)
Dockerfile                 # Existing multi-stage build (no changes needed)
```

**Module Organization**:
- `.github/workflows/deploy-production.yml`: Single workflow file with multiple jobs (PR validation, Docker build, VPS deployment)
- Deployment logic: Embedded in workflow YAML (no separate scripts for simplicity)
- Secrets: GitHub repository secrets (VPS SSH key, optional webhook URLs)

---

## [DATA MODEL]

**N/A** - Infrastructure feature, no database entities required

**Tracking**:
- Deployment history: Append-only markdown log (`specs/049-cicd-pipeline/deployment-log.md`)
- Deployment IDs: Git commit SHAs (already tracked by Git)
- Image tags: GHCR metadata (Docker image registry)

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: Total pipeline duration <10 minutes (push to live)
- Acceptance Scenario 5: Build time reduction 50%+ with caching (vs uncached)

**Performance Breakdown**:
- Lint + Type Check: <2 minutes
- Build Next.js: <3 minutes (with npm cache), <6 minutes (cold cache)
- Docker Build: <4 minutes (with layer cache), <8 minutes (cold cache)
- Docker Push to GHCR: <1 minute (300-500MB image)
- SSH Deployment: <2 minutes (pull image, restart containers, health check)
- **Total (warm cache)**: ~8-10 minutes
- **Total (cold cache)**: ~15-18 minutes (acceptable for first build)

**Lighthouse Targets**: N/A (site performance unchanged by CI/CD automation)

---

## [SECURITY]

**Authentication Strategy**:
- **GitHub Actions → GHCR**: Automatic `GITHUB_TOKEN` (no manual PAT needed)
- **GitHub Actions → VPS**: SSH private key stored in GitHub Secrets (`VPS_SSH_PRIVATE_KEY`)
- **VPS Access**: Public key added to `~/.ssh/authorized_keys` on VPS

**Authorization Model**:
- Only `main` branch pushes trigger deployment (PR builds do NOT deploy)
- GitHub repository settings: Require PR approval before merge (branch protection)
- VPS SSH: Key-based authentication only (no password auth)

**Input Validation**:
- Commit SHA validation: Git commit hash (40 chars hex)
- Docker image tags: Sanitized commit SHA (short, 7 chars)
- Secrets validation: Pipeline fails immediately if required secrets missing

**Data Protection**:
- Secrets never logged: GitHub Actions masks secrets in logs automatically
- SSH private key: Never exposed (used only by SSH action)
- `.env.production` on VPS: File permissions 600, owned by deploy user
- Docker image: No secrets baked in (runtime env vars only)

**Supply Chain Security**:
- GitHub Actions: Pin actions to specific commit SHAs (not `@latest`)
- Docker base image: Pin to specific Node.js version (node:20-alpine)
- npm packages: Lock file committed (`package-lock.json`)
- Dependabot alerts: Enabled for security vulnerabilities

---

## [EXISTING INFRASTRUCTURE - REUSE] (8 components)

**GitHub Actions Workflow**:
- `.github/workflows/deploy-production.yml` (currently build-and-test.yml): PR validation (lint, type-check, build)
  - **Reuse**: Extend with deployment jobs, rename file
  - **Modification**: Add Docker build, SSH deployment, health check steps

**Docker Setup**:
- `Dockerfile`: Multi-stage build (base → builder → production)
  - **Reuse**: No changes needed (already optimized)
- `docker-compose.prod.yml`: Production orchestration (Next.js + Caddy)
  - **Reuse**: No changes needed (pull latest image, restart containers)

**Infrastructure**:
- `infrastructure/Caddyfile`: Caddy reverse proxy with automatic SSL
  - **Reuse**: No changes needed (already configured for test.marcusgoll.com)
- VPS SSH access: `ssh hetzner` configured (per CLAUDE.md)
  - **Reuse**: Use existing SSH alias, add CI/CD SSH key to authorized_keys

**Secrets Management**:
- GitHub Secrets infrastructure: Repository secrets already in use
  - **Reuse**: Add new secrets (VPS_SSH_PRIVATE_KEY, VPS_HOST, VPS_USER, VPS_DEPLOY_PATH)

**Health Check**:
- Docker healthcheck: `/api/health` endpoint (docker-compose.prod.yml line 40)
  - **Reuse**: Use for post-deployment validation

**Database Migrations**:
- Prisma Migrate: Automated via `npx prisma migrate deploy` (runs on container startup)
  - **Reuse**: No changes needed (migrations auto-apply on deploy)

---

## [NEW INFRASTRUCTURE - CREATE] (7 components)

**GitHub Actions Workflow Extensions**:
1. **Docker Build and Push Job**:
   - **Purpose**: Build Docker image, tag with commit SHA + latest, push to GHCR
   - **Technology**: `docker/setup-buildx-action@v3`, `docker/build-push-action@v5`
   - **Location**: `.github/workflows/deploy-production.yml` (new job: `docker-build`)
   - **Inputs**: Dockerfile, docker-compose.prod.yml, codebase
   - **Outputs**: Docker image at `ghcr.io/marcusgoll/marcusgoll:latest` and `:sha-<commit>`

2. **SSH Deployment Job**:
   - **Purpose**: SSH to VPS, pull Docker image, restart containers, verify health
   - **Technology**: `appleboy/ssh-action@v1.0.0`
   - **Location**: `.github/workflows/deploy-production.yml` (new job: `deploy-vps`)
   - **Inputs**: VPS credentials (from secrets), Docker image tag
   - **Outputs**: Deployment success/failure status

3. **Rollback Logic**:
   - **Purpose**: Capture previous Docker image tag, rollback if health check fails
   - **Technology**: Bash script in workflow (parse `docker inspect` output)
   - **Location**: `.github/workflows/deploy-production.yml` (step in `deploy-vps` job)
   - **Inputs**: Previous deployment state (from VPS)
   - **Outputs**: Rollback executed (yes/no), final deployment status

**GitHub Secrets Configuration**:
4. **VPS SSH Credentials**:
   - **Purpose**: Secure SSH authentication from GitHub Actions to VPS
   - **Required Secrets**:
     - `VPS_SSH_PRIVATE_KEY`: Private key (RSA or Ed25519, full text including headers)
     - `VPS_HOST`: VPS hostname or IP (e.g., `<hetzner-ip>` or `test.marcusgoll.com`)
     - `VPS_USER`: SSH username (e.g., `marcus` or `root`)
     - `VPS_DEPLOY_PATH`: Path to docker-compose.prod.yml (e.g., `/home/marcus/marcusgoll`)
   - **Setup**: One-time manual configuration via GitHub repository settings

**Notification Integration**:
5. **Slack/Discord Webhooks**:
   - **Purpose**: Real-time deployment notifications (success and failure)
   - **Technology**: `curl` with JSON payloads to webhook URLs
   - **Location**: `.github/workflows/deploy-production.yml` (steps in `deploy-vps` job)
   - **Optional**: Gracefully skip if `SLACK_WEBHOOK_URL` or `DISCORD_WEBHOOK_URL` not configured
   - **Format**: Markdown-formatted messages with commit info, deployment URL, duration

**Deployment Tracking**:
6. **Deployment Log**:
   - **Purpose**: Historical record of deployments (audit trail)
   - **Location**: `specs/049-cicd-pipeline/deployment-log.md`
   - **Format**: Append-only markdown table (Date, Commit SHA, Status, Duration, URL)
   - **Updated**: Automatically via workflow (append entry on deployment completion)

**Caching Configuration**:
7. **Build Cache Setup**:
   - **Purpose**: Speed up builds via npm and Docker layer caching
   - **Technology**: `actions/cache@v3` (npm), Docker buildx cache (`type=gha`)
   - **Location**: `.github/workflows/deploy-production.yml` (cache steps before build)
   - **Cache Keys**:
     - npm: `node-modules-${{ runner.os }}-${{ hashFiles('package-lock.json') }}`
     - Docker: GitHub Actions cache (automatic with buildx `cache-to=type=gha`)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**

**Platform**: GitHub Actions (free tier, 2000 minutes/month for public repos)

**Environment Variables** (update GitHub Secrets):
- **New Required**:
  - `VPS_SSH_PRIVATE_KEY`: Private SSH key for VPS access
  - `VPS_HOST`: VPS hostname or IP address
  - `VPS_USER`: SSH username (e.g., `marcus`)
  - `VPS_DEPLOY_PATH`: Deployment directory path (e.g., `/home/marcus/marcusgoll`)
- **Optional**:
  - `SLACK_WEBHOOK_URL`: Slack incoming webhook URL (for notifications)
  - `DISCORD_WEBHOOK_URL`: Discord webhook URL (alternative to Slack)
- **Existing** (no changes):
  - `PUBLIC_URL`: Site URL (https://test.marcusgoll.com)
  - `GHOST_API_URL`, `GHOST_CONTENT_API_KEY`: Ghost CMS credentials
  - `DATABASE_URL`: PostgreSQL connection string (runtime, not build-time)

**Build Commands**: No changes (existing `npm run build` works)

**Database Migrations**: Automated via Prisma Migrate (runs on container startup)
- Command: `npx prisma migrate deploy` (in Dockerfile or docker-compose.yml)
- Dry-run: Not required (migrations tested locally before commit)
- Reversible: Manual (create new migration to reverse, or restore database backup)

**Smoke Tests** (for deployment validation):
- Route: `https://test.marcusgoll.com` (homepage)
- Expected: HTTP 200, response time <3 seconds, no 50x errors
- Health Check: `https://test.marcusgoll.com/api/health` (returns `{"status":"ok"}`)
- Validation: Curl command with retries (3 attempts, 10 second intervals)

**Platform Coupling**:
- **GitHub Actions**: Tight coupling (workflow YAML specific to GitHub)
- **GHCR**: Moderate coupling (can migrate to Docker Hub if needed)
- **VPS**: Low coupling (Docker Compose portable to any VPS or cloud provider)
- **Migration Path**: If moving to Vercel/Railway, rewrite workflow but Docker setup reusable

**Breaking Changes**: None
- **Deployment Process Change**:
  - **Before**: Manual deployment via Dokploy webhook
  - **After**: Automatic deployment on push to main
  - **Rollback Plan**: If CI/CD fails, can temporarily revert to Dokploy or manual SSH deployment

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true after deployment):
- Site remains accessible at https://test.marcusgoll.com (no downtime >30 seconds)
- Existing content loads correctly (blog posts, homepage, images)
- Ghost CMS integration works (blog posts fetch successfully)
- Database connection works (PostgreSQL via Supabase)
- SSL certificate valid (Caddy auto-renews via Let's Encrypt)
- Container health check passes (Docker healthcheck at `/api/health`)

**Deployment Smoke Tests** (Given/When/Then):
```gherkin
Scenario: Successful deployment to production
  Given code is merged to main branch
  When GitHub Actions workflow completes
  Then Docker image is built and pushed to GHCR
    And VPS pulls latest Docker image
    And Containers restart via docker-compose up -d
    And Health check returns HTTP 200 at /api/health
    And Homepage loads at https://test.marcusgoll.com
    And Response time <3 seconds
    And No 50x errors in logs

Scenario: Deployment rollback on failure
  Given previous deployment was successful
  When new deployment health check fails
  Then Pipeline captures previous Docker image tag
    And Pipeline redeploys previous image tag
    And Health check passes with previous version
    And Site returns to working state
    And Rollback completes within 2 minutes

Scenario: Deployment notification sent
  Given deployment completes (success or failure)
  When notification step runs
  Then Slack or Discord webhook is called
    And Message includes commit SHA, status, deployment URL
    And Notification received within 30 seconds
```

**Rollback Plan**:
- **Automatic Rollback**: If health check fails, workflow redeploys previous Docker image tag
- **Manual Rollback**: If automatic fails, SSH to VPS and run:
  ```bash
  ssh hetzner
  cd /home/marcus/marcusgoll
  docker images ghcr.io/marcusgoll/marcusgoll  # Find previous tag
  docker-compose -f docker-compose.prod.yml pull  # Or specify tag
  docker-compose -f docker-compose.prod.yml up -d --force-recreate nextjs
  ```
- **Rollback Time**: <2 minutes (automatic), <5 minutes (manual)
- **Deployment IDs**: Tracked via Docker image tags (commit SHAs)

**Artifact Strategy** (build-once-deploy-once):
- Docker image: Built once in GitHub Actions, tagged with commit SHA
- Image pushed to GHCR: `ghcr.io/marcusgoll/marcusgoll:latest` and `:sha-<commit>`
- VPS deployment: Pulls same image from GHCR (no rebuild on VPS)
- Rollback: Use previous commit SHA tag (e.g., `:sha-abc1234`)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Initial setup: Generate SSH keys, configure GitHub Secrets, test SSH connection
- Validation workflow: Lint, type-check, build (on every PR)
- Manual testing: Merge PR, monitor GitHub Actions logs, validate deployed site

---

## [ERROR HANDLING]

**Failure Scenarios**:

1. **Build Failure** (lint, type-check, or npm build fails):
   - **Action**: Pipeline stops immediately, PR blocked from merge
   - **Notification**: GitHub PR status check shows failure
   - **Resolution**: Fix code, push update, pipeline reruns

2. **Docker Build Failure** (Dockerfile or build context issue):
   - **Action**: Pipeline stops, no image pushed to GHCR
   - **Notification**: GitHub Actions logs show Docker build error
   - **Resolution**: Fix Dockerfile or dependencies, push update

3. **SSH Connection Failure** (VPS unreachable, invalid credentials):
   - **Action**: Deployment step fails, previous deployment remains active
   - **Notification**: GitHub Actions logs show SSH connection error
   - **Resolution**: Check VPS uptime, verify SSH credentials, retry deployment

4. **Health Check Failure** (site unresponsive after deployment):
   - **Action**: Automatic rollback to previous Docker image tag
   - **Notification**: Deployment marked as failed, rollback logged
   - **Resolution**: Investigate health check failure, fix code, redeploy

5. **Rollback Failure** (unable to revert to previous version):
   - **Action**: Pipeline fails, manual intervention required
   - **Notification**: Critical failure alert (email/Slack)
   - **Resolution**: SSH to VPS, manually rollback via Docker Compose, investigate

**Error Logging**:
- GitHub Actions logs: Retained for 90 days (automatic)
- Docker logs on VPS: Captured via `docker logs marcusgoll-nextjs-prod`
- Deployment log: Append-only markdown (`specs/049-cicd-pipeline/deployment-log.md`)

---

## [TESTING STRATEGY]

**Pre-Deployment Testing** (local):
- Lint: `npm run lint` (must pass)
- Type-check: `npx tsc --noEmit` (must pass)
- Build: `npm run build` (must succeed)
- Docker build: `docker build -t test .` (must succeed)
- Docker Compose: `docker-compose -f docker-compose.prod.yml up -d` (test locally)

**CI Pipeline Testing**:
- PR validation: Every pull request triggers lint, type-check, build
- Deployment simulation: Test workflow in feature branch (dry-run mode)
- Rollback test: Intentionally deploy broken code, verify automatic rollback

**Post-Deployment Validation**:
- Health check: Automated curl to `/api/health` and homepage
- Manual validation: Visit site, check homepage, recent post, check browser console
- Monitoring: Watch Docker logs for errors (`docker logs -f marcusgoll-nextjs-prod`)

---

## [MAINTENANCE & OPERATIONS]

**Ongoing Maintenance**:
- **Weekly**: Review GitHub Actions logs for any warnings or anomalies
- **Monthly**: Verify deployment log accuracy, audit Docker images in GHCR
- **Quarterly**: Rotate SSH keys, update GitHub Actions actions to latest versions

**Monitoring**:
- Deployment success rate: Track in deployment log (target >95%)
- Build duration: Monitor GitHub Actions metrics (target <10 minutes)
- Rollback frequency: Track occurrences (target <5% of deployments)

**Documentation**:
- Update `docs/DEPLOYMENT.md` with CI/CD workflow details
- Document rollback procedure in `docs/ROLLBACK_RUNBOOK.md`
- Keep `specs/049-cicd-pipeline/deployment-log.md` up to date

---

## [RISKS & MITIGATIONS]

**Risk 1**: VPS downtime during deployment
- **Likelihood**: Low (deployments take <30 seconds)
- **Impact**: Medium (site temporarily unavailable)
- **Mitigation**: Health check validates site is back up, Caddy handles zero-downtime restarts

**Risk 2**: Docker image size too large (>500MB)
- **Likelihood**: Low (current image ~300-400MB)
- **Impact**: Medium (slower pushes/pulls, higher bandwidth costs)
- **Mitigation**: Multi-stage Dockerfile (already implemented), Alpine base image

**Risk 3**: GitHub Actions rate limits or outages
- **Likelihood**: Very low (GitHub 99.9% uptime)
- **Impact**: High (deployments blocked)
- **Mitigation**: Fallback to manual SSH deployment, monitor GitHub status page

**Risk 4**: SSH key compromise
- **Likelihood**: Low (key stored in GitHub Secrets, encrypted)
- **Impact**: Critical (unauthorized VPS access)
- **Mitigation**: Key rotation every 90 days, VPS firewall allows only GitHub Actions IPs (optional)

**Risk 5**: Failed rollback (previous version also broken)
- **Likelihood**: Very low (rollback tested in validation)
- **Impact**: Critical (site remains down)
- **Mitigation**: Keep multiple previous image tags (5+), manual rollback procedure documented
