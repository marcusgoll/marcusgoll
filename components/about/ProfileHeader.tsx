import Image from 'next/image';
import Link from 'next/link';

/**
 * ProfileHeader Component
 *
 * Displays profile image with current role and tagline
 * Responsive layout: stacked on mobile, side-by-side on desktop
 */
export function ProfileHeader() {
  return (
    <div className="mb-12 pb-12 border-b border-[var(--border)]">
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        {/* Profile Image */}
        <div className="shrink-0">
          <div className="relative h-40 w-40 lg:h-48 lg:w-48 rounded-full overflow-hidden">
            <Image
              src="/images/Profile@2x.webp"
              alt="Marcus Gollahon — PSA First Officer, educator, and developer"
              fill
              sizes="192px"
              className="object-cover [mask-image:radial-gradient(circle,black_98%,transparent_100%)]"
              priority
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-black text-[var(--text)] mb-3 leading-tight">
            Marcus Gollahon
          </h1>

          <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
              ✈️ First Officer, PSA Airlines (CRJ-700/900)
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--secondary)]/10 text-[var(--secondary)]">
              💻 Developer & Educator
            </span>
          </div>

          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6 max-w-2xl">
            Building CFIPros. An ACS-aligned study guides and training tools for pilots. Current CFI and airline pilot, and developer who values procedures, clarity, and systems that work.
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              href="https://x.com/marcusgoll"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </Link>
            <Link
              href="https://linkedin.com/in/marcusgollahon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Link>
            <Link
              href="https://github.com/marcusgoll"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
