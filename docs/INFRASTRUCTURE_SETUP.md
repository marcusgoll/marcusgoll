# Infrastructure Setup Guide - marcusgoll.com

> **Security Notice**: This document does NOT contain actual credentials. All credentials are stored securely on the VPS and in local `.credentials/` directory (gitignored).

## Overview

Personal blog infrastructure hosted on Hetzner VPS with self-hosted services.

## Architecture

```
                           [Internet]
                               |
                          [Caddy Proxy]
                     (Automatic HTTPS/SSL)
                               |
        +----------------------+----------------------+
        |                      |                      |
  [Next.js App]          [Ghost CMS]           [Supabase API]
  marcusgoll.com     ghost.marcusgoll.com   api.marcusgoll.com
        |                      |                      |
        +----------- [Docker Networks] --------------+
```

## Services Running on VPS

### 1. Caddy Reverse Proxy
- **Purpose**: Automatic HTTPS, reverse proxy for all services
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Container**: proxy-caddy-1
- **Network**: web, ghost_net, next_net, api_net

### 2. Ghost CMS (Headless)
- **Purpose**: Content management for blog posts
- **Container**: ghost-ghost-1
- **Database**: MySQL 8 (ghost-mysql-1)
- **Port**: 2368 (internal)
- **Network**: ghost_net

### 3. Supabase (Self-Hosted)
- **Purpose**: PostgreSQL database, auth, storage, realtime
- **Location**: `/opt/supabase/supabase/docker`
- **Services**: 13 containers (db, auth, rest, realtime, storage, kong, studio, meta, functions, analytics, vector, imgproxy, pooler)
- **Network**: api_net

### 4. Portainer
- **Purpose**: Docker container management UI
- **Port**: 9443

### 5. Uptime Kuma
- **Purpose**: Service uptime monitoring
- **Port**: 3001

## Getting Credentials

**IMPORTANT**: Credentials are NEVER stored in git. To access them:

### On VPS:
```bash
# Supabase credentials
ssh hetzner "cat /opt/supabase/supabase/docker/.env"

# Ghost credentials
ssh hetzner "cat /opt/ghost/docker-compose.yml | grep -A 5 environment"
```

### Locally:
```bash
# Check .credentials directory (gitignored)
cat .credentials/supabase.env
cat .credentials/ghost.env
```

## Environment Variable Setup

### Create Local .env.local

```bash
# Copy template
cp .env.example .env.local

# Get Supabase credentials from VPS
ssh hetzner "grep -E '(POSTGRES_PASSWORD|JWT_SECRET|ANON_KEY|SERVICE_ROLE_KEY)' /opt/supabase/supabase/docker/.env"

# Get Ghost API key from Ghost admin panel
# Navigate to: https://ghost.marcusgoll.com/ghost → Settings → Integrations
```

### Required Variables

```env
# Database (after DNS configured)
DATABASE_URL=postgresql://postgres:[PASSWORD_FROM_VPS]@api.marcusgoll.com:5432/postgres

# Supabase (get from VPS .env)
NEXT_PUBLIC_SUPABASE_URL=https://api.marcusgoll.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=[FROM_VPS]
SUPABASE_SERVICE_ROLE_KEY=[FROM_VPS]

# Ghost CMS (get from Ghost admin)
GHOST_API_URL=https://ghost.marcusgoll.com
GHOST_CONTENT_API_KEY=[FROM_GHOST_ADMIN]
```

## DNS Configuration

Point these records to your VPS IP:

```
marcusgoll.com          A    [VPS_IP]
ghost.marcusgoll.com    A    [VPS_IP]
api.marcusgoll.com      A    [VPS_IP]
```

Or use a wildcard:
```
*.marcusgoll.com        A    [VPS_IP]
marcusgoll.com          A    [VPS_IP]
```

## Security Practices

### Credentials Management

1. ✅ Never commit credentials to git
2. ✅ Credentials rotated after GitHub exposure (2025-10-21)
3. ✅ All services use strong generated passwords
4. ✅ JWT tokens properly signed with secure secrets
5. ⏳ Regular credential rotation schedule (TODO)

### Access Control

1. SSH key-only authentication
2. UFW firewall configured (22, 80, 443)
3. Supabase dashboard password-protected
4. Ghost admin requires authentication

### Backup Strategy

```bash
# Ghost content backup
ssh hetzner "sudo tar -czf ~/backup-ghost-$(date +%Y%m%d).tar.gz -C /opt/ghost content"

# Ghost database backup
ssh hetzner "docker exec ghost-mysql-1 mysqldump -u root -p ghost > ~/backup-ghost-db-$(date +%Y%m%d).sql"

# Supabase database backup
ssh hetzner "docker exec supabase-db pg_dump -U postgres postgres > ~/backup-supabase-$(date +%Y%m%d).sql"

# Download backups
scp hetzner:~/backup-*.tar.gz ./backups/
scp hetzner:~/backup-*.sql ./backups/
```

## Management Commands

### View Service Status

```bash
# All containers
ssh hetzner "docker ps"

# Supabase only
ssh hetzner "docker ps --filter 'name=supabase'"

# Check health
ssh hetzner "docker ps --format 'table {{.Names}}\t{{.Status}}'"
```

### Restart Services

```bash
# Restart Caddy
ssh hetzner "docker restart proxy-caddy-1"

# Restart Ghost
ssh hetzner "cd /opt/ghost && docker compose restart"

# Restart Supabase
ssh hetzner "cd /opt/supabase/supabase/docker && sudo docker compose restart"
```

### View Logs

```bash
# Caddy logs (last 50 lines)
ssh hetzner "docker logs proxy-caddy-1 --tail 50"

# Ghost logs
ssh hetzner "docker logs ghost-ghost-1 --tail 50"

# Supabase Kong (API Gateway)
ssh hetzner "docker logs supabase-kong --tail 50"

# Follow logs in real-time
ssh hetzner "docker logs -f supabase-kong"
```

## Credential Rotation Procedure

If credentials are ever exposed:

1. **Immediately** stop affected services
2. Generate new secure passwords:
   ```bash
   openssl rand -base64 48  # For passwords
   openssl rand -hex 16      # For tenant IDs
   ```
3. Update `.env` files on VPS
4. Regenerate JWT tokens with new secret:
   ```bash
   node .credentials/generate-new-jwt.js
   ```
5. Restart services with new credentials
6. Update local `.env.local`
7. Force push to remove from git history if committed:
   ```bash
   git rm [sensitive-file]
   git commit --amend --no-edit
   git push --force
   ```

## Troubleshooting

### SSL Certificate Issues
```bash
# Check Caddy logs for SSL errors
ssh hetzner "docker logs proxy-caddy-1 | grep -i 'error\|ssl\|certificate'"

# Verify DNS points to VPS
dig marcusgoll.com +short
```

### Service Not Responding
```bash
# Check container status
ssh hetzner "docker ps -a | grep -E '(supabase|ghost|caddy)'"

# Check container logs
ssh hetzner "docker logs [container-name] --tail 100"
```

### Database Connection Issues
```bash
# Test PostgreSQL connection
ssh hetzner "docker exec supabase-db psql -U postgres -c 'SELECT version();'"

# Test MySQL connection
ssh hetzner "docker exec ghost-mysql-1 mysql -u ghost -p -e 'SELECT VERSION();'"
```

## File Locations on VPS

```
/opt/proxy/                              # Caddy reverse proxy
├── Caddyfile                            # Proxy configuration
└── docker-compose.yml                   # Caddy compose file

/opt/ghost/                              # Ghost CMS
├── docker-compose.yml                   # Ghost compose file
└── content/                             # Ghost content (backed up)

/opt/supabase/supabase/docker/           # Supabase
├── .env                                 # SENSITIVE - Contains all secrets
├── docker-compose.yml                   # Supabase compose file
└── volumes/                             # Supabase data
```

## Next Steps

1. ✅ Infrastructure deployed
2. ✅ Credentials rotated after exposure
3. ✅ Gitignore updated to prevent future leaks
4. ⏳ Configure DNS to point to VPS
5. ⏳ SSL certificates (automatic after DNS)
6. ⏳ Configure Ghost for headless mode
7. ⏳ Deploy Next.js application
8. ⏳ Set up automated backups
9. ⏳ Configure monitoring alerts

## Status

| Component | Status | Access |
|-----------|--------|--------|
| Caddy | ✅ Running | Ports 80/443 |
| Ghost | ✅ Running | Internal 2368 |
| Supabase | ✅ Running | Internal 8002 |
| Next.js | ⏳ Not deployed | - |
| SSL Certs | ⏳ Pending DNS | - |
| DNS | ⏳ Not configured | Required |

## Support

- VPS: Hetzner support
- Ghost: https://ghost.org/docs/
- Supabase: https://supabase.com/docs/guides/self-hosting
- Caddy: https://caddyserver.com/docs/
