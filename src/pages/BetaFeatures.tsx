import React from 'react';
import { ExperimentalLayout } from '@/layouts/ExperimentalLayout';

const BetaFeatures = () => {
  const features = [
    'Real-time portfolio sync with major brokerages',
    'Advanced backtesting engine for strategy validation',
    'Custom alert rules with AI-powered triggers',
    'Social trading signals from verified traders',
    'Multi-currency portfolio tracking',
    'Tax-loss harvesting automation'
  ];

  return (
    <ExperimentalLayout
      title="Beta Features"
      subtitle="Early Access to Next-Gen Tools"
      description="Get exclusive access to experimental features before they're released to the public. Help shape the future of Imperialpedia."
      status="beta"
      accessType="waitlist"
      waitlistCount={2450}
      expectedRelease="Q2 2024"
      features={features}
      seoTitle="Beta Features - Imperialpedia"
      seoDescription="Get early access to experimental features on Imperialpedia. Join the beta program and help shape our next-generation financial tools."
    />
  );
};

export default BetaFeatures;
