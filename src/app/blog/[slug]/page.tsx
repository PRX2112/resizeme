import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen } from 'lucide-react';

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `https://resizeme.in/blog/${slug}`;

  return {
    title: `${post.metadata.title} | ResizeMe Blog`,
    description: post.metadata.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      url,
      type: 'article',
      publishedTime: post.metadata.date,
      authors: post.metadata.author ? [post.metadata.author] : ['ResizeMe Team'],
      images: post.metadata.coverImage ? [{ url: post.metadata.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `https://resizeme.in/blog/${slug}`;

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.metadata.title,
    'description': post.metadata.description,
    'datePublished': post.metadata.date,
    'dateModified': post.metadata.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    'author': {
      '@type': 'Person',
      'name': post.metadata.author || 'ResizeMe Editorial Team',
      'url': 'https://resizeme.in/about',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ResizeMe',
      'url': 'https://resizeme.in',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://resizeme.in/logo.png',
      },
    },
    'image': post.metadata.coverImage || 'https://resizeme.in/og-image.png',
  };

  // BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://resizeme.in',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog & Guides',
        'item': 'https://resizeme.in/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.metadata.title,
        'item': postUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Navigation & Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all guides</span>
          </Link>

          {post.metadata.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              <Tag className="w-3 h-3" />
              {post.metadata.category}
            </span>
          )}
        </nav>

        {/* Article Header */}
        <header className="space-y-6 pb-8 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {post.metadata.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.metadata.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {post.metadata.author?.charAt(0) || 'R'}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {post.metadata.author || 'ResizeMe Editorial'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <time dateTime={post.metadata.date}>
                {new Date(post.metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {post.metadata.readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{post.metadata.readTime}</span>
              </div>
            )}
          </div>
        </header>

        {/* Article Content Body */}
        <div className="py-10">
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight 
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-blue-600 dark:prose-code:text-blue-400
              prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl
              prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-800
              prose-th:bg-gray-50 dark:prose-th:bg-gray-800/60 prose-th:p-3
              prose-td:p-3 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Article Footer & Quick Call to Action */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ready to optimize your images?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Resize, compress, convert, or remove backgrounds online in seconds with 100% privacy.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md flex-shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Free Tools</span>
            </Link>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Knowledge Hub</span>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

