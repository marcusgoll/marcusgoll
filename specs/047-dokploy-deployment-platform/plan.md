# Implementation Plan: Dokploy Deployment Platform Integration

## [RESEARCH DECISIONS]

See: `research.md` for full research findings

**Summary**:
- Stack: Dokploy (self-hosted deployment platform), reuse existing Docker + Nginx
- Components to reuse: 8 (Dockerfile, docker-compose.prod.yml, deploy.sh logic, Nginx, SSL, health checks, env schema, CI/CD structure)
- New components needed: 6 (Dokploy install, app config, database import, Nginx subdomain, GitHub webhook, CLI export)
- Project docs: Fully integrated with all 8 docs from `docs/project/`

---

## [ARCHITECTURE DECISIONS]

### Stack

**Deployment Platform**: Dokploy (open-source, self-hosted)
- **Version**: Latest stable (auto-updated via official installer)
- **Installation**: Official script (`curl -sSL https://dokploy.com/install.sh | sh`)
- **Storage**: VPS local disk for configs/backups, Docker volumes for Dokploy data
- **UI**: Web-based (deploy.marcusgoll.com), HTTPS via Let's Encrypt

**Infrastructure** (unchanged):
- **VPS**: Hetzner (178.156.129.179), 4-8GB RAM, 2-4 vCPUs, Docker + Docker Compose
- **Web Server**: Nginx (reverse proxy for Dokploy subdomain + application)
- **Application**: Next.js 15.5.6, Node 20, Docker containerized
- **Database**: PostgreSQL 15+ via Supabase (self-hosted)
- **CI/CD**: GitHub Actions (verify build) + Dokploy webhooks (deploy)

### Patterns

**Zero-Downtime Migration**:
- **Pattern**: Blue-Green deployment at infrastructure level
- **Description**: Install Dokploy in parallel (port 3000), configure and test on subdomain, cutover Nginx routing
- **Rationale**: Current production stays untouched during Dokploy setup, minimizes risk
- **Rollback**: Revert Nginx config, restart old docker-compose (< 10 minutes)

**Configuration as Code**:
- **Pattern**: Export Dokploy config as version-controlled YAML
- **Description**: Use Dokploy CLI to export application/database configs, commit to Git
- **Rationale**: Disaster recovery (recreate setup if VPS lost), audit trail, reproducibility
- **Source**: spec.md US8, constitution.md Documentation Standards

**Incremental Validation**:
- **Pattern**: Test on subdomain before production cutover
- **Description**: Deploy to test.marcusgoll.com first, validate functionality, then switch marcusgoll.com
- **Rationale**: Catch issues before affecting production traffic, safe testing environment
- **Source**: spec.md Migration Strategy (Phase 3: Validation)

**Environment Variable Migration**:
- **Pattern**: Copy from .env file → Dokploy UI (one-time), delete .env after validation
- **Description**: Manual transfer of secrets via UI, encrypted storage in Dokploy
- **Rationale**: Centralized management, no SSH needed for updates, audit trail
- **Source**: spec.md FR-027, deployment-strategy.md Secrets Management

### Dependencies

**New Packages Required**: None (Dokploy is standalone Docker container)

**VPS Dependencies** (verify):
- Docker >= 20.10
- Docker Compose >= 2.0
- Nginx >= 1.18
- Certbot (Let's Encrypt CLI)

**External Services** (unchanged):
- Supabase PostgreSQL (existing DATABASE_URL)
- Resend/Mailgun (newsletter API)
- Google Analytics 4 (tracking)

---

## [STRUCTURE]

**Directory Layout** (Git repository):

```
marcusgoll/
├── specs/047-dokploy-deployment-platform/
│   ├── spec.md                           # Feature specification
│   ├── NOTES.md                          # Implementation journal
│   ├── plan.md                           # This file
│   ├── research.md                       # Research decisions
│   ├── data-model.md                     # Entity definitions (minimal)
│   ├── quickstart.md                     # Integration scenarios
│   ├── tasks.md                          # Implementation tasks (from /tasks)
│   ├── contracts/                        # Empty (no API contracts)
│   └── configs/
│       ├── dokploy-config.yaml           # Exported Dokploy config (US8)
│       ├── nginx-dokploy-subdomain.conf  # Nginx config for deploy.marcusgoll.com
│       └── pre-migration-backup/
│           ├── docker-compose.prod.yml.backup
│           ├── deploy.sh.backup
│           └── env.production.backup     # Sanitized (no secrets)
├── Dockerfile                            # Existing (reused)
├── docker-compose.prod.yml               # Existing (imported to Dokploy)
├── deploy.sh                             # Existing (deprecated after migration)
└── .github/workflows/
    └── deploy-production.yml             # Update to trigger Dokploy webhook
```

**VPS File System** (changes):

```
/etc/nginx/sites-available/
├── marcusgoll                   # Existing (update proxy_pass to Dokploy)
└── dokploy                      # New (subdomain for Dokploy UI)

/opt/dokploy/                    # Dokploy installation directory
├── docker-compose.yml           # Dokploy's own compose file
├── data/                        # Dokploy internal database (SQLite)
└── backups/                     # Automated database backups (7-day retention)

/opt/marcusgoll/                 # Old manual setup (keep for 7 days)
├── docker-compose.prod.yml      # Backup
└── .env.production              # Backup (delete after validation)
```

**Module Organization**:
- **Dokploy Container**: Orchestrates application deployment, self-contained
- **Next.js Application**: Managed by Dokploy, Docker-based (reuse existing Dockerfile)
- **PostgreSQL Database**: External (Supabase), connection managed by Dokploy
- **Nginx**: Routes traffic (marcusgoll.com → Dokploy app, deploy.marcusgoll.com → Dokploy UI)

---

## [DATA MODEL]

See: `data-model.md` for complete entity definitions

**Summary**:
- **Application entities**: No changes (Dokploy is infrastructure layer)
- **Dokploy internal entities**: Application, Deployment, EnvironmentVariable, DatabaseBackup (not in application database)
- **Migrations required**: None (no schema changes)

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- **NFR-001**: Dokploy UI response time <2 seconds (UI interactions)
- **NFR-002**: Deployment duration <7 minutes (current baseline maintained)
- **NFR-003**: Site response time unchanged (no >50ms regression at p95)
- **NFR-004**: Monitoring dashboard updates within 5 seconds

**Resource Constraints** (from spec.md NFRs):
- **NFR-021**: Dokploy RAM overhead <500MB (VPS has 4-8GB total)
- **NFR-022**: Dokploy CPU usage <10% during idle
- **NFR-023**: Dokploy disk usage <5GB (Docker images + backups)

**Lighthouse Targets** (from constitution.md, capacity-planning.md):
- Performance: ≥85 (no regression)
- Accessibility: ≥95
- FCP: <1.5s (unchanged)
- LCP: <2.5s (unchanged)

**Measurement**:
- VPS metrics: `docker stats dokploy --no-stream` (verify overhead)
- Deployment time: Dokploy deployment logs (build + deploy duration)
- Site performance: Lighthouse audit pre/post-migration (compare scores)

---

## [SECURITY]

### Authentication Strategy

**Dokploy Admin Access**:
- Method: Username/password authentication (generated during installation)
- Protected: HTTPS only (Let's Encrypt SSL for deploy.marcusgoll.com)
- IP Restriction (optional): Configure Nginx allow/deny rules for specific IPs
- MFA: Not available in Dokploy (use strong password, 16+ characters)

**Application Authentication**:
- No changes (public blog, no authentication)
- Future: Clerk or NextAuth (separate feature)

### Authorization Model

**Dokploy Admin**: Full control (solo developer, no RBAC needed)
- Can deploy applications
- Can configure databases
- Can view logs and metrics
- Can rollback deployments

**Application**: Public access (no authorization)

### Input Validation

**Dokploy UI**:
- Form validation for configuration fields (e.g., repository URL, domain name)
- Environment variable validation (key format, no special characters)

**GitHub Webhook**:
- Webhook secret validation (HMAC signature verification)
- Rate limiting: Dokploy built-in (prevents DoS)

**CORS**: Not applicable (Dokploy UI same-origin, application unchanged)

### Data Protection

**Environment Variables**:
- Encrypted at rest (Dokploy internal database encryption per NFR-006)
- Masked in UI (show ******, not plaintext per FR-028)
- Secrets not in logs or responses (per NFR-008)

**Database Connection Strings**:
- Stored encrypted in Dokploy
- Not exposed in deployment logs
- Backup files encrypted if on external storage (future S3 option)

**SSL/TLS**:
- All traffic HTTPS (Let's Encrypt for deploy.marcusgoll.com and marcusgoll.com)
- SSL Labs rating: A+ target (per NFR-005)

---

## [EXISTING INFRASTRUCTURE - REUSE] (8 components)

### Docker & Containerization

**Reuse: Dockerfile** (`/Dockerfile`, 89 lines)
- **Purpose**: Multi-stage build for Next.js application
- **Pattern**: base (dependencies) → builder (build) → production (minimal image)
- **Why Reuse**: Already optimized (Node 20 Alpine, non-root user, health check)
- **Integration**: Import to Dokploy as build method (Dockerfile option vs. Nixpacks)
- **REUSE: D:\Coding\marcusgoll\Dockerfile:1-89 - Multi-stage Next.js build**

**Reuse: docker-compose.prod.yml** (`/docker-compose.prod.yml`, 78 lines)
- **Purpose**: Production container orchestration with health checks, resource limits, logging
- **Why Reuse**: Proven configuration (running in production), Docker Compose import supported by Dokploy
- **Integration**: Import via Dokploy's "Docker Compose" deployment method (alternative to Dockerfile)
- **Decision**: Prefer Dockerfile import (simpler) unless compose-specific features needed
- **REUSE: D:\Coding\marcusgoll\docker-compose.prod.yml:1-78 - Production orchestration config**

### Deployment & CI/CD

**Reuse: deploy.sh logic** (`/deploy.sh`, 68 lines)
- **Purpose**: Deployment workflow (git pull, npm install, build, PM2 restart)
- **Why Reuse**: Logic migrates to Dokploy workflow (git pull → build → deploy)
- **Integration**: Dokploy GitHub webhook replicates this workflow automatically
- **Deprecation**: Script kept for 7 days post-migration, then archived
- **REUSE: D:\Coding\marcusgoll\deploy.sh:1-68 - Deployment workflow pattern**

**Reuse: GitHub Actions CI** (`.github/workflows/deploy-production.yml`, 55 lines)
- **Purpose**: Automated build verification (lint, type-check, build)
- **Why Reuse**: Verify step still valuable (catch errors before Dokploy deploys)
- **Integration**: Keep verify workflow, update deploy workflow to trigger Dokploy webhook
- **Change**: Replace SSH deployment with webhook POST request
- **REUSE: D:\Coding\marcusgoll\.github\workflows\deploy-production.yml:1-55 - CI pipeline structure**

### Infrastructure & Networking

**Reuse: Nginx reverse proxy** (inferred from deployment-strategy.md)
- **Purpose**: Routes traffic, SSL termination, load balancing
- **Current**: Proxies marcusgoll.com to localhost:3000 (Docker container)
- **Integration**: Add new upstream for deploy.marcusgoll.com (Dokploy UI on port 3000)
- **Change**: Update marcusgoll.com proxy_pass to Dokploy-managed container (different port)
- **REUSE: /etc/nginx/sites-available/marcusgoll - Existing reverse proxy setup**

**Reuse: Let's Encrypt SSL** (managed via Certbot)
- **Purpose**: HTTPS certificates for domains
- **Current**: SSL for marcusgoll.com and www.marcusgoll.com
- **Integration**: Run certbot for deploy.marcusgoll.com (new subdomain)
- **Pattern**: `sudo certbot --nginx -d deploy.marcusgoll.com`
- **REUSE: Certbot SSL provisioning pattern**

### Monitoring & Health

**Reuse: Health check endpoint** (`/api/health` referenced in docker-compose.prod.yml:38)
- **Purpose**: Container health monitoring (Docker restart if unhealthy)
- **Integration**: Configure Dokploy health check to use same endpoint
- **Pattern**: HTTP GET `/api/health` → expect 200 OK
- **REUSE: /api/health endpoint - Container health monitoring**

### Configuration & Secrets

**Reuse: Environment variable schema** (from deploy-production.yml:32-37)
- **Current Variables**:
  - DATABASE_URL (PostgreSQL connection)
  - NEXTAUTH_SECRET (future auth, may not be used yet)
  - NEXTAUTH_URL (future auth)
  - RESEND_API_KEY (newsletter)
  - ADMIN_EMAIL (notifications)
  - NEXT_PUBLIC_* (public vars)
- **Integration**: Migrate to Dokploy UI (Environment Variables section)
- **Process**: Manual copy-paste from VPS .env.production → Dokploy UI
- **REUSE: Environment variable schema and naming conventions**

---

## [NEW INFRASTRUCTURE - CREATE] (6 components)

### Dokploy Installation

**New: Dokploy Docker container**
- **Purpose**: Self-hosted deployment platform (core component)
- **Installation**: Official script (`curl -sSL https://dokploy.com/install.sh | sh`)
- **Configuration**:
  - Port: 3000 (UI), other ports internal
  - Storage: Docker volumes for Dokploy data, VPS disk for backups
  - Admin: Auto-generated credentials (save securely)
- **Resource**: ~500MB RAM, <10% CPU idle (per NFR-021, NFR-022)
- **NEW: Dokploy container orchestration platform**

### Application Configuration

**New: Dokploy application import**
- **Purpose**: Configure Next.js app in Dokploy management
- **Steps**:
  1. Connect GitHub repository (OAuth)
  2. Select branch (main)
  3. Choose build method (Dockerfile)
  4. Configure domains (test.marcusgoll.com, then marcusgoll.com)
  5. Add environment variables (migrate from .env)
- **Result**: Application managed by Dokploy, auto-deploys on push
- **NEW: Dokploy application configuration for Next.js**

### Database Management

**New: Dokploy database import**
- **Purpose**: Centralize database connection management and backups
- **Configuration**:
  - Type: External PostgreSQL (Supabase)
  - Connection String: DATABASE_URL from .env.production
  - Backup Schedule: Daily at 2:00 AM UTC (7-day retention per FR-011)
  - Storage: VPS local disk (`/opt/dokploy/backups/`)
- **Result**: Automated backups, backup restore UI, connection monitoring
- **NEW: Dokploy database management configuration**

### Nginx Subdomain

**New: Nginx configuration for deploy.marcusgoll.com**
- **Purpose**: Expose Dokploy UI securely via subdomain
- **File**: `/etc/nginx/sites-available/dokploy`
- **Configuration**:
  ```nginx
  server {
      listen 80;
      listen [::]:80;
      server_name deploy.marcusgoll.com;

      location / {
          proxy_pass http://localhost:3000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
      }
  }
  ```
- **SSL**: Let's Encrypt via Certbot (`sudo certbot --nginx -d deploy.marcusgoll.com`)
- **NEW: specs/047-dokploy-deployment-platform/configs/nginx-dokploy-subdomain.conf**

### CI/CD Integration

**New: GitHub webhook configuration**
- **Purpose**: Trigger Dokploy deployment on push to main
- **Setup**:
  - Dokploy generates webhook URL (in Application → Settings)
  - Add to GitHub repository webhook (Settings → Webhooks)
  - Configure: Push events on main branch only
  - Secret: Webhook signature for validation
- **Result**: Push to main → Dokploy receives webhook → auto-deploy
- **Replaces**: SSH-based deployment in GitHub Actions
- **NEW: GitHub → Dokploy webhook integration**

### Configuration Export

**New: Dokploy CLI configuration export**
- **Purpose**: Disaster recovery, version-controlled infrastructure as code
- **Process**:
  - Install Dokploy CLI locally (`npm install -g @dokploy/cli`)
  - Authenticate (`dokploy login`)
  - Export config (`dokploy export --output configs/dokploy-config.yaml`)
  - Commit to Git (sanitize secrets first)
- **Use Case**: Recreate Dokploy setup on new VPS if disaster (per US8)
- **NEW: specs/047-dokploy-deployment-platform/configs/dokploy-config.yaml**

---

## [CI/CD IMPACT]

**From spec.md deployment considerations**:

### Platform Change

**From**: Manual Docker Compose + GitHub Actions SSH
- GitHub Actions builds + SSHs to VPS
- Runs `deploy.sh` script on VPS
- Manual Docker container restart

**To**: Dokploy-managed deployment + GitHub webhooks
- GitHub Actions verifies build (lint, type-check)
- GitHub webhook triggers Dokploy
- Dokploy handles build + deploy automatically
- **Impact**: Internal workflow change only (no end-user visible changes)

### Environment Variables

**New Required Variables** (Dokploy Configuration, not in application):
- `DOKPLOY_ADMIN_PASSWORD`: Admin password for Dokploy UI (generated during setup, stored securely)
- `DOKPLOY_SECRET_KEY`: Encryption key for secrets (auto-generated by installer)
- `DOKPLOY_DOMAIN`: deploy.marcusgoll.com (subdomain for UI)

**Migrated Variables** (from VPS .env.production to Dokploy UI):
- All existing application variables (see [EXISTING INFRASTRUCTURE - REUSE] section)
- No schema changes, same keys/values
- Just stored in Dokploy instead of .env file

**Schema Update Required**: No (environment variables not version-controlled in schema file)

**Process**:
1. Read current variables from VPS: `cat /opt/marcusgoll/.env.production`
2. Copy values to Dokploy UI (Application → Environment Variables)
3. Validate application works with Dokploy-managed variables
4. Delete .env.production after 7-day validation period

### Breaking Changes

**No Breaking Changes**:
- Dokploy is deployment platform abstraction (no code changes)
- Application code remains identical (same Dockerfile, same Next.js app)
- API contracts unchanged (no API changes)
- Database schema unchanged (no migrations)
- User-facing site unchanged (same marcusgoll.com domain)

**Internal-Only Changes**:
- Deployment workflow (manual SSH → Dokploy UI/webhook)
- Environment variable storage (VPS .env → Dokploy UI)
- Backup management (manual → Dokploy automated)

**Client Compatibility**: N/A (no client-side changes)

### Migration Requirements

**No Database Migrations**: Database structure unchanged

**No Data Backfill**: No new data models

**No RLS Policy Changes**: Database access patterns unchanged

**Reversibility**: Fully reversible
- **Method**: Revert Nginx config, restart old docker-compose setup
- **Duration**: < 15 minutes
- **Data Loss**: None (database stays in place, application code unchanged)
- **Backup Strategy**: VPS snapshot before Dokploy installation, keep old docker-compose for 7 days

### Build Commands

**Before** (manual):
```bash
git pull origin main
npm install
npm run build
pm2 restart marcusgoll
```

**After** (Dokploy automated):
- Build command: `npm run build` (configured in Dokploy)
- Start command: `npm run start`
- Triggered: Automatically on push to main (GitHub webhook)

**Change**: Manual commands replaced by Dokploy automation (no new flags or experimental features)

### Database Migrations

**No Migrations Required**:
- Dokploy operates at infrastructure layer (no schema changes)
- Database remains Supabase PostgreSQL (same connection string)
- Prisma migrations unchanged (still run on container startup)

### Smoke Tests

**Existing** (from docker-compose.prod.yml):
- Health check: `curl -f http://localhost:3000/api/health`
- Expected: 200 OK, `{"status":"ok"}`

**Dokploy Integration**:
- Configure same health check in Dokploy (Application → Health Check)
- Dokploy monitors endpoint every 30 seconds (per NFR-009)
- Auto-restart if unhealthy

**Additional Tests** (post-deployment):
- Homepage loads: `curl https://marcusgoll.com`
- Recent post loads: `curl https://marcusgoll.com/blog/[recent-slug]`
- Newsletter form accessible: `curl https://marcusgoll.com/#newsletter`

### Platform Coupling

**Hetzner VPS**: No change
- Still self-hosted on same VPS
- Dokploy runs as Docker container on VPS

**Docker**: Dependency strengthened
- Dokploy itself is Docker-based
- Manages Docker containers for applications
- **Risk Mitigation**: Can extract Docker configs from Dokploy if needed to abandon

**Nginx**: Configuration update
- Add subdomain proxy rule for deploy.marcusgoll.com
- Update marcusgoll.com proxy to point to Dokploy-managed container

**GitHub**: Webhook dependency added
- Push events trigger Dokploy deployments
- **Fallback**: Can manually trigger deployment via Dokploy UI

**New Dependencies**:
- Dokploy platform (open-source, self-hosted, can abandon if needed)
- **Mitigation**: Export config via CLI (specs/047-dokploy-deployment-platform/configs/), can recreate manually

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants

**Must hold true before and after deployment**:
- ✅ Site accessible at marcusgoll.com (HTTPS with valid SSL)
- ✅ Homepage renders within 2 seconds (Lighthouse FCP <1.5s)
- ✅ Recent blog posts load correctly
- ✅ Newsletter form functional (Resend/Mailgun API working)
- ✅ Database connection valid (posts and subscribers readable)
- ✅ Google Analytics 4 tracking events
- ✅ No console errors in browser

**Dokploy-Specific Invariants**:
- ✅ Dokploy UI accessible at deploy.marcusgoll.com (HTTPS with valid SSL)
- ✅ Environment variables masked in Dokploy UI (per FR-028)
- ✅ Automated backups running (daily, 7-day retention per FR-011)
- ✅ Deployment history visible (last 10 deployments per FR-023)
- ✅ Resource usage within limits (RAM <500MB, CPU <10% idle per NFR-021, NFR-022)

### Staging Smoke Tests

**Not Applicable**: direct-prod model (no staging environment)

**Testing Strategy**: Test on subdomain first
```gherkin
Given Dokploy installed on VPS
When application deployed to test.marcusgoll.com
Then site loads without errors
  And homepage renders correctly
  And blog posts load
  And newsletter form works
  And database connection succeeds
  And response time <2s
  And no console errors
  And Lighthouse performance ≥85
```

**Validation Duration**: 24-48 hours on test subdomain before production cutover

### Rollback Plan

**Pre-Migration Rollback** (if issues during setup):
- **Trigger**: Dokploy installation fails, configuration errors
- **Action**:
  1. Stop Dokploy container: `docker stop dokploy`
  2. No changes to production (old setup still running)
  3. Investigate issue, retry installation
- **Duration**: No downtime (production unaffected)

**Post-Migration Rollback** (if issues after cutover):
- **Trigger**: Site broken, performance degradation, critical bugs
- **Action**:
  1. Revert Nginx config: `sudo cp /etc/nginx/sites-available/marcusgoll.backup /etc/nginx/sites-available/marcusgoll && sudo systemctl reload nginx`
  2. Restart old docker-compose: `cd /opt/marcusgoll && docker-compose -f docker-compose.prod.yml up -d`
  3. Verify site: `curl https://marcusgoll.com`
- **Duration**: < 15 minutes
- **Data Loss**: None (database untouched, application code unchanged)

**Full Removal** (if Dokploy abandoned):
- **Trigger**: Dokploy unmaintained, critical issues, decision to revert permanently
- **Action**:
  1. Export configs: `dokploy export --output backup/dokploy-config.yaml`
  2. Stop and remove Dokploy: `docker stop dokploy && docker rm dokploy`
  3. Recreate docker-compose from backup: `cp /opt/marcusgoll/docker-compose.prod.yml.backup /opt/marcusgoll/docker-compose.prod.yml`
  4. Restart old setup: `docker-compose -f docker-compose.prod.yml up -d`
  5. Document removal reason in NOTES.md
- **Duration**: 1-2 hours
- **Data Loss**: None (all configs exported, can recreate manually)

**Deployment Metadata**:
- **Storage**: specs/047-dokploy-deployment-platform/NOTES.md (Deployment Metadata section)
- **Contents**: VPS IP, Dokploy version, admin credentials location, backup locations
- **Rollback Commands**: Documented in Appendix C of spec.md (Rollback Runbook)

### Artifact Strategy

**Build-Once-Promote-Many**: Not applicable (direct-prod model, single environment)

**Build Process**:
1. GitHub Actions verify build (lint, type-check, build test)
2. Push to main triggers GitHub webhook
3. Dokploy receives webhook → pulls latest code → builds Docker image → deploys
4. Docker image tagged with commit SHA (stored in Dokploy)

**Rollback Process**:
- Dokploy maintains deployment history (last 10 images)
- One-click rollback to previous deployment (redeploys previous Docker image)
- No rebuild needed (cached images)

**Artifact Storage**:
- Docker images: Dokploy internal storage (VPS disk)
- Configs: specs/047-dokploy-deployment-platform/configs/ (Git)
- Backups: /opt/dokploy/backups/ (VPS disk, 7-day retention)

---

## [INTEGRATION SCENARIOS]

See: `quickstart.md` for complete integration scenarios

**Summary**:
- **Scenario 1**: Dokploy installation (first-time setup, 15-20 minutes)
- **Scenario 2**: Next.js application migration (30-45 minutes)
- **Scenario 3**: Database import (15-20 minutes)
- **Scenario 4**: GitHub webhook setup (10-15 minutes)
- **Scenario 5**: Rollback testing (5-10 minutes)
- **Scenario 6**: Monitoring dashboard (10 minutes)
- **Scenario 7**: Configuration export for disaster recovery (10-15 minutes)

---

## [TESTING STRATEGY]

### Pre-Deployment Testing

**Local Validation** (before VPS installation):
1. Review Dokploy documentation (https://docs.dokploy.com/)
2. Test Dokploy in local VM or cloud trial (optional, recommended)
3. Validate existing Dockerfile builds locally: `docker build -t test .`
4. Verify environment variables complete: Check .env.production on VPS

**VPS Preparation**:
1. Take VPS snapshot (Hetzner dashboard) - enables full rollback
2. Check disk space: `df -h` (need ~5GB free for Dokploy)
3. Verify Docker version: `docker --version` (need >=20.10)
4. Check port availability: `sudo netstat -tuln | grep 3000` (should be empty or old app)

### Migration Testing

**Phase 1: Dokploy Installation** (test subdomain):
1. Install Dokploy: Run official script, save admin credentials
2. Configure Nginx for deploy.marcusgoll.com
3. Install SSL: `sudo certbot --nginx -d deploy.marcusgoll.com`
4. Validate: Access UI, login succeeds, dashboard loads

**Phase 2: Application Configuration** (test subdomain):
1. Import Next.js app to Dokploy (test.marcusgoll.com domain)
2. Migrate environment variables via UI
3. Trigger test deployment
4. Validate: Test subdomain loads, homepage works, posts load, newsletter form works
5. Performance check: Lighthouse audit (target ≥85)

**Phase 3: Database Integration**:
1. Import PostgreSQL connection to Dokploy
2. Test database connection (Dokploy UI connection test)
3. Trigger manual backup, verify backup file downloads
4. Validate: Application reads from database (posts visible)

**Phase 4: Production Cutover**:
1. Update Nginx to point marcusgoll.com to Dokploy
2. OR configure marcusgoll.com domain in Dokploy UI (alternative)
3. Reload Nginx: `sudo systemctl reload nginx`
4. Validate: Production domain loads, all functionality works
5. Monitor for 24-48 hours (GA4, Dokploy logs, resource usage)

### Post-Deployment Testing

**Smoke Tests** (run after cutover):
```bash
# Health check
curl -f https://marcusgoll.com/api/health
# Expected: 200 OK, {"status":"ok"}

# Homepage
curl -s https://marcusgoll.com | grep "<title>"
# Expected: "Marcus Gollahon" in title

# Recent post (replace [slug])
curl -s https://marcusgoll.com/blog/[recent-slug] | grep "<h1>"
# Expected: Post title in H1

# Dokploy UI
curl -s https://deploy.marcusgoll.com | grep "Dokploy"
# Expected: Dokploy branding in HTML
```

**Performance Testing**:
```bash
# Lighthouse audit (CI)
npm install -g @lhci/cli
lhci autorun --url=https://marcusgoll.com

# Resource usage (VPS)
docker stats dokploy --no-stream
# Expected: <500MB RAM, <10% CPU
```

**Functional Testing** (manual):
- [ ] Homepage loads (https://marcusgoll.com)
- [ ] Blog index loads (https://marcusgoll.com/blog)
- [ ] Recent post loads and renders correctly
- [ ] Newsletter form submits successfully
- [ ] Google Analytics events firing (check GA4 real-time)
- [ ] No browser console errors
- [ ] Mobile responsive (test on phone)

**Monitoring Validation** (Dokploy UI):
- [ ] Deployment history visible (shows current deployment)
- [ ] Logs accessible (can view stdout/stderr)
- [ ] Metrics updating (CPU, memory, network)
- [ ] Alerts configurable (optional, can set up)
- [ ] Backups running (check backup schedule, verify daily backup created)

### Rollback Testing

**During Staging (on test subdomain)**:
1. Deploy version A to test.marcusgoll.com
2. Deploy version B (make change, trigger deployment)
3. Verify version B live
4. Click "Rollback" in Dokploy UI
5. Verify version A live again
6. Measure rollback duration (target <5 minutes per FR-026)

**Production Rollback Drill** (after 7 days):
1. Note current deployment ID (commit SHA)
2. Revert Nginx config: Test rollback to old docker-compose
3. Verify old setup works
4. Switch back to Dokploy
5. Document rollback duration in NOTES.md

---

## [MONITORING & OBSERVABILITY]

### What to Monitor

**Application Metrics** (via Dokploy dashboard):
| Metric | Source | Alert Threshold | Action |
|--------|--------|-----------------|--------|
| CPU usage | Dokploy metrics | > 80% for 5 min | Investigate load, consider VPS upgrade |
| Memory usage | Dokploy metrics | > 3GB (VPS has 4-8GB) | Check memory leaks, restart container |
| Disk usage | Dokploy metrics | > 80% | Clean old Docker images, logs |
| Request rate | Nginx logs | > 1000 req/min | Check for DoS, enable rate limiting |
| Error rate | Application logs | > 5% of requests | Investigate errors, rollback if critical |

**Deployment Metrics** (via Dokploy UI):
- Deployment frequency: Track deploys/week (target 3-5 per spec.md HEART)
- Deployment success rate: Target 95%+ (per spec.md HEART Task Success)
- Deployment duration: Target <7 minutes (per NFR-002)
- Rollback frequency: Track rollbacks (fewer is better)

**Infrastructure Metrics** (via VPS monitoring):
- VPS uptime: Target 99.9% (per NFR-009)
- Dokploy container health: Check `docker ps` (should be "Up")
- Database connection: Check Dokploy database connection test

### Alerting

**Critical Alerts** (email/SMS):
- Site down (UptimeRobot already monitoring marcusgoll.com)
- Deployment failed (Dokploy notification channel)
- Database connection lost (Dokploy alert)
- Disk space >90% (VPS monitoring)

**Warning Alerts** (email only):
- Deployment duration >10 minutes (slower than baseline)
- CPU >80% for 5+ minutes
- Memory >75% for 5+ minutes
- Backup failed (Dokploy notification)

**Info** (log only, no alert):
- Deployment succeeded
- Backup completed
- Configuration changed

**Notification Channels** (configure in Dokploy):
- Email: marcus@marcusgoll.com (primary)
- Discord: Optional webhook (future)
- Slack: Optional webhook (future, if team grows)

### Logging

**Application Logs** (via Dokploy):
- Location: Dokploy UI → Application → Logs
- Retention: 7 days (configurable)
- Search: Full-text search in UI
- Export: Download logs as .txt file

**Dokploy Logs** (Docker logs):
- Access: `docker logs dokploy`
- Useful for: Debugging Dokploy platform issues
- Retention: Docker default (json-file driver, 10MB max per log)

**Nginx Logs** (VPS):
- Access log: `/var/log/nginx/access.log`
- Error log: `/var/log/nginx/error.log`
- Useful for: Debugging routing, SSL, rate limiting

---

## [RISK MITIGATION]

### Risk 1: Dokploy Installation Fails

**Likelihood**: Low (official installer, well-tested)
**Impact**: Medium (delays migration, but production unaffected)

**Mitigation**:
- Pre-check: Verify VPS meets requirements (Docker, disk space, ports)
- Backup: VPS snapshot before installation
- Fallback: Production continues on old setup if installation fails

**Recovery**:
- Restore VPS snapshot (Hetzner dashboard)
- OR investigate error logs, retry installation

---

### Risk 2: Environment Variable Migration Error

**Likelihood**: Medium (manual process, typo risk)
**Impact**: High (site broken if DATABASE_URL incorrect)

**Mitigation**:
- Test on subdomain first (test.marcusgoll.com)
- Validate each variable after migration (check app logs)
- Keep backup of .env.production for 7 days

**Recovery**:
- Correct variable in Dokploy UI
- Restart application (Dokploy UI → Restart button)
- If persistent, rollback to old docker-compose

---

### Risk 3: Performance Degradation

**Likelihood**: Low (Dokploy is lightweight)
**Impact**: Medium (slower site, user experience affected)

**Mitigation**:
- Monitor resource usage: `docker stats dokploy` (target <500MB RAM)
- Lighthouse audit pre/post migration (compare scores)
- Load testing: Optional siege or ab test

**Recovery**:
- Investigate bottleneck (Dokploy logs, VPS metrics)
- Optimize Dokploy config (reduce log retention, clean old images)
- If unresolvable, rollback to old setup

---

### Risk 4: GitHub Webhook Fails

**Likelihood**: Low (webhook simple HTTP POST)
**Impact**: Medium (deployments don't trigger automatically, must use UI)

**Mitigation**:
- Test webhook: Push test commit, verify Dokploy receives
- Monitor webhook deliveries (GitHub → Settings → Webhooks → Recent Deliveries)
- Document manual deployment process (Dokploy UI → Deploy button)

**Recovery**:
- Check webhook URL correct (GitHub vs. Dokploy)
- Verify webhook secret matches
- Manually trigger deployment via Dokploy UI until fixed

---

### Risk 5: Database Backup Fails

**Likelihood**: Low (Dokploy backup feature tested)
**Impact**: High (data loss risk if database failure)

**Mitigation**:
- Test backup immediately after setup (manual backup trigger)
- Monitor backup status (Dokploy dashboard)
- Keep Supabase backups as redundancy (external backups)

**Recovery**:
- Investigate backup error (Dokploy logs)
- Manually backup database: `pg_dump` via Supabase CLI
- Restore from Supabase backup if needed

---

## [SUCCESS METRICS]

**From spec.md HEART Framework**:

| Metric | Baseline (Pre-Dokploy) | Target (Post-Dokploy) | Measurement |
|--------|------------------------|----------------------|-------------|
| Deployment Time | 10-15 min (manual SSH) | <5 min (automated) | Dokploy logs |
| Deployment Frequency | 1-2/week | 3-5/week | Dokploy history |
| Deployment Error Rate | ~10% (manual typos) | <5% | Dokploy success rate |
| Time on Deployment Tasks | 2-3 hours/mo | <1 hour/mo | Time tracking |
| Dokploy UI Access | N/A | 5-7 logins/week | Nginx access logs |

**Performance Targets** (no regression):
- Site Lighthouse: ≥85 (pre and post)
- FCP: <1.5s (pre and post)
- LCP: <2.5s (pre and post)
- Deployment duration: <7 minutes (maintain baseline)

**Measurement Window**: 4 weeks post-migration (compare to 4 weeks pre-migration)

---

## [APPENDIX A: Pre-Migration Checklist]

**Preparation** (before installing Dokploy):
- [ ] Review Dokploy documentation (https://docs.dokploy.com/)
- [ ] Take VPS snapshot (Hetzner dashboard)
- [ ] Backup current configuration:
  - [ ] Copy docker-compose.prod.yml to specs/047-dokploy-deployment-platform/configs/pre-migration-backup/
  - [ ] Copy deploy.sh to backup directory
  - [ ] Export environment variables (sanitized, no secrets) to backup directory
- [ ] Verify VPS disk space: `df -h` (need ~5GB free)
- [ ] Verify Docker version: `docker --version` (need >=20.10)
- [ ] Verify Nginx installed: `nginx -v`
- [ ] Verify Certbot installed: `certbot --version`
- [ ] Configure DNS: deploy.marcusgoll.com → VPS IP (wait for propagation, ~1 hour)
- [ ] Document current deployment process (baseline metrics)

---

## [APPENDIX B: Rollback Runbook]

See: spec.md Appendix C for complete rollback runbook

**Quick Rollback Commands** (copy-paste ready):

```bash
# Emergency rollback to pre-Dokploy state
ssh marcus@178.156.129.179

# Stop Dokploy
docker stop dokploy

# Revert Nginx
sudo cp /etc/nginx/sites-available/marcusgoll.backup /etc/nginx/sites-available/marcusgoll
sudo nginx -t && sudo systemctl reload nginx

# Restart old setup
cd /opt/marcusgoll
docker-compose -f docker-compose.prod.yml up -d

# Verify
curl https://marcusgoll.com
```

**Duration**: 10-15 minutes
**Data Loss**: None

---

## [APPENDIX C: Dokploy Resources]

**Official Documentation**:
- Dokploy Website: https://dokploy.com/
- Dokploy Docs: https://docs.dokploy.com/
- Dokploy GitHub: https://github.com/Dokploy/dokploy

**Community**:
- Discord: https://discord.gg/dokploy (community support)
- GitHub Issues: https://github.com/Dokploy/dokploy/issues

**Internal Documentation**:
- Deployment Strategy: docs/project/deployment-strategy.md
- Tech Stack: docs/project/tech-stack.md
- System Architecture: docs/project/system-architecture.md
- Constitution: .spec-flow/memory/constitution.md

