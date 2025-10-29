/**
 * Contact form API endpoint
 *
 * POST /api/contact
 *
 * Purpose: Handle contact form submissions with spam protection
 * Features: Turnstile verification, honeypot check, dual email sending (admin + auto-reply)
 * Security: Rate limiting, input validation, XSS protection
 */

import { NextRequest, NextResponse } from 'next/server'
import { ContactFormSchema } from '@/lib/contact/validation-schema'
import { verifyTurnstileToken } from '@/lib/contact/turnstile-verifier'
import {
  getAdminNotificationEmail,
  getAutoReplyEmail,
} from '@/lib/contact/email-templates'
import { checkRateLimit, getClientIp } from '@/lib/newsletter/rate-limiter'
import { Resend } from 'resend'

/**
 * Initialize Resend client
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('[Contact] RESEND_API_KEY not configured. Email sending disabled.')
    return null
  }

  return new Resend(apiKey)
}

/**
 * Get newsletter FROM email address (reuse for contact form)
 */
function getFromEmail(): string {
  return process.env.NEWSLETTER_FROM_EMAIL || 'noreply@marcusgoll.com'
}

/**
 * Get admin email address
 */
function getAdminEmail(): string {
  return process.env.CONTACT_ADMIN_EMAIL || 'admin@marcusgoll.com'
}

/**
 * POST /api/contact
 *
 * Request body:
 * - name: string (1-100 chars)
 * - email: string (valid email format)
 * - subject: ContactSubject enum (one of 6 options)
 * - message: string (500-10,000 chars)
 * - turnstileToken: string (from Turnstile challenge)
 * - honeypot: string (must be empty)
 *
 * Response:
 * - success: boolean
 * - message: string
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Extract client IP for rate limiting and Turnstile verification
    const clientIp = getClientIp(request)

    // 2. Rate limiting: 3 submissions per 15 minutes per IP (spec NFR-004)
    const rateLimit = checkRateLimit(clientIp, 3, 900000) // 15 min = 900,000 ms

    if (!rateLimit.success) {
      const retryAfterSeconds = Math.ceil((rateLimit.reset - Date.now()) / 1000)
      const retryAfterMinutes = Math.ceil(retryAfterSeconds / 60)

      return NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please try again in ${retryAfterMinutes} minute${retryAfterMinutes !== 1 ? 's' : ''}.`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
            'Retry-After': retryAfterSeconds.toString(),
          },
        }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()
    const validation = ContactFormSchema.safeParse(body)

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

    const { name, email, subject, message, turnstileToken, honeypot } = validation.data

    // 4. Honeypot check (anti-spam)
    if (honeypot && honeypot.length > 0) {
      // Silently reject bot submissions (don't reveal anti-spam mechanism)
      console.warn(`[Contact] Honeypot triggered from IP: ${clientIp}`)
      return NextResponse.json(
        {
          success: false,
          message: 'An error occurred. Please try again.',
        },
        { status: 400 }
      )
    }

    // 5. Verify Turnstile token
    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp)

    if (!turnstileResult.success) {
      console.warn(`[Contact] Turnstile verification failed from IP: ${clientIp}`, {
        error: turnstileResult.error,
      })

      return NextResponse.json(
        {
          success: false,
          message: 'Security verification failed. Please refresh and try again.',
        },
        { status: 400 }
      )
    }

    // 6. Initialize Resend client
    const resend = getResendClient()

    if (!resend) {
      console.error('[Contact] Resend not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'Email service unavailable. Please try again later.',
        },
        { status: 500 }
      )
    }

    // 7. Send admin notification email (blocking - critical)
    const adminEmail = getAdminNotificationEmail({ name, email, subject, message, turnstileToken, honeypot: '' })
    const fromEmail = getFromEmail()
    const toEmail = getAdminEmail()

    try {
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email, // Reply-to sender for easy responses
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      })

      console.log(`[Contact] Admin notification sent to ${toEmail}`)
    } catch (error) {
      console.error('[Contact] Failed to send admin notification:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send message. Please try again later.',
        },
        { status: 500 }
      )
    }

    // 8. Send auto-reply email (fire-and-forget - non-critical)
    const autoReply = getAutoReplyEmail(name)

    resend.emails
      .send({
        from: `Marcus Gollahon <${fromEmail}>`,
        to: email,
        subject: autoReply.subject,
        html: autoReply.html,
        text: autoReply.text,
      })
      .then(() => {
        console.log(`[Contact] Auto-reply sent to ${email}`)
      })
      .catch((error) => {
        console.error('[Contact] Failed to send auto-reply (non-critical):', error)
        // Don't throw - auto-reply failure shouldn't break the submission
      })

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! I\'ll respond within 24-48 hours.',
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('[Contact] Submission error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}
