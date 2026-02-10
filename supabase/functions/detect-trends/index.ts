import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://tjutdnnqlkujzltpvpwd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Scam/spam keyword blacklist
const BLACKLIST_KEYWORDS = [
  "guaranteed profit", "100x", "1000x", "free money", "airdrop giveaway",
  "pump and dump", "get rich quick", "double your money", "risk-free",
  "guaranteed returns", "ponzi", "pyramid scheme", "mlm", "send me crypto",
  "whale alert buy now", "insider tip", "secret strategy"
];

// Finance-relevant categories
const FINANCE_CATEGORIES = [
  "markets", "investing", "crypto", "blockchain", "regulations", "policy",
  "etf", "institutions", "macroeconomics", "forex", "commodities",
  "stocks", "bonds", "banking", "fintech", "defi", "nft"
];

interface DetectedTrend {
  keyword: string;
  growth_percentage: number;
  source: string;
  source_url: string | null;
  category: string;
  geo_relevance: string[];
  confirming_sources: number;
  raw_data: Record<string, unknown>;
}

// ─── RSS Feed Detection ───
async function detectRSSFeeds(): Promise<DetectedTrend[]> {
  const trends: DetectedTrend[] = [];
  
  const { data: sources } = await supabase
    .from("trend_sources")
    .select("*")
    .eq("source_type", "rss")
    .eq("is_active", true);

  if (!sources || sources.length === 0) {
    // Use default RSS feeds
    const defaultFeeds = [
      { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "crypto" },
      { name: "Reuters Business", url: "https://feeds.reuters.com/reuters/businessNews", category: "markets" },
      { name: "Bloomberg Markets", url: "https://feeds.bloomberg.com/markets/news.rss", category: "markets" },
      { name: "CNBC Finance", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664", category: "markets" },
      { name: "CoinTelegraph", url: "https://cointelegraph.com/rss", category: "crypto" },
    ];

    for (const feed of defaultFeeds) {
      try {
        const response = await fetch(feed.url, { 
          headers: { "User-Agent": "Imperialpedia/1.0" },
          signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) continue;
        const text = await response.text();
        const items = parseRSSItems(text);

        for (const item of items.slice(0, 5)) {
          const keyword = extractKeyword(item.title);
          if (keyword && isFinanceRelated(keyword)) {
            trends.push({
              keyword,
              growth_percentage: 100,
              source: `rss:${feed.name}`,
              source_url: item.link || null,
              category: feed.category,
              geo_relevance: ["US", "UK", "CA", "AU", "EU"],
              confirming_sources: 1,
              raw_data: { title: item.title, pubDate: item.pubDate, feedName: feed.name }
            });
          }
        }
      } catch (e) {
        console.error(`RSS fetch failed for ${feed.name}:`, e);
      }
    }
  } else {
    for (const source of sources) {
      try {
        const response = await fetch(source.config.url, {
          headers: { "User-Agent": "Imperialpedia/1.0" },
          signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) continue;
        const text = await response.text();
        const items = parseRSSItems(text);

        for (const item of items.slice(0, 5)) {
          const keyword = extractKeyword(item.title);
          if (keyword && isFinanceRelated(keyword)) {
            trends.push({
              keyword,
              growth_percentage: 100,
              source: `rss:${source.name}`,
              source_url: item.link || null,
              category: source.config.category || "markets",
              geo_relevance: ["US", "UK", "CA", "AU", "EU"],
              confirming_sources: 1,
              raw_data: { title: item.title, pubDate: item.pubDate, feedName: source.name }
            });
          }
        }
      } catch (e) {
        console.error(`RSS fetch failed for ${source.name}:`, e);
      }
    }
  }

  return trends;
}

// ─── Google Trends via SerpAPI ───
async function detectGoogleTrends(): Promise<DetectedTrend[]> {
  const trends: DetectedTrend[] = [];
  const serpApiKey = Deno.env.get("SERPAPI_KEY");
  if (!serpApiKey) {
    console.log("SERPAPI_KEY not configured, skipping Google Trends");
    return trends;
  }

  // Get tracked keywords
  const { data: keywords } = await supabase
    .from("tracked_keywords")
    .select("keyword, category")
    .eq("is_active", true)
    .limit(20);

  const keywordsToCheck = keywords?.length
    ? keywords.map(k => ({ keyword: k.keyword, category: k.category }))
    : [
        { keyword: "bitcoin", category: "crypto" },
        { keyword: "stock market", category: "markets" },
        { keyword: "interest rates", category: "macroeconomics" },
        { keyword: "ethereum", category: "crypto" },
        { keyword: "federal reserve", category: "macroeconomics" },
      ];

  for (const kw of keywordsToCheck.slice(0, 10)) {
    try {
      const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(kw.keyword)}&data_type=TIMESERIES&date=now+1-d&api_key=${serpApiKey}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!resp.ok) continue;
      const data = await resp.json();

      const timelineData = data?.interest_over_time?.timeline_data;
      if (timelineData && timelineData.length >= 2) {
        const recent = timelineData[timelineData.length - 1]?.values?.[0]?.extracted_value || 0;
        const previous = timelineData[Math.max(0, timelineData.length - 4)]?.values?.[0]?.extracted_value || 1;
        const growth = previous > 0 ? ((recent - previous) / previous) * 100 : 0;

        if (growth > 50) {
          trends.push({
            keyword: kw.keyword,
            growth_percentage: Math.round(growth),
            source: "google_trends",
            source_url: null,
            category: kw.category,
            geo_relevance: ["US", "UK", "CA", "AU", "EU"],
            confirming_sources: 1,
            raw_data: { recent_value: recent, previous_value: previous, growth }
          });
        }
      }
    } catch (e) {
      console.error(`Google Trends check failed for ${kw.keyword}:`, e);
    }
  }

  return trends;
}

// ─── Reddit Detection ───
async function detectRedditTrends(): Promise<DetectedTrend[]> {
  const trends: DetectedTrend[] = [];
  const clientId = Deno.env.get("REDDIT_CLIENT_ID");
  const clientSecret = Deno.env.get("REDDIT_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    console.log("Reddit credentials not configured, skipping");
    return trends;
  }

  try {
    // Get OAuth token
    const tokenResp = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Imperialpedia/1.0"
      },
      body: "grant_type=client_credentials",
      signal: AbortSignal.timeout(10000)
    });
    
    if (!tokenResp.ok) return trends;
    const { access_token } = await tokenResp.json();

    const subreddits = ["finance", "cryptocurrency", "stocks", "economics", "wallstreetbets"];

    for (const sub of subreddits) {
      try {
        const resp = await fetch(`https://oauth.reddit.com/r/${sub}/hot?limit=5`, {
          headers: {
            "Authorization": `Bearer ${access_token}`,
            "User-Agent": "Imperialpedia/1.0"
          },
          signal: AbortSignal.timeout(10000)
        });
        if (!resp.ok) continue;
        const data = await resp.json();

        for (const post of data?.data?.children || []) {
          const title = post.data.title;
          const score = post.data.score;
          if (score > 500) {
            const keyword = extractKeyword(title);
            if (keyword && isFinanceRelated(keyword)) {
              trends.push({
                keyword,
                growth_percentage: Math.min(score / 5, 500),
                source: `reddit:r/${sub}`,
                source_url: `https://reddit.com${post.data.permalink}`,
                category: sub === "cryptocurrency" ? "crypto" : "markets",
                geo_relevance: ["US", "UK", "CA", "AU", "EU"],
                confirming_sources: 1,
                raw_data: { title, score, subreddit: sub, num_comments: post.data.num_comments }
              });
            }
          }
        }
      } catch (e) {
        console.error(`Reddit fetch failed for r/${sub}:`, e);
      }
    }
  } catch (e) {
    console.error("Reddit auth failed:", e);
  }

  return trends;
}

// ─── Twitter/X Detection ───
async function detectTwitterTrends(): Promise<DetectedTrend[]> {
  const trends: DetectedTrend[] = [];
  const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");

  if (!bearerToken) {
    console.log("Twitter credentials not configured, skipping");
    return trends;
  }

  try {
    // Search recent tweets with finance keywords
    const financeQueries = ["bitcoin", "stock market crash", "federal reserve", "ETF approval", "crypto regulation"];
    
    for (const query of financeQueries.slice(0, 3)) {
      try {
        const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query + " -is:retweet lang:en")}&max_results=10&tweet.fields=public_metrics,created_at`;
        const resp = await fetch(url, {
          headers: { "Authorization": `Bearer ${bearerToken}` },
          signal: AbortSignal.timeout(10000)
        });
        if (!resp.ok) continue;
        const data = await resp.json();

        const totalEngagement = (data.data || []).reduce((sum: number, t: any) => {
          return sum + (t.public_metrics?.like_count || 0) + (t.public_metrics?.retweet_count || 0);
        }, 0);

        if (totalEngagement > 1000) {
          trends.push({
            keyword: query,
            growth_percentage: Math.min(totalEngagement / 10, 500),
            source: "twitter",
            source_url: null,
            category: query.includes("bitcoin") || query.includes("crypto") ? "crypto" : "markets",
            geo_relevance: ["US", "UK", "CA", "AU", "EU"],
            confirming_sources: 1,
            raw_data: { query, totalEngagement, tweetCount: data.meta?.result_count || 0 }
          });
        }
      } catch (e) {
        console.error(`Twitter search failed for ${query}:`, e);
      }
    }
  } catch (e) {
    console.error("Twitter detection failed:", e);
  }

  return trends;
}

// ─── Helpers ───
function parseRSSItems(xml: string): Array<{ title: string; link: string; pubDate: string }> {
  const items: Array<{ title: string; link: string; pubDate: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() || "";
    const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || "";
    if (title) items.push({ title, link, pubDate });
  }
  return items;
}

function extractKeyword(title: string): string {
  // Remove common noise words and extract core topic
  return title
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s'-]/g, " ")
    .trim()
    .substring(0, 120);
}

function isFinanceRelated(text: string): boolean {
  const lower = text.toLowerCase();
  const financeWords = [
    "bitcoin", "crypto", "ethereum", "stock", "market", "invest", "trading",
    "forex", "currency", "bank", "fed", "interest rate", "inflation", "gdp",
    "bond", "yield", "etf", "hedge fund", "commodity", "gold", "oil",
    "regulation", "sec", "fintech", "defi", "nft", "blockchain", "ipo",
    "earnings", "dividend", "recession", "bull", "bear", "portfolio",
    "mutual fund", "index", "dow", "nasdaq", "s&p", "treasury", "fiscal",
    "monetary", "central bank", "exchange", "option", "futures", "derivative",
    "asset", "equity", "debt", "credit", "loan", "mortgage", "insurance"
  ];
  return financeWords.some(w => lower.includes(w));
}

function isBlacklisted(text: string): boolean {
  const lower = text.toLowerCase();
  return BLACKLIST_KEYWORDS.some(w => lower.includes(w));
}

// ─── Merge & Qualify Trends ───
function qualifyAndMergeTrends(allTrends: DetectedTrend[], growthThreshold: number): DetectedTrend[] {
  // Group by similar keyword
  const grouped: Record<string, DetectedTrend[]> = {};
  for (const t of allTrends) {
    const key = t.keyword.toLowerCase().substring(0, 50);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  }

  const qualified: DetectedTrend[] = [];
  for (const [, group] of Object.entries(grouped)) {
    const best = group.reduce((a, b) => a.growth_percentage > b.growth_percentage ? a : b);
    best.confirming_sources = group.length;
    
    // Apply qualification filters
    if (best.growth_percentage < growthThreshold) continue;
    if (best.confirming_sources < 1) continue; // Relaxed for RSS-only mode
    if (isBlacklisted(best.keyword)) continue;
    if (!isFinanceRelated(best.keyword)) continue;

    qualified.push(best);
  }

  return qualified.sort((a, b) => b.growth_percentage - a.growth_percentage);
}

// ─── Main Handler ───
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if automation is enabled
    const { data: settings } = await supabase
      .from("automation_settings")
      .select("*")
      .eq("setting_key", "automation_enabled")
      .single();

    if (settings && settings.setting_value?.enabled === false) {
      return new Response(
        JSON.stringify({ message: "Automation is paused", trends: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get growth threshold from settings
    const { data: thresholdSetting } = await supabase
      .from("automation_settings")
      .select("setting_value")
      .eq("setting_key", "growth_threshold")
      .single();
    
    const growthThreshold = thresholdSetting?.setting_value?.value || 150;

    console.log("Starting trend detection...");

    // Run all detections in parallel
    const [rssTrends, googleTrends, redditTrends, twitterTrends] = await Promise.all([
      detectRSSFeeds(),
      detectGoogleTrends(),
      detectRedditTrends(),
      detectTwitterTrends()
    ]);

    console.log(`Found: RSS=${rssTrends.length}, Google=${googleTrends.length}, Reddit=${redditTrends.length}, Twitter=${twitterTrends.length}`);

    const allTrends = [...rssTrends, ...googleTrends, ...redditTrends, ...twitterTrends];
    const qualifiedTrends = qualifyAndMergeTrends(allTrends, growthThreshold);

    console.log(`Qualified trends: ${qualifiedTrends.length}`);

    // Check for duplicates against existing content
    const { data: existingArticles } = await supabase
      .from("articles")
      .select("title, slug")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const existingTitles = new Set((existingArticles || []).map((a: any) => a.title.toLowerCase()));

    // Store qualified trends
    const newTrends: any[] = [];
    for (const trend of qualifiedTrends.slice(0, 25)) {
      // Skip if similar article exists
      if (existingTitles.has(trend.keyword.toLowerCase())) continue;

      const { data: existing } = await supabase
        .from("detected_trends")
        .select("id")
        .eq("keyword", trend.keyword)
        .eq("status", "pending")
        .single();

      if (existing) {
        // Update confirming sources
        await supabase
          .from("detected_trends")
          .update({ 
            confirming_sources: trend.confirming_sources,
            growth_percentage: trend.growth_percentage,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);
      } else {
        const { data: inserted } = await supabase
          .from("detected_trends")
          .insert({
            keyword: trend.keyword,
            growth_percentage: trend.growth_percentage,
            source: trend.source,
            source_url: trend.source_url,
            category: trend.category,
            geo_relevance: trend.geo_relevance,
            confirming_sources: trend.confirming_sources,
            raw_data: trend.raw_data,
            status: "pending"
          })
          .select()
          .single();

        if (inserted) newTrends.push(inserted);
      }
    }

    // Log the detection run
    await supabase.from("content_pipeline").insert({
      stage: "trend_detection",
      status: "completed",
      input_data: { 
        rss_count: rssTrends.length, 
        google_count: googleTrends.length,
        reddit_count: redditTrends.length,
        twitter_count: twitterTrends.length
      },
      output_data: { 
        total_found: allTrends.length,
        qualified: qualifiedTrends.length,
        new_stored: newTrends.length
      }
    });

    return new Response(
      JSON.stringify({
        message: "Trend detection complete",
        stats: {
          rss: rssTrends.length,
          google: googleTrends.length,
          reddit: redditTrends.length,
          twitter: twitterTrends.length,
          qualified: qualifiedTrends.length,
          newTrends: newTrends.length
        },
        trends: newTrends
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Trend detection error:", error);
    
    await supabase.from("content_pipeline").insert({
      stage: "trend_detection",
      status: "failed",
      error_message: error.message
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
