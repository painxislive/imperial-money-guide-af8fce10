import React from 'react';
import { AILayout } from '@/layouts/AILayout';
import { Lightbulb, Brain, BarChart3, TrendingUp } from 'lucide-react';

const AIInsights = () => {
  const sections = [
    {
      title: 'What This Means',
      content: (
        <div className="space-y-4">
          <p>
            Our AI has analyzed current market conditions and identified several key trends 
            that may impact your investment strategy:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Technology sector showing continued momentum with AI-related stocks leading gains</li>
            <li>Fixed income becoming more attractive as rate hike cycle nears completion</li>
            <li>Defensive sectors outperforming amid economic uncertainty signals</li>
            <li>International markets presenting value opportunities relative to US equities</li>
          </ul>
        </div>
      ),
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: 'How It Works',
      content: `Our AI models process millions of data points daily, including price movements, 
        volume patterns, sentiment indicators, and macroeconomic signals. Using advanced 
        machine learning techniques, we identify patterns and correlations that may not be 
        visible to traditional analysis methods.`,
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: 'Use Cases',
      content: (
        <div className="space-y-4">
          <p>These AI-powered insights can help you:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Identify potential entry and exit points for investments</li>
            <li>Understand broader market trends and sector rotations</li>
            <li>Validate your investment thesis with data-driven analysis</li>
            <li>Stay informed about emerging risks and opportunities</li>
          </ul>
        </div>
      ),
      icon: <BarChart3 className="h-5 w-5" />
    }
  ];

  const scenarios = [
    {
      name: 'Conservative',
      values: {
        'Expected Return': '6-8%',
        'Risk Level': 'Low',
        'Time Horizon': '5+ years'
      }
    },
    {
      name: 'Balanced',
      values: {
        'Expected Return': '8-12%',
        'Risk Level': 'Medium',
        'Time Horizon': '3-5 years'
      },
      highlighted: true
    },
    {
      name: 'Aggressive',
      values: {
        'Expected Return': '12-18%',
        'Risk Level': 'High',
        'Time Horizon': '1-3 years'
      }
    }
  ];

  return (
    <AILayout
      title="AI Market Insights"
      subtitle="January 2024 Analysis"
      description="AI-powered analysis of current market conditions and investment opportunities based on real-time data."
      sections={sections}
      scenarios={scenarios}
      scenarioColumns={['Expected Return', 'Risk Level', 'Time Horizon']}
      showDisclaimer={true}
      showAIBadge={true}
      seoTitle="AI Market Insights - Imperialpedia"
      seoDescription="Get AI-powered market insights and investment analysis. Our machine learning models analyze millions of data points to identify trends and opportunities."
    />
  );
};

export default AIInsights;
