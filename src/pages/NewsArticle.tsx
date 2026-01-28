import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contentService, Article, GlossaryTerm } from '@/lib/content';
import { ArrowLeft, Calendar, Eye, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdSenseSlot, AffiliateSlot } from '@/components/AdSenseSlots';
import { Comments } from '@/components/Comments';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { useGlossaryLinker } from '@/utils/glossaryLinker';

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;

      setLoading(true);
      const articleData = await contentService.getArticleBySlug(slug);
      
      if (articleData) {
        setArticle(articleData);
        
        // Load related articles and glossary terms
        const [related, allLetters] = await Promise.all([
          contentService.getArticles({
            category: articleData.category,
            limit: 3
          }),
          contentService.getAllGlossaryLetters()
        ]);
        
        // Filter out current article
        setRelatedArticles(related.filter(a => a.id !== articleData.id));
        
        // Load some glossary terms for auto-linking
        if (allLetters.length > 0) {
          const terms = await Promise.all(
            (allLetters as string[]).slice(0, 5).map((letter: string) => contentService.getGlossaryTermsByLetter(letter))
          );
          setGlossaryTerms(terms.flat());
        }
      }
      
      setLoading(false);
    };

    loadArticle();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateStructuredData = () => {
    if (!article) return null;

    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt || article.title,
      "image": article.featured_image,
      "author": {
        "@type": "Person",
        "name": article.author || "ImperialPedia Editorial Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ImperialPedia",
        "logo": {
          "@type": "ImageObject",
          "url": "https://imperialpedia.com/logo.png"
        }
      },
      "datePublished": article.published_at,
      "dateModified": article.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "articleSection": article.category,
      "keywords": article.tags?.join(", ")
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/news">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.seo_title || article.title} - ImperialPedia</title>
        <meta name="description" content={article.seo_description || article.excerpt || article.title} />
        <meta name="keywords" content={article.tags?.join(", ")} />
        <meta name="author" content={article.author || "ImperialPedia Editorial Team"} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {article.featured_image && <meta property="og:image" content={article.featured_image} />}
        <meta property="article:published_time" content={article.published_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        <meta property="article:section" content={article.category} />
        {article.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || article.title} />
        {article.featured_image && <meta name="twitter:image" content={article.featured_image} />}
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/news" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              {article.category}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.view_count} views
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              {article.author && (
                <span className="text-sm">
                  By <strong>{article.author}</strong>
                </span>
              )}
              {article.source_name && (
                <span className="text-sm text-muted-foreground">
                  Source: {article.source_name}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {article.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img 
                src={article.featured_image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* AdSense Article Top */}
        <AdSenseSlot slot="article-top" className="mb-8" />

        {/* Article Content */}
        <ArticleContent article={article} glossaryTerms={glossaryTerms} />

        {/* AdSense Article Middle */}
        <AdSenseSlot slot="article-middle" className="my-8" />

        {/* Affiliate Content */}
        <AffiliateSlot 
          type={article.category === 'crypto' ? 'crypto-exchange' : 'broker'} 
          position="inline" 
          className="my-8" 
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Source Link */}
        {article.source_url && (
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Original Source</h3>
            <a 
              href={article.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View original article
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        {/* Newsletter Signup */}
        <NewsletterSignup variant="inline" />

        {/* AdSense Article Bottom */}
        <AdSenseSlot slot="article-bottom" className="my-8" />

        {/* Comments Section */}
        <Comments articleId={article.id} />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedArticle.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={relatedArticle.featured_image} 
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {relatedArticle.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">
                      <Link 
                        to={`/news/${relatedArticle.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedArticle.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(relatedArticle.published_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
};

// Component for article content with glossary linking
const ArticleContent: React.FC<{ article: Article; glossaryTerms: GlossaryTerm[] }> = ({ 
  article, 
  glossaryTerms 
}) => {
  const { processContent } = useGlossaryLinker(glossaryTerms, {
    maxLinksPerTerm: 2,
    caseSensitive: false
  });

  const enhancedContent = processContent(article.content);

  return (
    <div className="prose prose-lg max-w-none mb-12">
      <div dangerouslySetInnerHTML={{ __html: enhancedContent }} />
    </div>
  );
};

export default NewsArticle;