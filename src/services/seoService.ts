import { db } from '@/lib/supabase-helpers';

export interface SEOMetrics {
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  reviewCount: number;
  missingMetaTitle: number;
  missingMetaDesc: number;
  missingFeaturedImage: number;
  missingExcerpt: number;
  belowWordCount: number;
  missingInternalLinks: number;
  averageWordCount: number;
  linkingHealthScore: number;
}

export interface SEOArticleRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  word_count: number;
  meta_title: string | null;
  seo_title: string | null;
  meta_description: string | null;
  seo_description: string | null;
  featured_image: string | null;
  excerpt: string | null;
  internal_link_count: number;
  reading_time: number | null;
  category: { name: string; slug: string } | null;
  author: { name: string } | null;
  published_at: string | null;
  updated_at: string;
}

export const seoService = {
  async getMetrics(): Promise<SEOMetrics> {
    const { data, error } = await db('articles')
      .select('id, status, word_count, meta_title, seo_title, meta_description, seo_description, featured_image, excerpt, internal_link_count');

    if (error || !data) {
      return {
        totalArticles: 0, publishedCount: 0, draftCount: 0, reviewCount: 0,
        missingMetaTitle: 0, missingMetaDesc: 0, missingFeaturedImage: 0,
        missingExcerpt: 0, belowWordCount: 0, missingInternalLinks: 0,
        averageWordCount: 0, linkingHealthScore: 100,
      };
    }

    const articles = data as any[];
    const published = articles.filter(a => a.status === 'published');
    const drafts = articles.filter(a => a.status === 'draft');
    const inReview = articles.filter(a => ['review', 'seo_review', 'compliance_review'].includes(a.status));

    const missingMetaTitle = articles.filter(a => !a.meta_title && !a.seo_title).length;
    const missingMetaDesc = articles.filter(a => !a.meta_description && !a.seo_description).length;
    const missingFeaturedImage = articles.filter(a => !a.featured_image).length;
    const missingExcerpt = articles.filter(a => !a.excerpt).length;
    const belowWordCount = articles.filter(a => (a.word_count || 0) < 1000).length;
    const missingInternalLinks = articles.filter(a => (a.internal_link_count || 0) < 3).length;

    const totalWords = articles.reduce((sum: number, a: any) => sum + (a.word_count || 0), 0);
    const averageWordCount = articles.length ? Math.round(totalWords / articles.length) : 0;

    // Health score: % of articles meeting all SEO criteria
    const compliant = articles.filter(a =>
      (a.meta_title || a.seo_title) &&
      (a.meta_description || a.seo_description) &&
      a.featured_image &&
      a.excerpt &&
      (a.word_count || 0) >= 1000 &&
      (a.internal_link_count || 0) >= 3
    ).length;
    const linkingHealthScore = articles.length ? Math.round((compliant / articles.length) * 100) : 100;

    return {
      totalArticles: articles.length,
      publishedCount: published.length,
      draftCount: drafts.length,
      reviewCount: inReview.length,
      missingMetaTitle,
      missingMetaDesc,
      missingFeaturedImage,
      missingExcerpt,
      belowWordCount,
      missingInternalLinks,
      averageWordCount,
      linkingHealthScore,
    };
  },

  async getArticlesForSEO(filters?: {
    status?: string;
    categorySlug?: string;
    authorId?: string;
  }): Promise<SEOArticleRow[]> {
    let query = db('articles')
      .select('id, title, slug, status, word_count, meta_title, seo_title, meta_description, seo_description, featured_image, excerpt, internal_link_count, reading_time, published_at, updated_at, category:categories(name, slug), author:authors(name)')
      .order('updated_at', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.authorId) query = query.eq('author_id', filters.authorId);

    const { data, error } = await query;
    if (error) { console.error('SEO articles error:', error); return []; }

    let rows = (data || []) as SEOArticleRow[];
    if (filters?.categorySlug) {
      rows = rows.filter(r => r.category?.slug === filters.categorySlug);
    }
    return rows;
  },

  async getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
    const { data } = await db('categories').select('id, name, slug').eq('is_active', true).order('sort_order');
    return (data || []) as any[];
  },

  async getAuthors(): Promise<{ id: string; name: string }[]> {
    const { data } = await db('authors').select('id, name').order('name');
    return (data || []) as any[];
  },
};
