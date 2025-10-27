# Tasks: Dokploy Deployment Platform Integration

## [CODEBASE REUSE ANALYSIS]
Scanned: D:\Coding\marcusgoll\**\*.{yml,sh,conf,json,md}

[EXISTING - REUSE]
- ✅ Dockerfile (D:\Coding\marcusgoll\Dockerfile) - Multi-stage Next.js build
- ✅ docker-compose.prod.yml (D:\Coding\marcusgoll\docker-compose.prod.yml) - Production orchestration
- ✅ deploy.sh (D:\Coding\marcusgoll\deploy.sh) - Deployment workflow pattern
- ✅ GitHub Actions CI (D:\Coding\marcusgoll\.github\workflows\deploy-production.yml) - Build verification
- ✅ Caddy reverse proxy (docker-based on VPS) - Automatic SSL/TLS, routing
- ✅ Let's Encrypt SSL (Caddy auto-managed) - Automatic certificate provisioning
- ✅ Health check endpoint (/api/health) - Container health monitoring
- ✅ Environment variable schema (deploy-production.yml:32-37) - Current secrets structure

[NEW - CREATE]
- 🆕 Dokploy Docker container (self-hosted platform)
- 🆕 Dokploy application configuration (Next.js import)
- 🆕 Dokploy database management (PostgreSQL import)
- 🆕 Caddy subdomain config (deploy.marcusgoll.com)
- 🆕 GitHub webhook integration
- 🆕 Dokploy CLI config export (disaster recovery)

## [DEPENDENCY GRAPH]
Migration phase order:
1. Phase 1: Pre-Migration Setup (blocks all phases)
2. Phase 2: Dokploy Installation (depends on Phase 1)
3. Phase 3: Application Migration (depends on Phase 2)
4. Phase 4: Database Integration (depends on Phase 3, parallel with Phase 5)
5. Phase 5: CI/CD Integration (depends on Phase 3, parallel with Phase 4)
6. Phase 6: Production Cutover (depends on Phase 3, 4, 5)
7. Phase 7: Post-Migration Validation (depends on Phase 6)

## [PARALLEL EXECUTION OPPORTUNITIES]
- Phase 1: T001, T002, T003 (different VPS checks, no dependencies)
- Phase 4 & 5: Can run in parallel after Phase 3 complete
- Phase 7: T035, T036, T037 (different validation tests)

## [IMPLEMENTATION STRATEGY]
**Migration Approach**: Blue-Green infrastructure deployment
**Testing Strategy**: Subdomain validation before production cutover
**Rollback Strategy**: VPS snapshot + Caddy config revert (<15 min)
**No TDD Required**: Infrastructure migration, validation via integration tests

---

## Phase 1: Pre-Migration Setup

**Goal**: Prepare VPS and backup current state for safe migration

- [ ] T001 [P] Take VPS snapshot via Hetzner dashboard before any changes
  - Action: Log into Hetzner Cloud, create manual snapshot of VPS
  - Validation: Snapshot shows "Available" status in dashboard
  - Rollback capability: Full VPS restoration point
  - From: plan.md [RISK MITIGATION], spec.md Migration Requirements

- [ ] T002 [P] Backup current Docker configuration to feature configs directory
  - Files: specs/047-dokploy-deployment-platform/configs/pre-migration-backup/
  - Copy: docker-compose.prod.yml, deploy.sh
  - Export: Environment variable keys only (sanitized, no secrets) to env.production.template
  - REUSE: D:\Coding\marcusgoll\docker-compose.prod.yml, D:\Coding\marcusgoll\deploy.sh
  - From: plan.md [APPENDIX A: Pre-Migration Checklist]

- [ ] T003 [P] Verify VPS prerequisites and document current state
  - Check: Docker >=20.10 (`docker --version`)
  - Check: Docker Compose >=2.0 (`docker-compose --version`)
  - Check: Caddy running (`docker ps | grep caddy`)
  - Check: Disk space >5GB free (`df -h`)
  - Check: Port 3000 available or current app port (`sudo netstat -tuln | grep 3000`)
  - Document: Output in NOTES.md VPS Prerequisites section
  - From: plan.md [TESTING STRATEGY], spec.md Platform Dependencies

- [ ] T004 Configure DNS record for Dokploy subdomain
  - Record: deploy.marcusgoll.com → VPS IP (178.156.129.179)
  - Type: A record
  - TTL: 300 seconds (5 minutes)
  - Validation: `nslookup deploy.marcusgoll.com` returns correct IP
  - Wait: 10-60 minutes for DNS propagation
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md FR-002

---

## Phase 2: Dokploy Installation

**Goal**: Install Dokploy on VPS without disrupting current production

- [ ] T005 Install Dokploy via official installation script
  - Command: `curl -sSL https://dokploy.com/install.sh | sh`
  - Run as: Root user via SSH
  - Expected: Dokploy container starts on port 3000
  - Validation: `docker ps | grep dokploy` shows running container
  - Save: Admin credentials to secure password manager (DO NOT commit)
  - From: plan.md [ARCHITECTURE DECISIONS], spec.md US1

- [ ] T006 Configure Caddy for deploy.marcusgoll.com subdomain
  - Location: Caddy config in docker container (/etc/caddy/Caddyfile)
  - Config: Reverse proxy to localhost:3000 (Dokploy UI)
  - Caddy handles: Automatic SSL/TLS, HTTP/2, compression
  - Edit: `docker exec proxy-caddy-1 vi /etc/caddy/Caddyfile` (or use docker cp to edit locally)
  - Caddyfile entry: `deploy.marcusgoll.com { reverse_proxy localhost:3000 }`
  - Reload: `docker exec proxy-caddy-1 caddy reload`
  - Test: `curl https://deploy.marcusgoll.com` returns Dokploy login page
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md FR-002

- [ ] T007 Verify SSL certificate for deploy.marcusgoll.com
  - Caddy auto-provisions: Let's Encrypt certificate (automatic on first request)
  - Verification: `curl https://deploy.marcusgoll.com` returns Dokploy login page with valid SSL
  - SSL test: https://www.ssllabs.com/ssltest/analyze.html?d=deploy.marcusgoll.com → Target A+ rating (per NFR-005)
  - Certificate auto-renewal: Caddy handles renewal automatically (no manual intervention needed)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE], spec.md US1

- [ ] T008 Configure Dokploy admin access and security
  - Action: Login to https://deploy.marcusgoll.com with saved credentials
  - Verify: Dashboard loads successfully
  - Optional: Configure IP restriction in Caddy (via Caddyfile matchers) per spec.md FR-004
  - Document: Admin login process in NOTES.md
  - From: plan.md [SECURITY], spec.md US1

---

## Phase 3: Application Migration

**Goal**: Migrate Next.js application to Dokploy management with test subdomain validation

- [ ] T009 Create new application in Dokploy UI
  - Type: Application → Docker
  - Name: marcusgoll-nextjs
  - Build method: Dockerfile
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md US2

- [ ] T010 Connect GitHub repository to Dokploy application
  - Repository: marcusgoll/marcusgoll
  - Branch: main
  - Authentication: GitHub OAuth (via Dokploy UI)
  - Validation: Dokploy can read repository
  - From: spec.md FR-006, plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T011 Configure build settings in Dokploy
  - Dockerfile path: ./Dockerfile
  - Build context: root (/)
  - Node version: 20 (verify in Dockerfile)
  - Build command: Auto-detected from Dockerfile
  - REUSE: D:\Coding\marcusgoll\Dockerfile (existing multi-stage build)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE], spec.md FR-005

- [ ] T012 Migrate environment variables to Dokploy UI
  - Source: VPS /opt/marcusgoll/.env.production (read via SSH)
  - Target: Dokploy UI → Application → Environment Variables
  - Variables to migrate:
    - DATABASE_URL (PostgreSQL connection)
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - SUPABASE_SERVICE_ROLE_KEY (mark as secret)
    - RESEND_API_KEY or MAILGUN_API_KEY (mark as secret)
    - NEWSLETTER_FROM_EMAIL
    - GA4_MEASUREMENT_ID
    - NEXTAUTH_SECRET (if exists)
    - NEXTAUTH_URL (if exists)
    - ADMIN_EMAIL
  - Verify: All secrets masked in UI (show *****, per FR-028)
  - REUSE: Environment variable schema from deploy-production.yml:32-37
  - From: plan.md [CI/CD IMPACT], spec.md US3, FR-008

- [ ] T013 Configure test subdomain for initial validation
  - Domain: test.marcusgoll.com
  - Add DNS record: test.marcusgoll.com → VPS IP
  - Configure in Dokploy: Application → Domains → Add test.marcusgoll.com
  - SSL: Auto-provision via Dokploy Let's Encrypt integration
  - From: plan.md [PATTERNS] Incremental Validation, spec.md Migration Strategy

- [ ] T014 Trigger first deployment to test subdomain
  - Action: Dokploy UI → Deploy button (manual trigger)
  - Monitor: Real-time deployment logs in Dokploy UI
  - Expected duration: <7 minutes (per NFR-002)
  - Validation: Deployment status shows "Success"
  - From: spec.md US2, FR-016, FR-017

- [ ] T015 Validate test deployment functionality
  - Test: https://test.marcusgoll.com homepage loads
  - Test: Blog posts render correctly
  - Test: Newsletter form accessible (visual check, don't submit)
  - Test: Database connection works (posts visible from PostgreSQL)
  - Test: No browser console errors
  - Test: Response time <2s (per NFR-001)
  - Performance: Run Lighthouse audit, target ≥85 (per constitution.md)
  - Document: Test results in NOTES.md Phase 3 checkpoint
  - From: plan.md [TESTING STRATEGY], spec.md Staging Smoke Tests

---

## Phase 4: Database Integration

**Goal**: Centralize database management and configure automated backups

- [ ] T016 Import PostgreSQL database to Dokploy management
  - Type: External Database (Supabase PostgreSQL)
  - Connection string: Copy DATABASE_URL from environment variables
  - Name: marcusgoll-postgres
  - Validation: Dokploy connection test succeeds
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md US4, FR-010

- [ ] T017 Configure automated database backups
  - Schedule: Daily at 2:00 AM UTC
  - Retention: 7 days (per FR-011)
  - Storage: VPS local disk (/opt/dokploy/backups/)
  - Validation: Check backup schedule shows in Dokploy UI
  - From: spec.md US4, FR-011, plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T018 Test manual database backup and restore
  - Action: Trigger manual backup via Dokploy UI
  - Validation: Backup file downloads successfully
  - Test restore: Upload backup file, verify restore process works
  - Document: Backup/restore procedure in NOTES.md
  - From: spec.md US4, FR-013, FR-014

---

## Phase 5: CI/CD Integration

**Goal**: Automate deployments via GitHub webhooks

- [ ] T019 Generate webhook URL in Dokploy
  - Location: Dokploy UI → Application → Settings → Webhooks
  - Copy: Webhook URL and secret
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md US2

- [ ] T020 Configure GitHub webhook for push-to-deploy
  - Repository: marcusgoll/marcusgoll → Settings → Webhooks
  - Payload URL: Paste Dokploy webhook URL
  - Content type: application/json
  - Secret: Paste Dokploy webhook secret
  - Events: Push events on main branch only
  - Validation: GitHub shows webhook as active
  - From: spec.md FR-015, FR-006, plan.md [CI/CD IMPACT]

- [ ] T021 Test webhook deployment flow
  - Action: Push test commit to main branch
  - Monitor: Dokploy UI shows deployment triggered automatically
  - Validation: Deployment completes successfully
  - Check: GitHub webhook deliveries show 200 OK response
  - From: spec.md US2, FR-009, plan.md [RISK MITIGATION] Risk 4

- [ ] T022 Update GitHub Actions workflow for Dokploy integration
  - File: D:\Coding\marcusgoll\.github\workflows\deploy-production.yml
  - Keep: Verify steps (lint, type-check, build test)
  - Remove: SSH deployment steps (replaced by webhook)
  - Optional: Add webhook trigger step (POST to Dokploy webhook URL)
  - REUSE: .github/workflows/deploy-production.yml:1-55 structure
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE], spec.md FR-015

- [ ] T023 [US6] Configure deployment notifications (optional enhancement)
  - Channel: Email to marcus@marcusgoll.com
  - Events: Deployment success, deployment failure
  - Dokploy: Application → Notifications → Add notification channel
  - Test: Trigger deployment, verify notification received
  - From: spec.md US6 (P2), FR-018

---

## Phase 6: Production Cutover

**Goal**: Switch marcusgoll.com traffic to Dokploy-managed application

- [ ] T024 Backup current Caddy configuration
  - Command: `docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile > /tmp/Caddyfile.backup`
  - Validation: Backup file exists with current Caddyfile content
  - Purpose: Quick rollback if needed
  - From: plan.md [DEPLOYMENT ACCEPTANCE], spec.md Rollback Plan

- [ ] T025 Configure production domain in Dokploy
  - Domain: marcusgoll.com
  - Add: Dokploy UI → Application → Domains → Add marcusgoll.com
  - SSL: Auto-provision via Dokploy Let's Encrypt
  - Keep: test.marcusgoll.com active for comparison
  - From: spec.md FR-007, plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T026 Update Caddy to route marcusgoll.com to Dokploy-managed container
  - Edit Caddyfile: `docker exec proxy-caddy-1 vi /etc/caddy/Caddyfile` (or docker cp locally)
  - Update entry: Change from `marcusgoll.com { reverse_proxy ghost:2368 }` to `marcusgoll.com { reverse_proxy localhost:3000 }`
  - Reload: `docker exec proxy-caddy-1 caddy reload`
  - Test: `curl https://marcusgoll.com` returns Next.js app homepage
  - Verify: No errors in `docker logs proxy-caddy-1`
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE], spec.md Deployment Considerations

- [ ] T027 Verify production cutover successful
  - Test: https://marcusgoll.com loads (main domain)
  - Test: Homepage renders correctly
  - Test: Blog posts load
  - Test: Newsletter form works
  - Test: Database connection (posts visible)
  - Test: Google Analytics events firing (check GA4 real-time)
  - Test: No browser console errors
  - Test: Response time <2s
  - Performance: Lighthouse audit ≥85 (no regression from baseline)
  - From: plan.md [DEPLOYMENT ACCEPTANCE], spec.md Production Invariants

---

## Phase 7: Post-Migration Validation

**Goal**: Monitor production stability and configure observability

- [ ] T028 Configure health check monitoring in Dokploy
  - Endpoint: /api/health
  - Interval: 30 seconds (per spec.md NFR-009)
  - Expected response: 200 OK
  - Restart policy: Auto-restart on 3 consecutive failures
  - REUSE: /api/health endpoint (from docker-compose.prod.yml:38)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE], spec.md US9, FR-019

- [ ] T029 [US7] Configure monitoring dashboard and alerts
  - Metrics: CPU, memory, network, disk usage
  - Retention: 24 hours minimum (per FR-021)
  - Alerts: CPU >80% for 5 min, Memory >75%, Disk >80%
  - Notification: Email to marcus@marcusgoll.com
  - From: spec.md US7 (P2), FR-019 through FR-022, plan.md [MONITORING & OBSERVABILITY]

- [ ] T030 Validate one-click rollback capability
  - Action: Note current deployment ID (commit SHA)
  - Test: Click rollback in Dokploy UI → select previous deployment
  - Validation: Previous version deploys successfully
  - Measure: Rollback duration (target <5 min per FR-026)
  - Document: Rollback test results in NOTES.md
  - From: spec.md US5, FR-023 through FR-026, plan.md [TESTING STRATEGY]

- [ ] T031 [US8] Export Dokploy configuration for disaster recovery
  - Install: Dokploy CLI locally (`npm install -g @dokploy/cli`)
  - Authenticate: `dokploy login` (use admin credentials)
  - Export: `dokploy export --output specs/047-dokploy-deployment-platform/configs/dokploy-config.yaml`
  - Sanitize: Remove secrets, keep structure
  - Commit: Add dokploy-config.yaml to Git
  - Document: Restore procedure in NOTES.md
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], spec.md US8, NFR-017

- [ ] T032 Monitor production stability (24-hour observation)
  - Check: Deployment logs for errors (Dokploy UI)
  - Check: Application logs (stdout/stderr in Dokploy)
  - Check: Resource usage (CPU, memory within limits per NFR-021, NFR-022)
  - Check: Site accessibility (uptime monitoring, e.g., UptimeRobot)
  - Check: Performance metrics (Lighthouse, no regression)
  - Document: Observations in NOTES.md 24-Hour Checkpoint
  - From: plan.md [MONITORING & OBSERVABILITY], spec.md Success Metrics

- [ ] T033 [P] Validate automated backup execution
  - Wait: Until next scheduled backup (2:00 AM UTC)
  - Check: Backup file created in /opt/dokploy/backups/
  - Check: Backup notification received (if configured)
  - Validation: Backup succeeded 100% (per NFR-011)
  - From: spec.md FR-011, NFR-011, plan.md [RISK MITIGATION] Risk 5

- [ ] T034 [P] Run comprehensive smoke tests on production
  - Homepage: `curl https://marcusgoll.com` → returns 200 OK
  - Health check: `curl https://marcusgoll.com/api/health` → {"status":"ok"}
  - Recent post: Load recent blog post, verify content renders
  - Newsletter: Submit test subscription (check Resend/Mailgun)
  - Database: Verify read operations (posts, subscribers)
  - Analytics: Check GA4 tracking (real-time events)
  - From: plan.md [CI/CD IMPACT] Smoke Tests, spec.md Acceptance Scenarios

- [ ] T035 [P] Document deployment workflow for future reference
  - Write: Deployment runbook in NOTES.md
  - Include: How to deploy manually via Dokploy UI
  - Include: How to view logs and metrics
  - Include: How to rollback (UI + emergency CLI)
  - Include: How to update environment variables
  - From: spec.md NFR-016, NFR-019, plan.md [APPENDIX B: Rollback Runbook]

- [ ] T036 [P] Measure success metrics baseline
  - Collect: Deployment time for first 3 Dokploy deployments
  - Collect: Time spent on deployment tasks (track for 1 week)
  - Collect: Deployment frequency (deploys/week)
  - Collect: Deployment success rate (success/total)
  - Compare: Against pre-migration baseline (manual deployment)
  - Document: Results in NOTES.md Success Metrics section
  - From: spec.md HEART Framework, plan.md [SUCCESS METRICS]

- [ ] T037 Clean up old deployment infrastructure (after 7-day validation)
  - Action: Stop old Docker Compose setup (if still running)
  - Archive: Move docker-compose.prod.yml to archive/ directory
  - Archive: Move deploy.sh to archive/ directory
  - Keep: .env.production backup for 30 days (then securely delete)
  - Remove: Old Nginx config backup (marcusgoll.backup) after validation
  - Document: Cleanup actions in NOTES.md
  - From: plan.md [STRUCTURE], spec.md Migration Requirements

---

## Phase 8: Future Enhancements (Deferred)

**Goal**: Document future improvements for roadmap (not implemented in MVP)

- [ ] T038 [US10] Document staging environment setup procedure
  - Research: Dokploy multi-server support
  - Document: Step-by-step guide for adding staging server
  - Template: Configuration for staging (subdomain, separate database)
  - Save: Documentation in NOTES.md or separate staging-setup.md
  - From: spec.md US10 (P3), plan.md [INTEGRATION SCENARIOS]

- [ ] T039 Research advanced monitoring integrations (optional)
  - Explore: Grafana integration with Dokploy
  - Explore: Prometheus metrics export
  - Explore: External uptime monitoring (UptimeRobot, Pingdom)
  - Document: Findings in NOTES.md for future implementation
  - From: spec.md Out of Scope, plan.md [MONITORING & OBSERVABILITY]

---

## [TASK SUMMARY]

**Total Tasks**: 39
- Setup & Installation: 8 (T001-T008)
- Application Migration: 7 (T009-T015)
- Database Integration: 3 (T016-T018)
- CI/CD Integration: 5 (T019-T023)
- Production Cutover: 4 (T024-T027)
- Post-Migration Validation: 10 (T028-T037)
- Future Enhancements: 2 (T038-T039)

**Critical Path**: T001 → T003 → T004 → T005 → T006 → T007 → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T024 → T025 → T026 → T027

**Parallel Opportunities**:
- Phase 1: T001, T002, T003 (independent VPS checks)
- Phase 4 & 5: T016-T018 and T019-T023 (after T015)
- Phase 7: T033, T034, T035, T036 (after T032)

**User Story Coverage**:
- US1 (P1): T005-T008 (Dokploy installation + secure access)
- US2 (P1): T009-T015, T019-T022 (Application migration + push-to-deploy)
- US3 (P1): T012 (Environment variable management)
- US4 (P1): T016-T018 (Database management + backups)
- US5 (P1): T030 (One-click rollback)
- US6 (P2): T023 (Deployment notifications)
- US7 (P2): T029 (Monitoring dashboard)
- US8 (P2): T031 (Configuration export)
- US9 (P3): T028 (Health check monitoring)
- US10 (P3): T038 (Staging environment documentation)

**MVP Scope** (US1-US5): T001-T022, T024-T027, T028, T030, T032-T037 (34 tasks)
**Enhancement Scope** (US6-US8): T023, T029, T031 (3 tasks)
**Future Scope** (US9-US10): T028 (if deferred), T038-T039 (3 tasks)

**Estimated Duration**: 13-19 hours (MVP per spec.md)
