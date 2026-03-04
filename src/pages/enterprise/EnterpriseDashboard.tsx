import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Users, Eye, BarChart3, Zap, Globe, Link2, Search, Building, UserCheck, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { seoService, SEOMetrics } from '@/services/seoService';

const MODULES = [
  { path: '/enterprise/roles', label: 'Roles & Permissions', icon: Shield, description: 'Manage RBAC, assign roles, configure granular permissions', color: 'text-blue-500' },
  { path: '/enterprise/workflow', label: 'Content Workflow', icon: FileText, description: 'Editorial pipeline with multi-stage review and versioning', color: 'text-green-500' },
  { path: '/enterprise/authors', label: 'Author Management', icon: UserCheck, description: 'Manage author profiles, credentials, and reviewer status', color: 'text-purple-500' },
  { path: '/enterprise/audit', label: 'Audit Logs', icon: Eye, description: 'Track every admin action for compliance and security', color: 'text-orange-500' },
  { path: '/enterprise/seo', label: 'SEO & Content Authority', icon: Globe, description: 'SEO auditing, meta health, internal linking, sitemap', color: 'text-emerald-500' },
  { path: '/enterprise/global-seo', label: 'Global SEO Settings', icon: Settings, description: 'Meta templates, OG defaults, organization schema', color: 'text-teal-500' },
  { path: '/enterprise/category-seo', label: 'Category SEO', icon: Search, description: 'Pillar content, meta fields, and FAQ for categories', color: 'text-cyan-500' },
  { path: '/enterprise/auto-links', label: 'Auto Internal Linking', icon: Link2, description: 'Configure auto-linking keywords for internal link building', color: 'text-indigo-500' },
  { path: '/enterprise/org-settings', label: 'Organization Settings', icon: Building, description: 'Structured data, branding, and organization info', color: 'text-amber-500' },
  { path: '/enterprise/monetization', label: 'Monetization', icon: Zap, description: 'Ads, affiliates, subscriptions, and revenue control', color: 'text-yellow-500' },
  { path: '/enterprise/analytics', label: 'Analytics Engine', icon: BarChart3, description: 'Article metrics, revenue, author performance', color: 'text-rose-500' },
];

export default function EnterpriseDashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);

  useEffect(() => {
    seoService.getMetrics().then(setMetrics).catch(() => {});
  }, []);

  return (
    <EnterpriseLayout title="Enterprise Console" description="Centralized control center for ImperialPedia infrastructure.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => (
            <Link key={mod.path} to={mod.path}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <mod.icon className={`h-5 w-5 ${mod.color}`} />
                    {mod.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{mod.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {metrics && (
          <>
            <h2 className="text-lg font-semibold mt-4">Content & SEO Health</h2>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Card><CardContent className="pt-4 pb-4"><p className="text-xs text-muted-foreground">Total Articles</p><p className="text-2xl font-bold">{metrics.totalArticles}</p></CardContent></Card>
              <Card><CardContent className="pt-4 pb-4"><p className="text-xs text-muted-foreground">Published</p><p className="text-2xl font-bold text-accent">{metrics.publishedCount}</p></CardContent></Card>
              <Card><CardContent className="pt-4 pb-4"><p className="text-xs text-muted-foreground">Avg Word Count</p><p className="text-2xl font-bold">{metrics.averageWordCount}</p></CardContent></Card>
              <Card><CardContent className="pt-4 pb-4"><p className="text-xs text-muted-foreground">SEO Health</p><p className={`text-2xl font-bold ${metrics.linkingHealthScore >= 80 ? 'text-accent' : 'text-destructive'}`}>{metrics.linkingHealthScore}%</p></CardContent></Card>
            </div>
          </>
        )}
      </div>
    </EnterpriseLayout>
  );
}
