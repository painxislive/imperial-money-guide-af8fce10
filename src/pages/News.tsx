import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contentService, Article } from '@/lib/content';
import { Search, Clock, TrendingUp, Calendar } from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadArticles = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 0 : page;
    
    const params = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit: 12,
      offset: currentPage * 12
    };

    const newArticles = await contentService.getArticles(params);
    
    if (reset) {
      setArticles(newArticles);
      setPage(0);
    } else {
      setArticles(prev => [...prev, ...newArticles]);
    }
    
    setHasMore(newArticles.length === 12);
    setPage(currentPage + 1);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      const results = await contentService.searchArticles(searchQuery);
      setArticles(results);
      setHasMore(false);
      setLoading(false);
    } else {
      loadArticles(true);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [articlesData, featuredData, categoriesData] = await Promise.all([
        contentService.getArticles({ limit: 12 }),
        contentService.getArticles({ featured: true, limit: 3 }),
        contentService.getArticleCategories()
      ]);
      
      setArticles(articlesData);
      setFeaturedArticles(featuredData);
      setCategories(categoriesData as string[]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadArticles(true);
    }
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Latest Finance & Crypto News - ImperialPedia</title>
        <meta name="description" content="Stay updated with the latest finance and cryptocurrency news. Breaking market news, analysis, and insights from top financial sources." />
        <meta name="keywords" content="finance news, crypto news, market analysis, financial updates, cryptocurrency updates" />
        <meta property="og:title" content="Latest Finance & Crypto News - ImperialPedia" />
        <meta property="og:description" content="Stay updated with the latest finance and cryptocurrency news from top sources." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "ImperialPedia News",
            "url": "https://imperialpedia.com/news",
            "description": "Latest finance and cryptocurrency news and analysis"
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Finance & Crypto News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest market updates, analysis, and breaking news from the world of finance and cryptocurrency.
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link 
                        to={`/news/${article.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </CardTitle>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(article.published_at)}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link 
                    to={`/news/${article.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                {article.excerpt && (
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {article.source_name && (
                    <span>Source: {article.source_name}</span>
                  )}
                  <span>{article.view_count} views</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center">
            <Button onClick={() => loadArticles()} variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default News;