# Error Log: SSL/TLS with Let's Encrypt

## Planning Phase (Phase 0-2)
None yet.

## Implementation Phase (Phase 3-4)
[Populated during /tasks and /implement]

## Testing Phase (Phase 5)
[Populated during /debug and /preview]

## Deployment Phase (Phase 6-7)
[Populated during production deployment]

---

## Error Template

**Error ID**: ERR-[NNN]
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [caddy/docker/dns/letsencrypt/deployment]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened]

**Root Cause**:
[Why it happened]

**Resolution**:
[How it was fixed]

**Prevention**:
[How to prevent in future]

**Related**:
- Spec: [link to requirement]
- Code: [file:line]
- Commit: [sha]

---

## Common SSL/TLS Errors (Reference)

### ERR-SSL-001: Certificate Issuance Failed - DNS Not Resolving

**Symptoms**:
- Caddy logs: "timeout checking DNS records"
- Browser shows self-signed certificate warning
- Let's Encrypt HTTP-01 challenge fails

**Root Cause**:
- DNS A record not configured
- DNS propagation not complete
- DNS points to wrong IP address

**Resolution**:
1. Verify DNS: `dig +short marcusgoll.com`
2. Wait for propagation (5-30 minutes)
3. Retry: `docker-compose -f docker-compose.prod.yml restart caddy`

**Prevention**:
- Follow deployment checklist (DNS validation step)
- Wait for DNS propagation before Caddy deployment

---

### ERR-SSL-002: Port 80 Connection Refused

**Symptoms**:
- Caddy logs: "bind: address already in use" or "connection refused"
- HTTP-01 challenge fails
- Cannot access http://marcusgoll.com

**Root Cause**:
- Port 80 blocked by firewall
- Another service using port 80 (Nginx, Apache)
- Docker port mapping conflict

**Resolution**:
1. Check firewall: `sudo ufw allow 80/tcp`
2. Check port usage: `sudo netstat -tlnp | grep :80`
3. Stop conflicting service: `sudo systemctl stop nginx`
4. Restart Caddy: `docker-compose -f docker-compose.prod.yml restart caddy`

**Prevention**:
- Deployment checklist includes firewall verification
- Pre-flight check for port conflicts

---

### ERR-SSL-003: Rate Limit Exceeded

**Symptoms**:
- Caddy logs: "rate limit exceeded"
- Certificate issuance fails
- Error message: "too many certificates already issued"

**Root Cause**:
- More than 50 certificates issued for domain in past week
- Duplicate certificate requests (no persistent volume)
- Container restarted too many times without volume

**Resolution**:
1. Check rate limit: https://crt.sh/?q=marcusgoll.com
2. Verify volume exists: `docker volume ls | grep caddy-data`
3. Wait for rate limit reset (7 days)
4. Use Let's Encrypt staging for testing: Update Caddyfile temporarily

**Prevention**:
- Docker volume persistence (US1 requirement)
- Test with staging environment first
- Avoid repeated container recreation

---

### ERR-SSL-004: HSTS Lock-Out

**Symptoms**:
- Users report "Site can't provide secure connection"
- Browser refuses to load site even via HTTP
- Clearing cache doesn't help (HSTS cached)

**Root Cause**:
- HTTPS broke (certificate expired, Caddy down)
- HSTS header sent with long max-age (6 months)
- Browsers enforce HTTPS only for max-age duration

**Resolution**:
1. Fix HTTPS (restart Caddy, renew certificate)
2. If HTTPS unfixable, users must wait for HSTS expiry OR clear HSTS cache:
   - Chrome: chrome://net-internals/#hsts → Delete domain
   - Firefox: Clear browsing data → Check "Active Logins"

**Prevention**:
- Test HTTPS thoroughly before enabling HSTS
- Start with conservative max-age (6 months, not 2 years)
- Monitor certificate expiry closely

---

### ERR-SSL-005: Certificate Renewal Failed

**Symptoms**:
- Certificate expiring soon (< 30 days)
- No recent renewal in Caddy logs
- Let's Encrypt renewal errors

**Root Cause**:
- DNS changed (no longer points to VPS)
- Port 80 blocked during renewal
- Let's Encrypt service down
- Caddy bug or misconfiguration

**Resolution**:
1. Check Caddy logs: `docker-compose -f docker-compose.prod.yml logs caddy | grep renew`
2. Verify DNS still correct: `dig +short marcusgoll.com`
3. Verify port 80 accessible: `curl -I http://marcusgoll.com`
4. Force renewal: `docker-compose -f docker-compose.prod.yml exec caddy caddy reload --force`
5. If still failing, check Let's Encrypt status: https://letsencrypt.status.io/

**Prevention**:
- Implement monitoring (Priority 2 - US5)
- Alert if certificate expires in <14 days
- Automate renewal verification

---

### ERR-SSL-006: Mixed Content Warnings

**Symptoms**:
- Browser shows "Not Secure" despite valid HTTPS
- Console errors: "Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'"
- Images or scripts not loading

**Root Cause**:
- Application code includes HTTP resources (images, scripts, CSS)
- External resources loaded via http:// instead of https://

**Resolution**:
1. Identify mixed content: Browser DevTools → Console
2. Update resources to HTTPS: Change `http://` to `https://` or `//` (protocol-relative)
3. Test thoroughly after changes

**Prevention**:
- Use protocol-relative URLs: `//example.com/image.jpg`
- Lint for http:// in code before deployment
- Content Security Policy (CSP) headers (future enhancement)

---

### ERR-SSL-007: Certificate Chain Invalid

**Symptoms**:
- SSL Labs scan shows "Chain issues"
- Some browsers show certificate warning
- openssl verify fails

**Root Cause**:
- Let's Encrypt intermediate certificate missing
- Caddy bug (rare)
- Certificate corruption

**Resolution**:
1. Check certificate chain: `echo | openssl s_client -connect marcusgoll.com:443 -showcerts`
2. Verify intermediate cert present: Should see two certificates (leaf + intermediate)
3. Force re-issuance: Delete certificate from volume, restart Caddy

**Prevention**:
- Let's Encrypt automatic chain handling (Caddy default)
- Monitor SSL Labs scan for chain issues

---

### ERR-SSL-008: Volume Not Persisted

**Symptoms**:
- New certificate requested on every container restart
- Rate limit errors after multiple restarts
- Certificate serial number changes after restart

**Root Cause**:
- Docker volume not created: `caddy-data` missing
- Volume not mounted in docker-compose.yml
- Volume mount path incorrect (`/data` instead of `/data/caddy`)

**Resolution**:
1. Check volume exists: `docker volume ls | grep caddy-data`
2. Create if missing: `docker volume create caddy-data`
3. Verify mount in docker-compose.yml: `caddy-data:/data/caddy`
4. Restart Caddy: `docker-compose -f docker-compose.prod.yml up -d caddy`

**Prevention**:
- Include volume creation in deployment checklist
- Docker Compose creates volume automatically (if defined in volumes: section)

---

## Logging Best Practices

**Caddy Log Levels**:
- ERROR: Certificate failures, renewal errors
- WARN: Rate limit warnings, temporary failures
- INFO: Certificate issuance, renewal success
- DEBUG: HTTP-01 challenge details (verbose)

**Useful Log Queries**:
```bash
# Check for certificate errors
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "error.*certificate"

# Check renewal events
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "renew"

# Check ACME challenge
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "acme"

# Check rate limit warnings
docker-compose -f docker-compose.prod.yml logs caddy | grep -i "rate limit"
```

**Log Retention**:
- Docker logs: 10MB per file, 3 files max (rotate automatically)
- Caddy access logs: Not needed for MVP (minimal traffic)
- Error logs: Keep for 30 days minimum

---

## Troubleshooting Flowchart

```
Certificate issuance fails
    ↓
DNS resolving correctly? (dig +short marcusgoll.com)
    ├─ No → Configure DNS, wait 5-30 min, retry
    └─ Yes → Continue
    ↓
Port 80 accessible? (curl -I http://marcusgoll.com)
    ├─ No → Check firewall (ufw allow 80), check port conflicts
    └─ Yes → Continue
    ↓
Rate limit exceeded? (check crt.sh)
    ├─ Yes → Wait 7 days OR use staging environment
    └─ No → Continue
    ↓
Let's Encrypt operational? (letsencrypt.status.io)
    ├─ No → Wait for service recovery
    └─ Yes → Continue
    ↓
Check Caddy logs for specific error
    ↓
Escalate to Caddy community forum or GitHub issues
```

---

## References

- Caddy Troubleshooting: https://caddyserver.com/docs/troubleshooting
- Let's Encrypt Status: https://letsencrypt.status.io/
- SSL Labs Test: https://www.ssllabs.com/ssltest/
- Certificate Search: https://crt.sh/
