import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import TrackBadge from '@/components/blog/TrackBadge';
import { getPostBySlug, getPrimaryTrack, getAllPosts } from '@/lib/ghost';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts (ISR optimization)
 * Pre-generates pages at build time, revalidates on-demand
 */
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(100);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Generate metadata for blog post pages (SEO optimization)
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Marcus Gollahon',
      };
    }

    return {
      title: `${post.title} | Marcus Gollahon`,
      description: post.excerpt || post.meta_description || undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.meta_description || undefined,
        images: post.feature_image ? [post.feature_image] : [],
        type: 'article',
        publishedTime: post.published_at,
        authors: [post.primary_author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.meta_description || undefined,
        images: post.feature_image ? [post.feature_image] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post Not Found | Marcus Gollahon',
    };
  }
}

/**
 * Blog Post Template
 * Displays individual blog posts with full content
 * Route: /blog/[slug]
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch post data
  const post = await getPostBySlug(slug);

  // 404 if post not found
  if (!post) {
    notFound();
  }

  // Determine primary content track
  const track = getPrimaryTrack(post.tags);

  // Format published date
  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="py-12">
      <Container>
        {/* Featured Image */}
        {post.feature_image && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.feature_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          {/* Track Badge */}
          {track && (
            <div className="mb-4">
              <TrackBadge track={track} />
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-navy-900 md:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-6 text-xl text-gray-600">{post.excerpt}</p>
          )}

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-gray-500">
            {/* Author */}
            <div className="flex items-center space-x-2">
              {post.primary_author.profile_image && (
                <Image
                  src={post.primary_author.profile_image}
                  alt={post.primary_author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span className="font-medium text-gray-700">
                {post.primary_author.name}
              </span>
            </div>

            {/* Date */}
            <span>•</span>
            <time dateTime={post.published_at}>{publishedDate}</time>

            {/* Reading Time */}
            <span>•</span>
            <span>{post.reading_time} min read</span>
          </div>
        </header>

        {/* Post Content (HTML from Ghost) */}
        <div
          className="prose prose-lg prose-navy max-w-none
            prose-headings:font-bold prose-headings:text-navy-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-navy-900 prose-strong:font-semibold
            prose-code:text-emerald-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-600 prose-blockquote:pl-6 prose-blockquote:italic
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Post Footer - Tags */}
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-lg font-semibold text-navy-900">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {tag.name}
                </a>
              ))}
            </div>
          </footer>
        )}
      </Container>
    </article>
  );
}
