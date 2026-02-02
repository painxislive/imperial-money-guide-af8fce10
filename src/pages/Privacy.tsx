import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/utils/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const Privacy: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - Imperialpedia"
        description="Learn how Imperialpedia collects, uses, and protects your personal information. Our commitment to data privacy and security."
        keywords="privacy policy, data protection, user privacy, GDPR compliance"
      />
      
      <Header />
      
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
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Imperialpedia ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
                <p className="text-muted-foreground">
                  Please read this privacy policy carefully. By using our website, you consent to the practices 
                  described in this policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Automatically Collected Information</h4>
                  <p className="text-sm text-muted-foreground">
                    When you visit our website, we may automatically collect certain information about your device, 
                    including your IP address, browser type, operating system, referring URLs, and information 
                    about how you interact with our website.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Data</h4>
                  <p className="text-sm text-muted-foreground">
                    We collect information about how you use our website, including pages visited, time spent on pages, 
                    links clicked, and search queries entered.
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
                  <li>• Provide, maintain, and improve our website and services</li>
                  <li>• Analyze usage patterns to enhance user experience</li>
                  <li>• Detect, prevent, and address technical issues</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Display relevant content and, where applicable, advertisements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  These include:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Essential cookies:</strong> Required for basic website functionality</li>
                  <li>• <strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
                  <li>• <strong>Preference cookies:</strong> Remember your settings and preferences</li>
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
                  Our website may use third-party services that collect information:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li>• <strong>Google AdSense:</strong> For displaying relevant advertisements</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your information. 
                  However, no method of transmission over the Internet is 100% secure, and we cannot guarantee 
                  absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Right to access your personal data</li>
                  <li>• Right to request correction of inaccurate data</li>
                  <li>• Right to request deletion of your data</li>
                  <li>• Right to object to processing</li>
                  <li>• Right to data portability</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our website is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected information 
                  from a child, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of any changes by 
                  posting the new policy on this page and updating the "Last updated" date. We encourage you 
                  to review this policy periodically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you have questions about this privacy policy or our data practices, please contact us:
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

export default Privacy;
