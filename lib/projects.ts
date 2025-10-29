import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

/**
 * Project interface for portfolio projects
 * Adapted from lib/posts.ts pattern
 */
export interface Project {
  slug: string;
  title: string;
  description: string; // 1-sentence excerpt
  category: 'aviation' | 'dev-startup' | 'cross-pollination';
  techStack: string[]; // e.g., ['Next.js', 'TypeScript', 'Tailwind']
  coverImage: string; // Path to screenshot
  liveUrl?: string; // Optional live demo URL
  githubUrl?: string; // Optional GitHub repository URL
  featured: boolean; // Show in featured section
  dateCreated: string; // ISO 8601 date
  metrics?: {
    users?: string; // e.g., "500+ users"
    impact?: string; // e.g., "$10k revenue"
    outcome?: string; // e.g., "Reduced training time 40%"
  };
  content: string; // Full MDX content for detail page
}

/**
 * Get all project slugs from content directory
 */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(projectsDirectory);
  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

/**
 * Get project data by slug
 */
export function getProjectBySlug(slug: string): Project {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);

  // Try .mdx first, fall back to .md
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    const mdPath = path.join(projectsDirectory, `${slug}.md`);
    fileContents = fs.readFileSync(mdPath, 'utf8');
  }

  const { data, content } = matter(fileContents);

  // Validate required fields
  if (!data.title) {
    throw new Error(`Project '${slug}': Missing required field 'title'`);
  }
  if (!data.description) {
    throw new Error(`Project '${slug}': Missing required field 'description'`);
  }
  if (!data.category) {
    throw new Error(`Project '${slug}': Missing required field 'category'`);
  }

  // Validate category value
  const validCategories = ['aviation', 'dev-startup', 'cross-pollination'];
  if (!validCategories.includes(data.category)) {
    throw new Error(
      `Project '${slug}': Invalid category '${data.category}' (must be 'aviation', 'dev-startup', or 'cross-pollination')`
    );
  }

  // Validate techStack
  if (!data.techStack || !Array.isArray(data.techStack)) {
    throw new Error(`Project '${slug}': Missing or invalid 'techStack' (must be array)`);
  }
  if (data.techStack.length < 2 || data.techStack.length > 10) {
    throw new Error(
      `Project '${slug}': techStack must have 2-10 items (has ${data.techStack.length})`
    );
  }

  // Validate featured projects have metrics
  if (data.featured && !data.metrics) {
    throw new Error(
      `Project '${slug}': Featured projects must have 'metrics' object`
    );
  }

  const project: Project = {
    slug,
    title: data.title,
    description: data.description,
    category: data.category as 'aviation' | 'dev-startup' | 'cross-pollination',
    techStack: data.techStack,
    coverImage: data.coverImage || `/images/projects/${slug}.png`,
    liveUrl: data.liveUrl,
    githubUrl: data.githubUrl,
    featured: data.featured || false,
    dateCreated: data.dateCreated || new Date().toISOString(),
    metrics: data.metrics,
    content,
  };

  return project;
}

/**
 * Get all projects, sorted by dateCreated (newest first)
 */
export async function getAllProjects(): Promise<Project[]> {
  const slugs = getProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .sort((a, b) => {
      // Sort by dateCreated, newest first
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    });

  return projects;
}

/**
 * Get featured projects (max 3), sorted by dateCreated
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const allProjects = await getAllProjects();

  return allProjects
    .filter((project) => project.featured && project.metrics)
    .slice(0, 3);
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(
  category: 'aviation' | 'dev-startup' | 'cross-pollination'
): Promise<Project[]> {
  const allProjects = await getAllProjects();

  return allProjects.filter((project) => project.category === category);
}
