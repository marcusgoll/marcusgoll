import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/projects';
import TrackBadge from '@/components/blog/TrackBadge';
import TechStackBadge from './TechStackBadge';
import { Button } from '@/components/ui/button';
import { shimmerDataURL } from '@/lib/utils/shimmer';
import { ExternalLink, Github, Users, TrendingUp, Target } from 'lucide-react';

interface FeaturedProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * FeaturedProjectCard component - Enhanced project card for featured/flagship projects
 * - Larger layout with expanded content
 * - Metrics display (users, impact, outcome)
 * - Prominent CTAs with larger buttons
 * - Eager image loading with priority for LCP optimization (T033)
 * - Visual distinction with enhanced shadow and border
 */
export default function FeaturedProjectCard({ project, className = '' }: FeaturedProjectCardProps) {
  // Determine tech stack color schemes (same logic as ProjectCard)
  const getTechColor = (tech: string): 'frontend' | 'backend' | 'database' | 'deployment' => {
    const techLower = tech.toLowerCase();

    if (techLower.includes('next') || techLower.includes('react') ||
        techLower.includes('vue') || techLower.includes('tsx') ||
        techLower.includes('tailwind') || techLower.includes('css')) {
      return 'frontend';
    }

    if (techLower.includes('node') || techLower.includes('express') ||
        techLower.includes('fastapi') || techLower.includes('django') ||
        techLower.includes('python') || techLower.includes('typescript')) {
      return 'backend';
    }

    if (techLower.includes('postgres') || techLower.includes('mysql') ||
        techLower.includes('prisma') || techLower.includes('mongodb') ||
        techLower.includes('redis')) {
      return 'database';
    }

    if (techLower.includes('vercel') || techLower.includes('netlify') ||
        techLower.includes('aws') || techLower.includes('docker') ||
        techLower.includes('kubernetes')) {
      return 'deployment';
    }

    return 'frontend';
  };

  // Show max 6 tech badges for featured projects, with "+N more" indicator
  const visibleTech = project.techStack.slice(0, 6);
  const remainingCount = project.techStack.length - 6;

  // Metrics with icons (T031)
  const metrics = [
    {
      icon: Users,
      value: project.metrics?.users || 'N/A',
      label: 'Active Users',
      ariaLabel: `Active users: ${project.metrics?.users || 'Not available'}`
    },
    {
      icon: TrendingUp,
      value: project.metrics?.impact || 'N/A',
      label: 'Impact',
      ariaLabel: `Impact: ${project.metrics?.impact || 'Not available'}`
    },
    {
      icon: Target,
      value: project.metrics?.outcome || 'N/A',
      label: 'Outcome',
      ariaLabel: `Outcome: ${project.metrics?.outcome || 'Not available'}`
    },
  ];

  return (
    <article
      className={`group grid overflow-hidden rounded-lg border-2 border-emerald-600/30 bg-navy-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-emerald-600/50 lg:grid-cols-2 gap-0 ${className}`}
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 lg:aspect-auto lg:h-full">
        <Image
          src={project.coverImage}
          alt={`${project.title} - Featured ${project.category} project showcasing ${project.description.split('.')[0].toLowerCase()}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={shimmerDataURL(1200, 675)}
          loading="eager"
          priority={true}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 lg:p-8">
        {/* Category Badge */}
        <div className="mb-3">
          <TrackBadge track={project.category} />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold text-white group-hover:text-emerald-600 transition-colors lg:text-3xl">
          {project.title}
        </h3>

        {/* Description - No line clamp for featured projects */}
        <p className="mb-4 text-gray-300 leading-relaxed">{project.description}</p>

        {/* Tech Stack Badges */}
        <div className="mb-6 flex flex-wrap gap-2">
          {visibleTech.map((tech) => (
            <TechStackBadge
              key={tech}
              tech={tech}
              colorScheme={getTechColor(tech)}
            />
          ))}
          {remainingCount > 0 && (
            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium text-gray-400">
              +{remainingCount} more
            </span>
          )}
        </div>

        {/* Metrics Display (T031) */}
        {project.metrics && (
          <div className="mb-6 grid grid-cols-3 gap-4 border-t border-gray-700 pt-6">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center" aria-label={metric.ariaLabel}>
                <metric.icon className="mx-auto mb-2 h-5 w-5 text-emerald-600" aria-hidden="true" />
                <div className="text-2xl font-bold text-emerald-600">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons - Larger size for featured */}
        <div className="mt-auto flex gap-3">
          {project.liveUrl && (
            <Button
              variant="default"
              size="lg"
              asChild
              className="flex-1 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="outline"
              size="lg"
              asChild
              className="flex-1 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
