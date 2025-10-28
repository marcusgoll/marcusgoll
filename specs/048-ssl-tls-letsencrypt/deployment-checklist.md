# SSL/TLS Deployment Checklist

## Prerequisites

- [ ] DNS A records configured for all domains
- [ ] DNS propagation complete (wait 5-30 minutes after DNS changes)
- [ ] Ports 80 and 443 open in VPS firewall
- [ ] Docker and Docker Compose installed on VPS
- [ ] Git repository cloned to VPS
- [ ] Email verified (marcusgoll@gmail.com) for Let's Encrypt notifications

---

## Phase 1: DNS Verification (CRITICAL - Do Not Skip)

**Why**: Let's Encrypt HTTP-01 challenge requires DNS to point to VPS IP before certificate issuance

### Check DNS Records

```bash
# Verify marcusgoll.com points to VPS IP
dig +short marcusgoll.com
# Expected: <VPS-IP-ADDRESS>

# Verify cfipros.com points to VPS IP
dig +short cfipros.com
# Expected: <VPS-IP-ADDRESS>

# Verify ghost.marcusgoll.com points to VPS IP
dig +short ghost.marcusgoll.com
# Expected: <VPS-IP-ADDRESS>

# Verify api.marcusgoll.com points to VPS IP
dig +short api.marcusgoll.com
# Expected: <VPS-IP-ADDRESS>

# Verify api.cfipros.com points to VPS IP
dig +short api.cfipros.com
# Expected: <VPS-IP-ADDRESS>
```

**Checklist**:
- [ ] marcusgoll.com resolves to VPS IP
- [ ] cfipros.com resolves to VPS IP
- [ ] ghost.marcusgoll.com resolves to VPS IP
- [ ] api.marcusgoll.com resolves to VPS IP
- [ ] api.cfipros.com resolves to VPS IP

### Check DNS Propagation

```bash
# Check from multiple DNS servers
dig +short marcusgoll.com @8.8.8.8    # Google DNS
dig +short marcusgoll.com @1.1.1.1    # Cloudflare DNS
dig +short marcusgoll.com @208.67.222.222  # OpenDNS

# All should return same VPS IP
```

**Checklist**:
- [ ] DNS propagated to Google DNS (8.8.8.8)
- [ ] DNS propagated to Cloudflare DNS (1.1.1.1)
- [ ] DNS propagated to OpenDNS (208.67.222.222)

**If DNS not propagated**:
- Wait 5-30 minutes
- Re-run DNS checks
- DO NOT proceed until DNS resolves correctly

---

## Phase 2: Firewall Verification

### Check Firewall Rules

```bash
# Check UFW status
sudo ufw status

# Expected output should include:
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

**Checklist**:
- [ ] Port 80/tcp allowed in firewall
- [ ] Port 443/tcp allowed in firewall

### Enable Ports (if needed)

```bash
# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443)
sudo ufw allow 443/tcp

# Reload firewall
sudo ufw reload

# Verify
sudo ufw status | grep -E '80|443'
```

### Check Port Conflicts

```bash
# Check if any service using port 80
sudo netstat -tlnp | grep :80

# Check if any service using port 443
sudo netstat -tlnp | grep :443

# Expected: No output (ports free) OR Caddy already running
```

**Checklist**:
- [ ] No service conflicts on port 80 (or Caddy already running)
- [ ] No service conflicts on port 443 (or Caddy already running)

**If port conflict detected**:
- Stop conflicting service: `sudo systemctl stop nginx` or `sudo systemctl stop apache2`
- Verify port free: `sudo netstat -tlnp | grep :80`

---

## Phase 3: VPS Preparation

### SSH to VPS

```bash
# SSH to VPS
ssh marcus@<VPS-IP-ADDRESS>

# Or if using SSH alias
ssh hetzner
```

**Checklist**:
- [ ] SSH connection successful
- [ ] User has sudo permissions

### Navigate to Project Directory

```bash
# Navigate to project root
cd /path/to/marcusgoll

# Or if standard location
cd ~/marcusgoll

# Verify correct directory
pwd
# Expected: /home/marcus/marcusgoll (or similar)

# Verify Git repo
git remote -v
# Expected: origin git@github.com:marcusgoll/marcusgoll.git (or similar)
```

**Checklist**:
- [ ] In correct project directory
- [ ] Git repository present

### Pull Latest Changes

```bash
# Fetch latest from main branch
git fetch origin main

# Pull latest changes
git pull origin main

# Verify latest commit
git log -1 --oneline
# Expected: Most recent commit with Caddy SSL changes
```

**Checklist**:
- [ ] Latest changes pulled from main branch
- [ ] docker-compose.prod.yml includes Caddy service
- [ ] infrastructure/Caddyfile includes HSTS headers

---

## Phase 4: Docker Setup

### Verify Docker Installation

```bash
# Check Docker version
docker --version
# Expected: Docker version 20.x or higher

# Check Docker Compose version
docker-compose --version
# Expected: Docker Compose version 2.x or higher

# Check Docker running
docker ps
# Expected: List of running containers (or empty if none)
```

**Checklist**:
- [ ] Docker installed (version 20+)
- [ ] Docker Compose installed (version 2+)
- [ ] Docker daemon running

### Create Caddy Data Volume

```bash
# Create volume for certificate storage
docker volume create caddy-data

# Verify volume created
docker volume ls | grep caddy-data

# Expected: local     caddy-data
```

**Checklist**:
- [ ] Caddy data volume created
- [ ] Volume visible in `docker volume ls`

### Validate docker-compose.prod.yml

```bash
# Validate Docker Compose configuration
docker-compose -f docker-compose.prod.yml config

# Expected: YAML output with no errors

# Check Caddy service defined
docker-compose -f docker-compose.prod.yml config | grep -A 20 "caddy:"

# Expected: Caddy service with ports 80/443, volume mount
```

**Checklist**:
- [ ] docker-compose.prod.yml syntax valid
- [ ] Caddy service present
- [ ] Ports 80 and 443 mapped
- [ ] Volume caddy-data mounted to /data/caddy
- [ ] Caddyfile mounted to /etc/caddy/Caddyfile

### Validate Caddyfile

```bash
# Validate Caddyfile syntax using Docker
docker run --rm -v "$(pwd)/infrastructure/Caddyfile:/etc/caddy/Caddyfile" caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile

# Expected: "Valid configuration"
```

**Checklist**:
- [ ] Caddyfile syntax valid
- [ ] No parse errors
- [ ] Email configured (marcusgoll@gmail.com)
- [ ] All domains defined (marcusgoll.com, cfipros.com, subdomains)
- [ ] HSTS headers present

---

## Phase 5: Deployment

### Start Caddy Service

```bash
# Start Caddy in detached mode
docker-compose -f docker-compose.prod.yml up -d caddy

# Expected: "Creating marcusgoll-caddy ... done"
```

**Checklist**:
- [ ] Caddy container started
- [ ] No error messages

### Monitor Certificate Issuance

```bash
# Follow Caddy logs
docker-compose -f docker-compose.prod.yml logs -f caddy

# Watch for these log messages:
# - "obtaining certificate for marcusgoll.com"
# - "validating authorization"
# - "authorization validated"
# - "certificate obtained successfully"
# - "serving HTTPS on port 443"

# Certificate issuance takes 30-120 seconds
# Press Ctrl+C to exit logs when "certificate obtained" appears
```

**Expected Log Output**:
```
caddy    | {"level":"info","msg":"obtaining certificate","domain":"marcusgoll.com"}
caddy    | {"level":"info","msg":"validating authorization","domain":"marcusgoll.com","challenge":"http-01"}
caddy    | {"level":"info","msg":"authorization validated","domain":"marcusgoll.com"}
caddy    | {"level":"info","msg":"certificate obtained successfully","domain":"marcusgoll.com"}
caddy    | {"level":"info","msg":"certificate saved","path":"/data/caddy/acme/.../marcusgoll.com.crt"}
```

**Checklist**:
- [ ] "obtaining certificate" log message for each domain
- [ ] "certificate obtained successfully" for each domain
- [ ] No error messages in logs
- [ ] "serving HTTPS" message present

**If certificate issuance fails**:
- Check DNS verification (Phase 1)
- Check firewall (Phase 2)
- Check Caddy logs for specific error: `docker-compose -f docker-compose.prod.yml logs caddy | grep -i error`
- See error-log.md for troubleshooting

### Verify Container Health

```bash
# Check Caddy container running
docker ps | grep caddy

# Expected: marcusgoll-caddy running, healthy

# Check container logs for errors
docker-compose -f docker-compose.prod.yml logs caddy | grep -i error

# Expected: No error messages (or only benign warnings)
```

**Checklist**:
- [ ] Caddy container running
- [ ] Container healthy (health check passing)
- [ ] No critical errors in logs

---

## Phase 6: Post-Deployment Validation

### Test HTTPS Endpoints

```bash
# Test marcusgoll.com HTTPS
curl -I https://marcusgoll.com

# Expected:
# HTTP/2 200
# Content-Type: text/html
# strict-transport-security: max-age=15768000; includeSubDomains

# Test cfipros.com HTTPS
curl -I https://cfipros.com

# Expected: HTTP/2 200
```

**Checklist**:
- [ ] marcusgoll.com HTTPS accessible (HTTP/2 200)
- [ ] cfipros.com HTTPS accessible (HTTP/2 200)
- [ ] ghost.marcusgoll.com HTTPS accessible
- [ ] api.marcusgoll.com HTTPS accessible
- [ ] api.cfipros.com HTTPS accessible

### Test HTTP to HTTPS Redirect

```bash
# Test marcusgoll.com redirect
curl -I http://marcusgoll.com

# Expected:
# HTTP/1.1 308 Permanent Redirect
# Location: https://marcusgoll.com/

# Test cfipros.com redirect
curl -I http://cfipros.com

# Expected: HTTP/1.1 308 Permanent Redirect
```

**Checklist**:
- [ ] marcusgoll.com HTTP → HTTPS redirect (308)
- [ ] cfipros.com HTTP → HTTPS redirect (308)
- [ ] Redirect preserves URL path (test: http://marcusgoll.com/about)

### Verify HSTS Header

```bash
# Check HSTS header present
curl -I https://marcusgoll.com | grep -i strict-transport-security

# Expected: strict-transport-security: max-age=15768000; includeSubDomains

# Verify max-age value (15768000 = 6 months)
```

**Checklist**:
- [ ] HSTS header present
- [ ] max-age=15768000 (6 months)
- [ ] includeSubDomains directive present

### Check Certificate Details

```bash
# Check certificate issuer and expiry
echo | openssl s_client -connect marcusgoll.com:443 -servername marcusgoll.com 2>/dev/null | openssl x509 -noout -issuer -dates

# Expected:
# issuer=C = US, O = Let's Encrypt, CN = R3
# notBefore=Oct 28 12:00:00 2025 GMT
# notAfter=Jan 26 12:00:00 2026 GMT (90 days from issuance)
```

**Checklist**:
- [ ] Issuer is "Let's Encrypt (R3)"
- [ ] notBefore is current date
- [ ] notAfter is ~90 days from issuance
- [ ] Certificate valid (not expired)

### Browser Visual Check

**Open browser and navigate to**:
- https://marcusgoll.com
- https://cfipros.com

**Checklist**:
- [ ] Green padlock visible in address bar
- [ ] "Connection is secure" message
- [ ] No certificate warnings
- [ ] No mixed content warnings
- [ ] Site loads correctly

### Test Certificate Persistence

```bash
# Note current certificate serial number
docker exec marcusgoll-caddy sh -c "cat /data/caddy/acme/acme-v02.api.letsencrypt.org-directory/certificates/marcusgoll.com/marcusgoll.com.crt" | openssl x509 -noout -serial

# Output: serial=XXXXXXXX (save this value)

# Restart Caddy container
docker-compose -f docker-compose.prod.yml restart caddy

# Wait 15 seconds
sleep 15

# Check certificate serial again
docker exec marcusgoll-caddy sh -c "cat /data/caddy/acme/acme-v02.api.letsencrypt.org-directory/certificates/marcusgoll.com/marcusgoll.com.crt" | openssl x509 -noout -serial

# Expected: serial=XXXXXXXX (SAME as before - NOT re-issued)

# Verify site accessible
curl -I https://marcusgoll.com
# Expected: HTTP/2 200 (no downtime)
```

**Checklist**:
- [ ] Certificate serial unchanged after restart
- [ ] Site accessible immediately after restart
- [ ] No new certificate issuance in logs

---

## Phase 7: SSL Labs Validation (72 Hours After Deployment)

**Note**: Wait 72 hours after deployment for SSL Labs cache to clear

### Run SSL Labs Test

1. Open browser
2. Navigate to: https://www.ssllabs.com/ssltest/analyze.html?d=marcusgoll.com
3. Click "Submit"
4. Wait 3-5 minutes for scan to complete

### Check Results

**Checklist**:
- [ ] Overall Rating: A+ (target) or A (acceptable)
- [ ] Certificate: Valid, 90 days validity
- [ ] Certificate Chain: Complete (leaf + intermediate)
- [ ] Protocol Support: TLS 1.2 and TLS 1.3 only (no SSL 3.0, TLS 1.0/1.1)
- [ ] Cipher Suites: Strong ciphers only (no weak ciphers)
- [ ] HSTS: Present with long max-age (6 months)
- [ ] No major vulnerabilities detected

**If rating is less than A**:
- Review SSL Labs recommendations
- Adjust Caddyfile configuration
- Restart Caddy and re-test

---

## Phase 8: Documentation & Monitoring

### Update Documentation

**Checklist**:
- [ ] Update OPERATIONS_RUNBOOK.md with SSL troubleshooting
- [ ] Update deployment-strategy.md with SSL deployment steps
- [ ] Document certificate renewal process
- [ ] Add SSL/TLS section to VPS_SETUP.md (if exists)

### Setup Monitoring (Optional - Priority 2)

**Future Enhancement** (US5):
- [ ] Create cron job for certificate expiry check
- [ ] Configure email alerts for expiry < 14 days
- [ ] Add SSL Labs scan to quarterly maintenance tasks

---

## Rollback Procedure (If Deployment Fails)

### Quick Rollback

```bash
# Stop Caddy container
docker-compose -f docker-compose.prod.yml stop caddy

# Remove Caddy container
docker-compose -f docker-compose.prod.yml rm -f caddy

# Revert configuration changes
git checkout HEAD~1 -- infrastructure/Caddyfile docker-compose.prod.yml

# Restart application (HTTP only)
docker-compose -f docker-compose.prod.yml up -d nextjs

# Site accessible via HTTP on port 3000
```

**Checklist**:
- [ ] Caddy stopped
- [ ] Config reverted to previous version
- [ ] Application accessible via HTTP
- [ ] Document rollback reason in error-log.md

---

## Post-Deployment Monitoring (First 48 Hours)

### Monitor Caddy Logs

```bash
# Check for errors every 4 hours
docker-compose -f docker-compose.prod.yml logs --tail=100 caddy | grep -i error

# Check renewal events (should be none for first 60 days)
docker-compose -f docker-compose.prod.yml logs caddy | grep -i renew
```

**Checklist**:
- [ ] No critical errors in first 24 hours
- [ ] No unexpected certificate re-issuance
- [ ] No rate limit warnings

### Monitor Site Accessibility

**Checklist**:
- [ ] Site accessible via HTTPS at 0h, 4h, 12h, 24h, 48h
- [ ] No user reports of SSL errors
- [ ] No mixed content warnings

---

## Success Criteria

**Deployment considered successful when**:
- ✅ All domains accessible via HTTPS
- ✅ HTTP automatically redirects to HTTPS (308)
- ✅ HSTS header present with 6-month max-age
- ✅ Certificate issued by Let's Encrypt (R3)
- ✅ Certificate persistence verified (restart test passes)
- ✅ SSL Labs rating A or A+
- ✅ No errors in Caddy logs for 48 hours
- ✅ Documentation updated

---

## Troubleshooting Guide

### Certificate Issuance Failed

**Check**: DNS resolution
```bash
dig +short marcusgoll.com
# Must return VPS IP
```

**Check**: Port 80 accessible
```bash
curl -I http://marcusgoll.com/.well-known/acme-challenge/test
# Expected: 404 (Caddy responding)
```

**Check**: Caddy logs
```bash
docker-compose -f docker-compose.prod.yml logs caddy | grep -i error
```

**See**: error-log.md for detailed troubleshooting

---

## Contacts & References

**Support**:
- Caddy Community Forum: https://caddy.community/
- Caddy Documentation: https://caddyserver.com/docs/
- Let's Encrypt Status: https://letsencrypt.status.io/

**Tools**:
- SSL Labs Test: https://www.ssllabs.com/ssltest/
- Certificate Search: https://crt.sh/
- DNS Propagation Check: https://dnschecker.org/

**Project Documentation**:
- Error Log: specs/048-ssl-tls-letsencrypt/error-log.md
- Quickstart: specs/048-ssl-tls-letsencrypt/quickstart.md
- Plan: specs/048-ssl-tls-letsencrypt/plan.md
