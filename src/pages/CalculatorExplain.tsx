import React from 'react';
import { useParams } from 'react-router-dom';
import { AILayout } from '@/layouts/AILayout';
import { Lightbulb, Calculator, Target, TrendingUp } from 'lucide-react';

const CalculatorExplain = () => {
  const { slug } = useParams<{ slug: string }>();

  // This would typically fetch calculator-specific data
  const calculatorName = slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Calculator';

  const sections = [
    {
      title: 'Understanding Your Results',
      content: (
        <div className="space-y-4">
          <p>
            The {calculatorName} has analyzed your inputs to provide these personalized insights. 
            Here's what the key metrics mean for your financial situation:
          </p>
          <div className="grid gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Primary Result</p>
              <p className="text-sm text-muted-foreground">
                This represents the main output of your calculation, taking into account 
                all the variables you've provided.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Confidence Range</p>
              <p className="text-sm text-muted-foreground">
                Results may vary within this range based on market conditions and 
                assumptions used in the model.
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: 'Methodology',
      content: `This calculator uses established financial formulas combined with AI-enhanced 
        adjustments based on current market conditions. The underlying model considers 
        historical data, statistical distributions, and real-time market indicators to 
        provide more accurate projections than static formulas alone.`,
      icon: <Calculator className="h-5 w-5" />
    },
    {
      title: 'Practical Applications',
      content: (
        <div className="space-y-4">
          <p>You can use these results to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Set realistic financial goals and timelines</li>
            <li>Compare different scenarios and strategies</li>
            <li>Identify key variables that most impact your outcomes</li>
            <li>Make more informed decisions about your financial future</li>
          </ul>
        </div>
      ),
      icon: <Target className="h-5 w-5" />
    }
  ];

  return (
    <AILayout
      title={`${calculatorName} Explained`}
      subtitle="AI-Powered Analysis"
      description={`Understand your ${calculatorName.toLowerCase()} results with AI-assisted explanations and actionable insights.`}
      sections={sections}
      showDisclaimer={true}
      showAIBadge={true}
      seoTitle={`${calculatorName} Explained - Imperialpedia`}
      seoDescription={`Get AI-powered explanations for your ${calculatorName.toLowerCase()} results. Understand the methodology and practical applications.`}
    />
  );
};

export default CalculatorExplain;
