import Link from 'next/link';
import { RetroGrid } from '@/components/ui/RetroGrid';

/**
 * ContactSection - Huge text CTA to contact page with retro grid background
 */
export default function ContactSection() {
  return (
    <div className="relative overflow-hidden bg-[var(--bg)] py-24 sm:py-32">
      {/* Retro grid background */}
      <RetroGrid />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          href="/contact"
          className="block text-center group transition-colors"
        >
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors underline decoration-4 underline-offset-8">
            Contact Marcus
          </h2>
        </Link>
      </div>
    </div>
  );
}
