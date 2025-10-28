# SSL/TLS Deployment Instructions

**Feature**: 048-ssl-tls-letsencrypt
**Deployment Type**: Manual VPS Deployment
**Target**: Production VPS (Hetzner)

## Prerequisites Checklist

Before deploying, ensure all prerequisites are met:

### 1. DNS Configuration ✅ CRITICAL

**Run these commands to verify DNS is correctly configured:**

```bash
# Get VPS IP address
ssh hetzner 'curl -s ifconfig.me'

# Verify all domains point to VPS
dig +short marcusgoll.com
dig +short cfipros.com
dig +short www.marcusgoll.com
dig +short www.cfipros.com
dig +short ghost.marcusgoll.com
dig +short api.marcusgoll.com
dig +short api.cfipros.com

# All should return the same VPS IP address
```

**If DNS is not configured:**
1. Go to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare)
2. Add A records for all domains pointing to VPS IP
3. Wait for DNS propagation (up to 48 hours, typically 15 minutes)
4. Re-run dig commands to verify

### 2. Firewall Configuration

**Ensure ports 80 and 443 are open on VPS:**

```bash
ssh hetzner 'sudo ufw status'

# Should show:
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

**If ports not open:**

```bash
ssh hetzner 'sudo ufw allow 80/tcp && sudo ufw allow 443/tcp'
```

### 3. Git Repository Access

**Verify VPS can access this repository:**

```bash
ssh hetzner 'cd /path/to/project && git pull'
```

### 4. Docker & Docker Compose

**Verify Docker is installed on VPS:**

```bash
ssh hetzner 'docker --version && docker-compose --version'
```

## Deployment Steps

### Step 1: Push Code to Repository

```bash
# Ensure all changes are committed
git status

# Push feature branch to remote
git push origin feature/048-ssl-tls-letsencrypt
```

### Step 2: Pull Changes on VPS

```bash
# SSH to VPS
ssh hetzner

# Navigate to project directory
cd /path/to/project  # Replace with actual path

# Pull latest changes
git fetch origin
git checkout feature/048-ssl-tls-letsencrypt
git pull origin feature/048-ssl-tls-letsencrypt
```

### Step 3: Review Configuration Files

**Verify the following files are present and correct:**

```bash
# Check Docker Compose configuration
cat docker-compose.prod.yml | grep -A 10 "caddy:"

# Check Caddyfile
cat infrastructure/Caddyfile | grep -A 5 "marcusgoll.com"

# Verify email is correct for Let's Encrypt
cat infrastructure/Caddyfile | grep "email"
```

### Step 4: Stop Existing Services (if running)

```bash
# Stop any existing containers
docker-compose -f docker-compose.prod.yml down

# Optional: Remove old volumes (ONLY if you want fresh start)
# WARNING: This will delete existing SSL certificates
# docker volume rm marcusgoll_caddy-data
```

### Step 5: Deploy with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# This will:
# 1. Pull caddy:2-alpine image
# 2. Build Next.js container
# 3. Create caddy-data volume
# 4. Start both services
# 5. Caddy will automatically request Let's Encrypt certificates
```

### Step 6: Monitor Certificate Issuance

**Watch Caddy logs for certificate requests:**

```bash
# Follow Caddy logs
docker-compose -f docker-compose.prod.yml logs -f caddy

# Look for messages like:
# "obtaining certificate for marcusgoll.com"
# "certificate obtained successfully"
# "serving HTTPS on :443"
```

**Certificate issuance should complete in <5 minutes.**

### Step 7: Verify Deployment

**Test HTTPS is working:**

```bash
# Test HTTPS response (should return 200)
curl -I https://marcusgoll.com

# Test HSTS header is present
curl -I https://marcusgoll.com | grep -i strict-transport

# Expected:
# Strict-Transport-Security: max-age=15768000; includeSubDomains
```

**Test HTTP to HTTPS redirect:**

```bash
# Should return 308 Permanent Redirect
curl -I http://marcusgoll.com

# Location header should be https://marcusgoll.com
```

**Test all domains:**

```bash
for domain in marcusgoll.com cfipros.com ghost.marcusgoll.com api.marcusgoll.com api.cfipros.com; do
  echo "Testing $domain..."
  curl -I https://$domain
  echo ""
done
```

### Step 8: Test Certificate Persistence

**Verify certificates survive container restart:**

```bash
# Restart Caddy container
docker-compose -f docker-compose.prod.yml restart caddy

# Wait 10 seconds
sleep 10

# Check Caddy logs (should NOT request new certificates)
docker-compose -f docker-compose.prod.yml logs --tail=50 caddy

# Should see "certificate cache" messages, NOT "obtaining certificate"
```

**Repeat restart 2 more times to verify persistence (3 total restarts):**

```bash
# Restart 2
docker-compose -f docker-compose.prod.yml restart caddy && sleep 10

# Restart 3
docker-compose -f docker-compose.prod.yml restart caddy && sleep 10

# Check logs - should never re-request certificates
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "obtaining"

# Should return no results (certificates loaded from cache)
```

## Post-Deployment Validation

### SSL Labs Scan (Optional - Wait 72 Hours)

**After 72 hours, run SSL Labs scan for A+ rating:**

1. Go to: https://www.ssllabs.com/ssltest/
2. Enter domain: marcusgoll.com
3. Wait for scan to complete (5-10 minutes)
4. Expected result: A or A+ rating

**Key metrics to verify:**
- Certificate: Valid, issued by Let's Encrypt
- Protocol Support: TLS 1.2, TLS 1.3
- HSTS: Enabled with 6-month max-age
- Certificate Chain: Complete

### Browser Verification

**Test in browsers:**

1. Open https://marcusgoll.com in Chrome/Firefox/Safari
2. Click padlock icon in address bar
3. Verify:
   - Connection is secure
   - Certificate issued by Let's Encrypt
   - Certificate valid for 90 days
   - No security warnings

## Troubleshooting

### Issue: Let's Encrypt Rate Limit

**Symptoms**: Caddy logs show "too many certificates already issued"

**Solution**:
1. Check rate limits: 50 certificates per week per domain
2. Wait 7 days for limit to reset
3. Use staging environment for testing (see deployment-checklist.md)

### Issue: DNS Not Resolving

**Symptoms**: Caddy logs show "lookup failed" or "no such host"

**Solution**:
1. Verify DNS configuration (see Prerequisites Step 1)
2. Wait for DNS propagation (up to 48 hours)
3. Test DNS resolution from VPS: `dig @8.8.8.8 +short marcusgoll.com`

### Issue: Port 80/443 Not Accessible

**Symptoms**: curl commands timeout or refuse connection

**Solution**:
1. Check firewall: `ssh hetzner 'sudo ufw status'`
2. Open ports: `ssh hetzner 'sudo ufw allow 80/tcp && sudo ufw allow 443/tcp'`
3. Check Docker port binding: `docker-compose -f docker-compose.prod.yml ps`

### Issue: Certificate Not Loading from Cache

**Symptoms**: Caddy re-requests certificates on every restart

**Solution**:
1. Check volume exists: `docker volume ls | grep caddy-data`
2. Check volume mount: `docker inspect marcusgoll-caddy-prod | grep -A 5 Mounts`
3. Verify volume permissions: `docker exec marcusgoll-caddy-prod ls -la /data/caddy`

## Rollback Procedure

**If deployment fails or causes issues:**

### Option 1: Revert Docker Compose Changes

```bash
# SSH to VPS
ssh hetzner

# Navigate to project
cd /path/to/project

# Checkout previous commit
git log --oneline | head -5  # Find commit before SSL changes
git checkout <previous-commit-sha>

# Redeploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Remove Caddy Service

```bash
# Stop Caddy container only
docker-compose -f docker-compose.prod.yml stop caddy
docker-compose -f docker-compose.prod.yml rm -f caddy

# Expose Next.js port directly (temporary)
# Edit docker-compose.prod.yml and uncomment:
#   ports:
#     - "3000:3000"

# Restart Next.js
docker-compose -f docker-compose.prod.yml up -d nextjs
```

### Option 3: Full Rollback

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Optionally remove volume (loses certificates)
docker volume rm marcusgoll_caddy-data

# Checkout main branch
git checkout main
git pull origin main

# Redeploy previous version
docker-compose -f docker-compose.prod.yml up -d
```

## Success Criteria

Deployment is successful when ALL of the following are verified:

- ✅ All 5 domains return valid HTTPS (200 OK)
- ✅ HTTP requests redirect to HTTPS (308 Permanent Redirect)
- ✅ HSTS header present on all domains (6-month max-age)
- ✅ Certificate issued by Let's Encrypt
- ✅ Certificates persist across 3+ container restarts
- ✅ No certificate re-issuance on restart (loaded from cache)
- ✅ No security warnings in browser
- ✅ Caddy logs show no errors

## Next Steps After Deployment

1. **Monitor Certificate Renewal**: Caddy renews automatically at 30 days
2. **Update Roadmap**: Mark feature #30 as shipped in GitHub Issues
3. **Merge Feature Branch**: Merge feature/048-ssl-tls-letsencrypt to main
4. **Optional**: Run SSL Labs scan after 72 hours for A+ rating
5. **Optional**: Add HSTS preload directive (see code-review.md recommendations)

## Support

**Logs**:
- Caddy: `docker-compose -f docker-compose.prod.yml logs -f caddy`
- Next.js: `docker-compose -f docker-compose.prod.yml logs -f nextjs`
- All: `docker-compose -f docker-compose.prod.yml logs -f`

**Status**:
- Services: `docker-compose -f docker-compose.prod.yml ps`
- Volumes: `docker volume ls`
- Networks: `docker network ls`

**Certificates**:
- Location: Docker volume `caddy-data` at `/data/caddy`
- View: `docker exec marcusgoll-caddy-prod ls -la /data/caddy/certificates/`

**Reference Documents**:
- Deployment Checklist: `specs/048-ssl-tls-letsencrypt/deployment-checklist.md`
- Code Review: `specs/048-ssl-tls-letsencrypt/code-review.md`
- Plan: `specs/048-ssl-tls-letsencrypt/plan.md`
