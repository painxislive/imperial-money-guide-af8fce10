import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  FlaskConical, 
  Sparkles, 
  Lock,
  AlertTriangle,
  ArrowRight,
  Users,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperimentalLayoutProps {
  title: string;
  subtitle?: string;
  description: string;
  status?: 'alpha' | 'beta' | 'labs' | 'preview';
  accessType?: 'public' | 'invite-only' | 'waitlist';
  waitlistCount?: number;
  expectedRelease?: string;
  features?: string[];
  children?: React.ReactNode;
  seoTitle: string;
  seoDescription: string;
}

const statusConfig = {
  alpha: { label: 'Alpha', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  beta: { label: 'Beta', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  labs: { label: 'Labs', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  preview: { label: 'Preview', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
};

export const ExperimentalLayout: React.FC<ExperimentalLayoutProps> = ({
  title,
  subtitle,
  description,
  status = 'beta',
  accessType = 'public',
  waitlistCount,
  expectedRelease,
  features = [],
  children,
  seoTitle,
  seoDescription
}) => {
  const statusInfo = statusConfig[status];

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="relative overflow-hidden border-b">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.1),transparent_50%)]" />
          
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              {/* Status Badges */}
              <div className="flex items-center gap-3 mb-4">
                <Badge className={cn("border", statusInfo.color)}>
                  <FlaskConical className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                {accessType === 'invite-only' && (
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Invite Only
                  </Badge>
                )}
                {accessType === 'waitlist' && (
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    Waitlist
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl text-primary font-medium mb-2">
                  {subtitle}
                </p>
              )}
              <p className="text-lg text-muted-foreground mb-6">
                {description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                {waitlistCount && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{waitlistCount.toLocaleString()} on waitlist</span>
                  </div>
                )}
                {expectedRelease && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Expected: {expectedRelease}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          {/* Experimental Warning */}
          <Alert className="mb-8 border-warning/50 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Experimental Feature</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This feature is still in {status} and may change significantly. 
              Your feedback helps shape its development.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {children || (
                <Card>
                  <CardContent className="py-16 text-center">
                    <FlaskConical className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This experimental feature is currently in development. 
                      Join the waitlist to get early access.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Access Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Get Early Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Be among the first to try this feature and help shape its development.
                  </p>
                  <Button className="w-full">
                    {accessType === 'waitlist' ? 'Join Waitlist' : 'Request Access'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Features */}
              {features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Planned Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Feedback Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your feedback is invaluable in shaping this feature.
                  </p>
                  <Button variant="outline" className="w-full">
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExperimentalLayout;
