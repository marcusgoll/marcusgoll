import { Project } from '@/lib/projects';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

/**
 * ProjectGrid component - Displays projects in a responsive 2-column grid
 * Grid columns: 1 (mobile), 2 (desktop)
 * Updated for sidebar layout
 */
export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p className="text-lg">No projects found.</p>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back soon for new projects!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
