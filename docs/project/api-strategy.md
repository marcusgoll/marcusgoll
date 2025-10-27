# API Strategy

**Last Updated**: 2025-10-26
**Related Docs**: See `system-architecture.md` for API architecture, `tech-stack.md` for framework choice

## API Style

**Choice**: REST over HTTPS (Next.js API Routes)
**Rationale**:
- Simple, universally understood
- Sufficient for low-complexity needs (newsletter signup, future contact form)
- Built into Next.js (no separate backend service)
- Can add tRPC or GraphQL later if complexity grows

**Alternatives Rejected**:
- GraphQL: Overkill for simple blog APIs, adds complexity
- tRPC: Type-safe but unnecessary for public REST endpoints
- gRPC: Binary protocol, not needed for web clients

---

## API Categories

### Category: Newsletter Management

**Purpose**: Newsletter subscription management
**Base Path**: `/api/newsletter`
**Authentication**: None (public endpoint)
**Rate Limiting**: 5 requests per minute per IP (prevent spam)

**Endpoints**:

**POST /api/newsletter/subscribe**
- **Purpose**: Subscribe to newsletter
- **Body**: `{ email: string }`
- **Response**: `{ success: boolean, message: string }`
- **Validation**: Email format (Zod schema)
- **Status Codes**:
  - `200 OK`: Subscription successful
  - `400 Bad Request`: Invalid email format
  - `429 Too Many Requests`: Rate limit exceeded
  - `500 Internal Server Error`: Resend/Mailgun API failure

**Example Request**:
```bash
curl -X POST https://marcusgoll.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "reader@example.com"}'
```

**Example Response**:
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter!"
}
```

---

### Category: Analytics (Future)

**Purpose**: Custom analytics queries (if GA4 insufficient)
**Base Path**: `/api/analytics`
**Authentication**: Required (admin only)
**Future Endpoints**:
- `GET /api/analytics/popular-posts` - Most read posts (last 30 days)
- `GET /api/analytics/traffic-sources` - Referrer breakdown

---

### Category: Contact Form (Future)

**Purpose**: Contact form submissions
**Base Path**: `/api/contact`
**Authentication**: None (public, with reCAPTCHA)
**Future Endpoint**:
- `POST /api/contact` - Send contact message via email

---

## Versioning Strategy

**Approach**: No versioning (MVP)
**Current Version**: Unversioned (implicit v1)
**Migration Policy**:
- Breaking changes: Add `/v2/` prefix to new endpoints, keep `/api/` for v1
- Support v1 for 6 months after v2 release
- Deprecation warnings in response headers

**When to Bump Version**:
- ✅ Breaking: Change request/response schema
- ✅ Breaking: Remove endpoint
- ❌ Non-breaking: Add optional field
- ❌ Non-breaking: Add new endpoint

**Future Versioning** (if needed):
- `/api/v1/newsletter/subscribe`
- `/api/v2/newsletter/subscribe`

---

## Authentication

**Current State**: No authentication (public API)

**Future State** (if admin endpoints added):

**Method**: JWT (via Supabase Auth)
**Token Lifetime**: 1 hour
**Refresh**: Handled by Supabase client

**How it Works**:
1. Admin logs in via Supabase Auth
2. Supabase returns JWT
3. Client includes JWT in `Authorization: Bearer <token>` header
4. API validates JWT with Supabase public key
5. Extracts `user_id` and `role` from token
6. Checks permissions

**Protected Endpoints** (future):
- `/api/analytics/*` - Admin only
- `/api/admin/*` - Admin only

---

## Authorization

**Model**: None (public API)
**Future**: RBAC if admin features added
- `admin`: Marcus (full access)
- `public`: All visitors (read-only, newsletter signup)

**Enforcement** (future):
```typescript
// Middleware example
async function requireAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return user
}
```

---

## Request/Response Format

### Request Format

**Content-Type**: `application/json`
**Encoding**: UTF-8

**Request Body Structure**:
```json
{
  "field1": "value",
  "field2": 123
}
```

**Validation**:
- Zod schemas validate all inputs
- Reject unknown fields
- Type coercion where safe (string "123" → int 123)

**Example (Newsletter Signup)**:
```typescript
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email format'),
  source: z.enum(['footer', 'popup', 'post']).optional(),
})

// Usage
const body = subscribeSchema.parse(await req.json())
```

### Response Format

**Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }  // Optional
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",  // Optional
  "details": { ... }     // Optional (validation errors)
}
```

**Example Error (Validation)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format"
  }
}
```

---

## Pagination

**Current State**: Not needed (no paginated endpoints yet)

**Future Strategy** (if post API added):
- **Strategy**: Offset-based (simple, works for small datasets)
- **Default Limit**: 20
- **Max Limit**: 100

**Query Parameters**:
- `?limit=20` - Items per page
- `?offset=0` - Starting position
- `?sort_by=published_at&order=desc` - Sorting

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 40,
    "has_more": true
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, POST, PUT |
| 201 | Created | Successful resource creation (unused currently) |
| 204 | No Content | Successful DELETE (unused currently) |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing/invalid auth token (future) |
| 403 | Forbidden | Valid token, insufficient permissions (future) |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | External API failure (Resend/Mailgun) |
| 503 | Service Unavailable | Maintenance mode |

### Error Response Structure

**Example (Rate Limit)**:
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

**Example (Validation)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format"
  }
}
```

---

## Rate Limiting

**Strategy**: Per IP address (public endpoints)
**Limits**:
- Newsletter signup: 5 requests per minute per IP
- Future API endpoints: 60 requests per minute per IP

**Implementation**: In-memory rate limiting (or Redis if multi-instance)

**Headers**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1677721660
```

**429 Response**:
```json
{
  "success": false,
  "error": "Too many requests. Please try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

---

## Caching

**Strategy**: Minimal caching (API responses are lightweight)

**Newsletter Signup**: No caching (write operation)

**Future GET Endpoints**:
- Static data (tag list): `Cache-Control: public, max-age=3600` (1 hour)
- Dynamic data (popular posts): `Cache-Control: public, max-age=300` (5 minutes)

**No-Cache Endpoints**:
- Newsletter signup: `Cache-Control: no-store`
- Admin endpoints: `Cache-Control: private, no-store`

---

## API Documentation

**Tool**: Not implemented (MVP)
**Future**: OpenAPI 3.0 (Swagger UI) or Postman collection

**Current Documentation**: This file (`api-strategy.md`)

**When to Add Swagger**:
- When API grows to 5+ endpoints
- When external integrations need API docs

---

## CORS Policy

**Allowed Origins**:
- `https://marcusgoll.com` (production)
- `https://www.marcusgoll.com` (www subdomain)
- `http://localhost:3000` (development)

**Allowed Methods**: GET, POST, OPTIONS
**Allowed Headers**: Content-Type, Authorization
**Credentials**: Not allowed (no cookies)
**Max Age**: 86400 (cache preflight for 24 hours)

**Implementation** (Next.js middleware):
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin')
  const allowedOrigins = [
    'https://marcusgoll.com',
    'https://www.marcusgoll.com',
    'http://localhost:3000',
  ]

  if (origin && allowedOrigins.includes(origin)) {
    return NextResponse.next({
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  return NextResponse.next()
}
```

---

## API Lifecycle

### Deprecation Process

**Not yet implemented** (no deprecated endpoints)

**Future Process**:
1. **Announce**: 3 months notice (blog post, API response headers)
2. **Mark**: Add deprecation header
   ```
   Deprecation: true
   Sunset: Fri, 01 Jan 2027 00:00:00 GMT
   Link: <https://marcusgoll.com/docs/api-migration>; rel="alternate"
   ```
3. **Support**: 6 months minimum
4. **Sunset**: Return 410 Gone with migration instructions

### Breaking Changes

**What Counts as Breaking**:
- ✅ Remove endpoint
- ✅ Change request schema (require new field, change types)
- ✅ Change response schema (remove field, change types)
- ❌ Add optional request field
- ❌ Add response field
- ❌ Add new endpoint

**How to Handle**:
- Create new versioned endpoint (`/api/v2/newsletter/subscribe`)
- Keep old endpoint for 6 months
- Update documentation with migration guide

---

## Testing Strategy

**Current State**: Manual testing

**Future Strategy**:
- **Unit Tests**: Validate business logic (email validation, rate limiting)
- **Integration Tests**: Full request → response cycle
- **E2E Tests**: Playwright test newsletter signup flow

**Tools**:
- Vitest for unit/integration tests
- Playwright for E2E

**Coverage Target**: 80% for API routes

---

## Performance Targets

| Endpoint | P50 Target | P95 Target | P99 Target |
|----------|------------|------------|------------|
| POST /api/newsletter/subscribe | < 200ms | < 500ms | < 1s |
| GET /api/analytics/* (future) | < 100ms | < 300ms | < 500ms |

**How Measured**: Next.js built-in metrics, custom logging

**Violations**: If P95 > 1s for 10 minutes → investigate (slow Resend API?)

---

## Security Best Practices

**Input Validation**:
- All inputs validated with Zod schemas
- Reject unknown fields
- Sanitize email addresses (prevent injection)

**Rate Limiting**:
- Prevent spam on newsletter signup
- Prevent DoS on API endpoints

**Error Messages**:
- No sensitive data in error messages
- Generic errors for security issues (don't reveal "user exists" vs "wrong password")

**Logging**:
- Log API calls (endpoint, status, duration)
- Mask sensitive data (email displayed as `r***@example.com`)
- Never log passwords or tokens

**Future (if auth added)**:
- JWT validation with Supabase
- HTTPS-only (HTTP redirects to HTTPS)
- Content Security Policy headers

---

## External API Integrations

### Resend / Mailgun (Newsletter)

**Purpose**: Send confirmation emails, manage subscribers
**Integration Type**: REST API calls
**Data Shared**: Email addresses
**Error Handling**:
- Retry once on failure
- Display error to user if both attempts fail
- Log to monitoring (future)

**Rate Limits**:
- Resend: 10 req/sec (generous for our use case)
- Mailgun: 100 msg/hour free tier

**Failure Mode**:
- Display user-friendly error: "Could not subscribe. Please try again later."
- Log error for debugging
- Newsletter provider downtime doesn't break site (graceful degradation)

---

## Future Considerations

**Webhooks** (if needed for integrations):
- Inbound: Resend delivery confirmations
- Outbound: Notify external systems when new post published

**GraphQL** (if complexity grows):
- Consider if multiple clients need flexible querying
- Overkill for current simple APIs

**API Gateway** (if traffic grows):
- Cloudflare Workers for edge caching
- API throttling and DDoS protection

---

## Change Log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2025-10-26 | Initial API strategy documented | Project initialization | Baseline for API development |
| 2025-10-26 | Newsletter API endpoint defined | MVP feature requirement | Clear spec for implementation |
