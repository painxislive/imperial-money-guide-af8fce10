import React from 'react';
import { PremiumLayout } from '@/layouts/PremiumLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, BarChart3, Brain, FileText } from 'lucide-react';

const PremiumTools = () => {
  const premiumTools = [
    {
      icon: <Calculator className="h-8 w-8" />,
      title: 'Advanced Financial Calculators',
      description: 'Access our complete suite of 20+ professional-grade calculators including Monte Carlo simulations, options pricing, and portfolio optimization tools.',
      features: ['Monte Carlo Simulator', 'Black-Scholes Calculator', 'Portfolio Optimizer', 'Risk Analytics']
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Analysis',
      description: 'Get intelligent insights and recommendations powered by machine learning models trained on decades of financial data.',
      features: ['Market Sentiment Analysis', 'Trend Prediction', 'Anomaly Detection', 'Smart Alerts']
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Professional Reports',
      description: 'Generate white-label reports for clients or personal use with customizable templates and branding options.',
      features: ['Custom Branding', 'PDF Export', 'Excel Export', 'Scheduled Reports']
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Research Library',
      description: 'Unlimited access to our comprehensive library of in-depth research articles, market analysis, and investment guides.',
      features: ['Daily Market Briefs', 'Sector Analysis', 'Company Deep Dives', 'Strategy Guides']
    }
  ];

  return (
    <PremiumLayout
      title="Premium Tools & Features"
      subtitle="PREMIUM ACCESS"
      description="Unlock the full potential of Imperialpedia with our premium tools designed for serious investors."
      tiers={[]}
      featureComparison={[]}
      showTrustSignals={true}
      seoTitle="Premium Tools - Imperialpedia"
      seoDescription="Access advanced financial calculators, AI-powered analysis, professional reports, and unlimited research with Imperialpedia Premium."
    >
      <section className="container mx-auto px-4 py-8 -mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {tool.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, fIndex) => (
                      <span 
                        key={fIndex}
                        className="text-xs px-2 py-1 bg-muted rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PremiumLayout>
  );
};

export default PremiumTools;
