import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { contentService, GlossaryTerm, Article } from '@/lib/content';
import { Search, BookOpen, TrendingUp } from 'lucide-react';

const TopicsLetter = () => {
  const { letter } = useParams<{ letter: string }>();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  const currentLetter = letter?.toUpperCase() || 'A';

  useEffect(() => {
    const loadTerms = async () => {
      setLoading(true);
      const termsData = await contentService.getGlossaryTermsByLetter(currentLetter);
      setTerms(termsData);
      setFilteredTerms(termsData);

      // Load some related articles for this category
      const articlesData = await contentService.getArticles({ limit: 6 });
      setRelatedArticles(articlesData);
      
      setLoading(false);
    };

    loadTerms();
  }, [currentLetter]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = terms.filter(term =>
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTerms(filtered);
    } else {
      setFilteredTerms(terms);
    }
  }, [searchQuery, terms]);

  const generateAlphabetLinks = () => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
      <Link
        key={l}
        to={`/topics/${l.toLowerCase()}`}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          l === currentLetter 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
      >
        {l}
      </Link>
    ));
  };

  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "name": `Financial Terms Starting with ${currentLetter}`,
      "description": `Comprehensive glossary of financial and cryptocurrency terms beginning with the letter ${currentLetter}`,
      "inDefinedTermSet": filteredTerms.map(term => ({
        "@type": "DefinedTerm",
        "name": term.term,
        "description": term.definition,
        "url": `${window.location.origin}/topics/${currentLetter.toLowerCase()}/${term.slug}`
      }))
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Financial Terms Starting with ${currentLetter} - ImperialPedia Glossary`}</title>
        <meta name="description" content={`Comprehensive glossary of financial and cryptocurrency terms beginning with ${currentLetter}. Learn definitions, explanations, and key concepts.`} />
        <meta name="keywords" content={`financial terms ${currentLetter}, finance glossary, crypto terms, investment definitions, ${currentLetter} finance`} />
        
        <meta property="og:title" content={`Financial Terms Starting with ${currentLetter} - ImperialPedia`} />
        <meta property="og:description" content={`Comprehensive glossary of financial terms beginning with ${currentLetter}`} />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Financial Terms: <span className="text-primary">{currentLetter}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore financial and cryptocurrency terms starting with the letter {currentLetter}
          </p>
        </div>

        {/* Alphabet Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 p-4 bg-muted rounded-lg">
            {generateAlphabetLinks()}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${currentLetter} terms...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Terms List */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">
                {filteredTerms.length} Terms Found
              </h2>
            </div>

            {filteredTerms.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Terms Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No terms match your search "${searchQuery}"`
                      : `No terms available starting with ${currentLetter}`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredTerms.map((term) => (
                  <Card key={term.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            <Link 
                              to={`/topics/${currentLetter.toLowerCase()}/${term.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {term.term}
                            </Link>
                          </CardTitle>
                          {term.category && (
                            <Badge variant="secondary" className="mb-2">
                              {term.category}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {term.view_count} views
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {term.definition}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/news" className="block text-primary hover:underline">
                  Latest News
                </Link>
                <Link to="/tools" className="block text-primary hover:underline">
                  Financial Calculators
                </Link>
                <Link to="/dashboard" className="block text-primary hover:underline">
                  Your Dashboard
                </Link>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Related Articles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.slice(0, 3).map((article) => (
                    <div key={article.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <Link 
                        to={`/news/${article.slug}`}
                        className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.view_count} views
                        </span>
                      </div>
                    </div>
                  ))}
                  <Link 
                    to="/news" 
                    className="inline-block text-sm text-primary hover:underline"
                  >
                    View all articles →
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Ad Placeholder */}
            <Card className="bg-muted/50">
              <CardContent className="text-center py-8">
                <div className="text-sm text-muted-foreground mb-2">Advertisement</div>
                <div className="h-32 bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Ad Space</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopicsLetter;