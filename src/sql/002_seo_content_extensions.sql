-- ============================================================
-- MODULE 2: SEO + CONTENT EXTENSIONS
-- Run AFTER 001_rbac_cms_schema.sql
-- ============================================================

-- 1. Add reading_time to articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS reading_time int;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS word_count int DEFAULT 0;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS internal_link_count int DEFAULT 0;

-- 2. Related articles (many-to-many)
CREATE TABLE IF NOT EXISTS public.related_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  related_article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(article_id, related_article_id)
);

ALTER TABLE public.related_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view related articles" ON public.related_articles FOR SELECT USING (true);
CREATE POLICY "Editors manage related articles" ON public.related_articles FOR ALL USING (public.has_permission(auth.uid(), 'article.edit'));

CREATE INDEX idx_related_articles_article ON public.related_articles(article_id);
CREATE INDEX idx_related_articles_related ON public.related_articles(related_article_id);

-- 3. Update categories with SEO cluster descriptions
UPDATE public.categories SET 
  seo_title = 'Cryptocurrency Guide - Blockchain, DeFi & Digital Assets | ImperialPedia',
  seo_description = 'Comprehensive cryptocurrency education covering blockchain technology, DeFi protocols, Bitcoin, Ethereum, and digital asset investing strategies.'
WHERE slug = 'crypto';

UPDATE public.categories SET 
  seo_title = 'Stock Market Guide - Analysis, Trading & Investing | ImperialPedia',
  seo_description = 'In-depth stock market analysis, trading strategies, equity research, and investment education for beginners and professionals.'
WHERE slug = 'stocks';

UPDATE public.categories SET 
  seo_title = 'Personal Finance Guide - Budgeting, Saving & Investing | ImperialPedia',
  seo_description = 'Master personal finance with guides on budgeting, saving, investing basics, retirement planning, and wealth building strategies.'
WHERE slug = 'personal-finance';

UPDATE public.categories SET 
  seo_title = 'Banking & Economy - Financial Services & Economic Analysis | ImperialPedia',
  seo_description = 'Explore banking services, economic analysis, monetary policy, interest rates, and financial system education.'
WHERE slug = 'banking';

-- Add "Investing Basics" category if missing
INSERT INTO public.categories (name, slug, description, icon, sort_order, seo_title, seo_description)
VALUES (
  'Investing Basics', 'investing-basics', 'Fundamental investing concepts and strategies', 'BookOpen', 9,
  'Investing Basics - Learn How to Invest | ImperialPedia',
  'Learn the fundamentals of investing including asset allocation, portfolio management, risk assessment, and long-term wealth building.'
)
ON CONFLICT (slug) DO UPDATE SET
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

-- 4. Auto-calculate reading_time and word_count on article update
CREATE OR REPLACE FUNCTION public.calculate_article_metrics()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  combined_text text;
  words int;
BEGIN
  combined_text := COALESCE(NEW.preview_content, '') || ' ' || COALESCE(NEW.full_content, '');
  -- Strip HTML tags for word count
  combined_text := regexp_replace(combined_text, '<[^>]+>', ' ', 'g');
  combined_text := regexp_replace(combined_text, '\s+', ' ', 'g');
  words := array_length(string_to_array(trim(combined_text), ' '), 1);
  IF words IS NULL THEN words := 0; END IF;
  
  NEW.word_count := words;
  NEW.reading_time := GREATEST(1, CEIL(words::numeric / 250));
  
  -- Sync meta fields with seo fields if not set
  IF NEW.meta_title IS NULL AND NEW.seo_title IS NOT NULL THEN
    NEW.meta_title := NEW.seo_title;
  END IF;
  IF NEW.meta_description IS NULL AND NEW.seo_description IS NOT NULL THEN
    NEW.meta_description := NEW.seo_description;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER calculate_article_metrics_trigger
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.calculate_article_metrics();
