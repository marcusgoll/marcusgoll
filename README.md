# marcusgoll.com

![Version](https://img.shields.io/badge/version-v1.3.0-blue)

Personal blog and portfolio covering aviation, software development, education, and startups.

## Features

- 🎨 **Brand Token System** - Unified theming with CSS custom properties and automatic dark mode (v1.3.0)
- 📝 **RecentPosts Component** - Enhanced homepage blog display with featured posts and category badges (v1.3.0)
- 📬 **Serverless Contact Form** - Spam-protected form with Supabase backend (v1.3.0)
- 🔗 **Meta Tags & Open Graph** - Social media optimization with dynamic og:images (v1.3.0)
- 📧 **Newsletter Signup** - Multi-track subscriptions (Aviation, Dev/Startup) (v1.3.0)
- 🤖 **LLM SEO Optimization** - AI crawler support with TL;DR sections and structured data (v1.3.0)
- 🗺️ **Sitemap Generation** - Automatic XML sitemap for search engines (v1.3.0)
- 🔒 **Maintenance Mode** - Secret bypass with edge middleware and token-based developer access (v1.2.0)
- 📄 **Individual Post Pages** - Related posts, table of contents, social sharing, breadcrumbs (v1.1.0)
- 📚 **MDX Content System** - File-based CMS with three content tracks (Aviation, Dev/Startup, Cross-pollination) (v1.0.0)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Theming**: next-themes with manual dark/light mode toggle
- **Database**: Self-hosted Supabase (PostgreSQL)
- **ORM**: Prisma
- **Content**: Markdown/MDX for blog posts
- **Newsletter**: Resend or Mailgun
- **Hosting**: Hetzner VPS

## Architecture

- **marcusgoll.com** - Next.js frontend (main site + blog)
- **api.marcusgoll.com** - Self-hosted Supabase instance (PostgreSQL + Auth)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to Hetzner VPS
- Domain configured with DNS records

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/marcusgoll/marcusgoll.git
   cd marcusgoll
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   # See docs/ENV_SETUP.md for detailed setup guide
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations (once VPS is set up):
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
marcusgoll/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   ├── prisma.ts          # Prisma client
│   ├── validate-env.ts    # Environment validation
│   └── env-schema.ts      # TypeScript env schema
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema
├── .spec-flow/            # Spec-flow workflow
├── .claude/               # Claude agent configs
└── specs/                 # Feature specifications
```

## Deployment

Deployment is managed through the spec-flow workflow:

1. Create feature specs using `/feature` command
2. Develop features locally
3. Deploy to staging with `/ship-staging`
4. Validate and deploy to production with `/ship-prod`

## Environment Variables

**Quick Start:**
```bash
cp .env.example .env.local
# Edit with your values and see docs/ENV_SETUP.md for details
```

**Required Variables (8):**
- `PUBLIC_URL` - Base URL for the application
- `NODE_ENV` - Environment mode (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase API URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
- `RESEND_API_KEY` or `MAILGUN_API_KEY` - Newsletter service API key
- `NEWSLETTER_FROM_EMAIL` - Verified sender email address

**Optional Variables (2):**
- `DIRECT_DATABASE_URL` - Direct database connection (bypasses pooling)
- `GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID

**Comprehensive Setup Guide:** See [docs/ENV_SETUP.md](docs/ENV_SETUP.md) for:
- Local development setup
- Docker Compose configuration
- Production deployment (secure transfer to VPS)
- Troubleshooting
- Security best practices

## VPS Infrastructure Setup

Infrastructure setup is in progress. See todo list for current status:

- [x] GitHub repository created
- [x] Next.js project initialized
- [x] Prisma configured
- [x] Environment variable management implemented
- [x] Docker Compose configuration created
- [x] Validation and health checks added
- [ ] VPS system updated
- [ ] Docker and dependencies installed
- [ ] Supabase deployed
- [ ] Nginx configured
- [ ] SSL certificates set up

## License

MIT

## Contributing

This is a personal project, but feedback and suggestions are welcome via GitHub issues.
