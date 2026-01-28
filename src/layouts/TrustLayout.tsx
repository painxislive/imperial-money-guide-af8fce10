import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileCheck, 
  Clock, 
  Users, 
  Scale,
  AlertTriangle,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  type?: 'update' | 'review' | 'verification' | 'disclosure';
}

interface ComplianceSection {
  icon: React.ReactNode;
  title: string;
  content: string | React.ReactNode;
}

interface TrustLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  timeline?: TimelineItem[];
  sections?: ComplianceSection[];
  showVerificationBadge?: boolean;
  lastUpdated?: string;
  children?: React.ReactNode;
  seoTitle: string;
  seoDescription: string;
}

const getTimelineIcon = (type?: string) => {
  switch (type) {
    case 'update':
      return <Clock className="h-4 w-4" />;
    case 'review':
      return <FileCheck className="h-4 w-4" />;
    case 'verification':
      return <CheckCircle className="h-4 w-4" />;
    case 'disclosure':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const TrustLayout: React.FC<TrustLayoutProps> = ({
  title,
  subtitle,
  description,
  timeline = [],
  sections = [],
  showVerificationBadge = true,
  lastUpdated,
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
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              {showVerificationBadge && (
                <Badge variant="outline" className="mb-4 text-primary border-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified & Compliant
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {subtitle}
              </p>
              <p className="text-muted-foreground">
                {description}
              </p>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground mt-4">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Sections */}
              {sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {section.icon}
                      </div>
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

            {/* Sidebar - Timeline */}
            <div className="lg:col-span-1">
              {timeline.length > 0 && (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Update History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                      <div className="space-y-6">
                        {timeline.map((item, index) => (
                          <div key={index} className="relative pl-8">
                            <div className={cn(
                              "absolute left-0 top-0 p-1.5 rounded-full bg-background border-2",
                              item.type === 'verification' ? 'border-primary text-primary' :
                              item.type === 'disclosure' ? 'border-warning text-warning' :
                              'border-muted-foreground text-muted-foreground'
                            )}>
                              {getTimelineIcon(item.type)}
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">
                                {item.date}
                              </span>
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trust Indicators */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Our Commitment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Editorial Independence</h4>
                      <p className="text-xs text-muted-foreground">
                        Our content is never influenced by advertisers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Fact-Checked</h4>
                      <p className="text-xs text-muted-foreground">
                        All content reviewed by financial experts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Transparent Sources</h4>
                      <p className="text-xs text-muted-foreground">
                        We cite all research and data sources
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrustLayout;
