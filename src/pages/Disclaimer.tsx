import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DollarSign, TrendingUp, Shield, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Disclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - Imperialpedia</title>
        <meta name="description" content="Important disclaimers and risk warnings for financial information, investment content, and educational materials on Imperialpedia." />
        <meta name="keywords" content="financial disclaimer, investment risks, trading warnings, liability limitation" />
        
        <meta property="og:title" content="Disclaimer - Imperialpedia" />
        <meta property="og:description" content="Important disclaimers and risk warnings for financial information and investment content." />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Financial Disclaimer",
            "description": "Risk warnings and disclaimers for financial content",
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
          <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl text-muted-foreground">
            Important information regarding financial content and educational materials
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Educational Content Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <p className="text-lg font-semibold mb-2">
              All content on Imperialpedia is for educational and informational purposes only.
            </p>
            <p>
              Nothing on this website constitutes financial, investment, legal, or tax advice. 
              Always consult with qualified professionals before making financial decisions.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* General Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                General Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The information provided on Imperialpedia is for general informational and educational purposes only. 
                It is not intended as, and should not be construed as, professional financial advice, investment 
                recommendations, or an offer or solicitation to buy or sell any financial instruments.
              </p>
              <p>
                While we strive to provide accurate and up-to-date information, we make no representations or 
                warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
                suitability, or availability of the information contained on this website.
              </p>
              <p>
                All information is subject to change without notice. Market conditions can change rapidly, 
                and information that was accurate at the time of publication may become outdated or irrelevant.
              </p>
            </CardContent>
          </Card>

          {/* Investment Risks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Investment & Financial Risk Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">General Investment Risk</h3>
                <p className="text-muted-foreground">
                  All investments carry risk, including the potential loss of principal. 
                  Past performance does not guarantee future results. Market values fluctuate due to 
                  economic conditions, political events, and other factors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Investment Advice</h3>
                <p className="text-muted-foreground">
                  Imperialpedia does not provide personalized investment advice. Our content explains 
                  general financial concepts and should not be used as the basis for investment decisions 
                  without consulting a qualified financial advisor.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Advice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Seek Professional Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Before making any financial decisions, you should:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Consult with a qualified financial advisor or investment professional</li>
                <li>Consider your individual financial situation, risk tolerance, and objectives</li>
                <li>Conduct your own research and due diligence</li>
                <li>Review all relevant documentation and terms</li>
                <li>Understand the tax implications of financial decisions</li>
                <li>Consider seeking legal advice for complex matters</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Note:</strong> Imperialpedia is not a licensed financial advisor, broker-dealer, 
                or investment advisor. We do not provide personalized advice or manage assets.
              </p>
            </CardContent>
          </Card>

          {/* Liability Limitation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                To the fullest extent permitted by applicable law, Imperialpedia and its owners, employees, 
                agents, and affiliates shall not be liable for any direct, indirect, incidental, special, 
                consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Your use of or reliance on information provided on this website</li>
                <li>Any financial decisions made based on information from this website</li>
                <li>Errors, omissions, or inaccuracies in the information provided</li>
                <li>Technical issues or website downtime</li>
                <li>Third-party content or external links</li>
              </ul>
              <p className="mt-4">
                You acknowledge that you use this website and any information contained herein entirely at your own risk.
              </p>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card>
            <CardHeader>
              <CardTitle>External Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites for reference and educational purposes. 
                These links are provided for convenience only. We do not endorse, control, or assume 
                responsibility for the content or practices of external websites.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This disclaimer may be updated from time to time. We encourage you to review this page 
                periodically for any changes.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this disclaimer:
              </p>
              <div className="text-sm text-muted-foreground">
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

export default Disclaimer;
