'use client'

/**
 * Newsletter signup form component
 *
 * Purpose: Multi-track newsletter subscription with client-side validation
 * Features: 4 newsletter types (aviation, dev-startup, education, all), error handling, success states
 * Validation: Email format, at least 1 newsletter selected
 */

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { NewsletterType } from '@/lib/newsletter/validation-schemas'

interface NewsletterSignupFormProps {
  /**
   * Signup source for analytics (default: 'form')
   */
  source?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Form variant for different placement contexts
   * - compact: Single-line layout, minimal spacing, hides newsletter type checkboxes (defaults to 'all')
   * - inline: Shows all checkboxes, optional headline, prominent CTA
   * - comprehensive: Full-featured form with all options (default)
   */
  variant?: 'compact' | 'inline' | 'comprehensive'
  /**
   * Optional headline for inline variant
   */
  headline?: string
}

interface FormState {
  email: string
  newsletterTypes: NewsletterType[]
  loading: boolean
  error: string | null
  success: boolean
}

const NEWSLETTER_OPTIONS: { value: NewsletterType; label: string; description: string }[] = [
  {
    value: 'aviation',
    label: 'Aviation',
    description: 'Aviation adventures, CFI insights, and pilot stories',
  },
  {
    value: 'dev-startup',
    label: 'Dev/Startup',
    description: 'Software development, startup lessons, and tech insights',
  },
  {
    value: 'education',
    label: 'Education',
    description: 'Teaching strategies, learning frameworks, and education thoughts',
  },
  {
    value: 'all',
    label: 'All Content',
    description: 'Get everything - aviation, dev, education, and more',
  },
]

export function NewsletterSignupForm({
  source = 'form',
  className = '',
  variant = 'comprehensive',
  headline
}: NewsletterSignupFormProps) {
  const [state, setState] = useState<FormState>({
    email: '',
    newsletterTypes: variant === 'compact' ? ['all'] : [],
    loading: false,
    error: null,
    success: false,
  })

  const handleCheckboxChange = (type: NewsletterType) => {
    setState((prev) => {
      const isSelected = prev.newsletterTypes.includes(type)
      const newTypes = isSelected
        ? prev.newsletterTypes.filter((t) => t !== type)
        : [...prev.newsletterTypes, type]

      return { ...prev, newsletterTypes: newTypes, error: null }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset state
    setState((prev) => ({ ...prev, error: null, loading: true }))

    // Client-side validation
    if (!state.email) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter your email address.',
        loading: false,
      }))
      return
    }

    if (!state.email.includes('@')) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a valid email address.',
        loading: false,
      }))
      return
    }

    // Skip validation for compact variant (defaults to 'all')
    if (variant !== 'compact' && state.newsletterTypes.length === 0) {
      setState((prev) => ({
        ...prev,
        error: 'Please select at least one newsletter.',
        loading: false,
      }))
      return
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email,
          newsletterTypes: state.newsletterTypes,
          source,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Subscription failed')
      }

      // Success!
      setState({
        email: '',
        newsletterTypes: [],
        loading: false,
        error: null,
        success: true,
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, success: false }))
      }, 5000)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to subscribe. Please try again.',
        loading: false,
      }))
    }
  }

  // Compact variant: Single-line layout
  if (variant === 'compact') {
    return (
      <div className={`newsletter-signup-form-compact ${className}`}>
        {state.success ? (
          <div className="text-sm text-green-600">
            Successfully subscribed! Check your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              id="email-compact"
              name="email"
              value={state.email}
              onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              disabled={state.loading}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-label="Email address"
            />
            <Button
              type="submit"
              disabled={state.loading}
              className="whitespace-nowrap"
            >
              {state.loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
            {state.error && (
              <p className="text-xs text-red-600 mt-1 w-full">{state.error}</p>
            )}
          </form>
        )}
      </div>
    )
  }

  // Inline variant: With optional headline
  if (variant === 'inline') {
    return (
      <div className={`newsletter-signup-form-inline ${className}`}>
        {headline && (
          <h3 className="text-xl font-semibold mb-4">{headline}</h3>
        )}
        {state.success ? (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-green-700 font-medium">
              Successfully subscribed! Check your email for a welcome message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                id="email-inline"
                name="email"
                value={state.email}
                onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                disabled={state.loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                required
                aria-label="Email address"
              />
            </div>

            <div className="space-y-2">
              {NEWSLETTER_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={state.newsletterTypes.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                    disabled={state.loading}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium group-hover:text-emerald-600 transition-colors">
                      {option.label}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {state.error && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={state.loading}
              className="w-full"
            >
              {state.loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
      </div>
    )
  }

  // Comprehensive variant: Full-featured form (default)
  return (
    <div className={`newsletter-signup-form ${className}`}>
      {state.success ? (
        <div className="rounded-lg bg-green-50 p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Successfully subscribed!</h3>
          <p className="text-green-700">
            Check your email for a welcome message with a link to manage your preferences.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={state.email}
              onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
              disabled={state.loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Select newsletters</label>
            <div className="space-y-3">
              {NEWSLETTER_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={state.newsletterTypes.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                    disabled={state.loading}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium group-hover:text-emerald-600 transition-colors">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {state.error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={state.loading}
            className="w-full"
          >
            {state.loading ? 'Subscribing...' : 'Subscribe'}
          </Button>

          <p className="text-xs text-gray-600 text-center">
            You can unsubscribe anytime. No spam, ever.
          </p>
        </form>
      )}
    </div>
  )
}
