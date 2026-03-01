import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { workflowService } from '@/services/enterpriseService';
import { STATUS_LABELS, STATUS_COLORS, WORKFLOW_TRANSITIONS } from '@/types/enterprise';
import type { Article, ContentStatus } from '@/types/enterprise';
import { Loader2, ArrowRight, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export default function EnterpriseWorkflow() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, [statusFilter]);

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await workflowService.getArticles(statusFilter === 'all' ? undefined : statusFilter as ContentStatus);
      setArticles(data);
    } catch (err) {
      toast({ title: 'Error loading articles', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleTransition(article: Article, newStatus: ContentStatus) {
    setTransitioning(article.id);
    try {
      await workflowService.transitionStatus(article.id, article.status, newStatus);
      toast({ title: `Article moved to ${STATUS_LABELS[newStatus]}` });
      loadArticles();
    } catch (err) {
      toast({ title: 'Transition failed', variant: 'destructive' });
    } finally {
      setTransitioning(null);
    }
  }

  // Pipeline stats
  const stats = Object.entries(STATUS_LABELS).map(([status, label]) => ({
    status: status as ContentStatus,
    label,
    count: articles.filter(a => a.status === status).length,
  }));

  return (
    <EnterpriseLayout title="Content Workflow" description="Multi-stage editorial pipeline with versioning and audit trail.">
      {/* Pipeline overview */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {stats.map((s) => (
          <Card key={s.status} className="text-center cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setStatusFilter(s.status)}>
            <CardContent className="p-3">
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-xs text-muted-foreground truncate">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{articles.length} articles</span>
      </div>

      {/* Articles table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p>No articles found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => {
                const transitions = WORKFLOW_TRANSITIONS[article.status] || [];
                return (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">{article.title}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[article.status]} variant="secondary">
                        {STATUS_LABELS[article.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.author?.name || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.category?.name || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(article.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {transitions.map((nextStatus) => (
                          <Button
                            key={nextStatus}
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            disabled={transitioning === article.id}
                            onClick={() => handleTransition(article, nextStatus)}
                          >
                            {transitioning === article.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <ArrowRight className="h-3 w-3 mr-1" />
                                {STATUS_LABELS[nextStatus]}
                              </>
                            )}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </EnterpriseLayout>
  );
}
