/**
 * Maintenance Mode Page
 *
 * Purpose: Branded maintenance page shown to external visitors
 * Route: /maintenance
 * Accessibility: WCAG 2.1 AA compliant
 * Performance: <1.5s FCP target
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maintenance | Marcus Gollahon',
  description:
    'The site is currently undergoing maintenance. Please check back soon.',
  robots: 'noindex, nofollow', // Prevent indexing maintenance page
}

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4 py-16 sm:px-6 lg:px-8">
      {/* Main Content Container */}
      <div className="w-full max-w-md text-center">
        {/* Icon/Visual Element */}
        <div className="mb-8 flex justify-center" aria-hidden="true">
          <svg
            className="h-16 w-16 text-emerald-600 sm:h-20 sm:w-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          We&apos;ll be back soon
        </h1>

        {/* Message */}
        <p className="mb-8 text-lg text-gray-300 sm:text-xl">
          The site is currently undergoing scheduled maintenance. We&apos;re
          working to bring you an even better experience.
        </p>

        {/* Additional Info */}
        <div className="space-y-4 text-sm text-gray-400">
          <p>
            Please check back in a few minutes. Thank you for your patience.
          </p>

          {/* Contact Information */}
          <p>
            Need to reach us?{' '}
            <a
              href="mailto:hello@marcusgoll.com"
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
