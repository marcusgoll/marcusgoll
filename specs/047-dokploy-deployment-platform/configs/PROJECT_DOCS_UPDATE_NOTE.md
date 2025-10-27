# Project Documentation Update Instructions

**After Dokploy Migration Complete**: Update the following project documentation files

---

## docs/project/deployment-strategy.md

**Section to Update**: "Deployment Model" and "Environments"

**Add After Line ~20** (after "Planned Evolution"):

```markdown
### Dokploy Platform (Post-Migration)

**Status**: ACTIVE (migrated 2025-10-26)
**Purpose**: Self-hosted deployment platform for automated deployments

**Features**:
- Push-to-deploy via GitHub webhooks
- Web UI for deployment management (https://deploy.marcusgoll.com)
- One-click rollback capability
- Environment variable management via UI
- Automated database backups (daily, 7-day retention)
- Real-time deployment logs and monitoring
- Health check automation (30-second intervals)

**Deployment Workflow**:
1. Developer: `git push origin main`
2. GitHub: Webhook triggers Dokploy
3. Dokploy: Builds Docker image, runs tests, deploys
4. Production: Updated at marcusgoll.com within 5-7 minutes
5. Monitoring: Health checks ensure stability

**Rollback Procedure**:
1. Login: https://deploy.marcusgoll.com
2. Navigate: Applications → marcusgoll-nextjs → Deployments
3. Select: Previous working deployment
4. Click: "Rollback" button
5. Recovery time: <5 minutes

**Resource Usage**:
- Dokploy UI: ~500MB RAM
- Application: ~200-300MB RAM
- Total overhead: ~700-800MB (on 4-8GB VPS)
```

**Update "Environments" Section**:

Change "### Staging (Future)" to:

```markdown
### Staging (Planned)

**Enabled by**: Dokploy multi-server support
**When to Add**: When traffic > 10K/mo or team grows beyond solo developer
**Setup**: Dokploy UI → Add server → Configure staging subdomain
**Estimated Cost**: €20-30/mo for additional VPS
**Documentation**: See specs/047-dokploy-deployment-platform/implementation-guides/ for staging setup reference
```

---

## docs/project/development-workflow.md

**Section to Update**: "Deployment" section

**Replace manual deployment instructions with**:

```markdown
## Deployment

### Automated Deployment (Dokploy)

**Trigger**: Push to main branch

```bash
# 1. Commit changes
git add .
git commit -m "feat: add new feature"

# 2. Push to main (triggers deployment automatically)
git push origin main

# 3. Monitor deployment
# Visit: https://deploy.marcusgoll.com
# Navigate: Applications → marcusgoll-nextjs → Deployments
# Expected duration: 5-7 minutes
```

**Deployment Steps (Automated)**:
1. GitHub webhook triggers Dokploy
2. Dokploy clones repository
3. Builds Docker image using Dockerfile
4. Runs health checks
5. Deploys to production
6. Updates marcusgoll.com

**Manual Deployment (Optional)**:

If you need to deploy without pushing to Git:

```bash
# 1. Login to Dokploy
URL: https://deploy.marcusgoll.com
Username: admin
Password: [from password manager]

# 2. Navigate to application
Applications → marcusgoll-nextjs

# 3. Click "Deploy" button

# 4. Monitor logs in real-time
```

**Rollback (If Needed)**:

```bash
# 1. Login to Dokploy
# 2. Navigate: Applications → Deployments
# 3. Select previous working deployment
# 4. Click "Rollback"
# 5. Wait <5 minutes for rollback completion
```

**Environment Variables**:

```bash
# Update via Dokploy UI (no SSH needed)
# 1. Login: https://deploy.marcusgoll.com
# 2. Navigate: Applications → Environment Variables
# 3. Add/Edit/Delete variables
# 4. Click "Save" → Application restarts automatically
```

**Database Backups**:

```bash
# Automated: Daily at 2:00 AM UTC (7-day retention)
# Location: /opt/dokploy/backups/ on VPS

# Manual Backup:
# 1. Dokploy → Databases → marcusgoll-postgres → Backups
# 2. Click "Backup Now"
# 3. Wait 30 seconds to 5 minutes
# 4. Download backup if needed
```

**Monitoring**:

```bash
# View in Dokploy UI:
# - Real-time deployment logs
# - Application logs (stdout/stderr)
# - Resource usage (CPU, memory, network)
# - Health check status
# - Deployment history

# Access: https://deploy.marcusgoll.com
```
```

---

## docs/project/system-architecture.md

**Section to Add**: "Deployment Infrastructure" subsection under "Infrastructure"

```markdown
### Deployment Infrastructure

**Platform**: Dokploy (self-hosted)
**Version**: Latest stable
**Location**: Hetzner VPS (alongside application)
**Access**: https://deploy.marcusgoll.com

**Components**:
- **Dokploy Container**: Orchestrates deployments, manages configurations
- **Internal Registry**: Stores Docker images for rollback capability
- **Backup System**: Automated database backups (daily, 7-day retention)
- **Monitoring System**: Real-time metrics (CPU, memory, network, logs)
- **Webhook Handler**: Receives GitHub push events, triggers deployments

**Integration Points**:
- **GitHub**: Webhook on push to main branch
- **Nginx**: Reverse proxy for Dokploy UI (deploy.marcusgoll.com)
- **Docker**: Manages application containers
- **PostgreSQL**: External database (Supabase), monitored by Dokploy
- **Let's Encrypt**: SSL certificates for deploy.marcusgoll.com

**Data Flow**:
```
Developer → Git Push → GitHub Webhook → Dokploy
                                           ↓
                                    Build Docker Image
                                           ↓
                                    Deploy Container
                                           ↓
                                    Nginx → marcusgoll.com
```

**Resource Allocation**:
- Dokploy UI: ~500MB RAM, <5% CPU (idle)
- Application: ~200-300MB RAM, variable CPU
- Total VPS: 4-8GB RAM, 2-4 vCPUs (sufficient headroom)
```

---

## docs/project/tech-stack.md

**Section to Update**: "DevOps & Infrastructure"

**Add to DevOps section**:

```markdown
#### Deployment Platform

**Dokploy**
- Version: Latest stable (self-hosted)
- Purpose: Deployment automation, monitoring, rollback management
- Alternative to: Vercel, Netlify, Heroku (but self-hosted)
- UI: https://deploy.marcusgoll.com
- Features:
  - Push-to-deploy via GitHub webhooks
  - One-click rollback
  - Environment variable management
  - Database backup automation
  - Real-time logs and metrics
  - Multi-server support (for future staging)

**Why Chosen**:
- Self-hosted (maintains control, no vendor lock-in)
- Zero additional cost (runs on existing VPS)
- Docker-based (fits existing infrastructure)
- Vercel-like UX (familiar workflow)
- Open-source (active development, 2K+ stars)
- Enables easy staging setup when needed
```

---

## Execution Instructions

1. **Wait for Migration Complete**: Don't update docs until production stable on Dokploy for 7+ days
2. **Update Files**: Copy the markdown sections above into respective project doc files
3. **Adjust Dates**: Replace "2025-10-26" with actual migration completion date
4. **Verify Accuracy**: Ensure resource usage numbers match actual production metrics
5. **Commit Changes**:
   ```bash
   git add docs/project/*.md
   git commit -m "docs: update deployment strategy for Dokploy platform"
   git push origin main
   ```

---

## Additional Documentation

**For detailed migration process, see**:
- `specs/047-dokploy-deployment-platform/implementation-guides/README.md`
- `specs/047-dokploy-deployment-platform/NOTES.md` (Phase 4: Implementation section)

**For rollback procedures, see**:
- `specs/047-dokploy-deployment-platform/implementation-guides/04-database-cicd-cutover-validation.md` (Emergency Rollback Procedures section)
