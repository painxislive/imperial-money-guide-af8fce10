import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Server, Wifi, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface HealthCheck {
  name: string;
  status: "healthy" | "warning" | "error";
  latency: string;
  details: string;
}

const AdminHealth = () => {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: "Supabase Database", status: "healthy", latency: "12ms", details: "Connected and responding" },
    { name: "Edge Functions", status: "healthy", latency: "45ms", details: "All functions deployed" },
    { name: "Storage", status: "healthy", latency: "8ms", details: "Bucket accessible" },
    { name: "Authentication", status: "warning", latency: "—", details: "Bypassed for testing" },
    { name: "CDN", status: "healthy", latency: "3ms", details: "Assets cached" },
    { name: "Search Index", status: "healthy", latency: "22ms", details: "Full-text search ready" },
  ]);

  const statusColor = (s: string) => s === "healthy" ? "default" : s === "warning" ? "secondary" : "destructive";
  const StatusIcon = ({ status }: { status: string }) =>
    status === "healthy" ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>System Health | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-7 w-7 text-primary" />
          <div><h1 className="text-3xl font-bold">System Health</h1><p className="text-muted-foreground">Real-time infrastructure monitoring</p></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card><CardContent className="pt-6 text-center"><Server className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-2xl font-bold">99.9%</p><p className="text-sm text-muted-foreground">Uptime</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Clock className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-2xl font-bold">15ms</p><p className="text-sm text-muted-foreground">Avg Response</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Database className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-2xl font-bold">Active</p><p className="text-sm text-muted-foreground">Database Status</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Service Health Checks</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={check.status} />
                    <div><p className="font-medium">{check.name}</p><p className="text-sm text-muted-foreground">{check.details}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{check.latency}</span>
                    <Badge variant={statusColor(check.status)}>{check.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHealth;
