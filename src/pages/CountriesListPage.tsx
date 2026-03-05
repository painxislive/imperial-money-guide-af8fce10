import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { SEO } from "@/utils/seo";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { newsService, NewsCountry } from "@/services/newsService";

const CountriesListPage = () => {
  const [countries, setCountries] = useState<NewsCountry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.getCountries().then((c) => {
      setCountries(c);
      setLoading(false);
    });
  }, []);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region?.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, NewsCountry[]>>((acc, c) => {
    const region = c.region || "Other";
    if (!acc[region]) acc[region] = [];
    acc[region].push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Countries - Global News Coverage - Imperialpedia" description="Browse financial news by country. Coverage spanning 25+ countries worldwide." />
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Global News Coverage</h1>
        <p className="text-muted-foreground text-lg mb-6">Browse financial news by country</p>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : (
          Object.entries(grouped).sort().map(([region, regionCountries]) => (
            <div key={region} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{region}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {regionCountries.map((c) => (
                  <Link key={c.slug} to={`/news/country/${c.slug}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-lg">{c.flag_emoji}</span>
                          {c.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CountriesListPage;
