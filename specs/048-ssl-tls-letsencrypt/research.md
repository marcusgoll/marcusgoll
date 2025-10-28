# Research & Discovery: 048-ssl-tls-letsencrypt

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal website/blog showcasing Marcus's triple domain expertise (Aviation + Teaching + Dev)
- **Target Users**: Pilots seeking career advancement, developers learning systematic thinking, potential clients/collaborators
- **Success Metrics**: SEO performance, content engagement, professional credibility
- **Scope Boundaries**: Static site + blog + newsletter, no user accounts (except admin)

### System Architecture (from system-architecture.md)
- **Components**: Next.js frontend (port 3000), PostgreSQL (Supabase), Caddy reverse proxy, Ghost CMS (transitioning)
- **Integration Points**: Caddy → Next.js (reverse proxy), Caddy → DNS (Let's Encrypt validation)
- **Data Flows**: HTTP requests → Caddy (SSL termination) → Next.js (application)
- **Constraints**: Single VPS deployment, self-hosted infrastructure

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), TypeScript 5.9.3
- **Backend**: Next.js API Routes (minimal)
- **Database**: PostgreSQL 15+ via Supabase (self-hosted)
- **Deployment**: Hetzner VPS, Docker + Docker Compose, Caddy 2.x

**Caddy Choice Rationale**:
- Automatic SSL/TLS via Let's Encrypt (zero manual configuration)
- Simple Caddyfile format (vs complex Nginx config)
- Hot reload, HTTP/2 and HTTP/3 support
- Chosen specifically for automatic SSL management capability

### Data Architecture (from data-architecture.md)
- **Existing Entities**: User (minimal), Blog Posts (MDX files, not DB)
- **Relationships**: None relevant to SSL/TLS (infrastructure-only feature)
- **Naming Conventions**: snake_case for DB, kebab-case for files
- **Migration Strategy**: Prisma Migrate (not needed for this feature)

### API Strategy (from api-strategy.md)
- **API Style**: REST (Next.js API Routes)
- **Auth**: Not implemented yet (future)
- **Versioning**: None yet (single API version)
- **Error Format**: Standard HTTP status codes
- **Rate Limiting**: None yet (future consideration)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: Micro tier (<1K visitors/mo)
- **Performance Targets**: FCP <1.5s, Lighthouse ≥85
- **Resource Limits**: Hetzner VPS (2-4 vCPUs, 4-8GB RAM)
- **Cost Constraints**: <$50/mo total infrastructure

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (solo developer, low traffic)
- **Platform**: Hetzner VPS with Docker Compose
- **CI/CD Pipeline**: GitHub Actions (verify → build → deploy)
- **Environments**: Local (dev), Production (marcusgoll.com)

**SSL/TLS Current State**: Caddy configured in `infrastructure/Caddyfile`, but no persistent storage for certificates

### Development Workflow (from development-workflow.md)
- **Git Workflow**: Feature branches → PR → main (auto-deploy)
- **Testing Strategy**: Manual testing, Lighthouse validation
- **Code Style**: TypeScript + ESLint + Next.js conventions
- **Definition of Done**: Built, tested locally, Lighthouse ≥85, deployed

---

## Research Decisions

### Decision: Use Caddy's Built-In Let's Encrypt Integration
- **Decision**: Leverage Caddy's automatic HTTPS with Let's Encrypt
- **Rationale**:
  - Caddy already chosen in tech stack for this specific capability
  - Zero configuration needed (Caddy handles ACME protocol automatically)
  - HTTP-01 challenge works out-of-box when DNS points to VPS
  - Automatic renewal every 60 days (30 days before expiry)
- **Alternatives**:
  - Certbot + manual Nginx config: More complex, manual renewal setup
  - Traefik: Overkill for single VPS, targets container orchestration
  - Manual certificates: High maintenance, no auto-renewal
- **Source**: tech-stack.md lines 267-275, Caddy official docs

### Decision: HTTP-01 Challenge for Individual Domain Certificates
- **Decision**: Use HTTP-01 ACME challenge for each domain (marcusgoll.com, cfipros.com, subdomains)
- **Rationale**:
  - Simpler than DNS-01 (no DNS provider API integration needed)
  - Works with existing Caddyfile reverse proxy configuration
  - No wildcard cert needed (small number of known subdomains)
  - Meets requirement FR-006 (multiple domains, individual certs)
- **Alternatives**:
  - DNS-01 + wildcard cert: More complex, requires DNS API credentials, overkill for 4-5 domains
  - Separate Nginx + Certbot: Abandons Caddy's main advantage
- **Source**: spec.md FR-006, Let's Encrypt best practices

### Decision: Docker Volume for Certificate Persistence
- **Decision**: Mount persistent Docker volume at `/data/caddy` in Caddy container
- **Rationale**:
  - Prevents certificate re-issuance on container restart (US1 acceptance criteria)
  - Protects against Let's Encrypt rate limits (50 certs/domain/week)
  - Preserves certificate metadata and renewal state
  - Standard Docker pattern for stateful data
- **Alternatives**:
  - Host bind mount: Works but less portable, Docker volume is best practice
  - No persistence: Dangerous (rate limit risk), violates FR-002
  - External secret management: Overkill for SSL certs (not application secrets)
- **Source**: spec.md FR-002, Docker best practices

### Decision: HSTS with 6-Month Initial max-age
- **Decision**: Strict-Transport-Security header with max-age=15768000 (6 months)
- **Rationale**:
  - Meets US3 acceptance criteria (6 months initially)
  - Conservative initial value (can increase to 2 years after validation)
  - includeSubDomains enabled for marcusgoll.com (as specified in US3)
  - Prevents downgrade attacks, improves SSL Labs rating
- **Alternatives**:
  - 2-year max-age immediately: Risky (if HTTPS breaks, users locked out for 2 years)
  - No HSTS: Fails NFR-005 (SSL Labs A+ requirement), security risk
  - Shorter max-age (<6 months): Doesn't meet US3 requirement
- **Source**: spec.md US3, SSL Labs A+ criteria

### Decision: Deployment Checklist for DNS Validation
- **Decision**: Add DNS verification step to deployment checklist before Caddy deployment
- **Rationale**:
  - Prevents certificate issuance failure due to DNS misconfiguration (US4)
  - HTTP-01 challenge requires A record pointing to VPS IP
  - Failure results in self-signed cert fallback (browser warning)
  - Pre-flight validation saves debugging time
- **Alternatives**:
  - Skip validation, debug after deployment: Wastes time, poor UX
  - Automated DNS check script: Nice-to-have, but checklist sufficient for MVP
- **Source**: spec.md US4, A-001 assumption

---

## Components to Reuse (3 found)

- `infrastructure/Caddyfile`: Existing Caddy configuration with reverse proxy rules for marcusgoll.com, cfipros.com, subdomains
- `docker-compose.prod.yml`: Production Docker Compose orchestration (will add Caddy service)
- `Dockerfile`: Multi-stage Next.js build (no changes needed for SSL)

---

## New Components Needed (2 required)

- Docker Compose Caddy service: New service definition with volume mount, ports 80/443, network config
- Deployment checklist: DNS validation step document (markdown file or inline in OPERATIONS_RUNBOOK.md)

---

## Unknowns & Questions

None - all technical questions resolved. Requirements are clear and implementation path is straightforward.

---

## Architecture Validation

**Constitution Alignment Check** (from `.spec-flow/memory/constitution.md`):
- ✅ **Security**: SSL/TLS is core security requirement (Principle 5: Security Practices)
- ✅ **Performance**: Caddy HTTP/2 support maintains performance targets (Principle 3)
- ✅ **Simplicity**: Leverage Caddy's built-in automation, no overengineering (Principle 8: Do Not Overengineer)
- ✅ **Documentation**: Deployment checklist documents DNS prerequisite (Principle 7)
- ✅ **Testing**: SSL Labs validation provides objective quality gate (Principle 2)

**No constitution violations detected.**

---

## Caddy Existing Configuration Analysis

**File**: `infrastructure/Caddyfile` (38 lines)

**Current Configuration**:
- Email configured: `marcusgoll@gmail.com` (Let's Encrypt notifications)
- Domains configured:
  - `marcusgoll.com` → reverse_proxy ghost:2368 (will change to next:3000)
  - `cfipros.com` → reverse_proxy next:3000
  - `ghost.marcusgoll.com` → reverse_proxy ghost:2368
  - `api.marcusgoll.com` → reverse_proxy kong:8002
  - `api.cfipros.com` → reverse_proxy api:8000
  - www redirects (308 permanent)

**What's Missing**:
- No explicit HSTS header configuration (Caddy default is short max-age)
- No Docker Compose service for Caddy (currently external)
- No persistent volume mount for `/data/caddy`
- No port mapping (80/443)

**Required Changes**:
1. Add HSTS header directive to Caddyfile (each domain block)
2. Create Caddy service in `docker-compose.prod.yml`
3. Mount volume: `caddy-data:/data/caddy`
4. Expose ports 80 and 443
5. Update marcusgoll.com reverse proxy target (ghost:2368 → next:3000)

---

## Let's Encrypt Rate Limits

**Limits** (from Let's Encrypt documentation):
- **Certificates per Registered Domain**: 50 per week
- **Duplicate Certificates**: 5 per week (same exact set of names)
- **Failed Validation**: 5 failures per account per hostname per hour

**Mitigation Strategy**:
- Persistent volume prevents duplicate requests on container restart (FR-002)
- DNS validation in deployment checklist prevents failed challenges
- Separate certificates per domain (marcusgoll.com, cfipros.com, subdomains) stay well under 50/week limit

**Current Usage**: None (new deployment)

---

## Security Headers Research

**SSL Labs A+ Requirements**:
1. TLS 1.2+ only (no SSL 3.0, TLS 1.0/1.1) ✅ Caddy default
2. Strong cipher suites only ✅ Caddy default (Mozilla Intermediate profile)
3. HSTS with long max-age ⚠️ Needs configuration (6 months → 2 years)
4. No mixed content ✅ Application responsibility (Next.js handles)
5. Valid certificate chain ✅ Let's Encrypt automatic

**Caddy Default Cipher Suites** (Mozilla Intermediate):
- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384

**Result**: No cipher configuration needed, Caddy defaults meet SSL Labs A+ requirements.

---

## Deployment Model Analysis

**From constitution.md**:
- **Deployment Model**: direct-prod (no staging environment)
- **Rationale**: Solo developer, low traffic (<1K visitors/mo), manual testing sufficient

**SSL/TLS Deployment Implications**:
- No staging SSL testing before production
- Must test DNS configuration carefully (one shot at production)
- Rollback strategy: Revert Caddyfile changes, restart container

**Risk Mitigation**:
- DNS validation checklist (pre-flight)
- HSTS with conservative 6-month max-age initially
- Monitor deployment logs for certificate issuance

---

## Certificate Renewal Monitoring (Priority 2 - US5)

**Requirement**: Alert if renewal fails before certificate expires

**Deferred to Enhancement**:
- US5 marked as Priority 2 (not MVP)
- MVP ships with automatic renewal, no monitoring
- Future enhancement: Cron job checks Caddy logs, alerts if expiry <14 days

**Rationale**: Let's Encrypt renewal is highly reliable (>99% success rate per spec NFR-003), monitoring is nice-to-have not blocker.
