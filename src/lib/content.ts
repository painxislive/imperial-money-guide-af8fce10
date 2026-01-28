import { db } from "./supabase-helpers";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  source_name?: string;
  source_url?: string;
  featured_image?: string;
  category: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  last_fetched_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  slug: string;
  letter: string;
  category?: string;
  related_articles?: string[];
  seo_title?: string;
  seo_description?: string;
  view_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const contentService = {
  // Article methods
  async getArticles(params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = db('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (params?.category) {
      query = query.eq('category', params.category);
    }

    if (params?.featured) {
      query = query.eq('is_featured', true);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return (data || []) as Article[];
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await db('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    // Increment view count
    if (data) {
      const article = data as Article;
      await db('articles')
        .update({ view_count: article.view_count + 1 })
        .eq('id', article.id);
    }

    return data as Article;
  },

  async searchArticles(query: string, limit = 10) {
    const { data, error } = await db('articles')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%, content.ilike.%${query}%, tags.cs.{${query}}`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return (data || []) as Article[];
  },

  async getArticleCategories(): Promise<string[]> {
    const { data, error } = await db('articles')
      .select('category')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const categories = (data || []) as Array<{ category: string }>;
    return [...new Set(categories.map(item => item.category))];
  },

  // RSS Source methods
  async getRSSSources() {
    const { data, error } = await db('rss_sources')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching RSS sources:', error);
      return [];
    }

    return (data || []) as RSSSource[];
  },

  async addRSSSource(source: Omit<RSSSource, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await db('rss_sources')
      .insert(source)
      .select()
      .single();

    return { data, error };
  },

  async updateRSSSource(id: string, updates: Partial<RSSSource>) {
    const { data, error } = await db('rss_sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async deleteRSSSource(id: string) {
    const { error } = await db('rss_sources')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Glossary methods
  async getGlossaryTermsByLetter(letter: string) {
    const { data, error } = await db('glossary_terms')
      .select('*')
      .eq('letter', letter.toUpperCase())
      .eq('is_published', true)
      .order('term');

    if (error) {
      console.error('Error fetching glossary terms:', error);
      return [];
    }

    return (data || []) as GlossaryTerm[];
  },

  async getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
    const { data, error } = await db('glossary_terms')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching glossary term:', error);
      return null;
    }

    // Increment view count
    if (data) {
      const term = data as GlossaryTerm;
      await db('glossary_terms')
        .update({ view_count: term.view_count + 1 })
        .eq('id', term.id);
    }

    return data as GlossaryTerm;
  },

  async getAllGlossaryLetters(): Promise<string[]> {
    const { data, error } = await db('glossary_terms')
      .select('letter')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching glossary letters:', error);
      return [];
    }

    const letters = (data || []) as Array<{ letter: string }>;
    return [...new Set(letters.map(item => item.letter))].sort();
  },

  // Admin methods
  async createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'view_count'>) {
    const { data, error } = await db('articles')
      .insert(article)
      .select()
      .single();

    return { data, error };
  },

  async updateArticle(id: string, updates: Partial<Article>) {
    const { data, error } = await db('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async deleteArticle(id: string) {
    const { error } = await db('articles')
      .delete()
      .eq('id', id);

    return { error };
  },

  async getAnalytics() {
    const { data: articlesCount } = await db('articles')
      .select('*', { count: 'exact', head: true });

    const { data: todayArticles } = await db('articles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().split('T')[0]);

    const { data: topArticles } = await db('articles')
      .select('title, view_count, slug')
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(5);

    return {
      totalArticles: (articlesCount as any[])?.length || 0,
      todayArticles: (todayArticles as any[])?.length || 0,
      topArticles: topArticles || []
    };
  }
};
