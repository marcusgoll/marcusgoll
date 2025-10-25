# Feature: Configure DNS mapping to marcusgoll.com domain

## Overview
Configure DNS A records to point marcusgoll.com and www.marcusgoll.com to VPS IP address (178.156.129.179). This enables branded domain access and prepares for HTTPS via Caddy reverse proxy (which already has configuration ready).

## Research Findings

### Finding 1: Caddy configuration already exists
Source: infrastructure/Caddyfile
- Caddy is already configured for marcusgoll.com
- Currently points to ghost:2368 (temporary)
- Has TODO comment noting it will switch to next:3000 after deployment
- SSL certificate email configured: marcusgoll@gmail.com
- www redirect to apex domain already configured

Decision: DNS configuration is the only missing piece before Caddy can handle HTTPS

### Finding 2: Project is Next.js application
Source: package.json
- Next.js 15.5.6
- Running on port 3000 (based on dev script and Caddyfile comment)
- Currently accessible only via IP:port (http://178.156.129.179:3000)

### Finding 3: Infrastructure context from GitHub Issue #40
Source: gh issue view 40
- ICE score: 0.04 (Impact: 1, Effort: 5, Confidence: 0.2)
- Priority: Low (on hold until new site is ready for production)
- Area: Infrastructure
- VPS IP: 178.156.129.179
- Feature currently on hold until site is production-ready

## Feature Classification
- UI screens: false (infrastructure/DNS configuration only)
- Improvement: false (new capability, not improving existing)
- Measurable: false (binary outcome: DNS resolves or doesn't)
- Deployment impact: true (requires DNS provider access, affects production access)

## Checkpoints
- Phase 0 (Spec): 2025-10-25

## Last Updated
2025-10-25T02:45:00Z

## Phase 2: Tasks (2025-10-24)

**Summary**:
- Total tasks: 20
- Infrastructure tasks: 20 (100% - DNS configuration only)
- Parallel opportunities: 4
- Manual work: 100% (no automated code)
- Task file: specs/005-dns-domain-mapping/tasks.md

**Task Breakdown**:
- Phase 1 (Setup): 2 tasks - documentation structure
- Phase 2 (DNS Configuration): 4 tasks - manual registrar work (BLOCKING)
- Phase 3 (Verification): 5 tasks - DNS propagation checks
- Phase 4 (SSL Verification): 4 tasks - Let's Encrypt certificate validation
- Phase 5 (Documentation): 5 tasks - finalize docs with actual results

**Checkpoint**:
- ✅ Tasks generated: 20
- ✅ Infrastructure task organization: Complete
- ✅ Dependency graph: Created (DNS config blocks verification)
- ✅ Verification strategy: Multi-method (dig, nslookup, dnschecker.org)
- 📋 Ready for: /analyze

**Key Decisions**:
- No automated tests (infrastructure configuration, manual verification only)
- Wait time for DNS propagation: 1-48 hours (typically <1 hour)
- Active work time: ~1-2 hours total
- Feature on hold until Next.js site production-ready (GitHub Issue #40)

## Phase 4: Implementation (2025-10-24)

**Summary**:
- Automated tasks: 2 (documentation structure only)
- Manual tasks: 18 (DNS configuration, verification, finalization)
- Files created: 2 (infrastructure/dns/ directory, infrastructure/dns/README.md)
- Status: Documentation prepared, awaiting manual DNS configuration

**Implementation Results**:

### Automated Completion (Batch 1)

✅ **T001: Create infrastructure/dns directory**
- Status: Completed
- Path: infrastructure/dns/
- Result: Directory created successfully

✅ **T002: Create infrastructure/dns/README.md template**
- Status: Completed
- Path: infrastructure/dns/README.md
- Size: 14.5 KB (comprehensive DNS configuration guide)
- Sections included:
  - Overview and status
  - Prerequisites verification
  - DNS provider information (template)
  - A record configuration steps
  - DNS propagation verification (multiple methods)
  - HTTPS certificate verification
  - Comprehensive troubleshooting guide
  - Rollback procedure
  - Related infrastructure references
  - Maintenance guidelines

### Manual Tasks (Blocked - Awaiting Next.js Production Readiness)

**Phase 2: DNS Configuration** (MANUAL - 4 tasks)
- ⏸️ T003: Verify domain registrar account access
- ⏸️ T004: Create apex domain A record (@ → 178.156.129.179)
- ⏸️ T005: Create www subdomain A record (www → 178.156.129.179)
- ⏸️ T006: Document DNS configuration steps (template created, actual steps pending)

**Phase 3: Verification** (MANUAL - 5 tasks, blocked by Phase 2)
- ⏸️ T007: Verify DNS resolution via ping
- ⏸️ T008: Verify DNS resolution via dig
- ⏸️ T009: Verify DNS resolution via nslookup
- ⏸️ T010: Verify global DNS propagation (dnschecker.org)
- ⏸️ T011: Verify HTTP connectivity via curl

**Phase 4: SSL Certificate Verification** (MANUAL - 4 tasks, blocked by Phase 3)
- ⏸️ T012: Monitor Caddy logs for ACME challenge
- ⏸️ T013: Verify HTTPS access to apex domain
- ⏸️ T014: Verify www to apex redirect with SSL
- ⏸️ T015: Verify SSL certificate details

**Phase 5: Documentation Finalization** (MANUAL - 5 tasks, blocked by Phase 4)
- ⏸️ T016: Document verification commands with actual output
- ⏸️ T017: Create troubleshooting guide (template created, actual issues pending)
- ⏸️ T018: Document rollback procedure (template created)
- ⏸️ T019: Update INFRASTRUCTURE_SETUP.md with DNS status
- ⏸️ T020: Add DNS configuration to feature NOTES.md (this file)

**Checkpoint**:
- ✅ Documentation structure created (2/20 tasks automated)
- ✅ Comprehensive README.md template ready for manual execution
- ⏸️ Manual DNS configuration awaiting Next.js production readiness (per GitHub Issue #40)
- 📋 Ready for: Manual DNS configuration when site production-ready

**Key Implementation Decisions**:
1. Created comprehensive DNS documentation template (14.5 KB) with:
   - Step-by-step configuration instructions
   - Multiple verification methods (dig, nslookup, ping, dnschecker.org)
   - Extensive troubleshooting guide (6 common scenarios)
   - Complete rollback procedure
   - Security notices (no credentials in git)
2. Followed INFRASTRUCTURE_SETUP.md documentation pattern for consistency
3. Prepared verification commands with expected outputs for all scenarios
4. Documented all manual steps clearly for future execution
5. Feature remains on hold per GitHub Issue #40 until Next.js site ready

**Manual Execution Guide**:

When Next.js site is production-ready and feature is approved to proceed:

1. **Phase 2: DNS Configuration** (~15 minutes)
   - Log into domain registrar
   - Create apex A record (@ → 178.156.129.179, TTL 3600)
   - Create www A record (www → 178.156.129.179, TTL 3600)
   - Document registrar name and configuration steps in README.md

2. **Phase 3: Verification** (1-48 hours wait, 15 min active)
   - Wait for DNS propagation (typically <1 hour)
   - Run verification commands from README.md:
     - dig marcusgoll.com +short
     - nslookup marcusgoll.com
     - ping marcusgoll.com
     - Check dnschecker.org
   - Document actual propagation timeline

3. **Phase 4: SSL Certificate Verification** (5-10 minutes after DNS)
   - Monitor Caddy logs: docker logs proxy-caddy-1 --follow | grep -i acme
   - Test HTTPS: curl -I https://marcusgoll.com
   - Test www redirect: curl -I https://www.marcusgoll.com
   - Verify certificate details with openssl s_client

4. **Phase 5: Documentation Finalization** (~30 minutes)
   - Update README.md with actual propagation times
   - Add real verification command outputs
   - Document any issues encountered and resolutions
   - Update INFRASTRUCTURE_SETUP.md with DNS status
   - Mark all tasks complete in NOTES.md

**Estimated Total Time When Executed**:
- Active work: 1 hour
- Wait time: 1-48 hours (DNS propagation)
- Overall: 2-49 hours from start to finish

**Next Steps**:
1. Wait for Next.js site production readiness (GitHub Issue #40 dependency)
2. Get approval to proceed with DNS configuration
3. Execute manual Phase 2-5 tasks following README.md guide
4. Document actual results and update feature NOTES.md
5. Run /ship to deploy and finalize feature
