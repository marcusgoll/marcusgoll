import Link from 'next/link';
import { CompactNewsletterSignup } from '@/components/newsletter/CompactNewsletterSignup';

/**
 * Footer component - Site footer with navigation and social links
 * - Secondary navigation with category links
 * - Social media links (LinkedIn, Twitter, GitHub)
 * - Newsletter signup (compact variant)
 * - Copyright notice
 * - Navy 900 background to match header
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Marcus Gollahon</h3>
            <p className="text-sm text-gray-300">
              Teaching systematic thinking from 30,000 feet.
            </p>
          </div>

          {/* Aviation Links */}
          <div>
            <h4 className="mb-4 font-semibold">Aviation</h4>
            <nav className="space-y-2 text-sm">
              <Link
                href="/aviation"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                All Aviation Posts
              </Link>
              <Link
                href="/tag/flight-training"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Flight Training
              </Link>
              <Link
                href="/tag/cfi-resources"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                CFI Resources
              </Link>
              <Link
                href="/tag/career-path"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Career Path
              </Link>
            </nav>
          </div>

          {/* Dev/Startup Links */}
          <div>
            <h4 className="mb-4 font-semibold">Dev/Startup</h4>
            <nav className="space-y-2 text-sm">
              <Link
                href="/dev-startup"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                All Dev/Startup Posts
              </Link>
              <Link
                href="/tag/software-development"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Software Development
              </Link>
              <Link
                href="/tag/systematic-thinking"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Systematic Thinking
              </Link>
              <Link
                href="/tag/startup-insights"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Startup Insights
              </Link>
            </nav>
          </div>

          {/* Social & Connect */}
          <div>
            <h4 className="mb-4 font-semibold">Connect</h4>
            <nav className="space-y-2 text-sm">
              <a
                href="https://www.linkedin.com/in/marcusgollahon"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/marcusgollahon"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Twitter
              </a>
              <a
                href="https://github.com/marcusgollahon"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                GitHub
              </a>
              <Link
                href="/tag/cross-pollination"
                className="block text-gray-300 transition-colors hover:text-emerald-600"
              >
                Cross-Pollination
              </Link>
            </nav>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="max-w-md mx-auto md:mx-0">
            <CompactNewsletterSignup />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} Marcus Gollahon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
