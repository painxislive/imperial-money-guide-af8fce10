import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, ExternalLink, Twitter, Linkedin, Globe } from 'lucide-react';
import { db } from '@/lib/supabase-helpers';
import { Article } from '@/lib/content';

interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AuthorProfile = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthorData = async () => {
      if (!authorId) return;

      setLoading(true);
      
      // Load author details
      const { data: authorData, error: authorError } = await db('authors')
        .select('*')
        .eq('id', authorId)
        .eq('is_active', true)
        .single();

      if (authorError || !authorData) {
        setLoading(false);
        return;
      }

      setAuthor(authorData as Author);

      // Load author's articles
      const { data: articlesData, error: articlesError } = await db('articles')
        .select('*')
        .eq('author_id', authorId)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!articlesError && articlesData) {
        setArticles(articlesData as Article[]);
      }

      setLoading(false);
    };

    loadAuthorData();
  }, [authorId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateStructuredData = () => {
    if (!author) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": author.name,
      "description": author.bio,
      "image": author.avatar_url,
      "url": window.location.href,
      "sameAs": [
        author.social_twitter && `https://twitter.com/${author.social_twitter.replace('@', '')}`,
        author.social_linkedin,
        author.social_website
      ].filter(Boolean),
      "worksFor": {
        "@type": "Organization",
        "name": "ImperialPedia"
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
          <p className="text-muted-foreground mb-4">The author you're looking for doesn't exist.</p>
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
        <title>{author.name} - Author Profile | ImperialPedia</title>
        <meta name="description" content={author.bio || `Articles and insights by ${author.name}`} />
        <meta name="author" content={author.name} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={`${author.name} - Author Profile`} />
        <meta property="og:description" content={author.bio || `Articles and insights by ${author.name}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={window.location.href} />
        {author.avatar_url && <meta property="og:image" content={author.avatar_url} />}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${author.name} - Author Profile`} />
        <meta name="twitter:description" content={author.bio || `Articles and insights by ${author.name}`} />
        {author.avatar_url && <meta name="twitter:image" content={author.avatar_url} />}
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/news" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
        </nav>

        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="shrink-0">
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                {author.bio && (
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {author.bio}
                  </p>
                )}
                
                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  {author.social_twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://twitter.com/${author.social_twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {author.social_linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={author.social_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {author.social_website && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={author.social_website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold text-primary">
                  {articles.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Articles Published
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          {articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {article.featured_image && (
                      <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden">
                        <img 
                          src={article.featured_image} 
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                          <Badge variant="secondary">
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
                        {article.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {article.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/news/${article.slug}`}>
                              Read More
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles published by this author yet.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default AuthorProfile;
