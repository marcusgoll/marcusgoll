interface TechStackBadgeProps {
  tech: string;
  colorScheme?: 'frontend' | 'backend' | 'database' | 'deployment';
}

/**
 * TechStackBadge component - Displays technology stack badge with color-coded categories
 * Colors:
 * - Frontend: Blue (#3B82F6)
 * - Backend: Green (#10B981)
 * - Database: Purple (#9333EA)
 * - Deployment: Orange (#F97316)
 */
export default function TechStackBadge({
  tech,
  colorScheme = 'frontend'
}: TechStackBadgeProps) {
  const schemeStyles = {
    frontend: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20',
    backend: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
    database: 'bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/20',
    deployment: 'bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20',
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${schemeStyles[colorScheme]}`}
      aria-label={`Technology: ${tech}`}
    >
      {tech}
    </span>
  );
}
