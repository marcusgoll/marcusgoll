'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Project } from '@/lib/projects';
import ProjectFilters from './ProjectFilters';
import ProjectGrid from './ProjectGrid';

interface ProjectsClientProps {
  projects: Project[];
}

/**
 * ProjectsClient - Client-side wrapper for projects page
 * Handles category filtering with URL query params
 * - Reads ?category=aviation from URL
 * - Updates URL on filter change
 * - Filters projects client-side
 * - Shows empty state if no projects match
 * - Announces filter changes to screen readers (T022)
 */
export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active filter from URL query param, default to 'all'
  const activeFilter = searchParams.get('category') || 'all';

  // State for screen reader announcement (T022)
  const [announcement, setAnnouncement] = useState('');

  /**
   * Handle filter change
   * Updates URL with new category query param
   * Maintains SSG benefits while enabling client-side filtering
   */
  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === 'all') {
      params.delete('category');
    } else {
      params.set('category', filter);
    }

    const newUrl = params.toString() ? `/projects?${params.toString()}` : '/projects';
    router.push(newUrl);
  };

  /**
   * Filter projects based on active category
   * 'all' shows all projects, otherwise filters by category match
   */
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  /**
   * Update screen reader announcement when filter changes (T022)
   */
  useEffect(() => {
    const filterLabel = activeFilter === 'all' ? 'All Projects'
      : activeFilter === 'aviation' ? 'Aviation'
      : activeFilter === 'dev-startup' ? 'Dev/Startup'
      : 'Cross-pollination';

    setAnnouncement(`${filterLabel} filter active, showing ${filteredProjects.length} projects`);
  }, [activeFilter, filteredProjects.length]);

  return (
    <>
      {/* Screen reader announcement for filter changes (T022) */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Category Filters */}
      <ProjectFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-xl text-gray-400">
            No projects found in this category.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Try selecting a different filter or browse all projects.
          </p>
        </div>
      )}
    </>
  );
}
