import React from 'react';
import { TrustLayout } from '@/layouts/TrustLayout';
import { Shield, Award, Users, BookOpen } from 'lucide-react';

const VerifiedAuthors = () => {
  const sections = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Our Verification Process',
      content: (
        <div className="space-y-4">
          <p>
            Every author on Imperialpedia undergoes a rigorous verification process to ensure 
            the highest standards of expertise and credibility.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Professional credentials verification (CFA, CFP, CPA, etc.)</li>
            <li>Employment and experience validation</li>
            <li>Background and reputation check</li>
            <li>Writing sample review by our editorial team</li>
            <li>Ongoing performance monitoring</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: 'Credential Requirements',
      content: (
        <div className="space-y-4">
          <p>
            Our authors hold recognized credentials in finance, economics, and related fields:
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">CFA</p>
              <p className="text-sm text-muted-foreground">Chartered Financial Analyst</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">CFP</p>
              <p className="text-sm text-muted-foreground">Certified Financial Planner</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">CPA</p>
              <p className="text-sm text-muted-foreground">Certified Public Accountant</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">MBA</p>
              <p className="text-sm text-muted-foreground">Master of Business Administration</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Editorial Standards',
      content: `All content published on Imperialpedia adheres to strict editorial guidelines. 
        Our team reviews every article for accuracy, clarity, and compliance with financial 
        regulations. We maintain separation between editorial content and advertising to 
        ensure unbiased information for our readers.`
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Continuous Education',
      content: `Our authors participate in ongoing education to stay current with market 
        developments, regulatory changes, and emerging financial products. We require 
        annual certification renewals and regular training on ethical reporting standards.`
    }
  ];

  const timeline = [
    { date: 'Jan 2024', title: 'New Author Onboarded', description: '3 new verified experts joined', type: 'verification' as const },
    { date: 'Dec 2023', title: 'Annual Review Complete', description: 'All credentials re-verified', type: 'review' as const },
    { date: 'Nov 2023', title: 'Standards Updated', description: 'Enhanced verification process', type: 'update' as const },
  ];

  return (
    <TrustLayout
      title="Verified Authors"
      subtitle="Expert Contributors You Can Trust"
      description="Learn about our rigorous author verification process and the credentials behind every article on Imperialpedia."
      sections={sections}
      timeline={timeline}
      lastUpdated="January 15, 2024"
      seoTitle="Verified Authors - Imperialpedia"
      seoDescription="Discover our author verification process. All Imperialpedia contributors are verified financial experts with recognized credentials."
    />
  );
};

export default VerifiedAuthors;
