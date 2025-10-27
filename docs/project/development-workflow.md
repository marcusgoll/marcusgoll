# Development Workflow

**Last Updated**: 2025-10-26
**Team Size**: 1 (solo developer - Marcus)
**Related Docs**: See `deployment-strategy.md` for CI/CD, `tech-stack.md` for tools

## Team Structure

**Current Team**:
- Product/Engineering/Content: Marcus Gollahon - Full-stack development, content creation, DevOps, CFI domain expertise

**As Team Grows** (future):
- Technical Writer/Editor (contract): Content editing, proofreading, SEO optimization
- Designer (contract): Brand refinement, custom illustrations, UI improvements
- Backend Engineer (if API grows): API development, database optimization
- Frontend Engineer (if UI complexity grows): Component library, interactive features

---

## Git Workflow

**Strategy**: GitHub Flow (simplified, works for solo developer)

**Branches**:
- `main` - Production code (always deployable)
- `feature/[description]` - Feature branches (short-lived)

**Flow**:
```
main (production)
  ↑
feature/add-aviation-post (active work)
```

**Future** (when staging added):
```
main (production)
  ↑
staging (pre-production)
  ↑
feature/add-aviation-post (active work)
```

### Branch Naming

**Format**: `[type]/[short-description]`

**Types**:
- `feature/` - New features (posts, components)
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `chore/` - Maintenance (dependencies, config)

**Examples**:
- `feature/systematic-thinking-post`
- `fix/dark-mode-flash`
- `refactor/mdx-processing`
- `docs/update-readme`
- `chore/upgrade-nextjs-15`

### Creating a Feature Branch

```bash
# Start from latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/flight-training-post

# Work on feature (commit frequently)
git add content/posts/flight-training-fundamentals.mdx
git commit -m "feat: add flight training fundamentals post"

# Push to remote
git push -u origin feature/flight-training-post

# Create PR on GitHub
gh pr create --base main \
  --title "Add flight training fundamentals post" \
  --body "New aviation post covering fundamental flight training concepts"
```

---

## Pull Request Process

### Creating a PR

**Required Information**:
- **Title**: Clear, descriptive (e.g., "Add flight training fundamentals post")
- **Description**: What changed, why, screenshots (if UI)
- **Self-Review**: Checklist of items verified before PR

**PR Template** (`.github/pull_request_template.md`):
```markdown
## Summary
[Brief description of changes]

## Type of Change
- [ ] New blog post
- [ ] Feature (component, API)
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation
- [ ] Chore (dependencies, config)

## Checklist
- [ ] Content proofread (Grammarly + manual review)
- [ ] Images optimized (WebP, <500KB each)
- [ ] Links tested (no broken links)
- [ ] Local build succeeds (`npm run build`)
- [ ] Lighthouse score ≥ 85
- [ ] Mobile responsive (tested)
- [ ] Dark mode works
- [ ] No console errors
- [ ] Metadata complete (title, excerpt, tags, date)

## Screenshots (if UI change)
[Add screenshots]

## Related
- Issue: [Link if applicable]
- Spec: [Link if applicable]
```

### Code Review Requirements

**Minimum Reviews**: Self-review (solo dev)
**Required Checks**:
- ✅ Lint (ESLint)
- ✅ Type check (TypeScript)
- ✅ Build succeeds (`npm run build`)

**Self-Review Focus**:
- **Content Quality**: Grammar, clarity, accuracy (especially aviation content)
- **Technical Correctness**: Code works, no errors
- **Performance**: Lighthouse score acceptable
- **Accessibility**: Semantic HTML, alt text for images
- **Mobile**: Responsive design tested on phone

**Review Turnaround**: Immediate (self-review before merge)

### Approval & Merge

**Merge Strategy**: Squash and merge (keeps main branch clean)

**Process**:
1. Create PR
2. CI runs checks (lint, type-check, build)
3. Self-review (checklist above)
4. Address any issues found
5. **Squash and merge** to `main`
6. Auto-deploy to production (GitHub Actions)
7. Monitor deployment
8. Validate on live site

**Merge Commit Message**:
```
feat: add flight training fundamentals post

- Covers pre-flight planning, takeoff procedures, and landing patterns
- Includes diagrams for traffic patterns
- Optimized images (WebP format)
- Lighthouse score: 89

Closes #12
```

---

## Commit Conventions

**Format**: [Conventional Commits](https://www.conventionalcommits.org/)

**Structure**: `<type>(<scope>): <subject>`

**Types**:
- `feat:` - New feature (post, component)
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting (no code change)
- `refactor:` - Code refactoring
- `test:` - Adding tests (if tests added later)
- `chore:` - Maintenance (dependencies)

**Examples**:
```
feat(content): add systematic thinking for developers post
fix(ui): resolve dark mode flash on page load
docs(readme): update local development setup instructions
refactor(mdx): extract reading time calculation to utility
chore(deps): upgrade next to 15.5.6
```

**Why**: Enables semantic versioning, automatic changelog generation

---

## Development Environment Setup

**Prerequisites**:
- Node.js 20+ (LTS)
- npm (comes with Node)
- Docker Desktop (for local database)
- Git
- Code editor (VS Code or Cursor recommended)

**First-Time Setup**:
```bash
# 1. Clone repo
git clone https://github.com/marcusgoll/marcusgoll.git
cd marcusgoll

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your local database URL and API keys

# 4. Start local database (optional, if using local DB)
docker-compose up -d postgres

# 5. Generate Prisma client
npx prisma generate

# 6. Run database migrations (if using database)
npx prisma migrate dev

# 7. Start dev server
npm run dev
# Visit http://localhost:3000
```

**Onboarding Time**: ~15-20 minutes for first-time setup

---

## Code Style Guidelines

### Frontend (TypeScript/React)

**Linting**: ESLint with Next.js config
**Formatting**: Built-in (consider Prettier for future)

**Key Rules**:
- Use functional components (not class components)
- Use TypeScript (no `any` types except when absolutely necessary)
- Use `const` over `let` (immutability)
- Use semantic HTML (`<article>`, `<header>`, `<nav>`)
- Use Next.js Image component for images (optimization)

**Component Structure**:
```typescript
// Good
export function BlogPostCard({ post }: { post: Post }) {
  return (
    <article className="card">
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
    </article>
  )
}
```

**File Naming**:
- Components: `blog-post-card.tsx` (kebab-case)
- Pages: `page.tsx` (Next.js App Router convention)
- Utilities: `format-date.ts` (kebab-case)
- Types: `types.ts` or inline (TypeScript interfaces)

### Content (MDX)

**Linting**: Manual review (Grammarly for grammar)
**Formatting**: Consistent frontmatter, heading structure

**Frontmatter Structure**:
```yaml
---
title: "Post Title (Title Case)"
date: "2025-10-26"
excerpt: "Brief summary of the post (1-2 sentences)"
tags: ["aviation", "flight-training"]  # or ["dev", "nextjs", "typescript"]
track: "aviation"  # or "dev-startup"
readingTime: 8  # Auto-calculated, can override
featured: false
---
```

**Content Rules**:
- Use sentence case for headings (# Introduction, not # introduction)
- One blank line between paragraphs
- Code blocks use triple backticks with language (```typescript)
- Use relative links for internal content (`/blog/other-post`)
- Optimize images before committing (< 500KB, WebP format)
- Alt text for all images (accessibility)

---

## Testing Strategy

**Current State**: Manual testing (no automated tests yet)

**Manual Testing Checklist** (before PR merge):
- [ ] Local dev server runs without errors
- [ ] Build succeeds (`npm run build && npm run start`)
- [ ] Homepage loads
- [ ] New post appears in feed
- [ ] Post page renders correctly
- [ ] Images load
- [ ] Links work (internal and external)
- [ ] Dark mode toggle works
- [ ] Mobile responsive (test on phone or Chrome DevTools)
- [ ] No console errors
- [ ] Lighthouse score ≥ 85

**Future Testing Strategy** (if project grows):
- **Unit Tests**: Vitest for utility functions (date formatting, reading time)
- **Component Tests**: React Testing Library for UI components
- **E2E Tests**: Playwright for critical user flows (homepage load, post navigation)
- **Visual Regression**: Percy or Chromatic for UI changes

---

## Definition of Done

**Checklist before marking task complete**:

- [ ] **Code Complete**
  - [ ] Feature implemented per spec (or content written)
  - [ ] Edge cases handled (404s, empty states)
  - [ ] No TODO comments left in code

- [ ] **Quality**
  - [ ] Lint passes (`npm run lint`)
  - [ ] Type check passes (`npx tsc --noEmit`)
  - [ ] Build succeeds (`npm run build`)
  - [ ] No console errors in browser

- [ ] **Content** (if blog post):
  - [ ] Proofread (Grammarly + manual review)
  - [ ] Images optimized (<500KB, WebP)
  - [ ] Links tested (no 404s)
  - [ ] Metadata complete (title, excerpt, tags, date)
  - [ ] Reading time reasonable (auto-calculated, verify)

- [ ] **Performance**
  - [ ] Lighthouse score ≥ 85 (Performance, Accessibility, Best Practices, SEO)
  - [ ] Images lazy-loaded (below fold)
  - [ ] No layout shift (CLS < 0.1)

- [ ] **Accessibility**
  - [ ] Semantic HTML
  - [ ] Alt text for images
  - [ ] Keyboard navigation works
  - [ ] Color contrast sufficient (WCAG AA)

- [ ] **Mobile**
  - [ ] Responsive design (tested on phone or DevTools)
  - [ ] Touch targets ≥ 44px (buttons, links)
  - [ ] No horizontal scroll

- [ ] **Deployment**
  - [ ] PR created with clear description
  - [ ] CI checks pass
  - [ ] Self-reviewed (checklist above)
  - [ ] Merged to `main`
  - [ ] Deployment successful (monitored)
  - [ ] Validated on live site

**Only merge PR when all boxes checked**

---

## Issue Tracking

**Tool**: GitHub Issues + Projects (Kanban board)
**Board**: Kanban (Backlog → In Progress → Done)

**Issue Labels**:
- `type:content` - Blog post, content update
- `type:feature` - New feature (component, API)
- `type:bug` - Bug fix
- `type:chore` - Maintenance (dependencies, config)
- `type:docs` - Documentation
- `priority:high` - Urgent
- `priority:medium` - Normal
- `priority:low` - Nice-to-have
- `track:aviation` - Aviation content
- `track:dev` - Dev/startup content

**Issue Template** (content):
```markdown
## Post Topic
[Describe the blog post topic]

## Key Points
- [Point 1]
- [Point 2]
- [Point 3]

## Target Word Count
[e.g., 1,500-2,000 words]

## Target Date
[When to publish]

## Related
- Similar posts: [Links]
- External references: [Links]
```

---

## Content Creation Workflow

**Process for new blog posts**:

1. **Ideation**:
   - Brainstorm topics (aviation or dev/startup)
   - Research keywords (Google Trends, Ahrefs)
   - Create GitHub Issue with outline

2. **Writing**:
   - Create feature branch: `feature/[post-slug]`
   - Create MDX file: `content/posts/[slug].mdx`
   - Write content (aim for 1,500+ words)
   - Add frontmatter (title, date, excerpt, tags)
   - Add images (optimize to WebP, <500KB)

3. **Review**:
   - Proofread with Grammarly
   - Check facts (especially aviation content - accuracy critical)
   - Test links (no 404s)
   - Run local dev server, preview post

4. **Publish**:
   - Create PR with checklist
   - Self-review (Definition of Done)
   - Merge to `main` (auto-deploys)
   - Share on social media (Twitter/X, LinkedIn)

5. **Promote**:
   - Share in relevant communities (Reddit, Hacker News if suitable)
   - Add to newsletter (if applicable)
   - Monitor analytics (GA4)

**Cadence**: 2-4 posts per month (sustainable pace)

---

## Release Process

**Cadence**: Continuous deployment (every merge to `main`)
**Versioning**: Semantic versioning (MAJOR.MINOR.PATCH) via Git tags

**Release Workflow**:
- Each production deploy auto-tagged with version (via GitHub Actions)
- Version format: `v1.2.3`
- Changelog generated from commit messages (Conventional Commits)

**Hotfix Process** (for critical bugs):
1. Create hotfix branch from `main`: `fix/critical-bug`
2. Fix bug
3. Create PR, fast-track review
4. Merge to `main` (auto-deploys)
5. Monitor deployment closely

---

## Communication

**Current** (solo developer):
- GitHub Issues for task tracking
- Commit messages for change documentation
- Self-documentation in code comments

**Future** (if team grows):
- **Daily Standups**: Async in Slack (what working on, blockers)
- **Weekly Planning**: Prioritize tasks for week
- **Retrospectives**: Monthly (what went well, improvements)
- **Tools**: Slack, GitHub Discussions

---

## Onboarding New Developers (Future)

**Checklist for new team members**:

**Day 1**:
- [ ] Access to GitHub repo
- [ ] Read README, CONTRIBUTING.md, this doc
- [ ] Setup local development environment
- [ ] Run app locally, explore codebase
- [ ] Review recent commits (understand code style)

**Week 1**:
- [ ] Make first contribution (small fix or docs improvement)
- [ ] Review a PR (understand review process)
- [ ] Write a small blog post or edit existing
- [ ] Understand deployment workflow

**Month 1**:
- [ ] Ship first feature to production
- [ ] Understand full stack (Next.js, Prisma, Docker, VPS)
- [ ] Understand content strategy (aviation + dev dual-track)

---

## Tools & Subscriptions

**Development**:
- GitHub (version control, CI/CD) - Free (public repo)
- VS Code / Cursor (IDE) - Free
- Docker Desktop (local database) - Free (personal use)
- Grammarly (grammar checking) - Free tier

**Monitoring**:
- Google Analytics 4 (site analytics) - Free
- UptimeRobot (uptime monitoring) - Free tier
- Better Stack (future, if needed) - Free tier

**Content Creation**:
- Grammarly - Free tier
- Figma (future, if designs needed) - Free tier
- Canva (image editing, graphics) - Free tier

**Communication** (if team grows):
- Slack (team chat) - Free tier

**Cost**: ~$0/mo for tools (infra costs separate, see capacity-planning.md)

---

## Best Practices

### Code Reviews (Solo Dev)

**Self-Review Checklist**:
- Read through all changes (pretend you're reviewing someone else's code)
- Check for typos, grammar errors (content)
- Verify no debug code left (console.log, commented code)
- Ensure commit messages follow conventions
- Test on mobile (responsive design)
- Check dark mode (theme toggle)

### Content Quality

**Aviation Content**:
- Double-check facts (aviation regulations, procedures)
- Cite sources (FAA handbooks, AIM, ACS)
- Avoid jargon without explanation
- Add personal insights (CFI experience)

**Dev Content**:
- Test all code examples (actually run them)
- Link to official docs (Next.js, React, etc.)
- Explain why, not just how
- Real-world examples from this project

### Performance

**Monitor**:
- Lighthouse score (≥ 85 target)
- Bundle size (keep < 200KB initial load)
- Image sizes (< 500KB each)
- Page load time (< 1.5s FCP)

**Optimize**:
- Use Next.js Image component (automatic optimization)
- Lazy load below-fold content
- Minimize JavaScript (use Server Components where possible)
- Cache static assets (Cloudflare CDN when added)

---

## Change Log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2025-10-26 | Initial development workflow | Project initialization | Baseline for team processes |
| 2025-10-26 | GitHub Flow chosen | Solo dev, simple workflow | Fast iteration, minimal overhead |
| 2025-10-26 | Conventional Commits adopted | Semantic versioning, changelogs | Better release management |
