/**
 * Environment Variable Schema
 *
 * Purpose: TypeScript interface for environment variables (documentation only)
 * Note: This is NOT enforced at runtime in MVP (deferred to P3 user story US7)
 *
 * For runtime validation, see: lib/validate-env.ts
 * For type-safe access (future), consider: t3-env or similar library
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

/**
 * Environment variable schema
 * Defines all environment variables used in the application
 */
export interface EnvironmentVariables {
  // ============================================================================
  // Next.js Configuration
  // ============================================================================

  /**
   * Base URL for the application
   * @required Yes
   * @example "http://localhost:3000" (dev) | "https://marcusgoll.com" (prod)
   * @purpose Used for absolute URLs in emails, sitemap, RSS feed
   */
  PUBLIC_URL: string

  /**
   * Environment mode
   * @required Yes (auto-set by Next.js)
   * @example "development" | "production" | "test"
   * @purpose Controls Next.js optimizations and behavior
   */
  NODE_ENV: 'development' | 'production' | 'test'

  // ============================================================================
  // Database (PostgreSQL via Supabase)
  // ============================================================================

  /**
   * PostgreSQL connection string
   * @required Yes
   * @format postgresql://[user]:[password]@[host]:[port]/[database]
   * @example "postgresql://postgres:password@localhost:5432/marcusgoll_dev"
   * @purpose Main database connection for Prisma ORM
   */
  DATABASE_URL: string

  /**
   * Direct PostgreSQL connection (bypasses pooling)
   * @required No (optional for migrations)
   * @format Same as DATABASE_URL but direct connection
   * @purpose Used by Prisma migrations to bypass connection pooling
   */
  DIRECT_DATABASE_URL?: string

  // ============================================================================
  // Supabase (Authentication & Storage)
  // ============================================================================

  /**
   * Supabase API URL
   * @required Yes
   * @client-accessible Yes (NEXT_PUBLIC_* prefix)
   * @format https://[project-id].supabase.co or custom domain
   * @example "http://localhost:54321" (local) | "https://api.marcusgoll.com" (prod)
   * @purpose Client-side Supabase API endpoint (exposed to browser)
   */
  NEXT_PUBLIC_SUPABASE_URL: string

  /**
   * Supabase anonymous key (public)
   * @required Yes
   * @client-accessible Yes (NEXT_PUBLIC_* prefix)
   * @format Long base64-encoded JWT token (starts with "eyJ")
   * @security Safe to expose - respects Row Level Security policies
   * @purpose Public API key for client-side requests
   */
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string

  /**
   * Supabase service role key (secret)
   * @required Yes
   * @client-accessible No (server-side only)
   * @format Long base64-encoded JWT token (starts with "eyJ")
   * @security KEEP SECRET - bypasses Row Level Security
   * @purpose Admin API key for server-side requests
   */
  SUPABASE_SERVICE_ROLE_KEY: string

  // ============================================================================
  // Newsletter Service (Resend or Mailgun)
  // ============================================================================

  /**
   * Resend API key for newsletter emails
   * @required One of RESEND_API_KEY or MAILGUN_API_KEY required
   * @format re_[random string]
   * @purpose Send newsletter emails and transactional emails
   * @alternative Use MAILGUN_API_KEY if using Mailgun instead
   */
  RESEND_API_KEY?: string

  /**
   * Mailgun API key (alternative to Resend)
   * @required One of RESEND_API_KEY or MAILGUN_API_KEY required
   * @format key-[random string]
   * @purpose Alternative email service to Resend
   */
  MAILGUN_API_KEY?: string

  /**
   * Verified sender email address
   * @required Yes
   * @format email@domain.com or "Name <email@domain.com>"
   * @example "newsletter@marcusgoll.com"
   * @purpose "From" address for newsletter and transactional emails
   * @important Email domain must be verified before sending
   */
  NEWSLETTER_FROM_EMAIL: string

  // ============================================================================
  // Third-Party Services (Optional)
  // ============================================================================

  /**
   * Google Analytics 4 measurement ID
   * @required No (optional for MVP)
   * @format G-XXXXXXXXXX
   * @purpose Track page views and user interactions
   */
  GA4_MEASUREMENT_ID?: string

  // ============================================================================
  // Maintenance Mode (Optional)
  // ============================================================================

  /**
   * Maintenance mode toggle
   * @required No (optional, defaults to "false")
   * @format "true" | "false"
   * @example "false" (dev) | "true" (during maintenance)
   * @purpose Enable/disable site-wide maintenance mode with bypass capability
   */
  MAINTENANCE_MODE?: 'true' | 'false'

  /**
   * Secret bypass token for maintenance mode
   * @required No (optional, but required when MAINTENANCE_MODE="true")
   * @format 64-character hex string (256-bit entropy)
   * @example "7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048"
   * @purpose Allows developers to bypass maintenance mode via ?bypass=TOKEN
   * @security KEEP SECRET - anyone with this token can access the site during maintenance
   * @generation openssl rand -hex 32
   */
  MAINTENANCE_BYPASS_TOKEN?: string
}

/**
 * Type-safe environment variable access
 * For future use with t3-env or similar library
 *
 * Example usage (after t3-env integration):
 * ```typescript
 * import { env } from '@/lib/env'
 * console.log(env.DATABASE_URL) // Type-safe access with autocomplete
 * ```
 *
 * Current usage (MVP):
 * ```typescript
 * const dbUrl = process.env.DATABASE_URL // No type safety yet
 * ```
 */

/**
 * Environment variable categories for organization
 */
export const ENV_CATEGORIES = {
  nextjs: ['PUBLIC_URL', 'NODE_ENV'],
  database: ['DATABASE_URL', 'DIRECT_DATABASE_URL'],
  supabase: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ],
  newsletter: ['RESEND_API_KEY', 'MAILGUN_API_KEY', 'NEWSLETTER_FROM_EMAIL'],
  thirdParty: ['GA4_MEASUREMENT_ID'],
  maintenance: ['MAINTENANCE_MODE', 'MAINTENANCE_BYPASS_TOKEN'],
} as const

/**
 * Required vs optional variables
 */
export const ENV_REQUIREMENTS = {
  required: [
    'PUBLIC_URL',
    'NODE_ENV',
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEWSLETTER_FROM_EMAIL',
    // Note: One of RESEND_API_KEY or MAILGUN_API_KEY is required (validated separately)
  ],
  optional: [
    'DIRECT_DATABASE_URL',
    'GA4_MEASUREMENT_ID',
    'MAINTENANCE_MODE',
    'MAINTENANCE_BYPASS_TOKEN',
  ],
} as const

/**
 * Client-accessible vs server-only variables
 */
export const ENV_ACCESS = {
  clientAccessible: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  serverOnly: [
    'DATABASE_URL',
    'DIRECT_DATABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'MAILGUN_API_KEY',
    'NEWSLETTER_FROM_EMAIL',
    'GA4_MEASUREMENT_ID', // Server-only for now, can be client-accessible if prefixed
  ],
} as const

/**
 * Total variable count
 */
export const ENV_METRICS = {
  total: 12,
  required: 8, // 7 always required + 1 of (RESEND_API_KEY | MAILGUN_API_KEY)
  optional: 4,
  clientAccessible: 2,
  serverOnly: 10,
} as const
