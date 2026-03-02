import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://imperialpedia.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch published articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, is_featured')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Fetch active categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)

    // Fetch published glossary terms
    const { data: glossary } = await supabase
      .from('glossary_terms')
      .select('slug, updated_at')
      .eq('status', 'published')

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/articles</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/glossary</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`

    // Articles
    for (const a of (articles || [])) {
      xml += `
  <url>
    <loc>${SITE_URL}/article/${a.slug}</loc>
    <lastmod>${new Date(a.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${a.is_featured ? '0.9' : '0.7'}</priority>
  </url>`
    }

    // Categories
    for (const c of (categories || [])) {
      xml += `
  <url>
    <loc>${SITE_URL}/category/${c.slug}</loc>
    <lastmod>${new Date(c.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    }

    // Glossary
    for (const g of (glossary || [])) {
      xml += `
  <url>
    <loc>${SITE_URL}/glossary/term/${g.slug}</loc>
    <lastmod>${new Date(g.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    }

    xml += `\n</urlset>`

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
