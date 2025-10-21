/**
 * Environment Variable Validation
 *
 * Purpose: Validate required environment variables at application startup
 * Performance Target: <50ms for 10 variables (simple checks, no external calls)
 *
 * This function runs before the app accepts requests (fail-fast approach)
 * Clear error messages include: variable name, description, example value
 *
 * @throws {Error} If any required variable is missing or invalid
 */

interface ValidationError {
  variable: string
  description: string
  example: string
}

/**
 * Validate all required environment variables
 * Throws detailed error message if validation fails
 */
export function validateEnvironmentVariables(): void {
  const startTime = performance.now()
  const errors: ValidationError[] = []

  // Required variables with descriptions and examples
  const requiredVars: Record<string, { description: string; example: string }> = {
    PUBLIC_URL: {
      description: 'Base URL for the application',
      example: 'http://localhost:3000 (dev) or https://marcusgoll.com (prod)',
    },
    NODE_ENV: {
      description: 'Environment mode',
      example: 'development | production | test',
    },
    DATABASE_URL: {
      description: 'PostgreSQL connection string',
      example: 'postgresql://user:password@localhost:5432/marcusgoll',
    },
    NEXT_PUBLIC_SUPABASE_URL: {
      description: 'Supabase API URL (client-side accessible)',
      example: 'http://localhost:54321 (dev) or https://api.marcusgoll.com (prod)',
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      description: 'Supabase anonymous key (public)',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      description: 'Supabase service role key (server-side only)',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    NEWSLETTER_FROM_EMAIL: {
      description: 'Verified sender email address for newsletters',
      example: 'newsletter@marcusgoll.com',
    },
  }

  // Validate presence of required variables
  for (const [varName, { description, example }] of Object.entries(requiredVars)) {
    if (!process.env[varName] || process.env[varName]?.trim() === '') {
      errors.push({
        variable: varName,
        description,
        example,
      })
    }
  }

  // At least one newsletter service API key required
  const hasNewsletterKey = process.env.RESEND_API_KEY || process.env.MAILGUN_API_KEY
  if (!hasNewsletterKey) {
    errors.push({
      variable: 'RESEND_API_KEY or MAILGUN_API_KEY',
      description: 'API key for newsletter/email service (at least one required)',
      example: 're_xxxx (Resend) or key-xxxx (Mailgun)',
    })
  }

  // Format validation for URLs
  const urlVars = ['PUBLIC_URL', 'NEXT_PUBLIC_SUPABASE_URL']
  for (const varName of urlVars) {
    const value = process.env[varName]
    if (value && !value.match(/^https?:\/\//)) {
      errors.push({
        variable: varName,
        description: 'Must be a valid HTTP/HTTPS URL',
        example: 'https://example.com or http://localhost:3000',
      })
    }
  }

  // If errors found, throw detailed error message
  if (errors.length > 0) {
    const errorMessages = errors
      .map(
        ({ variable, description, example }) =>
          `\n❌ Missing required environment variable: ${variable}\n` +
          `   Description: ${description}\n` +
          `   Example: ${example}`
      )
      .join('\n')

    const errorSummary =
      `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚨 ENVIRONMENT VARIABLE VALIDATION FAILED\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `\n${errors.length} validation error(s) found:` +
      errorMessages +
      `\n\n📋 Please check .env.example for required configuration.\n` +
      `\n💡 Setup instructions:\n` +
      `   1. Copy .env.example to .env.local (development)\n` +
      `   2. Fill in all required values\n` +
      `   3. See docs/ENV_SETUP.md for detailed setup guide\n` +
      `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`

    throw new Error(errorSummary)
  }

  // Performance logging (development only)
  const duration = performance.now() - startTime
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Environment variables validated (${duration.toFixed(2)}ms)`)
  }

  // Verify performance target met (<50ms)
  if (duration > 50) {
    console.warn(
      `⚠️  Environment validation took ${duration.toFixed(2)}ms (target: <50ms)`
    )
  }
}

/**
 * Check if environment variables are valid without throwing
 * Useful for health checks and monitoring
 */
export function checkEnvironmentVariables(): {
  valid: boolean
  errors: ValidationError[]
  duration: number
} {
  const startTime = performance.now()
  const errors: ValidationError[] = []

  try {
    validateEnvironmentVariables()
    return {
      valid: true,
      errors: [],
      duration: performance.now() - startTime,
    }
  } catch (error) {
    // Parse errors from validation exception
    // (This is a simplified implementation - in production you'd want proper error parsing)
    return {
      valid: false,
      errors: [], // Would be populated from error message parsing
      duration: performance.now() - startTime,
    }
  }
}
