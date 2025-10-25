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
