import React from 'react';
import { ExperimentalLayout } from '@/layouts/ExperimentalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Sparkles, Zap, Globe } from 'lucide-react';

const Labs = () => {
  const features = [
    'AI-powered market anomaly detection',
    'Natural language portfolio queries',
    'Automated research summarization',
    'Cross-market correlation finder',
    'Sentiment-based alert triggers',
    'Predictive cash flow modeling'
  ];

  const experiments = [
    {
      name: 'Voice Portfolio Assistant',
      status: 'alpha',
      description: 'Control your portfolio with natural voice commands',
      icon: <Zap className="h-5 w-5" />
    },
    {
      name: 'Global Market Scanner',
      status: 'beta',
      description: 'Scan 50+ global markets for opportunities',
      icon: <Globe className="h-5 w-5" />
    },
    {
      name: 'AI Trade Copilot',
      status: 'labs',
      description: 'AI-assisted trade planning and execution',
      icon: <Sparkles className="h-5 w-5" />
    }
  ];

  return (
    <ExperimentalLayout
      title="Imperialpedia Labs"
      subtitle="Where Innovation Happens"
      description="Explore cutting-edge experiments and prototypes. These features are in active development and may change significantly."
      status="labs"
      accessType="invite-only"
      features={features}
      seoTitle="Labs - Imperialpedia"
      seoDescription="Explore experimental features and prototypes in Imperialpedia Labs. Get a glimpse of the future of financial technology."
    >
      {/* Active Experiments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Active Experiments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experiments.map((exp, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {exp.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{exp.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={
                        exp.status === 'alpha' ? 'border-red-500/50 text-red-500' :
                        exp.status === 'beta' ? 'border-yellow-500/50 text-yellow-500' :
                        'border-purple-500/50 text-purple-500'
                      }
                    >
                      {exp.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ExperimentalLayout>
  );
};

export default Labs;
