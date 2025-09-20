-- Create content management tables for finance news platform

-- RSS sources table for automated content fetching
CREATE TABLE public.rss_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Articles table for news content
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  source_name TEXT,
  source_url TEXT,
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Glossary terms table for A-Z navigation
CREATE TABLE public.glossary_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  letter CHAR(1) NOT NULL,
  category TEXT DEFAULT 'general',
  related_articles UUID[],
  seo_title TEXT,
  seo_description TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rss_sources (admin only)
CREATE POLICY "Only admins can manage RSS sources"
ON public.rss_sources
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for articles
CREATE POLICY "Everyone can view published articles"
ON public.articles
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins and editors can manage articles"
ON public.articles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for glossary_terms
CREATE POLICY "Everyone can view published glossary terms"
ON public.glossary_terms
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins and editors can manage glossary terms"
ON public.glossary_terms
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_rss_sources_updated_at
BEFORE UPDATE ON public.rss_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_glossary_terms_updated_at
BEFORE UPDATE ON public.glossary_terms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_is_published ON public.articles(is_published);
CREATE INDEX idx_articles_is_featured ON public.articles(is_featured);
CREATE INDEX idx_articles_tags ON public.articles USING GIN(tags);

CREATE INDEX idx_glossary_terms_slug ON public.glossary_terms(slug);
CREATE INDEX idx_glossary_terms_letter ON public.glossary_terms(letter);
CREATE INDEX idx_glossary_terms_is_published ON public.glossary_terms(is_published);

CREATE INDEX idx_rss_sources_is_active ON public.rss_sources(is_active);
CREATE INDEX idx_rss_sources_category ON public.rss_sources(category);

-- Insert sample RSS sources
INSERT INTO public.rss_sources (name, url, category) VALUES
('Reuters Finance', 'https://feeds.reuters.com/reuters/businessNews', 'finance'),
('Yahoo Finance', 'https://feeds.finance.yahoo.com/rss/2.0/headline', 'finance'),
('CoinDesk', 'https://feeds.coindesk.com/news', 'crypto'),
('CoinTelegraph', 'https://cointelegraph.com/rss', 'crypto'),
('MarketWatch', 'https://feeds.marketwatch.com/marketwatch/topstories/', 'finance');

-- Insert sample glossary terms
INSERT INTO public.glossary_terms (term, definition, slug, letter, category) VALUES
('Annual Percentage Rate (APR)', 'The annual cost of a loan to a borrower, expressed as a percentage that includes interest and fees.', 'annual-percentage-rate-apr', 'A', 'finance'),
('Bear Market', 'A market condition where securities prices fall 20% or more from recent highs amid widespread pessimism.', 'bear-market', 'B', 'finance'),
('Cryptocurrency', 'A digital or virtual currency that is secured by cryptography and operates independently of central banks.', 'cryptocurrency', 'C', 'crypto'),
('Dividend', 'A payment made by a corporation to its shareholders, usually as a distribution of profits.', 'dividend', 'D', 'finance'),
('Exchange-Traded Fund (ETF)', 'An investment fund traded on stock exchanges like individual stocks, typically tracking an index.', 'exchange-traded-fund-etf', 'E', 'finance');