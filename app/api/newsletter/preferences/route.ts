/**
 * Update newsletter preferences
 *
 * PATCH /api/newsletter/preferences
 *
 * Purpose: Update subscriber's newsletter preferences
 * Validation: At least 1 preference must remain true
 * Email: Sends confirmation email after update
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  PreferenceUpdateSchema,
  type NewsletterType,
} from '@/lib/newsletter/validation-schemas'
import { sendPreferenceUpdateEmail } from '@/lib/newsletter/email-service'

/**
 * PATCH /api/newsletter/preferences
 *
 * Request body:
 * - token: string (64-char hex)
 * - preferences: { aviation, dev-startup, education, all }
 *
 * Response:
 * - success: boolean
 * - message: string
 */
export async function PATCH(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validation = PreferenceUpdateSchema.safeParse(body)

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

    const { token, preferences } = validation.data

    // Find subscriber by token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
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

    // Update preferences (upsert pattern)
    const newsletterTypes: NewsletterType[] = [
      'aviation',
      'dev-startup',
      'education',
      'all',
    ]

    await prisma.$transaction(
      newsletterTypes.map((type) =>
        prisma.newsletterPreference.upsert({
          where: {
            subscriberId_newsletterType: {
              subscriberId: subscriber.id,
              newsletterType: type,
            },
          },
          update: {
            subscribed: preferences[type],
            updatedAt: new Date(),
          },
          create: {
            subscriberId: subscriber.id,
            newsletterType: type,
            subscribed: preferences[type],
          },
        })
      )
    )

    // Get subscribed newsletters for confirmation email
    const subscribedNewsletters = newsletterTypes.filter((type) => preferences[type])

    // Send confirmation email asynchronously
    sendPreferenceUpdateEmail(
      subscriber.email,
      subscribedNewsletters,
      subscriber.unsubscribeToken
    ).catch((error) => {
      console.error('[Newsletter] Failed to send preference update email:', error)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Preferences updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Newsletter] Update preferences error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update preferences. Please try again later.',
      },
      { status: 500 }
    )
  }
}
