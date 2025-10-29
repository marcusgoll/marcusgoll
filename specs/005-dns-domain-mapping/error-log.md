# Error Log: DNS Domain Mapping

## Planning Phase (Phase 0-2)

None yet.

---

## Implementation Phase (Phase 3-4)

[Populated during /tasks and /implement]

---

## Testing Phase (Phase 5)

[Populated during /debug and /preview]

---

## Deployment Phase (Phase 6-7)

[Populated during staging validation and production deployment]

---

## Error Template

**Error ID**: ERR-[NNN]
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [dns/infrastructure/ssl/verification]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened - e.g., "DNS propagation incomplete after 2 hours"]

**Root Cause**:
[Why it happened - e.g., "TTL was set to 86400 instead of 3600, causing slow propagation"]

**Resolution**:
[How it was fixed - e.g., "Reduced TTL to 3600, waited for cache expiration"]

**Prevention**:
[How to prevent in future - e.g., "Document recommended TTL values in infrastructure/dns/README.md"]

**Related**:
- Spec: [link to requirement, e.g., spec.md#nfr-001]
- Documentation: [link to relevant docs, e.g., infrastructure/dns/README.md]
- External: [link to external resources, e.g., dnschecker.org results]

---

## Common DNS Issues Reference

### Issue: DNS Not Resolving

**Symptoms**: `dig marcusgoll.com` returns SERVFAIL or NXDOMAIN

**Common Causes**:
- A records not created at registrar
- Incorrect record name (should be @ or blank for apex)
- Typo in IP address

**Diagnosis**:
```bash
# Check registrar panel - verify records exist
# Check exact record name and value
# Test with authoritative nameserver
dig marcusgoll.com @ns1.registrar.com
```

**Resolution**:
- Verify records in registrar panel
- Correct any typos
- Wait 5-10 minutes and retry

---

### Issue: Slow DNS Propagation

**Symptoms**: Some DNS servers resolve, others don't after >1 hour

**Common Causes**:
- High TTL causing cache retention
- Geographic DNS propagation delays
- ISP DNS caching policies

**Diagnosis**:
```bash
# Check current TTL
dig marcusgoll.com | grep -i ttl

# Test multiple DNS servers
dig @8.8.8.8 marcusgoll.com
dig @1.1.1.1 marcusgoll.com
dig marcusgoll.com  # Local resolver

# Check global propagation
# Visit https://dnschecker.org
```

**Resolution**:
- Wait for TTL expiration
- Clear local DNS cache (ipconfig /flushdns on Windows)
- Use specific DNS server that has propagated (e.g., 8.8.8.8)

---

### Issue: SSL Certificate Not Issuing

**Symptoms**: Caddy logs show ACME challenge failures

**Common Causes**:
- DNS not yet pointing to VPS
- Port 80 not accessible
- Email not configured in Caddyfile

**Diagnosis**:
```bash
# Verify DNS points to VPS
dig marcusgoll.com +short
# Must return: 178.156.129.179

# Verify port 80 accessible
telnet 178.156.129.179 80
# Should connect successfully

# Check Caddy logs
ssh hetzner "docker logs proxy-caddy-1 --tail 100 | grep -i acme"

# Verify email configured
ssh hetzner "docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile | head -3"
```

**Resolution**:
- Ensure DNS propagation complete before expecting SSL
- Verify firewall allows port 80
- Restart Caddy if needed: `ssh hetzner "docker restart proxy-caddy-1"`

---

### Issue: WWW Redirect Not Working

**Symptoms**: https://www.marcusgoll.com doesn't redirect to apex

**Common Causes**:
- www A record not created
- Caddyfile www redirect not configured
- SSL not obtained for www subdomain

**Diagnosis**:
```bash
# Verify www DNS resolves
dig www.marcusgoll.com +short
# Must return: 178.156.129.179

# Check Caddy redirect config
ssh hetzner "docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile | grep -A 2 'www.marcusgoll.com'"

# Test redirect
curl -I https://www.marcusgoll.com
# Should show 308 redirect with Location: https://marcusgoll.com
```

**Resolution**:
- Create www A record if missing
- Verify Caddyfile has www redirect block (lines 6-8)
- Wait for SSL cert issuance for www subdomain
- Restart Caddy if config changed

---

## Notes

- This log will be populated during implementation and deployment phases
- Each error should be documented with full context for future reference
- Include commands used for diagnosis and resolution
- Link to relevant specification requirements and documentation
