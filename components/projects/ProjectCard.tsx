import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/projects';
import TrackBadge from '@/components/blog/TrackBadge';
import TechStackBadge from './TechStackBadge';
import { Button } from '@/components/ui/Button';
import { shimmerDataURL } from '@/lib/utils/shimmer';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * ProjectCard component - Displays a project card with screenshot,
 * title, description, tech stack badges, and action buttons
 * Adapted from PostCard pattern
 */
export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  // Determine tech stack color schemes
  const getTechColor = (tech: string): 'frontend' | 'backend' | 'database' | 'deployment' => {
    const techLower = tech.toLowerCase();

    // Frontend technologies
    if (techLower.includes('next') || techLower.includes('react') ||
        techLower.includes('vue') || techLower.includes('tsx') ||
        techLower.includes('tailwind') || techLower.includes('css')) {
      return 'frontend';
    }

    // Backend technologies
    if (techLower.includes('node') || techLower.includes('express') ||
        techLower.includes('fastapi') || techLower.includes('django') ||
        techLower.includes('python') || techLower.includes('typescript')) {
      return 'backend';
    }

    // Database technologies
    if (techLower.includes('postgres') || techLower.includes('mysql') ||
        techLower.includes('prisma') || techLower.includes('mongodb') ||
        techLower.includes('redis')) {
      return 'database';
    }

    // Deployment technologies
    if (techLower.includes('vercel') || techLower.includes('netlify') ||
        techLower.includes('aws') || techLower.includes('docker') ||
        techLower.includes('kubernetes')) {
      return 'deployment';
    }

    return 'frontend'; // default
  };

  // Show max 4 tech badges, with "+N more" indicator
  const visibleTech = project.techStack.slice(0, 4);
  const remainingCount = project.techStack.length - 4;

  return (
    <article
      className={`group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-lg hover:border-gray-300 ${className}`}
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={project.coverImage}
          alt={`${project.title} screenshot showing ${project.category} project interface`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={shimmerDataURL(1200, 675)}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <TrackBadge track={project.category} />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-navy-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-3 text-gray-800 line-clamp-2">{project.description}</p>

        {/* Tech Stack Badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {visibleTech.map((tech) => (
            <TechStackBadge
              key={tech}
              tech={tech}
              colorScheme={getTechColor(tech)}
            />
          ))}
          {remainingCount > 0 && (
            <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-500">
              +{remainingCount} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.liveUrl && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="flex-1 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Live Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="mr-1.5 h-3.5 w-3.5" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
