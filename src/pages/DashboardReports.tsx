import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Plus } from 'lucide-react';

const DashboardReports = () => {
  const reports = [
    { id: '1', title: 'Q4 2023 Performance Summary', date: '2024-01-15', type: 'Quarterly', status: 'ready' as const },
    { id: '2', title: 'Tax Loss Harvesting Report', date: '2024-01-10', type: 'Tax', status: 'ready' as const },
    { id: '3', title: 'Annual Portfolio Review', date: '2024-01-05', type: 'Annual', status: 'generating' as const },
    { id: '4', title: 'Risk Assessment Report', date: '2024-01-01', type: 'Risk', status: 'scheduled' as const }
  ];

  const stats = [
    { label: 'Total Reports', value: 24 },
    { label: 'Generated This Month', value: 8 },
    { label: 'Scheduled', value: 3 },
    { label: 'Storage Used', value: '45 MB' }
  ];

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Generate, schedule, and download your financial reports"
      stats={stats}
      reports={reports}
      showDateFilter={true}
      showExport={true}
      seoTitle="Reports Dashboard - Imperialpedia"
      seoDescription="Generate and manage your financial reports. Create custom reports, schedule automated generation, and download historical data."
    >
      {/* Report Templates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Templates
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Performance Summary', description: 'Returns, benchmarks, and key metrics', icon: '📊' },
              { name: 'Tax Report', description: 'Gains, losses, and tax implications', icon: '📋' },
              { name: 'Dividend Report', description: 'Income, yields, and projections', icon: '💰' },
              { name: 'Risk Analysis', description: 'Volatility, exposure, and stress tests', icon: '⚠️' }
            ].map((template, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Generate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === 'ready' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {report.status === 'generating' && (
                    <Badge variant="secondary">Generating...</Badge>
                  )}
                  {report.status === 'scheduled' && (
                    <Badge variant="outline">Scheduled</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardReports;
