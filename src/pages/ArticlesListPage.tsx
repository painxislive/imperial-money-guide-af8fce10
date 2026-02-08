import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdSenseSlot } from '@/components/AdSenseSlots';
import { articleService } from '@/services/articleService';
import { Article, Category } from '@/types/database';
import { SEO } from '@/utils/seo';
import { Search, FileText, TrendingUp, Clock, Crown, Filter } from 'lucide-react';

const ArticlesListPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, categoriesData] = await Promise.all([
        articleService.getPublishedArticles(),
        articleService.getCategories(),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(a => a.is_featured).slice(0, 4);
  const regularArticles = filteredArticles.filter(a => !a.is_featured);

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

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Finance Articles & Guides | Imperialpedia"
        description="Explore comprehensive articles on finance, investing, banking, taxation, insurance, and economic concepts. Educational content for all skill levels."
        keywords="finance articles, investing guides, financial education, banking, taxation, insurance"
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Finance Articles</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              Educational articles covering finance, investing, banking, taxation, and more.
            </p>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-md border bg-background"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Featured */}
              {featuredArticles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Featured Articles
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticles.map(article => (
                      <Card key={article.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {article.is_premium && (
                              <Badge variant="secondary" className="gap-1">
                                <Crown className="h-3 w-3" />
                                Premium
                              </Badge>
                            )}
                            {article.category && (
                              <Badge variant="outline">{article.category.name}</Badge>
                            )}
                          </div>
                          <Link to={`/article/${article.slug}`}>
                            <h3 className="text-xl font-bold hover:text-primary transition-colors mb-2">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            {article.author && <span>By {article.author.name}</span>}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(article.published_at || article.created_at)}
                            </span>
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
                  All Articles ({filteredArticles.length})
                </h2>
                <div className="space-y-4">
                  {regularArticles.map(article => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {article.is_premium && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                  <Crown className="h-3 w-3" />
                                  Premium
                                </Badge>
                              )}
                              {article.category && (
                                <Badge variant="outline" className="text-xs">
                                  {article.category.name}
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
              {/* Categories */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Articles
                    </Button>
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ad Slot */}
              <AdSenseSlot slot="sidebar" />

              {/* Quick Links */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link to="/glossary">A–Z Glossary</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link to="/tools">Calculators</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link to="/about">About Us</Link>
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

export default ArticlesListPage;
