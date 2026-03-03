import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/supabase-helpers';
import type { AutoLinkTerm } from '@/types/enterprise';
import { Plus, Trash2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EnterpriseAutoLinks() {
  const [terms, setTerms] = useState<AutoLinkTerm[]>([]);
  const [keyword, setKeyword] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [priority, setPriority] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTerms(); }, []);

  const loadTerms = async () => {
    setLoading(true);
    const { data } = await db('auto_link_terms').select('*').order('priority', { ascending: false });
    setTerms((data || []) as AutoLinkTerm[]);
    setLoading(false);
  };

  const addTerm = async () => {
    if (!keyword || !targetUrl) return toast.error('Keyword and URL are required');
    const { error } = await db('auto_link_terms').insert({ keyword, target_url: targetUrl, priority });
    if (error) return toast.error('Failed to add term');
    toast.success('Auto-link term added');
    setKeyword(''); setTargetUrl(''); setPriority(0);
    loadTerms();
  };

  const deleteTerm = async (id: string) => {
    await db('auto_link_terms').delete().eq('id', id);
    toast.success('Removed');
    loadTerms();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await db('auto_link_terms').update({ is_active: !current }).eq('id', id);
    loadTerms();
  };

  return (
    <EnterpriseLayout title="Auto Internal Linking" description="Manage auto-link keywords for internal linking optimization.">
      <div className="space-y-6">
        {/* Add Form */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5" />Add Auto-Link Term</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <Label>Keyword</Label>
                <Input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. inflation" />
              </div>
              <div>
                <Label>Target URL</Label>
                <Input value={targetUrl} onChange={e => setTargetUrl(e.target.value)} placeholder="/glossary/term/inflation" />
              </div>
              <div>
                <Label>Priority</Label>
                <Input type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} />
              </div>
              <div className="flex items-end">
                <Button onClick={addTerm} className="w-full"><Plus className="h-4 w-4 mr-2" />Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map(term => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{term.keyword}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{term.target_url}</TableCell>
                    <TableCell>{term.priority}</TableCell>
                    <TableCell>
                      <Badge
                        variant={term.is_active ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleActive(term.id, term.is_active)}
                      >
                        {term.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteTerm(term.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {terms.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No auto-link terms configured</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
