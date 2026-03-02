import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { seoService, SEOMetrics, SEOArticleRow } from '@/services/seoService';
import { supabase } from '@/integrations/supabase/client';
import {
  FileText, AlertTriangle, CheckCircle, Image, Link2, Type,
  BarChart3, RefreshCw, Search, Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function EnterpriseSEO() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [articles, setArticles] = useState<SEOArticleRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { loadArticles(); }, [filterStatus, filterCategory, filterAuthor]);

  const loadAll = async () => {
    setLoading(true);
    const [m, cats, auths] = await Promise.all([
      seoService.getMetrics(),
      seoService.getCategories(),
      seoService.getAuthors(),
    ]);
    setMetrics(m);
    setCategories(cats);
    setAuthors(auths);
    await loadArticles();
    setLoading(false);
  };

  const loadArticles = async () => {
    const data = await seoService.getArticlesForSEO({
      status: filterStatus !== 'all' ? filterStatus : undefined,
      categorySlug: filterCategory !== 'all' ? filterCategory : undefined,
      authorId: filterAuthor !== 'all' ? filterAuthor : undefined,
    });
    setArticles(data);
  };

  const handleRegenerateSitemap = async () => {
    setRegenerating(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await supabase.functions.invoke('generate-sitemap');
      if (res.error) throw res.error;
      toast({ title: 'Sitemap regenerated', description: 'The sitemap has been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to regenerate sitemap.', variant: 'destructive' });
    } finally {
      setRegenerating(false);
    }
  };

  const getSEOStatus = (row: SEOArticleRow) => {
    const issues: string[] = [];
    if (!row.meta_title && !row.seo_title) issues.push('No meta title');
    if (!row.meta_description && !row.seo_description) issues.push('No meta description');
    if (!row.featured_image) issues.push('No image');
    if (!row.excerpt) issues.push('No excerpt');
    if ((row.word_count || 0) < 1000) issues.push('< 1000 words');
    if ((row.internal_link_count || 0) < 3) issues.push('< 3 links');
    return issues;
  };

  const MetricCard = ({ label, value, icon: Icon, variant = 'default' }: {
    label: string; value: number | string; icon: any; variant?: 'default' | 'warning' | 'success'
  }) => (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${variant === 'warning' ? 'text-destructive' : variant === 'success' ? 'text-accent' : 'text-foreground'}`}>
              {value}
            </p>
          </div>
          <Icon className={`h-8 w-8 ${variant === 'warning' ? 'text-destructive/30' : variant === 'success' ? 'text-accent/30' : 'text-muted-foreground/30'}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <EnterpriseLayout title="SEO Control Panel" description="Content health, meta field auditing, and sitemap management.">
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <MetricCard label="Total Articles" value={metrics?.totalArticles || 0} icon={FileText} />
            <MetricCard label="Published" value={metrics?.publishedCount || 0} icon={CheckCircle} variant="success" />
            <MetricCard label="Drafts" value={metrics?.draftCount || 0} icon={FileText} />
            <MetricCard label="In Review" value={metrics?.reviewCount || 0} icon={Search} />
            <MetricCard label="Missing Meta Title" value={metrics?.missingMetaTitle || 0} icon={Type} variant={metrics?.missingMetaTitle ? 'warning' : 'default'} />
            <MetricCard label="Missing Meta Desc" value={metrics?.missingMetaDesc || 0} icon={Type} variant={metrics?.missingMetaDesc ? 'warning' : 'default'} />
            <MetricCard label="No Featured Image" value={metrics?.missingFeaturedImage || 0} icon={Image} variant={metrics?.missingFeaturedImage ? 'warning' : 'default'} />
            <MetricCard label="Below 1000 Words" value={metrics?.belowWordCount || 0} icon={AlertTriangle} variant={metrics?.belowWordCount ? 'warning' : 'default'} />
            <MetricCard label="Missing Internal Links" value={metrics?.missingInternalLinks || 0} icon={Link2} variant={metrics?.missingInternalLinks ? 'warning' : 'default'} />
            <MetricCard label="Avg Word Count" value={metrics?.averageWordCount || 0} icon={BarChart3} />
            <MetricCard label="SEO Health Score" value={`${metrics?.linkingHealthScore || 0}%`} icon={Globe} variant={metrics?.linkingHealthScore && metrics.linkingHealthScore >= 80 ? 'success' : 'warning'} />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Article SEO Audit</h2>
            <Button variant="outline" size="sm" onClick={handleRegenerateSitemap} disabled={regenerating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate Sitemap
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="seo_review">SEO Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterAuthor} onValueChange={setFilterAuthor}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Author" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Articles Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Words</TableHead>
                    <TableHead className="text-right">Links</TableHead>
                    <TableHead>SEO Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No articles found. Create articles in the CMS to start auditing.
                      </TableCell>
                    </TableRow>
                  ) : articles.map(row => {
                    const issues = getSEOStatus(row);
                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{row.title}</p>
                            <p className="text-xs text-muted-foreground">{row.category?.name || 'Uncategorized'} · {row.author?.name || 'No author'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          <span className={(row.word_count || 0) < 1000 ? 'text-destructive' : ''}>
                            {row.word_count || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          <span className={(row.internal_link_count || 0) < 3 ? 'text-destructive' : ''}>
                            {row.internal_link_count || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          {issues.length === 0 ? (
                            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                              <CheckCircle className="h-3 w-3 mr-1" /> OK
                            </Badge>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {issues.map(issue => (
                                <Badge key={issue} variant="outline" className="text-xs text-destructive border-destructive/30">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </EnterpriseLayout>
  );
}
