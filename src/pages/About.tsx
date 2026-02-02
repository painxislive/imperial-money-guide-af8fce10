import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, Globe, FileCheck, Mail } from 'lucide-react';
import { SEO } from '@/utils/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Clarity & Accessibility',
      description: 'We simplify complex financial concepts to make them accessible to readers worldwide, regardless of their background.'
    },
    {
      icon: Shield,
      title: 'Accuracy & Neutrality',
      description: 'Our content is thoroughly researched and fact-checked. We maintain editorial independence and present unbiased information.'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'We cover financial concepts relevant to audiences worldwide, with examples from different markets and economies.'
    },
    {
      icon: FileCheck,
      title: 'Educational Focus',
      description: 'All content is designed for educational purposes, helping readers understand financial concepts rather than providing advice.'
    }
  ];

  const editorialStandards = [
    'All articles are written or reviewed by qualified finance professionals',
    'Content undergoes multi-stage editorial review before publication',
    'Sources are cited from reputable institutions (central banks, regulatory bodies, academic research)',
    'Articles are regularly updated to reflect current information',
    'Clear distinction between factual information and analysis',
    'Prominent disclaimers on all investment-related content'
  ];

  return (
    <>
      <SEO
        title="About Imperialpedia - Global Finance Education Platform"
        description="Imperialpedia is an independent educational platform focused on global finance, investing, banking, taxation, insurance, and economic concepts. Learn about our mission and editorial standards."
        keywords="about imperialpedia, finance education, financial encyclopedia, investment education, economic concepts"
      />
      
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl font-bold">About Imperialpedia</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              An independent educational platform focused on global finance, investing, banking, 
              taxation, insurance, and economic concepts.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg">
                To simplify complex financial topics and make them accessible to readers worldwide 
                through clear explanations, practical calculators, and reference-style content.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <p className="text-sm text-muted-foreground italic">
                  All content published on Imperialpedia is for educational and informational purposes only. 
                  Imperialpedia does not provide financial, legal, or investment advice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <value.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Editorial Standards */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" />
                Editorial Standards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                We are committed to maintaining the highest standards of accuracy and integrity in all our content:
              </p>
              <ul className="space-y-3">
                {editorialStandards.map((standard, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 shrink-0">✓</Badge>
                    <span className="text-sm">{standard}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Commitment Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Commitment to Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Imperialpedia, we understand that financial information must be accurate and reliable. 
                Our editorial team follows strict guidelines to ensure:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Information is sourced from reputable institutions and verified data sources</li>
                <li>Complex topics are explained in clear, accessible language</li>
                <li>Content is regularly reviewed and updated to maintain accuracy</li>
                <li>Any errors are promptly corrected with full transparency</li>
              </ul>
              <p>
                We maintain strict editorial independence. Our content is never influenced by advertisers 
                or external parties. We clearly label all sponsored content and affiliate relationships.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We welcome feedback, corrections, and suggestions from our readers. 
                Your input helps us improve our content and better serve our global audience.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium">Editorial Inquiries</p>
                <a href="mailto:editorial@imperialpedia.com" className="text-primary hover:underline">
                  editorial@imperialpedia.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default About;
