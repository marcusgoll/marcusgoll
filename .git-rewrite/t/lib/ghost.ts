import GhostContentAPI from '@tryghost/content-api';

// Initialize Ghost Content API client
export const ghostClient = new GhostContentAPI({
  url: process.env.GHOST_API_URL || 'https://ghost.marcusgoll.com',
  key: process.env.GHOST_CONTENT_API_KEY || '',
  version: 'v5.0',
});

// Type definitions for Ghost content
export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string | null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  primary_author: GhostAuthor;
  primary_tag: GhostTag | null;
  authors: GhostAuthor[];
  tags: GhostTag[];
  reading_time: number;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  facebook: string | null;
  twitter: string | null;
  url: string;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  feature_image: string | null;
  visibility: string;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  url: string;
}

export interface GhostPage {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  feature_image: string | null;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string | null;
  url: string;
}

// Helper functions for common queries
export const getPosts = async (options?: {
  limit?: number;
  include?: string[];
  filter?: string;
}) => {
  return await ghostClient.posts.browse({
    limit: options?.limit || 15,
    include: options?.include?.join(',') || 'tags,authors',
    filter: options?.filter,
  }) as unknown as GhostPost[];
};

export const getPostBySlug = async (slug: string) => {
  return await ghostClient.posts.read(
    { slug },
    { include: 'tags,authors' }
  ) as unknown as GhostPost;
};

export const getPostsByTag = async (tagSlug: string, limit = 15) => {
  return await ghostClient.posts.browse({
    filter: `tag:${tagSlug}`,
    limit,
    include: 'tags,authors',
  }) as unknown as GhostPost[];
};

export const getTags = async () => {
  return await ghostClient.tags.browse({
    limit: 'all',
  }) as unknown as GhostTag[];
};

export const getPages = async () => {
  return await ghostClient.pages.browse({
    limit: 'all',
  }) as unknown as GhostPage[];
};

export const getPageBySlug = async (slug: string) => {
  return await ghostClient.pages.read({ slug }) as unknown as GhostPage;
};
