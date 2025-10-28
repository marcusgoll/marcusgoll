# Feature Specification: CI/CD Pipeline (GitHub Actions)

**Branch**: `feature/049-cicd-pipeline`
**Created**: 2025-10-28
**Status**: Draft
**GitHub Issue**: #29

## User Scenarios

### Primary User Story
As a developer, when I push code to the main branch, I want an automated pipeline to build, test, containerize, and deploy my Next.js application to the VPS, so that deployments are consistent, fast, and error-free.

### Acceptance Scenarios

1. **Given** a feature branch with passing tests, **When** I create a pull request, **Then** the CI pipeline runs linting, type checking, and builds the application without deployment
2. **Given** a merged PR to main branch, **When** the commit is pushed, **Then** the pipeline builds a Docker image, pushes it to GHCR, SSHs to VPS, pulls the image, and restarts containers
3. **Given** a deployment completes successfully, **When** I check the deployment logs, **Then** I see a success notification and the site is live with the new changes
4. **Given** a deployment fails at any stage, **When** I check GitHub Actions, **Then** I see clear error messages and the previous deployment remains active (rollback capability)
5. **Given** the pipeline is running, **When** I check pipeline execution time, **Then** the total time from push to deployment is under 10 minutes
6. **Given** repeated deployments, **When** I compare build times, **Then** dependency caching reduces build time by at least 50% compared to uncached builds

### Edge Cases
- What happens when VPS is unreachable during deployment? (Pipeline fails, deployment tagged as failed, manual retry required)
- What happens when Docker image build fails? (Pipeline stops, no deployment attempted, clear error in logs)
- What happens when health check fails after deployment? (Automatic rollback to previous Docker image tag)
- What happens when GitHub Secrets are missing or invalid? (Pipeline fails immediately with clear error message)
- What happens during concurrent deployments? (GitHub Actions ensures sequential execution, queues subsequent runs)

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer, I want pull requests to trigger build and test validation so that I catch errors before merging
  - **Acceptance**:
    - PR creation triggers workflow run
    - Lints JavaScript/TypeScript with ESLint
    - Type checks with TypeScript compiler
    - Builds Next.js application
    - All steps must pass for PR to be mergeable
    - Workflow completes in under 5 minutes
  - **Independent test**: Create PR with intentional lint error, verify pipeline fails
  - **Effort**: S (2-4 hours)

- **US2** [P1]: As a developer, I want Docker images automatically built and pushed to GHCR on main branch push so that deployments use immutable artifacts
  - **Acceptance**:
    - Push to main triggers Docker build
    - Multi-stage Dockerfile builds production image
    - Image tagged with commit SHA and `latest`
    - Image pushed to GitHub Container Registry (ghcr.io)
    - Build uses caching for faster subsequent builds
  - **Independent test**: Push to main, verify image appears in GHCR with correct tags
  - **Effort**: M (4-8 hours)

- **US3** [P1]: As a developer, I want automated SSH deployment to VPS so that I don't need to manually deploy
  - **Acceptance**:
    - After successful Docker push, workflow SSHs to VPS
    - Pulls latest Docker image from GHCR
    - Runs `docker-compose -f docker-compose.prod.yml up -d --pull always`
    - Waits for container healthcheck to pass
    - Verifies site responds with HTTP 200
  - **Independent test**: Push to main, wait for deployment, verify new version live on test.marcusgoll.com
  - **Effort**: M (4-8 hours)
  - **Depends on**: US2

**Priority 2 (Enhancement)**

- **US4** [P2]: As a developer, I want deployment rollback capability so that I can quickly recover from failed deployments
  - **Acceptance**:
    - Pipeline stores previous Docker image tag in workflow artifact
    - If health check fails after deployment, automatically reverts to previous tag
    - Rollback completes within 2 minutes
    - Rollback success/failure logged clearly
  - **Independent test**: Deploy intentionally broken code, verify automatic rollback occurs
  - **Effort**: M (4-8 hours)
  - **Depends on**: US3

- **US5** [P2]: As a developer, I want Slack or Discord notifications on deployment success/failure so that I'm immediately aware of deployment status
  - **Acceptance**:
    - Webhook configured for Slack or Discord
    - Success notification includes: commit SHA, branch, deployment URL, duration
    - Failure notification includes: error summary, logs link, rollback status
    - Notifications sent within 30 seconds of deployment completion
  - **Independent test**: Deploy code, verify Slack/Discord notification received
  - **Effort**: S (2-4 hours)
  - **Depends on**: US3

- **US6** [P2]: As a developer, I want secrets managed via GitHub Secrets so that sensitive credentials are not committed to code
  - **Acceptance**:
    - VPS SSH private key stored in GitHub Secrets
    - Docker registry credentials stored in GitHub Secrets
    - Notification webhook URLs stored in GitHub Secrets
    - Environment variables for production stored in GitHub Secrets
    - Secrets injected at runtime during workflow execution
  - **Independent test**: Remove secrets, verify pipeline fails with clear error
  - **Effort**: S (2-4 hours)
  - **Depends on**: US3

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a developer, I want dependency caching so that builds are faster on repeated runs
  - **Acceptance**:
    - npm dependencies cached using `actions/cache`
    - Docker layers cached using Docker buildx cache
    - Cache invalidated when package-lock.json changes
    - Cached builds 50%+ faster than uncached builds
  - **Independent test**: Run pipeline twice, compare build times
  - **Effort**: S (2-4 hours)
  - **Depends on**: US2

- **US8** [P3]: As a developer, I want integration tests run in CI so that API contracts are validated before deployment
  - **Acceptance**:
    - Integration test suite added to codebase
    - Tests run after build step in pipeline
    - Tests use test database (not production)
    - Pipeline blocks merge if integration tests fail
  - **Independent test**: Add failing integration test, verify PR blocked
  - **Effort**: L (8-16 hours)
  - **Depends on**: US1

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (basic CI/CD), validate with production deployments, then add US4-US6 (rollback, notifications, secrets), finally add US7-US8 (optimization).

## Success Metrics (HEART Framework)

> CI/CD infrastructure feature - metrics focused on system reliability and developer productivity

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Developers trust deployment process | Deployment failures | Failed deployments / total deployments | <5% failure rate | Rollback time <5min |
| **Engagement** | Frequent, confident deployments | Deployment frequency | Deployments per week | 5+ per week | No Friday deploys |
| **Adoption** | All deploys go through CI/CD | Manual deployments | Manual SSH deploys / total deploys | 0% manual | 100% automated |
| **Retention** | Long-term use of automation | Pipeline usage over time | Active weeks with deployments | 4+ weeks/month | No regression to manual |
| **Task Success** | Deployments complete successfully | Successful deployments | Successful deploys / total deploys | >95% success | <10min duration |

**Performance Targets**:
- Total pipeline duration: <10 minutes (push to live)
- Build step: <3 minutes (with caching)
- Docker build: <4 minutes (with layer caching)
- Deployment: <2 minutes (SSH + container restart)
- Health check: <30 seconds (site responsive)

**Measurement Sources**:
- GitHub Actions workflow logs (`gh run list`, `gh run view`)
- Docker image timestamps (GHCR metadata)
- VPS logs (`docker logs marcusgoll-nextjs-prod`)
- Deployment tracking file (`specs/049-cicd-pipeline/deployment-log.md`)

## Screens Inventory (UI Features Only)

> **SKIP**: Backend/infrastructure feature - no user-facing UI screens

## Hypothesis

> **SKIP**: New capability (not improving existing flow) - currently using manual Dokploy deployment

## Functional Requirements

### FR-001: Pull Request Validation Pipeline
**Description**: Automated checks run on every pull request to validate code quality before merge

**Acceptance Criteria**:
- Pipeline triggered on PR creation and updates
- Runs ESLint with Next.js config (fails on errors, not warnings)
- Runs TypeScript type checking (strict mode)
- Builds Next.js production bundle (NODE_ENV=production)
- Each step logs output clearly
- Failing step stops pipeline immediately
- GitHub UI shows pass/fail status on PR

**Technical Details**:
- Workflow file: `.github/workflows/build-and-test.yml` (extend existing)
- Trigger: `pull_request` event on `main` branch
- Use `actions/checkout@v4`, `actions/setup-node@v4`
- Cache npm dependencies with `actions/cache`
- Required status check in GitHub branch protection

### FR-002: Docker Image Build and Push
**Description**: Production Docker image built and pushed to GitHub Container Registry on main branch push

**Acceptance Criteria**:
- Triggered only on push to `main` branch (not PRs)
- Uses existing multi-stage Dockerfile (base → builder → production)
- Tags image with `latest` and `sha-<commit-short-sha>`
- Pushes to `ghcr.io/marcusgoll/marcusgoll:latest` and `:sha-<commit>`
- Uses Docker buildx for layer caching
- Build includes all necessary environment variables (NEXT_PUBLIC_* baked in)
- Image size < 500MB (Alpine-based)

**Technical Details**:
- Workflow file: `.github/workflows/deploy-production.yml`
- Use `docker/setup-buildx-action@v3`
- Use `docker/login-action@v3` with GHCR credentials
- Use `docker/build-push-action@v5` with cache-from/cache-to
- Build args: NODE_ENV=production, NEXT_PUBLIC_SITE_URL from secrets

### FR-003: VPS Deployment via SSH
**Description**: Automated deployment to Hetzner VPS via SSH after successful Docker build

**Acceptance Criteria**:
- Triggered after successful Docker push
- SSH authenticates with private key from GitHub Secrets
- Connects to VPS (hetzner alias or IP address)
- Pulls latest Docker image from GHCR
- Runs `docker-compose -f docker-compose.prod.yml pull nextjs`
- Runs `docker-compose -f docker-compose.prod.yml up -d --no-deps nextjs`
- Waits for container to be healthy (healthcheck passes)
- Logs container startup output
- Deployment completes within 2 minutes (excluding build)

**Technical Details**:
- Use `appleboy/ssh-action@v1.0.0` or similar
- SSH connection: `ssh hetzner` (configured in VPS ~/.ssh/config)
- Docker Compose directory: `/home/marcus/marcusgoll` or configured path
- Health check: `docker inspect --format='{{.State.Health.Status}}' marcusgoll-nextjs-prod`
- Timeout: 120 seconds

### FR-004: Post-Deployment Health Check
**Description**: Verify site is responsive after deployment before marking success

**Acceptance Criteria**:
- After container restart, wait 15 seconds for startup
- Curl production URL: `https://test.marcusgoll.com`
- Verify HTTP 200 response
- Check response time < 3 seconds
- If health check fails, mark deployment as failed
- Log response headers and body excerpt

**Technical Details**:
- Use `curl -f -m 3 https://test.marcusgoll.com`
- Retry 3 times with 10 second intervals if initial fail
- Check for specific response content (e.g., `<title>` tag present)

### FR-005: Secrets Management
**Description**: Sensitive credentials stored securely in GitHub Secrets, not in code

**Acceptance Criteria**:
- VPS SSH private key stored as `VPS_SSH_PRIVATE_KEY`
- VPS hostname/IP stored as `VPS_HOST`
- VPS username stored as `VPS_USER`
- GHCR credentials use `GITHUB_TOKEN` (automatic)
- Production environment variables stored as secrets (DATABASE_URL, etc.)
- Secrets never logged in workflow output
- Missing secrets cause immediate, clear failure

**Technical Details**:
- Access via `${{ secrets.SECRET_NAME }}`
- SSH key format: Private key including headers (-----BEGIN OPENSSH PRIVATE KEY-----)
- Use GitHub's automatic `GITHUB_TOKEN` for GHCR auth (no manual PAT needed)

### FR-006: Deployment Rollback Capability
**Description**: Automatic rollback to previous deployment if health check fails

**Acceptance Criteria**:
- Before deployment, capture current Docker image tag
- Store previous tag in workflow environment variable
- If health check fails, run `docker-compose up -d nextjs` with previous tag
- Verify rollback health check passes
- Log rollback action clearly
- Rollback completes within 2 minutes

**Technical Details**:
- Capture tag: `docker inspect marcusgoll-nextjs-prod --format='{{.Image}}'`
- Store in `PREVIOUS_IMAGE` variable
- Rollback: `docker tag $PREVIOUS_IMAGE ghcr.io/marcusgoll/marcusgoll:rollback && docker-compose up -d`

### FR-007: Deployment Notifications
**Description**: Slack or Discord webhook notifies on deployment success or failure

**Acceptance Criteria**:
- Notification sent on deployment completion (success or failure)
- Success message includes: commit SHA, commit message, deployment URL, duration
- Failure message includes: error summary, GitHub Actions run URL, rollback status
- Notifications sent within 30 seconds of completion
- Webhook URL stored in GitHub Secrets

**Technical Details**:
- Use Slack Incoming Webhook or Discord webhook
- Webhook URL secret: `SLACK_WEBHOOK_URL` or `DISCORD_WEBHOOK_URL`
- Use `curl` or `slackapi/slack-github-action@v1` for Slack
- Include markdown formatting for readability

### FR-008: Build Optimization (Caching)
**Description**: Dependency and Docker layer caching to reduce build times

**Acceptance Criteria**:
- npm dependencies cached based on `package-lock.json` hash
- Cache restored before `npm ci`
- Docker buildx cache configured for layer reuse
- First build (cold cache) establishes baseline
- Subsequent builds (warm cache) 50%+ faster than cold cache
- Cache automatically invalidated when dependencies change

**Technical Details**:
- Use `actions/cache@v3` with key: `node-modules-${{ hashFiles('package-lock.json') }}`
- Use Docker buildx with `cache-from=type=gha` and `cache-to=type=gha,mode=max`
- Log cache hit/miss for debugging

## Non-Functional Requirements

### NFR-001: Performance
**Target**: Total pipeline execution time under 10 minutes from push to live site

**Justification**: Fast feedback loop improves developer productivity and enables multiple daily deployments

**Measurement**: GitHub Actions workflow duration from trigger to completion

### NFR-002: Reliability
**Target**: 95%+ deployment success rate (excluding intentional rollbacks)

**Justification**: High reliability builds trust in automation and reduces manual intervention

**Measurement**: Successful deployments / total deployment attempts (tracked in deployment log)

### NFR-003: Security
**Target**: No secrets committed to Git, all credentials stored in GitHub Secrets

**Justification**: Prevents credential leaks and unauthorized access to infrastructure

**Measurement**: Manual audit of Git history and GitHub Secrets configuration

### NFR-004: Observability
**Target**: All deployment steps logged clearly with timestamps and status

**Justification**: Easy debugging of failures and audit trail of deployments

**Measurement**: GitHub Actions workflow logs contain all necessary diagnostic information

### NFR-005: Idempotency
**Target**: Rerunning pipeline with same commit produces identical result

**Justification**: Predictable deployments and safe retries

**Measurement**: Deploy same commit twice, verify identical Docker image and behavior

## Out of Scope

### Explicitly Excluded
- **Staging environment setup**: Current deployment model is direct-prod (no staging)
- **Multi-environment deployments**: Only production deployment automated (staging deferred to future)
- **Database migration automation**: Migrations run manually via `npx prisma migrate deploy` (separate concern)
- **E2E test automation**: Integration/E2E tests not in MVP (US8 is P3)
- **Blue-green deployments**: Single VPS deployment, no traffic splitting
- **Canary deployments**: Not applicable to single-server setup
- **Performance testing in CI**: Lighthouse CI deferred to separate feature
- **Monitoring/alerting setup**: Deployment notifications only, no ongoing monitoring
- **Multi-region deployments**: Single VPS in Europe
- **Automated changelog generation**: Git commit messages sufficient for now

### Future Enhancements
- Staging environment when traffic > 10K/mo (per deployment-strategy.md)
- Integration test suite (US8)
- Lighthouse CI performance checks
- Automated database migration rollback
- Deployment approval gates (manual confirmation before prod)

## Dependencies

### Internal Dependencies
- **tech-stack-foundation-core** (this repo): Codebase must be deployment-ready
- **docker-compose-orchestration**: Existing Docker Compose setup must work correctly
- **tech-stack-production-infra**: VPS must be accessible and Docker installed

### External Dependencies
- **GitHub Actions**: CI/CD runtime environment
- **GitHub Container Registry (GHCR)**: Docker image storage (free for public repos)
- **Hetzner VPS**: Deployment target (SSH access required)
- **Docker + Docker Compose**: Installed on VPS
- **Caddy**: Running on VPS for reverse proxy (configured in docker-compose.prod.yml)

### Blockers
- VPS SSH access must be configured (SSH key pair generated)
- GitHub Secrets must be created manually (VPS_SSH_PRIVATE_KEY, VPS_HOST, VPS_USER)
- Docker Compose file must be present on VPS at expected path
- GHCR must be enabled for repository (automatic for public repos)

## Assumptions

### Technical Assumptions
1. VPS is accessible via SSH on standard port (22) or configured port
2. Docker and Docker Compose are installed on VPS (verified: Docker 20+, Compose v2)
3. VPS has sufficient resources for Docker images (80GB disk, 4GB RAM minimum)
4. GitHub Actions runner has network access to VPS (no firewall blocking)
5. GHCR authentication works with `GITHUB_TOKEN` (no manual PAT needed)
6. Existing Dockerfile builds successfully in CI (same as local)
7. `docker-compose.prod.yml` is configured correctly for production

### Process Assumptions
1. Only one person (Marcus) deploys to production (no concurrent deployment conflicts)
2. Main branch is protected (requires PR approval before merge)
3. Developers test locally before pushing (CI is last line of defense, not first)
4. Failed deployments are investigated immediately (no "deploy and hope")
5. Rollback is acceptable recovery method (no requirement for instant fixes)

### Risk Assumptions
1. VPS downtime during deployment is acceptable (<30 seconds)
2. Docker image size (<500MB) is acceptable for network transfer time
3. Single VPS failure requires manual recovery (disaster recovery out of scope)
4. GitHub Actions service reliability is acceptable (no self-hosted runners needed)

## Deployment Considerations

### Platform Dependencies
**VPS Configuration**:
- Docker Engine 20+ installed
- Docker Compose v2 installed
- Caddy reverse proxy running (from docker-compose.prod.yml)
- SSH server accessible on port 22 (or configured port)
- Firewall allows HTTP/HTTPS traffic (ports 80, 443)

**GitHub Configuration**:
- Repository is public or GHCR is enabled for private repos
- Actions are enabled for repository
- Branch protection rules configured on main branch

### Environment Variables
**New GitHub Secrets Required**:
- `VPS_SSH_PRIVATE_KEY`: Private key for SSH authentication (RSA or Ed25519)
- `VPS_HOST`: VPS hostname or IP (e.g., `hetzner` or `<IP-ADDRESS>`)
- `VPS_USER`: SSH username (e.g., `marcus`)
- `VPS_DEPLOY_PATH`: Path to docker-compose.prod.yml (e.g., `/home/marcus/marcusgoll`)
- `SLACK_WEBHOOK_URL` or `DISCORD_WEBHOOK_URL`: Notification webhook (optional)

**Build-time Environment Variables** (baked into Docker image):
- `NEXT_PUBLIC_SITE_URL`: Production URL (https://test.marcusgoll.com)
- `NODE_ENV`: Always "production" for builds

**Runtime Environment Variables** (passed via .env.production on VPS):
- `DATABASE_URL`: PostgreSQL connection string (Supabase)
- `GHOST_API_URL`: Ghost CMS API endpoint
- `GHOST_CONTENT_API_KEY`: Ghost Content API key
- Managed separately from CI/CD pipeline (already on VPS)

### Breaking Changes
**None**: CI/CD automation does not change existing application behavior

**Deployment Process Change**:
- **Before**: Manual deployment via Dokploy webhook or SSH
- **After**: Automatic deployment on push to main
- **Rollback**: If automation fails, can revert to manual deployment temporarily

### Migration Required
**One-time Setup Tasks**:
1. Generate SSH key pair for GitHub Actions (if not exists)
2. Add public key to VPS `~/.ssh/authorized_keys`
3. Add private key to GitHub Secrets as `VPS_SSH_PRIVATE_KEY`
4. Configure VPS hostname/IP in GitHub Secrets
5. Test SSH connection from local machine first
6. Create Slack/Discord webhook (if notifications desired)
7. Update `.github/workflows/deploy-production.yml` with deployment automation

**No Database Migration**: CI/CD pipeline does not touch database schema

### Rollback Considerations
**Pipeline Rollback**:
- If pipeline fails, previous deployment remains active (no change)
- If health check fails, automatic rollback to previous Docker image tag
- If rollback fails, manual SSH intervention required

**Manual Rollback Procedure** (if automation fails):
```bash
ssh hetzner
cd /home/marcus/marcusgoll
docker images ghcr.io/marcusgoll/marcusgoll # Find previous tag
docker-compose -f docker-compose.prod.yml pull # Or specify tag
docker-compose -f docker-compose.prod.yml up -d --force-recreate nextjs
```

**Rollback Time**: <5 minutes (automatic or manual)

## Context Strategy

### Clarification Needed
> **INTENTIONALLY EMPTY**: No critical ambiguities - specification is clear for implementation

All deployment details are documented in existing project docs:
- Tech stack defined in `docs/project/tech-stack.md`
- Deployment strategy in `docs/project/deployment-strategy.md`
- Infrastructure details in `docker-compose.prod.yml` and `Dockerfile`
- VPS access via `ssh hetzner` (documented in CLAUDE.md)

### Key Design Decisions

**Decision 1: Extend Existing Workflow vs Create New**
- **Choice**: Extend `.github/workflows/deploy-production.yml`
- **Rationale**: Basic structure exists, just needs deployment automation added
- **Alternative Rejected**: Creating new workflow would duplicate PR validation logic
- **Impact**: Faster implementation, maintains existing PR checks

**Decision 2: Docker Registry Choice**
- **Choice**: GitHub Container Registry (GHCR) at `ghcr.io`
- **Rationale**: Free for public repos, native GitHub integration, automatic `GITHUB_TOKEN` auth
- **Alternative Rejected**: Docker Hub requires separate account and manual PAT management
- **Impact**: Simpler auth, tighter GitHub integration

**Decision 3: Deployment Method**
- **Choice**: SSH-based deployment via `appleboy/ssh-action`
- **Rationale**: Direct control, works with existing VPS setup, no additional tooling
- **Alternative Rejected**: Webhook-based (Dokploy) lacks GitHub Actions integration
- **Impact**: Full CI/CD control, easier debugging

**Decision 4: Rollback Strategy**
- **Choice**: Docker image tag-based rollback (redeploy previous tag)
- **Rationale**: Fast, reliable, leverages existing Docker Compose setup
- **Alternative Rejected**: Git revert + rebuild (slower, requires full pipeline rerun)
- **Impact**: Sub-2-minute rollback, no rebuild needed

**Decision 5: Notification Channel**
- **Choice**: Slack OR Discord webhook (user choice)
- **Rationale**: Most developers use one or both, webhook is simple
- **Alternative Rejected**: Email (slower, less actionable), SMS (costly)
- **Impact**: Real-time notifications, mobile-friendly

## System Components Analysis

> **SKIP**: Infrastructure feature - no UI components needed

## Acceptance Criteria

### AC-001: PR Validation Works
**Given** a developer creates a pull request with code changes
**When** the PR is created or updated
**Then** GitHub Actions runs lint, typecheck, and build steps
**And** PR shows pass/fail status in GitHub UI
**And** Failing checks block merge

**Validation**:
1. Create PR with intentional ESLint error
2. Verify pipeline fails on lint step
3. Fix error, push update
4. Verify pipeline passes and PR is mergeable

### AC-002: Docker Build and Push Works
**Given** code is merged to main branch
**When** the push event triggers the workflow
**Then** Docker image is built using multi-stage Dockerfile
**And** Image is tagged with `latest` and `sha-<commit>`
**And** Image is pushed to `ghcr.io/marcusgoll/marcusgoll`
**And** Build completes in under 5 minutes (with caching)

**Validation**:
1. Merge PR to main
2. Monitor GitHub Actions workflow
3. Verify image appears in GHCR with correct tags
4. Verify image size is under 500MB

### AC-003: VPS Deployment Works
**Given** Docker image is successfully pushed to GHCR
**When** the deployment step runs
**Then** Pipeline SSHs to VPS successfully
**And** Pulls latest Docker image from GHCR
**And** Runs `docker-compose up -d` to restart container
**And** Container becomes healthy within 30 seconds
**And** Site responds with HTTP 200 at production URL

**Validation**:
1. Push code to main
2. Wait for deployment to complete
3. Visit https://test.marcusgoll.com
4. Verify new changes are live
5. Check Docker logs on VPS for successful startup

### AC-004: Health Check Works
**Given** deployment completes and container is running
**When** health check curl runs
**Then** Production URL returns HTTP 200
**And** Response time is under 3 seconds
**And** Response contains expected content (HTML page)

**Validation**:
1. After deployment, manually curl `https://test.marcusgoll.com`
2. Verify response matches health check expectations
3. Check workflow logs show health check passed

### AC-005: Secrets Are Secure
**Given** sensitive credentials are needed for deployment
**When** workflow runs
**Then** VPS SSH key is loaded from GitHub Secrets
**And** Secrets are never logged in workflow output
**And** Missing secrets cause immediate clear failure

**Validation**:
1. Review workflow logs, verify no secrets printed
2. Temporarily remove a secret, verify clear error message
3. Restore secret, verify pipeline works again

### AC-006: Rollback Works
**Given** a deployment health check fails
**When** the rollback step executes
**Then** Previous Docker image tag is redeployed
**And** Rollback health check passes
**And** Site returns to previous working state
**And** Rollback completes within 2 minutes

**Validation**:
1. Deploy intentionally broken code (e.g., syntax error causing crash)
2. Verify health check fails
3. Verify automatic rollback triggers
4. Verify site remains accessible with previous version

### AC-007: Notifications Work
**Given** deployment completes (success or failure)
**When** notification step runs
**Then** Slack/Discord webhook is called
**And** Message includes commit info, status, and URL
**And** Notification appears within 30 seconds

**Validation**:
1. Deploy code
2. Check Slack/Discord channel
3. Verify notification received with correct details

### AC-008: Caching Works
**Given** pipeline has run at least once before
**When** another deployment runs
**Then** npm cache is restored from previous run
**And** Docker layers are reused from buildx cache
**And** Build time is 50%+ faster than first (cold cache) run

**Validation**:
1. Run pipeline, note build duration (cold cache)
2. Run pipeline again without changing dependencies
3. Compare build times, verify 50%+ improvement

### AC-009: Pipeline Completes Under 10 Minutes
**Given** code is pushed to main
**When** full pipeline runs (build, push, deploy, health check)
**Then** Total duration is under 10 minutes
**And** Each step logs progress clearly

**Validation**:
1. Push code to main
2. Monitor full pipeline execution
3. Verify completion time under 10 minutes
4. Review step-by-step timings in workflow logs

## Success Criteria

### User-Facing Success Criteria

1. **Automated Deployments**: Pushing code to main automatically deploys to production without manual intervention
2. **Fast Feedback**: Developers know within 10 minutes if deployment succeeded or failed
3. **Reliable Deployments**: 95%+ of deployments succeed on first attempt
4. **Safe Rollbacks**: Failed deployments automatically rollback, maintaining site availability
5. **Clear Notifications**: Developers receive immediate notification of deployment status via Slack/Discord
6. **Consistent Environments**: All deployments use identical Docker images (build once, deploy once)
7. **Secure Credentials**: No secrets committed to Git, all credentials managed via GitHub Secrets
8. **Fast Builds**: Dependency caching reduces build time by 50%+ on subsequent runs
9. **Audit Trail**: All deployments logged in GitHub Actions with timestamps and commit details
10. **Zero Manual Steps**: No SSH, no manual Docker commands, no file transfers - fully automated

### Technical Success Criteria

1. GitHub Actions workflow successfully triggers on PR and push to main
2. ESLint and TypeScript checks block broken code from merging
3. Docker image builds successfully in CI using existing Dockerfile
4. Image pushed to GHCR with correct tags (latest + commit SHA)
5. SSH authentication to VPS works using GitHub Secrets
6. Docker Compose on VPS pulls and restarts containers automatically
7. Health check verifies site is responsive after deployment
8. Rollback mechanism restores previous version if health check fails
9. Notifications sent to Slack/Discord on deployment completion
10. Build cache reduces npm install and Docker build times by 50%+

### Measurable Outcomes

| Metric | Baseline (Before) | Target (After) | Measurement Method |
|--------|------------------|----------------|---------------------|
| Deployment time | 15-30 min (manual) | <10 min (automated) | GitHub Actions workflow duration |
| Deployment success rate | 80% (manual errors) | >95% | Successful runs / total runs |
| Rollback time | 10-15 min (manual) | <2 min (automatic) | Time from failure to site restored |
| Deployments per week | 1-2 (manual friction) | 5+ (automated ease) | GitHub Actions run count |
| Build time (cached) | 5-7 min (no caching) | <3 min (with caching) | Build step duration in workflow logs |
| Manual intervention required | 100% (all manual) | 0% (fully automated) | Deployments requiring SSH access |

## Open Questions

> **INTENTIONALLY EMPTY**: All questions answered by existing project documentation

Deployment strategy is well-documented in `docs/project/deployment-strategy.md` and VPS access is configured per CLAUDE.md (`ssh hetzner`).

## Changelog

| Date | Author | Change | Reason |
|------|--------|--------|--------|
| 2025-10-28 | Marcus (via Claude) | Initial specification created | GitHub Issue #29 - Automate CI/CD pipeline |
| 2025-10-28 | Marcus (via Claude) | Research completed, existing workflows analyzed | Extend existing build-and-test.yml |
| 2025-10-28 | Marcus (via Claude) | User stories prioritized (US1-US8), MVP defined | Ship core automation first (US1-US3) |
| 2025-10-28 | Marcus (via Claude) | Success metrics defined using HEART framework | Track deployment reliability and speed |
