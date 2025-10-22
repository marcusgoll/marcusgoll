'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CompareVariants() {
  const [state, setState] = useState('default');

  const variants = [
    { id: 1, name: 'Traditional Tabs', short: 'Tabs' },
    { id: 2, name: 'Button Pills + Grid', short: 'Pills' },
    { id: 3, name: 'Sidebar Filter', short: 'Sidebar' },
    { id: 4, name: 'Minimal + Masonry', short: 'Masonry' },
  ];

  const states = ['default', 'loading', 'empty'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Compare: Homepage Variants
              </h1>
              <p className="text-sm text-gray-600">
                Side-by-side comparison of design approaches
              </p>
            </div>
            <Link href="/mock/homepage-post-feed/homepage">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                ← Back to Index
              </button>
            </Link>
          </div>

          {/* State Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              View state:
            </label>
            <div className="flex gap-2">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    state === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    v{variant.id}: {variant.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    State: <span className="font-medium">{state}</span>
                  </p>
                </div>
                <Link
                  href={`/mock/homepage-post-feed/homepage/v${variant.id}?state=${state}`}
                  target="_blank"
                  className="text-xs px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Open Full
                </Link>
              </div>

              {/* iframe embed */}
              <div className="relative" style={{ height: '600px' }}>
                <iframe
                  src={`/mock/homepage-post-feed/homepage/v${variant.id}?state=${state}`}
                  className="w-full h-full border-0"
                  title={`Variant ${variant.id}`}
                  style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: '125%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Review Guidance */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            How to Review
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What to Look For:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Layout clarity: Can you quickly understand the structure?</li>
                <li>Filter discoverability: Is it obvious how to filter posts?</li>
                <li>Featured post prominence: Does it stand out appropriately?</li>
                <li>Content density: Is there enough/too much content visible?</li>
                <li>Mobile experience: Test narrow viewport (resize browser)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Next Actions:</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Toggle between states (default, loading, empty)</li>
                <li>Note which elements work best from each variant</li>
                <li>Consider your HEART hypothesis: which design best supports faster discovery?</li>
                <li>Fill <code className="bg-gray-100 px-2 py-1 rounded">specs/003-homepage-post-feed/design/crit.md</code></li>
                <li>Mark Keep/Change/Kill decisions</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
