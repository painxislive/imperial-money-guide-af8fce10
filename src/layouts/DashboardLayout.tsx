import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  status?: 'ready' | 'generating' | 'scheduled';
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  stats?: StatCard[];
  reports?: Report[];
  showDateFilter?: boolean;
  showExport?: boolean;
  children?: React.ReactNode;
  seoTitle: string;
  seoDescription: string;
}

const defaultStats: StatCard[] = [
  { label: 'Portfolio Value', value: '$124,500', change: 12.5, changeLabel: 'vs last month', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'Total Returns', value: '+18.3%', change: 3.2, changeLabel: 'vs benchmark', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Active Positions', value: 12, icon: <FileText className="h-5 w-5" /> },
  { label: 'Alerts Triggered', value: 3, change: -2, changeLabel: 'vs last week', icon: <RefreshCw className="h-5 w-5" /> }
];

const defaultReports: Report[] = [
  { id: '1', title: 'Monthly Portfolio Summary', date: '2024-01-15', type: 'Portfolio', status: 'ready' },
  { id: '2', title: 'Risk Analysis Report', date: '2024-01-10', type: 'Risk', status: 'ready' },
  { id: '3', title: 'Tax Optimization Review', date: '2024-01-05', type: 'Tax', status: 'generating' },
  { id: '4', title: 'Performance Attribution', date: '2024-01-01', type: 'Performance', status: 'scheduled' }
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  stats = defaultStats,
  reports = defaultReports,
  showDateFilter = true,
  showExport = true,
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

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-muted-foreground text-sm">{subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {showDateFilter && (
                  <Select defaultValue="30d">
                    <SelectTrigger className="w-40">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                {showExport && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      {stat.change !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                          {stat.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={cn(
                            "text-sm font-medium",
                            stat.change >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {stat.change >= 0 ? '+' : ''}{stat.change}%
                          </span>
                          {stat.changeLabel && (
                            <span className="text-xs text-muted-foreground">
                              {stat.changeLabel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {stat.icon && (
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {stat.icon}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Chart visualization will appear here</p>
                      <p className="text-sm">Connect data sources to view analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Content */}
              {children}
            </div>

            {/* Sidebar - Reports */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Saved Reports</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div 
                        key={report.id}
                        className="flex items-start justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{report.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {report.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {report.date}
                            </span>
                          </div>
                        </div>
                        {report.status === 'ready' && (
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {report.status === 'generating' && (
                          <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
                        )}
                        {report.status === 'scheduled' && (
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate New Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
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

export default DashboardLayout;
