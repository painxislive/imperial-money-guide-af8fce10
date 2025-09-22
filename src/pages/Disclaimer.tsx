import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DollarSign, TrendingUp, Shield, Info } from 'lucide-react';

const Disclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - ImperialPedia</title>
        <meta name="description" content="Important disclaimers and risk warnings for financial information, investment content, and educational materials on ImperialPedia." />
        <meta name="keywords" content="financial disclaimer, investment risks, trading warnings, liability limitation" />
        
        <meta property="og:title" content="Disclaimer - ImperialPedia" />
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
              "name": "ImperialPedia"
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl text-muted-foreground">
            Important information regarding financial content and investment risks
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Risk Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-700 dark:text-red-300">
            <p className="text-lg font-semibold mb-2">
              Trading and investing in financial markets involves substantial risk and may not be suitable for all investors.
            </p>
            <p>
              You could lose some or all of your invested capital. Never invest money you cannot afford to lose. 
              Past performance is not indicative of future results.
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
                The information provided on ImperialPedia is for general informational and educational purposes only. 
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
                Investment & Trading Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Market Risk</h3>
                <p className="text-muted-foreground">
                  All investments are subject to market risk, including the potential loss of principal. 
                  Market values fluctuate due to various factors including economic conditions, political events, 
                  and market sentiment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cryptocurrency Risks</h3>
                <p className="text-muted-foreground">
                  Cryptocurrencies are highly volatile and speculative investments. They may experience 
                  extreme price swings, regulatory changes, technological risks, and lack of liquidity. 
                  Cryptocurrency investments may result in total loss.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Leverage & Derivatives Risk</h3>
                <p className="text-muted-foreground">
                  Leveraged products and derivatives carry additional risks due to their complex nature and 
                  amplified exposure. Losses can exceed initial investment amounts. These products are not 
                  suitable for inexperienced investors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Foreign Exchange Risk</h3>
                <p className="text-muted-foreground">
                  Forex trading involves substantial risk due to leverage, volatility, and the 24-hour nature 
                  of currency markets. Most retail forex traders lose money. Only trade with capital you can afford to lose.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Advice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Professional Financial Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Before making any investment decisions, you should:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Consult with a qualified financial advisor or investment professional</li>
                <li>Consider your individual financial situation, risk tolerance, and investment objectives</li>
                <li>Conduct your own research and due diligence</li>
                <li>Review all relevant documentation and terms of any investment products</li>
                <li>Understand the tax implications of your investment decisions</li>
                <li>Consider seeking legal advice for complex investment structures</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Note:</strong> ImperialPedia is not a licensed financial advisor, broker-dealer, 
                or investment advisor. We do not provide personalized investment advice or manage client assets.
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
                To the fullest extent permitted by applicable law, ImperialPedia and its owners, employees, 
                agents, and affiliates shall not be liable for any direct, indirect, incidental, special, 
                consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Your use of or reliance on information provided on this website</li>
                <li>Any investment decisions made based on information from this website</li>
                <li>Trading losses or investment losses of any kind</li>
                <li>Errors, omissions, or inaccuracies in the information provided</li>
                <li>Technical issues or website downtime</li>
                <li>Third-party content or external links</li>
              </ul>
              <p className="mt-4">
                You acknowledge that you use this website and any information contained herein entirely at your own risk.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Content */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Content & Affiliate Relationships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">External Links</h3>
                <p className="text-muted-foreground">
                  Our website may contain links to third-party websites, services, or resources. These links are 
                  provided for convenience only. We do not endorse, control, or assume responsibility for the 
                  content, accuracy, or practices of third-party sites.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Affiliate Relationships</h3>
                <p className="text-muted-foreground">
                  ImperialPedia may receive compensation through affiliate partnerships with financial service 
                  providers, brokers, or other companies. This compensation does not influence our editorial 
                  content or recommendations. All affiliate relationships are clearly disclosed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sponsored Content</h3>
                <p className="text-muted-foreground">
                  Any sponsored or paid content is clearly labeled as such. Sponsored content is separate 
                  from our editorial content and does not represent the views or recommendations of ImperialPedia.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Information */}
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Financial regulations vary by jurisdiction. Content on this website may not be applicable or 
                legal in all countries or regions. Users are responsible for ensuring compliance with local 
                laws and regulations.
              </p>
              <p>
                Some financial products and services mentioned on this website may not be available in all 
                jurisdictions or to all types of investors. Regulatory restrictions may apply.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>For US Residents:</strong> This website is not intended to provide investment advice 
                to residents of the United States. US persons should consult with SEC-registered investment 
                advisors for personalized investment advice.
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
                This disclaimer may be updated from time to time to reflect changes in our practices, 
                applicable laws, or regulatory requirements. We encourage you to review this disclaimer 
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
                If you have questions about this disclaimer or need clarification on any information:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@imperialpedia.com</p>
                <p><strong>Address:</strong> ImperialPedia Legal Department</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;