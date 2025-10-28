'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

/**
 * Header component - Site navigation with dropdown menus
 * - Desktop: Full navigation with category dropdowns
 * - Mobile: Hamburger menu
 * - Sticky header with Navy 900 background
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aviationDropdownOpen, setAviationDropdownOpen] = useState(false);
  const [devDropdownOpen, setDevDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 shadow-md">
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-white transition-colors hover:text-emerald-600"
        >
          Marcus Gollahon
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link
            href="/"
            className="text-white transition-colors hover:text-emerald-600"
          >
            Home
          </Link>

          {/* Aviation Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setAviationDropdownOpen(true)}
            onMouseLeave={() => setAviationDropdownOpen(false)}
          >
            <Link
              href="/aviation"
              className="flex items-center text-white transition-colors hover:text-emerald-600"
            >
              Aviation
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>

            {aviationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg">
                <Link
                  href="/tag/flight-training"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Flight Training
                </Link>
                <Link
                  href="/tag/cfi-resources"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  CFI Resources
                </Link>
                <Link
                  href="/tag/career-path"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Career Path
                </Link>
              </div>
            )}
          </div>

          {/* Dev/Startup Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDevDropdownOpen(true)}
            onMouseLeave={() => setDevDropdownOpen(false)}
          >
            <Link
              href="/dev-startup"
              className="flex items-center text-white transition-colors hover:text-emerald-600"
            >
              Dev/Startup
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>

            {devDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg">
                <Link
                  href="/tag/software-development"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Software Development
                </Link>
                <Link
                  href="/tag/systematic-thinking"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Systematic Thinking
                </Link>
                <Link
                  href="/tag/startup-insights"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Startup Insights
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/tag/cross-pollination"
            className="text-white transition-colors hover:text-emerald-600"
          >
            Cross-Pollination
          </Link>

          {/* Theme Toggle - Desktop */}
          <ThemeToggle className="text-white" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-700 bg-navy-900 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/aviation"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Aviation
            </Link>
            <div className="pl-4 space-y-1">
              <Link
                href="/tag/flight-training"
                className="block py-1 text-sm text-gray-300 transition-colors hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flight Training
              </Link>
              <Link
                href="/tag/cfi-resources"
                className="block py-1 text-sm text-gray-300 transition-colors hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                CFI Resources
              </Link>
              <Link
                href="/tag/career-path"
                className="block py-1 text-sm text-gray-300 transition-colors hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Career Path
              </Link>
            </div>
            <Link
              href="/dev-startup"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dev/Startup
            </Link>
            <div className="pl-4 space-y-1">
              <Link
                href="/tag/software-development"
                className="block py-1 text-sm text-gray-300 transition-colors hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Software Development
              </Link>
              <Link
                href="/tag/systematic-thinking"
                className="block py-1 text-sm text-gray-300 transition-colors hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Systematic Thinking
              </Link>
              <Link
                href="/tag/startup-insights"
                className="block py-1 text-sm text-gray-300 transition-colors hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Startup Insights
              </Link>
            </div>
            <Link
              href="/tag/cross-pollination"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cross-Pollination
            </Link>

            {/* Theme Toggle - Mobile */}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <ThemeToggle size="mobile" className="text-white w-full justify-start" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
