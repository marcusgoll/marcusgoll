'use client'

/**
 * Inline Newsletter CTA Component (Post-inline Variant)
 *
 * Purpose: Context-aware newsletter signup after blog posts
 * Features: Dynamic headline based on post tags, benefit bullets, multi-track selection
 * Usage: <InlineNewsletterCTA postTags={['aviation', 'dev']} /> in blog post pages
 */

import { NewsletterSignupForm } from './NewsletterSignupForm'

interface InlineNewsletterCTAProps {
  /**
   * Post tags for context-aware messaging
   */
  postTags?: string[]
}

/**
 * Generate context-aware headline based on post tags
 */
function getContextualHeadline(tags: string[] = []): string {
  const hasAviation = tags.some(tag =>
    tag.toLowerCase().includes('aviation') ||
    tag.toLowerCase().includes('flight') ||
    tag.toLowerCase().includes('pilot')
  )

  const hasDev = tags.some(tag =>
    tag.toLowerCase().includes('dev') ||
    tag.toLowerCase().includes('code') ||
    tag.toLowerCase().includes('startup') ||
    tag.toLowerCase().includes('tech')
  )

  const hasEducation = tags.some(tag =>
    tag.toLowerCase().includes('education') ||
    tag.toLowerCase().includes('teaching') ||
    tag.toLowerCase().includes('learning')
  )

  // Multi-track posts
  if ((hasAviation && hasDev) || (hasAviation && hasEducation) || (hasDev && hasEducation)) {
    return "Enjoyed this post? Get more dual-track insights in your inbox."
  }

  // Single-track posts
  if (hasAviation) {
    return "Enjoyed this aviation post? Get more like it in your inbox."
  }
  if (hasDev) {
    return "Enjoyed this dev post? Get more like it in your inbox."
  }
  if (hasEducation) {
    return "Enjoyed this education post? Get more like it in your inbox."
  }

  // Default for general posts
  return "Want more insights like this? Subscribe to the newsletter."
}

const BENEFITS = [
  "Systematic thinking applied to aviation and software",
  "Dual-track content: Aviation + Dev/Startup insights",
  "Teaching quality you'd expect from a CFI",
  "Building in public - real lessons from the trenches",
]

export function InlineNewsletterCTA({ postTags = [] }: InlineNewsletterCTAProps) {
  const headline = getContextualHeadline(postTags)

  return (
    <div className="inline-newsletter-cta my-12 p-8 rounded-lg bg-gradient-to-r from-navy-900 to-emerald-600 text-white">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">{headline}</h3>

        <ul className="mb-6 space-y-2">
          {BENEFITS.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>

        <NewsletterSignupForm
          variant="inline"
          source="post-inline"
          className="newsletter-inline-form"
        />

        <p className="text-xs text-gray-300 text-center mt-4">
          Unsubscribe anytime. No spam, ever.
        </p>
      </div>
    </div>
  )
}
