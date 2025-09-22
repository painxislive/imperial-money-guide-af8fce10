import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contentService, Article, GlossaryTerm } from '@/lib/content';
import { TrendingUp, BookOpen, Calendar, Eye } from 'lucide-react';
import { AdSenseSlot, AffiliateSlot } from '@/components/AdSenseSlots';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = {
    crypto: {
      title: 'Cryptocurrency',
      description: 'Latest cryptocurrency news, analysis, and market insights',
      icon: '₿',
      color: 'text-orange-500'
    },
    stocks: {
      title: 'Stock Market',
      description: 'Stock market analysis, company earnings, and investment strategies',
      icon: '📈',
      color: 'text-green-500'
    },
    forex: {
      title: 'Foreign Exchange',
      description: 'Currency trading, forex analysis, and international market updates',
      icon: '💱',
      color: 'text-blue-500'
    }
  };

  const currentCategory = category && categoryInfo[category as keyof typeof categoryInfo];

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!category || !currentCategory) return;

      setLoading(true);
      
      // Load articles for this category
      const [categoryArticles, featured, allGlossary] = await Promise.all([
        contentService.getArticles({ category, limit: 12 }),
        contentService.getArticles({ category, featured: true, limit: 3 }),
        contentService.getAllGlossaryLetters()
      ]);
      
      setArticles(categoryArticles);
      setFeaturedArticles(featured);
      
      // Get some glossary terms related to this category (first 6 from letter A)
      if (allGlossary.length > 0) {
        const glossary = await contentService.getGlossaryTermsByLetter('A');
        setGlossaryTerms(glossary.slice(0, 6));
      }
      
      setLoading(false);
    };

    loadCategoryData();
  }, [category, currentCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateStructuredData = () => {
    if (!currentCategory) return null;

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${currentCategory.title} News & Analysis`,
      "description": currentCategory.description,
      "url": window.location.href,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": articles.map((article, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "NewsArticle",
            "headline": article.title,
            "url": `/news/${article.slug}`,
            "datePublished": article.published_at
          }
        }))
      }
    };
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-4">The category you're looking for doesn't exist.</p>
          <Link to="/news">
            <Button>Browse All News</Button>
          </Link>
        </div>
      </div>
    );
  }

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
        <title>{currentCategory.title} News & Analysis - ImperialPedia</title>
        <meta name="description" content={currentCategory.description} />
        <meta name="keywords" content={`${category}, finance, news, analysis, market`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={`${currentCategory.title} News & Analysis`} />
        <meta property="og:description" content={currentCategory.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`text-6xl mb-4 ${currentCategory.color}`}>
            {currentCategory.icon}
          </div>
          <h1 className="text-4xl font-bold mb-4">{currentCategory.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentCategory.description}
          </p>
        </div>

        {/* AdSense Header Banner */}
        <AdSenseSlot slot="header" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Featured Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {article.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">
                          Featured
                        </Badge>
                        <CardTitle className="line-clamp-2">
                          <Link 
                            to={`/news/${article.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {article.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {article.view_count}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Affiliate Spot */}
            <AffiliateSlot 
              type={category === 'crypto' ? 'crypto-exchange' : 'broker'} 
              position="inline" 
              className="mb-8" 
            />

            {/* Latest Articles */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {article.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">
                          <Link 
                            to={`/news/${article.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {article.title}
                          </Link>
                        </CardTitle>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(article.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {article.view_count}
                            </span>
                          </div>
                          {article.tags && article.tags.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {article.tags[0]}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found in this category.</p>
                  <Link to="/news" className="text-primary hover:underline">
                    Browse all news
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* AdSense Sidebar */}
            <AdSenseSlot slot="sidebar" className="mb-6" />

            {/* Glossary Terms */}
            {glossaryTerms.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Key Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {glossaryTerms.map((term) => (
                      <div key={term.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                        <Link 
                          to={`/topics/${term.slug}`}
                          className="font-medium text-sm hover:text-primary transition-colors"
                        >
                          {term.term}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {term.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link 
                      to="/topics/a" 
                      className="text-sm text-primary hover:underline"
                    >
                      Browse all terms →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(categoryInfo).map(([key, info]) => (
                    <Link
                      key={key}
                      to={`/category/${key}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        category === key 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span className="text-lg">{info.icon}</span>
                      <span className="font-medium">{info.title}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;