# Error Log: Dokploy Deployment Platform Integration

## Planning Phase (Phase 0-2)
None yet.

## Implementation Phase (Phase 3-4)
[Populated during /tasks and /implement]

## Testing Phase (Phase 5)
[Populated during /debug and /preview]

## Deployment Phase (Phase 6-7)
[Populated during staging validation and production deployment]

---

## Error Template

**Error ID**: ERR-[NNN]
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [dokploy-install/nginx-config/database-import/webhook/application-config]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened]

**Root Cause**:
[Why it happened]

**Resolution**:
[How it was fixed]

**Prevention**:
[How to prevent in future]

**Related**:
- Spec: [link to requirement]
- Code: [file:line]
- Commit: [sha]

---

## Common Issues & Solutions

### Issue: Dokploy installation script fails

**Symptoms**: curl error, Docker not found, port 3000 already in use

**Solutions**:
1. Check Docker installed: `docker --version` (need >=20.10)
2. Check port available: `sudo netstat -tuln | grep 3000`
3. Check disk space: `df -h` (need ~5GB free)
4. Review installation logs: Check terminal output for errors
5. Consult Dokploy docs: https://docs.dokploy.com/installation

---

### Issue: Nginx subdomain configuration fails

**Symptoms**: deploy.marcusgoll.com returns 502 Bad Gateway or connection refused

**Solutions**:
1. Check Dokploy running: `docker ps | grep dokploy`
2. Check Nginx config syntax: `sudo nginx -t`
3. Check Nginx proxy_pass: Verify localhost:3000 correct
4. Check firewall: `sudo ufw status` (allow port 3000 if needed)
5. Check logs: `sudo tail -f /var/log/nginx/error.log`

---

### Issue: SSL certificate provisioning fails

**Symptoms**: Certbot fails with "too many requests" or DNS validation error

**Solutions**:
1. Verify DNS propagation: `dig deploy.marcusgoll.com` (should point to VPS IP)
2. Wait for DNS: May take 1-24 hours for propagation
3. Check Certbot rate limits: Let's Encrypt has rate limits (50 certs/week)
4. Use staging cert first: `certbot --nginx -d deploy.marcusgoll.com --staging`
5. Manual verification: Use DNS TXT record if HTTP challenge fails

---

### Issue: Environment variable migration incomplete

**Symptoms**: Application crashes, "DATABASE_URL not defined" in logs

**Solutions**:
1. Check all variables migrated: Compare Dokploy UI to old .env.production
2. Check variable names: Ensure exact match (case-sensitive)
3. Check for typos: Especially in DATABASE_URL (common issue)
4. Restart application: Dokploy UI → Restart (forces reload of env vars)
5. Check Dokploy logs: `docker logs dokploy` for env loading errors

---

### Issue: GitHub webhook not triggering deployments

**Symptoms**: Push to main but Dokploy shows no new deployment

**Solutions**:
1. Check webhook configured: GitHub → Settings → Webhooks (should be active)
2. Check webhook deliveries: GitHub → Webhooks → Recent Deliveries (check for errors)
3. Check webhook URL: Verify matches Dokploy-generated URL
4. Check webhook secret: Verify matches if configured
5. Check Dokploy logs: `docker logs dokploy` for webhook received events
6. Manual deploy: Dokploy UI → Deploy button (workaround)

---

### Issue: Database backup fails

**Symptoms**: Dokploy shows backup error, no backup files created

**Solutions**:
1. Check disk space: `df -h` (need space for backups)
2. Check database connection: Dokploy → Databases → Test Connection
3. Check backup schedule: Verify daily schedule configured
4. Trigger manual backup: Dokploy UI → Backup Now (test)
5. Check permissions: Verify Dokploy can write to /opt/dokploy/backups/

---

### Issue: Rollback fails

**Symptoms**: Click rollback but application doesn't revert

**Solutions**:
1. Check deployment history: Verify previous deployment exists
2. Check Docker images: `docker images | grep marcusgoll` (verify previous image exists)
3. Manually rollback: Use docker-compose with previous image tag
4. Check logs: Dokploy deployment logs for rollback errors
5. Emergency rollback: Revert to pre-Dokploy setup (see Appendix B in plan.md)

