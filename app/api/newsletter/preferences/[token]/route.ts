/**
 * Get newsletter preferences by token
 *
 * GET /api/newsletter/preferences/:token
 *
 * Purpose: Retrieve subscriber preferences for preference management page
 * Authentication: Token-based (no login required)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TokenParamSchema } from '@/lib/newsletter/validation-schemas'
import { checkRateLimit, getClientIp } from '@/lib/newsletter/rate-limiter'

/**
 * GET /api/newsletter/preferences/:token
 *
 * Response:
 * - success: boolean
 * - email: string
 * - preferences: { aviation, dev-startup, education, all }
 * - subscribedAt: string (ISO 8601)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    // Rate limiting: 5 requests per minute per IP (NFR-011)
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(clientIp, 5, 60000)

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // Await params (Next.js 15 requirement)
    const params = await context.params

    // Validate token format
    const tokenValidation = TokenParamSchema.safeParse(params.token)

    if (!tokenValidation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token format',
        },
        { status: 400 }
      )
    }

    const token = tokenValidation.data

    // Find subscriber by token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      include: {
        preferences: true,
      },
    })

    if (!subscriber) {
      return NextResponse.json(
        {
          success: false,
          message: 'Subscriber not found or invalid token',
        },
        { status: 404 }
      )
    }

    // Convert preferences array to object
    const preferencesObj = {
      aviation: false,
      'dev-startup': false,
      education: false,
      all: false,
    }

    subscriber.preferences.forEach((pref: { newsletterType: string; subscribed: boolean }) => {
      if (pref.newsletterType in preferencesObj) {
        preferencesObj[pref.newsletterType as keyof typeof preferencesObj] = pref.subscribed
      }
    })

    return NextResponse.json(
      {
        success: true,
        email: subscriber.email,
        preferences: preferencesObj,
        subscribedAt: subscriber.subscribedAt.toISOString(),
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('[Newsletter] Get preferences error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve preferences. Please try again later.',
      },
      { status: 500 }
    )
  }
}
