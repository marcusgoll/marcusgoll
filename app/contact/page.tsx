import { Metadata } from 'next'
import { generateContactPageSchema } from '@/lib/schema'
import Link from 'next/link'
import { InlineNewsletterCTA } from '@/components/newsletter/InlineNewsletterCTA'

export const metadata: Metadata = {
  title: 'Contact | Marcus Gollahon',
  description:
    'Get in touch with Marcus Gollahon via email or X. I respond to messages about training tools, aviation, and development work.',
  metadataBase: new URL('https://marcusgoll.com'),
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Marcus Gollahon',
    description:
      'Get in touch about training tools, aviation, or development work.',
    type: 'website',
  },
}

/**
 * Contact Page
 *
 * Simple contact page with email and X DM options
 */
export default function ContactPage() {
  // Generate ContactPage schema for SEO
  const contactPageSchema = generateContactPageSchema()

  return (
    <>
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(contactPageSchema)}
      </script>

      <main className="min-h-screen bg-[var(--bg)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-[var(--text)] mb-6 leading-tight">
                Get in Touch
              </h1>
              <p className="text-xl text-[var(--text-muted)] leading-relaxed">
                I respond to messages about training tools, aviation, and development work. Pick the method that works best for you.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-6">
              {/* Email */}
              <Link
                href="mailto:marcusgoll@gmail.com"
                className="block p-6 rounded-lg border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                      Email
                    </h2>
                    <p className="text-[var(--text-muted)] mb-2">
                      Best for longer questions, attachments, or detailed discussions.
                    </p>
                    <p className="text-[var(--primary)] font-medium">
                      marcusgoll@gmail.com
                    </p>
                  </div>
                </div>
              </Link>

              {/* X (Twitter) DM */}
              <Link
                href="https://x.com/intent/follow?screen_name=marcusgoll"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-lg border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-[var(--primary)]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                      DM on X
                    </h2>
                    <p className="text-[var(--text-muted)] mb-2">
                      Best for quick questions or following my updates on training and building.
                    </p>
                    <p className="text-[var(--primary)] font-medium">
                      @marcusgoll
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Response Time Note */}
            <div className="mt-12 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
              <p className="text-sm text-[var(--text-muted)] text-center">
                I typically respond within 24-48 hours. If it's urgent, X DM is usually faster.
              </p>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-12">
              <InlineNewsletterCTA />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
