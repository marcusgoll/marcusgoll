/**
 * Maintenance Mode Utilities
 *
 * Purpose: Helper functions for maintenance mode bypass logic
 * Runtime: Edge Runtime compatible (no Node.js APIs)
 * Dependencies: None (pure TypeScript functions)
 */

/**
 * Validates bypass token against environment token
 *
 * @param token - Token from query parameter or user input
 * @param envToken - Token from environment variable
 * @returns true if tokens match exactly (case-sensitive), false otherwise
 *
 * Security notes:
 * - Constant-time comparison to prevent timing attacks
 * - Handles null/undefined/empty strings safely
 * - No whitespace trimming (tokens must match exactly)
 */
export function validateBypassToken(
  token: string | null | undefined,
  envToken: string | null | undefined
): boolean {
  // Early return for missing values
  if (!token || !envToken) {
    return false
  }

  // Length check (prevent timing attacks on length differences)
  if (token.length !== envToken.length) {
    return false
  }

  // Constant-time comparison (prevents timing attacks)
  // Note: In production, consider using crypto.timingSafeEqual if available
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ envToken.charCodeAt(i)
  }

  return result === 0
}

/**
 * Checks if pathname should be excluded from maintenance mode redirect
 *
 * @param pathname - URL pathname (e.g., "/blog", "/_next/static/chunks/main.js")
 * @returns true if path should bypass maintenance mode, false otherwise
 *
 * Excluded paths:
 * - /_next/* - Next.js internal assets (static, webpack chunks)
 * - /images/* - Public images
 * - /fonts/* - Web fonts
 * - /api/health - Health check endpoint
 * - /maintenance - Maintenance page itself (prevents infinite loop)
 */
export function isExcludedPath(pathname: string): boolean {
  if (!pathname) {
    return false
  }

  // Regex: Match excluded path prefixes
  const excludedPattern = /^\/((_next|images|fonts|api\/health|maintenance)($|\/))/

  return excludedPattern.test(pathname)
}

/**
 * Masks token for logging (shows last 4 characters only)
 *
 * @param token - Token to mask
 * @returns Masked token string (e.g., "***e7048" for 64-char token)
 *
 * Examples:
 * - "7ce4b83f...69e7048" → "***e7048"
 * - "short" → "***hort"
 * - "" → "***"
 */
export function maskToken(token: string | null | undefined): string {
  if (!token) {
    return '***'
  }

  // Show last 4 characters, mask the rest
  const visibleChars = 4
  if (token.length <= visibleChars) {
    return `***${token}`
  }

  return `***${token.slice(-visibleChars)}`
}

/**
 * Logs bypass attempt with security details
 *
 * @param success - Whether bypass was successful
 * @param details - Additional details (token, IP address)
 *
 * Log format:
 * - Success: [INFO] [Maintenance Bypass] Successful - Token: ***e7048
 * - Failure: [WARN] [Maintenance Bypass] Failed - IP: 192.168.1.1 - Token: ***WXYZ
 *
 * Purpose: Security audit trail and debugging
 */
export function logBypassAttempt(
  success: boolean,
  details: { token: string; ip?: string }
): void {
  const maskedToken = maskToken(details.token)
  const timestamp = new Date().toISOString()

  if (success) {
    console.info(
      `[${timestamp}] [INFO] [Maintenance Bypass] Successful - Token: ${maskedToken}`
    )
  } else {
    const ipInfo = details.ip ? `IP: ${details.ip} - ` : ''
    console.warn(
      `[${timestamp}] [WARN] [Maintenance Bypass] Failed - ${ipInfo}Token: ${maskedToken}`
    )
  }
}
