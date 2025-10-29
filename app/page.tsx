import { Metadata } from 'next';
import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import HomePageClient from '@/components/home/HomePageClient';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getAllPosts } from '@/lib/posts';
import { generateWebsiteSchema, generateOrganizationSchema } from '@/lib/schema';

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
 * - T027, T048: Website + Organization schemas for SEO
 */
export default async function Home() {
  // Fetch all posts
  const allPosts = await getAllPosts();

  // Generate schemas for SEO (T027, T048)
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema(false); // No founder reference on homepage

  return (
    <>
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

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
    </>
  );
}
