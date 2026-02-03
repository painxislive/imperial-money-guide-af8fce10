import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { glossaryService, GlossaryTerm } from '@/services/glossaryService';
import { ArrowRight, BookOpen } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GlossaryLetter() {
  const { letter } = useParams<{ letter: string }>();
  const upperLetter = letter?.toUpperCase() || 'A';
  
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [letterCounts, setLetterCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [upperLetter]);

  const loadData = async () => {
    setLoading(true);
    const [termsData, counts] = await Promise.all([
      glossaryService.getTermsByLetter(upperLetter),
      glossaryService.getLetterCounts()
    ]);
    setTerms(termsData);
    setLetterCounts(counts);
    setLoading(false);
  };

  const structuredData = {
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
        "name": `Terms starting with ${upperLetter}`,
        "item": `https://imperialpedia.com/glossary/letter/${letter}`
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Finance Terms Starting with {upperLetter} | Imperialpedia Glossary</title>
        <meta 
          name="description" 
          content={`Browse all finance, investing, and banking terms starting with the letter ${upperLetter}. Clear definitions and explanations.`} 
        />
        <link rel="canonical" href={`https://imperialpedia.com/glossary/letter/${letter}`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
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
                  <BreadcrumbPage>Letter {upperLetter}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Header */}
        <section className="py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Terms Starting with "{upperLetter}"
            </h1>
            <p className="text-muted-foreground">
              {loading ? (
                <Skeleton className="h-5 w-48 inline-block" />
              ) : (
                `${terms.length} term${terms.length !== 1 ? 's' : ''} found`
              )}
            </p>
          </div>
        </section>

        {/* A-Z Navigation */}
        <section className="py-6 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {ALPHABET.map(l => {
                const count = letterCounts[l] || 0;
                const isActive = l === upperLetter;
                const hasTerms = count > 0;
                
                if (!hasTerms) {
                  return (
                    <span
                      key={l}
                      className="w-10 h-10 flex items-center justify-center rounded-lg font-semibold bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      {l}
                    </span>
                  );
                }

                return (
                  <Link
                    key={l}
                    to={`/glossary/letter/${l.toLowerCase()}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border hover:bg-muted'
                    }`}
                  >
                    {l}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Terms List */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/3 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : terms.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No terms found</h2>
                <p className="text-muted-foreground mb-4">
                  There are no glossary terms starting with "{upperLetter}" yet.
                </p>
                <Link to="/glossary" className="text-primary hover:underline">
                  ← Back to Glossary
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {terms.map(term => (
                  <Link key={term.id} to={`/glossary/term/${term.slug}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                              {term.term}
                            </h2>
                            <p className="text-muted-foreground line-clamp-2 mb-3">
                              {term.short_definition || term.definition}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{term.category}</Badge>
                              {term.subcategory && (
                                <Badge variant="outline">{term.subcategory}</Badge>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-6 border-t">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              This glossary is for educational purposes only. Imperialpedia does not provide financial advice.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
