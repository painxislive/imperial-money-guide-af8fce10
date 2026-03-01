-- ============================================================
-- MODULE 1: RBAC + CMS ENGINE — ImperialPedia Enterprise
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'editor', 'author', 'moderator', 'user');
CREATE TYPE public.content_status AS ENUM ('draft', 'review', 'seo_review', 'compliance_review', 'approved', 'scheduled', 'published', 'archived');
CREATE TYPE public.membership_type AS ENUM ('free', 'premium', 'pro');

-- 2. PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  membership_type public.membership_type NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. PERMISSIONS TABLE
-- ============================================================
CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE, -- e.g. 'article.publish'
  label text NOT NULL,
  description text,
  module text NOT NULL, -- e.g. 'articles', 'glossary', 'monetization'
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. ROLES TABLE (enterprise roles metadata)
-- ============================================================
CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name public.app_role NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT false, -- system roles can't be deleted
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. ROLE_PERMISSIONS (many-to-many)
-- ============================================================
CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- 6. USER_ROLES
-- ============================================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  assigned_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 7. ADMIN AUDIT LOGS
-- ============================================================
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL, -- e.g. 'article.published', 'role.assigned'
  target_type text, -- e.g. 'article', 'user', 'glossary_term'
  target_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. AUTHORS
-- ============================================================
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text,
  bio text,
  avatar_url text,
  is_verified boolean NOT NULL DEFAULT false,
  social_links jsonb DEFAULT '{}',
  expertise text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text, -- lucide icon name
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 10. TAGS
-- ============================================================
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. ARTICLES (Enterprise CMS)
-- ============================================================
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  preview_content text,
  full_content text,
  featured_image text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  is_premium boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  seo_title text,
  seo_description text,
  schema_type text DEFAULT 'Article', -- Article, NewsArticle, HowTo, FAQ
  canonical_url text,
  noindex boolean NOT NULL DEFAULT false,
  scheduled_at timestamptz,
  published_at timestamptz,
  view_count int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 12. ARTICLE_TAGS (many-to-many)
-- ============================================================
CREATE TABLE public.article_tags (
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY(article_id, tag_id)
);

-- 13. ARTICLE_VERSIONS (audit trail)
-- ============================================================
CREATE TABLE public.article_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  version_number int NOT NULL DEFAULT 1,
  title text NOT NULL,
  content text,
  excerpt text,
  status public.content_status NOT NULL,
  editor_id uuid REFERENCES auth.users(id),
  editor_name text,
  change_summary text,
  diff_data jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. CONTENT_WORKFLOW_LOGS
-- ============================================================
CREATE TABLE public.content_workflow_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  from_status public.content_status,
  to_status public.content_status NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 15. CONTENT_BLOCKS (reusable content)
-- ============================================================
CREATE TABLE public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  block_type text NOT NULL DEFAULT 'html', -- html, markdown, component
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 16. GLOSSARY_TERMS
-- ============================================================
CREATE TABLE public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  slug text NOT NULL UNIQUE,
  letter char(1) NOT NULL,
  short_definition text NOT NULL,
  full_definition text,
  example text,
  category text,
  subcategory text,
  related_terms text[] DEFAULT '{}',
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  seo_title text,
  seo_description text,
  view_count int NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 17. NEWS_ARTICLES
-- ============================================================
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  source_url text,
  source_name text,
  featured_image text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  is_auto_generated boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

-- Check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON r.name = ur.role
    JOIN public.role_permissions rp ON rp.role_id = r.id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id AND p.key = _permission_key
  )
$$;

-- Get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'editor' THEN 3
    WHEN 'author' THEN 4
    WHEN 'moderator' THEN 5
    WHEN 'user' THEN 6
  END
  LIMIT 1
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile and assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.authors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_glossary_terms_updated_at BEFORE UPDATE ON public.glossary_terms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_workflow_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin(auth.uid()));

-- PERMISSIONS (admin read, super_admin write)
CREATE POLICY "Admins can view permissions" ON public.permissions FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins manage permissions" ON public.permissions FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- ROLES
CREATE POLICY "Admins can view roles" ON public.roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins manage roles" ON public.roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- ROLE_PERMISSIONS
CREATE POLICY "Admins can view role_permissions" ON public.role_permissions FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins manage role_permissions" ON public.role_permissions FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- USER_ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- ADMIN AUDIT LOGS
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Authenticated can insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- AUTHORS (public read, admin write)
CREATE POLICY "Public can view authors" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admins manage authors" ON public.authors FOR ALL USING (public.is_admin(auth.uid()));

-- CATEGORIES (public read, admin write)
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all categories" ON public.categories FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- TAGS (public read, editor+ write)
CREATE POLICY "Public can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Editors manage tags" ON public.tags FOR ALL USING (public.has_permission(auth.uid(), 'article.create'));

-- ARTICLES (public read published, author/editor write)
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (status = 'published' AND noindex = false);
CREATE POLICY "Authors can view own articles" ON public.articles FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Admins can view all articles" ON public.articles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Users with article.create can insert" ON public.articles FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'article.create'));
CREATE POLICY "Users with article.edit can update" ON public.articles FOR UPDATE USING (public.has_permission(auth.uid(), 'article.edit') OR created_by = auth.uid());
CREATE POLICY "Users with article.delete can delete" ON public.articles FOR DELETE USING (public.has_permission(auth.uid(), 'article.delete'));

-- ARTICLE_TAGS
CREATE POLICY "Public can view article_tags" ON public.article_tags FOR SELECT USING (true);
CREATE POLICY "Editors manage article_tags" ON public.article_tags FOR ALL USING (public.has_permission(auth.uid(), 'article.edit'));

-- ARTICLE_VERSIONS
CREATE POLICY "Admins can view versions" ON public.article_versions FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Editors can view versions" ON public.article_versions FOR SELECT USING (public.has_permission(auth.uid(), 'article.edit'));
CREATE POLICY "Editors can insert versions" ON public.article_versions FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'article.edit'));

-- CONTENT_WORKFLOW_LOGS
CREATE POLICY "Admins can view workflow logs" ON public.content_workflow_logs FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Editors can insert workflow logs" ON public.content_workflow_logs FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'article.edit'));

-- CONTENT_BLOCKS
CREATE POLICY "Public can view active content blocks" ON public.content_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage content blocks" ON public.content_blocks FOR ALL USING (public.is_admin(auth.uid()));

-- GLOSSARY_TERMS (public read published, admin write)
CREATE POLICY "Public can view published glossary" ON public.glossary_terms FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all glossary" ON public.glossary_terms FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Users with glossary.manage can manage" ON public.glossary_terms FOR ALL USING (public.has_permission(auth.uid(), 'glossary.manage'));

-- NEWS_ARTICLES
CREATE POLICY "Public can view published news" ON public.news_articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all news" ON public.news_articles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Users with news.approve can manage" ON public.news_articles FOR ALL USING (public.has_permission(auth.uid(), 'news.approve'));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_is_featured ON public.articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_article_versions_article ON public.article_versions(article_id);
CREATE INDEX idx_glossary_letter ON public.glossary_terms(letter);
CREATE INDEX idx_glossary_slug ON public.glossary_terms(slug);
CREATE INDEX idx_news_slug ON public.news_articles(slug);
CREATE INDEX idx_news_status ON public.news_articles(status);
CREATE INDEX idx_audit_logs_user ON public.admin_audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX idx_audit_logs_created ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_authors_slug ON public.authors(slug);
CREATE INDEX idx_workflow_logs_article ON public.content_workflow_logs(article_id);

-- ============================================================
-- SEED DATA: Roles
-- ============================================================
INSERT INTO public.roles (name, display_name, description, is_system) VALUES
  ('super_admin', 'Super Administrator', 'Full system access, can manage roles and permissions', true),
  ('admin', 'Administrator', 'Can manage content, users, and most settings', true),
  ('editor', 'Editor', 'Can create, edit, review and publish content', true),
  ('author', 'Author', 'Can create and edit own content', true),
  ('moderator', 'Moderator', 'Can moderate comments and user content', true),
  ('user', 'User', 'Standard registered user', true);

-- ============================================================
-- SEED DATA: Permissions
-- ============================================================
INSERT INTO public.permissions (key, label, module) VALUES
  ('article.create', 'Create Articles', 'articles'),
  ('article.edit', 'Edit Articles', 'articles'),
  ('article.publish', 'Publish Articles', 'articles'),
  ('article.schedule', 'Schedule Articles', 'articles'),
  ('article.delete', 'Delete Articles', 'articles'),
  ('glossary.manage', 'Manage Glossary', 'glossary'),
  ('news.approve', 'Approve News', 'news'),
  ('ad.manage', 'Manage Ads', 'monetization'),
  ('affiliate.manage', 'Manage Affiliates', 'monetization'),
  ('analytics.view', 'View Analytics', 'analytics'),
  ('subscription.override', 'Override Subscriptions', 'subscriptions'),
  ('seo.redirect.manage', 'Manage SEO Redirects', 'seo'),
  ('system.settings.edit', 'Edit System Settings', 'system'),
  ('user.manage', 'Manage Users', 'users'),
  ('role.manage', 'Manage Roles', 'roles'),
  ('comment.moderate', 'Moderate Comments', 'comments'),
  ('media.manage', 'Manage Media Library', 'media'),
  ('content_block.manage', 'Manage Content Blocks', 'content');

-- Assign permissions to roles
-- Super Admin gets everything
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.name = 'super_admin';

-- Admin gets everything except role.manage
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.name = 'admin' AND p.key != 'role.manage';

-- Editor gets content-related permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.name = 'editor' AND p.key IN ('article.create', 'article.edit', 'article.publish', 'article.schedule', 'glossary.manage', 'news.approve', 'analytics.view', 'media.manage', 'content_block.manage');

-- Author gets create and edit own
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.name = 'author' AND p.key IN ('article.create', 'article.edit', 'media.manage');

-- Moderator gets comment moderation
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.name = 'moderator' AND p.key IN ('comment.moderate', 'analytics.view');

-- ============================================================
-- SEED DATA: Default Categories
-- ============================================================
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
  ('Cryptocurrency', 'crypto', 'Blockchain, DeFi, and digital assets', 'Bitcoin', 1),
  ('Stocks', 'stocks', 'Equity markets and stock analysis', 'TrendingUp', 2),
  ('Forex', 'forex', 'Foreign exchange trading', 'ArrowLeftRight', 3),
  ('Insurance', 'insurance', 'Insurance products and planning', 'Shield', 4),
  ('Banking', 'banking', 'Banking services and products', 'Landmark', 5),
  ('Legal', 'legal', 'Financial law and regulations', 'Scale', 6),
  ('Personal Finance', 'personal-finance', 'Budgeting, saving, and investing', 'Wallet', 7),
  ('Real Estate', 'real-estate', 'Property investment and markets', 'Home', 8);
