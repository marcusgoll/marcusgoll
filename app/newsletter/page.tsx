import { NewsletterSignupForm } from '@/components/newsletter/NewsletterSignupForm'
import type { Metadata } from 'next'

/**
 * Newsletter Landing Page
 *
 * Purpose: Dedicated page explaining newsletter benefits and comprehensive signup
 * Features: Value proposition, benefits grid, FAQs, comprehensive signup form
 * SEO: Optimized metadata with Open Graph tags
 */

export const metadata: Metadata = {
  title: 'Newsletter - Marcus Gollahon',
  description:
    'Subscribe to get systematic thinking applied to aviation and software. Dual-track content: Aviation insights + Dev/Startup lessons delivered to your inbox.',
  openGraph: {
    title: 'Newsletter - Marcus Gollahon',
    description:
      'Subscribe to get systematic thinking applied to aviation and software. Dual-track content: Aviation insights + Dev/Startup lessons delivered to your inbox.',
    url: 'https://marcusgoll.com/newsletter',
    type: 'website',
    siteName: 'Marcus Gollahon',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@marcusgoll',
    creator: '@marcusgoll',
    title: 'Newsletter - Marcus Gollahon',
    description:
      'Subscribe to get systematic thinking applied to aviation and software. Dual-track content: Aviation insights + Dev/Startup lessons delivered to your inbox.',
  },
}

const BENEFITS = [
  {
    title: 'Systematic Thinking',
    description:
      'Learn how to apply first-principles reasoning to both aviation and software development.',
    icon: '🧠',
  },
  {
    title: 'Dual-Track Content',
    description:
      'Get insights from two worlds: Aviation adventures + Dev/Startup lessons in one newsletter.',
    icon: '✈️',
  },
  {
    title: 'Teaching Quality',
    description:
      "CFI-level clarity in every post. If I can explain it to a student pilot, I can explain it to anyone.",
    icon: '📚',
  },
  {
    title: 'Building in Public',
    description:
      'Real lessons from the trenches - successes, failures, and everything in between.',
    icon: '🚀',
  },
]

const FAQS = [
  {
    question: 'How often do you send emails?',
    answer:
      'I send 1-2 emails per week maximum. Quality over quantity - each email is carefully crafted to provide real value.',
  },
  {
    question: 'Can I choose which topics to receive?',
    answer:
      'Yes! You can subscribe to Aviation, Dev/Startup, Education content separately or get all of them. Update your preferences anytime.',
  },
  {
    question: 'What kind of content do you share?',
    answer:
      'Aviation: Flight training insights, CFI resources, career paths. Dev/Startup: Software development, systematic thinking, startup lessons. Education: Teaching strategies and learning frameworks.',
  },
  {
    question: 'How do I unsubscribe?',
    answer:
      'Every email includes an unsubscribe link. One click and you are instantly removed from the list. No questions asked.',
  },
  {
    question: 'Do you share my email with third parties?',
    answer:
      'Never. Your email is used exclusively for sending you the newsletter. No spam, no third-party sharing, ever.',
  },
  {
    question: 'Is it free?',
    answer:
      'Yes, completely free. No paywalls, no premium tiers. Just great content delivered to your inbox.',
  },
]

export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Subscribe to the Newsletter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get systematic thinking applied to aviation and software. Dual-track content
            combining flight training insights with dev/startup lessons.
          </p>
        </header>

        {/* Benefits Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Subscribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-colors"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Signup Form */}
        <section id="get-started" className="mb-16 p-8 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">Get Started</h2>
          <div className="max-w-xl mx-auto">
            <NewsletterSignupForm variant="comprehensive" source="dedicated-page" />
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center p-8 rounded-lg bg-gradient-to-r from-navy-900 to-emerald-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-lg mb-6">
            Join hundreds of pilots and developers learning systematic thinking.
          </p>
          <a
            href="#get-started"
            className="inline-block px-8 py-3 bg-white text-navy-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Subscribe Now
          </a>
        </section>
      </div>
    </div>
  )
}
