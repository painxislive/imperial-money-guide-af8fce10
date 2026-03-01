import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { rbacService } from '@/services/enterpriseService';
import type { Role, Permission, RolePermission } from '@/types/enterprise';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EnterpriseRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rolesData, permsData, rpData] = await Promise.all([
        rbacService.getRoles(),
        rbacService.getPermissions(),
        rbacService.getRolePermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
      setRolePermissions(rpData);
      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0].id);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error loading roles data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const permissionsByModule = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  const roleHasPermission = (roleId: string, permissionId: string) => {
    return rolePermissions.some(rp => rp.role_id === roleId && rp.permission_id === permissionId);
  };

  async function togglePermission(roleId: string, permissionId: string) {
    setSaving(true);
    try {
      if (roleHasPermission(roleId, permissionId)) {
        await rbacService.removePermissionFromRole(roleId, permissionId);
        setRolePermissions(prev => prev.filter(rp => !(rp.role_id === roleId && rp.permission_id === permissionId)));
      } else {
        await rbacService.assignPermissionToRole(roleId, permissionId);
        setRolePermissions(prev => [...prev, { id: 'temp', role_id: roleId, permission_id: permissionId, created_at: '' }]);
      }
      toast({ title: 'Permission updated' });
    } catch (err) {
      toast({ title: 'Error updating permission', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <EnterpriseLayout title="Roles & Permissions">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EnterpriseLayout>
    );
  }

  return (
    <EnterpriseLayout title="Roles & Permissions" description="Configure granular access control for every module.">
      <Tabs value={selectedRole || ''} onValueChange={setSelectedRole}>
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          {roles.map((role) => (
            <TabsTrigger key={role.id} value={role.id} className="gap-2">
              <Shield className="h-3 w-3" />
              {role.display_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role.id} value={role.id}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{role.display_name}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
              {role.is_system && (
                <Badge variant="secondary" className="mt-1">System Role</Badge>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <Card key={module}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium capitalize">{module}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {perms.map((perm) => {
                      const checked = roleHasPermission(role.id, perm.id);
                      return (
                        <div key={perm.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`${role.id}-${perm.id}`}
                            checked={checked}
                            onCheckedChange={() => togglePermission(role.id, perm.id)}
                            disabled={saving || role.name === 'super_admin'}
                          />
                          <label
                            htmlFor={`${role.id}-${perm.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {perm.label}
                            <span className="ml-2 text-xs text-muted-foreground">({perm.key})</span>
                          </label>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </EnterpriseLayout>
  );
}
