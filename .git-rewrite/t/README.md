# marcusgoll.com

Personal blog and portfolio covering aviation, software development, education, and startups.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Self-hosted Supabase (PostgreSQL)
- **ORM**: Prisma
- **CMS**: Headless Ghost CMS
- **Hosting**: Hetzner VPS

## Architecture

- **marcusgoll.com** - Next.js frontend (main site)
- **ghost.marcusgoll.com** - Ghost CMS admin interface
- **api.marcusgoll.com** - Self-hosted Supabase instance

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
│   └── ghost.ts           # Ghost API client
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

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase API URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- `GHOST_API_URL` - Ghost CMS URL
- `GHOST_CONTENT_API_KEY` - Ghost Content API key

## VPS Infrastructure Setup

Infrastructure setup is in progress. See todo list for current status:

- [x] GitHub repository created
- [x] Next.js project initialized
- [x] Prisma configured
- [x] Ghost SDK installed
- [ ] VPS system updated
- [ ] Docker and dependencies installed
- [ ] Supabase deployed
- [ ] Ghost CMS deployed
- [ ] Nginx configured
- [ ] SSL certificates set up

## License

MIT

## Contributing

This is a personal project, but feedback and suggestions are welcome via GitHub issues.
