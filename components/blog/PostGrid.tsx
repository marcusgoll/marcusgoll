import { Post } from '@/lib/posts';
import { getPrimaryTrack } from '@/lib/utils/content';
import PostCard from './PostCard';

interface PostGridProps {
  posts: Post[];
}

/**
 * PostGrid component - Displays posts in a responsive grid layout
 * Grid columns: 1 (mobile), 2 (tablet), 3 (desktop)
 */
export default function PostGrid({ posts }: PostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        // Determine primary track from post tags
        const track = getPrimaryTrack(post.tags);

        return <PostCard key={post.id} post={post} track={track} />;
      })}
    </div>
  );
}
