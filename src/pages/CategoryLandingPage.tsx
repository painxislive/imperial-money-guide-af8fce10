import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AdSenseSlot } from '@/components/AdSenseSlots';
import { articleService } from '@/services/articleService';
import { Article, Category } from '@/types/database';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { Search, ChevronRight, FileText, TrendingUp, Clock, Crown } from 'lucide-react';

const CategoryLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (slug) {
      loadCategoryData();
    }
  }, [slug]);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const [categoryData, articlesData] = await Promise.all([
        articleService.getCategoryBySlug(slug!),
        articleService.getPublishedArticles({ categorySlug: slug }),
      ]);
      setCategory(categoryData);
      setArticles(articlesData);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredArticles = filteredArticles.filter(a => a.is_featured).slice(0, 3);
  const recentArticles = filteredArticles.filter(a => !a.is_featured);
  const popularArticles = [...filteredArticles]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/${category.slug}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={category.seo_title || `${category.name} | Imperialpedia`}
        description={category.seo_description || category.description || `Explore ${category.name} articles and guides on Imperialpedia.`}
        keywords={`${category.name.toLowerCase()}, financial education, investing, ${category.slug}`}
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.url} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight className="h-3 w-3" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-foreground">{crumb.name}</span>
                  ) : (
                    <Link to={crumb.url} className="hover:text-primary transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              {category.description || `Explore educational articles and guides about ${category.name.toLowerCase()}.`}
            </p>

            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={`Search ${category.name.toLowerCase()} articles...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Featured Articles
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticles.map((article, idx) => (
                      <Card key={article.id} className={idx === 0 ? 'md:col-span-2' : ''}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {article.is_premium && (
                              <Badge variant="secondary" className="gap-1">
                                <Crown className="h-3 w-3" />
                                Premium
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {formatDate(article.published_at || article.created_at)}
                            </span>
                          </div>
                          <Link to={`/article/${article.slug}`}>
                            <h3 className="text-xl font-bold hover:text-primary transition-colors mb-2">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            {article.author && <span>By {article.author.name}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Ad Slot */}
              <AdSenseSlot slot="article-top" />

              {/* All Articles */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Latest Articles
                </h2>
                <div className="space-y-4">
                  {recentArticles.map(article => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {article.is_premium && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                  <Crown className="h-3 w-3" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <Link to={`/article/${article.slug}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {article.author && <span>{article.author.name}</span>}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(article.published_at || article.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredArticles.length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No articles found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Popular Articles */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Most Popular
                  </h3>
                  <div className="space-y-4">
                    {popularArticles.map((article, idx) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.slug}`}
                        className="flex items-start gap-3 group"
                      >
                        <span className="text-2xl font-bold text-muted-foreground/50">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {article.view_count || 0} views
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ad Slot */}
              <AdSenseSlot slot="sidebar" />

              {/* Related Categories */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Explore Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/finance">Finance</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/legal">Legal</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/insurance">Insurance</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/glossary">Glossary</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryLandingPage;
