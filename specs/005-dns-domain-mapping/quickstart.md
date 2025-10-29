# Quickstart: dns-domain-mapping

## Overview

This feature is infrastructure configuration only. There is no local development server, application code, or automated tests to run.

---

## Scenario 1: DNS Configuration

### Prerequisites

- Access to domain registrar account for marcusgoll.com
- VPS at 178.156.129.179 is running and accessible
- Caddy reverse proxy is installed on VPS

### Steps

```bash
# 1. Verify VPS is accessible
ping 178.156.129.179

# Expected: VPS responds to ping

# 2. Verify Caddy is running on VPS
ssh hetzner "docker ps | grep caddy"

# Expected: proxy-caddy-1 container running

# 3. Log into domain registrar
# Navigate to DNS management panel for marcusgoll.com

# 4. Create A record for apex domain
#    Type: A
#    Name: @ (or blank, or marcusgoll.com depending on registrar UI)
#    Value: 178.156.129.179
#    TTL: 3600

# 5. Create A record for www subdomain
#    Type: A
#    Name: www
#    Value: 178.156.129.179
#    TTL: 3600

# 6. Save DNS changes at registrar
```

---

## Scenario 2: Immediate Verification

### DNS Query Verification

```bash
# Wait 1-2 minutes after creating records

# 1. Check apex domain (local resolver)
dig marcusgoll.com +short

# Expected: 178.156.129.179

# 2. Check www subdomain (local resolver)
dig www.marcusgoll.com +short

# Expected: 178.156.129.179

# 3. Check via Google DNS (8.8.8.8)
dig @8.8.8.8 marcusgoll.com +short

# Expected: 178.156.129.179

# 4. Check via Cloudflare DNS (1.1.1.1)
dig @1.1.1.1 marcusgoll.com +short

# Expected: 178.156.129.179

# 5. Alternative: nslookup (if dig not available)
nslookup marcusgoll.com 8.8.8.8

# Expected:
# Server:  dns.google
# Address:  8.8.8.8
# Name:    marcusgoll.com
# Address: 178.156.129.179
```

### HTTP Connectivity Test

```bash
# 1. Test HTTP connection to apex domain
curl -I http://marcusgoll.com

# Expected (before SSL):
# HTTP/1.1 308 Permanent Redirect
# Location: https://marcusgoll.com/
# (Caddy redirects HTTP → HTTPS)

# 2. Test HTTP connection to www subdomain
curl -I http://www.marcusgoll.com

# Expected:
# HTTP/1.1 308 Permanent Redirect
# Location: https://marcusgoll.com/
```

---

## Scenario 3: Global Propagation Check

### Web-Based Verification

1. Navigate to: https://dnschecker.org
2. Enter domain: `marcusgoll.com`
3. Select record type: `A`
4. Click "Search"
5. Verify: All geographic regions show `178.156.129.179`

**Timeline Expectations**:
- **15 minutes**: Major DNS resolvers (Google, Cloudflare)
- **1 hour**: Most global resolvers
- **48 hours**: Complete global propagation (worst case)

---

## Scenario 4: SSL Certificate Verification

### Wait for Caddy ACME Challenge

```bash
# 1. Check Caddy logs for SSL certificate issuance
ssh hetzner "docker logs proxy-caddy-1 --tail 100 | grep -i 'certificate\|acme'"

# Expected log entries:
# - "obtaining certificate for marcusgoll.com"
# - "certificate obtained successfully"
# - "serving HTTPS on https://marcusgoll.com"

# 2. Test HTTPS connection
curl -I https://marcusgoll.com

# Expected (after SSL obtained):
# HTTP/2 200
# server: Caddy
# (Valid SSL certificate, no warnings)

# 3. Verify SSL certificate details
curl -vI https://marcusgoll.com 2>&1 | grep -i 'subject\|issuer\|expire'

# Expected:
# subject: CN=marcusgoll.com
# issuer: C=US; O=Let's Encrypt; CN=R3
# expire date: [90 days from issuance]

# 4. Test www subdomain redirect with SSL
curl -I https://www.marcusgoll.com

# Expected:
# HTTP/2 308
# Location: https://marcusgoll.com/
```

---

## Scenario 5: Troubleshooting

### DNS Not Resolving

```bash
# 1. Check if records exist at registrar
# (Manual step - log into registrar panel)

# 2. Check local DNS cache
# Windows:
ipconfig /flushdns

# macOS:
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux:
sudo systemd-resolve --flush-caches

# 3. Re-test with external DNS server
dig @8.8.8.8 marcusgoll.com +short

# 4. Check TTL to estimate propagation time
dig marcusgoll.com

# Look for TTL value in response (should be 3600 initially)
```

### SSL Certificate Not Issuing

```bash
# 1. Verify DNS points to VPS
dig marcusgoll.com +short
# Must return: 178.156.129.179

# 2. Verify port 80 is accessible (required for ACME HTTP-01)
telnet 178.156.129.179 80
# Expected: Connection successful

# 3. Check Caddy logs for ACME errors
ssh hetzner "docker logs proxy-caddy-1 --tail 200 | grep -i 'error\|fail'"

# 4. Verify Caddyfile email is configured
ssh hetzner "docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile | head -3"

# Expected:
# {
#   email marcusgoll@gmail.com
# }

# 5. Manual ACME challenge test
curl http://marcusgoll.com/.well-known/acme-challenge/test

# Expected: Caddy responds (even if 404, proves HTTP routing works)
```

### VPS Not Accessible

```bash
# 1. Ping VPS
ping 178.156.129.179

# 2. Check SSH access
ssh hetzner "uptime"

# 3. Check Caddy container status
ssh hetzner "docker ps | grep caddy"

# 4. Check ports are open
nmap -p 80,443 178.156.129.179

# Expected:
# PORT    STATE
# 80/tcp  open
# 443/tcp open
```

---

## Scenario 6: Rollback DNS Changes

### If DNS needs to be rolled back

```bash
# 1. Log into domain registrar

# 2. Option A: Delete A records
#    - Delete @ (apex) A record
#    - Delete www A record

# 3. Option B: Update A records to different IP
#    - Change value from 178.156.129.179 to new IP

# 4. Wait for TTL expiration (3600 seconds = 1 hour max)

# 5. Verify rollback
dig marcusgoll.com +short
# Expected: Old IP (if option B) or NXDOMAIN (if option A)

# Note: IP-based access always works as fallback
curl http://178.156.129.179:3000
```

---

## Documentation Reference

After DNS configuration is complete, refer to:

**infrastructure/dns/README.md**
- DNS provider details
- A record configuration screenshots
- Complete verification checklist
- Troubleshooting guide
- Contact information for DNS support

---

## Manual Testing Checklist

### Pre-Configuration
- [ ] VPS is accessible via ping
- [ ] Caddy container is running
- [ ] Registrar account credentials available
- [ ] Ports 80 and 443 open on VPS

### During Configuration
- [ ] A record for apex domain created (@ → 178.156.129.179, TTL 3600)
- [ ] A record for www subdomain created (www → 178.156.129.179, TTL 3600)
- [ ] DNS changes saved at registrar

### Post-Configuration (Immediate)
- [ ] `dig marcusgoll.com` returns 178.156.129.179
- [ ] `dig www.marcusgoll.com` returns 178.156.129.179
- [ ] Google DNS resolver (8.8.8.8) shows correct IP
- [ ] Cloudflare DNS resolver (1.1.1.1) shows correct IP

### Post-Configuration (Within 1 Hour)
- [ ] dnschecker.org shows global propagation
- [ ] All geographic regions show correct IP
- [ ] No DNS errors or misconfigurations detected

### Post-Configuration (SSL Verification)
- [ ] Caddy logs show SSL certificate obtained
- [ ] `https://marcusgoll.com` loads with valid SSL
- [ ] `https://www.marcusgoll.com` redirects to apex
- [ ] SSL certificate issuer is Let's Encrypt
- [ ] SSL certificate expiry is ~90 days from issuance

### Documentation
- [ ] infrastructure/dns/README.md created
- [ ] DNS provider name documented
- [ ] Login instructions documented
- [ ] Verification commands documented
- [ ] Troubleshooting steps documented

---

## Expected Timeline

| Milestone | Time From DNS Configuration |
|-----------|----------------------------|
| Records created at registrar | 0 minutes (manual) |
| First DNS query success | 1-5 minutes |
| Google/Cloudflare DNS propagation | 15-60 minutes |
| Global DNS propagation | 1-48 hours (typically <1hr) |
| SSL certificate issuance | 1-10 minutes after DNS propagation |
| HTTPS site accessible | Immediate after SSL issuance |

---

## Success Criteria Met

DNS domain mapping is successfully configured when:

1. ✅ `ping marcusgoll.com` returns 178.156.129.179
2. ✅ `ping www.marcusgoll.com` returns 178.156.129.179
3. ✅ DNS resolution verified in all major geographic regions (dnschecker.org)
4. ✅ `https://marcusgoll.com` loads with valid Let's Encrypt SSL certificate
5. ✅ `https://www.marcusgoll.com` redirects to `https://marcusgoll.com`
6. ✅ infrastructure/dns/README.md documentation complete and verified
