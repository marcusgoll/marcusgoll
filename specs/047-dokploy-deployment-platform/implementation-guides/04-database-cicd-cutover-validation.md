# Database, CI/CD, Cutover & Validation Guide

**Phases**: 4, 5, 6, 7 of 8
**Tasks**: T016-T037
**Duration**: 4-6 hours total
**Prerequisites**: Phase 3 complete, test deployment validated

---

## PHASE 4: Database Integration (T016-T018)

**Duration**: 45-60 minutes
**Can run in parallel with Phase 5**

### T016: Import PostgreSQL Database to Dokploy Management

**Purpose**: Centralize database visibility and backup management

**Execution Steps**:

1. Login to Dokploy: https://deploy.marcusgoll.com

2. Navigate to Databases section
   - Click: "Databases" tab
   - Click: "Add Database" or "+"

3. Select database type:
   - Type: "External Database" or "Postgres (External)"
   - (Not creating new database, importing existing Supabase PostgreSQL)

4. Configure connection:
   ```
   Name: marcusgoll-postgres
   Type: PostgreSQL
   Connection String: [paste DATABASE_URL from environment variables]

   Example format:
   postgresql://user:password@host:5432/database?sslmode=require
   ```

5. Test connection
   - Click: "Test Connection"
   - Expected: "Connection successful"
   - Verify: Can see database schema/tables (if Dokploy shows preview)

6. Save database configuration

**Validation**:
- [ ] Database added to Dokploy dashboard
- [ ] Connection test successful
- [ ] Database shows as "Connected" or "Active"

---

### T017: Configure Automated Database Backups

**Execution Steps**:

1. In Dokploy database settings:
   - Navigate: Databases → marcusgoll-postgres → Backups

2. Configure backup schedule:
   ```
   Schedule: Daily
   Time: 2:00 AM UTC
   Retention: 7 days (spec FR-011)
   Format: SQL dump or pg_dump
   Compression: Enabled (to save disk space)
   ```

3. Configure backup storage:
   ```
   Location: VPS local disk (/opt/dokploy/backups/)
   OR: External (if Dokploy supports S3/cloud storage)
   Recommended: VPS local for simplicity
   ```

4. Save backup configuration

5. Verify backup schedule:
   - Should show: "Next backup: [date/time]"
   - Enabled: Yes

**Validation**:
- [ ] Backup schedule configured (daily 2AM UTC)
- [ ] Retention set to 7 days
- [ ] Backup storage location configured
- [ ] Schedule shows as active

---

### T018: Test Manual Database Backup and Restore

**Purpose**: Verify backup/restore capability before relying on it

**Execution Steps**:

1. Trigger manual backup:
   - Navigate: Databases → marcusgoll-postgres → Backups
   - Click: "Backup Now" or "Create Backup"
   - Wait for completion (30 seconds to 5 minutes depending on DB size)

2. Verify backup created:
   - Should appear in backup list
   - Details: Timestamp, size, status "Completed"

3. Download backup file (for verification):
   - Click: Backup entry → Download
   - Save to: `D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\backups\test-backup-[date].sql`
   - Verify: File downloaded successfully, size reasonable

4. Test restore procedure (CAUTION: Use test environment):

   **Option A: Document restore steps (safer)**
   ```markdown
   ## Restore Procedure (documented, not executed)

   1. In Dokploy: Databases → Backups → Select backup
   2. Click: "Restore" or "Upload backup"
   3. Confirm: Restoration (overwrites current data)
   4. Wait: 1-5 minutes for completion
   5. Verify: Application reconnects and data intact
   ```

   **Option B: Actual restore test (only if you have separate test database)**
   - Create duplicate test database
   - Restore backup to test database
   - Verify data integrity
   - DO NOT restore to production database during migration

5. Document backup/restore procedure in NOTES.md

**Validation**:
- [ ] Manual backup completed successfully
- [ ] Backup file downloadable
- [ ] Backup size reasonable (matches database size)
- [ ] Restore procedure documented (or tested on separate DB)

**Documentation** (add to NOTES.md):

```markdown
## Database Backup Configuration (T017-T018)

**Date**: 2025-10-26
**Database**: marcusgoll-postgres (Supabase PostgreSQL)

### Backup Schedule
- Frequency: Daily at 2:00 AM UTC
- Retention: 7 days
- Location: /opt/dokploy/backups/
- Compression: Enabled

### Manual Backup Test
- Test Date: [date]
- Backup Size: [X] MB
- Duration: [X] seconds
- Status: Success ✓

### Restore Procedure
1. Dokploy → Databases → Backups
2. Select backup by date
3. Click "Restore"
4. Confirm restoration
5. Wait 1-5 minutes
6. Verify application connectivity

### Validation
- [x] Automated backups configured
- [x] Manual backup successful
- [x] Restore procedure documented
- [x] Backup retention policy set (7 days)
```

---

## PHASE 5: CI/CD Integration (T019-T023)

**Duration**: 60-90 minutes
**Can run in parallel with Phase 4**

### T019: Generate Webhook URL in Dokploy

**Execution Steps**:

1. In Dokploy UI:
   - Navigate: Applications → marcusgoll-nextjs → Settings or Webhooks

2. Find webhook configuration section
   - Look for: "GitHub Webhook" or "Deployment Webhook"

3. Generate webhook:
   - Click: "Generate Webhook" or "Create Webhook"
   - Dokploy will create:
     - Webhook URL: `https://deploy.marcusgoll.com/api/webhooks/[unique-id]`
     - Webhook Secret: [random generated secret]

4. Copy webhook details:
   ```
   Webhook URL: [copy full URL]
   Webhook Secret: [copy secret]
   ```
   Save to secure notes (needed for T020)

**Validation**:
- [ ] Webhook URL generated
- [ ] Webhook secret generated
- [ ] Both copied and saved securely

---

### T020: Configure GitHub Webhook for Push-to-Deploy

**Execution Steps**:

1. Open GitHub repository:
   - URL: https://github.com/YOUR_USERNAME/marcusgoll
   - Navigate: Settings → Webhooks

2. Add webhook:
   - Click: "Add webhook"

3. Configure webhook:
   ```
   Payload URL: [paste Dokploy webhook URL from T019]
   Content type: application/json
   Secret: [paste Dokploy webhook secret from T019]
   SSL verification: Enable SSL verification
   ```

4. Select events:
   ```
   Which events: "Just the push event"
   OR: Individual events → Select "Pushes"
   Active: ✓ Checked
   ```

5. Branch filter (if available):
   ```
   Branches: main only
   ```

6. Save webhook:
   - Click: "Add webhook"
   - GitHub will test the webhook immediately

7. Verify webhook active:
   - Status: Should show green checkmark ✓
   - Recent Deliveries: Should show initial ping delivery
   - Response: 200 OK

**Validation**:
- [ ] Webhook created in GitHub
- [ ] Payload URL and secret configured
- [ ] SSL verification enabled
- [ ] Webhook shows active with green checkmark
- [ ] Initial ping delivery successful (200 OK)

---

### T021: Test Webhook Deployment Flow

**Purpose**: Verify push-to-deploy automation works

**Execution Steps**:

1. Make a test commit to main branch:
   ```bash
   # On your local machine
   cd D:\Coding\marcusgoll

   # Create test file
   echo "<!-- Dokploy webhook test - $(date) -->" >> README.md

   # Commit and push
   git add README.md
   git commit -m "test: verify Dokploy webhook integration"
   git push origin main
   ```

2. Monitor GitHub webhook:
   - GitHub: Repository → Settings → Webhooks → Click your webhook
   - Tab: "Recent Deliveries"
   - Should show: New delivery within seconds
   - Status: 200 OK
   - Body: Click to see payload

3. Monitor Dokploy deployment:
   - Dokploy UI: Applications → marcusgoll-nextjs
   - Should show: New deployment triggered automatically
   - Status: "Building" or "Deploying"
   - Logs: Should show build progress in real-time

4. Wait for deployment completion:
   - Expected: 5-7 minutes
   - Status should change: "Building" → "Deployed"

5. Verify deployment on test subdomain:
   ```powershell
   # Check test site updated
   curl https://test.marcusgoll.com | Select-String "Dokploy webhook test"
   # Should find the test comment in HTML if it's in a rendered page
   ```

6. Check deployment history:
   - Dokploy: Applications → marcusgoll-nextjs → Deployments
   - Should show: 2 deployments now (manual from T014 + webhook-triggered)
   - Latest: Shows commit SHA from your test commit

**Validation**:
- [ ] GitHub webhook delivered successfully (200 OK)
- [ ] Dokploy deployment triggered automatically
- [ ] Build completed without errors
- [ ] test.marcusgoll.com updated with new commit
- [ ] Deployment history shows webhook-triggered deployment

---

### T022: Update GitHub Actions Workflow for Dokploy Integration

**Purpose**: Keep CI verify steps, remove manual SSH deployment

**Execution Steps**:

1. Read current workflow:
   ```bash
   # View current workflow
   cat D:\Coding\marcusgoll\.github\workflows\deploy-production.yml
   ```

2. Create updated workflow:

   Open: `D:\Coding\marcusgoll\.github\workflows\deploy-production.yml`

   Update to:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  verify-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Build application (test build)
        run: npm run build
        env:
          # Add minimal env vars needed for build
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      # Deployment happens via Dokploy webhook (automatic)
      # GitHub push → Webhook → Dokploy → Deploy
      # No manual SSH steps needed

      - name: Notify deployment initiated
        run: |
          echo "✅ CI checks passed"
          echo "🚀 Dokploy will deploy automatically via webhook"
          echo "📊 Monitor deployment: https://deploy.marcusgoll.com"
```

3. Commit workflow changes:
   ```bash
   git add .github/workflows/deploy-production.yml
   git commit -m "chore: update CI workflow for Dokploy webhook deployment"
   git push origin main
   ```

4. Verify workflow runs:
   - GitHub: Actions tab
   - Should show: New workflow run triggered by push
   - Steps: Checkout → Setup → Install → Lint → Type Check → Build
   - Expected: All steps pass ✓

5. Verify Dokploy deployment also triggered:
   - Dokploy UI: Should show new deployment
   - This confirms both CI and Dokploy webhook working together

**Validation**:
- [ ] GitHub Actions workflow updated
- [ ] SSH deployment steps removed
- [ ] CI verify steps kept (lint, type-check, build)
- [ ] Workflow commit pushed to main
- [ ] Workflow runs successfully in GitHub Actions
- [ ] Dokploy deployment triggered by same push

---

### T023: Configure Deployment Notifications (Optional - US6)

**Purpose**: Get notified of deployment success/failure

**Execution Steps**:

1. In Dokploy UI:
   - Navigate: Applications → marcusgoll-nextjs → Notifications
   - OR: Settings → Notifications

2. Add notification channel:
   ```
   Type: Email
   Email: marcus@marcusgoll.com
   Events:
   - Deployment Success ✓
   - Deployment Failed ✓
   - Build Failed ✓
   ```

3. Test notification:
   - Click: "Send Test" or trigger new deployment
   - Check email: Should receive notification

4. (Optional) Alternative notification channels:
   - Slack: If you have a workspace
   - Discord: If you have a server
   - Webhook: For custom integrations

**Validation**:
- [ ] Notification channel configured
- [ ] Test notification received
- [ ] Events selected (success, failure)

**Note**: This is optional (US6 - P2 priority). Skip if not needed immediately.

---

## PHASE 6: Production Cutover (T024-T027)

**Duration**: 30-45 minutes
**CRITICAL PHASE - Production traffic switches to Dokploy**

### T024: Backup Current Nginx Configuration

**Purpose**: Quick rollback capability if cutover fails

**Execution Steps**:

1. SSH to VPS:
   ```bash
   ssh root@178.156.129.179
   ```

2. Backup current production Nginx config:
   ```bash
   sudo cp /etc/nginx/sites-available/marcusgoll /etc/nginx/sites-available/marcusgoll.backup-pre-dokploy
   ```

3. Verify backup created:
   ```bash
   ls -lh /etc/nginx/sites-available/marcusgoll.backup-pre-dokploy
   # Should show file with today's timestamp
   ```

4. Download backup locally (optional):
   ```powershell
   # Windows PowerShell
   scp root@178.156.129.179:/etc/nginx/sites-available/marcusgoll.backup-pre-dokploy D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\
   ```

**Validation**:
- [ ] Nginx backup file created on VPS
- [ ] Backup file downloaded locally (optional)
- [ ] Ready for rollback if needed

**Rollback command** (for reference):
```bash
# If cutover fails, restore backup:
sudo cp /etc/nginx/sites-available/marcusgoll.backup-pre-dokploy /etc/nginx/sites-available/marcusgoll
sudo nginx -t
sudo systemctl reload nginx
```

---

### T025: Configure Production Domain in Dokploy

**Execution Steps**:

1. In Dokploy UI:
   - Navigate: Applications → marcusgoll-nextjs → Domains

2. Add production domain:
   - Click: "Add Domain"
   - Domain: `marcusgoll.com`
   - Include www: `www.marcusgoll.com` (if you use www)
   - SSL: Enable (Let's Encrypt automatic)
   - Save

3. Dokploy will:
   - Configure Nginx routing for marcusgoll.com
   - Provision SSL certificate (may take 1-5 minutes)
   - Set up HTTP → HTTPS redirect

4. Keep test subdomain:
   - Keep: test.marcusgoll.com active
   - Purpose: Comparison and rollback reference

5. Verify domain configuration:
   - Status: "SSL Provisioned" or "Active"
   - Certificate: Let's Encrypt

**Validation**:
- [ ] marcusgoll.com added to Dokploy
- [ ] SSL certificate provisioned
- [ ] test.marcusgoll.com still active
- [ ] Both domains show "Active" status

---

### T026: Update Nginx to Route marcusgoll.com to Dokploy

**Purpose**: Switch production traffic from old Docker setup to Dokploy-managed container

**Execution Steps**:

**Option A: Let Dokploy Manage Routing (Recommended)**

Dokploy automatically configures Nginx when you add a domain (T025). Verify it worked:

1. SSH to VPS:
   ```bash
   ssh root@178.156.129.179
   ```

2. Check Dokploy-generated Nginx config:
   ```bash
   # Dokploy creates configs in /etc/nginx/conf.d/ or similar
   ls -la /etc/nginx/conf.d/ | grep dokploy
   # OR
   ls -la /etc/nginx/sites-enabled/ | grep dokploy
   ```

3. If Dokploy created config for marcusgoll.com:
   - Verify config points to Dokploy container
   - You may need to disable old config:
     ```bash
     sudo rm /etc/nginx/sites-enabled/marcusgoll
     sudo nginx -t
     sudo systemctl reload nginx
     ```

**Option B: Manual Nginx Update (If Dokploy didn't auto-configure)**

1. Edit existing Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/marcusgoll
   ```

2. Update proxy_pass to point to Dokploy container:
   ```nginx
   # Find the location / block
   location / {
       # OLD: proxy_pass http://localhost:3000;  # Old Docker Compose app
       # NEW: proxy_pass to Dokploy container port

       # Get Dokploy container port:
       # docker ps | grep marcusgoll-nextjs
       # Look for port mapping like: 0.0.0.0:XXXXX->3000/tcp

       proxy_pass http://localhost:XXXXX;  # Replace XXXXX with actual port

       # Keep existing headers
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

3. Test and reload:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

**Validation Command**:
```bash
# Verify marcusgoll.com routes to Dokploy container
curl -I https://marcusgoll.com
# Check response headers, should be from Dokploy-managed app
```

**Validation**:
- [ ] Nginx configuration updated
- [ ] nginx -t passes
- [ ] Nginx reloaded successfully
- [ ] marcusgoll.com routes to Dokploy container

---

### T027: Verify Production Cutover Successful

**Purpose**: Comprehensive production validation

**Execution Steps**:

### 1. Homepage Test
```
URL: https://marcusgoll.com (NOT test subdomain)
Expected: Homepage loads
Verify: Same as test.marcusgoll.com
```

### 2. Blog Posts Test
```
URL: https://marcusgoll.com/blog
Verify: Posts load from database
Check: Post count matches previous production
```

### 3. Newsletter Form Test
```
Location: Homepage
Action: Submit test subscription
Verify: Subscription confirmation (check Resend/Mailgun)
Verify: Subscriber added to database
```

### 4. Database Connection Test
```
Verification: Posts visible (DATABASE_URL working)
Check: Can create new post (if admin access)
Verify: No database errors in Dokploy logs
```

### 5. Google Analytics Test
```
GA4: Open Real-time reports
Action: Visit marcusgoll.com in incognito
Verify: Event appears in GA4 real-time
Confirms: GA4_MEASUREMENT_ID working
```

### 6. Browser Console Test
```
DevTools: F12 → Console
Check: No errors
Allowed: Minor warnings
```

### 7. Performance Test
```
Network: DevTools → Network → Reload
Measure: Load time
Target: <2 seconds (spec NFR-003)
Verify: No regression from baseline
```

### 8. Lighthouse Audit
```
Run: Chrome DevTools → Lighthouse
Target Scores:
- Performance: ≥85 (constitution.md)
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90
```

### 9. Multi-page Test
```
Test pages:
- / (homepage)
- /blog (list)
- /blog/[slug] (individual post)
- /about (if exists)
- /contact (if exists)

Verify: All load correctly
```

### 10. Production URL Verification
```
Ensure testing: https://marcusgoll.com (NOT test subdomain)
Verify: Production domain serving Dokploy-managed app
Check: SSL certificate for marcusgoll.com (not test.marcusgoll.com)
```

**Validation Checklist**:
- [ ] Homepage loads on marcusgoll.com
- [ ] Blog posts render correctly
- [ ] Newsletter form submits successfully
- [ ] Database connection working
- [ ] Google Analytics tracking events
- [ ] No browser console errors
- [ ] Response time <2 seconds
- [ ] Lighthouse score ≥85
- [ ] All pages accessible
- [ ] SSL certificate valid for marcusgoll.com

**Documentation** (add to NOTES.md):

```markdown
## Production Cutover Validation (T027)

**Date**: 2025-10-26
**Production URL**: https://marcusgoll.com
**Deployment Platform**: Dokploy (marcusgoll-nextjs)

### Functional Tests
- [x] Homepage: Loaded successfully
- [x] Blog posts: All X posts visible
- [x] Newsletter: Test submission successful
- [x] Database: Connected and responsive
- [x] Analytics: GA4 tracking confirmed
- [x] Console: No critical errors

### Performance Metrics
- Page Load: X.Xs (target: <2s) ✓
- Lighthouse Performance: XX/100 (target: ≥85) ✓
- Lighthouse Accessibility: XX/100
- Lighthouse Best Practices: XX/100
- Lighthouse SEO: XX/100

### Comparison to Pre-Migration
- Performance: [Better/Same/Regression of X%]
- Functionality: All features working ✓
- User Experience: Identical ✓

### Issues Found
[None / List any issues]

### Status
- [x] Production cutover successful
- [x] All validation tests passed
- [x] No user-visible regression
- [x] Ready for 24-hour monitoring (Phase 7)
```

**If Issues Found**:
- Document in NOTES.md
- Assess severity (blocking vs. minor)
- If blocking: Rollback to old infrastructure (see rollback procedure below)
- If minor: Proceed to Phase 7, fix issues via Dokploy deployments

---

## PHASE 7: Post-Migration Validation (T028-T037)

**Duration**: 24-48 hours (mostly monitoring)

### T028: Configure Health Check Monitoring in Dokploy

**Execution Steps**:

1. In Dokploy UI:
   - Navigate: Applications → marcusgoll-nextjs → Health Checks

2. Configure health check:
   ```
   Endpoint: /api/health
   Interval: 30 seconds (spec NFR-009)
   Timeout: 10 seconds
   Expected Response: 200 OK
   Expected Body: {"status":"ok"} (or similar)
   ```

3. Configure restart policy:
   ```
   Restart on failure: Enabled
   Max retries: 3
   Retry interval: 30 seconds
   Action: Auto-restart container if 3 consecutive failures
   ```

4. Save configuration

5. Verify health check running:
   - Status: Should show "Healthy" or "Passing"
   - Last check: Recent timestamp

**Validation**:
- [ ] Health check configured (/api/health, 30s interval)
- [ ] Auto-restart enabled (3 failures)
- [ ] Status shows "Healthy"

---

### T029: Configure Monitoring Dashboard and Alerts (Optional - US7)

**Execution Steps**:

1. In Dokploy UI:
   - Navigate: Applications → marcusgoll-nextjs → Monitoring or Metrics

2. Enable metrics collection:
   ```
   Metrics:
   - CPU usage (%)
   - Memory usage (MB / %)
   - Network traffic (MB/s)
   - Disk I/O
   Retention: 24 hours minimum (spec FR-021)
   ```

3. Configure alerts:
   ```
   CPU Alert:
   - Threshold: >80% for 5 minutes
   - Action: Email to marcus@marcusgoll.com

   Memory Alert:
   - Threshold: >75% for 5 minutes
   - Action: Email notification

   Disk Alert:
   - Threshold: >80% disk usage
   - Action: Email notification
   ```

4. Set notification channel:
   - Email: marcus@marcusgoll.com
   - (Optional: Slack/Discord webhook)

5. Test alert:
   - Trigger test alert if available
   - Verify email received

**Validation**:
- [ ] Metrics enabled (CPU, memory, network, disk)
- [ ] Retention ≥24 hours
- [ ] Alerts configured (CPU >80%, Memory >75%, Disk >80%)
- [ ] Notification email set
- [ ] Test alert received (if tested)

**Note**: Optional (US7 - P2 priority). Core monitoring is health checks (T028).

---

### T030: Validate One-Click Rollback Capability

**Purpose**: Verify emergency rollback procedure works

**Execution Steps**:

1. Note current deployment:
   - Dokploy: Applications → marcusgoll-nextjs → Deployments
   - Note: Latest deployment ID, commit SHA, timestamp

2. Test rollback to previous deployment:
   - Deployments list: Select second-most-recent deployment
   - Click: "Rollback" or "Redeploy" button
   - Confirm: Rollback action

3. Monitor rollback:
   - Should trigger redeployment of previous version
   - Watch: Logs show rollback in progress
   - Expected duration: <5 minutes (spec FR-026)

4. Verify previous version live:
   ```powershell
   # Check if previous version deployed
   curl https://marcusgoll.com
   # Compare to current version (should be different if there were changes)
   ```

5. Roll forward to latest:
   - Deployments: Select most recent (original latest)
   - Click: "Rollback" or "Redeploy"
   - Verify: Back to latest version

**Validation**:
- [ ] Rollback triggered successfully
- [ ] Previous deployment redeployed
- [ ] Rollback duration <5 minutes
- [ ] Site functional with previous version
- [ ] Roll-forward to latest successful

**Documentation** (add to NOTES.md):

```markdown
## Rollback Test (T030)

**Date**: 2025-10-26

### Test Details
- Current Deployment: [commit SHA]
- Rolled back to: [previous commit SHA]
- Rollback Duration: X:XX (target: <5 min) ✓

### Rollback Steps
1. Dokploy → Applications → Deployments
2. Select previous deployment
3. Click "Rollback"
4. Wait for redeployment
5. Verify site functional

### Roll-forward Test
- Rolled forward to: [original commit SHA]
- Duration: X:XX

### Status
- [x] Rollback capability verified
- [x] Duration under 5 minutes
- [x] One-click process confirmed
```

---

### T031: Export Dokploy Configuration for Disaster Recovery (Optional - US8)

**Purpose**: Version-controlled config backup for VPS rebuild scenarios

**Execution Steps**:

1. Install Dokploy CLI locally (Windows):
   ```powershell
   # If Dokploy has a CLI
   npm install -g @dokploy/cli

   # Or use Dokploy API export feature if no CLI
   ```

2. Authenticate CLI:
   ```powershell
   dokploy login
   # URL: https://deploy.marcusgoll.com
   # Username: admin
   # Password: [from password manager]
   ```

3. Export configuration:
   ```powershell
   dokploy export --output D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\dokploy-config.yaml
   ```

4. Sanitize config file:
   - Open: dokploy-config.yaml
   - Remove: Actual secret values
   - Keep: Structure and keys
   - Example:
     ```yaml
     applications:
       - name: marcusgoll-nextjs
         environment:
           - key: DATABASE_URL
             value: REDACTED  # Change actual value to REDACTED
     ```

5. Commit sanitized config to Git:
   ```bash
   git add specs/047-dokploy-deployment-platform/configs/dokploy-config.yaml
   git commit -m "docs: add sanitized Dokploy configuration for disaster recovery"
   git push origin feature/047-dokploy-deployment-platform
   ```

6. Document restore procedure in NOTES.md

**Validation**:
- [ ] Dokploy CLI installed (or API export used)
- [ ] Configuration exported to dokploy-config.yaml
- [ ] Secrets sanitized (REDACTED, not actual values)
- [ ] Config committed to Git
- [ ] Restore procedure documented

**Note**: Optional (US8 - P2 priority). Manual documentation is acceptable alternative.

---

### T032: Monitor Production Stability (24-Hour Observation)

**Purpose**: Ensure no degradation or issues post-migration

**Execution Steps**:

**Hour 0-2 (Immediate monitoring)**:

1. Watch Dokploy logs:
   - Dokploy: Applications → marcusgoll-nextjs → Logs
   - Look for: Errors, warnings, crashes
   - Expected: Normal traffic logs only

2. Check resource usage:
   - CPU: Should be <50% average (spec NFR-021)
   - Memory: Dokploy ~500MB + App ~200-300MB (spec NFR-022)
   - Expected total: <1GB for Dokploy+app

3. Monitor site accessibility:
   ```powershell
   # Run every 10 minutes for first 2 hours
   curl -I https://marcusgoll.com
   # Expected: 200 OK consistently
   ```

**Hour 2-12 (Periodic checks)**:

4. Check deployment logs hourly:
   - No unexpected restarts
   - No health check failures
   - No error spikes

5. Review metrics (if configured in T029):
   - CPU trend: Stable
   - Memory trend: Stable (no leaks)
   - Network: Normal traffic pattern

**Hour 12-24 (Light monitoring)**:

6. Morning check (next day):
   - Site accessible
   - No alerts received
   - Deployment stable

7. Review overnight logs:
   - Check for errors during low-traffic hours
   - Verify automated backup ran (2AM UTC)

**Hour 24-48 (Confidence building)**:

8. Second day check:
   - Performance still meeting targets
   - No cumulative issues
   - Resource usage stable

**Validation**:
- [ ] No unexpected errors in logs (24h)
- [ ] Site accessible 100% uptime
- [ ] Resource usage within limits (CPU <50%, Memory <1GB)
- [ ] No health check failures
- [ ] No user-reported issues
- [ ] Performance targets maintained

**Documentation** (add to NOTES.md):

```markdown
## 24-Hour Stability Monitoring (T032)

**Start**: 2025-10-26 [time]
**End**: 2025-10-27 [time]

### Resource Usage
- CPU Average: X% (target: <50%)
- Memory Average: XXXMB (target: <1GB)
- Disk Usage: X% (target: <80%)

### Availability
- Uptime: 100% ✓
- Health Checks: All passing ✓
- Downtime: None

### Errors/Warnings
[None / List any issues found]

### User Reports
[None / List any user-reported issues]

### Status
- [x] 24-hour monitoring complete
- [x] Production stable
- [x] No critical issues
- [x] Ready for cleanup phase
```

---

### T033: Validate Automated Backup Execution

**Execution Steps**:

1. Wait for scheduled backup time:
   - Scheduled: Daily 2:00 AM UTC
   - Check after: 2:05 AM UTC

2. Verify backup created:
   - SSH to VPS:
     ```bash
     ssh root@178.156.129.179
     ls -lh /opt/dokploy/backups/
     # Look for today's backup file
     ```
   - OR Dokploy UI: Databases → Backups → Check list

3. Verify backup details:
   - Date: Today's date
   - Size: Reasonable (similar to manual backup from T018)
   - Status: Completed

4. Check backup notification (if configured):
   - Email: Should receive "Backup successful" email

5. Verify retention policy:
   - Check backup list has ≤7 backups
   - Oldest backup: ≤7 days old

**Validation**:
- [ ] Automated backup executed at 2:00 AM UTC
- [ ] Backup file created successfully
- [ ] Backup size reasonable
- [ ] Retention policy working (≤7 backups)
- [ ] Backup notification received (if configured)

---

### T034: Run Comprehensive Smoke Tests on Production

**Execution Steps**:

Run all tests from T027 again after 24-48 hours to confirm stability:

1. **Homepage Test**:
   ```bash
   curl -I https://marcusgoll.com
   # Expected: HTTP/2 200 OK
   ```

2. **Health Check Test**:
   ```bash
   curl https://marcusgoll.com/api/health
   # Expected: {"status":"ok"}
   ```

3. **Recent Post Test**:
   - Load recent blog post in browser
   - Verify: Content renders, no errors

4. **Newsletter Test**:
   - Submit test subscription
   - Verify: Confirmation received (Resend/Mailgun)
   - Verify: Subscriber in database

5. **Database Read Test**:
   - Verify: Posts load from PostgreSQL
   - Check: Post count stable

6. **Analytics Test**:
   - GA4: Real-time report
   - Action: Visit site in incognito
   - Verify: Event tracked

**Validation**:
- [ ] All smoke tests passed after 24-48 hours
- [ ] No test regressions from T027
- [ ] Production stable under real traffic

---

### T035: Document Deployment Workflow

**Purpose**: Create runbook for future deployments

**Execution Steps**:

Create documentation in NOTES.md:

```markdown
## Deployment Runbook

### Manual Deployment via Dokploy UI

1. Login: https://deploy.marcusgoll.com
2. Navigate: Applications → marcusgoll-nextjs
3. Click: "Deploy" button
4. Monitor: Logs in real-time
5. Expected: 5-7 minutes to complete
6. Verify: https://marcusgoll.com updated

### Automatic Deployment (Push-to-Deploy)

1. Commit changes locally: `git commit -m "message"`
2. Push to main: `git push origin main`
3. GitHub webhook triggers Dokploy automatically
4. Monitor: Dokploy UI → Deployments
5. Verify: Deployment completes in 5-7 minutes

### View Logs and Metrics

**Application Logs**:
- Dokploy → Applications → marcusgoll-nextjs → Logs
- Real-time streaming logs
- Filter by date/severity if needed

**Deployment History**:
- Dokploy → Applications → Deployments
- Shows: All past deployments with commit SHA
- Actions: Rollback, view logs, redeploy

**Metrics** (if configured):
- Dokploy → Applications → Monitoring
- Shows: CPU, memory, network graphs
- Retention: 24 hours minimum

### Rollback Procedure

**UI Method** (one-click, <5 min):
1. Dokploy → Applications → Deployments
2. Select: Previous working deployment
3. Click: "Rollback" button
4. Monitor: Redeployment logs
5. Verify: Site functioning with previous version

**Emergency CLI Method** (if Dokploy UI inaccessible):
1. SSH to VPS: `ssh root@178.156.129.179`
2. List containers: `docker ps | grep marcusgoll`
3. Find previous image: `docker images | grep marcusgoll`
4. Stop current: `docker stop [container-id]`
5. Start previous: `docker run [previous-image-id]`
6. Update Nginx if needed
7. Restart Dokploy: `docker restart dokploy`

**Nuclear Option** (restore pre-Dokploy setup):
1. SSH to VPS
2. Restore Nginx: `sudo cp /etc/nginx/sites-available/marcusgoll.backup-pre-dokploy /etc/nginx/sites-available/marcusgoll`
3. Reload Nginx: `sudo systemctl reload nginx`
4. Start old Docker Compose: `cd /opt/marcusgoll && docker-compose -f docker-compose.prod.yml up -d`
5. Recovery time: <10 minutes

### Update Environment Variables

1. Dokploy → Applications → marcusgoll-nextjs → Environment Variables
2. Add/Edit/Delete variables via UI
3. Click: "Save" or "Update"
4. Action: Application restarts automatically
5. Verify: Check logs for successful restart

### Database Backup and Restore

**Manual Backup**:
1. Dokploy → Databases → marcusgoll-postgres → Backups
2. Click: "Backup Now"
3. Wait: 30 seconds to 5 minutes
4. Download: Click backup → Download

**Restore from Backup**:
1. Dokploy → Databases → Backups
2. Select: Backup by date
3. Click: "Restore"
4. Confirm: Restoration (overwrites current data)
5. Wait: 1-5 minutes
6. Verify: Application reconnects successfully

**Automated Backups**:
- Schedule: Daily 2:00 AM UTC
- Retention: 7 days
- Location: /opt/dokploy/backups/
- No action needed (automatic)
```

**Validation**:
- [ ] Deployment runbook documented in NOTES.md
- [ ] Covers: Manual deploy, auto-deploy, logs, rollback, env vars, database
- [ ] Emergency procedures included

---

### T036: Measure Success Metrics Baseline

**Purpose**: Quantify deployment efficiency improvements

**Execution Steps**:

1. **Deployment Time Metric**:
   - Collect: Time for first 3 Dokploy deployments
   - Dokploy: Deployments → Check duration for each
   - Average: (Deploy1 + Deploy2 + Deploy3) / 3
   - Compare to: Pre-migration baseline (manual Docker ~10-15 min)

2. **Time Savings Metric**:
   - Track: Time spent on deployment tasks (week 1)
   - Before: Manual SSH, docker commands, env edits (~30 min/deploy)
   - After: Git push only (~1 min/deploy)
   - Calculate: Time saved per week

3. **Deployment Frequency Metric**:
   - Before: ~1-2 deploys/week (manual friction)
   - After: Track deploys in first week (predicted: 3-5/week due to ease)

4. **Deployment Success Rate**:
   - Before: 90% success (manual errors)
   - After: Count successes vs failures in first week
   - Target: >95% success rate

**Documentation** (add to NOTES.md):

```markdown
## Success Metrics Baseline (T036)

**Measurement Period**: Week 1 (2025-10-26 to 2025-11-02)

### Deployment Time
- Deploy 1: X:XX minutes
- Deploy 2: X:XX minutes
- Deploy 3: X:XX minutes
- Average: X:XX minutes
- Pre-migration: 10-15 minutes (manual)
- Improvement: XX% faster ✓

### Time Savings
- Manual deployment effort: ~30 min/deploy
- Dokploy deployment effort: ~1 min/deploy (just git push)
- Savings: 29 min/deploy
- Weekly deploys: X
- Weekly time saved: XXX minutes (~X hours/week) ✓

### Deployment Frequency
- Pre-migration: 1-2 deploys/week
- Post-migration (week 1): X deploys/week
- Increase: XX% ✓

### Deployment Success Rate
- Successful deploys: X
- Failed deploys: X
- Success rate: XX% (target: >95%)

### HEART Framework Alignment (from spec.md)
- **Happiness**: Deployment stress reduced ✓
- **Engagement**: More frequent deploys (less friction) ✓
- **Adoption**: 100% (solo dev, full migration) ✓
- **Retention**: Dashboard usage daily ✓
- **Task Success**: >95% deploy success rate ✓
```

**Validation**:
- [ ] Deployment time measured (3+ deploys)
- [ ] Time savings calculated
- [ ] Deployment frequency tracked
- [ ] Success rate measured
- [ ] Results documented in NOTES.md

---

### T037: Clean Up Old Deployment Infrastructure

**Purpose**: Decommission pre-Dokploy setup after validation period

**⚠️ WARNING**: Only execute after 7 days of successful Dokploy operation

**Execution Steps**:

**Day 7 Checkpoint**:

1. Verify Dokploy stability:
   - [ ] 7 days uptime with no major issues
   - [ ] All validation tests still passing
   - [ ] Automated backups running (7 backups created)
   - [ ] No need to rollback to old infrastructure

2. If all stable, proceed with cleanup:

**Cleanup Steps**:

1. SSH to VPS:
   ```bash
   ssh root@178.156.129.179
   ```

2. Stop old Docker Compose setup (if still running):
   ```bash
   cd /opt/marcusgoll
   docker-compose -f docker-compose.prod.yml down
   # Containers stopped and removed
   ```

3. Archive old configuration files:
   ```bash
   # Create archive directory
   mkdir -p /opt/archive/pre-dokploy-$(date +%Y%m%d)

   # Move files to archive (don't delete yet)
   mv /opt/marcusgoll/docker-compose.prod.yml /opt/archive/pre-dokploy-*/
   mv /opt/marcusgoll/deploy.sh /opt/archive/pre-dokploy-*/

   # Keep .env.production for 30 days (backup)
   cp /opt/marcusgoll/.env.production /opt/archive/pre-dokploy-*/.env.production.backup
   ```

4. Remove old Nginx backup (if new config stable):
   ```bash
   # After confirming new config working for 7 days
   rm /etc/nginx/sites-available/marcusgoll.backup-pre-dokploy
   ```

5. (Optional) Remove old Docker images:
   ```bash
   # List old images
   docker images | grep marcusgoll

   # Remove if certain (CAUTION: can't easily recover)
   # docker rmi [image-id]
   # Recommendation: Keep for 30 days, then remove
   ```

6. Schedule .env.production deletion (30 days):
   ```bash
   # Add to crontab for 30 days from now
   echo "0 0 $(date -d '+30 days' '+%d %m') * * rm /opt/archive/pre-dokploy-*//.env.production.backup" | crontab -
   ```

**Documentation** (add to NOTES.md):

```markdown
## Infrastructure Cleanup (T037)

**Date**: 2025-11-02 (Day 7 post-migration)
**Status**: Old infrastructure decommissioned

### Decommissioned Components
- [x] Old Docker Compose setup stopped
- [x] docker-compose.prod.yml archived
- [x] deploy.sh archived
- [x] Old Nginx config removed
- [ ] .env.production kept for 30 days, then auto-delete

### Archive Location
- VPS Path: /opt/archive/pre-dokploy-20251102/
- Local Backup: D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\pre-migration-backup\

### Old Docker Images
- Status: Kept for 30 days
- Schedule deletion: 2025-12-02

### Rollback Capability
- VPS Snapshot: Available in Hetzner (from T001)
- Archive files: Available for 30+ days
- Dokploy can be removed if needed (production can be restored from snapshot)

### Status
- [x] Cleanup complete
- [x] Archive backups preserved
- [x] Dokploy is now primary deployment platform
```

**Validation**:
- [ ] Old Docker Compose stopped
- [ ] Configuration files archived (not deleted)
- [ ] .env.production scheduled for deletion (30 days)
- [ ] Archive location documented
- [ ] Cleanup steps documented in NOTES.md

---

## Phase 4-7 Completion Checklist

**Phase 4: Database Integration**
- [ ] T016: Database imported to Dokploy management
- [ ] T017: Automated backups configured (daily, 7-day retention)
- [ ] T018: Manual backup tested successfully

**Phase 5: CI/CD Integration**
- [ ] T019: Webhook URL generated in Dokploy
- [ ] T020: GitHub webhook configured
- [ ] T021: Push-to-deploy tested and working
- [ ] T022: GitHub Actions workflow updated
- [ ] T023: Deployment notifications configured (optional)

**Phase 6: Production Cutover**
- [ ] T024: Nginx configuration backed up
- [ ] T025: Production domain added to Dokploy
- [ ] T026: Nginx routing updated to Dokploy
- [ ] T027: Production validation passed (all tests)

**Phase 7: Post-Migration Validation**
- [ ] T028: Health check monitoring configured
- [ ] T029: Monitoring dashboard and alerts configured (optional)
- [ ] T030: Rollback capability tested
- [ ] T031: Dokploy configuration exported (optional)
- [ ] T032: 24-hour stability monitoring complete
- [ ] T033: Automated backup validated
- [ ] T034: Comprehensive smoke tests passed
- [ ] T035: Deployment runbook documented
- [ ] T036: Success metrics baseline measured
- [ ] T037: Old infrastructure cleaned up (after 7 days)

**Overall Migration Status**: SUCCESS / PARTIAL / BLOCKED

**Total Time Spent**: [record actual time across all phases]

**Key Achievements**:
- [ ] Zero-downtime migration achieved
- [ ] All 39 tasks completed (MVP + optional enhancements)
- [ ] Production stable for 7+ days
- [ ] Deployment time reduced by XX%
- [ ] Time savings: XX hours/week

**Next Steps**:
- Continue using Dokploy for deployments
- Monitor metrics monthly
- Consider staging environment when traffic > 10K/mo (US10)
- Explore advanced monitoring integrations (T039, optional)

---

## Emergency Rollback Procedures

### Level 1: Rollback via Dokploy (Preferred)
```
Time: <5 minutes
Steps:
1. Dokploy UI → Deployments
2. Select previous working deployment
3. Click "Rollback"
4. Verify site functional
```

### Level 2: Restore Nginx to Pre-Dokploy
```
Time: <10 minutes
Steps:
1. SSH: ssh root@178.156.129.179
2. Restore: sudo cp /etc/nginx/sites-available/marcusgoll.backup-pre-dokploy /etc/nginx/sites-available/marcusgoll
3. Reload: sudo systemctl reload nginx
4. Start old Docker: cd /opt/marcusgoll && docker-compose up -d
```

### Level 3: VPS Snapshot Restoration
```
Time: 5-20 minutes
Steps:
1. Hetzner Console → Snapshots
2. Select: pre-dokploy-migration-2025-10-26
3. Restore to VPS
4. Wait for restoration
5. Update DNS if IP changed
```

---

## Appendix: Future Enhancements (Phase 8 - Optional)

### T038: Staging Environment Setup (US10 - Deferred)

**When to implement**: When traffic > 10K/mo or team grows beyond solo dev

**Research steps**:
1. Dokploy supports multi-server management
2. Would need second VPS or server for staging
3. Workflow: feature → staging → main → production
4. Cost: Additional VPS (€20-30/mo) when justified by traffic

**Documentation location**: NOTES.md or future staging-setup.md

### T039: Advanced Monitoring Integrations (Optional)

**Potential integrations**:
- Grafana: Advanced metrics dashboards
- Prometheus: Metrics collection and alerting
- UptimeRobot/Pingdom: External uptime monitoring
- Sentry: Error tracking and performance monitoring

**When to implement**: If monitoring needs grow beyond Dokploy built-in

**Documentation location**: NOTES.md for future reference

---

## Quick Reference Commands

```bash
# SSH to VPS
ssh root@178.156.129.179

# View Dokploy logs
docker logs -f $(docker ps -q -f name=dokploy)

# View application logs
# (Use Dokploy UI: Applications → Logs)

# Check database backups
ls -lh /opt/dokploy/backups/

# Verify production site
curl -I https://marcusgoll.com

# Test health check
curl https://marcusgoll.com/api/health

# Check Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

# Restart Dokploy
docker restart dokploy

# View Docker containers
docker ps
```

**Dokploy URLs**:
- Admin UI: https://deploy.marcusgoll.com
- Production: https://marcusgoll.com
- Test: https://test.marcusgoll.com (keep during validation period)
