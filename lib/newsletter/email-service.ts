/**
 * Email service abstraction for newsletter functionality
 *
 * Purpose: Centralized email sending with Resend integration
 * Supports: Welcome emails, preference updates, goodbye emails
 *
 * Configuration: Requires RESEND_API_KEY and NEWSLETTER_FROM_EMAIL in environment
 */

import { Resend } from 'resend'

/**
 * Email service result
 */
export interface EmailResult {
  success: boolean
  error?: string
  messageId?: string
}

/**
 * Newsletter types enum
 */
export type NewsletterType = 'aviation' | 'dev-startup' | 'education' | 'all'

/**
 * Newsletter type display names
 */
const NEWSLETTER_NAMES: Record<NewsletterType, string> = {
  aviation: 'Aviation',
  'dev-startup': 'Dev/Startup',
  education: 'Education',
  all: 'All Newsletters',
}

/**
 * Initialize Resend client
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn(
      '[Newsletter] RESEND_API_KEY not configured. Email sending disabled.'
    )
    return null
  }

  return new Resend(apiKey)
}

/**
 * Get newsletter FROM email address
 */
function getFromEmail(): string {
  return process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@marcusgoll.com'
}

/**
 * Get base URL for links
 */
function getBaseUrl(): string {
  return process.env.PUBLIC_URL || 'http://localhost:3000'
}

/**
 * Mask email for logging (PII protection)
 * Example: reader@example.com -> r***@example.com
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***@***'
  return `${local[0]}***@${domain}`
}

/**
 * Send welcome email to new subscriber
 *
 * @param email - Subscriber email address
 * @param subscribedNewsletters - Array of newsletter types subscribed to
 * @param unsubscribeToken - Secure token for preference management
 * @returns Email sending result
 */
export async function sendWelcomeEmail(
  email: string,
  subscribedNewsletters: NewsletterType[],
  unsubscribeToken: string
): Promise<EmailResult> {
  const resend = getResendClient()

  if (!resend) {
    return {
      success: false,
      error: 'Email service not configured (missing RESEND_API_KEY)',
    }
  }

  const baseUrl = getBaseUrl()
  const preferencesUrl = `${baseUrl}/newsletter/preferences/${unsubscribeToken}`
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${unsubscribeToken}`

  // Format newsletter list
  const newsletterList = subscribedNewsletters
    .map((type) => `• ${NEWSLETTER_NAMES[type]}`)
    .join('\n')

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to Marcus Gollahon's Newsletter!</h1>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Thanks for subscribing! You'll receive updates from the following newsletter tracks:
      </p>

      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p style="color: #333; font-size: 16px; margin: 0; white-space: pre-line;">${newsletterList}</p>
      </div>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        You can manage your preferences or unsubscribe at any time:
      </p>

      <div style="margin: 30px 0;">
        <a href="${preferencesUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Manage Preferences</a>
        <a href="${unsubscribeUrl}" style="display: inline-block; color: #666; padding: 12px 24px; text-decoration: none;">Unsubscribe</a>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

      <p style="color: #999; font-size: 14px; line-height: 1.6;">
        Marcus Gollahon | Aviation, Dev, Education, Startups<br />
        <a href="${baseUrl}" style="color: #0070f3; text-decoration: none;">marcusgoll.com</a>
      </p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: getFromEmail(),
      to: email,
      subject: "Welcome to Marcus Gollahon's Newsletter!",
      html: htmlContent,
    })

    console.log(
      `[Newsletter] Welcome email sent to ${maskEmail(email)} - Message ID: ${result.data?.id || 'unknown'}`
    )

    return {
      success: true,
      messageId: result.data?.id || undefined,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(
      `[Newsletter] Failed to send welcome email to ${maskEmail(email)}:`,
      errorMessage
    )

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Send preference update confirmation email
 *
 * @param email - Subscriber email address
 * @param updatedNewsletters - Array of newsletter types after update
 * @param unsubscribeToken - Secure token for preference management
 * @returns Email sending result
 */
export async function sendPreferenceUpdateEmail(
  email: string,
  updatedNewsletters: NewsletterType[],
  unsubscribeToken: string
): Promise<EmailResult> {
  const resend = getResendClient()

  if (!resend) {
    return {
      success: false,
      error: 'Email service not configured (missing RESEND_API_KEY)',
    }
  }

  const baseUrl = getBaseUrl()
  const preferencesUrl = `${baseUrl}/newsletter/preferences/${unsubscribeToken}`
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${unsubscribeToken}`

  // Format newsletter list
  const newsletterList = updatedNewsletters
    .map((type) => `• ${NEWSLETTER_NAMES[type]}`)
    .join('\n')

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Preferences Updated</h1>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Your newsletter preferences have been updated. You're now subscribed to:
      </p>

      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p style="color: #333; font-size: 16px; margin: 0; white-space: pre-line;">${newsletterList}</p>
      </div>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        You can update your preferences again or unsubscribe at any time:
      </p>

      <div style="margin: 30px 0;">
        <a href="${preferencesUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Manage Preferences</a>
        <a href="${unsubscribeUrl}" style="display: inline-block; color: #666; padding: 12px 24px; text-decoration: none;">Unsubscribe</a>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

      <p style="color: #999; font-size: 14px; line-height: 1.6;">
        Marcus Gollahon | Aviation, Dev, Education, Startups<br />
        <a href="${baseUrl}" style="color: #0070f3; text-decoration: none;">marcusgoll.com</a>
      </p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: getFromEmail(),
      to: email,
      subject: 'Newsletter Preferences Updated',
      html: htmlContent,
    })

    console.log(
      `[Newsletter] Preference update email sent to ${maskEmail(email)} - Message ID: ${result.data?.id || 'unknown'}`
    )

    return {
      success: true,
      messageId: result.data?.id || undefined,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(
      `[Newsletter] Failed to send preference update email to ${maskEmail(email)}:`,
      errorMessage
    )

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Send goodbye email after unsubscribe
 *
 * @param email - Subscriber email address
 * @param unsubscribeToken - Secure token (in case they want to re-subscribe)
 * @returns Email sending result
 */
export async function sendGoodbyeEmail(
  email: string,
  unsubscribeToken: string
): Promise<EmailResult> {
  const resend = getResendClient()

  if (!resend) {
    return {
      success: false,
      error: 'Email service not configured (missing RESEND_API_KEY)',
    }
  }

  const baseUrl = getBaseUrl()
  const resubscribeUrl = `${baseUrl}/newsletter/preferences/${unsubscribeToken}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Sorry to See You Go</h1>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        You've been unsubscribed from all newsletters. You won't receive any more emails from us.
      </p>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Changed your mind? You can re-subscribe anytime:
      </p>

      <div style="margin: 30px 0;">
        <a href="${resubscribeUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Re-subscribe</a>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

      <p style="color: #999; font-size: 14px; line-height: 1.6;">
        Marcus Gollahon | Aviation, Dev, Education, Startups<br />
        <a href="${baseUrl}" style="color: #0070f3; text-decoration: none;">marcusgoll.com</a>
      </p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: getFromEmail(),
      to: email,
      subject: "You've Been Unsubscribed",
      html: htmlContent,
    })

    console.log(
      `[Newsletter] Goodbye email sent to ${maskEmail(email)} - Message ID: ${result.data?.id || 'unknown'}`
    )

    return {
      success: true,
      messageId: result.data?.id || undefined,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(
      `[Newsletter] Failed to send goodbye email to ${maskEmail(email)}:`,
      errorMessage
    )

    return {
      success: false,
      error: errorMessage,
    }
  }
}
