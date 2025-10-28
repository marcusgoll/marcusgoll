# Quickstart: 048-ssl-tls-letsencrypt

## Scenario 1: Initial Setup (First-Time SSL Deployment)

### Prerequisites

**Before running these commands, verify**:
1. DNS A records point to VPS IP address
2. Ports 80 and 443 accessible from internet
3. No existing Caddy process using ports 80/443
4. Docker and Docker Compose installed on VPS

### DNS Validation (Critical)

```bash
# Check DNS points to VPS IP
dig +short marcusgoll.com
# Expected: <VPS-IP-ADDRESS>

dig +short cfipros.com
# Expected: <VPS-IP-ADDRESS>

dig +short ghost.marcusgoll.com
# Expected: <VPS-IP-ADDRESS>

# If DNS not configured, certificate issuance will FAIL
# Configure DNS first, wait for propagation (5-30 minutes)
```

### Deploy Caddy with SSL

```bash
# SSH to VPS
ssh marcus@<VPS-IP>

# Navigate to project directory
cd /path/to/marcusgoll

# Pull latest changes (includes updated docker-compose.prod.yml)
git pull origin main

# Verify Caddyfile configuration
cat infrastructure/Caddyfile

# Create Docker volume for certificate storage
docker volume create caddy-data

# Start Caddy service
docker-compose -f docker-compose.prod.yml up -d caddy

# Monitor certificate issuance (watch logs)
docker-compose -f docker-compose.prod.yml logs -f caddy

# Expected log output:
# "obtaining certificate for marcusgoll.com"
# "certificate obtained successfully"
# "serving HTTPS on port 443"

# Certificate issuance takes 30-120 seconds
# Wait for "certificate obtained" message before proceeding
```

### Verify HTTPS

```bash
# Test HTTPS endpoint
curl -I https://marcusgoll.com

# Expected: HTTP/2 200, valid certificate

# Test HTTP → HTTPS redirect
curl -I http://marcusgoll.com

# Expected: 308 Permanent Redirect, Location: https://marcusgoll.com

# Check certificate details
echo | openssl s_client -connect marcusgoll.com:443 -servername marcusgoll.com 2>/dev/null | openssl x509 -noout -dates -issuer

# Expected:
# Issuer: C=US, O=Let's Encrypt, CN=R3
# notBefore: <current-date>
# notAfter: <90-days-from-now>
```

### Verify HSTS Header

```bash
# Check Strict-Transport-Security header
curl -I https://marcusgoll.com | grep -i strict-transport-security

# Expected: strict-transport-security: max-age=15768000; includeSubDomains
# (15768000 seconds = 6 months)
```

---

## Scenario 2: Container Restart (Verify Persistence)

### Test Certificate Persistence

**Purpose**: Verify certificates survive container restart without re-issuance (FR-002)

```bash
# Note current certificate serial number
docker exec marcusgoll-caddy sh -c "cat /data/caddy/acme/acme-v02.api.letsencrypt.org-directory/certificates/marcusgoll.com/marcusgoll.com.crt" | openssl x509 -noout -serial

# Output: serial=<SERIAL-NUMBER>
# Save this value for comparison

# Restart Caddy container
docker-compose -f docker-compose.prod.yml restart caddy

# Wait 15 seconds for container to restart
sleep 15

# Check certificate serial number again
docker exec marcusgoll-caddy sh -c "cat /data/caddy/acme/acme-v02.api.letsencrypt.org-directory/certificates/marcusgoll.com/marcusgoll.com.crt" | openssl x509 -noout -serial

# Expected: serial=<SAME-SERIAL-NUMBER> (certificate NOT re-issued)

# Verify site still accessible
curl -I https://marcusgoll.com

# Expected: HTTP/2 200 (no downtime)
```

### Test Multiple Restarts (Rate Limit Protection)

```bash
# Restart container 3 times in 5 minutes
for i in {1..3}; do
  echo "Restart $i of 3"
  docker-compose -f docker-compose.prod.yml restart caddy
  sleep 30
done

# Check Let's Encrypt logs for duplicate certificate warnings
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "certificate"

# Expected: NO "obtaining certificate" messages
# Expected: "certificate loaded from storage" messages

# Verify no rate limit errors
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "rate limit"

# Expected: No output (no rate limit hit)
```

---

## Scenario 3: SSL Labs Validation (A+ Rating)

### Run SSL Labs Test

```bash
# Open SSL Labs SSL Server Test
# https://www.ssllabs.com/ssltest/analyze.html?d=marcusgoll.com

# Wait 3-5 minutes for scan to complete
# Check results:
# - Overall Rating: A+ (target)
# - Certificate: Valid, 90 days validity
# - Protocol Support: TLS 1.2 and TLS 1.3 only (no SSL 3.0, TLS 1.0/1.1)
# - Cipher Suites: Strong ciphers only
# - HSTS: Present with long max-age
```

### Manual Browser Check

```bash
# Open browser
# Navigate to: https://marcusgoll.com

# Check address bar:
# - Green padlock visible
# - "Connection is secure" message
# - No mixed content warnings

# Click padlock → Certificate:
# - Issued to: marcusgoll.com
# - Issued by: Let's Encrypt (R3)
# - Valid from: <current-date>
# - Valid to: <90-days-from-now>
```

---

## Scenario 4: Troubleshooting (Certificate Issuance Failure)

### Diagnose Certificate Failure

```bash
# Check Caddy logs for errors
docker-compose -f docker-compose.prod.yml logs caddy | grep -i error

# Common errors:
# 1. "timeout checking DNS records" → DNS not configured
# 2. "connection refused on port 80" → Port 80 blocked by firewall
# 3. "rate limit exceeded" → Too many certificate requests

# Check DNS resolution
dig +short marcusgoll.com
# Must return VPS IP address

# Check port 80 accessible
curl -I http://marcusgoll.com/.well-known/acme-challenge/test
# Expected: 404 (Caddy responding, just no challenge file)

# Check firewall rules
sudo ufw status
# Expected: 80/tcp ALLOW, 443/tcp ALLOW
```

### Force Certificate Renewal

```bash
# If certificate issuance failed, force retry
docker-compose -f docker-compose.prod.yml exec caddy caddy reload --config /etc/caddy/Caddyfile --force

# Monitor logs for new issuance attempt
docker-compose -f docker-compose.prod.yml logs -f caddy

# If still failing, check Let's Encrypt status
# https://letsencrypt.status.io/
```

---

## Scenario 5: Rollback (Revert SSL Changes)

### Rollback Procedure

```bash
# Stop Caddy container
docker-compose -f docker-compose.prod.yml stop caddy

# Revert Caddyfile changes (if needed)
git checkout HEAD~1 -- infrastructure/Caddyfile

# Revert docker-compose.prod.yml (if needed)
git checkout HEAD~1 -- docker-compose.prod.yml

# Remove Caddy container and volume
docker-compose -f docker-compose.prod.yml rm -f caddy
docker volume rm caddy-data

# Restart application without Caddy (HTTP only)
docker-compose -f docker-compose.prod.yml up -d nextjs

# Site accessible via HTTP on port 3000
# NO HTTPS available until Caddy re-deployed
```

**Rollback Duration**: 5-10 minutes

**Important**: If HSTS header was sent with long max-age, browsers will refuse HTTP connections for max-age duration (6 months). Test thoroughly before enabling HSTS in production.

---

## Scenario 6: Certificate Renewal Test (Manual)

### Simulate Renewal

**Note**: Automatic renewal happens 30 days before expiry. This scenario tests manual renewal.

```bash
# Check current certificate expiry
echo | openssl s_client -connect marcusgoll.com:443 -servername marcusgoll.com 2>/dev/null | openssl x509 -noout -enddate

# Force certificate renewal (Caddy reloads config)
docker-compose -f docker-compose.prod.yml exec caddy caddy reload --config /etc/caddy/Caddyfile

# Monitor renewal process
docker-compose -f docker-compose.prod.yml logs -f caddy

# Expected: "certificate renewed successfully"

# Verify new expiry date
echo | openssl s_client -connect marcusgoll.com:443 -servername marcusgoll.com 2>/dev/null | openssl x509 -noout -enddate

# Expected: notAfter extended by 90 days
```

---

## Scenario 7: Multiple Domains (cfipros.com)

### Verify All Domains

```bash
# Check each domain has valid certificate
for domain in marcusgoll.com cfipros.com ghost.marcusgoll.com api.marcusgoll.com api.cfipros.com; do
  echo "Checking $domain..."
  curl -I https://$domain | head -1
  echo | openssl s_client -connect $domain:443 -servername $domain 2>/dev/null | openssl x509 -noout -subject
  echo "---"
done

# Expected: Each domain shows HTTP/2 200 and correct Subject CN
```

---

## Scenario 8: HSTS Preload Check (Future Enhancement)

### Verify HSTS Preload Eligibility

```bash
# Check HSTS preload eligibility
# https://hstspreload.org/?domain=marcusgoll.com

# Requirements:
# - HSTS max-age ≥ 31536000 (1 year) [Current: 6 months, upgrade later]
# - includeSubDomains directive [Current: ✅ Enabled]
# - preload directive [Current: ❌ Not enabled]
# - HTTPS redirect [Current: ✅ Enabled]
# - Base domain serves HSTS header [Current: ✅ Enabled]

# Current status: Not eligible (max-age too short, no preload directive)
# Future: Increase max-age to 2 years, add preload directive, submit to list
```

---

## Common Issues & Solutions

### Issue 1: "Certificate issuance failed - DNS not resolving"

**Solution**:
```bash
# Verify DNS propagation
dig +short marcusgoll.com @8.8.8.8
# If no result, DNS not propagated yet
# Wait 5-30 minutes, retry
```

### Issue 2: "Port 80 connection refused"

**Solution**:
```bash
# Check firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# Verify ports listening
sudo netstat -tlnp | grep -E ':80|:443'
```

### Issue 3: "Rate limit exceeded"

**Solution**:
```bash
# Check current certificate count
# https://crt.sh/?q=marcusgoll.com

# If > 50 certs in last 7 days, wait for rate limit reset
# Rate limit resets 7 days after first issuance in window

# Use persistent volume to prevent re-issuance on restart
docker volume ls | grep caddy-data
# Must exist and be mounted to /data/caddy
```

### Issue 4: "Mixed content warnings"

**Solution**:
```bash
# Check application for HTTP resources
# All assets must use HTTPS or protocol-relative URLs

# Common culprits:
# - <img src="http://...">
# - <script src="http://...">
# - <link href="http://...">

# Fix: Change to https:// or //domain.com (protocol-relative)
```

---

## Development Environment Notes

**Local Development**: SSL/TLS not configured locally. Use HTTP for development.

```bash
# Local dev server (no HTTPS)
npm run dev
# Access: http://localhost:3000

# If you need HTTPS locally (advanced):
# 1. Install mkcert: https://github.com/FiloSottile/mkcert
# 2. Generate local cert: mkcert localhost
# 3. Configure Next.js HTTPS: Update next.config.ts
# (Not recommended - HTTP sufficient for development)
```

---

## Next Steps

After completing setup:
1. Monitor Caddy logs for 48 hours (check for errors)
2. Run SSL Labs test quarterly (verify A+ rating maintained)
3. Add certificate expiry monitoring (Priority 2 - US5)
4. Update deployment documentation with SSL steps
5. Consider HSTS preload (after 6 months of stable operation)
