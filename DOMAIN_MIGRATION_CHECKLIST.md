# Domain Migration: test.marcusgoll.com → marcusgoll.com

## ✅ Completed

- [x] DNS A records configured at registrar
- [x] Maintenance mode implemented
- [x] Sitemap uses marcusgoll.com
- [x] Robots.txt uses marcusgoll.com
- [x] Codebase references marcusgoll.com

## 🎯 Action Required

### 1. Dokploy Domain Configuration

**Location**: Dokploy Dashboard → marcusgoll app → Domains

**Remove** (if present):
- `test.marcusgoll.com`

**Add**:
- `marcusgoll.com` (primary)
- `www.marcusgoll.com` (redirect to apex)

**Steps**:
1. Open Dokploy dashboard
2. Select marcusgoll.com application
3. Click "Domains" tab
4. Remove any test.marcusgoll.com entries
5. Add `marcusgoll.com` as primary domain
6. Add `www.marcusgoll.com` with redirect enabled
7. Click "Save" - Traefik will auto-reload
8. Wait 1-2 minutes for Traefik configuration

### 2. Environment Variables in Dokploy

**Location**: Dokploy Dashboard → marcusgoll app → Environment Variables

Update these variables:
```
PUBLIC_URL=https://marcusgoll.com
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
```

**Steps**:
1. Go to "Environment" tab in Dokploy
2. Find `PUBLIC_URL` and update to `https://marcusgoll.com`
3. Find `NEXT_PUBLIC_SITE_URL` and update to `https://marcusgoll.com`
4. Click "Save"
5. Restart the application (Dokploy will prompt)

### 3. Enable Maintenance Mode (Recommended during migration)

Set in Dokploy environment variables:
```
MAINTENANCE_MODE=true
MAINTENANCE_BYPASS_TOKEN=7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048
```

**Why**: Shows branded maintenance page to external visitors during migration

**Bypass URL**: `https://marcusgoll.com/?bypass=7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048`

### 4. SSL Certificate Verification

After domain configuration:
```bash
# Test HTTPS (should auto-issue via Let's Encrypt)
curl -I https://marcusgoll.com
# Should return: 200 OK with valid cert

# Test www redirect
curl -I https://www.marcusgoll.com
# Should return: 308 redirect to https://marcusgoll.com
```

### 5. DNS Propagation Check

```bash
# Verify DNS resolution
dig marcusgoll.com +short
# Expected: [VPS_IP]

# Check global propagation
# Visit: https://dnschecker.org
# Enter: marcusgoll.com
# Verify: All regions show [VPS_IP]
```

### 6. Disable Maintenance Mode (When Ready)

In Dokploy environment variables:
```
MAINTENANCE_MODE=false
```

Then restart the application.

## 📝 Notes

- **Traefik**: Handles all reverse proxy and SSL automatically

- **SSL**: Auto-issued by Traefik via Let's Encrypt
- **Restart Required**: After environment variable changes

## 🔍 Verification Checklist

After migration:

```bash
# 1. Homepage loads
curl -I https://marcusgoll.com
# Expected: 200 OK

# 2. WWW redirects
curl -I https://www.marcusgoll.com  
# Expected: 308 → https://marcusgoll.com

# 3. Sitemap accessible
curl -I https://marcusgoll.com/sitemap.xml
# Expected: 200 OK

# 4. Robots.txt accessible
curl -I https://marcusgoll.com/robots.txt
# Expected: 200 OK

# 5. Health check works
curl https://marcusgoll.com/api/health
# Expected: {"status":"healthy"}

# 6. Maintenance mode works (if enabled)
curl -I https://marcusgoll.com
# Expected: 307 → /maintenance (without bypass token)
```

## ⚠️ Common Issues

### Issue: "502 Bad Gateway"
**Cause**: Application not running or wrong port
**Fix**: Check Dokploy logs, verify app is running

### Issue: "Certificate Invalid"
**Cause**: SSL not yet issued by Traefik
**Fix**: Wait 2-3 minutes, check Traefik logs in Dokploy

### Issue: "Maintenance page not showing"
**Cause**: MAINTENANCE_MODE not set or app not restarted
**Fix**: Verify env var in Dokploy, restart application

### Issue: "WWW not redirecting"
**Cause**: www domain not configured with redirect
**Fix**: In Dokploy domains, ensure www has "Redirect" enabled

## 📚 References

- Dokploy Docs: https://docs.dokploy.com
- Traefik Docs: https://doc.traefik.io
- Infrastructure: `infrastructure/dns/README.md`
- Maintenance Mode: `proxy.ts` (Next.js 16+)
