import { db } from '@/lib/supabase-helpers';
import { supabase } from '@/integrations/supabase/client';
import { SecureEditLink, Article } from '@/types/database';

// Generate a secure random token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const secureEditService = {
  // ADMIN: Create a secure edit link
  async createSecureEditLink(
    articleId: string,
    expiresInHours: number = 24,
    maxUses: number = 1
  ): Promise<{ data: SecureEditLink | null; error: any }> {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await db('secure_edit_links')
      .insert({
        article_id: articleId,
        token,
        created_by: user?.id,
        expires_at: expiresAt.toISOString(),
        max_uses: maxUses,
      })
      .select()
      .single();

    return { data: data as SecureEditLink, error };
  },

  // Validate a secure edit link
  async validateSecureEditLink(token: string): Promise<{
    valid: boolean;
    article: Article | null;
    error: string | null;
  }> {
    // Get the link
    const { data: link, error } = await db('secure_edit_links')
      .select(`
        *,
        article:articles(*)
      `)
      .eq('token', token)
      .single();

    if (error || !link) {
      return { valid: false, article: null, error: 'Invalid or expired edit link' };
    }

    // Check if revoked
    if (link.is_revoked) {
      return { valid: false, article: null, error: 'This edit link has been revoked' };
    }

    // Check if expired
    if (new Date(link.expires_at) < new Date()) {
      return { valid: false, article: null, error: 'This edit link has expired' };
    }

    // Check if max uses exceeded
    if (link.use_count >= link.max_uses) {
      return { valid: false, article: null, error: 'This edit link has reached its maximum number of uses' };
    }

    return { valid: true, article: link.article as Article, error: null };
  },

  // Use a secure edit link (increment use count)
  async useSecureEditLink(token: string): Promise<{ success: boolean; error: any }> {
    const { data: link } = await db('secure_edit_links')
      .select('use_count')
      .eq('token', token)
      .single();

    if (!link) {
      return { success: false, error: { message: 'Link not found' } };
    }

    const { error } = await db('secure_edit_links')
      .update({ use_count: link.use_count + 1 })
      .eq('token', token);

    return { success: !error, error };
  },

  // ADMIN: Revoke a secure edit link
  async revokeSecureEditLink(id: string): Promise<{ error: any }> {
    const { error } = await db('secure_edit_links')
      .update({ is_revoked: true })
      .eq('id', id);

    return { error };
  },

  // ADMIN: Get all secure edit links for an article
  async getSecureEditLinks(articleId: string): Promise<SecureEditLink[]> {
    const { data, error } = await db('secure_edit_links')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching secure edit links:', error);
      return [];
    }

    return (data || []) as SecureEditLink[];
  },

  // ADMIN: Get all active secure edit links
  async getAllActiveLinks(): Promise<SecureEditLink[]> {
    const { data, error } = await db('secure_edit_links')
      .select(`
        *,
        article:articles(id, title, slug)
      `)
      .eq('is_revoked', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active links:', error);
      return [];
    }

    return (data || []) as SecureEditLink[];
  },

  // Generate shareable URL
  getShareableUrl(token: string): string {
    return `${window.location.origin}/edit/${token}`;
  },
};

export default secureEditService;
