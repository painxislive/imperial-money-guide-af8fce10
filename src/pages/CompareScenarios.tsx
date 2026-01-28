import React from 'react';
import { AILayout } from '@/layouts/AILayout';
import { Lightbulb, GitCompare, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CompareScenarios = () => {
  const sections = [
    {
      title: 'Scenario Analysis',
      content: (
        <div className="space-y-4">
          <p>
            Compare multiple financial scenarios side-by-side to make informed decisions. 
            Our AI analyzes the trade-offs and highlights the key differences between your options.
          </p>
        </div>
      ),
      icon: <GitCompare className="h-5 w-5" />
    },
    {
      title: 'Key Insights',
      content: `Based on your scenarios, we've identified the critical factors that 
        differentiate each option. Consider your risk tolerance, time horizon, and 
        financial goals when evaluating these results.`,
      icon: <Lightbulb className="h-5 w-5" />
    }
  ];

  const scenarios = [
    {
      name: 'Scenario A: Conservative',
      values: {
        'Initial Investment': '$50,000',
        '10-Year Projection': '$82,000',
        'Annual Return': '5.1%',
        'Risk Score': '2/10'
      }
    },
    {
      name: 'Scenario B: Balanced',
      values: {
        'Initial Investment': '$50,000',
        '10-Year Projection': '$115,000',
        'Annual Return': '8.7%',
        'Risk Score': '5/10'
      },
      highlighted: true
    },
    {
      name: 'Scenario C: Growth',
      values: {
        'Initial Investment': '$50,000',
        '10-Year Projection': '$162,000',
        'Annual Return': '12.5%',
        'Risk Score': '8/10'
      }
    }
  ];

  return (
    <AILayout
      title="Compare Scenarios"
      subtitle="Side-by-Side Analysis"
      description="Evaluate multiple investment scenarios and understand the trade-offs between risk and return."
      sections={sections}
      scenarios={scenarios}
      scenarioColumns={['Initial Investment', '10-Year Projection', 'Annual Return', 'Risk Score']}
      showDisclaimer={true}
      showAIBadge={true}
      seoTitle="Compare Scenarios - Imperialpedia"
      seoDescription="Compare investment scenarios side-by-side with AI-powered analysis. Understand trade-offs between risk and return."
    >
      {/* Detailed Comparison Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Metric</th>
                  <th className="text-center py-3 font-semibold">Conservative</th>
                  <th className="text-center py-3 font-semibold bg-primary/5">Balanced</th>
                  <th className="text-center py-3 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Best Case (10yr)', '$95,000', '$145,000', '$220,000'],
                  ['Worst Case (10yr)', '$72,000', '$85,000', '$95,000'],
                  ['Volatility', 'Low', 'Medium', 'High'],
                  ['Drawdown Risk', '8%', '18%', '35%'],
                  ['Income Yield', '3.2%', '2.1%', '0.8%'],
                  ['Liquidity', 'High', 'High', 'Medium']
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="py-3">{row[0]}</td>
                    <td className="text-center py-3">{row[1]}</td>
                    <td className="text-center py-3 bg-primary/5">{row[2]}</td>
                    <td className="text-center py-3">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <Card className="mt-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">AI Recommendation</h4>
                <Badge>Based on typical investor profile</Badge>
              </div>
              <p className="text-muted-foreground">
                For a 10-year investment horizon with moderate risk tolerance, the 
                <strong> Balanced scenario</strong> offers the best risk-adjusted returns. 
                It provides meaningful growth potential while limiting downside exposure 
                during market corrections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AILayout>
  );
};

export default CompareScenarios;
