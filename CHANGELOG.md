# Changelog

All notable changes to marcusgoll.com will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
