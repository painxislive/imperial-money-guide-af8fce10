import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/supabase-helpers";
import { Plus, Edit, Trash2, Users, Linkedin, Twitter, Globe } from "lucide-react";

interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  credentials: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  website_url: string | null;
  expertise_areas: string[] | null;
  is_verified: boolean;
  created_at: string;
}

const emptyForm = {
  name: "", slug: "", bio: "", avatar_url: "", credentials: "",
  linkedin_url: "", twitter_handle: "", website_url: "", expertise_areas: "",
  is_verified: false,
};

const AdminAuthors = () => {
  const { toast } = useToast();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    db("authors").select("*").order("name")
      .then(({ data }) => setAuthors((data as Author[]) || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (author?: Author) => {
    if (author) {
      setEditing(author);
      setForm({
        name: author.name, slug: author.slug, bio: author.bio || "",
        avatar_url: author.avatar_url || "", credentials: author.credentials || "",
        linkedin_url: author.linkedin_url || "", twitter_handle: author.twitter_handle || "",
        website_url: author.website_url || "",
        expertise_areas: (author.expertise_areas || []).join(", "),
        is_verified: author.is_verified,
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast({ title: "Name is required", variant: "destructive" });
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      name: form.name, slug, bio: form.bio || null, avatar_url: form.avatar_url || null,
      credentials: form.credentials || null, linkedin_url: form.linkedin_url || null,
      twitter_handle: form.twitter_handle || null, website_url: form.website_url || null,
      expertise_areas: form.expertise_areas ? form.expertise_areas.split(",").map(s => s.trim()).filter(Boolean) : null,
      is_verified: form.is_verified,
    };
    if (editing) {
      await db("authors").update(payload).eq("id", editing.id);
      toast({ title: "Author updated" });
    } else {
      await db("authors").insert(payload);
      toast({ title: "Author created" });
    }
    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this author?")) return;
    await db("authors").delete().eq("id", id);
    toast({ title: "Author deleted" });
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Authors Manager | Admin | Imperialpedia</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <DynamicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            <div><h1 className="text-3xl font-bold">Authors Manager</h1><p className="text-muted-foreground">{authors.length} authors</p></div>
          </div>
          <Button onClick={() => openEdit()} className="gap-2"><Plus className="h-4 w-4" />Add Author</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{a.name}</h3>
                      {a.credentials && <p className="text-xs text-muted-foreground">{a.credentials}</p>}
                    </div>
                    {a.is_verified && <Badge variant="default">Verified</Badge>}
                  </div>
                  {a.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{a.bio}</p>}
                  <div className="flex items-center gap-2 mb-3">
                    {a.linkedin_url && <Linkedin className="h-4 w-4 text-muted-foreground" />}
                    {a.twitter_handle && <Twitter className="h-4 w-4 text-muted-foreground" />}
                    {a.website_url && <Globe className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {a.expertise_areas && a.expertise_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {a.expertise_areas.slice(0, 3).map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(a)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(a.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Author" : "Add Author"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Name *</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="auto-generated" /></div>
            <div><label className="text-sm font-medium">Bio</label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} /></div>
            <div><label className="text-sm font-medium">Credentials</label><Input value={form.credentials} onChange={e => setForm(p => ({ ...p, credentials: e.target.value }))} placeholder="CFA, MBA, etc." /></div>
            <div><label className="text-sm font-medium">Avatar URL</label><Input value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">LinkedIn URL</label><Input value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Twitter Handle</label><Input value={form.twitter_handle} onChange={e => setForm(p => ({ ...p, twitter_handle: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Website</label><Input value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Expertise (comma-separated)</label><Input value={form.expertise_areas} onChange={e => setForm(p => ({ ...p, expertise_areas: e.target.value }))} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_verified} onChange={e => setForm(p => ({ ...p, is_verified: e.target.checked }))} />
              <label className="text-sm">Verified Author</label>
            </div>
            <Button onClick={save} className="w-full">{editing ? "Update" : "Create"} Author</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default AdminAuthors;
