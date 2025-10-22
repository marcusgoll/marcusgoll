import Link from 'next/link';

export default function HomepageVariantsIndex() {
  const variants = [
    {
      id: 1,
      name: 'Traditional Tabs',
      description: 'Tab navigation + vertical list layout. Familiar, scannable, mobile-friendly.',
      approach: 'Conventional'
    },
    {
      id: 2,
      name: 'Button Pills + Grid',
      description: 'Pill-style filters + 2-3 column card grid. High content density with visual engagement.',
      approach: 'Balanced'
    },
    {
      id: 3,
      name: 'Sidebar Filter + Magazine',
      description: 'Persistent sidebar navigation + magazine-style cards. Professional, desktop-optimized.',
      approach: 'Desktop-first'
    },
    {
      id: 4,
      name: 'Minimal + Masonry',
      description: 'Compact dropdown + Pinterest-inspired masonry grid. Breaks convention.',
      approach: 'Unconventional'
    },
    {
      id: 5,
      name: 'Featured Hero + Grid',
      description: 'Large featured hero + uniform card grid + subject tags. Anthropic-inspired professional feel.',
      approach: 'Enterprise'
    },
    {
      id: 6,
      name: 'Tag Filter + 3-Column',
      description: 'Sticky tag filter with counts + 3-column grid + hover effects. Magic UI-inspired modern aesthetic.',
      approach: 'Modern'
    },
    {
      id: 7,
      name: 'Bento Grid + Categories',
      description: 'Mixed-size bento layout grouped by category. Hybrid approach with visual variety.',
      approach: 'Hybrid'
    },
    {
      id: 8,
      name: 'Text-First Grid',
      description: 'Multi-column text-only grid, no images. Google Blog-inspired with generous spacing.',
      approach: 'Text-First'
    },
    {
      id: 9,
      name: 'Centered Single-Column',
      description: 'Single-column centered layout with clean typography. Linear-inspired minimal design.',
      approach: 'Minimal'
    },
    {
      id: 10,
      name: 'Dense List View',
      description: 'Ultra-compact list with numbered posts. Hacker News-inspired maximum information density.',
      approach: 'Dense'
    },
  ];

  const states = ['default', 'loading', 'empty'];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Homepage Design Variations
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Feature: <span className="font-semibold">Homepage with Post Feed</span>
          </p>
          <p className="text-gray-700 max-w-3xl">
            Compare 10 design approaches for displaying blog posts with track filtering.
            Variants 1-7 explore different layouts with images/placeholders. Variants 8-10 are
            text-focused designs without images. Test all states and fill out the critique document.
          </p>
        </div>

        {/* Merged Concepts Section */}
        <div className="mb-12 p-6 bg-white rounded-lg border-2 border-gray-900">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Merged Concepts (From v3, v5, v6)
            </h2>
            <p className="text-gray-600">
              Based on your selection of v3, v5, and v6, here are 3 concepts combining the best elements:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">M1: Professional Hybrid</h3>
              <p className="text-sm text-gray-600 mb-3">v5 hero + v6 sticky tags + v5 grid + v6 hover + v5 CTA</p>
              <Link href="/mock/homepage-post-feed/homepage/m1">
                <button className="w-full bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                  View M1
                </button>
              </Link>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">M2: Sidebar Enhanced</h3>
              <p className="text-sm text-gray-600 mb-3">v3 sidebar + v5 hero + v6 grid + v6 hover</p>
              <Link href="/mock/homepage-post-feed/homepage/m2">
                <button className="w-full bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                  View M2
                </button>
              </Link>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">M3: Modern Minimal</h3>
              <p className="text-sm text-gray-600 mb-3">v6 sticky header + v5 grid + subtle featured + v6 hover</p>
              <Link href="/mock/homepage-post-feed/homepage/m3">
                <button className="w-full bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                  View M3
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Original Variants
          </h2>
          <p className="text-gray-600 mb-6">
            Review the original 10 variants that informed the merged concepts above
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {variants.map((variant) => (
            <article
              key={variant.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    v{variant.id}: {variant.name}
                  </h2>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    variant.approach === 'Conventional' ? 'bg-blue-100 text-blue-800' :
                    variant.approach === 'Balanced' ? 'bg-green-100 text-green-800' :
                    variant.approach === 'Desktop-first' ? 'bg-purple-100 text-purple-800' :
                    variant.approach === 'Unconventional' ? 'bg-orange-100 text-orange-800' :
                    variant.approach === 'Enterprise' ? 'bg-indigo-100 text-indigo-800' :
                    variant.approach === 'Modern' ? 'bg-pink-100 text-pink-800' :
                    variant.approach === 'Hybrid' ? 'bg-teal-100 text-teal-800' :
                    variant.approach === 'Text-First' ? 'bg-yellow-100 text-yellow-800' :
                    variant.approach === 'Minimal' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {variant.approach}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{variant.description}</p>

                <div className="space-y-3">
                  <Link href={`/mock/homepage-post-feed/homepage/v${variant.id}`}>
                    <button className="w-full bg-gray-900 text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                      View Variant
                    </button>
                  </Link>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Test states:</p>
                    <div className="flex flex-wrap gap-2">
                      {states.map((state) => (
                        <Link
                          key={state}
                          href={`/mock/homepage-post-feed/homepage/v${variant.id}?state=${state}`}
                          className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          {state}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Side-by-Side Comparison
          </h2>
          <p className="text-gray-600 mb-4">
            View all variants simultaneously to compare layouts and interactions.
          </p>
          <Link href="/mock/homepage-post-feed/homepage/compare">
            <button className="bg-gray-900 text-white font-medium py-2 px-6 rounded hover:bg-gray-800 transition-colors">
              Open Comparison View
            </button>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Next Steps
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Review all 10 variants (test default, loading, and empty states)</li>
            <li>Consider: Which layout is most scannable? Which filter pattern is clearest? Do you need images?</li>
            <li>Fill out <code className="bg-gray-100 px-2 py-1 rounded text-sm">specs/003-homepage-post-feed/design/crit.md</code></li>
            <li>Mark Keep/Change/Kill decisions for each variant</li>
            <li>Run <code className="bg-gray-100 px-2 py-1 rounded text-sm">/design-functional homepage-post-feed</code> to merge selected elements</li>
          </ol>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <h3 className="font-semibold text-gray-900 mb-2">Jobs Principles Checklist:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✅ All variants use grayscale only (brand colors in Phase 3)</li>
              <li>✅ All variants use system components from ui-inventory.md</li>
              <li>✅ All states accessible via ?state= query param</li>
              <li>✅ Real copy from copy.md (no Lorem Ipsum)</li>
              <li>✅ Mobile-responsive (test on narrow viewport)</li>
              <li>⚠️ Review: Does each variant require ≤2 clicks to primary action?</li>
              <li>⚠️ Review: Are any tooltips needed? (should be zero)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
