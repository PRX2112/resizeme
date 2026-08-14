import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogPostMetadata {
  title: string;
  date: string;
  description: string;
  slug: string;
  category?: string;
  author?: string;
  readTime?: string;
  coverImage?: string;
}

export interface BlogPost {
  metadata: BlogPostMetadata;
  content: string;
}

const contentDir = path.join(process.cwd(), 'src/content/blog');

export function getBlogPosts(): BlogPostMetadata[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  
  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        title: data.title || 'Untitled Guide',
        date: data.date || '2026-01-01',
        description: data.description || '',
        slug: file.replace(/\.md$/, ''),
        category: data.category || 'Guides',
        author: data.author || 'ResizeMe Team',
        readTime: data.readTime || '6 min read',
        coverImage: data.coverImage,
      } as BlogPostMetadata;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(contentDir, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const htmlContent = await marked.parse(content);
  
  return {
    metadata: {
      title: data.title || 'Untitled Guide',
      date: data.date || '2026-01-01',
      description: data.description || '',
      slug,
      category: data.category || 'Guides',
      author: data.author || 'ResizeMe Team',
      readTime: data.readTime || '6 min read',
      coverImage: data.coverImage,
    },
    content: htmlContent,
  };
}

