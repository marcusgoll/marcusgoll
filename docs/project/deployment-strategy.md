# Deployment Strategy

**Last Updated**: 2025-10-26
**Deployment Model**: direct-prod (planned: staging-prod when traffic justifies)
**Related Docs**: See `system-architecture.md` for infrastructure, `tech-stack.md` for platform choices

## Deployment Model

**Choice**: direct-prod (MVP), migrate to staging-prod later
**Rationale**:
- Solo developer (Marcus) → staging overhead not justified initially
- Low traffic (< 1K visitors/mo) → production issues unlikely
- Can manually test locally before deploying
- Git history provides rollback capability
- **Migration path**: Add staging environment when team grows or traffic > 10K/mo

**Planned Evolution**:
- **Current** (direct-prod): main branch → production VPS
- **Future** (staging-prod): feature → staging → main → production

---

## Environments

### Development (Local)

**Purpose**: Local development and testing
**URL**: `http://localhost:3000`
**Database**: Local PostgreSQL (Docker Compose) or cloud dev instance
**Data**: Seed data (sample posts, test users)
**Secrets**: `.env.local` (not committed to Git)

**How to Run**:
```bash
# Start infrastructure
docker-compose up -d postgres

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run dev server
npm run dev
```

**Hot Reload**: Next.js Fast Refresh (instant updates on save)

### Staging (Future)

**Purpose**: Pre-production validation
**URL**: `https://staging.marcusgoll.com` (future)
**Database**: Separate staging database (copy of production schema, test data)
**Branch**: `staging` branch
**Deploy Trigger**: Merge to `staging` branch (auto-deploy via GitHub Actions)

**When to Add**:
- When traffic > 10K visitors/mo (higher risk of production bugs)
- When team size > 1 (code review process benefits from live staging)
- When deploying risky changes (database migrations, API changes)

**Differences from Production**:
- Test data (not real user content)
- More verbose logging
- Newsletter in test mode (no real emails sent)

### Production

**Purpose**: Live user-facing site
**URL**: `https://marcusgoll.com`, `https://www.marcusgoll.com`
**Database**: Production PostgreSQL (Supabase, self-hosted on VPS)
**Branch**: `main` branch
**Deploy Trigger**: Push to `main` (auto-deploy via GitHub Actions)

**Protections**:
- Required PR reviews (self-review for solo dev, but checkpoint)
- Automated checks must pass (lint, type-check, build)
- Manual testing checklist before merge
- Git tag for each production deploy (versioning)

---

## CI/CD Pipeline

**Tool**: GitHub Actions
**Configuration**: `.github/workflows/`

### Pipeline Stages

**Stage 1: Verify (on every PR and push)**

```yaml
# .github/workflows/verify.yml
name: Verify
on: [pull_request, push]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies (npm ci)
      - Lint (npm run lint)
      - Type check (npx tsc --noEmit)
      - Build (npm run build)
      - Prisma validation (npx prisma validate)
```

**Duration**: ~3 minutes
**Blocks merge if**: Any step fails

**Stage 2: Deploy to Production (on push to `main`)**

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Build Docker image
      - Tag image (commit SHA + latest)
      - Push to GitHub Container Registry
      - SSH to VPS
      - Pull Docker image
      - Run docker-compose up (recreate containers)
      - Health check (curl https://marcusgoll.com)
      - Tag commit with version (v1.x.x)
```

**Duration**: ~5-7 minutes
**Rollback if**: Health check fails (redeploy previous image)

---

## Deployment Process

### Deploying to Production

**Trigger**: Push to `main` branch

**Steps**:
1. Create feature branch: `git checkout -b feature/new-post`
2. Develop feature (write post, test locally)
3. Commit changes: `git commit -m "feat: add systematic thinking post"`
4. Push branch: `git push origin feature/new-post`
5. Create PR: `gh pr create --base main --title "Add systematic thinking post"`
6. Review checklist:
   - [ ] Content proofread (Grammarly, manual review)
   - [ ] Images optimized (WebP, < 500KB each)
   - [ ] Links tested (no broken links)
   - [ ] Lighthouse score ≥ 85
   - [ ] Metadata (title, excerpt, tags) complete
7. Merge PR (auto-deploys to production)
8. Monitor deployment logs (GitHub Actions)
9. Validate site (visit post URL, check homepage)
10. Monitor for 30 minutes (check GA4 for errors)

**Typical Duration**: 10-15 minutes (including manual checks)

**Quality Gates** (manual checklist):
- ✅ Content quality check (grammar, clarity)
- ✅ Local build succeeds
- ✅ No console errors in browser
- ✅ Lighthouse score acceptable
- ✅ Mobile responsive (test on phone)

---

## Deployment Artifacts

### Build Artifacts

**Next.js**:
- Build output: `.next/` directory (server-rendered pages, API routes)
- Static assets: Optimized HTML, CSS, JS
- Generated: During `npm run build` in CI

**Docker Image**:
- Image: `ghcr.io/marcusgoll/marcusgoll:latest`
- Tags: `latest` (rolling), `<commit-sha>` (specific version)
- Multi-stage build: base → builder → production (minimal image size)
- Size: ~300-500MB (Node.js Alpine + Next.js)

**Database Migrations**:
- Prisma migrations: `prisma/migrations/*.sql`
- Applied: Automatically on container startup (`npx prisma migrate deploy`)
- Reversible: Manual (create new migration to reverse)

### Artifact Promotion

**Strategy**: Build once, tag for environments

**Current** (direct-prod):
1. Build Docker image on push to `main`
2. Tag as `latest` and `<commit-sha>`
3. Deploy `latest` to production

**Future** (staging-prod):
1. Build Docker image on push to `staging`
2. Tag as `staging-<commit-sha>`
3. Deploy to staging VPS
4. After validation, promote same image to production (retag as `latest`)
5. **Benefit**: Exact same code tested in staging goes to production

---

## Database Migrations

**Tool**: Prisma Migrate
**Strategy**: Auto-apply on deployment (Docker container startup)

**Migration Workflow**:
1. Developer updates `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name add_newsletter_table`
3. Review generated SQL (safety check)
4. Test locally: Apply migration, verify data
5. Commit migration files to Git
6. Merge to `main`
7. CI deploys new Docker image
8. Container startup runs `npx prisma migrate deploy` (applies migrations)
9. Next.js app starts

**Safety Checks**:
- ✅ Migrations tested locally before committing
- ✅ Database backups before migration (Supabase automated)
- ✅ Migrations idempotent (can run multiple times safely)

**Rollback**:
- Database: Restore from backup (last 24 hours)
- Code: Git revert → redeploy
- **Duration**: 15-30 minutes

**Zero-Downtime Migrations** (if needed later):
- Expand-contract pattern for breaking changes
- Example: Renaming column
  1. Add new column (nullable)
  2. Deploy code (dual-write to both)
  3. Backfill data
  4. Deploy code (read from new column)
  5. Drop old column

---

## Rollback Procedure

**When to Rollback**:
- Site broken (500 errors, blank pages)
- Critical content error (incorrect information published)
- Performance regression (page load > 5s)

**How to Rollback**:

### Quick Rollback (< 5 minutes)

**Via Docker** (redeploy previous image):
```bash
# SSH to VPS
ssh marcus@marcusgoll.com

# Find previous image tag
docker images ghcr.io/marcusgoll/marcusgoll

# Update docker-compose.yml to previous tag
# Or: docker pull ghcr.io/marcusgoll/marcusgoll:<previous-commit-sha>

# Restart container
docker-compose up -d --force-recreate

# Health check
curl https://marcusgoll.com
```

**Via Git** (revert commit, redeploy):
```bash
# Locally
git revert <bad-commit-sha>
git push origin main
# CI auto-deploys reverted code
```

**Duration**: 5-10 minutes

### Full Rollback (with database)

**If migration caused issue**:
```bash
# 1. Revert code (above)
# 2. Restore database from backup (Supabase dashboard or CLI)
# 3. Restart container
# 4. Validate
```

**Duration**: 15-30 minutes

**Testing**: Quarterly rollback drills (practice in staging when available)

---

## Monitoring & Alerts

**What to Monitor**:

| Metric | Tool | Alert Threshold | Action |
|--------|------|-----------------|--------|
| Uptime | UptimeRobot | Downtime > 2 min | Email alert, investigate |
| Deployment status | GitHub Actions | Failed | Fix build, redeploy |
| Container health | Docker healthcheck | Unhealthy | Restart container |
| Disk space | VPS monitoring | > 80% | Clean logs, upgrade VPS |
| Error rate | [NEEDS CLARIFICATION] | > 5% of requests | Rollback or hotfix |

**Alert Channels**:
- **Critical** (downtime): Email + SMS (UptimeRobot)
- **Warning** (deployment failed): Email (GitHub)
- **Info** (successful deploy): GitHub Actions log (no alert)

**Post-Deployment Monitoring**:
- Check site visually (homepage, recent posts)
- Monitor GA4 for 30 minutes (check for error spikes)
- Review Docker logs for errors: `docker logs marcusgoll-web`

---

## Secrets Management

**Tool**: Environment variables (VPS + GitHub Secrets)
**Storage**: Encrypted environment variables on VPS, GitHub repository secrets

**Secrets Inventory**:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase API URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role (secret)
- `RESEND_API_KEY` or `MAILGUN_API_KEY` - Newsletter API key
- `NEWSLETTER_FROM_EMAIL` - Verified sender email
- `GA4_MEASUREMENT_ID` - Google Analytics ID (public)

**How Stored**:
- **Development**: `.env.local` (not committed, add to `.gitignore`)
- **Production VPS**: `.env` file or Docker Compose env_file (not committed)
- **CI/CD**: GitHub Secrets (encrypted, injected during build)

**Rotation**:
- API keys: Every 90 days (calendar reminder)
- Database passwords: Every 180 days
- Process: Update in VPS `.env` → restart container (zero downtime)

**Never Commit**:
- ❌ `.env` files with secrets
- ❌ API keys in code or comments
- ❌ Database passwords

**Transfer to VPS** (secure methods):
- SSH + edit: `ssh marcus@marcusgoll.com`, `nano .env`
- SCP: `scp .env.production marcus@marcusgoll.com:/app/.env` (delete local copy after)
- Never send via email or unencrypted channels

---

## Deployment Schedule

**Recommended Schedule**:
- **Regular Deployments**: Anytime (automated CI/CD)
- **Content Updates**: 2-4 times per week (new posts, edits)
- **Feature Updates**: As needed (1-2 times per month)

**Avoid**:
- Friday afternoon deploys (no weekend support)
- Right before travel/vacation

**Emergency Hotfixes**: Anytime (for critical bugs, security issues)

---

## Disaster Recovery

**Scenario**: VPS failure (hardware, provider issue)

**Recovery Plan**:
1. **Immediate** (0-30 min):
   - Check Hetzner status page
   - Contact Hetzner support
   - Post status update (social media: "Site experiencing issues, investigating")

2. **Short-term** (30-120 min):
   - Deploy to temporary hosting (Vercel one-click import from GitHub)
   - Update DNS to point to temporary site
   - **Temporary site limitations**: No database (static content only)

3. **Long-term** (2-24 hours):
   - Restore VPS from backup OR provision new VPS
   - Restore database from Supabase backup
   - Deploy Docker containers to new/restored VPS
   - Update DNS back to VPS
   - Validate full functionality

**RTO** (Recovery Time Objective): 4 hours
**RPO** (Recovery Point Objective): 24 hours (last backup)

**Backup VPS Plan**:
- Keep Dockerfile and docker-compose.yml in Git (can deploy anywhere)
- Document VPS setup in `docs/VPS_SETUP.md`
- Alternative: Vercel import (GitHub integration, one-click deploy)

---

## Performance Validation

**Pre-Deployment Checks** (local):
- Lighthouse CI score ≥ 85
- No console errors
- Build succeeds (`npm run build`)
- Docker image builds (`docker build`)

**Post-Deployment Checks** (production):
- Site loads (curl health check)
- Homepage renders correctly
- Recent post page works
- No 404s on navigation
- Lighthouse audit (spot check)

**Automated Checks** (CI):
```yaml
# Post-deployment health check
- name: Health Check
  run: |
    sleep 30  # Wait for container to be healthy
    curl -f https://marcusgoll.com || exit 1
```

---

## Compliance & Audit

**Deployment Audit Log**:
- **Who deployed**: GitHub username (automatic in CI)
- **What changed**: Git commit diff, PR description
- **When**: Timestamp (UTC) in GitHub Actions log
- **Where**: Production VPS (marcusgoll.com)
- **Stored**: GitHub Actions logs (90 days), Git history (permanent)

**Regulatory Requirements**: None (personal blog, no regulated data)

**Change Management**:
- All changes tracked in Git (full audit trail)
- Deployment logs retained (GitHub Actions + Docker logs)

---

## Infrastructure as Code

**Current State**: Semi-automated (Docker Compose + manual VPS setup)

**Files**:
- `Dockerfile` - Next.js application container
- `docker-compose.yml` - Multi-container orchestration (Next.js + Supabase)
- `.github/workflows/deploy-production.yml` - CI/CD pipeline

**Future IaC** (if multi-VPS or complex infra):
- Terraform for VPS provisioning
- Ansible for configuration management
- Keep simple for now (manual VPS setup documented in docs)

---

## Change Log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2025-10-26 | Initial deployment strategy | Project initialization | CI/CD pipeline defined |
| 2025-10-26 | direct-prod model chosen | Solo dev, low traffic | Faster deploys, acceptable risk |
| 2025-10-26 | GitHub Actions for CI/CD | Free, integrated with GitHub | Automated deployments |
| 2025-10-26 | Docker containerization | Consistent environments, easy rollback | Reliable deployments |
