# API Testing Guide: Newsletter Subscription System

**Feature**: Multi-Track Newsletter
**Testing Method**: curl/Postman
**Generated**: 2025-10-28

---

## Prerequisites

### 1. Start Dev Server
```bash
npm run dev
```

Server should be running on `http://localhost:3000`

### 2. Start Prisma Studio (Monitor Database)
```bash
npx prisma studio
```

Opens on `http://localhost:5555` - keep this open to watch database changes in real-time.

### 3. Verify Database Connection
```bash
npx prisma db push
```

Ensure database is up and schema is synced.

---

## Test Scenario 1: Subscribe to Newsletter (Happy Path)

### API Endpoint: POST /api/newsletter/subscribe

**Request**:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "newsletterTypes": ["aviation", "dev-startup"],
    "source": "api-test"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletters",
  "subscriber": {
    "email": "test1@example.com",
    "newsletterTypes": ["aviation", "dev-startup"]
  }
}
```

**Verify in Prisma Studio**:
1. Open NewsletterSubscriber table
2. Find row with email `test1@example.com`
3. Note the `unsubscribeToken` (64-char hex string)
4. Check `active: true`
5. Open NewsletterPreference table
6. Find 2 rows with the subscriberId
7. Verify `newsletterType: "aviation"` and `"dev-startup"`
8. Verify `subscribed: true` for both

**Save Token for Later Tests**:
```bash
# Copy the unsubscribeToken value from Prisma Studio
# We'll use it as $TOKEN in later commands
export TOKEN="<paste-token-here>"
```

---

## Test Scenario 2: Validation - No Newsletter Selected

**Request**:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "newsletterTypes": []
  }'
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "code": "too_small",
      "message": "Array must contain at least 1 element(s)",
      "path": ["newsletterTypes"]
    }
  ]
}
```

**Verify**: No subscriber created in database.

---

## Test Scenario 3: Validation - Invalid Email

**Request**:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "newsletterTypes": ["aviation"]
  }'
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_string",
      "message": "Invalid email",
      "path": ["email"]
    }
  ]
}
```

**Verify**: No subscriber created in database.

---

## Test Scenario 4: Validation - Invalid Newsletter Type

**Request**:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test3@example.com",
    "newsletterTypes": ["invalid-type"]
  }'
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_enum_value",
      "message": "Invalid enum value...",
      "path": ["newsletterTypes", 0]
    }
  ]
}
```

---

## Test Scenario 5: Duplicate Email (Upsert)

**Request** (same email as Test 1, different newsletters):
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "newsletterTypes": ["education", "all"],
    "source": "api-test-upsert"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletters",
  "subscriber": {
    "email": "test1@example.com",
    "newsletterTypes": ["education", "all"]
  }
}
```

**Verify in Prisma Studio**:
1. Still only 1 NewsletterSubscriber with email `test1@example.com`
2. Now has 4 NewsletterPreference rows total
3. Original preferences (aviation, dev-startup) remain but may be toggled
4. New preferences (education, all) are subscribed
5. `source` field updated to "api-test-upsert"

---

## Test Scenario 6: Get Preferences by Token

### API Endpoint: GET /api/newsletter/preferences/:token

**Request** (use token from Test 1):
```bash
curl -X GET "http://localhost:3000/api/newsletter/preferences/$TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "subscriber": {
    "email": "test1@example.com",
    "preferences": {
      "aviation": true,
      "dev-startup": true,
      "education": true,
      "all": true
    },
    "subscribedAt": "2025-10-28T12:34:56.789Z"
  }
}
```

**Test Invalid Token**:
```bash
curl -X GET "http://localhost:3000/api/newsletter/preferences/invalidtoken123"
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Invalid token format"
}
```

**Test Non-Existent Token**:
```bash
curl -X GET "http://localhost:3000/api/newsletter/preferences/0000000000000000000000000000000000000000000000000000000000000000"
```

**Expected Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Subscriber not found"
}
```

---

## Test Scenario 7: Update Preferences

### API Endpoint: PATCH /api/newsletter/preferences

**Request** (update to only aviation and education):
```bash
curl -X PATCH http://localhost:3000/api/newsletter/preferences \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$TOKEN\",
    \"preferences\": {
      \"aviation\": true,
      \"dev-startup\": false,
      \"education\": true,
      \"all\": false
    }
  }"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "subscriber": {
    "email": "test1@example.com",
    "preferences": {
      "aviation": true,
      "dev-startup": false,
      "education": true,
      "all": false
    }
  }
}
```

**Verify in Prisma Studio**:
1. NewsletterPreference table
2. Find rows for this subscriber
3. `aviation` and `education` have `subscribed: true`
4. `dev-startup` and `all` have `subscribed: false`
5. `updatedAt` timestamp changed

---

## Test Scenario 8: Update Preferences - All False (Invalid)

**Request** (try to unsubscribe from all):
```bash
curl -X PATCH http://localhost:3000/api/newsletter/preferences \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$TOKEN\",
    \"preferences\": {
      \"aviation\": false,
      \"dev-startup\": false,
      \"education\": false,
      \"all\": false
    }
  }"
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "message": "At least one newsletter must be selected"
    }
  ]
}
```

**Note**: Users should use unsubscribe endpoint instead.

---

## Test Scenario 9: Unsubscribe (Soft Delete)

### API Endpoint: DELETE /api/newsletter/unsubscribe

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$TOKEN\",
    \"hardDelete\": false
  }"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully unsubscribed",
  "email": "test1@example.com"
}
```

**Verify in Prisma Studio**:
1. NewsletterSubscriber table
2. Find subscriber with `test1@example.com`
3. `active: false`
4. `unsubscribedAt` timestamp set
5. NewsletterPreference rows still exist (soft delete)

---

## Test Scenario 10: Unsubscribe (Hard Delete / GDPR)

**Request** (create new subscriber first):
```bash
# Create subscriber
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-gdpr@example.com",
    "newsletterTypes": ["aviation"],
    "source": "gdpr-test"
  }'

# Get token from Prisma Studio for test-gdpr@example.com
# Then hard delete:
curl -X DELETE http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"<gdpr-token-here>\",
    \"hardDelete\": true
  }"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "All data permanently deleted",
  "email": "test-gdpr@example.com"
}
```

**Verify in Prisma Studio**:
1. NewsletterSubscriber table
2. No row with `test-gdpr@example.com` (deleted)
3. NewsletterPreference table
4. No rows with matching subscriberId (CASCADE delete)

---

## Test Scenario 11: Rate Limiting

**Test hitting rate limit** (5 requests per minute per IP):

```bash
# Run this 6 times rapidly:
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/newsletter/subscribe \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"ratelimit$i@example.com\",
      \"newsletterTypes\": [\"aviation\"],
      \"source\": \"rate-limit-test\"
    }" \
    -w "\nHTTP Status: %{http_code}\n\n"
  sleep 0.5
done
```

**Expected Results**:
- Requests 1-5: HTTP 200 (success)
- Request 6: HTTP 429 (Too Many Requests)

**Expected Response for 6th Request** (429 Too Many Requests):
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

**Check Response Headers** (6th request):
```bash
curl -i -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ratelimit7@example.com",
    "newsletterTypes": ["aviation"]
  }'
```

**Expected Headers**:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-10-28T15:35:00.000Z
Retry-After: 45
```

**Reset Rate Limit**: Wait 60 seconds OR restart dev server

---

## Test Scenario 12: Re-subscribe After Unsubscribe

**Request** (reactivate test1@example.com):
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "newsletterTypes": ["all"],
    "source": "reactivation-test"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletters",
  "subscriber": {
    "email": "test1@example.com",
    "newsletterTypes": ["all"]
  }
}
```

**Verify in Prisma Studio**:
1. `active: true` (reactivated)
2. `unsubscribedAt: null` (cleared)
3. Preferences updated to "all"

---

## Test Scenario 13: All Newsletter Types

**Request** (test all 4 types):
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-all@example.com",
    "newsletterTypes": ["aviation", "dev-startup", "education", "all"],
    "source": "all-types-test"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletters",
  "subscriber": {
    "email": "test-all@example.com",
    "newsletterTypes": ["aviation", "dev-startup", "education", "all"]
  }
}
```

**Verify in Prisma Studio**:
1. 4 NewsletterPreference rows
2. All have `subscribed: true`

---

## Performance Testing

### Measure API Response Time

**Test Subscribe Endpoint**:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "perf-test@example.com",
    "newsletterTypes": ["aviation"]
  }' \
  -w "\nTime Total: %{time_total}s\n" \
  -o /dev/null -s
```

**Expected**: <0.5s (target: <2s per NFR-002)

**Test Get Preferences**:
```bash
curl -X GET "http://localhost:3000/api/newsletter/preferences/$TOKEN" \
  -w "\nTime Total: %{time_total}s\n" \
  -o /dev/null -s
```

**Expected**: <0.5s (target: <500ms P95 per NFR-001)

---

## Database Query Verification

### Check All Subscribers
```bash
# Using Prisma Studio (GUI)
# OR via psql:
psql $DATABASE_URL -c "SELECT id, email, active, \"unsubscribeToken\", \"subscribedAt\", \"unsubscribedAt\" FROM \"newsletter_subscribers\" ORDER BY \"createdAt\" DESC LIMIT 10;"
```

### Check All Preferences
```bash
psql $DATABASE_URL -c "SELECT ns.email, np.\"newsletterType\", np.subscribed, np.\"updatedAt\" FROM \"newsletter_preferences\" np JOIN \"newsletter_subscribers\" ns ON np.\"subscriberId\" = ns.id ORDER BY ns.email, np.\"newsletterType\";"
```

### Count Subscribers by Type
```bash
psql $DATABASE_URL -c "SELECT \"newsletterType\", COUNT(*) as count FROM \"newsletter_preferences\" WHERE subscribed = true GROUP BY \"newsletterType\" ORDER BY count DESC;"
```

---

## Cleanup Test Data

**Remove all test subscribers**:
```bash
psql $DATABASE_URL -c "DELETE FROM \"newsletter_subscribers\" WHERE email LIKE '%@example.com' OR email LIKE '%test%';"
```

**Note**: This also deletes associated preferences due to CASCADE.

---

## Postman Collection (Alternative)

If you prefer Postman, import this collection:

**Collection JSON**:
```json
{
  "info": {
    "name": "Newsletter API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Subscribe",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"newsletterTypes\": [\"aviation\", \"dev-startup\"],\n  \"source\": \"postman\"\n}"
        },
        "url": {"raw": "http://localhost:3000/api/newsletter/subscribe"}
      }
    },
    {
      "name": "Get Preferences",
      "request": {
        "method": "GET",
        "url": {"raw": "http://localhost:3000/api/newsletter/preferences/{{token}}"}
      }
    },
    {
      "name": "Update Preferences",
      "request": {
        "method": "PATCH",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"token\": \"{{token}}\",\n  \"preferences\": {\n    \"aviation\": true,\n    \"dev-startup\": false,\n    \"education\": true,\n    \"all\": false\n  }\n}"
        },
        "url": {"raw": "http://localhost:3000/api/newsletter/preferences"}
      }
    },
    {
      "name": "Unsubscribe",
      "request": {
        "method": "DELETE",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"token\": \"{{token}}\",\n  \"hardDelete\": false\n}"
        },
        "url": {"raw": "http://localhost:3000/api/newsletter/unsubscribe"}
      }
    }
  ],
  "variable": [
    {"key": "token", "value": ""}
  ]
}
```

---

## Test Results Template

After running tests, fill this out:

### Results Summary

**Date**: _______________
**Tester**: _______________

| Scenario | Status | Response Time | Notes |
|----------|--------|---------------|-------|
| 1. Subscribe (happy path) | ☐ Pass ☐ Fail | ___ms | |
| 2. Validation - no newsletters | ☐ Pass ☐ Fail | ___ms | |
| 3. Validation - invalid email | ☐ Pass ☐ Fail | ___ms | |
| 4. Validation - invalid type | ☐ Pass ☐ Fail | ___ms | |
| 5. Duplicate email (upsert) | ☐ Pass ☐ Fail | ___ms | |
| 6. Get preferences | ☐ Pass ☐ Fail | ___ms | |
| 7. Update preferences | ☐ Pass ☐ Fail | ___ms | |
| 8. Update preferences - all false | ☐ Pass ☐ Fail | ___ms | |
| 9. Unsubscribe (soft) | ☐ Pass ☐ Fail | ___ms | |
| 10. Unsubscribe (hard/GDPR) | ☐ Pass ☐ Fail | ___ms | |
| 11. Rate limiting | ☐ Pass ☐ Fail | ___ms | |
| 12. Re-subscribe | ☐ Pass ☐ Fail | ___ms | |
| 13. All newsletter types | ☐ Pass ☐ Fail | ___ms | |

**Issues Found**: _______________
**Overall Status**: ☐ Ready to Ship ☐ Issues Found ☐ Blocked

---

## Quick Reference

### Valid Newsletter Types
- `"aviation"`
- `"dev-startup"`
- `"education"`
- `"all"`

### API Endpoints
- `POST /api/newsletter/subscribe`
- `GET /api/newsletter/preferences/:token`
- `PATCH /api/newsletter/preferences`
- `DELETE /api/newsletter/unsubscribe`

### Database Tables
- `newsletter_subscribers`
- `newsletter_preferences`

### Rate Limits
- 5 requests per minute per IP
- All endpoints protected

---

🤖 Generated with Claude Code
Testing Guide Created: 2025-10-28
