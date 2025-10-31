'use client'

import { NewsletterSignupForm } from './NewsletterSignupForm'

interface InlineNewsletterCTAProps {
  postTags?: string[]
}

function getContextualHeadline(tags: string[] = []): string {
  const t = tags.map(x => x.toLowerCase())
  const hasAviation = t.some(x => x.includes('aviation') || x.includes('flight') || x.includes('pilot'))
  const hasDev = t.some(x => x.includes('dev') || x.includes('code') || x.includes('startup') || x.includes('tech'))
  const hasEducation = t.some(x => x.includes('education') || x.includes('teaching') || x.includes('learning'))

  if ((hasAviation && hasDev) || (hasAviation && hasEducation) || (hasDev && hasEducation)) {
    return 'Notes on flying, teaching, and building. In your inbox.'
  }
  if (hasAviation) return 'Practical aviation notes and study updates.'
  if (hasDev) return 'Web dev workflow and build logs that ship.'
  if (hasEducation) return 'Clear teaching ideas you can use right away.'
  return 'Short, useful writing on flying, teaching, and building.'
}

const BENEFITS_BASE = [
  'Actionable workflows and bite-sized tutorials',
  'Real-world lessons from flying, teaching, and building',
  'Curated tools, code, and reading minus the fluff',
]

export function InlineNewsletterCTA({ postTags = [] }: InlineNewsletterCTAProps) {
  const subtitle = getContextualHeadline(postTags)

  return (
    <section
      role="region"
      aria-labelledby="nl-cta-title"
      className="bg-[var(--bg)] my-12"
    >
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md sm:text-center">
          {/* Eyebrow */}
          <p className="mb-2 text-sm font-medium tracking-wide text-[var(--primary)]">
            Newsletter
          </p>

          {/* Tagline */}
          <h2
            id="nl-cta-title"
            className="mb-2 text-3xl tracking-tight format:lg font-extrabold text-[var(--text)] sm:text-4xl"
          >
            Aviate. Navigate. Communicate.
          </h2>

          {/* Context-aware subtitle */}
          <p className="mx-auto mb-6 max-w-2xl text-base format text-[var(--text-muted)]">
            {subtitle}
          </p>

          {/* Benefits — small well cards */}
          <ul
            role="list"
            aria-label="Newsletter benefits"
            className="mx-auto mb-8 grid max-w-md grid-cols-1 gap-3 sm:max-w-2xl sm:grid-cols-3"
          >
            {BENEFITS_BASE.map((b) => (
              <li
                key={b}
                className="h-full rounded-lg border border-[var(--border)] format:sm bg-[var(--surface)] p-3 text-sm text-[var(--text)] shadow-sm"
              >
                {b}
              </li>
            ))}
          </ul>

          {/* If you have a dedicated form component, use it.
              Otherwise keep the inline form below. */}
          {/* <NewsletterSignupForm source="inline-cta" tags={postTags} /> */}

          <form
            method="post"
            noValidate
            className="mx-auto max-w-screen-sm format "
          >
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="items-center mb-3 space-y-4 sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label
                  htmlFor="newsletter-email"
                  className="sr-only"
                >
                  Email address
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-describedby="newsletter-privacy"
                  className="block w-full rounded-lg format border border-[var(--border)] bg-[var(--surface)] p-3 pl-10 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:ring-[var(--primary)] sm:rounded-none sm:rounded-l-lg"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg format border border-[var(--primary)] bg-[var(--primary)] px-5 py-3 text-center text-sm font-medium text-white hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-[var(--primary)] sm:rounded-none sm:rounded-r-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <p
              id="newsletter-privacy"
              className="mx-auto max-w-screen-sm text-left text-sm text-[var(--text-muted)]"
            >
              I will not share your email. Unsubscribe any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
