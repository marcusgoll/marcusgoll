# Dokploy Webhook Configuration

This document records the Dokploy webhook configuration for automated deployments.

## Configuration Details

- **Application ID**: `marcusgoll-nextjs-app`
- **Webhook Endpoint**: `http://5.161.75.135:3000/api/deploy.webhook?applicationId=marcusgoll-nextjs-app`
- **Authentication**: Bearer token (stored in GitHub secrets as `DOKPLOY_API_KEY`)

## GitHub Secrets

The following secrets are configured in the GitHub repository:

1. **DOKPLOY_WEBHOOK_URL**: The full webhook URL including application ID
2. **DOKPLOY_API_KEY**: API key for authenticating webhook requests

## How It Works

1. GitHub Actions builds and pushes Docker image to GHCR
2. After successful build, GitHub Actions calls the Dokploy webhook
3. Dokploy receives the webhook and pulls the new image
4. Dokploy restarts the container with the new image

## Troubleshooting

If deployments are not reflecting on the production site:

1. Check GitHub Actions logs for webhook response
2. Verify webhook URL is correct (should not return login page HTML)
3. Ensure API key is valid and not expired
4. Check Dokploy application logs for deployment activity

## Updated

- 2025-10-31: Initial configuration with correct webhook URL and API key
