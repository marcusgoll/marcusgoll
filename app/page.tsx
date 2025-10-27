import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import HomePageClient from '@/components/home/HomePageClient';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getAllPosts } from '@/lib/posts';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Static metadata
export const metadata: Metadata = {
  title: 'Marcus Gollahon | Aviation & Software Development',
  description:
    'Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.',
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
      <HomePageClient allPosts={allPosts} />
    </div>
  );
}
