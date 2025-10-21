# Tasks: Environment Management (.env)

## [CODEBASE REUSE ANALYSIS]

Scanned: D:\Coding\marcusgoll

**[EXISTING - REUSE]**
- ✅ .env.example (D:\Coding\marcusgoll\.env.example:1-22) - Has basic structure, needs enhancement
- ✅ .gitignore (D:\Coding\marcusgoll\.gitignore:34-36) - Already excludes .env files correctly
- ✅ Next.js 15.5.6 (package.json:16) - Built-in .env support, no dotenv needed
- ✅ lib/ghost.ts (D:\Coding\marcusgoll\lib\ghost.ts:4-8) - Pattern for accessing env vars with fallback
- ✅ lib/prisma.ts (D:\Coding\marcusgoll\lib\prisma.ts:10) - Pattern for accessing NODE_ENV
- ✅ package.json (D:\Coding\marcusgoll\package.json:3) - Version field for semantic versioning

**[NEW - CREATE]**
- 🆕 lib/validate-env.ts - Runtime validation function (no existing pattern)
- 🆕 docker-compose.yml - Development orchestration (no existing Docker setup)
- 🆕 docker-compose.prod.yml - Production orchestration (no existing Docker setup)
- 🆕 docs/ENV_SETUP.md - Environment setup guide (docs/ exists but no env guide)
- 🆕 Enhanced .env.example - Add inline documentation to existing file

---

## [DEPENDENCY GRAPH]

Story completion order:
1. **Phase 1: Setup** (1 task) - Create project structure
2. **Phase 2: US1 [P1]** (2 tasks) - .env.example template (FOUNDATIONAL - blocks all other stories)
3. **Phase 3: US2 [P1]** (1 task) - Git safety verification (independent, can run parallel with US3-US4)
4. **Phase 4: US3 [P1]** (1 task) - Next.js env loading verification (depends on US1, independent from US2)
5. **Phase 5: US4 [P1]** (3 tasks) - Runtime validation (depends on US1, US3, independent from US2)
6. **Phase 6: US5 [P2]** (2 tasks) - Docker Compose integration (depends on US1, US3, US4)
7. **Phase 7: US6 [P2]** (2 tasks) - Production deployment docs (depends on US1, US2, independent from others)
8. **Phase 8: Polish** (3 tasks) - Deployment preparation, documentation

**Critical Path**: US1 → US3 → US4 → US5 (8 tasks) - Must complete in order
**Parallel Opportunities**: US2 can run independently, US6 can run after US1+US2

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **After US1 complete**: US2, US3, US6 (3 tasks can run in parallel)
- **After US3 complete**: US4 tasks (T010, T011, T012 - different files, no dependencies)
- **After US4 complete**: US5 tasks (T015, T016 - different files)
- **Anytime after US1**: US6 tasks (T020, T021 - documentation only)

**Total parallelizable**: 8 tasks out of 15 (53%)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phase 2-5 (US1-US4) - Core environment management
- US1: .env.example template
- US2: Git safety
- US3: Next.js loading
- US4: Runtime validation

**Incremental Delivery**:
1. Ship US1-US4 (MVP) → staging validation → production
2. Ship US5 (Docker Compose) → staging validation → production
3. Ship US6 (Production docs) → documentation update only
4. US7 (Type safety) deferred to P3 (future enhancement)

**Testing Approach**: Manual testing only (no automated tests required by spec)
- US1: Manual - Copy .env.example, verify structure
- US2: Manual - Git status verification
- US3: Manual - App startup with .env.local
- US4: Manual - Remove env var, verify error message
- US5: Manual - Docker Compose up, verify services
- US6: Manual - Follow deployment guide

**TDD**: Not required (infrastructure feature, manual acceptance testing sufficient)

---

## Phase 1: Setup

- [ ] T001 Create project structure for environment management per plan.md
  - Files: lib/ directory (already exists), docs/ directory (already exists)
  - Verify: .env.example exists, .gitignore exists
  - Pattern: Existing project structure
  - From: plan.md [STRUCTURE] (line 42-59)

---

## Phase 2: User Story 1 [P1] - .env.example template

**Story Goal**: Developer has .env.example template with all required variables documented

**Acceptance Criteria** (from spec.md:34-41):
- .env.example exists with all required variables listed
- Each variable has inline comments explaining its purpose
- Example values provided where safe (non-sensitive)
- Grouped by service (Next.js, Ghost CMS, MySQL, Third-party)

**Independent Test**: Copy .env.example to .env.local, fill values, verify app starts

### Implementation

- [ ] T005 [US1] Enhance .env.example with inline documentation for all 12 variables
  - File: .env.example (D:\Coding\marcusgoll\.env.example)
  - REUSE: Existing .env.example structure (lines 1-22)
  - Add: Inline comments for each variable (purpose, where to get value, required/optional)
  - Add: PUBLIC_URL, NODE_ENV, DIRECT_DATABASE_URL variables (not currently in file)
  - Add: GA4_MEASUREMENT_ID, EMAIL_SERVICE_API_KEY variables (optional, for future)
  - Group by: Next.js, Database, Supabase, Ghost CMS, Third-Party Services
  - Pattern: lib/ghost.ts:4-8 (env var access with fallback)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] Enhanced .env.example (line 203-209)
  - From: plan.md [CI/CD IMPACT] Environment Variables section (line 233-266)

- [ ] T006 [P] [US1] Create .env.local from .env.example for local development testing
  - File: .env.local (D:\Coding\marcusgoll\.env.local) - gitignored
  - Action: Copy .env.example to .env.local
  - Fill: Development values (localhost URLs, test API keys)
  - Verify: File is gitignored (should not appear in git status)
  - Pattern: quickstart.md Scenario 1 (line 7-34)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] .gitignore (line 150-154)

---

## Phase 3: User Story 2 [P1] - Git safety verification

**Story Goal**: All .env files automatically ignored by git, never accidentally committed

**Acceptance Criteria** (from spec.md:43-49):
- .gitignore contains .env.local and .env.production patterns
- Git status never shows .env files as untracked
- Pre-commit hook (optional) warns if attempting to commit files containing secrets

**Independent Test**: Create .env.local, run git status, verify not shown

### Implementation

- [ ] T007 [P] [US2] Verify .gitignore patterns and audit git history for leaked secrets
  - File: .gitignore (D:\Coding\marcusgoll\.gitignore:34-36)
  - REUSE: Existing .gitignore patterns (.env, .env*.local, .env.production)
  - Action: Verify patterns are correct (already correct per research.md:56)
  - Audit: Run `git log --all --full-history -- "*env*"` to check history
  - Verify: .env.local not shown in git status
  - Pattern: quickstart.md Scenario 4 (line 197-204)
  - From: plan.md [SECURITY] Data Protection (line 128-131)
  - From: plan.md [SECURITY] Security Checklist (line 133-138)

---

## Phase 4: User Story 3 [P1] - Next.js env loading verification

**Story Goal**: Next.js loads environment variables from .env.local for local development

**Acceptance Criteria** (from spec.md:51-58):
- Next.js automatically loads .env.local on startup
- Environment variables accessible via process.env.VARIABLE_NAME
- NEXT_PUBLIC_* variables available in browser
- Server-side variables not exposed to browser

**Independent Test**: Add test variable to .env.local, access in page/API route

### Implementation

- [ ] T008 [US3] Verify Next.js environment variable loading and document behavior
  - Files: .env.local (already created in T006)
  - REUSE: Next.js 15.5.6 built-in .env support (package.json:16)
  - Action: Start dev server with .env.local, verify variables load
  - Test: Access process.env variables in server component/API route
  - Test: Verify NEXT_PUBLIC_* variables available in browser console
  - Test: Verify server-side variables NOT in browser bundle
  - Document: Add section to NOTES.md about Next.js env precedence
  - Pattern: lib/ghost.ts:5-6 (accessing process.env.GHOST_API_URL)
  - Pattern: lib/prisma.ts:10 (accessing process.env.NODE_ENV)
  - From: plan.md [ARCHITECTURE DECISIONS] Environment Loading (line 25)
  - From: research.md Decision: Use Next.js Built-in Support (line 5-12)

---

## Phase 5: User Story 4 [P1] - Runtime validation

**Story Goal**: Runtime validation of required environment variables with clear error messages

**Acceptance Criteria** (from spec.md:60-67):
- Application validates required variables on startup
- Missing variables throw error with variable name and description
- Validation runs before server starts accepting requests
- Clear error message format: "Missing required environment variable: VARIABLE_NAME - Description of what it's for"

**Independent Test**: Remove required variable, start app, verify error message

### Setup

- [ ] T010 [P] [US4] Create lib/validate-env.ts with validation function
  - File: lib/validate-env.ts (NEW - D:\Coding\marcusgoll\lib\validate-env.ts)
  - Function: validateEnvironmentVariables() - validates required vars at startup
  - Required vars: 8 (PUBLIC_URL, NODE_ENV, DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GHOST_API_URL, GHOST_CONTENT_API_KEY)
  - Optional vars: 4 (DIRECT_DATABASE_URL, GHOST_ADMIN_API_KEY, GA4_MEASUREMENT_ID, EMAIL_SERVICE_API_KEY)
  - Validation: Presence check + URL format validation (regex: ^https?://)
  - Error format: "Missing required environment variable: ${varName}\nPlease check .env.example for required configuration."
  - Performance: Target <50ms for 12 variables (simple checks, no external calls)
  - Pattern: data-model.md Validation Function (line 83-118)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] Validation Module (line 172-180)
  - From: plan.md [PERFORMANCE TARGETS] Validation Performance (line 97-100)

- [ ] T011 [P] [US4] Create TypeScript interface for environment variables (documentation only)
  - File: lib/env-schema.ts (NEW - D:\Coding\marcusgoll\lib\env-schema.ts)
  - Purpose: Document environment variable types (not enforced in MVP)
  - Interface: EnvironmentVariables with all 12 variables
  - JSDoc: Comments explaining each variable's purpose
  - Note: Type-safe access deferred to P3 (US7)
  - Pattern: data-model.md Environment Variable Schema (line 57-81)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] Environment Schema (line 211-215)
  - From: research.md Decision: No Type-Safe Access for MVP (line 43-49)

### Implementation

- [ ] T012 [US4] Integrate validation function into Next.js app startup
  - File: Create instrumentation.ts or update root layout (depends on Next.js pattern)
  - Action: Call validateEnvironmentVariables() before app initialization
  - Timing: Must run before server accepts requests (fail-fast approach)
  - Test: Remove DATABASE_URL from .env.local, start app, verify clear error
  - Test: Add invalid URL format, verify format validation error
  - Test: Verify validation completes in <100ms (NFR-005)
  - Pattern: plan.md [ARCHITECTURE DECISIONS] Validation at Startup (line 32)
  - From: plan.md [PERFORMANCE TARGETS] Validation Performance (line 95-100)
  - From: spec.md NFR-002 (line 176)

---

## Phase 6: User Story 5 [P2] - Docker Compose integration

**Story Goal**: Docker Compose loads environment variables from .env file for all services

**Acceptance Criteria** (from spec.md:71-78):
- docker-compose.yml references .env file via env_file directive
- Ghost CMS service receives Ghost-specific variables
- MySQL service receives database configuration
- Next.js service receives all application variables
- Verify with docker-compose config command

**Depends on**: US1 (.env.example), US3 (Next.js loading), US4 (validation)

### Implementation

- [ ] T015 [P] [US5] Create docker-compose.yml for development environment
  - File: docker-compose.yml (NEW - D:\Coding\marcusgoll\docker-compose.yml)
  - Services: ghost (Ghost CMS), mysql (MySQL 8.0), nextjs (Next.js app)
  - env_file: .env (loaded for all services)
  - Ports: 3000 (Next.js), 2368 (Ghost), 3306 (MySQL)
  - Volumes: MySQL data persistence, Ghost content
  - depends_on: nextjs depends on ghost and mysql
  - Pattern: data-model.md Docker Compose Configuration (line 122-156)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] Docker Compose Files (line 182-186)
  - From: research.md Decision: Docker Compose Integration (line 33-40)

- [ ] T016 [P] [US5] Create docker-compose.prod.yml for production environment
  - File: docker-compose.prod.yml (NEW - D:\Coding\marcusgoll\docker-compose.prod.yml)
  - Services: Same as dev but production-optimized
  - env_file: .env.production (not .env)
  - Health checks: All services have health check endpoints
  - Restart policies: always (auto-restart on failure)
  - Resource limits: CPU and memory constraints
  - Security: Non-root users, read-only file systems where possible
  - Pattern: docker-compose.yml (T015) with production hardening
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] Docker Compose Files (line 188-192)

---

## Phase 7: User Story 6 [P2] - Production deployment documentation

**Story Goal**: Secure method to transfer .env.production to VPS documented

**Acceptance Criteria** (from spec.md:82-88):
- Documentation explains secure transfer methods (scp, rsync, or secrets manager)
- .env.production explicitly in .gitignore
- Git history audited to ensure no past .env commits exist
- Deployment script references .env.production from secure location

**Depends on**: US1 (.env.example), US2 (git safety)

### Implementation

- [ ] T020 [P] [US6] Create docs/ENV_SETUP.md with environment setup guide
  - File: docs/ENV_SETUP.md (NEW - D:\Coding\marcusgoll\docs\ENV_SETUP.md)
  - Sections:
    1. Local development setup (copy .env.example to .env.local)
    2. Docker Compose setup (creating .env for Docker)
    3. Production deployment to VPS (secure transfer via scp/rsync)
    4. Troubleshooting common issues
    5. Adding new environment variables (team workflow)
  - Include: File permission commands (chmod 600, chown www-data)
  - Include: Validation checklist for each scenario
  - Pattern: quickstart.md (all 5 scenarios, line 1-270)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] Documentation (line 194-201)

- [ ] T021 [P] [US6] Document rollback procedure and feature flag in NOTES.md
  - File: specs/001-environment-manageme/NOTES.md (UPDATE existing)
  - Section: Deployment Rollback Procedure
  - Commands: Restore .env.production from backup, restart app
  - Feature flag: N/A (infrastructure, no feature flag needed)
  - Document: Environment variable changes require app restart
  - Document: NEXT_PUBLIC_* changes require rebuild
  - Pattern: plan.md [DEPLOYMENT ACCEPTANCE] Rollback Plan (line 333-342)
  - From: plan.md [CI/CD IMPACT] Deployment Workflow (line 269-275)

---

## Phase 8: Polish & Cross-Cutting Concerns

### Documentation & Deployment Preparation

- [ ] T085 Update README.md with environment setup quick start
  - File: README.md (UPDATE - D:\Coding\marcusgoll\README.md)
  - Section: Environment Setup (link to docs/ENV_SETUP.md)
  - Quick start: 3 steps (copy .env.example, fill values, verify app starts)
  - Link: Detailed guide in docs/ENV_SETUP.md
  - From: spec.md NFR-004 (line 178)

- [ ] T086 [P] Add health check endpoint for environment validation
  - File: app/api/health/route.ts (NEW - D:\Coding\marcusgoll\app\api\health\route.ts)
  - Endpoint: GET /api/health
  - Response: { status: "ok", env: "development"|"production", timestamp }
  - Check: Environment variables loaded (presence check only, not values)
  - Pattern: plan.md [DEPLOYMENT ACCEPTANCE] Production Deployment Checklist (line 322-331)

- [ ] T087 [P] Document environment variable change process in NOTES.md
  - File: specs/001-environment-manageme/NOTES.md (UPDATE existing)
  - Section: Adding New Environment Variables
  - Process:
    1. Add to .env.example with documentation
    2. Update lib/validate-env.ts if required variable
    3. Update lib/env-schema.ts interface
    4. Update docs/ENV_SETUP.md
    5. Notify team to update .env.local
    6. Update production .env.production on VPS
    7. Restart application
  - Pattern: quickstart.md Scenario 5 (line 217-270)
  - From: plan.md [CI/CD IMPACT] Deployment Workflow (line 269-275)

---

## [TASK SUMMARY]

**Total Tasks**: 15
- Phase 1 (Setup): 1 task
- Phase 2 (US1 - .env.example): 2 tasks
- Phase 3 (US2 - Git safety): 1 task
- Phase 4 (US3 - Next.js loading): 1 task
- Phase 5 (US4 - Runtime validation): 3 tasks
- Phase 6 (US5 - Docker Compose): 2 tasks
- Phase 7 (US6 - Production docs): 2 tasks
- Phase 8 (Polish): 3 tasks

**User Story Tasks**: 11 (marked with [US1]-[US6])
**Parallel Opportunities**: 8 tasks (marked with [P])
**MVP Scope**: 8 tasks (US1-US4) - Priority 1
**Enhancement Scope**: 4 tasks (US5-US6) - Priority 2
**Polish**: 3 tasks - Cross-cutting concerns

**Critical Path**: T001 → T005 → T006 → T008 → T010 → T011 → T012 (7 tasks, ~12-15 hours)

**Files to Create**: 7 new files
- lib/validate-env.ts
- lib/env-schema.ts
- docker-compose.yml
- docker-compose.prod.yml
- docs/ENV_SETUP.md
- app/api/health/route.ts
- instrumentation.ts (or update root layout)

**Files to Update**: 3 existing files
- .env.example (enhance with documentation)
- README.md (add environment setup section)
- specs/001-environment-manageme/NOTES.md (add rollback and change process)

**REUSE Components**: 6 existing components identified and documented
