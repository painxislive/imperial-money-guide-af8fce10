import { db } from '@/lib/supabase-helpers';
import { supabase } from '@/integrations/supabase/client';
import { Article, ArticleFormData, ArticleRevision, Category, Author } from '@/types/database';

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const articleService = {
  // PUBLIC: Get published articles
  async getPublishedArticles(params?: {
    categorySlug?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Article[]> {
    let query = db('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

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

    // Filter by category if provided (need to join check)
    let articles = (data || []) as Article[];
    if (params?.categorySlug) {
      articles = articles.filter(a => a.category?.slug === params.categorySlug);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt?.toLowerCase().includes(searchLower) ||
        a.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    return articles;
  },

  // PUBLIC: Get single article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await db('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    // Increment view count
    if (data) {
      await db('articles')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);
    }

    return data as Article;
  },

  // ADMIN/EDITOR: Get all articles (including drafts)
  async getAllArticles(): Promise<Article[]> {
    const { data, error } = await db('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching all articles:', error);
      return [];
    }

    return (data || []) as Article[];
  },

  // ADMIN/EDITOR: Get article by ID (for editing)
  async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await db('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article by ID:', error);
      return null;
    }

    return data as Article;
  },

  // ADMIN/EDITOR: Create article
  async createArticle(formData: ArticleFormData): Promise<{ data: Article | null; error: any }> {
    const slug = formData.slug || generateSlug(formData.title);
    
    const { data, error } = await db('articles')
      .insert({
        ...formData,
        slug,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    return { data: data as Article, error };
  },

  // ADMIN/EDITOR: Update article (with revision tracking)
  async updateArticle(
    id: string, 
    formData: Partial<ArticleFormData>,
    editorId?: string,
    editorName?: string,
    revisionNote?: string
  ): Promise<{ data: Article | null; error: any }> {
    // Get current article for revision
    const { data: currentArticle } = await db('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentArticle) {
      return { data: null, error: { message: 'Article not found' } };
    }

    // Update the article
    const updateData: any = { ...formData };
    if (formData.status === 'published' && !currentArticle.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await db('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    // Create revision record
    if (data) {
      await db('article_revisions')
        .insert({
          article_id: id,
          editor_id: editorId,
          editor_name: editorName,
          previous_content: {
            title: currentArticle.title,
            preview_content: currentArticle.preview_content,
            full_content: currentArticle.full_content,
            status: currentArticle.status,
          },
          new_content: {
            title: data.title,
            preview_content: data.preview_content,
            full_content: data.full_content,
            status: data.status,
          },
          revision_note: revisionNote,
        });
    }

    return { data: data as Article, error: null };
  },

  // ADMIN ONLY: Delete article
  async deleteArticle(id: string): Promise<{ error: any }> {
    const { error } = await db('articles')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get article revisions
  async getArticleRevisions(articleId: string): Promise<ArticleRevision[]> {
    const { data, error } = await db('article_revisions')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching revisions:', error);
      return [];
    }

    return (data || []) as ArticleRevision[];
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await db('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (data || []) as Category[];
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await db('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    return data as Category;
  },

  // Get authors
  async getAuthors(): Promise<Author[]> {
    const { data, error } = await db('authors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching authors:', error);
      return [];
    }

    return (data || []) as Author[];
  },

  // Get related articles
  async getRelatedArticles(articleId: string, categoryId: string | null, limit = 4): Promise<Article[]> {
    let query = db('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .neq('id', articleId)
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }

    return (data || []) as Article[];
  },

  // Subscribe to real-time updates
  subscribeToArticles(callback: (payload: any) => void) {
    return supabase
      .channel('articles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, callback)
      .subscribe();
  },
};

export default articleService;
