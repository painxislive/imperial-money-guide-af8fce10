import React from 'react';
import { TrustLayout } from '@/layouts/TrustLayout';
import { AlertTriangle, DollarSign, Scale, Shield } from 'lucide-react';

const RiskDisclosures = () => {
  const sections = [
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Investment Risk Warning',
      content: (
        <div className="space-y-4">
          <p className="font-medium text-warning">
            All investments carry risk. Past performance does not guarantee future results.
          </p>
          <p>
            The information provided on Imperialpedia is for educational and informational 
            purposes only. It should not be considered investment advice, and we strongly 
            recommend consulting with a qualified financial advisor before making any 
            investment decisions.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may lose some or all of your invested capital</li>
            <li>Market conditions can change rapidly and unpredictably</li>
            <li>Historical data may not reflect future performance</li>
            <li>Leverage can amplify both gains and losses</li>
          </ul>
        </div>
      )
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: 'Affiliate & Advertising Disclosure',
      content: (
        <div className="space-y-4">
          <p>
            Imperialpedia may receive compensation from some financial products and 
            services mentioned on our site. This compensation may affect:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The order in which products appear on our pages</li>
            <li>Which products we choose to review</li>
            <li>The placement of promotional content</li>
          </ul>
          <p>
            However, our editorial content is never influenced by advertisers. We maintain 
            strict separation between our editorial and advertising teams to ensure 
            unbiased information for our readers.
          </p>
        </div>
      )
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: 'Regulatory Compliance',
      content: `Imperialpedia is not a registered investment advisor, broker-dealer, or 
        financial planning service. We do not provide personalized investment recommendations. 
        Our calculators and tools are designed for educational purposes and should not 
        replace professional financial advice.`
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Data & Privacy',
      content: `We take data security seriously. Financial calculations performed on our 
        platform are processed locally when possible and are not stored on our servers. 
        For detailed information about how we handle your data, please review our 
        Privacy Policy.`
    }
  ];

  const timeline = [
    { date: 'Jan 2024', title: 'Disclosure Updated', description: 'New affiliate partnerships added', type: 'disclosure' as const },
    { date: 'Dec 2023', title: 'Compliance Review', description: 'Annual regulatory review complete', type: 'review' as const },
    { date: 'Oct 2023', title: 'Risk Warnings Enhanced', description: 'Additional crypto warnings', type: 'update' as const },
  ];

  return (
    <TrustLayout
      title="Risk & Disclosures"
      subtitle="Important Information for Our Readers"
      description="Understand the risks associated with financial decisions and our disclosure policies regarding advertising and affiliate relationships."
      sections={sections}
      timeline={timeline}
      lastUpdated="January 15, 2024"
      seoTitle="Risk & Disclosures - Imperialpedia"
      seoDescription="Read important risk disclosures and understand our advertising and affiliate relationships on Imperialpedia."
    />
  );
};

export default RiskDisclosures;
