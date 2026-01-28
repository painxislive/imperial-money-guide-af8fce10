import React from 'react';
import { PremiumLayout } from '@/layouts/PremiumLayout';

const Pricing = () => {
  const tiers = [
    {
      name: 'Starter',
      price: 0,
      description: 'Essential tools for individual investors',
      features: [
        'Basic calculators',
        '10 articles per month',
        'Community forums',
        'Email newsletter',
        'Basic market data'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Premium',
      price: 29,
      period: 'month',
      description: 'Advanced tools for serious investors',
      features: [
        'All Starter features',
        'Unlimited articles',
        'Advanced calculators',
        'AI-powered insights',
        'Custom alerts (10)',
        'Portfolio tracking (5)',
        'Priority email support'
      ],
      highlighted: true,
      buttonText: 'Start 7-Day Trial',
      badge: 'Most Popular'
    },
    {
      name: 'Professional',
      price: 99,
      period: 'month',
      description: 'Complete suite for financial professionals',
      features: [
        'All Premium features',
        'API access',
        'White-label reports',
        'Unlimited portfolios',
        'Unlimited alerts',
        'Dedicated support',
        'Custom integrations',
        'Team collaboration'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const
    }
  ];

  const comparison = [
    { name: 'Basic Calculators', free: true, premium: true, pro: true },
    { name: 'Advanced Calculators', free: false, premium: true, pro: true },
    { name: 'AI Insights', free: false, premium: true, pro: true },
    { name: 'Articles per Month', free: '10', premium: 'Unlimited', pro: 'Unlimited' },
    { name: 'Portfolio Tracking', free: false, premium: '5 portfolios', pro: 'Unlimited' },
    { name: 'Custom Alerts', free: false, premium: '10 alerts', pro: 'Unlimited' },
    { name: 'API Access', free: false, premium: false, pro: true },
    { name: 'White-label Reports', free: false, premium: false, pro: true },
    { name: 'Support', free: 'Community', premium: 'Priority', pro: 'Dedicated' }
  ];

  return (
    <PremiumLayout
      title="Simple, Transparent Pricing"
      subtitle="PRICING PLANS"
      description="Choose the plan that fits your investment journey. No hidden fees, cancel anytime."
      tiers={tiers}
      featureComparison={comparison}
      showTrustSignals={true}
      seoTitle="Pricing - Imperialpedia | Finance Tools & Analysis"
      seoDescription="Choose from our flexible pricing plans. Get access to advanced financial calculators, AI insights, and professional investment tools."
    />
  );
};

export default Pricing;
