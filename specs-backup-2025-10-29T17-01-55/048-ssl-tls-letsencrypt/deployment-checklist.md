# SSL/TLS Deployment Checklist

## Pre-Deployment DNS Validation

**CRITICAL**: Verify DNS configuration before deploying Caddy to prevent Let's Encrypt rate limiting.

### Step 1: Verify A Records Point to VPS IP

```bash
# Get VPS IP address
ssh hetzner 'curl -s ifconfig.me'
```

### Step 2: Check DNS Resolution for All Domains

```bash
# Primary domains
dig +short marcusgoll.com
dig +short cfipros.com

# Subdomains
dig +short www.marcusgoll.com
dig +short www.cfipros.com
dig +short ghost.marcusgoll.com
dig +short api.marcusgoll.com
dig +short api.cfipros.com
```

### Step 3: Verify DNS Propagation

```bash
# Check multiple DNS servers to ensure propagation
dig @8.8.8.8 +short marcusgoll.com      # Google DNS
dig @1.1.1.1 +short marcusgoll.com      # Cloudflare DNS
dig @208.67.222.222 +short marcusgoll.com  # OpenDNS

# Expected: All return same VPS IP address
# If different: Wait for DNS propagation (up to 48 hours)
```

### Step 4: Verify HTTP Port 80 Accessibility

Let's Encrypt uses HTTP-01 challenge on port 80 for certificate validation.

```bash
# From external network (not from VPS)
curl -I http://marcusgoll.com
curl -I http://cfipros.com

# Expected: Connection succeeds (any HTTP response is OK)
# If connection refused: Check VPS firewall (ufw status)
```

### Step 5: Verify HTTPS Port 443 Accessibility

```bash
# Test port 443 is open for all domains
nc -zv marcusgoll.com 443
nc -zv cfipros.com 443
nc -zv ghost.marcusgoll.com 443
nc -zv api.marcusgoll.com 443
nc -zv api.cfipros.com 443

# Expected: "Connection succeeded" or "open"
```

## DNS Validation Checklist

Before deployment, verify:

- [ ] VPS IP address confirmed (ssh hetzner 'curl -s ifconfig.me')
- [ ] marcusgoll.com A record points to VPS IP
- [ ] cfipros.com A record points to VPS IP
- [ ] www.marcusgoll.com A/CNAME record configured
- [ ] www.cfipros.com A/CNAME record configured
- [ ] ghost.marcusgoll.com A record points to VPS IP
- [ ] api.marcusgoll.com A record points to VPS IP
- [ ] api.cfipros.com A record points to VPS IP
- [ ] DNS propagation verified across Google/Cloudflare/OpenDNS
- [ ] Port 80 accessible from internet (HTTP-01 challenge requirement)
- [ ] Port 443 accessible from internet (HTTPS traffic)
- [ ] VPS firewall rules allow 80/tcp and 443/tcp

## VPS Firewall Configuration

Ensure UFW allows HTTP/HTTPS traffic:

```bash
# Check current firewall status
ssh hetzner 'sudo ufw status'

# Expected output should include:
# 80/tcp    ALLOW    Anywhere
# 443/tcp   ALLOW    Anywhere
```

If rules not present, add them:

```bash
ssh hetzner 'sudo ufw allow 80/tcp'
ssh hetzner 'sudo ufw allow 443/tcp'
ssh hetzner 'sudo ufw reload'
```

## Deployment Steps

### Step 1: Deploy Docker Compose Configuration

```bash
# Copy docker-compose.prod.yml to VPS
scp docker-compose.prod.yml hetzner:~/app/

# Copy Caddyfile
scp infrastructure/Caddyfile hetzner:~/app/infrastructure/

# SSH to VPS
ssh hetzner
cd ~/app

# Pull Caddy image
docker-compose -f docker-compose.prod.yml pull caddy

# Start Caddy service
docker-compose -f docker-compose.prod.yml up -d caddy
```

### Step 2: Monitor Certificate Issuance

```bash
# Watch Caddy logs for certificate acquisition
docker-compose -f docker-compose.prod.yml logs -f caddy

# Expected log entries:
# "certificate obtained successfully"
# "serving initial configuration"
```

**Timeout**: Certificate issuance should complete within 5 minutes (NFR-002).

If issuance fails:
- Re-check DNS resolution (dig +short marcusgoll.com)
- Verify port 80 is accessible externally
- Check Caddy logs for ACME challenge errors
- Wait 1 hour before retrying (Let's Encrypt rate limit protection)

### Step 3: Verify HTTPS Access

```bash
# Test HTTPS connectivity for all domains
curl -I https://marcusgoll.com
curl -I https://cfipros.com
curl -I https://ghost.marcusgoll.com
curl -I https://api.marcusgoll.com
curl -I https://api.cfipros.com

# Expected: 200-399 status codes with valid HTTPS connection
```

### Step 4: Verify HTTP to HTTPS Redirect

```bash
# Test automatic redirect for all domains
curl -I http://marcusgoll.com

# Expected output:
# HTTP/1.1 308 Permanent Redirect
# Location: https://marcusgoll.com/
```

### Step 5: Verify HSTS Headers

```bash
# Check HSTS header present on all domains
curl -I https://marcusgoll.com | grep -i strict-transport-security

# Expected output:
# Strict-Transport-Security: max-age=15768000; includeSubDomains
```

Repeat for all domains (cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com, api.cfipros.com).

### Step 6: Verify Certificate Persistence

Test that certificates survive container restarts without re-issuance:

```bash
# Get current certificate serial number
echo | openssl s_client -connect marcusgoll.com:443 2>/dev/null | openssl x509 -noout -serial
# Note the serial number

# Restart Caddy container
docker-compose -f docker-compose.prod.yml restart caddy
sleep 30

# Check serial number again (should be identical)
echo | openssl s_client -connect marcusgoll.com:443 2>/dev/null | openssl x509 -noout -serial

# Repeat restart 2 more times (total 3 restarts in 5 minutes)
docker-compose -f docker-compose.prod.yml restart caddy
sleep 30
docker-compose -f docker-compose.prod.yml restart caddy
sleep 30

# Verify same serial number after all restarts
# Check Caddy logs - should NOT show "certificate obtained" messages
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "certificate obtained"
# Expected: No new certificate acquisitions
```

## Post-Deployment Validation

Complete validation checklist:

- [ ] All domains accessible via HTTPS with valid certificates
- [ ] Certificate issuer: Let's Encrypt
- [ ] Certificate validity: 90 days from issuance
- [ ] HTTP to HTTPS redirect working (308 status)
- [ ] HSTS headers present on all domains
- [ ] Certificate persistence verified (3 container restarts)
- [ ] No rate limit errors in Caddy logs
- [ ] SSL Labs scan scheduled (optional, see T015/T016)

## Rollback Procedure

If SSL/TLS deployment causes issues:

```bash
# Stop Caddy service
docker-compose -f docker-compose.prod.yml stop caddy

# Temporarily expose Next.js port directly
# Edit docker-compose.prod.yml: Uncomment nextjs ports section
# ports:
#   - "3000:3000"

# Restart Next.js
docker-compose -f docker-compose.prod.yml up -d nextjs

# Site accessible via HTTP on port 3000
```

**HSTS Warning**: Once HSTS header is sent with 6-month max-age, browsers will enforce HTTPS for that duration. Rolling back to HTTP will cause browser errors. Users must manually clear HSTS cache. **Test thoroughly before production deployment.**

## Troubleshooting

### Certificate Issuance Fails

**Symptoms**: Caddy logs show "ACME challenge failed" or "certificate obtain error"

**Common causes**:
1. DNS not propagated (wait 24-48 hours after DNS changes)
2. Port 80 blocked by firewall (check ufw rules)
3. Domain does not resolve to VPS IP (verify with dig)
4. Let's Encrypt rate limit reached (wait 1 hour)

**Resolution**:
```bash
# Verify DNS resolution
dig +short marcusgoll.com

# Verify port 80 accessible
curl -I http://marcusgoll.com

# Check Caddy logs for specific error
docker-compose -f docker-compose.prod.yml logs caddy | grep -i error
```

### Certificate Renewal Fails

**Symptoms**: Certificate expiry warning, renewal errors in logs

**Resolution**:
```bash
# Force Caddy configuration reload
docker-compose -f docker-compose.prod.yml exec caddy caddy reload --config /etc/caddy/Caddyfile

# Check renewal logs
docker-compose -f docker-compose.prod.yml logs caddy | grep -i renew
```

### HSTS Rollback Required

**Symptoms**: Need to disable HTTPS temporarily, but browsers enforce HSTS

**Resolution**:
- HSTS cannot be disabled once sent to browsers
- Users must manually clear browser HSTS cache
- Better approach: Fix HTTPS issues rather than rollback
- Prevention: Test thoroughly in staging before production

## Let's Encrypt Rate Limits

Be aware of these limits to avoid lockouts:

- **Failed validations**: 5 failures per account, per hostname, per hour
- **Certificates per domain**: 50 certificates per week
- **Duplicate certificates**: 5 per week (same set of hostnames)

**Prevention strategies**:
- Complete DNS validation checklist BEFORE deployment
- Never delete caddy-data volume in production
- Test configuration changes locally first
- Backup caddy-data volume before destructive operations

## References

- Let's Encrypt Rate Limits: https://letsencrypt.org/docs/rate-limits/
- Caddy Automatic HTTPS: https://caddyserver.com/docs/automatic-https
- HTTP-01 Challenge: https://letsencrypt.org/docs/challenge-types/#http-01-challenge
- HSTS Specification: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
- SSL Labs Testing: https://www.ssllabs.com/ssltest/

