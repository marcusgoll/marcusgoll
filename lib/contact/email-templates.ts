/**
 * Email templates for contact form
 *
 * Purpose: Generate HTML and plain text emails for:
 * 1. Admin notification (Marcus receives contact form submission)
 * 2. Auto-reply (sender receives confirmation)
 *
 * Pattern: Follows lib/newsletter/email-service.ts structure
 */

import { ContactFormData } from './validation-schema'

/**
 * Email template result
 */
export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Get base URL for email links
 */
function getBaseUrl(): string {
  return process.env.PUBLIC_URL || 'http://localhost:3000'
}

/**
 * Generate admin notification email
 *
 * Sent to CONTACT_ADMIN_EMAIL when a new contact form is submitted
 *
 * @param data - Validated contact form data
 * @returns Email template with subject, HTML, and text
 */
export function getAdminNotificationEmail(
  data: ContactFormData
): EmailTemplate {
  const { name, email, subject, message } = data
  const baseUrl = getBaseUrl()

  // Email subject line
  const emailSubject = `[Contact Form] ${subject} - ${name}`

  // HTML email body
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #667eea;">Sender Information</h2>
      <p style="margin: 8px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #667eea; text-decoration: none;">${escapeHtml(email)}</a></p>
      <p style="margin: 8px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #764ba2;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #764ba2;">Message</h2>
      <div style="white-space: pre-wrap; word-wrap: break-word; color: #4b5563;">${escapeHtml(message)}</div>
    </div>

    <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Reply-To:</strong> When you reply to this email, it will go directly to ${escapeHtml(email)}
      </p>
    </div>
  </div>

  <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>This message was sent via the contact form at <a href="${baseUrl}/contact" style="color: #667eea; text-decoration: none;">${baseUrl}/contact</a></p>
  </div>
</body>
</html>
  `.trim()

  // Plain text email body (for email clients that don't support HTML)
  const text = `
NEW CONTACT FORM SUBMISSION
═══════════════════════════

SENDER INFORMATION
------------------
Name: ${name}
Email: ${email}
Subject: ${subject}

MESSAGE
-------
${message}

═══════════════════════════
Reply-To: ${email}
Submitted via: ${baseUrl}/contact
  `.trim()

  return {
    subject: emailSubject,
    html,
    text,
  }
}

/**
 * Generate auto-reply email
 *
 * Sent to the form submitter to confirm receipt of their message
 *
 * @param senderName - Name of the person who submitted the form
 * @returns Email template with subject, HTML, and text
 */
export function getAutoReplyEmail(senderName: string): EmailTemplate {
  const baseUrl = getBaseUrl()

  // Email subject line
  const emailSubject = 'Message received - Marcus Gollahon'

  // HTML email body
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Message Received!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <p style="font-size: 16px; margin: 0 0 15px 0;">Hi ${escapeHtml(senderName)},</p>

      <p style="font-size: 16px; margin: 0 0 15px 0;">Thanks for reaching out! I've received your message and will respond within <strong>24-48 hours</strong>.</p>

      <p style="font-size: 16px; margin: 0 0 15px 0;">If your message is time-sensitive or urgent, please note that in your original message and I'll prioritize accordingly.</p>

      <div style="margin: 25px 0; padding: 20px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #667eea;">
        <p style="margin: 0; font-size: 14px; color: #4b5563;">
          <strong>What happens next?</strong><br/>
          I personally review and respond to every message. You'll hear back from me directly at the email address you provided.
        </p>
      </div>

      <p style="font-size: 16px; margin: 0 0 15px 0;">In the meantime, feel free to explore:</p>

      <ul style="font-size: 16px; margin: 0 0 15px 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;"><a href="${baseUrl}/blog" style="color: #667eea; text-decoration: none;">Blog</a> - Aviation and dev/startup insights</li>
        <li style="margin-bottom: 8px;"><a href="${baseUrl}/about" style="color: #667eea; text-decoration: none;">About</a> - My background and expertise</li>
        <li style="margin-bottom: 8px;"><a href="${baseUrl}/newsletter" style="color: #667eea; text-decoration: none;">Newsletter</a> - Stay updated on my latest work</li>
      </ul>

      <p style="font-size: 16px; margin: 20px 0 0 0;">
        Best regards,<br/>
        <strong>Marcus Gollahon</strong><br/>
        <span style="color: #9ca3af; font-size: 14px;">Aviation Professional | Developer | Educator</span>
      </p>
    </div>

    <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Note:</strong> This is an automated confirmation. Please do not reply to this email - I'll respond to your original message from my personal email.
      </p>
    </div>
  </div>

  <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>
      <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">marcusgoll.com</a> |
      <a href="${baseUrl}/contact" style="color: #667eea; text-decoration: none;">Contact</a>
    </p>
  </div>
</body>
</html>
  `.trim()

  // Plain text email body
  const text = `
MESSAGE RECEIVED
════════════════

Hi ${senderName},

Thanks for reaching out! I've received your message and will respond within 24-48 hours.

If your message is time-sensitive or urgent, please note that in your original message and I'll prioritize accordingly.

WHAT HAPPENS NEXT?
I personally review and respond to every message. You'll hear back from me directly at the email address you provided.

In the meantime, feel free to explore:
- Blog: ${baseUrl}/blog - Aviation and dev/startup insights
- About: ${baseUrl}/about - My background and expertise
- Newsletter: ${baseUrl}/newsletter - Stay updated on my latest work

Best regards,
Marcus Gollahon
Aviation Professional | Developer | Educator

════════════════
Note: This is an automated confirmation. Please do not reply to this email - I'll respond to your original message from my personal email.

${baseUrl}
  `.trim()

  return {
    subject: emailSubject,
    html,
    text,
  }
}

/**
 * Escape HTML to prevent XSS attacks in email content
 *
 * @param unsafe - Potentially unsafe string from user input
 * @returns HTML-escaped string safe for rendering
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
