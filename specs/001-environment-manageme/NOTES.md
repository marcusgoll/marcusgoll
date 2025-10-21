# Feature: Environment Management (.env)

## Overview

**Roadmap Issue**: #31 (ICE Score: 4.00 - HIGHEST PRIORITY)
**Branch**: feature/001-environment-manageme
**Slug**: environment-manageme

Implement secure environment variable management with .env files for configuration across development, staging, and production environments.

**Key Benefits**:
- Secure configuration management (no secrets in git)
- Multi-environment support (dev, staging, production)
- Clear developer onboarding (documented .env.example)
- Runtime validation (fail fast on misconfiguration)

## Feature Classification
- UI screens: false
- Improvement: false
- Measurable: false
- Deployment impact: true

Research mode: Minimal (infrastructure feature)

## Research Findings

### From Constitution (constitution.md)
- **Project Type**: Personal Website/Blog (Aviation + Dev/Startup content)
- **Deployment Model**: staging-prod (auto-detected based on git config)
- **Brand Mission**: "I help pilots advance their aviation careers and teach developers to build with systematic thinking"
- **Engineering Principles**: Code quality, testing, deployment practices must align
- **Tech Stack Context**: Next.js-based personal website with Ghost CMS backend

### From Roadmap Issue #31
- **Feature**: Environment Management (.env)
- **Impact**: 4/5 - Critical for security and multi-environment support
- **Effort**: 1/5 - Very simple implementation
- **Score**: 4.00 (HIGHEST PRIORITY)
- **Dependencies**: Blocked by tech-stack-foundation-core (#1)
- **Requirements**: 12 detailed requirements documented in issue body

### Research Conclusions
1. **Scope**: Infrastructure feature - no UI components needed
2. **Priority**: Highest-scored feature in roadmap (4.00)
3. **Security Focus**: Must ensure no secrets committed to git
4. **Multi-Environment**: Support dev (.env.local) and prod (.env.production)
5. **Integration Points**: Next.js, Docker Compose, Ghost CMS, MySQL
6. **Validation**: Runtime validation of required environment variables

## Checkpoints

- Phase 0 (Specification): 2025-10-21 - COMPLETED ✅
  - Spec created: specs/001-environment-manageme/spec.md
  - Requirements checklist: 20/20 checks passed
  - Clarifications needed: 0
  - Ready for: `/plan` phase

- Phase 1 (Planning): 2025-10-21 - COMPLETED ✅
  - Planning artifacts created:
    - research.md: 5 research decisions, 4 reusable components, 5 new components
    - data-model.md: Infrastructure feature (no database entities)
    - quickstart.md: 5 integration scenarios
    - plan.md: Consolidated architecture and implementation plan
    - error-log.md: Error tracking template
  - Components to reuse: 6 (.env.example, .gitignore, Next.js, lib/ghost.ts, lib/prisma.ts, package.json)
  - New components needed: 7 files to create
  - Ready for: `/tasks` phase

- Phase 2 (Tasks): 2025-10-21 - COMPLETED ✅
  - Tasks generated: specs/001-environment-manageme/tasks.md
  - Total tasks: 15
  - User story tasks: 12 (US1-US6)
  - Parallel opportunities: 11 tasks (73%)
  - MVP scope: 8 tasks (US1-US4, Priority 1)
  - Enhancement scope: 4 tasks (US5-US6, Priority 2)
  - Polish: 3 tasks (cross-cutting concerns)
  - Critical path: 7 tasks (~12-15 hours)
  - Files to create: 7 new files
  - Files to update: 3 existing files
  - Ready for: `/validate` phase (cross-artifact validation)

## Last Updated
2025-10-21
✅ T001: Project structure ready
✅ T008: Next.js environment loading verified
✅ T010: Validation function created
✅ T011: TypeScript schema created
✅ T012: Validation integrated at startup
✅ T015: docker-compose.yml created (development)
✅ T016: docker-compose.prod.yml created (production)

## Rollback Procedure

### Overview
If environment variable changes cause issues, follow this 3-step rollback procedure.

### Rollback Steps

1. **Restore Previous .env.production**
   ```bash
   # On VPS
   cp .env.production.backup .env.production
   ```

2. **Restart Application**
   ```bash
   # Using Docker Compose
   docker-compose -f docker-compose.prod.yml restart nextjs

   # OR using npm
   pm2 restart marcusgoll  # or equivalent process manager
   ```

3. **Verify Restoration**
   ```bash
   curl https://marcusgoll.com/api/health
   # Expected: {"status":"ok","env":"production"}
   ```

### Feature Flags
Not applicable - environment variable management has no feature flags.
This is infrastructure configuration, always active.

### Backup Best Practices

**Before making changes:**
```bash
# On VPS, create backup
cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)

# List backups
ls -lt .env.production.backup.*
```

**After successful deployment:**
```bash
# Keep last 3 backups, delete older
ls -t .env.production.backup.* | tail -n +4 | xargs rm -f
```

### Rollback Time Estimate
- Docker Compose: ~30 seconds (restart container)
- npm/pm2: ~10 seconds (restart process)

### Testing After Rollback
1. Verify application starts without errors
2. Check health endpoint: `curl /api/health`
3. Test newsletter service (send test email)
4. Verify database connectivity
5. Check Supabase authentication

✅ T021: Rollback procedure documented

## Environment Variable Change Process

### When to Update Environment Variables

1. **Adding new third-party service integration**
2. **Changing API keys or credentials**
3. **Adding new feature requiring configuration**
4. **Rotating secrets (recommended quarterly or after team changes)**

### Change Process Checklist

#### Step 1: Update Template (.env.example)

```bash
# Edit .env.example
code .env.example

# Add new variable with documentation:
# - Category comment
# - Variable name and description
# - Required vs optional
# - Example value
# - Where to get the value
```

**Example:**
```bash
# New Service (optional)
# Description: API key for new service integration
# Required: No (optional for MVP)
# Where to get: https://service.com/api-keys
# NEW_SERVICE_API_KEY="your-api-key-here"
```

#### Step 2: Update Validation (if required variable)

```bash
# Edit lib/validate-env.ts
code lib/validate-env.ts

# Add to requiredVars object if required:
NEW_SERVICE_API_KEY: {
  description: 'API key for new service integration',
  example: 'sk_test_xxxxx',
}
```

#### Step 3: Update TypeScript Schema

```bash
# Edit lib/env-schema.ts
code lib/env-schema.ts

# Add to EnvironmentVariables interface with JSDoc:
/**
 * New service API key
 * @required Yes/No
 * @format xxx-xxxxx
 * @purpose Description of what it does
 */
NEW_SERVICE_API_KEY?: string
```

#### Step 4: Update Local Environment

```bash
# Add to your .env.local
echo "NEW_SERVICE_API_KEY=\"dev-api-key\"" >> .env.local

# Restart development server
npm run dev

# Verify validation passes
# Expected: ✅ Environment variables validated (XX.XXms)
```

#### Step 5: Update Documentation

```bash
# Update docs/ENV_SETUP.md
# Add variable to "Environment Variables Reference" table
# Update required/optional counts
# Add any service-specific setup instructions
```

#### Step 6: Commit Changes

```bash
# Stage changes
git add .env.example lib/validate-env.ts lib/env-schema.ts docs/ENV_SETUP.md

# Commit with descriptive message
git commit -m "feat: add NEW_SERVICE_API_KEY environment variable

Variable: NEW_SERVICE_API_KEY
Required: Yes/No
Purpose: [Brief description]
Documentation: Updated .env.example, validation, schema, docs"

# Push to remote
git push origin feature-branch
```

#### Step 7: Update Production

```bash
# On VPS or via secure transfer
ssh user@your-vps-ip

# Edit .env.production
nano /var/www/marcusgoll/.env.production

# Add new variable
NEW_SERVICE_API_KEY="production-api-key"

# Restart application
docker-compose -f docker-compose.prod.yml restart nextjs

# Verify deployment
curl https://marcusgoll.com/api/health
```

#### Step 8: Notify Team

If working with a team:
1. Add to PR description: "⚠️ New environment variable required: NEW_SERVICE_API_KEY"
2. Update team documentation or wiki
3. Send notification to team members
4. Provide setup instructions

### Secret Rotation Process

**When to Rotate:**
- Quarterly (best practice)
- After team member departure
- If secret may have been compromised
- Service provider recommends rotation

**Rotation Steps:**

1. **Generate New Secret**
   ```bash
   # Get new API key from service provider
   # Keep old key active during transition
   ```

2. **Test New Secret Locally**
   ```bash
   # Update .env.local with new key
   NEW_SERVICE_API_KEY="new-api-key"

   # Test application locally
   npm run dev

   # Verify service works with new key
   ```

3. **Update Production**
   ```bash
   # Backup current .env.production
   cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)

   # Update with new secret
   sed -i 's/old-api-key/new-api-key/' .env.production

   # Restart application
   docker-compose -f docker-compose.prod.yml restart nextjs

   # Monitor for errors
   docker-compose -f docker-compose.prod.yml logs -f nextjs
   ```

4. **Revoke Old Secret**
   ```bash
   # Wait 24-48 hours for propagation
   # Verify no errors in logs
   # Revoke old secret in service provider dashboard
   ```

### Common Mistakes to Avoid

❌ **Don't:**
- Commit .env.local or .env.production to git
- Share secrets via email or chat
- Use production secrets in development
- Skip updating validation when adding required variables
- Forget to restart server after changing environment variables

✅ **Do:**
- Always update .env.example when adding new variables
- Document where to obtain secret values
- Test changes locally before deploying to production
- Keep backups of .env.production before changes
- Rotate secrets regularly

### Troubleshooting Variable Changes

**Issue: New variable not loading**
```bash
# 1. Verify variable is in .env.local (dev) or .env.production (prod)
cat .env.local | grep NEW_VARIABLE

# 2. Restart server (environment changes require restart)
npm run dev  # or docker-compose restart

# 3. Check validation output
# Should see: ✅ Environment variables validated
```

**Issue: Validation failing after adding required variable**
```bash
# 1. Verify variable is in requiredVars in lib/validate-env.ts
cat lib/validate-env.ts | grep -A 3 "NEW_VARIABLE"

# 2. Check error message
npm run dev
# Error will show missing variable with description and example
```

✅ T087: Environment variable change process documented
