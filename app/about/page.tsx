import { Metadata } from 'next';
import { generatePersonSchema, generateOrganizationSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About | Marcus Gollahon',
  description:
    'Software developer, flight instructor, and educator helping pilots and developers master systematic thinking.',
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
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-navy-950">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <article className="prose prose-invert prose-emerald lg:prose-xl">
            <h1 className="text-4xl font-bold text-white mb-6">About Marcus Gollahon</h1>

            <div className="text-gray-300 space-y-6">
              <p className="text-xl leading-relaxed">
                I help pilots advance their aviation careers and teach developers to build with
                systematic thinking—bringing discipline, clarity, and proven teaching methods to
                everything I create.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4">Dual-Track Background</h2>

              <p>
                My career spans two seemingly different worlds: aviation and software development.
                As a Certified Flight Instructor (CFI), I teach pilots the systematic thinking and
                procedural discipline required for safe flight operations. As a software developer,
                I apply those same principles to building reliable, maintainable systems.
              </p>

              <p>
                This unique combination gives me a perspective on teaching and systematic thinking
                that most developers don't have—and an understanding of technology that most flight
                instructors lack.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4">Aviation</h2>

              <p>
                I'm a full-time flight instructor helping pilots advance from private pilot through
                commercial and CFI ratings. My approach emphasizes understanding systems deeply,
                building solid mental models, and developing the judgment to handle non-standard
                situations.
              </p>

              <p>
                Aviation taught me that complex systems require systematic thinking, clear
                procedures, and constant learning. Every flight is a lesson in risk management,
                decision-making, and maintaining performance under pressure.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4">Software Development</h2>

              <p>
                In software, I focus on building reliable systems with TypeScript, React, and Next.js.
                I bring the same systematic approach from aviation: understand the fundamentals,
                build mental models, follow procedures, and always be learning.
              </p>

              <p>
                Whether it's a pre-flight checklist or a code review checklist, the principle is the
                same: systematic processes reduce errors and improve outcomes.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4">This Website</h2>

              <p>
                This site is where I share what I'm learning in both fields. You'll find articles on
                aviation career progression, flight training insights, software development practices,
                and the cross-pollination of ideas between these disciplines.
              </p>

              <p>
                If you're a pilot looking to advance your career or a developer interested in
                systematic thinking, I hope you find something useful here.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4">Connect</h2>

              <ul className="space-y-2">
                <li>
                  <a
                    href="https://twitter.com/marcusgoll"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Twitter @marcusgoll
                  </a>{' '}
                  - Quick updates and thoughts
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/marcusgollahon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    LinkedIn
                  </a>{' '}
                  - Professional network
                </li>
                <li>
                  <a
                    href="https://github.com/marcusgoll"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    GitHub
                  </a>{' '}
                  - Code and projects
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
