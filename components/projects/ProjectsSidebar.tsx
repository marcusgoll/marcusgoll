'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsletterSubscribe from '../NewsletterSubscribe';

interface ProjectsSidebarProps {
  years: number[];
  statuses: string[];
}

/**
 * ProjectsSidebar - Left sidebar with filters and newsletter
 * Includes Status filter, Year filter, and Newsletter subscribe component
 */
export default function ProjectsSidebar({ years, statuses }: ProjectsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get('status') || 'all';
  const activeYear = searchParams.get('year') || 'all';

  const handleFilterChange = (type: 'status' | 'year', value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    const newUrl = params.toString() ? `/projects?${params.toString()}` : '/projects';
    router.push(newUrl, { scroll: false });
  };

  return (
    <aside className="space-y-6">
      {/* Status Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">
          Status
        </h3>
        <div className="space-y-3">
          {['active', 'paused', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange('status', status === 'active' && activeStatus === 'active' ? 'all' : status)}
              className="flex w-full items-center gap-3 text-left transition-colors hover:text-white"
            >
              <div className={`h-2 w-2 rounded-full ${
                activeStatus === status || (activeStatus === 'all' && status === 'active')
                  ? 'bg-emerald-500'
                  : 'border-2 border-gray-600'
              }`} />
              <span className={`text-sm capitalize ${
                activeStatus === status || (activeStatus === 'all' && status === 'active')
                  ? 'text-white'
                  : 'text-gray-400'
              }`}>
                {status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tech Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">
          Tech
        </h3>
        <div className="space-y-3">
          {['Next.js', 'Fee.4P', 'Supabase', 'Tailwind', 'Docker', 'Tailscate'].map((tech) => (
            <button
              key={tech}
              className="flex w-full items-center gap-3 text-left text-sm text-gray-400 transition-colors hover:text-white"
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Year Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">
          Year
        </h3>
        <div className="space-y-3">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleFilterChange('year', activeYear === year.toString() ? 'all' : year.toString())}
              className={`block w-full text-left text-sm transition-colors ${
                activeYear === year.toString()
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <NewsletterSubscribe />
    </aside>
  );
}
