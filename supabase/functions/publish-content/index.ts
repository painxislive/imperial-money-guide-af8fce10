import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://tjutdnnqlkujzltpvpwd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface PublishRequest {
  action: "publish" | "reject" | "schedule" | "run_pipeline" | "bulk_publish" | "bulk_reject";
  article_id?: string;
  article_ids?: string[];
  scheduled_at?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: PublishRequest = await req.json();

    switch (body.action) {
      case "publish": {
        if (!body.article_id) throw new Error("article_id required");

        const { data: article, error } = await supabase
          .from("articles")
          .update({
            status: "published",
            published_at: new Date().toISOString()
          })
          .eq("id", body.article_id)
          .select()
          .single();

        if (error) throw error;

        await supabase.from("content_pipeline").insert({
          stage: "publishing",
          status: "completed",
          article_id: body.article_id,
          output_data: { action: "published", title: article.title }
        });

        return new Response(
          JSON.stringify({ message: "Article published", article }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "reject": {
        if (!body.article_id) throw new Error("article_id required");

        const { data: article, error } = await supabase
          .from("articles")
          .update({ status: "archived" })
          .eq("id", body.article_id)
          .select()
          .single();

        if (error) throw error;

        // Also update the related trend
        await supabase
          .from("detected_trends")
          .update({ status: "rejected" })
          .eq("article_id", body.article_id);

        await supabase.from("content_pipeline").insert({
          stage: "publishing",
          status: "completed",
          article_id: body.article_id,
          output_data: { action: "rejected", title: article.title }
        });

        return new Response(
          JSON.stringify({ message: "Article rejected", article }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "bulk_publish": {
        if (!body.article_ids?.length) throw new Error("article_ids required");

        const { data, error } = await supabase
          .from("articles")
          .update({
            status: "published",
            published_at: new Date().toISOString()
          })
          .in("id", body.article_ids)
          .select();

        if (error) throw error;

        return new Response(
          JSON.stringify({ message: `${data.length} articles published`, articles: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "bulk_reject": {
        if (!body.article_ids?.length) throw new Error("article_ids required");

        const { data, error } = await supabase
          .from("articles")
          .update({ status: "archived" })
          .in("id", body.article_ids)
          .select();

        if (error) throw error;

        return new Response(
          JSON.stringify({ message: `${data.length} articles rejected`, articles: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "run_pipeline": {
        // Trigger full pipeline: detect → generate → publish
        const detectUrl = `${SUPABASE_URL}/functions/v1/detect-trends`;
        const generateUrl = `${SUPABASE_URL}/functions/v1/generate-content`;

        // Step 1: Detect trends
        const detectResp = await fetch(detectUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json"
          }
        });
        const detectResult = await detectResp.json();

        // Step 2: Generate content for top trends
        const generatedArticles: any[] = [];
        const pendingTrends = detectResult.trends || [];

        for (const trend of pendingTrends.slice(0, 5)) {
          try {
            const genResp = await fetch(generateUrl, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ trend_id: trend.id })
            });
            const genResult = await genResp.json();
            if (genResult.article) {
              generatedArticles.push(genResult.article);
            }
            
            // Randomized delay between generations (2-8 seconds)
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 6000));
          } catch (e) {
            console.error(`Generation failed for trend ${trend.id}:`, e);
          }
        }

        return new Response(
          JSON.stringify({
            message: "Pipeline completed",
            detection: detectResult.stats,
            generated: generatedArticles.length,
            articles: generatedArticles
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Publish content error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
