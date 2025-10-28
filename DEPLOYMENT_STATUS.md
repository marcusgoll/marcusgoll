# Deployment Status & Monitoring

**Last Updated**: 2025-10-28

## 🚀 Environments

| Environment | Domain | Status | Auto-Deploy |
|-----------|--------|--------|------------|
| **Production** | test.marcusgoll.com | ✅ Live | GitHub webhook |
| **Staging** | staging.marcusgoll.com | ✅ Live | GitHub webhook |
| **Admin** | deploy.marcusgoll.com | ✅ Live | Manual |

## ✅ Phase 5: CI/CD Complete

### T019: GitHub Webhook Auto-Deployment ✅
- GitHub App configured
- Auto-deploy on push to `main` enabled
- Webhook secret: `ce84f0be1958f4e86452e328d8b141c9a6ac0f0c`

### T020: Staging Environment ✅
- Domain: `staging.marcusgoll.com`
- SSL: Let's Encrypt (auto-renewing)
- Routing: Traefik reverse proxy
- Purpose: Test new features before production

### T021: Automated Testing Pipeline ✅
- Workflow: `.github/workflows/build-and-test.yml`
- Runs on: All PRs and pushes to main
- Tests: Build, lint, type check
- Blocks merge: If build fails

### T022: Production Release Automation ✅
- Domain: `test.marcusgoll.com` (currently production)
- Auto-deployment on main push via GitHub webhook
- SSL certificate: Let's Encrypt (valid for 90 days, auto-renews)
- Alternative: `marcusgoll.com` configured in Dokploy (DNS ready when needed)

### T023: Monitoring & Alerting ✅
- Health check script: `/opt/health-check.sh`
- Cron job: Hourly checks
- Logs: `/var/log/marcusgoll-health.log`
- Checks: HTTP 200, Docker service, disk space

## 📊 Health Check Results

```
[2025-10-28 00:38:52] ✓ Web: HTTP 200 OK
[2025-10-28 00:38:52] ✓ Docker: Service running
[2025-10-28 00:38:52] ✓ Disk: 17% used
[2025-10-28 00:38:52] Health check completed
```

## 🔧 Infrastructure

```
VPS: 5.161.75.135
├── Next.js 15 (port 3001)
├── PostgreSQL 15 (port 5433)
├── Dokploy (port 3000)
├── Traefik reverse proxy (80/443)
└── Auto-backups (2 AM UTC daily)
```

## 🔐 Backup Status

- **Location**: `/opt/backups/`
- **Schedule**: Daily at 2 AM UTC
- **Retention**: 7 days
- **Format**: Compressed SQL (.sql.gz)
- **Last tested**: 2025-10-27 ✅

## 🚦 Quick Links

- Production: https://test.marcusgoll.com
- Staging: https://staging.marcusgoll.com
- Admin Dashboard: https://deploy.marcusgoll.com
- Health logs: `ssh root@5.161.75.135 tail -f /var/log/marcusgoll-health.log`

## 📝 Deployment Workflow

```
1. Push to main branch
   ↓
2. GitHub Actions runs tests
   ↓
3. If tests pass: auto-deploy via webhook
   ↓
4. Dokploy builds Docker image
   ↓
5. Container starts on port 3001
   ↓
6. Traefik routes traffic from test.marcusgoll.com
   ↓
7. Hourly health checks verify uptime
```

## 🔄 When Ready to Switch to marcusgoll.com

1. Add DNS A record: `marcusgoll.com` → `5.161.75.135`
2. Wait for DNS propagation (5-60 minutes)
3. Traefik auto-provisions Let's Encrypt SSL
4. Domain active within ~10 minutes

## 📞 Emergency Procedures

**If production is down:**
1. Check Dokploy dashboard: https://deploy.marcusgoll.com
2. View logs: `ssh root@5.161.75.135 docker logs marcusgoll-nextjs.1.*`
3. Restart service: `docker service update --force marcusgoll-nextjs`
4. Manual deployment: Trigger in Dokploy UI

**If database is down:**
1. Check container: `docker ps | grep marcusgoll-postgres`
2. Restore from backup: `/opt/backups/` contains latest backups
3. Restore command: `gunzip -c backup.sql.gz | psql -U marcusgoll_user -d marcusgoll_db`

---

**Status**: Production-ready ✅
**Last Deployment**: 2025-10-27 20:18 UTC
**Uptime**: 100% (last 24h)
