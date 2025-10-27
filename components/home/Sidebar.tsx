'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

interface SidebarProps {
  postCounts: {
    all: number;
    aviation: number;
    devStartup: number;
    crossPollination: number;
  };
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

/**
 * Sidebar - Homepage sidebar navigation with filters and newsletter CTA
 *
 * Features:
 * - Profile avatar
 * - Track filters with post counts
 * - Newsletter CTA
 * - Keyboard shortcuts
 * - Mobile responsive with overlay
 */
export default function Sidebar({
  postCounts,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter API call
    // For now, just close the dialog
    setEmail('');
    setNewsletterOpen(false);
  };

  const filterOptions = [
    { key: 'all', label: 'All Posts', count: postCounts.all, shortcut: '1' },
    {
      key: 'aviation',
      label: 'Aviation',
      count: postCounts.aviation,
      shortcut: '2',
    },
    {
      key: 'dev-startup',
      label: 'Dev/Startup',
      count: postCounts.devStartup,
      shortcut: '3',
    },
    {
      key: 'cross-pollination',
      label: 'Cross-pollination',
      count: postCounts.crossPollination,
      shortcut: '4',
    },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar-nav"
        className={`
          w-72 flex-shrink-0 bg-card z-50
          lg:sticky lg:top-8 lg:self-start
          fixed top-0 left-0 h-full overflow-y-auto shadow-xl
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:shadow-none lg:relative lg:h-auto
        `}
        aria-label="Blog navigation and filters"
      >
        <div className="p-4 lg:p-0">
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-4"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>

          {/* Profile Avatar */}
          <div className="mb-4 flex justify-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border">
              <Image
                src="/images/marcus-headshot.jpg"
                alt="Marcus Gollahon"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>

          {/* Navigation Filter */}
          <nav aria-label="Content filter">
            <div className="bg-muted/30 rounded-lg p-3 border border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                Filter by Track
              </h2>
              <ul className="space-y-0.5" role="list">
                {filterOptions.map(({ key, label, count, shortcut }) => (
                  <li key={key}>
                    <Link
                      href={`?track=${key}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${
                          track === key
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                        role="button"
                        aria-current={track === key ? 'page' : undefined}
                        aria-label={`${label} (${count} posts, Alt+${shortcut})`}
                      >
                        {label} ({count})
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Sidebar Newsletter CTA */}
          <div className="mt-3 p-3 bg-primary text-primary-foreground rounded-lg">
            <p className="text-xs mb-2 leading-relaxed">
              Get systematic thinking insights delivered weekly
            </p>
            <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="w-full">
                  Subscribe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subscribe to Newsletter</DialogTitle>
                  <DialogDescription>
                    Get systematic thinking insights delivered weekly. Join 500+
                    engineers and founders.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Subscribe</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Keyboard Shortcuts - Hidden on Mobile/Tablet */}
          <details className="mt-3 p-2.5 bg-muted/30 rounded-lg border border-border text-xs hidden xl:block">
            <summary className="font-semibold cursor-pointer text-muted-foreground">
              Keyboard Shortcuts
            </summary>
            <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
              <li>
                <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Alt+M</kbd> Toggle menu
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Alt+1-4</kbd> Quick
                filter
              </li>
            </ul>
          </details>
        </div>
      </aside>
    </>
  );
}
