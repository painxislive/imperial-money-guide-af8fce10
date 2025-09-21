import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/utils/seo';

export const Privacy: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - Finance Hub"
        description="Learn how Finance Hub collects, uses, and protects your personal information. Our commitment to data privacy and security."
        keywords="privacy policy, data protection, user privacy, GDPR compliance"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <p className="text-sm text-muted-foreground">
                    When you create an account, we collect your name, email address, and any profile information you choose to provide.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Data</h4>
                  <p className="text-sm text-muted-foreground">
                    We collect information about how you use our service, including pages visited, time spent, and interaction patterns.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Device Information</h4>
                  <p className="text-sm text-muted-foreground">
                    We collect device-specific information such as IP address, browser type, operating system, and device identifiers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Provide, maintain, and improve our services</li>
                  <li>• Send you newsletters and market updates (with your consent)</li>
                  <li>• Respond to your comments, questions, and customer service requests</li>
                  <li>• Analyze usage patterns to improve user experience</li>
                  <li>• Detect, prevent, and address technical issues and security threats</li>
                  <li>• Comply with legal obligations and protect our rights</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• With your explicit consent</li>
                  <li>• With service providers who assist in operating our website</li>
                  <li>• When required by law or to respond to legal process</li>
                  <li>• To protect our rights, property, or safety, or that of our users</li>
                  <li>• In connection with a business transaction such as a merger or acquisition</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Encryption of data in transit and at rest</li>
                  <li>• Regular security assessments and updates</li>
                  <li>• Limited access to personal data on a need-to-know basis</li>
                  <li>• Secure hosting infrastructure with industry-standard protections</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                  <li>• <strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                  <li>• <strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li>• <strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li>• <strong>Objection:</strong> Object to processing of your personal data</li>
                  <li>• <strong>Restriction:</strong> Request restriction of processing</li>
                  <li>• <strong>Withdrawal:</strong> Withdraw consent at any time</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience on our website. These include:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Essential cookies:</strong> Required for basic website functionality</li>
                  <li>• <strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
                  <li>• <strong>Preference cookies:</strong> Remember your settings and preferences</li>
                  <li>• <strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  You can control cookie settings through your browser preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our website may contain links to third-party services. We use the following third-party services:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li>• <strong>Google AdSense:</strong> For displaying relevant advertisements</li>
                  <li>• <strong>Social Media Platforms:</strong> For social sharing functionality</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers are conducted in accordance with applicable data protection laws and with appropriate safeguards in place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you have any questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Email:</strong> privacy@financehub.com</p>
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