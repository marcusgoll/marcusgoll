# Project Overview

**Last Updated**: 2025-10-26
**Status**: Active

## Vision Statement

marcusgoll.com is a personal blog and portfolio that showcases Marcus Gollahon's dual-track expertise in aviation and software development/startups. The site serves as a platform for systematic thinking, technical writing, and professional branding across two complementary domains: aviation (flight training, CFI insights) and dev/startup work (software development, entrepreneurship, education technology). We exist to build an authentic online presence that demonstrates deep expertise in both fields while helping others learn through well-researched, high-quality content.

---

## Target Users

### Primary Persona: Aviation Professionals & Students

**Who**: Flight instructors, student pilots, and aviation enthusiasts seeking practical insights and training resources

**Goals**:
- Find practical flight training resources and CFI insights
- Learn from real-world aviation experiences
- Stay updated on aviation education trends
- Connect with an experienced CFI perspective

**Pain Points**:
- Generic aviation content lacking real operational experience
- Difficulty finding content that bridges theory and practice
- Need for systematic approaches to flight training
- Limited access to quality CFI perspectives online

### Secondary Persona: Developers & Startup Builders

**Who**: Software developers, technical founders, and education technology professionals

**Goals**:
- Learn about modern web development practices (Next.js, TypeScript, deployment)
- Understand systematic thinking approaches to software development
- Get insights on building education technology
- Follow someone who successfully combines technical and educational domains

**Pain Points**:
- Generic technical content without unique perspective
- Lack of real-world case studies in education technology
- Difficulty finding content on systematic development approaches
- Need for practical deployment and infrastructure guidance

### Tertiary Persona: Career Transitioners

**Who**: Professionals interested in aviation + tech career paths, or those considering combining technical and operational roles

**Goals**:
- Understand how aviation and tech skills complement each other
- Learn about career paths that combine operational and technical work
- See examples of successful domain combinations
- Get inspired by non-traditional career trajectories

---

## Core Value Proposition

**For** aviation professionals, developers, and career-minded professionals
**Who** seek deep, systematic content combining aviation expertise with technical knowledge
**The** marcusgoll.com platform
**Is a** personal blog and portfolio
**That** provides authentic, experience-based insights across aviation and software development domains with a focus on systematic thinking and education
**Unlike** single-focus blogs or generic content farms
**Our product** offers a unique dual-track perspective backed by real operational experience (CFI) and technical expertise (full-stack development)

---

## Success Metrics

**Business KPIs** (how we measure project success):

| Metric | Target | Timeframe | Measurement Source |
|--------|--------|-----------|-------------------|
| Monthly organic visitors | 1,000 | 6 months | Google Analytics 4 |
| Content engagement (avg time on page) | 3+ minutes | 3 months | GA4 behavior metrics |
| Newsletter subscribers | 100 | 6 months | Resend/Mailgun subscriber count |
| Inbound opportunities (jobs/consulting) | 2-3 | 6 months | Contact form submissions |
| Search rankings (aviation + dev keywords) | Top 20 | 12 months | Google Search Console |
| Domain authority | 20+ | 12 months | Moz/Ahrefs |

---

## Scope Boundaries

### In Scope (what we ARE building)

- **Content Platform**:
  - Blog posts (MDX format) on aviation and dev/startup topics
  - Tag-based content organization (aviation, dev-startup)
  - Reading time estimates and syntax highlighting
  - Dark mode support

- **Technical Infrastructure**:
  - Next.js 15 App Router with React 19
  - Self-hosted on Hetzner VPS with Docker
  - PostgreSQL via self-hosted Supabase
  - Multi-track newsletter system (Resend/Mailgun) - users subscribe to aviation, dev/startup, education, or all posts
  - Analytics (Google Analytics 4)

- **User Experience**:
  - Responsive design (mobile-first)
  - Fast page loads (Lighthouse score ≥ 85)
  - SEO optimization
  - Accessible UI (WCAG 2.1 AA)

- **Content Features**:
  - MDX support with interactive components
  - Code syntax highlighting
  - Reading progress indicators
  - Tag filtering and search
  - Newsletter preference management (users choose which content tracks to receive)

### Out of Scope (what we are NOT building)

- **E-commerce/Payments** - **Why**: Not monetizing directly through site (yet), focus on content and lead generation
- **User accounts/authentication** - **Why**: Public content site, no user-generated content or private areas (Supabase auth available but not currently used)
- **Comments system** - **Why**: Defer to social media engagement, avoid moderation overhead
- **Video hosting** - **Why**: Use YouTube/Vimeo embeds instead of self-hosting (bandwidth cost)
- **Multi-author platform** - **Why**: Personal blog, single author (Marcus)
- **Mobile app** - **Why**: Web-first strategy, responsive web sufficient for mobile experience
- **Advanced analytics dashboard** - **Why**: GA4 sufficient for MVP, no need for custom analytics UI
- **Multi-language support** - **Why**: English-only audience, defer internationalization

---

## Competitive Landscape

### Direct Competitors

| Product | Strengths | Weaknesses | Price | Market Position |
|---------|-----------|------------|-------|----------------|
| Personal blogs (dev.to, Medium) | Large audiences, discovery features, free hosting | Generic branding, no control, algorithmic visibility | Free | Established platforms |
| Custom developer blogs | Full control, personal branding, technical showcase | Requires maintenance, slower growth | Self-hosted ($10-50/mo) | Fragmented |
| Aviation blogs (AOPA, Bold Method) | Large aviation audiences, established authority | Generic content, no dev perspective | Free/membership | Industry leaders |

### Our Positioning

**Positioning Statement**: "marcusgoll.com is the go-to resource for professionals who value systematic thinking at the intersection of aviation and technology. We're not competing with generic content platforms or single-domain blogs—we're carving out a unique niche that appeals to multi-disciplinary professionals and those interested in non-traditional career paths."

**Competitive Advantages**:
1. **Unique Perspective**: Authentic dual-track expertise (CFI + full-stack dev) is rare and valuable
2. **Technical Showcase**: Site itself demonstrates modern web development skills (Next.js 15, Docker, VPS deployment)
3. **Systematic Thinking**: Content focuses on mental models and systematic approaches, not just tactical tips
4. **Full Control**: Self-hosted infrastructure allows complete customization and data ownership
5. **SEO Foundation**: Built with SEO-first approach (Next.js SSR, proper metadata, semantic HTML)

---

## Project Timeline

**Phases**:

| Phase | Milestone | Target Date | Status |
|-------|-----------|-------------|--------|
| Phase 0 | Infrastructure setup (VPS, Supabase, Docker) | 2025-11 | In progress |
| Phase 1 | MVP launch (5-10 posts, basic features) | 2025-12 | Not started |
| Phase 2 | Content flywheel (20+ posts, SEO traction) | 2026-03 | Not started |
| Phase 3 | Newsletter growth (100+ subscribers) | 2026-06 | Not started |

---

## Assumptions

**Critical assumptions** (if wrong, project strategy changes):

1. **Dual-track content resonates with audience** - **Validation**: GA4 engagement metrics (time on page ≥ 3 min), newsletter signups
2. **Self-hosting on VPS is cost-effective vs Vercel** - **Validation**: Monthly cost < $30 (Hetzner VPS + domain), uptime ≥ 99%
3. **Organic SEO is primary growth channel** - **Validation**: Google Search Console shows increasing organic traffic over 6 months
4. **Writing 2-4 posts/month is sustainable** - **Validation**: Maintain posting cadence for 3+ months
5. **Technical showcase (site itself) attracts opportunities** - **Validation**: Inbound messages referencing site tech stack

---

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Low organic traffic (SEO doesn't work) | High | Medium | Focus on quality over quantity, target long-tail keywords, build backlinks |
| VPS downtime/performance issues | Medium | Low | Monitoring alerts, backup hosting plan (Vercel fallback), Docker makes migration easy |
| Content creation burnout | High | Medium | Build content backlog, batch writing sessions, realistic posting schedule |
| Dual-track confuses audience | Medium | Low | Clear tag filtering, separate section pages, consistent branding per track |
| Newsletter engagement too low | Medium | Medium | Valuable lead magnets, consistent value delivery, segment by interest |

---

## Team & Stakeholders

**Core Team**:
- Product/Engineering/Content: Marcus Gollahon - Full-stack development, content creation, CFI expertise, DevOps

**As Team Grows** (future):
- Technical Writer/Editor (contract): Content editing, SEO optimization
- Designer (contract): Brand refinement, custom illustrations

**Stakeholders**:
- Readers (aviation + dev communities): Content feedback, social media engagement
- Potential employers/clients: Professional branding, technical portfolio demonstration
- Domain experts (advisors): Aviation SMEs, technical mentors for content validation

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2025-10-26 | Initial project overview created | Project initialization phase |
