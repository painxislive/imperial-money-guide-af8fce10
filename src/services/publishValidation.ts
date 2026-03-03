import { db } from '@/lib/supabase-helpers';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates that an article meets all requirements before publishing.
 */
export async function validateForPublish(articleId: string): Promise<ValidationError[]> {
  const { data: article, error } = await db('articles')
    .select('*, category:categories(id, name), author:authors!articles_author_id_fkey(id, name)')
    .eq('id', articleId)
    .single();

  if (error || !article) {
    return [{ field: 'article', message: 'Article not found.' }];
  }

  const errors: ValidationError[] = [];

  if ((article.word_count || 0) < 1000) {
    errors.push({ field: 'word_count', message: `Word count is ${article.word_count || 0}. Minimum 1000 words required.` });
  }

  if (!article.meta_title && !article.seo_title) {
    errors.push({ field: 'meta_title', message: 'Meta title is required before publishing.' });
  }

  if (!article.meta_description && !article.seo_description) {
    errors.push({ field: 'meta_description', message: 'Meta description is required before publishing.' });
  }

  if (!article.featured_image) {
    errors.push({ field: 'featured_image', message: 'Featured image is required before publishing.' });
  }

  if (!article.excerpt) {
    errors.push({ field: 'excerpt', message: 'Excerpt is required before publishing.' });
  }

  if (!article.category_id) {
    errors.push({ field: 'category', message: 'Category must be assigned before publishing.' });
  }

  if (!article.author_id) {
    errors.push({ field: 'author', message: 'Author must be assigned before publishing.' });
  }

  // 3 related articles
  const { data: related } = await db('related_articles')
    .select('id')
    .eq('article_id', articleId);

  if (!related || related.length < 3) {
    errors.push({ field: 'related_articles', message: `${related?.length || 0} related articles linked. Minimum 3 required.` });
  }

  return errors;
}
