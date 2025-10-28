# Production Handoff Documentation

Complete system overview and handoff for marcusgoll.com production deployment.

**Date**: October 28, 2025
**Status**: ✅ Production Ready
**Deployment**: Dokploy on Hetzner VPS
**Environment**: test.marcusgoll.com (Primary) → marcusgoll.com (Pending DNS)

---

## Executive Summary

The marcusgoll.com Next.js application is fully deployed and operational on a Hetzner VPS with Dokploy orchestration. The system includes automated deployment pipelines, database backups, health monitoring, and is ready for production traffic.

**Current Status**:
- ✅ Application running on test.marcusgoll.com
- ✅ Staging environment at staging.marcusgoll.com
- ✅ CI/CD pipeline functional with auto-deployment
- ✅ PostgreSQL database with automated backups
- ✅ SSL/TLS certificates (Let's Encrypt)
- ✅ Health monitoring active
- ⏳ DNS cutover to marcusgoll.com (awaiting user approval)

---

## System Architecture

### Infrastructure

```
┌──────────────────────────────────────────┐
│     Hetzner VPS ([REDACTED_IP])          │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │   Docker Swarm (Orchestration)   │   │
│  │                                  │   │
│  │  ┌────────────────────────────┐  │   │
│  │  │  Traefik Reverse Proxy     │  │   │
│  │  │  (Port 80/443)             │  │   │
│  │  │  Let's Encrypt SSL/TLS     │  │   │
│  │  └────────┬───────────────────┘  │   │
│  │           │ Routes to             │   │
│  │  ┌────────▼───────────────────┐  │   │
│  │  │  Next.js Application       │  │   │
│  │  │  (Port 3001)               │  │   │
│  │  │  1/1 replicas              │  │   │
│  │  └────────────────────────────┘  │   │
│  │           ↓                       │   │
│  │  ┌────────────────────────────┐  │   │
│  │  │  PostgreSQL 15 Database    │  │   │
│  │  │  (Port 5433)               │  │   │
│  │  │  marcusgoll_db             │  │   │
│  │  └────────────────────────────┘  │   │
│  │           ↓                       │   │
│  │  ┌────────────────────────────┐  │   │
│  │  │  Automated Backups         │  │   │
│  │  │  (Daily at 02:00 UTC)      │  │   │
│  │  │  7-day retention           │  │   │
│  │  └────────────────────────────┘  │   │
│  │                                  │   │
│  │  ┌────────────────────────────┐  │   │
│  │  │  Health Check Monitor      │  │   │
│  │  │  (Hourly checks)           │  │   │
│  │  │  Logs to /var/log/         │  │   │
│  │  └────────────────────────────┘  │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Management Interface:                   │
│  Dokploy Dashboard @ deploy.marcusgoll.com
└──────────────────────────────────────────┘
```

### Deployment Domains

| Domain | Purpose | Status | Certificate |
|--------|---------|--------|-------------|
| test.marcusgoll.com | **Production (Active)** | ✅ Live | ✅ Let's Encrypt |
| www.test.marcusgoll.com | Production Alias | ✅ Live | ✅ Let's Encrypt |
| staging.marcusgoll.com | Staging Environment | ✅ Live | ✅ Let's Encrypt |
| deploy.marcusgoll.com | Dokploy Dashboard | ✅ Live | ✅ Let's Encrypt |
| marcusgoll.com | Primary (Pending) | ⏳ Configured | ⏳ Will Auto-Provision |

---

## Key Components

### 1. Application (Next.js 15)

**Location**: `/app` inside Docker container
**Port**: 3001 (host) ← 3000 (container)
**Entry Point**: `npm run start` (production)

**Key Files**:
- `next.config.ts` — MDX and Shiki syntax highlighting config
- `lib/rehype-shiki.ts` — Custom syntax highlighting plugin
- `package.json` — Node 20 LTS, optimized dependencies
- `.github/workflows/build-and-test.yml` — CI/CD pipeline

**Features**:
- MDX-based blog content management
- Syntax highlighting (Shiki, dual-theme)
- GitHub Flavored Markdown support
- Google Analytics integration
- Responsive design

---

### 2. Reverse Proxy (Traefik)

**Function**: HTTPS termination, routing, certificate management

**Config File**: `/etc/dokploy/traefik/dynamic/dokploy.yml`

**Features**:
- Automatic HTTPS redirect (80 → 443)
- Let's Encrypt certificate provisioning
- Virtual host routing
- Health checks
- Request headers management

**Certificate Management**:
- Automatic provisioning on domain DNS resolution
- 90-day validity, renewed at 30-day mark
- Zero downtime renewal
- All domains covered

---

### 3. Database (PostgreSQL 15)

**Location**: Docker container on VPS
**Port**: 5433 (external) ← 5432 (internal)
**Database**: `marcusgoll_db`
**User**: `postgres`

**Configuration**:
- Alpine Linux base (lightweight)
- 512MB memory allocation
- Persistent volume: `/opt/postgres_data`
- Daily backups with 7-day retention

**Connection**:
```
postgresql://postgres:[REDACTED_PASSWORD]@[REDACTED_VPS_IP]:5433/marcusgoll_db
```
**Note**: Actual credentials stored securely in Dokploy secrets.

---

### 4. Dokploy (Deployment Platform)

**Dashboard**: https://deploy.marcusgoll.com
**Database**: PostgreSQL inside Dokploy
**Function**: Application deployment, scaling, monitoring

**Applications Managed**:
1. **marcusgoll-nextjs** — Your blog application
   - Auto-deploy enabled (GitHub webhook)
   - Port: 3001
   - Environment: Secrets stored securely

2. **dokploy** — The dashboard itself
   - Required for deployment management
   - Port: 3000 (internal)

---

### 5. CI/CD Pipeline (GitHub Actions)

**Workflow**: `.github/workflows/build-and-test.yml`

**Trigger**: Every push to `main` branch

**Steps**:
1. Checkout code
2. Setup Node.js 20 + npm cache
3. Install dependencies (`npm ci`)
4. Type check (`npm run typecheck || npm run build`)
5. Lint check (`npm run lint`)
6. Build application (`npm run build`)
7. CI summary (blocks if any step fails)

**Auto-Deployment**:
- Dokploy watches GitHub for new pushes
- Automatically pulls latest code
- Builds Docker image
- Deploys to Docker Swarm
- Restarts service with new image

---

## Access & Credentials

### SSH Access

**Alias**: `hetzner`

**Setup** (already configured):
```bash
# In ~/.ssh/config or terminal
ssh hetzner
```

**What It Does**: Connects to VPS for system administration

---

### Dokploy Dashboard

**URL**: https://deploy.marcusgoll.com
**Credentials**: Stored securely in Dokploy
**Admin Panel**: For managing applications, deployments, and monitoring

---

### GitHub Webhook

**Configured**: Yes (auto-deployment enabled)
**Repository**: marcusgoll/marcusgoll
**Webhook Format**: GitHub App authentication
**Auto-Deploy**: Enabled for `marcusgoll-nextjs` application

---

## Health & Monitoring

### Health Check System

**Script**: `/opt/health-check.sh`
**Schedule**: Hourly (0 * * * *)
**Log File**: `/var/log/marcusgoll-health.log`

**Checks Performed**:
1. HTTP 200 response from test.marcusgoll.com
2. Docker service `marcusgoll-nextjs` running
3. Disk usage < 80%

**View Logs**:
```bash
ssh hetzner
tail -f /var/log/marcusgoll-health.log
```

**Sample Output**:
```
[2025-10-28 12:00:00] ✓ Web: HTTP 200 OK
[2025-10-28 12:00:02] ✓ Docker: Service running
[2025-10-28 12:00:03] ✓ Disk: 17% used
```

---

### Metrics to Monitor

**Application**:
- HTTP response codes (should be 200)
- Response times (should be < 2 seconds)
- Container restart count (should be 0)

**Database**:
- Connection pool usage
- Backup completion status
- Query performance

**Infrastructure**:
- Disk usage (alert if > 80%)
- Memory usage
- CPU usage
- Network I/O

---

## Common Operations

### View Application Logs

```bash
ssh hetzner
docker service logs marcusgoll-nextjs -f
```

### Force Restart Application

```bash
ssh hetzner
docker service update --force marcusgoll-nextjs
```

### Check Database Status

```bash
ssh hetzner
docker exec postgres psql -U postgres -d marcusgoll_db -c "SELECT 1;"
```

### View Service Status

```bash
ssh hetzner
docker service ps marcusgoll-nextjs
docker stats
```

---

## Backup & Disaster Recovery

### Automated Backup

**Schedule**: Daily at 2:00 AM UTC

**Location**: `/opt/backups/` on VPS

**Files**: `backup-YYYY-MM-DD.sql.gz`

**Retention**: 7 days rolling window

**Test Results**: ✅ Restore tested and verified

---

### Manual Backup

```bash
ssh hetzner
/opt/backups/backup.sh
```

---

### Restore from Backup

```bash
ssh hetzner

# Stop application (optional)
docker service update marcusgoll-nextjs --env-add MAINTENANCE_MODE=true

# List backups
ls -lh /opt/backups/

# Restore specific backup
BACKUP=/opt/backups/backup-2025-10-27.sql.gz
docker exec -i postgres \
  psql -U postgres -d marcusgoll_db < <(gunzip -c $BACKUP)

# Restart application
docker service update marcusgoll-nextjs --env-add MAINTENANCE_MODE=false
```

---

## Next Major Steps

### Immediate (Ready to Execute)

1. **DNS Cutover to marcusgoll.com**
   - Add DNS A record: `marcusgoll.com → [REDACTED_VPS_IP]`
   - See: `DNS_CUTOVER_CHECKLIST.md` for actual IP
   - Expected time: 5-15 minutes
   - Risk: Low (test.marcusgoll.com remains active as fallback)

### Short-term (Recommended)

1. **External Monitoring Setup**
   - Use Uptime Robot or similar for 24/7 uptime monitoring
   - Email alerts for downtime
   - Estimated setup time: 15 minutes

2. **Log Aggregation** (optional)
   - Papertrail, Datadog, or ELK stack
   - Centralized log analysis
   - Estimated setup time: 1-2 hours

3. **CDN Integration** (optional)
   - Cloudflare or Bunny CDN for caching
   - Faster content delivery globally
   - Estimated setup time: 30 minutes

### Long-term (Future Enhancements)

1. **Database Backup to S3**
   - Off-server backup storage
   - Disaster recovery across regions

2. **Auto-scaling**
   - Multiple application replicas
   - Load balancing

3. **Advanced Monitoring**
   - Custom dashboards
   - Performance profiling
   - Automated alerts

---

## Documentation Reference

All operations documented in accompanying files:

| Document | Purpose | When to Use |
|----------|---------|------------|
| **PRODUCTION_READINESS.md** | System status & verification | Before and after deployment |
| **OPERATIONS_RUNBOOK.md** | Step-by-step operational tasks | Daily operations & troubleshooting |
| **DNS_CUTOVER_CHECKLIST.md** | DNS migration guide | When ready to switch to marcusgoll.com |
| **ENV_SETUP_GUIDE.md** | Environment variables reference | Configuration & debugging |
| **DEPLOYMENT_STATUS.md** | Phase 5 summary (from previous) | Historical context |
| **.env.example** | Environment variables template | New environment setup |

---

## Important Contact & Escalation

### Emergency Procedures

If application becomes unresponsive:

1. **Quick Check**:
   ```bash
   curl -I https://test.marcusgoll.com
   ```

2. **Force Restart**:
   ```bash
   ssh hetzner
   docker service update --force marcusgoll-nextjs
   ```

3. **Check Status**:
   ```bash
   docker service ps marcusgoll-nextjs
   docker service logs marcusgoll-nextjs --tail 50
   ```

### Support Resources

- **GitHub Actions Logs**: https://github.com/marcusgoll/marcusgoll/actions
- **Dokploy Dashboard**: https://deploy.marcusgoll.com
- **System Logs**: `/var/log/marcusgoll-health.log` (on VPS)

---

## Final Checklist

Before considering production handoff complete:

### System Verification
- [x] Application running and responding (HTTP 200)
- [x] Database accessible and backing up
- [x] SSL/TLS certificates valid
- [x] CI/CD pipeline functional
- [x] Health checks passing
- [x] All domains resolving correctly

### Documentation
- [x] Architecture documented
- [x] Operations runbook provided
- [x] Environment variables explained
- [x] DNS cutover steps prepared
- [x] Backup/restore procedures documented
- [x] Troubleshooting guide included

### Security
- [x] Secrets stored in Dokploy (not in code)
- [x] HTTPS enforced on all domains
- [x] Non-root Docker user configured
- [x] Database password protected
- [x] API keys rotated and validated

### Monitoring
- [x] Health check script active
- [x] Logs being collected
- [x] Service status verifiable
- [x] Backup status trackable

---

## Sign-Off

**Deployment Status**: ✅ **PRODUCTION READY**

**System Stability**: ✅ All health checks passing

**Ready for**:
- ✅ Production traffic on test.marcusgoll.com
- ✅ DNS cutover to marcusgoll.com (when approved)
- ✅ Long-term operation and maintenance

**Last Updated**: October 28, 2025
**Next Review**: After DNS cutover or when making major changes

---

## What Happens Next

1. **Review this documentation** to understand the complete system
2. **Execute DNS_CUTOVER_CHECKLIST.md** when ready to move to marcusgoll.com
3. **Monitor health logs** after cutover to ensure stability
4. **Plan enhancements** from the short-term/long-term lists

The application is fully production-ready. All systems are operational and documented.

**Status**: ✅ Ready to serve production traffic
