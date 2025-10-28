# Operations Runbook

Quick reference guide for common production operations tasks.

---

## Table of Contents

1. [Deployment Operations](#deployment-operations)
2. [Monitoring & Diagnostics](#monitoring--diagnostics)
3. [Database Operations](#database-operations)
4. [Emergency Procedures](#emergency-procedures)
5. [SSL/TLS Management](#ssltls-management)
6. [Troubleshooting](#troubleshooting)

---

## Deployment Operations

### View Current Application Status

```bash
# SSH into VPS
ssh hetzner

# Check service status
docker service ps marcusgoll-nextjs

# Check service details
docker service ls | grep marcusgoll

# View service logs (real-time)
docker service logs marcusgoll-nextjs -f

# View last N log lines
docker service logs marcusgoll-nextjs --tail 100
```

### Force Redeploy Application

**Use Case**: Force a redeploy after config changes without pushing to GitHub

```bash
ssh hetzner

# Update service to force restart
docker service update --force marcusgoll-nextjs

# Monitor the restart
docker service ps marcusgoll-nextjs

# Should see task state transition to "Running"
# Wait ~15-30 seconds for startup
```

### Update Environment Variables

**Use Case**: Change PUBLIC_URL, API keys, or other configuration

```bash
# Via Dokploy Web UI (deploy.marcusgoll.com):
# 1. Log in to Dokploy
# 2. Navigate to Applications > marcusgoll-nextjs
# 3. Edit Environment Variables
# 4. Click Deploy

# Via CLI (if needed):
ssh hetzner
docker service update marcusgoll-nextjs \
  --env-add "PUBLIC_URL=https://marcusgoll.com" \
  --env-add "NEXT_PUBLIC_SITE_URL=https://marcusgoll.com"

# Verify update
docker service inspect marcusgoll-nextjs | grep -A 50 "Env"
```

### Rollback to Previous Deployment

```bash
ssh hetzner

# List recent deployments
docker service ps marcusgoll-nextjs --no-trunc

# Get previous image SHA
PREV_IMAGE=$(docker service inspect marcusgoll-nextjs \
  --format='{{.Spec.TaskTemplate.ContainerSpec.Image}}')

# Note: Dokploy manages image tags automatically
# Rollback via Dokploy UI is recommended for cleaner state

# Or via Docker service update with previous image
docker pull marcusgoll-nextjs:previous-tag
docker service update marcusgoll-nextjs \
  --image marcusgoll-nextjs:previous-tag
```

### Scale Application Replicas

**Note**: Currently set to 1 replica (global mode)

```bash
ssh hetzner

# View current replicas
docker service ls | grep marcusgoll
# Should show "1/1"

# If enabling multi-node deployment in future:
# Update service to multiple replicas
docker service update marcusgoll-nextjs --replicas 3

# Monitor scaling
docker service ps marcusgoll-nextjs
```

---

## Monitoring & Diagnostics

### Check Application Health

```bash
# From any machine with curl
curl -I https://test.marcusgoll.com
# Expected: HTTP/2 200

curl -I https://staging.marcusgoll.com
# Expected: HTTP/2 200
```

### View Health Check Logs

```bash
ssh hetzner

# Real-time logs
tail -f /var/log/marcusgoll-health.log

# Last 50 health checks
tail -50 /var/log/marcusgoll-health.log

# Count of successful checks (last 24 hours)
tail -n $(( 24 * 60 / 60 )) /var/log/marcusgoll-health.log | grep "✓" | wc -l
```

### Check Docker Container Metrics

```bash
ssh hetzner

# CPU and memory usage
docker stats --no-stream | grep marcusgoll

# Continuous monitoring
docker stats
```

### Verify Network Connectivity

```bash
ssh hetzner

# Check internal port 3001
curl -I http://localhost:3001
# Expected: HTTP/1.1 200

# Check through Traefik
curl -I https://test.marcusgoll.com
# Expected: HTTP/2 200
```

### Check Traefik Configuration

```bash
ssh hetzner

# View Traefik config file
cat /etc/dokploy/traefik/dynamic/dokploy.yml

# Verify Traefik is running
docker ps | grep traefik

# View Traefik logs
docker logs $(docker ps -q -f "label=service=traefik")
```

### Monitor Disk Space

```bash
ssh hetzner

# Quick check
df -h /

# If disk > 80%, check what's using space
du -sh /*

# Docker images and volumes
docker system df
```

---

## Database Operations

### Connect to PostgreSQL Database

```bash
ssh hetzner

# Interactive psql shell
docker exec -it $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db

# Once in psql:
# List tables:      \dt
# List databases:   \l
# Describe table:   \d tablename
# Exit:             \q
```

### Backup Database Manually

```bash
ssh hetzner

# Database is already backed up daily at 02:00 UTC
# To backup manually:
/opt/backups/backup.sh

# Check backup location
ls -lh /opt/backups/

# Latest backup
ls -1 /opt/backups/ | tail -1
```

### Restore Database from Backup

```bash
ssh hetzner

# List available backups
ls -lh /opt/backups/

# Choose backup file (e.g., backup-2025-10-27.sql.gz)
BACKUP_FILE="/opt/backups/backup-2025-10-27.sql.gz"

# Drop and recreate database (CAUTION!)
docker exec -i $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -c "DROP DATABASE IF EXISTS marcusgoll_db; CREATE DATABASE marcusgoll_db;"

# Restore from backup
gunzip < $BACKUP_FILE | docker exec -i $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db

# Verify
docker exec -i $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db -c "\dt"
```

### Check Database Size

```bash
ssh hetzner

docker exec -i $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db \
  -c "SELECT sum(pg_database.datsize) \
      FROM pg_database;"
```

### Run Database Maintenance

```bash
ssh hetzner

# VACUUM (cleanup dead rows)
docker exec -i $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db \
  -c "VACUUM ANALYZE;"

# Check table stats
docker exec -i $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db \
  -c "SELECT schemaname, tablename, n_live_tup, n_dead_tup \
      FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;"
```

---

## Emergency Procedures

### Application Crash/Unresponsive

**Symptoms**: HTTP 502 errors, curl timeout, health check failing

```bash
ssh hetzner

# 1. Check service status
docker service ps marcusgoll-nextjs
# Look for "Running" status

# 2. View logs to diagnose issue
docker service logs marcusgoll-nextjs --tail 50

# 3. If logs show OOM (out of memory):
docker stats

# 4. Force restart
docker service update --force marcusgoll-nextjs

# 5. Monitor restart progress
watch -n 2 "docker service ps marcusgoll-nextjs"

# 6. Verify health after restart
curl -I https://test.marcusgoll.com
```

### High Disk Usage

```bash
ssh hetzner

# 1. Check disk
df -h /

# 2. Identify large directories
du -sh /* | sort -rh | head -10

# 3. Check Docker cleanup opportunities
docker system df

# 4. Remove unused Docker resources
docker system prune -a  # CAUTION: removes all unused images/containers

# 5. Check and rotate application logs
du -sh /var/log/
tail -100 /var/log/marcusgoll-health.log > /tmp/marcusgoll-health-backup.log
> /var/log/marcusgoll-health.log  # Empty the log

# 6. Verify disk after cleanup
df -h /
```

### Database Connection Issues

```bash
ssh hetzner

# 1. Check PostgreSQL container
docker ps | grep postgres

# 2. Check database logs
docker logs $(docker ps -q -f "label=app=postgres") --tail 20

# 3. Test connection
docker exec $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db -c "SELECT 1;"

# 4. If not running, restart
docker restart $(docker ps -q -f "label=app=postgres")

# 5. Wait for startup
sleep 5

# 6. Test again
docker exec $(docker ps -q -f "label=app=postgres") \
  psql -U postgres -d marcusgoll_db -c "SELECT 1;"
```

### Traefik/Reverse Proxy Issues

**Symptoms**: 502 Bad Gateway, SSL errors, routing failures

```bash
ssh hetzner

# 1. Check Traefik container
docker ps | grep traefik

# 2. View Traefik logs
docker logs $(docker ps -q -f "name=traefik") --tail 50

# 3. Verify config file
cat /etc/dokploy/traefik/dynamic/dokploy.yml

# 4. Check Traefik dashboard (if available)
curl http://localhost:8080/ping

# 5. Test backend service
curl -I http://172.17.0.1:3001

# 6. If issues persist, restart Traefik
docker restart $(docker ps -q -f "name=traefik")

# 7. Monitor restart
docker logs -f $(docker ps -q -f "name=traefik")
```

### Certificate/SSL Issues

```bash
ssh hetzner

# 1. Check certificate status in Traefik
docker exec $(docker ps -q -f "name=traefik") \
  ls -la /etc/traefik/acme/

# 2. Verify certificate validity
openssl x509 -enddate -noout -in /etc/traefik/acme/acme.json

# 3. Check Let's Encrypt logs
docker logs $(docker ps -q -f "name=traefik") | grep -i "letsencrypt"

# 4. If renewal stuck, Traefik will retry automatically

# 5. Test SSL/TLS
curl -vI https://test.marcusgoll.com 2>&1 | grep "SSL"
```

### Complete System Shutdown/Recovery

**Use only if necessary**

```bash
ssh hetzner

# 1. Shutdown all services gracefully
docker service rm marcusgoll-nextjs
docker stop $(docker ps -q)

# 2. Verify all stopped
docker ps

# 3. Check system health
df -h
free -h

# 4. Restart Docker daemon if needed
sudo systemctl restart docker

# 5. Redeploy application
# Via Dokploy: Click Deploy button
# OR manual: docker pull marcusgoll-nextjs && docker run ...
```

---

## SSL/TLS Management

### Check Certificate Expiration

```bash
# From any machine
echo | openssl s_client -servername test.marcusgoll.com \
  -connect test.marcusgoll.com:443 2>/dev/null | \
  openssl x509 -noout -enddate

# Expected output: notAfter=YYYY-MM-DD HH:MM:SS GMT

# For all domains
for domain in test.marcusgoll.com staging.marcusgoll.com deploy.marcusgoll.com; do
  echo "=== $domain ==="
  echo | openssl s_client -servername $domain \
    -connect $domain:443 2>/dev/null | \
    openssl x509 -noout -enddate
done
```

### Force Certificate Renewal

```bash
ssh hetzner

# Traefik handles automatic renewal, but to force:
docker service update marcusgoll-nextjs --force

# This will trigger Traefik to check/renew certs on startup
```

### View Current Certificates

```bash
ssh hetzner

# List certs provisioned by Let's Encrypt
docker exec $(docker ps -q -f "name=traefik") \
  cat /etc/traefik/acme/acme.json | \
  jq '.Certificates[].Domain' 2>/dev/null || \
  echo "Run: docker logs traefik | grep 'Certificate'"
```

---

## Troubleshooting

### Application Not Responding

1. **Check service is running**:
   ```bash
   docker service ps marcusgoll-nextjs
   ```

2. **Check logs**:
   ```bash
   docker service logs marcusgoll-nextjs --tail 50
   ```

3. **Test backend directly**:
   ```bash
   curl -I http://localhost:3001
   ```

4. **Test through reverse proxy**:
   ```bash
   curl -I https://test.marcusgoll.com
   ```

5. **Restart if needed**:
   ```bash
   docker service update --force marcusgoll-nextjs
   ```

### 502 Bad Gateway

Means Traefik can't reach the backend application:

1. **Check backend running**:
   ```bash
   curl http://localhost:3001
   ```

2. **Check Traefik config**:
   ```bash
   cat /etc/dokploy/traefik/dynamic/dokploy.yml | grep -A 5 "marcusgoll-service"
   ```

3. **Check Traefik logs**:
   ```bash
   docker logs $(docker ps -q -f "name=traefik") | grep "502\|error\|backend"
   ```

4. **Restart both**:
   ```bash
   docker service update --force marcusgoll-nextjs
   docker restart $(docker ps -q -f "name=traefik")
   ```

### Slow Response Times

1. **Check system resources**:
   ```bash
   docker stats
   top
   ```

2. **Check database**:
   ```bash
   # Time database query
   time docker exec postgres psql -c "SELECT COUNT(*) FROM information_schema.tables;"
   ```

3. **Check logs for errors**:
   ```bash
   docker service logs marcusgoll-nextjs | grep -i "error\|slow\|timeout"
   ```

4. **Restart service to clear caches**:
   ```bash
   docker service update --force marcusgoll-nextjs
   ```

### Health Check Failures

1. **Check what endpoint is failing**:
   ```bash
   tail /var/log/marcusgoll-health.log
   ```

2. **Test manually**:
   ```bash
   curl -I https://test.marcusgoll.com
   ```

3. **Check network**:
   ```bash
   curl -I http://localhost:3001
   ```

### Database Connection Issues

1. **Check PostgreSQL running**:
   ```bash
   docker ps | grep postgres
   ```

2. **Test connection**:
   ```bash
   docker exec postgres psql -U postgres -c "SELECT 1;"
   ```

3. **Check connection string**:
   ```bash
   docker service inspect marcusgoll-nextjs | grep "DATABASE_URL"
   ```

4. **Restart PostgreSQL**:
   ```bash
   docker restart $(docker ps -q -f "label=app=postgres")
   ```

---

## Quick Reference Commands

```bash
# Connection
ssh hetzner

# Basic checks
docker ps
docker service ls
df -h
docker stats

# Logs
docker service logs marcusgoll-nextjs -f
tail -f /var/log/marcusgoll-health.log

# Restart
docker service update --force marcusgoll-nextjs

# Database
docker exec postgres psql -U postgres -c "SELECT 1;"

# Health
curl -I https://test.marcusgoll.com

# Cleanup
docker system prune -a
```

---

## Support & Escalation

If issues persist:

1. Collect logs:
   ```bash
   docker service logs marcusgoll-nextjs > /tmp/app-logs.txt 2>&1
   docker logs $(docker ps -q -f "name=traefik") > /tmp/traefik-logs.txt 2>&1
   tail -100 /var/log/marcusgoll-health.log > /tmp/health-logs.txt
   ```

2. Check system health:
   ```bash
   uname -a
   df -h
   free -h
   docker version
   ```

3. Share logs and system info for debugging
