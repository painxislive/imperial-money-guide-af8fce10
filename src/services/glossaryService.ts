import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/supabase-helpers";

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  letter: string;
  short_definition: string;
  full_definition: string;
  definition?: string; // Legacy field
  example?: string;
  category: string;
  subcategory?: string;
  related_terms: string[];
  author_id?: string;
  author?: Author;
  status: 'draft' | 'published';
  is_published?: boolean; // Legacy field
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlossaryTermInput {
  term: string;
  short_definition: string;
  full_definition: string;
  example?: string;
  category: string;
  subcategory?: string;
  related_terms?: string[];
  author_id?: string;
  status?: 'draft' | 'published';
}

// Generate slug from term
export const generateSlug = (term: string): string => {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get letter from term
export const getLetterFromTerm = (term: string): string => {
  return term.charAt(0).toUpperCase();
};

// Glossary categories
export const GLOSSARY_CATEGORIES = [
  'General',
  'Banking',
  'Investing',
  'Insurance',
  'Taxation',
  'Economics',
  'Cryptocurrency',
  'Real Estate',
  'Personal Finance',
  'Corporate Finance',
  'Trading',
  'Retirement'
] as const;

export const glossaryService = {
  // Fetch all published terms
  async getPublishedTerms(): Promise<GlossaryTerm[]> {
    const { data, error } = await db('glossary_terms')
      .select(`
        *,
        author:authors(*)
      `)
      .or('status.eq.published,is_published.eq.true')
      .order('term', { ascending: true });

    if (error) {
      console.error('Error fetching glossary terms:', error);
      return [];
    }

    return (data || []) as GlossaryTerm[];
  },

  // Fetch terms by letter
  async getTermsByLetter(letter: string): Promise<GlossaryTerm[]> {
    const { data, error } = await db('glossary_terms')
      .select(`
        *,
        author:authors(*)
      `)
      .eq('letter', letter.toUpperCase())
      .or('status.eq.published,is_published.eq.true')
      .order('term', { ascending: true });

    if (error) {
      console.error('Error fetching terms by letter:', error);
      return [];
    }

    return (data || []) as GlossaryTerm[];
  },

  // Fetch single term by slug
  async getTermBySlug(slug: string): Promise<GlossaryTerm | null> {
    const { data, error } = await db('glossary_terms')
      .select(`
        *,
        author:authors(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching term:', error);
      return null;
    }

    return data as GlossaryTerm;
  },

  // Get letter counts for navigation
  async getLetterCounts(): Promise<Record<string, number>> {
    const { data, error } = await db('glossary_terms')
      .select('letter')
      .or('status.eq.published,is_published.eq.true');

    if (error) {
      console.error('Error fetching letter counts:', error);
      return {};
    }

    const counts: Record<string, number> = {};
    (data || []).forEach((item: { letter: string }) => {
      const letter = item.letter.toUpperCase();
      counts[letter] = (counts[letter] || 0) + 1;
    });

    return counts;
  },

  // Admin: Fetch all terms (including drafts)
  async getAllTerms(): Promise<GlossaryTerm[]> {
    const { data, error } = await db('glossary_terms')
      .select(`
        *,
        author:authors(*)
      `)
      .order('term', { ascending: true });

    if (error) {
      console.error('Error fetching all terms:', error);
      return [];
    }

    return (data || []) as GlossaryTerm[];
  },

  // Admin: Create term
  async createTerm(input: GlossaryTermInput): Promise<{ data: GlossaryTerm | null; error: any }> {
    const slug = generateSlug(input.term);
    const letter = getLetterFromTerm(input.term);
    
    const { data, error } = await db('glossary_terms')
      .insert({
        ...input,
        slug,
        letter,
        definition: input.short_definition, // Legacy field compatibility
        is_published: input.status === 'published',
        published_at: input.status === 'published' ? new Date().toISOString() : null,
        related_terms: input.related_terms || []
      })
      .select(`
        *,
        author:authors(*)
      `)
      .single();

    return { data: data as GlossaryTerm, error };
  },

  // Admin: Update term
  async updateTerm(id: string, input: Partial<GlossaryTermInput>): Promise<{ data: GlossaryTerm | null; error: any }> {
    const updateData: any = { ...input };
    
    // Update slug and letter if term changed
    if (input.term) {
      updateData.slug = generateSlug(input.term);
      updateData.letter = getLetterFromTerm(input.term);
    }
    
    // Legacy field compatibility
    if (input.short_definition) {
      updateData.definition = input.short_definition;
    }
    
    if (input.status) {
      updateData.is_published = input.status === 'published';
      if (input.status === 'published') {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await db('glossary_terms')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        author:authors(*)
      `)
      .single();

    return { data: data as GlossaryTerm, error };
  },

  // Admin: Delete term
  async deleteTerm(id: string): Promise<{ error: any }> {
    const { error } = await db('glossary_terms')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Fetch all authors
  async getAuthors(): Promise<Author[]> {
    const { data, error } = await db('authors')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching authors:', error);
      return [];
    }

    return (data || []) as Author[];
  },

  // Search terms
  async searchTerms(query: string): Promise<GlossaryTerm[]> {
    const { data, error } = await db('glossary_terms')
      .select(`
        *,
        author:authors(*)
      `)
      .or('status.eq.published,is_published.eq.true')
      .or(`term.ilike.%${query}%,short_definition.ilike.%${query}%,definition.ilike.%${query}%`)
      .order('term', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error searching terms:', error);
      return [];
    }

    return (data || []) as GlossaryTerm[];
  },

  // Get related terms
  async getRelatedTerms(slugs: string[]): Promise<GlossaryTerm[]> {
    if (!slugs.length) return [];
    
    const { data, error } = await db('glossary_terms')
      .select('id, term, slug, short_definition, definition')
      .in('slug', slugs)
      .or('status.eq.published,is_published.eq.true');

    if (error) {
      console.error('Error fetching related terms:', error);
      return [];
    }

    return (data || []) as GlossaryTerm[];
  },

  // Subscribe to real-time updates
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('glossary_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'glossary_terms' },
        callback
      )
      .subscribe();
  }
};
