'use client';

/**
 * Table of Contents Component
 * Auto-generates TOC from H2/H3 headings with scroll spy
 * Client Component - requires browser APIs (DOM, IntersectionObserver)
 * FR-006, US5
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * TOCHeading type representing a heading in the table of contents
 * T050: Type definition for heading structure
 */
export interface TOCHeading {
  id: string;
  text: string;
  level: 2 | 3;
  slug: string;
  top: number;
}

interface TableOfContentsProps {
  className?: string;
}

/**
 * TableOfContents Component
 * T051: Implements TOC generation and scroll spy
 */
export function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  // Extract H2 and H3 headings from DOM on mount
  useEffect(() => {
    const articleElement = document.querySelector('article');
    if (!articleElement) return;

    const headingElements = articleElement.querySelectorAll('h2, h3');
    const extractedHeadings: TOCHeading[] = [];

    headingElements.forEach((heading) => {
      // Skip if heading is not H2 or H3
      const level = parseInt(heading.tagName.substring(1)) as 2 | 3;
      if (level !== 2 && level !== 3) return;

      // Generate ID if not present
      let id = heading.id;
      if (!id) {
        // Create slug from text content
        const slug = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        id = slug || `heading-${extractedHeadings.length}`;
        heading.id = id;
      }

      extractedHeadings.push({
        id,
        text: heading.textContent || '',
        level,
        slug: id,
        top: heading.getBoundingClientRect().top + window.scrollY,
      });
    });

    setHeadings(extractedHeadings);
  }, []);

  // Intersection Observer for scroll spy
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1.0,
      }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  // Handle smooth scroll to heading
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
      setActiveId(id);
      // Collapse on mobile after navigation
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    }
  }, []);

  // Don't render if no headings
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={`table-of-contents ${className}`}
      aria-label="Table of contents"
    >
      {/* Mobile toggle button (visible < 1024px) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 mb-4 text-sm font-semibold bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls="toc-list"
      >
        <span>Table of Contents</span>
        <svg
          className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* TOC list (collapsible on mobile, always visible on desktop) */}
      <ul
        id="toc-list"
        className={`space-y-2 ${isCollapsed ? 'hidden lg:block' : 'block'}`}
      >
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-1 text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={activeId === heading.id ? 'location' : undefined}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
