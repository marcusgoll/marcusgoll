/**
 * Zod validation schemas for contact form API requests
 *
 * Purpose: Type-safe contact form validation with clear error messages
 * Used by: /api/contact route and ContactForm component
 */

import { z } from 'zod'

/**
 * Subject dropdown options enum
 */
export const ContactSubjectSchema = z.enum([
  'General Inquiry',
  'Aviation Consulting',
  'Dev/Startup Collaboration',
  'CFI Training Resources',
  'Speaking/Workshop Request',
  'Other',
])

export type ContactSubject = z.infer<typeof ContactSubjectSchema>

/**
 * Contact form submission schema
 *
 * Requirements:
 * - Name: 1-100 characters (required)
 * - Email: Valid email format (required)
 * - Subject: One of predefined options (required)
 * - Message: 500-10,000 characters (required, prevents low-effort spam)
 * - Turnstile token: Required for spam protection
 * - Honeypot: Must be empty (anti-spam, bots fill hidden fields)
 */
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .max(100, 'Name must be 100 characters or less.'),
  email: z
    .string()
    .email('Invalid email format. Please provide a valid email address.'),
  subject: ContactSubjectSchema,
  message: z
    .string()
    .min(500, 'Message must be at least 500 characters.')
    .max(10000, 'Message must be 10,000 characters or less.'),
  turnstileToken: z.string().min(1, 'Security verification is required.'),
  honeypot: z
    .string()
    .max(0, 'Invalid submission.') // Must be empty - bots fill this
    .optional()
    .default(''),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

/**
 * Validation helpers
 */
export const VALIDATION = {
  NAME_MAX: 100,
  MESSAGE_MIN: 500,
  MESSAGE_MAX: 10000,
  HONEYPOT_FIELD_NAME: 'website', // Bot-attracting field name
} as const
