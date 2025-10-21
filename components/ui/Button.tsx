import { ButtonHTMLAttributes, ReactNode } from 'react';
import { trackContentTrackClick } from '@/lib/analytics';

type ContentTrack = 'aviation' | 'dev-startup' | 'cross-pollination';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  track?: ContentTrack;
  analyticsLocation?: string;
}

/**
 * Button component - Reusable button with multiple variants
 * Variants: primary (Emerald 600), secondary (Navy 900), outline (border only)
 * Sizes: sm, md (default), lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  track,
  analyticsLocation,
  onClick,
  ...props
}: ButtonProps) {
  // Handle click with optional analytics tracking
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track analytics if track and location provided
    if (track && analyticsLocation) {
      trackContentTrackClick({ track, location: analyticsLocation });
    }

    // Call original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  // Base styles
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant styles
  const variantStyles = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600 disabled:bg-emerald-300',
    secondary:
      'bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-900 disabled:bg-gray-400',
    outline:
      'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white focus:ring-navy-900 disabled:border-gray-300 disabled:text-gray-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Disabled styles
  const disabledStyles = disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
