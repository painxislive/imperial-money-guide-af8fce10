import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/supabase-helpers';
import type { Category } from '@/types/enterprise';
import { Edit, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function EnterpriseCategorySEO() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ meta_title: '', meta_description: '', pillar_content: '', faq_items: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    const { data } = await db('categories').select('*').order('sort_order');
    setCategories((data || []) as Category[]);
    setLoading(false);
  };

  const openEdit = (cat: Category) => {
    setEditCat(cat);
    setForm({
      meta_title: cat.meta_title || '',
      meta_description: cat.meta_description || '',
      pillar_content: cat.pillar_content || '',
      faq_items: cat.faq_items?.length ? JSON.stringify(cat.faq_items, null, 2) : '[]',
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!editCat) return;
    let faqItems: any[] = [];
    try { faqItems = JSON.parse(form.faq_items); } catch { return toast.error('Invalid FAQ JSON'); }

    const { error } = await db('categories').update({
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      pillar_content: form.pillar_content || null,
      faq_items: faqItems,
    }).eq('id', editCat.id);

    if (error) return toast.error('Update failed');
    toast.success('Category updated');
    setDialogOpen(false);
    loadCategories();
  };

  return (
    <EnterpriseLayout title="Category SEO Manager" description="Edit pillar content, meta fields, and FAQ items for category pages.">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">/{cat.slug}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant={cat.meta_title ? 'default' : 'destructive'} className="text-xs">
                      {cat.meta_title ? '✓ Meta Title' : '✗ Meta Title'}
                    </Badge>
                    <Badge variant={cat.pillar_content ? 'default' : 'secondary'} className="text-xs">
                      {cat.pillar_content ? '✓ Pillar' : '✗ Pillar'}
                    </Badge>
                    <Badge variant={(cat.faq_items as any[])?.length ? 'default' : 'secondary'} className="text-xs">
                      FAQ: {(cat.faq_items as any[])?.length || 0}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Edit: {editCat?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Meta Title</Label><Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} /></div>
            <div><Label>Meta Description</Label><Textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} rows={2} /></div>
            <div><Label>Pillar Content (HTML)</Label><Textarea value={form.pillar_content} onChange={e => setForm({ ...form, pillar_content: e.target.value })} rows={6} /></div>
            <div>
              <Label>FAQ Items (JSON array)</Label>
              <Textarea value={form.faq_items} onChange={e => setForm({ ...form, faq_items: e.target.value })} rows={6} className="font-mono text-xs" />
              <p className="text-xs text-muted-foreground mt-1">Format: [{"{"}"question":"...","answer":"..."{"}"}, ...]</p>
            </div>
            <Button onClick={save} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </EnterpriseLayout>
  );
}
