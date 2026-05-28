import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogPostMetadata {
  title: string;
  date: string;
  description: string;
  slug: string;
  author?: string;
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
        title: data.title,
        date: data.date,
        description: data.description,
        slug: file.replace(/\.md$/, ''),
        author: data.author,
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
      title: data.title,
      date: data.date,
      description: data.description,
      slug,
      author: data.author,
      coverImage: data.coverImage,
    },
    content: htmlContent,
  };
}
