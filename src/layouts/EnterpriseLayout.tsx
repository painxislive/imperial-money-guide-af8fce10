import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, Users, FileText, Settings, Activity, 
  Eye, Lock, BarChart3, Flag, Zap, ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnterpriseLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const NAV_ITEMS = [
  { path: '/enterprise', label: 'Overview', icon: LayoutDashboard },
  { path: '/enterprise/roles', label: 'Roles & Permissions', icon: Shield },
  { path: '/enterprise/workflow', label: 'Content Workflow', icon: FileText },
  { path: '/enterprise/audit', label: 'Audit Logs', icon: Eye },
  { path: '/enterprise/users', label: 'User Management', icon: Users },
  { path: '/enterprise/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/enterprise/monetization', label: 'Monetization', icon: Zap },
  { path: '/enterprise/seo', label: 'SEO Control', icon: Activity },
  { path: '/enterprise/security', label: 'Security', icon: Lock },
  { path: '/enterprise/feature-flags', label: 'Feature Flags', icon: Flag },
  { path: '/enterprise/system', label: 'System Settings', icon: Settings },
];

export default function EnterpriseLayout({ children, title, description }: EnterpriseLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ImperialPedia
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Enterprise Console</span>
          </div>
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5">
            ← Back to Admin
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-49px)] border-r border-border bg-card/50 p-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
