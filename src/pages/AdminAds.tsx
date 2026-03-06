import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, LayoutGrid, Plus, BarChart3 } from "lucide-react";

const AdminAds = () => {
  const { toast } = useToast();
  const [adsenseId, setAdsenseId] = useState("");
  const [adSlots] = useState([
    { id: "1", name: "Header Banner", position: "header", size: "728x90", active: true },
    { id: "2", name: "Sidebar Ad", position: "sidebar", size: "300x250", active: true },
    { id: "3", name: "In-Article Ad", position: "in-content", size: "responsive", active: false },
    { id: "4", name: "Footer Banner", position: "footer", size: "728x90", active: false },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Ad Management | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <DollarSign className="h-7 w-7 text-primary" />
          <div><h1 className="text-3xl font-bold">Ad Management</h1><p className="text-muted-foreground">Manage ad placements and monetization</p></div>
        </div>

        <Tabs defaultValue="slots" className="space-y-6">
          <TabsList><TabsTrigger value="slots">Ad Slots</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger><TabsTrigger value="revenue">Revenue</TabsTrigger></TabsList>

          <TabsContent value="slots" className="space-y-4">
            <div className="flex justify-end"><Button className="gap-2"><Plus className="h-4 w-4" />Add Slot</Button></div>
            {adSlots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{slot.name}</h3>
                      <p className="text-sm text-muted-foreground">Position: {slot.position} • Size: {slot.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={slot.active ? "default" : "secondary"}>{slot.active ? "Active" : "Inactive"}</Badge>
                    <Switch checked={slot.active} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings">
            <Card><CardHeader><CardTitle>AdSense Configuration</CardTitle><CardDescription>Configure Google AdSense for automatic ad serving</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium">AdSense Publisher ID</label><Input value={adsenseId} onChange={e => setAdsenseId(e.target.value)} placeholder="ca-pub-XXXXX" /></div>
                <Button onClick={() => toast({ title: "AdSense settings saved" })}>Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card><CardContent className="py-16 text-center"><BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" /><p className="text-lg text-muted-foreground">Revenue tracking will be available after ad integration is configured</p></CardContent></Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAds;
