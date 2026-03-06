import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { SEO } from "@/utils/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Clock, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/lib/supabase-helpers";

interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  view_count: number;
  published_at: string | null;
}

const TrendingPage = () => {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db("articles")
      .select("id, title, slug, excerpt, category, view_count, published_at")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(30)
      .then(({ data }) => setArticles((data as TrendingArticle[]) || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Trending Articles | Imperialpedia" description="Most popular and trending articles on Imperialpedia right now." />
      <DynamicHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-destructive/10 p-3 rounded-xl">
            <Flame className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Trending Now</h1>
            <p className="text-muted-foreground">Most viewed articles across all categories</p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-6"><div className="animate-pulse space-y-3"><div className="h-5 bg-muted rounded w-3/4" /><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-1/2" /></div></CardContent></Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-xl text-muted-foreground">No trending articles yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <Link key={article.id} to={`/article/${article.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-black text-primary/20">#{idx + 1}</span>
                      {article.category && <Badge variant="secondary">{article.category}</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.view_count || 0} views</span>
                      {article.published_at && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(article.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TrendingPage;
