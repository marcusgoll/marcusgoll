/**
 * Cloudflare Turnstile server-side verification
 *
 * Purpose: Verify Turnstile tokens to prevent spam bot submissions
 * API: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Configuration: Requires TURNSTILE_SECRET_KEY environment variable
 */

export interface TurnstileVerificationResult {
  success: boolean
  error?: string
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

/**
 * Verify Turnstile token with Cloudflare API
 *
 * @param token - Turnstile token from client-side challenge
 * @param clientIp - Client IP address (optional but recommended)
 * @returns Verification result with success status
 *
 * Error codes reference:
 * - missing-input-secret: Secret key is missing
 * - invalid-input-secret: Secret key is invalid
 * - missing-input-response: Token is missing
 * - invalid-input-response: Token is invalid or expired
 * - timeout-or-duplicate: Token has been used or expired
 * - internal-error: Cloudflare internal error
 */
export async function verifyTurnstileToken(
  token: string,
  clientIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  // Check secret key configuration
  if (!secretKey) {
    console.error('[Turnstile] TURNSTILE_SECRET_KEY not configured')
    return {
      success: false,
      error: 'Turnstile verification not configured',
    }
  }

  // Validate token input
  if (!token || token.trim().length === 0) {
    return {
      success: false,
      error: 'Turnstile token is missing',
    }
  }

  try {
    // Call Cloudflare Turnstile verification API
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: clientIp, // Optional but recommended for better accuracy
        }),
        // 5 second timeout for verification
        signal: AbortSignal.timeout(5000),
      }
    )

    // Handle non-200 responses
    if (!response.ok) {
      console.error(
        `[Turnstile] API returned ${response.status}: ${response.statusText}`
      )
      return {
        success: false,
        error: `Turnstile API error: ${response.status}`,
      }
    }

    // Parse verification result
    const result: TurnstileVerificationResult = await response.json()

    // Log verification failures (without exposing sensitive data)
    if (!result.success) {
      console.warn('[Turnstile] Verification failed:', {
        errorCodes: result['error-codes'],
        hostname: result.hostname,
        // Don't log IP or token for privacy
      })
    }

    return result
  } catch (error) {
    // Handle network errors, timeouts, and parse errors
    if (error instanceof Error) {
      console.error('[Turnstile] Verification error:', error.message)

      // Provide user-friendly error messages
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return {
          success: false,
          error: 'Turnstile verification timed out. Please try again.',
        }
      }

      return {
        success: false,
        error: 'Failed to verify security challenge. Please try again.',
      }
    }

    // Unknown error type
    console.error('[Turnstile] Unknown verification error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during verification.',
    }
  }
}

/**
 * Check if Turnstile is properly configured
 *
 * @returns true if TURNSTILE_SECRET_KEY is set
 */
export function isTurnstileConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY
}
