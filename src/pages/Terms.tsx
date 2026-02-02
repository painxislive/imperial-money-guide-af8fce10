import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/utils/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const Terms: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms of Service - Imperialpedia"
        description="Read Imperialpedia's terms of service. Understand your rights and responsibilities when using our financial education platform."
        keywords="terms of service, user agreement, website terms, legal terms"
      />
      
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  By accessing and using Imperialpedia, you accept and agree to be bound by these terms of service. 
                  If you do not agree to these terms, please do not use our website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Purpose Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">
                  IMPORTANT: All content on Imperialpedia is provided for educational and informational purposes only.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• The information on this website does not constitute financial, investment, legal, or tax advice</li>
                  <li>• We are not a registered investment advisor, broker-dealer, or financial planning service</li>
                  <li>• You should consult with qualified professionals before making any financial decisions</li>
                  <li>• Past performance discussed in our content does not guarantee future results</li>
                  <li>• All investments carry risk, including the potential loss of principal</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use of Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You may access and use our content for personal, non-commercial educational purposes. You may not:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Reproduce, distribute, or republish our content without permission</li>
                  <li>• Use our content for commercial purposes without authorization</li>
                  <li>• Modify or create derivative works from our content</li>
                  <li>• Remove any copyright or proprietary notices from our materials</li>
                  <li>• Use our content in a way that suggests endorsement by Imperialpedia</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy of Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  While we strive to provide accurate and up-to-date information, we make no warranties or 
                  representations about the completeness, accuracy, reliability, or suitability of the information 
                  on our website.
                </p>
                <p className="text-sm text-muted-foreground">
                  Financial markets and regulations change frequently. Information that was accurate at the time 
                  of publication may become outdated. We encourage you to verify information from multiple sources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>External Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our website may contain links to third-party websites for reference purposes. These links are 
                  provided for convenience only. We do not endorse, control, or assume responsibility for the 
                  content, accuracy, or practices of linked websites.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All content on Imperialpedia, including text, graphics, logos, and software, is the property 
                  of Imperialpedia or its content suppliers and is protected by intellectual property laws. 
                  Unauthorized use may violate copyright, trademark, and other laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To the fullest extent permitted by law, Imperialpedia shall not be liable for any direct, 
                  indirect, incidental, special, consequential, or punitive damages arising from your use of 
                  our website or reliance on any information provided. This includes, but is not limited to, 
                  any financial losses from investment decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You agree to indemnify and hold harmless Imperialpedia, its officers, directors, employees, 
                  and agents from any claims, damages, or expenses arising from your use of our website or 
                  violation of these terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately 
                  upon posting to this page. Your continued use of our website after changes constitutes 
                  acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These terms shall be governed by and construed in accordance with applicable laws. Any disputes 
                  arising from these terms or your use of our website shall be resolved through appropriate 
                  legal channels.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Email:</strong> editorial@imperialpedia.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Terms;
