/**
 * Next.js middleware for feature flag routing
 * Temporary during Ghost → MDX transition period
 * Remove after 7-14 day validation period
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Feature flag: Use MDX blog instead of Ghost CMS
 * Set to false to rollback to Ghost CMS
 */
const USE_MDX_BLOG = process.env.NEXT_PUBLIC_USE_MDX_BLOG !== 'false';

/**
 * Middleware function for feature flag routing
 * This is a temporary measure during the Ghost → MDX migration
 *
 * TODO: Remove this file after 7-14 day transition period
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to blog routes
  if (!pathname.startsWith('/blog')) {
    return NextResponse.next();
  }

  // If MDX is disabled, redirect to Ghost CMS or show maintenance message
  if (!USE_MDX_BLOG) {
    // Option 1: Redirect to Ghost CMS (if hosted separately)
    // return NextResponse.redirect(new URL(`https://ghost.marcusgoll.com${pathname}`, request.url));

    // Option 2: Show maintenance message
    console.warn('⚠️ MDX blog is disabled via NEXT_PUBLIC_USE_MDX_BLOG flag');
    // Let the request continue (404 page will be shown if content doesn't exist)
  }

  // Continue to MDX blog pages
  return NextResponse.next();
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
  matcher: [
    '/blog/:path*',
  ],
};
