/**
 * Environment Variable Loading Verification
 *
 * Purpose: Document and verify Next.js environment variable loading behavior
 *
 * Next.js 15.5.6 automatically loads environment variables in this precedence order:
 * 1. .env.local (highest priority for local development)
 * 2. .env.production (for production builds)
 * 3. .env (fallback for all environments)
 * 4. .env.example (template only, NOT loaded)
 *
 * Server-side variables:
 * - Accessible via process.env in API routes and Server Components
 * - NOT exposed to browser
 * - Examples: DATABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
 *
 * Client-side variables (NEXT_PUBLIC_* prefix):
 * - Accessible in browser via process.env
 * - Baked into JavaScript bundle at build time
 * - Examples: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

/**
 * Verify that environment variables are loaded correctly
 * This function is for documentation and testing purposes
 */
export function verifyEnvironmentLoading(): {
  loaded: boolean
  serverVars: Record<string, boolean>
  clientVars: Record<string, boolean>
  errors: string[]
} {
  const errors: string[] = []

  // Check server-side variables (should be present on server, undefined on client)
  const serverVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY || !!process.env.MAILGUN_API_KEY,
    NEWSLETTER_FROM_EMAIL: !!process.env.NEWSLETTER_FROM_EMAIL,
  }

  // Check client-side variables (should be present everywhere after build)
  const clientVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  // Validate that client vars are accessible
  if (typeof window !== 'undefined') {
    // Running in browser - should have NEXT_PUBLIC_* vars
    if (!clientVars.NEXT_PUBLIC_SUPABASE_URL) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL not accessible in browser')
    }
    if (!clientVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY not accessible in browser')
    }
    // Server vars should NOT be accessible in browser
    if (serverVars.DATABASE_URL) {
      errors.push('WARNING: DATABASE_URL exposed to browser (security risk)')
    }
  }

  return {
    loaded: errors.length === 0,
    serverVars,
    clientVars,
    errors,
  }
}

/**
 * Environment variable loading documentation
 */
export const ENV_LOADING_DOCS = {
  precedence: [
    '.env.local (development)',
    '.env.production (production)',
    '.env (fallback)',
    '.env.example (template only, not loaded)',
  ],
  serverOnly: [
    'DATABASE_URL',
    'DIRECT_DATABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'MAILGUN_API_KEY',
    'NEWSLETTER_FROM_EMAIL',
  ],
  clientAccessible: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  notes: [
    'Server-side variables are only accessible in API routes and Server Components',
    'Client-side variables (NEXT_PUBLIC_*) are baked into JavaScript bundle at build time',
    'Changing NEXT_PUBLIC_* variables requires rebuild (npm run build)',
    'Server-side variables can be changed without rebuild (restart server)',
    'Never use NEXT_PUBLIC_* prefix for secrets (exposed to browser)',
  ],
}

// For testing/debugging only - remove in production
if (process.env.NODE_ENV === 'development') {
  console.log('📋 Environment Variable Loading Verification')
  console.log('Precedence:', ENV_LOADING_DOCS.precedence)
  console.log('Server-only vars:', ENV_LOADING_DOCS.serverOnly)
  console.log('Client-accessible vars:', ENV_LOADING_DOCS.clientAccessible)
}
