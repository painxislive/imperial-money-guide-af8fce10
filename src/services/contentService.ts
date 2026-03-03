import { db } from '@/lib/supabase-helpers';
import type { Article, Author, Category, OrganizationSettings } from '@/types/enterprise';

/**
 * Public-facing content service — only fetches published data.
 */
export const contentService = {
  async getPublishedArticle(slug: string): Promise<Article | null> {
    const { data, error } = await db('articles')
      .select('*, author:authors!articles_author_id_fkey(*), category:categories(*), reviewer:authors!articles_reviewed_by_fkey(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    // Increment view count (fire-and-forget)
    if (data) {
      db('articles')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
        .then(() => {});
    }

    return data as Article;
  },

  async getPublishedArticles(params?: {
    categorySlug?: string;
    authorSlug?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Article[]> {
    let query = db('articles')
      .select('*, author:authors!articles_author_id_fkey(*), category:categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (params?.featured) query = query.eq('is_featured', true);
    if (params?.limit) query = query.limit(params.limit);
    if (params?.offset) query = query.range(params.offset, params.offset + (params.limit || 10) - 1);

    const { data, error } = await query;
    if (error) { console.error('Error:', error); return []; }

    let articles = (data || []) as Article[];
    if (params?.categorySlug) {
      articles = articles.filter(a => a.category?.slug === params.categorySlug);
    }
    if (params?.authorSlug) {
      articles = articles.filter(a => a.author?.slug === params.authorSlug);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(s) ||
        a.excerpt?.toLowerCase().includes(s)
      );
    }
    return articles;
  },

  async getRelatedArticles(articleId: string): Promise<Article[]> {
    const { data, error } = await db('related_articles')
      .select('related_article_id')
      .eq('article_id', articleId);

    if (error || !data?.length) return [];

    const ids = data.map((r: any) => r.related_article_id);
    const { data: articles } = await db('articles')
      .select('*, author:authors!articles_author_id_fkey(*), category:categories(*)')
      .in('id', ids)
      .eq('status', 'published');

    return (articles || []) as Article[];
  },

  async getReviewedArticles(authorId: string): Promise<Article[]> {
    const { data, error } = await db('articles')
      .select('*, category:categories(*)')
      .eq('reviewed_by', authorId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) return [];
    return (data || []) as Article[];
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await db('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) return [];
    return (data || []) as Category[];
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await db('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (error) return null;
    return data as Category;
  },

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    const { data, error } = await db('authors')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data as Author;
  },

  async getOrganizationSettings(): Promise<OrganizationSettings | null> {
    const { data, error } = await db('organization_settings')
      .select('*')
      .limit(1)
      .single();
    if (error) return null;
    return data as OrganizationSettings;
  },

  async getPublishedGlossaryTerms(): Promise<any[]> {
    const { data, error } = await db('glossary_terms')
      .select('term, slug, updated_at')
      .eq('status', 'published')
      .order('term');
    if (error) return [];
    return data || [];
  },

  async getGlossaryTermsByCategory(categorySlug: string): Promise<any[]> {
    const { data, error } = await db('glossary_terms')
      .select('term, slug, short_definition')
      .eq('status', 'published')
      .eq('category', categorySlug)
      .order('term')
      .limit(10);
    if (error) return [];
    return data || [];
  },
};
