'use client'

/**
 * Newsletter preference management page
 *
 * Purpose: Allow subscribers to update newsletter preferences via secure token
 * Features: Token-based auth, real-time preference updates, confirmation email
 * Route: /newsletter/preferences/:token
 */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface PreferenceState {
  loading: boolean
  error: string | null
  email: string | null
  preferences: {
    aviation: boolean
    'dev-startup': boolean
    education: boolean
    all: boolean
  }
  subscribedAt: string | null
  updating: boolean
  success: boolean
}

const NEWSLETTER_OPTIONS: { value: keyof PreferenceState['preferences']; label: string; description: string }[] = [
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

export default function NewsletterPreferencesPage() {
  const params = useParams()
  const token = params.token as string

  const [state, setState] = useState<PreferenceState>({
    loading: true,
    error: null,
    email: null,
    preferences: {
      aviation: false,
      'dev-startup': false,
      education: false,
      all: false,
    },
    subscribedAt: null,
    updating: false,
    success: false,
  })

  // Fetch current preferences on mount
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await fetch(`/api/newsletter/preferences/${token}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load preferences')
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          email: data.email,
          preferences: data.preferences,
          subscribedAt: data.subscribedAt,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load preferences',
        }))
      }
    }

    if (token) {
      fetchPreferences()
    }
  }, [token])

  const handleCheckboxChange = (type: keyof PreferenceState['preferences']) => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: !prev.preferences[type],
      },
      error: null,
      success: false,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate at least 1 preference selected
    const hasSelection = Object.values(state.preferences).some((value) => value)

    if (!hasSelection) {
      setState((prev) => ({
        ...prev,
        error: 'At least one newsletter must be selected. Use the unsubscribe link to unsubscribe from all.',
      }))
      return
    }

    setState((prev) => ({ ...prev, updating: true, error: null }))

    try {
      const response = await fetch('/api/newsletter/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          preferences: state.preferences,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update preferences')
      }

      setState((prev) => ({
        ...prev,
        updating: false,
        success: true,
      }))

      // Reset success message after 5 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, success: false }))
      }, 5000)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        updating: false,
        error: error instanceof Error ? error.message : 'Failed to update preferences',
      }))
    }
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (state.error && !state.email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="rounded-lg bg-red-50 p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">{state.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Newsletter Preferences</h1>
        <p className="text-gray-600 mb-8">
          Manage your newsletter subscriptions for {state.email}
        </p>

        {state.success && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200 mb-6">
            <p className="text-sm text-green-700">
              Preferences updated successfully! You&apos;ll receive a confirmation email.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4 mb-6">
            {NEWSLETTER_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={state.preferences[option.value]}
                  onChange={() => handleCheckboxChange(option.value)}
                  disabled={state.updating}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          {state.error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200 mb-4">
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={state.updating}
            className="w-full"
          >
            {state.updating ? 'Updating...' : 'Update Preferences'}
          </Button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Want to unsubscribe from all newsletters?
            </p>
            <a
              href={`/newsletter/unsubscribe?token=${token}`}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Unsubscribe from all
            </a>
          </div>
        </form>

        {state.subscribedAt && (
          <p className="text-xs text-gray-500 text-center mt-6">
            Subscribed since {new Date(state.subscribedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}
