'use client'

/**
 * Maintenance Mode Page
 *
 * Purpose: Branded maintenance page shown to external visitors
 * Route: /maintenance
 * Accessibility: WCAG 2.1 AA compliant
 * Performance: <1.5s FCP target
 * Auto-deployment: Enabled via GitHub Actions → Dokploy
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import { useState } from 'react'

// Note: Metadata export not available in client components, move to layout if needed
// export const metadata: Metadata = {
//   title: 'Maintenance | Marcus Gollahon',
//   description:
//     'The site is currently undergoing maintenance. Please check back soon.',
//   robots: 'noindex, nofollow',
// }

export default function MaintenancePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Replace with actual email notification service
      // (e.g., Mailchimp, SendGrid, Resend)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Failed to subscribe:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4 py-16 sm:px-6 lg:px-8">
      {/* Main Content Container */}
      <div className="w-full max-w-md text-center lg:max-w-2xl">
        {/* Image Element */}
        <div className="mb-12 flex justify-center">
          <Image
            src="/images/maintenance.png"
            alt="Construction worker building"
            width={700}
            height={700}
            className="max-h-[400px] w-auto object-contain sm:max-h-[500px] lg:max-h-[700px]"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          I&apos;ll be right back
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-gray-300 sm:text-xl">
          Scheduled maintenance in progress. I&apos;m upgrading the site and
          polishing the propellers.
        </p>

        {/* Email Notification Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Get an email when site is back online"
              required
              className="flex-1 rounded-lg border border-gray-600 bg-navy-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-navy-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-navy-900"
            >
              {isLoading ? 'Sending...' : 'Notify me'}
            </button>
          </div>

          {/* Success Message */}
          {submitted && (
            <p className="animate-fade-in text-sm text-emerald-400">
              ✓ Got it! We&apos;ll notify you when the site is live.
            </p>
          )}
        </form>

        {/* Contact Information */}
        <div className="text-sm text-gray-400">
          <p>
            Need to reach us?{' '}
            <a
              href="mailto:marcusgoll@gmail.com"
              className="text-emerald-600 underline hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-navy-900"
            >
              Send an email
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Marcus Gollahon. All rights reserved.
      </footer>
    </div>
  )
}
