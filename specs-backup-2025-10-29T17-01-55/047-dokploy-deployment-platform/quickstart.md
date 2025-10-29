# Quickstart: dokploy-deployment-platform

## Scenario 1: Dokploy Installation (First-Time Setup)

**Prerequisites**:
- Hetzner VPS with SSH access (178.156.129.179)
- Docker and Docker Compose installed
- Domain DNS configured (deploy.marcusgoll.com → VPS IP)

**Steps**:

```bash
# SSH to VPS
ssh marcus@178.156.129.179

# Create VPS snapshot (Hetzner dashboard) BEFORE installation
# This enables full rollback if needed

# Download and run official Dokploy installer
curl -sSL https://dokploy.com/install.sh | sh

# Installer will:
# - Install Dokploy Docker container
# - Set up internal database (SQLite)
# - Generate admin credentials
# - Start Dokploy on port 3000

# Save admin credentials (shown once)
# Username: admin
# Password: <generated-password>

# Configure Caddy reverse proxy for deploy.marcusgoll.com
# Edit Caddyfile inside the Caddy container
docker exec -it proxy-caddy-1 sh -c 'cat >> /etc/caddy/Caddyfile << EOF

deploy.marcusgoll.com {
    reverse_proxy localhost:3000
}
EOF'

# Reload Caddy configuration
docker exec proxy-caddy-1 caddy reload --config /etc/caddy/Caddyfile

# Caddy automatically provisions SSL via Let's Encrypt (no manual certbot needed)

# Access Dokploy UI
# URL: https://deploy.marcusgoll.com
# Login with admin credentials
```

**Expected Duration**: 15-20 minutes

**Validation**:
- [ ] Dokploy UI loads at https://deploy.marcusgoll.com
- [ ] SSL certificate valid (green padlock)
- [ ] Admin login succeeds
- [ ] Dashboard shows empty applications list

---

## Scenario 2: Next.js Application Migration

**Prerequisites**:
- Dokploy installed (Scenario 1 complete)
- GitHub repository accessible (https://github.com/marcusgoll/marcusgoll)
- Existing Next.js app running on VPS

**Steps**:

```bash
# In Dokploy UI (https://deploy.marcusgoll.com)

1. Click "Add Application"
2. Select "Import from GitHub"
3. Authorize GitHub (if first time)
4. Select repository: marcusgoll/marcusgoll
5. Configure application:
   - Name: marcusgoll
   - Branch: main
   - Build Method: Docker (reuse existing Dockerfile)
   - Domain: test.marcusgoll.com (test subdomain first)

6. Add environment variables (copy from VPS .env.production):
   - DATABASE_URL: <value from VPS>
   - NEXT_PUBLIC_SUPABASE_URL: <value>
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: <value>
   - SUPABASE_SERVICE_ROLE_KEY: <value> (masked)
   - RESEND_API_KEY: <value> (masked)
   - NEWSLETTER_FROM_EMAIL: <value>
   - GA4_MEASUREMENT_ID: <value>
   - NODE_ENV: production

7. Click "Deploy"
8. Monitor deployment logs in real-time
9. Wait for "Deployment Successful" (5-7 minutes)
10. Test application: https://test.marcusgoll.com

# Validate application works
curl https://test.marcusgoll.com/api/health
# Expected: {"status":"ok"}

# If validation passes, update Caddyfile to point marcusgoll.com to Dokploy
# Configure marcusgoll.com domain in Dokploy UI, which will instruct Caddy routing
# OR manually update Caddyfile to proxy to Dokploy-managed container

# Caddy will handle SSL automatically via Let's Encrypt
```

**Expected Duration**: 30-45 minutes

**Validation**:
- [ ] Application builds successfully in Dokploy
- [ ] Test subdomain loads (https://test.marcusgoll.com)
- [ ] Homepage renders correctly
- [ ] Blog posts load
- [ ] Newsletter form works
- [ ] No console errors

---

## Scenario 3: Database Import

**Prerequisites**:
- Dokploy installed
- Existing Supabase PostgreSQL connection string

**Steps**:

```bash
# In Dokploy UI

1. Go to "Databases" section
2. Click "Add External Database"
3. Select "PostgreSQL"
4. Configure connection:
   - Name: marcusgoll-postgres
   - Connection String: <DATABASE_URL from .env.production>
   - Version: 15

5. Test connection (Dokploy will validate)
6. Configure automated backups:
   - Schedule: Daily at 2:00 AM UTC
   - Retention: 7 days
   - Storage: VPS local disk

7. Click "Save"
8. Trigger manual backup (test)
   - Click "Backup Now"
   - Wait for completion
   - Download backup file (verify integrity)

9. Update application to use Dokploy-managed connection string
   - Go to Application → Environment Variables
   - DATABASE_URL now points to Dokploy-managed database proxy
```

**Expected Duration**: 15-20 minutes

**Validation**:
- [ ] Database connection test succeeds
- [ ] Manual backup completes
- [ ] Backup file downloadable
- [ ] Application connects to database via Dokploy
- [ ] Posts and subscribers visible in application

---

## Scenario 4: GitHub Webhook Setup

**Prerequisites**:
- Application configured in Dokploy
- GitHub repository admin access

**Steps**:

```bash
# In Dokploy UI

1. Go to Application → Settings → Webhooks
2. Click "Generate Webhook URL"
3. Copy webhook URL (e.g., https://deploy.marcusgoll.com/api/webhooks/deploy/abc123)

# In GitHub Repository Settings

1. Go to Settings → Webhooks → Add webhook
2. Paste webhook URL
3. Content type: application/json
4. Select events:
   - [x] Push events (on main branch)
5. Active: [x] Enabled
6. Click "Add webhook"

# Test webhook

# On local machine:
git checkout main
echo "# Test deploy" >> README.md
git add README.md
git commit -m "test: trigger Dokploy deployment via webhook"
git push origin main

# In Dokploy UI:
# - Watch Deployments page
# - Webhook should trigger deployment automatically
# - Logs show build progress
# - Deployment completes in 5-7 minutes
```

**Expected Duration**: 10-15 minutes

**Validation**:
- [ ] Webhook created in GitHub
- [ ] Push to main triggers deployment
- [ ] Dokploy receives webhook
- [ ] Deployment starts automatically
- [ ] Site updates with changes
- [ ] No manual SSH needed

---

## Scenario 5: Rollback Testing

**Prerequisites**:
- At least 2 deployments in Dokploy history

**Steps**:

```bash
# In Dokploy UI

1. Go to Application → Deployments
2. View deployment history (shows last 10 deployments)
3. Find previous deployment (before current)
   - Commit SHA: abc1234
   - Status: Success
   - Deployed: 2 hours ago

4. Click "Rollback" button
5. Confirm rollback
6. Dokploy redeploys previous version (uses cached Docker image)
7. Wait for rollback completion (~2-3 minutes)

# Verify rollback succeeded
curl https://marcusgoll.com/api/health
# Check commit SHA in response headers (should match abc1234)

# Test site functionality
# - Homepage loads
# - Previous version visible
# - No errors

# Roll forward (if needed)
8. Go to Deployments
9. Find latest deployment
10. Click "Redeploy"
```

**Expected Duration**: 5-10 minutes

**Validation**:
- [ ] Rollback completes in <5 minutes
- [ ] Previous version live
- [ ] Site functional
- [ ] Can roll forward to current version

---

## Scenario 6: Monitoring Dashboard

**Prerequisites**:
- Application running in Dokploy
- At least 1 hour of uptime

**Steps**:

```bash
# In Dokploy UI

1. Go to Application → Monitoring
2. View real-time metrics:
   - CPU usage: Current percentage
   - Memory usage: MB used / total
   - Network: Inbound/outbound traffic
   - Disk: Usage percentage

3. View logs:
   - Click "Logs" tab
   - See real-time stdout/stderr
   - Search logs (e.g., "error", "warning")
   - Download logs (export as .txt)

4. Configure alerts (optional):
   - Click "Alerts"
   - Add alert: CPU > 80% for 5 minutes
   - Notification: Email (marcus@marcusgoll.com)
   - Save alert

5. View historical metrics:
   - Switch to "24 Hours" view
   - See CPU/memory trends
   - Identify peak usage times
```

**Expected Duration**: 10 minutes

**Validation**:
- [ ] Metrics update in real-time
- [ ] Logs searchable
- [ ] Alerts configurable
- [ ] Historical data visible

---

## Scenario 7: Configuration Export (Disaster Recovery)

**Prerequisites**:
- Dokploy fully configured
- Dokploy CLI installed locally

**Steps**:

```bash
# Install Dokploy CLI (on local machine)
npm install -g @dokploy/cli

# Authenticate
dokploy login https://deploy.marcusgoll.com
# Enter admin credentials

# Export configuration
dokploy export --output ./specs/047-dokploy-deployment-platform/configs/dokploy-config.yaml

# Review exported config
cat ./specs/047-dokploy-deployment-platform/configs/dokploy-config.yaml

# Expected content:
# - Application settings (name, repo, build commands)
# - Domain configurations
# - Database connections (connection strings)
# - Backup schedules
# - Webhook URLs

# Commit to Git (version control)
git add specs/047-dokploy-deployment-platform/configs/
git commit -m "docs: export Dokploy configuration for disaster recovery"
git push origin feature/047-dokploy-deployment-platform

# Test import (on fresh Dokploy installation):
# dokploy import --config dokploy-config.yaml
# (This recreates entire setup)
```

**Expected Duration**: 10-15 minutes

**Validation**:
- [ ] Configuration exports successfully
- [ ] YAML file valid (no secrets leaked)
- [ ] File committed to Git
- [ ] Import process documented

---

## Troubleshooting

### Deployment Fails in Dokploy

**Symptoms**: Deployment status shows "Failed", build logs show errors

**Solutions**:
1. Check build logs in Dokploy UI (Deployments → Click failed deployment)
2. Common issues:
   - Environment variable missing (add in UI)
   - Build timeout (increase timeout in settings)
   - Docker build error (validate Dockerfile locally)
3. Retry deployment after fixing

**Rollback**: Click "Rollback" to previous working deployment

---

### Database Connection Issues

**Symptoms**: Application can't connect to database, logs show "Connection refused"

**Solutions**:
1. Verify DATABASE_URL in Dokploy UI (Environment Variables)
2. Test database connection in Dokploy (Databases → Test Connection)
3. Check database is running (Supabase dashboard)
4. Verify firewall rules (VPS allows database connections)

**Rollback**: Restore DATABASE_URL to original value, restart application

---

### Dokploy UI Unreachable

**Symptoms**: https://deploy.marcusgoll.com times out

**Solutions**:
1. SSH to VPS: `ssh marcus@178.156.129.179`
2. Check Dokploy container status: `docker ps | grep dokploy`
3. If stopped, restart: `docker restart dokploy`
4. Check Caddy: `docker exec proxy-caddy-1 caddy validate --config /etc/caddy/Caddyfile`
5. Check SSL cert status: `docker logs proxy-caddy-1 | grep -i cert`

**Emergency Access**: Access via IP:port if DNS/Caddy issues: `http://178.156.129.179:3000`

---

### Rollback to Pre-Dokploy State

**Symptoms**: Dokploy not working, need to revert to manual deployment

**Solutions**:
```bash
# SSH to VPS
ssh marcus@178.156.129.179

# Stop Dokploy container
docker stop dokploy

# Revert Caddyfile config
docker exec proxy-caddy-1 sh -c 'cp /etc/caddy/Caddyfile.backup /etc/caddy/Caddyfile'
docker exec proxy-caddy-1 caddy reload --config /etc/caddy/Caddyfile

# Restart old Docker Compose setup
cd /opt/marcusgoll  # Or wherever old setup is
docker-compose -f docker-compose.prod.yml up -d

# Verify site works
curl https://marcusgoll.com
```

**Duration**: 10-15 minutes
**Data Loss**: None (application database untouched)

