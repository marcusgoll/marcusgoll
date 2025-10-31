'use client';

import { CheckCircle2, Plane, Code } from 'lucide-react';
import Link from 'next/link';
import { Safari } from '@/components/ui/Safari';

const features = [
  {
    name: 'Error Code Decoder.',
    description:
      'Instant FAA knowledge test analysis. Upload your test results and get detailed explanations of every error code.',
    icon: Code,
  },
  {
    name: 'Built for CFIs & Students.',
    description: 'Designed for aspiring pilots, flight instructors, and flight schools who need fast, accurate test analysis.',
    icon: Plane,
  },
  {
    name: 'Real Talk, Real Tools.',
    description: 'The resource hub I wish existed when I started flight training. No fluff, just practical tools that work.',
    icon: CheckCircle2,
  },
];

/**
 * WhatImBuilding - Showcase CFIPros project
 * Two-column layout with feature list and screenshot
 */
export default function WhatImBuilding() {
  return (
    <div className="overflow-hidden bg-[var(--bg)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-[var(--primary)]">Current project</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-[var(--text)] sm:text-5xl">
                <Link
                  href="https://cfipros.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  CFIPros
                </Link>
              </p>
              <p className="mt-6 text-lg/8 text-[var(--text-muted)]">
                Simplify FAA test result analysis with powerful error code extraction and explanation. Built for students, pilots, and schools.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-[var(--text-muted)] lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-[var(--text)]">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-[var(--primary)]"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Link
            href="https://cfipros.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Safari
              url="cfipros.com"
              src="/images/CFIPros.png"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none sm:w-[57rem] md:-ml-4 lg:-ml-0"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
