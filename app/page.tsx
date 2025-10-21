import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import DualTrackShowcase from '@/components/home/DualTrackShowcase';
import Container from '@/components/ui/Container';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getPostsByTag } from '@/lib/ghost';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Static metadata
export const metadata: Metadata = {
  title: 'Marcus Gollahon | Aviation & Software Development',
  description:
    'Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.',
};

/**
 * Homepage - Dual-track content display
 * Showcases latest posts from Aviation and Dev/Startup tracks
 */
export default async function Home() {
  // Fetch latest posts from both tracks (3 per track for homepage)
  const aviationPosts = await getPostsByTag('aviation', 3);
  const devStartupPosts = await getPostsByTag('dev-startup', 3);

  return (
    <div className="min-h-screen">
      {/* Analytics Page View Tracking */}
      <PageViewTracker track="general" />

      {/* Hero Section */}
      <Hero />

      {/* Dual-Track Content Showcase */}
      <main className="py-16">
        <Container>
          <DualTrackShowcase
            aviationPosts={aviationPosts}
            devStartupPosts={devStartupPosts}
          />
        </Container>
      </main>
    </div>
  );
}
