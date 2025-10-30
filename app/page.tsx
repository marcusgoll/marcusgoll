import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import WhatImBuilding from '@/components/home/WhatImBuilding';
import RecentPosts from '@/components/home/RecentPosts';
import Newsletter from '@/components/home/Newsletter';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getAllPosts } from '@/lib/posts';
import { generateWebsiteSchema, generateOrganizationSchema } from '@/lib/schema';

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

        {/* What I'm Building Section */}
        <WhatImBuilding />

        {/* Recent Posts Section */}
        <RecentPosts posts={allPosts} />

        {/* Newsletter Section */}
        <Newsletter />

        {/* Contact Section */}
        <ContactSection />

      </div>
    </>
  );
}
