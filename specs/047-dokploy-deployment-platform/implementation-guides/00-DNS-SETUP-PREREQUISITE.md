# DNS Setup Prerequisites

**IMPORTANT**: Read this BEFORE starting Phase 1 (Pre-Migration Setup)

**VPS IP**: 178.156.129.179

---

## Current Situation

Based on your clarification:
- ✅ VPS running at: **178.156.129.179**
- ❌ DNS not currently pointing marcusgoll.com to VPS
- ❓ Domain registered but DNS not configured

---

## DNS Configuration Required

For Dokploy migration, you need **TWO DNS records**:

### 1. Main Domain (Production Application)

**Record Type**: A Record
```
Type: A
Name: @ (or marcusgoll.com)
Target: 178.156.129.179
TTL: 300 (5 minutes for testing, increase to 3600 after stable)
```

**Purpose**: Points marcusgoll.com to your VPS where Next.js app runs

**When to configure**:
- **Option A (Recommended)**: Configure NOW if not already done
  - Ensures current production is accessible via domain
  - Allows DNS propagation before Dokploy migration starts
- **Option B**: Skip if accessing via IP is acceptable during migration
  - Can configure after Dokploy cutover (T024-T026)

### 2. Dokploy Subdomain (Admin UI)

**Record Type**: A Record
```
Type: A
Name: deploy
Full Domain: deploy.marcusgoll.com
Target: 178.156.129.179
TTL: 300 (5 minutes for testing)
```

**Purpose**: Points deploy.marcusgoll.com to Dokploy web UI

**When to configure**: During T004 (Pre-Migration Setup, Phase 1)

---

## DNS Setup Scenarios

### Scenario 1: Domain Not Configured Yet (Your Current Situation)

**What you need to do**:

1. **Before Migration** (recommended):
   ```
   # Configure main domain
   Type: A
   Name: @ (or marcusgoll.com)
   Target: 178.156.129.179
   TTL: 300

   # Configure Dokploy subdomain
   Type: A
   Name: deploy
   Target: 178.156.129.179
   TTL: 300
   ```

2. **Wait for DNS propagation** (5-60 minutes)
   - Verify: `nslookup marcusgoll.com` → 178.156.129.179
   - Verify: `nslookup deploy.marcusgoll.com` → 178.156.129.179

3. **Test current production**:
   ```powershell
   # Should show your Next.js app
   curl https://marcusgoll.com
   # OR (if SSL not configured yet)
   curl http://marcusgoll.com
   ```

4. **Proceed with Dokploy migration** (Phase 1-8)

### Scenario 2: Main Domain Already Configured

**What you need to do**:

1. **Verify current DNS**:
   ```powershell
   nslookup marcusgoll.com
   # Expected: 178.156.129.179
   ```

2. **Add Dokploy subdomain only** (T004):
   ```
   Type: A
   Name: deploy
   Target: 178.156.129.179
   TTL: 300
   ```

3. **Proceed with Dokploy migration**

### Scenario 3: DNS Pointed to Different IP

**What you need to do**:

1. **Update DNS A record**:
   - Change from: [old IP]
   - Change to: 178.156.129.179

2. **Wait for propagation** (TTL dependent, 5-60 min)

3. **Verify with nslookup**

4. **Proceed with Dokploy migration**

---

## DNS Provider Quick Guides

### Cloudflare

1. Login: https://dash.cloudflare.com
2. Select domain: marcusgoll.com
3. Tab: DNS → Records
4. Click "Add record"
5. Configure A records as shown above
6. **IMPORTANT**: Set Proxy status to "DNS Only" (gray cloud icon)
   - Proxied (orange cloud) = Cloudflare CDN (not compatible with Dokploy initially)
   - DNS Only (gray cloud) = Direct to VPS

### Namecheap

1. Login: https://www.namecheap.com
2. Domain List → Manage (marcusgoll.com)
3. Advanced DNS tab
4. Add New Record
5. Configure A records as shown above

### GoDaddy

1. Login: https://account.godaddy.com
2. My Products → DNS
3. Click marcusgoll.com
4. Add → A Record
5. Configure as shown above

### Other Providers

General steps:
1. Login to domain registrar
2. Find DNS management / DNS records section
3. Add A records
4. Point to: 178.156.129.179
5. Save and wait for propagation

---

## Verification Steps

After configuring DNS, verify before proceeding:

### Main Domain Verification

```powershell
# Check DNS resolution
nslookup marcusgoll.com
# Expected: Address: 178.156.129.179

# Test HTTP connection
curl http://marcusgoll.com
# Expected: HTML response from Next.js app OR 404 if app not running

# Test HTTPS (if SSL already configured)
curl https://marcusgoll.com
# Expected: HTML response OR certificate error if SSL not configured
```

### Dokploy Subdomain Verification

```powershell
# Check DNS resolution
nslookup deploy.marcusgoll.com
# Expected: Address: 178.156.129.179

# Test connection (will fail until Dokploy installed)
curl http://deploy.marcusgoll.com
# Expected: Connection refused (normal, Dokploy not installed yet)
```

### DNS Propagation Checker

Use online tool:
- URL: https://dnschecker.org
- Enter domain: marcusgoll.com
- Verify: Shows 178.156.129.179 in multiple regions globally

---

## Recommended Timeline

**Option A (Recommended)**: Configure DNS First
```
Day 0 (Before Migration):
  - Configure both DNS records (main + deploy subdomain)
  - Wait 1-2 hours for full global propagation
  - Verify DNS resolution

Day 1 (Start Migration):
  - DNS already propagated, no waiting
  - Proceed with T001-T004 (Pre-Migration Setup)
  - Continue with Dokploy installation
```

**Option B**: Configure During Migration
```
Day 1 (Migration Start):
  - T001-T003: VPS snapshot, backups, prerequisites
  - T004: Configure DNS for deploy subdomain
  - Wait 5-60 minutes for propagation
  - Continue with Dokploy installation (T005-T008)

  Risk: DNS propagation delays migration timeline
```

---

## What If DNS Not Configured?

**Can you proceed without DNS?**

**Short answer**: Partially, but not recommended

**Impact**:
- ✅ Can install Dokploy (T005-T008)
- ✅ Can access Dokploy via IP: http://178.156.129.179:3001 (Dokploy default port)
- ❌ Cannot configure SSL for Dokploy UI (Let's Encrypt requires domain)
- ❌ Cannot test application on test subdomain (test.marcusgoll.com)
- ❌ Cannot complete production cutover (T024-T026)

**Recommendation**: Configure DNS before starting migration

---

## SSL Considerations

### Current SSL Setup

**Check if SSL already configured** on VPS:

```bash
# SSH to VPS
ssh root@178.156.129.179

# Check SSL certificates
sudo certbot certificates

# Expected output if SSL configured:
# Found the following certs:
#   Certificate Name: marcusgoll.com
#     Domains: marcusgoll.com www.marcusgoll.com
#     Expiry Date: [date]
```

### After DNS Configuration

If SSL not configured, you'll need it for:
1. Main domain HTTPS (marcusgoll.com)
2. Dokploy subdomain HTTPS (deploy.marcusgoll.com)

SSL configuration covered in:
- T006: Configure SSL for deploy.marcusgoll.com (Dokploy UI)
- Post-cutover: SSL for marcusgoll.com (if not already configured)

---

## Quick Checklist Before Starting Migration

**DNS Prerequisites**:
- [ ] Main domain DNS configured: marcusgoll.com → 178.156.129.179
- [ ] DNS propagated (verified with nslookup)
- [ ] Current production accessible via domain (if applicable)
- [ ] Dokploy subdomain DNS configured: deploy.marcusgoll.com → 178.156.129.179
- [ ] Subdomain DNS propagated

**OR (Minimal)**:
- [ ] Acceptable to use IP access during migration: http://178.156.129.179
- [ ] Will configure DNS during T004 (adds 5-60 min wait time)

**Once DNS configured**, proceed to Phase 1:
→ `implementation-guides/01-pre-migration-setup.md`

---

## Questions or Issues?

**DNS not propagating**:
- Check TTL on old DNS records (may need to wait longer)
- Verify DNS provider saved changes
- Try `ipconfig /flushdns` (Windows) to clear local DNS cache

**Cloudflare proxy issues**:
- Ensure "Proxy status" is "DNS Only" (gray cloud), not "Proxied" (orange cloud)
- Proxied mode routes through Cloudflare CDN, breaks direct VPS access

**Domain shows old content**:
- Check if VPS running old application or different site
- Verify Nginx configuration pointing to correct application

---

**Next Step After DNS Setup**:
→ Start with `implementation-guides/README.md` (Master Guide)
→ Then proceed to `implementation-guides/01-pre-migration-setup.md` (T001-T004)