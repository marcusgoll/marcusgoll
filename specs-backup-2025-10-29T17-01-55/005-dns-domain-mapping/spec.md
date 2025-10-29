# Feature Specification: DNS Domain Mapping

**Feature**: Configure DNS mapping to marcusgoll.com domain
**Status**: Specification Complete
**Created**: 2025-10-25
**Last Updated**: 2025-10-25

## Overview

Configure DNS A records to point the marcusgoll.com domain to the VPS IP address (178.156.129.179), enabling branded domain access and preparing for HTTPS certificate issuance via Caddy reverse proxy.

### Context

The Next.js application at marcusgoll.com is currently only accessible via direct IP address (http://178.156.129.179:3000), requiring users to:
- Remember and manually enter an IP address
- Specify port 3000 explicitly
- Use insecure HTTP (HTTPS requires domain configuration first)

Caddy reverse proxy configuration already exists (infrastructure/Caddyfile) with:
- SSL certificate email configured (marcusgoll@gmail.com)
- Domain routing configured for marcusgoll.com
- www to apex redirect configured
- TODO note indicating it will point to next:3000 after deployment

DNS mapping is the final step needed to enable HTTPS and branded domain access.

### Status Note

This feature is currently **on hold** until the new Next.js site is fully built and ready for production deployment (per GitHub Issue #40). The specification documents the required DNS configuration for when deployment is ready.

## User Stories

### US-001: Access site via branded domain
**As a** visitor
**I want to** access the site via https://marcusgoll.com
**So that** I don't need to remember an IP address and can use a secure HTTPS connection

**Acceptance Scenarios**:

**Given** DNS records are configured
**When** I navigate to https://marcusgoll.com in my browser
**Then** the site loads successfully with a valid SSL certificate
**And** the URL shows marcusgoll.com (not the IP address)

**Given** DNS records are configured
**When** I navigate to https://www.marcusgoll.com
**Then** I am redirected to https://marcusgoll.com (apex domain)
**And** the site loads successfully

### US-002: Verify DNS propagation
**As a** site operator
**I want to** verify DNS records have propagated globally
**So that** I can confirm users worldwide can access the site via domain name

**Acceptance Scenarios**:

**Given** DNS A records have been created
**When** I query multiple DNS servers (8.8.8.8, 1.1.1.1, local resolver)
**Then** all servers return 178.156.129.179 for marcusgoll.com
**And** all servers return 178.156.129.179 for www.marcusgoll.com

**Given** DNS records have propagated
**When** I check global DNS propagation (via dnschecker.org)
**Then** all geographic regions show correct IP resolution
**And** no DNS errors or misconfigurations are detected

### US-003: Enable HTTPS certificate issuance
**As a** site operator
**I want** Caddy to automatically obtain SSL certificates from Let's Encrypt
**So that** visitors can access the site securely via HTTPS

**Acceptance Scenarios**:

**Given** DNS records point to the VPS IP
**And** Caddy is running with marcusgoll.com configuration
**When** Caddy attempts ACME HTTP-01 challenge
**Then** Let's Encrypt can reach the domain via port 80
**And** SSL certificate is issued successfully
**And** HTTPS is enabled automatically

## Functional Requirements

### FR-001: DNS A Record Configuration
Create DNS A records at domain registrar:
- Record 1: `@` (apex) → 178.156.129.179, TTL 3600
- Record 2: `www` → 178.156.129.179, TTL 3600

Success: DNS queries return correct IP for both apex and www subdomain

### FR-002: DNS Propagation Verification
Verify DNS propagation using multiple methods:
- Command-line tools: `dig`, `nslookup`, `ping`
- Multiple DNS servers: Google (8.8.8.8), Cloudflare (1.1.1.1), local resolver
- Global propagation checker: https://dnschecker.org

Success: All verification methods confirm IP resolution within 48 hours (typically < 1 hour)

### FR-003: Documentation
Create documentation at `infrastructure/dns/README.md` with:
- DNS provider name and login instructions
- A record configuration details
- Verification commands and expected output
- Troubleshooting steps for common issues
- Propagation timeline expectations

Success: Documentation is clear, actionable, and verifiable by following provided commands

## Non-Functional Requirements

### NFR-001: Propagation Performance
DNS propagation must complete globally within 48 hours (industry standard)

Target: < 1 hour for major DNS resolvers (Google, Cloudflare)

### NFR-002: Reliability
DNS records must resolve consistently across all major DNS servers with 99.9% uptime

### NFR-003: Security
DNS configuration must not expose sensitive infrastructure details beyond the public VPS IP address

## Success Criteria

The DNS domain mapping is successfully configured when:

1. **Domain Resolution**: `ping marcusgoll.com` returns 178.156.129.179
2. **Subdomain Resolution**: `ping www.marcusgoll.com` returns 178.156.129.179
3. **Global Propagation**: DNS resolution verified in all major geographic regions
4. **HTTPS Ready**: Caddy can complete ACME HTTP-01 challenge for SSL certificate
5. **Documentation Complete**: Infrastructure documentation includes DNS configuration details
6. **Verification Reproducible**: Any team member can verify DNS status using documented commands

## Assumptions

1. Domain marcusgoll.com is already registered and registrar account is accessible
2. VPS at 178.156.129.179 has ports 80 and 443 open for HTTP/HTTPS traffic
3. Caddy reverse proxy is installed and configured on the VPS
4. Site will remain at current VPS IP address (no migration planned)
5. Standard DNS propagation timelines apply (no premium fast-track DNS)
6. No DNSSEC required initially (can be added later if needed)

## Out of Scope

The following are explicitly **not** part of this feature:

- Caddy reverse proxy configuration (already complete in infrastructure/Caddyfile)
- SSL certificate installation (handled automatically by Caddy after DNS)
- Next.js application deployment to VPS
- Updating Caddyfile to point from ghost:2368 to next:3000
- Additional subdomain configuration beyond www
- Email DNS records (MX, SPF, DKIM)
- CDN or DNS-based DDoS protection
- DNSSEC configuration

## Dependencies

### Prerequisites
- Access to domain registrar account for marcusgoll.com
- VPS at 178.156.129.179 is running and accessible
- Caddy reverse proxy is installed on VPS

### Blocking Dependencies
- None (DNS can be configured independently)

### Follow-up Features
After DNS configuration is complete:
1. Verify HTTPS certificate issuance via Caddy
2. Update Caddyfile to route marcusgoll.com to next:3000 (currently ghost:2368)
3. Deploy Next.js application to production

## Technical Constraints

### DNS Provider Requirements
- Must support standard A record creation
- Must support TTL configuration (minimum 3600 seconds acceptable)
- Should provide DNS management UI or API

### Network Requirements
- VPS must have static IP address 178.156.129.179
- Ports 80 (HTTP) and 443 (HTTPS) must be accessible from internet
- No firewall rules blocking Let's Encrypt validation

## Deployment Considerations

### Platform Dependencies
None - DNS is configured at registrar level, external to VPS

### Environment Variables
None required for DNS configuration

### Breaking Changes
None - DNS mapping is additive (IP-based access will continue to work)

### Migration Required
No database or application migration needed

### Rollback Considerations
Standard DNS rollback:
1. Remove or update A records at registrar
2. Wait for propagation (up to TTL duration, 3600 seconds = 1 hour)
3. Verify via `dig` and global DNS checker

Note: IP-based access (http://178.156.129.179:3000) will always work as fallback

## Risk Assessment

### Technical Risks

**Risk**: DNS propagation takes longer than expected
- **Likelihood**: Low (standard propagation is 15min-48hr, typically <1hr)
- **Impact**: Medium (delays HTTPS enablement)
- **Mitigation**: Set TTL to 3600 (1 hour) initially, can reduce to 300 after stable

**Risk**: Incorrect A record configuration
- **Likelihood**: Low (simple two-record setup)
- **Impact**: High (site unreachable via domain)
- **Mitigation**: Verify records immediately after creation, keep IP access available

**Risk**: Registrar account access issues
- **Likelihood**: Low (assuming credentials are available)
- **Impact**: High (blocks entire feature)
- **Mitigation**: Verify account access before starting, reset password if needed

### Operational Risks

**Risk**: Let's Encrypt ACME challenge fails after DNS setup
- **Likelihood**: Low (Caddy handles this automatically)
- **Impact**: Medium (HTTPS unavailable, but HTTP works)
- **Mitigation**: Verify ports 80/443 are open, check Caddy logs, retry automatic issuance

## Timeline Estimate

- DNS record creation: 15 minutes
- DNS propagation verification: 1-48 hours (typically < 1 hour)
- Documentation: 30 minutes
- Total estimated time: 1-2 hours active work, up to 48 hours wait for propagation

## Open Questions

None - specification is complete with reasonable assumptions documented.

## References

- GitHub Issue #40: https://github.com/marcusgoll/marcusgoll/issues/40
- Caddy configuration: infrastructure/Caddyfile
- VPS details: 178.156.129.179 (port 3000 currently)
- DNS propagation checker: https://dnschecker.org
- Let's Encrypt ACME: https://letsencrypt.org/docs/challenge-types/

## Approval

**Status**: Ready for Planning

**Next Steps**:
1. Run `/plan` to create implementation plan
2. Verify domain registrar access before implementation
3. Coordinate with site production readiness (feature currently on hold)
