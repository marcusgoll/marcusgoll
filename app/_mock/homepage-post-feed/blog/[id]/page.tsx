'use client';
export const dynamic = 'force-dynamic';


import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Container from '@/components/ui/Container';

type Post = {
  id: number;
  title: string;
  track: 'Aviation' | 'Dev/Startup' | 'Cross-pollination';
  excerpt: string;
  date: string;
  content: string;
  featured: boolean;
  hasImage: boolean;
};

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Systematic Thinking in Aviation Safety',
    track: 'Aviation',
    excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.',
    date: 'Oct 15, 2025',
    featured: true,
    hasImage: true,
    content: `
# Systematic Thinking in Aviation Safety

Commercial aviation is one of the safest forms of transportation, with an accident rate of approximately 0.0000013% per flight. This remarkable safety record isn't accidental—it's the result of decades of systematic thinking, rigorous analysis, and cultural commitment to continuous improvement.

## The Culture of Safety

Aviation safety culture is built on three foundational principles:

1. **Just Culture**: Encouraging reporting without fear of punishment
2. **Continuous Learning**: Every incident becomes a learning opportunity
3. **Systematic Redundancy**: Multiple backup systems for critical functions

### Crew Resource Management

CRM training teaches pilots to communicate effectively, manage workload, and make decisions under pressure. These same principles apply directly to software engineering teams:

- **Assertiveness**: Junior engineers should feel empowered to question senior decisions
- **Workload Management**: Distribute tasks to prevent cognitive overload
- **Decision Making**: Use structured frameworks for critical choices

## Incident Analysis

Every aviation incident undergoes thorough investigation. The NTSB uses a systematic approach:

1. Document the facts
2. Identify contributing factors
3. Determine root causes
4. Develop recommendations
5. Track implementation

Software teams can adopt this same rigor for post-mortems.

## Lessons for Software Engineering

The aviation industry's systematic approach offers valuable lessons:

- **Checklists prevent errors**: Pre-flight checks → code review checklists
- **Redundancy ensures reliability**: Backup systems → failover infrastructure
- **Culture matters**: Just culture → blameless post-mortems
- **Training is continuous**: Recurrent training → ongoing education

## Conclusion

By studying how aviation achieves extraordinary safety through systematic thinking, software engineers can build more reliable, resilient systems. The principles are universal—only the domain changes.
    `.trim(),
  },
  {
    id: 2,
    title: 'Scalable Architecture Patterns',
    track: 'Dev/Startup',
    excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.',
    date: 'Oct 14, 2025',
    featured: false,
    hasImage: false,
    content: `
# Scalable Architecture Patterns

Scaling from 0 to 100,000 users requires different architectural decisions at each stage. This guide covers the patterns that actually matter.

## Stage 1: 0-1,000 Users (Monolith)

Start simple. A well-structured monolith is easier to understand, deploy, and debug than a distributed system.

**Architecture:**
- Single application server
- Single database (PostgreSQL/MySQL)
- Basic caching (Redis)
- CDN for static assets

**Why this works:**
- Fast development velocity
- Simple deployment
- Easy debugging
- Sufficient for most early-stage products

## Stage 2: 1,000-10,000 Users (Vertical Scaling)

Before going distributed, scale vertically. Modern cloud instances can handle surprising load.

**Improvements:**
- Upgrade server instances
- Add read replicas for database
- Implement application-level caching
- Queue background jobs

## Stage 3: 10,000-100,000 Users (Horizontal Scaling)

Now consider horizontal scaling and service decomposition.

**Architecture evolution:**
- Load-balanced application servers
- Database sharding or managed services
- Async job processing (Kafka/RabbitMQ)
- API gateway
- Microservices for specific domains

## Key Patterns

### Caching Strategy
1. Cache at multiple layers
2. Use cache-aside pattern
3. Set appropriate TTLs
4. Monitor cache hit rates

### Database Scaling
1. Read replicas first
2. Connection pooling
3. Query optimization
4. Denormalization when needed

### Async Processing
1. Queue heavy operations
2. Idempotent job processing
3. Dead letter queues
4. Monitor queue depth

## Common Mistakes

- Premature optimization
- Over-engineering for imagined scale
- Ignoring database indexes
- Not monitoring before scaling

## Conclusion

Scale iteratively. Start simple, measure everything, and evolve your architecture based on real bottlenecks, not imagined ones.
    `.trim(),
  },
  {
    id: 3,
    title: 'Human Factors in Cockpit Design',
    track: 'Cross-pollination',
    excerpt: 'What aviation human factors research teaches us about interface design and error prevention in software systems.',
    date: 'Oct 13, 2025',
    featured: false,
    hasImage: true,
    content: `
# Human Factors in Cockpit Design

Aviation has spent decades studying human factors—how people interact with complex systems under stress. These insights directly apply to software interface design.

## The PAPI Principle

Precision Approach Path Indicator (PAPI) lights use color coding to guide pilots:
- **4 white lights**: Too high
- **3 white, 1 red**: Slightly high
- **2 white, 2 red**: On target
- **1 white, 3 red**: Slightly low
- **4 red lights**: Too low

This instant visual feedback requires no cognitive processing. Users see color, understand state, adjust immediately.

**Software equivalent:** Progress indicators, status badges, health checks

## The 1-Inch Movement Rule

Critical cockpit controls are designed so that pilots can operate them with minimal movement—typically less than 1 inch from the neutral hand position.

**Software equivalent:**
- Hot keys for frequent actions
- Command palettes (Cmd+K patterns)
- Sticky navigation
- Floating action buttons

## Error Prevention Through Design

Aviation design prevents errors through:

### 1. Forcing Functions
Physical design prevents incorrect operation. Landing gear can't retract on ground.

**Software equivalent:** Type systems, input validation, confirmation dialogs

### 2. Standardization
Every Boeing 737 cockpit is identical. Pilots can switch aircraft without relearning controls.

**Software equivalent:** Design systems, consistent patterns, platform conventions

### 3. Clear Feedback
Every action provides immediate, obvious feedback.

**Software equivalent:** Loading states, success messages, error handling

## Attention Management

Pilots manage attention across multiple information sources:
- **Primary instruments**: Critical flight data (attitude, altitude, speed)
- **Secondary instruments**: Supporting information (fuel, navigation)
- **Alerts**: Immediate attention required

**Software equivalent:**
- **Primary content**: User's main task
- **Secondary UI**: Navigation, settings, metadata
- **Notifications**: Urgent updates

## The Swiss Cheese Model

Errors pass through multiple layers of defense. One hole isn't catastrophic—but aligned holes cause failure.

**Software equivalent:**
- Input validation
- Business logic checks
- Database constraints
- Monitoring alerts
- Manual review processes

## Conclusion

Human factors research from aviation provides battle-tested patterns for interface design. By studying how pilots interact with cockpits, we can build software interfaces that prevent errors, reduce cognitive load, and improve usability.
    `.trim(),
  },
  {
    id: 4,
    title: 'Pre-flight Checklist Philosophy',
    track: 'Aviation',
    excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews.',
    date: 'Oct 12, 2025',
    featured: false,
    hasImage: false,
    content: `
# Pre-flight Checklist Philosophy

Aviation checklists prevent errors in high-stakes environments. Software teams can apply the same rigor to code reviews, deployments, and incident response.

## Types of Checklists

### Normal Checklists
Routine procedures performed regularly. Used for repetitive tasks where memory alone is insufficient.

**Aviation:** Pre-flight inspection, engine start, takeoff
**Software:** PR review, deployment, database migration

### Abnormal Checklists
Procedures for uncommon but anticipated situations.

**Aviation:** Engine failure, electrical problems
**Software:** Rollback procedure, service degradation

### Emergency Checklists
Time-critical procedures for immediate threats.

**Aviation:** Fire, rapid decompression
**Software:** Production outage, security breach

## Checklist Design Principles

### 1. Challenge-Response Format
One person reads, another confirms.

**Aviation example:**
- Pilot Flying: "Flaps?"
- Pilot Monitoring: "Flaps 5, green light"

**Software example:**
- Developer: "Database migrations?"
- Reviewer: "Migrations tested, backwards compatible"

### 2. Brief and Focused
Checklists verify critical items only. They don't teach—they remind.

**Good:** "Authentication checked?"
**Bad:** "Did you verify that the authentication middleware is properly configured and that all endpoints are protected and that..."

### 3. Readable at a Glance
Use clear formatting, bold for critical items.

### 4. Action-Oriented
"Check" not "Is it checked?"

## Code Review Checklist Example

**Critical Items:**
- [ ] Tests pass
- [ ] No hardcoded secrets
- [ ] Database changes backward compatible
- [ ] Error handling present
- [ ] Performance impact considered

**Standard Items:**
- [ ] Code follows style guide
- [ ] Comments explain why, not what
- [ ] Edge cases handled
- [ ] Documentation updated

## Deployment Checklist Example

**Pre-deployment:**
- [ ] Feature flags configured
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

**Post-deployment:**
- [ ] Health checks passing
- [ ] Error rates normal
- [ ] Key metrics stable
- [ ] Team notified

## When Checklists Fail

Checklists fail when:
1. Too long (cognitive overload)
2. Not updated (drift from reality)
3. Not tested (theoretical, not practical)
4. Treated as ritual (checkbox mentality)

## Conclusion

Effective checklists are living documents, regularly tested and updated. They catch errors before they become incidents. Like aviation, software engineering benefits from systematic, checklist-driven processes.
    `.trim(),
  },
  {
    id: 5,
    title: 'Startup Velocity vs Safety',
    track: 'Dev/Startup',
    excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startup engineering culture.',
    date: 'Oct 11, 2025',
    featured: false,
    hasImage: true,
    content: `
# Startup Velocity vs Safety

"Move fast and break things" sounds great until you break critical infrastructure. Aviation provides a framework for maintaining velocity while preserving safety.

## The Paradox

Startups need:
- **Speed**: Ship features quickly, iterate, learn
- **Stability**: Don't break what's working, maintain trust

Aviation achieves both through systematic risk management.

## Risk Classification

Not all changes carry equal risk. Classify by:

### Low Risk (Move Fast)
- UI tweaks
- Copy changes
- Analytics events
- Feature flag changes

**Process:** Direct to production, monitor

### Medium Risk (Move Deliberately)
- New features behind flags
- Database schema additions (backward compatible)
- API additions (not modifications)

**Process:** Staging testing, gradual rollout, monitor closely

### High Risk (Move Carefully)
- Authentication changes
- Payment processing
- Database schema modifications
- API breaking changes

**Process:** Multiple reviews, extensive testing, phased rollout, rollback plan

## Aviation's Safety Layers

### 1. Prevention
Design to prevent errors.

**Aviation:** Forcing functions in cockpit design
**Software:** Type systems, input validation, guardrails

### 2. Detection
Identify errors early.

**Aviation:** Multiple instruments, cross-checking
**Software:** CI/CD checks, staging environments, canary deploys

### 3. Mitigation
Minimize impact when errors occur.

**Aviation:** Emergency procedures, redundant systems
**Software:** Feature flags, circuit breakers, rate limiting

### 4. Recovery
Return to safe state quickly.

**Aviation:** Alternate airports, backup systems
**Software:** Automated rollback, backup restoration

## Balancing Velocity and Safety

### DO Move Fast On:
- Non-critical features
- Reversible changes
- Isolated systems
- Internal tools

### DO Move Carefully On:
- Core infrastructure
- Data integrity
- Security boundaries
- Customer-facing critical paths

## Cultural Patterns

### From Aviation
- **Sterile Cockpit Rule**: No non-essential activities during critical phases
- **Software equivalent**: No deploys during peak traffic, freeze periods for major events

### Psychological Safety
Teams report issues without fear. This is how aviation achieved remarkable safety.

**Implement:**
- Blameless post-mortems
- Encourage reporting
- Learn from near-misses
- Celebrate finding bugs

## Practical Framework

1. **Classify every change** by risk level
2. **Match process to risk** (don't over-process low-risk changes)
3. **Build safety layers** (prevention, detection, mitigation, recovery)
4. **Measure both velocity and stability** (deploy frequency + error rates)

## Conclusion

You don't have to choose between velocity and safety. By adopting aviation's systematic approach to risk management, startups can move quickly on low-risk changes while moving carefully on high-risk ones.
    `.trim(),
  },
  {
    id: 6,
    title: 'Decision Making Under Pressure',
    track: 'Cross-pollination',
    excerpt: 'Emergency decision frameworks from aviation applied to production incidents and crisis management.',
    date: 'Oct 10, 2025',
    featured: false,
    hasImage: true,
    content: `
# Decision Making Under Pressure

When production goes down, emotions run high and decisions must be made quickly. Aviation's emergency decision frameworks can guide software incident response.

## The OODA Loop

Developed by fighter pilot John Boyd, the OODA loop is a decision cycle:

1. **Observe**: Gather information
2. **Orient**: Analyze context
3. **Decide**: Choose action
4. **Act**: Execute

In production incidents:
- **Observe**: Check metrics, logs, alerts
- **Orient**: Understand scope and impact
- **Decide**: Rollback vs hotfix vs mitigation
- **Act**: Execute decision, communicate

The faster you cycle through OODA, the better you respond.

## The 3 Cs Framework

Aviation uses the 3 Cs for immediate threats:

### Communicate
Declare the problem. Get help.

**Aviation:** "Pan-pan, pan-pan" or "Mayday, mayday"
**Software:** Page on-call, alert in Slack, start incident channel

### Climb (Altitude = Options)
Buy time and options.

**Aviation:** Gain altitude for glide distance
**Software:**
- Enable feature flags to disable new feature
- Throttle traffic
- Scale up resources
- Switch to fallback mode

### Comply (Stabilize)
Follow procedures, stabilize the situation.

**Aviation:** Run emergency checklist
**Software:** Run incident playbook

## Aviate, Navigate, Communicate

Priority order for pilots:

1. **Aviate**: Fly the airplane (keep users able to use the product)
2. **Navigate**: Go somewhere safe (mitigate the issue)
3. **Communicate**: Tell others what's happening (status updates)

Common mistake: Over-communicating while the system burns.

## Decision Trees for Common Scenarios

### Production Error Rate Spike

Error rate spike detected:
- User-facing impact?
  - Yes → Rollback immediately
  - No → Investigate, prepare hotfix
- Known issue?
  - Yes → Apply known mitigation
  - No → Triage, assign investigator
- Can we throttle?
  - Yes → Reduce load, investigate
  - No → Rollback or failover

### Database Connection Pool Exhausted

Connection pool exhausted:
- Scale pool size (immediate mitigation)
- Identify connection leak
  - New deployment? → Rollback
  - Traffic spike? → Scale horizontally
- Long-term fix
  - Fix connection leak
  - Implement connection monitoring

## Cognitive Biases Under Pressure

### Normalcy Bias
"This can't be that serious."

**Counter:** Trust your metrics, not your gut.

### Get-Home-Itis
"We're so close to shipping this feature..."

**Counter:** Safety first. Ship later.

### Sunk Cost Fallacy
"We've invested so much in this approach..."

**Counter:** Cut losses early. Rollback is cheap.

## The Incident Commander Role

Designate one person to:
- Make final decisions
- Coordinate responders
- Communicate with stakeholders
- Prevent conflicting actions

Like a captain, the IC has authority during the incident.

## Post-Incident Review

Aviation investigates every incident. Software should too.

**Framework:**
1. **Timeline**: What happened when?
2. **Contributing factors**: What conditions led to this?
3. **Root cause**: Why did this happen?
4. **Action items**: How do we prevent recurrence?
5. **Follow-up**: Track implementation

## Conclusion

Production incidents are high-pressure situations requiring structured decision-making. By adopting aviation's frameworks—OODA loop, 3 Cs, Aviate-Navigate-Communicate—engineering teams can respond effectively, minimize impact, and learn systematically.
    `.trim(),
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = parseInt(params.id as string);

  const post = MOCK_POSTS.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Container>
          <div className="py-24 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/mock/homepage-post-feed/homepage/m2-functional">
              <Button variant="default" size="default">
                Return to Blog
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Find related posts (same track, excluding current post)
  const relatedPosts = MOCK_POSTS
    .filter(p => p.track === post.track && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-12">
        <Container>
          <Link
            href="/mock/homepage-post-feed/homepage/m2-functional"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <span className="inline-block px-4 py-2 text-sm font-bold bg-white text-gray-900 rounded-full mb-4 uppercase tracking-wider">
            {post.track}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-6 text-gray-300">
            <time dateTime="2025-10-15">{post.date}</time>
            <span>•</span>
            <span>8 min read</span>
          </div>
        </Container>
      </div>

      {/* Featured Image */}
      {post.hasImage && (
        <div className="bg-gray-200 h-96">
          <Container className="h-full">
            <div className="h-full flex items-center justify-center text-gray-400">
              Featured Image Placeholder
            </div>
          </Container>
        </div>
      )}

      {/* Article Content */}
      <Container>
        <article className="max-w-3xl mx-auto py-12">
          <div className="prose prose-lg prose-gray max-w-none">
            <div
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Share this article
            </h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900">
                Twitter
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900">
                LinkedIn
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900">
                Copy Link
              </button>
            </div>
          </div>
        </article>

        {/* Newsletter CTA */}
        <div className="max-w-3xl mx-auto my-12 bg-gray-900 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">
            Want more systematic thinking insights?
          </h3>
          <p className="text-gray-300 mb-6">
            Join pilots, engineers, and founders learning to apply aviation safety principles to software development.
          </p>
          <Button
            variant="default"
            size="default"
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            Subscribe to Newsletter
          </Button>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto py-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More from {post.track}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/mock/homepage-post-feed/blog/${relatedPost.id}`}
                  className="group focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-lg"
                >
                  <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    {relatedPost.hasImage && (
                      <div className="aspect-video bg-gray-200">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Thumbnail
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-gray-900 text-white rounded-full mb-3 uppercase tracking-wider">
                        {relatedPost.track}
                      </span>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:underline">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <time className="text-xs text-gray-500">{relatedPost.date}</time>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
