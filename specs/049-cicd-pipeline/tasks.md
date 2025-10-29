# Tasks: CI/CD Pipeline (GitHub Actions)

## [CODEBASE REUSE ANALYSIS]
Scanned: D:/coding/tech-stack-foundation-core

[EXISTING - REUSE]
- ✅ .github/workflows/deploy-production.yml (basic build + test, extend for deployment)
- ✅ Dockerfile (multi-stage: base → builder → production, no changes needed)
- ✅ docker-compose.prod.yml (Next.js + Caddy orchestration, pull and restart pattern)
- ✅ infrastructure/Caddyfile (SSL + reverse proxy, auto-renew Let's Encrypt)
- ✅ VPS SSH access (ssh hetzner alias configured per CLAUDE.md)
- ✅ GitHub Secrets infrastructure (repository secrets mechanism)
- ✅ Docker healthcheck (/api/health endpoint referenced in docker-compose.prod.yml)
- ✅ Node.js 20 + npm ci pattern (existing in deploy-production.yml)

[NEW - CREATE]
- 🆕 Docker build job with buildx caching
- 🆕 GHCR authentication and image push
- 🆕 SSH deployment job with appleboy/ssh-action
- 🆕 Rollback logic (capture previous tag, redeploy on failure)
- 🆕 Slack/Discord notification webhooks
- 🆕 Deployment log tracking (deployment-log.md)
- 🆕 GitHub Secrets configuration docs (SSH keys, webhook URLs)

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (document structure)
2. Phase 2: Foundational (SSH keys, secrets config)
3. Phase 3: US1 [P1] - PR validation (independent)
4. Phase 4: US2 [P1] - Docker build and push (independent of US1)
5. Phase 5: US3 [P1] - SSH deployment (depends on US2)
6. Phase 6: US4 [P2] - Rollback capability (depends on US3)
7. Phase 7: US5 [P2] - Notifications (depends on US3, can run parallel with US4)
8. Phase 8: US6 [P2] - Secrets management (refactor after deployment works)
9. Phase 9: US7 [P3] - Caching optimization (enhance US2)
10. Phase 10: US8 [P3] - Integration tests (enhance US1)

## [PARALLEL EXECUTION OPPORTUNITIES]
- US1 (PR validation): T010-T012 can run parallel (different workflow sections)
- US2 (Docker build): T020-T024 can run parallel (different workflow steps)
- US4 + US5: T050-T053, T060-T062 can run parallel (independent enhancements)
- US7 (Caching): T080-T082 can run parallel (npm cache + Docker cache independent)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phases 3-5 (US1-US3) - Full CI/CD pipeline with basic deployment
**Incremental delivery**:
- Sprint 1: US1-US3 → Validate automated deployment works
- Sprint 2: US4-US6 → Add safety features (rollback, notifications, secrets cleanup)
- Sprint 3: US7-US8 → Optimize (caching, integration tests)
**Testing approach**: Manual validation (no automated tests for infrastructure code)

---

## Phase 1: Setup

- [ ] T001 Create deployment tracking log structure
  - File: specs/049-cicd-pipeline/deployment-log.md
  - Format: Markdown table (Date, Commit SHA, Status, Duration, URL, Notes)
  - Header: "# Deployment Log: CI/CD Pipeline"
  - Pattern: specs/048-ssl-tls-letsencrypt/NOTES.md (append-only log style)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #6

- [ ] T002 Document SSH key setup procedure in NOTES.md
  - File: specs/049-cicd-pipeline/NOTES.md
  - Content: Generate SSH key pair (Ed25519), add public key to VPS, test connection
  - Commands: `ssh-keygen -t ed25519 -C "github-actions-ci"`, `ssh-copy-id hetzner`
  - Validation: `ssh -i ~/.ssh/github_actions_ed25519 hetzner "docker --version"`
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

- [ ] T003 Document GitHub Secrets configuration in NOTES.md
  - File: specs/049-cicd-pipeline/NOTES.md
  - Content: List of required secrets (VPS_SSH_PRIVATE_KEY, VPS_HOST, VPS_USER, VPS_DEPLOY_PATH)
  - Format: Table with Name, Description, Example Value (sanitized)
  - Navigation: GitHub repo → Settings → Secrets and variables → Actions → New repository secret
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Infrastructure that blocks all user stories

- [ ] T005 [P] Generate SSH key pair for GitHub Actions
  - Command: `ssh-keygen -t ed25519 -f ~/.ssh/github_actions_ed25519 -C "github-actions-ci-cd" -N ""`
  - Output: Private key (github_actions_ed25519), Public key (github_actions_ed25519.pub)
  - Location: Local machine ~/.ssh/ (temporary, will copy to GitHub Secrets)
  - Validation: Key file permissions 600, public key readable
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

- [ ] T006 [P] Add GitHub Actions public key to VPS authorized_keys
  - Command: `ssh-copy-id -i ~/.ssh/github_actions_ed25519.pub hetzner`
  - Alternative (manual): `cat ~/.ssh/github_actions_ed25519.pub | ssh hetzner "cat >> ~/.ssh/authorized_keys"`
  - Validation: `ssh -i ~/.ssh/github_actions_ed25519 hetzner "echo 'SSH works'"`
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

- [ ] T007 Add VPS_SSH_PRIVATE_KEY to GitHub Secrets
  - Navigate: GitHub repo → Settings → Secrets and variables → Actions → New repository secret
  - Name: VPS_SSH_PRIVATE_KEY
  - Value: Full content of ~/.ssh/github_actions_ed25519 (including headers)
  - Format: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----
  - Security: Delete local private key after copying to GitHub Secrets
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

- [ ] T008 [P] Add VPS connection secrets to GitHub
  - VPS_HOST: Hetzner VPS IP address or hostname
  - VPS_USER: SSH username (e.g., "marcus")
  - VPS_DEPLOY_PATH: Docker Compose directory (e.g., "/home/marcus/marcusgoll")
  - Navigation: GitHub repo → Settings → Secrets and variables → Actions
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #4

---

## Phase 3: User Story 1 [P1] - PR validation pipeline

**Story Goal**: Developers get automated feedback on code quality before merging PRs

**Independent Test Criteria**:
- [ ] PR creation triggers workflow run
- [ ] Workflow runs lint, type-check, build in sequence
- [ ] Failing lint blocks PR merge
- [ ] Passing all checks marks PR as mergeable

### Implementation

- [ ] T010 [P] [US1] Add type-check step to workflow before build
  - File: .github/workflows/deploy-production.yml
  - Location: After "Install dependencies" step, before "Build application"
  - Step name: "Type check"
  - Command: `npx tsc --noEmit`
  - Fail-fast: Pipeline stops if type-check fails
  - REUSE: Existing workflow structure (deploy-production.yml:26-27)
  - Pattern: deploy-production.yml:45-47 (lint step)
  - From: spec.md FR-001

- [ ] T011 [P] [US1] Move lint step before build (fail-fast)
  - File: .github/workflows/deploy-production.yml
  - Current: Lint runs after build with continue-on-error: true
  - New: Lint runs before build, fails pipeline on error
  - Remove: continue-on-error: true (line 47)
  - Reason: Catch errors before expensive build step
  - REUSE: Existing lint command (deploy-production.yml:45-47)
  - From: spec.md FR-001

- [ ] T012 [P] [US1] Update workflow name and summary for CI/CD
  - File: .github/workflows/deploy-production.yml
  - Current name: "Build and Test" (line 1)
  - New name: "CI/CD Pipeline - Build, Test, Deploy"
  - Update summary section (lines 49-66): Remove Dokploy references, add "CI/CD automated deployment"
  - REUSE: Existing summary structure (deploy-production.yml:49-66)
  - From: plan.md [ARCHITECTURE DECISIONS]

---

## Phase 4: User Story 2 [P1] - Docker build and push to GHCR

**Story Goal**: Every main branch push creates an immutable Docker image artifact

**Independent Test Criteria**:
- [ ] Push to main triggers Docker build
- [ ] Image tagged with commit SHA and 'latest'
- [ ] Image pushed to ghcr.io/marcusgoll/marcusgoll
- [ ] Image size under 500MB
- [ ] Build completes in under 8 minutes (cold cache)

### Implementation

- [ ] T020 [P] [US2] Add Docker buildx setup step to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: New job "docker-build" after "build" job
  - Condition: `if: github.ref == 'refs/heads/main'` (only on main branch push)
  - Action: `docker/setup-buildx-action@v3`
  - Purpose: Enable Docker layer caching
  - Pattern: Docker official GitHub Actions documentation
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #1

- [ ] T021 [P] [US2] Add GHCR login step to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: After buildx setup, before build-push
  - Action: `docker/login-action@v3`
  - Registry: ghcr.io
  - Username: ${{ github.actor }}
  - Password: ${{ secrets.GITHUB_TOKEN }}
  - Note: GITHUB_TOKEN is automatic, no manual secret needed
  - REUSE: Built-in GITHUB_TOKEN (no new secret required)
  - From: plan.md [ARCHITECTURE DECISIONS] - GHCR automatic auth

- [ ] T022 [P] [US2] Add Docker build and push step to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: After GHCR login
  - Action: `docker/build-push-action@v5`
  - Context: . (root directory)
  - File: ./Dockerfile
  - Push: true
  - Tags: ghcr.io/marcusgoll/marcusgoll:latest, ghcr.io/marcusgoll/marcusgoll:sha-${{ github.sha }}
  - Build-args: NODE_ENV=production, NEXT_PUBLIC_SITE_URL=${{ secrets.PUBLIC_URL }}
  - REUSE: Existing Dockerfile (no changes needed)
  - Pattern: docker/build-push-action documentation
  - From: spec.md FR-002

- [ ] T023 [US2] Add short SHA tag for readability
  - File: .github/workflows/deploy-production.yml
  - Location: In docker/build-push-action tags
  - Generate short SHA: `echo "SHORT_SHA=${GITHUB_SHA::7}" >> $GITHUB_ENV`
  - Add tag: ghcr.io/marcusgoll/marcusgoll:sha-${{ env.SHORT_SHA }}
  - Reason: 7-char SHAs more readable than 40-char full SHAs
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #1

- [ ] T024 [P] [US2] Add Docker build summary to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: After docker build-push step
  - Content: Image tags pushed, image size, build duration
  - Format: Append to $GITHUB_STEP_SUMMARY
  - Example: "Docker image pushed: ghcr.io/marcusgoll/marcusgoll:latest, :sha-abc1234"
  - REUSE: Existing summary pattern (deploy-production.yml:49-66)
  - From: plan.md [CI/CD IMPACT] - Observability

---

## Phase 5: User Story 3 [P1] - SSH deployment to VPS

**Story Goal**: Automated deployment to production VPS after successful Docker build

**Independent Test Criteria**:
- [ ] Docker push completion triggers deployment job
- [ ] SSH connection succeeds using GitHub Secrets
- [ ] Latest image pulled from GHCR
- [ ] Containers restart via docker-compose up -d
- [ ] Health check passes (site returns HTTP 200)
- [ ] Deployment completes in under 2 minutes

### Implementation

- [ ] T030 [US3] Add VPS deployment job to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: New job "deploy-vps" after "docker-build" job
  - Depends on: needs: [build, docker-build]
  - Condition: `if: github.ref == 'refs/heads/main' && success()`
  - Runs-on: ubuntu-latest
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #2

- [ ] T031 [US3] Add SSH action step for VPS deployment
  - File: .github/workflows/deploy-production.yml
  - Location: In deploy-vps job
  - Action: `appleboy/ssh-action@v1.0.0`
  - Host: ${{ secrets.VPS_HOST }}
  - Username: ${{ secrets.VPS_USER }}
  - Key: ${{ secrets.VPS_SSH_PRIVATE_KEY }}
  - Script: Multi-line bash commands (see T032)
  - Pattern: appleboy/ssh-action documentation
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #2

- [ ] T032 [US3] Write deployment script for SSH action
  - File: .github/workflows/deploy-production.yml (inline script in SSH action)
  - Commands:
    1. `cd ${{ secrets.VPS_DEPLOY_PATH }}`
    2. `docker-compose -f docker-compose.prod.yml pull nextjs`
    3. `docker-compose -f docker-compose.prod.yml up -d --no-deps nextjs`
    4. `docker ps | grep marcusgoll-nextjs-prod`
  - Timeout: 120 seconds
  - REUSE: Existing docker-compose.prod.yml (no changes)
  - Pattern: docker-compose.prod.yml pull and restart pattern
  - From: spec.md FR-003

- [ ] T033 [US3] Add container health check wait logic
  - File: .github/workflows/deploy-production.yml
  - Location: In SSH action script, after docker-compose up
  - Script: Loop 6 times (30 seconds total):
    - `docker inspect --format='{{.State.Health.Status}}' marcusgoll-nextjs-prod`
    - If "healthy", break
    - Else sleep 5 seconds, retry
  - Fail: If not healthy after 30 seconds, exit 1
  - REUSE: Docker healthcheck defined in docker-compose.prod.yml
  - From: spec.md FR-003

- [ ] T034 [US3] Add post-deployment health check via curl
  - File: .github/workflows/deploy-production.yml
  - Location: New step after SSH action
  - Command: `curl -f -m 3 --retry 3 --retry-delay 10 https://test.marcusgoll.com`
  - Success: HTTP 200 response
  - Failure: Exit 1, triggers rollback (Phase 6)
  - Pattern: curl with retries for transient failures
  - From: spec.md FR-004

- [ ] T035 [P] [US3] Add deployment success summary to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: After health check step
  - Content: Deployment time, commit SHA, deployment URL, health check status
  - Format: Append to $GITHUB_STEP_SUMMARY
  - Example: "🚀 Deployment successful to https://test.marcusgoll.com (sha-abc1234, 2m 15s)"
  - REUSE: Existing summary pattern (deploy-production.yml:49-66)
  - From: plan.md [CI/CD IMPACT] - Observability

---

## Phase 6: User Story 4 [P2] - Rollback capability

**Story Goal**: Automatic recovery from failed deployments by reverting to previous version

**Independent Test Criteria**:
- [ ] Pipeline captures current Docker image tag before deployment
- [ ] Health check failure triggers rollback logic
- [ ] Previous image tag redeployed automatically
- [ ] Rollback health check passes
- [ ] Rollback completes within 2 minutes

### Implementation

- [ ] T050 [US4] Capture current Docker image tag before deployment
  - File: .github/workflows/deploy-production.yml
  - Location: In SSH action script, before docker-compose pull
  - Command: `CURRENT_TAG=$(docker inspect marcusgoll-nextjs-prod --format='{{index .Config.Image}}' 2>/dev/null || echo 'none')`
  - Store: Echo to GitHub Actions output: `echo "PREVIOUS_TAG=$CURRENT_TAG" >> $GITHUB_ENV`
  - Purpose: Save for rollback if new deployment fails
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #3

- [ ] T051 [US4] Add rollback script step on health check failure
  - File: .github/workflows/deploy-production.yml
  - Location: New step after post-deployment health check
  - Condition: `if: failure()` (runs only if previous step failed)
  - Action: appleboy/ssh-action@v1.0.0 (same SSH config as deployment)
  - Script: Rollback commands (see T052)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #3

- [ ] T052 [US4] Write rollback script for SSH action
  - File: .github/workflows/deploy-production.yml (inline script in rollback step)
  - Commands:
    1. `cd ${{ secrets.VPS_DEPLOY_PATH }}`
    2. `docker tag ${{ env.PREVIOUS_TAG }} ghcr.io/marcusgoll/marcusgoll:rollback`
    3. `docker-compose -f docker-compose.prod.yml up -d --no-deps nextjs`
    4. `docker inspect --format='{{.State.Health.Status}}' marcusgoll-nextjs-prod` (wait for healthy)
  - Validation: Curl health check after rollback
  - From: spec.md FR-006

- [ ] T053 [P] [US4] Log rollback event in deployment log
  - File: specs/049-cicd-pipeline/deployment-log.md
  - Content: Row with date, commit SHA, status "ROLLED_BACK", reason, previous tag
  - Trigger: Workflow step appends to file via GitHub API or manual update
  - Format: `| $(date) | ${{ github.sha }} | ROLLED_BACK | Health check failed | ${{ env.PREVIOUS_TAG }} |`
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #6

---

## Phase 7: User Story 5 [P2] - Deployment notifications

**Story Goal**: Real-time awareness of deployment status via Slack or Discord

**Independent Test Criteria**:
- [ ] Deployment completion triggers notification step
- [ ] Success notification includes commit SHA, URL, duration
- [ ] Failure notification includes error summary, logs link, rollback status
- [ ] Notification received within 30 seconds

### Implementation

- [ ] T060 [P] [US5] Add Slack notification for deployment success
  - File: .github/workflows/deploy-production.yml
  - Location: New step in deploy-vps job, after deployment success summary
  - Condition: `if: success() && secrets.SLACK_WEBHOOK_URL != ''`
  - Action: `curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} -H 'Content-Type: application/json' -d '{"text":"✅ Deployment successful..."}'`
  - Content: Commit SHA, commit message, deployment URL, duration
  - Pattern: Slack Incoming Webhooks documentation
  - From: spec.md FR-007

- [ ] T061 [P] [US5] Add Slack notification for deployment failure
  - File: .github/workflows/deploy-production.yml
  - Location: New step in deploy-vps job, after rollback step
  - Condition: `if: failure() && secrets.SLACK_WEBHOOK_URL != ''`
  - Action: `curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} -H 'Content-Type: application/json' -d '{"text":"❌ Deployment failed..."}'`
  - Content: Error summary, GitHub Actions run URL, rollback status
  - From: spec.md FR-007

- [ ] T062 [P] [US5] Add optional Discord notification support
  - File: .github/workflows/deploy-production.yml
  - Location: Alternative to Slack (either/or logic)
  - Condition: `if: secrets.DISCORD_WEBHOOK_URL != '' && secrets.SLACK_WEBHOOK_URL == ''`
  - Action: `curl -X POST ${{ secrets.DISCORD_WEBHOOK_URL }} -H 'Content-Type: application/json' -d '{"content":"..."}'`
  - Note: Discord webhook format differs from Slack (use "content" not "text")
  - From: spec.md FR-007

---

## Phase 8: User Story 6 [P2] - Secrets management cleanup

**Story Goal**: All credentials securely stored, no secrets in logs or code

**Independent Test Criteria**:
- [ ] Workflow logs show no plaintext secrets
- [ ] Missing secrets cause clear, immediate failure
- [ ] All credentials loaded from GitHub Secrets

### Implementation

- [ ] T070 [P] [US6] Audit workflow for secret exposure
  - File: .github/workflows/deploy-production.yml
  - Task: Review all echo and logging statements
  - Verify: No ${{ secrets.* }} printed to logs
  - Fix: Replace any `echo $SECRET` with `echo "***"` or remove
  - GitHub Safety: GitHub Actions automatically masks secrets, but verify manually
  - From: spec.md FR-005

- [ ] T071 [US6] Add secret validation step at workflow start
  - File: .github/workflows/deploy-production.yml
  - Location: First step in deploy-vps job
  - Script: Check required secrets exist
    ```bash
    if [ -z "${{ secrets.VPS_SSH_PRIVATE_KEY }}" ]; then
      echo "❌ Missing VPS_SSH_PRIVATE_KEY secret"
      exit 1
    fi
    ```
  - Check: VPS_SSH_PRIVATE_KEY, VPS_HOST, VPS_USER, VPS_DEPLOY_PATH
  - From: spec.md FR-005

- [ ] T072 [P] [US6] Document secret rotation procedure in NOTES.md
  - File: specs/049-cicd-pipeline/NOTES.md
  - Content: Quarterly SSH key rotation procedure
  - Steps: Generate new key pair, add to VPS, update GitHub Secret, test, remove old key
  - Reason: Security best practice (rotate credentials every 90 days)
  - From: plan.md [MAINTENANCE & OPERATIONS]

---

## Phase 9: User Story 7 [P3] - Build caching optimization

**Story Goal**: Faster builds via dependency and Docker layer caching

**Independent Test Criteria**:
- [ ] First build (cold cache) establishes baseline duration
- [ ] Second build (warm cache) 50%+ faster than cold cache
- [ ] Cache invalidated when package-lock.json changes
- [ ] npm cache restored before npm ci
- [ ] Docker buildx cache active

### Implementation

- [ ] T080 [P] [US7] Add npm dependency caching to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: Before "Install dependencies" step in build job
  - Action: `actions/cache@v3`
  - Key: `node-modules-${{ runner.os }}-${{ hashFiles('package-lock.json') }}`
  - Path: ~/.npm, node_modules
  - Restore-keys: `node-modules-${{ runner.os }}-`
  - Note: actions/setup-node@v4 has built-in cache, verify if additional cache needed
  - REUSE: Existing actions/setup-node@v4 with cache: 'npm' (deploy-production.yml:24)
  - From: spec.md FR-008

- [ ] T081 [P] [US7] Add Docker buildx cache configuration
  - File: .github/workflows/deploy-production.yml
  - Location: In docker/build-push-action@v5 step
  - Add parameters:
    - cache-from: type=gha
    - cache-to: type=gha,mode=max
  - Effect: GitHub Actions caches Docker layers automatically
  - No storage cost: Built into GitHub Actions (free)
  - From: spec.md FR-008

- [ ] T082 [P] [US7] Add build duration tracking to summary
  - File: .github/workflows/deploy-production.yml
  - Location: In build and docker-build jobs
  - Capture: `START_TIME=$(date +%s)` at job start, `END_TIME=$(date +%s)` at job end
  - Calculate: `DURATION=$((END_TIME - START_TIME))`
  - Log: Append to $GITHUB_STEP_SUMMARY with cache hit/miss status
  - Purpose: Measure cache effectiveness (target 50% reduction)
  - From: spec.md FR-008

---

## Phase 10: User Story 8 [P3] - Integration tests in CI

**Story Goal**: API contract validation before deployment

**Independent Test Criteria**:
- [ ] Integration tests run after build step
- [ ] Tests use test database (not production)
- [ ] Failing integration tests block merge
- [ ] Tests complete within 2 minutes

### Implementation

- [ ] T090 [US8] Create integration test directory structure
  - Directory: tests/integration/
  - Files: tests/integration/api/*.test.ts (API endpoint tests)
  - Pattern: tests/e2e/ (if exists) or create new structure
  - Framework: Jest or Vitest (match existing test setup)
  - From: spec.md US8 - Effort L (8-16 hours, deferred for now)

- [ ] T091 [US8] Add integration test step to workflow
  - File: .github/workflows/deploy-production.yml
  - Location: After "Build application" step
  - Command: `npm run test:integration`
  - Environment: TEST_DATABASE_URL (use test DB, not production)
  - Condition: Only if integration tests exist
  - From: spec.md FR-001 (future enhancement)

- [ ] T092 [US8] Configure test database for CI
  - Setup: Use PostgreSQL service container in GitHub Actions
  - Service: `postgres:15-alpine`
  - Environment: TEST_DATABASE_URL pointing to service container
  - Migrations: Run Prisma migrations before tests (`npx prisma migrate deploy`)
  - From: spec.md US8

---

## Phase 11: Polish & Cross-Cutting Concerns

### Deployment Tracking

- [ ] T100 Add deployment log entry on success
  - File: specs/049-cicd-pipeline/deployment-log.md
  - Trigger: Workflow step after deployment success
  - Content: `| $(date) | ${{ github.sha }} | SUCCESS | 8m 45s | https://test.marcusgoll.com | - |`
  - Method: GitHub Actions workflow appends to file or manual tracking
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] #6

- [ ] T101 [P] Add deployment metrics to workflow summary
  - File: .github/workflows/deploy-production.yml
  - Location: Final step in deploy-vps job
  - Metrics: Total duration, build time, deploy time, health check time
  - Format: Markdown table in $GITHUB_STEP_SUMMARY
  - Compare: Against NFR-001 target (<10 minutes)
  - From: spec.md Success Metrics (HEART framework)

### Documentation

- [ ] T110 Update NOTES.md with Phase 2 tasks checkpoint
  - File: specs/049-cicd-pipeline/NOTES.md
  - Content: Tasks generated, count, MVP scope, next phase (/analyze)
  - Timestamp: $(date '+%Y-%m-%d %H:%M')
  - Summary: Total tasks, user story tasks, parallel opportunities
  - From: Task generation workflow

- [ ] T111 Document rollback procedure in NOTES.md
  - File: specs/049-cicd-pipeline/NOTES.md
  - Content: Manual rollback steps (3-command procedure)
  - Commands:
    1. `ssh hetzner`
    2. `cd /home/marcus/marcusgoll && docker images ghcr.io/marcusgoll/marcusgoll`
    3. `docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d --force-recreate nextjs`
  - Reference: docs/ROLLBACK_RUNBOOK.md (if exists)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T112 [P] Update README.md with CI/CD workflow documentation
  - File: README.md or docs/DEPLOYMENT.md
  - Content: How CI/CD works, deployment process, how to rollback
  - Diagrams: Workflow sequence (PR validation → Docker build → Deploy → Health check)
  - Audience: Future developers, contributors
  - From: plan.md [MAINTENANCE & OPERATIONS]

### Testing and Validation

- [ ] T120 Test SSH connection from local machine
  - Command: `ssh -i ~/.ssh/github_actions_ed25519 hetzner "docker --version"`
  - Expected: Docker version output (e.g., "Docker version 24.0.7")
  - Purpose: Validate SSH key works before adding to GitHub Secrets
  - From: plan.md [TESTING STRATEGY]

- [ ] T121 Test Docker build locally
  - Command: `docker build -t test-marcusgoll .`
  - Verify: Build succeeds, image size <500MB
  - Purpose: Ensure Dockerfile works in CI environment
  - From: plan.md [TESTING STRATEGY]

- [ ] T122 Test workflow in feature branch (dry-run)
  - Branch: Create test branch, push to trigger workflow
  - Verify: PR validation runs, deployment skipped (not main branch)
  - Purpose: Validate workflow syntax before merging
  - From: plan.md [TESTING STRATEGY]

---

## [TASK SUMMARY]

**Total Tasks**: 50 (T001-T122)
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (US1 - PR validation): 3 tasks
- Phase 4 (US2 - Docker build): 5 tasks
- Phase 5 (US3 - SSH deployment): 6 tasks
- Phase 6 (US4 - Rollback): 4 tasks
- Phase 7 (US5 - Notifications): 3 tasks
- Phase 8 (US6 - Secrets): 3 tasks
- Phase 9 (US7 - Caching): 3 tasks
- Phase 10 (US8 - Integration tests): 3 tasks (DEFERRED)
- Phase 11 (Polish): 8 tasks

**Parallel Opportunities**: 23 tasks marked [P]
**User Story Tasks**: 31 tasks marked [US1-US8]
**MVP Scope**: Phases 1-5 (22 tasks) - Core CI/CD pipeline

**Estimated Duration**:
- MVP (US1-US3): 12-20 hours (Core CI/CD)
- Full feature (US1-US7): 20-32 hours (Includes enhancements)
- With US8 (integration tests): 28-48 hours (Full scope)

**Dependencies**:
- T007-T008 block T031 (SSH secrets required for deployment)
- T020-T024 block T030 (Docker image must exist before deployment)
- T030-T035 block T050-T053 (Deployment must work before adding rollback)
