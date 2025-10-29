# Quickstart: Multi-Track Newsletter

## Scenario 1: Initial Setup

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Add environment variables to .env.local
cat >> .env.local <<EOF
# Newsletter Service (choose one)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
# OR
# MAILGUN_API_KEY="key-xxxxxxxxxxxxx"

# Verified sender email
NEWSLETTER_FROM_EMAIL="newsletter@marcusgoll.com"

# Database (if not already configured)
DATABASE_URL="postgresql://user:password@localhost:5432/marcusgoll_dev"
EOF

# 3. Run Prisma migration to create newsletter tables
npx prisma migrate dev --name add_newsletter

# 4. Verify migration succeeded
npx prisma studio
# Navigate to newsletter_subscribers and newsletter_preferences tables

# 5. (Optional) Seed test data for development
npx tsx scripts/seed-newsletter.ts
# Creates 5 test subscribers with various preference combinations

# 6. Start dev server
npm run dev

# 7. Verify newsletter signup form appears in footer
# Open http://localhost:3000 and scroll to footer
```

---

## Scenario 2: Testing Newsletter Signup (Manual)

```bash
# 1. Navigate to homepage
open http://localhost:3000

# 2. Scroll to footer, find "Newsletter" section

# 3. Enter test email: your-email+test@example.com
#    (+ addressing works with most providers for testing)

# 4. Select newsletter types:
#    - Check "Aviation" checkbox
#    - Check "Dev/Startup" checkbox
#    - Leave "Education" and "All" unchecked

# 5. Click "Subscribe" button

# Expected behavior:
# - Button shows loading state (<2 seconds)
# - Success message appears: "Successfully subscribed to Aviation and Dev/Startup newsletters!"
# - Check email inbox for welcome email (within 30 seconds)

# 6. Verify database entries
npx prisma studio
# Check newsletter_subscribers table:
#   - email: your-email+test@example.com
#   - active: true
#   - unsubscribe_token: 64-char hex string
# Check newsletter_preferences table:
#   - 2 rows (aviation: subscribed=true, dev-startup: subscribed=true)

# 7. Test preference management
# Copy unsubscribe_token from database
# Navigate to: http://localhost:3000/newsletter/preferences/[TOKEN]
# Verify:
#   - Email displayed (read-only)
#   - Aviation and Dev/Startup checkboxes are checked
#   - Education and All checkboxes are unchecked
# Uncheck "Aviation", click "Update Preferences"
# Verify database: aviation preference now has subscribed=false

# 8. Test unsubscribe
# Click "Unsubscribe" link in welcome email
# Verify:
#   - Unsubscribe confirmation page displays
#   - "Delete My Data" link is present
# Click "Delete My Data"
# Verify:
#   - Database record deleted (CASCADE to preferences)
#   - Can re-subscribe with same email (no existing record error)
```

---

## Scenario 3: API Testing (Automated)

```bash
# 1. Start dev server (if not running)
npm run dev

# 2. Test signup endpoint
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "newsletterTypes": ["aviation", "dev-startup"],
    "source": "api-test"
  }' | jq

# Expected response:
# {
#   "success": true,
#   "message": "Successfully subscribed to Aviation and Dev/Startup newsletters!",
#   "unsubscribeToken": "a3f5b8c...64-char-hex"
# }

# 3. Test get preferences endpoint
# Copy token from step 2 response, replace TOKEN below
TOKEN="paste-token-here"
curl http://localhost:3000/api/newsletter/preferences/$TOKEN | jq

# Expected response:
# {
#   "success": true,
#   "email": "api-test@example.com",
#   "preferences": {
#     "aviation": true,
#     "dev-startup": true,
#     "education": false,
#     "all": false
#   },
#   "subscribedAt": "2025-10-28T12:00:00.000Z"
# }

# 4. Test update preferences endpoint
curl -X PATCH http://localhost:3000/api/newsletter/preferences \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$TOKEN\",
    \"preferences\": {
      \"aviation\": false,
      \"dev-startup\": true,
      \"education\": true,
      \"all\": false
    }
  }" | jq

# Expected response:
# {
#   "success": true,
#   "message": "Preferences updated successfully"
# }

# 5. Test unsubscribe endpoint
curl -X DELETE http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$TOKEN\"}" | jq

# Expected response:
# {
#   "success": true,
#   "message": "Successfully unsubscribed from all newsletters"
# }

# 6. Test hard delete (GDPR)
curl -X DELETE http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$TOKEN\", \"hardDelete\": true}" | jq

# Expected response:
# {
#   "success": true,
#   "message": "Your data has been permanently deleted"
# }
```

---

## Scenario 4: Validation Testing

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Run Prisma validation
npx prisma validate

# Run Prisma format check
npx prisma format

# (Future) Run unit tests
npm test

# (Future) Run E2E tests with Playwright
npm run test:e2e
```

---

## Scenario 5: Manual Testing Checklist

**Signup Flow**:
- [ ] Signup form displays 4 newsletter checkboxes with descriptions
- [ ] At least 1 checkbox must be selected (validation error if none)
- [ ] Invalid email shows error (e.g., "invalid@")
- [ ] Valid signup shows success message within 2 seconds
- [ ] Welcome email arrives within 30 seconds
- [ ] Welcome email contains "Manage preferences" link
- [ ] Welcome email contains "Unsubscribe" link

**Preference Management**:
- [ ] Preference page loads with token from email link
- [ ] Email displayed as read-only field
- [ ] Current newsletter selections are checked
- [ ] Can update selections (at least 1 must remain checked)
- [ ] Cannot save with no selections (validation error)
- [ ] Update shows success message
- [ ] Confirmation email arrives after update

**Unsubscribe Flow**:
- [ ] Clicking unsubscribe link shows confirmation page
- [ ] Confirmation page displays goodbye message
- [ ] "Delete My Data" link is present
- [ ] Hard delete removes database record
- [ ] Can re-subscribe after hard delete (no error)

**Accessibility**:
- [ ] All form inputs have labels
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works (tab through form, space to check boxes, enter to submit)
- [ ] Screen reader announces form errors
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)

**Performance**:
- [ ] Signup completes in <2 seconds (measured with browser DevTools)
- [ ] API response time <500ms (check Network tab)
- [ ] No layout shift during form submission (CLS <0.15)
- [ ] No console errors or warnings

**Security**:
- [ ] Email addresses not visible in browser DevTools logs
- [ ] Unsubscribe tokens are 64 characters (not guessable)
- [ ] Cannot access preference page without valid token
- [ ] Rate limiting prevents spam (try submitting 6 times quickly)

---

## Scenario 6: Production Deployment Checklist

```bash
# 1. Verify environment variables configured in production
# Check GitHub Secrets or VPS .env file:
# - RESEND_API_KEY (or MAILGUN_API_KEY)
# - NEWSLETTER_FROM_EMAIL
# - DATABASE_URL

# 2. Run migration in production (via Docker)
# SSH to VPS
ssh hetzner
cd /path/to/marcusgoll

# Pull latest code
git pull origin main

# Run migration
docker-compose exec web npx prisma migrate deploy

# Verify migration succeeded
docker-compose exec web npx prisma migrate status

# 3. Restart services
docker-compose restart web

# 4. Smoke test production API
curl -X POST https://marcusgoll.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "production-test@example.com",
    "newsletterTypes": ["aviation"]
  }' | jq

# Expected: 200 OK, success: true

# 5. Test production preference page
# Visit: https://marcusgoll.com/newsletter/preferences/[TOKEN]
# Verify page loads and displays email

# 6. Monitor logs for errors
docker-compose logs -f web | grep -i error

# 7. Check database for test subscriber
docker-compose exec db psql -U postgres -d marcusgoll_prod -c \
  "SELECT email, active FROM newsletter_subscribers WHERE email='production-test@example.com';"

# 8. Clean up test data
docker-compose exec db psql -U postgres -d marcusgoll_prod -c \
  "DELETE FROM newsletter_subscribers WHERE email='production-test@example.com';"
```

---

## Troubleshooting

**Issue**: Welcome email not received

**Solutions**:
1. Check email service logs (Resend dashboard or Mailgun logs)
2. Verify `NEWSLETTER_FROM_EMAIL` is a verified sender domain
3. Check spam folder
4. Verify background email processing is working (check application logs)

---

**Issue**: Migration fails with "relation already exists"

**Solutions**:
1. Check if tables already exist: `npx prisma studio`
2. If tables exist, mark migration as applied: `npx prisma migrate resolve --applied YYYYMMDDHHMMSS_add_newsletter`
3. If tables don't exist but migration failed, manually drop tables and re-run: `DROP TABLE newsletter_preferences, newsletter_subscribers;`

---

**Issue**: Rate limiting blocks legitimate signups

**Solutions**:
1. Increase rate limit in API route (5 req/min → 10 req/min)
2. Implement per-email rate limiting instead of per-IP (if VPS behind proxy)
3. Add captcha for additional protection (future enhancement)

---

**Issue**: Unsubscribe token not found (404 error)

**Solutions**:
1. Verify token is exactly 64 characters (no extra spaces or line breaks)
2. Check database for subscriber record with matching token
3. Verify subscriber has not been hard deleted
4. Check for URL encoding issues (%20 spaces, etc.)