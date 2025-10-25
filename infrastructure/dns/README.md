# DNS Configuration for marcusgoll.com

**SECURITY NOTICE**: This documentation describes DNS configuration procedures. Domain registrar credentials should NEVER be committed to version control. Store credentials securely in a password manager or encrypted vault.

## Overview

This guide documents the DNS A record configuration to point marcusgoll.com and www.marcusgoll.com to the VPS at 178.156.129.179, enabling branded domain access and HTTPS certificate issuance via Caddy reverse proxy.

## Status

**Feature Status**: ON HOLD (per GitHub Issue #40)
- Waiting for: Next.js site production-ready
- DNS configuration can be completed when site is ready for public access
- Documentation prepared in advance for quick deployment when needed

**Current State**:
- [ ] DNS A records configured
- [ ] DNS propagation verified
- [ ] HTTPS certificate obtained
- [ ] WWW redirect working

## Prerequisites

Before configuring DNS records:

1. Access to domain registrar account for marcusgoll.com
2. VPS at 178.156.129.179 is running and accessible
3. Caddy reverse proxy is installed and configured on VPS
4. Ports 80 and 443 are open in VPS firewall

**Verify Prerequisites**:

```bash
# Check VPS is accessible
ping 178.156.129.179

# Check Caddy is running
ssh hetzner "docker ps | grep caddy"

# Check ports 80/443 are open
nmap -p 80,443 178.156.129.179
```

Expected output:
- Ping: replies from 178.156.129.179
- Caddy: proxy-caddy-1 container running
- Ports: 80/tcp open, 443/tcp open

## DNS Provider Information

**Domain Registrar**: [TO BE DOCUMENTED - e.g., Namecheap, GoDaddy, Google Domains]

**Login URL**: [TO BE DOCUMENTED - e.g., https://ap.www.namecheap.com/]

**Account**: [CREDENTIALS STORED SECURELY - NOT IN GIT]

**DNS Management Path**: [TO BE DOCUMENTED - e.g., Dashboard > Domain List > Manage > Advanced DNS]

## DNS A Record Configuration

### Configuration Details

Create the following DNS A records at your domain registrar:

**Record 1 - Apex Domain**:
- **Type**: A
- **Host/Name**: @ (or blank, or marcusgoll.com depending on registrar UI)
- **Value/Points to**: 178.156.129.179
- **TTL**: 3600 (1 hour)

**Record 2 - WWW Subdomain**:
- **Type**: A
- **Host/Name**: www
- **Value/Points to**: 178.156.129.179
- **TTL**: 3600 (1 hour)

### Step-by-Step Configuration

**MANUAL STEPS** (to be completed at domain registrar):

1. Log into domain registrar account
2. Navigate to DNS management for marcusgoll.com
3. Click "Add New Record" or "Add A Record"
4. Create apex domain A record:
   - Type: A
   - Name: @ (or blank)
   - IP: 178.156.129.179
   - TTL: 3600
5. Click "Add New Record" again
6. Create www subdomain A record:
   - Type: A
   - Name: www
   - IP: 178.156.129.179
   - TTL: 3600
7. Save changes
8. Note the time records were created (for propagation tracking)

### Configuration Verification

After creating records, verify they appear in registrar's DNS management panel:

- [ ] Apex record (@) points to 178.156.129.179
- [ ] WWW record (www) points to 178.156.129.179
- [ ] TTL is set to 3600 for both records
- [ ] No conflicting A records exist

## DNS Propagation Verification

DNS propagation typically takes 15 minutes to 48 hours (usually < 1 hour for major resolvers).

### Local DNS Verification

**Using dig** (Linux/macOS/WSL):

```bash
# Check apex domain
dig marcusgoll.com +short
# Expected: 178.156.129.179

# Check www subdomain
dig www.marcusgoll.com +short
# Expected: 178.156.129.179

# Check with Google DNS
dig @8.8.8.8 marcusgoll.com +short
# Expected: 178.156.129.179

# Check with Cloudflare DNS
dig @1.1.1.1 marcusgoll.com +short
# Expected: 178.156.129.179
```

**Using nslookup** (Windows):

```powershell
# Check apex domain
nslookup marcusgoll.com
# Expected: Address: 178.156.129.179

# Check www subdomain
nslookup www.marcusgoll.com
# Expected: Address: 178.156.129.179

# Check with Google DNS
nslookup marcusgoll.com 8.8.8.8
# Expected: Address: 178.156.129.179

# Check with Cloudflare DNS
nslookup marcusgoll.com 1.1.1.1
# Expected: Address: 178.156.129.179
```

**Using ping**:

```bash
# Check apex domain resolves
ping marcusgoll.com
# Expected: Reply from 178.156.129.179

# Check www subdomain resolves
ping www.marcusgoll.com
# Expected: Reply from 178.156.129.179
```

### Global DNS Propagation

**Online Tool**: https://dnschecker.org

1. Visit https://dnschecker.org
2. Enter: marcusgoll.com
3. Check: All geographic regions show 178.156.129.179
4. Repeat for: www.marcusgoll.com

**Expected**: Green checkmarks for all regions within 1 hour (up to 48 hours max)

**Propagation Timeline**:
- **15 minutes**: Major DNS resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1)
- **1 hour**: Most public DNS servers worldwide
- **24-48 hours**: Complete global propagation including ISP resolvers

## HTTPS Certificate Verification

After DNS propagation completes, Caddy will automatically obtain SSL certificates from Let's Encrypt.

### Monitor Caddy ACME Challenge

```bash
# SSH into VPS
ssh hetzner

# Monitor Caddy logs for ACME challenge
docker logs proxy-caddy-1 --follow | grep -i acme

# Expected output (example):
# [INFO] [marcusgoll.com] acme: Obtaining bundled SAN certificate
# [INFO] [marcusgoll.com] AuthURL: https://acme-v02.api.letsencrypt.org/...
# [INFO] [marcusgoll.com] acme: authorization already valid; skipping challenge
# [INFO] [marcusgoll.com] Server responded with a certificate
```

### Verify HTTPS Access

**Apex Domain**:

```bash
# Check HTTPS response
curl -I https://marcusgoll.com

# Expected:
# HTTP/2 200 (or 308 redirect)
# Valid SSL certificate (no warnings)
```

**Browser Test**:
1. Navigate to: https://marcusgoll.com
2. Check for green padlock icon
3. Click padlock > Certificate
4. Verify: Issued by Let's Encrypt Authority X3

**WWW Subdomain Redirect**:

```bash
# Check www redirect
curl -I https://www.marcusgoll.com

# Expected:
# HTTP/2 308 (permanent redirect)
# Location: https://marcusgoll.com
```

**Browser Test**:
1. Navigate to: https://www.marcusgoll.com
2. Verify: Automatically redirects to https://marcusgoll.com

### Verify SSL Certificate Details

```bash
# Using openssl
openssl s_client -connect marcusgoll.com:443 -servername marcusgoll.com < /dev/null 2>/dev/null | openssl x509 -noout -text

# Check certificate details:
# - Issuer: Let's Encrypt
# - Subject: CN=marcusgoll.com
# - Validity: Not expired
# - Subject Alternative Name: DNS:marcusgoll.com, DNS:www.marcusgoll.com
```

## Troubleshooting

### DNS Not Resolving

**Symptoms**: `dig marcusgoll.com` returns SERVFAIL or NXDOMAIN

**Common Causes**:
- A records not created at registrar
- Incorrect record name (should be @ or blank for apex)
- Typo in IP address
- Recent changes not yet propagated

**Diagnosis**:

```bash
# Check registrar panel - verify records exist
# Check exact record name and value

# Test with authoritative nameserver (find in registrar panel)
dig marcusgoll.com @ns1.your-registrar.com

# Check local DNS cache
ipconfig /flushdns  # Windows
sudo systemd-resolve --flush-caches  # Linux
```

**Resolution**:
1. Verify records in registrar panel
2. Correct any typos in IP address
3. Wait 5-10 minutes and retry
4. Clear local DNS cache
5. Test with multiple DNS servers

### Slow DNS Propagation

**Symptoms**: Some DNS servers resolve, others don't after > 1 hour

**Common Causes**:
- High TTL causing cache retention
- Geographic DNS propagation delays
- ISP DNS caching policies

**Diagnosis**:

```bash
# Check current TTL
dig marcusgoll.com | grep -i ttl

# Test multiple DNS servers
dig @8.8.8.8 marcusgoll.com       # Google
dig @1.1.1.1 marcusgoll.com       # Cloudflare
dig @208.67.222.222 marcusgoll.com # OpenDNS
dig marcusgoll.com                # Local resolver

# Check global propagation
# Visit https://dnschecker.org
```

**Resolution**:
1. Wait for TTL expiration (3600 seconds = 1 hour)
2. Clear local DNS cache
3. Use specific DNS server that has propagated (e.g., 8.8.8.8)
4. Be patient - full global propagation can take 24-48 hours

### SSL Certificate Not Issuing

**Symptoms**: Caddy logs show ACME challenge failures, HTTPS not working

**Common Causes**:
- DNS not yet pointing to VPS
- Port 80 not accessible from internet
- Email not configured in Caddyfile
- Firewall blocking Let's Encrypt validation

**Diagnosis**:

```bash
# 1. Verify DNS points to VPS
dig marcusgoll.com +short
# Must return: 178.156.129.179

# 2. Verify port 80 accessible from internet
telnet 178.156.129.179 80
# Should connect successfully

# 3. Check Caddy logs for errors
ssh hetzner "docker logs proxy-caddy-1 --tail 100 | grep -i error"

# 4. Verify email configured in Caddyfile
ssh hetzner "docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile | head -3"
# Should show: email marcusgoll@gmail.com

# 5. Check firewall rules
ssh hetzner "sudo ufw status"
# Should show: 80/tcp ALLOW Anywhere
```

**Resolution**:
1. Ensure DNS propagation complete before expecting SSL
2. Verify firewall allows port 80 and 443
3. Verify email is configured in Caddyfile (line 2)
4. Restart Caddy to retry: `ssh hetzner "docker restart proxy-caddy-1"`
5. Check Caddy logs again after 5 minutes

### WWW Redirect Not Working

**Symptoms**: https://www.marcusgoll.com doesn't redirect to apex domain

**Common Causes**:
- www A record not created
- Caddyfile www redirect not configured
- SSL not obtained for www subdomain

**Diagnosis**:

```bash
# 1. Verify www DNS resolves
dig www.marcusgoll.com +short
# Must return: 178.156.129.179

# 2. Check Caddy redirect config
ssh hetzner "docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile | grep -A 2 'www.marcusgoll.com'"
# Should show redirect block

# 3. Test redirect
curl -I https://www.marcusgoll.com
# Should show 308 redirect with Location: https://marcusgoll.com
```

**Resolution**:
1. Create www A record if missing at registrar
2. Verify Caddyfile has www redirect block (infrastructure/Caddyfile lines 6-8)
3. Wait for SSL cert issuance for www subdomain (check Caddy logs)
4. Restart Caddy if config changed

### HTTP Works But HTTPS Doesn't

**Symptoms**: http://marcusgoll.com works, but https://marcusgoll.com fails

**Common Causes**:
- SSL certificate not yet issued
- Port 443 blocked in firewall
- Caddy not running or misconfigured

**Diagnosis**:

```bash
# 1. Test HTTP
curl -I http://marcusgoll.com
# Should return HTTP response

# 2. Test HTTPS
curl -I https://marcusgoll.com
# Check error message

# 3. Verify port 443 accessible
nmap -p 443 178.156.129.179
# Should show: 443/tcp open

# 4. Check Caddy logs
ssh hetzner "docker logs proxy-caddy-1 --tail 50"
```

**Resolution**:
1. Wait for SSL certificate issuance (can take 5-10 minutes after DNS propagates)
2. Verify port 443 open in firewall
3. Check Caddy is running: `ssh hetzner "docker ps | grep caddy"`
4. Restart Caddy if needed

## Rollback Procedure

If DNS configuration needs to be reverted:

### Rollback Steps

1. Log into domain registrar account
2. Navigate to DNS management for marcusgoll.com
3. Delete or disable the A records:
   - Apex record (@) pointing to 178.156.129.179
   - WWW record (www) pointing to 178.156.129.179
4. Save changes
5. Wait for TTL expiration (3600 seconds = 1 hour maximum)
6. Verify rollback complete:

```bash
# Should return NXDOMAIN or no answer
dig marcusgoll.com
```

### Fallback Access

**Important**: IP-based access will always work regardless of DNS configuration:

- Direct VPS access: http://178.156.129.179:3000
- No disruption to VPS services during DNS changes
- Ghost CMS continues at ghost.marcusgoll.com (if separate DNS)

### Special Considerations

- SSL certificates remain valid during rollback (domain just won't resolve)
- Caddy will continue trying to renew SSL certificates even if DNS rolled back
- No data loss - DNS is pure routing, no application state affected
- Services on VPS continue running normally

## Propagation Timeline (Actual Results)

**TO BE DOCUMENTED AFTER IMPLEMENTATION**:

- DNS records created: [DATE/TIME]
- First successful resolution (local): [DATE/TIME] ([DURATION] after creation)
- Google DNS (8.8.8.8): [DATE/TIME] ([DURATION])
- Cloudflare DNS (1.1.1.1): [DATE/TIME] ([DURATION])
- Global propagation complete: [DATE/TIME] ([DURATION])
- SSL certificate obtained: [DATE/TIME] ([DURATION] after DNS)
- HTTPS fully functional: [DATE/TIME]

**Observations**: [Any notes about propagation speed, issues encountered, etc.]

## Related Infrastructure

### Caddy Configuration

DNS configuration works in conjunction with Caddy reverse proxy:

- **File**: infrastructure/Caddyfile
- **SSL Email**: marcusgoll@gmail.com (line 2)
- **Domain Routing**: marcusgoll.com reverse_proxy configuration (lines 15-17)
- **WWW Redirect**: www.marcusgoll.com → marcusgoll.com (lines 6-8)
- **ACME**: Automatic SSL from Let's Encrypt

**Note**: Currently points to ghost:2368, will switch to next:3000 after Next.js deployment.

### VPS Infrastructure

- **Provider**: Hetzner Cloud
- **IP Address**: 178.156.129.179 (static)
- **Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Firewall**: UFW configured
- **Services**: Docker, Caddy, PostgreSQL, Ghost CMS

**Documentation**: docs/INFRASTRUCTURE_SETUP.md

## Next Steps

After DNS configuration is complete:

1. **Verify HTTPS Certificate**: Confirm Let's Encrypt SSL obtained successfully
2. **Update Caddyfile**: Switch marcusgoll.com from ghost:2368 to next:3000
3. **Deploy Next.js**: Deploy production Next.js application to VPS
4. **Update Environment Variables**: Switch from IP-based URLs to domain URLs
5. **Full E2E Testing**: Verify complete functionality with domain access

## References

- **GitHub Issue**: #40 - DNS Domain Mapping
- **Feature Spec**: specs/005-dns-domain-mapping/spec.md
- **Implementation Plan**: specs/005-dns-domain-mapping/plan.md
- **Caddy Configuration**: infrastructure/Caddyfile
- **VPS Setup**: docs/INFRASTRUCTURE_SETUP.md
- **DNS Propagation Checker**: https://dnschecker.org
- **Let's Encrypt Documentation**: https://letsencrypt.org/docs/
- **Caddy ACME Documentation**: https://caddyserver.com/docs/automatic-https

## Maintenance

### Regular Checks

- Monitor DNS resolution monthly: `dig marcusgoll.com`
- Monitor SSL certificate expiry (Caddy auto-renews, but verify)
- Check global DNS propagation if issues reported
- Review Caddy logs for ACME renewal issues

### SSL Certificate Renewal

Caddy handles automatic renewal (Let's Encrypt certs expire every 90 days):
- Renewal happens automatically 30 days before expiry
- No manual intervention required
- Monitor logs to confirm renewal success

### DNS Changes

If VPS IP address ever changes:
1. Update A records at registrar (same process as initial setup)
2. Update this documentation with new IP
3. Wait for propagation (TTL 3600 = 1 hour max)
4. Verify with dig/nslookup
5. SSL certificates will renew automatically for new IP

---

**Last Updated**: 2025-10-24 (Documentation created, awaiting manual implementation)
**Status**: Ready for manual DNS configuration when site production-ready
**Maintained By**: Infrastructure team
