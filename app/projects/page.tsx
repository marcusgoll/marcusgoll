import { Metadata } from 'next';
import { getAllProjects, getFeaturedProjects } from '@/lib/projects';
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
 * T032: Integrated featured projects section
 */
export default async function ProjectsPage() {
  // Fetch all projects and featured projects at build time (SSG)
  const projects = await getAllProjects();
  const featuredProjects = await getFeaturedProjects();

  // Generate schema for SEO (T011)
  const collectionSchema = generateCollectionPageSchema();

  return (
    <>
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-[#0F172A]">
        <Container className="max-w-5xl py-8 md:py-16">
          {/* Page Header */}
          <header className="mb-10 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              What I'm working on
            </h1>
          </header>

          {/* Client-side filtering wrapper with sidebar layout */}
          <ProjectsClient projects={projects} />
        </Container>
      </div>
    </>
  );
}
