# Data Model: dns-domain-mapping

## Overview

This feature involves DNS infrastructure configuration, not application data models. There are no database entities, schemas, or state management requirements.

---

## DNS Records (Infrastructure Layer)

### A Record - Apex Domain

**Purpose**: Map marcusgoll.com (apex/root domain) to VPS IP address

**Record Configuration**:
- **Type**: A (Address record)
- **Name**: `@` (represents apex domain marcusgoll.com)
- **Value**: 178.156.129.179 (VPS IP address)
- **TTL**: 3600 seconds (1 hour)

**Provider Location**: Domain registrar DNS management panel

**Validation**:
- DNS query returns 178.156.129.179
- Global propagation verified via dnschecker.org
- ACME HTTP-01 challenge succeeds for SSL cert

---

### A Record - WWW Subdomain

**Purpose**: Map www.marcusgoll.com subdomain to VPS IP address

**Record Configuration**:
- **Type**: A (Address record)
- **Name**: `www` (subdomain)
- **Value**: 178.156.129.179 (VPS IP address)
- **TTL**: 3600 seconds (1 hour)

**Provider Location**: Domain registrar DNS management panel

**Validation**:
- DNS query returns 178.156.129.179
- Caddy redirect from www → apex functions correctly
- Global propagation verified

---

## DNS Propagation State

### Propagation Lifecycle

**States**:
1. **Not Configured** → Initial state (no DNS records)
2. **Records Created** → A records created at registrar
3. **Propagating** → Records visible in some resolvers, not all
4. **Propagated** → Records visible globally across all major resolvers
5. **SSL Obtained** → Let's Encrypt certificates issued after DNS validation

**Transitions**:
- Not Configured → Records Created (manual configuration at registrar)
- Records Created → Propagating (automatic, 0-15 minutes)
- Propagating → Propagated (automatic, 15min-48hr, typically <1hr)
- Propagated → SSL Obtained (Caddy automatic ACME challenge)

**Verification Points**:
- **Records Created**: Registrar panel shows A records
- **Propagating**: `dig @8.8.8.8 marcusgoll.com` returns IP
- **Propagated**: dnschecker.org shows green globally
- **SSL Obtained**: `curl -I https://marcusgoll.com` returns 200 with valid cert

---

## No Application Data Model

**Database**: No database changes required

**API Schemas**: No API contracts (infrastructure config only)

**Frontend State**: No frontend state management

**Backend Entities**: No backend entities

---

## Infrastructure Configuration Schema

While not a traditional data model, DNS records follow a schema:

```yaml
# DNS Record Schema (for documentation purposes)
dns_records:
  - type: A
    name: "@"           # Apex domain
    value: "178.156.129.179"
    ttl: 3600
    priority: null      # Not applicable for A records

  - type: A
    name: "www"
    value: "178.156.129.179"
    ttl: 3600
    priority: null
```

**Note**: This is not stored in any application database - DNS records exist at the registrar level.

---

## Verification Data Points

### Expected DNS Query Responses

**Query**: `dig marcusgoll.com +short`
**Expected**: `178.156.129.179`

**Query**: `dig www.marcusgoll.com +short`
**Expected**: `178.156.129.179`

**Query**: `dig @8.8.8.8 marcusgoll.com +short` (Google DNS)
**Expected**: `178.156.129.179`

**Query**: `dig @1.1.1.1 marcusgoll.com +short` (Cloudflare DNS)
**Expected**: `178.156.129.179`

### Expected HTTP Responses (After SSL)

**Request**: `curl -I https://marcusgoll.com`
**Expected**:
- Status: 200 OK
- Header: `Content-Type: text/html`
- SSL: Valid Let's Encrypt certificate
- Redirects: None (apex is primary)

**Request**: `curl -I https://www.marcusgoll.com`
**Expected**:
- Status: 308 Permanent Redirect
- Header: `Location: https://marcusgoll.com{uri}`
- SSL: Valid Let's Encrypt certificate

---

## Documentation Artifacts

### infrastructure/dns/README.md

**Contents**:
- DNS provider name and login URL
- A record configuration instructions
- Verification commands with expected output
- Troubleshooting steps
- Propagation timeline expectations
- Rollback procedure

**Format**: Markdown with code blocks, similar to INFRASTRUCTURE_SETUP.md

**Storage**: Git repository (checked in)

---

## Security Considerations

### No Sensitive Data

- DNS A records are public information (visible via DNS queries)
- VPS IP address is already public (accessible via HTTP)
- No credentials or secrets involved in DNS records

### Access Control

- **DNS Management**: Registrar account login required (credentials NOT in git)
- **SSL Certificates**: Automatic via Let's Encrypt (no manual credential management)

---

## Related Infrastructure Components

### Caddy Reverse Proxy (infrastructure/Caddyfile)

**DNS Dependency**: Caddy requires DNS to point to VPS before SSL can be obtained

**Configuration** (lines 15-17):
```
marcusgoll.com {
  reverse_proxy ghost:2368
}
```

**SSL Email**: marcusgoll@gmail.com (line 2)

**ACME Challenge**: Automatic HTTP-01 challenge on port 80

### VPS Network Configuration

**IP Address**: 178.156.129.179 (static, no DHCP)

**Open Ports**:
- 80 (HTTP, required for ACME challenge)
- 443 (HTTPS, for SSL traffic)

**Firewall**: UFW configured to allow 80/443

---

## Summary

This feature has **no application data model**. It is purely infrastructure configuration:
- **DNS Records**: Configured at registrar, not in application
- **State Management**: No frontend/backend state
- **Database**: No database entities or migrations
- **Documentation**: infrastructure/dns/README.md (only artifact)
