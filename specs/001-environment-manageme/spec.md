# Feature Specification: Environment Management (.env)

**Branch**: `feature/001-environment-manageme`
**Created**: 2025-10-21
**Status**: Draft
**Roadmap Issue**: #31 (ICE Score: 4.00 - HIGHEST PRIORITY)

## User Scenarios

### Primary User Story
As a developer setting up the Marcus Gollahon personal website, I need a secure and standardized way to manage environment variables across development, staging, and production environments so that I can quickly configure the application without risking exposure of sensitive credentials.

### Acceptance Scenarios
1. **Given** I am setting up the project for the first time, **When** I copy .env.example to .env.local and fill in my values, **Then** the Next.js app loads all environment variables and validates required ones at startup
2. **Given** I have configured .env.local for development, **When** I run Docker Compose, **Then** all services (Ghost CMS, MySQL, Next.js) have access to their required environment variables
3. **Given** I am deploying to production, **When** I securely transfer .env.production to the VPS, **Then** the application runs with production configuration without exposing secrets in git history
4. **Given** a required environment variable is missing, **When** the application starts, **Then** it throws a clear validation error indicating which variable is missing and where to configure it

### Edge Cases
- What happens when an environment variable has an invalid format (e.g., malformed URL)?
- How does the system handle optional vs required environment variables?
- What happens if .env.production exists locally but should never be committed?
- How do we handle secret rotation without downtime?

## User Stories (Prioritized)

> **Purpose**: Break down feature into independently deliverable stories for MVP-first delivery.
> **Format**: [P1] = MVP (ship first), [P2] = Enhancement, [P3] = Nice-to-have

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer, I want a .env.example template with all required variables documented so that I can quickly set up my development environment
  - **Acceptance**:
    - .env.example exists with all required variables listed
    - Each variable has inline comments explaining its purpose
    - Example values provided where safe (non-sensitive)
    - Grouped by service (Next.js, Ghost CMS, MySQL, Third-party)
  - **Independent test**: Copy .env.example to .env.local, fill values, verify app starts
  - **Effort**: XS (<2 hours)

- **US2** [P1]: As a developer, I want all .env files automatically ignored by git so that I never accidentally commit secrets
  - **Acceptance**:
    - .gitignore contains .env.local and .env.production patterns
    - Git status never shows .env files as untracked
    - Pre-commit hook (optional) warns if attempting to commit files containing secrets
  - **Independent test**: Create .env.local, run git status, verify not shown
  - **Effort**: XS (<1 hour)

- **US3** [P1]: As a developer, I want Next.js to load environment variables from .env.local so that my local development uses correct configuration
  - **Acceptance**:
    - Next.js automatically loads .env.local on startup
    - Environment variables accessible via process.env.VARIABLE_NAME
    - NEXT_PUBLIC_* variables available in browser
    - Server-side variables not exposed to browser
  - **Independent test**: Add test variable to .env.local, access in page/API route
  - **Effort**: XS (<2 hours)

- **US4** [P1]: As a developer, I want runtime validation of required environment variables so that I get clear errors if configuration is incomplete
  - **Acceptance**:
    - Application validates required variables on startup
    - Missing variables throw error with variable name and description
    - Validation runs before server starts accepting requests
    - Clear error message format: "Missing required environment variable: VARIABLE_NAME - Description of what it's for"
  - **Independent test**: Remove required variable, start app, verify error message
  - **Effort**: S (2-3 hours)

**Priority 2 (Enhancement)**

- **US5** [P2]: As a developer, I want Docker Compose to load environment variables from .env file so that all services have consistent configuration
  - **Acceptance**:
    - docker-compose.yml references .env file via env_file directive
    - Ghost CMS service receives Ghost-specific variables
    - MySQL service receives database configuration
    - Next.js service receives all application variables
    - Verify with docker-compose config command
  - **Depends on**: US1, US3
  - **Effort**: S (2-4 hours)

- **US6** [P2]: As a DevOps engineer, I want a secure method to transfer .env.production to VPS so that production configuration is never committed to git
  - **Acceptance**:
    - Documentation explains secure transfer methods (scp, rsync, or secrets manager)
    - .env.production explicitly in .gitignore
    - Git history audited to ensure no past .env commits exist
    - Deployment script references .env.production from secure location
  - **Depends on**: US1, US2
  - **Effort**: M (4-6 hours including documentation)

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a developer, I want type-safe environment variable access with autocomplete so that I avoid typos and know which variables are available
  - **Acceptance**:
    - TypeScript types generated from environment variable schema
    - IDE autocomplete for process.env variables
    - Compile-time errors for accessing non-existent variables
    - Runtime type validation matches TypeScript types
  - **Depends on**: US3, US4
  - **Effort**: M (6-8 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US4 first to establish basic environment management, then add Docker Compose integration (US5-US6), then enhance with type safety (US7) based on developer feedback.

## Visual References

N/A - Infrastructure feature with no UI components.

## Success Metrics (HEART Framework)

> **SKIPPED**: Infrastructure feature with no direct user behavior tracking.
>
> **Rationale**: This is a developer experience feature focused on configuration management. Success is measured by:
> - Reduced time to set up development environment (manual observation)
> - Zero secrets committed to git (audit)
> - Deployment success rate (operational metric)
>
> HEART metrics not applicable as there are no end-user interactions to track.

## Screens Inventory (UI Features Only)

> **SKIPPED**: Backend-only infrastructure feature (no UI components)

## Hypothesis

> **SKIPPED**: New feature (not improving an existing flow)

## Context Strategy & Signal Design

- **System prompt altitude**: Infrastructure-level - focus on security, configuration management best practices
- **Tool surface**: File system operations (Read, Write, Edit), git operations (commit, status)
- **Examples in scope**: ≤3 examples from Next.js env docs, Docker Compose env_file usage
- **Context budget**: 10k tokens (minimal for infrastructure feature)
- **Retrieval strategy**: JIT - fetch env variable docs only when needed
- **Memory artifacts**: NOTES.md updated on completion, TODO.md not needed (simple feature)
- **Compaction cadence**: Not needed (low context usage)
- **Sub-agents**: None - single-focus infrastructure task

## Requirements

### Functional (testable only)

- **FR-001**: System MUST provide .env.example template with all required environment variables documented with inline comments
- **FR-002**: System MUST load environment variables from .env.local file in development mode
- **FR-003**: System MUST load environment variables from .env.production file in production mode
- **FR-004**: System MUST validate presence of all required environment variables at application startup
- **FR-005**: System MUST throw clear, actionable error messages when required environment variables are missing
- **FR-006**: System MUST support the following Next.js environment variables:
  - PUBLIC_URL (base URL for the application)
  - NODE_ENV (development, production)
  - API endpoints (internal and external)
- **FR-007**: System MUST support the following Ghost CMS environment variables:
  - GHOST_API_URL (Ghost CMS API endpoint)
  - GHOST_CONTENT_API_KEY (Content API key for read operations)
  - GHOST_ADMIN_API_KEY (Admin API key for write operations)
- **FR-008**: System MUST support the following MySQL database environment variables:
  - DATABASE_HOST (MySQL host)
  - DATABASE_NAME (database name)
  - DATABASE_USER (database username)
  - DATABASE_PASSWORD (database password)
- **FR-009**: System MUST support the following third-party service environment variables:
  - GA4_MEASUREMENT_ID (Google Analytics 4 measurement ID)
  - EMAIL_SERVICE_API_KEY (email service API key, e.g., SendGrid/Resend)
- **FR-010**: Docker Compose MUST load environment variables from .env file for all services (Ghost, MySQL, Next.js)
- **FR-011**: System MUST never commit .env.local or .env.production files to git (enforced by .gitignore)
- **FR-012**: Documentation MUST explain secure methods for transferring .env.production to VPS

### Non-Functional

- **NFR-001**: Security: No secrets or sensitive configuration MUST ever be committed to git repository
- **NFR-002**: Security: Environment variable validation MUST complete before application accepts any requests
- **NFR-003**: Developer Experience: Missing environment variable errors MUST include variable name, description, and example value
- **NFR-004**: Developer Experience: .env.example MUST be kept in sync with actual required variables (documented in README)
- **NFR-005**: Performance: Environment variable validation MUST complete in <100ms (negligible startup impact)
- **NFR-006**: Maintainability: Environment variable groups MUST be clearly organized (Next.js, Ghost CMS, Database, Third-party)

### Key Entities (if data involved)

N/A - Configuration management feature with no database entities.

## Deployment Considerations

> **Purpose**: Document deployment constraints and dependencies for planning phase.

### Platform Dependencies

**VPS (Docker Compose)**:
- Requires .env.production file to be securely transferred (not in git)
- Docker Compose env_file directive used to load environment variables

**Next.js**:
- Requires restart when environment variables change
- NEXT_PUBLIC_* variables baked into build (requires rebuild if changed)

**Dependencies**:
- None - uses built-in Next.js environment variable support

### Environment Variables

**New Required Variables** (to be defined in .env.example):

**Next.js Configuration**:
- `PUBLIC_URL`: Base URL for the application (e.g., https://marcusgoll.com)
  - Development: http://localhost:3000
  - Production: https://marcusgoll.com
- `NODE_ENV`: Environment mode (development | production)
  - Development: development
  - Production: production

**Ghost CMS Configuration**:
- `GHOST_API_URL`: Ghost CMS API endpoint
  - Development: http://localhost:2368
  - Production: https://ghost.marcusgoll.com
- `GHOST_CONTENT_API_KEY`: Content API key (read-only access to posts)
  - Development: [generate from local Ghost instance]
  - Production: [generate from production Ghost instance]
- `GHOST_ADMIN_API_KEY`: Admin API key (optional, for write operations)
  - Development: [optional]
  - Production: [optional]

**Database Configuration**:
- `DATABASE_HOST`: MySQL host
  - Development: localhost or mysql (Docker service name)
  - Production: localhost or mysql (Docker service name)
- `DATABASE_NAME`: Database name
  - Development: marcusgoll_dev
  - Production: marcusgoll_prod
- `DATABASE_USER`: Database username
  - Development: dev_user
  - Production: [secure username]
- `DATABASE_PASSWORD`: Database password
  - Development: [local password]
  - Production: [strong password from secrets manager]

**Third-Party Services**:
- `GA4_MEASUREMENT_ID`: Google Analytics 4 measurement ID (optional for MVP)
  - Development: [optional - skip or use test property]
  - Production: G-XXXXXXXXXX
- `EMAIL_SERVICE_API_KEY`: Email service API key (optional for MVP, needed for contact form)
  - Development: [optional or test key]
  - Production: [API key from SendGrid/Resend]

**Changed Variables**:
- None (new feature, no existing variables to change)

**Schema Update Required**: Yes - Create `env.schema.json` in `/plan` phase for runtime validation

### Breaking Changes

**API Contract Changes**:
- No - Infrastructure change only, no API contract modifications

**Database Schema Changes**:
- No - Environment variables do not affect database schema

**Auth Flow Modifications**:
- No - Environment variables configure existing flows, no auth changes

**Client Compatibility**:
- Backward compatible - New environment variables don't affect existing functionality
- NEXT_PUBLIC_* variables require rebuild if changed (standard Next.js behavior)

### Migration Requirements

**Database Migrations**:
- Not required - No database schema changes

**Data Backfill**:
- Not required - No data changes

**RLS Policy Changes**:
- No - No database involvement

**Reversibility**:
- Fully reversible - Can revert to hardcoded configuration if needed

### Rollback Considerations

**Standard Rollback**:
- Yes: 3-command rollback via runbook/rollback.md
  1. Revert environment variable changes in .env.production
  2. Restart application (Docker Compose or process manager)
  3. Verify application startup with previous configuration

**Special Rollback Needs**:
- None - Environment variable changes are immediately reversible

**Deployment Metadata**:
- Deploy IDs not applicable (configuration change, not deployment)
- Environment variable changes tracked in NOTES.md

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (security, developer experience)
- [x] No implementation details (tech stack, APIs, code)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] SKIPPED - Infrastructure feature with no user behavior tracking

### Conditional: UI Features (Skip if backend-only)
- [x] SKIPPED - Backend-only infrastructure feature

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified: None
- [x] Environment variables documented: Yes (12 variables across 4 categories)
- [x] Rollback plan specified: Yes (3-command rollback, fully reversible)

---

## Assumptions

1. **Tech Stack**: Assumes Next.js 15+, Ghost CMS, MySQL 8.0, Docker Compose as specified in roadmap
2. **Secrets Management**: Assumes manual secure transfer for MVP (scp/rsync); can enhance with secrets manager (HashiCorp Vault, AWS Secrets Manager) in future
3. **Validation Library**: Assumes lightweight custom validation for MVP; can enhance with zod/joi in future if type-safe access needed (US7)
4. **Docker Compose Usage**: Assumes Docker Compose for both development and production deployment as specified in constitution
5. **Environment File Locations**: Assumes standard Next.js conventions (.env.local for dev, .env.production for prod)

## Security Considerations

1. **Git Safety**: All .env files MUST be in .gitignore before any development begins
2. **Audit Git History**: Run `git log --all --full-history -- "*env*"` to verify no past .env commits
3. **Secret Rotation**: Document process for rotating secrets without downtime (update .env, restart app)
4. **Access Control**: .env.production on VPS should have restricted file permissions (chmod 600)
5. **No Defaults for Secrets**: .env.example should NEVER contain real API keys or passwords, only placeholder values

## Out of Scope

The following are explicitly NOT part of this feature:
1. **Secrets Manager Integration**: HashiCorp Vault, AWS Secrets Manager, or similar (can add later)
2. **Environment Variable Encryption**: Encrypted .env files (can add later if needed)
3. **Dynamic Environment Variables**: Runtime environment variable updates without restart
4. **Environment Variable UI**: Admin interface for managing variables (CLI/file-based only)
5. **Multi-Region Configuration**: Different configurations for different geographic regions

## References

- Roadmap Issue: #31 (Environment Management - Score: 4.00)
- Next.js Environment Variables: https://nextjs.org/docs/basic-features/environment-variables
- Docker Compose env_file: https://docs.docker.com/compose/environment-variables/
- Constitution: `.spec-flow/memory/constitution.md` (deployment model, tech stack)
