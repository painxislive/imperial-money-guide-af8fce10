import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, TrendingUp, BarChart3, Shield, Zap } from 'lucide-react';
import { SEO } from '@/utils/seo';

export const Premium: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: TrendingUp,
      title: 'Advanced Market Analysis',
      description: 'Deep-dive technical analysis and market predictions from our expert team.'
    },
    {
      icon: BarChart3,
      title: 'Exclusive Trading Signals',
      description: 'Real-time buy/sell signals for crypto and traditional markets.'
    },
    {
      icon: Shield,
      title: 'Risk Management Tools',
      description: 'Portfolio optimization and risk assessment calculators.'
    },
    {
      icon: Zap,
      title: 'Breaking News Alerts',
      description: 'Instant notifications for market-moving events before they hit mainstream media.'
    }
  ];

  const plans = [
    {
      name: 'Monthly',
      price: 29,
      period: 'month',
      savings: null
    },
    {
      name: 'Annual',
      price: 290,
      period: 'year',
      savings: '17% off'
    }
  ];

  return (
    <>
      <SEO
        title="Premium Analysis & Trading Signals - Finance Hub"
        description="Access exclusive market analysis, trading signals, and advanced financial tools. Join thousands of successful traders with our premium subscription."
        keywords="premium trading signals, market analysis, crypto signals, investment research, financial tools"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Premium Analysis
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock exclusive market insights, trading signals, and advanced tools used by professional traders.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                10,000+ Active Subscribers
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                94% Success Rate
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                Cancel Anytime
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                  {plan.savings && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      {plan.savings}
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold">${plan.price}</div>
                      <div className="text-muted-foreground">per {plan.period}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">All premium features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Daily market analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Real-time alerts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Portfolio tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Priority support</span>
                      </div>
                    </div>
                    <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                      {user ? 'Upgrade Now' : 'Sign Up & Subscribe'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 space-y-4">
            <h3 className="text-2xl font-bold">Ready to Level Up Your Trading?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of successful traders who trust our analysis to make informed investment decisions.
            </p>
            {!user && (
              <div className="space-y-2">
                <Button size="lg" asChild>
                  <a href="/signup">Start Free Trial</a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  7-day free trial • No credit card required
                </p>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-16 border-t">
            <div className="text-center space-y-8">
              <h4 className="text-lg font-semibold">Trusted by Leading Traders</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm">Active Users</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">$50M+</div>
                  <div className="text-sm">Portfolio Value</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Market Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};