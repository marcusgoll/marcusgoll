# Application Migration Guide

**Phase**: 3 of 8
**Tasks**: T009-T015
**Duration**: 2-3 hours
**Prerequisites**: Phase 2 complete, Dokploy accessible at https://deploy.marcusgoll.com

---

## Overview

This phase migrates the Next.js application to Dokploy management and validates deployment on test subdomain before production cutover.

**Goal**: Application deployed and functional on test.marcusgoll.com

**Risk Level**: LOW (production unchanged, testing on separate subdomain)

---

## T009: Create New Application in Dokploy UI

**Execution Steps**:

1. Login to Dokploy
   - URL: https://deploy.marcusgoll.com
   - Username: admin
   - Password: [from password manager]

2. Create new application
   - Click: "Applications" tab
   - Click: "Create Application" or "+" button

3. Configure application settings:
   ```
   Name: marcusgoll-nextjs
   Type: Application → Docker
   Build Method: Dockerfile
   Description: Marcus Gollahon personal website - Next.js 15
   ```

4. Click "Create" or "Save"

5. Verify application created
   - Should appear in Applications list
   - Status: Not deployed yet (no deployments)

**Validation**: Application "marcusgoll-nextjs" visible in Dokploy dashboard

---

## T010: Connect GitHub Repository

**Execution Steps**:

1. In Dokploy application settings
   - Navigate: Applications → marcusgoll-nextjs → Settings

2. Configure Git repository
   - Section: "Repository" or "Source"
   - Provider: GitHub
   - Repository URL: `https://github.com/YOUR_USERNAME/marcusgoll` (replace YOUR_USERNAME)
   - Branch: `main`

3. Authenticate with GitHub
   - Method A (OAuth): Click "Connect GitHub" → Authorize Dokploy
   - Method B (PAT): Generate GitHub Personal Access Token:
     ```
     GitHub → Settings → Developer Settings → Personal Access Tokens
     → Generate new token (classic)
     Scopes: repo (full control)
     Copy token and paste into Dokploy
     ```

4. Test connection
   - Click "Test Connection" or "Verify"
   - Should show: "Repository accessible"

5. Select branch
   - Branch: main
   - Auto-deploy on push: [Enable checkbox]

**Validation**: Dokploy can read repository, shows latest commits

---

## T011: Configure Build Settings

**Execution Steps**:

1. In application settings, find "Build Configuration"

2. Configure Dockerfile build:
   ```
   Build Method: Dockerfile
   Dockerfile Path: ./Dockerfile
   Build Context: / (root)
   Build Args: (leave empty unless needed)
   ```

3. Verify Dockerfile settings:
   - Your existing Dockerfile should be detected
   - Node version: 20 (from Dockerfile FROM node:20-alpine)
   - Build stages: Multi-stage (deps, builder, runner) - Dokploy detects automatically

4. Configure runtime settings:
   ```
   Port: 3000 (Next.js default)
   Health Check Path: /api/health
   Health Check Interval: 30s
   Health Check Timeout: 10s
   ```

5. Resource limits (optional):
   ```
   Memory Limit: 512MB (adjust based on your VPS capacity)
   CPU Limit: 1.0 (1 CPU core)
   ```

**Validation**: Build settings match your existing Dockerfile configuration

**Reference**: Your Dockerfile location: `D:\Coding\marcusgoll\Dockerfile`

---

## T012: Migrate Environment Variables

**Purpose**: Transfer production secrets from VPS to Dokploy UI

**Execution Steps**:

1. Retrieve current environment variables from VPS
   ```bash
   # SSH to VPS
   ssh root@178.156.129.179

   # Navigate to current deployment directory
   cd /opt/marcusgoll  # Or wherever your .env.production is

   # Display environment variables (CAREFUL: contains secrets)
   cat .env.production
   ```

2. In Dokploy UI, navigate to:
   - Applications → marcusgoll-nextjs → Environment Variables

3. Add each variable from .env.production:

   **Database Connection**:
   ```
   Key: DATABASE_URL
   Value: [paste from VPS .env.production]
   Type: Secret (check "Secret" box to mask value)
   ```

   **Supabase Public**:
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: [paste value]
   Type: Normal (public, not secret)
   ```

   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [paste value]
   Type: Normal (anon key is public)
   ```

   **Supabase Service Role** (Secret):
   ```
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: [paste value]
   Type: Secret ✓
   ```

   **Email Service** (pick one):
   ```
   Key: RESEND_API_KEY
   Value: [paste value]
   Type: Secret ✓
   ```
   OR
   ```
   Key: MAILGUN_API_KEY
   Value: [paste value]
   Type: Secret ✓
   ```

   **Newsletter**:
   ```
   Key: NEWSLETTER_FROM_EMAIL
   Value: newsletter@marcusgoll.com (or your actual sender)
   Type: Normal
   ```

   **Analytics**:
   ```
   Key: GA4_MEASUREMENT_ID
   Value: [paste value]
   Type: Normal
   ```

   **Auth** (if using NextAuth):
   ```
   Key: NEXTAUTH_SECRET
   Value: [paste value]
   Type: Secret ✓
   ```

   ```
   Key: NEXTAUTH_URL
   Value: https://marcusgoll.com (will update to test.marcusgoll.com temporarily)
   Type: Normal
   ```

   **Admin**:
   ```
   Key: ADMIN_EMAIL
   Value: marcus@marcusgoll.com
   Type: Normal
   ```

4. Verify all secrets masked
   - Secrets should show as `*****` in UI
   - Non-secrets should show full value

5. Save environment variables
   - Click "Save" or "Update"

**Validation Checklist**:
- [ ] All variables from VPS .env.production added to Dokploy
- [ ] Secrets marked as "Secret" and masked in UI (spec FR-028)
- [ ] No secrets visible in plain text
- [ ] Environment variables saved successfully

**Security Notes**:
- DO NOT commit .env.production to Git
- DO NOT share screenshots of Dokploy environment variables (contains secrets)
- Dokploy encrypts secrets at rest

**Variable Count**: Expected 8-12 variables (based on spec.md FR-008)

---

## T013: Configure Test Subdomain

**Purpose**: Create test.marcusgoll.com for validation before production cutover

**Execution Steps**:

1. Create DNS A record
   - DNS Provider: [Your provider - Cloudflare/Namecheap/etc]
   - Type: A
   - Name: test
   - Target: 178.156.129.179
   - TTL: 300 (5 minutes)
   - Save record

2. Wait for DNS propagation (5-60 minutes)
   ```powershell
   # Windows PowerShell - verify DNS
   nslookup test.marcusgoll.com
   # Expected: 178.156.129.179
   ```

3. In Dokploy UI, configure domain:
   - Navigate: Applications → marcusgoll-nextjs → Domains
   - Click: "Add Domain"
   - Domain: `test.marcusgoll.com`
   - SSL: Enable (Let's Encrypt automatic)
   - Save

4. Dokploy will automatically:
   - Configure Nginx upstream
   - Provision SSL certificate via Let's Encrypt
   - Set up HTTPS redirect

5. Verify domain configuration
   - Status: Should show "Active" or "SSL Provisioned"
   - Certificate: Let's Encrypt (auto-renewed)

**Validation**:
- [ ] DNS record created for test.marcusgoll.com
- [ ] DNS resolves to VPS IP (178.156.129.179)
- [ ] Domain added in Dokploy UI
- [ ] SSL status: Pending or Provisioned

**Note**: SSL provisioning happens during first deployment (T014)

---

## T014: Trigger First Deployment to Test Subdomain

**Purpose**: Deploy application and verify build process

**Execution Steps**:

1. In Dokploy UI:
   - Navigate: Applications → marcusgoll-nextjs
   - Click: "Deploy" button (manual trigger)

2. Monitor deployment in real-time:
   - Deployment logs should appear in UI
   - Watch for stages:
     ```
     ✓ Cloning repository from GitHub
     ✓ Building Docker image (Dockerfile)
       - Stage 1: deps (install dependencies)
       - Stage 2: builder (build Next.js)
       - Stage 3: runner (production image)
     ✓ Pushing image to internal registry
     ✓ Starting container
     ✓ Health check: /api/health
     ✓ SSL certificate provisioning (test.marcusgoll.com)
     ✓ Deployment successful
     ```

3. Expected duration: 5-7 minutes (spec NFR-002: <7 minutes)

4. Monitor for errors:
   - Build errors: Check Dockerfile compatibility
   - Health check failures: Verify /api/health endpoint exists
   - SSL errors: Verify DNS propagated

5. Verify deployment status
   - Status: "Deployed" or "Running"
   - Container: Shows as "Up" with uptime
   - URL: test.marcusgoll.com should be accessible

**Troubleshooting**:

**Build fails - dependency install**:
```
Check logs for npm install errors
Verify package.json and package-lock.json in repository
Ensure Node 20 compatible dependencies
```

**Build fails - TypeScript errors**:
```
Run locally first: npm run build
Fix type errors in codebase
Push fixes to GitHub
Retry deployment in Dokploy
```

**Health check fails**:
```
Verify /api/health endpoint exists:
File: src/app/api/health/route.ts (or pages/api/health.ts)

If missing, create basic health check:
export async function GET() {
  return Response.json({ status: 'ok' });
}

Commit and redeploy
```

**SSL provisioning fails**:
```
Verify DNS actually propagated (nslookup test.marcusgoll.com)
Check port 80 accessible (ACME challenge)
Wait 5 minutes and retry (Dokploy auto-retries)
```

**Validation**:
- [ ] Deployment triggered successfully
- [ ] Build completed without errors
- [ ] Container started and running
- [ ] Health check passing
- [ ] Deployment duration <7 minutes (spec NFR-002)
- [ ] SSL certificate provisioned for test.marcusgoll.com

---

## T015: Validate Test Deployment Functionality

**Purpose**: Comprehensive testing before production cutover

**Execution Steps**:

### 1. Homepage Test
```
URL: https://test.marcusgoll.com
Expected: Homepage loads with proper styling
Check: Header, navigation, hero section render correctly
```

### 2. Blog Posts Test
```
URL: https://test.marcusgoll.com/blog
Expected: Blog list page loads
Verify: Posts from PostgreSQL database display

Click: Recent blog post
Expected: Individual post page loads
Verify: MDX content renders, syntax highlighting works
```

### 3. Newsletter Form Test (Visual Only)
```
Location: Homepage or dedicated newsletter page
Check: Form visible and styled correctly
DO NOT SUBMIT: Don't create test subscriptions yet
Verify: Form fields (email input, submit button) present
```

### 4. Database Connection Test
```
Verification: Blog posts visible (proves DATABASE_URL works)
Check: Post count matches production
Verify: No database connection errors in Dokploy logs
```

### 5. Browser Console Test
```
Open: Chrome/Firefox DevTools (F12)
Tab: Console
Expected: No JavaScript errors
Allowed: Minor warnings for development mode
Red Flag: Errors like "Failed to load", "Network error", etc.
```

### 6. Performance Test
```
Tool: Browser DevTools → Network tab
Reload: https://test.marcusgoll.com
Measure: Page load time
Target: <2 seconds (spec NFR-003)

Optional: Run Lighthouse audit
Target: Score ≥85 (constitution.md standard)
```

### 7. Lighthouse Audit (Recommended)
```
Chrome DevTools → Lighthouse tab
Select: Performance, Accessibility, Best Practices, SEO
Device: Desktop
Run audit

Target Scores:
- Performance: ≥85
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90
```

### 8. SSL/Security Test
```
URL: https://test.marcusgoll.com
Browser: Should show padlock icon (secure)
Certificate: Click padlock → Certificate info
Issued by: Let's Encrypt
Valid: Check expiration date (should be ~90 days from now)

Optional: SSL Labs test
URL: https://www.ssllabs.com/ssltest/
Target: A or A+ rating (spec NFR-005)
```

### 9. Environment Variables Test
```
Check: GA4 tracking working
Method: GA4 Real-time reports (https://analytics.google.com)
Action: Visit test.marcusgoll.com in incognito window
Verify: Real-time visitor appears in GA4

Check: Database connection
Verified by: Posts loading (proves DATABASE_URL correct)

Check: Supabase connection
Verified by: No auth errors in console
```

### 10. Responsive Design Test (Optional)
```
Browser: DevTools → Device toolbar (Ctrl+Shift+M)
Devices:
- Mobile (375x667 - iPhone SE)
- Tablet (768x1024 - iPad)
- Desktop (1920x1080)

Check: Layout adapts correctly
Verify: No horizontal scroll, text readable
```

**Validation Checklist**:
- [ ] Homepage loads correctly (<2s)
- [ ] Blog posts render from database
- [ ] Newsletter form visible (visual check)
- [ ] No database connection errors
- [ ] No browser console errors
- [ ] Page load time <2 seconds
- [ ] Lighthouse score ≥85 (performance)
- [ ] SSL certificate valid (padlock icon)
- [ ] GA4 tracking working (optional verification)
- [ ] Responsive design working (optional)

**Documentation** (add to NOTES.md):

```markdown
## Phase 3 Validation (T015)

**Date**: 2025-10-26
**Test URL**: https://test.marcusgoll.com

### Functional Tests
- [x] Homepage: Loaded successfully
- [x] Blog posts: [X] posts visible from database
- [x] Newsletter form: Present and styled
- [x] Database: Connection working
- [x] Console: No critical errors

### Performance Metrics
- Page Load Time: X.Xs (target: <2s)
- Lighthouse Performance: XX/100 (target: ≥85)
- Lighthouse Accessibility: XX/100
- SSL Rating: [A/A+]

### Issues Found
[None / List any issues]

### Comparison to Production
- Layout: Identical ✓
- Performance: [Better/Same/Slightly worse]
- Functionality: All features working ✓

### Status
- [ ] All validation tests passed
- [ ] No blocking issues
- [ ] Ready for database integration (Phase 4) and CI/CD setup (Phase 5)
```

---

## Phase 3 Completion Checklist

Before proceeding to Phase 4 & 5:

- [ ] **T009**: Application created in Dokploy UI
- [ ] **T010**: GitHub repository connected
- [ ] **T011**: Build settings configured (Dockerfile-based)
- [ ] **T012**: All environment variables migrated from VPS
- [ ] **T013**: test.marcusgoll.com DNS configured and SSL provisioned
- [ ] **T014**: First deployment successful (<7 minutes)
- [ ] **T015**: All validation tests passed, no blocking issues

**Test Deployment URL**: https://test.marcusgoll.com

**Estimated Time Spent**: [record actual time]

**Blockers Encountered**: [none/list any issues]

**Production Status**: [still running on old infrastructure, unaffected]

**Next Phases**: Phase 4 (Database) and Phase 5 (CI/CD) can run in parallel

---

## Rollback Procedure (If Needed)

**If test deployment has issues**:

1. DO NOT proceed to production cutover
2. Debug issues using Dokploy logs
3. Production unaffected (still on old infrastructure)
4. Fix issues, redeploy to test.marcusgoll.com
5. Re-run T015 validation

**If need to abandon Dokploy**:
- Production still running normally
- Can remove test subdomain DNS record
- Delete application from Dokploy
- No impact on marcusgoll.com

**Recovery Time**: 0 minutes (production never affected)

---

## Appendix: Quick Reference

**Dokploy Application URL**:
```
Admin: https://deploy.marcusgoll.com
App: Applications → marcusgoll-nextjs
Test Site: https://test.marcusgoll.com
```

**Common Commands**:
```bash
# View Dokploy application logs
# (in Dokploy UI: Applications → marcusgoll-nextjs → Logs)

# Check DNS propagation
nslookup test.marcusgoll.com

# Test HTTPS
curl -I https://test.marcusgoll.com
```

**Next Steps**:
- Phase 4: Database integration (T016-T018)
- Phase 5: CI/CD integration (T019-T023)
- Both can run in parallel after Phase 3 complete
