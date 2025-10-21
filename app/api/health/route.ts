import { NextResponse } from 'next/server'
import { checkEnvironmentVariables } from '@/lib/validate-env'

/**
 * Health Check Endpoint
 *
 * Purpose: Verify application and environment variable health
 * Used by: Docker healthcheck, uptime monitors, load balancers
 *
 * Responses:
 * - 200: All systems operational
 * - 500: Environment validation failed (critical)
 *
 * @route GET /api/health
 */
export async function GET() {
  try {
    // Check environment variables
    const envCheck = checkEnvironmentVariables()

    // Base health response
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      environment: {
        valid: envCheck.valid,
        validationTime: `${envCheck.duration.toFixed(2)}ms`,
        // Don't expose actual values for security
        variablesConfigured: {
          database: !!process.env.DATABASE_URL,
          supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          newsletter: !!process.env.RESEND_API_KEY || !!process.env.MAILGUN_API_KEY,
        },
      },
    }

    // If environment validation failed, return 500
    if (!envCheck.valid) {
      return NextResponse.json(
        {
          ...health,
          status: 'error',
          message: 'Environment variable validation failed',
        },
        { status: 500 }
      )
    }

    // All checks passed
    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    // Unexpected error during health check
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
