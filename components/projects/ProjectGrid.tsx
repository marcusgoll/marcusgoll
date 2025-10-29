import { Project } from '@/lib/projects';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

/**
 * ProjectGrid component - Displays projects in a responsive grid layout
 * Grid columns: 1 (mobile), 2 (tablet), 3 (desktop)
 * Adapted from PostGrid pattern
 */
export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>No projects found.</p>
        <p className="mt-2 text-sm">Check back soon for new projects!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
