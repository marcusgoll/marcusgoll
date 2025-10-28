# Implementation Plan: SSL/TLS with Let's Encrypt

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Caddy 2.x (already chosen), Docker Compose, Let's Encrypt ACME
- Components to reuse: 3 (Caddyfile, docker-compose.prod.yml, Dockerfile)
- New components needed: 2 (Caddy Docker service, DNS deployment checklist)

**Key Research Decisions**:
1. Leverage Caddy's built-in Let's Encrypt integration (zero-config ACME)
2. HTTP-01 challenge for individual domain certificates (simpler than DNS-01)
3. Docker volume for certificate persistence (prevents rate limit issues)
4. HSTS with 6-month initial max-age (conservative, increase to 2 years later)
5. DNS validation checklist before deployment (prevents issuance failures)

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- Reverse Proxy: Caddy 2.x (official Docker image: caddy:2-alpine)
- SSL/TLS Provider: Let's Encrypt (ACME protocol, automatic)
- Certificate Storage: Docker volume (caddy-data)
- Deployment: Docker Compose (docker-compose.prod.yml)
- DNS: A records pointing to VPS IP (prerequisite)

**Patterns**:
- **Automatic HTTPS**: Caddy handles ACME protocol, certificate issuance, renewal automatically
- **Reverse Proxy**: Caddy → Next.js (port 3000) for application traffic
- **Persistent State**: Docker named volume survives container restarts
- **Zero Downtime**: Certificate renewal happens in background, no service interruption

**Dependencies** (new packages required):
- None (Caddy official Docker image has all dependencies)
- Docker volume: `caddy-data` (created via Docker Compose)

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
infrastructure/
├── Caddyfile                    # [MODIFY] Add HSTS headers
└── README.md                    # [CREATE] Caddy setup documentation

docker-compose.prod.yml          # [MODIFY] Add Caddy service
docker-compose.yml               # [NO CHANGE] Dev uses HTTP only

specs/048-ssl-tls-letsencrypt/
├── deployment-checklist.md      # [CREATE] DNS validation steps
├── data-model.md                # [CREATED] Certificate storage structure
├── plan.md                      # [THIS FILE]
├── quickstart.md                # [CREATED] Integration scenarios
├── research.md                  # [CREATED] Research decisions
└── NOTES.md                     # [UPDATE] Implementation decisions

docs/
└── OPERATIONS_RUNBOOK.md        # [UPDATE] Add SSL troubleshooting section
```

**Module Organization**:
- **infrastructure/Caddyfile**: Reverse proxy configuration with HSTS headers
- **docker-compose.prod.yml**: Caddy service with volume, ports, network
- **deployment-checklist.md**: Pre-flight DNS validation steps

---

## [DATA MODEL]

See: data-model.md for complete certificate storage structure

**Summary**:
- Storage: Docker volume `caddy-data` at `/data/caddy` in Caddy container
- Certificates: PEM-encoded X.509, one per domain (marcusgoll.com, cfipros.com, subdomains)
- Metadata: JSON files with expiry dates, renewal state
- Permissions: 0600 for private keys, 0700 for directories
- Backup: Included in VPS backup strategy (NFR-004)

**No Database Changes**: Infrastructure-only feature, no Prisma models needed

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-002: Certificate issuance <5 minutes (HTTP-01 challenge + Let's Encrypt processing)
- NFR-003: Renewal success rate >99% (Let's Encrypt historical reliability)

**From constitution.md Performance Requirements**:
- API responses: <200ms p50, <500ms p95 (unchanged - Caddy adds <1ms SSL overhead)
- Page loads: <2s FCP, <3s LCP (unchanged - HTTP/2 via Caddy improves performance)

**Lighthouse Targets**:
- Performance: ≥85 (HTTPS may improve score vs HTTP)
- Accessibility: ≥95 (unchanged)
- Best Practices: ≥90 (HTTPS required for 100, currently meets minimum)
- SEO: ≥90 (HTTPS required for ranking boost)

**SSL/TLS Performance**:
- TLS handshake: <100ms (Caddy optimized, HTTP/2 connection reuse)
- Certificate validation: <50ms (OCSP stapling enabled by Caddy default)

---

## [SECURITY]

**Authentication Strategy**:
- Not applicable (infrastructure feature, no authentication changes)

**Authorization Model**:
- Not applicable (infrastructure feature, no authorization changes)

**Input Validation**:
- DNS validation: Manual checklist verification (US4)
- Certificate validation: Let's Encrypt performs domain ownership validation (HTTP-01 challenge)

**Data Protection**:
- **Certificates**: Stored in Docker volume, not committed to Git
- **Private Keys**: 0600 permissions, never leave VPS
- **ACME Account**: Stored in volume, used for renewal only
- **Encryption**: TLS 1.2+ only, strong cipher suites (Mozilla Intermediate profile)

**Security Headers**:
- **HSTS**: Strict-Transport-Security: max-age=15768000; includeSubDomains (6 months)
- **Future**: Increase to max-age=63072000 (2 years) after validation period
- **Certificate Transparency**: Automatic via Let's Encrypt (certificates logged to CT logs)

**SSL Labs A+ Requirements**:
1. TLS 1.2+ only ✅ Caddy default
2. Strong ciphers only ✅ Caddy default (Mozilla Intermediate)
3. HSTS with long max-age ⚠️ Needs Caddyfile configuration (6 months → 2 years)
4. No mixed content ✅ Application responsibility (Next.js handles)
5. Valid certificate chain ✅ Let's Encrypt automatic

---

## [EXISTING INFRASTRUCTURE - REUSE] (3 components)

**Configuration Files**:
- `infrastructure/Caddyfile`: Existing reverse proxy configuration for marcusgoll.com, cfipros.com, subdomains
  - **Reuse**: Domain blocks, reverse_proxy directives, www redirects
  - **Modify**: Add HSTS header directive to each domain block
  - **Lines**: 1-38 (entire file)

**Deployment**:
- `docker-compose.prod.yml`: Production Docker Compose orchestration
  - **Reuse**: Network definition (app-network), logging config, health check patterns
  - **Modify**: Add Caddy service with volume mount, ports 80/443
  - **Lines**: 1-78 (entire file structure)

**Application**:
- `Dockerfile`: Multi-stage Next.js build
  - **Reuse**: No changes needed (SSL handled by Caddy, not Next.js)
  - **Lines**: All (no modifications)

---

## [NEW INFRASTRUCTURE - CREATE] (2 components)

**Docker Compose Service**:
- `docker-compose.prod.yml`: Caddy service definition
  - **Purpose**: Run Caddy as reverse proxy with SSL/TLS
  - **Config**: Volume mount (caddy-data), ports (80, 443), Caddyfile mount, network
  - **Estimated Lines**: +25 lines (service definition)

**Documentation**:
- `specs/048-ssl-tls-letsencrypt/deployment-checklist.md`: DNS validation steps
  - **Purpose**: Pre-deployment DNS verification to prevent certificate issuance failure
  - **Content**: dig commands, A record verification, propagation time, troubleshooting
  - **Estimated Lines**: ~50 lines (markdown checklist)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**

### Platform Dependencies

**Current**: Hetzner VPS + Docker + Docker Compose
**Added**: Caddy 2.x (Docker image: caddy:2-alpine)
**Impact**: Minimal (one additional container, negligible resource overhead)

### Environment Variables

**No new environment variables required**. Email configured directly in Caddyfile:
```caddyfile
{
  email marcusgoll@gmail.com
}
```

**Existing Configuration**: Domain names hardcoded in Caddyfile (marcusgoll.com, cfipros.com, subdomains)

**Schema Update Required**: No

### Breaking Changes

**API Contract Changes**: None (infrastructure only)
**Database Schema Changes**: None
**Auth Flow Modifications**: None

**Client Compatibility**: Fully backward compatible
- HTTP requests automatically redirected to HTTPS (308 permanent)
- HTTPS transparent to users
- No application code changes needed

**Risk**: Very low. Caddy handles HTTPS automatically. Main risk is DNS misconfiguration (mitigated by deployment checklist).

### Build Commands

**No changes** to build process:
- Next.js build: `npm run build` (unchanged)
- Docker image: `docker build -t marcusgoll .` (unchanged)
- Deployment: `docker-compose -f docker-compose.prod.yml up -d` (now includes Caddy)

### Configuration Changes

**Caddyfile** (infrastructure/Caddyfile):
```caddyfile
# Add to each domain block:
marcusgoll.com {
  header {
    Strict-Transport-Security "max-age=15768000; includeSubDomains"
  }
  reverse_proxy next:3000
}
```

**docker-compose.prod.yml**:
```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: marcusgoll-caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data/caddy
    networks:
      - app-network
    restart: always

volumes:
  caddy-data:
    driver: local
```

### Database Migrations

**No database migrations required** (infrastructure-only feature)

### Smoke Tests

**Add to deploy-production.yml** (GitHub Actions):
```yaml
- name: Verify HTTPS
  run: |
    sleep 60  # Wait for certificate issuance
    curl -f https://marcusgoll.com || exit 1
    curl -I http://marcusgoll.com | grep "308 Permanent Redirect" || exit 1
```

**Manual Smoke Tests** (post-deployment):
- Route: `https://marcusgoll.com`
- Expected: HTTP/2 200, valid Let's Encrypt certificate
- HSTS header: `Strict-Transport-Security: max-age=15768000; includeSubDomains`
- HTTP redirect: `http://marcusgoll.com` → `https://marcusgoll.com` (308)

### Platform Coupling

**VPS**:
- Requires ports 80 and 443 open in firewall
- Requires DNS A records pointing to VPS IP

**Docker**:
- Caddy service added to docker-compose.prod.yml
- Named volume (caddy-data) for certificate persistence

**Dependencies**:
- Caddy Docker image: caddy:2-alpine (official, stable)

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- DNS A records for all domains (marcusgoll.com, cfipros.com, subdomains) point to VPS IP
- Ports 80 and 443 accessible from internet (firewall rules)
- Docker volume `caddy-data` persists across container restarts
- Let's Encrypt rate limits not exceeded (50 certs/domain/week)

**Staging Smoke Tests** (Given/When/Then):

**Not applicable** - Project uses direct-prod deployment model (no staging environment per deployment-strategy.md)

**Production Smoke Tests** (execute after deployment):

```gherkin
Scenario: HTTPS Certificate Valid
  Given user visits https://marcusgoll.com
  When TLS handshake completes
  Then certificate is valid (not expired, trusted CA)
    And issuer is "Let's Encrypt (R3)"
    And expiry date is 90 days from issuance

Scenario: HTTP to HTTPS Redirect
  Given user visits http://marcusgoll.com
  When request reaches Caddy
  Then response is 308 Permanent Redirect
    And Location header is https://marcusgoll.com
    And redirect completes within 500ms

Scenario: HSTS Header Present
  Given user makes HTTPS request to https://marcusgoll.com
  When response headers returned
  Then Strict-Transport-Security header present
    And max-age is 15768000 (6 months)
    And includeSubDomains directive present

Scenario: Multiple Domains
  Given domains marcusgoll.com, cfipros.com configured
  When certificates issued for each
  Then each domain has valid individual certificate
    And certificate CN matches domain name
    And all domains accessible via HTTPS

Scenario: Certificate Persistence
  Given Caddy container running with certificates
  When container restarted via docker-compose restart
  Then certificates loaded from volume (not re-issued)
    And site accessible within 15 seconds
    And no Let's Encrypt API calls made
```

**Rollback Plan**:
- **Deployment IDs**: Git commit SHA of Caddyfile and docker-compose.prod.yml changes
- **Rollback Commands**:
  ```bash
  # Stop Caddy
  docker-compose -f docker-compose.prod.yml stop caddy

  # Revert config files
  git checkout <previous-commit-sha> -- infrastructure/Caddyfile docker-compose.prod.yml

  # Restart services (HTTP only)
  docker-compose -f docker-compose.prod.yml up -d
  ```
- **Special Considerations**:
  - If HSTS header sent, browsers will refuse HTTP for max-age duration (6 months)
  - Test thoroughly before enabling HSTS
  - If rollback needed, must wait for HSTS max-age to expire OR users must clear browser cache
  - **Mitigation**: Start with conservative 6-month max-age, increase to 2 years only after validation

**Artifact Strategy** (build-once-promote-many):

**Not applicable** - direct-prod deployment model (no staging promotion)

**Build Process**:
- Caddyfile: No build (text configuration)
- docker-compose.prod.yml: No build (YAML configuration)
- Caddy Docker image: Pre-built (official caddy:2-alpine from Docker Hub)
- Deploy: `docker-compose -f docker-compose.prod.yml up -d` pulls image and starts services

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
1. **Initial Setup**: DNS validation → Caddy deployment → Certificate issuance verification
2. **Container Restart**: Verify certificate persistence (no re-issuance)
3. **SSL Labs Validation**: Run external scan, confirm A+ rating
4. **Troubleshooting**: Diagnose certificate failures (DNS, ports, rate limits)
5. **Rollback**: Revert Caddyfile changes, restart without SSL
6. **Renewal Test**: Simulate manual renewal, verify success
7. **Multiple Domains**: Check all domains (marcusgoll.com, cfipros.com, subdomains) have valid certificates

---

## [CONFIGURATION FILES]

### Caddyfile Changes

**File**: `infrastructure/Caddyfile`

**Current** (lines 1-4):
```caddyfile
{
  email marcusgoll@gmail.com
}
```

**No Change** - Email already configured for Let's Encrypt notifications

**Current** (lines 13-17, example for marcusgoll.com):
```caddyfile
marcusgoll.com {
  reverse_proxy ghost:2368
}
```

**Modified** (add HSTS header, update reverse_proxy target):
```caddyfile
marcusgoll.com {
  header {
    Strict-Transport-Security "max-age=15768000; includeSubDomains"
  }
  reverse_proxy next:3000
}
```

**Apply to All Domains**:
- marcusgoll.com
- cfipros.com
- ghost.marcusgoll.com
- api.marcusgoll.com
- api.cfipros.com

**Automatic Features** (no config needed):
- HTTPS automatic (Caddy detects domain blocks)
- HTTP → HTTPS redirect (Caddy default behavior)
- Certificate renewal (Caddy background task)
- TLS 1.2+ only (Caddy default)
- Strong cipher suites (Caddy default)

### docker-compose.prod.yml Changes

**File**: `docker-compose.prod.yml`

**Add Caddy Service** (after line 56):
```yaml
  caddy:
    image: caddy:2-alpine
    container_name: marcusgoll-caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data/caddy
    networks:
      - app-network
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:2019/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      - nextjs
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Add Volume Definition** (after line 60):
```yaml
volumes:
  caddy-data:
    driver: local
```

**Update Next.js Service** (optional - remove port exposure):
```yaml
  nextjs:
    # Remove or comment out:
    # ports:
    #   - "3000:3000"
    # (Port 3000 only needs internal access via Caddy)
```

### Deployment Checklist

**File**: `specs/048-ssl-tls-letsencrypt/deployment-checklist.md`

**Content** (create new file):
```markdown
# SSL/TLS Deployment Checklist

## Prerequisites

- [ ] DNS A records configured for all domains
- [ ] DNS propagation complete (wait 5-30 minutes after DNS changes)
- [ ] Ports 80 and 443 open in VPS firewall
- [ ] Docker and Docker Compose installed on VPS
- [ ] Git repository cloned to VPS

## DNS Verification

- [ ] marcusgoll.com A record points to VPS IP: `dig +short marcusgoll.com`
- [ ] cfipros.com A record points to VPS IP: `dig +short cfipros.com`
- [ ] ghost.marcusgoll.com A record points to VPS IP: `dig +short ghost.marcusgoll.com`
- [ ] api.marcusgoll.com A record points to VPS IP: `dig +short api.marcusgoll.com`
- [ ] api.cfipros.com A record points to VPS IP: `dig +short api.cfipros.com`

## Firewall Verification

- [ ] Port 80 open: `sudo ufw status | grep 80`
- [ ] Port 443 open: `sudo ufw status | grep 443`
- [ ] No other service using ports 80/443: `sudo netstat -tlnp | grep -E ':80|:443'`

## Deployment

- [ ] Pull latest changes: `git pull origin main`
- [ ] Create Caddy data volume: `docker volume create caddy-data`
- [ ] Start Caddy service: `docker-compose -f docker-compose.prod.yml up -d caddy`
- [ ] Monitor logs: `docker-compose -f docker-compose.prod.yml logs -f caddy`
- [ ] Wait for "certificate obtained successfully" message (30-120 seconds)

## Post-Deployment Validation

- [ ] HTTPS accessible: `curl -I https://marcusgoll.com` (expect HTTP/2 200)
- [ ] HTTP redirects: `curl -I http://marcusgoll.com` (expect 308 redirect)
- [ ] HSTS header present: `curl -I https://marcusgoll.com | grep -i strict-transport-security`
- [ ] Certificate valid: `echo | openssl s_client -connect marcusgoll.com:443 2>/dev/null | openssl x509 -noout -dates`
- [ ] All domains accessible (repeat for cfipros.com, subdomains)

## SSL Labs Validation (72 hours after deployment)

- [ ] Run SSL Labs test: https://www.ssllabs.com/ssltest/analyze.html?d=marcusgoll.com
- [ ] Confirm A+ rating
- [ ] Verify HSTS present
- [ ] Verify TLS 1.2+ only
- [ ] Verify strong cipher suites

## Troubleshooting

If certificate issuance fails:
1. Check Caddy logs: `docker-compose -f docker-compose.prod.yml logs caddy | grep -i error`
2. Verify DNS: `dig +short marcusgoll.com` (must return VPS IP)
3. Verify port 80 accessible: `curl -I http://marcusgoll.com/.well-known/acme-challenge/test`
4. Check Let's Encrypt status: https://letsencrypt.status.io/
5. Force retry: `docker-compose -f docker-compose.prod.yml exec caddy caddy reload --force`
```

---

## [MONITORING & ALERTS]

**Current State**: No monitoring infrastructure (Priority 2 - US5 deferred)

**MVP Monitoring** (manual):
- Visual checks: Browser address bar shows green padlock
- Occasional SSL Labs scans (quarterly)
- Manual certificate expiry checks: `echo | openssl s_client -connect marcusgoll.com:443 2>/dev/null | openssl x509 -noout -enddate`

**Priority 2 Enhancement** (US5):
- Daily cron job checks certificate expiry
- Alert if <14 days until expiry AND no recent renewal attempt
- Parse Caddy logs for renewal failures
- Email alerts via sendmail or Mailgun API

**Implementation Deferred**: MVP focuses on automatic renewal (highly reliable, >99% success rate). Monitoring adds complexity without proportional value for initial deployment.

---

## [TESTING STRATEGY]

**Manual Testing** (pre-deployment):
- Local Caddyfile syntax validation: `docker run --rm -v ./infrastructure/Caddyfile:/etc/caddy/Caddyfile caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile`
- Docker Compose file validation: `docker-compose -f docker-compose.prod.yml config`

**Integration Testing** (post-deployment):
- Execute all scenarios in quickstart.md
- Verify FR-001 through FR-007 (functional requirements)
- Verify NFR-001 through NFR-005 (non-functional requirements)

**Acceptance Testing** (user stories):
- US1: Container restart test (3 restarts in 5 minutes, no re-issuance)
- US2: HTTP redirect test (curl -I http://marcusgoll.com → 308)
- US3: HSTS header test (curl -I https://marcusgoll.com | grep strict-transport-security)
- US4: Follow deployment checklist, verify DNS before Caddy deployment
- US6: SSL Labs scan achieves A+ rating

**No Automated Tests**: Infrastructure feature, manual validation sufficient for MVP.

---

## [RISKS & MITIGATIONS]

### Risk 1: DNS Not Configured Before Deployment
**Impact**: Certificate issuance fails, site shows self-signed cert warning
**Probability**: Medium (manual DNS configuration)
**Mitigation**: Mandatory DNS validation checklist (US4), automated dig checks in deployment script
**Contingency**: Wait for DNS propagation (5-30 min), retry certificate issuance

### Risk 2: Let's Encrypt Rate Limit Hit
**Impact**: Cannot issue certificates for 7 days
**Probability**: Low (persistent volume prevents duplicate requests)
**Mitigation**: Docker volume persistence (US1), check crt.sh before deployment
**Contingency**: Use Let's Encrypt staging environment for testing, wait for rate limit reset

### Risk 3: HSTS Lock-Out
**Impact**: If HTTPS breaks, users cannot access site via HTTP for 6 months
**Probability**: Very low (Caddy automatic HTTPS highly reliable)
**Mitigation**: Conservative 6-month max-age initially (not 2 years), thorough testing before deployment
**Contingency**: Users must clear browser cache OR wait for max-age to expire

### Risk 4: Certificate Renewal Failure
**Impact**: Certificate expires, site inaccessible after 90 days
**Probability**: Very low (Let's Encrypt >99% success rate per NFR-003)
**Mitigation**: Automatic renewal 30 days before expiry, Caddy retries on failure
**Contingency**: Manual renewal via `caddy reload --force`, monitoring alerts (US5, Priority 2)

### Risk 5: Port 80/443 Conflict
**Impact**: Caddy cannot start, HTTPS unavailable
**Probability**: Low (dedicated VPS, no other web server)
**Mitigation**: Pre-flight check in deployment checklist (netstat verification)
**Contingency**: Stop conflicting service, reconfigure to use different ports

---

## [ROLLOUT PLAN]

**Phase 1: MVP (Priority 1 - US1-US4)**
1. Add Caddy service to docker-compose.prod.yml
2. Update Caddyfile with HSTS headers
3. Create deployment checklist (DNS validation)
4. Deploy to production (marcusgoll.com)
5. Verify HTTPS working, HTTP redirects, HSTS present
6. Test container restart (certificate persistence)

**Phase 2: Validation (US6)**
7. Run SSL Labs scan (target: A+ rating)
8. Iterate on configuration if needed (cipher tweaks, header adjustments)
9. Document any deviations from plan

**Phase 3: Enhancement (Priority 2 - US5, US7)**
10. Implement certificate expiry monitoring (cron job + alerts)
11. Document wildcard certificate process (DNS-01 challenge) for future use
12. Consider HSTS preload (increase max-age to 2 years, add preload directive)

**Timeline**:
- Phase 1: 4-6 hours (MVP implementation + deployment)
- Phase 2: 2-3 hours (SSL Labs validation + config refinement)
- Phase 3: Deferred (enhancement phase, 4-6 hours)

---

## [SUCCESS CRITERIA]

**Definition of Done** (MVP):
- ✅ All Priority 1 user stories (US1-US4) acceptance criteria met
- ✅ Functional requirements FR-001 through FR-007 validated
- ✅ Non-functional requirements NFR-001 through NFR-005 met (except NFR-003 renewal rate, measured over time)
- ✅ Deployment checklist created and followed successfully
- ✅ HTTPS accessible for all domains (marcusgoll.com, cfipros.com, subdomains)
- ✅ HTTP automatically redirects to HTTPS (308)
- ✅ HSTS header present with 6-month max-age
- ✅ Certificate persistence verified (container restart test)
- ✅ SSL Labs A+ rating achieved (US6, may require iteration)
- ✅ Documentation updated (OPERATIONS_RUNBOOK.md with SSL troubleshooting)

**Success Metrics** (from spec.md):
- SC-001: SSL Labs A+ rating within 1 week ✅
- SC-002: Zero expiry incidents in first 6 months ⏳ (measured over time)
- SC-003: 100% HTTP requests redirect to HTTPS ✅
- SC-004: Renewal succeeds for 3+ cycles ⏳ (180 days minimum)
- SC-005: Container restarts don't trigger new cert requests ✅

---

## [NEXT STEPS]

After planning approval:
1. Review plan with stakeholder (Marcus)
2. Run `/tasks` to generate implementation task list
3. Execute tasks (estimate: 6-10 tasks, 4-6 hours)
4. Run `/validate` to check for breaking changes
5. Run `/implement` with TDD approach (test-driven deployment)
6. Deploy to production (direct-prod model, no staging)
7. Execute quickstart.md validation scenarios
8. Update OPERATIONS_RUNBOOK.md with SSL procedures
9. Run `/ship` for final deployment and release notes
