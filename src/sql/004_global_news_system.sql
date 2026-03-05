-- =============================================
-- ImperialPedia Global News System Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1) PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  membership_type text DEFAULT 'free' CHECK (membership_type IN ('free', 'premium')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2) USER ROLES
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('user', 'editor', 'admin', 'super_admin', 'reviewer', 'author', 'seo_manager'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roles viewable by all authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'super_admin'))
$$;

-- 3) AUTHORS
CREATE TABLE IF NOT EXISTS public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE,
  title text,
  bio text,
  credentials text,
  linkedin_url text,
  twitter_url text,
  profile_image text,
  avatar_url text,
  expertise_tags text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  is_reviewer boolean DEFAULT false,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors viewable by everyone" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admins manage authors" ON public.authors FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 4) NEWS CATEGORIES
CREATE TABLE IF NOT EXISTS public.news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  meta_title text,
  meta_description text,
  sort_order int DEFAULT 0,
  show_in_nav boolean DEFAULT true,
  is_active boolean DEFAULT true,
  parent_id uuid REFERENCES public.news_categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.news_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.news_categories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 5) NEWS COUNTRIES
CREATE TABLE IF NOT EXISTS public.news_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  region text,
  flag_emoji text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.news_countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Countries viewable by everyone" ON public.news_countries FOR SELECT USING (true);

-- 6) NEWS SOURCES
CREATE TABLE IF NOT EXISTS public.news_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  source_type text DEFAULT 'rss',
  category_id uuid REFERENCES public.news_categories(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  last_fetched_at timestamptz,
  fetch_interval_minutes int DEFAULT 10,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sources viewable by everyone" ON public.news_sources FOR SELECT USING (true);

-- 7) ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  preview_content text,
  full_content text,
  featured_image text,
  category text,
  category_id uuid REFERENCES public.news_categories(id) ON DELETE SET NULL,
  author text,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  source_name text,
  source_url text,
  source_type text DEFAULT 'manual',
  country_id uuid REFERENCES public.news_countries(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  seo_title text,
  seo_description text,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  schema_type text DEFAULT 'Article',
  sources jsonb DEFAULT '[]',
  faq_items jsonb DEFAULT '[]',
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  status text DEFAULT 'draft',
  word_count int DEFAULT 0,
  reading_time int DEFAULT 0,
  internal_link_count int DEFAULT 0,
  view_count int DEFAULT 0,
  last_reviewed_at timestamptz,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles viewable by everyone" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 8) RELATED ARTICLES
CREATE TABLE IF NOT EXISTS public.related_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  related_article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, related_article_id)
);
ALTER TABLE public.related_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Related articles viewable by everyone" ON public.related_articles FOR SELECT USING (true);

-- 9) GLOSSARY TERMS
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  slug text UNIQUE NOT NULL,
  letter text NOT NULL,
  short_definition text NOT NULL,
  full_definition text,
  example text,
  category text,
  subcategory text,
  related_terms text[] DEFAULT '{}',
  related_articles text[] DEFAULT '{}',
  definition text,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status text DEFAULT 'draft',
  seo_title text,
  seo_description text,
  view_count int DEFAULT 0,
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published terms viewable by everyone" ON public.glossary_terms FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage terms" ON public.glossary_terms FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 10) AUTO LINK TERMS
CREATE TABLE IF NOT EXISTS public.auto_link_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text NOT NULL,
  priority int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.auto_link_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auto links viewable by everyone" ON public.auto_link_terms FOR SELECT USING (true);

-- 11) ORGANIZATION SETTINGS
CREATE TABLE IF NOT EXISTS public.organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org settings viewable by everyone" ON public.organization_settings FOR SELECT USING (true);

-- 12) CATEGORIES (content clusters)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  meta_title text,
  meta_description text,
  pillar_content text,
  faq_items jsonb DEFAULT '[]',
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);

-- 13) NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  subscription_type text DEFAULT 'daily',
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscribers public insert" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- 14) RSS SOURCES
CREATE TABLE IF NOT EXISTS public.rss_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  last_fetched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.rss_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RSS sources viewable" ON public.rss_sources FOR SELECT USING (true);

-- 15) ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logs viewable by everyone" ON public.activity_logs FOR SELECT USING (true);

-- 16) AUTOMATION SETTINGS
CREATE TABLE IF NOT EXISTS public.automation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Automation viewable" ON public.automation_settings FOR SELECT USING (true);

-- 17) TRACKED KEYWORDS
CREATE TABLE IF NOT EXISTS public.tracked_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.tracked_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Keywords viewable" ON public.tracked_keywords FOR SELECT USING (true);

-- 18) DETECTED TRENDS
CREATE TABLE IF NOT EXISTS public.detected_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  growth_percentage numeric DEFAULT 0,
  source text,
  source_url text,
  category text,
  geo_relevance text[] DEFAULT '{}',
  confirming_sources int DEFAULT 0,
  status text DEFAULT 'pending',
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  raw_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.detected_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trends viewable" ON public.detected_trends FOR SELECT USING (true);

-- 19) CONTENT PIPELINE
CREATE TABLE IF NOT EXISTS public.content_pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid REFERENCES public.detected_trends(id) ON DELETE SET NULL,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  stage text NOT NULL,
  status text DEFAULT 'pending',
  input_data jsonb,
  output_data jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.content_pipeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pipeline viewable" ON public.content_pipeline FOR SELECT USING (true);

-- 20) TREND SOURCES
CREATE TABLE IF NOT EXISTS public.trend_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL,
  config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.trend_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trend sources viewable" ON public.trend_sources FOR SELECT USING (true);

-- 21) ARTICLE REVISIONS
CREATE TABLE IF NOT EXISTS public.article_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  editor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  editor_name text,
  previous_content jsonb DEFAULT '{}',
  new_content jsonb DEFAULT '{}',
  revision_note text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Revisions viewable" ON public.article_revisions FOR SELECT USING (true);

-- 22) SECURE EDIT LINKS
CREATE TABLE IF NOT EXISTS public.secure_edit_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  max_uses int DEFAULT 1,
  use_count int DEFAULT 0,
  is_revoked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.secure_edit_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Edit links viewable" ON public.secure_edit_links FOR SELECT USING (true);

-- 23) BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE,
  glossary_term_id uuid REFERENCES public.glossary_terms(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookmarks" ON public.bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id);

-- TRIGGER: Auto-calculate word count and reading time
CREATE OR REPLACE FUNCTION public.calculate_article_metrics()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  text_content text;
  wc int;
BEGIN
  text_content := COALESCE(NEW.content, '') || ' ' || COALESCE(NEW.full_content, '');
  wc := array_length(string_to_array(trim(text_content), ' '), 1);
  IF wc IS NULL THEN wc := 0; END IF;
  NEW.word_count := wc;
  NEW.reading_time := GREATEST(1, CEIL(wc / 200.0));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_article_metrics ON public.articles;
CREATE TRIGGER trg_article_metrics
  BEFORE INSERT OR UPDATE OF content, full_content ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.calculate_article_metrics();

-- TRIGGER: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED: Default news categories
INSERT INTO public.news_categories (name, slug, description, sort_order, show_in_nav) VALUES
  ('Finance', 'finance', 'Financial news and analysis', 1, true),
  ('Economics', 'economics', 'Economic news and policy updates', 2, true),
  ('Markets', 'markets', 'Stock market and trading news', 3, true),
  ('Crypto', 'crypto', 'Cryptocurrency and blockchain news', 4, true),
  ('Insurance', 'insurance', 'Insurance industry news', 5, true),
  ('Legal', 'legal', 'Legal and regulatory updates', 6, true),
  ('Business', 'business', 'Business and corporate news', 7, true),
  ('Technology', 'technology', 'Technology and fintech news', 8, true),
  ('Politics', 'politics', 'Political news affecting markets', 9, true),
  ('Global News', 'global-news', 'International news and affairs', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- SEED: Countries
INSERT INTO public.news_countries (name, slug, code, region, flag_emoji) VALUES
  ('United States', 'united-states', 'US', 'North America', '🇺🇸'),
  ('United Kingdom', 'united-kingdom', 'GB', 'Europe', '🇬🇧'),
  ('India', 'india', 'IN', 'Asia', '🇮🇳'),
  ('China', 'china', 'CN', 'Asia', '🇨🇳'),
  ('Japan', 'japan', 'JP', 'Asia', '🇯🇵'),
  ('Germany', 'germany', 'DE', 'Europe', '🇩🇪'),
  ('France', 'france', 'FR', 'Europe', '🇫🇷'),
  ('Canada', 'canada', 'CA', 'North America', '🇨🇦'),
  ('Australia', 'australia', 'AU', 'Oceania', '🇦🇺'),
  ('Brazil', 'brazil', 'BR', 'South America', '🇧🇷'),
  ('South Korea', 'south-korea', 'KR', 'Asia', '🇰🇷'),
  ('Singapore', 'singapore', 'SG', 'Asia', '🇸🇬'),
  ('UAE', 'uae', 'AE', 'Middle East', '🇦🇪'),
  ('Saudi Arabia', 'saudi-arabia', 'SA', 'Middle East', '🇸🇦'),
  ('Switzerland', 'switzerland', 'CH', 'Europe', '🇨🇭'),
  ('Nigeria', 'nigeria', 'NG', 'Africa', '🇳🇬'),
  ('South Africa', 'south-africa', 'ZA', 'Africa', '🇿🇦'),
  ('Mexico', 'mexico', 'MX', 'North America', '🇲🇽'),
  ('Indonesia', 'indonesia', 'ID', 'Asia', '🇮🇩'),
  ('Russia', 'russia', 'RU', 'Europe', '🇷🇺'),
  ('Turkey', 'turkey', 'TR', 'Europe', '🇹🇷'),
  ('Italy', 'italy', 'IT', 'Europe', '🇮🇹'),
  ('Spain', 'spain', 'ES', 'Europe', '🇪🇸'),
  ('Netherlands', 'netherlands', 'NL', 'Europe', '🇳🇱'),
  ('Sweden', 'sweden', 'SE', 'Europe', '🇸🇪')
ON CONFLICT (slug) DO NOTHING;

-- SEED: Content clusters
INSERT INTO public.categories (name, slug, description) VALUES
  ('Crypto', 'crypto', 'Cryptocurrency and blockchain technology'),
  ('Stock Market', 'stocks', 'Stock market investing and trading'),
  ('Personal Finance', 'personal-finance', 'Personal finance management'),
  ('Investing Basics', 'investing', 'Fundamental investing concepts'),
  ('Banking & Economy', 'banking', 'Banking and economic systems')
ON CONFLICT (slug) DO NOTHING;
