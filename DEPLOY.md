# VPS Deployment Guide

This site is deployed to a Hetzner VPS at **178.156.129.179:3000**

## Automated CI (GitHub Actions)

Every push to `main` triggers a GitHub Actions workflow that:
1. Installs dependencies
2. Builds the application
3. Verifies the build succeeds

**View workflow**: https://github.com/marcusgoll/marcusgoll/actions

## Manual Deployment to VPS

After code is merged to `main` and the build passes, deploy to VPS:

###  1. SSH into your VPS

```bash
ssh your-user@178.156.129.179
```

### 2. Navigate to project directory

```bash
cd /path/to/marcusgoll
```

### 3. Run deployment script

```bash
./deploy.sh
```

The `deploy.sh` script will:
- Pull latest code from GitHub
- Install dependencies (`npm install`)
- Build the application (`npm run build`)
- Restart with PM2

### 4. Verify deployment

Visit: http://178.156.129.179:3000

Check PM2 status:
```bash
pm2 status marcusgoll
pm2 logs marcusgoll
pm2 monit
```

## Troubleshooting

### Build fails on VPS

```bash
# Check Node.js version (should be 20+)
node --version

# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PM2 not restarting

```bash
# Manually restart
pm2 stop marcusgoll
pm2 start npm --name "marcusgoll" -- start
pm2 save
```

### Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000
# Or
netstat -tulpn | grep 3000

# Kill the process
kill -9 <PID>

# Restart with PM2
pm2 restart marcusgoll
```

## Environment Variables

Required `.env` file on VPS (optional variables):
```bash
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://178.156.129.179:3000
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=your_email
```

## Production Checklist

Before deploying to production:
- [ ] All preview tests passed
- [ ] Build passes on GitHub Actions
- [ ] Environment variables configured on VPS
- [ ] PM2 is installed and configured
- [ ] Nginx/reverse proxy configured (if using)
- [ ] SSL certificate configured (if using HTTPS)

---

**Last Updated**: 2025-10-26
