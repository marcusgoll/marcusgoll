# Error Log: environment-manageme

## Overview

This log tracks errors encountered during implementation, their root causes, and resolutions. Each entry helps prevent similar issues and documents troubleshooting steps.

## Format

```
### Error ID: E-XXX
- **Date**: YYYY-MM-DD
- **Phase**: [spec|plan|tasks|implement|optimize|ship]
- **Severity**: [critical|high|medium|low]
- **Component**: [affected component]
- **Error**: [brief description]
- **Root Cause**: [why it happened]
- **Resolution**: [how it was fixed]
- **Prevention**: [how to avoid in future]
```

---

## Error Entries

*No errors logged yet. This file will be updated as issues are encountered during implementation.*

---

## Common Issues & Solutions

### Environment Variables Not Loading

**Symptoms**:
- `Missing required environment variable` error at startup
- Variables undefined in `process.env`

**Solutions**:
1. Restart dev server (environment changes require restart)
2. Check .env.local exists (not .env.example)
3. Verify file is in root directory
4. Check for typos in variable names

### Docker Compose Not Reading .env

**Symptoms**:
- Services start but variables are undefined
- Connection errors to Ghost/MySQL

**Solutions**:
1. Ensure file is named `.env` (not `.env.local` - Docker uses `.env`)
2. Run `docker-compose config` to verify resolved values
3. Check `env_file` directive in docker-compose.yml
4. Restart containers: `docker-compose down && docker-compose up`

### Client-Side Variable Undefined

**Symptoms**:
- Variable works in API routes but `undefined` in browser

**Solutions**:
1. Add `NEXT_PUBLIC_` prefix to variable name
2. Restart dev server (rebuild required for client-side vars)
3. Verify variable is in .env.local
4. Check browser console for build warnings

### Production Deployment Issues

**Symptoms**:
- App works locally but fails on VPS
- Connection timeouts to database/Ghost

**Solutions**:
1. Verify .env.production has correct production URLs
2. Check file permissions: `chmod 600 .env.production`
3. Ensure file ownership: `chown www-data:www-data .env.production`
4. Verify production URLs use HTTPS
5. Test database connectivity from VPS

---

## Statistics

- **Total Errors**: 0
- **Critical**: 0
- **High**: 0
- **Medium**: 0
- **Low**: 0
- **Resolved**: 0
- **Unresolved**: 0
