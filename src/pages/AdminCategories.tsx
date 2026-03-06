import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { newsService, NewsCategory } from "@/services/newsService";
import { Plus, Edit, Trash2, FolderTree, GripVertical, Eye, EyeOff } from "lucide-react";

const emptyForm = {
  name: "", slug: "", description: "", icon: "", color: "",
  meta_title: "", meta_description: "", sort_order: 0,
  show_in_nav: true, is_active: true,
};

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsCategory | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    newsService.getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (cat?: NewsCategory) => {
    if (cat) {
      setEditing(cat);
      setForm({
        name: cat.name, slug: cat.slug, description: cat.description || "",
        icon: cat.icon || "", color: cat.color || "",
        meta_title: cat.meta_title || "", meta_description: cat.meta_description || "",
        sort_order: cat.sort_order, show_in_nav: cat.show_in_nav, is_active: cat.is_active,
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast({ title: "Name required", variant: "destructive" });
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = { ...form, slug, id: editing?.id };
    await newsService.upsertCategory(payload as any);
    toast({ title: editing ? "Category updated" : "Category created — it will appear in the navigation bar automatically" });
    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await newsService.deleteCategory(id);
    toast({ title: "Category deleted" });
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Categories Manager | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FolderTree className="h-7 w-7 text-primary" />
            <div><h1 className="text-3xl font-bold">Categories Manager</h1><p className="text-muted-foreground">{categories.length} categories • New categories auto-appear in navigation</p></div>
          </div>
          <Button onClick={() => openEdit()} className="gap-2"><Plus className="h-4 w-4" />Add Category</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{cat.name}</h3>
                      <Badge variant="outline" className="text-xs">/{cat.slug}</Badge>
                      {cat.show_in_nav ? <Badge variant="default" className="text-xs">In Nav</Badge> : <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                      {!cat.is_active && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                    </div>
                    {cat.description && <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(cat.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Name *</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="auto-generated" /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Icon</label><Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="lucide icon name" /></div>
              <div><label className="text-sm font-medium">Color</label><Input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} placeholder="#hex" /></div>
            </div>
            <div><label className="text-sm font-medium">SEO Title</label><Input value={form.meta_title} onChange={e => setForm(p => ({ ...p, meta_title: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">SEO Description</label><Textarea value={form.meta_description} onChange={e => setForm(p => ({ ...p, meta_description: e.target.value }))} rows={2} /></div>
            <div><label className="text-sm font-medium">Sort Order</label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} /></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Switch checked={form.show_in_nav} onCheckedChange={v => setForm(p => ({ ...p, show_in_nav: v }))} /><label className="text-sm">Show in Navigation</label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><label className="text-sm">Active</label></div>
            </div>
            <Button onClick={save} className="w-full">{editing ? "Update" : "Create"} Category</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default AdminCategories;
