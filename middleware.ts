/**
 * Next.js Edge Middleware
 *
 * Features:
 * 1. Maintenance Mode - Shows maintenance page to external visitors with bypass token support
 * 2. MDX Blog Feature Flag - Temporary during Ghost → MDX transition
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  validateBypassToken,
  isExcludedPath,
  logBypassAttempt,
} from './lib/maintenance-utils'

/**
 * Maintenance Mode Configuration
 * Set MAINTENANCE_MODE=true to enable site-wide maintenance page
 */
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'
const MAINTENANCE_BYPASS_TOKEN = process.env.MAINTENANCE_BYPASS_TOKEN || ''
const BYPASS_COOKIE_NAME = 'maintenance_bypass'
const BYPASS_COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

/**
 * Feature flag: Use MDX blog instead of Ghost CMS
 * Set to false to rollback to Ghost CMS
 */
const USE_MDX_BLOG = process.env.NEXT_PUBLIC_USE_MDX_BLOG !== 'false'

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ============================================================================
  // MAINTENANCE MODE LOGIC
  // ============================================================================

  // Skip maintenance mode for excluded paths (static assets, health checks)
  if (MAINTENANCE_MODE && !isExcludedPath(pathname)) {
    // Already on maintenance page - allow through
    if (pathname === '/maintenance') {
      return NextResponse.next()
    }

    // Check for bypass token in query params (e.g., ?bypass=SECRET_TOKEN)
    const bypassTokenFromQuery = searchParams.get('bypass')

    // Check for existing bypass cookie
    const bypassCookie = request.cookies.get(BYPASS_COOKIE_NAME)?.value

    // Validate bypass token (from query or cookie)
    const hasValidBypass =
      validateBypassToken(bypassTokenFromQuery, MAINTENANCE_BYPASS_TOKEN) ||
      validateBypassToken(bypassCookie, MAINTENANCE_BYPASS_TOKEN)

    // If valid bypass token in query, set cookie and allow access
    if (
      bypassTokenFromQuery &&
      validateBypassToken(bypassTokenFromQuery, MAINTENANCE_BYPASS_TOKEN)
    ) {
      // Log successful bypass attempt
      const ip =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown'
      logBypassAttempt(true, { token: bypassTokenFromQuery, ip })

      // Continue to requested page, but set bypass cookie
      const response = NextResponse.next()
      response.cookies.set({
        name: BYPASS_COOKIE_NAME,
        value: bypassTokenFromQuery,
        maxAge: BYPASS_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })

      return response
    }

    // If no valid bypass, redirect to maintenance page
    if (!hasValidBypass) {
      // Log failed bypass attempt if token was provided
      if (bypassTokenFromQuery) {
        const ip =
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown'
        logBypassAttempt(false, { token: bypassTokenFromQuery, ip })
      }

      // Redirect to maintenance page
      const maintenanceUrl = new URL('/maintenance', request.url)
      return NextResponse.redirect(maintenanceUrl)
    }

    // Valid bypass exists - continue to requested page
    return NextResponse.next()
  }

  // ============================================================================
  // MDX BLOG FEATURE FLAG LOGIC (Temporary - remove after transition)
  // ============================================================================

  // Only apply to blog routes
  if (pathname.startsWith('/blog')) {
    // If MDX is disabled, show maintenance or redirect to Ghost
    if (!USE_MDX_BLOG) {
      // Option 1: Redirect to Ghost CMS (if hosted separately)
      // return NextResponse.redirect(new URL(`https://ghost.marcusgoll.com${pathname}`, request.url))

      // Option 2: Show maintenance message
      console.warn('⚠️ MDX blog is disabled via NEXT_PUBLIC_USE_MDX_BLOG flag')
      // Let the request continue (404 page will be shown if content doesn't exist)
    }
  }

  // Continue to requested page
  return NextResponse.next()
}

/**
 * Configure which routes to run middleware on
 *
 * Note: Excluded paths are handled via isExcludedPath() function:
 * - /_next/* (Next.js internals)
 * - /images/* (public images)
 * - /fonts/* (web fonts)
 * - /api/health (health check)
 * - /maintenance (maintenance page itself)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Note: Additional exclusions handled by isExcludedPath()
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
