import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/rss+xml; charset=utf-8',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, excerpt, published_at, seo_description')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  const baseUrl = 'https://imperialpedia.com';
  const now = new Date().toUTCString();

  const items = (articles || []).map((a: any) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/article/${a.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${a.slug}</guid>
      <description><![CDATA[${a.excerpt || a.seo_description || ''}]]></description>
      <pubDate>${new Date(a.published_at || '').toUTCString()}</pubDate>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ImperialPedia - Finance Encyclopedia</title>
    <link>${baseUrl}</link>
    <description>Clear, unbiased explanations of finance, investing, banking, and economic concepts.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, { headers: corsHeaders });
});
