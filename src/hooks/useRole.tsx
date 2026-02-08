import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase-helpers';
import { useAuth } from './useAuth';
import { AppRole } from '@/types/database';

interface UseRoleReturn {
  role: AppRole | null;
  isAdmin: boolean;
  isEditor: boolean;
  isUser: boolean;
  loading: boolean;
  isPremium: boolean;
}

export function useRole(): UseRoleReturn {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        // Fetch user's roles
        const { data: roleData, error: roleError } = await db('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setRole('user');
        } else if (roleData && roleData.length > 0) {
          // Sort by priority: admin > editor > user
          const roles = roleData.map((r: any) => r.role as AppRole);
          if (roles.includes('admin')) {
            setRole('admin');
          } else if (roles.includes('editor')) {
            setRole('editor');
          } else {
            setRole('user');
          }
        } else {
          setRole('user');
        }

        // Fetch membership type
        const { data: profileData, error: profileError } = await db('profiles')
          .select('membership_type')
          .eq('user_id', user.id)
          .single();

        if (!profileError && profileData) {
          setIsPremium(profileData.membership_type === 'premium');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  return {
    role,
    isAdmin: role === 'admin',
    isEditor: role === 'editor' || role === 'admin',
    isUser: !!role,
    loading: loading || authLoading,
    isPremium,
  };
}

export default useRole;
