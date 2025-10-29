import { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import { generateCollectionPageSchema } from '@/lib/schema';
import Container from '@/components/ui/Container';
import ProjectsClient from '@/components/projects/ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects | Marcus Gollahon',
  description:
    'Portfolio of aviation and software development projects - Flight instruction platforms, developer tools, and cross-pollination work bringing systematic thinking to both domains.',
};

// Force static generation at build time
export const dynamic = 'force-static';

/**
 * Projects Page - Portfolio showcase with category filtering
 * T010: Created projects page with SSG
 * T011: Embedded CollectionPage schema for SEO
 * T021-T023: Integrated client-side filtering with URL params
 */
export default async function ProjectsPage() {
  // Fetch all projects at build time (SSG)
  const projects = await getAllProjects();

  // Generate schema for SEO (T011)
  const collectionSchema = generateCollectionPageSchema();

  return (
    <>
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-navy-950">
        <Container className="py-16">
          {/* Page Header */}
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              A collection of my work across aviation and software development—from flight
              training platforms to developer tools, showcasing the systematic thinking
              that connects both worlds.
            </p>
          </header>

          {/* Client-side filtering wrapper (T021-T023) */}
          <ProjectsClient projects={projects} />
        </Container>
      </div>
    </>
  );
}
