import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://tjutdnnqlkujzltpvpwd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Safety filters for generated content
const FORBIDDEN_PHRASES = [
  "guaranteed profit", "guaranteed returns", "risk-free investment",
  "get rich quick", "double your money", "financial advice",
  "you should buy", "you should sell", "buy now", "sell now",
  "investment advice", "100x gains", "moon", "to the moon",
  "not financial advice but you should", "insider information",
  "pump", "dump", "rug pull", "free money"
];

const REQUIRED_DISCLAIMER = `<div class="risk-disclaimer"><p><strong>Disclaimer:</strong> This article is for informational and educational purposes only. It does not constitute financial advice, investment recommendations, or endorsements. Always conduct your own research and consult a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.</p></div>`;

interface GenerateRequest {
  trend_id?: string;
  keyword?: string;
  category?: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80)
    .replace(/^-|-$/g, "");
}

function selectArticleFormat(keyword: string): { format: string; titleTemplate: string } {
  const formats = [
    { format: "trending", titleTemplate: `Why ${keyword} Is Trending Today` },
    { format: "explained", titleTemplate: `Explained: ${keyword}` },
    { format: "market_impact", titleTemplate: `What ${keyword} Means for Markets` },
  ];
  const hash = keyword.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return formats[hash % formats.length];
}

function buildPrompt(keyword: string, category: string, format: string, titleTemplate: string): string {
  return `You are a professional financial journalist writing for Imperialpedia, a trusted global finance education platform similar to Investopedia.

Write a comprehensive, SEO-optimized article about: "${keyword}"

ARTICLE FORMAT: ${format}
SUGGESTED TITLE: ${titleTemplate}

STRICT REQUIREMENTS:
1. Write in professional, neutral, educational US English
2. NEVER give financial advice, investment recommendations, or profit predictions
3. NEVER use hype language, promises, or promotional content
4. Always present multiple viewpoints and note uncertainties
5. Include factual context and explain WHY this topic matters
6. Target audience: educated adults in US, UK, Canada, Australia, EU

STRUCTURE (use HTML):
- <h1> tag with SEO-optimized title (under 60 chars)
- Opening paragraph explaining the topic and why it matters NOW
- <h2> sections covering: Background/Context, Current Situation, Market Impact/Analysis, Expert Perspectives, What to Watch
- Each section should be 150-250 words
- Total article: 800-1500 words
- Close with a balanced summary

TONE: Professional, educational, neutral. Like Bloomberg or Reuters analysis.

ALSO PROVIDE (as JSON at the very end, wrapped in <metadata> tags):
<metadata>
{
  "seo_title": "under 60 chars with main keyword",
  "seo_description": "under 160 chars compelling meta description",
  "excerpt": "2-3 sentence summary for article cards",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "${category}"
}
</metadata>

Write the full article now:`;
}

function contentSafetyCheck(content: string): { safe: boolean; issues: string[] } {
  const issues: string[] = [];
  const lower = content.toLowerCase();

  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) {
      issues.push(`Contains forbidden phrase: "${phrase}"`);
    }
  }

  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    issues.push("Too many exclamation marks (hype indicator)");
  }

  const capsWords = content.match(/\b[A-Z]{4,}\b/g) || [];
  const allowedCaps = ["NYSE", "NASDAQ", "FTSE", "HTML", "JSON", "FOMC", "FDIC", "CFTC"];
  const badCaps = capsWords.filter(w => !allowedCaps.includes(w));
  if (badCaps.length > 2) {
    issues.push("Too many ALL-CAPS words");
  }

  if (content.length < 500) {
    issues.push("Content too short (minimum 500 characters)");
  }

  return { safe: issues.length === 0, issues };
}

async function generateWithAI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a professional financial journalist. Write neutral, educational content. Never give financial advice."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limited - please try again later");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted - please add funds");
    }
    const err = await response.text();
    throw new Error(`AI generation failed: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseGeneratedContent(raw: string): {
  content: string;
  metadata: Record<string, any>;
} {
  let content = raw;
  let metadata: Record<string, any> = {};

  const metadataMatch = raw.match(/<metadata>([\s\S]*?)<\/metadata>/);
  if (metadataMatch) {
    try {
      metadata = JSON.parse(metadataMatch[1].trim());
    } catch (e) {
      console.error("Failed to parse metadata:", e);
    }
    content = raw.replace(/<metadata>[\s\S]*?<\/metadata>/, "").trim();
  }

  content += "\n\n" + REQUIRED_DISCLAIMER;

  return { content, metadata };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: GenerateRequest = req.method === "POST" ? await req.json() : {};

    // Check automation status
    const { data: settings } = await supabase
      .from("automation_settings")
      .select("setting_value")
      .eq("setting_key", "automation_enabled")
      .single();

    if (settings && settings.setting_value?.enabled === false) {
      return new Response(
        JSON.stringify({ message: "Automation is paused" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check daily article limit
    const { data: limitSetting } = await supabase
      .from("automation_settings")
      .select("setting_value")
      .eq("setting_key", "daily_post_limit")
      .single();

    const dailyLimit = limitSetting?.setting_value?.value || 25;

    const today = new Date().toISOString().split("T")[0];
    const { count: todayCount } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today)
      .eq("source_type", "ai_generated");

    if ((todayCount || 0) >= dailyLimit) {
      return new Response(
        JSON.stringify({ message: `Daily limit reached (${dailyLimit})` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get trend to process
    let trend: any = null;
    if (body.trend_id) {
      const { data } = await supabase
        .from("detected_trends")
        .select("*")
        .eq("id", body.trend_id)
        .single();
      trend = data;
    } else {
      const { data } = await supabase
        .from("detected_trends")
        .select("*")
        .eq("status", "pending")
        .order("growth_percentage", { ascending: false })
        .limit(1)
        .single();
      trend = data;
    }

    if (!trend && !body.keyword) {
      return new Response(
        JSON.stringify({ message: "No pending trends to process" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keyword = trend?.keyword || body.keyword || "";
    const category = trend?.category || body.category || "markets";

    // Mark trend as processing
    if (trend) {
      await supabase
        .from("detected_trends")
        .update({ status: "processing" })
        .eq("id", trend.id);
    }

    const { format, titleTemplate } = selectArticleFormat(keyword);
    const prompt = buildPrompt(keyword, category, format, titleTemplate);

    console.log(`Generating article for: "${keyword}" (format: ${format})`);

    // Log pipeline start
    const { data: pipelineLog } = await supabase
      .from("content_pipeline")
      .insert({
        trend_id: trend?.id || null,
        stage: "content_generation",
        status: "processing",
        input_data: { keyword, category, format }
      })
      .select()
      .single();

    // Generate content via Lovable AI gateway
    const rawContent = await generateWithAI(prompt);
    const { content, metadata } = parseGeneratedContent(rawContent);

    // Safety check
    const safetyResult = contentSafetyCheck(content);
    if (!safetyResult.safe) {
      console.error("Content failed safety check:", safetyResult.issues);

      if (trend) {
        await supabase
          .from("detected_trends")
          .update({ status: "rejected" })
          .eq("id", trend.id);
      }

      await supabase
        .from("content_pipeline")
        .update({
          status: "rejected",
          error_message: `Safety check failed: ${safetyResult.issues.join(", ")}`,
          output_data: { safety_issues: safetyResult.issues }
        })
        .eq("id", pipelineLog?.id);

      return new Response(
        JSON.stringify({
          message: "Content rejected by safety filters",
          issues: safetyResult.issues
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check publish mode
    const { data: publishModeSetting } = await supabase
      .from("automation_settings")
      .select("setting_value")
      .eq("setting_key", "publish_mode")
      .single();

    const publishMode = publishModeSetting?.setting_value?.mode || "approval_required";

    const { count: totalPublished } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("source_type", "ai_generated")
      .eq("is_published", true);

    const hybridThreshold = publishModeSetting?.setting_value?.hybrid_threshold || 50;
    const shouldAutoPublish = publishMode === "auto_publish" ||
      (publishMode === "hybrid" && (totalPublished || 0) >= hybridThreshold);

    const title = metadata.seo_title || titleTemplate;
    const slug = generateSlug(title) + "-" + Date.now().toString(36);

    // Create article (matching existing schema: is_published boolean, content field)
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        content,
        excerpt: metadata.excerpt || content.substring(0, 300),
        category: category,
        is_published: shouldAutoPublish,
        is_featured: false,
        seo_title: metadata.seo_title || title,
        seo_description: metadata.seo_description || null,
        tags: metadata.tags || [keyword],
        source_type: "ai_generated",
        trend_id: trend?.id || null,
        published_at: shouldAutoPublish ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (articleError) {
      throw new Error(`Failed to create article: ${articleError.message}`);
    }

    // Update trend status
    if (trend) {
      await supabase
        .from("detected_trends")
        .update({
          status: "processed",
          article_id: article.id
        })
        .eq("id", trend.id);
    }

    // Update pipeline log
    await supabase
      .from("content_pipeline")
      .update({
        status: "completed",
        article_id: article.id,
        output_data: {
          title: article.title,
          slug: article.slug,
          auto_published: shouldAutoPublish,
          word_count: content.split(/\s+/).length
        }
      })
      .eq("id", pipelineLog?.id);

    return new Response(
      JSON.stringify({
        message: shouldAutoPublish ? "Article generated and published" : "Article generated as draft (requires approval)",
        article: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          is_published: article.is_published
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Content generation error:", error);

    await supabase.from("content_pipeline").insert({
      stage: "content_generation",
      status: "failed",
      error_message: error.message
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
