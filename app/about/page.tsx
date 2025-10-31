import { Metadata } from 'next';
import { generatePersonSchema, generateOrganizationSchema } from '@/lib/schema';
import { ProfileHeader } from '@/components/about/ProfileHeader';
import { CareerTimeline } from '@/components/about/CareerTimeline';
import { InlineNewsletterCTA } from '@/components/newsletter/InlineNewsletterCTA';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Marcus Gollahon',
  description:
    'First Officer (CRJ-700/900) at PSA Airlines, current CFI, and developer building CFIPros with ACS-aligned study guides and training tools for pilots.',
  metadataBase: new URL('https://marcusgoll.com'),
  alternates: {
    canonical: '/about',
  },
};

/**
 * About Page - Personal brand and professional identity
 * T037: Created About page with Person schema
 * T038: Embedded Person + Organization schemas for SEO
 */
export default function AboutPage() {
  // Generate schemas for SEO (T038)
  const personSchema = generatePersonSchema();
  const organizationSchema = generateOrganizationSchema(true); // Include founder reference

  return (
    <>
      {/* Schema.org JSON-LD for SEO - Person establishes professional identity, Organization establishes brand entity */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(personSchema)}
      </script>
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(organizationSchema)}
      </script>

      <main className="min-h-screen bg-[var(--bg)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <article className="w-full lg:max-w-[min(65ch,100%)] xl:max-w-3xl mx-auto">
            <ProfileHeader />

            <div className="format format-base lg:format-lg dark:format-invert">
              <h2>Dual-Track Background</h2>
              <p>
                I fly, teach, and build. I am a First Officer on the CRJ-700/900 at PSA Airlines, a current CFI, and a developer working on CFIPros. I write practical training material and build tools that help pilots, instructors, and flight schools.
              </p>

              <h2>Aviation</h2>
              <p>
                I fly the CRJ-700/900 on the line and I still instruct. Airline flying keeps me sharp on briefs, flows, checklists, and crew coordination. Instructing keeps me close to how people learn and where training breaks down. I focus on procedures, systems knowledge, and clear debriefs that improve the next flight.
              </p>

              <h2>Web Development</h2>
              <p>
                I build web tools with TypeScript, Next.js, FastAPI, Supabase, Tailwind, and Prisma. I keep architectures simple, types clear, and boundaries clean. I use reviews, basic tests, and monitoring so problems are visible and fixes are quick.
              </p>
              <p>
                I also maintain my Claude Code workflow called{' '}
                <a
                  href="https://github.com/marcusgoll/Spec-Flow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spec-Flow
                </a>
                . It documents how I plan features, write specs, ship code, and debrief work with AI support.
              </p>

              <h2>This Website</h2>
              <p>
                Here you will find training notes, study-guide chapters, AKTR insights, and build logs from CFIPros. Posts are short and practical. I update pages when I learn something new so the content stays useful.
              </p>

              <h2>Who This Helps</h2>
              <ul>
                <li><strong>Student pilots</strong> get plain language study material and checkride-ready focus.</li>
                <li><strong>CFIs</strong> get tools and workflows that save time on endorsements and logbook hygiene.</li>
                <li><strong>Builders</strong> get real examples of shipping small features and improving them with feedback.</li>
              </ul>

              <h2>Now</h2>
              <ul>
                <li>Flying CRJ-700/900 line operations at PSA Airlines</li>
                <li>Shipping CFIPros: AKTR analyzer improvements and Private Pilot study guide chapters</li>
                <li>Writing weekly notes on training, tools, and product work</li>
              </ul>

              <h2>Beyond the Flight Deck and Code</h2>
              <p>
                I am a husband and dad of two. Family comes first. I am a Texas A&amp;M fan and enjoy college football. Most free time goes to family, reading, and planning the next project.
              </p>

              <h2>What I Can Help With</h2>
              <ul>
                <li><strong>Training content and study guides</strong>: ACS-aligned, plain-English material</li>
                <li><strong>CFIPros tools</strong>: AKTR and ACS insights, endorsement workflows, and logbook cleanup</li>
                <li><strong>Web builds</strong>: Next.js and FastAPI apps with clear structure and straightforward maintenance</li>
              </ul>
              <p>
                Contact me on {' '}
                <Link
              href="https://x.com/marcusgoll"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 format underline font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
              > X 
              </Link> {' '}
                or by email at{' '}
                <Link
              href="mailto:marcusgoll@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 format underline font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
              > marcusgoll@gmail.com 
              </Link>{'. '}
              You can also find my code on{' '}
              <Link
              href="https://github.com/marcusgoll"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 format underline font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
              > Github
              </Link>{'. '}
              </p>
            </div>

            {/* <CareerTimeline /> */}

            <InlineNewsletterCTA />
          </article>
        </div>
      </main>
    </>
  );
}
