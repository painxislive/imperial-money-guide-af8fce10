// Enterprise RBAC Types

export type EnterpriseRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'moderator' | 'user';
export type ContentStatus = 'draft' | 'review' | 'seo_review' | 'compliance_review' | 'approved' | 'scheduled' | 'published' | 'archived';
export type MembershipTier = 'free' | 'premium' | 'pro';

export interface Permission {
  id: string;
  key: string;
  label: string;
  description: string | null;
  module: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: EnterpriseRole;
  display_name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
  role?: Role;
  permission?: Permission;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: EnterpriseRole;
  assigned_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export interface Author {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  credentials: string | null;
  avatar_url: string | null;
  profile_image: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  expertise_tags: string[];
  is_verified: boolean;
  is_reviewer: boolean;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  pillar_content: string | null;
  faq_items: Array<{ question: string; answer: string }>;
  icon: string | null;
  parent_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  preview_content: string | null;
  full_content: string | null;
  featured_image: string | null;
  og_image: string | null;
  category_id: string | null;
  author_id: string | null;
  reviewed_by: string | null;
  status: ContentStatus;
  is_premium: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  schema_type: string;
  canonical_url: string | null;
  noindex: boolean;
  sources: Array<{ title: string; url: string }>;
  faq_items: Array<{ question: string; answer: string }>;
  scheduled_at: string | null;
  published_at: string | null;
  last_reviewed_at: string | null;
  view_count: number;
  reading_time: number | null;
  word_count: number;
  meta_title: string | null;
  meta_description: string | null;
  internal_link_count: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  // Virtual joins
  author?: Author;
  category?: Category;
  reviewer?: Author;
}

export interface ArticleVersion {
  id: string;
  article_id: string;
  version_number: number;
  title: string;
  content: string | null;
  excerpt: string | null;
  status: ContentStatus;
  editor_id: string | null;
  editor_name: string | null;
  change_summary: string | null;
  diff_data: Record<string, any>;
  created_at: string;
}

export interface WorkflowLog {
  id: string;
  article_id: string;
  from_status: ContentStatus | null;
  to_status: ContentStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface ContentBlock {
  id: string;
  name: string;
  slug: string;
  content: string;
  block_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutoLinkTerm {
  id: string;
  keyword: string;
  target_url: string;
  priority: number;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationSettings {
  id: string;
  name: string;
  logo_url: string | null;
  founding_date: string | null;
  contact_email: string;
  address: string | null;
  social_links: Record<string, string>;
  editorial_policy_url: string;
  disclaimer_url: string;
  updated_at: string;
}

// Workflow status flow
export const WORKFLOW_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  draft: ['review'],
  review: ['draft', 'seo_review'],
  seo_review: ['review', 'compliance_review'],
  compliance_review: ['seo_review', 'approved'],
  approved: ['compliance_review', 'scheduled', 'published'],
  scheduled: ['approved', 'published'],
  published: ['archived'],
  archived: ['draft'],
};

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  review: 'In Review',
  seo_review: 'SEO Review',
  compliance_review: 'Compliance Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  seo_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  compliance_review: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};
