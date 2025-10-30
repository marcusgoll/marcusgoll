'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

/**
 * Header component - Simple site navigation
 * - Desktop: Articles, Projects, About, Contact
 * - Mobile: Hamburger menu
 * - Sticky header with Navy 900 background
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="/articles"
            className="text-white transition-colors hover:text-emerald-600"
          >
            Articles
          </Link>
          <Link
            href="/projects"
            className="text-white transition-colors hover:text-emerald-600"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="text-white transition-colors hover:text-emerald-600"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-white transition-colors hover:text-emerald-600"
          >
            Contact
          </Link>

          {/* Theme Toggle - Desktop */}
          <ThemeToggle className="text-white cursor-pointer" />
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
              href="/articles"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/projects"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-white transition-colors hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
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
