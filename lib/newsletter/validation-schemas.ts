/**
 * Zod validation schemas for newsletter API requests
 *
 * Purpose: Type-safe request validation with clear error messages
 * Used by: All newsletter API routes (/subscribe, /preferences, /unsubscribe)
 */

import { z } from 'zod'

/**
 * Newsletter type enum schema
 */
export const NewsletterTypeSchema = z.enum([
  'aviation',
  'dev-startup',
  'education',
  'all',
])

export type NewsletterType = z.infer<typeof NewsletterTypeSchema>

/**
 * Subscribe request schema (POST /api/newsletter/subscribe)
 */
export const SubscribeRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email format. Please provide a valid email address.'),
  newsletterTypes: z
    .array(NewsletterTypeSchema)
    .min(1, 'At least one newsletter type must be selected.')
    .max(4, 'Maximum 4 newsletter types can be selected.'),
  source: z
    .string()
    .max(50, 'Source must be 50 characters or less.')
    .optional()
    .nullable(),
})

export type SubscribeRequest = z.infer<typeof SubscribeRequestSchema>

/**
 * Preference update schema (PATCH /api/newsletter/preferences)
 */
export const PreferenceUpdateSchema = z
  .object({
    token: z
      .string()
      .length(64, 'Invalid token format. Token must be 64 characters.')
      .regex(
        /^[a-f0-9]{64}$/i,
        'Invalid token format. Token must be a 64-character hex string.'
      ),
    preferences: z.object({
      aviation: z.boolean(),
      'dev-startup': z.boolean(),
      education: z.boolean(),
      all: z.boolean(),
    }),
  })
  .refine(
    (data) => {
      // At least one preference must be true
      const { aviation, 'dev-startup': devStartup, education, all } = data.preferences
      return aviation || devStartup || education || all
    },
    {
      message:
        'At least one newsletter must be selected. Use the unsubscribe link to unsubscribe from all newsletters.',
      path: ['preferences'],
    }
  )

export type PreferenceUpdate = z.infer<typeof PreferenceUpdateSchema>

/**
 * Unsubscribe request schema (DELETE /api/newsletter/unsubscribe)
 */
export const UnsubscribeSchema = z.object({
  token: z
    .string()
    .length(64, 'Invalid token format. Token must be 64 characters.')
    .regex(
      /^[a-f0-9]{64}$/i,
      'Invalid token format. Token must be a 64-character hex string.'
    ),
  hardDelete: z.boolean().optional().default(false),
})

export type UnsubscribeRequest = z.infer<typeof UnsubscribeSchema>

/**
 * Token parameter schema (GET /api/newsletter/preferences/:token)
 */
export const TokenParamSchema = z
  .string()
  .length(64, 'Invalid token format. Token must be 64 characters.')
  .regex(
    /^[a-f0-9]{64}$/i,
    'Invalid token format. Token must be a 64-character hex string.'
  )
