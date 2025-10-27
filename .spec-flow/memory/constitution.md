# Marcus Gollahon - Engineering & Brand Constitution

**Version**: 2.0.0
**Last Updated**: 2025-10-21
**Status**: Active
**Project**: Personal Website/Blog - Aviation, Education, Dev Projects, Startups

> This document defines the core engineering principles AND personal brand standards that govern all feature development. Every specification, plan, and implementation must align with these principles and brand identity.

---

## Purpose

This constitution serves as the Single Source of Truth (SSOT) for:
1. **Engineering standards** - Code quality, testing, deployment practices
2. **Brand standards** - Visual identity, tone, content principles
3. **Decision-making framework** - When trade-offs arise between features/design/content

**Brand Mission**: "I help pilots advance their aviation careers and teach developers to build with systematic thinking—bringing discipline, clarity, and proven teaching methods to everything I create."

**Brand Essence**: "Systematic Mastery" - The disciplined approach of aviation applied to development and teaching.

When in doubt, refer to these principles. When principles conflict with convenience, principles win.

---

## Project Configuration

**Project Type**: Auto-detected on first `/flow` run

**Deployment Model**: staging-prod _(auto-detected, can be overridden)_

**Available Models**:
- `staging-prod` - Full staging validation before production (recommended)
- `direct-prod` - Direct production deployment without staging
- `local-only` - Local builds only, no remote deployment

**Auto-Detection Logic**:

The deployment model is automatically detected based on repository configuration:

1. **staging-prod** - All of the following are true:
   - Git remote configured (`git remote -v | grep origin`)
   - Staging branch exists (`git show-ref refs/heads/staging` or `refs/remotes/origin/staging`)
   - Staging workflow exists (`.github/workflows/deploy-staging.yml`)

2. **direct-prod** - When:
   - Git remote configured
   - No staging branch or staging workflow

3. **local-only** - When:
   - No git remote configured

**Manual Override**:

To override auto-detection, set the deployment model explicitly:

```
Deployment Model: staging-prod
```

_(Write exactly one of: staging-prod, direct-prod, local-only)_

**Workflow Paths by Model**:

| Model | Post-Implementation Workflow |
|-------|------------------------------|
| staging-prod | /optimize → /preview → /phase-1-ship → /validate-staging → /phase-2-ship |
| direct-prod | /optimize → /preview → /deploy-prod |
| local-only | /optimize → /preview → /build-local |

**Unified Command**: Use `/ship` after `/implement` to automatically execute the appropriate workflow based on deployment model.

**Quick Changes**: For small bug fixes, refactors, or enhancements (<100 LOC), use `/quick "description"` instead of full `/flow` workflow.

---

## Roadmap Management

**Philosophy**: The roadmap is the Single Source of Truth (SSOT) for feature planning and delivery status. Features move through a defined lifecycle from planning to production.

### Roadmap Lifecycle

**Sections**:
1. **Backlog** - Ideas and future features (not prioritized)
2. **Later** - Planned but low priority
3. **Next** - Prioritized for upcoming work
4. **In Progress** - Currently being developed
5. **Shipped** - Deployed to production

**Automatic Transitions**:
- `/spec-flow` → Marks feature as "In Progress" in roadmap
- `/ship` (Phase S.5) → Marks feature as "Shipped" with version and date

### Feature Discovery

During implementation, the workflow may discover potential features not yet in the roadmap:

**Detection Patterns**:
- Comments containing: "future work", "TODO", "later", "phase 2", "out of scope"
- Spec sections marked as out-of-scope with future potential

**User Prompt**:
When discovered features are found, the workflow prompts:
```
💡 Discovered Potential Feature
Context: [where it was found]
Description: [feature description]

Add to roadmap? (yes/no/later):
```

**Actions**:
- **yes**: Immediately add to roadmap (prompts for /roadmap command)
- **later**: Save to `.spec-flow/memory/discovered-features.md` for batch review
- **no**: Skip (not tracked)

### Roadmap Format

Each feature in roadmap must have:
```markdown
### 001-feature-slug

- **Title**: Human-readable feature name
- **Area**: Component or domain (e.g., Auth, UI, API)
- **Role**: User role or persona (e.g., End User, Admin)
- **ICE Score**: Impact (1-10), Confidence (1-10), Ease (1-10) [only for unshipped features]
```

**Shipped Features** (additional metadata):
```markdown
### 001-feature-slug

- **Title**: Human-readable feature name
- **Area**: Component or domain
- **Role**: User role or persona
- **Date**: 2025-10-16
- **Release**: v1.2.3
- **URL**: https://app.example.com (optional)
```

### Roadmap Commands

- `/roadmap` - Interactive roadmap management
- `/roadmap add "Feature description"` - Add new feature
- `/roadmap prioritize` - Re-prioritize features using ICE scores
- `/roadmap review` - Review discovered features

---

## Version Management

**Philosophy**: Every production deployment increments the semantic version and creates a git tag. Versions track feature releases and enable rollback.

### Semantic Versioning

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (user-facing API changes, data migrations)
- **MINOR**: New features (backward-compatible enhancements)
- **PATCH**: Bug fixes (backward-compatible corrections)

**Detection Logic**:
- Spec or ship report contains "breaking change" → MAJOR bump
- Spec contains "fix", "bug", "patch", or "hotfix" → PATCH bump
- Default → MINOR bump (new feature)

### Automatic Version Bumping

**When**: During `/ship` Phase S.5 (after deployment succeeds)

**Process**:
1. Read current version from `package.json`
2. Analyze spec and ship report for bump type
3. Calculate new version (e.g., 1.2.0 → 1.3.0)
4. Update `package.json`
5. Create annotated git tag: `v1.3.0`
6. Generate release notes from ship report
7. Update roadmap with version number

**Non-Blocking**: If `package.json` doesn't exist or version bump fails, workflow continues with warning

### Release Notes

**Auto-Generated from Ship Report**:
```markdown
# Release v1.3.0

**Date**: 2025-10-16

## Features

### Feature Title

[Summary from ship report]

## Changes

[Changes from ship report]

## Deployment

- **Production URL**: https://app.example.com
- **Release Tag**: v1.3.0
- **Feature Spec**: specs/001-feature-slug/spec.md
```

**Location**: `RELEASE_NOTES.md` (root directory)

### Git Tags

**Format**: `v1.3.0` (annotated tags)

**Message**: `Release v1.3.0 - Auto-bumped (minor)`

**Pushing Tags**:
- Tags created locally during `/ship`
- Push to remote: `git push origin v1.3.0`
- Tags enable rollback and release tracking

### Version Policies

1. **Never manually edit versions** - Always use `/ship` workflow
2. **Never skip versions** - Sequential increments only
3. **Tag before pushing** - Create tag locally, verify, then push
4. **Breaking changes require planning** - Major bumps need stakeholder approval

---

## Deployment Quality Gates

**Quality gates** are automated checks that must pass before deployment can proceed.

### Pre-flight Validation

**When**: Before any deployment (staging or production)

**Checks**:
- ✅ Environment variables configured in GitHub secrets
- ✅ Production build succeeds locally
- ✅ Docker images build successfully
- ✅ CI workflow configuration valid
- ✅ Dependencies checked for outdated packages

**Blocking**: Yes - deployment fails if pre-flight fails

**Override**: Not recommended - fix issues and retry

### Code Review Gate

**When**: During `/optimize` phase

**Checks**:
- ✅ No critical code quality issues
- ✅ Performance benchmarks met
- ✅ Accessibility standards (WCAG 2.1 AA)
- ✅ Security scan completed

**Blocking**: Yes - critical issues must be resolved

### Rollback Capability Gate

**When**: After staging deployment, before production (staging-prod model only)

**Checks**:
- ✅ Deployment IDs extracted from staging logs
- ✅ Rollback test executed (git revert or PM2 restart with previous version)
- ✅ Previous deployment verified live
- ✅ Roll-forward to current deployment verified

**Blocking**: Yes - production deployment fails if rollback test fails

**Purpose**: Ensures ability to quickly rollback if production deployment causes issues

---

## Manual Gates

**Manual gates** require human approval before proceeding. The workflow pauses for testing and validation.

### Preview Gate

**Location**: After `/optimize`, before deployment

**Purpose**: Manual UI/UX validation on local development server

**Process**:
1. Run `/preview` to start local dev server
2. Test feature functionality thoroughly
3. Verify UI/UX across different screen sizes
4. Check keyboard navigation and accessibility
5. Test error states and edge cases
6. When satisfied, run `/ship continue` to proceed

**Required for**: All deployment models

**Rationale**: Automated tests can't catch all UX issues - human testing is essential

### Staging Validation Gate

**Location**: After staging deployment, before production

**Applies to**: staging-prod model only

**Purpose**: Validate feature in real staging environment

**Process**:
1. Staging deployed via `/phase-1-ship`
2. Run `/validate-staging` for automated health checks
3. Manually test feature on staging URL
4. Verify E2E tests passed in GitHub Actions
5. Check Lighthouse CI scores
6. Confirm rollback capability tested
7. When approved, run `/ship continue` for production deployment

**Required for**: staging-prod model only (direct-prod and local-only skip this)

**Rationale**: Production-like environment testing catches issues that local testing misses

---

## Rollback Strategy

**Philosophy**: Every production deployment must be reversible within 5 minutes.

### Deployment ID Tracking

**What**: Unique identifiers for each deployment (git commit SHAs, PM2 process IDs, Docker images)

**Storage**:
- `specs/NNN-slug/deployment-metadata.json` - Human-readable
- `specs/NNN-slug/workflow-state.yaml` - Machine-readable state

**Extraction**: Automatic from GitHub Actions workflow logs or deployment scripts

### Rollback Testing (staging-prod only)

**When**: During `/validate-staging` phase

**Process**:
1. Load previous deployment ID (git commit SHA) from state
2. Execute: `git revert <current-commit>` or `pm2 restart <app> --update-env`
3. Wait for application restart (15 seconds)
4. Verify previous deployment is live (check HTTP headers and version)
5. Roll forward: `git revert <revert-commit>` or restore current version
6. Verify current deployment is live again

**Blocking**: If rollback test fails, production deployment is blocked

### Production Rollback

**When to rollback**:
- Critical bugs discovered post-deployment
- Performance degradation
- Security vulnerability
- High error rates

**How to rollback**:
```bash
# For Hetzner VPS with PM2
ssh hetzner
cd /path/to/marcusgoll
git revert <commit-sha>
./deploy.sh

# Or for quick PM2 restart with previous version
pm2 stop marcusgoll
git checkout <previous-commit-sha>
npm install
npm run build
pm2 start npm --name "marcusgoll" -- start
pm2 save
```

**Deployment IDs**: Found in ship reports (`*-ship-report.md`) or `deployment-metadata.json`

---

## Personal Brand Principles

These principles govern all content, design, and user experience decisions to maintain brand consistency.

### 1. Systematic Clarity

**Principle**: Every feature, every article, every design element should reflect systematic thinking and clear communication.

**Why**: Brand archetype is "The Sage Explorer" - combining structured teaching with authentic transparency.

**Implementation**:
- Aviation checklists inspire UI/UX patterns (systematic, repeatable)
- Teaching background drives content structure (clear explanations, step-by-step)
- Code examples include comments explaining "why", not just "what"
- Complex topics broken into digestible sections
- Reference `/docs/MARCUS_BRAND_PROFILE.md` for tone and messaging

**Violations**:
- ❌ Overly complex navigation or information architecture
- ❌ Jargon without explanation
- ❌ Missing context or background for technical topics

---

### 2. Visual Brand Consistency

**Principle**: All visual elements must adhere to the defined brand identity system.

**Why**: Professional, cohesive visual identity builds trust and recognition.

**Implementation**:
- **Colors**: Navy 900 `#0F172A` (primary), Emerald 600 `#059669` (secondary)
- **Typography**: Work Sans (headings/body), JetBrains Mono (code)
- **Spacing**: 8px base unit, consistent across all components
- **Accessibility**: WCAG 2.1 AA minimum (4.5:1 text contrast, keyboard nav)
- Reference `/docs/VISUAL_BRAND_GUIDE.md` for complete style guide

**Violations**:
- ❌ Using colors outside the defined palette
- ❌ Inconsistent font weights or sizes
- ❌ Random spacing values (must use 8px increments)
- ❌ Low-contrast text or missing focus states

---

### 3. Multi-Passionate Integration

**Principle**: Content strategy balances aviation, development, and teaching without forcing artificial separation.

**Why**: Brand uniqueness comes from cross-domain expertise - "Systematic Cross-Domain Thinking".

**Implementation**:
- **Content mix**: 40% aviation, 40% dev/startup, 20% cross-pollination
- **Cross-pollination examples**: "Code Review Like a Flight Instructor", "Pre-Deployment Checklists"
- Tag system differentiates tracks: Aviation (Sky Blue accent), Dev (Emerald), Hybrid (both)
- Navigation allows filtering by interest area
- Bio/about clearly communicates triple background (pilot + teacher + dev)

**Violations**:
- ❌ Forcing artificial "choose one passion" narrative
- ❌ Hiding one domain to appeal to another audience
- ❌ Missing opportunities to connect aviation → development principles

---

### 4. Authentic Building in Public

**Principle**: Share the journey transparently - wins, failures, lessons learned from building CFIPros.com and other projects.

**Why**: Builds trust, creates accountability, helps others avoid mistakes.

**Implementation**:
- Monthly progress updates on startup projects
- Transparent metrics (traffic, revenue, user feedback)
- Document pivots and failures, not just successes
- Code examples from real projects, not toy demos
- Time management insights (full-time pilot + side hustle)

**Violations**:
- ❌ Only sharing polished, perfect outcomes
- ❌ Vague progress updates without specifics
- ❌ Hiding business metrics or challenges

---

### 5. Teaching-First Content

**Principle**: Leverage 10 years of teaching experience to make content genuinely educational, not just informative.

**Why**: Differentiation comes from proven teaching methodology, not just domain knowledge.

**Implementation**:
- Every tutorial includes learning objectives
- Use analogies and real-world examples (aviation → dev)
- Provide checklists, frameworks, and downloadable resources
- Anticipate common misconceptions and address them
- Interactive elements where possible (quizzes, code playgrounds)

**Violations**:
- ❌ Assuming prior knowledge without explanation
- ❌ Listing facts without context or application
- ❌ No clear takeaways or action items

---

### 6. Documentation Standards for Brand Assets

**Principle**: Maintain comprehensive documentation for all brand decisions, visual assets, and content frameworks.

**Why**: Consistency over time requires documented standards, especially when working with collaborators or revisiting projects.

**Implementation**:
- All brand assets documented in `/docs/` folder
- Visual decisions reference `VISUAL_BRAND_GUIDE.md`
- Content strategy references `MARCUS_BRAND_PROFILE.md`
- Design decisions logged in feature `NOTES.md`
- Templates for social media, blog posts, and email maintained in codebase

**Violations**:
- ❌ Undocumented design decisions
- ❌ Brand assets scattered across drives without version control
- ❌ Inconsistent messaging without reference docs

---

## Core Engineering Principles

### 1. Specification First

**Principle**: Every feature begins with a written specification that defines requirements, success criteria, and acceptance tests before any code is written.

**Why**: Specifications prevent scope creep, align stakeholders, and create an auditable trail of decisions.

**Implementation**:
- Use `/spec-flow` to create specifications from roadmap entries
- Specifications must define: purpose, user stories, acceptance criteria, out-of-scope items
- No implementation work starts until spec is reviewed and approved
- Changes to requirements require spec updates first

**Violations**:
- ❌ Starting implementation without a spec
- ❌ Adding features not in the spec without updating it first
- ❌ Skipping stakeholder review of specifications

---

### 2. Testing Standards

**Principle**: All production code must have automated tests with minimum 80% code coverage.

**Why**: Tests prevent regressions, document behavior, and enable confident refactoring.

**Implementation**:
- Unit tests for business logic (80%+ coverage required)
- Integration tests for API contracts
- E2E tests for critical user flows
- Tests written alongside implementation (not after)
- Use `/tasks` phase to include test tasks in implementation plan

**Violations**:
- ❌ Merging code without tests
- ❌ Skipping tests for "simple" features
- ❌ Writing tests only after implementation is complete

---

### 3. Performance Requirements

**Principle**: Define and enforce performance thresholds for all user-facing features.

**Why**: Performance is a feature, not an optimization task. Users abandon slow experiences.

**Implementation**:
- API responses: <200ms p50, <500ms p95
- Page loads: <2s First Contentful Paint, <3s Largest Contentful Paint
- Database queries: <50ms for reads, <100ms for writes
- Define thresholds in spec, measure in `/optimize` phase
- Use Lighthouse, Web Vitals, or similar tools for validation

**Violations**:
- ❌ Shipping features without performance benchmarks
- ❌ Ignoring performance regressions in code review
- ❌ N+1 queries, unbounded loops, blocking operations

---

### 4. Accessibility (a11y)

**Principle**: All UI features must meet WCAG 2.1 Level AA standards.

**Why**: Inclusive design reaches more users and is often legally required.

**Implementation**:
- Semantic HTML, ARIA labels where needed
- Keyboard navigation support (no mouse-only interactions)
- Color contrast ratios: 4.5:1 for text, 3:1 for UI components
- Screen reader testing during `/preview` phase
- Use automated tools (axe, Lighthouse) in `/optimize` phase

**Violations**:
- ❌ Mouse-only interactions
- ❌ Low contrast text
- ❌ Missing alt text, ARIA labels, or focus states

---

### 5. Security Practices

**Principle**: Security is not optional. All features must follow secure coding practices.

**Why**: Breaches destroy trust and can be catastrophic for users and the business.

**Implementation**:
- Input validation on all user-provided data
- Parameterized queries (no string concatenation for SQL)
- Authentication/authorization checks on all protected routes
- Secrets in environment variables, never committed to code
- Security review during `/optimize` phase

**Violations**:
- ❌ Trusting user input without validation
- ❌ Exposing sensitive data in logs, errors, or responses
- ❌ Hardcoded credentials or API keys

---

### 6. Code Quality

**Principle**: Code must be readable, maintainable, and follow established patterns.

**Why**: Code is read 10x more than it's written. Optimize for future maintainers.

**Implementation**:
- Follow project style guides (linters, formatters)
- Functions <50 lines, classes <300 lines
- Meaningful names (no `x`, `temp`, `data`)
- Comments explain "why", not "what"
- DRY (Don't Repeat Yourself): Extract reusable utilities
- KISS (Keep It Simple, Stupid): Simplest solution that works

**Violations**:
- ❌ Copy-pasting code instead of extracting functions
- ❌ Overly clever one-liners that obscure intent
- ❌ Skipping code review feedback

---

### 7. Documentation Standards

**Principle**: Document decisions, not just code. Future you will thank you.

**Why**: Context decays fast. Documentation preserves the "why" behind decisions.

**Implementation**:
- Update `NOTES.md` during feature development (decisions, blockers, pivots)
- API endpoints: Document request/response schemas (OpenAPI/Swagger)
- Complex logic: Add inline comments explaining rationale
- Breaking changes: Update CHANGELOG.md
- User-facing features: Update user docs

**Violations**:
- ❌ Undocumented API changes
- ❌ Empty NOTES.md after multi-week features
- ❌ Cryptic commit messages ("fix stuff", "updates")

---

### 8. Do Not Overengineer

**Principle**: Ship the simplest solution that meets requirements. Iterate later.

**Why**: Premature optimization wastes time and creates complexity debt.

**Implementation**:
- YAGNI (You Aren't Gonna Need It): Build for today, not hypothetical futures
- Use proven libraries instead of custom implementations
- Defer abstractions until patterns emerge (Rule of Three)
- Ship MVPs, gather feedback, iterate

**Violations**:
- ❌ Building frameworks when a library exists
- ❌ Abstracting after one use case
- ❌ Optimization without profiling data

---

## Conflict Resolution

When principles conflict (e.g., "ship fast" vs "test thoroughly", or "brand consistency" vs "quick iteration"), prioritize in this order:

### Engineering vs Engineering
1. **Security** - Never compromise on security
2. **Accessibility** - Legal and ethical obligation
3. **Testing** - Prevents regressions, enables velocity
4. **Specification** - Alignment prevents waste
5. **Performance** - User experience matters
6. **Code Quality** - Long-term maintainability
7. **Documentation** - Preserves context
8. **Simplicity** - Avoid premature optimization

### Brand vs Engineering
- **Brand consistency > Feature velocity** - Wait to implement correctly with brand guidelines
- **Teaching quality > Content quantity** - One excellent tutorial > five mediocre posts
- **Visual standards > Quick shipping** - Use defined colors/fonts, even if it takes longer
- **Authentic transparency > Perfect polish** - Share real progress, not just wins

### Brand vs Brand
- **Systematic clarity > Clever creativity** - Clear teaching beats clever wordplay
- **Multi-passionate integration > Niche appeal** - Don't hide domains to appeal to one audience
- **Documentation > Memory** - Write it down, don't rely on recall

---

## Amendment Process

This constitution evolves with the project. To propose changes:

1. Run `/constitution "describe proposed change"`
2. Claude will update the constitution and bump the version:
   - **MAJOR**: Removed principle or added mandatory requirement
   - **MINOR**: Added principle or expanded guidance
   - **PATCH**: Fixed typo or updated date
3. Review the diff and approve/reject
4. Commit the updated constitution

---

## References

### Engineering & Workflow
- **Spec-Flow Commands**: `.claude/commands/`
- **Templates**: `.spec-flow/templates/`
- **Roadmap**: `.spec-flow/memory/roadmap.md`
- **Design Inspirations**: `.spec-flow/memory/design-inspirations.md`

### Brand & Content Strategy
- **Brand Profile**: `docs/MARCUS_BRAND_PROFILE.md` - Mission, values, content pillars, target audiences
- **Visual Brand Guide**: `docs/VISUAL_BRAND_GUIDE.md` - Colors, typography, spacing, imagery
- **Brand Strategy Framework**: `docs/BRAND_STRATEGY_FRAMEWORK.md` - Golden Circle, archetype, positioning
- **Competitive Analysis**: `docs/COMPETITIVE_ANALYSIS.md` - Blue Ocean strategy, market positioning
- **Content Framework**: `docs/CONTENT_FRAMEWORK_INTEGRATION.md` - Content creation workflow
- **Brand Consistency Checklist**: `docs/BRAND_CONSISTENCY_CHECKLIST.md` - Pre-publish validation

### Project Documentation
- **Setup Summary**: `docs/SETUP_SUMMARY.md`
- **Website Strategy**: `docs/WEBSITE_STRATEGY_ANALYSIS.md`
- **Quick Start**: `docs/QUICKSTART.md`
- **Ghost/Next.js Implementation**: `docs/GHOST_NEXTJS_IMPLEMENTATION.md`

---

**Maintained by**: Marcus Gollahon + Claude Code
**Review Cycle**: Quarterly or after major project milestones
**Project Context**: Personal website/blog for aviation, education, dev projects, and startups
