import { Metadata } from 'next';
import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import HomePageClient from '@/components/home/HomePageClient';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getAllPosts } from '@/lib/posts';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Site URL with fallback
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

// Static metadata with Open Graph and Twitter Card
export const metadata: Metadata = {
  title: 'Marcus Gollahon | Aviation & Software Development',
  description:
    'Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Marcus Gollahon | Aviation & Software Development',
    description:
      'Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.',
    url: SITE_URL,
    type: 'website',
    siteName: 'Marcus Gollahon',
    images: [
      {
        url: `${SITE_URL}/images/og/og-default.svg`,
        width: 1200,
        height: 630,
        alt: 'Marcus Gollahon - Teaching systematic thinking from 30,000 feet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@marcusgoll',
    creator: '@marcusgoll',
    title: 'Marcus Gollahon | Aviation & Software Development',
    description:
      'Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.',
    images: [`${SITE_URL}/images/og/og-default.svg`],
  },
};

/**
 * Homepage - M2 Design (Sidebar Enhanced + Magazine Masonry)
 *
 * Features:
 * - Sidebar with track filters and post counts
 * - Magazine masonry layout with CSS columns
 * - Featured post hero
 * - Mobile responsive with menu overlay
 * - Keyboard shortcuts
 */
export default async function Home() {
  // Fetch all posts
  const allPosts = await getAllPosts();

  return (
    <div className="min-h-screen">
      {/* Analytics Page View Tracking */}
      <PageViewTracker track="general" />

      {/* Hero Section */}
      <Hero />

      {/* M2 Layout (Sidebar + Magazine Masonry) */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <HomePageClient allPosts={allPosts} />
      </Suspense>
    </div>
  );
}
