import { useState, useEffect } from "react";
import EnterpriseLayout from "@/layouts/EnterpriseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { newsService, NewsCategory, NewsSource } from "@/services/newsService";
import { useToast } from "@/hooks/use-toast";

export default function EnterpriseNewsManager() {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const [cats, srcs] = await Promise.all([
      newsService.getCategories(),
      newsService.getSources(),
    ]);
    setCategories(cats);
    setSources(srcs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatSlug || newCatName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await newsService.upsertCategory({ name: newCatName, slug, show_in_nav: true, is_active: true, sort_order: categories.length + 1 });
    setNewCatName("");
    setNewCatSlug("");
    toast({ title: "Category added" });
    load();
  };

  const deleteCategory = async (id: string) => {
    await newsService.deleteCategory(id);
    toast({ title: "Category deleted" });
    load();
  };

  const addSource = async () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) return;
    await newsService.upsertSource({ name: newSourceName, url: newSourceUrl, source_type: "rss", is_active: true });
    setNewSourceName("");
    setNewSourceUrl("");
    toast({ title: "Source added" });
    load();
  };

  const toggleSource = async (id: string, active: boolean) => {
    await newsService.toggleSource(id, active);
    load();
  };

  const deleteSource = async (id: string) => {
    await newsService.deleteSource(id);
    toast({ title: "Source deleted" });
    load();
  };

  return (
    <EnterpriseLayout title="News Manager" description="Manage news categories, sources, and country coverage.">
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="sources">News Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Category name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                <Input placeholder="slug (auto)" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} className="w-40" />
                <Button onClick={addCategory}><Plus className="h-4 w-4 mr-1" />Add</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={cat.show_in_nav ? "default" : "outline"}>{cat.show_in_nav ? "In Nav" : "Hidden"}</Badge>
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">/news/{cat.slug}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add News Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Source name" value={newSourceName} onChange={(e) => setNewSourceName(e.target.value)} />
                <Input placeholder="RSS/API URL" value={newSourceUrl} onChange={(e) => setNewSourceUrl(e.target.value)} className="flex-1" />
                <Button onClick={addSource}><Plus className="h-4 w-4 mr-1" />Add</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {sources.map((src) => (
              <Card key={src.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Switch checked={src.is_active} onCheckedChange={(v) => toggleSource(src.id, v)} />
                    <span className="font-medium">{src.name}</span>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> URL
                    </a>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteSource(src.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            {sources.length === 0 && <p className="text-center py-8 text-muted-foreground">No sources configured yet.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </EnterpriseLayout>
  );
}
