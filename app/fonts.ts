import { Work_Sans, JetBrains_Mono } from 'next/font/google';

/**
 * Font optimization using Next.js Font API
 * - Automatically self-hosts Google Fonts (eliminates external requests)
 * - Enables font-display: swap (prevents FOIT/FOUT)
 * - Subsets to latin characters only (reduces file size)
 * - Exports as CSS variables for Tailwind integration
 */

export const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
  weight: ['300', '400', '500', '600', '700'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
});
