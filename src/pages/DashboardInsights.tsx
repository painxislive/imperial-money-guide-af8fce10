import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

const DashboardInsights = () => {
  const stats = [
    { label: 'Portfolio Value', value: '$124,500', change: 12.5, changeLabel: 'vs last month', icon: <TrendingUp className="h-5 w-5" /> },
    { label: 'Total Returns', value: '+18.3%', change: 3.2, changeLabel: 'vs benchmark', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Dividend Income', value: '$1,250', change: 5.8, changeLabel: 'this quarter', icon: <PieChart className="h-5 w-5" /> },
    { label: 'Win Rate', value: '68%', change: 2, changeLabel: 'vs last quarter' }
  ];

  return (
    <DashboardLayout
      title="Insights Dashboard"
      subtitle="Your personalized financial insights and analytics"
      stats={stats}
      showDateFilter={true}
      showExport={true}
      seoTitle="Insights Dashboard - Imperialpedia"
      seoDescription="View your personalized financial insights, portfolio performance, and investment analytics."
    >
      {/* Additional Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="font-medium text-primary">Strong Performance</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your portfolio has outperformed the S&P 500 by 3.2% this quarter, 
                primarily driven by your tech holdings.
              </p>
            </div>
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <p className="font-medium text-warning">Rebalancing Suggested</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your equity allocation has drifted 8% above target. Consider rebalancing 
                to maintain your risk profile.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">Upcoming Dividends</p>
              <p className="text-sm text-muted-foreground mt-1">
                Expected dividend payments of $320 from 4 positions in the next 30 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardInsights;
