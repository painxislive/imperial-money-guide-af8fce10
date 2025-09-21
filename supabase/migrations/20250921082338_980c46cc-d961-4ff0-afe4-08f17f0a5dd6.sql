-- Create authors table for author profiles
CREATE TABLE public.authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_website TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for article comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscribers table for newsletter
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Add author_id to articles table
ALTER TABLE public.articles ADD COLUMN author_id UUID REFERENCES public.authors(id);

-- Add premium flag to articles
ALTER TABLE public.articles ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false;

-- Add subscription fields to profiles
ALTER TABLE public.profiles ADD COLUMN is_subscribed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS policies for authors
CREATE POLICY "Everyone can view active authors" 
ON public.authors FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage authors" 
ON public.authors FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'editor'])
));

-- RLS policies for comments
CREATE POLICY "Everyone can view approved comments" 
ON public.comments FOR SELECT 
USING (is_approved = true AND is_deleted = false);

CREATE POLICY "Users can create their own comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" 
ON public.comments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'editor'])
));

-- RLS policies for subscribers
CREATE POLICY "Users can subscribe with their own email" 
ON public.subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all subscribers" 
ON public.subscribers FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'editor'])
));

CREATE POLICY "Admins can manage subscribers" 
ON public.subscribers FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'editor'])
));

-- Update articles RLS for premium content
DROP POLICY "Everyone can view published articles" ON public.articles;

CREATE POLICY "Everyone can view free published articles" 
ON public.articles FOR SELECT 
USING (is_published = true AND is_premium = false);

CREATE POLICY "Subscribed users can view premium articles" 
ON public.articles FOR SELECT 
USING (
  is_published = true 
  AND is_premium = true 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_subscribed = true 
    AND (profiles.subscription_expires_at IS NULL OR profiles.subscription_expires_at > now())
  )
);

-- Create indexes for performance
CREATE INDEX idx_comments_article_id ON public.comments(article_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_approved ON public.comments(is_approved) WHERE is_approved = true;
CREATE INDEX idx_articles_premium ON public.articles(is_premium);
CREATE INDEX idx_articles_author_id ON public.articles(author_id);
CREATE INDEX idx_subscribers_email ON public.subscribers(email);

-- Create triggers for updated_at
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON public.authors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample authors
INSERT INTO public.authors (name, bio, social_twitter, social_linkedin) VALUES 
  ('Sarah Johnson', 'Senior Financial Analyst with 10+ years in crypto and traditional markets.', '@sarahjfinance', 'sarahjohnson'),
  ('Michael Chen', 'Former Goldman Sachs trader, now focusing on DeFi and blockchain technology.', '@mikechentrader', 'michaelchen'),
  ('Emily Rodriguez', 'Economics PhD and crypto researcher. Expert in market analysis and trends.', '@emilyeconomics', 'emilyrodriguez');