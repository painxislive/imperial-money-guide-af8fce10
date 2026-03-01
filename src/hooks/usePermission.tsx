import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { rbacService } from '@/services/enterpriseService';

const db = (table: string): any => (supabase as any).from(table);

export function usePermission(permissionKey: string) {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    rbacService.checkPermission(permissionKey).then((result) => {
      setHasPermission(result);
      setLoading(false);
    });
  }, [user, permissionKey]);

  return { hasPermission, loading };
}

export function useEnterpriseRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    db('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .then(({ data, error }: any) => {
        if (!error && data) {
          setRoles(data.map((r: any) => r.role));
        }
        setLoading(false);
      });
  }, [user]);

  const isSuperAdmin = roles.includes('super_admin');
  const isAdmin = isSuperAdmin || roles.includes('admin');
  const isEditor = isAdmin || roles.includes('editor');
  const isAuthor = isEditor || roles.includes('author');

  return { roles, isSuperAdmin, isAdmin, isEditor, isAuthor, loading };
}
