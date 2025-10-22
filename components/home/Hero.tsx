import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Hero component - Homepage hero section with dual-track CTAs
 * Layout: Professional headshot (right on desktop, top on mobile)
 * Background: Navy 900 gradient
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-900/90 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
          {/* Content (Left on Desktop) */}
          <div className="flex-1 text-center md:text-left">
            {/* Headline */}
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Marcus Gollahon
            </h1>

            {/* Tagline */}
            <p className="mb-4 text-xl font-semibold text-emerald-600 md:text-2xl">
              Teaching Systematic Thinking from 30,000 Feet
            </p>

            {/* Mission Subtitle */}
            <p className="mb-8 text-lg text-gray-300 md:text-xl">
              I help pilots advance their aviation careers and teach developers
              to build with systematic thinking.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Link href="/aviation">
                <Button variant="primary" size="lg">
                  Explore Aviation
                </Button>
              </Link>
              <Link href="/dev-startup">
                <Button variant="secondary" size="lg">
                  Explore Dev/Startup
                </Button>
              </Link>
            </div>
          </div>

          {/* Professional Headshot (Right on Desktop, Top on Mobile - order-first) */}
          <div className="order-first flex-shrink-0 md:order-last">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-emerald-600 shadow-2xl md:h-80 md:w-80">
              <Image
                src="/images/marcus-headshot.jpg"
                alt="Marcus Gollahon - Aviation and Software Development"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
