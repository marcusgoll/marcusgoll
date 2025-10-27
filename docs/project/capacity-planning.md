# Capacity Planning

**Last Updated**: 2025-10-26
**Related Docs**: See `system-architecture.md` for components, `tech-stack.md` for infrastructure choices

## Current Scale (MVP Baseline)

**Users**: 500-1,000 monthly visitors (initial target)
**Requests**: ~5,000-10,000/month (5-10 pageviews per visitor)
**Storage**: 2GB (MDX content, images, database)
**Database**: < 100MB (minimal usage, mostly filesystem MDX)
**Budget**: $25-35/mo total

**Cost Breakdown**:
- Hetzner VPS (CX21): €20/mo (~$22/mo)
- Domain (marcusgoll.com): ~$12/year (~$1/mo)
- Resend/Mailgun: $0 (free tier, <3K emails/mo)
- Google Analytics: $0 (free)
- **Total**: ~$23-25/mo

**Infrastructure**:
- VPS: Hetzner CX21 (2 vCPU, 4GB RAM, 40GB SSD)
- Next.js: Single Docker container (port 3000)
- Supabase: Docker container (PostgreSQL + Auth)
- Caddy: Reverse proxy + automatic SSL/TLS with Let's Encrypt
- No CDN (yet)

**Constraints**:
- Single VPS instance (no horizontal scaling)
- Static site generation (no edge network)
- Limited to VPS bandwidth (20TB/mo Hetzner standard)
- No caching layer beyond Next.js built-in

---

## Growth Projections

### Tier 1: 10x Growth (1K → 10K monthly visitors)

**Timeline**: 6-12 months (via SEO and content flywheel)
**Triggers**:
- Monthly visitors > 8,000 (80% of capacity)
- Page load time p95 > 2s
- VPS CPU usage > 70% sustained
- Bandwidth > 15TB/mo

**Infrastructure Changes**:

| Component | Current | New | Cost Change |
|-----------|---------|-----|-------------|
| VPS | CX21 (2 vCPU, 4GB) | CX31 (2 vCPU, 8GB) or stay | +€10/mo (~$11) or $0 |
| CDN | None | Cloudflare (free tier) | $0 |
| Images | Filesystem | Cloudflare R2 or keep local | $0-5/mo |
| Monitoring | None | UptimeRobot + Better Stack | $0 (free tiers) |

**Total New Cost**: $25/mo → $30-40/mo (+$5-15/mo, +20-60%)

**Capacity**:
- Handles 100,000 req/month (10K visitors × 10 pageviews)
- 500GB bandwidth (well under 20TB limit)
- Cloudflare caching reduces origin traffic by 80-90%

**Optimizations Needed**:
- Add Cloudflare CDN (cache static assets, images)
- Enable Next.js ISR (Incremental Static Regeneration) for frequent updates
- Compress images (WebP format, responsive sizes)
- Add Redis caching (if dynamic queries added)

**Bottlenecks**:
- Static builds may get slow with 50+ posts (migrate to ISR or DB-driven)

---

### Tier 2: 100x Growth (1K → 100K monthly visitors)

**Timeline**: 18-36 months (viral content, strong SEO, potential press)
**Triggers**:
- Monthly visitors > 80,000 (80% of Tier 1 capacity)
- CDN cache hit ratio < 70% (too many dynamic requests)
- VPS CPU > 80% sustained
- Database queries > 1,000/min

**Infrastructure Changes**:

| Component | Tier 1 | Tier 2 | Cost Change |
|-----------|--------|--------|-------------|
| VPS | CX31 (8GB) | CX41 (16GB) or multi-instance | +€20/mo (~$22) |
| CDN | Cloudflare Free | Cloudflare Pro or Bunny CDN | +$20/mo |
| Database | Self-hosted Supabase | Managed Supabase or scale VPS | +$25/mo or $0 |
| Monitoring | Free tier | Paid monitoring (Better Stack) | +$10/mo |
| Backups | VPS backup | Automated offsite backups | +$5/mo |

**Total New Cost**: $40/mo → $120-150/mo (+$80-110/mo, +200-275%)

**Capacity**:
- Handles 1,000,000 req/month (100K visitors × 10 pageviews)
- Multi-region CDN (Cloudflare global network)
- Database handles 100K+ records (posts, subscribers, analytics)

**Architecture Changes**:
- **Content Migration**: MDX files → Database or headless CMS (Contentful, Sanity)
- **Image CDN**: Cloudflare R2 or Bunny CDN for all images
- **Caching**: Redis for expensive queries (popular posts, tag clouds)
- **Monitoring**: APM tool (Better Stack, New Relic) for performance tracking

**Bottlenecks**:
- VPS bandwidth (20TB) may be reached if not caching properly
- Single VPS instance (consider multi-instance or Vercel migration)

---

### Tier 3: 1000x Growth (1K → 1M monthly visitors)

**Timeline**: 3-5 years (unlikely for personal blog, but possible if viral)
**Triggers**:
- Monthly visitors > 800,000
- Revenue justifies infrastructure investment (ads, sponsorships, products)
- International audience (need multi-region)

**Infrastructure Changes**:

| Component | Tier 2 | Tier 3 | Cost Change |
|-----------|--------|--------|-------------|
| Hosting | Single VPS | Vercel Edge or multi-region VPS | +$150-300/mo |
| CDN | Cloudflare Pro | Multi-CDN (Cloudflare + Bunny) | +$50/mo |
| Database | Self-hosted or Managed | Distributed database (Supabase scale or Planetscale) | +$100-200/mo |
| Content | CMS or DB | Headless CMS (Contentful, Sanity) | +$50-100/mo |
| Monitoring | Better Stack | Full observability (Datadog, New Relic) | +$100/mo |
| Email | Resend free tier | Resend paid or SendGrid | +$20-50/mo |

**Total New Cost**: $150/mo → $620-950/mo (+$470-800/mo, +313-533%)

**Capacity**:
- Handles 10,000,000 req/month (1M visitors × 10 pageviews)
- Multi-region deployment (US, EU, Asia)
- Sub-500ms global latency

**Architecture Changes**:
- **Migrate to Vercel Edge** or multi-region VPS cluster
- **Microservices** (if complexity requires): Separate content API, analytics API
- **Multi-CDN**: Cloudflare + Bunny CDN (failover, geo-routing)
- **Database sharding** (if analytics heavy): Separate OLAP database (ClickHouse)

**Bottlenecks**:
- Cost optimization becomes critical (engineer time spent on infrastructure cost reduction)
- May need dedicated DevOps/SRE engineer

---

## Resource Estimates

### Compute (Next.js)

**Current**:
- 1 Docker container: 1GB RAM, 1 vCPU
- Handles ~5 concurrent users (typical blog traffic pattern)

**Formula**: Concurrent users = (vCPU × efficiency_factor) / avg_response_time
- Efficiency factor: 0.5 (conservative for SSR)
- Avg response time: 100ms (static pages fast)

**Example Calculation**:
- 1 vCPU × 0.5 / 0.1s = 5 concurrent users
- For 50 concurrent users → need 10 vCPUs or better caching (Cloudflare reduces to 5-10 origin requests)

### Storage

**Current**: 2GB (content + database)

**Formula**: Total storage = (post_count × avg_post_size) + images + database

**Example**:
- Avg post size: 10KB MDX + 500KB images = 510KB
- 10 posts: 10 × 510KB = 5MB
- 50 posts: 50 × 510KB = 25MB
- 200 posts: 200 × 510KB = 100MB
- Database: +100MB (subscribers, analytics)

**Growth Rate**: ~500KB per post (1-2 posts/week = 2-4MB/mo)

**VPS Capacity**:
- CX21 (40GB): Can hold 200+ posts + images easily
- CX31 (80GB): 400+ posts
- CX41 (160GB): 800+ posts

### Bandwidth

**Current**: ~10GB/month (1,000 visitors × 2MB per visit)

**Formula**: Monthly bandwidth = visitors × pages_per_visit × avg_page_size

**Example**:
- Avg page size: 200KB (HTML + CSS + JS + images, no CDN)
- 1,000 visitors × 10 pages × 200KB = 2GB/month
- 10,000 visitors × 10 pages × 200KB = 20GB/month
- 100,000 visitors × 10 pages × 200KB = 200GB/month

**With Cloudflare CDN** (80% cache hit):
- 100,000 visitors → 40GB origin bandwidth (160GB cached at edge)

**VPS Limit**: Hetzner provides 20TB/month (20,000GB) → plenty of headroom

---

## Cost Model

### Cost Per Visitor

**Tier 1** (10,000 visitors/month):
- Total cost: $40/mo
- Cost per visitor: $0.004/mo (~$0.05/year)

**Tier 2** (100,000 visitors/month):
- Total cost: $150/mo
- Cost per visitor: $0.0015/mo (~$0.018/year)

**Tier 3** (1,000,000 visitors/month):
- Total cost: $800/mo
- Cost per visitor: $0.0008/mo (~$0.01/year)

**Economics**: Cost per visitor decreases with scale (economies of scale from CDN caching)

### Revenue Targets

**Monetization Strategy** (future):
- Sponsorships: $500-1,000/mo at 10K visitors
- Affiliate links: $100-300/mo
- Digital products (courses, ebooks): $500-2,000/mo

**Break-Even**:
- Tier 1 ($40/mo cost): $40/mo revenue (achievable at 10K visitors)
- Tier 2 ($150/mo cost): $150/mo revenue (achievable at 50K-100K visitors)

**Healthy Margin** (5x cost coverage):
- Tier 1: $200/mo revenue → 80% margin
- Tier 2: $750/mo revenue → 80% margin

---

## Performance Targets by Tier

| Metric | Tier 0 (MVP) | Tier 1 (10K) | Tier 2 (100K) | Tier 3 (1M) |
|--------|--------------|--------------|---------------|-------------|
| Page load (FCP) | < 1.5s | < 1.2s | < 1s | < 800ms |
| Time to Interactive | < 3s | < 2.5s | < 2s | < 1.5s |
| Lighthouse score | ≥ 85 | ≥ 90 | ≥ 95 | ≥ 95 |
| Uptime | 99% | 99.5% | 99.9% | 99.95% |
| API response (p95) | < 500ms | < 400ms | < 300ms | < 200ms |

---

## Scaling Triggers

**When to Scale**: Proactive scaling at 80% capacity threshold

| Trigger | Action | Lead Time |
|---------|--------|-----------|
| CPU > 70% for 1 hour | Upgrade VPS tier | 1 week |
| Traffic > 8K visitors/mo | Add Cloudflare CDN | Immediate (free) |
| Page load p95 > 2s | Enable ISR, optimize images | 1 week |
| Storage > 30GB (CX21) | Upgrade to CX31 (80GB) | 1 week |
| Bandwidth > 15TB/mo | Check CDN cache hit ratio | Immediate |

**Auto-Scaling**: Not available on single VPS (manual scaling only)

---

## Disaster Scenarios

### Scenario 1: Viral Traffic Spike (10x overnight)

**Cause**: Post goes viral on Hacker News, Reddit, or social media
**Impact**:
- 10,000 visitors in 24 hours (vs 1,000/month)
- VPS CPU maxed out
- Slow page loads (5-10s)
- Potential downtime if overwhelmed

**Response**:
1. **Immediate** (0-30 min):
   - Enable Cloudflare CDN (if not already) → reduces origin traffic 80%
   - Enable "Under Attack" mode if DDoS-like traffic
   - Monitor VPS metrics (CPU, RAM, bandwidth)

2. **Short-term** (1-4 hours):
   - Upgrade VPS tier (CX21 → CX31 or CX41) via Hetzner panel (5-10 min downtime)
   - Optimize slow pages (add caching headers, lazy load images)

3. **Long-term** (1-3 days):
   - Analyze traffic patterns (which pages most popular)
   - Optimize those pages (ISR, better caching)
   - Add monitoring alerts for future spikes

**Cost**: +€10-20/mo during spike (can downgrade after traffic normalizes)

### Scenario 2: VPS Failure

**Impact**: Total site outage
**Recovery Time**: 1-4 hours (restore from backup)
**Data Loss**: Up to 24 hours (last backup)

**Response**:
1. **Immediate**: Check Hetzner status page, contact support
2. **Restore**: Deploy to new VPS from backup (Docker Compose + DB backup)
3. **Validate**: Test site functionality, check DNS
4. **Post-mortem**: Document incident, improve monitoring

---

## Optimization Opportunities

### Current (MVP) Optimizations

**Low-hanging fruit** (implement before Tier 1):
1. **Enable Cloudflare CDN**: Free tier, 80%+ cache hit rate → +50% faster global loads
2. **Image optimization**: WebP format, responsive sizes → -50% image bandwidth
3. **Lazy loading**: Below-fold images load on scroll → -30% initial page weight
4. **Compression**: Brotli/Gzip for text assets → -70% HTML/CSS/JS size

**ROI**: High (minimal cost, significant performance gain)

### Tier 1 Optimizations

**As traffic grows**:
1. **ISR (Incremental Static Regeneration)**: Rebuild pages on-demand → faster deploys with frequent updates
2. **Redis caching**: Cache popular post queries → +90% faster dynamic data
3. **Database indexing**: Add indexes for common queries → +80% faster queries
4. **Monitoring**: UptimeRobot + Better Stack → proactive alerts

**ROI**: Medium (some cost, good performance/reliability gain)

---

## Breaking Points

**What fails first at each tier:**

**Tier 0 → Tier 1**:
- **First to break**: VPS CPU (static generation + SSR)
- **Symptom**: Page loads > 3s
- **Fix**: Add Cloudflare CDN (+$0), or upgrade VPS (+€10/mo)

**Tier 1 → Tier 2**:
- **First to break**: Static build time (50+ posts)
- **Symptom**: Deployments take > 5 minutes
- **Fix**: Migrate to ISR or database-driven content

**Tier 2 → Tier 3**:
- **First to break**: Single VPS capacity (CPU, bandwidth)
- **Symptom**: Slow global loads (>2s in Asia/Australia)
- **Fix**: Multi-region deployment (Vercel Edge or multi-VPS) or heavy CDN reliance

---

## Monitoring & Alerts

**Metrics to Track**:

| Metric | Tool | Alert Threshold |
|--------|------|----------------|
| Uptime | UptimeRobot | < 99% (downtime alert) |
| Page load time | Google Analytics (Core Web Vitals) | FCP > 2s |
| VPS CPU | Hetzner console or custom script | > 80% for 1 hour |
| VPS RAM | Hetzner console | > 90% |
| VPS Disk | Hetzner console | > 80% capacity |
| Traffic | Google Analytics | > 8K visitors/mo (Tier 1 trigger) |

**Alert Channels**:
- Critical (downtime): Email + SMS (UptimeRobot)
- Warning (performance): Email
- Info (traffic milestone): Email

---

## Change Log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2025-10-26 | Initial capacity plan | Project initialization | Baseline for scaling decisions |
| 2025-10-26 | Defined 3 growth tiers (10x, 100x, 1000x) | Predictable scaling path | Clear triggers for infrastructure upgrades |
