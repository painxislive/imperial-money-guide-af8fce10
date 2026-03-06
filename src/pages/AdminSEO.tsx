import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Globe, FileText, Link2, Map, Rss, CheckCircle } from "lucide-react";

const AdminSEO = () => {
  const { toast } = useToast();
  const [globalSEO, setGlobalSEO] = useState({
    site_title: "Imperialpedia",
    title_template: "%s | Imperialpedia",
    default_description: "Global finance knowledge and news platform",
    default_og_image: "",
    robots_txt: "User-agent: *\nAllow: /\nSitemap: /sitemap.xml",
    canonical_base: "https://imperialpedia.com",
  });

  const saveSettings = () => {
    toast({ title: "SEO settings saved" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>SEO Manager | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-7 w-7 text-primary" />
          <div><h1 className="text-3xl font-bold">SEO Manager</h1><p className="text-muted-foreground">Site-wide SEO settings and optimization</p></div>
        </div>

        <Tabs defaultValue="global" className="space-y-6">
          <TabsList><TabsTrigger value="global">Global Settings</TabsTrigger><TabsTrigger value="sitemap">Sitemap</TabsTrigger><TabsTrigger value="redirects">Redirects</TabsTrigger><TabsTrigger value="audit">SEO Audit</TabsTrigger></TabsList>

          <TabsContent value="global" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Global Meta Settings</CardTitle><CardDescription>Default SEO values for the entire site</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium">Site Title</label><Input value={globalSEO.site_title} onChange={e => setGlobalSEO(p => ({ ...p, site_title: e.target.value }))} /></div>
                <div><label className="text-sm font-medium">Title Template</label><Input value={globalSEO.title_template} onChange={e => setGlobalSEO(p => ({ ...p, title_template: e.target.value }))} /><p className="text-xs text-muted-foreground mt-1">Use %s for the page title</p></div>
                <div><label className="text-sm font-medium">Default Meta Description</label><Textarea value={globalSEO.default_description} onChange={e => setGlobalSEO(p => ({ ...p, default_description: e.target.value }))} rows={2} /></div>
                <div><label className="text-sm font-medium">Default OG Image URL</label><Input value={globalSEO.default_og_image} onChange={e => setGlobalSEO(p => ({ ...p, default_og_image: e.target.value }))} /></div>
                <div><label className="text-sm font-medium">Canonical Base URL</label><Input value={globalSEO.canonical_base} onChange={e => setGlobalSEO(p => ({ ...p, canonical_base: e.target.value }))} /></div>
                <Button onClick={saveSettings}>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sitemap">
            <Card><CardContent className="py-12 text-center"><Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" /><p className="text-muted-foreground">Dynamic sitemap is auto-generated at /sitemap.xml</p><Badge variant="default" className="mt-2 gap-1"><CheckCircle className="h-3 w-3" />Active</Badge></CardContent></Card>
          </TabsContent>

          <TabsContent value="redirects">
            <Card><CardContent className="py-12 text-center"><Link2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" /><p className="text-muted-foreground">Redirect management — add 301/302 redirects</p><Button variant="outline" className="mt-4">Add Redirect</Button></CardContent></Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" /><p className="text-muted-foreground">SEO audit will scan all pages for missing meta tags, schema, and issues</p><Button variant="outline" className="mt-4">Run Audit</Button></CardContent></Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminSEO;
