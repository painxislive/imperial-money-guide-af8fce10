import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { articleService, generateSlug } from '@/services/articleService';
import { secureEditService } from '@/services/secureEditService';
import { Article, Category, Author, ArticleRevision } from '@/types/database';
import { SEO } from '@/utils/seo';
import {
  FileText, Plus, Edit, Trash2, Eye, EyeOff, Clock, Link2, Copy, History,
  Search, Filter, Crown, Star, Users
} from 'lucide-react';

const AdminArticles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isEditor, loading: roleLoading } = useRole();
  const { user, profile } = useAuth();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Edit dialog state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    preview_content: '',
    full_content: '',
    excerpt: '',
    category_id: '',
    author_id: '',
    is_premium: false,
    is_featured: false,
    status: 'draft' as 'draft' | 'published' | 'archived',
    seo_title: '',
    seo_description: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Revisions dialog
  const [showRevisionsDialog, setShowRevisionsDialog] = useState(false);
  const [revisions, setRevisions] = useState<ArticleRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  // Secure link dialog
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedArticleForLink, setSelectedArticleForLink] = useState<Article | null>(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('24');

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
      const [articlesData, categoriesData, authorsData] = await Promise.all([
        articleService.getAllArticles(),
        articleService.getCategories(),
        articleService.getAuthors(),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load articles.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category_id === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openEditDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        preview_content: article.preview_content || '',
        full_content: article.full_content || '',
        excerpt: article.excerpt || '',
        category_id: article.category_id || '',
        author_id: article.author_id || '',
        is_premium: article.is_premium,
        is_featured: article.is_featured,
        status: article.status,
        seo_title: article.seo_title || '',
        seo_description: article.seo_description || '',
        tags: article.tags || [],
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        preview_content: '',
        full_content: '',
        excerpt: '',
        category_id: '',
        author_id: '',
        is_premium: false,
        is_featured: false,
        status: 'draft',
        seo_title: '',
        seo_description: '',
        tags: [],
      });
    }
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingArticle) {
        const { error } = await articleService.updateArticle(
          editingArticle.id,
          formData,
          user?.id,
          profile?.full_name || user?.email || 'Unknown Editor',
          'Updated via admin panel'
        );
        if (error) throw error;
        toast({ title: 'Success', description: 'Article updated successfully.' });
      } else {
        const { error } = await articleService.createArticle(formData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Article created successfully.' });
      }
      setShowEditDialog(false);
      loadData();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only admins can delete articles.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete "${article.title}"?`)) return;

    try {
      const { error } = await articleService.deleteArticle(article.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Article deleted successfully.' });
      loadData();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article.',
        variant: 'destructive',
      });
    }
  };

  const viewRevisions = async (article: Article) => {
    setEditingArticle(article);
    setLoadingRevisions(true);
    setShowRevisionsDialog(true);
    
    try {
      const data = await articleService.getArticleRevisions(article.id);
      setRevisions(data);
    } catch (error) {
      console.error('Error loading revisions:', error);
    } finally {
      setLoadingRevisions(false);
    }
  };

  const generateSecureLink = async () => {
    if (!selectedArticleForLink) return;

    try {
      const { data, error } = await secureEditService.createSecureEditLink(
        selectedArticleForLink.id,
        parseInt(linkExpiry)
      );
      if (error) throw error;
      
      const url = secureEditService.getShareableUrl(data!.token);
      setGeneratedLink(url);
      
      toast({ title: 'Success', description: 'Secure edit link generated.' });
    } catch (error) {
      console.error('Error generating link:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate link.',
        variant: 'destructive',
      });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({ title: 'Copied', description: 'Link copied to clipboard.' });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
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
      <SEO title="Article Management | Admin | Imperialpedia" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">
              {isAdmin ? 'Full admin access' : 'Editor access'} • {articles.length} articles
            </p>
          </div>
          <Button onClick={() => openEditDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            New Article
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
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map(article => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{article.title}</h3>
                      {article.is_premium && (
                        <Badge variant="secondary" className="gap-1">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                      {article.is_featured && (
                        <Badge variant="default" className="gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={
                        article.status === 'published' ? 'default' :
                        article.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {article.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt || article.preview_content?.slice(0, 150)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>By {article.author?.name || 'Unknown'}</span>
                      <span>{article.category?.name}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.view_count || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(article.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewRevisions(article)}
                      title="View Revisions"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedArticleForLink(article);
                          setGeneratedLink('');
                          setShowLinkDialog(true);
                        }}
                        title="Generate Edit Link"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(article)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(article)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No articles found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? 'Edit Article' : 'New Article'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief excerpt for listings"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preview Content (visible to all)</label>
                <Textarea
                  value={formData.preview_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, preview_content: e.target.value }))}
                  placeholder="Content shown to all users"
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Full Content</label>
                <Textarea
                  value={formData.full_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_content: e.target.value }))}
                  placeholder="Full article content (premium users only if marked premium)"
                  rows={12}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, category_id: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(v: 'draft' | 'published' | 'archived') => setFormData(prev => ({ ...prev, status: v }))}
                    disabled={!isAdmin && formData.status === 'published'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      {isAdmin && <SelectItem value="published">Published</SelectItem>}
                      {isAdmin && <SelectItem value="archived">Archived</SelectItem>}
                    </SelectContent>
                  </Select>
                  {!isAdmin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Only admins can publish articles
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_premium}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_premium: e.target.checked }))}
                      disabled={!isAdmin}
                    />
                    <span className="text-sm">Premium Content</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      disabled={!isAdmin}
                    />
                    <span className="text-sm">Featured Article</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div>
                <label className="text-sm font-medium">SEO Title</label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                  placeholder="SEO title (max 60 chars)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo_title.length}/60 characters
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">SEO Description</label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                  placeholder="SEO description (max 160 chars)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo_description.length}/160 characters
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Generated Slug</label>
                <Input
                  value={generateSlug(formData.title)}
                  disabled
                  className="bg-muted"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingArticle ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revisions Dialog */}
      <Dialog open={showRevisionsDialog} onOpenChange={setShowRevisionsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revision History: {editingArticle?.title}</DialogTitle>
          </DialogHeader>
          
          {loadingRevisions ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : revisions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No revisions found</p>
          ) : (
            <div className="space-y-4">
              {revisions.map(rev => (
                <Card key={rev.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{rev.editor_name || 'Unknown Editor'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rev.created_at).toLocaleString()}
                        </p>
                      </div>
                      {rev.revision_note && (
                        <Badge variant="secondary">{rev.revision_note}</Badge>
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Status changed: {rev.previous_content?.status} → {rev.new_content?.status}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Secure Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Secure Edit Link</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a secure, expiring link for an editor to edit "{selectedArticleForLink?.title}"
            </p>
            
            <div>
              <label className="text-sm font-medium">Link expires in</label>
              <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="72">3 days</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!generatedLink ? (
              <Button onClick={generateSecureLink} className="w-full">
                Generate Link
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-sm" />
                  <Button variant="outline" onClick={copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This link will expire in {linkExpiry} hours and can only be used once.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminArticles;
