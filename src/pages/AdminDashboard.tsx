import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { contentService, Article, RSSSource } from '@/lib/content';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  FileText, 
  Rss, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp,
  Calendar,
  Users,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [rssSources, setRSSSources] = useState<RSSSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: '',
    seo_title: '',
    seo_description: '',
    is_published: true,
    is_featured: false
  });

  const [rssForm, setRSSForm] = useState({
    name: '',
    url: '',
    category: 'general',
    is_active: true
  });

  // Check if user has admin/editor access
  const hasAccess = profile?.role === 'admin' || profile?.role === 'editor';

  useEffect(() => {
    if (hasAccess) {
      loadDashboardData();
    }
  }, [hasAccess]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, articlesData, rssData] = await Promise.all([
        contentService.getAnalytics(),
        contentService.getArticles({ limit: 50 }),
        contentService.getRSSSources()
      ]);

      setAnalytics(analyticsData);
      setArticles(articlesData);
      setRSSSources(rssData);
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSaveArticle = async () => {
    try {
      const articleData = {
        ...articleForm,
        tags: articleForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        slug: articleForm.slug || articleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published_at: new Date().toISOString()
      };

      if (isEditing && selectedArticle) {
        await contentService.updateArticle(selectedArticle.id, articleData);
        toast({ title: "Article updated successfully" });
      } else {
        await contentService.createArticle(articleData);
        toast({ title: "Article created successfully" });
      }

      setArticleForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'general',
        tags: '',
        seo_title: '',
        seo_description: '',
        is_published: true,
        is_featured: false
      });
      setSelectedArticle(null);
      setIsEditing(false);
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error saving article",
        description: "Failed to save the article",
        variant: "destructive"
      });
    }
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content,
      category: article.category,
      tags: article.tags?.join(', ') || '',
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || '',
      is_published: article.is_published,
      is_featured: article.is_featured
    });
    setIsEditing(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await contentService.deleteArticle(id);
        toast({ title: "Article deleted successfully" });
        loadDashboardData();
      } catch (error) {
        toast({
          title: "Error deleting article",
          description: "Failed to delete the article",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveRSSSource = async () => {
    try {
      await contentService.addRSSSource(rssForm);
      toast({ title: "RSS source added successfully" });
      setRSSForm({
        name: '',
        url: '',
        category: 'general',
        is_active: true
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error adding RSS source",
        description: "Failed to add the RSS source",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRSSSource = async (id: string) => {
    if (confirm('Are you sure you want to delete this RSS source?')) {
      try {
        await contentService.deleteRSSSource(id);
        toast({ title: "RSS source deleted successfully" });
        loadDashboardData();
      } catch (error) {
        toast({
          title: "Error deleting RSS source",
          description: "Failed to delete the RSS source",
          variant: "destructive"
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to continue</CardDescription>
          </CardHeader>
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
            <CardDescription>You don't have permission to access the admin dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ImperialPedia</title>
        <meta name="description" content="Admin dashboard for managing articles, RSS sources, and analytics" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your content and monitor analytics</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="rss">RSS Sources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalArticles || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Articles</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.todayArticles || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RSS Sources</CardTitle>
                  <Rss className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rssSources.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Top Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topArticles?.map((article: any) => (
                    <div key={article.slug} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{article.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{article.view_count} views</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/news/${article.slug}`} target="_blank">View</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Articles Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Article' : 'Create New Article'}</DialogTitle>
                    <DialogDescription>
                      {isEditing ? 'Update the article details' : 'Add a new article to your site'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Article title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={articleForm.slug}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="article-slug (auto-generated if empty)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={articleForm.excerpt}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={articleForm.content}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Article content (HTML supported)"
                        rows={8}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={articleForm.category} onValueChange={(value) => setArticleForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="crypto">Crypto</SelectItem>
                            <SelectItem value="investing">Investing</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={articleForm.tags}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="bitcoin, trading, analysis"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="seo_title">SEO Title</Label>
                      <Input
                        id="seo_title"
                        value={articleForm.seo_title}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, seo_title: e.target.value }))}
                        placeholder="SEO-optimized title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo_description">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        value={articleForm.seo_description}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, seo_description: e.target.value }))}
                        placeholder="SEO meta description"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_published"
                          checked={articleForm.is_published}
                          onCheckedChange={(checked) => setArticleForm(prev => ({ ...prev, is_published: checked }))}
                        />
                        <Label htmlFor="is_published">Published</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_featured"
                          checked={articleForm.is_featured}
                          onCheckedChange={(checked) => setArticleForm(prev => ({ ...prev, is_featured: checked }))}
                        />
                        <Label htmlFor="is_featured">Featured</Label>
                      </div>
                    </div>
                    <Button onClick={handleSaveArticle} className="w-full">
                      {isEditing ? 'Update Article' : 'Create Article'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {articles.map((article) => (
                    <div key={article.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{article.title}</h3>
                          <Badge variant={article.is_published ? "default" : "secondary"}>
                            {article.is_published ? "Published" : "Draft"}
                          </Badge>
                          {article.is_featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>{article.view_count} views</span>
                          <span>{new Date(article.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/news/${article.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteArticle(article.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rss" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">RSS Sources</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add RSS Source
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add RSS Source</DialogTitle>
                    <DialogDescription>Add a new RSS feed to automatically fetch articles</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rss_name">Name</Label>
                      <Input
                        id="rss_name"
                        value={rssForm.name}
                        onChange={(e) => setRSSForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Source name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rss_url">RSS URL</Label>
                      <Input
                        id="rss_url"
                        value={rssForm.url}
                        onChange={(e) => setRSSForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/feed.xml"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rss_category">Category</Label>
                      <Select value={rssForm.category} onValueChange={(value) => setRSSForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="investing">Investing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rss_active"
                        checked={rssForm.is_active}
                        onCheckedChange={(checked) => setRSSForm(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="rss_active">Active</Label>
                    </div>
                    <Button onClick={handleSaveRSSSource} className="w-full">
                      Add RSS Source
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {rssSources.map((source) => (
                    <div key={source.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{source.name}</h3>
                          <Badge variant={source.is_active ? "default" : "secondary"}>
                            {source.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{source.category}</span>
                          <span className="truncate max-w-xs">{source.url}</span>
                          {source.last_fetched_at && (
                            <span>Last fetched: {new Date(source.last_fetched_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRSSSource(source.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Content Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Advanced content management settings will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;