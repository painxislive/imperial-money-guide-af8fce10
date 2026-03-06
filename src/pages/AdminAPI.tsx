import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plug, Plus, Key, ExternalLink } from "lucide-react";

interface APIIntegration {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  last_synced: string | null;
}

const AdminAPI = () => {
  const { toast } = useToast();
  const [integrations] = useState<APIIntegration[]>([
    { id: "1", name: "CoinGecko API", provider: "coingecko", is_active: true, last_synced: new Date().toISOString() },
    { id: "2", name: "NewsAPI", provider: "newsapi", is_active: false, last_synced: null },
    { id: "3", name: "Alpha Vantage", provider: "alphavantage", is_active: false, last_synced: null },
    { id: "4", name: "FRED Economic Data", provider: "fred", is_active: false, last_synced: null },
    { id: "5", name: "Google Indexing API", provider: "google", is_active: false, last_synced: null },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>API Integrations | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Plug className="h-7 w-7 text-primary" />
            <div><h1 className="text-3xl font-bold">API Integrations</h1><p className="text-muted-foreground">Connect external data sources and services</p></div>
          </div>
          <Button className="gap-2"><Plus className="h-4 w-4" />Add Integration</Button>
        </div>

        <div className="space-y-4">
          {integrations.map((api) => (
            <Card key={api.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-lg"><Key className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold">{api.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {api.last_synced ? `Last synced: ${new Date(api.last_synced).toLocaleString()}` : "Not configured"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={api.is_active ? "default" : "secondary"}>{api.is_active ? "Active" : "Inactive"}</Badge>
                  <Switch checked={api.is_active} />
                  <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader><CardTitle>API Keys Configuration</CardTitle><CardDescription>Store API keys securely in Supabase Edge Function secrets</CardDescription></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">API keys should be stored as Supabase secrets and referenced in Edge Functions. Never store keys in client-side code.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.open("https://supabase.com/dashboard/project/jijoulspwdwqkjtstpuo/settings/functions", "_blank")}>
              Manage Secrets in Supabase
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAPI;
