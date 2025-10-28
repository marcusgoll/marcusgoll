# Feature: CI/CD Pipeline (GitHub Actions)

## Overview
Implement automated CI/CD pipeline with GitHub Actions for continuous testing, building, and deployment to VPS on every push to main branch.

## Research Findings
[Populated during research phase]

## System Components Analysis
[Populated during system component check]

## Checkpoints
- Phase 0 (Spec): 2025-10-28

## Last Updated
2025-10-28T19:30:00Z

## Feature Classification
- UI screens: false (infrastructure/automation feature)
- Improvement: false (new capability, not improving existing)
- Measurable: true (deployment time, build success rate, pipeline reliability)
- Deployment impact: true (CI/CD infrastructure, environment variables, secrets management)

Rationale: CI/CD pipeline is an infrastructure feature focused on automation. No user-facing UI screens, but has measurable outcomes (build time, deployment success rate) and significant deployment impact (requires GitHub secrets, SSH keys, environment configuration).

## Research Findings

### Existing Infrastructure (from codebase analysis)

**Current CI/CD State**:
- `.github/workflows/build-and-test.yml`: Basic build/lint/typecheck workflow (runs on PR/push to main)
- `.github/workflows/deploy-production.yml`: Placeholder deployment workflow mentioning Dokploy auto-deployment
- Docker support: Multi-stage Dockerfile (development, builder, production stages)
- Docker Compose: `docker-compose.prod.yml` with Next.js + Caddy reverse proxy setup
- Current deployment: Manual via Dokploy (push to main triggers auto-deploy to test.marcusgoll.com)

**Tech Stack** (from tech-stack.md):
- Frontend: Next.js 15.5.6 (App Router), TypeScript 5.9.3, Tailwind CSS 4.1.15
- Backend: Next.js API Routes (minimal usage - /api/newsletter)
- Database: PostgreSQL 15+ via self-hosted Supabase
- ORM: Prisma 6.17.1
- Hosting: Hetzner VPS + Docker + Caddy reverse proxy
- CI/CD: GitHub Actions (basic build/test only, no deployment automation yet)

**Deployment Strategy** (from deployment-strategy.md):
- Model: direct-prod (no staging environment yet)
- VPS: Hetzner self-hosted (~€20-30/mo)
- Containerization: Docker + Docker Compose
- Current deployment: Push to main → Dokploy auto-deployment (via webhook)
- Future: Migrate to staging-prod model when traffic > 10K/mo

### Current Gaps
1. No automated Docker build/push to registry (GHCR or Docker Hub)
2. No automated SSH deployment to VPS
3. No rollback automation (currently manual: docker images + git revert)
4. No secrets management via GitHub Secrets
5. No deployment notifications (Slack/Discord)
6. No performance optimization (dependency caching not configured)
7. Lint/typecheck steps use continue-on-error (non-blocking)

### Project Architecture Compliance
- Constitution specifies direct-prod deployment model ✅
- Quality gates defined: pre-flight validation, code review gate, manual preview gate ✅
- Rollback strategy documented: Docker image tags + git revert ✅
- Version management: Semantic versioning via package.json ✅
- Target: < 10 minute pipeline execution ✅

### GitHub Actions Maturity
- Basic workflow exists but incomplete
- No build caching configured
- No Docker layer caching
- No matrix builds for multiple Node versions
- No artifact storage
- No deployment automation to VPS

### Decision: Extend Existing vs Replace
**Recommendation**: Extend existing workflows rather than replace
- Rationale: Basic structure is sound, just needs deployment automation
- Keep build-and-test.yml for PR validation
- Enhance deploy-production.yml with full CI/CD automation
- Add secrets for VPS SSH, Docker registry credentials

## Specification Complete

**Status**: ✅ Validated and ready for planning

**Metrics**:
- User Stories: 8 (MVP: US1-US3, Enhancement: US4-US6, Nice-to-have: US7-US8)
- Functional Requirements: 8 (FR-001 through FR-008)
- Non-Functional Requirements: 5 (performance, reliability, security, observability, idempotency)
- Acceptance Scenarios: 6 primary + 5 edge cases
- Out of Scope: 9 items explicitly excluded
- Clarifications Needed: 0 (all questions answered by project docs)

**Key Technical Decisions**:
1. GitHub Container Registry (GHCR) for Docker images (free, native integration)
2. SSH-based deployment via appleboy/ssh-action (direct control, existing VPS setup)
3. Docker tag-based rollback (fast, reliable, no rebuild)
4. Extend existing workflows rather than create new (maintains consistency)

**Validation**:
- Requirements checklist: 16/16 passed ✅
- Aligned with constitution.md deployment model (direct-prod) ✅
- Validated against tech-stack.md and deployment-strategy.md ✅
- No implementation details in specification ✅

**Next Phase**: `/plan` - Generate design artifacts for implementation
