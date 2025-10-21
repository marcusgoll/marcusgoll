# Data Model: environment-manageme

## Overview

This is an infrastructure feature for environment variable management. There are **no database entities** or schema changes required.

## Configuration Entities (File-based, not database)

### Environment Configuration (.env files)

**Purpose**: Store environment-specific configuration values for different deployment environments.

**Files**:
- `.env.example` - Template with all required variables (committed to git)
- `.env.local` - Development environment variables (gitignored)
- `.env.production` - Production environment variables (gitignored, securely transferred to VPS)

**Structure** (key-value pairs):
```bash
# Category: Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Category: Supabase
NEXT_PUBLIC_SUPABASE_URL="https://api.marcusgoll.com"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Category: Newsletter Service
RESEND_API_KEY="your-resend-api-key"  # Or MAILGUN_API_KEY
NEWSLETTER_FROM_EMAIL="newsletter@marcusgoll.com"

# Category: Third-Party Services
GA4_MEASUREMENT_ID="G-XXXXXXXXXX"  # Optional for MVP
EMAIL_SERVICE_API_KEY="your-api-key"  # Optional for MVP
```

**Validation Rules**:
- All variables prefixed with `NEXT_PUBLIC_` are exposed to browser (from Next.js convention)
- Server-side variables (without prefix) are only accessible in API routes and server components
- Required variables must be present at application startup (enforced by validation function)
- Format validation for URLs (must be valid HTTP/HTTPS URLs)
- No empty values allowed for required variables

**Categories**:
1. **Next.js Configuration**: PUBLIC_URL, NODE_ENV
2. **Database**: DATABASE_URL, DIRECT_DATABASE_URL (optional)
3. **Supabase**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
4. **Newsletter Service**: RESEND_API_KEY (or MAILGUN_API_KEY), NEWSLETTER_FROM_EMAIL
5. **Third-Party Services**: GA4_MEASUREMENT_ID (optional)

---

### Environment Variable Schema (Validation Schema)

**Purpose**: Define required variables, types, and validation rules for runtime validation.

**Schema Structure** (TypeScript interface for documentation, not enforced in MVP):
```typescript
interface EnvironmentVariables {
  // Next.js Configuration
  PUBLIC_URL: string  // Base URL (e.g., https://marcusgoll.com)
  NODE_ENV: 'development' | 'production' | 'test'

  // Database
  DATABASE_URL: string  // PostgreSQL connection string

  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: string  // Supabase API URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string  // Anonymous key (public)
  SUPABASE_SERVICE_ROLE_KEY: string  // Service role key (server-side only)

  // Newsletter Service (required)
  RESEND_API_KEY?: string  // Resend API key (one of RESEND or MAILGUN required)
  MAILGUN_API_KEY?: string  // Mailgun API key (alternative to Resend)
  NEWSLETTER_FROM_EMAIL: string  // Verified sender email address

  // Third-Party Services (optional for MVP)
  GA4_MEASUREMENT_ID?: string  // Google Analytics 4 measurement ID
}
```

**Validation Function** (pseudo-code for implementation):
```typescript
function validateEnvironmentVariables(): void {
  const required = [
    'PUBLIC_URL',
    'NODE_ENV',
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEWSLETTER_FROM_EMAIL'
  ]

  for (const varName of required) {
    if (!process.env[varName]) {
      throw new Error(
        `Missing required environment variable: ${varName}\n` +
        `Please check .env.example for required configuration.`
      )
    }
  }

  // At least one newsletter service API key required
  if (!process.env.RESEND_API_KEY && !process.env.MAILGUN_API_KEY) {
    throw new Error(
      `Missing required environment variable: RESEND_API_KEY or MAILGUN_API_KEY\n` +
      `At least one newsletter service API key is required.`
    )
  }

  // Format validation for URLs
  const urlVars = ['PUBLIC_URL', 'NEXT_PUBLIC_SUPABASE_URL']
  for (const varName of urlVars) {
    const value = process.env[varName]
    if (value && !value.match(/^https?:\/\//)) {
      throw new Error(
        `Invalid URL format for ${varName}: ${value}\n` +
        `Must start with http:// or https://`
      )
    }
  }
}
```

---

## Docker Compose Configuration (Infrastructure, not database)

**Purpose**: Define environment variable loading for Docker services.

**docker-compose.yml Structure**:
```yaml
version: '3.8'

services:
  nextjs:
    build: .
    env_file:
      - .env  # Loads all environment variables
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    # Note: PostgreSQL via Supabase (cloud or self-hosted)
    # Note: Newsletter service via Resend/Mailgun (API-based)
```

**Environment Variable Flow**:
1. Developer creates `.env.local` from `.env.example`
2. Docker Compose reads `.env` file via `env_file` directive
3. Variables available to Next.js service
4. Next.js app accesses vars via `process.env`
5. External services (Supabase, Resend/Mailgun) accessed via API keys

---

## API Schemas

**N/A** - No API endpoints or contracts for environment variable management. This is pure infrastructure configuration.

---

## State Shape

**N/A** - No frontend state or UI components. Environment variables loaded at application startup, not managed at runtime.

---

## Summary

- **Database Entities**: 0 (infrastructure feature, no database changes)
- **Configuration Files**: 3 (.env.example, .env.local, .env.production)
- **Docker Compose Services**: 1 (Next.js only - PostgreSQL via Supabase external)
- **Validation Schema**: 1 (environment variable schema for runtime validation)
- **Environment Variables**: 10 total (8 required, 2 optional)
- **Migrations Required**: No
- **Schema Changes**: No
