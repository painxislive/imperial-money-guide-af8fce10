import { db } from "@/lib/supabase-helpers";

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  show_in_nav: boolean;
  is_active: boolean;
  parent_id: string | null;
  created_at: string;
}

export interface NewsCountry {
  id: string;
  name: string;
  slug: string;
  code: string;
  region: string | null;
  flag_emoji: string | null;
  is_active: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  source_type: string;
  category_id: string | null;
  is_active: boolean;
  last_fetched_at: string | null;
  fetch_interval_minutes: number;
  config: Record<string, unknown>;
}

export const newsService = {
  // Categories
  async getCategories(navOnly = false): Promise<NewsCategory[]> {
    let query = db("news_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (navOnly) query = query.eq("show_in_nav", true);
    const { data } = await query;
    return (data || []) as NewsCategory[];
  },

  async getCategoryBySlug(slug: string): Promise<NewsCategory | null> {
    const { data } = await db("news_categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return data as NewsCategory | null;
  },

  async upsertCategory(cat: Partial<NewsCategory>) {
    if (cat.id) {
      return db("news_categories").update(cat).eq("id", cat.id);
    }
    return db("news_categories").insert(cat);
  },

  async deleteCategory(id: string) {
    return db("news_categories").delete().eq("id", id);
  },

  // Countries
  async getCountries(): Promise<NewsCountry[]> {
    const { data } = await db("news_countries")
      .select("*")
      .eq("is_active", true)
      .order("name");
    return (data || []) as NewsCountry[];
  },

  async getCountryBySlug(slug: string): Promise<NewsCountry | null> {
    const { data } = await db("news_countries")
      .select("*")
      .eq("slug", slug)
      .single();
    return data as NewsCountry | null;
  },

  // Articles by category
  async getArticlesByCategory(categorySlug: string, limit = 20) {
    const { data } = await db("articles")
      .select("*")
      .eq("is_published", true)
      .eq("category", categorySlug)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data || [];
  },

  // Articles by country
  async getArticlesByCountry(countryId: string, limit = 20) {
    const { data } = await db("articles")
      .select("*")
      .eq("is_published", true)
      .eq("country_id", countryId)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data || [];
  },

  // Sources
  async getSources(): Promise<NewsSource[]> {
    const { data } = await db("news_sources").select("*").order("name");
    return (data || []) as NewsSource[];
  },

  async upsertSource(source: Partial<NewsSource>) {
    if (source.id) {
      return db("news_sources").update(source).eq("id", source.id);
    }
    return db("news_sources").insert(source);
  },

  async deleteSource(id: string) {
    return db("news_sources").delete().eq("id", id);
  },

  async toggleSource(id: string, isActive: boolean) {
    return db("news_sources").update({ is_active: isActive }).eq("id", id);
  },
};
