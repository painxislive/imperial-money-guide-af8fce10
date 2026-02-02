import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Users, FileText, Clock, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Editorial = () => {
  return (
    <>
      <Helmet>
        <title>Editorial Policy - Imperialpedia</title>
        <meta name="description" content="Learn about Imperialpedia's editorial standards, content guidelines, and commitment to accurate financial education." />
        <meta name="keywords" content="editorial policy, journalism standards, financial education ethics, content guidelines" />
        
        <meta property="og:title" content="Editorial Policy - Imperialpedia" />
        <meta property="og:description" content="Learn about Imperialpedia's editorial standards, content guidelines, and commitment to accurate financial education." />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Editorial Policy",
            "description": "Imperialpedia's editorial standards and content guidelines",
            "publisher": {
              "@type": "Organization",
              "name": "Imperialpedia"
            }
          })}
        </script>
      </Helmet>

      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Editorial Policy</h1>
          <p className="text-xl text-muted-foreground">
            Our commitment to accurate, unbiased, and accessible financial education
          </p>
        </div>

        <div className="space-y-8">
          {/* Core Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Core Editorial Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Accuracy & Fact-Checking</h3>
                <p className="text-muted-foreground">
                  Every piece of content undergoes thorough fact-checking. We verify all financial data, 
                  definitions, and concepts through multiple reliable sources before publication.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Independence & Objectivity</h3>
                <p className="text-muted-foreground">
                  Our editorial content maintains strict independence. We present balanced, neutral explanations 
                  of financial concepts without bias toward any particular investment strategy or financial product.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We clearly disclose our editorial process and cite authoritative sources. All content is 
                  designed for educational purposes, and we clearly state that we do not provide financial advice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Source Requirements</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Information is sourced from reputable institutions (central banks, regulatory bodies, academic research)</li>
                  <li>Statistics and data are cited from authoritative sources</li>
                  <li>External references link to trusted organizations (IMF, World Bank, Federal Reserve, OECD)</li>
                  <li>Historical information is verified against multiple sources</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Educational Content</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Complex financial concepts are explained in accessible, beginner-friendly language</li>
                  <li>Content is structured with clear headings and logical flow</li>
                  <li>Articles include practical examples where appropriate</li>
                  <li>Disclaimers are prominently displayed on all investment-related content</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Review Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Editorial Review Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Multi-Stage Review</h3>
                <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                  <li><strong>Research:</strong> Thorough research using authoritative sources</li>
                  <li><strong>Writing:</strong> Clear, accessible explanation of concepts</li>
                  <li><strong>Fact-Check:</strong> Verification of all facts and figures</li>
                  <li><strong>Editorial Review:</strong> Quality, accuracy, and clarity assessment</li>
                  <li><strong>Publication:</strong> Final review before publishing</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Corrections & Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Corrections & Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Error Correction Policy</h3>
                <p className="text-muted-foreground mb-2">
                  We are committed to correcting errors promptly and transparently:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Minor corrections (typos, formatting) are updated without notice</li>
                  <li>Factual corrections are clearly marked with update timestamps</li>
                  <li>Significant errors result in correction notices at the top of articles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Updates</h3>
                <p className="text-muted-foreground">
                  Financial information evolves. We regularly review and update our content to reflect 
                  current information, regulatory changes, and new developments in finance and economics.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Author Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Author Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Qualifications</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Finance education background or relevant experience</li>
                  <li>Strong research and writing skills</li>
                  <li>Commitment to accuracy and clarity</li>
                  <li>Understanding of global financial concepts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Attribution</h3>
                <p className="text-muted-foreground">
                  All articles include author attribution with publication and last-updated dates, 
                  ensuring transparency and accountability for our content.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-700 dark:text-amber-300">
              <p className="mb-2">
                All content on Imperialpedia is for informational and educational purposes only. 
                Nothing on this site should be construed as financial advice, investment recommendations, 
                or solicitation to buy or sell any financial instruments.
              </p>
              <p>
                Always consult with qualified financial professionals before making investment decisions. 
                Past performance does not guarantee future results, and all investments carry risk.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Editorial Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                For questions about our editorial policy, corrections, or content suggestions:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> editorial@imperialpedia.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Editorial;
