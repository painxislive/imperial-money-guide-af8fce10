import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { glossaryService, GlossaryTerm } from '@/services/glossaryService';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Glossary() {
  const [letterCounts, setLetterCounts] = useState<Record<string, number>>({});
  const [featuredTerms, setFeaturedTerms] = useState<GlossaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const [counts, terms] = await Promise.all([
      glossaryService.getLetterCounts(),
      glossaryService.getPublishedTerms()
    ]);
    
    setLetterCounts(counts);
    // Get 6 featured terms from different letters
    const featured = terms.slice(0, 6);
    setFeaturedTerms(featured);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    setSearching(true);
    const results = await glossaryService.searchTerms(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Imperialpedia Finance Glossary",
    "description": "Comprehensive A-Z glossary of finance, investing, banking, taxation, and insurance terms.",
    "url": "https://imperialpedia.com/glossary",
    "hasPart": featuredTerms.map(term => ({
      "@type": "DefinedTerm",
      "name": term.term,
      "description": term.short_definition || term.definition
    }))
  };

  return (
    <>
      <Helmet>
        <title>Finance Glossary A-Z | Imperialpedia</title>
        <meta name="description" content="Comprehensive A-Z glossary of finance, investing, banking, taxation, and insurance terms. Clear definitions and explanations for financial concepts." />
        <meta name="keywords" content="finance glossary, financial terms, investing terms, banking glossary, finance dictionary" />
        <link rel="canonical" href="https://imperialpedia.com/glossary" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Finance Glossary A–Z</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Clear, unbiased definitions of finance, investing, banking, taxation, and insurance terms.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search financial terms..."
                  className="pl-12 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="mt-4 text-left max-w-xl mx-auto">
                  {searching ? (
                    <div className="bg-card rounded-lg border p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="bg-card rounded-lg border divide-y">
                      {searchResults.map(term => (
                        <Link
                          key={term.id}
                          to={`/glossary/term/${term.slug}`}
                          className="block p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="font-medium">{term.term}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {term.short_definition || term.definition}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card rounded-lg border p-4 text-center text-muted-foreground">
                      No terms found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* A-Z Navigation */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {ALPHABET.map(letter => {
                const count = letterCounts[letter] || 0;
                const hasTerms = count > 0;
                
                return hasTerms ? (
                  <Link
                    key={letter}
                    to={`/glossary/letter/${letter.toLowerCase()}`}
                    className="w-10 h-10 flex items-center justify-center rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {letter}
                  </Link>
                ) : (
                  <span
                    key={letter}
                    className="w-10 h-10 flex items-center justify-center rounded-lg font-semibold bg-muted text-muted-foreground cursor-not-allowed"
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Terms */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Terms</h2>
            
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTerms.map(term => (
                  <Link key={term.id} to={`/glossary/term/${term.slug}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{term.term}</CardTitle>
                          <Badge variant="outline">{term.letter}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {term.short_definition || term.definition}
                        </p>
                        <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
                          Read more <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Banking', icon: '🏦' },
                { name: 'Investing', icon: '📈' },
                { name: 'Insurance', icon: '🛡️' },
                { name: 'Taxation', icon: '📋' },
                { name: 'Economics', icon: '🌐' },
                { name: 'Personal Finance', icon: '💰' },
                { name: 'Corporate Finance', icon: '🏢' },
                { name: 'Trading', icon: '📊' }
              ].map(category => (
                <Link
                  key={category.name}
                  to={`/glossary?category=${encodeURIComponent(category.name)}`}
                  className="flex items-center gap-3 p-4 bg-card rounded-lg border hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Educational Disclaimer */}
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Educational Content</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This glossary is for educational and informational purposes only. 
                Imperialpedia does not provide financial, legal, or investment advice.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
