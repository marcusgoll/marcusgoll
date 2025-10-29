import { Metadata } from 'next'
import { generateContactPageSchema } from '@/lib/schema'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Marcus Gollahon',
  description:
    'Get in touch with Marcus Gollahon. Whether you need aviation consulting, dev/startup collaboration, or CFI training resources, I respond within 24-48 hours.',
  openGraph: {
    title: 'Contact Marcus Gollahon',
    description:
      'Get in touch about aviation consulting, dev/startup collaboration, or CFI training resources.',
    type: 'website',
  },
}

/**
 * Contact Page
 *
 * Purpose: Contact form for visitors to reach Marcus directly
 * Features: Spam protection (Turnstile + honeypot), validation, auto-reply
 * Response time: 24-48 hours
 */
export default function ContactPage() {
  // Generate ContactPage schema for SEO
  const contactPageSchema = generateContactPageSchema()

  return (
    <>
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <div className="min-h-screen bg-navy-950">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Whether you're interested in aviation consulting, dev/startup collaboration, or CFI
              training resources, I'd love to hear from you. I typically respond within 24-48
              hours.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-navy-900 rounded-lg border border-navy-800 shadow-xl">
            <ContactForm />
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>
              Your information is never shared with third parties. See our{' '}
              <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
                privacy policy
              </a>{' '}
              for details.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
