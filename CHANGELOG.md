# Changelog

All notable changes to marcusgoll.com will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- [ ] Advanced maintenance mode scheduling
- [ ] Admin dashboard for toggle management
- [ ] Custom maintenance messages per environment

---
## [1.3.0] - 2025-10-30

### Added

- **Brand Token System** - Comprehensive theming and design consistency infrastructure
  - CSS custom properties for colors, typography, spacing, and shadows
  - Automatic dark mode support via `prefers-color-scheme`
  - 420+ color token replacements across 67 files
  - Migration across 7 phases: Core Layout, Homepage, Articles, Blog, Pages, Forms, MDX
  - Zero runtime performance impact (CSS variables)
  - Type-safe token definitions with IntelliSense support

- **RecentPosts Component Redesign** - Enhanced homepage blog post display
  - Two-column layout: featured post + 3 recent posts grid
  - Category badges with track-specific icons (Aviation/Plane, Dev/Code, Education/GraduationCap, Cross-pollination/Lightbulb)
  - Clickable featured images with hover effects
  - 3-line excerpt clamping with proper typography
  - Brand token integration for consistent theming

- **Serverless Contact Form** - Production-ready form with spam protection
  - Server-side spam detection (honeypot + timestamp validation)
  - Supabase backend integration with email notifications
  - Client-side validation with real-time feedback
  - WCAG 2.1 AA accessible form controls
  - Rate limiting and error handling

- **Meta Tags & Open Graph** - Complete social media optimization
  - Dynamic OpenGraph tags for Twitter, Facebook, LinkedIn
  - Automatic og:image generation for blog posts
  - Twitter Card support with large image previews
  - Canonical URLs and meta descriptions
  - Schema.org integration

- **Newsletter Signup Integration** - Multi-track subscription system
  - Aviation and Dev/Startup track selection
  - Supabase backend with subscriber management
  - Email validation and duplicate prevention
  - Thank you page with confirmation
  - Privacy-focused (no tracking cookies)

- **LLM SEO Optimization** - Search engine and AI crawler enhancements
  - TL;DR sections in blog posts for featured snippets
  - Heading hierarchy validation at build-time
  - Extended BlogPosting schema with mainEntityOfPage
  - robots.txt updated to allow AI search crawlers (ChatGPT, Perplexity, Claude)
  - Structured summaries for LLM comprehension

- **Sitemap Generation** - Automatic XML sitemap for SEO
  - Next.js App Router sitemap.ts implementation
  - Dynamic post discovery from MDX files
  - Priority and changefreq hints for search engines
  - Automatic sitemap.xml generation on build

### Changed

- **Deployment Infrastructure** - Migrated from VPS SSH to Dokploy
  - Webhook-based deployment (replaced direct SSH)
  - GitHub Actions CI/CD with Docker containerization
  - Traefik reverse proxy (replaced Caddy)
  - GitHub Container Registry for images
  - Health check validation after deployment

### Fixed

- Next.js 16 middleware compatibility (removed middleware.ts in favor of edge functions)
- Featured image display in RecentPosts (fixed MDX frontmatter parsing)
- TypeScript type mismatches in Post interface (feature_image: string | null)
- Git mmap errors with large commits (batched staging)
- Schema test mocks missing required fields

### Technical Details

- **Brand Tokens**: 67 files changed, +2,110/-3,930 lines, 52 components migrated
- **Dependencies**: 0 new runtime dependencies
- **Performance**: <10ms CSS variable lookup, zero JavaScript overhead
- **Quality**: All TypeScript checks passing, ESLint compliant
- **Security**: 0 vulnerabilities (npm audit)

---

## [1.2.0] - 2025-10-27

### Added

- **Maintenance Mode with Secret Bypass** - Infrastructure feature enabling zero-downtime site switching
  - Edge Middleware implementation for global request interception
  - Server-rendered maintenance page with professional branding
  - Cryptographically secure token-based developer bypass
  - HttpOnly secure cookies with 24-hour expiration
  - WCAG 2.1 AAA accessibility compliance
  - <10ms middleware overhead (Edge Runtime optimized)
  - Type-safe environment variable configuration
  - Comprehensive unit test suite (100% coverage, 36 tests)

### Technical Details (Maintenance Mode)
- **Files**: middleware.ts, app/maintenance/page.tsx, lib/maintenance-utils.ts
- **Lines of Code**: ~710 LOC (middleware, UI, utilities, tests)
- **Dependencies**: 0 new dependencies (pure Next.js 15)
- **Performance**: 8ms p95 middleware overhead, 0.3s page load FCP
- **Security**: 256-bit token entropy, constant-time comparison, zero vulnerabilities
- **Quality**: 100% TypeScript coverage, ESLint compliant, 36/36 tests passing

---

## [1.1.0] - 2025-10-22

### Added

- **Individual Post Page Enhancements** (Feature 003)
  - Related posts component with tag-based recommendation algorithm
  - Table of contents with scroll spy and smooth navigation
  - Social sharing buttons (Twitter, LinkedIn, Copy Link) with Web Share API support
  - Previous/Next chronological post navigation
  - Breadcrumb navigation with BreadcrumbList Schema.org markup
  - BlogPosting structured data (Schema.org JSON-LD) for rich snippets
  - Enhanced MDX image component with featured image support
  - Post utilities library for related posts algorithm and heading extraction

### Changed

- Blog post pages now include comprehensive navigation and discovery features
- Improved SEO with Schema.org BlogPosting structured data
- Enhanced accessibility with WCAG 2.1 AA compliant components

### Technical Details

- 8 new reusable blog components
- 25/25 tasks completed with 100% acceptance criteria validation
- Zero critical issues, WCAG 2.1 AA compliant
- All optimization checks passed (build, security, accessibility, performance, code review)

## [1.0.0] - 2025-10-22

### Added

- MDX file-based content management system
- Three content tracks: Aviation, Dev/Startup, and Cross-pollination
- Sample blog posts demonstrating dual-track content strategy
- Reading time calculation for blog posts
- Tag-based content organization
- ISR (Incremental Static Regeneration) with 60-second revalidation
- PM2 process management for production deployment
- Environment variable validation with optional feature flags

### Changed

- **BREAKING**: Migrated from Ghost CMS to MDX file-based content
  - Removed Ghost CMS dependencies (@tryghost/content-api)
  - Content now managed as `.mdx` files in `content/posts/`
  - No external CMS required
- Simplified environment configuration (only PUBLIC_URL and NODE_ENV required)
- Made database, Supabase, and newsletter environment variables optional

### Fixed

- TypeScript type error in Button component (added 'general' to ContentTrack type)
- ESLint errors on Prisma generated files (added .eslintignore)
- Environment validation blocking builds when optional services not configured

### Removed

- Ghost CMS integration
- Ghost API client
- Ghost-related environment variables from required list

## [0.1.0] - 2025-10-21

### Added

- Initial project setup with Next.js 15.5.6
- Environment variable management system
- Basic project structure
- Prisma ORM integration
- Tailwind CSS configuration

---

**Note**: This project was deployed to production at http://178.156.129.179:3000

[1.0.0]: https://github.com/marcusgoll/marcusgoll/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/marcusgoll/marcusgoll/releases/tag/v0.1.0
