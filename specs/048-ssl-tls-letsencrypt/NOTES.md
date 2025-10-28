# Feature: SSL/TLS with Let's Encrypt

## Overview
Automatic HTTPS certificate management using Caddy server with Let's Encrypt integration for production VPS deployment.

## Research Findings

### Existing Infrastructure Analysis
**Source**: Caddyfile, docker-compose.prod.yml, docs/project/tech-stack.md

1. **Caddy Already in Use**:
   - File: `infrastructure/Caddyfile`
   - Configured with email: marcusgoll@gmail.com
   - Currently managing multiple domains: marcusgoll.com, cfipros.com, ghost.marcusgoll.com, api.marcusgoll.com
   - **Finding**: Basic Caddy setup exists but SSL/TLS configuration needs verification and enhancement

2. **Current SSL/TLS State**:
   - Caddy's automatic HTTPS is inherently enabled (Caddy default behavior)
   - Let's Encrypt integration automatic when domain is specified
   - **Decision**: This feature focuses on ensuring proper SSL/TLS configuration, certificate persistence, monitoring, and best practices

3. **Docker Infrastructure**:
   - File: `docker-compose.prod.yml`
   - Next.js app runs in Docker container
   - Caddy likely runs separately (not in current docker-compose.prod.yml)
   - **Finding**: Need to ensure Caddy has persistent volume for certificates

4. **Tech Stack Context** (from docs/project/tech-stack.md):
   - Caddy chosen specifically for "automatic SSL/TLS via Let's Encrypt"
   - Listed as key advantage over Nginx (no manual SSL management)
   - Rationale: "zero manual configuration"
   - **Decision**: Feature validates tech stack decision is properly implemented

5. **Related Feature** (spec 047 - Dokploy):
   - Dokploy deployment platform being implemented
   - Includes SSL management features
   - **Impact**: This feature may integrate with or complement Dokploy's SSL handling
   - **Dependency**: Feature marked as blocked by docker-compose-orchestration

### Key Technical Decisions

1. **Certificate Storage**:
   - Caddy stores certificates in `$HOME/.local/share/caddy` by default
   - **Decision**: Mount persistent Docker volume for certificate data
   - **Rationale**: Prevents rate-limiting from Let's Encrypt on container restarts

2. **Domain DNS Requirement**:
   - Let's Encrypt requires domain DNS to point to VPS IP before cert issuance
   - **Decision**: Add DNS validation step to deployment checklist
   - **Rationale**: Prevents failed cert requests and Let's Encrypt rate limits

3. **Wildcard Certificates**:
   - Optional for subdomains (*.marcusgoll.com)
   - Requires DNS-01 challenge (vs HTTP-01)
   - **Decision**: Start with HTTP-01 for individual domains, add wildcard later if needed
   - **Rationale**: Simpler setup, current Caddyfile uses specific subdomains

4. **HSTS Configuration**:
   - HTTP Strict Transport Security header forces HTTPS
   - **Decision**: Enable HSTS with reasonable max-age (6 months initially, 2 years after validation)
   - **Rationale**: Prevents downgrade attacks, improves security posture

5. **Monitoring Strategy**:
   - Caddy logs cert renewal events
   - **Decision**: Implement log monitoring for renewal failures
   - **Rationale**: Proactive detection of cert expiry issues

## System Components Analysis

**Infrastructure Components** (not UI):
- Caddyfile configuration (existing, needs enhancement)
- Docker volume for certificate persistence (new)
- Docker network configuration (existing, may need adjustment)
- SSL/TLS monitoring script (new)
- Deployment checklist updates (new documentation)

**Rationale**: Backend/infrastructure feature - no UI components needed

## Checkpoints
- Phase 0 (Spec): 2025-10-28

## Last Updated
2025-10-28T12:10:00Z

## Phase 2: Tasks (2025-10-28 12:30)

**Summary**:
- Total tasks: 18
- User story tasks: 9 (US1: 3, US2: 1, US3: 2, US4: 1, US6: 2)
- Parallel opportunities: 11
- Setup tasks: 3
- Validation tasks: 8
- Task file: specs/048-ssl-tls-letsencrypt/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 18
- ✅ User story organization: Complete (by priority P1, P2)
- ✅ Dependency graph: Created (US1 blocks US2/US3, US6 depends on US1/US3)
- ✅ MVP strategy: Defined (US1-US4 only, defer US6 SSL Labs validation)
- ✅ REUSE analysis: 3 existing components identified (Caddyfile, docker-compose.prod.yml, Dockerfile)
- 📋 Ready for: /analyze

**Task Breakdown**:
- Phase 1 (Setup): 3 tasks - Docker Compose validation, Caddyfile validation, deployment checklist creation
- Phase 2 (Certificate Persistence - US1): 3 tasks - Add Caddy service, add volume, update Next.js port
- Phase 3 (HTTP Redirect & HSTS - US2/US3): 3 tasks - Verify redirect, add HSTS to all domains
- Phase 4 (Documentation - US4): 1 task - Document DNS validation procedure
- Phase 5 (Validation & Polish): 8 tasks - Post-deployment verification, SSL Labs scan, documentation updates

**Implementation Notes**:
- Infrastructure-only feature (no application code changes)
- Direct-prod deployment model (no staging)
- Caddy provides automatic HTTPS, HTTP redirect, certificate renewal
- Manual configuration needed for HSTS headers and volume persistence
- Rollback consideration: HSTS caching (6-month enforcement)
- Estimated effort: 6-8 hours

**Key Decisions**:
- Task organization by user story priority (P1 MVP, P2 enhancement)
- 11 parallel opportunities identified (validation tasks, documentation)
- Certificate persistence (US1) blocks all SSL functionality
- SSL Labs validation (US6) deferred to enhancement phase
- DNS validation checklist prevents issuance failures

## Phase 4: Implementation (2025-10-28)

**Batch Execution Strategy**:
- Batch 1 (Setup): T001, T002, T003 - Independent validation
- Batch 2 (Certificate Persistence): T004, T005, T006 - Blocks SSL functionality
- Batch 3 (HTTP Redirect & HSTS): T007, T008, T009 - Depends on Batch 2
- Batch 4 (Documentation): T010 - Independent
- Batch 5 (Post-Deployment): T011-T014 - Verification tasks
- Batch 6 (SSL Labs & Docs): T015-T018 - Final validation

### Batch 1: Setup Validation (COMPLETED)

✅ T001: Docker Compose validation
- Validated docker-compose.prod.yml syntax
- Warning: .env.production file not found (non-critical)
- Result: YAML parses correctly

✅ T002: Caddyfile syntax validation
- Validated infrastructure/Caddyfile using caddy:2-alpine
- Result: Valid configuration
- Note: Minor formatting inconsistency (non-blocking)
- Automatic HTTP→HTTPS redirect confirmed by Caddy

✅ T003: Deployment checklist created
- File: specs/048-ssl-tls-letsencrypt/deployment-checklist.md
- Content: DNS validation, pre-flight checks, deployment steps, troubleshooting
- Includes: dig commands, A record verification, port checks

### Batch 2: Certificate Persistence (COMPLETED)

✅ T004: Add Caddy Docker service to docker-compose.prod.yml
- Added caddy service after nextjs service
- Image: caddy:2-alpine
- Ports: 80:80 (HTTP), 443:443 (HTTPS)
- Volumes: Caddyfile (read-only), caddy-data (persistent)
- Network: app-network (shared with nextjs)
- Health check: wget http://localhost:2019/health
- Logging: json-file driver (10m max-size, 3 files)
- Restart: always

✅ T005: Add caddy-data volume definition
- Added volumes section with caddy-data volume
- Driver: local
- Location: /data/caddy in Caddy container
- Purpose: Persistent certificate storage across restarts

✅ T006: Update Next.js service port exposure
- Commented out ports: - "3000:3000" section
- Port 3000 now only accessible via internal Docker network
- External traffic routed through Caddy reverse proxy
- Reason: Security best practice, single entry point

### Batch 3: HTTP Redirect & HSTS (COMPLETED)

✅ T007: Verify HTTP to HTTPS redirect in Caddyfile
- Verified: Caddy provides automatic HTTP→HTTPS redirect by default
- No explicit configuration needed
- All domain blocks automatically redirect HTTP to HTTPS
- Status: 308 Permanent Redirect
- Documented: Automatic behavior confirmed during Caddyfile validation

✅ T008: Add HSTS header to marcusgoll.com domain block
- Added header directive: Strict-Transport-Security "max-age=15768000; includeSubDomains"
- Max-age: 15768000 seconds (6 months)
- IncludeSubDomains: Applies to all subdomains
- Location: After domain declaration, before reverse_proxy

✅ T009: Add HSTS header to all remaining domain blocks
- cfipros.com: HSTS header added
- ghost.marcusgoll.com: HSTS header added
- api.marcusgoll.com: HSTS header added
- api.cfipros.com: HSTS header added
- Total: 5 domain blocks with HSTS headers
- Validated: Caddyfile syntax passes with all HSTS headers

### Batch 4: Documentation (COMPLETED)

✅ T010: Document DNS validation procedure
- Enhanced deployment checklist with comprehensive DNS validation
- Added 5-step pre-deployment validation procedure
- Included DNS propagation check (Google/Cloudflare/OpenDNS)
- Added firewall configuration verification (UFW ports 80/443)
- Documented deployment steps with monitoring commands
- Added troubleshooting section for common issues
- Included Let's Encrypt rate limit documentation
- Added HSTS rollback warnings
- Total checklist items: 12 pre-deployment, 7 post-deployment
- References: Let's Encrypt docs, Caddy docs, HSTS spec

### Batch 5: Post-Deployment Verification (PENDING - REQUIRES PRODUCTION DEPLOYMENT)

Tasks T011-T014 require production deployment to execute:

- [ ] T011: Verify HTTPS certificate validity for all domains
  - Command: openssl s_client -connect marcusgoll.com:443
  - Requires: Live production environment with Let's Encrypt certificates

- [ ] T012: Verify HTTP to HTTPS redirect for all domains
  - Command: curl -I http://marcusgoll.com
  - Requires: Caddy running in production with configured domains

- [ ] T013: Verify HSTS header present for all domains
  - Command: curl -I https://marcusgoll.com | grep -i strict-transport
  - Requires: Production HTTPS endpoints

- [ ] T014: Test certificate persistence across container restarts
  - Command: docker-compose restart caddy (3x in 5 minutes)
  - Requires: Production VPS access with deployed Caddy service

**Status**: Documented in deployment checklist (Step 3-6)
**Execution timing**: During /ship phase after production deployment

### Batch 6: SSL Labs & Final Documentation (PENDING - REQUIRES PRODUCTION DEPLOYMENT)

Tasks T015-T018 are enhancement and documentation tasks:

- [ ] T015: Run SSL Labs scan for marcusgoll.com (US6)
  - URL: https://www.ssllabs.com/ssltest/analyze.html?d=marcusgoll.com
  - Requires: Production HTTPS deployment
  - Target: A+ rating

- [ ] T016: Run SSL Labs scan for cfipros.com (US6)
  - URL: https://www.ssllabs.com/ssltest/analyze.html?d=cfipros.com
  - Requires: Production HTTPS deployment

- [ ] T017: Update OPERATIONS_RUNBOOK.md with SSL troubleshooting
  - Status: Can be completed pre-deployment
  - Content: Certificate failures, renewal issues, HSTS considerations

- [ ] T018: Create infrastructure README documenting Caddy SSL setup
  - Status: Can be completed pre-deployment
  - Content: Architecture, certificate storage, renewal schedule

**Status**: T015-T016 blocked by deployment, T017-T018 can proceed independently
**Decision**: Defer T015-T018 to post-/ship phase or separate enhancement feature

## Implementation Summary

**Completed Tasks**: 10/18 (56%)
- Batch 1 (Setup): 3/3 tasks complete
- Batch 2 (Certificate Persistence): 3/3 tasks complete
- Batch 3 (HTTP Redirect & HSTS): 3/3 tasks complete
- Batch 4 (Documentation): 1/1 task complete
- Batch 5 (Post-Deployment): 0/4 tasks (blocked by deployment)
- Batch 6 (SSL Labs & Docs): 0/4 tasks (2 blocked, 2 deferrable)

**Files Modified**: 3
1. docker-compose.prod.yml - Added Caddy service, volume, removed nextjs port exposure
2. infrastructure/Caddyfile - Added HSTS headers to all 5 domain blocks
3. specs/048-ssl-tls-letsencrypt/deployment-checklist.md - Comprehensive deployment guide

**Files Created**: 1
1. specs/048-ssl-tls-letsencrypt/deployment-checklist.md (enhanced from stub)

**Configuration Changes**:
- Caddy service: caddy:2-alpine image, ports 80/443, persistent volume
- Volume: caddy-data for certificate persistence
- HSTS headers: 6-month max-age with includeSubDomains on all domains
- Security: Next.js port 3000 no longer publicly exposed

**Key Decisions**:
1. Batch 5-6 tasks require production deployment - defer to /ship phase
2. T017-T018 (documentation) can be completed independently but deferred for focus
3. Core MVP functionality (US1-US4) fully implemented
4. SSL Labs validation (US6) deferred as enhancement (P2 priority)

**Ready for**: /ship phase (deploy to production VPS, execute verification tasks)

