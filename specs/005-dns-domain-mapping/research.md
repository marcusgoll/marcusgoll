# Research & Discovery: dns-domain-mapping

## Research Mode

**Mode**: Minimal (infrastructure-only feature, no code implementation)

This is a DNS configuration feature with no application code changes. Research focused on existing infrastructure patterns and documentation standards.

---

## Research Decisions

### Decision: DNS Provider - Domain Registrar Panel

- **Decision**: Configure DNS A records directly at domain registrar
- **Rationale**: Standard approach for domain mapping, no need for external DNS services
- **Alternatives Rejected**:
  - Cloudflare DNS: Adds complexity, not needed for simple A records
  - Route 53: AWS overkill for static IP mapping
  - External DNS providers: Unnecessary when registrar provides DNS management
- **Source**: Industry standard practice, spec.md assumptions

### Decision: Documentation Location - infrastructure/dns/

- **Decision**: Create infrastructure/dns/README.md for DNS documentation
- **Rationale**: Follows existing infrastructure/ directory pattern (Caddyfile, ghost/)
- **Alternatives Rejected**:
  - docs/DNS.md: Infrastructure config should live with infrastructure code
  - Root README.md: Would clutter main documentation
- **Source**: Existing pattern from infrastructure/Caddyfile and infrastructure/ghost/

### Decision: TTL Value - 3600 seconds (1 hour)

- **Decision**: Set initial TTL to 3600 seconds for new A records
- **Rationale**:
  - Industry standard for production DNS
  - Allows reasonable propagation time for changes
  - Can be reduced to 300 after DNS is stable
- **Alternatives Rejected**:
  - 300 seconds: Too aggressive for initial setup, increases resolver load
  - 86400 seconds: Too long for initial deployment (24hr change window)
- **Source**: spec.md NFR-001, DNS best practices

### Decision: Verification Tools - dig, nslookup, dnschecker.org

- **Decision**: Use multiple verification methods (CLI + web tool)
- **Rationale**:
  - CLI tools (dig/nslookup) for quick local verification
  - dnschecker.org for global propagation visibility
  - Multiple DNS servers (8.8.8.8, 1.1.1.1, local) for comprehensive check
- **Alternatives Rejected**:
  - Single verification method: Insufficient for production validation
  - Only web-based tools: Not scriptable or automatable
- **Source**: spec.md FR-002, industry best practices

---

## Components to Reuse (2 found)

### Infrastructure Documentation Pattern

- **Component**: infrastructure/ directory structure
- **Reuse**: Follow existing pattern for organizing infrastructure documentation
- **Evidence**: infrastructure/Caddyfile (line 1-38), infrastructure/ghost/
- **Application**: Create infrastructure/dns/README.md following same pattern

### Caddy Configuration

- **Component**: infrastructure/Caddyfile (existing reverse proxy config)
- **Reuse**: DNS A records will enable this existing Caddy configuration
- **Evidence**:
  - Line 2: `email marcusgoll@gmail.com` (SSL cert contact)
  - Line 6-8: www to apex redirect configured
  - Line 15-17: marcusgoll.com reverse proxy to ghost:2368 (TODO: change to next:3000)
- **Application**:
  - DNS enables automatic SSL via Let's Encrypt ACME HTTP-01 challenge
  - No changes to Caddyfile needed for DNS mapping
  - Future feature will update proxy target from ghost:2368 to next:3000

---

## New Components Needed (1 required)

### Infrastructure DNS Documentation

- **Component**: infrastructure/dns/README.md
- **Purpose**: Document DNS configuration details, verification commands, troubleshooting
- **Requirements** (from spec.md FR-003):
  - DNS provider name and login instructions
  - A record configuration details (apex + www subdomain)
  - Verification commands with expected output
  - Troubleshooting steps for common issues
  - Propagation timeline expectations
- **Pattern**: Follow INFRASTRUCTURE_SETUP.md style (sections, code blocks, security notices)

---

## Unknowns & Questions

None - all technical questions resolved through research.

**Resolved Questions**:
1. DNS provider: Documented in assumptions (domain registrar account accessible)
2. TTL value: 3600 seconds per spec.md
3. Verification approach: Multiple methods documented in FR-002
4. Documentation location: infrastructure/dns/ follows existing pattern
5. Caddy interaction: Automatic SSL via ACME HTTP-01 after DNS propagation

---

## Infrastructure Context

### Existing VPS Setup (from INFRASTRUCTURE_SETUP.md)

**VPS IP**: 178.156.129.179 (static Hetzner VPS)

**Services Running**:
- Caddy reverse proxy (ports 80, 443)
- Ghost CMS (internal port 2368)
- Supabase API (internal port 8002)
- Next.js app (port 3000, not yet proxied through Caddy)

**Current DNS Status** (from INFRASTRUCTURE_SETUP.md:290):
- DNS: Not configured (required)
- SSL Certs: Pending DNS
- Access: Currently via http://178.156.129.179:3000 (IP-based)

### Caddy SSL Configuration

**Email**: marcusgoll@gmail.com (for Let's Encrypt notifications)

**Domains Configured**:
- marcusgoll.com (currently → ghost:2368, TODO: change to next:3000)
- www.marcusgoll.com (redirect to apex)
- ghost.marcusgoll.com (→ ghost:2368)
- api.marcusgoll.com (→ kong:8002)

**SSL Behavior**: Caddy automatically obtains SSL certificates from Let's Encrypt once DNS points to VPS IP

---

## External References

### DNS Propagation

- **Tool**: https://dnschecker.org
- **Purpose**: Global DNS propagation verification across multiple geographic regions
- **Usage**: Enter marcusgoll.com to verify A record propagation

### Let's Encrypt ACME

- **Documentation**: https://letsencrypt.org/docs/challenge-types/
- **Challenge Type**: HTTP-01 (requires port 80 accessible, domain DNS configured)
- **Behavior**: Caddy handles ACME challenge automatically

### Existing Infrastructure Docs

- **Caddyfile**: infrastructure/Caddyfile (reverse proxy config)
- **Infrastructure Setup**: docs/INFRASTRUCTURE_SETUP.md (VPS architecture, services)
- **Deployment**: docs/DEPLOYMENT.md (deployment procedures)

---

## Research Summary

**Findings**:
- This is an infrastructure configuration feature, not a code implementation feature
- Existing Caddy configuration is already DNS-ready (configured for marcusgoll.com)
- Documentation pattern exists (infrastructure/ directory, INFRASTRUCTURE_SETUP.md style)
- No code changes required - only DNS registrar configuration and documentation

**Reuse Opportunities**:
- Leverage existing infrastructure/ directory structure
- Follow INFRASTRUCTURE_SETUP.md documentation style
- Utilize pre-configured Caddy reverse proxy setup

**New Work Required**:
- Create infrastructure/dns/README.md with configuration/verification steps
- Document DNS A record creation process
- Provide troubleshooting guidance for common DNS issues

**Risk Mitigation**:
- Multiple verification methods prevent configuration errors
- IP-based access remains available as fallback during DNS transition
- TTL of 3600 allows reasonable rollback window (1 hour)
