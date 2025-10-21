# Implementation Plan: Environment Management (.env)

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15 built-in environment variable support (no additional libraries)
- Components to reuse: 4 (.env.example template, .gitignore patterns, package.json, Next.js app)
- New components needed: 5 (validation module, docker-compose.yml, enhanced docs, schema, setup guide)

**Key Decisions**:
1. **Use Next.js Native Support**: No dotenv library needed, Next.js 15 handles .env loading automatically
2. **Extend Existing Template**: Enhance current .env.example rather than create new
3. **Custom Validation**: Lightweight validation function for MVP, save type-safe access for P3
4. **Docker Compose Integration**: Use env_file directive for service configuration
5. **Git Safety First**: Leverage existing .gitignore patterns, audit history for leaks

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- **Frontend/Backend**: Next.js 15.5.6 App Router (existing)
- **Environment Loading**: Next.js built-in .env support (native, no libraries needed)
- **Validation**: Custom validation function (lightweight, clear error messages)
- **Docker**: Docker Compose with env_file directive
- **Deployment**: VPS with secure file transfer (scp/rsync)

**Patterns**:
- **File-based Configuration**: .env files for environment-specific values (industry standard)
- **Validation at Startup**: Fail-fast approach - validate all required vars before accepting requests
- **Clear Error Messages**: Include variable name, purpose, and example in error output
- **Gitignore Protection**: Multiple layers (.env, .env*.local, .env.production all excluded)
- **Precedence Order**: .env.local (dev) > .env.production (prod) > .env (fallback) > .env.example (template only)

**Dependencies** (new packages required):
- **None** - All functionality provided by Next.js built-in features and custom code

---

## [STRUCTURE]

**Directory Layout** (following Next.js conventions):

```
marcusgoll/
├── .env.example              # Template (COMMITTED - enhanced with docs)
├── .env.local                # Development (GITIGNORED - created by developer)
├── .env.production           # Production (GITIGNORED - on VPS only)
├── .gitignore                # (EXISTING - already has correct patterns)
├── docker-compose.yml        # (NEW - for local development)
├── docker-compose.prod.yml   # (NEW - for production deployment)
├── package.json              # (EXISTING - no changes needed)
├── lib/
│   └── validate-env.ts       # (NEW - runtime validation function)
└── docs/
    └── ENV_SETUP.md          # (NEW - setup guide with secure transfer instructions)
```

**Module Organization**:
- **lib/validate-env.ts**: Runtime validation - checks required vars, validates formats, throws clear errors
- **.env.example**: Template with inline comments documenting each variable's purpose
- **docker-compose.yml**: Development stack (Next.js with PostgreSQL via Supabase)
- **docker-compose.prod.yml**: Production stack with production-optimized settings
- **docs/ENV_SETUP.md**: Step-by-step guide for environment setup and secure deployment

---

## [DATA MODEL]

See: data-model.md for complete details

**Summary**:
- Entities: 0 (infrastructure feature, no database entities)
- Configuration Files: 3 (.env.example, .env.local, .env.production)
- Validation Schema: 1 (TypeScript interface for documentation)
- Migrations required: No
- Database changes: No

**Environment Variable Categories**:
1. **Next.js**: PUBLIC_URL, NODE_ENV (2 variables)
2. **Database**: DATABASE_URL, DIRECT_DATABASE_URL (2 variables, 1 optional)
3. **Supabase**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (3 variables)
4. **Newsletter Service**: RESEND_API_KEY (or MAILGUN_API_KEY), NEWSLETTER_FROM_EMAIL (2 variables, both required for newsletter functionality)
5. **Third-Party**: GA4_MEASUREMENT_ID (1 variable, optional for MVP)

**Total**: 10 variables (8 required, 2 optional)

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-005: Environment variable validation MUST complete in <100ms (negligible startup impact)

**Validation Performance**:
- Target: <50ms for validation of 10 variables
- Strategy: Simple presence checks and regex validation (no external calls)
- Impact: Negligible - runs once at startup, not on every request

**Build Performance**:
- No build impact - environment variables loaded at runtime, not build time (except NEXT_PUBLIC_*)
- NEXT_PUBLIC_* variables baked into build - requires rebuild if changed (Next.js standard behavior)

**Runtime Performance**:
- Access via process.env is O(1) lookup
- No performance impact after initial validation

---

## [SECURITY]

**Authentication Strategy**:
- N/A - Infrastructure feature, no user authentication required

**Authorization Model**:
- File system permissions on VPS: .env.production must have 600 permissions (owner read/write only)
- Owned by web server user (www-data or similar)

**Input Validation**:
- Runtime validation at startup (custom function)
- Format validation for URLs (regex: `^https?://`)
- Presence validation for required variables
- No empty values allowed for required variables

**Data Protection**:
- Git exclusion: .env, .env*.local, .env.production all in .gitignore (existing, verified)
- Secure transfer: scp/rsync for .env.production to VPS (documented in ENV_SETUP.md)
- No client-side exposure: Server-side variables not included in browser bundle (Next.js enforces this)
- NEXT_PUBLIC_* prefix required for client-side variables (explicit opt-in)

**Security Checklist** (from spec):
1. No secrets committed to git (verified via .gitignore:34-36)
2. Git history audit recommended: `git log --all --full-history -- "*env*"`
3. Restricted file permissions on VPS: chmod 600 .env.production
4. Secret rotation documented (update .env, restart app)
5. Example values only in .env.example (no real API keys)

---

## [EXISTING INFRASTRUCTURE - REUSE] (4 components)

**Configuration Files**:
- **.env.example**: Existing template with DATABASE_URL, Supabase configuration
  - Location: ./.env.example
  - Lines: 1-22
  - Enhancement: Add inline documentation comments for each variable, add newsletter service variables

**.gitignore Patterns**: Already excludes environment files
  - Location: ./.gitignore
  - Lines: 34-36
  - Patterns: .env, .env*.local, .env.production
  - Status: ✅ Correct, no changes needed

**Application Framework**:
- **Next.js App**: Built-in environment variable loading via process.env
  - Version: 15.5.6 (package.json:17)
  - Feature: Native .env file support with precedence order
  - Status: ✅ Ready to use, no configuration needed

**Version Management**:
- **package.json**: Contains version field for semantic versioning
  - Location: ./package.json:3
  - Current version: 1.0.0
  - Usage: Track releases tied to environment changes

---

## [NEW INFRASTRUCTURE - CREATE] (5 components)

**Validation Module**:
- **lib/validate-env.ts**: Runtime environment variable validation
  - Purpose: Validate required variables at application startup
  - Functionality:
    - Check presence of required variables
    - Validate URL formats (PUBLIC_URL, GHOST_API_URL, etc.)
    - Throw clear error messages with variable name and description
    - Run before app accepts requests (fail-fast)
  - Error format: `Missing required environment variable: VARIABLE_NAME - Description and example`

**Docker Compose Files**:
- **docker-compose.yml**: Development environment orchestration
  - Services: Next.js application
  - env_file directive: Load from .env file
  - Ports: 3000 (Next.js)
  - Note: PostgreSQL provided by Supabase (cloud or self-hosted), not in docker-compose

- **docker-compose.prod.yml**: Production environment orchestration
  - Similar to dev but with production optimizations
  - Health checks for all services
  - Restart policies: always
  - Resource limits: CPU and memory constraints

**Documentation**:
- **docs/ENV_SETUP.md**: Environment setup and deployment guide
  - Sections:
    - Local development setup (copy .env.example to .env.local)
    - Docker Compose setup
    - Production deployment (secure transfer to VPS)
    - Troubleshooting common issues
    - Adding new environment variables

**Enhanced .env.example**:
- **Inline Documentation**: Add comments explaining each variable
  - Format: `# Category: Service Name`
  - `# Description: What this variable does`
  - `# Example: VARIABLE_NAME="example-value"`
  - `# Required: Yes/No`
  - `# Where to get: Instructions for obtaining value`

**Environment Schema**:
- **lib/env-schema.ts** (optional, for documentation):
  - TypeScript interface defining all environment variables
  - JSDoc comments with descriptions
  - Not enforced in MVP (save for P3 user story US7)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: VPS with Docker Compose (self-hosted per constitution)
- Env vars: 12 new variables documented (8 required, 4 optional)
- Breaking changes: No (new feature, no existing functionality affected)
- Migration: No database migrations required

**Build Commands**:
- No changes required - existing npm scripts work as-is:
  - `npm run dev` - Development server
  - `npm run build` - Production build
  - `npm run start` - Production server

**Environment Variables** (all documented in .env.example):

**Required (8)**:
1. `PUBLIC_URL` - Base URL for application
   - Development: http://localhost:3000
   - Production: https://marcusgoll.com
2. `NODE_ENV` - Environment mode
   - Development: development
   - Production: production
3. `DATABASE_URL` - PostgreSQL connection string
   - Development: postgresql://postgres:password@localhost:5432/marcusgoll_dev
   - Production: postgresql://user:password@localhost:5432/marcusgoll_prod
4. `NEXT_PUBLIC_SUPABASE_URL` - Supabase API URL
   - Development: http://localhost:54321 or cloud URL
   - Production: https://api.marcusgoll.com
5. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
   - Development: Get from local Supabase or cloud dashboard
   - Production: Get from production Supabase dashboard
6. `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
   - Development: Get from local Supabase or cloud dashboard
   - Production: Get from production Supabase dashboard
7. `RESEND_API_KEY` (or `MAILGUN_API_KEY`) - Newsletter/email service API key
   - Development: Get from Resend or Mailgun dashboard (test mode)
   - Production: Production API key from Resend or Mailgun
8. `NEWSLETTER_FROM_EMAIL` - Verified sender email address
   - Development: test@marcusgoll.com (must be verified in service)
   - Production: newsletter@marcusgoll.com (must be verified)

**Optional (2)**:
9. `DIRECT_DATABASE_URL` - Direct database connection (optional, bypasses pooling)
10. `GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID (optional for MVP)

**Schema Update Required**: Yes - Create env-schema.ts for documentation (not enforced in MVP)

**Deployment Workflow**:
1. Developer updates .env.example with new variables (if added)
2. CI/CD does NOT need .env files (not in repository)
3. Production deployment: Securely transfer .env.production to VPS via scp/rsync
4. On VPS: Set file permissions (chmod 600 .env.production)
5. Restart application: docker-compose restart or npm run start

---

## [DATABASE MIGRATIONS]

**Not required** - No database schema changes for this infrastructure feature.

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- **Scenario 1**: Initial development setup (copy .env.example to .env.local)
- **Scenario 2**: Docker Compose setup (create .env for Docker)
- **Scenario 3**: Production deployment to VPS (secure transfer of .env.production)
- **Scenario 4**: Validation & troubleshooting (verify environment config)
- **Scenario 5**: Adding new environment variables (update template and local files)

**Key Integration Points**:
1. Next.js startup (validation runs before server starts)
2. Docker Compose (env_file directive loads variables)
3. VPS deployment (secure file transfer and permissions)
4. Newsletter Service (API keys configured via env vars - Resend or Mailgun)
5. Supabase (connection configured via env vars)

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- ✅ No breaking NEXT_PUBLIC_* env var changes without migration (not applicable - new feature)
- ✅ Backward-compatible (new feature, no existing functionality affected)
- ✅ No database migrations (infrastructure only)
- ✅ Feature flags not needed (configuration management, always active)

**Pre-Deployment Checklist**:
```gherkin
Given developer has created .env.example with all required variables
When developer commits .env.example to git
Then .env.example is committed
  And .env.local is NOT committed (gitignored)
  And .env.production is NOT committed (gitignored)
  And git history contains no secrets (audited)
```

**Production Deployment Checklist**:
```gherkin
Given .env.production file exists with production values
When deploying to VPS
Then .env.production is securely transferred via scp/rsync
  And file permissions are set to 600 (owner read/write only)
  And file is owned by web server user
  And application starts without validation errors
  And all services can access required environment variables
```

**Rollback Plan**:
- **Deployment IDs**: Not applicable (configuration change, not deployment artifact)
- **Rollback Commands**:
  1. Restore previous .env.production from backup
  2. Restart application (docker-compose restart or npm run start)
  3. Verify application starts successfully
- **Special Considerations**:
  - Keep backup of .env.production before making changes
  - Document all changes to environment variables
  - Test in development before applying to production

---

## [OUT OF SCOPE]

**Explicitly NOT included in this feature** (from spec):
1. **Secrets Manager Integration**: HashiCorp Vault, AWS Secrets Manager (can add later)
2. **Environment Variable Encryption**: Encrypted .env files (can add later if needed)
3. **Dynamic Environment Variables**: Runtime updates without restart (not supported by Next.js)
4. **Environment Variable UI**: Admin interface for managing variables (CLI/file-based only)
5. **Multi-Region Configuration**: Different configs for different geographic regions
6. **Type-Safe Access**: t3-env or similar (saved for P3 user story US7)

---

## [REFERENCES]

- **Specification**: specs/001-environment-manageme/spec.md
- **Research Findings**: specs/001-environment-manageme/research.md
- **Data Model**: specs/001-environment-manageme/data-model.md
- **Integration Scenarios**: specs/001-environment-manageme/quickstart.md
- **Constitution**: .spec-flow/memory/constitution.md (deployment model, security principles)
- **Roadmap Issue**: #31 (ICE Score: 4.00 - HIGHEST PRIORITY)
- **Next.js Environment Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- **Docker Compose env_file**: https://docs.docker.com/compose/environment-variables/set-environment-variables/
