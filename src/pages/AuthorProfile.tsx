import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { contentService } from '@/services/contentService';
import type { Author, Article } from '@/types/enterprise';
import { Calendar, Eye, ChevronRight, User, CheckCircle, Linkedin, Twitter } from 'lucide-react';

const AuthorProfile = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviewedArticles, setReviewedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authorId) loadData();
  }, [authorId]);

  const loadData = async () => {
    setLoading(true);
    const authorData = await contentService.getAuthorBySlug(authorId!);
    setAuthor(authorData);
    if (authorData) {
      const [authored, reviewed] = await Promise.all([
        contentService.getPublishedArticles({ authorSlug: authorData.slug }),
        contentService.getReviewedArticles(authorData.id),
      ]);
      setArticles(authored);
      setReviewedArticles(reviewed);
    }
    setLoading(false);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

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

  if (!author) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Author Not Found</h1>
          <p className="text-muted-foreground mb-8">The author you're looking for doesn't exist.</p>
          <Button asChild><Link to="/articles">Browse Articles</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://imperialpedia.com/' },
    { name: 'Authors', url: 'https://imperialpedia.com/authors/verified' },
    { name: author.name, url: `https://imperialpedia.com/author/${author.slug}` },
  ];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.credentials || author.title,
    "description": author.bio,
    "image": author.profile_image || author.avatar_url,
    "url": `https://imperialpedia.com/author/${author.slug}`,
    "sameAs": [author.linkedin_url, author.twitter_url].filter(Boolean),
    "worksFor": { "@type": "Organization", "name": "ImperialPedia" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${author.name} - Author Profile | ImperialPedia`}
        description={author.bio || `Articles and insights by ${author.name} on ImperialPedia.`}
        image={author.profile_image || author.avatar_url || undefined}
        url={`https://imperialpedia.com/author/${author.slug}`}
        type="profile"
        structuredData={[personSchema, generateBreadcrumbSchema(breadcrumbs)]}
      />
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.url} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="h-3 w-3" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{crumb.name}</span>
              ) : (
                <Link to={new URL(crumb.url).pathname} className="hover:text-primary transition-colors">{crumb.name}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0">
                {(author.profile_image || author.avatar_url) ? (
                  <img src={author.profile_image || author.avatar_url!} alt={author.name} className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{author.name}</h1>
                {author.credentials && <p className="text-primary font-medium mb-2">{author.credentials}</p>}
                {author.title && <p className="text-muted-foreground mb-3">{author.title}</p>}
                {author.bio && <p className="text-muted-foreground mb-4 leading-relaxed">{author.bio}</p>}

                {/* Expertise */}
                {author.expertise_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {author.expertise_tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-3">
                  {author.twitter_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.twitter_url} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-2" />Twitter
                      </a>
                    </Button>
                  )}
                  {author.linkedin_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center md:text-right shrink-0">
                <div className="text-2xl font-bold text-primary">{articles.length}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
                {author.is_reviewer && (
                  <div className="mt-2 flex items-center gap-1 text-accent text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Reviewer</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Published Articles */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Published Articles</h2>
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map(article => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {article.featured_image && (
                        <img src={article.featured_image} alt={article.title} className="w-24 h-16 object-cover rounded hidden sm:block" loading="lazy" />
                      )}
                      <div className="flex-1">
                        <Link to={`/article/${article.slug}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">{article.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{article.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {article.category && <Badge variant="outline" className="text-xs">{article.category.name}</Badge>}
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(article.published_at || article.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No articles published yet.</p>
          )}
        </section>

        {/* Reviewed Articles */}
        {reviewedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-accent" />
              Reviewed Articles
            </h2>
            <div className="space-y-3">
              {reviewedArticles.map(article => (
                <Link key={article.id} to={`/article/${article.slug}`} className="block group">
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{formatDate(article.published_at || article.created_at)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AuthorProfile;
