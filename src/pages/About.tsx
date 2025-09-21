import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Shield, Award } from 'lucide-react';
import { SEO } from '@/utils/seo';

export const About: React.FC = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Investment Officer',
      bio: 'Former Goldman Sachs analyst with 15+ years in financial markets. Expert in crypto and traditional asset analysis.',
      credentials: ['CFA', 'MBA Finance']
    },
    {
      name: 'Michael Chen',
      role: 'Head of Research',
      bio: 'Ex-Morgan Stanley trader specializing in algorithmic trading and market microstructure.',
      credentials: ['PhD Economics', 'FRM']
    },
    {
      name: 'Emily Rodriguez',
      role: 'Senior Market Analyst',
      bio: 'Economics PhD from Harvard with expertise in macroeconomic trends and cryptocurrency markets.',
      credentials: ['PhD Economics', 'CFA Level III']
    }
  ];

  const values = [
    {
      icon: TrendingUp,
      title: 'Data-Driven Analysis',
      description: 'All our insights are backed by rigorous quantitative analysis and market research.'
    },
    {
      icon: Shield,
      title: 'Transparent & Ethical',
      description: 'We maintain the highest standards of financial journalism and clearly disclose all potential conflicts.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our mission is to democratize financial knowledge and empower individual investors.'
    },
    {
      icon: Award,
      title: 'Expert Authority',
      description: 'Our team consists of certified professionals with decades of combined Wall Street experience.'
    }
  ];

  return (
    <>
      <SEO
        title="About Us - Expert Financial Analysis & Market Insights"
        description="Learn about our team of financial experts, our mission to democratize investment knowledge, and our commitment to transparent, data-driven market analysis."
        keywords="financial experts, investment team, market analysis, trading professionals, finance education"
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold">About Finance Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're a team of financial professionals dedicated to providing institutional-quality research 
            and analysis to individual investors worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg">
                To democratize access to professional-grade financial analysis and market insights, 
                empowering individual investors to make informed decisions in today's complex markets.
              </p>
              <p className="text-muted-foreground">
                Founded in 2020, we've grown from a small team of Wall Street veterans to a trusted 
                source of financial intelligence for over 100,000 investors worldwide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-center">{member.name}</CardTitle>
                  <p className="text-center text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {member.credentials.map((cred, credIndex) => (
                      <Badge key={credIndex} variant="secondary">{cred}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">By the Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <div className="text-sm text-muted-foreground">Active Readers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Years Combined Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Research Reports</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Market Coverage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Have questions about our research or want to discuss partnership opportunities?
              </p>
              <div className="space-y-2">
                <p><strong>Editorial:</strong> editorial@financehub.com</p>
                <p><strong>Business:</strong> partnerships@financehub.com</p>
                <p><strong>Support:</strong> support@financehub.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};