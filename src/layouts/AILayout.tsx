import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Sparkles, 
  Brain, 
  Lightbulb, 
  Info,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISection {
  title: string;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface ScenarioComparison {
  name: string;
  values: Record<string, string | number>;
  highlighted?: boolean;
}

interface AILayoutProps {
  title: string;
  subtitle?: string;
  description: string;
  sections?: AISection[];
  scenarios?: ScenarioComparison[];
  scenarioColumns?: string[];
  showDisclaimer?: boolean;
  disclaimerText?: string;
  showAIBadge?: boolean;
  children?: React.ReactNode;
  seoTitle: string;
  seoDescription: string;
}

const defaultSections: AISection[] = [
  {
    title: 'What This Means',
    content: 'This section explains the key insights and takeaways from the analysis in plain language.',
    icon: <Lightbulb className="h-5 w-5" />
  },
  {
    title: 'How It Works',
    content: 'Understanding the methodology behind the calculations and AI-assisted analysis.',
    icon: <Brain className="h-5 w-5" />
  },
  {
    title: 'Use Cases',
    content: 'Practical scenarios where this analysis can help you make better financial decisions.',
    icon: <BarChart3 className="h-5 w-5" />
  }
];

export const AILayout: React.FC<AILayoutProps> = ({
  title,
  subtitle,
  description,
  sections = defaultSections,
  scenarios = [],
  scenarioColumns = [],
  showDisclaimer = true,
  disclaimerText = 'AI-generated insights are for informational purposes only and should not be considered financial advice. Always consult with a qualified financial advisor before making investment decisions.',
  showAIBadge = true,
  children,
  seoTitle,
  seoDescription
}) => {
  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              {showAIBadge && (
                <Badge className="mb-4 bg-gradient-to-r from-primary to-primary/70">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Insights
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl text-primary font-medium mb-2">
                  {subtitle}
                </p>
              )}
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          {/* Disclaimer */}
          {showDisclaimer && (
            <Alert className="mb-8 border-warning/50 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-warning">Disclaimer</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                {disclaimerText}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Insight Sections */}
              {sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {section.icon && (
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {section.icon}
                        </div>
                      )}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                    {typeof section.content === 'string' ? (
                      <p>{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Custom Content */}
              {children}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Scenario Comparison */}
              {scenarios.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Scenario Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scenarios.map((scenario, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "p-4 rounded-lg border transition-colors",
                            scenario.highlighted 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{scenario.name}</h4>
                            {scenario.highlighted && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            {scenarioColumns.map((col) => (
                              <div key={col} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{col}</span>
                                <span className="font-medium">{scenario.values[col]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Info Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI models analyze thousands of data points to provide 
                        insights tailored to your specific scenario.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['Risk Calculator', 'Scenario Planner', 'Portfolio Optimizer'].map((tool, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <span className="text-sm">{tool}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AILayout;
