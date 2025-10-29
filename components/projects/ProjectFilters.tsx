'use client';

import { Button } from '@/components/ui/Button';

interface ProjectFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

type FilterOption = {
  value: string;
  label: string;
  colorClass: string;
};

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'All Projects', colorClass: 'bg-gray-600 hover:bg-gray-700' },
  { value: 'aviation', label: 'Aviation', colorClass: 'bg-sky-500 hover:bg-sky-600' },
  { value: 'dev-startup', label: 'Dev/Startup', colorClass: 'bg-emerald-600 hover:bg-emerald-700' },
  { value: 'cross-pollination', label: 'Cross-pollination', colorClass: 'bg-purple-600 hover:bg-purple-700' },
];

/**
 * ProjectFilters component - Category filter buttons for projects page
 * - Client-side filtering with URL query param integration
 * - Active state with brand colors, inactive with gray outline
 * - Keyboard navigation support (Tab, Enter, Space, Arrow keys)
 * - Accessible with aria-pressed and role attributes
 */
export default function ProjectFilters({ activeFilter, onFilterChange }: ProjectFiltersProps) {
  /**
   * Handle filter button click
   * Updates active filter and triggers parent callback
   */
  const handleFilterClick = (value: string) => {
    onFilterChange(value);
  };

  /**
   * Handle keyboard navigation
   * Supports Arrow Left/Right for moving between filters
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      const prevButton = document.getElementById(`filter-${filterOptions[currentIndex - 1].value}`);
      prevButton?.focus();
    } else if (e.key === 'ArrowRight' && currentIndex < filterOptions.length - 1) {
      const nextButton = document.getElementById(`filter-${filterOptions[currentIndex + 1].value}`);
      nextButton?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label="Project category filters"
      className="mb-8 flex flex-wrap gap-3"
    >
      {filterOptions.map((filter, index) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            id={`filter-${filter.value}`}
            onClick={() => handleFilterClick(filter.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-pressed={isActive}
            className={`
              rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2
              ${
                isActive
                  ? `${filter.colorClass} text-navy-900 shadow-md`
                  : 'border border-gray-500 bg-transparent text-gray-300 hover:border-gray-400 hover:bg-gray-800/50'
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
