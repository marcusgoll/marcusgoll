/**
 * Secure token generator for newsletter unsubscribe links
 *
 * Purpose: Generate cryptographically secure 64-character hex tokens
 * for preference management and unsubscribe functionality.
 *
 * Security: Uses Node.js crypto.randomBytes (256-bit entropy)
 */

import { randomBytes } from 'crypto'

/**
 * Generate secure unsubscribe token
 *
 * @returns 64-character hex string (32 random bytes)
 * @example "a3f5b8c7d2e1f4a6b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1"
 */
export function generateUnsubscribeToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Validate token format
 *
 * @param token - Token string to validate
 * @returns true if token is 64-character hex string
 */
export function isValidTokenFormat(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token)
}
