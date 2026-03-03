import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { db } from '@/lib/supabase-helpers';
import type { Author } from '@/types/enterprise';
import { Plus, User, CheckCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function EnterpriseAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAuthor, setEditAuthor] = useState<Author | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: '', slug: '', bio: '', credentials: '', linkedin_url: '', twitter_url: '', expertise_tags: '', is_reviewer: false, is_verified: false });

  useEffect(() => { loadAuthors(); }, []);

  const loadAuthors = async () => {
    setLoading(true);
    const { data } = await db('authors').select('*').order('name');
    setAuthors((data || []) as Author[]);
    setLoading(false);
  };

  const openNew = () => {
    setEditAuthor(null);
    setForm({ name: '', slug: '', bio: '', credentials: '', linkedin_url: '', twitter_url: '', expertise_tags: '', is_reviewer: false, is_verified: false });
    setDialogOpen(true);
  };

  const openEdit = (a: Author) => {
    setEditAuthor(a);
    setForm({
      name: a.name, slug: a.slug, bio: a.bio || '', credentials: a.credentials || '',
      linkedin_url: a.linkedin_url || '', twitter_url: a.twitter_url || '',
      expertise_tags: a.expertise_tags?.join(', ') || '', is_reviewer: a.is_reviewer, is_verified: a.is_verified,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.slug) return toast.error('Name and slug required');
    const payload = {
      name: form.name, slug: form.slug, bio: form.bio || null, credentials: form.credentials || null,
      linkedin_url: form.linkedin_url || null, twitter_url: form.twitter_url || null,
      expertise_tags: form.expertise_tags ? form.expertise_tags.split(',').map(t => t.trim()) : [],
      is_reviewer: form.is_reviewer, is_verified: form.is_verified,
    };
    if (editAuthor) {
      const { error } = await db('authors').update(payload).eq('id', editAuthor.id);
      if (error) return toast.error('Update failed');
      toast.success('Author updated');
    } else {
      const { error } = await db('authors').insert(payload);
      if (error) return toast.error('Create failed');
      toast.success('Author created');
    }
    setDialogOpen(false);
    loadAuthors();
  };

  return (
    <EnterpriseLayout title="Author Management" description="Manage author profiles, credentials, and reviewer status.">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Author</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map(author => (
            <Card key={author.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {author.avatar_url ? (
                      <img src={author.avatar_url} alt={author.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{author.name}</h3>
                    {author.credentials && <p className="text-sm text-primary">{author.credentials}</p>}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {author.is_verified && <Badge variant="default" className="text-xs">Verified</Badge>}
                      {author.is_reviewer && <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" />Reviewer</Badge>}
                    </div>
                    {author.expertise_tags?.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {author.expertise_tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(author)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {authors.length === 0 && !loading && (
            <Card className="col-span-full"><CardContent className="py-12 text-center text-muted-foreground">No authors yet</CardContent></Card>
          )}
        </div>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editAuthor ? 'Edit Author' : 'New Author'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="john-doe" /></div>
              </div>
              <div><Label>Credentials</Label><Input value={form.credentials} onChange={e => setForm({ ...form, credentials: e.target.value })} placeholder="CFA, MBA" /></div>
              <div><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>LinkedIn URL</Label><Input value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} /></div>
                <div><Label>Twitter URL</Label><Input value={form.twitter_url} onChange={e => setForm({ ...form, twitter_url: e.target.value })} /></div>
              </div>
              <div><Label>Expertise Tags (comma-separated)</Label><Input value={form.expertise_tags} onChange={e => setForm({ ...form, expertise_tags: e.target.value })} placeholder="Finance, Crypto, Banking" /></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_reviewer} onCheckedChange={v => setForm({ ...form, is_reviewer: v })} />
                  <Label>Reviewer</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_verified} onCheckedChange={v => setForm({ ...form, is_verified: v })} />
                  <Label>Verified</Label>
                </div>
              </div>
              <Button onClick={save} className="w-full">{editAuthor ? 'Update' : 'Create'} Author</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </EnterpriseLayout>
  );
}
