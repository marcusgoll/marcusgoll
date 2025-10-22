# Research & Discovery: environment-manageme

## Research Decisions

### Decision: Use Next.js Built-in Environment Variable Support

- **Decision**: Leverage Next.js 15's native environment variable loading (no additional libraries needed)
- **Rationale**: Next.js automatically loads .env files in the correct precedence order (.env.local → .env.production → .env). No need for dotenv package since Next.js handles this natively.
- **Alternatives**:
  - dotenv package (rejected: redundant with Next.js built-in support)
  - Custom env loading (rejected: reinventing the wheel, less maintainable)
- **Source**: Next.js documentation + package.json:16 shows Next.js 15.5.6 installed

### Decision: Extend Existing .env.example Template

- **Decision**: Enhance the existing .env.example file found at ./.env.example rather than create new
- **Rationale**: Project already has a well-structured .env.example with Supabase, Ghost CMS, and database configuration. We'll add documentation and any missing variables rather than start from scratch.
- **Alternatives**:
  - Create new .env.example (rejected: duplicate work, inconsistent with existing setup)
  - Multiple .env.example files (rejected: confusing, harder to maintain)
- **Source**: ./.env.example:1-22 shows existing configuration

### Decision: Runtime Validation Using Custom Validation Function

- **Decision**: Create lightweight custom validation function for environment variables at app startup
- **Rationale**: Simple infrastructure feature doesn't need heavy schema validation library. Custom function can validate required vars and provide clear error messages.
- **Alternatives**:
  - zod or joi library (rejected: overkill for simple presence validation, adds dependency)
  - No validation (rejected: fails requirement FR-004 for runtime validation)
  - t3-env package (rejected: adds complexity for minimal benefit in this simple case)
- **Source**: Spec requirement FR-004, FR-005 (clear error messages)

### Decision: Docker Compose Integration Using env_file Directive

- **Decision**: Use Docker Compose `env_file` directive to load environment variables for services
- **Rationale**: Standard Docker Compose pattern, works with existing .env file structure
- **Alternatives**:
  - Individual `environment` blocks (rejected: duplicates configuration, harder to maintain)
  - Pass vars via command line (rejected: not suitable for sensitive data)
- **Source**: Spec requirement FR-010 (Docker Compose must load env vars)

### Decision: No Type-Safe Access for MVP (Save for P3)

- **Decision**: Skip TypeScript type generation for environment variables in MVP (user story US7 is P3)
- **Rationale**: Type-safe access is a nice-to-have enhancement (US7, P3). MVP focuses on core functionality (US1-US4, P1). Can add t3-env or similar later if needed.
- **Alternatives**:
  - Include type safety in MVP (rejected: scope creep, US7 is explicitly P3)
  - Promise to add later (accepted: documented in spec as P3 user story)
- **Source**: Spec user stories prioritization (US7 is P3, effort: M 6-8 hours)

---

## Components to Reuse (4 found)

- **.env.example**: Existing template with Supabase, Ghost CMS, database configuration (./.env.example:1-22)
- **.gitignore**: Already excludes .env, .env*.local, .env.production (./.gitignore:34-36)
- **package.json**: Contains version for semantic versioning (./package.json:3)
- **Next.js App**: Built-in environment variable loading via process.env (Next.js 15.5.6)

---

## New Components Needed (5 required)

- **Environment Validation Module**: Utility to validate required environment variables at startup (validation.ts or similar)
- **.env.example Documentation**: Enhanced inline comments explaining purpose, format, and example values for each variable
- **docker-compose.yml**: New file for Docker Compose orchestration with env_file directive
- **Environment Setup Guide**: Documentation explaining secure transfer of .env.production to VPS
- **Environment Variable Schema**: JSON or TypeScript definition of required variables for validation

---

## Unknowns & Questions

None - all technical questions resolved during research:
- ✅ Next.js version confirmed (15.5.6) - supports native environment variables
- ✅ Existing .env.example found - can extend rather than create new
- ✅ .gitignore patterns confirmed - already excludes environment files
- ✅ Docker Compose not yet implemented - will create as part of this feature
- ✅ Validation approach decided - custom function for MVP, type-safe access in P3
- ✅ Ghost CMS integration confirmed - @tryghost/content-api installed (package.json:16)
- ✅ Database configuration confirmed - Prisma client installed (package.json:15)

---

## Technology Stack Confirmation

**Frontend/Backend**:
- Next.js 15.5.6 (App Router)
- React 19.2.0
- TypeScript 5.9.3

**Database**:
- PostgreSQL (via Prisma)
- Supabase (self-hosted)

**CMS**:
- Ghost CMS (@tryghost/content-api 1.12.0)

**Deployment**:
- Docker Compose (to be created)
- VPS (self-hosted, per constitution)

**Environment Management**:
- Next.js built-in .env support
- Docker Compose env_file directive
- Custom validation function (to be created)
