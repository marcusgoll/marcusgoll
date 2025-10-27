# Feature Specification: Dokploy Deployment Platform Integration

**Branch**: `feature/047-dokploy-deployment-platform`
**Created**: 2025-10-26
**Status**: Draft
**Feature Type**: Infrastructure Enhancement
**ICE Score**: Impact 3, Effort 3, Confidence 0.7, Score 0.7 (Medium Priority)

## User Scenarios

### Primary User Story

**As** Marcus (solo developer deploying marcusgoll.com),
**I want** a visual deployment platform that automates Docker management and provides monitoring dashboards,
**So that** I can spend less time on deployment mechanics and more time creating content and features.

### Acceptance Scenarios

1. **Given** I push code to the main branch on GitHub, **When** the webhook triggers, **Then** Dokploy automatically deploys the new version to production within 5 minutes with zero manual intervention.

2. **Given** a deployment fails, **When** I access the Dokploy UI at deploy.marcusgoll.com, **Then** I can see real-time logs, identify the error, and roll back to the previous deployment in under 5 minutes via one-click rollback.

3. **Given** I need to update environment variables, **When** I use the Dokploy UI, **Then** I can add/edit/delete environment variables without SSHing to the VPS, and the application restarts automatically with new values.

4. **Given** the production application is running, **When** I view the Dokploy monitoring dashboard, **Then** I see real-time CPU usage, memory consumption, network traffic, and application logs without SSH.

5. **Given** the migration to Dokploy is complete, **When** I access marcusgoll.com, **Then** the site functions identically to before migration with no downtime (or planned downtime < 30 minutes).

### Edge Cases

- **What happens when** Dokploy itself crashes or becomes unresponsive?
  - The Next.js application continues running (Docker containers independent)
  - Can SSH to VPS and manage Docker manually as fallback
  - Can restart Dokploy container or revert to pre-Dokploy setup

- **What happens when** database connection fails during Dokploy-managed deployment?
  - Dokploy should detect health check failure
  - Automatic rollback to previous working deployment
  - Alert sent via configured notification channel

- **What happens when** VPS runs out of disk space due to Docker images?
  - Dokploy provides disk usage monitoring and alerts
  - Can configure automatic cleanup of old images
  - Manual cleanup via Dokploy UI or CLI

- **What happens when** GitHub webhook fails or is misconfigured?
  - Dokploy UI shows webhook connection status
  - Can manually trigger deployment via UI
  - Webhook can be reconfigured or recreated

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer, I want Dokploy installed on my VPS with secure HTTPS access so that I can start configuring applications without SSH
  - **Acceptance**:
    - Dokploy accessible at https://deploy.marcusgoll.com
    - SSL certificate via Let's Encrypt
    - Admin account created with strong password
    - Basic auth or firewall restricting access to my IP
  - **Independent test**: Access deploy.marcusgoll.com, login succeeds, dashboard loads
  - **Effort**: S (2-3 hours)

- **US2** [P1]: As a developer, I want my Next.js application migrated to Dokploy management so that I can deploy via push-to-GitHub instead of manual commands
  - **Acceptance**:
    - Application configured in Dokploy with GitHub repository connected
    - Build settings match current Dockerfile (Node 20, Next.js 15)
    - Custom domain marcusgoll.com configured
    - Push to main branch triggers auto-deploy
  - **Independent test**: Push commit to main, deployment starts automatically, site updates within 5 minutes
  - **Effort**: M (4-6 hours)

- **US3** [P1]: As a developer, I want environment variables managed via Dokploy UI so that I don't need to SSH to the VPS for configuration changes
  - **Acceptance**:
    - All production secrets migrated to Dokploy UI
    - Variables categorized (database, API keys, public vars)
    - Application restarts automatically when variables change
    - Secrets masked in UI (not visible in plain text)
  - **Independent test**: Update DATABASE_URL via UI, app restarts, connection to database succeeds
  - **Effort**: S (2-3 hours)

- **US4** [P1]: As a developer, I want PostgreSQL database managed by Dokploy so that backups are automated and database monitoring is centralized
  - **Acceptance**:
    - Existing Supabase PostgreSQL imported to Dokploy
    - Daily automated backups configured (7-day retention)
    - Connection string available in Dokploy UI
    - Database monitoring shows CPU, memory, connections
  - **Independent test**: Trigger manual backup via UI, restore from backup succeeds, application connects to database
  - **Effort**: M (4-5 hours)

- **US5** [P1]: As a developer, I want one-click rollback capability so that I can quickly recover from bad deployments
  - **Acceptance**:
    - Dokploy UI shows deployment history (last 10 deployments)
    - Each deployment tagged with commit SHA and timestamp
    - Single-click rollback to any previous deployment
    - Rollback completes in < 5 minutes
  - **Independent test**: Deploy breaking change, click rollback, previous version live within 5 minutes
  - **Effort**: XS (1-2 hours, built-in Dokploy feature)

**Priority 2 (Enhancement)**

- **US6** [P2]: As a developer, I want GitHub webhook notifications so that I'm alerted when deployments succeed or fail
  - **Acceptance**:
    - Notification channel configured (Discord/Slack/Email)
    - Notifications sent on deployment start, success, failure
    - Failure notifications include error log snippet
  - **Depends on**: US2
  - **Independent test**: Trigger deployment, receive notification on success
  - **Effort**: XS (1-2 hours)

- **US7** [P2]: As a developer, I want real-time monitoring dashboard so that I can proactively identify performance issues
  - **Acceptance**:
    - Dashboard shows CPU, memory, network, disk usage
    - Application logs aggregated in searchable interface
    - Graphs show trends over 24 hours
    - Alerts configurable (e.g., CPU > 80% for 5 minutes)
  - **Depends on**: US2
  - **Independent test**: Generate load on site, see metrics update in real-time
  - **Effort**: S (2-3 hours, Dokploy built-in)

- **US8** [P2]: As a developer, I want Dokploy configuration version-controlled so that I can recreate setup if VPS is lost
  - **Acceptance**:
    - Dokploy CLI installed locally
    - Configuration exported as YAML/JSON
    - Configuration committed to Git (private repo or encrypted)
    - Documentation for restoring from config
  - **Depends on**: US1, US2, US3, US4
  - **Independent test**: Export config, delete Dokploy, reimport config, application restores
  - **Effort**: S (2-3 hours)

**Priority 3 (Nice-to-have)**

- **US9** [P3]: As a developer, I want health check monitoring so that unhealthy containers are automatically restarted
  - **Acceptance**:
    - Health check endpoint configured (e.g., /api/health)
    - Dokploy monitors endpoint every 30 seconds
    - Unhealthy container restarted automatically
    - Alert sent on health check failure
  - **Depends on**: US2
  - **Independent test**: Simulate crash, health check fails, container restarts within 1 minute
  - **Effort**: S (2-3 hours)

- **US10** [P3]: As a developer, I want staging environment pre-configured so that adding staging is one-click when traffic justifies it
  - **Acceptance**:
    - Dokploy multi-server support explored
    - Documentation for adding staging server
    - Template configuration for staging (subdomain, separate database)
    - Process documented in NOTES.md
  - **Depends on**: US1, US2, US3, US4
  - **Independent test**: Follow docs, staging environment added in < 30 minutes
  - **Effort**: M (4-5 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**Total MVP Effort**: 13-19 hours (US1-US5)
**Total Enhanced Effort**: 18-28 hours (US1-US8)
**Total Complete Effort**: 26-41 hours (US1-US10)

**MVP Strategy**:
Ship US1-US5 first (core deployment platform), validate in production for 2 weeks, then add US6-US8 (monitoring + notifications), defer US9-US10 (health checks + staging) until traffic justifies.

## Hypothesis

**Problem**: Current VPS deployment workflow is manual and lacks visibility
- **Evidence**:
  - Deployment requires SSH and manual Docker commands (manual `docker-compose up -d --force-recreate`)
  - No real-time monitoring (must SSH and run `docker stats`, `docker logs`)
  - Environment variable changes require SSH and container restart
  - Rollback requires identifying previous Docker image tag and manual commands
  - No visual interface for deployment status or logs
- **Impact**:
  - Developer (Marcus): 2-3 hours/month on manual deployment tasks
  - Risk: Manual commands prone to typos (experienced issue with wrong image tag)
  - Friction: Adding staging environment requires significant manual server setup
- **Measurement**: GitHub Actions logs show 100% manual deployments via SSH (no GUI)

**Solution**: Integrate Dokploy as self-hosted deployment platform
- **Change**:
  - Add Dokploy web UI on Hetzner VPS (deploy.marcusgoll.com)
  - Migrate Next.js app and PostgreSQL to Dokploy management
  - Connect GitHub webhooks for push-to-deploy
  - Configure monitoring and alerting via Dokploy UI
- **Mechanism**:
  - Dokploy abstracts Docker commands behind web UI (reduces manual errors)
  - GitHub webhooks trigger deployments automatically (removes manual step)
  - Built-in monitoring provides real-time visibility (no SSH needed)
  - One-click rollback reduces recovery time from 10 minutes to < 5 minutes
  - Multi-server support enables easy staging when traffic justifies (< 30 min setup)

**Prediction**: Dokploy will reduce deployment time and manual effort significantly
- **Primary metric**: Manual deployment time reduced from 10-15 min to < 5 min (automated)
- **Expected improvement**:
  - Time savings: ~60% reduction in deployment mechanics (from 2-3 hours/mo to < 1 hour/mo)
  - Error reduction: ~80% fewer manual deployment errors (GUI vs. SSH commands)
  - Rollback speed: ~50% faster recovery (from 10 min to < 5 min)
  - Future staging: 90% faster staging setup (< 30 min vs. 5+ hours manual)
- **Confidence**: Medium-High (0.7)
  - Dokploy is proven open-source platform (2K+ GitHub stars, active development)
  - Similar to known platforms (Vercel, Netlify, Heroku)
  - Risk: First-time using Dokploy (learning curve), but Docker experience mitigates
  - Evidence: Positive community feedback, well-documented

## Context Strategy & Signal Design

**System Prompt Altitude**: Implementation-focused (Docker, Nginx, database migration)
- Cue level: Detailed technical (SSH commands, Docker Compose, Dokploy API)
- Rationale: Infrastructure setup requires precision, not high-level strategy

**Tool Surface**: Essential DevOps tools
- SSH (VPS access)
- Docker CLI (container management)
- Dokploy UI (primary interface)
- Dokploy CLI (configuration export/import)
- Git (version control for configs)
- **Why token-efficient**: Built-in tools, no new frameworks

**Examples in Scope**:
1. Dokploy installation on Ubuntu (official docs)
2. Next.js deployment via Dokploy (community example)
3. PostgreSQL import to Dokploy (official docs)

**Context Budget**:
- Target: 50k tokens (planning phase)
- Compaction trigger: 40k tokens (80%)
- Strategy: Prioritize migration steps, defer monitoring details to implementation

**Retrieval Strategy**:
- JIT (Just-In-Time): Fetch Dokploy docs during implementation
- Upfront: Current VPS config (`docker-compose.prod.yml`, Nginx conf)
- Identifiers: Dokploy version (latest stable), Ubuntu version (check VPS)

**Memory Artifacts**:
- NOTES.md: Migration checklist, rollback procedures, Dokploy config backups
- Update cadence: After each phase (P1: Install, P2: Migrate, P3: CI/CD, P4: Monitor)

**Compaction Cadence**:
- Summaries every 3-4 implementation tasks (20+ tasks total)
- Preserve: Configuration values, error solutions, rollback commands

**Sub-agents**:
- None (straightforward DevOps, no specialized domains)

## Requirements

### Functional (testable only)

**Installation & Setup**
- **FR-001**: System MUST install Dokploy on Hetzner VPS without disrupting existing Next.js deployment
- **FR-002**: System MUST configure subdomain deploy.marcusgoll.com with HTTPS (Let's Encrypt SSL)
- **FR-003**: System MUST create secure admin account with password authentication
- **FR-004**: System MUST restrict Dokploy UI access to authorized IPs or basic auth

**Application Migration**
- **FR-005**: System MUST import existing Next.js application to Dokploy with identical build configuration (Node 20, Next.js 15)
- **FR-006**: System MUST connect Dokploy to GitHub repository (marcusgoll/marcusgoll) with webhook for push-to-deploy
- **FR-007**: System MUST configure custom domain (marcusgoll.com) to route to Dokploy-managed application
- **FR-008**: System MUST migrate all environment variables from VPS .env to Dokploy UI (DATABASE_URL, SUPABASE_*, API keys)
- **FR-009**: System MUST deploy application automatically when commits pushed to main branch

**Database Management**
- **FR-010**: System MUST import existing PostgreSQL database to Dokploy management
- **FR-011**: System MUST configure automated daily backups with 7-day retention
- **FR-012**: System MUST provide database connection string via Dokploy UI
- **FR-013**: System MUST allow manual backup triggers via Dokploy UI
- **FR-014**: System MUST support database restore from backup via Dokploy UI

**CI/CD Integration**
- **FR-015**: System MUST configure GitHub webhook to trigger Dokploy deployments on push to main
- **FR-016**: System MUST display deployment status (pending, building, deploying, success, failed) in Dokploy UI
- **FR-017**: System MUST provide real-time deployment logs viewable in Dokploy UI
- **FR-018**: System MUST send deployment notifications (success/failure) to configured channel (Discord/Email/Slack)

**Monitoring & Observability**
- **FR-019**: System MUST display real-time resource metrics (CPU, memory, network, disk) in Dokploy dashboard
- **FR-020**: System MUST aggregate application logs (stdout/stderr) in searchable interface
- **FR-021**: System MUST show historical metrics (24-hour graphs minimum)
- **FR-022**: System MUST allow configuring alerts for resource thresholds (e.g., CPU > 80%)

**Rollback & Recovery**
- **FR-023**: System MUST maintain deployment history (minimum 10 previous deployments)
- **FR-024**: System MUST tag each deployment with commit SHA and timestamp
- **FR-025**: System MUST provide one-click rollback to any previous deployment
- **FR-026**: System MUST complete rollback in under 5 minutes

**Configuration Management**
- **FR-027**: System MUST allow environment variable CRUD via Dokploy UI
- **FR-028**: System MUST mask sensitive environment variables in UI (show **** instead of plaintext)
- **FR-029**: System MUST restart application automatically when environment variables change
- **FR-030**: System MUST support exporting Dokploy configuration via CLI for version control

### Non-Functional

**Performance**
- **NFR-001**: Performance: Dokploy UI MUST respond to user actions within 2 seconds under normal load
- **NFR-002**: Performance: Deployment pipeline MUST complete build and deploy in under 7 minutes (current baseline)
- **NFR-003**: Performance: Dokploy overhead MUST NOT increase site response time by > 50ms (p95)
- **NFR-004**: Performance: Monitoring dashboard MUST update metrics within 5 seconds of change

**Security**
- **NFR-005**: Security: Dokploy UI MUST use HTTPS with valid SSL certificate (A+ SSL Labs rating)
- **NFR-006**: Security: Environment variables MUST be stored encrypted at rest
- **NFR-007**: Security: Admin access MUST require strong password (12+ characters, complexity rules)
- **NFR-008**: Security: Database connection strings MUST NOT be exposed in logs or UI

**Reliability**
- **NFR-009**: Reliability: System MUST maintain 99.9% uptime for Dokploy UI (exclude scheduled maintenance)
- **NFR-010**: Reliability: Deployment failures MUST NOT affect running production application
- **NFR-011**: Reliability: Automated backups MUST succeed 99% of the time (alert on failure)
- **NFR-012**: Reliability: Rollback MUST succeed 100% of the time (no partial rollbacks)

**Usability**
- **NFR-013**: Usability: Dokploy UI MUST be accessible via mobile browser (responsive design)
- **NFR-014**: Usability: Deployment logs MUST be color-coded (error: red, warning: yellow, info: white)
- **NFR-015**: Usability: Configuration changes MUST provide confirmation prompt before applying
- **NFR-016**: Usability: Error messages MUST include actionable remediation steps

**Maintainability**
- **NFR-017**: Maintainability: Dokploy configuration MUST be exportable as YAML/JSON for version control
- **NFR-018**: Maintainability: Migration from Dokploy to manual Docker MUST be possible (no vendor lock-in)
- **NFR-019**: Maintainability: Documentation MUST include step-by-step rollback to pre-Dokploy state
- **NFR-020**: Maintainability: All secrets MUST be separate from code (no hardcoded credentials)

**Resource Constraints**
- **NFR-021**: Resources: Dokploy MUST run within 500MB RAM overhead (current VPS: 4-8GB total)
- **NFR-022**: Resources: Dokploy MUST use < 10% CPU during idle (allow VPS for app workload)
- **NFR-023**: Resources: Dokploy disk usage MUST NOT exceed 5GB (including Docker images retention)

### Key Entities (if data involved)

- **Application**: Next.js app, configuration (build settings, env vars, domain), deployment history
- **Database**: PostgreSQL instance, connection string, backup schedule, restore points
- **Deployment**: Commit SHA, timestamp, status (pending/building/success/failed), logs, rollback capability
- **Environment Variable**: Key, value (encrypted), scope (app/database), last updated timestamp
- **Backup**: Database snapshot, timestamp, size, retention policy (7 days)
- **Monitoring Metric**: Resource type (CPU/memory/network/disk), value, timestamp, alert threshold

## Deployment Considerations

### Platform Dependencies

**Hetzner VPS**:
- Docker installed (already present)
- Docker Compose installed (already present)
- Nginx installed (already present)
- Subdomain DNS record (deploy.marcusgoll.com → VPS IP)
- Port 3000 available for Dokploy UI (currently unused)

**New Requirements**:
- Dokploy Docker container (installed via official script)
- Dokploy data volume (persistent storage for configs/backups)
- Let's Encrypt SSL cert for deploy.marcusgoll.com (via Dokploy or Nginx)

**No Changes Required**:
- Dockerfile (can reuse existing)
- GitHub Actions (can keep or transition to Dokploy-managed)
- Existing Nginx config (will add proxy rule for Dokploy subdomain)

### Environment Variables

**New Required Variables** (Dokploy Configuration):
- `DOKPLOY_ADMIN_PASSWORD`: Admin password for Dokploy UI (generated during setup)
- `DOKPLOY_SECRET_KEY`: Encryption key for secrets (auto-generated)
- `DOKPLOY_DOMAIN`: deploy.marcusgoll.com (subdomain for UI)

**Migrated Variables** (from VPS .env to Dokploy UI):
- `DATABASE_URL`: PostgreSQL connection (currently in VPS .env)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API endpoint (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key (public)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role (secret)
- `RESEND_API_KEY` or `MAILGUN_API_KEY`: Newsletter email API (secret)
- `NEWSLETTER_FROM_EMAIL`: Verified sender email (public)
- `GA4_MEASUREMENT_ID`: Google Analytics (public)

**No Changed Variables**: All variables maintain same keys/values, just stored in Dokploy instead of .env file

**Schema Update Required**: No (environment variable schema documented in docs, not version-controlled)

### Breaking Changes

**No Breaking Changes**:
- Dokploy is deployment platform abstraction (no code changes)
- Application code remains identical
- API contracts unchanged
- Database schema unchanged
- User-facing site unchanged

**Deployment Platform Change**:
- From: Manual Docker Compose + GitHub Actions SSH
- To: Dokploy-managed deployment + GitHub webhooks
- Impact: Internal only (no end-user visible changes)

**Client Compatibility**: N/A (no client-side changes)

### Migration Requirements

**No Database Migrations**:
- Database structure unchanged
- Only migration is operational (import to Dokploy management)

**No Data Backfill**:
- No new data models
- Existing data remains untouched

**No RLS Policy Changes**:
- Database access patterns unchanged
- Same connection string, same permissions

**Reversibility**: Fully reversible
- Keep old docker-compose.prod.yml for 7 days
- Can revert Nginx config to point to old Docker setup
- Dokploy is abstraction (can extract Docker configs if needed)
- No data loss risk (database stays in place)

### Rollback Considerations

**Standard Rollback**: No (new platform, different rollback procedure)

**Dokploy-Specific Rollback**:
- **Pre-Migration Rollback** (if issues during setup):
  - Stop Dokploy container
  - Revert Nginx config
  - Restart old docker-compose setup
  - Duration: < 10 minutes

- **Post-Migration Rollback** (if issues after cutover):
  - Update Nginx to point to old Docker setup
  - Restart old docker-compose containers
  - Investigate Dokploy issue separately
  - Duration: < 15 minutes

- **Full Removal** (if Dokploy abandoned):
  - Export application configs from Dokploy
  - Stop and remove Dokploy container
  - Recreate docker-compose.prod.yml from Dokploy config
  - Duration: 1-2 hours (manual recreation)

**Deployment Metadata**:
- Store Dokploy configs in `specs/047-dokploy-deployment-platform/configs/`
- Document pre-Dokploy Docker setup in NOTES.md (for rollback reference)
- Take VPS snapshot before Dokploy installation (Hetzner backup feature)

---

## Success Criteria (HEART Framework)

> **Purpose**: Define measurable success using Google HEART framework.
> **Constraint**: All metrics MUST be Claude Code-measurable (deployment logs, VPS metrics, time tracking).

| Dimension | Goal | Signal | Metric | Target | Measurement Source |
|-----------|------|--------|--------|--------|-------------------|
| **Happiness** | Reduce deployment friction | Manual errors eliminated | Deployment error rate | < 5% (vs. current ~10% manual errors) | Deployment logs (success/failure ratio) |
| **Engagement** | Increase deployment frequency | More frequent deploys | Deployments per week | 3-5 (vs. current 1-2/week) | Dokploy deployment history |
| **Adoption** | Developer adopts Dokploy | Daily UI access | Dokploy UI logins/week | 5-7 (daily checks) | Nginx access logs for deploy.marcusgoll.com |
| **Retention** | Continued Dokploy use | No reversion to manual | Weeks using Dokploy | 8+ weeks without reverting | NOTES.md tracking |
| **Task Success** | Successful deployments | Deploy completes | Deployment success rate | 95%+ successful deploys | Deployment logs |

**Performance Targets** (from `design/systems/budgets.md` and `constitution.md`):
- Site performance unchanged: Lighthouse ≥85, FCP <1.5s, LCP <2.5s (no regression)
- Deployment speed maintained: <7 minutes build+deploy (current baseline)
- Dokploy UI responsive: Page load <2s, actions complete <2s

**Measurement Plan**: See Measurement Plan section below for detailed queries and log analysis.

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: Deployment logs, VPS metrics (via Dokploy API or SSH), Nginx logs, time tracking.

### Data Collection

**Deployment Metrics** (Dokploy deployment logs):
- Track via: Dokploy API (`GET /api/deployments`) or deployment history CSV export
- Collect: Deployment status (success/failed), duration, timestamp, commit SHA

**Key Events to Track**:
1. `deployment.started` - Timestamp when deployment begins
2. `deployment.completed` - Timestamp when deployment succeeds
3. `deployment.failed` - Timestamp and error message when deployment fails
4. `rollback.triggered` - Timestamp when rollback initiated
5. `environment.changed` - Timestamp when env var updated

**Resource Metrics** (Dokploy monitoring API):
- Track via: Dokploy monitoring dashboard export or Prometheus metrics
- Collect: CPU usage (%), memory usage (MB), disk usage (GB), network I/O (MB/s)

**UI Access Metrics** (Nginx access logs):
- Track via: `grep "deploy.marcusgoll.com" /var/log/nginx/access.log`
- Collect: Login events, page views, timestamp

### Measurement Queries

**Deployment Success Rate** (via Dokploy API or logs):
```bash
# Calculate success rate from deployment history
dokploy deployments list --format json | jq '
  {
    total: length,
    successful: [.[] | select(.status == "success")] | length,
    failed: [.[] | select(.status == "failed")] | length,
    success_rate: (([.[] | select(.status == "success")] | length) * 100.0 / length)
  }
'
```

**Deployment Frequency** (via Dokploy API):
```bash
# Count deployments per week
dokploy deployments list --since "7 days ago" --format json | jq 'length'
```

**Deployment Duration** (via Dokploy logs):
```bash
# Calculate median deployment time
dokploy deployments list --format json | jq -r '
  [.[] | select(.status == "success") | .duration] |
  sort |
  .[length/2 | floor]
'
```

**UI Access Frequency** (via Nginx logs):
```bash
# Count unique login sessions per week
grep "deploy.marcusgoll.com" /var/log/nginx/access.log.1 | \
  grep "POST /api/login" | \
  wc -l
```

**Resource Overhead** (via Dokploy monitoring):
```bash
# Check Dokploy container resource usage
docker stats dokploy --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}"
```

**Error Rate** (via deployment logs):
```bash
# Calculate deployment error rate
errors=$(dokploy deployments list --status failed --format json | jq 'length')
total=$(dokploy deployments list --format json | jq 'length')
echo "scale=2; ($errors * 100) / $total" | bc
```

### Experiment Design (A/B Test)

**Not Applicable**: This is an internal infrastructure improvement, not a user-facing feature. No A/B test needed.

**Validation Approach**:
- Deploy Dokploy to production
- Monitor for 2 weeks
- Compare metrics before/after:
  - Deployment time (before: manual tracking, after: Dokploy logs)
  - Deployment frequency (before: GitHub Actions logs, after: Dokploy history)
  - Error rate (before: manual error tracking, after: Dokploy logs)
  - Time spent on deployments (before: time tracking, after: time tracking)

**Rollback Criteria**:
- If Dokploy overhead > 500MB RAM → investigate optimization or rollback
- If deployment failure rate > 20% → investigate issues or rollback
- If site performance degrades > 10% (Lighthouse score drop) → rollback
- If > 3 critical bugs in first week → rollback and reassess

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers (all requirements clear)
- [x] Constitution aligned (self-hosted, cost-effective, DevOps learning)
- [x] No implementation details (no specific Dokploy versions, Docker commands in spec)

### Conditional: Success Metrics (Infrastructure improvement)
- [x] HEART metrics defined with Claude Code-measurable sources (deployment logs, Dokploy API, Nginx logs)
- [x] Hypothesis stated (Problem → Solution → Prediction with magnitude)

### Conditional: UI Features (Skip - no end-user UI)
- [N/A] All screens identified with states (not applicable - infrastructure only)
- [N/A] System components from ui-inventory.md planned (not applicable - no UI components)

### Conditional: Deployment Impact (Infrastructure change)
- [x] Breaking changes identified (none - abstraction layer only)
- [x] Environment variables documented (migrated variables listed, new Dokploy variables specified)
- [x] Rollback plan specified (pre-migration, post-migration, full removal procedures documented)

**Ready for `/plan`**: All quality gates passed.

---

## Out of Scope (for MVP)

The following features are explicitly excluded from the initial implementation:

**Excluded Features**:
1. **Docker Swarm clustering** - Single VPS sufficient for current traffic (< 10K visitors/mo)
2. **Multi-region deployments** - Overkill for current scale, consider when traffic > 50K/mo
3. **Advanced role-based access control (RBAC)** - Solo developer, no team access needed
4. **Migrating to managed Dokploy cloud** - Self-hosted preferred for cost and learning
5. **Custom Dokploy UI modifications/plugins** - Use vanilla Dokploy, avoid customization complexity
6. **Staging environment** - Defer to Phase 5 (when traffic > 10K/mo justifies it)
7. **Automated performance testing in pipeline** - Lighthouse checks remain manual for now
8. **Integration with external monitoring (Datadog/Grafana)** - Dokploy built-in monitoring sufficient
9. **Custom backup retention policies** - 7-day retention sufficient for MVP
10. **Multi-application management** - Focus on marcusgoll.com only (can add later)

**Rationale**:
- MVP focuses on core deployment automation and monitoring
- Excluded features add complexity without immediate value
- Can be added incrementally after validating MVP (2+ weeks in production)

**Future Consideration**:
- Review excluded features quarterly
- Add staging (US10) when traffic > 10K/mo
- Add RBAC if team size > 1
- Add advanced monitoring if Dokploy built-in proves insufficient

---

## Appendices

### Appendix A: Dokploy vs. Alternatives

| Platform | Cost | Self-Hosted | Learning Curve | Community | Verdict |
|----------|------|-------------|----------------|-----------|---------|
| **Dokploy** | $0 | ✅ Yes | Medium | Active (2K+ stars) | ✅ **Chosen** |
| Coolify | $0 | ✅ Yes | Medium | Active (3K+ stars) | Alternative |
| CapRover | $0 | ✅ Yes | Low | Mature (10K+ stars) | Alternative |
| Vercel | $20+/mo | ❌ No | Low | Huge | Too expensive |
| Netlify | $19+/mo | ❌ No | Low | Large | Too expensive |
| Railway | $5+/mo | ❌ No | Low | Growing | Vendor lock-in |

**Dokploy Chosen Because**:
- Self-hosted (aligns with constitution: no vendor lock-in)
- Modern UI (similar to Vercel/Netlify)
- Active development (frequent updates)
- Docker-based (fits existing infrastructure)
- Multi-server support (enables staging later)

### Appendix B: Migration Checklist

**Pre-Migration** (preparation):
- [ ] Take VPS snapshot (Hetzner backup)
- [ ] Document current docker-compose.prod.yml
- [ ] Export current environment variables
- [ ] Test Dokploy on local VM (validate installation)
- [ ] Schedule migration window (optional 30-min downtime)

**Migration** (execution):
- [ ] Install Dokploy on VPS
- [ ] Configure deploy.marcusgoll.com subdomain
- [ ] Set up admin account and basic auth
- [ ] Import Next.js app to Dokploy (test subdomain)
- [ ] Import PostgreSQL to Dokploy management
- [ ] Migrate environment variables to Dokploy UI
- [ ] Test deployment via Dokploy (test subdomain)
- [ ] Update Nginx to route marcusgoll.com to Dokploy
- [ ] Monitor for 24 hours

**Post-Migration** (validation):
- [ ] Verify site functionality (homepage, posts, newsletter)
- [ ] Test deployment via push to main
- [ ] Test rollback capability
- [ ] Verify backups running
- [ ] Monitor resource usage (CPU, memory)
- [ ] Document any issues in NOTES.md
- [ ] After 7 days: Remove old docker-compose setup

### Appendix C: Rollback Runbook

**If Dokploy fails during setup** (pre-cutover):
```bash
# Stop Dokploy
docker stop dokploy

# No changes to production needed (old setup still running)
# Investigate issues, retry installation
```

**If Dokploy fails after cutover** (production affected):
```bash
# Revert Nginx config
sudo cp /etc/nginx/sites-available/marcusgoll.backup /etc/nginx/sites-available/marcusgoll
sudo nginx -t && sudo systemctl reload nginx

# Restart old docker-compose
cd /opt/marcusgoll
docker-compose -f docker-compose.prod.yml up -d

# Verify site is back
curl https://marcusgoll.com
```

**If full Dokploy removal needed**:
```bash
# Export configs
dokploy export --output /backup/dokploy-config.yaml

# Stop and remove Dokploy
docker stop dokploy && docker rm dokploy

# Recreate docker-compose from backup
cp /backup/docker-compose.prod.yml /opt/marcusgoll/
docker-compose -f docker-compose.prod.yml up -d

# Document removal reason in NOTES.md
```

### Appendix D: Reference Links

**Official Documentation**:
- Dokploy Website: https://dokploy.com/
- Dokploy GitHub: https://github.com/Dokploy/dokploy
- Dokploy Docs: https://docs.dokploy.com/

**Internal Documentation**:
- Deployment Strategy: `docs/project/deployment-strategy.md`
- Tech Stack: `docs/project/tech-stack.md`
- Constitution: `.spec-flow/memory/constitution.md`
- Current Docker Setup: `docker-compose.prod.yml`

**Related Features**:
- GitHub Issue #47: Original feature request
- Previous deployment improvements: Feature 002 (VPS deployment)
