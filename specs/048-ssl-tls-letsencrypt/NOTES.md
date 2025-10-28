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

