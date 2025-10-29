# DNS Configuration for marcusgoll.com

**Status**: Ready for Configuration  
**VPS IP**: 178.156.129.179  
**Domain**: marcusgoll.com  
**Last Updated**: 2025-10-29

## Overview

This document provides step-by-step instructions for configuring DNS A records to point marcusgoll.com to the VPS at 178.156.129.179, enabling branded domain access and HTTPS via Caddy reverse proxy.

## Prerequisites

- [x] Access to domain registrar account for marcusgoll.com
- [x] VPS running at 178.156.129.179 with ports 80/443 open
- [x] Caddy reverse proxy installed and configured
- [x] Maintenance mode enabled (shows branded page to external visitors)
- [x] Bypass token configured (allows developer access during maintenance)

## DNS Records to Create

Create the following A records at your domain registrar:

### Record 1: Apex Domain
```
Type:  A
Name:  @ (or blank/apex, depending on registrar UI)
Value: 178.156.129.179
TTL:   3600 (1 hour)
```

### Record 2: WWW Subdomain
```
Type:  A
Name:  www
Value: 178.156.129.179
TTL:   3600 (1 hour)
```

## Configuration Steps

### 1. Log into Domain Registrar

Your domain registrar is the service where marcusgoll.com was originally registered.

1. Navigate to registrar website
2. Log in with your credentials
3. Locate DNS management panel for marcusgoll.com

### 2. Create Apex Domain A Record

1. Click "Add Record" or "New Record"
2. Select record type: **A**
3. Enter name field: **@** (or leave blank for apex)
4. Enter value/target: **178.156.129.179**
5. Set TTL: **3600** seconds (1 hour)
6. Save record

### 3. Create WWW Subdomain A Record

1. Click "Add Record" or "New Record"
2. Select record type: **A**
3. Enter name field: **www**
4. Enter value/target: **178.156.129.179**
5. Set TTL: **3600** seconds (1 hour)
6. Save record

## Verification

### Propagation Verification (15 min - 48 hours)

```bash
# Test apex domain
dig marcusgoll.com +short
# Expected: 178.156.129.179

# Test www subdomain
dig www.marcusgoll.com +short
# Expected: 178.156.129.179

# Test from Google DNS
nslookup marcusgoll.com 8.8.8.8

# Test from Cloudflare DNS
nslookup marcusgoll.com 1.1.1.1

# Global propagation check
# Visit: https://dnschecker.org
# Enter: marcusgoll.com
```

### HTTPS Certificate Verification

```bash
# SSH to VPS
ssh hetzner

# Check Caddy logs
docker logs caddy 2>&1 | grep -i "certificate"

# Test HTTPS access
curl -I https://marcusgoll.com
```

## Maintenance Mode

The site is in **maintenance mode** to show external visitors a branded page.

### Accessing Site During Maintenance

```bash
# Bypass token (from .env.local)
TOKEN="7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048"

# Access site with bypass token
http://marcusgoll.com/?bypass=$TOKEN
```

### Disabling Maintenance Mode (When Ready)

On VPS:
```bash
ssh hetzner
nano .env
# Change: MAINTENANCE_MODE="false"
docker-compose restart
```

## References

- **GitHub Issue**: #40
- **Feature Spec**: specs/005-dns-domain-mapping/spec.md
- **Caddy Config**: infrastructure/Caddyfile
