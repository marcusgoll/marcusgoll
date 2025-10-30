import { cn } from '@/lib/utils';

interface RetroGridProps {
  className?: string;
  angle?: number;
}

/**
 * RetroGrid - Retro-style perspective grid background
 * Creates a classic 80s-style grid that recedes into the distance
 */
export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-50 [perspective:200px]',
        className
      )}
      style={{ '--grid-angle': `${angle}deg` } as React.CSSProperties}
    >
      {/* Perspective grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            'animate-grid',
            '[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]',
            // Light mode gradient mesh
            '[background-image:linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]',
            // Dark mode with emerald glow
            'dark:[background-image:linear-gradient(to_right,rgba(16,185,129,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(16,185,129,0.3)_1px,transparent_0)]',
            // Subtle gradient overlay for depth
            'after:absolute after:inset-0 after:bg-gradient-to-t after:from-white after:via-transparent after:to-transparent',
            'dark:after:from-gray-900'
          )}
        />
      </div>

      {/* Horizon glow line */}
      <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
    </div>
  );
}
