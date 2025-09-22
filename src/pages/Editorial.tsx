import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Users, FileText, Clock, AlertTriangle } from 'lucide-react';

const Editorial = () => {
  return (
    <>
      <Helmet>
        <title>Editorial Policy - ImperialPedia</title>
        <meta name="description" content="Learn about ImperialPedia's editorial standards, content guidelines, and commitment to accurate financial journalism." />
        <meta name="keywords" content="editorial policy, journalism standards, financial news ethics, content guidelines" />
        
        <meta property="og:title" content="Editorial Policy - ImperialPedia" />
        <meta property="og:description" content="Learn about ImperialPedia's editorial standards, content guidelines, and commitment to accurate financial journalism." />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Editorial Policy",
            "description": "ImperialPedia's editorial standards and content guidelines",
            "publisher": {
              "@type": "Organization",
              "name": "ImperialPedia"
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Editorial Policy</h1>
          <p className="text-xl text-muted-foreground">
            Our commitment to accurate, unbiased, and ethical financial journalism
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
                  Every piece of content undergoes rigorous fact-checking. We verify all financial data, market statistics, 
                  and company information through multiple reliable sources before publication.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Independence & Objectivity</h3>
                <p className="text-muted-foreground">
                  Our editorial content maintains strict independence from commercial interests. While we may feature 
                  affiliate partnerships, editorial decisions are never influenced by business relationships.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We clearly disclose all potential conflicts of interest, sponsored content, and affiliate relationships. 
                  Sources are cited whenever possible to maintain transparency.
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
                <h3 className="font-semibold mb-2">Financial Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>All market data is sourced from reputable financial data providers</li>
                  <li>Price information includes timestamps and exchange details</li>
                  <li>Historical data is verified against multiple sources</li>
                  <li>Currency conversions use real-time exchange rates when applicable</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Educational Content</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Complex financial concepts are explained in accessible language</li>
                  <li>Examples and case studies are based on factual scenarios</li>
                  <li>Risk warnings are clearly highlighted for investment-related content</li>
                  <li>Regulatory information is kept current and jurisdiction-specific</li>
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
                  <li><strong>Author Review:</strong> Initial fact-checking and source verification</li>
                  <li><strong>Editorial Review:</strong> Content quality, accuracy, and style consistency</li>
                  <li><strong>Legal Review:</strong> Compliance with financial regulations and disclaimers</li>
                  <li><strong>Final Approval:</strong> Senior editor approval before publication</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Post-Publication Monitoring</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Regular review of published content for accuracy updates</li>
                  <li>Prompt correction of any identified errors</li>
                  <li>Market data updates for time-sensitive information</li>
                  <li>Reader feedback integration and response</li>
                </ul>
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
                  <li>Corrections are also posted on our social media channels when appropriate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Updates</h3>
                <p className="text-muted-foreground">
                  Financial markets evolve rapidly. We regularly update our content to reflect current market conditions, 
                  regulatory changes, and new developments in the financial industry.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Editorial Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Editorial Team Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Qualifications</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Financial industry experience or relevant educational background</li>
                  <li>Professional journalism or financial writing experience</li>
                  <li>Ongoing education in financial markets and regulations</li>
                  <li>Familiarity with financial analysis tools and methodologies</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Conflict of Interest Policy</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Team members must disclose any financial interests in covered companies</li>
                  <li>Trading restrictions apply to covered securities</li>
                  <li>Personal investment decisions are separated from editorial content</li>
                  <li>Regular ethics training and policy updates</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <AlertTriangle className="h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700 dark:text-orange-300">
              <p className="mb-2">
                All content on ImperialPedia is for informational and educational purposes only. 
                Nothing on this site should be construed as financial advice, investment recommendations, 
                or solicitation to buy or sell any financial instruments.
              </p>
              <p>
                Always consult with qualified financial professionals before making investment decisions. 
                Past performance does not guarantee future results, and all investments carry risk of loss.
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
                <p><strong>Editorial Email:</strong> editorial@imperialpedia.com</p>
                <p><strong>Corrections:</strong> corrections@imperialpedia.com</p>
                <p><strong>Tips & Submissions:</strong> tips@imperialpedia.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Editorial;