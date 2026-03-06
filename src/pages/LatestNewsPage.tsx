import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { SEO } from "@/utils/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/lib/supabase-helpers";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
}

const LatestNewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db("articles")
      .select("id, title, slug, excerpt, category, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setArticles((data as NewsArticle[]) || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Latest News | Imperialpedia" description="Breaking news and latest updates across finance, technology, markets, and global affairs." />
      <DynamicHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Newspaper className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Latest News</h1>
            <p className="text-muted-foreground">Breaking news and recent updates</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}><CardContent className="p-5"><div className="animate-pulse space-y-2"><div className="h-5 bg-muted rounded w-2/3" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-xl text-muted-foreground">No news articles yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`}>
                <Card className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{article.title}</h3>
                      {article.excerpt && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>}
                      <div className="flex items-center gap-3 mt-3">
                        {article.category && <Badge variant="secondary">{article.category}</Badge>}
                        {article.published_at && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(article.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
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

export default LatestNewsPage;
