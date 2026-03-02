import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdSenseSlot } from '@/components/AdSenseSlots';
import { contentService } from '@/services/contentService';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import type { Article } from '@/types/enterprise';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { Calendar, Clock, User, Tag, Lock, ChevronRight, BookOpen, Share2 } from 'lucide-react';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isPremium, isAdmin } = useRole();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const data = await contentService.getPublishedArticle(slug!);
      setArticle(data);
      if (data) {
        const related = await contentService.getRelatedArticles(data.id);
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or hasn't been published yet.</p>
          <Button asChild><Link to="/articles">Browse Articles</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Structured data — all pulled from DB, nothing hardcoded
  const breadcrumbs = [
    { name: 'Home', url: 'https://imperialpedia.com/' },
    { name: 'Articles', url: 'https://imperialpedia.com/articles' },
    ...(article.category ? [{ name: article.category.name, url: `https://imperialpedia.com/category/${article.category.slug}` }] : []),
    { name: article.title, url: `https://imperialpedia.com/article/${article.slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": article.schema_type || "Article",
    "headline": article.meta_title || article.seo_title || article.title,
    "description": article.meta_description || article.seo_description || article.excerpt || '',
    "author": article.author ? {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.title || undefined,
      "url": `https://imperialpedia.com/author/${article.author.slug}`,
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "ImperialPedia",
      "logo": { "@type": "ImageObject", "url": "https://imperialpedia.com/logo.png" },
    },
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at,
    "image": article.featured_image || undefined,
    "url": `https://imperialpedia.com/article/${article.slug}`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://imperialpedia.com/article/${article.slug}` },
    "wordCount": article.word_count || undefined,
    "articleSection": article.category?.name || undefined,
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ImperialPedia",
    "url": "https://imperialpedia.com",
    "logo": "https://imperialpedia.com/logo.png",
    "sameAs": [],
  };

  const structuredData = [articleSchema, generateBreadcrumbSchema(breadcrumbs), orgSchema];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${article.meta_title || article.seo_title || article.title} | ImperialPedia`}
        description={article.meta_description || article.seo_description || article.excerpt || ''}
        image={article.featured_image || undefined}
        url={`https://imperialpedia.com/article/${article.slug}`}
        type="article"
        structuredData={structuredData}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.url} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="h-3 w-3" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{crumb.name}</span>
              ) : (
                <Link to={new URL(crumb.url).pathname} className="hover:text-primary transition-colors">
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {article.category && (
                  <Badge variant="secondary">{article.category.name}</Badge>
                )}
                {article.is_premium && (
                  <Badge variant="default" className="gap-1"><Lock className="h-3 w-3" />Premium</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {article.author && (
                  <Link to={`/author/${article.author.slug}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{article.author.name}</span>
                      {article.author.title && <span className="block text-xs">{article.author.title}</span>}
                    </div>
                  </Link>
                )}
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at || article.created_at)}</span>
                </div>
                {article.reading_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.reading_time} min read</span>
                  </div>
                )}
              </div>
            </header>

            {article.featured_image && (
              <img src={article.featured_image} alt={article.title} className="w-full h-auto rounded-lg mb-8" loading="lazy" />
            )}

            {!article.is_premium && <AdSenseSlot slot="article-top" className="mb-8" />}

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.preview_content || '' }} />
              {canViewFullContent() ? (
                <div dangerouslySetInnerHTML={{ __html: article.full_content || '' }} />
              ) : (
                <Card className="my-8 border-primary/20 bg-primary/5">
                  <CardContent className="py-8 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">Upgrade to access the full article.</p>
                    <div className="flex justify-center gap-4">
                      <Button asChild variant="outline"><Link to="/login">Sign In</Link></Button>
                      <Button asChild><Link to="/pricing">View Plans</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {!article.is_premium && <AdSenseSlot slot="article-middle" className="my-8" />}

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedArticles.map(related => (
                    <Link key={related.id} to={`/article/${related.slug}`} className="group">
                      <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardContent className="pt-4">
                          {related.featured_image && (
                            <img src={related.featured_image} alt={related.title} className="w-full h-32 object-cover rounded mb-3" loading="lazy" />
                          )}
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{related.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{related.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p><strong>Disclaimer:</strong> This article is for educational purposes only and does not constitute financial, legal, or investment advice.</p>
            </div>

            {!article.is_premium && <AdSenseSlot slot="article-bottom" className="mt-8" />}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Share2 className="h-4 w-4" />Share Article</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`https://twitter.com/intent/tweet?url=https://imperialpedia.com/article/${article.slug}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer">Twitter</a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://imperialpedia.com/article/${article.slug}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <AdSenseSlot slot="sidebar" />

            {article.author && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">About the Author</h3>
                  <Link to={`/author/${article.author.slug}`} className="flex items-start gap-3 group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {article.author.avatar_url ? (
                        <img src={article.author.avatar_url} alt={article.author.name} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{article.author.name}</p>
                      <p className="text-sm text-muted-foreground">{article.author.title}</p>
                      {article.author.bio && <p className="text-sm mt-2">{article.author.bio}</p>}
                    </div>
                  </Link>
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
