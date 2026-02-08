import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdSenseSlot } from '@/components/AdSenseSlots';
import { articleService } from '@/services/articleService';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Article, Category } from '@/types/database';
import { SEO, generateArticleSchema, generateBreadcrumbSchema } from '@/utils/seo';
import { Calendar, Clock, User, Tag, Lock, ChevronRight, BookOpen, Share2 } from 'lucide-react';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isPremium, isAdmin } = useRole();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticleBySlug(slug!);
      setArticle(data);
      
      if (data?.category_id) {
        const related = await articleService.getRelatedArticles(data.id, data.category_id);
        setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const canViewFullContent = () => {
    if (!article) return false;
    if (!article.is_premium) return true;
    if (isPremium || isAdmin) return true;
    return false;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/articles">Browse Articles</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Articles', url: '/articles' },
    ...(article.category ? [{ name: article.category.name, url: `/category/${article.category.slug}` }] : []),
    { name: article.title, url: `/article/${article.slug}` },
  ];

  const structuredData = [
    generateArticleSchema({
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt || '',
      author: article.author?.name || 'Imperialpedia',
      datePublished: article.published_at || article.created_at,
      dateModified: article.updated_at,
      image: article.featured_image,
      url: `https://imperialpedia.com/article/${article.slug}`,
    }),
    generateBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${article.seo_title || article.title} | Imperialpedia`}
        description={article.seo_description || article.excerpt || ''}
        keywords={article.tags.join(', ')}
        structuredData={structuredData}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {article.category && (
                  <Badge variant="secondary">
                    {article.category.name}
                  </Badge>
                )}
                {article.is_premium && (
                  <Badge variant="default" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{article.author.name}</span>
                      {article.author.title && (
                        <span className="block text-xs">{article.author.title}</span>
                      )}
                    </div>
                  </div>
                )}
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Published: {formatDate(article.published_at || article.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {formatDate(article.updated_at)}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.featured_image && (
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-auto rounded-lg mb-8"
              />
            )}

            {/* Ad slot for free content */}
            {!article.is_premium && (
              <AdSenseSlot slot="article-top" className="mb-8" />
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {/* Preview Content - always shown */}
              <div dangerouslySetInnerHTML={{ __html: article.preview_content || '' }} />
              
              {/* Full Content - conditional */}
              {canViewFullContent() ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: article.full_content || '' }} />
                </>
              ) : (
                <Card className="my-8 border-primary/20 bg-primary/5">
                  <CardContent className="py-8 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">
                      This article is for premium members. Upgrade to access the full content.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild variant="outline">
                        <Link to="/login">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/pricing">View Plans</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mid-article ad */}
            {!article.is_premium && (
              <AdSenseSlot slot="article-middle" className="my-8" />
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-8">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p>
                <strong>Disclaimer:</strong> This article is for educational purposes only and does not
                constitute financial, legal, or investment advice. Always consult with a qualified
                professional before making financial decisions.
              </p>
            </div>

            {/* Bottom ad */}
            {!article.is_premium && (
              <AdSenseSlot slot="article-bottom" className="mt-8" />
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Share */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Ad */}
            <AdSenseSlot slot="sidebar" />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map(related => (
                      <Link
                        key={related.id}
                        to={`/article/${related.slug}`}
                        className="block group"
                      >
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {related.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Author Bio */}
            {article.author && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">About the Author</h3>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{article.author.name}</p>
                      <p className="text-sm text-muted-foreground">{article.author.title}</p>
                      {article.author.bio && (
                        <p className="text-sm mt-2">{article.author.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
