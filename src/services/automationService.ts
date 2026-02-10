import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/supabase-helpers";

const FUNCTIONS_BASE = "https://tjutdnnqlkujzltpvpwd.supabase.co/functions/v1";

export interface AutomationSettings {
  automation_enabled: boolean;
  daily_post_limit: number;
  growth_threshold: number;
  publish_mode: "approval_required" | "auto_publish" | "hybrid";
  hybrid_threshold: number;
}

export interface TrackedKeyword {
  id: string;
  keyword: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface DetectedTrend {
  id: string;
  keyword: string;
  growth_percentage: number;
  source: string;
  source_url: string | null;
  category: string;
  geo_relevance: string[];
  confirming_sources: number;
  status: string;
  article_id: string | null;
  raw_data: Record<string, unknown>;
  created_at: string;
}

export interface PipelineLog {
  id: string;
  trend_id: string | null;
  article_id: string | null;
  stage: string;
  status: string;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
}

export interface TrendSource {
  id: string;
  name: string;
  source_type: string;
  config: Record<string, unknown>;
  is_active: boolean;
  last_checked_at: string | null;
  created_at: string;
}

export const automationService = {
  // ─── Settings ───
  async getSettings(): Promise<AutomationSettings> {
    const { data } = await db("automation_settings").select("*");
    const settings: Record<string, any> = {};
    for (const row of data || []) {
      settings[row.setting_key] = row.setting_value;
    }
    return {
      automation_enabled: settings.automation_enabled?.enabled ?? false,
      daily_post_limit: settings.daily_post_limit?.value ?? 25,
      growth_threshold: settings.growth_threshold?.value ?? 150,
      publish_mode: settings.publish_mode?.mode ?? "approval_required",
      hybrid_threshold: settings.publish_mode?.hybrid_threshold ?? 50,
    };
  },

  async updateSetting(key: string, value: Record<string, unknown>) {
    const { data: existing } = await db("automation_settings")
      .select("id")
      .eq("setting_key", key)
      .single();

    if (existing) {
      return db("automation_settings")
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq("setting_key", key);
    } else {
      return db("automation_settings")
        .insert({ setting_key: key, setting_value: value });
    }
  },

  // ─── Keywords ───
  async getKeywords(): Promise<TrackedKeyword[]> {
    const { data } = await db("tracked_keywords")
      .select("*")
      .order("category")
      .order("keyword");
    return (data || []) as TrackedKeyword[];
  },

  async addKeyword(keyword: string, category: string) {
    return db("tracked_keywords").insert({ keyword, category, is_active: true });
  },

  async toggleKeyword(id: string, isActive: boolean) {
    return db("tracked_keywords").update({ is_active: isActive }).eq("id", id);
  },

  async deleteKeyword(id: string) {
    return db("tracked_keywords").delete().eq("id", id);
  },

  // ─── Trends ───
  async getTrends(status?: string, limit = 50): Promise<DetectedTrend[]> {
    let query = db("detected_trends")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) query = query.eq("status", status);
    const { data } = await query;
    return (data || []) as DetectedTrend[];
  },

  // ─── Pipeline Logs ───
  async getPipelineLogs(limit = 50): Promise<PipelineLog[]> {
    const { data } = await db("content_pipeline")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data || []) as PipelineLog[];
  },

  // ─── Trend Sources ───
  async getSources(): Promise<TrendSource[]> {
    const { data } = await db("trend_sources").select("*").order("name");
    return (data || []) as TrendSource[];
  },

  async addSource(name: string, sourceType: string, config: Record<string, unknown>) {
    return db("trend_sources").insert({ name, source_type: sourceType, config, is_active: true });
  },

  async toggleSource(id: string, isActive: boolean) {
    return db("trend_sources").update({ is_active: isActive }).eq("id", id);
  },

  async deleteSource(id: string) {
    return db("trend_sources").delete().eq("id", id);
  },

  // ─── Draft Articles (AI-generated, pending approval) ───
  async getDraftArticles(limit = 50) {
    const { data } = await db("articles")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data || [];
  },

  // ─── Edge Function Triggers ───
  async triggerTrendDetection() {
    const { data: { session } } = await supabase.auth.getSession();
    const resp = await fetch(`${FUNCTIONS_BASE}/detect-trends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
    });
    return resp.json();
  },

  async triggerContentGeneration(trendId?: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const resp = await fetch(`${FUNCTIONS_BASE}/generate-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify(trendId ? { trend_id: trendId } : {}),
    });
    return resp.json();
  },

  async publishArticle(articleId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const resp = await fetch(`${FUNCTIONS_BASE}/publish-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({ action: "publish", article_id: articleId }),
    });
    return resp.json();
  },

  async rejectArticle(articleId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const resp = await fetch(`${FUNCTIONS_BASE}/publish-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({ action: "reject", article_id: articleId }),
    });
    return resp.json();
  },

  async runFullPipeline() {
    const { data: { session } } = await supabase.auth.getSession();
    const resp = await fetch(`${FUNCTIONS_BASE}/publish-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({ action: "run_pipeline" }),
    });
    return resp.json();
  },

  // ─── Stats ───
  async getAutomationStats() {
    const today = new Date().toISOString().split("T")[0];

    const [
      { count: totalArticles },
      { count: todayArticles },
      { count: pendingTrends },
      { count: draftArticles },
      { count: totalKeywords },
    ] = await Promise.all([
      db("articles").select("*", { count: "exact", head: true }),
      db("articles").select("*", { count: "exact", head: true }).gte("created_at", today),
      db("detected_trends").select("*", { count: "exact", head: true }).eq("status", "pending"),
      db("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      db("tracked_keywords").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);

    return {
      totalArticles: totalArticles || 0,
      todayArticles: todayArticles || 0,
      pendingTrends: pendingTrends || 0,
      draftArticles: draftArticles || 0,
      totalKeywords: totalKeywords || 0,
    };
  },
};
