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
# Dokploy will be accessed via Nginx reverse proxy (next task)
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
- [ ] Ready for Nginx configuration
```

---

## T006: Create Nginx Configuration for Dokploy Subdomain

**Purpose**: Enable HTTPS access to Dokploy UI via deploy.marcusgoll.com

**Execution Steps**:

1. SSH to VPS (if not already connected)
   ```bash
   ssh root@178.156.129.179
   ```

2. Create Nginx server block for Dokploy
   ```bash
   nano /etc/nginx/sites-available/dokploy
   ```

3. Paste the following configuration:

```nginx
# Dokploy UI - Reverse Proxy Configuration
# Subdomain: deploy.marcusgoll.com
# Backend: localhost:3000 (Dokploy container)

server {
    listen 80;
    listen [::]:80;
    server_name deploy.marcusgoll.com;

    # Redirect HTTP to HTTPS (will be configured by Certbot in T007)
    # return 301 https://$server_name$request_uri;

    # Temporary: Allow HTTP until SSL configured
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # WebSocket support (required for Dokploy real-time features)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts (longer for deployment operations)
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }

    # Security headers (basic)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/dokploy_access.log;
    error_log /var/log/nginx/dokploy_error.log;
}
```

4. Save file (Ctrl+O, Enter, Ctrl+X in nano)

5. Enable site by creating symlink
   ```bash
   ln -s /etc/nginx/sites-available/dokploy /etc/nginx/sites-enabled/dokploy
   ```

6. Verify symlink created
   ```bash
   ls -la /etc/nginx/sites-enabled/ | grep dokploy
   # Should show: dokploy -> /etc/nginx/sites-available/dokploy
   ```

7. Test Nginx configuration
   ```bash
   nginx -t

   # Expected output:
   # nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
   # nginx: configuration file /etc/nginx/nginx.conf test is successful
   ```

8. If test successful, reload Nginx
   ```bash
   systemctl reload nginx
   ```

9. Verify Nginx reloaded without errors
   ```bash
   systemctl status nginx
   # Should show "active (running)" and recent reload timestamp
   ```

10. Test HTTP access (from local machine)
   ```powershell
   # Windows PowerShell
   curl http://deploy.marcusgoll.com
   # Should return HTML (Dokploy login page)
   ```

**Validation Checklist**:
- [ ] Nginx config file created: /etc/nginx/sites-available/dokploy
- [ ] Symlink created: /etc/nginx/sites-enabled/dokploy
- [ ] nginx -t passes without errors
- [ ] Nginx reloaded successfully
- [ ] http://deploy.marcusgoll.com accessible (login page loads)

**Configuration Backup**:
```bash
# Save Nginx config to feature directory
cat /etc/nginx/sites-available/dokploy > /tmp/nginx-dokploy-subdomain.conf

# Download to local machine (Windows PowerShell)
scp root@178.156.129.179:/tmp/nginx-dokploy-subdomain.conf D:\Coding\marcusgoll\specs\047-dokploy-deployment-platform\configs\nginx-dokploy-subdomain.conf
```

**Troubleshooting**:

**Error: nginx -t fails with "duplicate server"**:
```bash
# Check if deploy.marcusgoll.com already configured elsewhere
grep -r "deploy.marcusgoll.com" /etc/nginx/sites-enabled/
# If found, remove duplicate or rename server_name
```

**Error: Port 80 already in use**:
```bash
# Check what's using port 80
sudo lsof -i :80
# Likely your existing marcusgoll.com site - that's OK
# Nginx supports multiple server blocks on same port (different server_names)
```

**Error: Nginx won't reload**:
```bash
# Check error logs
tail -50 /var/log/nginx/error.log
# Fix issues and retry
```

**Documentation** (add to NOTES.md):
```markdown
## Nginx Subdomain Configuration (T006)

**Date**: 2025-10-26
**Config File**: /etc/nginx/sites-available/dokploy

### Configuration Details
- Server Name: deploy.marcusgoll.com
- Listen Ports: 80 (HTTP, temporary until SSL)
- Proxy Target: localhost:3000
- WebSocket: Enabled (Upgrade headers)
- Timeouts: 300s (for long deployments)

### Validation
```bash
$ nginx -t
# nginx: configuration file test is successful

$ systemctl status nginx
# active (running)

$ curl -I http://deploy.marcusgoll.com
# HTTP/1.1 200 OK
```

### Status
- [ ] Configuration created and enabled
- [ ] Nginx test passed
- [ ] HTTP access working
- [ ] Ready for SSL certificate provisioning
```

---

## T007: Provision SSL Certificate for deploy.marcusgoll.com

**Purpose**: Enable HTTPS access with Let's Encrypt certificate

**Prerequisites**:
- DNS fully propagated (deploy.marcusgoll.com → 178.156.129.179)
- Nginx config from T006 working
- Port 80 accessible from internet (for ACME challenge)

**Execution Steps**:

1. SSH to VPS
   ```bash
   ssh root@178.156.129.179
   ```

2. Run Certbot with Nginx plugin
   ```bash
   certbot --nginx -d deploy.marcusgoll.com
   ```

3. Answer Certbot prompts:
   ```
   Enter email address (for renewal notices): marcus@marcusgoll.com
   Accept Terms of Service: (Y)es
   Share email with EFF: (N)o (optional)
   ```

4. Certbot will:
   - Verify DNS points to this server (ACME challenge)
   - Issue certificate from Let's Encrypt
   - Automatically update Nginx config with SSL settings
   - Add HTTP → HTTPS redirect

   Expected output:
   ```
   Successfully received certificate.
   Certificate is saved at: /etc/letsencrypt/live/deploy.marcusgoll.com/fullchain.pem
   Key is saved at:         /etc/letsencrypt/live/deploy.marcusgoll.com/privkey.pem
   Deploying certificate...
   Successfully deployed certificate for deploy.marcusgoll.com

   IMPORTANT NOTES:
   - Certificate will expire on 2026-01-24
   - Certbot will automatically renew
   ```

5. Verify SSL certificate installed
   ```bash
   # Check Nginx config updated by Certbot
   cat /etc/nginx/sites-available/dokploy | grep -A 5 "listen 443"

   # Expected: Should see ssl_certificate lines added
   ```

6. Test HTTPS access (from local machine)
   ```powershell
   # Windows PowerShell
   curl https://deploy.marcusgoll.com
   # Should return HTML with valid SSL (no warnings)
   ```

7. Test SSL quality (from browser or online tool)
   - Open: https://deploy.marcusgoll.com in browser
   - Check: Green padlock icon appears
   - Optional: Run SSL Labs test: https://www.ssllabs.com/ssltest/
   - Target: A or A+ rating

8. Verify auto-renewal configured
   ```bash
   # Check Certbot renewal timer
   systemctl status certbot.timer
   # Should show "active (waiting)"

   # Test renewal (dry-run)
   certbot renew --dry-run
   # Should complete without errors
   ```

**Validation Checklist**:
- [ ] Certbot completed successfully
- [ ] Certificate files exist in /etc/letsencrypt/live/deploy.marcusgoll.com/
- [ ] Nginx config updated with SSL settings
- [ ] https://deploy.marcusgoll.com accessible with valid SSL
- [ ] HTTP redirects to HTTPS automatically
- [ ] SSL Labs rating A or A+ (target per spec NFR-005)
- [ ] Certbot auto-renewal configured

**Troubleshooting**:

**Error: DNS validation failed**:
```bash
# Verify DNS actually resolves
nslookup deploy.marcusgoll.com
# If not resolving: Wait longer for DNS propagation (can take 24h)
# If resolves to wrong IP: Fix DNS record in provider dashboard
```

**Error: Port 80 not accessible**:
```bash
# Check firewall
sudo ufw status
# If blocked, allow HTTP/HTTPS:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

**Error: Certificate already exists**:
```bash
# If retrying, force renewal:
certbot --nginx -d deploy.marcusgoll.com --force-renewal
```

**Documentation** (add to NOTES.md):
```markdown
## SSL Certificate Provisioning (T007)

**Date**: 2025-10-26
**Domain**: deploy.marcusgoll.com
**Certificate Authority**: Let's Encrypt

### Certificate Details
- Issued: [date from certbot output]
- Expires: [date from certbot output]
- Files:
  - Cert: /etc/letsencrypt/live/deploy.marcusgoll.com/fullchain.pem
  - Key: /etc/letsencrypt/live/deploy.marcusgoll.com/privkey.pem

### Validation
```bash
$ curl -I https://deploy.marcusgoll.com
# HTTP/2 200 OK

$ openssl s_client -connect deploy.marcusgoll.com:443 -servername deploy.marcusgoll.com < /dev/null 2>&1 | grep "Verify return code"
# Verify return code: 0 (ok)
```

### SSL Labs Test
- URL: https://www.ssllabs.com/ssltest/analyze.html?d=deploy.marcusgoll.com
- Rating: [A/A+]

### Auto-Renewal
```bash
$ systemctl status certbot.timer
# active (waiting)
# Next run: [date]
```

### Status
- [ ] SSL certificate issued and installed
- [ ] HTTPS access working
- [ ] HTTP → HTTPS redirect functional
- [ ] Auto-renewal configured
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

5. (Optional) Configure IP restriction in Nginx

   If you want to restrict Dokploy access to your IP only:

   ```bash
   # SSH to VPS
   ssh root@178.156.129.179

   # Edit Nginx config
   nano /etc/nginx/sites-available/dokploy

   # Add inside location / block (before proxy_pass):
   # Replace YOUR_IP with your public IP (find at: https://whatismyip.com)

   allow YOUR_IP;  # Example: allow 203.0.113.45;
   deny all;

   # Save and test
   nginx -t
   systemctl reload nginx
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
