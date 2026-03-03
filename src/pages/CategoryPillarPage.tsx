import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AdSenseSlot } from '@/components/AdSenseSlots';
import { contentService } from '@/services/contentService';
import type { Article, Category } from '@/types/enterprise';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { Search, ChevronRight, FileText, TrendingUp, Clock, Crown, BookOpen } from 'lucide-react';

const SLUG_MAP: Record<string, string> = {
  '/crypto': 'crypto',
  '/stocks': 'stocks',
  '/personal-finance': 'personal-finance',
  '/investing': 'investing',
  '/banking': 'banking',
};

const CategoryPillarPage = () => {
  const location = useLocation();
  const slug = SLUG_MAP[location.pathname] || location.pathname.replace('/', '');

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (slug) loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);
    const [cat, arts, terms] = await Promise.all([
      contentService.getCategoryBySlug(slug),
      contentService.getPublishedArticles({ categorySlug: slug }),
      contentService.getGlossaryTermsByCategory(slug),
    ]);
    setCategory(cat);
    setArticles(arts);
    setGlossaryTerms(terms);
    setLoading(false);
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredArticles = filteredArticles.filter(a => a.is_featured).slice(0, 3);
  const recentArticles = filteredArticles.filter(a => !a.is_featured);

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

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild><Link to="/">Go Home</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://imperialpedia.com/' },
    { name: category.name, url: `https://imperialpedia.com/${category.slug}` },
  ];

  const faqSchema = category.faq_items?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": category.faq_items.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  const structuredData = [generateBreadcrumbSchema(breadcrumbs), faqSchema].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={category.meta_title || category.seo_title || `${category.name} | ImperialPedia`}
        description={category.meta_description || category.seo_description || category.description || `Explore ${category.name} articles and guides.`}
        url={`https://imperialpedia.com/${category.slug}`}
        structuredData={structuredData}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="hero-gradient text-primary-foreground py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm opacity-80 mb-6" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.url} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight className="h-3 w-3" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span>{crumb.name}</span>
                  ) : (
                    <Link to={new URL(crumb.url).pathname} className="hover:opacity-100 transition-opacity">{crumb.name}</Link>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg lg:text-xl opacity-90 max-w-2xl mb-8">
              {category.description || `Explore educational articles and guides about ${category.name.toLowerCase()}.`}
            </p>

            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={`Search ${category.name.toLowerCase()} articles...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Pillar Content */}
          {category.pillar_content && (
            <section className="mb-12 max-w-3xl">
              <div className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: category.pillar_content }} />
            </section>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Featured */}
              {featuredArticles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />Featured
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticles.map((article, idx) => (
                      <Card key={article.id} className={idx === 0 ? 'md:col-span-2' : ''}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {article.is_premium && <Badge variant="secondary" className="gap-1"><Crown className="h-3 w-3" />Premium</Badge>}
                            <span className="text-sm text-muted-foreground">{formatDate(article.published_at || article.created_at)}</span>
                          </div>
                          <Link to={`/article/${article.slug}`}>
                            <h3 className="text-xl font-bold hover:text-primary transition-colors mb-2">{article.title}</h3>
                          </Link>
                          <p className="text-muted-foreground line-clamp-2">{article.excerpt}</p>
                          {article.author && <p className="text-sm text-muted-foreground mt-3">By {article.author.name}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              <AdSenseSlot slot="article-top" />

              {/* All Articles */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />Latest Articles
                </h2>
                <div className="space-y-4">
                  {recentArticles.map(article => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {article.featured_image && (
                            <img src={article.featured_image} alt={article.title} className="w-20 h-14 object-cover rounded hidden sm:block" loading="lazy" />
                          )}
                          <div className="flex-1">
                            <Link to={`/article/${article.slug}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors">{article.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              {article.author && <span>{article.author.name}</span>}
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(article.published_at || article.created_at)}</span>
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
                        <p>No articles found in this category yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Glossary Terms */}
              {glossaryTerms.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />Related Terms
                    </h3>
                    <div className="space-y-2">
                      {glossaryTerms.map(term => (
                        <Link key={term.slug} to={`/glossary/term/${term.slug}`} className="block text-sm hover:text-primary transition-colors">
                          <span className="font-medium">{term.term}</span>
                          {term.short_definition && <span className="text-muted-foreground"> — {term.short_definition.slice(0, 60)}...</span>}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <AdSenseSlot slot="sidebar" />

              {/* Other Categories */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Explore Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm"><Link to="/crypto">Crypto</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link to="/stocks">Stocks</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link to="/personal-finance">Personal Finance</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link to="/investing">Investing</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link to="/banking">Banking</Link></Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* FAQ Section */}
          {category.faq_items?.length > 0 && (
            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible>
                {category.faq_items.map((faq: any, idx: number) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPillarPage;
