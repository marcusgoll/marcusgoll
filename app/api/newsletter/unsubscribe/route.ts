/**
 * Newsletter unsubscribe endpoint
 *
 * DELETE /api/newsletter/unsubscribe
 *
 * Purpose: Unsubscribe from all newsletters (soft delete) or permanently delete data (GDPR)
 * Features: Soft delete (active=false), hard delete (CASCADE), goodbye email
 * Idempotent: Returns success if already unsubscribed
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UnsubscribeSchema } from '@/lib/newsletter/validation-schemas'
import { sendGoodbyeEmail } from '@/lib/newsletter/email-service'

/**
 * DELETE /api/newsletter/unsubscribe
 *
 * Request body:
 * - token: string (64-char hex)
 * - hardDelete?: boolean (default: false)
 *
 * Response:
 * - success: boolean
 * - message: string
 */
export async function DELETE(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validation = UnsubscribeSchema.safeParse(body)

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

    const { token, hardDelete } = validation.data

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

    if (hardDelete) {
      // HARD DELETE (GDPR right to deletion)
      // Cascade delete removes all preferences automatically
      await prisma.newsletterSubscriber.delete({
        where: { id: subscriber.id },
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Your data has been permanently deleted',
        },
        { status: 200 }
      )
    } else {
      // SOFT DELETE (default)
      // Mark subscriber as inactive, set all preferences to false
      await prisma.$transaction([
        // Update subscriber status
        prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: {
            active: false,
            unsubscribedAt: new Date(),
          },
        }),
        // Set all preferences to false
        prisma.newsletterPreference.updateMany({
          where: { subscriberId: subscriber.id },
          data: {
            subscribed: false,
            updatedAt: new Date(),
          },
        }),
      ])

      // Send goodbye email asynchronously (only for soft delete)
      sendGoodbyeEmail(subscriber.email, subscriber.unsubscribeToken).catch(
        (error) => {
          console.error('[Newsletter] Failed to send goodbye email:', error)
        }
      )

      return NextResponse.json(
        {
          success: true,
          message: 'Successfully unsubscribed from all newsletters',
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('[Newsletter] Unsubscribe error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process unsubscribe. Please try again later.',
      },
      { status: 500 }
    )
  }
}
