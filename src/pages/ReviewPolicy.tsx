import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO, generateBreadcrumbSchema } from '@/utils/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Eye, Clock, UserCheck } from 'lucide-react';

const ReviewPolicy = () => (
  <>
    <SEO
      title="Review Policy - ImperialPedia"
      description="Understand how ImperialPedia reviews and verifies financial education content before publication."
      url="https://imperialpedia.com/review-policy"
      structuredData={generateBreadcrumbSchema([
        { name: 'Home', url: 'https://imperialpedia.com' },
        { name: 'Review Policy', url: 'https://imperialpedia.com/review-policy' },
      ])}
    />
    <Header />
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Review Policy</h1>
        <p className="text-lg text-muted-foreground">How we ensure the quality and accuracy of every piece of content.</p>
        <p className="text-sm text-muted-foreground mt-2">Last updated: March 2026</p>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" />Multi-Stage Review</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">
            <p>All content passes through five stages: Draft → Editorial Review → SEO Review → Compliance Review → Published. Each stage has designated reviewers with specific expertise.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" />Reviewer Qualifications</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Reviewers must hold relevant professional qualifications (CFA, CPA, CFP, or equivalent) or have 5+ years of industry experience. Reviewer credentials are displayed alongside their reviewed articles.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Review Criteria</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Factual accuracy against primary sources</li>
              <li>Appropriate disclaimers and risk disclosures</li>
              <li>Clear, unbiased language free of speculation</li>
              <li>Proper source citations</li>
              <li>Compliance with financial content regulations</li>
              <li>Minimum 1,000 words for comprehensive coverage</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Regular Re-reviews</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Published articles are re-reviewed on a quarterly basis to ensure continued accuracy. The "last reviewed" date is displayed on each article. Articles with time-sensitive content (interest rates, tax laws) are prioritized for more frequent reviews.</p>
          </CardContent>
        </Card>
      </div>
    </main>
    <Footer />
  </>
);

export default ReviewPolicy;
