# Feature Specification: SSL/TLS with Let's Encrypt

**Branch**: `feature/048-ssl-tls-letsencrypt`
**Created**: 2025-10-28
**Status**: Draft
**Feature Type**: Infrastructure Enhancement
**ICE Score**: Impact 5/5, Effort 2/5, Confidence 1.0, Score 2.50 (High Priority)
**GitHub Issue**: #30

## User Scenarios

### Primary User Story

**As** a site owner (Marcus) deploying marcusgoll.com to production,
**I want** automatic HTTPS certificate management with Let's Encrypt via Caddy,
**So that** my site is secure, trusted by browsers, and ranks well in search results without manual SSL maintenance.

### Acceptance Scenarios

1. **Given** DNS for marcusgoll.com points to the VPS IP address, **When** Caddy starts for the first time, **Then** it automatically obtains a valid Let's Encrypt certificate and serves the site over HTTPS within 5 minutes.

2. **Given** a Let's Encrypt certificate is approaching expiration (30 days before), **When** Caddy's automatic renewal runs, **Then** the certificate is renewed seamlessly without manual intervention or site downtime.

3. **Given** a user visits http://marcusgoll.com (HTTP), **When** the request reaches Caddy, **Then** they are automatically redirected to https://marcusgoll.com (HTTPS) with a 308 permanent redirect.

4. **Given** the Docker container restarts, **When** Caddy starts up, **Then** it reuses the existing certificates from persistent storage and does not request new certificates from Let's Encrypt.

5. **Given** a certificate renewal fails, **When** the failure is logged, **Then** an alert is generated so that manual intervention can occur before the certificate expires.

6. **Given** the site is live with HTTPS, **When** tested with SSL Labs SSL Server Test, **Then** the site achieves an A+ rating with proper security headers including HSTS.

### Edge Cases

- **What happens when** DNS is not configured before Caddy starts?
  - Certificate request fails (Let's Encrypt HTTP-01 challenge fails)
  - Caddy falls back to self-signed certificate
  - Site shows browser security warning until DNS is configured

- **What happens when** Let's Encrypt rate limit is hit?
  - Caddy retries with exponential backoff
  - Persistent storage prevents repeated requests on container restart
  - Temporary self-signed certificate used until rate limit resets

- **What happens when** certificate renewal fails repeatedly?
  - Monitoring detects failure in logs
  - Alert sent to admin
  - Certificate expires after 90 days if not resolved
  - Manual intervention required to diagnose and fix

- **What happens when** adding a new subdomain?
  - Add subdomain to Caddyfile with proper reverse proxy
  - Caddy automatically requests certificate for new subdomain
  - No manual certificate management needed

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer, I want Caddy configured with persistent certificate storage so that certificates survive container restarts without hitting Let's Encrypt rate limits
  - **Acceptance**:
    - Docker volume mounted at `/data/caddy` in Caddy container
    - Volume persists certificates and metadata across restarts
    - Container restart does not trigger new certificate request
    - Certificates stored with 600 permissions
  - **Independent test**: Restart Caddy container 3 times in 5 minutes, site remains accessible with valid cert, no new Let's Encrypt requests
  - **Effort**: XS (<2 hours)

- **US2** [P1]: As a developer, I want automatic HTTPS redirect configured so that all HTTP traffic is upgraded to HTTPS for security
  - **Acceptance**:
    - HTTP requests to port 80 redirect to HTTPS port 443
    - Redirect uses 308 status code (permanent)
    - Redirect preserves URL path and query parameters
    - Works for all configured domains (marcusgoll.com, cfipros.com, subdomains)
  - **Independent test**: curl -I http://marcusgoll.com returns 308 with Location: https://marcusgoll.com
  - **Effort**: XS (<1 hour, Caddy default behavior)

- **US3** [P1]: As a site owner, I want HSTS headers configured so that browsers enforce HTTPS and prevent downgrade attacks
  - **Acceptance**:
    - Strict-Transport-Security header present on all HTTPS responses
    - Initial max-age of 15768000 seconds (6 months)
    - includeSubDomains directive enabled for marcusgoll.com
    - Header verified with curl or browser dev tools
  - **Independent test**: curl -I https://marcusgoll.com | grep -i strict-transport-security shows proper header
  - **Effort**: XS (<1 hour)

- **US4** [P1]: As a developer, I want DNS validation documented in deployment checklist so that certificate issuance succeeds on first deploy
  - **Acceptance**:
    - Deployment checklist includes DNS verification step
    - Command provided to test DNS resolution (dig/nslookup)
    - Expected A record values documented
    - Validation step must pass before Caddy deployment
  - **Independent test**: Follow checklist, DNS points to VPS IP before Caddy starts, certificate issued successfully
  - **Effort**: XS (<1 hour, documentation only)

**Priority 2 (Enhancement)**

- **US5** [P2]: As a developer, I want certificate renewal monitoring so that I'm alerted if automatic renewal fails before expiry
  - **Acceptance**:
    - Script checks Caddy logs for renewal events daily
    - Alert sent if certificate expires in <14 days and no recent renewal attempt
    - Alert includes certificate domain and expiry date
    - Script runs via cron or systemd timer
  - **Depends on**: US1 (needs persistent cert storage to check)
  - **Independent test**: Simulate renewal failure in logs, alert fires within 24 hours
  - **Effort**: S (2-3 hours)

- **US6** [P2]: As a site owner, I want SSL Labs A+ rating achieved so that the site meets industry security standards
  - **Acceptance**:
    - SSL Labs scan shows A+ rating
    - All major browsers show green padlock
    - No mixed content warnings
    - Certificate chain complete and valid
  - **Depends on**: US1, US3 (needs HTTPS + HSTS)
  - **Independent test**: Run SSL Labs scan at ssllabs.com/ssltest/, result is A+
  - **Effort**: S (2-3 hours, testing and config tweaks)

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a developer, I want wildcard certificate support documented so that new subdomains don't require Caddyfile changes
  - **Acceptance**:
    - Documentation explains DNS-01 challenge requirement
    - DNS provider API key configuration steps
    - Caddyfile wildcard syntax example
    - Tradeoffs documented (complexity vs convenience)
  - **Depends on**: US1, US2 (needs basic SSL working first)
  - **Independent test**: Documentation review, wildcard config can be implemented from docs alone
  - **Effort**: S (2-3 hours, documentation and testing)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours
- L: 8-16 hours
- XL: 16+ hours

**MVP Strategy**: Ship US1-US4 first (basic HTTPS with persistence and security headers), validate with production deploy, then add US5-US6 (monitoring and SSL Labs validation), defer US7 (wildcard certs) until multiple subdomains justify complexity.

## Success Metrics

> **SKIP IF**: Infrastructure feature with indirect user impact

This is an infrastructure feature that improves security and SEO but doesn't directly track user behavior. Success is measured by:

- **Security**: SSL Labs A+ rating achieved
- **Reliability**: 100% HTTPS uptime (no cert expiry incidents)
- **SEO Impact**: Google Search Console shows HTTPS status for all indexed pages
- **Compliance**: HSTS preload-eligible (if desired later)

No HEART metrics tracking required.

## Requirements

### Functional Requirements

- **FR-001**: System MUST automatically obtain Let's Encrypt certificates for all domains configured in Caddyfile when DNS points to VPS IP address
  - **Verification**: Deploy with valid DNS, check certificate issued within 5 minutes

- **FR-002**: System MUST persist certificates in Docker volume to survive container restarts without requesting new certificates
  - **Verification**: Restart Caddy container, site accessible with same certificate serial number

- **FR-003**: System MUST automatically redirect HTTP requests to HTTPS with 308 permanent redirect
  - **Verification**: curl -I http://marcusgoll.com returns 308 redirect to https://

- **FR-004**: System MUST automatically renew certificates 30 days before expiration without manual intervention
  - **Verification**: Monitor Caddy logs for renewal events, check cert expiry date advances

- **FR-005**: System MUST include HSTS header on all HTTPS responses with min 6 months max-age
  - **Verification**: curl -I https://marcusgoll.com shows Strict-Transport-Security header

- **FR-006**: System MUST support multiple domains and subdomains with individual certificates (marcusgoll.com, cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com)
  - **Verification**: Check each domain has valid certificate with correct CN/SAN

- **FR-007**: System MUST log certificate renewal events and failures for monitoring
  - **Verification**: Examine Caddy logs, renewal events visible with timestamps

### Non-Functional Requirements

- **NFR-001**: Security: All HTTPS connections MUST use TLS 1.2 or higher with secure cipher suites
  - **Verification**: SSL Labs scan shows no SSL 3.0/TLS 1.0/1.1, only secure ciphers

- **NFR-002**: Performance: Certificate issuance MUST complete within 5 minutes of DNS configuration
  - **Verification**: Time from Caddy start to HTTPS available <5 minutes

- **NFR-003**: Reliability: Certificate renewal MUST have >99% success rate
  - **Verification**: Monitor renewal logs over 3 months, calculate success rate

- **NFR-004**: Operations: Certificate storage MUST be backed up as part of VPS backup strategy
  - **Verification**: Docker volume included in backup scripts/procedures

- **NFR-005**: Compliance: HTTPS configuration MUST meet SSL Labs A+ rating criteria
  - **Verification**: SSL Labs scan achieves A+ rating

### Assumptions

- **A-001**: DNS for all domains (marcusgoll.com, cfipros.com, subdomains) already points to VPS IP address or will be configured before deployment
  - **Validation**: DNS verification step in deployment checklist

- **A-002**: VPS has ports 80 (HTTP) and 443 (HTTPS) open in firewall
  - **Validation**: Pre-flight check tests port accessibility

- **A-003**: Let's Encrypt rate limits are not currently hit for these domains (50 certs per domain per week)
  - **Validation**: Check Let's Encrypt crt.sh for current certificate count

- **A-004**: Email address (marcusgoll@gmail.com) is valid for Let's Encrypt notifications
  - **Validation**: Email configured in Caddyfile, accessible inbox

- **A-005**: Caddy runs in Docker container (or as Docker Compose service) on VPS
  - **Validation**: Deployment uses docker-compose.yml or similar

## Deployment Considerations

### Platform Dependencies

**VPS Infrastructure**:
- Caddy web server (already chosen in tech stack)
- Docker + Docker Compose (already in use)
- Ports 80 and 443 accessible from internet

**New Dependencies**:
- Docker volume for certificate persistence

**Impact**: Minimal - leverages existing infrastructure, adds one Docker volume

### Environment Variables

**No new environment variables required**. Certificate management is configured via Caddyfile.

**Existing Configuration**:
- Email in Caddyfile: `marcusgoll@gmail.com` (hardcoded)
- Domain names in Caddyfile: marcusgoll.com, cfipros.com, subdomains

**Schema Update Required**: No

### Breaking Changes

**API Contract Changes**: None - infrastructure only

**Database Schema Changes**: None

**Auth Flow Modifications**: None

**Client Compatibility**: Fully backward compatible. HTTPS upgrade is transparent to users.

**Risk**: Very low. Caddy handles HTTPS automatically. Main risk is DNS misconfiguration (mitigated by deployment checklist).

### Migration Requirements

**Database Migrations**: None

**Data Backfill**: None

**Configuration Migration**:
- Existing Caddyfile may need minor updates (HSTS header, volume mount)
- Docker Compose or Docker run command needs volume mount added

**RLS Policy Changes**: None

**Reversibility**: Fully reversible - remove HSTS header, remove volume mount, restart Caddy

### Rollback Considerations

**Standard Rollback**: Yes - revert Caddyfile changes, restart Caddy container

**Special Rollback Needs**:
- **HSTS Consideration**: Once HSTS header sent with long max-age, browsers cache it. If HTTPS breaks, users cannot access site via HTTP for max-age duration (6 months). Mitigation: Test thoroughly before enabling HSTS.
- **Certificate Persistence**: Deleting volume forces new certificate request (rate limit risk). Mitigation: Backup volume before destructive changes.

**Deployment Metadata**: Not required - infrastructure configuration only

---

## Measurement Plan

> **Infrastructure feature**: Success measured via operational metrics and external validation tools.

### Validation Methods

**SSL Labs SSL Server Test**:
- Tool: https://www.ssllabs.com/ssltest/
- Frequency: After initial deployment, then quarterly
- Target: A+ rating
- Checks: Certificate validity, protocol support, cipher suites, HSTS

**Manual Validation** (post-deployment):
- Browser access: https://marcusgoll.com shows green padlock
- Certificate inspection: Valid issuer (Let's Encrypt), expiry >60 days
- HSTS verification: curl -I https://marcusgoll.com | grep -i strict-transport-security

**Monitoring** (ongoing):
- Caddy access logs: No certificate errors
- Caddy renewal logs: Successful renewal events every 60 days
- Alert system: No certificate expiry warnings

**Google Search Console**:
- HTTPS indexing status: All pages indexed via HTTPS
- Security issues: None reported

### Success Criteria

- **SC-001**: SSL Labs test achieves A+ rating within 1 week of deployment
- **SC-002**: Zero certificate expiry incidents in first 6 months
- **SC-003**: 100% of HTTP requests automatically redirect to HTTPS
- **SC-004**: Certificate renewal succeeds without manual intervention for 3+ renewal cycles
- **SC-005**: Docker container restarts do not trigger new certificate requests (rate limit protection verified)

---

## Quality Gates

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (security, performance, reliability)
- [x] No implementation details (specific commands, code)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] Skipped - Infrastructure feature, no user behavior tracking

### Conditional: UI Features (Skip if backend-only)
- [x] Skipped - Infrastructure/backend feature, no UI components

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified (None - fully backward compatible)
- [x] Environment variables documented (None required)
- [x] Rollback plan specified (HSTS caching caveat documented)
- [x] DNS prerequisite documented (deployment checklist)

---

## Related Documentation

**Dependencies** (from GitHub Issue #30):
- Blocked by: #26 (docker-compose-orchestration)
- Blocked by: #27 (tech-stack-production-infra)

**Related Features**:
- Spec 047: Dokploy Deployment Platform (may provide UI for SSL management)

**Tech Stack Justification**:
- docs/project/tech-stack.md: Caddy chosen specifically for automatic SSL/TLS

**Current Infrastructure**:
- infrastructure/Caddyfile: Existing Caddy configuration
- docker-compose.prod.yml: Current production Docker setup

**Next Steps**:
- After spec approval: /plan → /tasks → /implement
- Coordinate with Dokploy feature if deployed first
- Update deployment-strategy.md with SSL/TLS procedures
