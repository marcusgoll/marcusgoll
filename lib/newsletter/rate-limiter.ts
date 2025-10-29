/**
 * Simple in-memory rate limiter for newsletter API endpoints
 * NFR-011: 5 requests per minute per IP
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (consider Redis for multi-instance deployments)
const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for an identifier (typically IP address)
 * @param identifier - Unique identifier (IP address)
 * @param limit - Maximum requests per window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns RateLimitResult with success status and metadata
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  // No entry or expired - create new
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs
    store.set(identifier, { count: 1, resetAt })

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetAt,
    }
  }

  // Entry exists and not expired
  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  // Increment count
  entry.count += 1
  store.set(identifier, entry)

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  }
}

/**
 * Get client IP from Next.js request headers
 * Handles various proxy headers (Cloudflare, nginx, etc.)
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback (shouldn't happen in production)
  return 'unknown'
}
