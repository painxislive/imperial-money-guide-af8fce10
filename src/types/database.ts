// ImperialPedia Database Types

export type AppRole = 'user' | 'editor' | 'admin';
export type MembershipType = 'free' | 'premium';
export type ArticleStatus = 'draft' | 'published' | 'archived';
export type GlossaryStatus = 'draft' | 'published';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  membership_type: MembershipType;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Virtual fields for joins
  parent?: Category;
  children?: Category[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  preview_content: string | null;
  full_content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  is_premium: boolean;
  is_featured: boolean;
  status: ArticleStatus;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Virtual fields for joins
  author?: Author;
  category?: Category;
}

export interface ArticleRevision {
  id: string;
  article_id: string;
  editor_id: string | null;
  editor_name: string | null;
  previous_content: Record<string, any>;
  new_content: Record<string, any>;
  revision_note: string | null;
  created_at: string;
}

export interface SecureEditLink {
  id: string;
  article_id: string;
  token: string;
  created_by: string | null;
  expires_at: string;
  max_uses: number;
  use_count: number;
  is_revoked: boolean;
  created_at: string;
  // Virtual fields
  article?: Article;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  letter: string;
  short_definition: string;
  full_definition: string | null;
  example: string | null;
  category: string | null;
  subcategory: string | null;
  related_terms: string[];
  author_id: string | null;
  status: GlossaryStatus;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Virtual fields
  author?: Author;
}

export interface Bookmark {
  id: string;
  user_id: string;
  article_id: string | null;
  glossary_term_id: string | null;
  created_at: string;
}

// Form types for creating/updating
export interface ArticleFormData {
  title: string;
  slug?: string;
  preview_content: string;
  full_content: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: string;
  author_id?: string;
  is_premium: boolean;
  is_featured: boolean;
  status: ArticleStatus;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
}

export interface GlossaryFormData {
  term: string;
  slug?: string;
  short_definition: string;
  full_definition?: string;
  example?: string;
  category?: string;
  subcategory?: string;
  related_terms: string[];
  author_id?: string;
  status: GlossaryStatus;
  seo_title?: string;
  seo_description?: string;
}
