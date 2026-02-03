import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { glossaryService, GlossaryTerm as GlossaryTermType } from '@/services/glossaryService';
import { format } from 'date-fns';
import { 
  BookOpen, 
  Calendar, 
  RefreshCw, 
  User, 
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function GlossaryTerm() {
  const { slug } = useParams<{ slug: string }>();
  const [term, setTerm] = useState<GlossaryTermType | null>(null);
  const [relatedTerms, setRelatedTerms] = useState<GlossaryTermType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadTerm();
    }
  }, [slug]);

  const loadTerm = async () => {
    if (!slug) return;
    
    setLoading(true);
    const termData = await glossaryService.getTermBySlug(slug);
    setTerm(termData);
    
    // Load related terms if available
    if (termData?.related_terms?.length) {
      const related = await glossaryService.getRelatedTerms(termData.related_terms);
      setRelatedTerms(related);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!term) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Term Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The glossary term you're looking for doesn't exist.
            </p>
            <Link to="/glossary" className="text-primary hover:underline">
              ← Back to Glossary
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const author = term.author;
  const fullDefinition = term.full_definition || term.definition || '';

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": term.term,
    "description": term.short_definition || term.definition,
    "url": `https://imperialpedia.com/glossary/term/${term.slug}`,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Imperialpedia Finance Glossary",
      "url": "https://imperialpedia.com/glossary"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://imperialpedia.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Glossary",
        "item": "https://imperialpedia.com/glossary"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Letter ${term.letter}`,
        "item": `https://imperialpedia.com/glossary/letter/${term.letter.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": term.term,
        "item": `https://imperialpedia.com/glossary/term/${term.slug}`
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{term.term} - Definition & Meaning | Imperialpedia</title>
        <meta 
          name="description" 
          content={term.short_definition || term.definition || `Learn what ${term.term} means. Clear definition and explanation.`} 
        />
        <meta name="keywords" content={`${term.term}, ${term.category}, finance definition, ${term.term} meaning`} />
        <link rel="canonical" href={`https://imperialpedia.com/glossary/term/${term.slug}`} />
        <meta property="og:title" content={`${term.term} - Definition & Meaning`} />
        <meta property="og:description" content={term.short_definition || term.definition} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/glossary">Glossary</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/glossary/letter/${term.letter.toLowerCase()}`}>Letter {term.letter}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{term.term}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{term.category}</Badge>
                  {term.subcategory && <Badge variant="outline">{term.subcategory}</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{term.term}</h1>
                <p className="text-xl text-muted-foreground">
                  {term.short_definition || term.definition}
                </p>
              </header>

              <Separator className="my-8" />

              {/* Full Definition */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What is {term.term}?</h2>
                <div className="prose prose-slate max-w-none">
                  {fullDefinition.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              {/* Example */}
              {term.example && (
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Example</h2>
                  <Card className="bg-muted/50">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground italic">
                        {term.example}
                      </p>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Related Terms */}
              {relatedTerms.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Related Terms</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedTerms.map(related => (
                      <Link key={related.id} to={`/glossary/term/${related.slug}`}>
                        <Card className="hover:shadow-md transition-shadow h-full">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{related.term}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {related.short_definition || related.definition}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Disclaimer */}
              <section className="mt-12 p-6 bg-muted/50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Educational Disclaimer</h3>
                    <p className="text-sm text-muted-foreground">
                      This article is for educational and informational purposes only. 
                      Imperialpedia does not provide financial, legal, or investment advice. 
                      Consult a qualified professional before making financial decisions.
                    </p>
                  </div>
                </div>
              </section>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author Card */}
              {author && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Written by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={author.avatar_url} alt={author.name} />
                        <AvatarFallback>
                          {author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{author.name}</span>
                          {author.is_verified && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{author.role}</p>
                      </div>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                        {author.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Article Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Article Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {term.published_at && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-muted-foreground">Published</div>
                        <div>{format(new Date(term.published_at), 'MMM d, yyyy')}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Last Updated</div>
                      <div>{format(new Date(term.updated_at), 'MMM d, yyyy')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Explore More</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link 
                    to={`/glossary/letter/${term.letter.toLowerCase()}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    More terms starting with {term.letter}
                  </Link>
                  <Link 
                    to="/glossary"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    Browse full glossary
                  </Link>
                  <a 
                    href="https://www.imf.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    IMF Resources
                  </a>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
