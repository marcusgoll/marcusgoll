/**
 * Newsletter subscription endpoint
 *
 * POST /api/newsletter/subscribe
 *
 * Purpose: Create or update newsletter subscriber with granular preferences
 * Features: Upsert logic, atomic transaction, background email sending
 * Performance: <2s response time (NFR-002)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import {
  SubscribeRequestSchema,
  type NewsletterType,
} from '@/lib/newsletter/validation-schemas'
import { generateUnsubscribeToken } from '@/lib/newsletter/token-generator'
import { sendWelcomeEmail } from '@/lib/newsletter/email-service'
import { checkRateLimit, getClientIp } from '@/lib/newsletter/rate-limiter'

/**
 * POST /api/newsletter/subscribe
 *
 * Request body:
 * - email: string (email format)
 * - newsletterTypes: NewsletterType[] (min 1, max 4)
 * - source?: string (optional, max 50 chars)
 *
 * Response:
 * - success: boolean
 * - message: string
 * - unsubscribeToken: string (64-char hex)
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validation = SubscribeRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    const { email, newsletterTypes, source } = validation.data

    // Generate unsubscribe token (64-char hex)
    const unsubscribeToken = generateUnsubscribeToken()

    // Upsert subscriber and update preferences (atomic transaction)
    const subscriber = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Upsert subscriber (create if new, update if existing)
      const sub = await tx.newsletterSubscriber.upsert({
        where: { email },
        update: {
          active: true,
          unsubscribedAt: null, // Clear unsubscribe date if re-subscribing
          source: source || undefined,
          updatedAt: new Date(),
        },
        create: {
          email,
          active: true,
          subscribedAt: new Date(),
          unsubscribeToken,
          source: source || undefined,
        },
      })

      // Delete existing preferences (for clean slate on re-subscribe)
      await tx.newsletterPreference.deleteMany({
        where: { subscriberId: sub.id },
      })

      // Create new preferences for selected newsletters
      await tx.newsletterPreference.createMany({
        data: newsletterTypes.map((type) => ({
          subscriberId: sub.id,
          newsletterType: type,
          subscribed: true,
        })),
      })

      return sub
    })

    // Send welcome email asynchronously (don't block response)
    // Fire-and-forget pattern for <2s response time
    sendWelcomeEmail(
      email,
      newsletterTypes as NewsletterType[],
      subscriber.unsubscribeToken
    ).catch((error: unknown) => {
      console.error('[Newsletter] Failed to send welcome email:', error)
      // Don't throw - email failure shouldn't break subscription
    })

    // Format success message
    const newsletterNames = newsletterTypes
      .map((type) => {
        switch (type) {
          case 'aviation':
            return 'Aviation'
          case 'dev-startup':
            return 'Dev/Startup'
          case 'education':
            return 'Education'
          case 'all':
            return 'All Newsletters'
        }
      })
      .join(', ')

    return NextResponse.json(
      {
        success: true,
        message: `Successfully subscribed to ${newsletterNames}!`,
        unsubscribeToken: subscriber.unsubscribeToken,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('[Newsletter] Subscription error:', error)

    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to process subscription. Please try again later.',
      },
      { status: 500 }
    )
  }
}
