import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Users, Eye, BarChart3, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const MODULES = [
  { path: '/enterprise/roles', label: 'Roles & Permissions', icon: Shield, description: 'Manage RBAC, assign roles, configure granular permissions', color: 'text-blue-500' },
  { path: '/enterprise/workflow', label: 'Content Workflow', icon: FileText, description: 'Editorial pipeline with multi-stage review and versioning', color: 'text-green-500' },
  { path: '/enterprise/users', label: 'User Management', icon: Users, description: 'View users, assign roles, manage memberships', color: 'text-purple-500' },
  { path: '/enterprise/audit', label: 'Audit Logs', icon: Eye, description: 'Track every admin action for compliance and security', color: 'text-orange-500' },
  { path: '/enterprise/analytics', label: 'Analytics Engine', icon: BarChart3, description: 'Article metrics, revenue, author performance', color: 'text-cyan-500' },
  { path: '/enterprise/monetization', label: 'Monetization', icon: Zap, description: 'Ads, affiliates, subscriptions, and revenue control', color: 'text-yellow-500' },
];

export default function EnterpriseDashboard() {
  return (
    <EnterpriseLayout title="Enterprise Console" description="Centralized control center for ImperialPedia infrastructure.">
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
    </EnterpriseLayout>
  );
}
