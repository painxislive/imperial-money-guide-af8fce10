import React from 'react';
import { TrustLayout } from '@/layouts/TrustLayout';
import { Clock, FileCheck, Edit, Archive } from 'lucide-react';

const ArticleHistory = () => {
  const sections = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Our Update Policy',
      content: `Imperialpedia is committed to keeping our content accurate and up-to-date. 
        We regularly review and update articles to reflect the latest market conditions, 
        regulatory changes, and best practices. Every article displays its publication date 
        and last update timestamp for full transparency.`
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      title: 'Review Schedule',
      content: (
        <div className="space-y-4">
          <p>Our content is reviewed on a regular schedule based on topic sensitivity:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Market-sensitive content:</strong> Daily or real-time updates</li>
            <li><strong>Tax and regulatory guides:</strong> Reviewed with each legislative change</li>
            <li><strong>Educational content:</strong> Annual comprehensive review</li>
            <li><strong>Calculator tools:</strong> Quarterly validation and updates</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Edit className="h-5 w-5" />,
      title: 'Correction Policy',
      content: `When we identify errors in published content, we correct them promptly and 
        transparently. Minor corrections are noted inline, while significant corrections 
        include an editor's note explaining the change. We maintain a public log of 
        material corrections for accountability.`
    },
    {
      icon: <Archive className="h-5 w-5" />,
      title: 'Archive Access',
      content: `Historical versions of articles are preserved in our archive system. 
        Researchers and users can request access to previous versions of content for 
        reference purposes. This ensures transparency in how our content evolves over time.`
    }
  ];

  const timeline = [
    { date: 'Jan 28, 2024', title: 'Tax Guide Updated', description: '2024 tax brackets applied', type: 'update' as const },
    { date: 'Jan 20, 2024', title: 'Market Analysis Revised', description: 'Q4 data incorporated', type: 'update' as const },
    { date: 'Jan 15, 2024', title: 'Quarterly Review', description: '150+ articles reviewed', type: 'review' as const },
    { date: 'Jan 10, 2024', title: 'Correction Published', description: 'Bond yield calculation fixed', type: 'disclosure' as const },
    { date: 'Jan 5, 2024', title: 'New Guidelines', description: 'Updated style guide', type: 'update' as const },
  ];

  return (
    <TrustLayout
      title="Article Update History"
      subtitle="Transparency in Our Content Updates"
      description="Track how we maintain and update our content to ensure accuracy and relevance for our readers."
      sections={sections}
      timeline={timeline}
      lastUpdated="January 28, 2024"
      seoTitle="Article Update History - Imperialpedia"
      seoDescription="View our content update history and learn about our commitment to accurate, up-to-date financial information."
    />
  );
};

export default ArticleHistory;
