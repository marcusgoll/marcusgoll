# Deployment Guide for marcusgoll.com

## Current Infrastructure Status

### VPS Details
- **Provider**: Hetzner
- **OS**: Ubuntu 24.04.3 LTS (Noble)
- **Kernel**: 6.8.0-86-generic (pending reboot from 6.8.0-71)
- **Access**: SSH via `ssh hetzner`

### Installed Software
- Docker 28.5.1
- Docker Compose v2.40.1
- Nginx 1.24.0 (installed but not active)
- Certbot 2.9.0 with nginx plugin

### Running Services

#### Caddy (Reverse Proxy)
- **Stack**: `/opt/proxy/docker-compose.yml`
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Status**: Running
- **Container**: proxy-caddy-1
- **Note**: Currently handling all HTTP/HTTPS traffic

#### Ghost CMS
- **Stack**: `/opt/ghost/docker-compose.yml`
- **Port**: 2368
- **Database**: MySQL 8 (ghost-mysql-1)
- **Status**: Running
- **Containers**: ghost-ghost-1, ghost-mysql-1

#### Portainer (Docker Management)
- **Port**: 9443 (HTTPS), 8000 (HTTP)
- **Status**: Running
- **Container**: portainer

#### Uptime Kuma (Monitoring)
- **Stack**: `/opt/monitor/docker-compose.yml`
- **Port**: 3001
- **Status**: Running (healthy)
- **Container**: monitor-uptime-kuma-1

## Architecture Decisions

### Reverse Proxy: Caddy vs Nginx

**Current State**: Caddy is actively running on ports 80/443

**Options**:
1. **Keep Caddy** (Recommended)
   - Pros: Automatic HTTPS with Let's Encrypt, modern, simpler config
   - Cons: Different from original plan
   - Action: Use Caddy for all reverse proxy needs

2. **Switch to Nginx**
   - Pros: More familiar, matches original plan
   - Cons: Manual certbot configuration, need to migrate existing Caddy config
   - Action: Stop Caddy, migrate configs, start Nginx

### Domain Configuration Needed

Configure DNS A records pointing to VPS IP:
```
marcusgoll.com          A    <VPS_IP>
ghost.marcusgoll.com    A    <VPS_IP>
api.marcusgoll.com      A    <VPS_IP>
```

## Next Steps

### 1. Configure Reverse Proxy (Caddy or Nginx)

#### Option A: Use Caddy (Recommended)
```bash
# Edit Caddyfile to add marcusgoll.com routing
ssh hetzner
cd /opt/proxy
# Edit Caddyfile to add:
# - ghost.marcusgoll.com -> localhost:2368
# - api.marcusgoll.com -> localhost:8000 (Supabase)
# - marcusgoll.com -> Next.js app
```

#### Option B: Migrate to Nginx
```bash
# Stop Caddy
docker stop proxy-caddy-1
# Configure Nginx sites
# Start Nginx
sudo systemctl start nginx
```

### 2. Deploy Self-Hosted Supabase

```bash
ssh hetzner
mkdir -p /opt/supabase
cd /opt/supabase
# Clone Supabase docker compose
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
# Edit .env with custom passwords
docker compose up -d
```

### 3. Configure Ghost for Headless Mode

Ghost is running but needs configuration:
- Access Ghost admin (if Caddy is configured)
- Create Custom Integration (Settings > Integrations)
- Get Content API key
- Add key to local `.env.local`

### 4. Deploy Next.js Application

Options:
- **Docker**: Create Dockerfile and deploy as container
- **PM2**: Build and run with PM2 process manager
- **Direct**: Use Node.js directly

### 5. Configure Firewall (UFW)

```bash
ssh hetzner
sudo ufw status
# Allow required ports if not already configured
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## File Locations on VPS

- `/opt/proxy/` - Caddy reverse proxy
- `/opt/ghost/` - Ghost CMS stack
- `/opt/monitor/` - Uptime Kuma monitoring
- `/opt/supabase/` - (To be created) Supabase stack
- `/opt/marcusgoll/` - (To be created) Next.js application

## Monitoring & Management

- **Portainer**: https://<VPS_IP>:9443
- **Uptime Kuma**: http://<VPS_IP>:3001
- **Ghost Admin**: Configure via Caddy/Nginx after domain setup

## Security Checklist

- [ ] UFW firewall configured
- [ ] SSL certificates auto-renewing (Caddy automatic, or Certbot cron)
- [ ] Strong passwords in all `.env` files
- [ ] SSH key-only authentication
- [ ] Supabase JWT secrets rotated
- [ ] Ghost admin access secured
- [ ] Regular backups configured

## Backup Strategy

Recommended:
1. Database backups (MySQL for Ghost, PostgreSQL for Supabase)
2. Ghost content directory
3. Supabase data directory
4. All docker-compose.yml and .env files
5. Caddy/Nginx configs

## Current Progress

- [x] GitHub repository created
- [x] Next.js project initialized locally
- [x] Prisma schema configured
- [x] Ghost SDK installed
- [x] VPS updated
- [x] Docker/Docker Compose verified
- [x] Nginx/Certbot installed
- [x] Existing infrastructure discovered
- [ ] Reverse proxy configured for marcusgoll.com
- [ ] DNS records configured
- [ ] Supabase deployed
- [ ] Ghost configured for headless mode
- [ ] SSL certificates configured
- [ ] Next.js app deployed
- [ ] CI/CD pipeline set up
