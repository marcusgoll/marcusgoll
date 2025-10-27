# Pre-Migration Setup Guide

**Phase**: 1 of 8
**Tasks**: T001-T004
**Duration**: 30-45 minutes
**Prerequisites**: Hetzner Cloud account access, SSH access to VPS

---

## Overview

This phase prepares the VPS for Dokploy installation with zero risk to current production deployment. All tasks are non-destructive and create safety checkpoints for rollback.

**Goal**: Create backups, verify prerequisites, configure DNS

**Risk Level**: LOW (read-only operations except DNS)

---

## T001: Take VPS Snapshot

**Purpose**: Full system backup for disaster recovery

**Execution Steps**:

1. Login to Hetzner Cloud Console
   - URL: https://console.hetzner.cloud
   - Select project containing your VPS

2. Navigate to snapshots
   - Servers → Click your VPS (marcusgoll-vps or similar)
   - Tab: "Snapshots"

3. Create snapshot
   - Click "Create Image" or "Create Snapshot"
   - Name: `pre-dokploy-migration-2025-10-26`
   - Description: `Snapshot before Dokploy platform integration (Feature 047)`
   - Wait for snapshot creation (5-15 minutes depending on disk size)

4. Verify snapshot
   - Status should show "Available"
   - Size should match current disk usage
   - Download capability confirmed (optional backup download)

**Validation Checklist**:
- [ ] Snapshot status: "Available"
- [ ] Snapshot size reasonable (matches VPS disk usage)
- [ ] Snapshot date/time correct (within last hour)

**Rollback Capability**:
- Full VPS restoration from Hetzner dashboard
- Restore time: 5-20 minutes depending on snapshot size
- **CRITICAL**: This is your safety net - verify it exists before proceeding

**Cost**: €0.119/month per GB (Hetzner snapshot pricing)

**Documentation**:
```bash
# Record in NOTES.md
Snapshot ID: <copy from Hetzner dashboard>
Snapshot Name: pre-dokploy-migration-2025-10-26
Created: 2025-10-26 HH:MM UTC
Size: X.X GB
Cost: ~€Y.YY/month
```

---

## T002: Backup Current Docker Configuration

**Purpose**: Local backup of current deployment configs for comparison and emergency rollback

**Execution Steps**:

1. SSH to VPS
   ```bash
   ssh root@178.156.129.179
   # Or: ssh marcus@178.156.129.179 (if non-root user)
   ```

2. Create backup directory on VPS
   ```bash
   mkdir -p /root/dokploy-migration-backup
   cd /root/dokploy-migration-backup
   ```

3. Copy Docker configuration files
   ```bash
   # If configs are in /opt/marcusgoll/
   cp /opt/marcusgoll/docker-compose.prod.yml ./docker-compose.prod.yml.backup
   cp /opt/marcusgoll/deploy.sh ./deploy.sh.backup

   # Or if in different location, adjust paths
   # Find them: find / -name "docker-compose.prod.yml" 2>/dev/null
   ```

4. Export environment variable keys (sanitized)
   ```bash
   # Create sanitized env file (keys only, no secrets)
   cd /opt/marcusgoll  # Or wherever .env.production is located

   # Extract keys only
   grep -v '^#' .env.production | grep '=' | cut -d '=' -f 1 > /root/dokploy-migration-backup/env.production.keys.txt

   # Verify no secrets leaked
   cat /root/dokploy-migration-backup/env.production.keys.txt
   # Should show only variable names like:
   # DATABASE_URL
   # NEXT_PUBLIC_SUPABASE_URL
   # etc.
   ```

5. Download backups to local machine
   ```bash
   # On your local Windows machine (PowerShell):
   scp -r root@178.156.129.179:/root/dokploy-migration-backup D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\pre-migration-backup\
   ```

6. Copy to feature directory (Windows PowerShell)
   ```powershell
   # Already done in step 5 above
   # Verify files exist locally
   dir D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\pre-migration-backup\
   ```

**Validation Checklist**:
- [ ] docker-compose.prod.yml.backup exists locally
- [ ] deploy.sh.backup exists locally
- [ ] env.production.keys.txt exists (keys only, no secrets)
- [ ] No sensitive data in backed up files

**Files Created**:
```
specs/047-dokploy-deployment-platform/configs/pre-migration-backup/
├── docker-compose.prod.yml.backup
├── deploy.sh.backup
└── env.production.keys.txt
```

**Rollback Use Case**:
- If Dokploy migration fails, restore these files to /opt/marcusgoll/
- Redeploy using old docker-compose up -d workflow

---

## T003: Verify VPS Prerequisites

**Purpose**: Confirm all required software is installed and VPS has sufficient resources

**Execution Steps**:

1. SSH to VPS
   ```bash
   ssh root@178.156.129.179
   ```

2. Check Docker version
   ```bash
   docker --version
   # Required: >= 20.10
   # Example output: Docker version 24.0.6, build ed223bc
   ```

3. Check Docker Compose version
   ```bash
   docker-compose --version
   # Required: >= 2.0
   # Example output: Docker Compose version v2.21.0
   ```

4. Check Nginx version
   ```bash
   nginx -v
   # Required: >= 1.18
   # Example output: nginx version: nginx/1.24.0
   ```

5. Check Certbot installation
   ```bash
   certbot --version
   # Required: Any recent version
   # Example output: certbot 2.7.4
   ```

6. Check disk space
   ```bash
   df -h
   # Required: >5GB free on root partition
   # Look for line with "/"
   # Example output:
   # Filesystem      Size  Used Avail Use% Mounted on
   # /dev/sda1       160G   45G  107G  30% /
   ```

7. Check port 3000 availability
   ```bash
   sudo netstat -tuln | grep 3000
   # Expected: No output (port not in use)
   # OR: Port used by current Next.js app (acceptable, will change later)
   ```

8. Check RAM capacity
   ```bash
   free -h
   # Required: 4-8GB total, >2GB available
   # Example output:
   #               total        used        free
   # Mem:          7.8Gi       2.1Gi       3.2Gi
   ```

9. Check current Docker containers
   ```bash
   docker ps
   # Note running containers (current production setup)
   ```

**Validation Checklist**:
- [ ] Docker >= 20.10 installed
- [ ] Docker Compose >= 2.0 installed
- [ ] Nginx >= 1.18 installed
- [ ] Certbot installed
- [ ] Disk space > 5GB free
- [ ] RAM: 4-8GB total, >2GB available
- [ ] Port 3000 available or used by current app

**Documentation Template** (add to NOTES.md):

```markdown
## VPS Prerequisites Validation (T003)

**Date**: 2025-10-26
**VPS IP**: 178.156.129.179

### Software Versions
- Docker: [version]
- Docker Compose: [version]
- Nginx: [version]
- Certbot: [version]

### Resource Capacity
- Disk Total: [size]
- Disk Free: [size] ([percentage]% free)
- RAM Total: [size]
- RAM Available: [size]
- Port 3000 Status: [available/in-use-by-nextjs]

### Current Docker Containers
[paste output of docker ps]

### Status
- [ ] All prerequisites met
- [ ] Sufficient capacity for Dokploy (~500MB RAM overhead)
- [ ] Ready for Dokploy installation
```

**Troubleshooting**:

If Docker missing:
```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

If Docker Compose missing:
```bash
# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

If Nginx missing:
```bash
sudo apt-get install nginx
```

If Certbot missing:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

---

## T004: Configure DNS Record for Dokploy Subdomain

**Purpose**: Create deploy.marcusgoll.com subdomain for Dokploy web UI access

**Execution Steps**:

1. Identify your DNS provider
   - Check where marcusgoll.com is registered
   - Common providers: Cloudflare, Namecheap, GoDaddy, etc.

2. Login to DNS management dashboard
   - Example: Cloudflare Dashboard → DNS → Records

3. Create A record
   ```
   Type: A
   Name: deploy
   Target: 178.156.129.179
   TTL: 300 (5 minutes, for faster testing)
   Proxy Status: DNS Only (gray cloud, NOT proxied)
   ```

4. Save DNS record

5. Wait for DNS propagation (5-60 minutes)

6. Verify DNS resolution (from your local machine)
   ```powershell
   # PowerShell (Windows)
   nslookup deploy.marcusgoll.com

   # Expected output:
   # Server:  [your DNS server]
   # Address:  [DNS server IP]
   #
   # Name:    deploy.marcusgoll.com
   # Address:  178.156.129.179
   ```

   ```bash
   # Alternative: dig (if installed)
   dig deploy.marcusgoll.com +short
   # Expected output: 178.156.129.179
   ```

7. Test from multiple locations (optional)
   - Use online DNS checker: https://dnschecker.org
   - Enter: deploy.marcusgoll.com
   - Verify: Shows 178.156.129.179 in multiple regions

**Validation Checklist**:
- [ ] DNS A record created: deploy.marcusgoll.com → 178.156.129.179
- [ ] TTL set to 300 seconds (5 minutes)
- [ ] DNS resolves correctly via nslookup
- [ ] Propagation complete (check multiple regions)

**Documentation** (add to NOTES.md):
```markdown
## DNS Configuration (T004)

**Date**: 2025-10-26
**DNS Provider**: [Cloudflare/Namecheap/etc]

### Record Details
- Type: A
- Name: deploy
- Full Domain: deploy.marcusgoll.com
- Target IP: 178.156.129.179
- TTL: 300 seconds
- Created: [timestamp]

### Verification
```bash
$ nslookup deploy.marcusgoll.com
# [paste output]
```

### Status
- [ ] DNS record created
- [ ] DNS resolves correctly
- [ ] Ready for Dokploy Nginx configuration
```

**Troubleshooting**:

If DNS not resolving after 60 minutes:
1. Check DNS provider for propagation status
2. Verify record saved correctly (not in draft)
3. Check for conflicting CNAME records
4. Try flushing local DNS cache:
   ```powershell
   # Windows
   ipconfig /flushdns
   ```

**Important Notes**:
- DNS propagation can take up to 24 hours (rare, usually 5-60 minutes)
- Keep TTL low (300s) during migration for quick changes
- Can proceed to next phase while waiting for full propagation
- SSL certificate (T007) will fail if DNS not propagated

---

## Phase 1 Completion Checklist

Before proceeding to Phase 2 (Dokploy Installation):

- [ ] **T001**: VPS snapshot created and verified in Hetzner dashboard
- [ ] **T002**: Configuration files backed up locally to feature directory
- [ ] **T003**: All prerequisites validated (Docker, Nginx, Certbot, disk space, RAM)
- [ ] **T004**: DNS record for deploy.marcusgoll.com created and resolving correctly

**Estimated Time Spent**: [record actual time]

**Blockers Encountered**: [none/list any issues]

**Ready for Phase 2**: YES / NO

**Next Phase**: [02-dokploy-installation.md](./02-dokploy-installation.md)

---

## Rollback Procedure (If Needed)

Phase 1 is non-destructive (read-only except DNS). No rollback needed unless:

**If DNS misconfigured**:
1. Login to DNS provider
2. Delete deploy.marcusgoll.com A record
3. Wait for TTL expiration (5 minutes)

**If need to restore VPS**:
1. Hetzner Cloud Console → Snapshots
2. Select `pre-dokploy-migration-2025-10-26`
3. Click "Restore" or "Create Server from Snapshot"
4. Wait 5-20 minutes for restoration
5. Update DNS if VPS IP changed

**Emergency Contact**: VPS IP 178.156.129.179, SSH root access

---

## Appendix: Quick Reference Commands

```bash
# SSH to VPS
ssh root@178.156.129.179

# Check prerequisites (one-liner)
echo "Docker: $(docker --version)" && \
echo "Compose: $(docker-compose --version)" && \
echo "Nginx: $(nginx -v 2>&1)" && \
echo "Certbot: $(certbot --version 2>&1 | head -1)" && \
echo "Disk Free: $(df -h / | tail -1 | awk '{print $4}')" && \
echo "RAM Free: $(free -h | grep Mem | awk '{print $7}')"

# Verify DNS (from local machine)
nslookup deploy.marcusgoll.com

# List current Docker containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```
