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
    <div className="bg-gray-200 py-16 sm:py-24 lg:py-32 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Subscribe to the newsletter
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
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
                className="min-w-0 flex-auto rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus:outline-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="flex-none rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:outline-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
                Thanks for subscribing! Check your email to confirm.
              </p>
            )}
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/50 p-2 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
                <Plane aria-hidden="true" className="size-6 text-gray-600 dark:text-white" />
              </div>
              <dt className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Aviation insights</dt>
              <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">
                Flight training tips, career guidance, and systematic thinking lessons from 30,000 feet.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/50 p-2 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
                <Code aria-hidden="true" className="size-6 text-gray-600 dark:text-white" />
              </div>
              <dt className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Dev & startup wisdom</dt>
              <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">
                Real talk about building products, shipping fast, and lessons learned from side projects.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
