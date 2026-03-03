-- ============================================================
-- ImperialPedia Enterprise Production Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ENUMS
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin','admin','editor','author','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft','review','seo_review','compliance_review','approved','scheduled','published','archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PERMISSIONS
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  module text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- ROLE_PERMISSIONS
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- USER_ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- AUTHORS (extended)
CREATE TABLE IF NOT EXISTS public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  title text,
  bio text,
  credentials text,
  avatar_url text,
  profile_image text,
  linkedin_url text,
  twitter_url text,
  expertise_tags text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  is_reviewer boolean DEFAULT false,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CATEGORIES (extended with pillar SEO)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  meta_title text,
  meta_description text,
  pillar_content text,
  faq_items jsonb DEFAULT '[]',
  icon text,
  parent_id uuid REFERENCES public.categories(id),
  seo_title text,
  seo_description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ARTICLES (full enterprise)
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  preview_content text,
  full_content text,
  featured_image text,
  og_image text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status content_status DEFAULT 'draft',
  schema_type text DEFAULT 'Article',
  is_premium boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  meta_title text,
  meta_description text,
  canonical_url text,
  noindex boolean DEFAULT false,
  sources jsonb DEFAULT '[]',
  faq_items jsonb DEFAULT '[]',
  scheduled_at timestamptz,
  published_at timestamptz,
  last_reviewed_at timestamptz,
  view_count integer DEFAULT 0,
  reading_time integer,
  word_count integer DEFAULT 0,
  internal_link_count integer DEFAULT 0,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ARTICLE VERSIONS
CREATE TABLE IF NOT EXISTS public.article_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  content text,
  excerpt text,
  status content_status,
  editor_id uuid,
  editor_name text,
  change_summary text,
  diff_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- RELATED ARTICLES
CREATE TABLE IF NOT EXISTS public.related_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  related_article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, related_article_id)
);

-- WORKFLOW LOGS
CREATE TABLE IF NOT EXISTS public.content_workflow_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  from_status content_status,
  to_status content_status NOT NULL,
  changed_by uuid,
  note text,
  created_at timestamptz DEFAULT now()
);

-- GLOSSARY TERMS
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  slug text UNIQUE NOT NULL,
  letter char(1) NOT NULL,
  short_definition text NOT NULL,
  full_definition text,
  example text,
  category text,
  subcategory text,
  related_terms text[] DEFAULT '{}',
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status content_status DEFAULT 'draft',
  seo_title text,
  seo_description text,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AUTO LINK TERMS
CREATE TABLE IF NOT EXISTS public.auto_link_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text NOT NULL,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ORGANIZATION SETTINGS
CREATE TABLE IF NOT EXISTS public.organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'ImperialPedia',
  logo_url text,
  founding_date text,
  contact_email text DEFAULT 'editorial@imperialpedia.com',
  address text,
  social_links jsonb DEFAULT '{}',
  editorial_policy_url text DEFAULT '/editorial',
  disclaimer_url text DEFAULT '/disclaimer',
  updated_at timestamptz DEFAULT now()
);

-- CONTENT BLOCKS
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  block_type text DEFAULT 'html',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.calculate_article_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.full_content IS NOT NULL THEN
    NEW.word_count := array_length(regexp_split_to_array(regexp_replace(NEW.full_content, '<[^>]+>', '', 'g'), '\s+'), 1);
    NEW.reading_time := GREATEST(1, CEIL(NEW.word_count::numeric / 250));
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_article_metrics ON public.articles;
CREATE TRIGGER trg_article_metrics
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.calculate_article_metrics();

CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS DISTINCT FROM 'published') THEN
    NEW.published_at := COALESCE(NEW.published_at, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_published_at ON public.articles;
CREATE TRIGGER trg_set_published_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_published_at();

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'super_admin'))
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read authors" ON public.authors;
CREATE POLICY "Public can read authors" ON public.authors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage authors" ON public.authors;
CREATE POLICY "Admins can manage authors" ON public.authors FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published glossary" ON public.glossary_terms;
CREATE POLICY "Public can read published glossary" ON public.glossary_terms FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage glossary" ON public.glossary_terms;
CREATE POLICY "Admins can manage glossary" ON public.glossary_terms FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.related_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read related articles" ON public.related_articles;
CREATE POLICY "Public can read related articles" ON public.related_articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage related articles" ON public.related_articles;
CREATE POLICY "Admins can manage related articles" ON public.related_articles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.auto_link_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read auto links" ON public.auto_link_terms;
CREATE POLICY "Public can read auto links" ON public.auto_link_terms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage auto links" ON public.auto_link_terms;
CREATE POLICY "Admins can manage auto links" ON public.auto_link_terms FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read org settings" ON public.organization_settings;
CREATE POLICY "Public can read org settings" ON public.organization_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage org settings" ON public.organization_settings;
CREATE POLICY "Admins can manage org settings" ON public.organization_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read content blocks" ON public.content_blocks;
CREATE POLICY "Public can read content blocks" ON public.content_blocks FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage content blocks" ON public.content_blocks;
CREATE POLICY "Admins can manage content blocks" ON public.content_blocks FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can read audit logs" ON public.admin_audit_logs FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "System can insert audit logs" ON public.admin_audit_logs FOR INSERT TO authenticated WITH CHECK (true);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read roles" ON public.roles;
CREATE POLICY "Public can read roles" ON public.roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
CREATE POLICY "Admins can manage roles" ON public.roles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read permissions" ON public.permissions;
CREATE POLICY "Public can read permissions" ON public.permissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.permissions;
CREATE POLICY "Admins can manage permissions" ON public.permissions FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read role perms" ON public.role_permissions;
CREATE POLICY "Public can read role perms" ON public.role_permissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage role perms" ON public.role_permissions;
CREATE POLICY "Admins can manage role perms" ON public.role_permissions FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.article_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read versions" ON public.article_versions;
CREATE POLICY "Admins can read versions" ON public.article_versions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can manage versions" ON public.article_versions;
CREATE POLICY "Admins can manage versions" ON public.article_versions FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.content_workflow_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read workflow logs" ON public.content_workflow_logs;
CREATE POLICY "Admins can read workflow logs" ON public.content_workflow_logs FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can insert workflow logs" ON public.content_workflow_logs;
CREATE POLICY "Admins can insert workflow logs" ON public.content_workflow_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO public.organization_settings (name, contact_email, editorial_policy_url, disclaimer_url, social_links)
VALUES ('ImperialPedia', 'editorial@imperialpedia.com', '/editorial', '/disclaimer', '{"twitter":"","linkedin":""}')
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (name, slug, description, meta_title, meta_description, sort_order) VALUES
('Cryptocurrency', 'crypto', 'Educational content about cryptocurrency, blockchain technology, and digital assets.', 'Cryptocurrency Education & Guides | ImperialPedia', 'Learn about cryptocurrency, blockchain, Bitcoin, Ethereum, and digital assets with clear educational guides.', 1),
('Stock Market', 'stocks', 'Educational content about stock markets, equities, trading, and market analysis.', 'Stock Market Education & Guides | ImperialPedia', 'Understand stock markets, equity investing, trading strategies, and market analysis with our educational guides.', 2),
('Personal Finance', 'personal-finance', 'Educational content about budgeting, saving, debt management, and financial planning.', 'Personal Finance Education & Guides | ImperialPedia', 'Master personal finance: budgeting, saving, debt management, and financial planning guides for everyone.', 3),
('Investing Basics', 'investing', 'Foundational content about investing principles, asset classes, and portfolio management.', 'Investing Basics & Education | ImperialPedia', 'Learn investing fundamentals: asset classes, portfolio management, risk assessment, and investment strategies.', 4),
('Banking & Economy', 'banking', 'Educational content about banking systems, monetary policy, and economic concepts.', 'Banking & Economy Education | ImperialPedia', 'Understand banking systems, monetary policy, central banks, interest rates, and economic fundamentals.', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.roles (name, display_name, description, is_system) VALUES
('super_admin', 'Super Admin', 'Full system access', true),
('admin', 'Admin', 'Administrative access', true),
('editor', 'Editor', 'Content editing and review', true),
('author', 'Author', 'Content creation', true),
('moderator', 'Moderator', 'Comment and community moderation', true),
('user', 'User', 'Standard user access', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.permissions (key, label, module) VALUES
('article.create', 'Create Articles', 'content'),
('article.edit', 'Edit Articles', 'content'),
('article.publish', 'Publish Articles', 'content'),
('article.delete', 'Delete Articles', 'content'),
('article.schedule', 'Schedule Articles', 'content'),
('glossary.manage', 'Manage Glossary', 'content'),
('news.approve', 'Approve News', 'content'),
('ad.manage', 'Manage Ads', 'monetization'),
('affiliate.manage', 'Manage Affiliates', 'monetization'),
('analytics.view', 'View Analytics', 'analytics'),
('subscription.override', 'Override Subscriptions', 'monetization'),
('seo.redirect.manage', 'Manage Redirects', 'seo'),
('system.settings.edit', 'Edit System Settings', 'system'),
('user.manage', 'Manage Users', 'users'),
('audit.view', 'View Audit Logs', 'security')
ON CONFLICT (key) DO NOTHING;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_glossary_letter ON public.glossary_terms(letter);
CREATE INDEX IF NOT EXISTS idx_glossary_slug ON public.glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_auto_link_keyword ON public.auto_link_terms(keyword);
