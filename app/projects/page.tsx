import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { InlineNewsletterCTA } from '@/components/newsletter/InlineNewsletterCTA';
import { Safari } from '@/components/ui/Safari';

export const metadata: Metadata = {
  title: 'Projects | Marcus Gollahon',
  description:
    'Portfolio of aviation training tools, developer workflows, and side projects. Building CFIPros, Spec-Flow, and exploring algorithmic trading.',
  metadataBase: new URL('https://marcusgoll.com'),
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects | Marcus Gollahon',
    description:
      'Portfolio of aviation training tools, developer workflows, and side projects.',
    type: 'website',
  },
};

/**
 * Projects Page - Portfolio and work showcase with alternating sections
 */
export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-dark)]">
      {/* Header */}
      <div className="bg-[var(--bg-dark)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-[var(--text)] mb-6 leading-tight">
            Our Work
          </h1>
          <p className="text-xl text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto">
            Building tools for pilots and developers. Most work is live or open source. Here's what I ship.
          </p>
        </div>
      </div>

      {/* Projects - Alternating Sections */}
      <div className="bg-[var(--bg-dark)]">
        {/* CFIPros - Image Right */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content Left */}
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
                  CFIPros
                </h2>

                <Link
                  href="https://cfipros.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center format gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors mb-6"
                >
                  https://cfipros.com
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>

                <p className="text-[var(--text-muted)] format text-lg mb-8 leading-relaxed">
                  ACS-aligned study guides and training tools for pilots. AKTR analyzer, endorsement workflows, and logbook cleanup. Built for student pilots, CFIs, and flight schools.
                </p>

                {/* Tech Stack Icons */}
                <div className="flex gap-4 mb-8">
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/html5.svg"
                      alt="HTML5"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      HTML5
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/react.svg"
                      alt="React"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      React/Next.js
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/typescript.svg"
                      alt="TypeScript"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      TypeScript
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/css-3.svg"
                      alt="CSS 3"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      CSS 3
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/tailwind-css.svg"
                      alt="Tailwind CSS"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      Tailwind v4
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                </div>

                <Link
                  href="https://cfipros.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 format px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--secondary-foreground)] font-medium rounded-lg transition-colors"                >
                  View project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Image Right */}
              <div className="order-1 lg:order-2">
                <Safari
                  url="https://cfipros.com"
                  src="/images/CFIPros.png"
                  width={1200}
                  height={900}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Spec-Flow - Image Left */}
        <section className="py-16 lg:py-24 bg-[var(--surface)]/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Image Left */}
              <div className="order-1">
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-24 h-24 mx-auto mb-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <p className="text-sm text-[var(--text-muted)]">
                      Open Source Workflow
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Right */}
              <div className="order-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
                  Spec-Flow
                </h2>

                <Link
                  href="https://github.com/marcusgoll/Spec-Flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center format gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors mb-6"
                >
                  https://github.com/marcusgoll/Spec-Flow
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>

                <p className="text-[var(--text-muted)] format text-lg mb-6 leading-relaxed">
                  Claude Code workflow for spec-driven development. Documents how I plan features, write specs, ship code, and debrief work with AI support. Open source workflow kit for systematic development.
                </p>

                <ul className="space-y-2 format text-[var(--text-muted)] mb-8">
                  <li>• Slash command workflow (/specify, /plan, /implement, /ship)</li>
                  <li>• Agent-based code review and QA automation</li>
                  <li>• Spec-driven development with artifact tracking</li>
                  <li>• GitHub Issues integration for roadmap management</li>
                </ul>
                 {/* Tech Stack Icons */}
                <div className="flex gap-4 mb-8">
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/react.svg"
                      alt="React"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      React/Next.js
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/typescript.svg"
                      alt="TypeScript"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      TypeScript
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                </div>
                <Link
                  href="https://github.com/marcusgoll/Spec-Flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 format px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--secondary-foreground)] font-medium rounded-lg transition-colors"
                >
                  View on GitHub
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Robinhood Trading Bot - Image Right */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content Left */}
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
                  Robinhood Trading Bot
                </h2>

                <Link
                  href="https://github.com/marcusgoll/robinhood-algo-trading-bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center format gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors mb-6"
                >
                  https://github.com/marcusgoll/robinhood-algo-trading-bot
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>

                <p className="text-[var(--text-muted)] format text-lg mb-8 leading-relaxed">
                  Algorithmic trading bot for Robinhood. Fun side project exploring automated trading strategies, market data analysis, and risk management. Educational purposes only.
                </p>

                {/* Tech Stack Icons */}
                <div className="flex gap-4 mb-8">
                  <div className="group relative w-12 h-12  rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/python.svg"
                      alt="python"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      Python
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                </div>

                <Link
                  href="https://github.com/marcusgoll/robinhood-algo-trading-bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 format px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--secondary-foreground)] font-medium rounded-lg transition-colors"
                >
                  View on GitHub
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Image Right */}
              <div className="order-1 lg:order-2">
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 to-gray-900 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-24 h-24 mx-auto mb-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <p className="text-sm text-purple-300">
                      Python Trading Bot
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frazier Sports - Image Left */}
        <section className="py-16 lg:py-24 bg-[var(--surface)]/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image Left */}
              <div className="order-1">
                <Safari
                  url="https://fraziersports.com"
                  src="/images/fraizersports.png"
                  width={1200}
                  height={900}
                />
              </div>

              {/* Content Right */}
              <div className="order-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
                  Frazier Sports
                </h2>

                <Link
                  href="https://fraziersports.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center format gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors mb-6"
                >
                  https://fraziersports.com
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>

                <p className="text-[var(--text-muted)] format text-lg mb-8 leading-relaxed">
                  Custom eCommerce website built on WordPress with WooCommerce. Full product catalog, payment processing, and inventory management for sporting goods retail.
                </p>

                {/* Tech Stack Icons */}
                <div className="flex gap-4 mb-8">
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/html5.svg"
                      alt="Html5"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      HTML5
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/css-3.svg"
                      alt="CSS3"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      CSS 3
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/wordpress.svg"
                      alt="WordPress"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      Wordpress
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/woocommerce.svg"
                      alt="WooCommerce"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      WooCommerce
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                  <div className="group relative w-12 h-12 rounded-lg p-2 flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <Image
                      src="/images/technologies/php.svg"
                      alt="PHP"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg-dark)] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      PHP
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--bg-dark)]"></div>
                    </div>
                  </div>
                </div>

                <Link
                  href="https://fraziersports.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center format gap-2 px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--secondary-foreground)] font-medium rounded-lg transition-colors"
                >
                  Visit Site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--surface)]/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-6">
              Want to collaborate?
            </h2>
            <p className="text-xl text-[var(--text-muted)] format mb-8 leading-relaxed">
              I take on select projects involving training tools, aviation tech, or systematic development workflows. Reach out if you have something interesting.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 format px-8 py-4 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--secondary-foreground)] font-medium rounded-lg transition-colors text-lg"
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-[var(--bg-dark)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <InlineNewsletterCTA />
        </div>
      </section>
    </main>
  );
}
