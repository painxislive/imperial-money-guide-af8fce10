import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Info, Shield } from 'lucide-react';

const AffiliateDisclosure = () => (
  <>
    <SEO
      title="Affiliate Disclosure - ImperialPedia"
      description="ImperialPedia's affiliate disclosure explains how we earn revenue through affiliate partnerships while maintaining editorial independence."
      url="https://imperialpedia.com/affiliate-disclosure"
      structuredData={generateBreadcrumbSchema([
        { name: 'Home', url: 'https://imperialpedia.com' },
        { name: 'Affiliate Disclosure', url: 'https://imperialpedia.com/affiliate-disclosure' },
      ])}
    />
    <Header />
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Affiliate Disclosure</h1>
        <p className="text-lg text-muted-foreground">Transparency about how we earn revenue.</p>
        <p className="text-sm text-muted-foreground mt-2">Last updated: March 2026</p>
      </div>
      <div className="space-y-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm"><strong>Summary:</strong> Some links on ImperialPedia are affiliate links. We may earn a commission if you click through and make a purchase or sign up. This does not affect the price you pay or our editorial content.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />How We Earn Revenue</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>ImperialPedia earns revenue through:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Display advertising (Google AdSense)</li>
              <li>Affiliate partnerships with financial service providers</li>
              <li>Premium content subscriptions (future)</li>
            </ul>
            <p>Revenue supports our mission of providing free, high-quality financial education content.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Editorial Independence</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Affiliate partnerships never influence our content. We recommend products and services based solely on their merit and relevance to our educational content. Our editorial team operates independently from our revenue partnerships.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" />How We Identify Affiliate Links</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Affiliate links are identified with clear disclosure language near the link or at the top of articles containing affiliate links. We believe in full transparency with our readers.</p>
          </CardContent>
        </Card>
      </div>
    </main>
    <Footer />
  </>
);

export default AffiliateDisclosure;
