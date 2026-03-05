import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { SEO } from "@/utils/seo";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe } from "lucide-react";
import { newsService, NewsCountry } from "@/services/newsService";
import { Article } from "@/lib/content";

const NewsCountryPage = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const [country, setCountry] = useState<NewsCountry | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!countrySlug) return;
    setLoading(true);

    newsService.getCountryBySlug(countrySlug).then(async (c) => {
      setCountry(c);
      if (c) {
        const arts = await newsService.getArticlesByCountry(c.id, 24);
        setArticles(arts as Article[]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [countrySlug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DynamicHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  const name = country?.name || countrySlug || "Country";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${name} News - Imperialpedia`}
        description={`Latest financial news and updates from ${name}`}
      />
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {country?.flag_emoji} {name} News
          </h1>
          <p className="text-muted-foreground text-lg">Latest financial news and updates from {name}</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No articles yet for {name}</h2>
            <p className="text-muted-foreground">Country-specific news will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {article.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.published_at)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">
                    <Link to={`/news/${article.slug}`} className="hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </CardTitle>
                  {article.excerpt && <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsCountryPage;
