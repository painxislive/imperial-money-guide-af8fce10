import { supabase } from '@/integrations/supabase/client';
import type { Role, Permission, RolePermission, AuditLog, UserRole, Article, ArticleVersion, WorkflowLog, ContentStatus } from '@/types/enterprise';

// Helper for untyped tables
const db = (table: string): any => (supabase as any).from(table);

// ============================================================
// RBAC Service
// ============================================================

export const rbacService = {
  // Roles
  async getRoles(): Promise<Role[]> {
    const { data, error } = await db('roles').select('*').order('created_at');
    if (error) throw error;
    return data || [];
  },

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    const { data, error } = await db('permissions').select('*').order('module, key');
    if (error) throw error;
    return data || [];
  },

  // Role-Permissions mapping
  async getRolePermissions(roleId?: string): Promise<RolePermission[]> {
    let query = db('role_permissions').select('*, roles(*), permissions(*)');
    if (roleId) query = query.eq('role_id', roleId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    const { error } = await db('role_permissions').insert({ role_id: roleId, permission_id: permissionId });
    if (error) throw error;
  },

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const { error } = await db('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);
    if (error) throw error;
  },

  // User Roles
  async getUserRoles(): Promise<UserRole[]> {
    const { data, error } = await db('user_roles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async assignRole(userId: string, role: string, assignedBy?: string): Promise<void> {
    const { error } = await db('user_roles').upsert({
      user_id: userId,
      role,
      assigned_by: assignedBy,
    }, { onConflict: 'user_id,role' });
    if (error) throw error;
  },

  async removeUserRole(userId: string, role: string): Promise<void> {
    const { error } = await db('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    if (error) throw error;
  },

  // Check permission for current user
  async checkPermission(permissionKey: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await db('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    if (error || !data?.length) return false;
    
    // Super admins have all permissions
    if (data.some((r: any) => r.role === 'super_admin')) return true;
    
    // Check via role_permissions
    for (const userRole of data) {
      const { data: roleData } = await db('roles').select('id').eq('name', userRole.role).single();
      if (!roleData) continue;
      
      const { data: permData } = await db('role_permissions')
        .select('permissions(key)')
        .eq('role_id', roleData.id);
      
      if (permData?.some((rp: any) => rp.permissions?.key === permissionKey)) return true;
    }
    
    return false;
  },
};

// ============================================================
// Audit Service
// ============================================================

export const auditService = {
  async log(action: string, targetType?: string, targetId?: string, metadata?: Record<string, any>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await db('admin_audit_logs').insert({
      user_id: user?.id,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata: metadata || {},
    });
    if (error) console.error('Audit log error:', error);
  },

  async getLogs(limit = 50, offset = 0): Promise<{ data: AuditLog[]; count: number }> {
    const { data, error, count } = await db('admin_audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async getLogsByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    const { data, error } = await db('admin_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },
};

// ============================================================
// CMS Workflow Service
// ============================================================

export const workflowService = {
  async getArticles(status?: ContentStatus): Promise<Article[]> {
    let query = db('articles').select('*, authors(*), categories(*)').order('updated_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getArticle(id: string): Promise<Article | null> {
    const { data, error } = await db('articles').select('*, authors(*), categories(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async transitionStatus(articleId: string, fromStatus: ContentStatus | null, toStatus: ContentStatus, note?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    // Update article status
    const updateData: any = { status: toStatus, updated_by: user?.id };
    if (toStatus === 'published') updateData.published_at = new Date().toISOString();
    
    const { error: updateError } = await db('articles').update(updateData).eq('id', articleId);
    if (updateError) throw updateError;

    // Log transition
    const { error: logError } = await db('content_workflow_logs').insert({
      article_id: articleId,
      from_status: fromStatus,
      to_status: toStatus,
      changed_by: user?.id,
      note,
    });
    if (logError) console.error('Workflow log error:', logError);

    // Audit log
    await auditService.log(`article.status.${toStatus}`, 'article', articleId, { from: fromStatus, to: toStatus, note });
  },

  async getVersions(articleId: string): Promise<ArticleVersion[]> {
    const { data, error } = await db('article_versions')
      .select('*')
      .eq('article_id', articleId)
      .order('version_number', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createVersion(articleId: string, title: string, content: string, excerpt: string | null, status: ContentStatus, changeSummary?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get next version number
    const { data: versions } = await db('article_versions')
      .select('version_number')
      .eq('article_id', articleId)
      .order('version_number', { ascending: false })
      .limit(1);
    
    const nextVersion = (versions?.[0]?.version_number || 0) + 1;

    const { error } = await db('article_versions').insert({
      article_id: articleId,
      version_number: nextVersion,
      title,
      content,
      excerpt,
      status,
      editor_id: user?.id,
      editor_name: user?.email,
      change_summary: changeSummary,
    });
    if (error) throw error;
  },

  async getWorkflowLogs(articleId?: string, limit = 50): Promise<WorkflowLog[]> {
    let query = db('content_workflow_logs').select('*').order('created_at', { ascending: false }).limit(limit);
    if (articleId) query = query.eq('article_id', articleId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};
