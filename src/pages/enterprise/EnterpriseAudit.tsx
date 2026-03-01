import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { auditService } from '@/services/enterpriseService';
import type { AuditLog } from '@/types/enterprise';
import { Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZE = 25;

export default function EnterpriseAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, [page]);

  async function loadLogs() {
    setLoading(true);
    try {
      const { data, count } = await auditService.getLogs(PAGE_SIZE, page * PAGE_SIZE);
      setLogs(data);
      setTotal(count);
    } catch (err) {
      toast({ title: 'Error loading audit logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <EnterpriseLayout title="Audit Logs" description="Every admin action tracked for compliance and security.">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{total} total entries</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {page + 1} of {totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Eye className="h-12 w-12 mb-4" />
            <p>No audit logs yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-mono">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.target_type && (
                      <span className="text-muted-foreground">
                        {log.target_type}
                        {log.target_id && <span className="ml-1 font-mono text-xs">({log.target_id.slice(0, 8)}...)</span>}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {log.user_id ? `${log.user_id.slice(0, 8)}...` : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {Object.keys(log.metadata || {}).length > 0 
                      ? JSON.stringify(log.metadata).slice(0, 80)
                      : '—'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </EnterpriseLayout>
  );
}
