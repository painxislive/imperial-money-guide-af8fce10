import { useState, useEffect } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { SEO } from "@/utils/seo";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileText, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/lib/supabase-helpers";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
  is_published: boolean;
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const performSearch = async (term: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await db("articles")
        .select("id, title, slug, excerpt, category, published_at, is_published")
        .eq("is_published", true)
        .ilike("title", `%${term}%`)
        .order("published_at", { ascending: false })
        .limit(30);
      setResults((data as SearchResult[]) || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Search | Imperialpedia" description="Search articles, guides, and news across Imperialpedia." />
      <DynamicHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl font-bold mb-4 text-center">Search Imperialpedia</h1>
          <p className="text-muted-foreground text-center mb-8">Find articles, guides, news, and financial terms</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for articles, topics, terms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
              autoFocus
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-xl text-muted-foreground">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords or browse our categories</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-sm text-muted-foreground mb-4">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
            {results.map((r) => (
              <Card key={r.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <Link to={`/article/${r.slug}`} className="group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{r.title}</h3>
                        {r.excerpt && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.excerpt}</p>}
                        <div className="flex items-center gap-3 mt-3">
                          {r.category && <Badge variant="secondary">{r.category}</Badge>}
                          {r.published_at && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(r.published_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary mt-1 shrink-0" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
