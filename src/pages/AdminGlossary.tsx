import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  glossaryService, 
  GlossaryTerm, 
  Author, 
  GlossaryTermInput,
  GLOSSARY_CATEGORIES,
  generateSlug,
  getLetterFromTerm
} from '@/services/glossaryService';
import { format } from 'date-fns';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  BookOpen,
  Filter,
  RefreshCw,
  Eye,
  Save,
  X
} from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AdminGlossary() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLetter, setFilterLetter] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  // Form state
  const [formData, setFormData] = useState<GlossaryTermInput>({
    term: '',
    short_definition: '',
    full_definition: '',
    example: '',
    category: 'General',
    subcategory: '',
    related_terms: [],
    author_id: '',
    status: 'draft'
  });

  // Check admin access
  const hasAccess = profile?.role === 'admin' || profile?.role === 'editor';

  useEffect(() => {
    if (hasAccess) {
      loadData();
      subscribeToChanges();
    }
  }, [hasAccess]);

  const loadData = async () => {
    setLoading(true);
    const [termsData, authorsData] = await Promise.all([
      glossaryService.getAllTerms(),
      glossaryService.getAuthors()
    ]);
    setTerms(termsData);
    setAuthors(authorsData);
    setLoading(false);
  };

  const subscribeToChanges = () => {
    const channel = glossaryService.subscribeToChanges((payload) => {
      console.log('Real-time update:', payload);
      loadData(); // Reload on any change
    });

    return () => {
      channel.unsubscribe();
    };
  };

  const resetForm = () => {
    setFormData({
      term: '',
      short_definition: '',
      full_definition: '',
      example: '',
      category: 'General',
      subcategory: '',
      related_terms: [],
      author_id: authors[0]?.id || '',
      status: 'draft'
    });
  };

  const handleCreate = async () => {
    if (!formData.term || !formData.short_definition || !formData.full_definition) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const { data, error } = await glossaryService.createTerm(formData);
    setSaving(false);

    if (error) {
      toast({
        title: "Error creating term",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Term created successfully" });
    setIsCreateOpen(false);
    resetForm();
    loadData();
  };

  const handleEdit = async () => {
    if (!selectedTerm) return;

    setSaving(true);
    const { data, error } = await glossaryService.updateTerm(selectedTerm.id, formData);
    setSaving(false);

    if (error) {
      toast({
        title: "Error updating term",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Term updated successfully" });
    setIsEditOpen(false);
    setSelectedTerm(null);
    resetForm();
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedTerm) return;

    const { error } = await glossaryService.deleteTerm(selectedTerm.id);

    if (error) {
      toast({
        title: "Error deleting term",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Term deleted successfully" });
    setIsDeleteOpen(false);
    setSelectedTerm(null);
    loadData();
  };

  const openEditDialog = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setFormData({
      term: term.term,
      short_definition: term.short_definition || term.definition || '',
      full_definition: term.full_definition || term.definition || '',
      example: term.example || '',
      category: term.category || 'General',
      subcategory: term.subcategory || '',
      related_terms: term.related_terms || [],
      author_id: term.author_id || '',
      status: term.status || (term.is_published ? 'published' : 'draft')
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setIsDeleteOpen(true);
  };

  // Filter terms
  const filteredTerms = terms.filter(term => {
    if (searchQuery && !term.term.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterLetter !== 'all' && term.letter !== filterLetter) {
      return false;
    }
    if (filterCategory !== 'all' && term.category !== filterCategory) {
      return false;
    }
    if (filterStatus !== 'all') {
      const isPublished = term.status === 'published' || term.is_published;
      if (filterStatus === 'published' && !isPublished) return false;
      if (filterStatus === 'draft' && isPublished) return false;
    }
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please sign in to access the admin panel.</p>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You don't have permission to access the glossary admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Glossary Admin | Imperialpedia</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Glossary Management</h1>
              <p className="text-muted-foreground">Create, edit, and manage glossary terms</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Term
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Term</DialogTitle>
                  <DialogDescription>Add a new term to the glossary</DialogDescription>
                </DialogHeader>
                <TermForm 
                  formData={formData}
                  setFormData={setFormData}
                  authors={authors}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={saving}>
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Create Term
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterLetter} onValueChange={setFilterLetter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by letter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Letters</SelectItem>
                    {ALPHABET.map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {GLOSSARY_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{terms.length}</div>
                <div className="text-sm text-muted-foreground">Total Terms</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {terms.filter(t => t.status === 'published' || t.is_published).length}
                </div>
                <div className="text-sm text-muted-foreground">Published</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {terms.filter(t => t.status === 'draft' || !t.is_published).length}
                </div>
                <div className="text-sm text-muted-foreground">Drafts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{new Set(terms.map(t => t.letter)).size}</div>
                <div className="text-sm text-muted-foreground">Letters Used</div>
              </CardContent>
            </Card>
          </div>

          {/* Terms Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredTerms.length === 0 ? (
                <div className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No terms found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterLetter !== 'all' || filterCategory !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Create your first glossary term'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTerms.map(term => {
                      const isPublished = term.status === 'published' || term.is_published;
                      return (
                        <TableRow key={term.id}>
                          <TableCell>
                            <div className="font-medium">{term.term}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {term.short_definition || term.definition}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{term.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isPublished ? "default" : "secondary"}>
                              {isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{term.author?.name || '—'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(term.updated_at), 'MMM d, yyyy')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(`/glossary/term/${term.slug}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(term)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(term)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Term</DialogTitle>
              <DialogDescription>Update the glossary term</DialogDescription>
            </DialogHeader>
            <TermForm 
              formData={formData}
              setFormData={setFormData}
              authors={authors}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Term</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedTerm?.term}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </>
  );
}

// Term Form Component
function TermForm({ 
  formData, 
  setFormData, 
  authors 
}: { 
  formData: GlossaryTermInput;
  setFormData: React.Dispatch<React.SetStateAction<GlossaryTermInput>>;
  authors: Author[];
}) {
  const previewSlug = generateSlug(formData.term);
  const previewLetter = getLetterFromTerm(formData.term);

  return (
    <div className="space-y-4 py-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="term">Term *</Label>
          <Input
            id="term"
            value={formData.term}
            onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
            placeholder="e.g., Annual Percentage Rate"
          />
          {formData.term && (
            <div className="text-sm text-muted-foreground">
              Slug: <code className="bg-muted px-1 rounded">{previewSlug}</code> | 
              Letter: <Badge variant="outline" className="ml-1">{previewLetter || '—'}</Badge>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Select 
            value={formData.author_id || ''} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, author_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map(author => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_definition">Short Definition *</Label>
        <Textarea
          id="short_definition"
          value={formData.short_definition}
          onChange={(e) => setFormData(prev => ({ ...prev, short_definition: e.target.value }))}
          placeholder="A brief, one-sentence definition..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_definition">Full Definition *</Label>
        <Textarea
          id="full_definition"
          value={formData.full_definition}
          onChange={(e) => setFormData(prev => ({ ...prev, full_definition: e.target.value }))}
          placeholder="A detailed explanation of the term..."
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="example">Example</Label>
        <Textarea
          id="example"
          value={formData.example}
          onChange={(e) => setFormData(prev => ({ ...prev, example: e.target.value }))}
          placeholder="A practical example illustrating the term..."
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
            placeholder="e.g., Credit Cards, Stocks"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <Label htmlFor="status">Publish Status</Label>
          <p className="text-sm text-muted-foreground">
            {formData.status === 'published' ? 'This term is visible to the public' : 'This term is saved as a draft'}
          </p>
        </div>
        <Switch
          id="status"
          checked={formData.status === 'published'}
          onCheckedChange={(checked) => setFormData(prev => ({ 
            ...prev, 
            status: checked ? 'published' : 'draft' 
          }))}
        />
      </div>
    </div>
  );
}
