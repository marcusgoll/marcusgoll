/**
 * Next.js Edge Middleware: HTTPS Redirect & Maintenance Mode
 *
 * Purpose: Global request interception for HTTPS enforcement and maintenance mode
 * Runtime: Edge Runtime (Vercel Edge Functions)
 * Performance: <10ms overhead per request
 *
 * Flow:
 * 0. Force HTTPS redirect (production only)
 * 1. Check if path excluded (static assets, health checks)
 * 2. Check if maintenance mode enabled
 * 3. Check for bypass cookie
 * 4. Check for bypass query parameter
 * 5. Validate token and set cookie
 * 6. Redirect to maintenance page or allow access
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  isExcludedPath,
  validateBypassToken,
  logBypassAttempt,
} from '@/lib/maintenance-utils'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // ============================================================================
  // Step 0: Force HTTPS redirect (production only)
  // ============================================================================

  // Check if request is HTTP and in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') === 'http'
  ) {
    // Create HTTPS URL
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = 'https:'

    // Permanent redirect (308) to HTTPS
    return NextResponse.redirect(httpsUrl, 308)
  }

  // ============================================================================
  // Step 1: Exclude static assets and health checks (skip all maintenance logic)
  // ============================================================================

  if (isExcludedPath(pathname)) {
    return NextResponse.next()
  }

  // ============================================================================
  // Step 2: Check if maintenance mode is enabled
  // ============================================================================

  const maintenanceMode = process.env.MAINTENANCE_MODE?.toLowerCase()

  // If maintenance mode is disabled or unset, allow all traffic
  if (maintenanceMode !== 'true') {
    return NextResponse.next()
  }

  // ============================================================================
  // Step 3: Check for existing bypass cookie
  // ============================================================================

  const bypassCookie = request.cookies.get('maintenance_bypass')

  if (bypassCookie?.value === 'true') {
    // Developer has valid bypass cookie, allow access
    return NextResponse.next()
  }

  // ============================================================================
  // Step 4: Check for bypass query parameter
  // ============================================================================

  const bypassToken = request.nextUrl.searchParams.get('bypass')

  if (bypassToken) {
    const envToken = process.env.MAINTENANCE_BYPASS_TOKEN

    // Validate bypass token
    if (validateBypassToken(bypassToken, envToken)) {
      // Token is valid - set bypass cookie and redirect to clean URL
      logBypassAttempt(true, { token: bypassToken })

      // Create clean URL (remove bypass parameter)
      const cleanUrl = new URL(request.url)
      cleanUrl.searchParams.delete('bypass')

      // Create response with redirect
      const response = NextResponse.redirect(cleanUrl)

      // Set secure bypass cookie (24-hour expiration)
      response.cookies.set('maintenance_bypass', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 86400, // 24 hours in seconds
      })

      return response
    } else {
      // Token is invalid - log failed attempt
      const ip = request.headers.get('x-forwarded-for') || 'unknown'
      logBypassAttempt(false, {
        token: bypassToken,
        ip: ip,
      })
    }
  }

  // ============================================================================
  // Step 5: Redirect to maintenance page
  // ============================================================================

  // No bypass cookie and no valid bypass token - redirect to maintenance page
  // Unless already on maintenance page (prevent infinite loop)
  if (pathname === '/maintenance') {
    return NextResponse.next()
  }

  const maintenanceUrl = new URL('/maintenance', request.url)
  return NextResponse.redirect(maintenanceUrl)
}

/**
 * Middleware configuration
 *
 * Matcher: Apply middleware to all routes except:
 * - /_next/* (Next.js internals)
 * - /api/* (API routes - handled separately if needed)
 * - Static files with extensions (.png, .jpg, .ico, etc.)
 *
 * Note: Excluded paths are also checked in isExcludedPath() for defense in depth
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     * - Files with extensions (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)',
  ],
}
