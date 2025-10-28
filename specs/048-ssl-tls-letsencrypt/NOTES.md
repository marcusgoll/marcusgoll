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
