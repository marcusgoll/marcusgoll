'use client'

/**
 * Compact Newsletter Signup Component (Footer Variant)
 *
 * Purpose: Minimal newsletter signup form for footer placement
 * Features: Single-line layout, email-only input, defaults to 'all' newsletter types
 * Usage: <CompactNewsletterSignup /> in Footer component
 */

import { NewsletterSignupForm } from './NewsletterSignupForm'

export function CompactNewsletterSignup() {
  return (
    <div className="compact-newsletter-signup">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white mb-1">Stay Updated</h3>
        <p className="text-xs text-[var(--text-muted)]">
          Get aviation, dev, and education insights delivered to your inbox.
        </p>
      </div>
      <NewsletterSignupForm
        variant="compact"
        source="footer"
        className="newsletter-footer-form"
      />
    </div>
  )
}
