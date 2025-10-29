# Implementation Plan: DNS Domain Mapping

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- DNS Provider: Domain registrar (standard approach)
- Documentation Location: infrastructure/dns/README.md (follows existing pattern)
- TTL Value: 3600 seconds initial (1 hour propagation window)
- Verification Tools: dig + nslookup + dnschecker.org (multi-method validation)
- Components to reuse: 2 (infrastructure docs pattern, Caddy config)
- New components needed: 1 (DNS documentation)

---

## [ARCHITECTURE DECISIONS]

### Infrastructure Configuration (Not Application Code)

**Nature**: This is an infrastructure configuration feature, NOT a code implementation feature

**No Code Changes Required**:
- No frontend development
- No backend development
- No database migrations
- No API contracts
- No automated tests

**Work Scope**:
- DNS A record configuration at domain registrar (manual)
- Documentation creation (infrastructure/dns/README.md)
- Manual verification procedures

---

### DNS Record Architecture

**Records to Create**:
1. **Apex Domain**: `@` → 178.156.129.179, TTL 3600
2. **WWW Subdomain**: `www` → 178.156.129.179, TTL 3600

**Provider**: Domain registrar DNS management panel

**Propagation**:
- Target: <1 hour for major resolvers
- Maximum: 48 hours for complete global propagation
- Validation: Multiple DNS servers + global checker

---

### SSL Certificate Strategy

**Provider**: Let's Encrypt (via Caddy automatic ACME)

**Challenge Type**: HTTP-01 (requires port 80 accessible after DNS points to VPS)

**Automation**: Fully automatic - Caddy handles certificate issuance and renewal

**Email**: marcusgoll@gmail.com (for Let's Encrypt expiry notifications)

---

### Documentation Architecture

**Location**: infrastructure/dns/README.md

**Pattern**: Follow INFRASTRUCTURE_SETUP.md style:
- Security notices (credentials NOT in git)
- Architecture diagram (if applicable)
- Step-by-step configuration
- Verification commands with expected output
- Troubleshooting sections
- File locations and references

**Sections Required** (from spec.md FR-003):
- DNS provider name and login instructions
- A record configuration details
- Verification commands and expected output
- Troubleshooting steps for common issues
- Propagation timeline expectations

---

## [STRUCTURE]

### Directory Layout

```
infrastructure/
├── Caddyfile                        # EXISTING - Reverse proxy config
├── ghost/                           # EXISTING - Ghost CMS config
└── dns/                             # NEW - DNS documentation
    └── README.md                    # NEW - DNS configuration guide

specs/005-dns-domain-mapping/
├── spec.md                          # EXISTING - Feature specification
├── NOTES.md                         # EXISTING - Feature notes
├── research.md                      # NEW - Research findings
├── data-model.md                    # NEW - DNS record schema (not app data)
├── quickstart.md                    # NEW - Verification scenarios
├── plan.md                          # NEW - This file
└── error-log.md                     # NEW - Error tracking (initialized)
```

### No Application Module Organization

This feature has no application modules:
- No api/src/modules/
- No apps/app/components/
- No database migrations
- No API routes

---

## [DATA MODEL]

See: data-model.md for complete DNS record definitions

**Summary**:
- DNS Records: 2 (apex A record, www A record)
- Application Entities: 0 (infrastructure only)
- Database Migrations: None required
- State Management: None required

**Key Points**:
- DNS records configured at registrar level (not in application)
- No application data model changes
- Documentation is the only code artifact

---

## [PERFORMANCE TARGETS]

### DNS Propagation Performance (from spec.md NFR-001)

**Target**: <1 hour for major DNS resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1)

**Maximum**: 48 hours for complete global propagation (industry standard)

**Measurement**:
- CLI tools: dig, nslookup
- Web tool: dnschecker.org
- Multiple geographic regions

### SSL Certificate Issuance Performance

**Target**: <10 minutes after DNS propagation completes

**Dependency**: DNS must point to VPS before ACME HTTP-01 challenge can succeed

**Automatic**: Caddy handles issuance automatically (no manual intervention)

### DNS Reliability (from spec.md NFR-002)

**Target**: 99.9% uptime for DNS resolution

**Provider SLA**: Dependent on domain registrar's DNS infrastructure

**Validation**: Periodic monitoring via dnschecker.org or similar tools

### No Application Performance Targets

This feature has no:
- API response time requirements
- Page load time requirements
- Database query performance requirements
- Lighthouse scores

---

## [SECURITY]

### DNS Security

**Public Information**: DNS A records are public (visible via DNS queries)

**No Credentials in Git**:
- Domain registrar login credentials NOT stored in git
- Documentation references "domain registrar account" without specifying credentials
- Follow pattern from INFRASTRUCTURE_SETUP.md (credentials in .credentials/ gitignored)

**Access Control**:
- DNS changes require registrar account login
- Document login instructions in infrastructure/dns/README.md (WITHOUT credentials)

### SSL Certificate Security

**Automatic Issuance**: Let's Encrypt via Caddy ACME HTTP-01

**Email Configuration**: marcusgoll@gmail.com (already in Caddyfile line 2)

**Port Requirements**:
- Port 80: Open for ACME HTTP-01 challenge (already configured per INFRASTRUCTURE_SETUP.md)
- Port 443: Open for HTTPS traffic (already configured)

**No Manual Certificate Management**: Caddy handles renewal automatically

### VPS Network Security

**Firewall**: UFW configured (ports 22, 80, 443) per INFRASTRUCTURE_SETUP.md

**Static IP**: 178.156.129.179 (public, required for DNS A records)

**No Sensitive Data**: VPS IP is already public information

---

## [EXISTING INFRASTRUCTURE - REUSE]

### 1. Caddy Reverse Proxy Configuration

**File**: infrastructure/Caddyfile

**Reuse**:
- SSL email already configured (line 2): `email marcusgoll@gmail.com`
- Domain routing already configured for marcusgoll.com (lines 15-17)
- WWW to apex redirect already configured (lines 6-8)
- ACME automatic SSL enabled by default in Caddy

**DNS Dependency**:
- Caddy config expects DNS to point to VPS
- This feature fulfills that requirement
- No Caddyfile changes needed for DNS mapping

**Evidence**:
```
# infrastructure/Caddyfile line 2
email marcusgoll@gmail.com

# lines 6-8
www.marcusgoll.com {
  redir https://marcusgoll.com{uri} 308
}

# lines 15-17
marcusgoll.com {
  reverse_proxy ghost:2368
}
```

### 2. Infrastructure Documentation Pattern

**File**: docs/INFRASTRUCTURE_SETUP.md

**Reuse**:
- Documentation style (security notices, code blocks, sections)
- Command examples with expected output
- Troubleshooting section structure
- Reference section format

**Application**: Create infrastructure/dns/README.md following same pattern

**Evidence**:
- Line 1-3: Security notice about credentials
- Line 9-23: Architecture diagram
- Line 55-72: Getting credentials section
- Line 222-242: Troubleshooting section structure

### 3. VPS Infrastructure

**Component**: Hetzner VPS at 178.156.129.179

**Reuse**:
- Static IP address (no changes needed)
- Caddy container running (proxy-caddy-1)
- Ports 80/443 open (verified in INFRASTRUCTURE_SETUP.md)
- UFW firewall configured

**DNS Records Will Point To**: 178.156.129.179 (existing VPS)

**No VPS Changes Required**: Infrastructure already DNS-ready

---

## [NEW INFRASTRUCTURE - CREATE]

### 1. DNS A Records (at Registrar)

**Record 1 - Apex Domain**:
- Type: A
- Name: @ (or blank/marcusgoll.com depending on registrar UI)
- Value: 178.156.129.179
- TTL: 3600

**Record 2 - WWW Subdomain**:
- Type: A
- Name: www
- Value: 178.156.129.179
- TTL: 3600

**Location**: Domain registrar DNS management panel (NOT in git)

**Documentation**: Exact steps documented in infrastructure/dns/README.md

### 2. Infrastructure DNS Documentation

**File**: infrastructure/dns/README.md (NEW)

**Sections**:
- DNS provider name and login instructions
- A record configuration (step-by-step with screenshots if possible)
- Verification commands (dig, nslookup, dnschecker.org)
- Expected output for each verification method
- Troubleshooting common DNS issues
- Propagation timeline expectations
- Rollback procedure

**Pattern**: Follow INFRASTRUCTURE_SETUP.md style

**Security**:
- NO registrar credentials in documentation
- Reference "domain registrar account" generically
- Follow gitignore pattern for sensitive info

---

## [CI/CD IMPACT]

### Platform Dependencies

**None**: DNS is configured at registrar level, external to application deployment

**No GitHub Actions Changes**: No workflow updates required

**No Vercel/Railway Changes**: Application deployment unaffected

### Environment Variables

**None Required**: DNS configuration does not use environment variables

**Future Consideration**: After DNS is configured, application .env.local can use:
```env
# Can use domain instead of IP (after DNS configured)
DATABASE_URL=postgresql://postgres:PASSWORD@api.marcusgoll.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://api.marcusgoll.com
GHOST_API_URL=https://ghost.marcusgoll.com
```

**Current State**: These URLs already exist in INFRASTRUCTURE_SETUP.md (lines 92-102)

### Breaking Changes

**None**: DNS mapping is additive

**Backward Compatibility**:
- IP-based access continues to work (http://178.156.129.179:3000)
- Existing Ghost CMS on ghost:2368 continues to function
- No disruption to currently running services

**Risk**: Low - DNS is additive, rollback is simple (delete A records)

### Database Migrations

**None Required**: No database changes

### Smoke Tests

**No Automated Tests**: Infrastructure configuration is manually verified

**Manual Verification** (documented in quickstart.md):
- DNS query tests (dig, nslookup)
- HTTP connectivity tests (curl)
- SSL certificate validation
- Global propagation check (dnschecker.org)

**Post-Configuration Checklist**:
- [ ] `ping marcusgoll.com` returns 178.156.129.179
- [ ] `dig marcusgoll.com` returns correct IP
- [ ] dnschecker.org shows global propagation
- [ ] `https://marcusgoll.com` has valid SSL cert

### Platform Coupling

**None**: DNS is platform-agnostic

**Independence**:
- Works with any DNS provider
- Works with any hosting platform
- No vendor lock-in

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants

**DNS Invariants** (must hold true):
- A records point to correct VPS IP (178.156.129.179)
- TTL is reasonable (3600 seconds initially)
- Both apex and www subdomain are configured

**Caddy Invariants**:
- Email configured for Let's Encrypt (marcusgoll@gmail.com)
- Port 80 accessible for ACME HTTP-01 challenge
- Domain routing configured in Caddyfile

**VPS Invariants**:
- VPS is running and accessible
- Caddy container is running (proxy-caddy-1)
- Ports 80/443 open in firewall

### Manual Validation Checklist

**Given** DNS A records are created at registrar
**When** DNS propagation completes
**Then**:
- `dig marcusgoll.com +short` returns 178.156.129.179
- `dig www.marcusgoll.com +short` returns 178.156.129.179
- Google DNS (8.8.8.8) resolves correctly
- Cloudflare DNS (1.1.1.1) resolves correctly

**Given** DNS points to VPS
**When** Caddy attempts ACME HTTP-01 challenge
**Then**:
- Let's Encrypt can reach domain via port 80
- SSL certificate is issued successfully
- `https://marcusgoll.com` loads with valid cert

**Given** SSL certificate is obtained
**When** user navigates to https://www.marcusgoll.com
**Then**:
- 308 redirect to https://marcusgoll.com
- Valid SSL certificate (no warnings)

### Rollback Plan

**Rollback Steps**:
1. Log into domain registrar
2. Delete A records (@ and www)
3. Wait for TTL expiration (3600 seconds = 1 hour max)
4. Verify rollback: `dig marcusgoll.com` returns NXDOMAIN or no answer

**Fallback Access**:
- IP-based access always works: http://178.156.129.179:3000
- No disruption to VPS services
- Ghost CMS continues to function on ghost.marcusgoll.com (if DNS rolled back)

**Special Considerations**:
- SSL certificates remain valid during rollback (but domain won't resolve)
- Caddy will continue trying to renew SSL even if DNS rolled back
- No data loss - DNS is pure routing, no application state

### No Build Artifacts

**This feature has no build artifacts**:
- No web app bundle
- No API Docker image
- No database migrations
- No JavaScript/CSS/HTML files

**Artifact**: infrastructure/dns/README.md (documentation only, checked into git)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Scenario 1: DNS Configuration (manual at registrar)
- Scenario 2: Immediate Verification (dig, nslookup, curl)
- Scenario 3: Global Propagation Check (dnschecker.org)
- Scenario 4: SSL Certificate Verification (curl HTTPS)
- Scenario 5: Troubleshooting (common issues and fixes)
- Scenario 6: Rollback DNS Changes (if needed)

**No Local Development**:
- No dev server to run
- No npm install or dependencies
- No automated test suite
- Manual verification only

---

## [TIMELINE ESTIMATE]

**Active Work**:
- DNS record creation: 15 minutes (manual at registrar)
- Documentation creation: 30 minutes (infrastructure/dns/README.md)
- Initial verification: 15 minutes (dig, nslookup, curl)
- **Total Active Time**: ~1 hour

**Wait Time**:
- DNS propagation: 15min - 48hr (typically <1hr for major resolvers)
- SSL certificate issuance: 1-10 minutes (after DNS propagates)
- **Total Wait Time**: 1-48 hours (typically <1hr)

**Overall Timeline**: 1-2 hours active work, up to 48 hours including wait time

---

## [RISK ASSESSMENT]

### Technical Risks

**Risk 1: DNS Propagation Takes Longer Than Expected**
- **Likelihood**: Low (standard propagation is 15min-48hr, typically <1hr)
- **Impact**: Medium (delays HTTPS enablement, but site accessible via IP)
- **Mitigation**:
  - Set TTL to 3600 initially (1 hour window)
  - Verify with multiple DNS servers (8.8.8.8, 1.1.1.1, local)
  - Use dnschecker.org for global visibility
  - Keep IP-based access available as fallback

**Risk 2: Incorrect A Record Configuration**
- **Likelihood**: Low (simple two-record setup)
- **Impact**: High (site unreachable via domain, but IP access works)
- **Mitigation**:
  - Document exact steps with screenshots in infrastructure/dns/README.md
  - Verify records immediately after creation (dig @8.8.8.8)
  - Test with multiple DNS servers before considering complete
  - Rollback is simple (delete A records)

**Risk 3: Registrar Account Access Issues**
- **Likelihood**: Low (assuming credentials are available)
- **Impact**: High (blocks entire feature, no workaround)
- **Mitigation**:
  - Verify registrar account access before starting
  - Document login URL and account recovery process
  - Keep registrar credentials secure in .credentials/ (gitignored)

**Risk 4: Let's Encrypt ACME Challenge Fails**
- **Likelihood**: Low (Caddy handles automatically, ports already open)
- **Impact**: Medium (HTTPS unavailable, but HTTP works)
- **Mitigation**:
  - Verify port 80 is accessible before DNS configuration (already confirmed in INFRASTRUCTURE_SETUP.md)
  - Check Caddy logs for ACME errors
  - Verify email is configured in Caddyfile (already done: marcusgoll@gmail.com)
  - Let's Encrypt will retry automatically

### Operational Risks

**Risk 5: DNS Configuration Errors Not Detected**
- **Likelihood**: Low (multiple verification methods)
- **Impact**: Medium (site unreachable via domain)
- **Mitigation**:
  - Use multiple verification tools (dig, nslookup, dnschecker.org)
  - Check multiple DNS servers (Google, Cloudflare, local)
  - Verify global propagation before considering complete
  - Document verification checklist in quickstart.md

**Risk 6: Feature Blocked by Site Not Being Production-Ready**
- **Likelihood**: High (feature currently on hold per spec.md line 28)
- **Impact**: Medium (DNS can be configured but not utilized until site ready)
- **Mitigation**:
  - Feature is preparatory work (can configure DNS in advance)
  - Documentation created now, executed when site ready
  - No harm in configuring DNS early (just enables HTTPS sooner)
  - Rollback is simple if needed

### No Code-Related Risks

This feature has no code, therefore no risks from:
- Code quality issues
- Test coverage gaps
- Performance regressions
- Security vulnerabilities in code
- Breaking changes to APIs

---

## [DEPENDENCIES]

### Prerequisites (from spec.md)

**Required**:
- Access to domain registrar account for marcusgoll.com
- VPS at 178.156.129.179 is running and accessible
- Caddy reverse proxy is installed on VPS

**Verification**:
- [ ] Registrar account credentials available
- [ ] VPS responds to ping (178.156.129.179)
- [ ] Caddy container running (docker ps | grep caddy)
- [ ] Ports 80/443 open (nmap -p 80,443 178.156.129.179)

### Blocking Dependencies

**None**: DNS can be configured independently

**Optional Dependencies** (enhance but don't block):
- Next.js site production-ready (per GitHub Issue #40)
- Caddyfile updated to point marcusgoll.com → next:3000 (currently ghost:2368)

### Follow-up Features (from spec.md)

After DNS configuration is complete:

**Feature 1: Verify HTTPS Certificate Issuance**
- Confirm Let's Encrypt SSL certificate obtained
- Verify HTTPS access to marcusgoll.com
- Test www → apex redirect with SSL

**Feature 2: Update Caddyfile Routing**
- Change marcusgoll.com reverse_proxy from ghost:2368 to next:3000
- Deploy Next.js application to port 3000 on VPS
- Verify routing works correctly

**Feature 3: Production Deployment**
- Deploy Next.js application to production on VPS
- Update environment variables to use domain URLs
- Verify full end-to-end functionality

---

## [CONSTITUTION ALIGNMENT]

### Engineering Principles Alignment

**Specification First** ✅
- Feature has complete specification (specs/005-dns-domain-mapping/spec.md)
- User stories, acceptance criteria, NFRs all defined
- Out-of-scope items documented

**Documentation Standards** ✅
- infrastructure/dns/README.md will document all decisions
- Verification commands with expected output
- Troubleshooting steps documented
- Context preserved for future maintainers

**Security Practices** ✅
- No credentials in git
- DNS records are public (no sensitive data)
- Follow existing infrastructure security pattern

**Do Not Overengineer** ✅
- Simple solution: DNS A records at registrar (not external DNS service)
- No unnecessary complexity
- Leverage existing Caddy configuration (no changes)

### Brand Principles Alignment

**Systematic Clarity** ✅
- Documentation follows systematic approach
- Step-by-step verification procedures
- Clear troubleshooting guide

**Not Applicable**:
- Visual Brand Consistency (infrastructure, no UI)
- Multi-Passionate Integration (infrastructure, no content)
- Authentic Building in Public (can document DNS setup as learning)
- Teaching-First Content (can write tutorial about DNS setup)

### Conflict Resolution

**No Conflicts**: This infrastructure feature aligns with all applicable principles

---

## [SUCCESS CRITERIA]

The DNS domain mapping feature is successfully implemented when:

1. ✅ **Domain Resolution**: `ping marcusgoll.com` returns 178.156.129.179
2. ✅ **Subdomain Resolution**: `ping www.marcusgoll.com` returns 178.156.129.179
3. ✅ **Global Propagation**: DNS verified in all major geographic regions (dnschecker.org)
4. ✅ **HTTPS Ready**: Caddy completes ACME HTTP-01 challenge, SSL cert obtained
5. ✅ **WWW Redirect**: `https://www.marcusgoll.com` redirects to `https://marcusgoll.com`
6. ✅ **Documentation Complete**: infrastructure/dns/README.md exists with all required sections
7. ✅ **Verification Reproducible**: Any team member can verify DNS using documented commands

---

## [NEXT STEPS]

**Immediate**:
1. Run `/tasks` to break down implementation into concrete tasks
2. Create infrastructure/dns/README.md template
3. Document verification commands with expected output

**During Implementation**:
1. Access domain registrar account
2. Create A records (apex + www → 178.156.129.179, TTL 3600)
3. Verify DNS propagation using multiple methods
4. Monitor Caddy logs for SSL certificate issuance
5. Test HTTPS access and redirects

**After Completion**:
1. Document actual propagation time observed
2. Update INFRASTRUCTURE_SETUP.md with DNS status (line 290)
3. Add to shipped features in roadmap
4. Coordinate with Next.js production deployment (feature on hold until site ready)
