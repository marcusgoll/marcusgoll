# Tasks: DNS Domain Mapping

## [CODEBASE REUSE ANALYSIS]
Scanned: infrastructure/, docs/

[EXISTING - REUSE]
- ✅ Caddy reverse proxy (infrastructure/Caddyfile) - SSL email + domain routing configured
- ✅ Infrastructure docs pattern (docs/INFRASTRUCTURE_SETUP.md) - documentation style guide
- ✅ VPS infrastructure (178.156.129.179) - static IP, ports 80/443 open

[NEW - CREATE]
- 🆕 DNS A records at registrar (manual configuration, not in git)
- 🆕 DNS documentation (infrastructure/dns/README.md)

## [DEPENDENCY GRAPH]
Task completion order:
1. Phase 1: Setup (create documentation structure)
2. Phase 2: DNS Configuration (manual at registrar - BLOCKING)
3. Phase 3: Verification (after DNS propagates)
4. Phase 4: Documentation Finalization (record actual results)

## [PARALLEL EXECUTION OPPORTUNITIES]
Limited parallelization due to infrastructure configuration nature:
- Phase 1: T001, T002 can run in parallel (documentation preparation)
- Phase 3: T008, T009, T010 can run in parallel (different verification methods)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Complete DNS configuration with verified propagation
**No Incremental Delivery**: Single deployment (configure both A records together)
**Testing approach**: Manual verification only (no automated tests)
**Wait Time**: DNS propagation 1-48 hours (typically <1 hour)

---

## Phase 1: Setup

**Goal**: Prepare documentation structure and verification checklist

- [ ] T001 Create infrastructure/dns directory
  - Directory: infrastructure/dns/
  - Pattern: infrastructure/ existing structure
  - From: plan.md [STRUCTURE]

- [ ] T002 [P] Create infrastructure/dns/README.md template
  - File: infrastructure/dns/README.md
  - Sections: Provider info, A record config, verification commands, troubleshooting, propagation timeline
  - Pattern: docs/INFRASTRUCTURE_SETUP.md (security notices, code blocks, sections)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] section 2

---

## Phase 2: DNS Configuration (BLOCKING)

**Goal**: Configure DNS A records at domain registrar

**IMPORTANT**: This phase is MANUAL work at domain registrar (not code changes)

- [ ] T003 Verify domain registrar account access
  - Action: Log into domain registrar
  - Verify: Can access DNS management panel
  - Document: Registrar name in infrastructure/dns/README.md
  - From: plan.md [DEPENDENCIES] prerequisites

- [ ] T004 Create apex domain A record
  - Record Type: A
  - Name: @ (or blank, depending on registrar UI)
  - Value: 178.156.129.179
  - TTL: 3600
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] section 1

- [ ] T005 Create www subdomain A record
  - Record Type: A
  - Name: www
  - Value: 178.156.129.179
  - TTL: 3600
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] section 1

- [ ] T006 Document DNS configuration steps
  - File: infrastructure/dns/README.md
  - Content: Step-by-step with registrar-specific details
  - Include: Screenshots or UI navigation details (if possible)
  - From: spec.md FR-003

---

## Phase 3: Verification

**Goal**: Verify DNS propagation globally using multiple methods

**DEPENDENCY**: Wait for DNS propagation (15min-48hr, typically <1hr)

- [ ] T007 Verify DNS resolution via ping
  - Command: `ping marcusgoll.com` and `ping www.marcusgoll.com`
  - Expected: Both return 178.156.129.179
  - From: spec.md Success Criteria #1-2

- [ ] T008 [P] Verify DNS resolution via dig
  - Commands:
    - `dig marcusgoll.com +short` → 178.156.129.179
    - `dig www.marcusgoll.com +short` → 178.156.129.179
    - `dig @8.8.8.8 marcusgoll.com +short` → 178.156.129.179
    - `dig @1.1.1.1 marcusgoll.com +short` → 178.156.129.179
  - From: spec.md FR-002, US-002

- [ ] T009 [P] Verify DNS resolution via nslookup
  - Commands:
    - `nslookup marcusgoll.com`
    - `nslookup www.marcusgoll.com`
    - `nslookup marcusgoll.com 8.8.8.8`
    - `nslookup marcusgoll.com 1.1.1.1`
  - Expected: All return 178.156.129.179
  - From: spec.md FR-002

- [ ] T010 [P] Verify global DNS propagation
  - Tool: https://dnschecker.org
  - Check: marcusgoll.com and www.marcusgoll.com
  - Expected: All geographic regions show 178.156.129.179
  - From: spec.md FR-002, US-002 global propagation

- [ ] T011 Verify HTTP connectivity via curl
  - Command: `curl -I http://marcusgoll.com`
  - Expected: HTTP response from Caddy (or backend service)
  - Note: May redirect or show Caddy default until Next.js deployed
  - From: quickstart.md Scenario 2

---

## Phase 4: SSL Certificate Verification

**Goal**: Verify Let's Encrypt SSL certificate issuance via Caddy

**DEPENDENCY**: DNS must point to VPS (Phase 3 complete)

- [ ] T012 Monitor Caddy logs for ACME challenge
  - Command: `docker logs proxy-caddy-1 --follow | grep -i acme`
  - Expected: ACME HTTP-01 challenge successful
  - Expected: Certificate obtained from Let's Encrypt
  - From: spec.md US-003, plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T013 Verify HTTPS access to apex domain
  - Command: `curl -I https://marcusgoll.com`
  - Expected: HTTP 200 or 308, valid SSL certificate (no warnings)
  - Browser: Navigate to https://marcusgoll.com (no certificate warnings)
  - From: spec.md US-001 acceptance scenario 1

- [ ] T014 Verify www to apex redirect with SSL
  - Command: `curl -I https://www.marcusgoll.com`
  - Expected: HTTP 308 redirect to https://marcusgoll.com
  - Browser: https://www.marcusgoll.com → https://marcusgoll.com
  - From: spec.md US-001 acceptance scenario 2

- [ ] T015 Verify SSL certificate details
  - Command: `openssl s_client -connect marcusgoll.com:443 -servername marcusgoll.com < /dev/null 2>/dev/null | openssl x509 -noout -text`
  - Expected: Issued by Let's Encrypt, valid for marcusgoll.com
  - Browser: Check certificate details (should show Let's Encrypt Authority)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

---

## Phase 5: Documentation Finalization

**Goal**: Document actual results and create troubleshooting guide

- [ ] T016 Document verification commands with actual output
  - File: infrastructure/dns/README.md
  - Content: Add actual output from T007-T015 as examples
  - Include: Expected vs actual propagation time observed
  - From: spec.md FR-003

- [ ] T017 Create troubleshooting guide
  - File: infrastructure/dns/README.md
  - Sections:
    - DNS not propagating (check TTL, wait longer)
    - ACME challenge failing (check ports 80/443)
    - Certificate warnings (check DNS resolution)
    - www redirect not working (check Caddyfile)
  - Pattern: docs/INFRASTRUCTURE_SETUP.md troubleshooting section
  - From: spec.md FR-003, plan.md [RISK ASSESSMENT]

- [ ] T018 Document rollback procedure
  - File: infrastructure/dns/README.md
  - Steps:
    1. Log into registrar
    2. Delete A records (@ and www)
    3. Wait for TTL (3600s = 1hr)
    4. Verify: `dig marcusgoll.com` returns NXDOMAIN
  - Fallback: IP access (http://178.156.129.179:3000) always works
  - From: spec.md Deployment Considerations, plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T019 Update INFRASTRUCTURE_SETUP.md with DNS status
  - File: docs/INFRASTRUCTURE_SETUP.md
  - Location: Line 290 (or appropriate section)
  - Content: Add DNS configuration status (configured, propagated, SSL enabled)
  - Reference: infrastructure/dns/README.md for details
  - From: plan.md [NEXT STEPS]

- [ ] T020 Add DNS configuration to feature NOTES.md
  - File: specs/005-dns-domain-mapping/NOTES.md
  - Content:
    - DNS records configured (date/time)
    - Propagation time observed (actual vs expected)
    - SSL certificate obtained (date/time)
    - Any issues encountered and resolution
  - From: plan.md [NEXT STEPS]

---

## [NO AUTOMATED TESTS]

**Rationale**: Infrastructure configuration feature (no code)

**Verification**: Manual verification only (documented in tasks T007-T015)

**No Test Files Created**:
- No unit tests
- No integration tests
- No E2E tests

**Quality Assurance**: Manual checklist in quickstart.md + verification commands

---

## [TASK SUMMARY]

**Total Tasks**: 20
- Phase 1 (Setup): 2 tasks
- Phase 2 (DNS Configuration): 4 tasks
- Phase 3 (Verification): 5 tasks
- Phase 4 (SSL Verification): 4 tasks
- Phase 5 (Documentation): 5 tasks

**Manual Work**: 100% (infrastructure configuration, no code)

**Wait Time**: DNS propagation (1-48 hours, typically <1 hour)

**Active Time**: ~1-2 hours total

**Parallel Opportunities**: 5 tasks (T001+T002, T008+T009+T010)

**Blocking Tasks**: T003-T006 must complete before T007-T015 can start
