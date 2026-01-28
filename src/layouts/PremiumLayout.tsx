import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Zap, Crown, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTier {
  name: string;
  price: number | string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  badge?: string;
}

interface Feature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  pro: boolean | string;
}

interface PremiumLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  tiers?: PricingTier[];
  featureComparison?: Feature[];
  showTrustSignals?: boolean;
  children?: React.ReactNode;
  seoTitle: string;
  seoDescription: string;
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    description: 'Essential tools for getting started',
    features: [
      'Basic calculators',
      'Limited articles per month',
      'Community support',
      'Email newsletter'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline'
  },
  {
    name: 'Premium',
    price: 29,
    period: 'month',
    description: 'Advanced features for serious investors',
    features: [
      'All Free features',
      'Advanced calculators',
      'Unlimited articles',
      'Priority support',
      'Custom alerts',
      'Portfolio tracking'
    ],
    highlighted: true,
    buttonText: 'Start Premium',
    badge: 'Most Popular'
  },
  {
    name: 'Pro',
    price: 99,
    period: 'month',
    description: 'Complete suite for professionals',
    features: [
      'All Premium features',
      'API access',
      'White-label reports',
      'Dedicated account manager',
      'Custom integrations',
      'Enterprise analytics'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline'
  }
];

const defaultComparison: Feature[] = [
  { name: 'Basic Calculators', free: true, premium: true, pro: true },
  { name: 'Advanced Calculators', free: false, premium: true, pro: true },
  { name: 'AI Insights', free: false, premium: true, pro: true },
  { name: 'Portfolio Tracking', free: '1 portfolio', premium: '5 portfolios', pro: 'Unlimited' },
  { name: 'Export Reports', free: false, premium: 'PDF', pro: 'PDF, Excel, API' },
  { name: 'Custom Alerts', free: false, premium: '10 alerts', pro: 'Unlimited' },
  { name: 'API Access', free: false, premium: false, pro: true },
  { name: 'Support', free: 'Community', premium: 'Priority', pro: 'Dedicated' }
];

export const PremiumLayout: React.FC<PremiumLayoutProps> = ({
  title,
  subtitle,
  description,
  tiers = defaultTiers,
  featureComparison = defaultComparison,
  showTrustSignals = true,
  children,
  seoTitle,
  seoDescription
}) => {
  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                <Crown className="h-3 w-3 mr-1" />
                {subtitle}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <Card 
                key={index}
                className={cn(
                  "relative transition-all duration-300 hover:shadow-lg",
                  tier.highlighted && "ring-2 ring-primary shadow-lg scale-105"
                )}
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {tier.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-muted-foreground">/{tier.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.buttonVariant || 'default'}
                  >
                    {tier.buttonText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                    <th className="text-center py-4 px-4 font-semibold bg-primary/5">Premium</th>
                    <th className="text-center py-4 px-4 font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((feature, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 text-sm">{feature.name}</td>
                      {['free', 'premium', 'pro'].map((tier) => (
                        <td 
                          key={tier} 
                          className={cn(
                            "text-center py-4 px-4",
                            tier === 'premium' && "bg-primary/5"
                          )}
                        >
                          {typeof feature[tier as keyof Feature] === 'boolean' ? (
                            feature[tier as keyof Feature] ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-sm">{feature[tier as keyof Feature]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        {showTrustSignals && (
          <section className="py-16 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Bank-Level Security</h3>
                    <p className="text-sm text-muted-foreground">
                      256-bit encryption protects your data
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Cancel Anytime</h3>
                    <p className="text-sm text-muted-foreground">
                      No long-term contracts or hidden fees
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Instant Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Start using premium features immediately
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Custom Content */}
        {children}

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
              Join thousands of investors who trust Imperialpedia for their financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PremiumLayout;
