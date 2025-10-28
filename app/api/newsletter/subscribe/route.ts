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
import {
  SubscribeRequestSchema,
  type NewsletterType,
} from '@/lib/newsletter/validation-schemas'
import { generateUnsubscribeToken } from '@/lib/newsletter/token-generator'
import { sendWelcomeEmail } from '@/lib/newsletter/email-service'

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
    // Parse and validate request body
    const body = await request.json()
    const validation = SubscribeRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors.map((err) => ({
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
    const subscriber = await prisma.$transaction(async (tx) => {
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
    ).catch((error) => {
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
  } catch (error) {
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
