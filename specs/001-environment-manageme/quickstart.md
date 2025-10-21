# Quickstart: environment-manageme

## Scenario 1: Initial Development Setup

**Goal**: Set up environment variables for local development

```bash
# 1. Copy .env.example to .env.local
cp .env.example .env.local

# 2. Edit .env.local with your local configuration
# Use your preferred editor (VS Code, nano, vim, etc.)
code .env.local  # or nano .env.local

# Required changes for local development:
# - DATABASE_URL: Update with your PostgreSQL credentials (Supabase cloud or self-hosted)
# - NEXT_PUBLIC_SUPABASE_URL: Your Supabase instance URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY: Get from Supabase dashboard
# - SUPABASE_SERVICE_ROLE_KEY: Get from Supabase dashboard
# - RESEND_API_KEY (or MAILGUN_API_KEY): Get from Resend or Mailgun dashboard
# - NEWSLETTER_FROM_EMAIL: Your verified sender email

# 3. Verify environment variables are loaded
npm run dev

# Expected output:
# ✅ Environment variables validated
# ⏳ Starting development server...
# ✓ Ready on http://localhost:3000

# If you see error:
# ❌ Missing required environment variable: RESEND_API_KEY or MAILGUN_API_KEY
# → Check .env.local and ensure all required variables are set
```

**Validation Checklist**:
- [ ] .env.local exists and is not tracked by git (`git status` should not show it)
- [ ] All required variables from .env.example are present in .env.local
- [ ] Application starts without validation errors
- [ ] Can access http://localhost:3000 successfully

---

## Scenario 2: Docker Compose Setup

**Goal**: Run the Next.js application with Docker Compose (connects to external Supabase/newsletter services)

```bash
# 1. Ensure .env file exists (for Docker Compose)
# Note: Docker Compose uses .env by default, not .env.local
cp .env.example .env

# 2. Edit .env with Docker-friendly values
code .env

# Docker-specific configuration:
# - DATABASE_URL: Use Supabase connection string (external service)
# - NEXT_PUBLIC_SUPABASE_URL: Supabase API URL (external service)
# - RESEND_API_KEY or MAILGUN_API_KEY: Newsletter service API key

# 3. Build and start all services
docker-compose up --build

# Expected output:
# ✓ nextjs: Container started
# ✓ nextjs: Environment variables loaded from .env
# ✓ nextjs: Connecting to Supabase PostgreSQL...
# ✓ nextjs: Application ready on http://localhost:3000

# 4. Verify services are healthy
docker-compose ps

# Expected:
# NAME          COMMAND           STATE    PORTS
# nextjs        npm run dev       Up       0.0.0.0:3000->3000/tcp

# 5. Stop services
docker-compose down
```

**Validation Checklist**:
- [ ] Next.js service starts successfully
- [ ] No environment variable validation errors in logs
- [ ] Can access Next.js app at http://localhost:3000
- [ ] Next.js can successfully connect to Supabase PostgreSQL
- [ ] Newsletter service API key is valid (test with Resend/Mailgun)

---

## Scenario 3: Production Deployment to VPS

**Goal**: Securely deploy environment variables to production VPS

```bash
# 1. Create .env.production locally (never commit!)
cp .env.example .env.production

# 2. Fill with production values
code .env.production

# Production-specific values:
# - PUBLIC_URL: https://marcusgoll.com
# - DATABASE_URL: Production PostgreSQL connection string (Supabase)
# - RESEND_API_KEY or MAILGUN_API_KEY: Production newsletter service API key
# - NEWSLETTER_FROM_EMAIL: newsletter@marcusgoll.com (verified)
# - GA4_MEASUREMENT_ID: Production Google Analytics ID

# 3. Securely transfer to VPS (DO NOT commit to git!)
# Option A: SCP (secure copy)
scp .env.production user@your-vps-ip:/var/www/marcusgoll/.env.production

# Option B: rsync (more robust)
rsync -avz --progress .env.production user@your-vps-ip:/var/www/marcusgoll/.env.production

# Option C: Manually copy-paste via SSH
ssh user@your-vps-ip
# Then paste contents into .env.production on server

# 4. On VPS: Set correct permissions
ssh user@your-vps-ip
cd /var/www/marcusgoll
chmod 600 .env.production  # Read/write for owner only
chown www-data:www-data .env.production  # Owned by web server user

# 5. On VPS: Start application with production environment
docker-compose -f docker-compose.prod.yml up -d

# Or for non-Docker:
NODE_ENV=production npm run start

# 6. Verify deployment
curl https://marcusgoll.com/api/health
# Expected: {"status": "ok", "env": "production"}
```

**Security Checklist**:
- [ ] .env.production is in .gitignore
- [ ] No secrets committed to git history (run: `git log --all --full-history -- "*env*"`)
- [ ] .env.production has restrictive permissions (600) on VPS
- [ ] Secrets are not exposed in client-side JavaScript (NEXT_PUBLIC_* vars only)
- [ ] Production URLs use HTTPS
- [ ] Database connection uses strong password

---

## Scenario 4: Validation & Troubleshooting

**Goal**: Verify environment configuration and debug issues

```bash
# 1. Run validation script (if created)
npm run validate-env
# Or manually start app and check for errors

# 2. Check which variables are loaded
# Add temporary debug in your validation file:
console.log('Loaded environment variables:', {
  DATABASE_URL: process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
  RESEND_API_KEY: process.env.RESEND_API_KEY ? '✓ Set' : '✗ Missing',
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY ? '✓ Set' : '✗ Missing',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
  // ... check all required variables
})

# 3. Verify .env file is being read
# Check precedence order (Next.js loads in this order):
# .env.local (highest priority for local development)
# .env.production (for production builds)
# .env (fallback)
# .env.example (NOT loaded, just template)

# 4. Common issues and solutions

# Issue: Variable not loading
# Solution: Restart dev server (environment changes require restart)
npm run dev

# Issue: "Missing required environment variable"
# Solution: Check .env.local exists and has all required variables
cat .env.local | grep RESEND_API_KEY

# Issue: Docker Compose not loading variables
# Solution: Ensure .env exists (not .env.local, Docker uses .env)
docker-compose config  # Shows resolved configuration

# Issue: Client-side variable undefined
# Solution: Ensure variable is prefixed with NEXT_PUBLIC_
# Only NEXT_PUBLIC_* variables are exposed to browser

# Issue: Different values in dev vs prod
# Solution: Check which .env file is active
echo $NODE_ENV  # Should be 'development' or 'production'

# 5. Audit git history for leaked secrets
git log --all --full-history --source -- "*env*" "*secret*" "*key*"
# Should return empty or only .env.example

# If secrets found in history:
# - Rotate all exposed secrets immediately
# - Use git-filter-repo or BFG Repo-Cleaner to remove from history
# - Force push (WARNING: destructive, coordinate with team)
```

**Troubleshooting Checklist**:
- [ ] Dev server restarted after environment changes
- [ ] Correct .env file for environment (.env.local for dev, .env.production for prod)
- [ ] All required variables present (compare with .env.example)
- [ ] NEXT_PUBLIC_* prefix used for client-side variables
- [ ] No secrets in git history
- [ ] File permissions correct on VPS (600 for .env.production)

---

## Scenario 5: Adding New Environment Variables

**Goal**: Add a new environment variable to the project

```bash
# 1. Add to .env.example with documentation
echo "
# New Service (optional)
# Description of what this variable does
NEW_SERVICE_API_KEY=\"your-api-key-here\"
" >> .env.example

# 2. Add to your local .env.local
echo "NEW_SERVICE_API_KEY=\"dev-api-key-12345\"" >> .env.local

# 3. Update validation function (if required variable)
# Edit lib/validate-env.ts or similar:
# Add 'NEW_SERVICE_API_KEY' to required array if mandatory

# 4. Document in spec or README
# - Purpose of the variable
# - Where to get the value
# - Whether it's required or optional
# - Development vs production values

# 5. Restart dev server
npm run dev

# 6. Commit .env.example (but NOT .env.local or .env.production)
git add .env.example
git commit -m "docs: add NEW_SERVICE_API_KEY to environment template"

# 7. Notify team to update their .env.local
# Add to PR description or team chat:
# "⚠️ New environment variable required: NEW_SERVICE_API_KEY
#  See .env.example for details"

# 8. Update production .env.production on VPS
ssh user@your-vps-ip
echo "NEW_SERVICE_API_KEY=\"prod-api-key-67890\"" >> /var/www/marcusgoll/.env.production
# Restart production application
docker-compose restart nextjs
```

**Update Checklist**:
- [ ] Added to .env.example with clear documentation
- [ ] Added to local .env.local for development
- [ ] Updated validation function (if required)
- [ ] Documented purpose and where to obtain value
- [ ] Committed .env.example to git
- [ ] Notified team about new variable
- [ ] Updated production .env.production on VPS
- [ ] Restarted production application
