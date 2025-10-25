# Vercel Deployment Setup Guide

This project is configured for automated deployment to Vercel via GitHub Actions.

## Prerequisites

- Vercel account (free tier works fine)
- GitHub repository with push access
- Vercel CLI installed locally: `npm install -g vercel`

## One-Time Setup

### Step 1: Link Project to Vercel

Run this command in your project directory:

```bash
npx vercel link
```

This will:
1. Create a new Vercel project (or link to existing one)
2. Generate `.vercel/project.json` and `.vercel/README.txt`
3. Ask you to select your Vercel scope (personal or team)

**Important**: Choose "yes" when asked to link to existing project, or create a new one.

### Step 2: Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions Deploy"
4. Set expiration (recommend: no expiration for production)
5. Copy the token (you won't see it again!)

### Step 3: Add GitHub Secrets

Go to your GitHub repository settings:

1. Navigate to: `Settings` → `Secrets and variables` → `Actions`
2. Click "New repository secret"
3. Add the following secrets:

**Required:**
- `VERCEL_TOKEN` - The token from Step 2
- `VERCEL_ORG_ID` - Found in `.vercel/project.json` after running `vercel link`
- `VERCEL_PROJECT_ID` - Found in `.vercel/project.json` after running `vercel link`

**Optional (if you have these in your .env):**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Your production URL (e.g., https://marcusgoll.com)
- `RESEND_API_KEY` - Resend API key for emails
- `ADMIN_EMAIL` - Admin email address

### Step 4: Configure Vercel Project Settings

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to `Settings` → `Environment Variables`
4. Add the same environment variables as GitHub secrets (for consistency)
5. Make sure to set them for "Production" environment

### Step 5: Deploy

Once setup is complete, deployments happen automatically:

**Automatic Deployment:**
- Every push to `main` branch triggers production deployment

**Manual Deployment:**
```bash
# Trigger via GitHub CLI
gh workflow run deploy-production.yml

# Or commit and push to main
git add .
git commit -m "feat: deploy new feature"
git push origin main
```

## Deployment Workflow

The GitHub Actions workflow (`.github/workflows/deploy-production.yml`) will:

1. ✅ Checkout code
2. ✅ Install dependencies (`npm ci`)
3. ✅ Build project (`npm run build`)
4. ✅ Install Vercel CLI
5. ✅ Pull Vercel environment info
6. ✅ Build production artifacts
7. ✅ Deploy to Vercel production
8. ✅ Output deployment URL

## Monitoring Deployments

### Via GitHub Actions
- Go to your repository's "Actions" tab
- Select "Deploy to Production" workflow
- View logs and deployment status

### Via Vercel Dashboard
- Go to https://vercel.com/dashboard
- Select your project
- View "Deployments" tab

### Via CLI
```bash
# List recent deployments
vercel ls

# View deployment details
vercel inspect <deployment-url>

# View deployment logs
vercel logs <deployment-url>
```

## Rollback

If you need to rollback a deployment:

### Via Vercel Dashboard
1. Go to Deployments
2. Find the previous working deployment
3. Click "⋯" → "Promote to Production"

### Via CLI
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel alias set <previous-deployment-id> <your-domain>
```

### Via Git
```bash
# Revert the problematic commit
git revert HEAD
git push origin main
# This triggers a new deployment with the reverted code
```

## Troubleshooting

### Build Fails
- Check GitHub Actions logs for error details
- Verify all environment variables are set correctly
- Test build locally: `npm run build`

### Environment Variables Not Working
- Ensure secrets are set in both GitHub and Vercel
- Check environment variable names match exactly
- Rebuild deployment after adding new variables

### Deployment Succeeds but Site Broken
- Check Vercel deployment logs
- Verify production environment variables
- Test locally with production build: `npm run build && npm start`

### Token Expired
- Generate new Vercel token
- Update `VERCEL_TOKEN` secret in GitHub
- Re-run failed workflow

## Security Notes

- Never commit `.vercel/` directory (already in .gitignore)
- Never commit environment variables or secrets
- Rotate Vercel tokens periodically
- Use different tokens for CI/CD vs local development
- Set appropriate token expiration dates

## Custom Domain Setup

To use a custom domain (e.g., marcusgoll.com):

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to match your domain

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Actions Docs: https://docs.github.com/en/actions
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Generated**: 2025-10-24
**Last Updated**: 2025-10-24
