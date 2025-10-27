# Dokploy Migration Implementation Guides

**Feature**: 047 - Dokploy Deployment Platform Integration
**Type**: Infrastructure Migration (Zero-Downtime)
**Total Tasks**: 39 (34 MVP + 3 optional + 2 future)
**Estimated Duration**: 13-19 hours total
**VPS IP**: 178.156.129.179

---

## ⚠️ IMPORTANT: DNS Setup Required

**BEFORE starting Phase 1**, read the DNS setup guide:
→ **[00-DNS-SETUP-PREREQUISITE.md](./00-DNS-SETUP-PREREQUISITE.md)**

This guide covers:
- Setting up marcusgoll.com → 178.156.129.179 (main domain)
- Setting up deploy.marcusgoll.com → 178.156.129.179 (Dokploy UI)
- DNS provider-specific instructions (Cloudflare, Namecheap, GoDaddy, etc.)
- Verification steps before starting migration

**Why this matters**: DNS propagation can take 5-60 minutes. Configuring DNS before Phase 1 ensures no delays during migration.

---

## Overview

This directory contains step-by-step implementation guides for migrating marcusgoll.com from manual Docker deployment to Dokploy-managed deployment platform.

**Migration Strategy**: Blue-green deployment at infrastructure level
**Risk Level**: LOW (production unchanged until Phase 6 cutover)
**Rollback Capability**: Multiple levels (Dokploy rollback, Caddyfile revert, VPS snapshot)

---

## Guide Structure

### Phase 1: Pre-Migration Setup (30-45 minutes)
**File**: [01-pre-migration-setup.md](./01-pre-migration-setup.md)
**Tasks**: T001-T004
**Description**: Backup VPS, verify prerequisites, configure DNS

**Deliverables**:
- VPS snapshot in Hetzner
- Configuration backups in feature directory
- DNS record for deploy.marcusgoll.com
- VPS prerequisites validated

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

### Phase 2: Dokploy Installation (45-60 minutes)
**File**: [02-dokploy-installation.md](./02-dokploy-installation.md)
**Tasks**: T005-T008
**Description**: Install Dokploy, configure subdomain, provision SSL

**Deliverables**:
- Dokploy running on VPS (port 3000)
- Caddy subdomain config (deploy.marcusgoll.com)
- SSL certificate via Caddy automatic HTTPS
- Admin access configured and tested

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

### Phase 3: Application Migration (2-3 hours)
**File**: [03-application-migration.md](./03-application-migration.md)
**Tasks**: T009-T015
**Description**: Migrate Next.js app to Dokploy, deploy to test subdomain

**Deliverables**:
- Application configured in Dokploy
- GitHub repository connected
- Environment variables migrated
- First deployment to test.marcusgoll.com
- Comprehensive validation tests passed

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

### Phase 4-7: Database, CI/CD, Cutover & Validation (4-6 hours + 24-48h monitoring)
**File**: [04-database-cicd-cutover-validation.md](./04-database-cicd-cutover-validation.md)

#### Phase 4: Database Integration (45-60 min)
**Tasks**: T016-T018
**Description**: Import PostgreSQL, configure backups

**Deliverables**:
- Database imported to Dokploy
- Automated backups (daily, 7-day retention)
- Manual backup tested

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

#### Phase 5: CI/CD Integration (60-90 min)
**Tasks**: T019-T023
**Description**: GitHub webhook, push-to-deploy automation

**Deliverables**:
- GitHub webhook configured
- Push-to-deploy tested and working
- GitHub Actions updated
- (Optional) Deployment notifications

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

#### Phase 6: Production Cutover (30-45 min)
**Tasks**: T024-T027
**Description**: Switch marcusgoll.com to Dokploy-managed app

**Deliverables**:
- Caddyfile backup created
- Production domain in Dokploy
- marcusgoll.com routing updated
- Production validation passed

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

#### Phase 7: Post-Migration Validation (24-48 hours monitoring)
**Tasks**: T028-T037
**Description**: Monitor stability, document procedures, cleanup

**Deliverables**:
- Health check monitoring configured
- (Optional) Monitoring dashboard and alerts
- Rollback capability tested
- 24-hour stability monitoring
- Deployment runbook documented
- Success metrics measured
- Old infrastructure cleaned up (after 7 days)

**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

---

## Task Summary

### MVP Tasks (Required - 34 tasks)
- **Phase 1**: T001-T004 (4 tasks) - Pre-migration setup
- **Phase 2**: T005-T008 (4 tasks) - Dokploy installation
- **Phase 3**: T009-T015 (7 tasks) - Application migration
- **Phase 4**: T016-T018 (3 tasks) - Database integration
- **Phase 5**: T019-T022 (4 tasks) - CI/CD integration
- **Phase 6**: T024-T027 (4 tasks) - Production cutover
- **Phase 7**: T028, T030, T032-T037 (8 tasks) - Validation & cleanup

### Optional Enhancement Tasks (3 tasks)
- **T023** (US6 - P2): Deployment notifications
- **T029** (US7 - P2): Monitoring dashboard and alerts
- **T031** (US8 - P2): Dokploy configuration export

### Future Tasks (Deferred - 2 tasks)
- **T038** (US10 - P3): Staging environment setup documentation
- **T039**: Advanced monitoring integrations research

---

## Implementation Instructions

### Prerequisites

**Local Machine (Windows)**:
- Git installed
- SSH client (built-in Windows 10/11, or PuTTY)
- PowerShell 7+ (for scp commands)
- Text editor (VS Code recommended)

**VPS Access**:
- SSH access to Hetzner VPS (root@178.156.129.179)
- Hetzner Cloud Console access (for snapshot creation)

**DNS Access**:
- Access to DNS provider (Cloudflare/Namecheap/etc.)
- Ability to create A records

**GitHub Access**:
- Repository: marcusgoll/marcusgoll
- Webhook creation permissions
- (Optional) Personal Access Token for Dokploy

**Credentials**:
- VPS SSH credentials
- Dokploy admin password (will be generated during installation)
- DNS provider login
- GitHub account

---

### Execution Order

**Sequential Phases** (must complete in order):
1. Phase 1 → Phase 2 → Phase 3 (sequential dependency)

**Parallel Phases** (can run simultaneously after Phase 3):
- Phase 4 (Database) + Phase 5 (CI/CD) can overlap

**Sequential Continuation**:
- Phase 6 (Cutover) requires both Phase 4 and 5 complete
- Phase 7 (Validation) requires Phase 6 complete

**Timeline Example**:
```
Day 1 (4-6 hours):
- Phase 1: Pre-migration (30-45 min)
- Phase 2: Dokploy install (45-60 min)
- Phase 3: App migration (2-3 hours)
- Phase 4 & 5: Database + CI/CD in parallel (60-90 min)

Day 1 Evening or Day 2:
- Phase 6: Production cutover (30-45 min)
- Phase 7: Initial validation (2-3 hours active work)

Day 2-8:
- Phase 7: 24-hour monitoring (passive)
- Day 7: Infrastructure cleanup (30 min)
```

---

### Validation Checkpoints

Each phase has validation checklists. **DO NOT proceed** to next phase if validation fails.

**Critical Validation Gates**:
- Phase 1, T001: VPS snapshot must exist and be verified
- Phase 3, T015: Test deployment must pass all functional tests
- Phase 6, T027: Production validation must pass before declaring cutover successful

**Rollback Decision Points**:
- If Phase 1-5 fail: No impact on production, debug and retry
- If Phase 6 fails: Rollback to pre-Dokploy Caddyfile config (<10 min)
- If Phase 7 reveals issues: Rollback or fix via Dokploy deployments

---

### Documentation Updates

**NOTES.md Updates**:
- Add checkpoints after each phase completion
- Document actual time spent vs. estimates
- Record any deviations from guides
- Note issues encountered and resolutions

**Project Documentation Updates** (after migration complete):
- `docs/project/deployment-strategy.md` - Update deployment model, add Dokploy workflow
- `docs/project/development-workflow.md` - Update deployment section
- `docs/project/system-architecture.md` - Add Dokploy to infrastructure diagram
- `docs/project/tech-stack.md` - Add Dokploy to DevOps section

---

### Success Criteria

**Migration Complete When**:
- [ ] All MVP tasks (T001-T022, T024-T030, T032-T037) completed
- [ ] Production (marcusgoll.com) served by Dokploy for 7+ days
- [ ] No critical issues or rollbacks needed
- [ ] All validation tests passing
- [ ] Deployment runbook documented
- [ ] Old infrastructure cleaned up

**Success Metrics** (from spec.md):
- Deployment time: <7 minutes (NFR-002)
- Site response time: <2s, no >50ms regression (NFR-003)
- Dokploy UI response: <2s (NFR-001)
- Health check interval: 30s (NFR-009)
- Resource overhead: <500MB RAM for Dokploy (NFR-021)
- Backup success: 100% (NFR-011)
- Rollback time: <5 minutes (FR-026)

**Time Savings** (predicted from spec.md):
- Before: ~30 min/deploy (manual SSH, Docker commands)
- After: ~1 min/deploy (git push only)
- Weekly savings: ~2-3 hours (assuming 3-5 deploys/week)
- **60% time savings** on deployment tasks

---

## Emergency Contacts & Resources

**VPS Access**:
- IP: 178.156.129.179
- SSH: root@178.156.129.179
- Hetzner Console: https://console.hetzner.cloud

**Dokploy Resources**:
- Documentation: https://dokploy.com/docs
- GitHub: https://github.com/Dokploy/dokploy
- Community: Discord/GitHub Discussions

**Rollback Resources**:
- VPS Snapshot: Hetzner Console → Snapshots → pre-dokploy-migration-2025-10-26
- Caddyfile Backup: Docker volume /etc/caddy/Caddyfile.backup-pre-dokploy
- Config Backup: D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\pre-migration-backup\

**Support Escalation**:
- Hetzner Support: For VPS issues
- Dokploy GitHub Issues: For platform bugs
- Rollback to manual deployment: Always available via snapshot restoration

---

## Quick Start

**If you want to start immediately**:

1. **Read this file** (you're doing it!)
2. **Open Phase 1 guide**: [01-pre-migration-setup.md](./01-pre-migration-setup.md)
3. **Complete T001**: Create VPS snapshot (5-15 min)
4. **Continue sequentially** through Phase 1 tasks
5. **Don't skip validation steps** - they catch issues early
6. **Document as you go** - Update NOTES.md after each phase

**Estimated first session**: 2-3 hours (Phase 1-2 complete, Dokploy installed and accessible)

---

## Post-Migration Workflow

**After migration complete, your new deployment workflow**:

1. **Develop locally**:
   ```bash
   npm run dev
   # Make changes, test locally
   ```

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

3. **Automatic deployment**:
   - GitHub webhook triggers Dokploy
   - Build runs automatically
   - Deployment completes in 5-7 minutes
   - Site updates at marcusgoll.com

4. **Monitor deployment**:
   - Dokploy UI: https://deploy.marcusgoll.com
   - View logs, metrics, deployment status
   - (Optional) Receive email notification

5. **Rollback if needed**:
   - Dokploy UI → Deployments → Select previous → Rollback
   - <5 minutes to restore previous version

**No more**:
- SSH to VPS
- Manual docker commands
- Manual environment variable editing
- Build artifacts management

---

## Maintenance

**Daily**:
- (Automated) Database backup at 2:00 AM UTC
- (Automated) Health checks every 30 seconds

**Weekly**:
- Review deployment logs for errors
- Check resource usage (CPU, memory)
- Verify automated backups succeeded

**Monthly**:
- Review success metrics (deployment time, frequency, success rate)
- Check SSL certificate expiration (auto-renewed, but good to verify)
- Update Dokploy if new version available

**Quarterly**:
- Test rollback procedure (ensure muscle memory)
- Review and update deployment runbook if workflow changed
- Consider staging environment if traffic growing

---

## Troubleshooting

**If you get stuck during implementation**:

1. **Check validation checklist** - Did previous step complete successfully?
2. **Review logs** - Dokploy UI → Logs, or `docker logs dokploy`
3. **Search guide** - Use Ctrl+F to find error message or concept
4. **Rollback if needed** - Production can always be restored
5. **Document issue** - Add to NOTES.md for future reference

**Common Issues**:
- DNS not propagating → Wait longer (up to 24 hours, usually 5-60 min)
- SSL certificate fails → Verify DNS resolves correctly, port 80 accessible
- Build fails → Check Dockerfile compatibility, run `npm run build` locally first
- Health check fails → Verify /api/health endpoint exists and returns 200 OK
- Webhook not triggering → Check GitHub webhook deliveries, verify secret matches

---

## Version History

- **v1.0** (2025-10-26): Initial implementation guides created
- **Next**: Will be updated with actual migration experience, lessons learned

---

## Files in This Directory

```
implementation-guides/
├── README.md (this file)
├── 01-pre-migration-setup.md
├── 02-dokploy-installation.md
├── 03-application-migration.md
└── 04-database-cicd-cutover-validation.md
```

**Total Documentation**: ~15,000 words, 39 tasks covered

**Ready to start?** Open [01-pre-migration-setup.md](./01-pre-migration-setup.md) and begin with T001!
