# Dokploy Installation Guide

**Phase**: 2 of 8
**Tasks**: T005-T008
**Duration**: 45-60 minutes
**Prerequisites**: Phase 1 complete, DNS propagated

---

## Overview

This phase installs Dokploy on the VPS and configures secure HTTPS access via subdomain. Current production deployment remains untouched and running.

**Goal**: Dokploy running and accessible at https://deploy.marcusgoll.com

**Risk Level**: LOW (Dokploy runs on separate port, no conflict with production)

---

## T005: Install Dokploy via Official Installation Script

**Purpose**: Install Dokploy container and dependencies

**Pre-flight Checks**:
```bash
# SSH to VPS
ssh root@178.156.129.179

# Verify Docker running
systemctl status docker
# Should show "active (running)"

# Check port 3000 availability
netstat -tuln | grep :3000
# If shows existing service, note it (will reassign Dokploy to different port if needed)
```

**Execution Steps**:

1. Download and run official installer
   ```bash
   # Official Dokploy installation command
   curl -sSL https://dokploy.com/install.sh | sh
   ```

2. Monitor installation output
   - Installer will pull Docker images
   - Create Dokploy container
   - Initialize database (SQLite internal)
   - Generate admin credentials

   Expected output includes:
   ```
   ✓ Installing Dokploy...
   ✓ Dokploy installed successfully
   ✓ URL: http://YOUR_VPS_IP:3000
   ✓ Username: admin
   ✓ Password: [GENERATED_PASSWORD]
   ```

3. Save admin credentials immediately
   ```bash
   # CRITICAL: Copy the generated password to password manager
   # Do NOT commit to Git
   # Example output:
   # Username: admin
   # Password: Xy9#kL2$mN4@pQ7
   ```

   **Save to password manager**:
   - Service: Dokploy (marcusgoll.com deployment)
   - URL: https://deploy.marcusgoll.com
   - Username: admin
   - Password: [paste generated password]

4. Verify Dokploy container running
   ```bash
   docker ps | grep dokploy

   # Expected output (similar to):
   # CONTAINER ID   IMAGE                    STATUS         PORTS
   # a1b2c3d4e5f6   dokploy/dokploy:latest  Up 2 minutes   0.0.0.0:3000->3000/tcp
   ```

5. Test local access (from VPS)
   ```bash
   curl http://localhost:3000
   # Should return HTML (Dokploy login page)
   ```

6. Check Dokploy logs
   ```bash
   docker logs $(docker ps -q -f name=dokploy) --tail 50

   # Look for successful startup messages:
   # ✓ Database initialized
   # ✓ Server listening on port 3000
   # ✓ Dokploy ready
   ```

**Validation Checklist**:
- [ ] Installation script completed without errors
- [ ] Dokploy container shows "Up" status in docker ps
- [ ] Admin credentials saved to password manager (NOT committed to Git)
- [ ] http://localhost:3000 accessible from VPS
- [ ] Logs show successful startup

**Troubleshooting**:

**Error: Port 3000 already in use**:
```bash
# Find what's using port 3000
sudo lsof -i :3000

# If it's your current Next.js app, that's OK
# Dokploy will be accessed via Caddy reverse proxy (next task)
# OR: Reconfigure Dokploy to different port
docker stop dokploy
docker rm dokploy
# Re-run installer with custom port:
DOKPLOY_PORT=3001 curl -sSL https://dokploy.com/install.sh | sh
```

**Error: Docker not found**:
```bash
# Install Docker first (should have been done in T003)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
systemctl start docker
systemctl enable docker
```

**Error: Permission denied**:
```bash
# Ensure running as root or user in docker group
sudo usermod -aG docker $USER
# Logout and re-login for group change to take effect
```

**Documentation** (add to NOTES.md):
```markdown
## Dokploy Installation (T005)

**Date**: 2025-10-26
**Installation Method**: Official script (curl | sh)

### Container Details
- Container ID: [from docker ps]
- Image: dokploy/dokploy:latest
- Port: 3000 (internal)
- Status: Up

### Admin Credentials
- Username: admin
- Password: ***SAVED IN PASSWORD MANAGER***
- URL: http://178.156.129.179:3000 (pre-Nginx)

### Logs Excerpt
```bash
# [paste last 20 lines of docker logs]
```

### Status
- [ ] Dokploy installed successfully
- [ ] Container running and healthy
- [ ] Credentials saved securely
- [ ] Ready for Caddy configuration
```

---

## T006: Configure Caddy for Dokploy Subdomain

**Purpose**: Enable HTTPS access to Dokploy UI via deploy.marcusgoll.com

**Execution Steps**:

1. SSH to VPS (if not already connected)
   ```bash
   ssh root@178.156.129.179
   ```

2. Edit Caddyfile in Caddy container
   ```bash
   # Option A: Edit in Docker
   docker exec proxy-caddy-1 vi /etc/caddy/Caddyfile

   # Option B: Copy file locally, edit, and copy back
   docker cp proxy-caddy-1:/etc/caddy/Caddyfile /tmp/Caddyfile
   nano /tmp/Caddyfile
   docker cp /tmp/Caddyfile proxy-caddy-1:/etc/caddy/Caddyfile
   ```

3. Add Dokploy subdomain entry (Caddyfile format):

```caddyfile
# Dokploy UI - Reverse Proxy Configuration
# Subdomain: deploy.marcusgoll.com
# Backend: localhost:3000 (Dokploy container)

deploy.marcusgoll.com {
    reverse_proxy localhost:3000
}
```

**Note**: Caddy automatically:
- Provisions SSL via Let's Encrypt (automatic on first request)
- Redirects HTTP → HTTPS
- Handles WebSocket upgrades
- Sets security headers
- Logs access/errors

4. Reload Caddy configuration (applies changes without downtime)
   ```bash
   docker exec proxy-caddy-1 caddy reload

   # Expected output:
   # {"level":"info","ts":1234567890,"msg":"reloaded config"}
   ```

5. Verify reload succeeded
   ```bash
   docker logs proxy-caddy-1 --tail 10
   # Look for: "reloaded config" or similar success message
   ```

6. Test HTTPS access (from local machine)
   ```powershell
   # Windows PowerShell
   curl https://deploy.marcusgoll.com
   # Should return HTML (Dokploy login page) with valid SSL certificate
   ```

**Validation Checklist**:
- [ ] Caddyfile entry added for deploy.marcusgoll.com
- [ ] Caddy reload successful (no errors in logs)
- [ ] SSL certificate provisioned (verify with curl -v)
- [ ] https://deploy.marcusgoll.com accessible (login page loads)
- [ ] SSL certificate valid (check with: echo | openssl s_client -servername deploy.marcusgoll.com -connect deploy.marcusgoll.com:443)

**Configuration Backup**:
```bash
# Save Caddyfile to feature directory
docker cp proxy-caddy-1:/etc/caddy/Caddyfile /tmp/Caddyfile.backup
docker exec proxy-caddy-1 cat /etc/caddy/Caddyfile > /tmp/Caddyfile

# Download to local machine (Windows PowerShell)
scp root@178.156.129.179:/tmp/Caddyfile D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\Caddyfile
```

**Troubleshooting**:

**Error: caddy reload fails with "duplicate route"**:
```bash
# Check if deploy.marcusgoll.com already configured
docker exec proxy-caddy-1 grep -n "deploy.marcusgoll.com" /etc/caddy/Caddyfile
# If multiple entries, remove duplicates
```

**Error: Caddy reload fails**:
```bash
# Check Caddy logs
docker logs proxy-caddy-1 --tail 20
# Look for error messages

# Verify Caddyfile syntax
docker exec proxy-caddy-1 caddy validate --config /etc/caddy/Caddyfile
```

**Documentation** (add to NOTES.md):
```markdown
## Caddy Subdomain Configuration (T006)

**Date**: 2025-10-26
**Config File**: Caddyfile (in proxy-caddy-1 container)

### Configuration Details
- Server Name: deploy.marcusgoll.com
- Proxy Target: localhost:3000
- SSL: Auto-provisioned via Let's Encrypt
- WebSocket: Automatic (Caddy default)

### Validation
```bash
$ docker logs proxy-caddy-1 --tail 10
# Should show reloaded config message

$ curl -I https://deploy.marcusgoll.com
# HTTP/2 200 OK with valid SSL certificate
```

### Status
- [ ] Caddyfile entry added
- [ ] Caddy reload successful
- [ ] HTTPS access working
- [ ] SSL certificate provisioned
- [ ] Ready for admin access configuration
```

---

## T007: Verify SSL Certificate for deploy.marcusgoll.com

**Purpose**: Confirm HTTPS access works and SSL certificate is valid

**Execution Steps**:

1. Test HTTPS access (from local machine)
   ```powershell
   # Windows PowerShell
   curl https://deploy.marcusgoll.com
   # Should return HTML (Dokploy login page) with valid SSL (no warnings)
   ```

2. Verify SSL certificate details
   ```powershell
   # Check certificate info
   echo | openssl s_client -servername deploy.marcusgoll.com -connect deploy.marcusgoll.com:443 2>/dev/null | openssl x509 -noout -text | grep -E "Subject:|Issuer:|Not Before|Not After"

   # Expected:
   # Issuer: C=US, O=Let's Encrypt...
   # Not Before: [today's date]
   # Not After: [date in ~90 days]
   ```

3. Test SSL quality (from browser or online tool)
   - Open: https://deploy.marcusgoll.com in browser
   - Check: Green padlock icon appears
   - Optional: Run SSL Labs test: https://www.ssllabs.com/ssltest/analyze.html?d=deploy.marcusgoll.com
   - Target: A or A+ rating

4. Verify SSL auto-renewal (Caddy handles this automatically)
   ```bash
   # Check Caddy logs for certificate details
   docker logs proxy-caddy-1 | grep -i "certificate"

   # Caddy automatically renews certificates before expiration
   ```

**Validation Checklist**:
- [ ] https://deploy.marcusgoll.com accessible without SSL warnings
- [ ] SSL certificate issued by Let's Encrypt
- [ ] Certificate valid for deploy.marcusgoll.com
- [ ] HTTP redirects to HTTPS automatically
- [ ] SSL Labs rating A or A+ (target per spec NFR-005)
- [ ] Certificate auto-renewal configured (Caddy default)

**Troubleshooting**:

**Error: SSL certificate not provisioned**:
```bash
# Check if Caddy needs to reload again
docker logs proxy-caddy-1 --tail 20
# Look for errors or warnings

# Verify DNS resolves correctly
nslookup deploy.marcusgoll.com
# Should resolve to 178.156.129.179
```

**Error: Port 80/443 not accessible**:
```bash
# Check firewall
sudo ufw status
# If blocked, allow HTTP/HTTPS:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

**Documentation** (add to NOTES.md):
```markdown
## SSL Certificate Verification (T007)

**Date**: 2025-10-26
**Domain**: deploy.marcusgoll.com
**Provider**: Let's Encrypt (auto-managed by Caddy)

### Certificate Details
- Auto-provisioned on first request to deploy.marcusgoll.com
- Issuer: Let's Encrypt
- Auto-renewal: Enabled by default in Caddy

### Validation
```bash
$ curl -I https://deploy.marcusgoll.com
# HTTP/2 200 OK

$ echo | openssl s_client -servername deploy.marcusgoll.com -connect deploy.marcusgoll.com:443 2>/dev/null | openssl x509 -noout -dates
# notBefore=[date]
# notAfter=[date in ~90 days]
```

### SSL Labs Test
- URL: https://www.ssllabs.com/ssltest/analyze.html?d=deploy.marcusgoll.com
- Rating: [A/A+]

### Auto-Renewal
- Caddy: Automatic (no manual action needed)
- Renewal happens in background ~30 days before expiration

### Status
- [ ] SSL certificate issued and valid
- [ ] HTTPS access working
- [ ] HTTP → HTTPS redirect functional
- [ ] Auto-renewal enabled
- [ ] Ready for admin access configuration
```

---

## T008: Configure Dokploy Admin Access and Security

**Purpose**: Login to Dokploy UI and configure security settings

**Execution Steps**:

1. Open Dokploy UI in browser
   ```
   URL: https://deploy.marcusgoll.com
   ```

2. Login with admin credentials
   - Username: `admin`
   - Password: [from T005, saved in password manager]

3. Verify dashboard loads successfully
   - Should see Dokploy dashboard
   - Tabs: Applications, Databases, Settings, etc.
   - Status: No applications yet

4. Change default admin password (recommended)
   - Navigate: Settings → Profile or Admin Settings
   - Change password to strong custom password
   - Update password manager with new password

5. (Optional) Configure IP restriction in Caddy

   If you want to restrict Dokploy access to your IP only:

   ```bash
   # SSH to VPS
   ssh root@178.156.129.179

   # Edit Caddyfile
   docker exec proxy-caddy-1 vi /etc/caddy/Caddyfile

   # Find the deploy.marcusgoll.com block and add IP restriction:
   # Replace YOUR_IP with your public IP (find at: https://whatismyip.com)

   deploy.marcusgoll.com {
       @denied not remote_ip YOUR_IP
       respond @denied 403
       reverse_proxy localhost:3000
   }

   # Reload Caddy
   docker exec proxy-caddy-1 caddy reload
   ```

6. Document admin access procedure
   ```markdown
   # Dokploy Admin Access

   **URL**: https://deploy.marcusgoll.com
   **Username**: admin
   **Password**: [in password manager: "Dokploy (marcusgoll.com)"]

   **IP Restriction**: [Yes/No]
   **Allowed IPs**: [your IPs if restricted]

   **Access From**:
   - Home network: [Yes/No]
   - Mobile: [Yes/No] (if IP restricted, only from allowed IPs)
   - VPN: [Yes/No]
   ```

7. Test logout and re-login
   - Logout from Dokploy UI
   - Close browser
   - Re-open https://deploy.marcusgoll.com
   - Login again with credentials
   - Verify: Login successful

**Validation Checklist**:
- [ ] Dokploy UI accessible at https://deploy.marcusgoll.com
- [ ] Admin login successful with saved credentials
- [ ] Dashboard loads without errors
- [ ] Password changed from default (optional but recommended)
- [ ] IP restriction configured (optional, per spec FR-004)
- [ ] Admin access procedure documented in NOTES.md

**Security Best Practices**:

1. **Strong Password**: Use password manager to generate 20+ character password
2. **IP Restriction** (optional): Limit access to known IPs only
3. **2FA** (future): Check if Dokploy supports 2FA in later versions
4. **Audit Logs**: Review Dokploy access logs periodically

**Documentation** (add to NOTES.md):
```markdown
## Dokploy Admin Access Configuration (T008)

**Date**: 2025-10-26
**URL**: https://deploy.marcusgoll.com

### Access Details
- Admin Username: admin
- Password: ***IN PASSWORD MANAGER***
- Password Manager Entry: "Dokploy (marcusgoll.com deployment)"

### Security Configuration
- Password Strength: [Strong 20+ chars / Default changed / etc]
- IP Restriction: [Enabled/Disabled]
- Allowed IPs: [list if restricted]
- 2FA: Not available (check in future Dokploy versions)

### Dashboard Status
- Applications: 0 (none configured yet)
- Databases: 0 (will import in Phase 4)
- Resources: [screenshot or description of resource usage]

### Validation
- [x] Login successful
- [x] Dashboard loads
- [x] No errors in browser console
- [x] HTTPS working correctly

### Status
- [ ] Admin access configured and tested
- [ ] Security settings applied
- [ ] Access procedure documented
- [ ] Ready for Phase 3 (Application Migration)
```

---

## Phase 2 Completion Checklist

Before proceeding to Phase 3 (Application Migration):

- [ ] **T005**: Dokploy installed and container running
- [ ] **T006**: Nginx configuration created and HTTP access working
- [ ] **T007**: SSL certificate provisioned, HTTPS access working
- [ ] **T008**: Admin access configured, login successful

**Estimated Time Spent**: [record actual time]

**Blockers Encountered**: [none/list any issues]

**Current Production Status**: [still running normally, unaffected]

**Ready for Phase 3**: YES / NO

**Next Phase**: [03-application-migration.md](./03-application-migration.md)

---

## Rollback Procedure (If Needed)

**If Dokploy causing issues**:

1. Stop Dokploy container
   ```bash
   docker stop dokploy
   ```

2. Remove Nginx subdomain config
   ```bash
   rm /etc/nginx/sites-enabled/dokploy
   systemctl reload nginx
   ```

3. Production unaffected (still running on port 80/443 via old setup)

**If need to completely remove Dokploy**:
```bash
# Stop and remove container
docker stop dokploy
docker rm dokploy

# Remove images
docker rmi dokploy/dokploy:latest

# Remove Nginx config
rm /etc/nginx/sites-available/dokploy
rm /etc/nginx/sites-enabled/dokploy
systemctl reload nginx

# Revoke SSL certificate (optional)
certbot delete --cert-name deploy.marcusgoll.com

# Remove DNS record (from DNS provider dashboard)
```

**Recovery Time**: < 10 minutes

---

## Appendix: Quick Reference Commands

```bash
# Check Dokploy status
docker ps | grep dokploy

# View Dokploy logs
docker logs -f $(docker ps -q -f name=dokploy)

# Restart Dokploy
docker restart dokploy

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

# Check SSL certificate
certbot certificates

# Test HTTPS
curl -I https://deploy.marcusgoll.com

# Login to Dokploy UI
https://deploy.marcusgoll.com
# Username: admin
# Password: [from password manager]
```
