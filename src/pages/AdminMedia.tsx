import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload, Search, Grid3X3, List } from "lucide-react";

const AdminMedia = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Media Library | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image className="h-7 w-7 text-primary" />
            <div><h1 className="text-3xl font-bold">Media Library</h1><p className="text-muted-foreground">Manage images and media assets</p></div>
          </div>
          <Button className="gap-2"><Upload className="h-4 w-4" />Upload</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search media..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-1 border rounded-md p-1">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}><Grid3X3 className="h-4 w-4" /></Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-16 text-center">
            <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg text-muted-foreground">Media library is ready</p>
            <p className="text-sm text-muted-foreground mt-1">Connect Supabase Storage to upload and manage images</p>
            <Button variant="outline" className="mt-4">Configure Storage</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminMedia;
