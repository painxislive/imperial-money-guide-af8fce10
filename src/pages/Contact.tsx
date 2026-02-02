import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { SEO } from '@/utils/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact: React.FC = () => {
  return (
    <>
      <SEO
        title="Contact Imperialpedia - Editorial Inquiries & Feedback"
        description="Contact Imperialpedia for editorial inquiries, corrections, or general questions. We welcome feedback from our global audience."
        keywords="contact imperialpedia, editorial contact, feedback, corrections"
      />
      
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              We welcome your feedback, questions, and suggestions.
            </p>
          </div>

          {/* Main Contact Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Editorial Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For editorial inquiries, corrections, or general questions, please contact us at:
              </p>
              <div className="bg-primary/5 p-6 rounded-lg text-center">
                <a 
                  href="mailto:editorial@imperialpedia.com" 
                  className="text-xl font-medium text-primary hover:underline"
                >
                  editorial@imperialpedia.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                We aim to respond to all inquiries within 2-3 business days.
              </p>
            </CardContent>
          </Card>

          {/* Types of Inquiries */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                How Can We Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">1</span>
                  <div>
                    <p className="font-medium">Content Corrections</p>
                    <p className="text-sm text-muted-foreground">Found an error in our articles? Let us know and we'll review it promptly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">2</span>
                  <div>
                    <p className="font-medium">Topic Suggestions</p>
                    <p className="text-sm text-muted-foreground">Have a finance topic you'd like us to cover? We welcome suggestions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">3</span>
                  <div>
                    <p className="font-medium">General Feedback</p>
                    <p className="text-sm text-muted-foreground">Your feedback helps us improve our content and user experience.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">4</span>
                  <div>
                    <p className="font-medium">Partnership Inquiries</p>
                    <p className="text-sm text-muted-foreground">For business or partnership discussions, please reach out via email.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">Important Note</p>
                  <p>
                    Imperialpedia provides educational content only. We cannot provide personalized 
                    financial, legal, or investment advice. For specific financial decisions, please 
                    consult with a qualified professional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;
