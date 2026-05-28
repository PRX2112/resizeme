import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog & Guides | ResizeMe',
  description: 'Expert guides, tutorials, and tips on image optimization, resizing, and performance.',
};

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Visual Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Optimization Hub</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master image resizing, compression, and optimization with our expert guides and tutorials.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts found. Check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="transition-transform hover:-translate-y-1 block h-full">
              <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="text-xs text-muted-foreground mb-2 font-medium">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h2 className="line-clamp-2 text-xl font-bold mb-2">{post.title}</h2>
                <p className="line-clamp-3 mt-2 text-sm text-gray-600 dark:text-gray-400 flex-grow">
                  {post.description}
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-4 flex items-center">
                  Read article
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
