import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/useRole';
import { glossaryService, GlossaryTerm, GlossaryTermInput, GLOSSARY_CATEGORIES } from '@/services/glossaryService';
import { SEO } from '@/utils/seo';
import { BookOpen, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const AdminGlossaryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isEditor, isAdmin, loading: roleLoading } = useRole();
  
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [letterFilter, setLetterFilter] = useState<string>('all');
  
  // Edit dialog state
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState<GlossaryTermInput>({
    term: '',
    short_definition: '',
    full_definition: '',
    example: '',
    category: 'General',
    subcategory: '',
    related_terms: [],
    author_id: '',
    status: 'draft',
  });
  const [relatedTermInput, setRelatedTermInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isEditor) {
      navigate('/');
      return;
    }
    
    if (!roleLoading && isEditor) {
      loadData();
    }
  }, [roleLoading, isEditor]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [termsData, authorsData] = await Promise.all([
        glossaryService.getAllTerms(),
        glossaryService.getAuthors(),
      ]);
      setTerms(termsData);
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load glossary terms.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const letters = [...new Set(terms.map(t => t.letter))].sort();

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.short_definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || term.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || term.category === categoryFilter;
    const matchesLetter = letterFilter === 'all' || term.letter === letterFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesLetter;
  });

  const openEditDialog = (term?: GlossaryTerm) => {
    if (term) {
      setEditingTerm(term);
      setFormData({
        term: term.term,
        short_definition: term.short_definition || term.definition || '',
        full_definition: term.full_definition || '',
        example: term.example || '',
        category: term.category || 'General',
        subcategory: term.subcategory || '',
        related_terms: term.related_terms || [],
        author_id: term.author_id || '',
        status: term.status || 'draft',
      });
    } else {
      setEditingTerm(null);
      setFormData({
        term: '',
        short_definition: '',
        full_definition: '',
        example: '',
        category: 'General',
        subcategory: '',
        related_terms: [],
        author_id: '',
        status: 'draft',
      });
    }
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    if (!formData.term.trim() || !formData.short_definition.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Term and short definition are required.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingTerm) {
        const { error } = await glossaryService.updateTerm(editingTerm.id, formData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Term updated successfully.' });
      } else {
        const { error } = await glossaryService.createTerm(formData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Term created successfully.' });
      }
      setShowEditDialog(false);
      loadData();
    } catch (error) {
      console.error('Error saving term:', error);
      toast({
        title: 'Error',
        description: 'Failed to save term.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (term: GlossaryTerm) => {
    if (!confirm(`Are you sure you want to delete "${term.term}"?`)) return;

    try {
      const { error } = await glossaryService.deleteTerm(term.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Term deleted successfully.' });
      loadData();
    } catch (error) {
      console.error('Error deleting term:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete term.',
        variant: 'destructive',
      });
    }
  };

  const addRelatedTerm = () => {
    if (relatedTermInput.trim() && !formData.related_terms?.includes(relatedTermInput.trim())) {
      setFormData(prev => ({
        ...prev,
        related_terms: [...(prev.related_terms || []), relatedTermInput.trim()],
      }));
      setRelatedTermInput('');
    }
  };

  const removeRelatedTerm = (term: string) => {
    setFormData(prev => ({
      ...prev,
      related_terms: (prev.related_terms || []).filter(t => t !== term),
    }));
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Glossary Management | Admin | Imperialpedia" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Glossary Management</h1>
            <p className="text-muted-foreground">
              {terms.length} terms across {letters.length} letters
            </p>
          </div>
          <Button onClick={() => openEditDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            New Term
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={letterFilter} onValueChange={setLetterFilter}>
                <SelectTrigger className="w-full md:w-24">
                  <SelectValue placeholder="Letter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {letters.map(letter => (
                    <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {GLOSSARY_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Terms List */}
        <div className="space-y-4">
          {filteredTerms.map(term => (
            <Card key={term.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-primary">{term.letter}</span>
                      <h3 className="font-semibold text-lg">{term.term}</h3>
                      <Badge variant={term.status === 'published' ? 'default' : 'secondary'}>
                        {term.status}
                      </Badge>
                      {term.category && (
                        <Badge variant="outline">{term.category}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {term.short_definition || term.definition}
                    </p>
                    {term.author && (
                      <p className="text-xs text-muted-foreground mt-2">
                        By {term.author.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(term)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(term)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredTerms.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No terms found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTerm ? 'Edit Term' : 'New Glossary Term'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Term *</label>
                <Input
                  value={formData.term}
                  onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                  placeholder="e.g., Inflation"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GLOSSARY_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Short Definition *</label>
              <Textarea
                value={formData.short_definition}
                onChange={(e) => setFormData(prev => ({ ...prev, short_definition: e.target.value }))}
                placeholder="A brief, one-sentence definition"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Full Definition</label>
              <Textarea
                value={formData.full_definition}
                onChange={(e) => setFormData(prev => ({ ...prev, full_definition: e.target.value }))}
                placeholder="Detailed explanation of the term"
                rows={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Example</label>
              <Textarea
                value={formData.example}
                onChange={(e) => setFormData(prev => ({ ...prev, example: e.target.value }))}
                placeholder="A practical example of how this term is used"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Author</label>
                <Select
                  value={formData.author_id}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, author_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map(author => (
                      <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(v: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Related Terms (slugs)</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={relatedTermInput}
                  onChange={(e) => setRelatedTermInput(e.target.value)}
                  placeholder="e.g., deflation"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRelatedTerm())}
                />
                <Button type="button" variant="outline" onClick={addRelatedTerm}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.related_terms || []).map(term => (
                  <Badge key={term} variant="secondary" className="cursor-pointer" onClick={() => removeRelatedTerm(term)}>
                    {term} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingTerm ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminGlossaryPage;
