# DNS Cutover Checklist: marcusgoll.com

**Purpose**: Step-by-step guide for switching primary domain from test.marcusgoll.com to marcusgoll.com

**Status**: Ready to execute when user approves
**Current Primary**: test.marcusgoll.com
**Target Primary**: marcusgoll.com
**Expected Downtime**: ~5-15 minutes during DNS propagation

---

## Pre-Cutover Verification (Do NOT Skip)

### System Health Checks

- [ ] **Web Application**: HTTP 200 response
  ```bash
  curl -I https://test.marcusgoll.com
  # Expected: HTTP/2 200 OK
  ```

- [ ] **Staging Environment**: Operational
  ```bash
  curl -I https://staging.marcusgoll.com
  # Expected: HTTP/2 200 OK
  ```

- [ ] **Dokploy Dashboard**: Accessible
  ```bash
  curl -I https://deploy.marcusgoll.com
  # Expected: HTTP/2 200 OK
  ```

- [ ] **Last Deployment Status**: Successful
  - Check Dokploy: Status shows "done"
  - No failed tasks in Docker Swarm
  - Service replicas: 1/1

- [ ] **Recent Backup**: Available
  ```bash
  ssh hetzner
  ls -lh /opt/backups/ | tail -1
  # Should show backup from today or recent date
  ```

- [ ] **Health Checks**: Passing
  ```bash
  ssh hetzner
  tail -20 /var/log/marcusgoll-health.log
  # All checks should show ✅
  ```

- [ ] **Database**: Accessible and responding
  ```bash
  ssh hetzner
  docker exec postgres psql -U postgres -d marcusgoll_db -c "SELECT 1;"
  # Expected: Result showing "1" (success)
  ```

- [ ] **SSL Certificates**: Valid and not expiring soon
  ```bash
  # Check test.marcusgoll.com cert
  echo | openssl s_client -servername test.marcusgoll.com \
    -connect test.marcusgoll.com:443 2>/dev/null | \
    openssl x509 -noout -enddate
  # Expected: Date is months in the future
  ```

### Configuration Verification

- [ ] **marcusgoll.com DNS Record Prepared**: Not yet added (will add in Step 1)

- [ ] **Traefik Routing Configured**: Yes
  ```bash
  ssh hetzner
  grep -A 3 "prod-router" /etc/dokploy/traefik/dynamic/dokploy.yml
  # Should show: rule: Host(`marcusgoll.com`,`www.marcusgoll.com`)
  ```

- [ ] **SSL Certificates Ready**: Ready to provision on DNS add
  - Traefik will auto-provision when DNS resolves
  - Let's Encrypt is configured
  - No manual cert upload needed

- [ ] **Environment Variables**: Reviewed
  - PUBLIC_URL currently: `https://test.marcusgoll.com`
  - NEXT_PUBLIC_SITE_URL currently: `https://test.marcusgoll.com`
  - Will update after DNS cutover

### Team Communication

- [ ] **Stakeholders Notified**: Inform anyone using marcusgoll.com
  - Expected brief downtime: 5-15 minutes
  - No action needed from users
  - test.marcusgoll.com will remain active

---

## Step-by-Step Cutover Process

### Step 1: Add DNS A Record (5 minutes)

**Location**: Your domain registrar (Namecheap, GoDaddy, etc.)

```
Hostname: marcusgoll.com
Record Type: A
Value: 5.161.75.135
TTL: 3600 (1 hour - important for easy rollback!)
```

**Actions**:
- [ ] Log in to domain registrar
- [ ] Navigate to DNS records
- [ ] Add new A record for marcusgoll.com
- [ ] Add www.marcusgoll.com as CNAME to marcusgoll.com (optional, recommended)
- [ ] Save changes
- [ ] Note the time of change: _________ (HH:MM UTC)

**Expected Result**: DNS query will start returning IP within minutes, full propagation within 48 hours

---

### Step 2: DNS Propagation Wait (5-15 minutes)

**Monitor DNS propagation**:

```bash
# Check if DNS has resolved (repeat every minute)
nslookup marcusgoll.com
# or
dig marcusgoll.com
# or
curl -I https://marcusgoll.com

# Once you get 200 OK, DNS has propagated to your location
```

**Checkpoint** - [ ] marcusgoll.com returns HTTP 200

```bash
curl -I https://marcusgoll.com
# Expected: HTTP/2 200 OK

curl -I https://www.marcusgoll.com
# Expected: HTTP/2 200 OK (redirects to marcusgoll.com)
```

**Note**: DNS may propagate at different speeds globally. Some regions might still see test.marcusgoll.com. This is normal.

---

### Step 3: SSL Certificate Verification (2-5 minutes)

Once DNS resolves, Traefik will automatically request Let's Encrypt certificate for marcusgoll.com.

**Monitor certificate provisioning**:

```bash
ssh hetzner

# Watch Traefik logs for certificate issuance
docker logs -f $(docker ps -q -f "name=traefik") | grep -i "certificate\|letsencrypt"

# Should see output like:
# "Certificate for marcusgoll.com issued"
# "renewalDaysBeforeExpiry=30"
```

**Verify certificate**:

```bash
# Check certificate details
echo | openssl s_client -servername marcusgoll.com \
  -connect marcusgoll.com:443 2>/dev/null | \
  openssl x509 -noout -subject -dates

# Expected output:
# subject=CN = marcusgoll.com
# notBefore=YYYY-MM-DD...
# notAfter=YYYY-MM-DD...
```

**Checkpoint** - [ ] SSL certificate provisioned and valid

```bash
curl -I https://marcusgoll.com
# Must NOT show certificate errors
# Expected: HTTP/2 200 OK
```

---

### Step 4: Update Environment Variables (Optional but Recommended)

If you want to update the application to reference the new primary domain:

```bash
ssh hetzner

# Update service environment variables
docker service update marcusgoll-nextjs \
  --env-add "PUBLIC_URL=https://marcusgoll.com" \
  --env-add "NEXT_PUBLIC_SITE_URL=https://marcusgoll.com"

# Monitor the update
docker service ps marcusgoll-nextjs

# Wait for new task to start
sleep 10

# Verify
curl -I https://marcusgoll.com
```

**Checkpoint** - [ ] Environment variables updated (optional)

```bash
# Verify new variables are set
docker service inspect marcusgoll-nextjs | grep -A 2 "PUBLIC_URL"
```

---

### Step 5: Test All Access Paths (2-3 minutes)

Verify everything works:

```bash
# Test primary domain
curl -I https://marcusgoll.com
# Expected: HTTP/2 200

# Test www subdomain
curl -I https://www.marcusgoll.com
# Expected: HTTP/2 200 or redirect to marcusgoll.com

# Test staging still works
curl -I https://staging.marcusgoll.com
# Expected: HTTP/2 200

# Test application endpoints
curl https://marcusgoll.com/ | head -20
# Should see HTML content
```

**Checkpoint** - [ ] All domains returning 200 OK

---

### Step 6: Verify Application Functionality (3-5 minutes)

Test the application in your browser:

- [ ] Open https://marcusgoll.com in browser
- [ ] Page loads without errors
- [ ] Navigation works
- [ ] Blog posts/content loads
- [ ] No mixed content warnings (🔒 should show)
- [ ] Analytics tracking (GA) working
- [ ] Images/assets loading
- [ ] Responsive design works (test on mobile if possible)

**Checkpoint** - [ ] Application fully functional on marcusgoll.com

---

### Step 7: Verify test.marcusgoll.com Still Works (2 minutes)

Ensure fallback domain remains active:

```bash
curl -I https://test.marcusgoll.com
# Expected: HTTP/2 200 OK
```

- [ ] test.marcusgoll.com responds
- [ ] Staging still accessible at staging.marcusgoll.com
- [ ] Dokploy still accessible at deploy.marcusgoll.com

**Checkpoint** - [ ] Fallback domains operational

---

### Step 8: Monitor and Confirm Stability (30 minutes minimum)

Keep monitoring the application:

```bash
# Run health checks repeatedly
for i in {1..10}; do
  echo "Check $i - $(date)"
  curl -I https://marcusgoll.com
  sleep 3
done

# Check logs for errors
ssh hetzner
docker service logs marcusgoll-nextjs --tail 50

# Monitor health check script
tail -f /var/log/marcusgoll-health.log
```

**Checkpoint** - [ ] No errors in last 30 minutes
- [ ] Health checks all passing
- [ ] No 502 errors
- [ ] No timeout errors
- [ ] Application performing normally

---

## Rollback Plan (If Issues Occur)

If you encounter problems with marcusgoll.com DNS:

### Quick Rollback (< 1 minute)

```bash
# Via domain registrar:
# 1. Remove or update DNS A record for marcusgoll.com
# 2. Save changes

# Application continues serving on test.marcusgoll.com
# Users accessing marcusgoll.com will get DNS error (expected during rollback)
# No immediate re-deployment needed
```

### Full Rollback Steps

1. **Revert DNS** (domain registrar):
   - Remove marcusgoll.com A record
   - Save changes

2. **Re-establish Primary**:
   - Continue using test.marcusgoll.com as primary
   - No application changes needed

3. **Investigate Issue**:
   - Check Traefik logs: `docker logs traefik | grep -i error`
   - Check application logs: `docker service logs marcusgoll-nextjs`
   - Check database: `docker exec postgres psql -U postgres -d marcusgoll_db -c "SELECT 1;"`

4. **Retry Cutover**:
   - Fix identified issue
   - Wait 24 hours for DNS cache to clear
   - Attempt cutover again

---

## Post-Cutover Tasks

After successful DNS cutover:

### Day 1

- [ ] **Monitor health**: Check logs and health endpoint
  ```bash
  tail -f /var/log/marcusgoll-health.log
  ```

- [ ] **Verify email/notifications**: If blog sends emails, test

- [ ] **Check analytics**: Verify GA data coming in for new domain

- [ ] **Update documentation**: Update any internal docs/runbooks

### Week 1

- [ ] **Monitor uptime**: No unusual downtime
  ```bash
  tail /var/log/marcusgoll-health.log | grep "✓" | wc -l
  # Should be ~168 checks (24 hours × 60 minutes ÷ 10 minute spacing)
  ```

- [ ] **Check DNS resolution globally**: Use online tools
  - https://www.whatsmydns.net/?q=marcusgoll.com
  - Should show 5.161.75.135 everywhere

- [ ] **Verify SSL certificate renewal**: Working automatically
  ```bash
  echo | openssl s_client -servername marcusgoll.com \
    -connect marcusgoll.com:443 2>/dev/null | \
    openssl x509 -noout -enddate
  ```

### Ongoing

- [ ] **DNS TTL**: After 24 hours, can increase TTL from 3600 to 86400 (24 hours) for performance

- [ ] **Optional**: Update CDN/caching if using Cloudflare

- [ ] **Optional**: Configure monitoring alerts for marcusgoll.com specifically

---

## Troubleshooting During Cutover

### Issue: DNS Not Resolving

**Symptoms**: `nslookup marcusgoll.com` returns "server can't find marcusgoll.com"

**Resolution**:
1. Verify DNS record added in registrar
2. Wait 5-10 minutes
3. Try flushing DNS cache (if on Linux/macOS):
   ```bash
   # macOS
   sudo dscacheutil -flushcache

   # Linux (if using systemd-resolved)
   sudo systemctl restart systemd-resolved
   ```
4. Try different DNS server: `nslookup marcusgoll.com 8.8.8.8`

### Issue: 502 Bad Gateway on marcusgoll.com

**Symptoms**: `curl -I https://marcusgoll.com` returns HTTP 502

**Resolution**:
1. Wait 1-2 minutes (certificate might still provisioning)
2. Check application running: `docker service ps marcusgoll-nextjs`
3. Check backend responding: `curl http://localhost:3001`
4. Restart Traefik: `docker restart $(docker ps -q -f "name=traefik")`
5. Check logs: `docker logs traefik | tail -20`

### Issue: SSL Certificate Not Provisioning

**Symptoms**: `curl https://marcusgoll.com` shows certificate error

**Resolution**:
1. DNS must resolve first: `nslookup marcusgoll.com` should return 5.161.75.135
2. Wait 2-5 minutes for Let's Encrypt to issue certificate
3. Check Traefik logs: `docker logs -f traefik | grep -i "certificate\|letsencrypt"`
4. Force Traefik restart: `docker restart $(docker ps -q -f "name=traefik")`
5. Verify ACME challenges can reach server: `curl http://marcusgoll.com/.well-known/acme-challenge/test`

### Issue: Mixed Content Warning (🔒 with ⚠️)

**Symptoms**: Browser shows padlock with warning

**Resolution**:
1. Check for hardcoded `http://` URLs in blog posts
2. All external resources should use HTTPS
3. Update any public/absolute URLs in markdown content
4. Redeploy: `docker service update --force marcusgoll-nextjs`

---

## Checklist Summary

### Pre-Cutover (Do before DNS)
- [ ] All system health checks passing
- [ ] Last backup verified
- [ ] Configuration correct
- [ ] Stakeholders notified

### Cutover (Execute in order)
- [ ] Add DNS A record (marcusgoll.com → 5.161.75.135)
- [ ] Wait for DNS propagation (5-15 min)
- [ ] Verify SSL certificate issued
- [ ] Update environment variables (optional)
- [ ] Test all access paths
- [ ] Verify application functionality
- [ ] Confirm fallback domains working
- [ ] Monitor stability (30 min)

### Post-Cutover (First week)
- [ ] Monitor health continuously
- [ ] Verify email/notifications working
- [ ] Check analytics
- [ ] Update documentation
- [ ] Verify DNS propagated globally
- [ ] Confirm SSL auto-renewal working

---

## Support Contact

If issues arise during cutover:

1. **Emergency Restart**: `docker service update --force marcusgoll-nextjs`
2. **Check Status**: `docker service ps marcusgoll-nextjs`
3. **View Logs**: `docker service logs marcusgoll-nextjs -f`
4. **Rollback DNS**: Update registrar to remove marcusgoll.com record (< 1 min rollback)

---

## Documents Reference

- **System Status**: PRODUCTION_READINESS.md
- **Operational Tasks**: OPERATIONS_RUNBOOK.md
- **Deployment Info**: DEPLOYMENT_STATUS.md (from Phase 5)
- **Environment Variables**: .env.example

---

**Ready to proceed when you confirm**: ✅ System is stable and ready for DNS cutover
