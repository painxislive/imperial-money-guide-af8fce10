import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileCheck, Users, Search, RefreshCw, AlertTriangle } from 'lucide-react';

const EditorialPolicy = () => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://imperialpedia.com' },
    { name: 'Editorial Policy', url: 'https://imperialpedia.com/editorial-policy' },
  ];

  return (
    <>
      <SEO
        title="Editorial Policy - ImperialPedia"
        description="Learn about ImperialPedia's editorial standards, fact-checking process, and commitment to accuracy in financial education content."
        url="https://imperialpedia.com/editorial-policy"
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
      />
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Editorial Policy</h1>
          <p className="text-lg text-muted-foreground">Our commitment to accuracy, transparency, and editorial independence.</p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Editorial Independence</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>ImperialPedia maintains complete editorial independence. Our content is never influenced by advertisers, sponsors, or affiliate partnerships. All opinions and analyses are our own.</p>
              <p>Our editorial team operates independently from our business operations. Advertising and affiliate partnerships are clearly disclosed and never affect content accuracy or recommendations.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileCheck className="h-5 w-5 text-primary" />Fact-Checking Process</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>Every article published on ImperialPedia undergoes a multi-stage review process:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Research:</strong> Authors gather information from primary sources including regulatory bodies, central banks, and academic research.</li>
                <li><strong>Writing:</strong> Content is structured for clarity with proper heading hierarchy and cited sources.</li>
                <li><strong>Editorial Review:</strong> An editor reviews for accuracy, clarity, and adherence to our style guide.</li>
                <li><strong>SEO Review:</strong> Content is optimized for discoverability while maintaining readability.</li>
                <li><strong>Compliance Review:</strong> Final check ensures all disclaimers, disclosures, and regulatory considerations are addressed.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Author Standards</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>All ImperialPedia authors and reviewers are required to have relevant qualifications and experience in finance, economics, or related fields. Author credentials are displayed on every article and verified by our editorial team.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-primary" />Sources & Citations</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>We cite sources from reputable institutions including central banks, regulatory bodies, government agencies, academic journals, and established financial institutions. All data points and statistics include source attribution.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" />Corrections Policy</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>We take errors seriously. When factual errors are identified:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Corrections are made promptly with a clear correction notice at the top of the article.</li>
                <li>The original error and correction are documented for transparency.</li>
                <li>Material corrections include the date of correction.</li>
              </ul>
              <p>To report an error, email us at <a href="mailto:editorial@imperialpedia.com" className="text-primary hover:underline">editorial@imperialpedia.com</a>.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Content Disclaimer</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>All content on ImperialPedia is for educational and informational purposes only. We do not provide financial, investment, legal, or tax advice. Readers should consult qualified professionals before making financial decisions.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditorialPolicy;
