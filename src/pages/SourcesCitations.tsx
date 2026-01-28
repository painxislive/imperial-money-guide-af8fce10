import React from 'react';
import { TrustLayout } from '@/layouts/TrustLayout';
import { BookOpen, Link, Database, Quote } from 'lucide-react';

const SourcesCitations = () => {
  const sections = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Our Research Standards',
      content: `Every claim and statistic on Imperialpedia is backed by credible sources. 
        We prioritize peer-reviewed research, official government data, and reports from 
        established financial institutions. Our editorial team verifies all sources 
        before publication.`
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: 'Primary Data Sources',
      content: (
        <div className="space-y-4">
          <p>We rely on authoritative data providers for financial information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Government Sources:</strong> SEC, Federal Reserve, Treasury, BLS</li>
            <li><strong>Financial Data:</strong> Bloomberg, Reuters, S&P Global</li>
            <li><strong>Academic Research:</strong> NBER, SSRN, peer-reviewed journals</li>
            <li><strong>Industry Reports:</strong> Morningstar, Fitch, Moody's</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Link className="h-5 w-5" />,
      title: 'Citation Format',
      content: `All articles include inline citations linked to original sources. We use 
        a standardized citation format that includes the source name, publication date, 
        and direct link when available. Readers can verify any claim by following our 
        source links.`
    },
    {
      icon: <Quote className="h-5 w-5" />,
      title: 'Expert Quotes',
      content: `When we quote financial experts or industry professionals, we verify their 
        credentials and the context of their statements. Direct quotes are attributed 
        with the expert's name, title, organization, and date of the statement.`
    }
  ];

  const timeline = [
    { date: 'Jan 2024', title: 'Source Audit', description: '500+ links verified', type: 'verification' as const },
    { date: 'Dec 2023', title: 'New Data Partnership', description: 'Added S&P Global data', type: 'update' as const },
    { date: 'Nov 2023', title: 'Citation Update', description: 'Enhanced citation format', type: 'update' as const },
  ];

  return (
    <TrustLayout
      title="Sources & Citations"
      subtitle="Research Integrity and Transparency"
      description="Learn about our commitment to source verification and how we ensure the accuracy of information on Imperialpedia."
      sections={sections}
      timeline={timeline}
      lastUpdated="January 20, 2024"
      seoTitle="Sources & Citations - Imperialpedia"
      seoDescription="Discover how Imperialpedia ensures accuracy through rigorous source verification and transparent citations."
    />
  );
};

export default SourcesCitations;
