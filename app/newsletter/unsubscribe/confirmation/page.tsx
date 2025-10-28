'use client'

/**
 * Newsletter unsubscribe confirmation page
 *
 * Purpose: Confirm unsubscribe and offer GDPR hard delete option
 * Features: Auto-unsubscribe on load, hard delete button, re-subscribe link
 * Route: /newsletter/unsubscribe/confirmation?token=xxx
 */

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface UnsubscribeState {
  loading: boolean
  error: string | null
  unsubscribed: boolean
  hardDeleting: boolean
  hardDeleted: boolean
}

function UnsubscribeConfirmationContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [state, setState] = useState<UnsubscribeState>({
    loading: true,
    error: null,
    unsubscribed: false,
    hardDeleting: false,
    hardDeleted: false,
  })

  // Auto-unsubscribe on mount (soft delete)
  useEffect(() => {
    async function unsubscribe() {
      if (!token) {
        setState({
          loading: false,
          error: 'Invalid or missing unsubscribe token',
          unsubscribed: false,
          hardDeleting: false,
          hardDeleted: false,
        })
        return
      }

      try {
        const response = await fetch('/api/newsletter/unsubscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            hardDelete: false,
          }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to unsubscribe')
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          unsubscribed: true,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to unsubscribe',
        }))
      }
    }

    unsubscribe()
  }, [token])

  // Handle hard delete (GDPR)
  const handleHardDelete = async () => {
    if (!token) return

    const confirmed = confirm(
      'Are you sure you want to permanently delete all your data? This action cannot be undone.'
    )

    if (!confirmed) return

    setState((prev) => ({ ...prev, hardDeleting: true, error: null }))

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          hardDelete: true,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete data')
      }

      setState((prev) => ({
        ...prev,
        hardDeleting: false,
        hardDeleted: true,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        hardDeleting: false,
        error: error instanceof Error ? error.message : 'Failed to delete data',
      }))
    }
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing unsubscribe...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (state.error && !state.unsubscribed) {
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

  // Hard deleted state
  if (state.hardDeleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-lg bg-green-50 p-8 border border-green-200">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Data Permanently Deleted
            </h2>
            <p className="text-green-700 mb-6">
              Your email and all associated data have been permanently removed from our system.
              You&apos;re welcome to subscribe again anytime.
            </p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success state (unsubscribed)
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-lg bg-gray-50 p-8 border border-gray-200">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You&apos;ve Been Unsubscribed
          </h2>
          <p className="text-gray-700 mb-6">
            You won&apos;t receive any more newsletters from us. We&apos;ll send you a confirmation email shortly.
          </p>

          {token && (
            <div className="space-y-4">
              <div>
                <a
                  href={`/newsletter/preferences/${token}`}
                  className="text-blue-600 hover:text-blue-700 underline block mb-4"
                >
                  Changed your mind? Re-subscribe
                </a>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-3">
                  Want to permanently delete your data from our system?
                </p>
                <Button
                  onClick={handleHardDelete}
                  disabled={state.hardDeleting}
                  variant="destructive"
                  className="w-full"
                >
                  {state.hardDeleting ? 'Deleting...' : 'Delete My Data (GDPR)'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone
                </p>
              </div>

              {state.error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200 mt-4">
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Link href="/" className="text-gray-600 hover:text-gray-700 underline mt-6 inline-block">
          Return to homepage
        </Link>
      </div>
    </div>
  )
}

export default function UnsubscribeConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="text-center">Loading...</div></div>}>
      <UnsubscribeConfirmationContent />
    </Suspense>
  )
}
