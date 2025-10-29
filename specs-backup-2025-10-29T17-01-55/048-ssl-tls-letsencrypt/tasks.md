# Tasks: SSL/TLS with Let's Encrypt

## [CODEBASE REUSE ANALYSIS]
Scanned: /d/coding/tech-stack-foundation-core

[EXISTING - REUSE]
- ✅ Caddyfile (infrastructure/Caddyfile) - Domain configurations, www redirects
- ✅ docker-compose.prod.yml - Network definition, health check patterns, logging config
- ✅ Dockerfile - Next.js build (no changes needed)

[NEW - CREATE]
- 🆕 Caddy Docker service in docker-compose.prod.yml
- 🆕 Docker volume (caddy-data) for certificate persistence
- 🆕 HSTS header configuration in Caddyfile
- 🆕 Deployment checklist with DNS validation steps

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (infrastructure validation)
2. Phase 2: US1 [P1] - Certificate persistence (blocks all other stories)
3. Phase 3: US2, US3 [P1] - HTTP redirect & HSTS (parallel after US1)
4. Phase 4: US4 [P1] - Documentation (independent)
5. Phase 5: US6 [P2] - SSL Labs validation (depends on US1, US3)

## [PARALLEL EXECUTION OPPORTUNITIES]
- US2 & US3: T008, T009 (HSTS and redirect both configured in same Caddyfile, but different sections)
- Phase 4: T010 (documentation independent of infrastructure tasks)
- Verification: T011, T012, T013 (post-deployment validation can run in parallel)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phase 1-4 (US1-US4) - Basic HTTPS with persistence, redirect, HSTS, and documentation
**Incremental delivery**: US1 → container restart validation → US2/US3 → production validation → US6
**Testing approach**: Manual integration testing post-deployment (no automated tests for infrastructure)

---

## Phase 1: Setup

- [ ] T001 Validate Docker Compose file syntax
  - File: docker-compose.prod.yml
  - Command: docker-compose -f docker-compose.prod.yml config
  - Expected: YAML parses without errors
  - From: plan.md [TESTING STRATEGY]

- [ ] T002 [P] Validate Caddyfile syntax
  - File: infrastructure/Caddyfile
  - Command: docker run --rm -v ./infrastructure/Caddyfile:/etc/caddy/Caddyfile caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile
  - Expected: Validation passes with no errors
  - From: plan.md [TESTING STRATEGY]

- [ ] T003 [P] Create deployment checklist with DNS validation steps
  - File: specs/048-ssl-tls-letsencrypt/deployment-checklist.md
  - Content: DNS verification commands (dig), A record checks, firewall verification, post-deployment validation
  - Pattern: plan.md [CONFIGURATION FILES] deployment checklist template
  - From: spec.md US4, plan.md [CONFIGURATION FILES]

---

## Phase 2: User Story 1 [P1] - Certificate Persistence

**Story Goal**: Certificates survive container restarts without hitting Let's Encrypt rate limits

**Independent Test Criteria**:
- [ ] Container restart does not trigger new certificate request
- [ ] Certificates stored with 600 permissions
- [ ] Volume persists across 3 restarts in 5 minutes

### Implementation

- [ ] T004 [US1] Add Caddy Docker service to docker-compose.prod.yml
  - File: docker-compose.prod.yml (after nextjs service, line ~57)
  - Service name: caddy
  - Image: caddy:2-alpine
  - Ports: 80:80, 443:443
  - Volumes: ./infrastructure/Caddyfile:/etc/caddy/Caddyfile:ro, caddy-data:/data/caddy
  - Networks: app-network
  - Restart: always
  - Health check: wget http://localhost:2019/health
  - REUSE: Health check pattern from nextjs service (lines 40-45)
  - REUSE: Logging config from nextjs service (lines 53-56)
  - REUSE: Network app-network (line 59)
  - Pattern: plan.md [CONFIGURATION FILES] Caddy service definition
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T005 [US1] Add caddy-data volume definition to docker-compose.prod.yml
  - File: docker-compose.prod.yml (after networks section, line ~61)
  - Volume name: caddy-data
  - Driver: local
  - Pattern: plan.md [CONFIGURATION FILES] volume definition
  - From: spec.md FR-002, plan.md [DATA MODEL]

- [ ] T006 [US1] Update Next.js service to remove public port exposure
  - File: docker-compose.prod.yml (nextjs service, lines 7-8)
  - Action: Comment out or remove ports section (3000:3000)
  - Reason: Port 3000 only needs internal access via Caddy reverse proxy
  - Pattern: plan.md [CONFIGURATION FILES] Next.js service update
  - From: plan.md [CONFIGURATION FILES]

---

## Phase 3: User Stories 2 & 3 [P1] - HTTP Redirect & HSTS

**Story Goal**: All HTTP traffic upgraded to HTTPS with HSTS security headers

**Independent Test Criteria**:
- [ ] HTTP requests redirect to HTTPS with 308 status
- [ ] HSTS header present with 6-month max-age
- [ ] Redirect preserves URL path and query parameters

### Implementation

- [ ] T007 [US2] Verify HTTP to HTTPS redirect in Caddyfile
  - File: infrastructure/Caddyfile
  - Verification: Caddy provides automatic HTTP→HTTPS redirect by default
  - Action: Document that no explicit redirect configuration needed
  - Expected: All domain blocks (marcusgoll.com, cfipros.com, subdomains) automatically redirect
  - From: spec.md US2, plan.md [CONFIGURATION FILES]

- [ ] T008 [US3] Add HSTS header to marcusgoll.com domain block
  - File: infrastructure/Caddyfile (marcusgoll.com block, line ~16)
  - Add header directive: Strict-Transport-Security "max-age=15768000; includeSubDomains"
  - Insert after domain line, before reverse_proxy directive
  - Pattern: plan.md [CONFIGURATION FILES] Caddyfile HSTS example
  - From: spec.md FR-005, plan.md [SECURITY]

- [ ] T009 [P] [US3] Add HSTS header to all remaining domain blocks
  - File: infrastructure/Caddyfile
  - Domains: cfipros.com (line ~33), ghost.marcusgoll.com (line ~23), api.marcusgoll.com (line ~28), api.cfipros.com (line ~38)
  - Add same header directive to each domain block
  - Pattern: T008 implementation
  - From: spec.md FR-005, plan.md [SECURITY]

---

## Phase 4: User Story 4 [P1] - Documentation

**Story Goal**: DNS validation documented to prevent certificate issuance failures

**Independent Test Criteria**:
- [ ] Checklist includes DNS verification commands
- [ ] Expected A record values documented
- [ ] Validation step passes before Caddy deployment

### Implementation

- [ ] T010 [P] [US4] Document DNS validation procedure in deployment checklist
  - File: specs/048-ssl-tls-letsencrypt/deployment-checklist.md (created in T003)
  - Content: dig commands for all domains, A record verification, propagation time guidance
  - Domains: marcusgoll.com, cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com, api.cfipros.com
  - Pattern: plan.md [CONFIGURATION FILES] deployment checklist DNS section
  - From: spec.md US4, plan.md [RISKS & MITIGATIONS] Risk 1

---

## Phase 5: Polish & Validation

### Post-Deployment Verification

- [ ] T011 [P] Verify HTTPS certificate validity for all domains
  - Command: echo | openssl s_client -connect marcusgoll.com:443 2>/dev/null | openssl x509 -noout -dates
  - Expected: Valid Let's Encrypt certificate, expiry 90 days from issuance
  - Repeat for: cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com, api.cfipros.com
  - From: spec.md FR-001, plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T012 [P] Verify HTTP to HTTPS redirect for all domains
  - Command: curl -I http://marcusgoll.com
  - Expected: 308 Permanent Redirect with Location: https://marcusgoll.com
  - Repeat for: cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com, api.cfipros.com
  - From: spec.md FR-003, plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T013 [P] Verify HSTS header present for all domains
  - Command: curl -I https://marcusgoll.com | grep -i strict-transport-security
  - Expected: Strict-Transport-Security: max-age=15768000; includeSubDomains
  - Repeat for: cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com, api.cfipros.com
  - From: spec.md FR-005, plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T014 Test certificate persistence across container restarts
  - Command: docker-compose -f docker-compose.prod.yml restart caddy (repeat 3 times in 5 minutes)
  - Expected: Site remains accessible, same certificate serial number, no new Let's Encrypt requests
  - Verify: Check Caddy logs for "certificate obtained" message (should NOT appear on restart)
  - From: spec.md US1, plan.md [DEPLOYMENT ACCEPTANCE]

### User Story 6 [P2] - SSL Labs A+ Rating

**Story Goal**: Achieve industry-standard security rating

**Independent Test Criteria**:
- [ ] SSL Labs scan shows A+ rating
- [ ] All major browsers show green padlock
- [ ] No mixed content warnings

### Implementation

- [ ] T015 [US6] Run SSL Labs scan for marcusgoll.com
  - URL: https://www.ssllabs.com/ssltest/analyze.html?d=marcusgoll.com
  - Expected: A+ rating with TLS 1.2+, strong ciphers, HSTS present
  - Action: If rating < A+, review recommendations and iterate on Caddyfile config
  - Depends on: T004, T005, T008, T009 (Caddy service + HSTS deployed)
  - From: spec.md US6, plan.md [SUCCESS CRITERIA]

- [ ] T016 [P] [US6] Run SSL Labs scan for cfipros.com
  - URL: https://www.ssllabs.com/ssltest/analyze.html?d=cfipros.com
  - Expected: A+ rating
  - Depends on: T004, T005, T009 (Caddy service + HSTS deployed)
  - From: spec.md US6

### Documentation Updates

- [ ] T017 [P] Update OPERATIONS_RUNBOOK.md with SSL troubleshooting section
  - File: docs/OPERATIONS_RUNBOOK.md (if exists) or create new file
  - Content: Certificate issuance failures (DNS, ports, rate limits), renewal failures, HSTS rollback considerations
  - Pattern: plan.md [RISKS & MITIGATIONS] troubleshooting guidance
  - From: plan.md [SUCCESS CRITERIA]

- [ ] T018 [P] Create infrastructure README documenting Caddy SSL setup
  - File: infrastructure/README.md
  - Content: Caddy automatic HTTPS, Let's Encrypt integration, certificate storage location, renewal schedule, troubleshooting
  - Pattern: plan.md [STRUCTURE] infrastructure README
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

---

## [IMPLEMENTATION NOTES]

**REUSE Opportunities**:
- Existing Caddyfile domain configurations (marcusgoll.com, cfipros.com, subdomains)
- docker-compose.prod.yml health check, logging, and network patterns
- DNS already configured (assumption A-001)

**Infrastructure-Only Feature**:
- No application code changes
- No database migrations
- No API contract changes
- No UI components

**Deployment Model**: Direct-prod (no staging environment per deployment-strategy.md)

**Automatic Features** (no configuration needed):
- Caddy automatically detects domain blocks and enables HTTPS
- Caddy automatically redirects HTTP to HTTPS (no explicit config)
- Caddy automatically renews certificates 30 days before expiry
- Caddy uses TLS 1.2+ with strong ciphers by default

**Manual Features** (require configuration):
- HSTS header (Tasks T008, T009)
- Docker volume mount for persistence (Tasks T004, T005)
- DNS validation before deployment (Task T003, T010)

---

## [ROLLBACK PLAN]

**Standard Rollback** (if SSL breaks):
1. Stop Caddy service: `docker-compose -f docker-compose.prod.yml stop caddy`
2. Revert config files: `git checkout <previous-commit-sha> -- infrastructure/Caddyfile docker-compose.prod.yml`
3. Restart Next.js with exposed port: Uncomment `ports: - "3000:3000"` in nextjs service
4. Restart services: `docker-compose -f docker-compose.prod.yml up -d`

**HSTS Consideration**:
- Once HSTS header sent with 6-month max-age, browsers enforce HTTPS for 6 months
- If HTTPS breaks, users cannot access site via HTTP until max-age expires OR browser cache cleared
- Mitigation: Test thoroughly before deploying HSTS (Tasks T015, T016)

**Certificate Deletion Risk**:
- Deleting caddy-data volume forces new certificate request
- Let's Encrypt rate limit: 50 certificates per domain per week
- Mitigation: Backup volume before destructive changes, never delete volume in production

---

## [TASK SUMMARY]

**Total Tasks**: 18
**User Story Breakdown**:
- US1 (Certificate Persistence): 3 tasks (T004, T005, T006)
- US2 (HTTP Redirect): 1 task (T007) - verification only
- US3 (HSTS Headers): 2 tasks (T008, T009)
- US4 (Documentation): 1 task (T010)
- US6 (SSL Labs A+): 2 tasks (T015, T016)

**Phase Breakdown**:
- Phase 1 (Setup): 3 tasks (T001, T002, T003)
- Phase 2 (Certificate Persistence): 3 tasks (T004, T005, T006)
- Phase 3 (HTTP Redirect & HSTS): 3 tasks (T007, T008, T009)
- Phase 4 (Documentation): 1 task (T010)
- Phase 5 (Validation & Polish): 8 tasks (T011-T018)

**Parallel Opportunities**: 9 tasks marked [P]

**Estimated Effort**: 6-8 hours total
- Setup: 1 hour
- Configuration: 2-3 hours
- Deployment: 1 hour
- Validation: 2-3 hours
- Documentation: 1 hour
