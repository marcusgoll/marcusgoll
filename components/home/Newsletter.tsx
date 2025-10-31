'use client';

import { Plane, Code } from 'lucide-react';
import { useState } from 'react';

/**
 * Newsletter - Dual-track newsletter signup
 * Aviation + Dev/Startup content subscription
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // TODO: Implement newsletter signup logic
    // For now, just simulate success
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-[var(--surface)] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
              Subscribe to the newsletter
            </h2>
            <p className="mt-4 text-lg format text-[var(--text-muted)]">
              Get practical lessons from aviation and software development delivered to your inbox. No fluff, just real-world insights from the flight deck and terminal.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="min-w-0 flex-auto format rounded-md bg-[var(--bg)] px-3.5 py-3.5 text-base text-[var(--text)] outline-1 -outline-offset-1 outline-[var(--border)] placeholder:text-[var(--text-muted)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--primary)] sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="flex-none cursor-pointer rounded-md bg-[var(--primary)]  px-3.5 py-2.5 format font-semibold text-[var(--primary-foreground)] shadow-xs hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p className="mt-4 format text-[var(--primary)]">
                Thanks for subscribing! Check your email to confirm.
              </p>
            )}
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-[var(--surface)]/50 p-2 ring-1 ring-[var(--border)]">
                <Plane aria-hidden="true" className="size-6 text-[var(--text)]" />
              </div>
              <dt className="mt-4 text-base font-semibold text-[var(--text)]">Aviation insights</dt>
              <dd className="mt-2 text-base/7 text-[var(--text-muted)]">
                Flight training tips, career guidance, and systematic thinking lessons from 30,000 feet.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-[var(--surface)]/50 p-2 ring-1 ring-[var(--border)]">
                <Code aria-hidden="true" className="size-6 text-[var(--text)]" />
              </div>
              <dt className="mt-4 text-base font-semibold text-[var(--text)]">Dev & startup wisdom</dt>
              <dd className="mt-2 text-base/7 text-[var(--text-muted)]">
                Real talk about building products, shipping fast, and lessons learned from side projects.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
