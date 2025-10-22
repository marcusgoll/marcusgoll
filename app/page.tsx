import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { getPageSEO } from '@/lib/seo-config';

export default async function Home() {
  const pageSEO = getPageSEO({
    title: 'Home',
    description: 'Teaching systematic thinking from 30,000 feet. Aviation career guidance, software development insights, and startup lessons from Marcus Gollahon.',
  });
  // Fetch latest 5 posts from MDX
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 5);

  return (
    <>
      <NextSeo {...pageSEO} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Marcus Gollahon
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Welcome to my personal blog covering aviation, software development, education, and startups.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Aviation
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Insights and experiences from the world of flight.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Development
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Web development, coding tutorials, and tech insights.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Education
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Teaching, learning, and educational technology.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Startups
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Entrepreneurship, innovation, and building businesses.
              </p>
            </div>
          </div>

          {/* Latest blog posts section */}
          {latestPosts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Latest Posts
                </h2>
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all →
                </Link>
              </div>

              <div className="space-y-6">
                {latestPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {post.frontmatter.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {post.frontmatter.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={post.frontmatter.date}>
                          {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        {post.frontmatter.readingTime && (
                          <>
                            <span>•</span>
                            <span>{post.frontmatter.readingTime} min read</span>
                          </>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
