import Link from 'next/link';

/**
 * ContactSection - Huge text CTA to contact page
 */
export default function ContactSection() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          href="/contact"
          className="block text-center group transition-colors"
        >
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition-colors underline decoration-4 underline-offset-8">
            Contact Marcus
          </h2>
        </Link>
      </div>
    </div>
  );
}
