import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/utils/seo';

export const Terms: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms of Service - Finance Hub"
        description="Read our terms of service and user agreement. Understand your rights and responsibilities when using Finance Hub's financial analysis platform."
        keywords="terms of service, user agreement, website terms, legal terms"
      />
      
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
                  By accessing and using Finance Hub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Permission is granted to temporarily access the materials on Finance Hub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Modify or copy the materials</li>
                  <li>• Use the materials for any commercial purpose or for any public display</li>
                  <li>• Attempt to reverse engineer any software contained on our website</li>
                  <li>• Remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The materials on Finance Hub's website are provided on an 'as is' basis. Finance Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p className="text-sm text-muted-foreground">
                  Further, Finance Hub does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <strong>IMPORTANT:</strong> The information provided on this website is for educational and informational purposes only and should not be construed as investment advice. All investments involve risk, including the potential loss of principal.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Past performance does not guarantee future results</li>
                  <li>• Market conditions can change rapidly and unpredictably</li>
                  <li>• Cryptocurrency and forex markets are particularly volatile</li>
                  <li>• You should consult with a qualified financial advisor before making investment decisions</li>
                  <li>• We are not a registered investment advisor or broker-dealer</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  By using our service, you acknowledge that you understand these risks and agree to make investment decisions based on your own research and risk tolerance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                <p className="text-sm text-muted-foreground">
                  You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  When posting comments or content on our website, you agree not to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Post content that is illegal, harmful, threatening, abusive, or defamatory</li>
                  <li>• Violate any intellectual property rights</li>
                  <li>• Post spam, advertisements, or promotional content</li>
                  <li>• Impersonate any person or entity</li>
                  <li>• Post content that contains viruses or malicious code</li>
                  <li>• Engage in market manipulation or pump-and-dump schemes</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to remove any content that violates these standards and to suspend or terminate accounts that repeatedly violate our terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our premium subscription services are billed in advance on a monthly or annual basis. You may cancel your subscription at any time, but refunds are not provided for partial billing periods.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Subscription fees are non-refundable except as required by law</li>
                  <li>• We may change subscription prices with 30 days notice</li>
                  <li>• Your subscription will automatically renew unless cancelled</li>
                  <li>• You retain access to premium content until the end of your billing period</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  In no event shall Finance Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Finance Hub's website, even if Finance Hub or a Finance Hub authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy of Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The materials appearing on Finance Hub's website could include technical, typographical, or photographic errors. Finance Hub does not warrant that any of the materials on its website are accurate, complete, or current. Finance Hub may make changes to the materials contained on its website at any time without notice. However, Finance Hub does not make any commitment to update the materials.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Finance Hub has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Finance Hub of the site. Use of any such linked website is at the user's own risk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Finance Hub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These terms and conditions are governed by and construed in accordance with the laws of California, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Email:</strong> legal@financehub.com</p>
                  <p><strong>Address:</strong> Finance Hub, 123 Market Street, San Francisco, CA 94105</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};