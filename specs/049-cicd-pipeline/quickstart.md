# Quickstart: CI/CD Pipeline

## Scenario 1: Initial Setup (One-Time)

**Generate SSH Key Pair for GitHub Actions**:
```bash
# On local machine
ssh-keygen -t ed25519 -C "github-actions-cicd" -f ~/.ssh/github_actions_vps

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/github_actions_vps.pub marcus@<VPS-IP>
# Or manually: ssh marcus@<VPS-IP> then append to ~/.ssh/authorized_keys

# Test SSH connection
ssh -i ~/.ssh/github_actions_vps marcus@<VPS-IP>
# Should connect without password
```

**Configure GitHub Secrets**:
```bash
# In GitHub repository: Settings → Secrets and variables → Actions → New repository secret

# Required secrets:
VPS_SSH_PRIVATE_KEY:  # Paste entire private key including headers
-----BEGIN OPENSSH PRIVATE KEY-----
[your private key content]
-----END OPENSSH PRIVATE KEY-----

VPS_HOST: <hetzner-vps-ip-or-hostname>
VPS_USER: marcus
VPS_DEPLOY_PATH: /home/marcus/marcusgoll

# Optional secrets (for notifications):
SLACK_WEBHOOK_URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
# OR
DISCORD_WEBHOOK_URL: https://discord.com/api/webhooks/YOUR/WEBHOOK/ID
```

**Verify VPS Setup**:
```bash
# SSH to VPS
ssh marcus@<VPS-IP>

# Check Docker and Docker Compose installed
docker --version  # Should be 20+
docker-compose --version  # Should be v2+

# Check docker-compose.prod.yml exists
cd /home/marcus/marcusgoll
ls -la docker-compose.prod.yml  # Should exist

# Check .env.production exists
ls -la .env.production  # Should exist with 600 permissions

# Test Docker Compose
docker-compose -f docker-compose.prod.yml config  # Should validate without errors
```

**Test SSH Connection from Local** (simulates GitHub Actions):
```bash
# On local machine
ssh -i ~/.ssh/github_actions_vps marcus@<VPS-IP> "cd /home/marcus/marcusgoll && docker-compose -f docker-compose.prod.yml ps"
# Should show running containers
```

---

## Scenario 2: Deploy Feature to Production

**Create Feature Branch**:
```bash
# Start feature
git checkout -b feature/add-new-post
```

**Develop and Test Locally**:
```bash
# Make changes (e.g., add new blog post)
# Test locally
npm run dev

# Check linting and types
npm run lint
npx tsc --noEmit

# Test build
npm run build

# Test Docker build (optional but recommended)
docker build -t test-image .
docker run -p 3000:3000 test-image
```

**Create Pull Request**:
```bash
# Commit changes
git add .
git commit -m "feat: add systematic thinking blog post"

# Push branch
git push origin feature/add-new-post

# Create PR (via GitHub UI or gh CLI)
gh pr create --base main --title "Add systematic thinking post" --body "New blog post about systematic thinking"
```

**PR Validation** (automatic):
- GitHub Actions runs lint, type-check, build
- Review checks in PR (must pass before merge)
- If checks fail, fix code and push update (checks re-run automatically)

**Merge to Main** (triggers deployment):
```bash
# Merge PR via GitHub UI or CLI
gh pr merge --squash --delete-branch

# Or via GitHub UI: Click "Squash and merge"
```

**Monitor Deployment**:
```bash
# Watch GitHub Actions workflow
gh run watch  # Or visit GitHub Actions tab in UI

# Expected steps:
# 1. Lint and type-check (2-3 min)
# 2. Build Next.js (3-5 min)
# 3. Build Docker image (4-6 min)
# 4. Push to GHCR (1 min)
# 5. SSH to VPS and deploy (2-3 min)
# 6. Health check (30 seconds)
# Total: 8-10 minutes
```

**Validate Deployment**:
```bash
# Visit site
open https://test.marcusgoll.com

# Check specific page (if applicable)
open https://test.marcusgoll.com/blog/systematic-thinking

# Check Docker logs on VPS
ssh marcus@<VPS-IP>
docker logs --tail 50 marcusgoll-nextjs-prod

# Check container health
docker ps  # STATUS should show "healthy"
```

---

## Scenario 3: Rollback Failed Deployment

**If Health Check Fails** (automatic rollback):
```bash
# GitHub Actions workflow automatically:
# 1. Detects health check failure
# 2. Captures previous Docker image tag
# 3. Redeploys previous image via docker-compose
# 4. Verifies health check passes with previous version

# Monitor rollback in GitHub Actions logs
gh run view  # Check for "Rollback successful" message
```

**Manual Rollback** (if automatic fails):
```bash
# SSH to VPS
ssh marcus@<VPS-IP>

# Navigate to deployment directory
cd /home/marcus/marcusgoll

# Find previous Docker image tags
docker images ghcr.io/marcusgoll/marcusgoll
# Example output:
# REPOSITORY                      TAG              IMAGE ID       CREATED         SIZE
# ghcr.io/marcusgoll/marcusgoll  latest           abc123def456   2 minutes ago   450MB
# ghcr.io/marcusgoll/marcusgoll  sha-abc1234      abc123def456   2 minutes ago   450MB
# ghcr.io/marcusgoll/marcusgoll  sha-def5678      789ghi012jkl   1 hour ago      448MB

# Identify previous working tag (e.g., sha-def5678)
# Edit docker-compose.prod.yml to use previous tag (optional, or pull specific tag)

# Pull previous image
docker pull ghcr.io/marcusgoll/marcusgoll:sha-def5678

# Restart containers with previous image
docker-compose -f docker-compose.prod.yml up -d --force-recreate nextjs

# Verify health check
curl -f https://test.marcusgoll.com/api/health
# Should return: {"status":"ok"}

# Check site
curl -I https://test.marcusgoll.com
# Should return: HTTP/2 200
```

**Post-Rollback Investigation**:
```bash
# Check logs for errors
docker logs --since 1h marcusgoll-nextjs-prod | grep -i error

# Check container inspect
docker inspect marcusgoll-nextjs-prod

# Review deployment log
cat /path/to/specs/049-cicd-pipeline/deployment-log.md
```

---

## Scenario 4: Testing Deployment Pipeline

**Dry Run** (test without deploying):
```bash
# Create test branch
git checkout -b test/ci-pipeline

# Make small change (e.g., add comment to README)
echo "# CI/CD Test" >> README.md
git add README.md
git commit -m "test: verify CI/CD pipeline"

# Push branch
git push origin test/ci-pipeline

# Create draft PR
gh pr create --base main --title "TEST: CI/CD Pipeline" --draft

# Check that PR validation runs (lint, type-check, build)
# Deployment should NOT run (only on push to main)

# Close draft PR
gh pr close test/ci-pipeline --delete-branch
```

**Test Rollback** (intentional failure):
```bash
# Create branch with intentional error
git checkout -b test/rollback-failure

# Break health check (e.g., remove health endpoint)
# Or introduce syntax error that compiles but crashes at runtime

# Commit and push
git add .
git commit -m "test: intentional failure for rollback test"
git push origin test/rollback-failure

# Create PR and merge to main
gh pr create --base main --title "TEST: Rollback" --body "Testing automatic rollback"
gh pr merge --squash --delete-branch

# Monitor deployment
gh run watch
# Expected: Health check fails, automatic rollback triggers, previous version restored

# Verify site still works
curl -f https://test.marcusgoll.com
```

---

## Scenario 5: Manual Deployment (Bypass CI/CD)

**If CI/CD is Down or Needs Bypass**:
```bash
# SSH to VPS
ssh marcus@<VPS-IP>

# Navigate to deployment directory
cd /home/marcus/marcusgoll

# Pull latest code from GitHub (if using Git on VPS)
git fetch origin main
git pull origin main

# Or: Pull specific Docker image from GHCR
docker pull ghcr.io/marcusgoll/marcusgoll:latest

# Rebuild Docker image (if Dockerfile changed)
docker-compose -f docker-compose.prod.yml build

# Restart containers
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Check health
curl -f http://localhost:3000/api/health
curl -f https://test.marcusgoll.com
```

---

## Scenario 6: Debugging Failed Deployment

**Check GitHub Actions Logs**:
```bash
# List recent workflow runs
gh run list --limit 10

# View specific run
gh run view <run-id>

# View logs for specific job
gh run view <run-id> --log

# Download logs for offline analysis
gh run download <run-id>
```

**Check VPS Logs**:
```bash
# SSH to VPS
ssh marcus@<VPS-IP>

# Check Docker container logs
docker logs --tail 100 marcusgoll-nextjs-prod

# Check container status
docker ps -a | grep marcusgoll

# Check Docker Compose status
cd /home/marcus/marcusgoll
docker-compose -f docker-compose.prod.yml ps

# Check system resources
df -h  # Disk space
free -h  # Memory
top  # CPU usage
```

**Check Deployment Log**:
```bash
# View deployment history
cat specs/049-cicd-pipeline/deployment-log.md

# Find failed deployments
grep "Failed" specs/049-cicd-pipeline/deployment-log.md
```

---

## Scenario 7: Update GitHub Secrets

**Rotate SSH Key**:
```bash
# Generate new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-cicd-new" -f ~/.ssh/github_actions_vps_new

# Add new public key to VPS
ssh-copy-id -i ~/.ssh/github_actions_vps_new.pub marcus@<VPS-IP>

# Test new key
ssh -i ~/.ssh/github_actions_vps_new marcus@<VPS-IP>

# Update GitHub Secret VPS_SSH_PRIVATE_KEY with new private key
# GitHub: Settings → Secrets → Actions → VPS_SSH_PRIVATE_KEY → Update

# Test deployment with new key (deploy small change)

# Remove old public key from VPS (after confirming new key works)
ssh marcus@<VPS-IP>
nano ~/.ssh/authorized_keys  # Remove old key
```

**Update Webhook URL**:
```bash
# Create new Slack/Discord webhook
# Update GitHub Secret
# GitHub: Settings → Secrets → Actions → SLACK_WEBHOOK_URL → Update

# Test notification (trigger deployment)
```

---

## Common Issues & Solutions

**Issue 1**: Pipeline fails with "Permission denied (publickey)"
- **Cause**: SSH key not configured or incorrect
- **Solution**: Verify VPS_SSH_PRIVATE_KEY secret includes full key with headers, check VPS authorized_keys

**Issue 2**: Docker image push fails with "authentication required"
- **Cause**: GITHUB_TOKEN permissions insufficient
- **Solution**: Check repository settings → Actions → General → Workflow permissions (set to "Read and write")

**Issue 3**: Health check fails but site works locally
- **Cause**: `/api/health` endpoint missing or VPS firewall blocking
- **Solution**: Verify endpoint exists, check VPS firewall rules (`ufw status`)

**Issue 4**: Container fails to start after deployment
- **Cause**: Missing environment variables or database connection issue
- **Solution**: Check `.env.production` on VPS, verify DATABASE_URL is correct

**Issue 5**: Deployment takes >15 minutes
- **Cause**: Cold cache (first build) or large Docker layers
- **Solution**: Subsequent builds should be faster (~8-10 min), verify cache configuration in workflow
